/**
 * Builds the jsonConfig panel schema for a single output service.
 *
 * The common fields (target adapter, provider activation, filters and message
 * templates) are generated from {@link SERVICE_CAPS} so they only exist once
 * instead of being copy/pasted into 9 admin tabs. Only the genuinely service
 * specific "extras" are spelled out per service.
 *
 * All fields keep their original flat attribute names (`telegram_Adapter`, …)
 * and their original `selectSendTo` commands, so every existing `onMessage`
 * backend handler keeps working unchanged.
 */
import { SERVICE_CAPS, type ServiceType, type MessageKey } from '../../src/lib/notificationServicesModel';

// keep `any` for the dynamically assembled schema - the json-config runtime
// validates it, and typing every union member here would add no safety.
type Item = Record<string, any>;
type Items = Record<string, Item>;

/** standard field width: three fields per row on desktop */
const W = { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 } as const;

/**
 * Section header of a service panel.
 *
 * @param text i18n key of the header
 * @param hidden optional hidden expression
 */
function section(text: string, hidden?: string): Item {
    return {
        type: 'header',
        text,
        size: 4,
        newLine: true,
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
        ...(hidden ? { hidden } : {}),
    };
}

const PARSE_MODE_OPTIONS = [
    { label: 'none', value: 'none' },
    { label: 'Html', value: 'HTML' },
    { label: 'Markdown V2', value: 'MarkdownV2 ' },
];

const NSPANEL_TARGET_OPTIONS = [
    { label: 'nspanel_Target_popup', value: 'popup' },
    { label: 'nspanel_Target_headline', value: 'headline' },
    { label: 'nspanel_Target_both', value: 'both' },
];

const CONTENT_TYPE_OPTIONS = [
    { label: 'Text', value: 'text/plain' },
    { label: 'Markdown', value: 'text/markdown' },
];

