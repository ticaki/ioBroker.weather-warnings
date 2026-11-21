import type * as Provider from '../provider';
export * from '../provider';

/**Available provider identifier strings */
export type providerServices = 'dwdService' | 'zamgService' | 'ninaService' | 'uwzService' | 'metroService';

export const providerServicesArray: providerServices[] = ['dwdService', 'zamgService', 'uwzService', 'ninaService'];
export type ProviderClassType =
    | Provider.DWDProvider
    | Provider.ZAMGProvider
    | Provider.UWZProvider
    | Provider.NINAProvider
    | Provider.METROProvider;

type nullType = null | undefined | void;
export type messageFilterTypeWithFilter = {
    filter: messageFilterType;
};
export type messageFilterType = {
    level?: number;
    type: number[];
    hours: number;
};
/** Full dwd import jsons */
export type dataImportDwdType =
    | nullType
    | {
          type: string;
          features: [
              {
                  type: string;
                  id: string;
                  geometry: {
                      type: string;
                      coordinates: number[][][][];
                  };
                  properties: dataImportDwdTypeProperties;
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

/** dwd import json that we use */
export type dataImportDwdTypeProperties = {
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
    REFERENCES?: string;
    GC_STATE: string;
    GC_WARNCELLID: number;
    INFO_ID: string;
    PROCESSTIME: string;
};
/**Full uwz import json. */
export type dataImportUWZType =
    | nullType
    | {
          results: Array<dataImportUwzTypeProperties>;
          cached: number;
      };
/**uwz import json that we use. */
export type dataImportUwzTypeProperties = {
    center: string;
    areaID: string;
    dtgEnd: number;
    areaType: string;
    dtgStart: number;
    severity: number;
    type: number;
    payload: {
        id: string;
        creation: number;
        uwzLevel: number;
        translationsShortText: {
            FR?: string;
            LU?: string;
            EN?: string;
            ES?: string;
            NL?: string;
            DE?: string;
            IT?: string;
            DK?: string;
        };
        translationsLongText: {
            FR?: string;
            LU?: string;
            EN?: string;
            ES?: string;
            NL?: string;
            DE?: string;
            IT?: string;
            DK?: string;
        };
        fileName: string;
        levelName: string;
        shortText: string;
        longText: string;
        altMin: number;
        altMax: number;
    };
};
/**Full zamg import json */
export type dataImportZamgType =
    | nullType
    | {
          type: string;
          geometry: {
              type: string;
              coordinates: Array<Array<Array<Array<number>>>>;
          };
          properties: {
              location: {
                  type: string;
                  properties: {
                      gemeindenr: number;
                      name: string;
                      urlname: string;
                  };
              };
              warnings: Array<{
                  type: string;
                  properties: dataImportZamgTypeProperties;
              }>;
          };
      };
/**zamg import json that we use. */
export type dataImportZamgTypeProperties = {
    nachrichtentyp?: string;
    location?: string;
    warnid: number;
    chgid: number;
    verlaufid: number;
    warntypid: number;
    begin: string;
    end: string;
    create: string;
    text: string;
    auswirkungen: string;
    empfehlungen: string;
    meteotext: string;
    updategrund: string;
    warnstufeid: number;
    rawinfo: {
        wtype: number;
        wlevel: number;
        start: string;
        end: string;
    };
};
export type dataImportMOWASType = Array<{
    identifier: string;
    sender: string;
    sent: string;
    status: string;
    msgType: string;
    scope: string;
    code: Array<string>;
    info: Array<{
        language: string;
        category: Array<string>;
        event: string;
        urgency: string;
        severity: string;
        certainty: string;
        eventCode: Array<{
            valueName: string;
            value: string;
        }>;
        headline: string;
        description: string;
        instruction: string;
        web?: string;
        contact?: string;
        parameter: Array<{
            valueName: string;
            value: string;
        }>;
        area: Array<{
            areaDesc: string;
            polygon: Array<string>;
            geocode: Array<{
                valueName: string;
                value: string;
            }>;
        }>;
    }>;
}>;

export { ninaSources, ninaDefaultSources, type ninaSourceType } from './nina-def';

/** One entry of `https://warnung.bund.de/api31/dashboard/{ARS}.json`. */
export type dataImportNinaDashboardItem = {
    id: string;
    payload: {
        version: number;
        type: string;
        id: string;
        hash: string;
        data: {
            headline: string;
            provider: string;
            severity: string;
            urgency?: string;
            msgType: string;
            transKeys?: { event?: string };
            valid?: boolean;
        };
    };
    i18nTitle?: Record<string, string>;
    sent: string;
    onset?: string;
    expires?: string;
    effective?: string;
};
export type dataImportNinaDashboardType = dataImportNinaDashboardItem[];

/** CAP info block of `https://warnung.bund.de/api31/warnings/{id}.json`. */
export type dataImportNinaInfo = {
    language: string;
    category?: string[];
    event?: string;
    urgency?: string;
    severity?: string;
    certainty?: string;
    responseType?: string[];
    eventCode?: Array<{ valueName: string; value: string }>;
    headline?: string;
    description?: string;
    instruction?: string;
    senderName?: string;
    web?: string;
    contact?: string;
    onset?: string;
    effective?: string;
    expires?: string;
    parameter?: Array<{ valueName: string; value: string }>;
    area?: Array<{ areaDesc: string }>;
};
/** `https://warnung.bund.de/api31/warnings/{id}.json` */
export type dataImportNinaWarningType = {
    identifier: string;
    sender?: string;
    sent: string;
    status: string;
    msgType: string;
    scope?: string;
    references?: string;
    info: dataImportNinaInfo[];
};

/**
 * Flat, cleaned-up NINA warning as built by the NINA provider out of the dashboard entry and the
 * detail warning. Language chosen, HTML stripped, times in ms. This is the `rawWarning` of a NINA
 * message, so the jsonata expressions in messages.ts stay trivial.
 */
export type dataImportNinaTypeProperties = {
    ID: string;
    VERSION: number;
    SOURCE: string;
    MSGTYPE: string;
    STATUS: string;
    SEVERITY: string;
    URGENCY: string;
    CERTAINTY: string;
    /** BBK event code, e.g. `BBK-EVC-069` */
    EVENTCODE: string;
    /** numeric part of the event code, 999 if unknown */
    TYPE: number;
    /** translated event name */
    EVENT: string;
    HEADLINE: string;
    DESCRIPTION: string;
    INSTRUCTION: string;
    SENDERNAME: string;
    AREADESC: string;
    WEB: string;
    LANGUAGE: string;
    SENT: number;
    ONSET: number;
    /** 0 = no end given (valid until revoked) */
    EXPIRES: number;
    LEVEL: number;
    /** translated text for a missing end ("until further notice") */
    UNTILREVOKED: string;
    /** identifiers of the warnings this one replaces (CAP references), space separated */
    REFERENCES: string;
};

export type DataImportType =
    nullType | dataImportDwdType | dataImportZamgType | dataImportUWZType | dataImportNinaDashboardType;

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

export type silentTimeConfigType = {
    day: string[];
    start: number;
    end: number;
};
