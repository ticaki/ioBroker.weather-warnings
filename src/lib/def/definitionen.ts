import { customFormatedKeysDef } from './messages-def';
import { dataImportDwdTypeProperties, dataImportUwzTypeProperties, dataImportZamgTypeProperties } from './provider-def';

type ChangeTypeOfKeys<Obj> = Obj extends object
    ? { [K in keyof Obj]-?: ChangeTypeOfKeys<Obj[K]> } & customChannelType
    : ioBroker.StateObject;

type customChannelType = { _channel: ioBroker.ChannelObject | ioBroker.DeviceObject };
/*type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];*/

export type statesObjectsWarningsType =
    | {
          [key: string]:
              | customChannelType
              | {
                    raw?:
                        | ChangeTypeOfKeys<dataImportDwdTypeProperties>
                        | ChangeTypeOfKeys<dataImportUwzTypeProperties>
                        | ChangeTypeOfKeys<dataImportZamgTypeProperties>;
                };
      }
    | {
          allService: {
              formatedkeys: customChannelType | { [Property in keyof customFormatedKeysDef]: ioBroker.StateObject };
          };
      };

export const genericStateObjects: {
    info: customChannelType & {
        connection: ioBroker.StateObject;
        testMode: ioBroker.StateObject;
    };
    state: ioBroker.StateObject;
    warningDevice: ioBroker.DeviceObject;
    formatedKeysDevice: ioBroker.DeviceObject;
    messageStates: customChannelType & {
        message: ioBroker.StateObject;
    };
    activWarnings: ioBroker.StateObject;
} = {
    info: {
        _channel: {
            _id: 'info',
            type: 'channel',
            common: {
                name: {
                    en: 'Info',
                    de: 'Info',
                },
            },
            native: {},
        },
        connection: {
            _id: 'connection',
            type: 'state',
            common: {
                name: 'Last data retrieval was successful',
                type: 'boolean',
                role: 'indicator.reachable',
                read: true,
                write: false,
            },
            native: {},
        },
        testMode: {
            _id: 'testMode',
            type: 'state',
            common: {
                name: 'If the adapter is running in test mode!',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        },
    },
    state: {
        _id: 'No_definition',
        type: 'state',
        common: {
            name: 'No definition',

            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
    warningDevice: {
        _id: 'warning',
        type: 'device',
        common: {
            name: 'Warnings from Server',
        },
        native: {},
    },
    formatedKeysDevice: {
        _id: 'formatedKeys',
        type: 'device',
        common: {
            name: 'Variables that can be used in the admin settings to configure the messages.',
        },
        native: {},
    },
    messageStates: {
        _channel: {
            _id: 'messages',
            type: 'channel',
            common: {
                name: 'Outgoing formated messages.',
            },
            native: {},
        },
        message: {
            _id: 'message',
            type: 'state',
            common: {
                name: 'Outgoing formated message.',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
    },
    activWarnings: {
        _id: 'activWarnings',
        type: 'state',
        common: {
            name: 'Number of warnings.',
            type: 'number',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
};

export const statesObjectsWarnings: statesObjectsWarningsType = {
    dwdService: {
        _channel: {
            _id: 'dwd',
            type: 'channel',
            common: {
                name: {
                    en: 'DWD Warnings',
                    de: 'DWD Warnungen',
                },
            },
            native: {},
        },
        raw: {
            _channel: {
                _id: 'raw',
                type: 'channel',
                common: {
                    name: {
                        en: 'Unchanged data',
                    },
                },
                native: {},
            },

            AREADESC: {
                _id: 'AREADESC',
                type: 'state',
                common: {
                    name: 'area description',
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
                    name: 'Language of warning',

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

                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            REFERENCES: {
                _id: 'REFERENCES',
                type: 'state',
                common: {
                    name: 'REFERENCES',

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
                    name: 'Start Time of warning',

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
                    name: 'End Time of warning',

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

                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            PARAMETERNAME: {
                _id: 'PARAMETERNAME',
                type: 'state',
                common: {
                    name: 'PARAMETERNAME',
                    type: 'string',
                    role: 'json',
                    read: true,
                    write: false,
                },
                native: {},
            },

            PARAMETERVALUE: {
                _id: 'PARAMETERVALUE',
                type: 'state',
                common: {
                    name: 'PARAMETERVALUE',
                    type: 'string',
                    role: 'json',
                    read: true,
                    write: false,
                },
                native: {},
            },
            ALTITUDE: {
                _id: 'ALTITUDE',
                type: 'state',
                common: {
                    name: 'Warning applies from a height of (in feet).',

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
                    name: 'Warning applies up to a height of (in feet)',

                    type: 'number',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            GC_STATE: {
                _id: 'GC_STATE',
                type: 'state',
                common: {
                    name: 'GC_STATE',

                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            GC_WARNCELLID: {
                _id: 'GC_WARNCELLID',
                type: 'state',
                common: {
                    name: 'GC_WARNCELLID',

                    type: 'number',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            INFO_ID: {
                _id: 'INFO_ID',
                type: 'state',
                common: {
                    name: 'INFO_ID',

                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
            PROCESSTIME: {
                _id: 'PROCESSTIME',
                type: 'state',
                common: {
                    name: 'PROCESSTIME',

                    type: 'string',
                    role: '',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
    },
    uwzService: {
        _channel: {
            _id: 'uwz',
            type: 'channel',
            common: {
                name: {
                    en: 'UWZ Warnings',
                    de: 'UWZ Warnungen',
                },
            },
            native: {},
        },
        raw: {
            _channel: {
                _id: 'raw',
                type: 'channel',
                common: {
                    name: 'Unchanged data',
                },
                native: {},
            },
            center: {
                _id: 'center',
                type: 'state',
                common: {
                    name: 'text',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            areaID: {
                _id: 'areaID',
                type: 'state',
                common: {
                    name: 'text',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            dtgEnd: {
                _id: 'dtgEnd',
                type: 'state',
                common: {
                    name: 'End Time of warning',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            areaType: {
                _id: 'Warnid',
                type: 'state',
                common: {
                    name: 'text',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            dtgStart: {
                _id: 'Warnid',
                type: 'state',
                common: {
                    name: 'Start Time of warning',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            payload: {
                _channel: {
                    _id: 'payload',
                    type: 'channel',
                    common: {
                        name: 'Payload of warning.',
                    },
                    native: {},
                },
                id: {
                    _id: 'Warnid',
                    type: 'state',
                    common: {
                        name: 'text',
                        type: 'string',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                creation: {
                    _id: 'Warnid',
                    type: 'state',
                    common: {
                        name: 'Id of Warning',
                        type: 'number',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                uwzLevel: {
                    _id: 'Warnid',
                    type: 'state',
                    common: {
                        name: 'Id of Warning',
                        type: 'number',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                translationsShortText: {
                    _channel: {
                        _id: 'raw',
                        type: 'channel',
                        common: {
                            name: 'Translation short',
                        },
                        native: {},
                    },
                    FR: {
                        _id: 'FR',
                        type: 'state',
                        common: {
                            name: 'French',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    LU: {
                        _id: 'LU',
                        type: 'state',
                        common: {
                            name: 'Luxembourg',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    EN: {
                        _id: 'EN',
                        type: 'state',
                        common: {
                            name: 'English',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    ES: {
                        _id: 'Warnid',
                        type: 'state',
                        common: {
                            name: 'Spanish',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    NL: {
                        _id: 'Warnid',
                        type: 'state',
                        common: {
                            name: 'Netherlands',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    DE: {
                        _id: 'Warnid',
                        type: 'state',
                        common: {
                            name: 'German',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    IT: {
                        _id: 'Warnid',
                        type: 'state',
                        common: {
                            name: 'Italy',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    DK: {
                        _id: 'Warnid',
                        type: 'state',
                        common: {
                            name: 'Denmark',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                },
                translationsLongText: {
                    _channel: {
                        _id: 'raw',
                        type: 'channel',
                        common: {
                            name: 'Translation long',
                        },
                        native: {},
                    },
                    FR: {
                        _id: 'FR',
                        type: 'state',
                        common: {
                            name: 'French',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    LU: {
                        _id: 'LU',
                        type: 'state',
                        common: {
                            name: 'Luxembourg',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    EN: {
                        _id: 'EN',
                        type: 'state',
                        common: {
                            name: 'English',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    ES: {
                        _id: 'ES',
                        type: 'state',
                        common: {
                            name: 'Spanish',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    NL: {
                        _id: 'NL',
                        type: 'state',
                        common: {
                            name: 'Netherlands',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    DE: {
                        _id: 'DE',
                        type: 'state',
                        common: {
                            name: 'German',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    IT: {
                        _id: 'IT',
                        type: 'state',
                        common: {
                            name: 'Italy',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                    DK: {
                        _id: 'DK',
                        type: 'state',
                        common: {
                            name: 'Denmark',
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                    },
                },
                fileName: {
                    _id: 'filename',
                    type: 'state',
                    common: {
                        name: 'Name of the file at the data provider.',
                        type: 'string',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                levelName: {
                    _id: 'Warnid',
                    type: 'state',
                    common: {
                        name: 'Name of the level.',
                        type: 'string',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                shortText: {
                    _id: 'shortText',
                    type: 'state',
                    common: {
                        name: 'Short text in default language.',
                        type: 'string',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                longText: {
                    _id: 'Warnid',
                    type: 'state',
                    common: {
                        name: 'Long text in default language.',
                        type: 'string',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                altMin: {
                    _id: 'Warnid',
                    type: 'state',
                    common: {
                        name: 'Warning applies from a height of (in meter).',
                        type: 'number',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                altMax: {
                    _id: 'Warnid',
                    type: 'state',
                    common: {
                        name: 'Warning applies up to a height of (in meter).',
                        type: 'number',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
            },
            severity: {
                _id: 'Warnid',
                type: 'state',
                common: {
                    name: 'Severity of the warning',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            type: {
                _id: 'Type of warning.',
                type: 'state',
                common: {
                    name: 'Id of Warning',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                    states: {
                        0: `n_a`,
                        1: `unbekannt`,
                        2: `Sturm`,
                        3: `Schneefall`,
                        4: `Starkregen`,
                        5: `Extremfrost`,
                        6: `Waldbrandgefahr`,
                        7: `Gewitter`,
                        8: `Glätte`,
                        9: `Hitze`,
                        10: `Glatteisregen`,
                        11: `Bodenfrost`,
                    },
                },
                native: {},
            },
        },
    },
    zamgService: {
        _channel: {
            _id: 'zamg',
            type: 'channel',
            common: {
                name: {
                    en: 'ZAMG Warnings',
                    de: 'ZAMG Warnungen',
                },
            },
            native: {},
        },
        raw: {
            _channel: {
                _id: 'raw',
                type: 'channel',
                common: {
                    name: 'Unchanged data',
                },
                native: {},
            },
            warnid: {
                _id: 'Warnid',
                type: 'state',
                common: {
                    name: 'Id of Warning',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            chgid: {
                _id: 'chgid',
                type: 'state',
                common: {
                    name: 'no idea',

                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            verlaufid: {
                _id: 'verlaufid',
                type: 'state',
                common: {
                    name: 'Course id',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            warntypid: {
                _id: 'warntypid',
                type: 'state',
                common: {
                    name: 'Type of Warning as ID',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },
            begin: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Start Time fo Warning',

                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            end: {
                _id: 'end',
                type: 'state',
                common: {
                    name: 'End Time of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            create: {
                _id: 'create',
                type: 'state',
                common: {
                    name: 'Create Time of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            text: {
                _id: 'text',
                type: 'state',
                common: {
                    name: 'Short Text of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            auswirkungen: {
                _id: 'instruction',
                type: 'state',
                common: {
                    name: 'What happens',

                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            empfehlungen: {
                _id: 'instruction',
                type: 'state',
                common: {
                    name: 'Recommendations for behaviour',

                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            nachrichtentyp: {
                _id: 'nachrichtentyp',
                type: 'state',
                common: {
                    name: 'Messagetype',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            location: {
                _id: 'location',
                type: 'state',
                common: {
                    name: 'Location',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            meteotext: {
                _id: 'meteotext',
                type: 'state',
                common: {
                    name: 'Weather-related information',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            updategrund: {
                _id: 'updategrund',
                type: 'state',
                common: {
                    name: 'Update reason',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            warnstufeid: {
                _id: 'warnstufeid',
                type: 'state',
                common: {
                    name: 'Warnlevel id',
                    type: 'number',
                    role: 'value',
                    read: true,
                    write: false,
                },
                native: {},
            },

            rawinfo: {
                _channel: {
                    _id: 'rawinfo',
                    type: 'channel',
                    common: {
                        name: {
                            en: 'Raw Infos',
                        },
                    },
                    native: {},
                },
                wtype: {
                    _id: 'wtype',
                    type: 'state',
                    common: {
                        name: 'Weather typ',
                        type: 'number',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                wlevel: {
                    _id: 'wlevel',
                    type: 'state',
                    common: {
                        name: 'Warning level',
                        type: 'number',
                        role: 'value',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                start: {
                    _id: 'start',
                    type: 'state',
                    common: {
                        name: 'Warning start time as unixtime',
                        type: 'string',
                        role: 'text',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
                end: {
                    _id: 'instruction',
                    type: 'state',
                    common: {
                        name: 'Warning end time as unixtime',
                        type: 'string',
                        role: 'text',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
            },
        },
    },
    allService: {
        formatedkeys: {
            _channel: {
                _id: 'raw',
                type: 'channel',
                common: {
                    name: {
                        en: 'Formated Datapoint',
                    },
                },
                native: {},
            },

            starttime: {
                _id: 'starttime',
                type: 'state',
                common: {
                    name: 'Start Time HH:MM of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            startdate: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Start Date of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            endtime: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'End Time of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            enddate: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'End Date of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            startdayofweek: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Start day of the week of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            enddayofweek: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'End day of the week of Warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            headline: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'headline of warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            description: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Description of warning.',
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
                    name: 'Recommendations for action of the warning.',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            weathertext: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Weather description of warning.',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            ceiling: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Start Time fo Warning',
                    type: 'number',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            }, // max höhe
            altitude: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Start Time fo Warning',
                    type: 'number',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            }, // min höhe
            warnlevelname: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Level of Warning as Levelname',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            warnlevelcolorname: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Level of Warning as Colorname',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            warnlevelnumber: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Level of Warning as Number',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            warnlevelcolorhex: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Level of Warning as Color(hex)',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            }, // RGB im Hexformat
            warntypename: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'The Type of warning',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            location: {
                _id: 'begin',
                type: 'state',
                common: {
                    name: 'Location',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            startunixtime: {
                _id: 'startunixtime',
                type: 'state',
                common: {
                    name: 'Unixtimestamp for starttime (internal use)',
                    type: 'number',
                    role: 'value',
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
        url_appendix_town: '&typeName=dwd%3AWarnungen_Gemeinden&CQL_FILTER=WARNCELLID%20IN%20(%27' + '#  #' + '%27)',
        url_appendix_land:
            '&typeName=dwd%3AWarnungen_Landkreise&CQL_FILTER=GC_WARNCELLID%20IN%20(%27' + '#  #' + '%27)',
        url_appendix_townlist: '&typeName=dwd%3AWarngebiete_Gemeinden',
        url_appendix_landlist: '&typeName=dwd%3AWarngebiete_Kreise',
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
        url: 'https://warnungen.zamg.at/wsapp/api/getWarningsForCoords?lat=#  #&lon=#+  +#1&lang=de', //&lang=#++  ++#
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