const GOTIFY_PRIORITY_OPTIONS = [
    { label: '0 - low', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10 - high', value: '10' },
];

const PUSHOVER_SOUND_OPTIONS = [
    { label: 'default', value: 'pushover' },
    { label: 'bike', value: 'bike' },
    { label: 'bugle', value: 'bugle' },
    { label: 'cashregister', value: 'cashregister' },
    { label: 'classical', value: 'classical' },
    { label: 'cosmic', value: 'cosmic' },
    { label: 'falling', value: 'falling' },
    { label: 'gamelan', value: 'gamelan' },
    { label: 'incoming', value: 'incoming' },
    { label: 'intermission', value: 'intermission' },
    { label: 'magic', value: 'magic' },
    { label: 'mechanical', value: 'mechanical' },
    { label: 'pianobar', value: 'pianobar' },
    { label: 'siren', value: 'siren' },
    { label: 'spacealarm', value: 'spacealarm' },
    { label: 'tugboat', value: 'tugboat' },
    { label: 'alien', value: 'alien' },
    { label: 'climb', value: 'climb' },
    { label: 'persistent', value: 'persistent' },
    { label: 'echo', value: 'echo' },
    { label: 'updown', value: 'updown' },
    { label: 'vibrate', value: 'vibrate' },
    { label: 'none', value: 'none' },
];

/** The label shown for each message-template selector. */
/** short field labels */
const MESSAGE_LABEL: Record<MessageKey, string> = {
    new: 'svc_msg_new',
    remove: 'svc_msg_remove',
    removeAll: 'svc_msg_removeAll',
    all: 'svc_msg_all',
    manualAll: 'svc_msg_manualAll',
    removeManualAll: 'svc_msg_removeManualAll',
    title: 'svc_msg_title',
    header: 'svc_msg_header',
    footer: 'svc_msg_footer',
};

/** the former (long) labels, now shown as tooltip */
const MESSAGE_TOOLTIP: Record<MessageKey, string> = {
    new: 'MessageNew',
    remove: 'MessageRemove',
    removeAll: 'MessageAllRemove',
    all: 'MessageAll',
    manualAll: 'manualAll',
    removeManualAll: 'removeManualAll',
    title: 'MessageTitle',
    header: 'email_Header',
    footer: 'email_Footer',
};

const MESSAGE_FLAT_SUFFIX: Record<MessageKey, string> = {
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

/**
 * Returns the `disabled` expression that mirrors "no target adapter selected".
 *
 * @param service the service type
 */
function disabledExpr(service: ServiceType): string | undefined {
    const caps = SERVICE_CAPS[service];
    if (caps.adapter === 'single') {
        if (caps.multiInstance) {
            // multi select (#319): legacy string 'none' or an empty array both mean "nothing selected"
            return `!data.${service}_Adapter || data.${service}_Adapter == 'none' || data.${service}_Adapter.length == 0`;
        }
        return `data.${service}_Adapter == 'none'`;
    }
    if (caps.adapter === 'array') {
        return `!data.sayit_Adapter_Array[0] || data.sayit_Adapter_Array[0].sayit_Adapter == 'none'`;
    }
    return undefined;
}

/**
 * Builds a message-template selector (`selectSendTo` with command `Messages`).
 *
 * @param service the service type
 * @param key the canonical message key
 * @param dis the optional disabled expression
 * @param newLine whether the field starts a new row
 */
function messageField(service: ServiceType, key: MessageKey, dis: string | undefined, newLine: boolean): Item {
    const attr = `${service}_${MESSAGE_FLAT_SUFFIX[key]}`;
    const item: Item = {
        type: 'selectSendTo',
        command: 'Messages',
        jsonData: `{ "service": "${service}" }`,
        validator: `return (data.${attr} == 'none' || (!!data.templateTable && data.templateTable.findIndex(a => a.templateKey == data.${attr}) != -1))`,
        manual: false,
        multiple: false,
        ...W,
        label: MESSAGE_LABEL[key],
        tooltip: MESSAGE_TOOLTIP[key],
        newLine,
    };
    if (key === 'removeManualAll') {
        item.default = 'RemoveAllMessage';
    }
    // history disables its message fields when "all in one" is active
    if (service === 'history') {
        item.disabled = 'data.history_allinOne';
    } else if (dis) {
        item.disabled = dis;
    }
    return item;
}

/**
 * Builds a `selectSendTo` warning filter field.
 *
 * @param service the service type
 * @param command `filterType` or `filterLevel`
 * @param manual whether this is the manual variant
 * @param dis the optional disabled expression
 * @param newLine whether the field starts a new row
 */
function filterField(
    service: ServiceType,
    command: 'filterType' | 'filterLevel',
    manual: boolean,
    dis: string | undefined,
    newLine: boolean,
): Item {
    const multiple = command === 'filterType';
    const tooltip = `${manual ? 'Manual' : ''}${command === 'filterType' ? 'TypeFilter' : 'LevelFilter'}`;
    const label = command === 'filterType' ? 'svc_typefilter' : 'svc_levelfilter';
    const item: Item = {
        type: 'selectSendTo',
        command,
        jsonData: `{ "service": "${service}" }`,
        manual: false,
        multiple,
        ...W,
        label,
        tooltip,
        newLine,
    };
    if (dis) {
        item.disabled = dis;
    }
    return item;
}

/**
 * Returns the service specific "extra" fields, split into a primary group
 * (always visible, rendered right after the provider checkboxes) and an
 * extras group (rendered under the "notification_extras" header).
 *
 * @param service the service type
 * @param dis the optional disabled expression
 */
function extraFields(service: ServiceType, dis: string | undefined): { primary: Items; extras: Items } {
    const primary: Items = {};
    const extras: Items = {};
    const d = dis ? { disabled: dis } : {};
    switch (service) {
        case 'telegram':
            extras[`${service}_UserId`] = { type: 'text', default: '', ...W, label: 'telegram_UserId', ...d };
            extras[`${service}_withNoSound`] = {
                type: 'checkbox',
                default: true,
                ...W,
                label: 'telegram_withNoSound',
                ...d,
            };
            extras[`${service}_parse_mode`] = {
                type: 'select',
                options: PARSE_MODE_OPTIONS,
                default: 'none',
                ...W,
                label: 'telegram_parse_mode',
                hidden: 'data.imExpert != true',
                ...d,
            };
            extras[`${service}_ChatID`] = {
                type: 'text',
                default: '',
                ...W,
                label: 'telegram_ChatId',
                hidden: 'data.imExpert != true',
                ...d,
            };
            break;
        case 'whatsapp':
            extras[`${service}_Phonenumber`] = { type: 'text', ...W, label: 'whatsapp_Phonenumber', ...d };
            break;
        case 'pushover':
            extras[`${service}_Sound`] = {
                type: 'select',
                options: PUSHOVER_SOUND_OPTIONS,
                default: 'none',
                ...W,
                label: 'svc_sound',
                tooltip: 'pushover_Sound',
                ...d,
            };
            extras[`${service}_Priority`] = {
                type: 'checkbox',
                default: false,
                ...W,
                label: 'svc_pushover_priority',
                tooltip: 'pushover_Priority',
                ...d,
            };
            extras[`${service}_Device`] = { type: 'text', default: '', ...W, label: 'pushover_Device', ...d };
            break;
        case 'gotify':
            extras[`${service}_Priority`] = {
                type: 'select',
                options: GOTIFY_PRIORITY_OPTIONS,
                default: '0',
                ...W,
                label: 'svc_priority',
                tooltip: 'gotify_Priority',
                ...d,
            };
            extras[`${service}_contentType`] = {
                type: 'select',
                options: CONTENT_TYPE_OPTIONS,
                default: 'text/plain',
                ...W,
                label: 'svc_contenttype',
                tooltip: 'gotify_contentType',
                ...d,
            };
            break;
        case 'nspanel':
            primary[`${service}_Target`] = {
                type: 'select',
                options: NSPANEL_TARGET_OPTIONS,
                default: 'popup',
                ...W,
                label: 'nspanel_Target',
                help: 'nspanel_Target_help',
                newLine: true,
                ...d,
            };
            primary[`${service}_Priority`] = {
                type: 'number',
                min: 1,
                max: 100,
                default: 50,
                ...W,
                label: 'nspanel_Priority',
                help: 'nspanel_Priority_help',
                ...d,
            };
            // alwaysOn is a popup-only option of nspanel-lovelace-ui
            extras[`${service}_alwaysOn`] = {
                type: 'checkbox',
                default: true,
                ...W,
                label: 'nspanel_alwaysOn',
                hidden: `data.${service}_Target == 'headline'`,
                ...d,
            };
            break;
        case 'alexa2':
            primary[`${service}_device_ids`] = {
                type: 'selectSendTo',
                command: 'alexa2_device_ids',
                jsonData: '{ "service": "alexa2","adapter": "${data.alexa2_Adapter}"}',
                manual: false,
                multiple: true,
                ...W,
                label: 'alexa2_device_ids',
                newLine: true,
                ...d,
            };
            primary[`${service}_volumen`] = {
                type: 'number',
                min: 0,
                max: 100,
                ...W,
                label: 'svc_volume',
                ...d,
            };
            extras[`${service}_Audio`] = {
                type: 'text',
                default: '',
                ...W,
                label: 'svc_audio',
                tooltip: 'alexa2_Audio',
                hidden: 'data.imExpert != true',
            };
            extras[`${service}_Audio_url`] = {
                type: 'staticLink',
                button: true,
                href: 'https://developer.amazon.com/en-US/docs/alexa/custom-skills/ask-soundlibrary.html',
                ...W,
                label: 'alexa2_Audio_url',
                hidden: 'data.imExpert != true',
            };
            extras[`${service}_sounds_enabled`] = {
                type: 'checkbox',
                default: false,
                ...W,
                label: 'alexa2_sounds_enabled',
                hidden: 'data.imExpert != true',
                ...d,
            };
            extras[`${service}_sounds`] = {
                type: 'accordion',
                newLine: true,
                xs: 12,
                sm: 12,
                md: 12,
                lg: 12,
                xl: 12,
                noDelete: true,
                titleAttr: 'warntype',
                label: 'alexa2_sounds',
                hidden: 'data.imExpert != true',
                items: [
                    { attr: 'warntypenumber', type: 'number', hidden: 'true', xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
                    { attr: 'warntype', type: 'text', readOnly: true, xs: 12, sm: 2, md: 2, lg: 3, xl: 3 },
                    { attr: 'sound', type: 'text', xs: 12, sm: 9, md: 8, lg: 8, xl: 8, label: 'alexa2_sound_item' },
                ],
            };
            break;
        case 'sayit':
            primary[`${service}_volumen`] = {
                type: 'number',
                min: 0,
                max: 100,
                default: 20,
                ...W,
                label: 'svc_volume',
                ...d,
            };
            break;
        case 'email':
            extras[`${service}_line_break`] = {
                type: 'text',
                ...W,
                label: 'svc_linebreak',
                tooltip: 'email_line_break',
            };
            extras[`${service}_Recipients`] = {
                type: 'text',
                default: '',
                ...W,
                label: 'email_Recipients',
                tooltip: 'email_Recipients_hint',
                ...d,
            };
            break;
        case 'json':
            primary[`${service}_parse`] = {
                type: 'checkbox',
                ...W,
                label: 'svc_json_parse',
                tooltip: 'json_parse',
                newLine: true,
            };
            break;
        case 'history':
            primary[`${service}_allinOne`] = {
                type: 'checkbox',
                ...W,
                label: 'svc_history_allinone',
                tooltip: 'history_allinOne',
                newLine: true,
            };
            break;
    }
    return { primary, extras };
}

/**
 * Builds the complete jsonConfig panel for one output service.
 *
 * @param service the service type
 */
export function buildServiceSchema(service: ServiceType): Record<string, any> {
    const caps = SERVICE_CAPS[service];
    const dis = disabledExpr(service);
    const items: Items = {};

    const { primary, extras } = extraFields(service, dis);

    // 1. target (adapter instance + primary extras) - "general" for services without adapter
    if (caps.adapter !== 'none' || Object.keys(primary).length) {
        items[`${service}_secTarget`] = section(caps.adapter === 'none' ? 'svc_section_general' : 'svc_section_target');
    }
    if (caps.adapter === 'single') {
        items[`${service}_Adapter`] = {
            type: 'selectSendTo',
            command: 'notificationService',
            jsonData: caps.multiInstance
                ? `{ "service": "${service}", "multiple": true }`
                : `{ "service": "${service}" }`,
            manual: false,
            multiple: !!caps.multiInstance,
            ...W,
            label: 'svc_adapter',
            tooltip: 'SelectNotificationService',
            newLine: true,
            ...(caps.multiInstance ? { help: 'SelectNotificationServiceMultiple' } : {}),
        };
    } else if (caps.adapter === 'array') {
        items.sayit_Adapter_Array = {
            type: 'table',
            newLine: true,
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
            default: [],
            label: 'svc_adapter',
            items: [
                {
                    attr: 'sayit_Adapter',
                    type: 'selectSendTo',
                    command: 'notificationService',
                    jsonData: '{ "service": "sayit" }',
                    manual: false,
                    multiple: false,
                    default: 'none',
                    ...W,
                    label: 'SelectNotificationService',
                    newLine: true,
                },
            ],
        };
    }

    Object.assign(items, primary);

    // 2. weather services (only the globally enabled ones are shown)
    items[`${service}_secProviders`] = section(
        'svc_section_providers',
        '!data.dwdEnabled && !data.uwzEnabled && !data.zamgEnabled',
    );
    let firstProvider = true;
    for (const [prov, flag, label] of [
        ['Dwd', 'dwdEnabled', 'DWD'],
        ['Uwz', 'uwzEnabled', 'UWZ'],
        ['Zamg', 'zamgEnabled', 'ZAMG'],
    ] as const) {
        items[`${service}_${prov}Enabled`] = {
            type: 'checkbox',
            xs: 4,
            sm: 3,
            md: 2,
            lg: 2,
            xl: 2,
            hidden: `!data.${flag}`,
            ...(dis ? { disabled: dis } : {}),
            label,
            newLine: firstProvider,
        };
        firstProvider = false;
    }

    // 3. automatic notifications: templates + filter
    const manualKeys: MessageKey[] = ['manualAll', 'removeManualAll'];
    items[`${service}_secAuto`] = section(caps.manualFilter ? 'svc_section_auto' : 'svc_section_messages');
    let first = true;
    for (const key of caps.messages.filter(k => !manualKeys.includes(k))) {
        items[`${service}_${MESSAGE_FLAT_SUFFIX[key]}`] = messageField(service, key, dis, first);
        first = false;
    }
    items[`${service}_TypeFilter`] = filterField(service, 'filterType', false, dis, true);
    items[`${service}_LevelFilter`] = filterField(service, 'filterLevel', false, dis, false);

    // 4. manually triggered notifications
    if (caps.manualFilter) {
        items[`${service}_secManual`] = section('svc_section_manual');
        first = true;
        for (const key of caps.messages.filter(k => manualKeys.includes(k))) {
            items[`${service}_${MESSAGE_FLAT_SUFFIX[key]}`] = messageField(service, key, dis, first);
            first = false;
        }
        items[`${service}_ManualTypeFilter`] = filterField(service, 'filterType', true, dis, true);
        items[`${service}_ManualLevelFilter`] = filterField(service, 'filterLevel', true, dis, false);
    }

    // 5. service specific extras
    if (Object.keys(extras).length) {
        items[`${service}_secExtras`] = section('svc_section_extras');
        Object.assign(items, extras);
    }

    return {
        type: 'panel',
        label: service,
        items,
    };
}
