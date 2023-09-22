import WeatherWarnings from '../main';
import { BaseClass } from './library';
import { ProvideClassType } from './provider';

/**
 * Conversion jsons as a tool for formatedKeys.
 */
const color = {
    generic: {
        0: `#00ff00`, // 0 - Grün
        1: `#00ff00`, // 1 - Dunkelgrün
        2: `#fffc04`, // 2 - Gelb Wetterwarnungen (Stufe 2)
        3: `#ffb400`, // 3 - Orange Warnungen vor markantem Wetter (Stufe 3)
        4: `#ff0000`, // 4 - Rot Unwetterwarnungen (Stufe 4) // im grunde höchste Stufe in diesem Skript.
        5: `#ff00ff`, // 5 - Violett Warnungen vor extremem Unwetter (nur DWD/ Weltuntergang nach aktueller Erfahrung)
    },
    zamgColor: {
        0: `#00ff00`, // 0 - Grün
        1: `#01DF3A`,
        3: `#ffc400`,
        4: `#ff0404`,
    },
};
const level = {
    uwz: { green: 0, darkgreen: 0, yellow: 1, orange: 2, red: 3, violet: 4 },
};
const dwdLevel = { minor: 1, moderate: 2, severe: 3, extreme: 4 };

/**
 * bla
 */
export class messages extends BaseClass {
    provider: ProvideClassType;

    formatedKeysJsonataDefinition: customFormatedKeysDef;

    constructor(adapter: WeatherWarnings, name: string, provider: ProvideClassType) {
        super(adapter, name);

        if (!provider) {
            throw new Error(`${this.log.getName()} provider is null`);
        }

        this.provider = provider;

        switch (provider.service) {
            case 'dwdService':
                this.formatedKeysJsonataDefinition = {
                    starttime: '$fromMillis($toMillis(properties.ONSET),"[H#1]:[M01]")',
                    startdate: '$fromMillis($toMillis(properties.ONSET),"[D01].[M01]")',
                    endtime: '$fromMillis($toMillis(properties.EXPIRES),"[H#1]:[M01]")',
                    enddate: '$fromMillis($toMillis(properties.EXPIRES),"[D01].[M01]")',
                    startdayofweek: '$fromMillis($toMillis(properties.ONSET),"[F]")',
                    enddayofweek: '$fromMillis($toMillis(properties.EXPIRES),"[F]")',
                    headline: 'properties.HEADLINE',
                    description: 'properties.DESCRIPTION',
                    weathertext: '',
                    ceiling: 'properties.CEILING * 0.3048', // max höhe
                    altitude: 'properties.ALTITUDE * 0.3048', // min höhe
                    warnlevelname: 'properties.SEVERITY',
                    warnlevelnumber: `$lookup(${JSON.stringify(dwdLevel)},$lowercase(properties.SEVERITY))`,
                    warnlevelcolor: '', // RGB im Hexformat
                    warntypename: 'properties.EC_GROUP',
                    location: 'properties.AREADESC',
                };

                this.formatedKeysJsonataDefinition.warnlevelcolor = `$lookup(${JSON.stringify(color.generic)},${
                    this.formatedKeysJsonataDefinition.warnlevelnumber
                })`; // RGB im Hexformat

                break;

            case 'uwzService':
                this.formatedKeysJsonataDefinition = {
                    starttime: '$fromMillis(dtgStart,"[H#1]:[M01]")',
                    startdate: '$fromMillis(dtgStart,"[D01].[M01]")',
                    endtime: '$fromMillis(dtgEnd,"[H#1]:[M01]")',
                    enddate: '$fromMillis(dtgEnd,"[D01].[M01]")',
                    startdayofweek: '$fromMillis(dtgStart,"[F]")',
                    enddayofweek: '$fromMillis(dtgEnd,"[F]")',
                    headline: 'payload.translationsShortText',
                    description: 'payload.translationsLongText',
                    weathertext: '',
                    ceiling: 'payload.altMin', // max höhe
                    altitude: 'payload.altMax', // min höhe
                    warnlevelname: '',
                    warnlevelnumber: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : lookup(${JSON.stringify(
                        level.uwz,
                    )}, $i[2]))`,
                    warnlevelcolor: '',
                    warntypename: 'type',
                    location: 'areaID',
                };

                this.formatedKeysJsonataDefinition.warnlevelcolor = `$lookup(${JSON.stringify(color.generic)},${
                    this.formatedKeysJsonataDefinition.warnlevelnumber
                }`; // RGB im Hexformat

                break;

            default:
                this.formatedKeysJsonataDefinition = {
                    starttime: ``,
                    startdate: ``,
                    endtime: ``,
                    enddate: ``,
                    startdayofweek: ``,
                    enddayofweek: ``,
                    headline: ``,
                    description: ``,
                    weathertext: ``,
                    ceiling: ``, // max höhe
                    altitude: ``, // min höhe
                    warnlevelname: ``,
                    warnlevelnumber: ``,
                    warnlevelcolor: ``,
                    warntypename: ``,
                    location: ``,
                };
        }
    }
    //async init(msg: any): Promise<void> {}
}

export type customFormatedKeysDef = {
    starttime: string;
    startdate: string;
    endtime: string;
    enddate: string;
    startdayofweek: string;
    enddayofweek: string;
    headline: string;
    description: string;
    weathertext?: string;
    ceiling: string; // max höhe
    altitude: string; // min höhe
    warnlevelname: string;
    warnlevelnumber: string;
    warnlevelcolor: string; // RGB im Hexformat
    warntypename: string;
    location: string;
};
