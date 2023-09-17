/*export type statesObjectsWarningsType =
    | (ioBroker.Object & childObjects)
    | ioBroker.Object
    | (ioBroker.Object & string)
    | childObjects
    | string
    | (childObjects & string)
    | (ioBroker.Object & childObjects & string);

type childObjects = {
    [key: string]: statesObjectsWarningsType;
};*/
export type statesObjectsWarningsType = channelType & {
    [key: string]: channelType & {
        [key: string]: channelType & {
            [key: string]: ioBroker.Object;
        };
    };
};

type channelType = {
    _id: string;
    type: 'channel';
    common: {
        name: string | { en: string; [key: string]: string };
        description?: string;
    };
    native: object;
};

export const statesObjectsWarnings: statesObjectsWarningsType = {
    dwdService: {
        _id: 'dwd',
        type: 'channel',
        common: {
            name: {
                en: 'DWD Warnings',
                de: 'DWD Warnungen',
            },
            description: '',
        },
        native: {},
        raw: {
            _id: 'raw',
            type: 'channel',
            common: {
                name: {
                    en: 'Unedited warning data',
                },
                description: '',
            },
            AREADESC: {
                _id: 'AREADESC',
                type: 'state',
                common: {
                    name: 'area description',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            NAME: {
                _id: 'NAME',
                type: 'state',
                common: {
                    name: 'NAME',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            WARNCELLID: {
                _id: 'WARNCELLID',
                type: 'state',
                common: {
                    name: 'WARNCELLID',
                    default: '',
                    type: 'number',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            IDENTIFIER: {
                _id: 'IDENTIFIER',
                type: 'state',
                common: {
                    name: 'IDENTIFIER',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            SENDER: {
                _id: 'SENDER',
                type: 'state',
                common: {
                    name: 'SENDER',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            SENT: {
                _id: 'SENT',
                type: 'state',
                common: {
                    name: 'SENT',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            STATUS: {
                _id: 'STATUS',
                type: 'state',
                common: {
                    name: 'STATUS',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            MSGTYPE: {
                _id: 'MSGTYPE',
                type: 'state',
                common: {
                    name: 'MSGTYPE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            SOURCE: {
                _id: 'SOURCE',
                type: 'state',
                common: {
                    name: 'SOURCE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            SCOPE: {
                _id: 'SCOPE',
                type: 'state',
                common: {
                    name: 'SCOPE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            CODE: {
                _id: 'CODE',
                type: 'state',
                common: {
                    name: 'CODE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            LANGUAGE: {
                _id: 'LANGUAGE',
                type: 'state',
                common: {
                    name: 'LANGUAGE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            CATEGORY: {
                _id: 'CATEGORY',
                type: 'state',
                common: {
                    name: 'CATEGORY',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EVENT: {
                _id: 'EVENT',
                type: 'state',
                common: {
                    name: 'EVENT',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            RESPONSETYPE: {
                _id: 'RESPONSETYPE',
                type: 'state',
                common: {
                    name: 'RESPONSETYPE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            URGENCY: {
                _id: 'URGENCY',
                type: 'state',
                common: {
                    name: 'area description',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            SEVERITY: {
                _id: 'SEVERITY',
                type: 'state',
                common: {
                    name: 'SEVERITY',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            CERTAINTY: {
                _id: 'CERTAINTY',
                type: 'state',
                common: {
                    name: 'CERTAINTY',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EC_PROFILE: {
                _id: 'EC_PROFILE',
                type: 'state',
                common: {
                    name: 'EC_PROFILE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EC_LICENSE: {
                _id: 'EC_LICENSE',
                type: 'state',
                common: {
                    name: 'EC_LICENSE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EC_II: {
                _id: 'EC_II',
                type: 'state',
                common: {
                    name: 'EC_II',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EC_GROUP: {
                _id: 'EC_GROUP',
                type: 'state',
                common: {
                    name: 'EC_GROUP',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EC_AREA_COLOR: {
                _id: 'EC_AREA_COLOR',
                type: 'state',
                common: {
                    name: 'EC_AREA_COLOR',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EFFECTIVE: {
                _id: 'EFFECTIVE',
                type: 'state',
                common: {
                    name: 'EFFECTIVE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            ONSET: {
                _id: 'ONSET',
                type: 'state',
                common: {
                    name: 'start datetime of warning',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            EXPIRES: {
                _id: 'EXPIRES',
                type: 'state',
                common: {
                    name: 'EXPIRES',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            SENDERNAME: {
                _id: 'SENDERNAME',
                type: 'state',
                common: {
                    name: 'SENDERNAME',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            HEADLINE: {
                _id: 'HEADLINE',
                type: 'state',
                common: {
                    name: 'HEADLINE',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            DESCRIPTION: {
                _id: 'DESCRIPTION',
                type: 'state',
                common: {
                    name: 'DESCRIPTION',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            INSTRUCTION: {
                _id: 'INSTRUCTION',
                type: 'state',
                common: {
                    name: 'INSTRUCTION',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            WEB: {
                _id: 'WEB',
                type: 'state',
                common: {
                    name: 'WEB',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            CONTACT: {
                _id: 'CONTACT',
                type: 'state',
                common: {
                    name: 'CONTACT',
                    default: '',
                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            // @ts-expect-error json is valid
            PARAMETERNAME: {
                _id: 'PARAMETERNAME',
                type: 'state',
                common: {
                    name: 'PARAMETERNAME',
                    default: '{}',
                    type: 'json',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            // @ts-expect-error json is valid
            PARAMETERVALUE: {
                _id: 'PARAMETERVALUE',
                type: 'state',
                common: {
                    name: 'PARAMETERVALUE',
                    default: '{}',
                    type: 'json',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            ALTITUDE: {
                _id: 'ALTITUDE',
                type: 'state',
                common: {
                    name: 'ALTITUDE',
                    default: '',
                    type: 'number',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            CEILING: {
                _id: 'CEILING',
                type: 'state',
                common: {
                    name: 'CEILING',
                    default: '',
                    type: 'number',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            // StatesDefinition für DWD intern
            // https://isabel.dwd.de/DE/leistungen/opendata/help/warnungen/cap_dwd_profile_de_pdf_1_11.pdf?__blob=publicationFile&v=3
            begin: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Warning begin',
                    default: 0,
                    type: 'number',
                    role: 'value.time',
                    read: true,
                    write: false,
                },
                native: {},
            },
            description: {
                _id: 'description',
                type: 'state',
                common: {
                    name: 'Warning description',
                    default: '',
                    type: 'string',
                    role: 'weather.state',
                    read: true,
                    write: false,
                },
                native: {},
            },
            end: {
                _id: 'end',
                type: 'state',
                common: {
                    name: 'Warning end',
                    default: 0,
                    type: 'number',
                    role: 'value.time',
                    read: true,
                    write: false,
                },
                native: {},
            },
            headline: {
                _id: 'headline',
                type: 'state',
                common: {
                    name: 'Warning description',
                    default: '',
                    type: 'string',
                    role: 'weather.state',
                    read: true,
                    write: false,
                },
                native: {},
            },
            level: {
                _id: 'level',
                type: 'state',
                common: {
                    name: 'Warning level',
                    default: 0,
                    type: 'number',
                    role: 'value.warning',
                    read: true,
                    write: false,
                    states: { 1: 'Minor', 2: 'Moderate', 3: 'Severe', 4: 'Extreme' },
                },
                native: {},
            },
            map: {
                _id: 'map',
                type: 'state',
                common: {
                    name: 'Link to chart',
                    default: '',
                    type: 'string',
                    role: 'weather.chart.url',
                    read: true,
                    write: false,
                },
                native: {},
            },
            object: {
                _id: 'object',
                type: 'state',
                common: {
                    name: 'JSON object with warning',
                    default: '{}',
                    type: 'string',
                    role: 'weather.json',
                    read: true,
                    write: false,
                },
                native: {},
            },
            severity: {
                _id: 'severity',
                type: 'state',
                common: {
                    name: 'Warning severity',
                    default: 0,
                    type: 'number',
                    role: 'value.severity',
                    read: true,
                    write: false,
                    states: {
                        0: 'None',
                        1: 'Minor',
                        2: 'Moderate',
                        3: 'Severe',
                        4: 'Extreme',
                    },
                },
                native: {},
            },
            text: {
                _id: 'text',
                type: 'state',
                common: {
                    name: 'Warning text',
                    default: '',
                    type: 'string',
                    role: 'weather.title.short',
                    read: true,
                    write: false,
                },
                native: {},
            },
            typ: {
                _id: 'type',
                type: 'state',
                common: {
                    name: 'Warning type',
                    default: 0,
                    type: 'number',
                    role: 'weather.type',
                    read: true,
                    write: false,
                    states: {
                        0: 'Thunderstorm',
                        1: 'Wind/Storm',
                        2: 'Rain',
                        3: 'Snow',
                        4: 'Fog',
                        5: 'Frost',
                        6: 'Ice',
                        7: 'Thawing',
                        8: 'Heat',
                        9: 'UV warning',
                    },
                },
                native: {},
            },
            //https://www.dwd.de/DE/leistungen/opendata/help/warnungen/warning_codes_pdf.pdf;jsessionid=DE70C7EFE6921B96B26AA66B70CE5365.live21061?__blob=publicationFile&v=5
            ec_ii_type: {
                _id: 'ec_ii_type',
                type: 'state',
                common: {
                    name: 'Warningtype EC_II',
                    default: 0,
                    type: 'number',
                    role: 'weather.type',
                    read: true,
                    write: false,
                },
                native: {},
            },
            urgency: {
                _id: 'urgency',
                type: 'state',
                common: {
                    name: 'Warning urgency',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            responseType: {
                _id: 'responseType',
                type: 'state',
                common: {
                    name: 'Warning responseType',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            certainty: {
                _id: 'certainty',
                type: 'state',
                common: {
                    name: 'Warning certainty',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            altitude: {
                _id: 'altitude',
                type: 'state',
                common: {
                    name: 'Start Höhenlage der Warnung',
                    default: 0,
                    type: 'number',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            ceiling: {
                _id: 'ceiling',
                type: 'state',
                common: {
                    name: 'End Höhenlage der Warnung',
                    default: 0,
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            color: {
                _id: 'color',
                type: 'state',
                common: {
                    name: 'Farbe',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            HTMLShort: {
                _id: 'HTMLShort',
                type: 'state',
                common: {
                    name: 'Warning text html',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            HTMLLong: {
                _id: 'HTMLLong',
                type: 'state',
                common: {
                    name: 'Warning text html',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            HTMLVeryLong: {
                _id: 'HTMLVeryLong',
                type: 'state',
                common: {
                    name: 'Warning text very long html',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            instruction: {
                _id: 'instruction',
                type: 'state',
                common: {
                    name: 'Warning instruction text html',
                    default: '',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
    },
};
export const Defaults = {
    state: {
        _id: 'No_definition',
        type: 'state',
        common: {
            name: 'No definition',
            default: '',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
};

export const PROVIDER_OPTIONS = {
    dwdService: {
        url_base:
            'https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=2.0.0&request=GetFeature&maxFeatures=10&outputFormat=application%2Fjson',
        url_appendix_town: '&typeName=dwd%3AWarnungen_Gemeinden',
        url_appendix_land: '&typeName=dwd%3AWarnungen_Landkreis',
        url_appendix_townlist: '&typeName=dwd%3AWarngebiete_Gemeinden',
        url_appendix_landlist: '&typeName=dwd%3AWarngebiete_Kreise',
        url_warncellid: `&CQL_FILTER=WARNCELLID%20IN%20(%27` + '#  #' + `%27)`,
        url_language: `&language=#+  +#`, // noch nicht eingefügt
        url: `https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=dwd%3AWarnungen_Gemeinden&maxFeatures=50&outputFormat=application%2Fjson`,
        language: {
            de: 'ger',
            en: 'eng',
            it: 'ita',
            fr: 'fre',
            es: 'spa',
        },
    },

    zamgService: {
        url: 'https://warnungen.zamg.at/wsapp/api/getWarningsForCoords?lon=#  #&lat=#+  +#1&lang=de', //&lang=#++  ++#
    },
    uwzService: {
        url: `http://feed.alertspro.meteogroup.com/AlertsPro/AlertsProPollService.php?method=getWarning&language=de&areaID=#  #`,
    },
    ninaService: {
        url: '${warncellid}',
    },
    noService: {
        url: '',
        languages: [{ de: 'German' }, { en: 'English' }, { it: 'Italy' }, { fr: 'French' }, { es: 'Spanish' }], // definitioin für admin
    },
    metroService: {
        url: '',
    },
};
/*
`https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.2.0&CQL_FILTER=WARNCELLID%20IN%20(%27` +
            '#  #' +
            `%27)&request=GetFeature&typeName=dwd%3AWarnungen_Gemeinden&maxFeatures=50&outputFormat=application%2Fjson`,
            */

/* dwd A Language parameter was provided in the request but it cannot be resolved to an ISO lang code.
            Parameter value is de while supported languages are hun,swe,dut,est,fin,ice,gsw,rum,pol,cze,dan,nor,por,ger,lit,ita,fre,gre,eng,lav,gle,spa,hrv,mlt,slo,bul,slv
            */
