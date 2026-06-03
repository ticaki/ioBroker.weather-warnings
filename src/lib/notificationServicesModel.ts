/**
 * Shared data model for the notification (output) services.
 *
 * This module is the single source of truth that is shared between the adapter
 * backend (`src/main.ts`) and the admin custom component (`src-admin/`). It must
 * therefore stay completely free of any node.js, DOM or ioBroker specific
 * imports so it can be type-checked and bundled in both worlds.
 *
 * Historically every output service (telegram, whatsapp, …) had its own admin
 * tab with ~20 flat config keys (`telegram_Adapter`, `whatsapp_Adapter`, …).
 * That made the jsonConfig a maintenance nightmare. The structured model below
 * groups those flat keys into one object per service
 * (`config.notificationServices = { telegram: {...}, … }`) while the conversion
 * helpers keep full backwards-compatibility with the old flat keys.
 */

/** All output/notification service types in the same order as the admin tabs. */
export const SERVICE_TYPES = [
    'telegram',
    'gotify',
    'nspanel',
    'pushover',
    'whatsapp',
    'json',
    'history',
    'email',
    'alexa2',
    'sayit',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

/** Canonical keys of the message-template selectors. */
export type MessageKey =
    | 'new'
    | 'remove'
    | 'removeAll'
    | 'all'
    | 'manualAll'
    | 'removeManualAll'
    | 'title'
    | 'header'
    | 'footer';

/** Maps a canonical message key to its legacy flat-key suffix. */
export const MESSAGE_SUFFIX: Record<MessageKey, string> = {
    new: 'MessageNew',
    remove: 'MessageRemove',
    removeAll: 'MessageAllRemove',
    all: 'MessageAll',
    manualAll: 'manualAll',
    removeManualAll: 'removeManualAll',
    title: 'Title',
    header: 'Header',
    footer: 'Footer',
};

/** How the target adapter is selected for a service. */
export type AdapterKind = 'single' | 'array' | 'none';

/** Static capabilities of a service - drives schema generation and conversion. */
export interface ServiceCaps {
    /** How the target adapter is configured. */
    adapter: AdapterKind;
    /** Whether the service has a separate manual filter (+ manualAll/removeManualAll). */
    manualFilter: boolean;
    /** Which message-template selectors the service offers. */
    messages: MessageKey[];
    /** Extra, service specific flat-key suffixes that are copied verbatim. */
    extras: string[];
}

const BASE_MESSAGES: MessageKey[] = ['new', 'remove', 'removeAll'];
const MANUAL_MESSAGES: MessageKey[] = ['manualAll', 'removeManualAll'];

export const SERVICE_CAPS: Record<ServiceType, ServiceCaps> = {
    telegram: {
        adapter: 'single',
        manualFilter: true,
        messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
        extras: ['UserId', 'withNoSound', 'parse_mode', 'ChatID'],
    },
    whatsapp: {
        adapter: 'single',
        manualFilter: true,
        messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
        extras: ['Phonenumber'],
    },
    pushover: {
        adapter: 'single',
        manualFilter: true,
        messages: [...BASE_MESSAGES, 'title', ...MANUAL_MESSAGES],
        extras: ['Sound', 'Priority', 'Device'],
    },
    gotify: {
        adapter: 'single',
        manualFilter: true,
        messages: [...BASE_MESSAGES, 'title', ...MANUAL_MESSAGES],
        extras: ['Priority', 'contentType'],
    },
    nspanel: {
        adapter: 'single',
        manualFilter: true,
        messages: [...BASE_MESSAGES, 'title', ...MANUAL_MESSAGES],
        extras: ['Priority', 'alwaysOn'],
    },
    alexa2: {
        adapter: 'single',
        manualFilter: true,
        messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
        extras: ['device_ids', 'volumen', 'Audio', 'sounds_enabled', 'sounds'],
    },
    sayit: {
        adapter: 'array',
        manualFilter: true,
        messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
        extras: ['volumen', 'Audio', 'sounds_enabled'],
    },
    email: {
        adapter: 'single',
        manualFilter: true,
        messages: [...BASE_MESSAGES, 'title', 'header', 'footer', ...MANUAL_MESSAGES],
        extras: ['line_break', 'Recipients'],
    },
    json: {
        adapter: 'none',
        manualFilter: false,
        messages: ['all', 'removeAll'],
        extras: ['parse'],
    },
    history: {
        adapter: 'none',
        manualFilter: false,
        messages: ['new', 'remove'],
        extras: ['allinOne'],
    },
};

/** A single filter (auto or manual). */
export interface ServiceFilter {
    type: Array<string | number>;
    level: number;
}

/** Structured configuration of a single output service. */
export interface ServiceConfigEntry {
    /** Target adapter instance (services with `adapter: 'single'`). */
    adapter?: string;
    /** Target adapter instances (services with `adapter: 'array'`, e.g. sayit). */
    adapters?: Array<{ sayit_Adapter: string }>;
    /** Per provider activation. */
    providers: { dwd: boolean; uwz: boolean; zamg: boolean };
    /** Automatic (and optional manual) warning filter. */
    filter: { auto: ServiceFilter; manual?: ServiceFilter };
    /** Selected message templates keyed by canonical message key. */
    messages: Partial<Record<MessageKey, string>>;
    /** Service specific extras, keyed by their legacy flat-key suffix. */
    extras: Record<string, unknown>;
}

/** Structured configuration object for all output services. */
export type NotificationServicesConfig = Partial<Record<ServiceType, ServiceConfigEntry>>;

/** Internal: index access helper for the flat config object. */
type FlatConfig = Record<string, any>;

/**
 * Reads one structured service entry from the legacy flat config keys.
 *
 * @param service the service type
 * @param flat the (flat) adapter config
 */
export function flatEntryToModel(service: ServiceType, flat: FlatConfig): ServiceConfigEntry {
    const caps = SERVICE_CAPS[service];
    const entry: ServiceConfigEntry = {
        providers: {
            dwd: !!flat[`${service}_DwdEnabled`],
            uwz: !!flat[`${service}_UwzEnabled`],
            zamg: !!flat[`${service}_ZamgEnabled`],
        },
        filter: {
            auto: {
                type: (flat[`${service}_TypeFilter`] as Array<string | number>) || [],
                level: (flat[`${service}_LevelFilter`] as number) ?? 0,
            },
        },
        messages: {},
        extras: {},
    };

    if (caps.adapter === 'single') {
        entry.adapter = (flat[`${service}_Adapter`] as string) ?? 'none';
    } else if (caps.adapter === 'array') {
        entry.adapters = (flat[`${service}_Adapter_Array`] as Array<{ sayit_Adapter: string }>) || [];
    }

    if (caps.manualFilter) {
        entry.filter.manual = {
            type: (flat[`${service}_ManualTypeFilter`] as Array<string | number>) || [],
            level: (flat[`${service}_ManualLevelFilter`] as number) ?? 0,
        };
    }

    for (const key of caps.messages) {
        const v = flat[`${service}_${MESSAGE_SUFFIX[key]}`];
        if (v !== undefined) {
            entry.messages[key] = v as string;
        }
    }

    for (const suffix of caps.extras) {
        const v = flat[`${service}_${suffix}`];
        if (v !== undefined) {
            entry.extras[suffix] = v;
        }
    }

    return entry;
}

/**
 * Writes one structured service entry back to its legacy flat config keys.
 *
 * @param service the service type
 * @param entry the structured entry
 */
export function modelEntryToFlat(service: ServiceType, entry: ServiceConfigEntry): FlatConfig {
    const caps = SERVICE_CAPS[service];
    const flat: FlatConfig = {};

    flat[`${service}_DwdEnabled`] = !!entry.providers?.dwd;
    flat[`${service}_UwzEnabled`] = !!entry.providers?.uwz;
    flat[`${service}_ZamgEnabled`] = !!entry.providers?.zamg;

    flat[`${service}_TypeFilter`] = entry.filter?.auto?.type ?? [];
    flat[`${service}_LevelFilter`] = entry.filter?.auto?.level ?? 0;

    if (caps.adapter === 'single') {
        flat[`${service}_Adapter`] = entry.adapter ?? 'none';
    } else if (caps.adapter === 'array') {
        flat[`${service}_Adapter_Array`] = entry.adapters ?? [];
    }

    if (caps.manualFilter) {
        flat[`${service}_ManualTypeFilter`] = entry.filter?.manual?.type ?? [];
        flat[`${service}_ManualLevelFilter`] = entry.filter?.manual?.level ?? 0;
    }

    for (const key of caps.messages) {
        const v = entry.messages?.[key];
        if (v !== undefined) {
            flat[`${service}_${MESSAGE_SUFFIX[key]}`] = v;
        }
    }

    for (const suffix of caps.extras) {
        const v = entry.extras?.[suffix];
        if (v !== undefined) {
            flat[`${service}_${suffix}`] = v;
        }
    }

    return flat;
}

/**
 * Builds the structured notificationServices object from the legacy flat config.
 *
 * @param flat the (flat) adapter config
 */
export function flatConfigToModel(flat: FlatConfig): NotificationServicesConfig {
    const model: NotificationServicesConfig = {};
    for (const service of SERVICE_TYPES) {
        model[service] = flatEntryToModel(service, flat);
    }
    return model;
}

/**
 * Projects the structured notificationServices object back to flat config keys.
 * Only service-prefixed keys are produced; the master `${service}_Enabled`
 * toggles are intentionally left untouched (they live in the basic config).
 *
 * @param model the structured notificationServices object (may be undefined)
 */
export function modelToFlatConfig(model: NotificationServicesConfig | undefined): FlatConfig {
    const flat: FlatConfig = {};
    if (!model) {
        return flat;
    }
    for (const service of SERVICE_TYPES) {
        const entry = model[service];
        if (entry) {
            Object.assign(flat, modelEntryToFlat(service, entry));
        }
    }
    return flat;
}
