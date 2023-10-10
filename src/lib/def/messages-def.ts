import { MessagesClass } from '../messages';
import { customChannelType } from './definitionen';

/** Bezeichnungen die in Template verwendet werden können ohne "?:string;""
 * Erste Buchstabe großgeschrieben erzeugt auch im Ergebnis, das der erste Buchstabe großgeschrieben ist.
 * Ist der letzte Buchstabe großgeschrieben, wird die komplette Zeichenkette in Großbuchstaben umgewandelt.
 */
export type customFormatedTokens = {
    starttime: string; // Start Uhrzeit HH:MM
    startdate: string; // Start Datum DD.MM
    endtime: string; // Endzeitpunkt
    enddate: string; // Enddatum
    startdayofweek: string; // Start Tag der Woche
    enddayofweek: string; // End Tag der Woche
    startdayofweekshort: string; // Start Tag der Woche (kurz)
    enddayofweekshort: string; // End Tag der Woche (kurz)
    headline: string; // Schlagzeile
    description: string; // Beschreibung
    weathertext: string; // nur Zamg wetterbeschreibender Text
    ceiling: string; // max höhe
    altitude: string; // min höhe
    warnlevelname: string; // Textbezeichnung des Levels
    warnlevelnumber: string; // Levelhöhe
    warnlevelcolorname: string; // Farbbezeichnung des Levels
    warnlevelcolorhex: string; // RGB im Hexformat
    warntypename: string; // gelieferter Warntype
    warntypegenericname: string; // vereinheitlichter Warntyp
    location: string; // gelieferte Location (meinst Unsinn)
    instruction: string; // Anweisungen
    provider: string;
    locationcustom: string;
    countdown: string;
    status: string;
};

export const customFormatedTokensJson: customFormatedTokens = {
    starttime: 'Start time', // Start Uhrzeit HH:MM
    startdate: 'Start date', // Start Datum DD.MM
    endtime: 'End time', // Endzeitpunkt
    enddate: 'End Date', // Enddatum
    startdayofweek: 'Start day of the week', // Start Tag der Woche
    enddayofweek: 'End day of the week', // End Tag der Woche
    startdayofweekshort: 'Start day of the week short', // Start Tag der Woche (kurz)
    enddayofweekshort: 'End day of the week short', // End Tag der Woche (kurz)
    headline: 'Headline', // Schlagzeile
    description: 'Description', // Beschreibung
    weathertext: 'Weathertext', // nur Zamg wetterbeschreibender Text
    ceiling: 'Maximum validity height', // max höhe
    altitude: 'Minimum validity height', // min höhe
    warnlevelname: 'Textname of level', // Textbezeichnung des Levels
    warnlevelnumber: 'Number of level', // Levelhöhe
    warnlevelcolorname: 'Textname of level color', // Farbbezeichnung des Levels
    warnlevelcolorhex: 'Hexnumber of level color', // RGB im Hexformat
    warntypename: 'Warning type retrieved from the provider', // gelieferter Warntype
    warntypegenericname: 'Warntype generic', // vereinheitlichter Warntyp
    location: 'Location retrieved from the provider', // gelieferte Location (meinst Unsinn)
    instruction: 'Instructions', // Anweisungen
    provider: 'Provider',
    locationcustom: 'Location from admin configuration',
    countdown: 'Remaining time until the start of the warning.',
    status: 'Status of warning. new, hold, all clear',
};
//{ "headline":"${headline}", "start": "${starttime}", "ende": "${endtime}", "startdayofweek": "${startdayofweek}", "warnlevelcolorname": "${warnlevelcolorname}", "warntypename":"${warntypename}" \}
export type customFormatedKeysDef = Partial<customFormatedTokens>;
/* Conversion jsons as a tool for formatedKeys.*/

