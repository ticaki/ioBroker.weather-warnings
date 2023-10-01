import WeatherWarnings from '../main';
import { genericStateObjects, statesObjectsWarnings } from './def/definitionen';
import {
    textLevels,
    warnTypeName,
    dwdLevel,
    level,
    color,
    customFormatedKeysDef,
    genericWarntyp,
    genericWarntypeType,
    notificationMessageType,
    genericWarntypeNumberType,
} from './def/messages-def';
import {
    notificationServiceBaseType,
    notificationServiceConfigType,
    notificationServiceType,
    notificationTemplateUnionType,
    serciceCapabilities,
} from './def/notificationService-def';
import { messageFilterType } from './def/provider-def';
import { BaseClass, Library } from './library';
import { ProvideClassType, ProviderController } from './provider';

type ChangeTypeOfKeys<Obj, newKey> = Obj extends object
    ? { [K in keyof Obj]: ChangeTypeOfKeys<Obj[K], newKey> }
    : newKey;

export type customformatedKeysJsonataDefinition = ChangeTypeOfKeys<customFormatedKeysDef, customFormatedKeysDefSubtype>;
export type customFormatedKeysInit = ChangeTypeOfKeys<customFormatedKeysDef, string | number | undefined> | undefined;
export type customFormatedKeysResult = ChangeTypeOfKeys<customFormatedKeysDef, string | number | undefined>;

type customFormatedKeysDefSubtype = { cmd?: 'dayoftheweek' | 'translate'; node: string };

/**
 * bla
 */
