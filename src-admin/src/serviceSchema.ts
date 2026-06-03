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

const W = { xs: 12, sm: 12, md: 6, lg: 4, xl: 4 } as const;

const PARSE_MODE_OPTIONS = [
    { label: 'none', value: 'none' },
    { label: 'Html', value: 'HTML' },
    { label: 'Markdown V2', value: 'MarkdownV2 ' },
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
const MESSAGE_LABEL: Record<MessageKey, string> = {
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
    const label = `${manual ? 'Manual' : ''}${command === 'filterType' ? 'TypeFilter' : 'LevelFilter'}`;
    const item: Item = {
        type: 'selectSendTo',
        command,
        jsonData: `{ "service": "${service}" }`,
        manual: false,
        multiple,
        ...W,
        label,
        newLine,
    };
    if (command === 'filterType') {
        item.tooltip = 'TypeFilter';
    }
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
                label: 'pushover_Sound',
                ...d,
            };
            extras[`${service}_Priority`] = {
                type: 'checkbox',
                default: false,
                ...W,
                label: 'pushover_Priority',
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
                label: 'gotify_Priority',
                ...d,
            };
            extras[`${service}_contentType`] = {
                type: 'select',
                options: CONTENT_TYPE_OPTIONS,
                default: 'text/plain',
                ...W,
                label: 'gotify_contentType',
                ...d,
            };
            break;
        case 'nspanel':
            extras[`${service}_Priority`] = {
                type: 'number',
                min: 1,
                max: 100,
                default: 50,
                ...W,
                label: 'nspanel_Priority',
                ...d,
            };
            extras[`${service}_alwaysOn`] = { type: 'checkbox', default: true, ...W, label: 'nspanel_alwaysOn', ...d };
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
                label: 'speak_volumen',
                ...d,
            };
            extras[`${service}_Audio`] = {
                type: 'text',
                default: '',
                ...W,
                label: 'alexa2_Audio',
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
                label: 'speak_volumen',
                ...d,
            };
            break;
        case 'email':
            extras[`${service}_line_break`] = { type: 'text', ...W, label: 'email_line_break' };
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
            primary[`${service}_parse`] = { type: 'checkbox', ...W, label: 'json_parse' };
            break;
        case 'history':
            primary[`${service}_allinOne`] = { type: 'checkbox', ...W, label: 'history_allinOne' };
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

    // 1. target adapter
    if (caps.adapter === 'single') {
        items[`${service}_Adapter`] = {
            type: 'selectSendTo',
            command: 'notificationService',
            jsonData: `{ "service": "${service}" }`,
            manual: false,
            multiple: false,
            ...W,
            label: 'SelectNotificationService',
            newLine: true,
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
            label: 'SelectNotificationService',
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

    // 2. provider activation
    for (const [prov, flag] of [
        ['dwd', 'dwdEnabled'],
        ['uwz', 'uwzEnabled'],
        ['zamg', 'zamgEnabled'],
    ] as const) {
        const provCap = prov.charAt(0).toUpperCase() + prov.slice(1);
        items[`${service}_${provCap}Enabled`] = {
            type: 'checkbox',
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 3,
            hidden: `!data.${flag}`,
            ...(dis ? { disabled: dis } : {}),
            label: `${prov}Enabled`,
            newLine: true,
        };
    }

    // 3. primary, always-visible extras (e.g. alexa2 device list)
    const { primary, extras } = extraFields(service, dis);
    Object.assign(items, primary);

    // 4. filter section
    if (caps.manualFilter) {
        items[`${service}_autoHeader`] = { type: 'staticText', ...W, text: 'header_auto', newLine: true };
        items[`${service}_manualHeader`] = { type: 'staticText', ...W, text: 'header_manual', newLine: false };
        items[`${service}_TypeFilter`] = filterField(service, 'filterType', false, dis, true);
        items[`${service}_ManualTypeFilter`] = filterField(service, 'filterType', true, dis, false);
        items[`${service}_LevelFilter`] = filterField(service, 'filterLevel', false, dis, true);
        items[`${service}_ManualLevelFilter`] = filterField(service, 'filterLevel', true, dis, false);
    } else {
        items[`${service}_TypeFilter`] = filterField(service, 'filterType', false, dis, true);
        items[`${service}_LevelFilter`] = filterField(service, 'filterLevel', false, dis, true);
    }

    // 5. message templates
    let first = true;
    for (const key of caps.messages) {
        items[`${service}_${MESSAGE_FLAT_SUFFIX[key]}`] = messageField(service, key, dis, first);
        first = false;
    }

    // 6. service specific extras
    if (Object.keys(extras).length) {
        items[`${service}_extras`] = { type: 'header', text: 'notification_extras', newLine: true };
        Object.assign(items, extras);
    }

    return {
        type: 'panel',
        label: service,
        items,
    };
}
