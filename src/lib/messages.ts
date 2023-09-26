import WeatherWarnings from '../main';
import { genericStateObjects, statesObjectsWarnings } from './def/definitionen';
import { textLevels, warnTypeName } from './def/messages-def';
import { dwdLevel } from './def/messages-def';
import { level } from './def/messages-def';
import { color } from './def/messages-def';
import { customFormatedKeysDef } from './def/messages-def';
import { BaseClass, Library } from './library';
import { ProvideClassType } from './provider';

/**
 * bla
 */
export class Messages extends BaseClass {
    provider: ProvideClassType;
    library: Library;
    formatedKeysJsonataDefinition: customformatedKeysJsonataDefinition = {};
    formatedData: customFormatedKeysInit;
    rawWarning: any;
    /** message is a new message */
    newMessage: boolean = true;
    /** message got a update lately */
    updated: boolean = false;
    /**dont delete this message */
    notDeleted: boolean = true;

    messages: { message: string; key: string }[] = [];
    /** jsonata/typscript cmd to gather data from warning json */
    formatedKeyCommand: { [key: string]: customformatedKeysJsonataDefinition } = {
        dwdService: {
            startunixtime: { node: `$toMillis(ONSET)` },
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
            ceiling: { node: `$floor(CEILING * 0.3048)` }, // max höhe
            altitude: { node: `$floor(ALTITUDE * 0.3048)` }, // min höhe
            warnlevelcolorhex: {
                node: `($temp := $lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
                    color.generic,
                )},$string($temp)))`,
            }, // RGB im Hexformat
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
        },

        uwzService: {
            startunixtime: { node: `$number(dtgStart)` },
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
            ceiling: { node: `payload.altMin` }, // max höhe
            altitude: { node: `payload.altMax` }, // min höhe
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
        },
        zamgService: {
            startunixtime: { node: `$number(rawinfo.start)` },
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
            ceiling: { node: `` }, // max höhe
            altitude: { node: `` }, // min höhe
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
            ceiling: { node: `` }, // max höhe
            altitude: { node: `` }, // min höhe
            warnlevelname: { node: `` },
            warnlevelnumber: { node: `` },
            warnlevelcolorhex: { node: `` },
            warnlevelcolorname: { node: `` },
            warntypename: { node: `` },
            location: { node: `` },
            instruction: { node: `` },
        },
    };
    constructor(adapter: WeatherWarnings, name: string, provider: ProvideClassType, data: object) {
        super(adapter, name);

        if (provider === null) {
            throw new Error(`${this.log.getName()} provider is null`);
        }
        if (!data) {
            throw new Error(`${this.log.getName()} data is null`);
        }

        this.provider = provider;
        this.library = this.adapter.library;
        this.rawWarning = data;

        switch (provider.service) {
            case `dwdService`:
            case `uwzService`:
            case `zamgService`:
                const json = this.formatedKeyCommand[provider.service];
                for (const k in json) {
                    const key = k as keyof customFormatedKeysDef;
                    const data = this.formatedKeyCommand[provider.service][key];
                    this.addFormatedDefinition(key, data);
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
        return await this.updateFormatedData(true);
    }

    async formatMessages(): Promise<void> {
        if (!this.formatedData) return;
        const templates = this.adapter.config.templateTable;
        const messages: { message: string; key: string }[] = [];
        for (const a in templates) {
            const template = templates[a].template;
            if (!template) continue;
            const temp = template.split('${');
            let msg: string = temp[0];
            for (let b = 1; temp.length > b; b++) {
                const token = temp[b];
                const t = token.split('}');
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
            messages.push({ key: templates[a].templateKey, message: msg });
        }
        this.messages = messages;
    }

    async updateFormatedData(update: boolean = false): Promise<customFormatedKeysResult> {
        if (!this.rawWarning && !this.formatedData) {
            throw new Error(`${this.log.getName()} rawWarning and formatedDate empty!`);
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

                    let result = (await this.library.readWithJsonata(
                        this.rawWarning,
                        cmd,
                    )) as keyof customFormatedKeysDef;
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
                return new Date(data as string | number | Date).toLocaleDateString('de-DE', { weekday: 'long' });
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
    async sendMessage(override = false): Promise<number> {
        if ((!this.newMessage && !override) || this.messages.length == 0 || !this.notDeleted) return 0;
        for (let a = 0; a < this.messages.length; a++) {
            const msg = this.messages[a];
            this.library.writedp(
                `${this.provider.name}.messages.${msg.key}`,
                msg.message,
                genericStateObjects.messageStates.message,
            );
        }
        return 1;
    }
    delete(): void {
        this.notDeleted = false;
        this.newMessage = false;
        this.updated = false;
    }
    async writeFormatedKeys(index: number): Promise<void> {
        if (this.notDeleted) {
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

type ChangeTypeOfKeys<Obj, newKey> = Obj extends object
    ? { [K in keyof Obj]: ChangeTypeOfKeys<Obj[K], newKey> }
    : newKey;

export type customformatedKeysJsonataDefinition = ChangeTypeOfKeys<customFormatedKeysDef, customFormatedKeysDefSubtype>;
export type customFormatedKeysInit = ChangeTypeOfKeys<customFormatedKeysDef, string | number | undefined> | undefined;
export type customFormatedKeysResult = ChangeTypeOfKeys<customFormatedKeysDef, string | number | undefined>;
/*
export type customformatedKeysJsonataDefinition = {
    starttime: customFormatedKeysDefSubtype;
    startdate: customFormatedKeysDefSubtype;
    endtime: customFormatedKeysDefSubtype;
    enddate: customFormatedKeysDefSubtype;
    startdayofweek: customFormatedKeysDefSubtype;
    enddayofweek: customFormatedKeysDefSubtype;
    headline: customFormatedKeysDefSubtype;
    description: customFormatedKeysDefSubtype;
    weathertext?: customFormatedKeysDefSubtype;
    ceiling: customFormatedKeysDefSubtype; // max höhe
    altitude: customFormatedKeysDefSubtype; // min höhe
    warnlevelname: customFormatedKeysDefSubtype;
    warnlevelnumber: customFormatedKeysDefSubtype;
    warnlevelcolor: customFormatedKeysDefSubtype; // RGB im Hexformat
    warntypename: customFormatedKeysDefSubtype;
    location: customFormatedKeysDefSubtype;
};*/

type customFormatedKeysDefSubtype = { cmd?: 'dayoftheweek' | 'translate'; node: string };