export const textLevels = {
    textGeneric: {
        '0': 'textLevels.textGeneric.0',
        '1': 'textLevels.textGeneric.1',
        '2': 'textLevels.textGeneric.2',
        '3': 'textLevels.textGeneric.3',
        '4': 'textLevels.textGeneric.4',
        '5': 'textLevels.textGeneric.5',
    },
};
export const color = {
    generic: {
        0: `#00ff00`,
        1: `#00ff00`,
        2: `#fffc04`,
        3: `#ffb400`,
        4: `#ff0000`,
        5: `#ff00ff`, // 5 - Violett Warnungen vor extremem Unwetter (nur DWD/ Weltuntergang nach aktueller Erfahrung)
    },
    zamgColor: {
        0: `#00ff00`,
        1: `#00ff00`,
        2: `#01DF3A`,
        3: `#ffc400`,
        4: `#ff0404`,
    },
    textGeneric: {
        '0': 'color.textGeneric.0',
        '1': 'color.textGeneric.1',
        '2': 'color.textGeneric.2',
        '3': 'color.textGeneric.3',
        '4': 'color.textGeneric.4',
        '5': 'color.textGeneric.5',
    },
};

type ChangeTypeOfKeys<Obj, N> = Obj extends object ? { [K in keyof Obj]-?: ChangeTypeOfKeys<Obj[K], N> } : N;
type ChangeTypeOfKeysOptional<Obj, N> = Obj extends object ? { [K in keyof Obj]+?: ChangeTypeOfKeys<Obj[K], N> } : N;