export class MessagesClass extends BaseClass {
    provider: ProvideClassType | null;
    providerController: ProviderController;
    library: Library;
    formatedKeysJsonataDefinition: customformatedKeysJsonataDefinition = {};
    formatedData: customFormatedKeysInit;
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
    genericType: keyof genericWarntypeType = 1;
    /** jsonata/typscript cmd to gather data from warning json */
    formatedKeyCommand: { [key: string]: Required<customformatedKeysJsonataDefinition> } = {
        dwdService: {
            starttime: { node: `$fromMillis($toMillis(ONSET),"[H#1]:[m01]","\${this.timeOffset}")` },
            startdate: { node: `$fromMillis($toMillis(ONSET),"[D01].[M01]","\${this.timeOffset}")` },
            endtime: { node: `$fromMillis($toMillis(EXPIRES),"[H#1]:[m01]","\${this.timeOffset}")` },
            enddate: { node: `$fromMillis($toMillis(EXPIRES),"[D01].[M01]","\${this.timeOffset}")` },
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
                node: `($temp := $lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
                    color.generic,
                )},$string($temp)))`,
            },
            warnlevelcolorname: {
                node: `($temp := $lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
                    color.textGeneric,
                )},$string($temp)))`,
                cmd: 'translate',
            },
            warnlevelname: {
                node: `($temp := $lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
                    textLevels.textGeneric,
                )},$string($temp)))`,
                cmd: 'translate',
            },
            warnlevelnumber: { node: `$lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY))` },

            warntypename: {
                node: `$lookup(${JSON.stringify(warnTypeName.dwdService)}, $string(EC_II))`,
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
        },

        uwzService: {
            starttime: { node: `$fromMillis(dtgStart,"[H#1]:[m01]","\${this.timeOffset}")` },
            startdate: { node: `$fromMillis(dtgStart,"[D01].[M01]","\${this.timeOffset}")` },
            endtime: { node: `$fromMillis(dtgEnd,"[H#1]:[m01]","\${this.timeOffset}")` },
            enddate: { node: `$fromMillis(dtgEnd,"[D01].[M01]","\${this.timeOffset}")` },
            startdayofweek: {
                node: `dtgStart`,
                cmd: 'dayoftheweek',
            },
            enddayofweek: {
                node: `dtgEnd`,
                cmd: 'dayoftheweek',
            },
            headline: { node: `payload.translationsShortText` },
            description: { node: `payload.translationsLongText` },
            weathertext: { node: `` },
            ceiling: { node: `payload.altMax` },
            altitude: { node: `payload.altMin` },
            warnlevelcolorname: {
                node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    level.uwz,
                )}, $i[2]); $lookup(${JSON.stringify(color.textGeneric)},$string($l)))`,
                cmd: 'translate',
            },
            warnlevelnumber: {
                node: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    level.uwz,
                )}, $i[2]))`,
            },
            warnlevelcolorhex: {
                node: `$lookup(${JSON.stringify(
                    color.generic,
                )},$string(($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    level.uwz,
                )}, $i[2]))))`,
            },
            warnlevelname: {
                node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    level.uwz,
                )}, $i[2]); $lookup(${JSON.stringify(textLevels.textGeneric)},$string($l)))`,
                cmd: 'translate',
            },
            warntypename: {
                node: `$lookup(${JSON.stringify(warnTypeName.uwzService)}, $string(type))`,
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
        },
        zamgService: {
            starttime: { node: `$fromMillis($number(rawinfo.start),"[H#1]:[m01]","\${this.timeOffset}")` },
            startdate: { node: `$fromMillis($number(rawinfo.start),"[D01].[M01]","\${this.timeOffset}")` },
            endtime: { node: `$fromMillis($number(rawinfo.end),"[H#1]:[m01]","\${this.timeOffset}")` },
            enddate: { node: `$fromMillis($number(rawinfo.end),"[D01].[M01]","\${this.timeOffset}")` },
            startdayofweek: {
                node: `$number(rawinfo.start)`,
                cmd: 'dayoftheweek',
            },
            enddayofweek: {
                node: `$number(rawinfo.end)`,
                cmd: 'dayoftheweek',
            },
            headline: { node: `text` },
            description: { node: `auswirkungen` },
            weathertext: { node: `meteotext` },
            ceiling: { node: `` },
            altitude: { node: `` },
            warnlevelcolorname: {
                node: `$lookup(${JSON.stringify(color.textGeneric)},$string(rawinfo.wlevel))`,
                cmd: 'translate',
            },
            warnlevelnumber: {
                node: `$string(rawinfo.wlevel)`,
            },
            warnlevelcolorhex: {
                node: `$lookup(${JSON.stringify(color.zamgColor)},$string(rawinfo.wlevel))`,
            },
            warnlevelname: {
                node: `$lookup(${JSON.stringify(textLevels.textGeneric)},$string(rawinfo.wlevel))`,
                cmd: 'translate',
            },
            warntypename: {
                node: `$lookup(${JSON.stringify(warnTypeName.zamgService)},$string(rawinfo.wtype))`,
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
        },
    };
    constructor(
        adapter: WeatherWarnings,
        name: string,
        provider: ProvideClassType | null,
        data: object,
        pcontroller: ProviderController,
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
                        const key = k as keyof customFormatedKeysDef;
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
    async init(): Promise<customFormatedKeysResult> {
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
                            `$number($lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY)))`,
                        ),
                    );
                    this.type = Number(await this.library.readWithJsonata(this.rawWarning, `$number(EC_II)`));
                }
                break;

            case 'uwzService':
                {
                    this.starttime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(dtgStart)`));
                    this.endtime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(dtgEnd)`));
                    this.ceiling = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMax`)); // max höhe
                    this.altitude = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMin`)); // min höhe
                    this.level = Number(
                        await this.library.readWithJsonata(
                            this.rawWarning,
                            `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                                level.uwz,
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

        const sortedWarntypes: Required<genericWarntypeNumberType>[] = [10, 7, 2, 4, 3, 8, 9, 5, 6, 11, 12, 1];
        if (this.provider) {
            for (const t in sortedWarntypes) {
                const o = genericWarntyp[sortedWarntypes[t]];
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
            //if (this.provider.service || genericWarntyp[typ][this.provider.service] == undefined) continue;
            //@ts-expect-error dann ebenso
            if (genericWarntyp[filter.type[f]][this.provider.service].indexOf(this.type) != -1) {
                hit = true;
                break;
            }
        }
        if (hit) return false;
        return true;
    }
    async formatMessages(): Promise<void> {
        const templates = this.adapter.config.templateTable;
        const messages: { message: string; key: string }[] = [];
        if (this.formatedData) {
            for (const a in templates) {
                const template = templates[a].template;
                if (!template) continue;
                const temp = template.split(/(?<!\\)\${/g);
                let msg: string = temp[0];
                for (let b = 1; temp.length > b; b++) {
                    const token = temp[b];
                    const t = token.split(/(?<!\\)}/g);
                    const key = t[0] as keyof customFormatedKeysDef;
                    if (key && this.formatedData[key] !== undefined) msg += this.formatedData[key];
                    else if (key && this.formatedData[key.toLowerCase() as keyof customFormatedKeysDef] !== undefined) {
                        let m = this.formatedData[key.toLowerCase() as keyof customFormatedKeysDef];
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
                msg = msg.replace('\\', '');
                messages.push({ key: templates[a].templateKey, message: msg });
            }
        } else {
            templates.forEach((a) => messages.push({ key: a.templateKey, message: a.template }));
        }
        this.messages = messages;
    }

    async updateFormatedData(update: boolean = false): Promise<customFormatedKeysResult> {
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
            const temp: any = {};
            for (const key in this.formatedKeysJsonataDefinition) {
                const obj = this.formatedKeysJsonataDefinition[key as keyof customFormatedKeysDef];
                if (obj !== undefined && obj.node !== undefined) {
                    // reset the offset because of daylight saving time
                    const cmd = obj.node.replace(`\${this.timeOffset}`, timeOffset);

                    let result =
                        cmd != ''
                            ? ((await this.library.readWithJsonata(
                                  this.rawWarning,
                                  cmd,
                              )) as keyof customFormatedKeysDef)
                            : '';
                    if (obj.cmd !== undefined)
                        result = (await this.readWithTypescript(result, obj.cmd)) as keyof customFormatedKeysDef;
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
            this.formatedData = temp as customFormatedKeysDef;
            this.formatedData.warntypegenericname = await this.library.getTranslation(
                genericWarntyp[this.genericType].name,
            );
            this.formatedData.provider = this.provider
                ? this.provider.service.replace('Service', '').toUpperCase()
                : 'unknown';
            this.updated = false;
        }
        if (!this.formatedData) {
            throw new Error(`${this.log.getName()} formatedDate is empty!`);
        }
        return this.formatedData;
    }
    async readWithTypescript(data: any, cmd: string): Promise<string | number> {
        if (!this.rawWarning && !cmd) {
            throw new Error('readWithTypescript called without rawWarning or val!');
        }
        switch (cmd) {
            case 'dayoftheweek': {
                return new Date(data as string | number | Date).toLocaleDateString(this.library.getLocalLanguage(), {
                    weekday: 'long',
                });
            }
            case 'translate': {
                return this.library.getTranslation(data);
            }
        }
        return '';
    }
    //** Update rawWanrings and dont delete message */
    updateData(data: object): void {
        this.rawWarning = data;
        this.notDeleted = true;
    }
    //** dont send a message and dont delete this*/
    silentUpdate(): void {
        this.newMessage = false;
        this.notDeleted = true;
    }
    async sendMessage(
        action: notificationTemplateUnionType,
        activeWarnings: boolean,
        override = false,
    ): Promise<boolean> {
        if (this.messages.length == 0) return false;
        if (
            !((this.newMessage && action == 'new') || (!this.notDeleted && action == 'remove') || action == 'removeAll')
        ) {
            if (!override) action = 'all';
        }
        const msgsend: { [key: string]: string } = {};
        for (let a = 0; a < this.messages.length; a++) {
            const msg = this.messages[a];
            if (this.provider)
                this.library.writedp(
                    `${this.provider.name}.messages.${msg.key}`,
                    msg.message,
                    genericStateObjects.messageStates.message,
                );
            msgsend[msg.key] = msg.message;
        }
        await this.providerController.sendToNotifications(
            { msgs: msgsend, obj: this },
            override ? 'new' : action,
            activeWarnings,
        );

        this.newMessage = false;
        return false;
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
    addFormatedDefinition(
        key: keyof customformatedKeysJsonataDefinition,
        arg: customFormatedKeysDefSubtype | undefined,
    ): void {
        if (arg === undefined) return;
        if (!this.formatedKeysJsonataDefinition) this.formatedKeysJsonataDefinition = {};
        this.formatedKeysJsonataDefinition[key] = arg;
    }
    //async init(msg: any): Promise<void> {}
}
export class NotificationClass extends BaseClass {
    options: notificationServiceBaseType;
    takeThemAll = false;
    config: notificationServiceConfigType;

    clearAll(): void {}
    async writeNotifications(): Promise<void> {}

    constructor(adapter: WeatherWarnings, notifcationOptions: notificationServiceBaseType) {
        super(adapter, notifcationOptions.name);
        this.options = notifcationOptions;
        this.config = serciceCapabilities[notifcationOptions.name];
    }
    /**
     *  Send this message after filtering to services
     * @param messages the message with MessageClassRef Ref can be null
     * @param action <string>
     * @param activeWarnings <boolean> if there are more active messages
     * @returns
     */
    async sendNotifications(
        messages: notificationMessageType,
        action: notificationTemplateUnionType,
        activeWarnings: boolean,
    ): Promise<boolean> {
        if (this.config.notifications.indexOf(action) == -1) return false;
        if (
            !messages.obj ||
            !messages.obj.provider ||
            (this.options.service.indexOf(messages.obj.provider.service) != -1 &&
                (this.options.filter.level === undefined || this.options.filter.level <= messages.obj.level) &&
                this.options.filter.type.indexOf(String(messages.obj.type)) == -1)
        ) {
            if (this.options.template[action] == 'none' || this.options.template[action] == '') return false;
            const msg = messages.msgs[this.options.template[action]];
            if (msg == '') return false;

            switch (this.name as notificationServiceType) {
                case 'telegram':
                    {
                        const opt = { text: msg, disable_notification: true };
                        if (action !== 'remove' || activeWarnings)
                            this.adapter.sendTo(this.options.adapter, 'send', opt, () => {
                                this.log.debug(`Send the message: ${msg}`);
                            });
                    }
                    break;
                case 'pushover':
                    {
                        const opt = { text: msg, disable_notification: true };
                        //newMsg.title = topic;newMsg.device
                        if (action !== 'remove' || activeWarnings)
                            this.adapter.sendTo(this.options.adapter, 'send', opt, () => {
                                this.log.debug(`Send the message: ${msg}`);
                            });
                    }
                    break;
                case 'whatsapp':
                    {
                        const service = this.options.adapter.replace('whatsapp', 'whatsapp-cmb');
                        // obj.message.phone
                        const opt = { text: msg };
                        if (action !== 'remove' || activeWarnings)
                            this.adapter.sendTo(service, 'send', opt, () => {
                                this.log.debug(`Send the message: ${msg}`);
                            });
                    }
                    break;
                case 'history':
                    {
                        if (!messages.obj || !messages.obj.provider || !this.adapter.config.history_Enabled)
                            return false;
                        let newMsg = msg;
                        if (this.adapter.config.history_allinOne) {
                            newMsg = JSON.stringify(messages.obj.formatedData);
                        }
                        const targets = [messages.obj.provider.name, messages.obj.provider.providerController.name];
                        for (const a in targets) {
                            try {
                                const dp = `${targets[a]}.history`;
                                const state = this.adapter.library.getdb(dp);
                                let json: object[] = [];
                                if (state && state.val && typeof state.val == 'string' && state.val != '')
                                    json = JSON.parse(state.val);
                                json.unshift(JSON.parse(newMsg));
                                json.splice(500);
                                await this.adapter.library.writedp(
                                    dp,
                                    JSON.stringify(json),
                                    genericStateObjects.history,
                                );
                            } catch (error) {
                                this.log.error(
                                    `${this.name} template has wrong formate. ${this.name} deactivated! template: ${this.options.template[action]}, message: ${msg}`,
                                );
                                this.adapter.config.history_Enabled = false;
                                return false;
                            }
                        }
                    }
                    break;
                case 'json':
                    {
                    }
                    break;
                case 'email':
                    {
                    }
                    break;
            }
            return true;
        }
        return false;
    }
}
export class AllNotificationClass extends NotificationClass {
    providerDB: { [key: string]: { starttime: number; msg: string | object }[] };
    constructor(adapter: WeatherWarnings, options: notificationServiceBaseType) {
        super(adapter, options);
        this.providerDB = {};
        this.takeThemAll = true;
        this.adapter.providerController &&
            this.adapter.providerController.provider.forEach((a) => (this.providerDB[a.name] = []));
    }
    clearAll(): void {
        for (const l in this.providerDB) {
            this.providerDB[l] = [];
        }
    }

    async sendNotifications(
        messages: notificationMessageType,
        action: notificationTemplateUnionType,
        activeWarnings: boolean,
    ): Promise<boolean> {
        if (await super.sendNotifications(messages, action, activeWarnings)) {
            const msg = messages.msgs[this.options.template[action]];

            switch (this.name as notificationServiceType) {
                case 'json':
                case 'email':
                    {
                        try {
                            if (action == 'remove' && !activeWarnings) return false;
                            const json = this.name == 'json' && this.adapter.config.json_parse ? JSON.parse(msg) : msg;
                            if (messages.obj && messages.obj.provider) {
                                if (
                                    this.providerDB[messages.obj.provider.name] === undefined ||
                                    !Array.isArray(this.providerDB[messages.obj.provider.name])
                                ) {
                                    this.providerDB[messages.obj.provider.name] = [];
                                }
                                this.log.debug(
                                    `sendNotifications(1): from: ${messages.obj.provider.name}, message:${msg}`,
                                );

                                this.providerDB[messages.obj.provider.name].push({
                                    starttime: messages.obj.starttime,
                                    msg: json,
                                });
                            } else {
                                if (action == 'removeAll') {
                                    for (const p in this.providerDB) {
                                        this.providerDB[p] = [{ starttime: Date.now(), msg: json }];
                                    }
                                }
                                this.log.debug('sendNotifications(2): removeAll: ' + msg);
                            }
                        } catch (error) {
                            this.log.error(
                                `Json template has wrong formate. Conversion deactivated! template: ${this.options.template[action]}, message: ${msg}`,
                            );
                            this.adapter.config.json_parse = false;
                            return false;
                        }
                    }
                    break;
            }
            return true;
        }
        return false;
    }
    async writeNotifications(msg: string = ''): Promise<void> {
        switch (this.name as notificationServiceType) {
            case 'json':
                {
                    let all: { starttime: number; msg: string | object }[] = [];
                    for (const name in this.providerDB) {
                        all = all.concat(this.providerDB[name]);
                        const prefix = name + '.activeWarnings_json';
                        this.adapter.library.writedp(
                            prefix,
                            JSON.stringify(
                                this.providerDB[name].length > 0 ? this.providerDB[name].map((a) => a.msg) : [msg],
                            ),
                            genericStateObjects.activeWarningsJson,
                        );
                    }
                    all = all.filter((item, pos) => {
                        return all.indexOf(item) == pos;
                    });
                    all.sort((a, b) => a.starttime - b.starttime);
                    if (this.adapter.providerController) {
                        this.adapter.library.writedp(
                            this.adapter.providerController.name + '.activeWarnings_json',
                            JSON.stringify(all.length > 0 ? all.map((a) => a.msg) : [msg]),
                            genericStateObjects.activeWarningsJson,
                        );
                    }
                }
                break;
            case 'email':
                {
                    let all: { starttime: number; msg: string | object }[] = [];
                    for (const name in this.providerDB) {
                        all = all.concat(this.providerDB[name]);
                    }
                    all.sort((a, b) => a.starttime - b.starttime);
                    let flat: string[] = all.map((a) => a.msg as string);
                    flat = flat.filter((a, pos) => {
                        return flat.indexOf(a) == pos;
                    });
                    const message = flat.join(this.adapter.config.email_line_break);
                    this.adapter.sendTo(this.options.adapter, 'send', message, () => {
                        this.log.debug(`Send the message: ${msg}`);
                    });
                }
                break;
        }
    }
}
