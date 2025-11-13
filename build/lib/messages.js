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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var messages_exports = {};
__export(messages_exports, {
  MessagesClass: () => MessagesClass
});
module.exports = __toCommonJS(messages_exports);
var import_uuid = require("uuid");
var import_definition = require("./def/definition");
var MessageType = __toESM(require("./def/messages-def"));
var library = __toESM(require("./library"));
var import_test_warnings = require("./test-warnings");
class MessagesClass extends library.BaseClass {
  provider;
  providerController;
  library;
  formatedKeysJsonataDefinition = {};
  formatedData;
  rawWarning;
  /** message is a new message */
  newMessage = true;
  /** message got a update lately */
  updated = false;
  /**Indicate if message is marked for remove. */
  notDeleted = true;
  templates;
  messages = [];
  uniqueId = "";
  starttime = 1;
  endtime = 1;
  ceiling = 0;
  altitude = 0;
  level = 0;
  type = 0;
  cache = {
    messages: {},
    ts: 0
  };
  genericType = 0;
  /** jsonata/typscript cmd to gather data from warning json */
  formatedKeyCommand = {
    dwdService: {
      starttime: {
        node: `$fromMillis($toMillis(ONSET),"[H#1]:[m01]","\${this.timeOffset}")`
      },
      startdate: {
        node: `$fromMillis($toMillis(ONSET),"[D01].[M01]","\${this.timeOffset}")`
      },
      endtime: {
        node: `$fromMillis($toMillis(EXPIRES),"[H#1]:[m01]","\${this.timeOffset}")`
      },
      enddate: {
        node: `$fromMillis($toMillis(EXPIRES),"[D01].[M01]","\${this.timeOffset}")`
      },
      startdayofweek: {
        node: `ONSET`,
        cmd: "dayoftheweek"
      },
      enddayofweek: {
        node: `EXPIRES`,
        cmd: "dayoftheweek"
      },
      headline: { node: `HEADLINE` },
      description: { node: `DESCRIPTION` },
      impact: { node: `` },
      ceiling: { node: `$floor(CEILING * 0.3048)` },
      altitude: { node: `$floor(ALTITUDE * 0.3048)` },
      warnlevelcolorhex: {
        node: `EC_AREA_COLOR`,
        cmd: `dwdcolor`
      },
      warnlevelcolorname: {
        node: `($temp := $lookup(${JSON.stringify(
          MessageType.dwdLevel
        )},$lowercase(SEVERITY));$lookup(${JSON.stringify(MessageType.color.textdwd)},$string($temp)))`,
        cmd: "translate"
      },
      warnlevelname: {
        node: `($temp := $lookup(${JSON.stringify(
          MessageType.dwdLevel
        )},$lowercase(SEVERITY));$lookup(${JSON.stringify(
          MessageType.textLevels.textGeneric
        )},$string($temp)))`,
        cmd: "translate"
      },
      warnlevelnumber: {
        node: `$lookup(${JSON.stringify(MessageType.dwdLevel)},$lowercase(SEVERITY))`
      },
      warntypename: {
        node: `$lookup(${JSON.stringify(MessageType.warnTypeName.dwdService)}, $string(EC_II))`,
        cmd: "translate"
      },
      location: { node: `AREADESC` },
      warntypegenericname: {
        cmd: void 0,
        node: ""
      },
      instruction: {
        cmd: void 0,
        node: "INSTRUCTION"
      },
      provider: {
        cmd: void 0,
        node: ""
      },
      locationcustom: {
        cmd: void 0,
        node: ""
      },
      startdayofweekshort: {
        node: `ONSET`,
        cmd: "dayoftheweekshort"
      },
      enddayofweekshort: {
        node: `EXPIRES`,
        cmd: "dayoftheweekshort"
      },
      countdown: {
        cmd: "countdown",
        node: "$toMillis(ONSET)"
      },
      status: {
        cmd: void 0,
        node: ""
      },
      starttimems: {
        cmd: void 0,
        node: ""
      },
      endtimems: {
        cmd: void 0,
        node: ""
      },
      iconurl: {
        cmd: "geticon",
        node: ""
      },
      startday: {
        cmd: void 0,
        node: `$fromMillis($toMillis(ONSET),"[D01]","\${this.timeOffset}")`
      },
      startmonth: {
        cmd: void 0,
        node: `$fromMillis($toMillis(ONSET),"[M01]","\${this.timeOffset}")`
      },
      endday: {
        cmd: void 0,
        node: `$fromMillis($toMillis(EXPIRES),"[D01]","\${this.timeOffset}")`
      },
      endmonth: {
        cmd: void 0,
        node: `$fromMillis($toMillis(EXPIRES),"[M01]","\${this.timeOffset}")`
      },
      warntypegeneric: {
        cmd: void 0,
        node: ""
      },
      cdminute: {
        cmd: "countdownminutes",
        node: "$toMillis(ONSET)"
      },
      cdhour: {
        cmd: "countdownhours",
        node: "$toMillis(ONSET)"
      },
      cdfuture: {
        cmd: "countdownfuture",
        node: "$toMillis(ONSET)"
      },
      startdaytime: {
        cmd: "daytime",
        node: "ONSET"
      },
      enddaytime: {
        cmd: "daytime",
        node: "EXPIRES"
      },
      startadverb: {
        cmd: "adverb",
        node: "ONSET"
      },
      warningcount: {
        cmd: "warningcount",
        node: ""
      },
      htmlicon: {
        cmd: "iconbase64",
        node: ""
      },
      weatheremoji: {
        cmd: "getEmoji",
        node: ""
      },
      zamgdayPeriod: {
        cmd: "fullday",
        node: ""
      }
    },
    uwzService: {
      starttime: {
        node: `$fromMillis(dtgStart * 1000,"[H#1]:[m01]","\${this.timeOffset}")`
      },
      startdate: {
        node: `$fromMillis(dtgStart * 1000,"[D01].[M01]","\${this.timeOffset}")`
      },
      endtime: {
        node: `$fromMillis(dtgEnd * 1000,"[H#1]:[m01]","\${this.timeOffset}")`
      },
      enddate: {
        node: `$fromMillis(dtgEnd * 1000,"[D01].[M01]","\${this.timeOffset}")`
      },
      startdayofweek: {
        node: `dtgStart * 1000`,
        cmd: "dayoftheweek"
      },
      enddayofweek: {
        node: `dtgEnd * 1000`,
        cmd: "dayoftheweek"
      },
      headline: { node: `payload.translationsShortText` },
      description: { node: `payload.translationsLongText` },
      impact: { node: `` },
      ceiling: { node: `payload.altMax` },
      altitude: { node: `payload.altMin` },
      warnlevelcolorname: {
        node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 0 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          MessageType.level.uwz
        )}, $i[2]); $lookup(${JSON.stringify(MessageType.color.textuwz)},$string($l)))`,
        cmd: "translate"
      },
      warnlevelnumber: {
        node: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 0 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          MessageType.level.uwz
        )}, $i[2]))`
      },
      warnlevelcolorhex: {
        node: `$lookup(${JSON.stringify(
          MessageType.color.uwzColor
        )},$string(($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 0 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          MessageType.level.uwz
        )}, $i[2]))))`
      },
      warnlevelname: {
        node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 0 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          MessageType.level.uwz
        )}, $i[2]); $lookup(${JSON.stringify(MessageType.textLevels.textGeneric)},$string($l)))`,
        cmd: "translate"
      },
      warntypename: {
        node: `$lookup(${JSON.stringify(MessageType.warnTypeName.uwzService)}, $string(type))`,
        cmd: "translate"
      },
      location: { node: `areaID` },
      warntypegenericname: {
        cmd: void 0,
        node: ""
      },
      instruction: {
        cmd: void 0,
        node: ""
      },
      provider: {
        cmd: void 0,
        node: ""
      },
      locationcustom: {
        cmd: void 0,
        node: ""
      },
      startdayofweekshort: {
        node: `dtgStart * 1000`,
        cmd: "dayoftheweekshort"
      },
      enddayofweekshort: {
        node: `dtgEnd * 1000`,
        cmd: "dayoftheweekshort"
      },
      countdown: {
        cmd: "countdown",
        node: "dtgStart * 1000"
      },
      status: {
        cmd: void 0,
        node: ""
      },
      starttimems: {
        cmd: void 0,
        node: ""
      },
      endtimems: {
        cmd: void 0,
        node: ""
      },
      iconurl: {
        cmd: "geticon",
        node: ""
      },
      startday: {
        cmd: void 0,
        node: `$fromMillis(dtgStart * 1000,"[D01]","\${this.timeOffset}")`
      },
      startmonth: {
        cmd: void 0,
        node: `$fromMillis(dtgStart * 1000,"[M01]","\${this.timeOffset}")`
      },
      endday: {
        cmd: void 0,
        node: `$fromMillis(dtgEnd * 1000,"[D01]","\${this.timeOffset}")`
      },
      endmonth: {
        cmd: void 0,
        node: `$fromMillis(dtgEnd * 1000,"[M01]","\${this.timeOffset}")`
      },
      warntypegeneric: {
        cmd: void 0,
        node: ""
      },
      cdminute: {
        cmd: "countdownminutes",
        node: "dtgStart * 1000"
      },
      cdhour: {
        cmd: "countdownhours",
        node: "dtgStart * 1000"
      },
      cdfuture: {
        cmd: "countdownfuture",
        node: "dtgStart * 1000"
      },
      startdaytime: {
        cmd: "daytime",
        node: "dtgStart * 1000"
      },
      enddaytime: {
        cmd: "daytime",
        node: "dtgEnd * 1000"
      },
      startadverb: {
        cmd: "adverb",
        node: "dtgStart * 1000"
      },
      warningcount: {
        cmd: "warningcount",
        node: ""
      },
      htmlicon: {
        cmd: "iconbase64",
        node: ""
      },
      weatheremoji: {
        cmd: "getEmoji",
        node: ""
      },
      zamgdayPeriod: {
        cmd: "fullday",
        node: ""
      }
    },
    zamgService: {
      starttime: {
        node: `$fromMillis($number(rawinfo.start)*1000,"[H#1]:[m01]","\${this.timeOffset}")`
      },
      startdate: {
        node: `$fromMillis($number(rawinfo.start)*1000,"[D01].[M01]","\${this.timeOffset}")`
      },
      endtime: {
        node: `$fromMillis($number(rawinfo.end)*1000,"[H#1]:[m01]","\${this.timeOffset}")`
      },
      enddate: {
        node: `$fromMillis($number(rawinfo.end)*1000,"[D01].[M01]","\${this.timeOffset}")`
      },
      startdayofweek: {
        node: `$number(rawinfo.start)*1000`,
        cmd: "dayoftheweek"
      },
      enddayofweek: {
        node: `$number(rawinfo.end)*1000`,
        cmd: "dayoftheweek"
      },
      headline: { node: `text` },
      description: { node: `meteotext` },
      impact: { node: `auswirkungen` },
      ceiling: { node: `` },
      altitude: { node: `` },
      warnlevelcolorname: {
        node: `$lookup(${JSON.stringify(MessageType.color.textzamg)},$string(rawinfo.wlevel))`,
        cmd: "translate"
      },
      warnlevelnumber: {
        node: `$string(rawinfo.wlevel)`
      },
      warnlevelcolorhex: {
        node: `$lookup(${JSON.stringify(MessageType.color.zamgColor)},$string(rawinfo.wlevel))`
      },
      warnlevelname: {
        node: `$lookup(${JSON.stringify(MessageType.textLevels.textGeneric)},$string(rawinfo.wlevel))`,
        cmd: "translate"
      },
      warntypename: {
        node: `$lookup(${JSON.stringify(MessageType.warnTypeName.zamgService)},$string(rawinfo.wtype))`,
        cmd: "translate"
      },
      location: { node: `location` },
      instruction: { node: `empfehlungen` },
      warntypegenericname: {
        cmd: void 0,
        node: ""
      },
      provider: {
        cmd: void 0,
        node: ""
      },
      locationcustom: {
        cmd: void 0,
        node: ""
      },
      startdayofweekshort: {
        node: `$number(rawinfo.start)*1000`,
        cmd: "dayoftheweekshort"
      },
      enddayofweekshort: {
        node: `$number(rawinfo.end)*1000`,
        cmd: "dayoftheweekshort"
      },
      countdown: {
        cmd: "countdown",
        node: "$number(rawinfo.start)*1000"
      },
      status: {
        cmd: void 0,
        node: ""
      },
      starttimems: {
        cmd: void 0,
        node: ""
      },
      endtimems: {
        cmd: void 0,
        node: ""
      },
      iconurl: {
        cmd: "geticon",
        node: ""
      },
      startday: {
        cmd: void 0,
        node: `$fromMillis($number(rawinfo.start)*1000,"[D01]","\${this.timeOffset}")`
      },
      startmonth: {
        cmd: void 0,
        node: `$fromMillis($number(rawinfo.start)*1000,"[M01]","\${this.timeOffset}")`
      },
      endday: {
        cmd: void 0,
        node: `$fromMillis($number(rawinfo.end)*1000,"[D01]","\${this.timeOffset}")`
      },
      endmonth: {
        cmd: void 0,
        node: `$fromMillis($number(rawinfo.end)*1000,"[M01]","\${this.timeOffset}")`
      },
      warntypegeneric: {
        cmd: void 0,
        node: ""
      },
      cdminute: {
        cmd: "countdownminutes",
        node: "$number(rawinfo.start)*1000"
      },
      cdhour: {
        cmd: "countdownhours",
        node: "$number(rawinfo.start)*1000"
      },
      cdfuture: {
        cmd: "countdownfuture",
        node: "$number(rawinfo.start)*1000"
      },
      startdaytime: {
        cmd: "daytime",
        node: "$number(rawinfo.start)*1000"
      },
      enddaytime: {
        cmd: "daytime",
        node: "$number(rawinfo.end)*1000"
      },
      startadverb: {
        cmd: "adverb",
        node: "$number(rawinfo.start)*1000"
      },
      warningcount: {
        cmd: "warningcount",
        node: ""
      },
      htmlicon: {
        cmd: "iconbase64",
        node: ""
      },
      weatheremoji: {
        cmd: "getEmoji",
        node: ""
      },
      zamgdayPeriod: {
        cmd: "fullday",
        node: ""
      }
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
      impact: { node: `` },
      ceiling: { node: `` },
      altitude: { node: `` },
      warnlevelname: { node: `` },
      warnlevelnumber: { node: `` },
      warnlevelcolorhex: { node: `` },
      warnlevelcolorname: { node: `` },
      warntypename: { node: `` },
      location: { node: `` },
      instruction: { node: `` },
      warntypegenericname: {
        cmd: void 0,
        node: ""
      },
      provider: {
        cmd: void 0,
        node: ""
      },
      locationcustom: {
        cmd: void 0,
        node: ""
      },
      startdayofweekshort: {
        cmd: void 0,
        node: ""
      },
      enddayofweekshort: {
        cmd: void 0,
        node: ""
      },
      countdown: {
        cmd: void 0,
        node: ""
      },
      status: {
        cmd: void 0,
        node: ""
      },
      starttimems: {
        cmd: void 0,
        node: ""
      },
      endtimems: {
        cmd: void 0,
        node: ""
      },
      iconurl: {
        cmd: "geticon",
        node: ""
      },
      startday: {
        cmd: void 0,
        node: ""
      },
      startmonth: {
        cmd: void 0,
        node: ""
      },
      endday: {
        cmd: void 0,
        node: ""
      },
      endmonth: {
        cmd: void 0,
        node: ""
      },
      warntypegeneric: {
        cmd: void 0,
        node: ""
      },
      cdminute: {
        cmd: void 0,
        node: ""
      },
      cdhour: {
        cmd: void 0,
        node: ""
      },
      cdfuture: {
        cmd: void 0,
        node: ""
      },
      startdaytime: {
        cmd: void 0,
        node: ""
      },
      enddaytime: {
        cmd: void 0,
        node: ""
      },
      startadverb: {
        cmd: void 0,
        node: ""
      },
      warningcount: {
        cmd: void 0,
        node: ""
      },
      htmlicon: {
        cmd: void 0,
        node: ""
      },
      weatheremoji: {
        cmd: "getEmoji",
        node: ""
      },
      zamgdayPeriod: {
        cmd: void 0,
        node: ""
      }
    }
  };
  providerParent = null;
  /**
   * Creates a new MessagesClass object.
   *
   * @param adapter the adapter instance
   * @param name the name of the object
   * @param [provider] the provider object
   * @param [data] the raw data of the warning
   * @param pcontroller the provider controller
   * @param [providerParent] the provider parent
   */
  constructor(adapter, name, provider, data, pcontroller, providerParent = null) {
    super(adapter, name);
    this.uniqueId = (0, import_uuid.v4)();
    if (!data && provider) {
      throw new Error(`${this.log.getName()} data is null`);
    }
    this.provider = provider;
    this.library = this.adapter.library;
    this.rawWarning = data;
    this.templates = this.adapter.config.templateTable;
    this.providerController = pcontroller;
    this.providerParent = providerParent ? providerParent : null;
    switch (provider ? provider.service : "default") {
      case `dwdService`:
      case `uwzService`:
      case `zamgService`:
        if (provider && provider.service) {
          const json = this.formatedKeyCommand[provider.service];
          for (const k in json) {
            const key = k;
            const data2 = json[key];
            this.addFormatedDefinition(key, data2);
          }
        }
        break;
      default: {
        const json = this.formatedKeyCommand.default;
        for (const k in json) {
          const key = k;
          const data2 = json[key];
          this.addFormatedDefinition(key, data2);
        }
        switch (this.providerParent ? this.providerParent.service : "") {
          case `dwdService`:
            {
              this.rawWarning = import_test_warnings.defaultData.dwdService;
              this.rawWarning.HEADLINE = this.library.getTranslation("NoWarning");
            }
            break;
          case `uwzService`:
            {
              this.rawWarning = import_test_warnings.defaultData.uwzService;
              this.rawWarning.payload.translationsShortText.DE = this.library.getTranslation("NoWarning");
            }
            break;
          case `zamgService`:
            {
              this.rawWarning = import_test_warnings.defaultData.zamgService;
              this.rawWarning.text = this.library.getTranslation("NoWarning");
            }
            break;
          default:
        }
        if (this.providerParent) {
          const json2 = this.formatedKeyCommand[this.providerParent.service];
          for (const k in json2) {
            const key = k;
            const data2 = json2[key];
            this.addFormatedDefinition(key, data2);
          }
        }
        break;
      }
    }
  }
  /**
   * Update the formated Data.
   *
   * @returns the updated data
   */
  async updateFormated() {
    switch (this.provider ? this.provider.service : this.providerParent ? this.providerParent.service : "default") {
      case "dwdService":
        {
          this.starttime = Number(await this.library.readWithJsonata(this.rawWarning, `$toMillis(ONSET)`));
          this.endtime = Number(await this.library.readWithJsonata(this.rawWarning, `$toMillis(EXPIRES)`));
          this.ceiling = Number(
            await this.library.readWithJsonata(this.rawWarning, `$floor(CEILING * 0.3048)`)
          );
          this.altitude = Number(
            await this.library.readWithJsonata(this.rawWarning, `$floor(ALTITUDE * 0.3048)`)
          );
          this.level = Number(
            await this.library.readWithJsonata(
              this.rawWarning,
              `$number($lookup(${JSON.stringify(MessageType.dwdLevel)},$lowercase(SEVERITY)))`
            )
          );
          this.type = Number(await this.library.readWithJsonata(this.rawWarning, `$number(EC_II)`));
        }
        break;
      case "uwzService":
        {
          this.starttime = Number(
            await this.library.readWithJsonata(this.rawWarning, `$number(dtgStart * 1000)`)
          );
          this.endtime = Number(
            await this.library.readWithJsonata(this.rawWarning, `$number(dtgEnd * 1000)`)
          );
          this.ceiling = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMax`));
          this.altitude = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMin`));
          this.level = Number(
            await this.library.readWithJsonata(
              this.rawWarning,
              `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                MessageType.level.uwz
              )}, $i[2]))`
            )
          );
          this.type = Number(await this.library.readWithJsonata(this.rawWarning, `$number(type)`));
        }
        break;
      case "zamgService":
        {
          this.starttime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(rawinfo.start)`)) * 1e3;
          this.endtime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(rawinfo.end)`)) * 1e3;
          this.ceiling = -1;
          this.altitude = -1;
          this.level = Number(await this.library.readWithJsonata(this.rawWarning, `rawinfo.wlevel`));
          this.type = Number(await this.library.readWithJsonata(this.rawWarning, `rawinfo.wtype`));
        }
        break;
      default: {
        this.starttime = 1;
        this.endtime = 1;
        this.ceiling = -1;
        this.altitude = -1;
        this.level = -1;
        this.type = -1;
        this.newMessage = false;
        this.notDeleted = true;
      }
    }
    if (this.name == "noMessage") {
      this.newMessage = false;
    }
    const sortedWarntypes = [
      10,
      7,
      2,
      4,
      3,
      8,
      9,
      5,
      6,
      11,
      12,
      1
    ];
    if (this.provider) {
      for (const wt of sortedWarntypes) {
        const o = MessageType.genericWarntyp[wt];
        const s = this.provider.service;
        if (Array.isArray(o[s]) && o[s].indexOf(this.type) != -1) {
          this.genericType = wt;
          break;
        }
      }
    }
    return await this.updateFormatedData();
  }
  /**
   * filters the message against a messageFilterType
   *
   * @param filter Provider.messageFilterType
   * @returns true if the message is not filtered, false otherwise
   */
  filter(filter) {
    if (filter.level && filter.level > this.level) {
      return false;
    }
    if (this.provider && MessageType.filterWarntype(this.provider.service, filter.type, this.type)) {
      return false;
    }
    return true;
  }
  /**
   * @description
   * Returns a message object based on the templateKey and caches the result for 1 minute.
   * If the templateKey is not found in the templateTable, it will log an error.
   * If the this.formatedData is not set, it will return an empty message.
   * @param templateKey The key of the template to use from the templateTable.
   * @param pushService The notification service object.
   * @returns A message object with the message text, start time and end time.
   */
  async getMessage(templateKey, pushService) {
    let msg = "";
    const templates = this.adapter.config.templateTable;
    const tempid = templates.findIndex((a) => a.templateKey == templateKey);
    if (this.cache.ts < Date.now() - 6e4) {
      await this.updateFormated();
    }
    if (this.cache.messages[templateKey] !== void 0) {
      return this.cache.messages[templateKey];
    }
    if (this.formatedData) {
      msg = this.getTemplates(tempid);
      if (tempid == -1) {
        this.log.error(`${pushService.name}`, `No template for key: ${templateKey}!`);
      } else {
        this.cache.messages[templates[tempid].templateKey] = this.returnMessage(this.uniqueId, msg, this.starttime, templateKey);
      }
    }
    return this.returnMessage(this.uniqueId, msg, this.starttime, templateKey);
  }
  getTemplates(tempid) {
    let msg = "";
    const templates = this.adapter.config.templateTable;
    if (!this.formatedData) {
      return msg;
    }
    let count = 0;
    while (count++ < 100) {
      if (tempid == -1) {
        break;
      }
      let rerun = false;
      const template = (msg === "" ? templates[tempid].template : msg).replaceAll("iconbase64", "htmlicon");
      if (!template) {
        break;
      }
      const temp = template.split(/(?<!\\)\${/g);
      msg = temp[0];
      for (let b = 1; temp.length > b; b++) {
        const t = temp[b].split(/(?<!\\)}/g);
        const key = t[0];
        const configTemplate = this.adapter.config.templateTable.filter((a) => a.templateKey == key);
        if (key[0] == "[") {
          const arraykey = key.split("]");
          arraykey[0] = arraykey[0].slice(1);
          if (arraykey[1] && this.formatedData[arraykey[1]] !== void 0) {
            const n = this.formatedData[arraykey[1]];
            if (n != "" && !Number.isNaN(n)) {
              try {
                msg += arraykey[0].split(",")[this.formatedData[arraykey[1]]].trim();
              } catch {
                this.log.error(`Array is not an array ${arraykey[0]} or index out of range ${n}.`);
              }
            }
          } else {
            this.log.error(
              `Unknown or not a number key ${arraykey[1]} in template ${templates[tempid].templateKey}!`
            );
          }
        } else if (key[0] == "(") {
          const arraykey = key.split(")");
          arraykey[0] = arraykey[0].slice(1);
          for (const a of ["<", ">", "=", "!="]) {
            if (arraykey[0].indexOf(a) == -1) {
              continue;
            }
            const funcarray = arraykey[0].split(a);
            const n = this.formatedData[funcarray[1].trim()];
            if (n !== void 0) {
              let result = false;
              switch (a) {
                case ">":
                  {
                    result = funcarray[0].trim() > n;
                  }
                  break;
                case "<":
                  {
                    result = funcarray[0].trim() < n;
                  }
                  break;
                case "=":
                  {
                    result = funcarray[0].trim() == n;
                  }
                  break;
                case "!=":
                  {
                    result = funcarray[0].trim() != n;
                  }
                  break;
              }
              let temp2 = "";
              if (arraykey[1].indexOf("#") != -1) {
                if (result) {
                  temp2 = arraykey[1].split("#")[0];
                } else {
                  temp2 = arraykey[1].split("#")[1] !== void 0 ? arraykey[1].split("#")[1] : "";
                }
              } else if (result) {
                temp2 = arraykey[1];
              }
              if (temp2.indexOf("\\${") != -1) {
                temp2 = temp2.replace(/\\\${/g, "${");
                temp2 = temp2.replace(/\\+}/g, "}");
                rerun = true;
              }
              msg += temp2;
            } else {
              this.log.error(`Unknown key ${funcarray[1]} in template ${templates[tempid].templateKey}!`);
              break;
            }
          }
        } else if (configTemplate.length == 1) {
          msg += configTemplate[0].template;
          rerun = true;
        } else if (key && this.formatedData[key] !== void 0) {
          msg += this.formatedData[key];
        } else if (key && this.formatedData[key.toLowerCase()] !== void 0) {
          let m = this.formatedData[key.toLowerCase()];
          if (typeof m == "string" && m.length > 0) {
            m = m[0].toUpperCase() + (key[key.length - 1] == key[key.length - 1].toUpperCase() ? m.slice(1).toUpperCase() : m.slice(1));
          }
          msg += m;
        } else {
          msg += key;
        }
        if (t.length > 1) {
          msg += t[1];
        }
      }
      if (!rerun) {
        break;
      }
    }
    return msg;
  }
  returnMessage = (uniqueId, msg, time, template) => {
    return {
      uniqueId,
      startts: time,
      text: msg.replace(/\\+}/g, "}").replace(/\\+n/g, "\n"),
      template
    };
  };
  /**
   * Update the formated Data.
   *
   * @returns the updated data
   */
  async updateFormatedData() {
    if (!this.rawWarning) {
      throw new Error(`${this.log.getName()} error(165) rawWarning null or undefined!`);
    }
    {
      const timeOffset = (Math.floor((/* @__PURE__ */ new Date()).getTimezoneOffset() / 60) < 0 || (/* @__PURE__ */ new Date()).getTimezoneOffset() % 60 < 0 ? "+" : "-") + `00${Math.abs(Math.floor((/* @__PURE__ */ new Date()).getTimezoneOffset() / 60))}`.slice(-2) + `00${Math.abs((/* @__PURE__ */ new Date()).getTimezoneOffset() % 60)}`.slice(-2);
      const status = this.newMessage ? MessageType.status.new : this.notDeleted && this.name != "noMessage" ? MessageType.status.hold : MessageType.status.clear;
      const temp = {};
      for (const key in this.formatedKeysJsonataDefinition) {
        const obj = this.formatedKeysJsonataDefinition[key];
        if (obj !== void 0) {
          const cmd = obj.node !== void 0 && obj.node != "" ? obj.node.replace(`\${this.timeOffset}`, timeOffset) : "";
          let result = cmd != "" ? await this.library.readWithJsonata(
            this.rawWarning,
            cmd
          ) : "";
          if (obj.cmd !== void 0) {
            result = this.readWithTypescript(result, obj.cmd);
          }
          if (typeof result == "object") {
            for (const a in result) {
              if (temp[key]) {
                temp[key] += ", ";
              } else {
                temp[key] = "";
              }
              temp[key] += result[a];
            }
          } else {
            temp[key] = result;
          }
        }
      }
      this.formatedData = {
        ...temp,
        status: this.library.getTranslation(status)
      };
      this.formatedData.warntypegenericname = this.library.getTranslation(
        MessageType.genericWarntyp[this.genericType].name
      );
      this.formatedData.warntypegeneric = this.genericType;
      this.formatedData.locationcustom = this.provider ? this.provider.customName : this.providerController.providers.map((a) => a.customName).filter((item, pos, arr) => arr.indexOf(item) == pos).join(", ");
      this.formatedData.provider = this.provider ? this.provider.service.replace("Service", "").toUpperCase() : this.providerParent ? this.providerParent.service.replace("Service", "").toUpperCase() : "unknown";
      this.updated = false;
    }
    if (!this.formatedData) {
      throw new Error(`${this.log.getName()} formatedDate is empty!`);
    }
    this.formatedData.starttimems = this.starttime;
    this.formatedData.endtimems = this.endtime;
    this.cache.ts = Date.now();
    this.cache.messages = {};
    for (let a = 0; a < this.adapter.config.templateTable.length; a++) {
      const t = this.adapter.config.templateTable[a];
      if (t.templateKey.startsWith("_")) {
        this.formatedData[t.templateKey] = this.getTemplates(a);
      }
    }
    return this.formatedData;
  }
  /**
   * Execute a command on the data of the raw warning.
   *
   * @param data the data to execute the command on
   * @param cmd the command to execute
   * @returns the result of the command
   */
  readWithTypescript(data, cmd) {
    if (!this.rawWarning && !cmd) {
      throw new Error("readWithTypescript called without rawWarning or val!");
    }
    switch (cmd) {
      case "fullday": {
        const diff = new Date(this.starttime).getTime() - new Date(this.endtime).getTime();
        if (diff > 867e5 || diff < 861e5 || !(new Date(this.starttime).getHours() <= 3)) {
          return "";
        }
        data = this.starttime;
      }
      // eslint-disable-next-line
      case "dayoftheweek": {
        return new Date(data).toLocaleDateString(this.library.getLocalLanguage(), {
          weekday: "long"
        });
      }
      case "dayoftheweekshort": {
        return new Date(data).toLocaleDateString(this.library.getLocalLanguage(), {
          weekday: "short"
        });
      }
      case "translate": {
        return this.library.getTranslation(data);
      }
      case "countdown": {
        return this.getCountdown(data, "full");
      }
      case "countdownhours": {
        return this.getCountdown(data, "hours");
      }
      case "countdownminutes": {
        return this.getCountdown(data, "minutes");
      }
      case "countdownfuture": {
        return this.getCountdown(data, "future");
      }
      case "geticon": {
        const id = MessageType.genericWarntyp[this.genericType].id;
        const color = this.adapter.config.icon_color || "blue";
        if (this.adapter.config.icons_prefix && this.adapter.config.icons_suffix) {
          return this.adapter.config.icons_prefix + id + this.adapter.config.icons_suffix;
        } else if (this.library.fileExistAsync(`icons/${color}/${id}.png`)) {
          return `/adapter/${this.adapter.name}/icons/${color}/${id}.png`;
        }
        return "";
      }
      case "iconbase64":
        {
          if (MessageType.warnTypeIconsBase64[this.genericType] !== void 0 && typeof MessageType.warnTypeIconsBase64[this.genericType] === "string") {
            return `${MessageType.warnTypeIconsBase64[this.genericType]}`;
          }
          return "";
        }
        break;
      case "getEmoji":
        {
          if (MessageType.genericWarntyp[this.genericType] !== void 0 && typeof MessageType.genericWarntyp[this.genericType].emoji === "string") {
            return `${MessageType.genericWarntyp[this.genericType].emoji}`;
          }
          return "";
        }
        break;
      case "daytime": {
        const hour = new Date(data).getHours();
        let daytime = "noon";
        for (const a in MessageType.daytimes) {
          daytime = a;
          const opt = MessageType.daytimes[daytime];
          if (opt.start < opt.end) {
            if (opt.start <= hour && opt.end > hour) {
              break;
            }
          } else {
            if (opt.start <= hour || opt.end > hour) {
              break;
            }
          }
        }
        return this.library.getTranslation(daytime);
      }
      case "adverb": {
        const day = new Date(new Date(Date.now()).setHours(0, 0, 0, 0)).getTime();
        let rest = (new Date(data).getTime() - day) / 864e5;
        rest = Math.floor(rest);
        for (const a in MessageType.temporalAdverbs) {
          const o = MessageType.temporalAdverbs[a];
          if (o == rest) {
            return this.library.getTranslation(a);
          }
        }
        return new Date(data).toLocaleDateString(this.library.getLocalLanguage(), {
          weekday: "long"
        });
      }
      case "dwdcolor":
        {
          if (!data) {
            return "";
          }
          const rgb = data.split(" ");
          if (rgb && rgb.length == 3) {
            return `#${`00${Number(rgb[0]).toString(16)}`.slice(
              -2
            )}${`00${Number(rgb[1]).toString(16)}`.slice(
              -2
            )}${`00${Number(rgb[2]).toString(16)}`.slice(-2)}`;
          }
        }
        break;
      case "warningcount":
        {
          return this.adapter.providerController.activeMessages;
        }
        break;
      default: {
        const _exhaustiveCheck = cmd;
        return _exhaustiveCheck;
      }
    }
    return "";
  }
  /**
   * Update the raw warning data and then update the formated data as well.
   *
   * @param data - The new raw warning data
   */
  async updateData(data) {
    this.rawWarning = data;
    this.notDeleted = true;
    await this.updateFormated();
  }
  /**
   * Resets the state of the message by marking it as not new and not deleted.
   */
  silentUpdate() {
    this.newMessage = false;
    this.notDeleted = true;
  }
  /**
   * Calculate the time difference between the given time and now.
   *
   * @param time - The time to calculate the difference from
   * @param typ - The type of countdown to return
   *  - 'minutes': The number of minutes until the time
   *  - 'hours': The number of hours until the time, including days
   *  - 'full': A string in the format `'-DD:HH:MM'` or `'+DD:HH:MM'`
   *  - 'future': `'-1'` if the time is in the past, `'1'` if the time is in the future
   * @returns The calculated countdown
   */
  getCountdown(time, typ) {
    const diff = time - Date.now();
    const remain = new Date(Math.abs(diff));
    const d = remain.getUTCDate() - 1;
    switch (typ) {
      case "future":
        return diff < 0 ? "-1" : "1";
      case "minutes":
        return String(remain.getUTCMinutes());
      case "hours":
        return String(d * 24 + remain.getUTCHours());
      case "full": {
        const h = d > 0 ? `00${String(remain.getUTCHours())}`.slice(2) : String(remain.getUTCHours());
        return `${diff < 0 ? "-" : ""}${d > 0 ? `${String(d)}:` : ""}${h}:${`00${String(remain.getUTCMinutes())}`.slice(
          -2
        )}`;
      }
    }
  }
  /**
   * Delete the message and remove it from the list of active messages.
   *
   * @returns A promise that resolves when the deletion is complete.
   */
  async delete() {
    await super.delete();
    this.rawWarning = void 0;
    this.formatedData = void 0;
    this.notDeleted = false;
    this.newMessage = false;
    this.updated = false;
  }
  /**
   * Writes the formated warning keys to the state `*.formatedKeys.*`
   *
   * @param index The index of the message in the list of active messages
   * @returns A promise that resolves when the write is complete
   */
  async writeFormatedKeys(index) {
    if (this.notDeleted) {
      if (this.provider) {
        await this.library.writeFromJson(
          `${this.provider.name}.formatedKeys.${`00${index.toString()}`.slice(-2)}`,
          `allService.formatedkeys`,
          import_definition.statesObjectsWarnings,
          this.formatedData
        );
      } else if (this.providerParent) {
        await this.library.writeFromJson(
          `${this.providerParent.name}.formatedKeys.${`00${index.toString()}`.slice(-2)}`,
          `allService.formatedkeys`,
          import_definition.statesObjectsWarnings,
          this.formatedData
        );
      }
    }
  }
  /**
   * Adds a formatted definition to the JSONata definitions map.
   *
   * @param key - The key under which the formatted definition will be stored.
   * @param arg - The formatted definition to be added. If undefined, the function returns immediately.
   */
  addFormatedDefinition(key, arg) {
    if (arg === void 0) {
      return;
    }
    if (!this.formatedKeysJsonataDefinition) {
      this.formatedKeysJsonataDefinition = {};
    }
    this.formatedKeysJsonataDefinition[key] = arg;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessagesClass
});
//# sourceMappingURL=messages.js.map