export const genericWarntypState: genericWarntypeStatesType = {
    level: {
        _id: '',
        type: 'state',
        common: {
            name: 'Level of warning as number',
            type: 'number',
            role: '',
            read: true,
            write: false,
        },
        native: {},
    },
    start: {
        _id: '',
        type: 'state',
        common: {
            name: 'Start time of warning',
            type: 'string',
            role: 'date',
            read: true,
            write: false,
        },
        native: {},
    },
    end: {
        _id: '',
        type: 'state',
        common: {
            name: 'End time of warning',
            type: 'string',
            role: 'date',
            read: true,
            write: false,
        },
        native: {},
    },
    headline: {
        _id: '',
        type: 'state',
        common: {
            name: 'Headline of warning.',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
    type: {
        _id: '',
        type: 'state',
        common: {
            name: 'Warntype as number.',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
        native: {},
    },
    active: {
        _id: '',
        type: 'state',
        common: {
            name: 'Now is between start and end.',
            type: 'boolean',
            role: 'indicator',
            read: true,
            write: false,
        },
        native: {},
    },
};
export function isKeyOfObject<T extends object>(key: string | number | symbol, obj: T): key is keyof T {
    return key in obj;
}
type genericWarntypeStatesType = ChangeTypeOfKeys<genericWartypeAlertType, ioBroker.StateObject>;
type genericWartypeAlertType = {
    level: number;
    start: number;
    end: number;
    headline: string;
    type: number;
    active: boolean;
};
export type genericWarntypeAlertJsonType = ChangeTypeOfKeysOptional<
    genericWarnTypNameJsonType,
    genericWartypeAlertType
>;
export type genericWarntypStatesTree = ChangeTypeOfKeys<
    genericWarnTypNameJsonType,
    genericWarntypeStatesType & customChannelType
>;
export type genericWarntypeNumberType = 10 | 7 | 2 | 4 | 3 | 8 | 9 | 5 | 6 | 11 | 12 | 1;

export type genericWarntypeType = Record<Required<genericWarntypeNumberType>, genericWarntypeTypeSub>;

type genericWarntypeTypeSub = {
    name: string;
    dwdService: number[];
    uwzService: number[];
    zamgService: number[];
    metroService?: number[];
    ninaService?: number[];
    id: keyof genericWarnTypNameJsonType;
};
//type genericWarnTypNumberType = keyof genericWarntypeType;

type genericWarnTypNameJsonType = {
    unknown: string;
    storm: string;
    snowfall: string;
    rain: string;
    cold: string;
    forest_fire: string;
    thunderstorm: string;
    black_ice_slippery: string;
    heat: string;
    hail: string;
    fog: string;
    thaw: string;
};
export type notificationMessageType = {
    msgs: { [key: string]: string };
    obj: MessagesClass | null;
};
/*type genericWarnTypNameType =
    | 'unknown'
    | 'storm'
    | 'snowfall'
    | 'rain'
    | 'cold'
    | 'forest fire'
    | 'thunderstorm'
    | 'black ice/slippery'
    | 'heat'
    | 'hail'
    | 'fog'
    | 'thaw';*/
export const genericWarntyp: genericWarntypeType = {
    '1': { name: 'genericWarntyp.1.name', id: 'unknown', dwdService: [], uwzService: [0, 1], zamgService: [0, 8] },
    '2': {
        name: 'genericWarntyp.2.name',
        id: 'storm',
        dwdService: [40, 41, 44, 45, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 96, 79],
        uwzService: [2],
        zamgService: [1],
    },
    '3': {
        name: 'genericWarntyp.3.name',
        id: 'snowfall',
        dwdService: [70, 71, 72, 73, 74, 75, 76],
        uwzService: [3],
        zamgService: [3],
    },
    '4': {
        name: 'genericWarntyp.4.name',
        id: 'rain',
        dwdService: [96, 95, 66, 65, 64, 63, 62, 61, 59, 49, 48, 46, 45, 44, 42],
        uwzService: [4],
        zamgService: [2],
    },
    '5': { name: 'genericWarntyp.5.name', id: 'cold', dwdService: [82, 22], uwzService: [10, 11, 5], zamgService: [7] },
    '6': { name: 'genericWarntyp.6.name', id: 'forest_fire', dwdService: [], uwzService: [6], zamgService: [] },
    '7': {
        name: 'genericWarntyp.7.name',
        id: 'thunderstorm',
        dwdService: [90, 91, 92, 93, 95, 96, 31, 33, 34, 36, 38, 40, 41, 42, 44, 45, 46, 48, 49],
        uwzService: [7],
        zamgService: [5],
    },
    '8': {
        name: 'genericWarntyp.8.name',
        id: 'black_ice_slippery',
        dwdService: [87, 85, 84, 24],
        uwzService: [8],
        zamgService: [4],
    },
    '9': { name: 'genericWarntyp.9.name', id: 'heat', dwdService: [247, 248], uwzService: [9], zamgService: [6] },
    '10': {
        name: 'genericWarntyp.10.name',
        id: 'hail',
        dwdService: [95, 96, 45, 46, 48, 49],
        uwzService: [],
        zamgService: [],
    },
    '11': { name: 'genericWarntyp.11.name', id: 'fog', dwdService: [59], uwzService: [], zamgService: [] },
    '12': { name: 'genericWarntyp.12.name', id: 'thaw', dwdService: [88, 89], uwzService: [], zamgService: [] },
};
export const warnTypeName = {
    uwzService: {
        '0': 'warnTypeName.uwzService.0',
        '1': 'warnTypeName.uwzService.1',
        '2': 'warnTypeName.uwzService.2',
        '3': 'warnTypeName.uwzService.3',
        '4': 'warnTypeName.uwzService.4',
        '5': 'warnTypeName.uwzService.5',
        '6': 'warnTypeName.uwzService.6',
        '7': 'warnTypeName.uwzService.7',
        '8': 'warnTypeName.uwzService.8',
        '9': 'warnTypeName.uwzService.9',
        '10': 'warnTypeName.uwzService.10',
        '11': 'warnTypeName.uwzService.11',
    },
    zamgService: {
        '0': 'warnTypeName.zamgService.0',
        '1': 'warnTypeName.zamgService.1',
        '2': 'warnTypeName.zamgService.2',
        '3': 'warnTypeName.zamgService.3',
        '4': 'warnTypeName.zamgService.4',
        '5': 'warnTypeName.zamgService.5',
        '6': 'warnTypeName.zamgService.6',
        '7': 'warnTypeName.zamgService.7',
        '8': 'warnTypeName.zamgService.8',
    },
    dwdService: {
        '22': 'warnTypeName.dwdService.22',
        '24': 'warnTypeName.dwdService.24',
        '31': 'warnTypeName.dwdService.31',
        '33': 'warnTypeName.dwdService.33',
        '34': 'warnTypeName.dwdService.34',
        '36': 'warnTypeName.dwdService.36',
        '38': 'warnTypeName.dwdService.38',
        '40': 'warnTypeName.dwdService.40',
        '41': 'warnTypeName.dwdService.41',
        '42': 'warnTypeName.dwdService.42',
        '44': 'warnTypeName.dwdService.44',
        '45': 'warnTypeName.dwdService.45',
        '46': 'warnTypeName.dwdService.46',
        '48': 'warnTypeName.dwdService.48',
        '49': 'warnTypeName.dwdService.49',
        '51': 'warnTypeName.dwdService.51',
        '52': 'warnTypeName.dwdService.52',
        '53': 'warnTypeName.dwdService.53',
        '54': 'warnTypeName.dwdService.54',
        '55': 'warnTypeName.dwdService.55',
        '56': 'warnTypeName.dwdService.56',
        '57': 'warnTypeName.dwdService.57',
        '58': 'warnTypeName.dwdService.58',
        '59': 'warnTypeName.dwdService.59',
        '61': 'warnTypeName.dwdService.61',
        '62': 'warnTypeName.dwdService.62',
        '63': 'warnTypeName.dwdService.63',
        '64': 'warnTypeName.dwdService.64',
        '65': 'warnTypeName.dwdService.65',
        '66': 'warnTypeName.dwdService.66',
        '70': 'warnTypeName.dwdService.70',
        '71': 'warnTypeName.dwdService.71',
        '72': 'warnTypeName.dwdService.72',
        '73': 'warnTypeName.dwdService.73',
        '74': 'warnTypeName.dwdService.74',
        '75': 'warnTypeName.dwdService.75',
        '76': 'warnTypeName.dwdService.76',
        '79': 'warnTypeName.dwdService.79',
        '82': 'warnTypeName.dwdService.82',
        '84': 'warnTypeName.dwdService.84',
        '85': 'warnTypeName.dwdService.85',
        '87': 'warnTypeName.dwdService.87',
        '88': 'warnTypeName.dwdService.88',
        '89': 'warnTypeName.dwdService.89',
        '90': 'warnTypeName.dwdService.90',
        '91': 'warnTypeName.dwdService.91',
        '92': 'warnTypeName.dwdService.92',
        '93': 'warnTypeName.dwdService.93',
        '95': 'warnTypeName.dwdService.95',
        '96': 'warnTypeName.dwdService.96',
        '98': 'warnTypeName.dwdService.98',
        '99': 'warnTypeName.dwdService.99',
        '247': 'warnTypeName.dwdService.247',
        '248': 'warnTypeName.dwdService.248',
    },
};
/*const genericWarnType = {
    WIND:
}*/
export const level = {
    uwz: { green: 0, darkgreen: 0, yellow: 1, orange: 2, red: 3, violet: 4 },
};
export const dwdLevel = { minor: 1, moderate: 2, severe: 3, extreme: 4 };
/*
40: 'vORABINFORMATION schweres Gewitter',
        55: 'vORABINFORMATION Orkanböen',
        65: 'vORABINFORMATION heftiger / ERGIEBIGER REGEN',
        75: 'vORABINFORMATION starker Schneefall - Schneeverwehung',
        85:'VORABINFORMATION GLATTEIS',
        89: 'vORABINFORMATION starkes Tauwetter',
        99: 'tEST-VORABINFORM ATIO N UNWETTER',
        */

export const status = {
    new: 'message.status.new',
    hold: 'message.status.hold',
    clear: 'message.status.clear',
};
