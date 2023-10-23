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
var messages_exports = {};
__export(messages_exports, {
  MessagesClass: () => MessagesClass
});
module.exports = __toCommonJS(messages_exports);
var import_definitionen = require("./def/definitionen");
var MessageType = __toESM(require("./def/messages-def"));
var import_library = require("./library");
class MessagesClass extends import_library.BaseClass {
  provider;
  providerController;
  library;
  formatedKeysJsonataDefinition = {};
  formatedData;
  rawWarning;
  newMessage = true;
  updated = false;
  notDeleted = true;
  templates;
  messages = [];
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
  genericType = 1;
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
        node: `($temp := $lookup(${JSON.stringify(
          MessageType.dwdLevel
        )},$lowercase(SEVERITY));$lookup(${JSON.stringify(MessageType.color.generic)},$string($temp)))`
      },
      warnlevelcolorname: {
        node: `($temp := $lookup(${JSON.stringify(
          MessageType.dwdLevel
        )},$lowercase(SEVERITY));$lookup(${JSON.stringify(MessageType.color.textGeneric)},$string($temp)))`,
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
        node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          MessageType.level.uwz
        )}, $i[2]); $lookup(${JSON.stringify(MessageType.color.textGeneric)},$string($l)))`,
        cmd: "translate"
      },
      warnlevelnumber: {
        node: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          MessageType.level.uwz
        )}, $i[2]))`
      },
      warnlevelcolorhex: {
        node: `$lookup(${JSON.stringify(
          MessageType.color.generic
        )},$string(($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          MessageType.level.uwz
        )}, $i[2]))))`
      },
      warnlevelname: {
        node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
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
        node: `$lookup(${JSON.stringify(MessageType.color.textGeneric)},$string(rawinfo.wlevel + 1))`,
        cmd: "translate"
      },
      warnlevelnumber: {
        node: `$string(rawinfo.wlevel + 1)`
      },
      warnlevelcolorhex: {
        node: `$lookup(${JSON.stringify(MessageType.color.zamgColor)},$string(rawinfo.wlevel + 1))`
      },
      warnlevelname: {
        node: `$lookup(${JSON.stringify(MessageType.textLevels.textGeneric)},$string(rawinfo.wlevel + 1))`,
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
        cmd: void 0,
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
      }
    }
  };
  constructor(adapter, name, provider, data, pcontroller) {
    super(adapter, name);
    if (!data && provider) {
      throw new Error(`${this.log.getName()} data is null`);
    }
    this.provider = provider;
    this.library = this.adapter.library;
    this.rawWarning = data;
    this.templates = this.adapter.config.templateTable;
    this.providerController = pcontroller;
    switch (provider ? provider.service : "default") {
      case `dwdService`:
      case `uwzService`:
      case `zamgService`:
        if (provider && provider.service) {
          const json2 = this.formatedKeyCommand[provider.service];
          for (const k in json2) {
            const key = k;
            const data2 = json2[key];
            this.addFormatedDefinition(key, data2);
          }
        }
        break;
      default:
        const json = this.formatedKeyCommand["default"];
        for (const k in json) {
          const key = k;
          const data2 = json[key];
          this.addFormatedDefinition(key, data2);
        }
    }
  }
  async updateFormated() {
    switch (this.provider ? this.provider.service : "default") {
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
        this.type = 0;
        this.newMessage = false;
        this.notDeleted = false;
      }
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
      for (const t in sortedWarntypes) {
        const o = MessageType.genericWarntyp[sortedWarntypes[t]];
        const s = this.provider.service;
        if (Array.isArray(o[s]) && o[s].indexOf(this.type) != -1) {
          this.genericType = sortedWarntypes[t];
          break;
        }
      }
    }
    return await this.updateFormatedData(true);
  }
  filter(filter) {
    if (filter.level && filter.level > this.level)
      return false;
    if (this.provider && MessageType.filterWarntype(this.provider.service, filter.type, this.type))
      return false;
    return true;
  }
  async getMessage(templateKey) {
    let msg = "";
    const templates = this.adapter.config.templateTable;
    const tempid = templates.findIndex((a) => a.templateKey == templateKey);
    if (this.cache.ts < Date.now() - 6e4) {
      await this.updateFormated();
    }
    if (this.cache.messages[templateKey] !== void 0)
      return this.cache.messages[templateKey];
    if (this.formatedData) {
      msg = await this.getTemplates(tempid);
      if (tempid == -1) {
        this.log.error(`No template for Key: ${templateKey}!`);
      } else {
        this.cache.messages[templates[tempid].templateKey] = this.returnMessage(msg, this.starttime, templateKey);
      }
      return this.returnMessage(msg, this.starttime, templateKey);
    }
    return this.returnMessage(msg, this.starttime, templateKey);
  }
  async getTemplates(tempid) {
    let msg = "";
    const templates = this.adapter.config.templateTable;
    if (!this.formatedData)
      return msg;
    let count = 0;
    while (count++ < 100) {
      if (tempid == -1)
        break;
      let rerun = false;
      const template = msg === "" ? templates[tempid].template : msg;
      if (!template)
        break;
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
              } catch (error) {
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
            if (arraykey[0].indexOf(a) == -1)
              continue;
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
                if (result)
                  temp2 = arraykey[1].split("#")[0];
                else
                  temp2 = arraykey[1].split("#")[1] !== void 0 ? arraykey[1].split("#")[1] : "";
              } else if (result)
                temp2 = arraykey[1];
              if (temp2.indexOf("\\${") != -1) {
                temp2 = temp2.replaceAll("\\${", "${");
                temp2 = temp2.replaceAll("\\}", "}");
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
        } else if (key && this.formatedData[key] !== void 0)
          msg += this.formatedData[key];
        else if (key && this.formatedData[key.toLowerCase()] !== void 0) {
          let m = this.formatedData[key.toLowerCase()];
          if (typeof m == "string" && m.length > 0) {
            m = m[0].toUpperCase() + (key[key.length - 1] == key[key.length - 1].toUpperCase() ? m.slice(1).toUpperCase() : m.slice(1));
          }
          msg += m;
        } else
          msg += key;
        if (t.length > 1)
          msg += t[1];
      }
      if (!rerun)
        break;
    }
    return msg;
  }
  returnMessage = (msg, time, template) => {
    return { startts: time, text: msg.replaceAll("\\}", "}").replaceAll("\\n", "\n"), template };
  };
  async updateFormatedData(update = false) {
    if (!this.rawWarning && !this.formatedData) {
      throw new Error(`${this.log.getName()} error(165) rawWarning and formatedDate empty!`);
    }
    if (!this.formatedData || this.updated || update) {
      const timeOffset = (Math.floor(new Date().getTimezoneOffset() / 60) < 0 || new Date().getTimezoneOffset() % 60 < 0 ? "+" : "-") + ("00" + Math.abs(Math.floor(new Date().getTimezoneOffset() / 60))).slice(-2) + ("00" + Math.abs(new Date().getTimezoneOffset() % 60)).slice(-2);
      const status = this.newMessage ? MessageType.status.new : this.notDeleted ? MessageType.status.hold : MessageType.status.clear;
      const temp = {};
      for (const key in this.formatedKeysJsonataDefinition) {
        const obj = this.formatedKeysJsonataDefinition[key];
        if (obj !== void 0) {
          const cmd = obj.node !== void 0 ? obj.node.replace(`\${this.timeOffset}`, timeOffset) : "";
          let result = cmd != "" ? await this.library.readWithJsonata(
            this.rawWarning,
            cmd
          ) : "";
          if (obj.cmd !== void 0)
            result = await this.readWithTypescript(
              result,
              obj.cmd
            );
          if (typeof result == "object") {
            for (const a in result) {
              if (temp[key])
                temp[key] += ", ";
              else
                temp[key] = "";
              temp[key] += result[a];
            }
          } else
            temp[key] = result;
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
      this.formatedData.locationcustom = this.provider ? this.provider.customName : "";
      this.formatedData.provider = this.provider ? this.provider.service.replace("Service", "").toUpperCase() : "unknown";
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
        this.formatedData[t.templateKey] = await this.getTemplates(a);
      }
    }
    return this.formatedData;
  }
  async readWithTypescript(data, cmd) {
    if (!this.rawWarning && !cmd) {
      throw new Error("readWithTypescript called without rawWarning or val!");
    }
    switch (cmd) {
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
        if (await this.library.fileExistAsync(`icons/${color}/${id}.png`)) {
          return `${this.adapter.config.iobrokerUrl || ""}/adapter/${this.adapter.name}/icons/${color}/${id}.png`;
        }
        return "";
      }
      case "daytime": {
        const hour = new Date(data).getHours();
        let daytime = "noon";
        for (const a in MessageType.daytimes) {
          daytime = a;
          const opt = MessageType.daytimes[daytime];
          if (opt.start < opt.end) {
            if (opt.start <= hour && opt.end > hour)
              break;
          } else {
            if (opt.start <= hour || opt.end > hour)
              break;
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
          if (o == rest)
            return this.library.getTranslation(a);
        }
        return "";
      }
    }
    return "";
  }
  async updateData(data) {
    this.rawWarning = data;
    this.notDeleted = true;
    await this.updateFormated();
  }
  silentUpdate() {
    this.newMessage = false;
    this.notDeleted = true;
  }
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
      case "full":
        const h = d > 0 ? ("00" + String(remain.getUTCHours())).slice(2) : String(remain.getUTCHours());
        return `${diff < 0 ? "-" : ""}${d > 0 ? `${String(d)}:` : ""}${h}:${("00" + String(remain.getUTCMinutes())).slice(-2)}`;
    }
  }
  async delete() {
    super.delete();
    this.rawWarning = void 0;
    this.formatedData = void 0;
    this.notDeleted = false;
    this.newMessage = false;
    this.updated = false;
  }
  async writeFormatedKeys(index) {
    if (this.notDeleted) {
      if (this.provider)
        this.library.writeFromJson(
          `${this.provider.name}.formatedKeys.${("00" + index.toString()).slice(-2)}`,
          `allService.formatedkeys`,
          import_definitionen.statesObjectsWarnings,
          this.formatedData
        );
    }
  }
  addFormatedDefinition(key, arg) {
    if (arg === void 0)
      return;
    if (!this.formatedKeysJsonataDefinition)
      this.formatedKeysJsonataDefinition = {};
    this.formatedKeysJsonataDefinition[key] = arg;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessagesClass
});
//# sourceMappingURL=messages.js.map
