import WeatherWarnings from '../main';
import { statesObjectsWarnings } from './def/definitionen';
import * as MessageType from './def/messages-def';
import * as NotificationType from './def/notificationService-def';
import { messageFilterType } from './def/provider-def';
import { BaseClass, Library } from './library';
import * as Provider from './def/provider-def';

type ChangeTypeOfKeys<Obj, newKey> = Obj extends object
    ? { [K in keyof Obj]: ChangeTypeOfKeys<Obj[K], newKey> }
    : newKey;

export type customformatedKJDef = ChangeTypeOfKeys<MessageType.customFormatedKeysDef, customFormatedKDefSub>;
export type customFormatedKInit =
    | ChangeTypeOfKeys<MessageType.customFormatedKeysDef, string | number | undefined>
    | undefined;
export type customFormatedKR = ChangeTypeOfKeys<MessageType.customFormatedKeysDef, string | number | undefined>;

type customFormatedKDefSub = { cmd?: messageCmdType; node: string };
type messageCmdType = 'dayoftheweek' | 'translate' | 'dayoftheweekshort' | 'countdown';
/**
 * bla
 */
export class MessagesClass extends BaseClass {
    provider: Provider.ProviderClassType | null;
    providerController: Provider.ProviderController;
    library: Library;
    private formatedKeysJsonataDefinition: customformatedKJDef = {};
    formatedData: customFormatedKInit;
    rawWarning: any;
    /** message is a new message */
    newMessage: boolean = true;
    /** message got a update lately */
    updated: boolean = false;
    /**Indicate if message is marked for remove. */
    notDeleted: boolean = true;
    templates: ioBroker.AdapterConfig['templateTable'];
    messages: { message: string; key: string }[] = [];
    starttime = 1;
    endtime = 1;
    ceiling = 0;
    altitude = 0;
    level = 0;
    type = 0;
    cache: { messages: { [key: string]: NotificationType.MessageType }; ts: number } = {
        messages: {},
        ts: 0,
    };
    genericType: keyof MessageType.genericWarntypeType = 1;
    /** jsonata/typscript cmd to gather data from warning json */
    formatedKeyCommand: { [key: string]: Required<customformatedKJDef> } = {
        dwdService: {
            starttime: {
                node: `$fromMillis($toMillis(ONSET),"[H#1]:[m01]","\${this.timeOffset}")`,
            },
            startdate: {
                node: `$fromMillis($toMillis(ONSET),"[D01].[M01]","\${this.timeOffset}")`,
            },
            endtime: {
                node: `$fromMillis($toMillis(EXPIRES),"[H#1]:[m01]","\${this.timeOffset}")`,
            },
            enddate: {
                node: `$fromMillis($toMillis(EXPIRES),"[D01].[M01]","\${this.timeOffset}")`,
            },
            startdayofweek: {
                node: `ONSET`,
                cmd: 'dayoftheweek',
            },
            enddayofweek: {
                node: `EXPIRES`,
                cmd: 'dayoftheweek',
            },
            headline: { node: `HEADLINE` },
            description: { node: `DESCRIPTION` },
            weathertext: { node: `` },
            ceiling: { node: `$floor(CEILING * 0.3048)` },
            altitude: { node: `$floor(ALTITUDE * 0.3048)` },
            warnlevelcolorhex: {
                node: `($temp := $lookup(${JSON.stringify(
                    MessageType.dwdLevel,
                )},$lowercase(SEVERITY));$lookup(${JSON.stringify(MessageType.color.generic)},$string($temp)))`,
            },
            warnlevelcolorname: {
                node: `($temp := $lookup(${JSON.stringify(
                    MessageType.dwdLevel,
                )},$lowercase(SEVERITY));$lookup(${JSON.stringify(MessageType.color.textGeneric)},$string($temp)))`,
                cmd: 'translate',
            },
            warnlevelname: {
                node: `($temp := $lookup(${JSON.stringify(
                    MessageType.dwdLevel,
                )},$lowercase(SEVERITY));$lookup(${JSON.stringify(
                    MessageType.textLevels.textGeneric,
                )},$string($temp)))`,
                cmd: 'translate',
            },
            warnlevelnumber: {
                node: `$lookup(${JSON.stringify(MessageType.dwdLevel)},$lowercase(SEVERITY))`,
            },

            warntypename: {
                node: `$lookup(${JSON.stringify(MessageType.warnTypeName.dwdService)}, $string(EC_II))`,
                cmd: 'translate',
            },
            location: { node: `AREADESC` },
            warntypegenericname: {
                cmd: undefined,
                node: '',
            },
            instruction: {
                cmd: undefined,
                node: 'INSTRUCTION',
            },
            provider: {
                cmd: undefined,
                node: '',
            },
            locationcustom: {
                cmd: undefined,
                node: '',
            },
            startdayofweekshort: {
                node: `ONSET`,
                cmd: 'dayoftheweekshort',
            },
            enddayofweekshort: {
                node: `EXPIRES`,
                cmd: 'dayoftheweekshort',
            },
            countdown: {
                cmd: 'countdown',
                node: '$toMillis(ONSET)',
            },
            status: {
                cmd: undefined,
                node: '',
            },
        },

        uwzService: {
            starttime: {
                node: `$fromMillis(dtgStart * 1000,"[H#1]:[m01]","\${this.timeOffset}")`,
            },
            startdate: {
                node: `$fromMillis(dtgStart * 1000,"[D01].[M01]","\${this.timeOffset}")`,
            },
            endtime: {
                node: `$fromMillis(dtgEnd * 1000,"[H#1]:[m01]","\${this.timeOffset}")`,
            },
            enddate: {
                node: `$fromMillis(dtgEnd * 1000,"[D01].[M01]","\${this.timeOffset}")`,
            },
            startdayofweek: {
                node: `dtgStart * 1000`,
                cmd: 'dayoftheweek',
            },
            enddayofweek: {
                node: `dtgEnd * 1000`,
                cmd: 'dayoftheweek',
            },
            headline: { node: `payload.translationsShortText` },
            description: { node: `payload.translationsLongText` },
            weathertext: { node: `` },
            ceiling: { node: `payload.altMax` },
            altitude: { node: `payload.altMin` },
            warnlevelcolorname: {
                node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    MessageType.level.uwz,
                )}, $i[2]); $lookup(${JSON.stringify(MessageType.color.textGeneric)},$string($l)))`,
                cmd: 'translate',
            },
            warnlevelnumber: {
                node: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    MessageType.level.uwz,
                )}, $i[2]))`,
            },
            warnlevelcolorhex: {
                node: `$lookup(${JSON.stringify(
                    MessageType.color.generic,
                )},$string(($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    MessageType.level.uwz,
                )}, $i[2]))))`,
            },
            warnlevelname: {
                node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    MessageType.level.uwz,
                )}, $i[2]); $lookup(${JSON.stringify(MessageType.textLevels.textGeneric)},$string($l)))`,
                cmd: 'translate',
            },
            warntypename: {
                node: `$lookup(${JSON.stringify(MessageType.warnTypeName.uwzService)}, $string(type))`,
                cmd: 'translate',
            },
            location: { node: `areaID` },
            warntypegenericname: {
                cmd: undefined,
                node: '',
            },
            instruction: {
                cmd: undefined,
                node: '',
            },
            provider: {
                cmd: undefined,
                node: '',
            },
            locationcustom: {
                cmd: undefined,
                node: '',
            },
            startdayofweekshort: {
                node: `dtgStart * 1000`,
                cmd: 'dayoftheweekshort',
            },
            enddayofweekshort: {
                node: `dtgEnd * 1000`,
                cmd: 'dayoftheweekshort',
            },
            countdown: {
                cmd: 'countdown',
                node: 'dtgStart * 1000',
            },
            status: {
                cmd: undefined,
                node: '',
            },
        },
        zamgService: {
            starttime: {
                node: `$fromMillis($number(rawinfo.start)*1000,"[H#1]:[m01]","\${this.timeOffset}")`,
            },
            startdate: {
                node: `$fromMillis($number(rawinfo.start)*1000,"[D01].[M01]","\${this.timeOffset}")`,
            },
            endtime: {
                node: `$fromMillis($number(rawinfo.end)*1000,"[H#1]:[m01]","\${this.timeOffset}")`,
            },
            enddate: {
                node: `$fromMillis($number(rawinfo.end)*1000,"[D01].[M01]","\${this.timeOffset}")`,
            },
            startdayofweek: {
                node: `$number(rawinfo.start)*1000`,
                cmd: 'dayoftheweek',
            },
            enddayofweek: {
                node: `$number(rawinfo.end)*1000`,
                cmd: 'dayoftheweek',
            },
            headline: { node: `text` },
            description: { node: `auswirkungen` },
            weathertext: { node: `meteotext` },
            ceiling: { node: `` },
            altitude: { node: `` },
            warnlevelcolorname: {
                node: `$lookup(${JSON.stringify(MessageType.color.textGeneric)},$string(rawinfo.wlevel + 1))`,
                cmd: 'translate',
            },
            warnlevelnumber: {
                node: `$string(rawinfo.wlevel + 1)`,
            },
            warnlevelcolorhex: {
                node: `$lookup(${JSON.stringify(MessageType.color.zamgColor)},$string(rawinfo.wlevel + 1))`,
            },
            warnlevelname: {
                node: `$lookup(${JSON.stringify(MessageType.textLevels.textGeneric)},$string(rawinfo.wlevel + 1))`,
                cmd: 'translate',
            },
            warntypename: {
                node: `$lookup(${JSON.stringify(MessageType.warnTypeName.zamgService)},$string(rawinfo.wtype))`,
                cmd: 'translate',
            },

            location: { node: `location` },
            instruction: { node: `empfehlungen` },
            warntypegenericname: {
                cmd: undefined,
                node: '',
            },
            provider: {
                cmd: undefined,
                node: '',
            },
            locationcustom: {
                cmd: undefined,
                node: '',
            },
            startdayofweekshort: {
                node: `$number(rawinfo.start)*1000`,
                cmd: 'dayoftheweekshort',
            },
            enddayofweekshort: {
                node: `$number(rawinfo.end)*1000`,
                cmd: 'dayoftheweekshort',
            },
            countdown: {
                cmd: 'countdown',
                node: '$number(rawinfo.start)*1000',
            },
            status: {
                cmd: undefined,
                node: '',
            },
        },
        default: {
            starttime: { node: `` },
            startdate: { node: `` },
            endtime: { node: `` },
            enddate: { node: `` },
            startdayofweek: { node: `` },
            enddayofweek: { node: `` },
            headline: { node: `` },
            description: { node: `` },
            weathertext: { node: `` },
            ceiling: { node: `` },
            altitude: { node: `` },
            warnlevelname: { node: `` },
            warnlevelnumber: { node: `` },
            warnlevelcolorhex: { node: `` },
            warnlevelcolorname: { node: `` },
            warntypename: { node: `` },
            location: { node: `` },
            instruction: { node: `` },
            warntypegenericname: {
                cmd: undefined,
                node: '',
            },
            provider: {
                cmd: undefined,
                node: '',
            },
            locationcustom: {
                cmd: undefined,
                node: '',
            },
            startdayofweekshort: {
                cmd: undefined,
                node: '',
            },
            enddayofweekshort: {
                cmd: undefined,
                node: '',
            },
            countdown: {
                cmd: undefined,
                node: '',
            },
            status: {
                cmd: undefined,
                node: '',
            },
        },
    };
    constructor(
        adapter: WeatherWarnings,
        name: string,
        provider: Provider.ProviderClassType | null,
        data: object,
        pcontroller: Provider.ProviderController,
    ) {
        super(adapter, name);

        if (!data && provider) {
            throw new Error(`${this.log.getName()} data is null`);
        }
        this.provider = provider;
        this.library = this.adapter.library;
        this.rawWarning = data;
        this.templates = this.adapter.config.templateTable;
        this.providerController = pcontroller;
        switch (provider ? provider.service : 'default') {
            case `dwdService`:
            case `uwzService`:
            case `zamgService`:
                if (provider && provider.service) {
                    const json = this.formatedKeyCommand[provider.service];
                    for (const k in json) {
                        const key = k as keyof MessageType.customFormatedKeysDef;
                        const data = this.formatedKeyCommand[provider.service][key];
                        this.addFormatedDefinition(key, data);
                    }
                }
                break;
            default:
                this.formatedKeysJsonataDefinition = {
                    starttime: { node: `` },
                    startdate: { node: `` },
                    endtime: { node: `` },
                    enddate: { node: `` },
                    startdayofweek: { node: `` },
                    enddayofweek: { node: `` },
                    headline: { node: `` },
                    description: { node: `` },
                    weathertext: { node: `` },
                    ceiling: { node: `` }, // max höhe
                    altitude: { node: `` }, // min höhe
                    warnlevelname: { node: `` },
                    warnlevelnumber: { node: `` },
                    warnlevelcolorhex: { node: `` },
                    warnlevelcolorname: { node: `` },
                    warntypename: { node: `` },
                    location: { node: `` },
                };
        }
    }
    async updateFormated(): Promise<customFormatedKR> {
        switch (this.provider ? this.provider.service : 'default') {
            case 'dwdService':
                {
                    this.starttime = Number(await this.library.readWithJsonata(this.rawWarning, `$toMillis(ONSET)`));
                    this.endtime = Number(await this.library.readWithJsonata(this.rawWarning, `$toMillis(EXPIRES)`));
                    this.ceiling = Number(
                        await this.library.readWithJsonata(this.rawWarning, `$floor(CEILING * 0.3048)`),
                    ); // max höhe
                    this.altitude = Number(
                        await this.library.readWithJsonata(this.rawWarning, `$floor(ALTITUDE * 0.3048)`),
                    ); // min höhe
                    this.level = Number(
                        await this.library.readWithJsonata(
                            this.rawWarning,
                            `$number($lookup(${JSON.stringify(MessageType.dwdLevel)},$lowercase(SEVERITY)))`,
                        ),
                    );
                    this.type = Number(await this.library.readWithJsonata(this.rawWarning, `$number(EC_II)`));
                }
                break;

            case 'uwzService':
                {
                    this.starttime = Number(
                        await this.library.readWithJsonata(this.rawWarning, `$number(dtgStart * 1000)`),
                    );
                    this.endtime = Number(
                        await this.library.readWithJsonata(this.rawWarning, `$number(dtgEnd * 1000)`),
                    );
                    this.ceiling = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMax`)); // max höhe
                    this.altitude = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMin`)); // min höhe
                    this.level = Number(
                        await this.library.readWithJsonata(
                            this.rawWarning,
                            `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                                MessageType.level.uwz,
                            )}, $i[2]))`,
                        ),
                    );
                    this.type = Number(await this.library.readWithJsonata(this.rawWarning, `$number(type)`));
                }
                break;
            case 'zamgService':
                {
                    this.starttime = Number(
                        await this.library.readWithJsonata(this.rawWarning, `$number(rawinfo.start)`),
                    );
                    this.endtime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(rawinfo.end)`));
                    this.ceiling = -1;
                    this.altitude = -1;
                    this.level = Number(await this.library.readWithJsonata(this.rawWarning, `rawinfo.wlevel`));
                    this.type = Number(await this.library.readWithJsonata(this.rawWarning, `rawinfo.wtype`));
                }
                break;
            default: {
                this.starttime = 1;
                this.endtime = 1;
                this.ceiling = -1;
                this.altitude = -1;
                this.level = -1;
                this.type = 0;
            }
        }

        const sortedWarntypes: Required<MessageType.genericWarntypeNumberType>[] = [
            10, 7, 2, 4, 3, 8, 9, 5, 6, 11, 12, 1,
        ];
        if (this.provider) {
            for (const t in sortedWarntypes) {
                const o = MessageType.genericWarntyp[sortedWarntypes[t]];
                const s = this.provider.service;
                //@ts-expect-error keine ahnung o und s sind definiert
                if (Array.isArray(o[s]) && o[s].indexOf(this.type) != -1) {
                    this.genericType = sortedWarntypes[t];
                    break;
                }
            }
        }

        return await this.updateFormatedData(true);
    }
    filter(filter: messageFilterType): boolean {
        this.type;
        let hit = false;
        if (filter.level && filter.level > this.level) return false;
        for (const f in filter.type) {
            if (
                //@ts-expect-error dann ebenso
                MessageType.genericWarntyp[filter.type[f]][this.provider.service].indexOf(this.type) != -1
            ) {
                hit = true;
                break;
            }
        }
        if (hit) return false;
        return true;
    }
    //old
    async formatMessagesDep(): Promise<void> {
        const templates = this.adapter.config.templateTable;
        const messages: { message: string; key: string }[] = [];
        if (this.formatedData) {
            for (const a in templates) {
                let msg: string = '';
                while (true) {
                    let rerun = false;
                    const template = msg === '' ? templates[a].template : msg;
                    if (!template) continue;
                    const temp = template.split(/(?<!\\)\${/g);
                    msg = temp[0];
                    for (let b = 1; temp.length > b; b++) {
                        const t = temp[b].split(/(?<!\\)}/g);
                        const key = t[0] as keyof MessageType.customFormatedKeysDef;
                        const configTemplate = this.adapter.config.templateTable.filter((a) => a.templateKey == key);
                        if (key[0] == '[') {
                            const arraykey = key.split(']');
                            arraykey[0] = arraykey[0].slice(1);
                            if (
                                arraykey[1] &&
                                this.formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef] !== undefined
                            ) {
                                const n = this.formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef];

                                if (n != '' && !Number.isNaN(n)) {
                                    msg += arraykey[0]
                                        .split(',')
                                        [
                                            this.formatedData[
                                                arraykey[1] as keyof MessageType.customFormatedKeysDef
                                            ] as number
                                        ].trim();
                                }
                            } else {
                                this.log.error(
                                    `Unknown or not a number key ${arraykey[1]}  in template ${templates[a].templateKey}!`,
                                );
                            }
                        } else if (configTemplate.length == 1) {
                            msg += configTemplate[0].template;
                            rerun = true;
                        } else if (key && this.formatedData[key] !== undefined) msg += this.formatedData[key];
                        else if (
                            key &&
                            this.formatedData[key.toLowerCase() as keyof MessageType.customFormatedKeysDef] !==
                                undefined
                        ) {
                            let m = this.formatedData[key.toLowerCase() as keyof MessageType.customFormatedKeysDef];
                            if (typeof m == 'string' && m.length > 0) {
                                m =
                                    m[0].toUpperCase() +
                                    (key[key.length - 1] == key[key.length - 1].toUpperCase()
                                        ? m.slice(1).toUpperCase()
                                        : m.slice(1));
                            }
                            msg += m;
                        } else msg += key;
                        if (t.length > 1) msg += t[1];
                    }

                    if (!rerun) break;
                }
                msg = msg.replace('\\}', '}');
                messages.push({ key: templates[a].templateKey, message: msg });
            }
        } else {
            templates.forEach((a) => messages.push({ key: a.templateKey, message: a.template }));
        }
        this.messages = messages;
    }
    // new
    async getMessage(
        templateActions: NotificationType.ActionsUnionType[],
        templateKey: string,
        action: NotificationType.ActionsUnionType,
        override: boolean = false,
    ): Promise<NotificationType.MessageType> {
        let msg: string = '';
        const templates = this.adapter.config.templateTable;
        const tempid = templates.findIndex((a) => a.templateKey == templateKey);
        if (override) action = 'new';
        if (
            override || // get every message
            (action == 'new' && this.newMessage) || // new message
            (action == 'remove' && !this.notDeleted) || // remove message
            (action == 'all' &&
                templateActions.includes('all') &&
                !templateActions.includes('new') &&
                !templateActions.includes('remove')) // all without extension
        ) {
            // all messages with new/remove
            if (this.cache.ts < Date.now() - 60000) {
                this.updateFormated();
            }
            if (this.cache.messages[templateKey as string] !== undefined)
                return this.cache.messages[templateKey as string];

            if (this.formatedData) {
                msg = await this.getTemplates(tempid, templates);
                //messages.push({ key: templates[a].templateKey, message: msg });
                if (tempid == -1) {
                    this.log.error(`No template for Key: ${templateKey}!`);
                } else {
                    this.cache.messages[templates[tempid].templateKey as keyof typeof this.cache.messages] =
                        this.returnMessage(msg, this.starttime, templateKey);
                }
                return this.returnMessage(msg, this.starttime, templateKey);
            }
        }
        return this.returnMessage(msg, this.starttime, templateKey);
    }
    private async getTemplates(tempid: number, templates: any): Promise<string> {
        let msg = '';
        if (!this.formatedData) return msg;
        while (true) {
            if (tempid == -1) break;
            let rerun = false;
            const template = msg === '' ? templates[tempid].template : msg;
            if (!template) break;
            const temp = template.split(/(?<!\\)\${/g);
            msg = temp[0];
            for (let b = 1; temp.length > b; b++) {
                const t = temp[b].split(/(?<!\\)}/g);
                const key = t[0] as keyof MessageType.customFormatedKeysDef;
                const configTemplate = this.adapter.config.templateTable.filter((a) => a.templateKey == key);
                if (key[0] == '[') {
                    const arraykey = key.split(']');
                    arraykey[0] = arraykey[0].slice(1);
                    if (
                        arraykey[1] &&
                        this.formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef] !== undefined
                    ) {
                        const n = this.formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef];

                        if (n != '' && !Number.isNaN(n)) {
                            msg += arraykey[0]
                                .split(',')
                                [
                                    this.formatedData[arraykey[1] as keyof MessageType.customFormatedKeysDef] as number
                                ].trim();
                        }
                    } else {
                        this.log.error(
                            `Unknown or not a number key ${arraykey[1]}  in template ${templates[tempid].templateKey}!`,
                        );
                    }
                } else if (configTemplate.length == 1) {
                    msg += configTemplate[0].template;
                    rerun = true;
                } else if (key && this.formatedData[key] !== undefined) msg += this.formatedData[key];
                else if (
                    key &&
                    this.formatedData[key.toLowerCase() as keyof MessageType.customFormatedKeysDef] !== undefined
                ) {
                    let m = this.formatedData[key.toLowerCase() as keyof MessageType.customFormatedKeysDef];
                    if (typeof m == 'string' && m.length > 0) {
                        m =
                            m[0].toUpperCase() +
                            (key[key.length - 1] == key[key.length - 1].toUpperCase()
                                ? m.slice(1).toUpperCase()
                                : m.slice(1));
                    }
                    msg += m;
                } else msg += key;
                if (t.length > 1) msg += t[1];
            }

            if (!rerun) break;
        }
        return msg;
    }
    private returnMessage = (msg: string, time: number, template: string): NotificationType.MessageType => {
        return { startts: time, text: msg.replaceAll('\\}', '}'), template: template };
    };

    async updateFormatedData(update: boolean = false): Promise<customFormatedKR> {
        if (!this.rawWarning && !this.formatedData) {
            throw new Error(`${this.log.getName()} error(165) rawWarning and formatedDate empty!`);
        }

        if (!this.formatedData || this.updated || update) {
            const timeOffset =
                (Math.floor(new Date().getTimezoneOffset() / 60) < 0 || new Date().getTimezoneOffset() % 60 < 0
                    ? '+'
                    : '-') +
                ('00' + Math.abs(Math.floor(new Date().getTimezoneOffset() / 60))).slice(-2) +
                ('00' + Math.abs(new Date().getTimezoneOffset() % 60)).slice(-2);
            const status = this.newMessage
                ? MessageType.status.new
                : this.notDeleted
                ? MessageType.status.hold
                : MessageType.status.clear;
            const temp: any = { status: this.library.getTranslation(status) };
            for (const key in this.formatedKeysJsonataDefinition) {
                const obj = this.formatedKeysJsonataDefinition[key as keyof MessageType.customFormatedKeysDef];
                if (obj !== undefined && obj.node !== undefined) {
                    // reset the offset because of daylight saving time
                    const cmd = obj.node.replace(`\${this.timeOffset}`, timeOffset);

                    let result =
                        cmd != ''
                            ? ((await this.library.readWithJsonata(
                                  this.rawWarning,
                                  cmd,
                              )) as keyof MessageType.customFormatedKeysDef)
                            : '';
                    if (obj.cmd !== undefined)
                        result = (await this.readWithTypescript(
                            result,
                            obj.cmd,
                        )) as keyof MessageType.customFormatedKeysDef;
                    // Handling for uwzService translations in jsons with different Names - but onl 1 Key here.
                    if (typeof result == 'object') {
                        for (const a in result as object) {
                            if (temp[key]) temp[key] += ', ';
                            else temp[key] = '';
                            temp[key] += result[a];
                        }
                    } else temp[key] = result;
                }
            }
            this.formatedData = temp as MessageType.customFormatedKeysDef;
            this.formatedData.warntypegenericname = await this.library.getTranslation(
                MessageType.genericWarntyp[this.genericType].name,
            );
            this.formatedData.locationcustom = this.provider ? this.provider.customName : '';
            this.formatedData.provider = this.provider
                ? this.provider.service.replace('Service', '').toUpperCase()
                : 'unknown';
            this.updated = false;
        }
        if (!this.formatedData) {
            throw new Error(`${this.log.getName()} formatedDate is empty!`);
        }
        this.cache.ts = Date.now();
        this.cache.messages = {};
        for (let a = 0; a < this.adapter.config.templateTable.length; a++) {
            const t = this.adapter.config.templateTable[a];
            if (t.templateKey.startsWith('_')) {
                this.formatedData[t.templateKey as keyof typeof this.formatedData] = await this.getTemplates(
                    a,
                    this.adapter.config.templateTable,
                );
            }
        }

        return this.formatedData;
    }

    async readWithTypescript(data: any, cmd: messageCmdType): Promise<string | number> {
        if (!this.rawWarning && !cmd) {
            throw new Error('readWithTypescript called without rawWarning or val!');
        }
        switch (cmd) {
            case 'dayoftheweek': {
                return new Date(data as string | number | Date).toLocaleDateString(this.library.getLocalLanguage(), {
                    weekday: 'long',
                });
            }
            case 'dayoftheweekshort': {
                return new Date(data as string | number | Date).toLocaleDateString(this.library.getLocalLanguage(), {
                    weekday: 'short',
                });
            }
            case 'translate': {
                return this.library.getTranslation(data);
            }
            case 'countdown': {
                return this.getCountdown(data);
            }
        }
        return '';
    }

    //** Update rawWanrings and dont delete message */
    async updateData(data: object): Promise<void> {
        this.rawWarning = data;
        this.notDeleted = true;
        await this.updateFormated();
    }

    //** dont send a message and dont delete this*/
    silentUpdate(): void {
        this.newMessage = false;
        this.notDeleted = true;
    }

    getCountdown(time: number): string {
        const diff = time - Date.now();
        const remain = new Date(Math.abs(diff));
        const d = remain.getUTCDate() - 1;
        const h = d > 0 ? ('00' + String(remain.getUTCHours())).slice(2) : String(remain.getUTCHours());
        return `${diff < 0 ? '-' : ''}${d > 0 ? `${String(d)}:` : ''}${h}:${(
            '00' + String(remain.getUTCMinutes())
        ).slice(-2)}`;
    }
    delete(): void {
        this.notDeleted = false;
        this.newMessage = false;
        this.updated = false;
    }
    async writeFormatedKeys(index: number): Promise<void> {
        if (this.notDeleted) {
            if (this.provider)
                this.library.writeFromJson(
                    `${this.provider.name}.formatedKeys.${('00' + index.toString()).slice(-2)}`,
                    `allService.formatedkeys`,
                    statesObjectsWarnings,
                    this.formatedData,
                );
        }
    }
    addFormatedDefinition(key: keyof customformatedKJDef, arg: customFormatedKDefSub | undefined): void {
        if (arg === undefined) return;
        if (!this.formatedKeysJsonataDefinition) this.formatedKeysJsonataDefinition = {};
        this.formatedKeysJsonataDefinition[key] = arg;
    }
    //async init(msg: any): Promise<void> {}
}
