import WeatherWarnings from '../main';
import { genericStateObjects, statesObjectsWarnings } from './def/definitionen';
import { warnTypeName } from './def/messages-def';
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
    formatedData: customFormatedKeysDef | undefined;
    rawWarning: any;

    newMessage: boolean = true; //display a new message for sending messages
    updated: boolean = false;
    notDeleted: boolean = false;

    messages: { message: string; key: string }[] = [];

    formatedKeyCommand: { [key: string]: customformatedKeysJsonataDefinition } = {
        dwdService: {
            starttime: { jsonata: `$fromMillis($toMillis(ONSET),"[H#1]:[m01]","\${this.timeOffset}")` },
            startdate: { jsonata: `$fromMillis($toMillis(ONSET),"[D01].[M01]","\${this.timeOffset}")` },
            endtime: { jsonata: `$fromMillis($toMillis(EXPIRES),"[H#1]:[m01]","\${this.timeOffset}")` },
            enddate: { jsonata: `$fromMillis($toMillis(EXPIRES),"[D01].[M01]","\${this.timeOffset}")` },
            startdayofweek: {
                typescript: {
                    node: `ONSET`,
                    cmd: 'dayoftheweek',
                },
            },
            enddayofweek: {
                typescript: {
                    node: `EXPIRES`,
                    cmd: 'dayoftheweek',
                },
            },
            headline: { jsonata: `HEADLINE` },
            description: { jsonata: `DESCRIPTION` },
            weathertext: { jsonata: `` },
            ceiling: { jsonata: `$floor(CEILING * 0.3048)` }, // max höhe
            altitude: { jsonata: `$floor(ALTITUDE * 0.3048)` }, // min höhe
            warnlevelcolor: {
                jsonata: `($temp := $lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
                    color.generic,
                )},$string($temp)))`,
            }, // RGB im Hexformat
            warnlevelname: {
                jsonata: `($temp := $lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
                    color.textGeneric,
                )},$string($temp)))`,
            },
            warnlevelnumber: { jsonata: `$lookup(${JSON.stringify(dwdLevel)},$lowercase(SEVERITY))` },

            warntypename: { jsonata: `EC_GROUP` },
            location: { jsonata: `AREADESC` },
        },

        uwzService: {
            starttime: { jsonata: `$fromMillis(dtgStart,"[H#1]:[m01]","\${this.timeOffset}")` },
            startdate: { jsonata: `$fromMillis(dtgStart,"[D01].[M01]","\${this.timeOffset}")` },
            endtime: { jsonata: `$fromMillis(dtgEnd,"[H#1]:[m01]","\${this.timeOffset}")` },
            enddate: { jsonata: `$fromMillis(dtgEnd,"[D01].[M01]","\${this.timeOffset}")` },
            startdayofweek: {
                typescript: {
                    node: `dtgStart`,
                    cmd: 'dayoftheweek',
                },
            },
            enddayofweek: {
                typescript: {
                    node: `dtgEnd`,
                    cmd: 'dayoftheweek',
                },
            },
            headline: { jsonata: `payload.translationsShortText` },
            description: { jsonata: `payload.translationsLongText` },
            weathertext: { jsonata: `` },
            ceiling: { jsonata: `payload.altMin` }, // max höhe
            altitude: { jsonata: `payload.altMax` }, // min höhe
            warnlevelname: {
                jsonata: `$string(($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    level.uwz,
                )}, $i[2]); $lookup(${JSON.stringify(color.textGeneric)},$string($l))))`,
            },
            warnlevelnumber: {
                jsonata: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    level.uwz,
                )}, $i[2]))`,
            },
            warnlevelcolor: {
                jsonata: `$lookup(${JSON.stringify(
                    color.generic,
                )},$string(($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                    level.uwz,
                )}, $i[2]))))`,
            },
            warntypename: { jsonata: `type` },
            location: { jsonata: `areaID` },
        },
        zamgService: {
            starttime: { jsonata: `$fromMillis($number(rawinfo.start),"[H#1]:[m01]","\${this.timeOffset}")` },
            startdate: { jsonata: `$fromMillis($number(rawinfo.start),"[D01].[M01]","\${this.timeOffset}")` },
            endtime: { jsonata: `$fromMillis($number(rawinfo.end),"[H#1]:[m01]","\${this.timeOffset}")` },
            enddate: { jsonata: `$fromMillis($number(rawinfo.end),"[D01].[M01]","\${this.timeOffset}")` },
            startdayofweek: {
                typescript: {
                    node: `$number(rawinfo.start)`,
                    cmd: 'dayoftheweek',
                },
            },
            enddayofweek: {
                typescript: {
                    node: `$number(rawinfo.end)`,
                    cmd: 'dayoftheweek',
                },
            },
            headline: { jsonata: `text` },
            description: { jsonata: `auswirkungen` },
            weathertext: { jsonata: `meteotext` },
            ceiling: { jsonata: `` }, // max höhe
            altitude: { jsonata: `` }, // min höhe
            warnlevelname: { jsonata: `` },
            warnlevelnumber: {
                jsonata: `$string(rawinfo.wlevel)`,
            },
            warnlevelcolor: {
                jsonata: `$lookup(${JSON.stringify(color.zamgColor)},$string(rawinfo.wlevel))`,
            },
            warntypename: { jsonata: `$lookup(${JSON.stringify(warnTypeName.zamgService)},$string(rawinfo.wtype))` },
            location: { jsonata: `` },
            instruction: { jsonata: `empfehlungen` },
        },
        default: {
            starttime: { jsonata: `` },
            startdate: { jsonata: `` },
            endtime: { jsonata: `` },
            enddate: { jsonata: `` },
            startdayofweek: { jsonata: `` },
            enddayofweek: { jsonata: `` },
            headline: { jsonata: `` },
            description: { jsonata: `` },
            weathertext: { jsonata: `` },
            ceiling: { jsonata: `` }, // max höhe
            altitude: { jsonata: `` }, // min höhe
            warnlevelname: { jsonata: `` },
            warnlevelnumber: { jsonata: `` },
            warnlevelcolor: { jsonata: `` },
            warntypename: { jsonata: `` },
            location: { jsonata: `` },
            instruction: { jsonata: `` },
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
                    starttime: { jsonata: `` },
                    startdate: { jsonata: `` },
                    endtime: { jsonata: `` },
                    enddate: { jsonata: `` },
                    startdayofweek: { jsonata: `` },
                    enddayofweek: { jsonata: `` },
                    headline: { jsonata: `` },
                    description: { jsonata: `` },
                    weathertext: { jsonata: `` },
                    ceiling: { jsonata: `` }, // max höhe
                    altitude: { jsonata: `` }, // min höhe
                    warnlevelname: { jsonata: `` },
                    warnlevelnumber: { jsonata: `` },
                    warnlevelcolor: { jsonata: `` },
                    warntypename: { jsonata: `` },
                    location: { jsonata: `` },
                };
        }
    }
    async init(): Promise<customFormatedKeysDef> {
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
                else msg += key;
                if (t.length > 1) msg += t[1];
            }
            messages.push({ key: templates[a].templateKey, message: msg });
        }
        this.messages = messages;
    }
    async updateFormatedData(update: boolean = false): Promise<customFormatedKeysDef> {
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
                if (obj !== undefined && obj.jsonata !== undefined) {
                    // reset the offset because of daylight saving time
                    const cmd = obj.jsonata.replace(`\${this.timeOffset}`, timeOffset);

                    temp[key] = (await this.library.readWithJsonata(
                        this.rawWarning,
                        cmd,
                    )) as keyof customFormatedKeysDef;
                }
            }
            for (const key in this.formatedKeysJsonataDefinition) {
                const obj = this.formatedKeysJsonataDefinition[key as keyof customFormatedKeysDef];
                if (obj !== undefined && obj.typescript !== undefined) {
                    temp[key] = (await this.readWithTypescript(obj.typescript)) as keyof customFormatedKeysDef;
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
    async readWithTypescript(val: { cmd: string; node: string }): Promise<string | number> {
        if (!this.rawWarning && !val) {
            throw new Error('readWithTypescript called without rawWarning or val!');
        }
        const data = (await this.library.readWithJsonata(this.rawWarning, val.node)) as string;
        switch (val.cmd) {
            case 'dayoftheweek': {
                return new Date(data).toLocaleDateString('de-DE', { weekday: 'long' });
            }
        }
        return '';
    }
    updateData(data: object): void {
        this.rawWarning = data;
        this.notDeleted = true;
    }
    silentUpdate(): void {
        this.newMessage = false;
    }
    async sendMessage(override = false): Promise<number> {
        if ((!this.newMessage && !override) || this.messages.length == 0) return 0;
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
        this.library.garbageColleting(`${this.provider.name}.formated`);
    }
    async writeFormatedKeys(index: number): Promise<void> {
        this.library.writeFromJson(
            `${this.provider.name}.formatedKeys.${('00' + index.toString()).slice(-2)}`,
            `allService.formatedkeys`,
            statesObjectsWarnings,
            this.formatedData,
        );
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

type customFormatedKeysDefSubtype = {
    jsonata?: string;
    typescript?: { cmd: 'dayoftheweek'; node: string };
};
