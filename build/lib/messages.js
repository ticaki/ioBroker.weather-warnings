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
  AllNotificationClass: () => AllNotificationClass,
  MessagesClass: () => MessagesClass,
  NotificationClass: () => NotificationClass
});
module.exports = __toCommonJS(messages_exports);
var import_definitionen = require("./def/definitionen");
var import_messages_def = require("./def/messages-def");
var import_notificationService_def = require("./def/notificationService-def");
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
      }
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
      }
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
      weathertext: { node: `` },
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
          const json = this.formatedKeyCommand[provider.service];
          for (const k in json) {
            const key = k;
            const data2 = this.formatedKeyCommand[provider.service][key];
            this.addFormatedDefinition(key, data2);
          }
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
    const sortedWarntypes = [10, 7, 2, 4, 3, 8, 9, 5, 6, 11, 12, 1];
    if (this.provider) {
      for (const t in sortedWarntypes) {
        const o = import_messages_def.genericWarntyp[sortedWarntypes[t]];
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
    const templates = this.adapter.config.templateTable;
    const messages = [];
    if (this.formatedData) {
      for (const a in templates) {
        const template = templates[a].template;
        if (!template)
          continue;
        const temp = template.split(/(?<!\\)\${/g);
        let msg = temp[0];
        for (let b = 1; temp.length > b; b++) {
          const token = temp[b];
          const t = token.split(/(?<!\\)}/g);
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
        msg = msg.replace("\\", "");
        messages.push({ key: templates[a].templateKey, message: msg });
      }
    } else {
      templates.forEach((a) => messages.push({ key: a.templateKey, message: a.template }));
    }
    this.messages = messages;
  }
  async updateFormatedData(update = false) {
    if (!this.rawWarning && !this.formatedData) {
      throw new Error(`${this.log.getName()} error(165) rawWarning and formatedDate empty!`);
    }
    if (!this.formatedData || this.updated || update) {
      const timeOffset = (Math.floor(new Date().getTimezoneOffset() / 60) < 0 || new Date().getTimezoneOffset() % 60 < 0 ? "+" : "-") + ("00" + Math.abs(Math.floor(new Date().getTimezoneOffset() / 60))).slice(-2) + ("00" + Math.abs(new Date().getTimezoneOffset() % 60)).slice(-2);
      const temp = {};
      for (const key in this.formatedKeysJsonataDefinition) {
        const obj = this.formatedKeysJsonataDefinition[key];
        if (obj !== void 0 && obj.node !== void 0) {
          const cmd = obj.node.replace(`\${this.timeOffset}`, timeOffset);
          let result = cmd != "" ? await this.library.readWithJsonata(
            this.rawWarning,
            cmd
          ) : "";
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
      this.formatedData.warntypegenericname = await this.library.getTranslation(
        import_messages_def.genericWarntyp[this.genericType].name
      );
      this.formatedData.locationcustom = this.provider ? this.provider.customName : "";
      this.formatedData.provider = this.provider ? this.provider.service.replace("Service", "").toUpperCase() : "unknown";
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
        return new Date(data).toLocaleDateString(this.library.getLocalLanguage(), {
          weekday: "long"
        });
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
  async sendMessage(action, activeWarnings, override = false) {
    if (this.messages.length == 0)
      return false;
    if (!(this.newMessage && action == "new" || !this.notDeleted && action == "remove" || action == "removeAll")) {
      if (!override)
        action = "all";
    }
    const msgsend = {};
    for (let a = 0; a < this.messages.length; a++) {
      const msg = this.messages[a];
      if (this.provider)
        this.library.writedp(
          `${this.provider.name}.messages.${msg.key}`,
          msg.message,
          import_definitionen.genericStateObjects.messageStates.message
        );
      msgsend[msg.key] = msg.message;
    }
    await this.providerController.sendToNotifications(
      { msgs: msgsend, obj: this },
      override ? "new" : action,
      activeWarnings
    );
    this.newMessage = false;
    return false;
  }
  delete() {
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
class NotificationClass extends import_library.BaseClass {
  options;
  takeThemAll = false;
  config;
  clearAll() {
  }
  async writeNotifications() {
  }
  constructor(adapter, notifcationOptions) {
    super(adapter, notifcationOptions.name);
    this.options = notifcationOptions;
    this.config = import_notificationService_def.serciceCapabilities[notifcationOptions.name];
  }
  async sendNotifications(messages, action, activeWarnings) {
    if (this.config.notifications.indexOf(action) == -1)
      return false;
    if (!messages.obj || !messages.obj.provider || this.options.service.indexOf(messages.obj.provider.service) != -1 && (this.options.filter.level === void 0 || this.options.filter.level <= messages.obj.level) && this.options.filter.type.indexOf(String(messages.obj.type)) == -1) {
      if (this.options.template[action] == "none" || this.options.template[action] == "")
        return false;
      const msg = messages.msgs[this.options.template[action]];
      if (msg == "")
        return false;
      switch (this.name) {
        case "telegram":
          {
            const opt = { text: msg, disable_notification: true };
            if (action !== "remove" || activeWarnings)
              this.adapter.sendTo(this.options.adapter, "send", opt, () => {
                this.log.debug(`Send the message: ${msg}`);
              });
          }
          break;
        case "pushover":
          {
            const opt = { message: msg, disable_notification: true };
            if (action !== "remove" || activeWarnings)
              this.adapter.sendTo(this.options.adapter, "send", opt, () => {
                this.log.debug(`Send the message: ${msg}`);
              });
          }
          break;
        case "whatsapp":
          {
            const service = this.options.adapter.replace("whatsapp", "whatsapp-cmb");
            const opt = { text: msg };
            if (action !== "remove" || activeWarnings)
              this.adapter.sendTo(service, "send", opt, () => {
                this.log.debug(`Send the message: ${msg}`);
              });
          }
          break;
        case "history":
          {
            if (!messages.obj || !messages.obj.provider || !this.adapter.config.history_Enabled)
              return false;
            let newMsg = msg;
            if (this.adapter.config.history_allinOne) {
              newMsg = JSON.stringify(messages.obj.formatedData);
            }
            const targets = [messages.obj.provider.name, messages.obj.provider.providerController.name];
            for (const a in targets) {
              try {
                const dp = `${targets[a]}.history`;
                const state = this.adapter.library.getdb(dp);
                let json = [];
                if (state && state.val && typeof state.val == "string" && state.val != "")
                  json = JSON.parse(state.val);
                json.unshift(JSON.parse(newMsg));
                json.splice(500);
                await this.adapter.library.writedp(
                  dp,
                  JSON.stringify(json),
                  import_definitionen.genericStateObjects.history
                );
              } catch (error) {
                this.log.error(
                  `${this.name} template has wrong formate. ${this.name} deactivated! template: ${this.options.template[action]}, message: ${msg}`
                );
                this.adapter.config.history_Enabled = false;
                return false;
              }
            }
          }
          break;
        case "json":
          {
          }
          break;
        case "email":
          {
          }
          break;
      }
      return true;
    }
    return false;
  }
}
class AllNotificationClass extends NotificationClass {
  providerDB;
  constructor(adapter, options) {
    super(adapter, options);
    this.providerDB = {};
    this.takeThemAll = true;
    this.adapter.providerController && this.adapter.providerController.provider.forEach((a) => this.providerDB[a.name] = []);
  }
  clearAll() {
    for (const l in this.providerDB) {
      this.providerDB[l] = [];
    }
  }
  async sendNotifications(messages, action, activeWarnings) {
    if (await super.sendNotifications(messages, action, activeWarnings)) {
      const msg = messages.msgs[this.options.template[action]];
      switch (this.name) {
        case "json":
        case "email":
          {
            try {
              if (action == "remove" && !activeWarnings)
                return false;
              const json = this.name == "json" && this.adapter.config.json_parse ? JSON.parse(msg) : msg;
              if (messages.obj && messages.obj.provider) {
                if (this.providerDB[messages.obj.provider.name] === void 0 || !Array.isArray(this.providerDB[messages.obj.provider.name])) {
                  this.providerDB[messages.obj.provider.name] = [];
                }
                this.log.debug(
                  `sendNotifications(1): from: ${messages.obj.provider.name}, message:${msg}`
                );
                this.providerDB[messages.obj.provider.name].push({
                  starttime: messages.obj.starttime,
                  msg: json
                });
              } else {
                if (action == "removeAll") {
                  for (const p in this.providerDB) {
                    this.providerDB[p] = [{ starttime: Date.now(), msg: json }];
                  }
                }
                this.log.debug("sendNotifications(2): removeAll: " + msg);
              }
            } catch (error) {
              this.log.error(
                `Json template has wrong formate. Conversion deactivated! template: ${this.options.template[action]}, message: ${msg}`
              );
              this.adapter.config.json_parse = false;
              return false;
            }
          }
          break;
      }
      return true;
    }
    return false;
  }
  async writeNotifications(msg = "") {
    switch (this.name) {
      case "json":
        {
          let all = [];
          for (const name in this.providerDB) {
            all = all.concat(this.providerDB[name]);
            const prefix = name + ".activeWarnings_json";
            this.adapter.library.writedp(
              prefix,
              JSON.stringify(
                this.providerDB[name].length > 0 ? this.providerDB[name].map((a) => a.msg) : [msg]
              ),
              import_definitionen.genericStateObjects.activeWarningsJson
            );
          }
          all = all.filter((item, pos) => {
            return all.indexOf(item) == pos;
          });
          all.sort((a, b) => a.starttime - b.starttime);
          if (this.adapter.providerController) {
            this.adapter.library.writedp(
              this.adapter.providerController.name + ".activeWarnings_json",
              JSON.stringify(all.length > 0 ? all.map((a) => a.msg) : [msg]),
              import_definitionen.genericStateObjects.activeWarningsJson
            );
          }
        }
        break;
      case "email":
        {
          let all = [];
          for (const name in this.providerDB) {
            all = all.concat(this.providerDB[name]);
          }
          all.sort((a, b) => a.starttime - b.starttime);
          let flat = all.map((a) => a.msg);
          flat = flat.filter((a, pos) => {
            return flat.indexOf(a) == pos;
          });
          const message = flat.join(this.adapter.config.email_line_break);
          this.adapter.sendTo(this.options.adapter, "send", message, () => {
            this.log.debug(`Send the message: ${msg}`);
          });
        }
        break;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AllNotificationClass,
  MessagesClass,
  NotificationClass
});
//# sourceMappingURL=messages.js.map
