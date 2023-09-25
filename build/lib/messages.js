"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var messages_exports = {};
__export(messages_exports, {
  Messages: () => Messages
});
module.exports = __toCommonJS(messages_exports);
var import_definitionen = require("./def/definitionen");
var import_messages_def = require("./def/messages-def");
var import_messages_def2 = require("./def/messages-def");
var import_messages_def3 = require("./def/messages-def");
var import_messages_def4 = require("./def/messages-def");
var import_library = require("./library");
class Messages extends import_library.BaseClass {
  provider;
  library;
  formatedKeysJsonataDefinition = {};
  formatedData;
  rawWarning;
  newMessage = true;
  updated = false;
  notDeleted = false;
  messages = [];
  formatedKeyCommand = {
    dwdService: {
      starttime: { jsonata: `$fromMillis($toMillis(ONSET),"[H#1]:[m01]","\${this.timeOffset}")` },
      startdate: { jsonata: `$fromMillis($toMillis(ONSET),"[D01].[M01]","\${this.timeOffset}")` },
      endtime: { jsonata: `$fromMillis($toMillis(EXPIRES),"[H#1]:[m01]","\${this.timeOffset}")` },
      enddate: { jsonata: `$fromMillis($toMillis(EXPIRES),"[D01].[M01]","\${this.timeOffset}")` },
      startdayofweek: {
        typescript: {
          node: `ONSET`,
          cmd: "dayoftheweek"
        }
      },
      enddayofweek: {
        typescript: {
          node: `EXPIRES`,
          cmd: "dayoftheweek"
        }
      },
      headline: { jsonata: `HEADLINE` },
      description: { jsonata: `DESCRIPTION` },
      weathertext: { jsonata: `` },
      ceiling: { jsonata: `$floor(CEILING * 0.3048)` },
      altitude: { jsonata: `$floor(ALTITUDE * 0.3048)` },
      warnlevelcolor: {
        jsonata: `($temp := $lookup(${JSON.stringify(import_messages_def2.dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
          import_messages_def4.color.generic
        )},$string($temp)))`
      },
      warnlevelname: {
        jsonata: `($temp := $lookup(${JSON.stringify(import_messages_def2.dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
          import_messages_def4.color.textGeneric
        )},$string($temp)))`
      },
      warnlevelnumber: { jsonata: `$lookup(${JSON.stringify(import_messages_def2.dwdLevel)},$lowercase(SEVERITY))` },
      warntypename: { jsonata: `EC_GROUP` },
      location: { jsonata: `AREADESC` }
    },
    uwzService: {
      starttime: { jsonata: `$fromMillis(dtgStart,"[H#1]:[m01]","\${this.timeOffset}")` },
      startdate: { jsonata: `$fromMillis(dtgStart,"[D01].[M01]","\${this.timeOffset}")` },
      endtime: { jsonata: `$fromMillis(dtgEnd,"[H#1]:[m01]","\${this.timeOffset}")` },
      enddate: { jsonata: `$fromMillis(dtgEnd,"[D01].[M01]","\${this.timeOffset}")` },
      startdayofweek: {
        typescript: {
          node: `dtgStart`,
          cmd: "dayoftheweek"
        }
      },
      enddayofweek: {
        typescript: {
          node: `dtgEnd`,
          cmd: "dayoftheweek"
        }
      },
      headline: { jsonata: `payload.translationsShortText` },
      description: { jsonata: `payload.translationsLongText` },
      weathertext: { jsonata: `` },
      ceiling: { jsonata: `payload.altMin` },
      altitude: { jsonata: `payload.altMax` },
      warnlevelname: {
        jsonata: `$string(($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          import_messages_def3.level.uwz
        )}, $i[2]); $lookup(${JSON.stringify(import_messages_def4.color.textGeneric)},$string($l))))`
      },
      warnlevelnumber: {
        jsonata: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          import_messages_def3.level.uwz
        )}, $i[2]))`
      },
      warnlevelcolor: {
        jsonata: `$lookup(${JSON.stringify(
          import_messages_def4.color.generic
        )},$string(($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          import_messages_def3.level.uwz
        )}, $i[2]))))`
      },
      warntypename: { jsonata: `type` },
      location: { jsonata: `areaID` }
    },
    zamgService: {
      starttime: { jsonata: `$fromMillis($number(rawinfo.start),"[H#1]:[m01]","\${this.timeOffset}")` },
      startdate: { jsonata: `$fromMillis($number(rawinfo.start),"[D01].[M01]","\${this.timeOffset}")` },
      endtime: { jsonata: `$fromMillis($number(rawinfo.end),"[H#1]:[m01]","\${this.timeOffset}")` },
      enddate: { jsonata: `$fromMillis($number(rawinfo.end),"[D01].[M01]","\${this.timeOffset}")` },
      startdayofweek: {
        typescript: {
          node: `$number(rawinfo.start)`,
          cmd: "dayoftheweek"
        }
      },
      enddayofweek: {
        typescript: {
          node: `$number(rawinfo.end)`,
          cmd: "dayoftheweek"
        }
      },
      headline: { jsonata: `text` },
      description: { jsonata: `auswirkungen` },
      weathertext: { jsonata: `meteotext` },
      ceiling: { jsonata: `` },
      altitude: { jsonata: `` },
      warnlevelname: { jsonata: `` },
      warnlevelnumber: {
        jsonata: `$string(rawinfo.wlevel)`
      },
      warnlevelcolor: {
        jsonata: `$lookup(${JSON.stringify(import_messages_def4.color.zamgColor)},$string(rawinfo.wlevel))`
      },
      warntypename: { jsonata: `$lookup(${JSON.stringify(import_messages_def.warnTypeName.zamgService)},$string(rawinfo.wtype))` },
      location: { jsonata: `` },
      instruction: { jsonata: `empfehlungen` }
    },
    default: {
      starttime: { jsonata: `` },
      startdate: { jsonata: `` },
      endtime: { jsonata: `` },
      enddate: { jsonata: `` },
      startdayofweek: { jsonata: `` },
      enddayofweek: { jsonata: `` },
      headline: { jsonata: `` },
      description: { jsonata: `` },
      weathertext: { jsonata: `` },
      ceiling: { jsonata: `` },
      altitude: { jsonata: `` },
      warnlevelname: { jsonata: `` },
      warnlevelnumber: { jsonata: `` },
      warnlevelcolor: { jsonata: `` },
      warntypename: { jsonata: `` },
      location: { jsonata: `` },
      instruction: { jsonata: `` }
    }
  };
  constructor(adapter, name, provider, data) {
    super(adapter, name);
    if (provider === null) {
      throw new Error(`${this.log.getName()} provider is null`);
    }
    if (!data) {
      throw new Error(`${this.log.getName()} data is null`);
    }
    this.provider = provider;
    this.library = this.adapter.library;
    this.rawWarning = data;
    switch (provider.service) {
      case `dwdService`:
      case `uwzService`:
      case `zamgService`:
        const json = this.formatedKeyCommand[provider.service];
        for (const k in json) {
          const key = k;
          const data2 = this.formatedKeyCommand[provider.service][key];
          this.addFormatedDefinition(key, data2);
        }
        break;
      default:
        this.formatedKeysJsonataDefinition = {
          starttime: { jsonata: `` },
          startdate: { jsonata: `` },
          endtime: { jsonata: `` },
          enddate: { jsonata: `` },
          startdayofweek: { jsonata: `` },
          enddayofweek: { jsonata: `` },
          headline: { jsonata: `` },
          description: { jsonata: `` },
          weathertext: { jsonata: `` },
          ceiling: { jsonata: `` },
          altitude: { jsonata: `` },
          warnlevelname: { jsonata: `` },
          warnlevelnumber: { jsonata: `` },
          warnlevelcolor: { jsonata: `` },
          warntypename: { jsonata: `` },
          location: { jsonata: `` }
        };
    }
  }
  async init() {
    return await this.updateFormatedData(true);
  }
  async formatMessages() {
    if (!this.formatedData)
      return;
    const templates = this.adapter.config.templateTable;
    const messages = [];
    for (const a in templates) {
      const template = templates[a].template;
      if (!template)
        continue;
      const temp = template.split("${");
      let msg = temp[0];
      for (let b = 1; temp.length > b; b++) {
        const token = temp[b];
        const t = token.split("}");
        const key = t[0];
        if (key && this.formatedData[key] !== void 0)
          msg += this.formatedData[key];
        else
          msg += key;
        if (t.length > 1)
          msg += t[1];
      }
      messages.push({ key: templates[a].templateKey, message: msg });
    }
    this.messages = messages;
  }
  async updateFormatedData(update = false) {
    if (!this.rawWarning && !this.formatedData) {
      throw new Error(`${this.log.getName()} rawWarning and formatedDate empty!`);
    }
    if (!this.formatedData || this.updated || update) {
      const timeOffset = (Math.floor(new Date().getTimezoneOffset() / 60) < 0 || new Date().getTimezoneOffset() % 60 < 0 ? "+" : "-") + ("00" + Math.abs(Math.floor(new Date().getTimezoneOffset() / 60))).slice(-2) + ("00" + Math.abs(new Date().getTimezoneOffset() % 60)).slice(-2);
      const temp = {};
      for (const key in this.formatedKeysJsonataDefinition) {
        const obj = this.formatedKeysJsonataDefinition[key];
        if (obj !== void 0 && obj.jsonata !== void 0) {
          const cmd = obj.jsonata.replace(`\${this.timeOffset}`, timeOffset);
          const result = await this.library.readWithJsonata(
            this.rawWarning,
            cmd
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
      for (const key in this.formatedKeysJsonataDefinition) {
        const obj = this.formatedKeysJsonataDefinition[key];
        if (obj !== void 0 && obj.typescript !== void 0) {
          temp[key] = await this.readWithTypescript(obj.typescript);
        }
      }
      this.formatedData = temp;
      this.updated = false;
    }
    if (!this.formatedData) {
      throw new Error(`${this.log.getName()} formatedDate is empty!`);
    }
    return this.formatedData;
  }
  async readWithTypescript(val) {
    if (!this.rawWarning && !val) {
      throw new Error("readWithTypescript called without rawWarning or val!");
    }
    const data = await this.library.readWithJsonata(this.rawWarning, val.node);
    switch (val.cmd) {
      case "dayoftheweek": {
        return new Date(data).toLocaleDateString("de-DE", { weekday: "long" });
      }
    }
    return "";
  }
  updateData(data) {
    this.rawWarning = data;
    this.notDeleted = true;
  }
  silentUpdate() {
    this.newMessage = false;
  }
  async sendMessage(override = false) {
    if (!this.newMessage && !override || this.messages.length == 0)
      return 0;
    for (let a = 0; a < this.messages.length; a++) {
      const msg = this.messages[a];
      this.library.writedp(
        `${this.provider.name}.messages.${msg.key}`,
        msg.message,
        import_definitionen.genericStateObjects.messageStates.message
      );
    }
    return 1;
  }
  delete() {
    this.library.garbageColleting(`${this.provider.name}.formated`);
  }
  async writeFormatedKeys(index) {
    this.library.writeFromJson(
      `${this.provider.name}.formatedKeys.${("00" + index.toString()).slice(-2)}`,
      `allService.formatedkeys`,
      import_definitionen.statesObjectsWarnings,
      this.formatedData
    );
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
  Messages
});
//# sourceMappingURL=messages.js.map
