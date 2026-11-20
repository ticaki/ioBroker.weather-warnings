/**
 * Template rendering for warning messages.
 *
 * Shared by the message pipeline (MessagesClass) and the admin template
 * preview, so the preview shows exactly what the push services will receive.
 *
 * Syntax inside a template:
 * - `${token}`              value of a formatted key (e.g. `${headline}`); `${Token}` capitalises it
 * - `${otherTemplateKey}`   inserts another template (nesting)
 * - `${[a,b,c]token}`       picks the entry with the index `token` from the list
 * - `${(2<token)yes#no}`    condition with `<`, `>`, `=`, `!=`
 * - `\n`                     line break, `\}` literal brace
 */
import type * as MessageType from './def/messages-def';

/** One row of the admin template table. */
export type TemplateTable = { templateKey: string; template: string }[];

/** Formatted keys of one warning. */
export type TemplateData = { [K in keyof MessageType.customFormatedKeysDef]?: string | number | undefined } | undefined;

/** Minimal logger used while rendering. */
export interface TemplateLogger {
    error: (...message: string[]) => void;
}

/**
 * Renders a template string with the given formatted data.
 *
 * @param start the template text to render
 * @param templateKey key of the rendered template (only used for log messages)
 * @param formatedData the formatted keys of a warning
 * @param templates the complete template table (for nested templates)
 * @param log logger for template errors
 * @returns the rendered (raw) text; pass it through {@link finalizeTemplateText} before sending
 */
export function renderTemplate(
    start: string,
    templateKey: string,
    formatedData: TemplateData,
    templates: TemplateTable,
    log: TemplateLogger,
): string {
    let msg = '';
    if (!formatedData) {
        return msg;
    }
    // catch endless cylce
    let count = 0;
    while (count++ < 100) {
        let rerun = false;
        const template = (msg === '' ? start : msg).replaceAll('iconbase64', 'htmlicon');
        if (!template) {
            break;
        }
        const temp = template.split(/(?<!\\)\${/g);
        msg = temp[0];
        for (let b = 1; temp.length > b; b++) {
            const t = temp[b].split(/(?<!\\)}/g);
            const key = t[0] as keyof MessageType.customFormatedKeysDef;
            const configTemplate = templates.filter(a => a.templateKey == key);
            /** [a,b,c]templatekey */
            if (key[0] == '[') {
                const arraykey = key.split(']');
                arraykey[0] = arraykey[0].slice(1);
                if (arraykey[1] && formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef] !== undefined) {
                    const n = formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef];

                    if (n != '' && !Number.isNaN(n)) {
                        try {
                            msg += arraykey[0]
                                .split(',')
                                [formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef] as number].trim();
                        } catch {
                            log.error(`Array is not an array ${arraykey[0]} or index out of range ${n}.`);
                        }
                    }
                } else {
                    log.error(`Unknown or not a number key ${arraykey[1]} in template ${templateKey}!`);
                }
                /** (2<templatekey)true#false */
            } else if (key[0] == '(') {
                const arraykey = key.split(')');
                arraykey[0] = arraykey[0].slice(1);
                for (const a of ['<', '>', '=', '!=']) {
                    if (arraykey[0].indexOf(a) == -1) {
                        continue;
                    }
                    const funcarray = arraykey[0].split(a);
                    const n = formatedData[funcarray[1].trim() as keyof MessageType.customFormatedKeysDef];
                    if (n !== undefined) {
                        let result = false;
                        switch (a) {
                            case '>':
                                {
                                    result = funcarray[0].trim() > n;
                                }
                                break;
                            case '<':
                                {
                                    result = funcarray[0].trim() < n;
                                }
                                break;
                            case '=':
                                {
                                    result = funcarray[0].trim() == n;
                                }
                                break;
                            case '!=':
                                {
                                    result = funcarray[0].trim() != n;
                                }
                                break;
                        }
                        let temp = '';
                        if (arraykey[1].indexOf('#') != -1) {
                            if (result) {
                                temp = arraykey[1].split('#')[0];
                            } else {
                                temp = arraykey[1].split('#')[1] !== undefined ? arraykey[1].split('#')[1] : '';
                            }
                        } else if (result) {
                            temp = arraykey[1];
                        }
                        if (temp.indexOf('\\${') != -1) {
                            temp = temp.replace(/\\\${/g, '${');
                            temp = temp.replace(/\\+}/g, '}');
                            rerun = true;
                        }
                        msg += temp;
                    } else {
                        log.error(`Unknown key ${funcarray[1]} in template ${templateKey}!`);
                        break;
                    }
                }
            } else if (configTemplate.length == 1) {
                msg += configTemplate[0].template;
                rerun = true;
            } else if (key && formatedData[key] !== undefined) {
                msg += formatedData[key];
            } else if (
                key &&
                formatedData[key.toLowerCase() as keyof MessageType.customFormatedKeysDef] !== undefined
            ) {
                let m = formatedData[key.toLowerCase() as keyof MessageType.customFormatedKeysDef];
                if (typeof m == 'string' && m.length > 0) {
                    m =
                        m[0].toUpperCase() +
                        (key[key.length - 1] == key[key.length - 1].toUpperCase()
                            ? m.slice(1).toUpperCase()
                            : m.slice(1));
                }
                msg += m;
            } else {
                msg += key;
            }
            if (t.length > 1) {
                msg += t[1];
            }
        }

        if (!rerun) {
            break;
        }
    }
    return msg;
}

/**
 * Final text post-processing that is applied before a message is sent.
 *
 * @param msg the rendered text
 * @returns text with escaped braces and `\\n` line breaks resolved
 */
export function finalizeTemplateText(msg: string): string {
    return msg.replace(/\\+}/g, '}').replace(/\\+n/g, '\n');
}
