type providerServices = 'dwdService' | 'zamgService' | 'ninaService' | 'uwzService' | 'metroService';

type dataImportDwdType = null | {
    type: string;
    features: [
        {
            type: string;
            id: string;
            geometry: {
                type: string;
                coordinates: number[][][][];
            };
            properties: dataImportDwdFlatType;
            geometry_name: string;
            bbox: number[];
        },
    ];
    totalFeatures: number;
    numberMatched: number;
    numberReturned: number;
    timeStamp: string;
    crs: {
        type: string;
        properties: {
            name: string;
        };
    };
};

type dataImportDwdFlatType = {
    AREADESC: string;
    NAME: string;
    WARNCELLID: number;
    IDENTIFIER: string;
    SENDER: string;
    SENT: string;
    STATUS: string;
    MSGTYPE: string;
    SOURCE: string;
    SCOPE: string;
    CODE: string;
    LANGUAGE: string;
    CATEGORY: string;
    EVENT: string;
    RESPONSETYPE: string;
    URGENCY: string;
    SEVERITY: string;
    CERTAINTY: string;
    EC_PROFILE: string;
    EC_LICENSE: string;
    EC_II: string;
    EC_GROUP: string;
    EC_AREA_COLOR: string;
    EFFECTIVE: string;
    ONSET: string;
    EXPIRES: string;
    SENDERNAME: string;
    HEADLINE: string;
    DESCRIPTION: string;
    INSTRUCTION: string;
    WEB: string;
    CONTACT: string;
    PARAMETERNAME: string;
    PARAMETERVALUE: string;
    ALTITUDE: number;
    CEILING: number;
};

export interface dataImportUWZType {
    center: string;
    areaID: string;
    dtgEnd: number;
    areaType: string;
    dtgStart: number;
    payload: dataImportUWZTypePayload;
    severity: number;
    type: number;
}

interface dataImportUWZTypePayload {
    translationsLongText: dataImportUWZTypePayloadTranslationsLongText;
    id: string;
    creation: number;
    uwzLevel: number;
    translationsShortText: dataImportUWZTypePayloadTranslationsShortText;
    fileName: string;
    levelName: string;
    shortText: string;
    longText: string;
    altMin: number;
    altMax: number;
}

interface dataImportUWZTypePayloadTranslationsLongText {
    DE: string;
}

interface dataImportUWZTypePayloadTranslationsShortText {
    DE: string;
}
type dataImportConvert = {
    convert: string;
    source?: string;
};

export type DataImportType = void | null | undefined | dataImportDwdType;

export type DataDbConvertType = null | undefined | dbDataImportDwd;

interface dbDataImportDwd {
    start: dataImportConvert;
    end: dataImportConvert;
    ec_ii_type: string;
    picture: string;
    level: string;
    areaID: string;
    altitudeStart: string;
    altitudeEnd: string;
    messageHash?: dataImportConvert;
    typename: dataImportConvert;
    description: string;
    headline: string;
    instruction: string;
    urgency: string;
    last_seen: dataImportConvert;
}

/*const dataImport: DataImportType = {
    dwdService: {
        out: {
            start: { convert: 'getDateObject', source: 'ONSET' },
            end: { convert: 'getDateObject', source: 'EXPIRES' },
            ec_ii_type: 'EC_II',
            picture: '',
            level: 'SEVERITY',
            areaID: 'AREADESC',
            altitudeStart: 'ALTITUDE',
            altitudeEnd: 'CEILING',
            messageHash: { convert: 'messageHash' },
            typename: { convert: 'warningTypesString', source: 'CATEGORY' },
            description: 'DESCRIPTION',
            headline: 'HEADLINE',
            instruction: 'INSTRUCTION',
            urgency: 'URGENCY',
            last_seen: { convert: 'last_seen' },
        },
    },
};*/

export interface db_types {
    start: number;
    end: number;
    ec_ii_type: number;
    picture: string;
    level: number;
    areaID: string;
    altitudeStart: number;
    altitudeEnd: number;
    web: string;
    webname: string;
    messageHash: number;
    typename: string;
    description: string;
    headline: string;
    instruction: string;
    urgency: string;
    last_seen: number;
}

export { providerServices };
