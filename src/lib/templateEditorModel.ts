/**
 * Pure helpers for the admin template editor (custom component).
 *
 * Kept free of React/admin dependencies so they can be unit-tested and shared
 * between the admin component and the adapter.
 */
import {
    MESSAGE_SUFFIX,
    SERVICE_CAPS,
    SERVICE_TYPES,
    flatEntryToModel,
    type NotificationServicesConfig,
    type ServiceType,
} from './notificationServicesModel';

/** One row of the template table. */
export interface TemplateRow {
    templateKey: string;
    template: string;
}

/** A place where a template is referenced. */
export interface TemplateUsage {
    /** the push service that uses the template, or 'template' for a nested reference */
    service: ServiceType | 'template';
    /** message slot of the service, or the key of the referencing template */
    slot: string;
}

/** Token groups shown in the editor, in display order. */
export const TOKEN_GROUPS: { id: string; tokens: string[] }[] = [
    {
        id: 'warning',
        tokens: [
            'headline',
            'description',
            'instruction',
            'impact',
            'warnlevelname',
            'warnlevelnumber',
            'warnlevelcolorname',
            'warnlevelcolorhex',
            'warntypename',
            'warntypegenericname',
            'warntypegeneric',
            'status',
            'warningcount',
        ],
    },
    {
        id: 'time',
        tokens: [
            'starttime',
            'startdate',
            'startdayofweek',
            'startdayofweekshort',
            'startadverb',
            'startdaytime',
            'startday',
            'startmonth',
            'endtime',
            'enddate',
            'enddayofweek',
            'enddayofweekshort',
            'enddaytime',
            'endday',
            'endmonth',
            'countdown',
            'cdhour',
            'cdminute',
            'cdfuture',
            'starttimems',
            'endtimems',
            'zamgdayPeriod',
        ],
    },
    { id: 'location', tokens: ['locationcustom', 'location', 'provider', 'altitude', 'ceiling'] },
    { id: 'icons', tokens: ['weatheremoji', 'iconurl', 'htmlicon'] },
];

/**
 * Parses the `templateHelp` text that the adapter writes on start
 * (`Tokens:\n${key}: description\n…`) into a token → description map.
 *
 * @param help the templateHelp text
 */
export function parseTemplateHelp(help: unknown): Record<string, string> {
    const result: Record<string, string> = {};
    if (typeof help !== 'string') {
        return result;
    }
    for (const line of help.split('\n')) {
        const m = /^\$\{([^}]+)\}:\s?(.*)$/.exec(line.trim());
        if (m) {
            result[m[1]] = m[2];
        }
    }
    return result;
}

/**
 * Sorts the known tokens into {@link TOKEN_GROUPS}; unknown ones end up in `other`.
 *
 * @param tokens all available tokens
 */
export function groupTokens(tokens: string[]): { id: string; tokens: string[] }[] {
    const known = new Set(TOKEN_GROUPS.flatMap(g => g.tokens));
    const available = new Set(tokens);
    const groups = TOKEN_GROUPS.map(g => ({ id: g.id, tokens: g.tokens.filter(t => available.has(t)) })).filter(
        g => g.tokens.length > 0,
    );
    const other = tokens.filter(t => !known.has(t)).sort();
    if (other.length) {
        groups.push({ id: 'other', tokens: other });
    }
    return groups;
}

/**
 * Validates the key of one row.
 *
 * @param table the template table
 * @param index index of the row to check
 * @returns an i18n error key or undefined if the key is valid
 */
export function validateTemplateKey(
    table: TemplateRow[],
    index: number,
): 'tpl_key_empty' | 'tpl_key_duplicate' | undefined {
    const key = (table[index]?.templateKey ?? '').trim();
    if (!key) {
        return 'tpl_key_empty';
    }
    if (table.some((row, i) => i !== index && row.templateKey.trim() === key)) {
        return 'tpl_key_duplicate';
    }
    return undefined;
}

/**
 * Reads the structured notification-service model from the admin data, falling
 * back to the legacy flat keys (before the one-time backend migration ran).
 *
 * @param data the complete admin data
 */
export function readServiceModel(data: Record<string, any>): NotificationServicesConfig {
    const stored = data.notificationServices as NotificationServicesConfig | undefined;
    const model: NotificationServicesConfig = {};
    for (const service of SERVICE_TYPES) {
        model[service] = stored?.[service] ?? flatEntryToModel(service, data);
    }
    return model;
}

/**
 * Finds every place that references the template `key`.
 *
 * @param data the complete admin data
 * @param key the template key
 */
export function findTemplateUsages(data: Record<string, any>, key: string): TemplateUsage[] {
    const usages: TemplateUsage[] = [];
    if (!key) {
        return usages;
    }
    const model = readServiceModel(data);
    for (const service of SERVICE_TYPES) {
        const entry = model[service];
        if (!entry) {
            continue;
        }
        for (const slot of SERVICE_CAPS[service].messages) {
            if (entry.messages?.[slot] === key) {
                usages.push({ service, slot });
            }
        }
    }
    const table = (data.templateTable as TemplateRow[] | undefined) ?? [];
    const needle = `\${${key}}`;
    for (const row of table) {
        if (row.templateKey !== key && typeof row.template === 'string' && row.template.includes(needle)) {
            usages.push({ service: 'template', slot: row.templateKey });
        }
    }
    return usages;
}

/**
 * Renames a template and updates all references (service message slots in the
 * structured model and the legacy flat keys, and nested `${key}` references in
 * other templates).
 *
 * @param data the complete admin data (not modified)
 * @param oldKey current key
 * @param newKey new key
 * @returns a modified deep copy of `data`
 */
export function renameTemplate(data: Record<string, any>, oldKey: string, newKey: string): Record<string, any> {
    const copy: Record<string, any> = JSON.parse(JSON.stringify(data));
    if (!oldKey || !newKey || oldKey === newKey) {
        return copy;
    }
    const table = (copy.templateTable as TemplateRow[] | undefined) ?? [];
    const from = `\${${oldKey}}`;
    const to = `\${${newKey}}`;
    for (const row of table) {
        if (row.templateKey === oldKey) {
            row.templateKey = newKey;
        }
        if (typeof row.template === 'string') {
            row.template = row.template.split(from).join(to);
        }
    }

    const hadModel = !!copy.notificationServices;
    const model = readServiceModel(copy);
    for (const service of SERVICE_TYPES) {
        const entry = model[service];
        if (!entry) {
            continue;
        }
        for (const slot of SERVICE_CAPS[service].messages) {
            if (entry.messages?.[slot] === oldKey) {
                entry.messages[slot] = newKey;
            }
            const flatKey = `${service}_${MESSAGE_SUFFIX[slot]}`;
            if (copy[flatKey] === oldKey) {
                copy[flatKey] = newKey;
            }
        }
    }
    if (hadModel) {
        copy.notificationServices = model;
    }
    return copy;
}

/**
 * Returns a key that is not used yet, based on `base` (`base`, `base_2`, …).
 *
 * @param table the template table
 * @param base the preferred key
 */
export function uniqueTemplateKey(table: TemplateRow[], base: string): string {
    const keys = new Set(table.map(r => r.templateKey));
    if (!keys.has(base)) {
        return base;
    }
    let n = 2;
    while (keys.has(`${base}_${n}`)) {
        n++;
    }
    return `${base}_${n}`;
}
