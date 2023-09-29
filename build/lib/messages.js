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
  Messages: () => Messages,
  NotificationClass: () => NotificationClass
});
module.exports = __toCommonJS(messages_exports);
var import_definitionen = require("./def/definitionen");
var import_messages_def = require("./def/messages-def");
var import_library = require("./library");
class Messages extends import_library.BaseClass {
  provider;
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
  genericType = 1;
  formatedKeyCommand = {
    dwdService: {
      starttime: { node: `$fromMillis($toMillis(ONSET),"[H#1]:[m01]","\${this.timeOffset}")` },
      startdate: { node: `$fromMillis($toMillis(ONSET),"[D01].[M01]","\${this.timeOffset}")` },
      endtime: { node: `$fromMillis($toMillis(EXPIRES),"[H#1]:[m01]","\${this.timeOffset}")` },
      enddate: { node: `$fromMillis($toMillis(EXPIRES),"[D01].[M01]","\${this.timeOffset}")` },
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
      weathertext: { node: `` },
      ceiling: { node: `$floor(CEILING * 0.3048)` },
      altitude: { node: `$floor(ALTITUDE * 0.3048)` },
      warnlevelcolorhex: {
        node: `($temp := $lookup(${JSON.stringify(import_messages_def.dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
          import_messages_def.color.generic
        )},$string($temp)))`
      },
      warnlevelcolorname: {
        node: `($temp := $lookup(${JSON.stringify(import_messages_def.dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
          import_messages_def.color.textGeneric
        )},$string($temp)))`,
        cmd: "translate"
      },
      warnlevelname: {
        node: `($temp := $lookup(${JSON.stringify(import_messages_def.dwdLevel)},$lowercase(SEVERITY));$lookup(${JSON.stringify(
          import_messages_def.textLevels.textGeneric
        )},$string($temp)))`,
        cmd: "translate"
      },
      warnlevelnumber: { node: `$lookup(${JSON.stringify(import_messages_def.dwdLevel)},$lowercase(SEVERITY))` },
      warntypename: {
        node: `$lookup(${JSON.stringify(import_messages_def.warnTypeName.dwdService)}, $string(EC_II))`,
        cmd: "translate"
      },
      location: { node: `AREADESC` }
    },
    uwzService: {
      starttime: { node: `$fromMillis(dtgStart,"[H#1]:[m01]","\${this.timeOffset}")` },
      startdate: { node: `$fromMillis(dtgStart,"[D01].[M01]","\${this.timeOffset}")` },
      endtime: { node: `$fromMillis(dtgEnd,"[H#1]:[m01]","\${this.timeOffset}")` },
      enddate: { node: `$fromMillis(dtgEnd,"[D01].[M01]","\${this.timeOffset}")` },
      startdayofweek: {
        node: `dtgStart`,
        cmd: "dayoftheweek"
      },
      enddayofweek: {
        node: `dtgEnd`,
        cmd: "dayoftheweek"
      },
      headline: { node: `payload.translationsShortText` },
      description: { node: `payload.translationsLongText` },
      weathertext: { node: `` },
      ceiling: { node: `payload.altMax` },
      altitude: { node: `payload.altMin` },
      warnlevelcolorname: {
        node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          import_messages_def.level.uwz
        )}, $i[2]); $lookup(${JSON.stringify(import_messages_def.color.textGeneric)},$string($l)))`,
        cmd: "translate"
      },
      warnlevelnumber: {
        node: `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          import_messages_def.level.uwz
        )}, $i[2]))`
      },
      warnlevelcolorhex: {
        node: `$lookup(${JSON.stringify(
          import_messages_def.color.generic
        )},$string(($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          import_messages_def.level.uwz
        )}, $i[2]))))`
      },
      warnlevelname: {
        node: `($i := $split(payload.levelName, '_'); $l := $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
          import_messages_def.level.uwz
        )}, $i[2]); $lookup(${JSON.stringify(import_messages_def.textLevels.textGeneric)},$string($l)))`,
        cmd: "translate"
      },
      warntypename: {
        node: `$lookup(${JSON.stringify(import_messages_def.warnTypeName.uwzService)}, $string(type))`,
        cmd: "translate"
      },
      location: { node: `areaID` }
    },
    zamgService: {
      starttime: { node: `$fromMillis($number(rawinfo.start),"[H#1]:[m01]","\${this.timeOffset}")` },
      startdate: { node: `$fromMillis($number(rawinfo.start),"[D01].[M01]","\${this.timeOffset}")` },
      endtime: { node: `$fromMillis($number(rawinfo.end),"[H#1]:[m01]","\${this.timeOffset}")` },
      enddate: { node: `$fromMillis($number(rawinfo.end),"[D01].[M01]","\${this.timeOffset}")` },
      startdayofweek: {
        node: `$number(rawinfo.start)`,
        cmd: "dayoftheweek"
      },
      enddayofweek: {
        node: `$number(rawinfo.end)`,
        cmd: "dayoftheweek"
      },
      headline: { node: `text` },
      description: { node: `auswirkungen` },
      weathertext: { node: `meteotext` },
      ceiling: { node: `` },
      altitude: { node: `` },
      warnlevelcolorname: {
        node: `$lookup(${JSON.stringify(import_messages_def.color.textGeneric)},$string(rawinfo.wlevel))`,
        cmd: "translate"
      },
      warnlevelnumber: {
        node: `$string(rawinfo.wlevel)`
      },
      warnlevelcolorhex: {
        node: `$lookup(${JSON.stringify(import_messages_def.color.zamgColor)},$string(rawinfo.wlevel))`
      },
      warnlevelname: {
        node: `$lookup(${JSON.stringify(import_messages_def.textLevels.textGeneric)},$string(rawinfo.wlevel))`,
        cmd: "translate"
      },
      warntypename: {
        node: `$lookup(${JSON.stringify(import_messages_def.warnTypeName.zamgService)},$string(rawinfo.wtype))`,
        cmd: "translate"
      },
      location: { node: `location` },
      instruction: { node: `empfehlungen` }
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
      weathertext: { node: `` },
      ceiling: { node: `` },
      altitude: { node: `` },
      warnlevelname: { node: `` },
      warnlevelnumber: { node: `` },
      warnlevelcolorhex: { node: `` },
      warnlevelcolorname: { node: `` },
      warntypename: { node: `` },
      location: { node: `` },
      instruction: { node: `` }
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
    this.templates = this.adapter.config.templateTable;
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
          starttime: { node: `` },
          startdate: { node: `` },
          endtime: { node: `` },
          enddate: { node: `` },
          startdayofweek: { node: `` },
          enddayofweek: { node: `` },
          headline: { node: `` },
          description: { node: `` },
          weathertext: { node: `` },
          ceiling: { node: `` },
          altitude: { node: `` },
          warnlevelname: { node: `` },
          warnlevelnumber: { node: `` },
          warnlevelcolorhex: { node: `` },
          warnlevelcolorname: { node: `` },
          warntypename: { node: `` },
          location: { node: `` }
        };
    }
  }
  async init() {
    switch (this.provider.service) {
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
              `$number($lookup(${JSON.stringify(import_messages_def.dwdLevel)},$lowercase(SEVERITY)))`
            )
          );
          this.type = Number(await this.library.readWithJsonata(this.rawWarning, `$number(EC_II)`));
        }
        break;
      case "uwzService":
        {
          this.starttime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(dtgStart)`));
          this.endtime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(dtgEnd)`));
          this.ceiling = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMax`));
          this.altitude = Number(await this.library.readWithJsonata(this.rawWarning, `payload.altMin`));
          this.level = Number(
            await this.library.readWithJsonata(
              this.rawWarning,
              `($i := $split(payload.levelName, '_'); $i[0] = "notice" ? 1 : $i[1] = "forewarn" ? 1 : $lookup(${JSON.stringify(
                import_messages_def.level.uwz
              )}, $i[2]))`
            )
          );
          this.type = Number(await this.library.readWithJsonata(this.rawWarning, `$number(type)`));
        }
        break;
      case "zamgService":
        {
          this.starttime = Number(
            await this.library.readWithJsonata(this.rawWarning, `$number(rawinfo.start)`)
          );
          this.endtime = Number(await this.library.readWithJsonata(this.rawWarning, `$number(rawinfo.end)`));
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
      }
    }
    for (const t in import_messages_def.genericWarntyp) {
      const o = import_messages_def.genericWarntyp[Number(t)];
      const s = this.provider.service;
      if (Array.isArray(o[s]) && o[s].indexOf(this.type) != -1) {
        this.genericType = Number(t);
        break;
      }
    }
    return await this.updateFormatedData(true);
  }
  filter(filter) {
    this.type;
    let hit = false;
    if (filter.level && filter.level > this.level)
      return false;
    for (const f in filter.type) {
      if (import_messages_def.genericWarntyp[filter.type[f]][this.provider.service].indexOf(this.type) != -1) {
        hit = true;
        break;
      }
    }
    if (hit)
      return false;
    return true;
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
        if (obj !== void 0 && obj.node !== void 0) {
          const cmd = obj.node.replace(`\${this.timeOffset}`, timeOffset);
          let result = await this.library.readWithJsonata(
            this.rawWarning,
            cmd
          );
          if (obj.cmd !== void 0)
            result = await this.readWithTypescript(result, obj.cmd);
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
      this.formatedData = temp;
      this.updated = false;
    }
    if (!this.formatedData) {
      throw new Error(`${this.log.getName()} formatedDate is empty!`);
    }
    return this.formatedData;
  }
  async readWithTypescript(data, cmd) {
    if (!this.rawWarning && !cmd) {
      throw new Error("readWithTypescript called without rawWarning or val!");
    }
    switch (cmd) {
      case "dayoftheweek": {
        return new Date(data).toLocaleDateString("de-DE", { weekday: "long" });
      }
      case "translate": {
        return this.library.getTranslation(data);
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
    this.notDeleted = true;
  }
  async sendMessage(override = false) {
    if (this.messages.length == 0)
      return false;
    if (this.notDeleted) {
      if (this.newMessage || override) {
        for (let a = 0; a < this.messages.length; a++) {
          const msg = this.messages[a];
          this.library.writedp(
            `${this.provider.name}.messages.${msg.key}`,
            msg.message,
            import_definitionen.genericStateObjects.messageStates.message
          );
        }
      }
    } else {
      this.sendRemoveMessage();
      return true;
    }
    this.newMessage = false;
    return false;
  }
  sendRemoveMessage() {
  }
  delete() {
    this.notDeleted = false;
    this.newMessage = false;
    this.updated = false;
  }
  async writeFormatedKeys(index) {
    if (this.notDeleted) {
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
class NotificationClass extends import_library.BaseClass {
  options;
  constructor(adapter, notifcationOptions) {
    super(adapter, notifcationOptions.name);
    this.options = notifcationOptions;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Messages,
  NotificationClass
});
//# sourceMappingURL=messages.js.map
