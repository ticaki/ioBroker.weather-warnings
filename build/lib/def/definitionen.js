"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var definitionen_exports = {};
__export(definitionen_exports, {
  Defaults: () => Defaults,
  PROVIDER_OPTIONS: () => PROVIDER_OPTIONS,
  defaultChannel: () => defaultChannel,
  genericStateObjects: () => genericStateObjects,
  statesObjectsWarnings: () => statesObjectsWarnings
});
module.exports = __toCommonJS(definitionen_exports);
var messagesDef = __toESM(require("./messages-def"));
const defaultChannel = {
  _id: "",
  type: "channel",
  common: {
    name: "Hey no description... "
  },
  native: {}
};
const genericStateObjects = {
  info: {
    _channel: {
      _id: "info",
      type: "channel",
      common: {
        name: "genericStateObjects.info._channel"
      },
      native: {}
    },
    connection: {
      _id: "connection",
      type: "state",
      common: {
        name: "genericStateObjects.info.connection",
        type: "boolean",
        role: "indicator.reachable",
        read: true,
        write: false
      },
      native: {}
    },
    testMode: {
      _id: "testMode",
      type: "state",
      common: {
        name: "genericStateObjects.info.testMode",
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    }
  },
  state: {
    _id: "No_definition",
    type: "state",
    common: {
      name: "genericStateObjects.state",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  },
  customString: {
    _id: "User_State",
    type: "state",
    common: {
      name: "genericStateObjects.customString",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  },
  warningDevice: {
    _id: "warning",
    type: "channel",
    common: {
      name: "genericStateObjects.warningDevice"
    },
    native: {}
  },
  formatedKeysDevice: {
    _id: "formatedKeys",
    type: "channel",
    common: {
      name: "genericStateObjects.formatedKeysDevice"
    },
    native: {}
  },
  messageStates: {
    _channel: {
      _id: "messages",
      type: "channel",
      common: {
        name: "genericStateObjects.messageStates._channel"
      },
      native: {}
    },
    message: {
      _id: "message",
      type: "state",
      common: {
        name: "genericStateObjects.messageStates.message",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    messageJson: {
      _id: "messageArray",
      type: "state",
      common: {
        name: "genericStateObjects.messageStates.messageJson",
        type: "array",
        role: "list",
        read: true,
        write: false
      },
      native: {}
    }
  },
  activeWarnings: {
    _id: "activWarnings",
    type: "state",
    common: {
      name: "genericStateObjects.activeWarnings",
      type: "number",
      role: "value",
      read: true,
      write: false
    },
    native: {}
  },
  activeWarningsJson: {
    _id: "activeWarningsJson",
    type: "state",
    common: {
      name: "genericStateObjects.activeWarningsJson",
      type: "string",
      role: "json",
      read: true,
      write: false
    },
    native: {}
  },
  history: {
    _id: "activeWarningsJson",
    type: "state",
    common: {
      name: "genericStateObjects.history",
      type: "string",
      role: "json",
      read: true,
      write: false
    },
    native: {}
  },
  warnings_json: {
    _id: "activeWarningsJson",
    type: "state",
    common: {
      name: "genericStateObjects.warnings_json",
      type: "string",
      role: "json",
      read: true,
      write: false
    },
    native: {}
  },
  lastUpdate: {
    _id: "lastUpdate",
    type: "state",
    common: {
      name: "genericStateObjects.lastUpdate",
      type: "number",
      role: "value.time",
      read: true,
      write: false
    },
    native: {}
  },
  jsonHistory: {
    _id: "jsonHistory",
    type: "state",
    common: {
      name: "genericStateObjects.jsonHistory",
      type: "string",
      role: "json",
      read: true,
      write: false
    },
    native: {}
  },
  summary: {
    _channel: {
      _id: "",
      type: "channel",
      common: { name: "" },
      native: {}
    },
    warntypes: {
      _id: "",
      type: "state",
      common: {
        name: "",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  }
};
const statesObjectsWarnings = {
  dwdService: {
    _channel: {
      _id: "dwd",
      type: "device",
      common: {
        name: "statesObjectsWarnings.dwdService._channel"
      },
      native: {}
    },
    raw: {
      _channel: {
        _id: "raw",
        type: "channel",
        common: {
          name: "statesObjectsWarnings.dwdService.raw._channel"
        },
        native: {}
      },
      AREADESC: {
        _id: "AREADESC",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.AREADESC",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      NAME: {
        _id: "NAME",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.NAME",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      WARNCELLID: {
        _id: "WARNCELLID",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.WARNCELLID",
          type: "number",
          role: "",
          read: true,
          write: false
        },
        native: {}
      },
      IDENTIFIER: {
        _id: "IDENTIFIER",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.IDENTIFIER",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      SENDER: {
        _id: "SENDER",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.SENDER",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      SENT: {
        _id: "SENT",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.SENT",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      STATUS: {
        _id: "STATUS",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.STATUS",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      MSGTYPE: {
        _id: "MSGTYPE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.MSGTYPE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      SOURCE: {
        _id: "SOURCE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.SOURCE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      SCOPE: {
        _id: "SCOPE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.SCOPE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      CODE: {
        _id: "CODE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.CODE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      LANGUAGE: {
        _id: "LANGUAGE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.LANGUAGE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      CATEGORY: {
        _id: "CATEGORY",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.CATEGORY",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      REFERENCES: {
        _id: "REFERENCES",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.REFERENCES",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EVENT: {
        _id: "EVENT",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EVENT",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      RESPONSETYPE: {
        _id: "RESPONSETYPE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.RESPONSETYPE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      URGENCY: {
        _id: "URGENCY",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.URGENCY",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      SEVERITY: {
        _id: "SEVERITY",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.SEVERITY",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      CERTAINTY: {
        _id: "CERTAINTY",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.CERTAINTY",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EC_PROFILE: {
        _id: "EC_PROFILE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EC_PROFILE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EC_LICENSE: {
        _id: "EC_LICENSE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EC_LICENSE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EC_II: {
        _id: "EC_II",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EC_II",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EC_GROUP: {
        _id: "EC_GROUP",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EC_GROUP",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EC_AREA_COLOR: {
        _id: "EC_AREA_COLOR",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EC_AREA_COLOR",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EFFECTIVE: {
        _id: "EFFECTIVE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EFFECTIVE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      ONSET: {
        _id: "ONSET",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.ONSET",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      EXPIRES: {
        _id: "EXPIRES",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.EXPIRES",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      SENDERNAME: {
        _id: "SENDERNAME",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.SENDERNAME",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      HEADLINE: {
        _id: "HEADLINE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.HEADLINE",
          type: "string",
          role: "weather.title",
          read: true,
          write: false
        },
        native: {}
      },
      DESCRIPTION: {
        _id: "DESCRIPTION",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.DESCRIPTION",
          type: "string",
          role: "weather.state",
          read: true,
          write: false
        },
        native: {}
      },
      INSTRUCTION: {
        _id: "INSTRUCTION",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.INSTRUCTION",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      WEB: {
        _id: "WEB",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.WEB",
          type: "string",
          role: "url",
          read: true,
          write: false
        },
        native: {}
      },
      CONTACT: {
        _id: "CONTACT",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.CONTACT",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      PARAMETERNAME: {
        _id: "PARAMETERNAME",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.PARAMETERNAME",
          type: "string",
          role: "json",
          read: true,
          write: false
        },
        native: {}
      },
      PARAMETERVALUE: {
        _id: "PARAMETERVALUE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.PARAMETERVALUE",
          type: "string",
          role: "json",
          read: true,
          write: false
        },
        native: {}
      },
      ALTITUDE: {
        _id: "ALTITUDE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.ALTITUDE",
          type: "number",
          role: "",
          read: true,
          write: false
        },
        native: {}
      },
      CEILING: {
        _id: "CEILING",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.CEILING",
          type: "number",
          role: "",
          read: true,
          write: false
        },
        native: {}
      },
      GC_STATE: {
        _id: "GC_STATE",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.GC_STATE",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      GC_WARNCELLID: {
        _id: "GC_WARNCELLID",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.GC_WARNCELLID",
          type: "number",
          role: "",
          read: true,
          write: false
        },
        native: {}
      },
      INFO_ID: {
        _id: "INFO_ID",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.INFO_ID",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      PROCESSTIME: {
        _id: "PROCESSTIME",
        type: "state",
        common: {
          name: "statesObjectsWarnings.dwdService.raw.PROCESSTIME",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      }
    }
  },
  uwzService: {
    _channel: {
      _id: "uwz",
      type: "device",
      common: {
        name: "statesObjectsWarnings.uwzService._channel"
      },
      native: {}
    },
    raw: {
      _channel: {
        _id: "raw",
        type: "channel",
        common: {
          name: "statesObjectsWarnings.uwzService.raw._channel"
        },
        native: {}
      },
      center: {
        _id: "center",
        type: "state",
        common: {
          name: "statesObjectsWarnings.uwzService.raw.center",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      areaID: {
        _id: "areaID",
        type: "state",
        common: {
          name: "statesObjectsWarnings.uwzService.raw.areaID",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      dtgEnd: {
        _id: "dtgEnd",
        type: "state",
        common: {
          name: "statesObjectsWarnings.uwzService.raw.dtgEnd",
          type: "number",
          role: "value",
          read: true,
          write: false
        },
        native: {}
      },
      areaType: {
        _id: "Warnid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.uwzService.raw.areaType",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      dtgStart: {
        _id: "Warnid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.uwzService.raw.dtgStart",
          type: "number",
          role: "value",
          read: true,
          write: false
        },
        native: {}
      },
      payload: {
        _channel: {
          _id: "payload",
          type: "channel",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload._channel"
          },
          native: {}
        },
        id: {
          _id: "Warnid",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.id",
            type: "string",
            role: "text",
            read: true,
            write: false
          },
          native: {}
        },
        creation: {
          _id: "Warnid",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.creation",
            type: "number",
            role: "value",
            read: true,
            write: false
          },
          native: {}
        },
        uwzLevel: {
          _id: "Warnid",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.uwzLevel",
            type: "number",
            role: "value.warning",
            read: true,
            write: false
          },
          native: {}
        },
        translationsShortText: {
          _channel: {
            _id: "raw",
            type: "channel",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText._channel"
            },
            native: {}
          },
          FR: {
            _id: "FR",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.FR",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          },
          LU: {
            _id: "LU",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.LU",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          },
          EN: {
            _id: "EN",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.EN",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          },
          ES: {
            _id: "Warnid",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.ES",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          },
          NL: {
            _id: "Warnid",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.NL",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          },
          DE: {
            _id: "Warnid",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.DE",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          },
          IT: {
            _id: "Warnid",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.IT",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          },
          DK: {
            _id: "Warnid",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsShortText.DK",
              type: "string",
              role: "weather.title.short",
              read: true,
              write: false
            },
            native: {}
          }
        },
        translationsLongText: {
          _channel: {
            _id: "raw",
            type: "channel",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText._channel"
            },
            native: {}
          },
          FR: {
            _id: "FR",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.FR",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          },
          LU: {
            _id: "LU",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.LU",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          },
          EN: {
            _id: "EN",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.EN",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          },
          ES: {
            _id: "ES",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.ES",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          },
          NL: {
            _id: "NL",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.NL",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          },
          DE: {
            _id: "DE",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.DE",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          },
          IT: {
            _id: "IT",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.IT",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          },
          DK: {
            _id: "DK",
            type: "state",
            common: {
              name: "statesObjectsWarnings.uwzService.raw.payload.translationsLongText.DK",
              type: "string",
              role: "weather.title",
              read: true,
              write: false
            },
            native: {}
          }
        },
        fileName: {
          _id: "filename",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.fileName",
            type: "string",
            role: "text",
            read: true,
            write: false
          },
          native: {}
        },
        levelName: {
          _id: "Warnid",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.levelName",
            type: "string",
            role: "text",
            read: true,
            write: false
          },
          native: {}
        },
        shortText: {
          _id: "shortText",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.shortText",
            type: "string",
            role: "weather.title.short",
            read: true,
            write: false
          },
          native: {}
        },
        longText: {
          _id: "Warnid",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.longText",
            type: "string",
            role: "weather.title",
            read: true,
            write: false
          },
          native: {}
        },
        altMin: {
          _id: "Warnid",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.altMin",
            type: "number",
            role: "value",
            read: true,
            write: false
          },
          native: {}
        },
        altMax: {
          _id: "Warnid",
          type: "state",
          common: {
            name: "statesObjectsWarnings.uwzService.raw.payload.altMax",
            type: "number",
            role: "value",
            read: true,
            write: false
          },
          native: {}
        }
      },
      severity: {
        _id: "Warnid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.uwzService.raw.severity",
          type: "number",
          role: "value.warning",
          read: true,
          write: false
        },
        native: {}
      },
      type: {
        _id: "Type of warning.",
        type: "state",
        common: {
          name: "statesObjectsWarnings.uwzService.raw.type",
          type: "number",
          role: "value",
          read: true,
          write: false,
          states: {
            "0": "n_a",
            "1": "unbekannt",
            "2": "Sturm",
            "3": "Schneefall",
            "4": "Starkregen",
            "5": "Extremfrost",
            "6": "Waldbrandgefahr",
            "7": "Gewitter",
            "8": "Gl\xE4tte",
            "9": "Hitze",
            "10": "Glatteisregen",
            "11": "Bodenfrost"
          }
        },
        native: {}
      }
    }
  },
  zamgService: {
    _channel: {
      _id: "zamg",
      type: "device",
      common: {
        name: "statesObjectsWarnings.zamgService._channel"
      },
      native: {}
    },
    raw: {
      _channel: {
        _id: "raw",
        type: "channel",
        common: {
          name: "statesObjectsWarnings.zamgService.raw._channel"
        },
        native: {}
      },
      warnid: {
        _id: "Warnid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.warnid",
          type: "number",
          role: "value",
          read: true,
          write: false
        },
        native: {}
      },
      chgid: {
        _id: "chgid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.chgid",
          type: "number",
          role: "value",
          read: true,
          write: false
        },
        native: {}
      },
      verlaufid: {
        _id: "verlaufid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.verlaufid",
          type: "number",
          role: "value",
          read: true,
          write: false
        },
        native: {}
      },
      warntypid: {
        _id: "warntypid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.warntypid",
          type: "number",
          role: "value",
          read: true,
          write: false
        },
        native: {}
      },
      begin: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.begin",
          type: "string",
          role: "date.start",
          read: true,
          write: false
        },
        native: {}
      },
      end: {
        _id: "end",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.end",
          type: "string",
          role: "date.end",
          read: true,
          write: false
        },
        native: {}
      },
      create: {
        _id: "create",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.create",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      text: {
        _id: "text",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.text",
          type: "string",
          role: "weather.title",
          read: true,
          write: false
        },
        native: {}
      },
      auswirkungen: {
        _id: "auswirkungen",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.auswirkungen",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      empfehlungen: {
        _id: "instruction",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.empfehlungen",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      nachrichtentyp: {
        _id: "nachrichtentyp",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.nachrichtentyp",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      location: {
        _id: "location",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.location",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      meteotext: {
        _id: "meteotext",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.meteotext",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      updategrund: {
        _id: "updategrund",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.updategrund",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      warnstufeid: {
        _id: "warnstufeid",
        type: "state",
        common: {
          name: "statesObjectsWarnings.zamgService.raw.warnstufeid",
          type: "number",
          role: "value",
          read: true,
          write: false
        },
        native: {}
      },
      rawinfo: {
        _channel: {
          _id: "rawinfo",
          type: "channel",
          common: {
            name: "statesObjectsWarnings.zamgService.raw.rawinfo._channel"
          },
          native: {}
        },
        wtype: {
          _id: "wtype",
          type: "state",
          common: {
            name: "statesObjectsWarnings.zamgService.raw.rawinfo.wtype",
            type: "number",
            role: "value",
            read: true,
            write: false
          },
          native: {}
        },
        wlevel: {
          _id: "wlevel",
          type: "state",
          common: {
            name: "statesObjectsWarnings.zamgService.raw.rawinfo.wlevel",
            type: "number",
            role: "value.warning",
            read: true,
            write: false
          },
          native: {}
        },
        start: {
          _id: "start",
          type: "state",
          common: {
            name: "statesObjectsWarnings.zamgService.raw.rawinfo.start",
            type: "string",
            role: "text",
            read: true,
            write: false
          },
          native: {}
        },
        end: {
          _id: "instruction",
          type: "state",
          common: {
            name: "statesObjectsWarnings.zamgService.raw.rawinfo.end",
            type: "string",
            role: "text",
            read: true,
            write: false
          },
          native: {}
        }
      }
    }
  },
  allService: {
    formatedkeys: {
      _channel: {
        _id: "raw",
        type: "channel",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys._channel"
        },
        native: {}
      },
      iconurl: {
        _id: "iconurl",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.countdown.iconurl",
          type: "string",
          role: "weather.icon",
          read: true,
          write: false
        },
        native: {}
      },
      countdown: {
        _id: "starttime",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.countdown",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      status: {
        _id: "status",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.status",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      starttime: {
        _id: "starttime",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.starttime",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      starttimems: {
        _id: "starttimems",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.starttimems",
          type: "number",
          role: "value.time",
          read: true,
          write: false
        },
        native: {}
      },
      startdate: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.startdate",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      startday: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.startday",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      startmonth: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.startmonth",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      endday: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.endday",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      endmonth: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.endmonth",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      endtime: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.endtime",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      endtimems: {
        _id: "endtimems",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.endtimems",
          type: "number",
          role: "value.time",
          read: true,
          write: false
        },
        native: {}
      },
      enddate: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.enddate",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      startdayofweek: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.startdayofweek",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      enddayofweek: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.enddayofweek",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      startdayofweekshort: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.startdayofweekshort",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      enddayofweekshort: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.enddayofweekshort",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      headline: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.headline",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      description: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.description",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      instruction: {
        _id: "instruction",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.instruction",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      impact: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.impact",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      ceiling: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.ceiling",
          type: "number",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      altitude: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.altitude",
          type: "number",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      warnlevelname: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.warnlevelname",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      warnlevelcolorname: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.warnlevelcolorname",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      warnlevelnumber: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.warnlevelnumber",
          type: "number",
          role: "value.warning",
          read: true,
          write: false
        },
        native: {}
      },
      warnlevelcolorhex: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.warnlevelcolorhex",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      warntypename: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.warntypename",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      warntypegenericname: {
        _id: "warntypegenericname",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.warntypegenericname",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      location: {
        _id: "begin",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.location",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      provider: {
        _id: "provider",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.provider",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      locationcustom: {
        _id: "locationcustom",
        type: "state",
        common: {
          name: "statesObjectsWarnings.allService.formatedkeys.locationcustom",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      }
    },
    alerts: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "statesObjectsWarnings.allService.alerts"
        },
        native: {}
      },
      storm: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.storm" } }
      },
      hail: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.hail" } }
      },
      thunderstorm: {
        ...messagesDef.genericWarntypState,
        _channel: {
          ...defaultChannel,
          common: { name: "statesObjectsWarnings.allService.alerts.thunderstorm" }
        }
      },
      rain: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.rain" } }
      },
      black_ice_slippery: {
        ...messagesDef.genericWarntypState,
        _channel: {
          ...defaultChannel,
          common: { name: "statesObjectsWarnings.allService.alerts.black_ice_slippery" }
        }
      },
      snowfall: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.snowfall" } }
      },
      thaw: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.thaw" } }
      },
      unknown: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.unknown" } }
      },
      cold: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.cold" } }
      },
      forest_fire: {
        ...messagesDef.genericWarntypState,
        _channel: {
          ...defaultChannel,
          common: { name: "statesObjectsWarnings.allService.alerts.forest_fire" }
        }
      },
      heat: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.heat" } }
      },
      fog: {
        ...messagesDef.genericWarntypState,
        _channel: { ...defaultChannel, common: { name: "statesObjectsWarnings.allService.alerts.fog" } }
      }
    },
    command: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "statesObjectsWarnings.allService.command"
        },
        native: {}
      },
      telegram: {
        _id: "",
        type: "state",
        common: {
          name: "Telegram",
          type: "boolean",
          role: "button",
          read: false,
          write: true
        },
        native: {}
      },
      pushover: {
        _id: "",
        type: "state",
        common: {
          name: "Pushover",
          type: "boolean",
          role: "button",
          read: false,
          write: true
        },
        native: {}
      },
      whatsapp: {
        _id: "",
        type: "state",
        common: {
          name: "Whatsapp",
          type: "boolean",
          role: "button",
          read: false,
          write: true
        },
        native: {}
      },
      email: {
        _id: "",
        type: "state",
        common: {
          name: "Email",
          type: "boolean",
          role: "button",
          read: false,
          write: true
        },
        native: {}
      },
      history: {
        _id: "",
        type: "state",
        common: {
          name: "History",
          type: "boolean",
          role: "button",
          read: false,
          write: true
        },
        native: {}
      },
      json: {
        _id: "",
        type: "state",
        common: {
          name: "Json",
          type: "boolean",
          role: "button",
          read: false,
          write: true
        },
        native: {}
      },
      alexa2: {
        _id: "",
        type: "state",
        common: {
          name: "Alexa",
          type: "boolean",
          role: "button",
          read: false,
          write: true
        },
        native: {}
      }
    }
  }
};
const Defaults = {
  state: {
    _id: "No_definition",
    type: "state",
    common: {
      name: "No definition",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  }
};
const PROVIDER_OPTIONS = {
  dwdService: {
    url_base: "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=2.0.0&request=GetFeature&maxFeatures=10&outputFormat=application%2Fjson",
    url_appendix_town: "&typeName=dwd%3AWarnungen_Gemeinden&CQL_FILTER=WARNCELLID%20IN%20(%27#  #%27)",
    url_appendix_land: "&typeName=dwd%3AWarnungen_Landkreise&CQL_FILTER=GC_WARNCELLID%20IN%20(%27#  #%27)",
    url_appendix_townlist: "&typeName=dwd%3AWarngebiete_Gemeinden",
    url_appendix_landlist: "&typeName=dwd%3AWarngebiete_Kreise",
    url_language: `&language=#+  +#`,
    url: `https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=dwd%3AWarnungen_Gemeinden&maxFeatures=50&outputFormat=application%2Fjson`,
    language: {
      de: "ger",
      en: "eng",
      it: "ita",
      fr: "fre",
      es: "spa"
    }
  },
  zamgService: {
    url: "https://warnungen.zamg.at/wsapp/api/getWarningsForCoords?lat=#  #&lon=#+  +#1&lang=#++  ++#"
  },
  uwzService: {
    url: `http://feed.alertspro.meteogroup.com/AlertsPro/AlertsProPollService.php?method=getWarning&language=de&areaID=#  #`
  },
  ninaService: {
    url: "${warncellid}"
  },
  noService: {
    url: "",
    languages: [{ de: "German" }, { en: "English" }, { it: "Italy" }, { fr: "French" }, { es: "Spanish" }]
  },
  metroService: {
    url: ""
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Defaults,
  PROVIDER_OPTIONS,
  defaultChannel,
  genericStateObjects,
  statesObjectsWarnings
});
//# sourceMappingURL=definitionen.js.map
