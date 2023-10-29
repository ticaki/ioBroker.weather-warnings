import * as Provider from '../provider';
export * from '../provider';

/**Available provider identifier strings */
export type providerServices = 'dwdService' | 'zamgService' | 'ninaService' | 'uwzService' | 'metroService';

export const providerServicesArray: providerServices[] = ['dwdService', 'zamgService', 'uwzService']; //, 'uwzService', 'metroService'];
export type ProviderClassType =
    | Provider.DWDProvider
    | Provider.ZAMGProvider
    | Provider.UWZProvider
    | Provider.NINAProvider
    | Provider.METROProvider;

type nullType = null | undefined | void;
export type messageFilterTypeWithFilter = { filter: messageFilterType };
export type messageFilterType = {
    level?: number;
    type: string[];
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

export type DataImportType = nullType | dataImportDwdType | dataImportZamgType | dataImportUWZType;

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
