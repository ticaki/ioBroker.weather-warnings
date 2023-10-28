"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var utils = __toESM(require("@iobroker/adapter-core"));
var import_io_package = __toESM(require("../io-package.json"));
var import_axios = __toESM(require("axios"));
var import_register = require("source-map-support/register");
var import_dwdWarncellIdLong = require("./lib/def/dwdWarncellIdLong");
var import_provider = require("./lib/provider.js");
var import_library = require("./lib/library.js");
var messagesDef = __toESM(require("./lib/def/messages-def"));
var import_provider_def = require("./lib/def/provider-def");
var NotificationType = __toESM(require("./lib/def/notificationService-def"));
var import_notificationService_def = require("./lib/def/notificationService-def.js");
var import_definitionen = require("./lib/def/definitionen.js");
import_axios.default.defaults.timeout = 8e3;
class WeatherWarnings extends utils.Adapter {
  library;
  providerController = null;
  numOfRawWarnings = 5;
  adminTimeoutRef = null;
  constructor(options = {}) {
    super({
      ...options,
      name: "weather-warnings"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("objectChange", this.onObjectChange.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.library = new import_library.Library(this);
    this.providerController = new import_provider.ProviderController(this);
  }
  async onReady() {
    if (!this.providerController) {
      throw new Error("Provider controller doesnt exists.");
    }
    this.subscribeForeignObjects("system.config");
    if (!Array.isArray(this.config.allowedDirs))
      this.config.allowedDirs = [];
    let i = 0;
    let change = false;
    let allowedDirsConfig = {};
    while (i++ < 2) {
      const allowedDirs = this.config.allowedDirs;
      for (const a in import_provider_def.providerServicesArray) {
        let hit = -1;
        for (const b in allowedDirs) {
          if (allowedDirs[b].providerService == import_provider_def.providerServicesArray[a].replace("Service", "").toUpperCase()) {
            hit = Number(b);
            break;
          }
        }
        if (hit == -1) {
          change = true;
          this.config.allowedDirs.push({
            providerService: import_provider_def.providerServicesArray[a].replace("Service", "").toUpperCase(),
            dpWarning: true,
            dpMessage: true,
            dpFormated: true,
            dpAlerts: true
          });
        }
        allowedDirsConfig[import_provider_def.providerServicesArray[a]] = this.config.allowedDirs[hit == -1 ? this.config.allowedDirs.length - 1 : hit];
      }
      if (import_provider_def.providerServicesArray.length != this.config.allowedDirs.length) {
        this.config.allowedDirs = [];
        allowedDirsConfig = {};
        change = false;
        continue;
      }
      break;
    }
    if (change) {
      const obj2 = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
      if (obj2 && obj2.native) {
        obj2.native.allowedDirs = this.config.allowedDirs;
        await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj2);
        this.log.warn("Fixed configuration for allowed datapoints! ");
      }
    }
    try {
      await this.library.init();
      this.providerController.setAllowedDirs(allowedDirsConfig);
      await this.library.initStates(await this.getStatesAsync("*"));
    } catch (error) {
      this.log.error(`catch(1): init error while reading states! ${error}`);
    }
    change = false;
    const obj = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
    if (obj) {
      {
        let reply = "Tokens:\n";
        const keys = Object.keys(messagesDef.customFormatedTokensJson);
        keys.sort();
        for (const a in keys) {
          reply += "${" + keys[a] + "}: " + (this.library.getTranslation(
            messagesDef.customFormatedTokensJson[keys[a]]
          ) + "\n");
        }
        reply = reply.slice(0, -2);
        if (obj.native.templateHelp.valueOf() != reply.valueOf()) {
          obj.native.templateHelp = reply;
          change = true;
          this.log.info("Update configuration. Reason: templateHelp");
        }
      }
      {
        let reply = " ";
        reply = Object.keys(messagesDef.genericWarntyp).map((a) => messagesDef.genericWarntyp[a].id).join(", ");
        if (this.config.icons_description != reply) {
          obj.native.icons_description = reply;
          change = true;
        }
      }
      {
        if (this.config.silentTime) {
          let update = false;
          for (const a of this.config.silentTime) {
            if (a.profil != void 0) {
              update = true;
            }
          }
          if (update) {
            this.log.debug("update config");
            change = true;
            obj.native.silentTime = [];
            this.log.info("Update configuration. Reason: silentTime");
          }
        }
      }
      {
        let sounds = obj.native.alexa2_sounds || [];
        if (!sounds || !Array.isArray(sounds))
          sounds = [];
        for (const w in messagesDef.genericWarntyp) {
          const index2 = sounds.findIndex(
            (a) => a.warntypenumber == Number(w)
          );
          if (index2 != -1) {
            const t = this.library.getTranslation(
              messagesDef.genericWarntyp[Number(w)].name
            );
            if (t != sounds[index2].warntype) {
              change = true;
              sounds[index2].warntype = t;
            }
          } else {
            change = true;
            sounds.push({
              warntypenumber: Number(w),
              warntype: this.library.getTranslation(
                messagesDef.genericWarntyp[Number(w)].name
              ),
              sound: ""
            });
          }
        }
        const index = sounds.findIndex(
          (a) => a.warntypenumber == Number(0)
        );
        if (index == -1) {
          sounds.push({
            warntypenumber: Number(0),
            warntype: this.library.getTranslation("template.RemoveAllMessage"),
            sound: ""
          });
        } else {
          const t = this.library.getTranslation("template.RemoveAllMessage");
          if (t != sounds[index].warntype) {
            sounds[index].warntype = t;
          }
        }
        if (JSON.stringify(obj.native.alexa2_sounds) != JSON.stringify(sounds)) {
          change = true;
          this.log.info("Update configuration. Reason: alexa2_sounds");
          obj.native.alexa2_sounds = sounds;
        }
      }
      if (obj && obj.native && obj.native.templateTable[0] && obj.native.templateTable[0].template == "template.NewMessage") {
        this.log.info(`First start after installation detected.`);
        const templateTable = this.library.cloneGenericObject(obj.native.templateTable);
        for (const a in obj.native.templateTable) {
          templateTable[a].template = this.library.getTranslation(
            obj.native.templateTable[a].template
          );
          this.log.debug(
            `Read default template from i18n: ${this.library.getTranslation(
              obj.native.templateTable[a].template
            )}`
          );
        }
        this.config.templateTable = templateTable;
        this.log.info(`Write default templates to config for ${this.namespace}!`);
        obj.native = { ...obj.native, templateTable };
        this.log.info("Update configuration. Reason: templateTable");
        change = true;
      }
      if (change) {
        await this.setObjectAsync(`system.adapter.${this.namespace}`, obj);
      }
    }
    this.setTimeout(
      async function(that) {
        const self = that;
        if (!self)
          return;
        if (!self.providerController)
          return;
        self.providerController.init();
        self.log.info(`Refresh Interval: ${self.providerController.refreshTime / 6e4} minutes`);
        const notificationServiceOpt = {};
        for (const a in NotificationType.Array) {
          const notificationService = NotificationType.Array[a];
          if (self.config[notificationService + "_Enabled"]) {
            const service = [];
            if (self.config[notificationService + "_DwdEnabled"])
              service.push("dwdService");
            if (self.config[notificationService + "_UwzEnabled"])
              service.push("uwzService");
            if (self.config[notificationService + "_UwzEnabled"])
              service.push("zamgService");
            const template = {
              new: self.config[notificationService + "_MessageNew"] !== void 0 ? self.config[notificationService + "_MessageNew"] : "",
              remove: self.config[notificationService + "_MessageRemove"],
              removeAll: self.config[notificationService + "_MessageAllRemove"],
              all: self.config[notificationService + "_MessageAll"] !== void 0 ? self.config[notificationService + "_MessageAll"] : self.config[notificationService + "_MessageNew"] !== void 0 ? self.config[notificationService + "_MessageNew"] : "",
              manualAll: self.config[notificationService + "_manualAll"] !== void 0 ? self.config[notificationService + "_manualAll"] : "",
              title: self.config[notificationService + "_Title"] !== void 0 ? self.config[notificationService + "_Title"] : ""
            };
            for (const a2 in template) {
              const b = a2;
              if (template[b] == void 0)
                continue;
              template[b] = template[b] ? template[b] : "none";
            }
            notificationServiceOpt[notificationService] = {
              ...import_notificationService_def.notificationServiceDefaults[notificationService],
              service,
              filter: {
                auto: {
                  level: self.config[notificationService + "_LevelFilter"] || -1,
                  type: (self.config[notificationService + "_TypeFilter"] || []).map((a2) => String(a2))
                },
                manual: {
                  level: self.config[notificationService + "_ManualLevelFilter"] ? self.config[notificationService + "_ManualLevelFilter"] : -1,
                  type: (self.config[notificationService + "_ManualTypeFilter"] ? self.config[notificationService + "_ManualTypeFilter"] : []).map((a2) => String(a2))
                }
              },
              adapter: self.config[notificationService + "_Adapter"],
              name: notificationService,
              actions: template,
              useadapter: true
            };
            Object.assign(
              notificationServiceOpt[notificationService],
              import_notificationService_def.notificationServiceDefaults[notificationService]
            );
          }
        }
        if (self.config.telegram_Enabled && notificationServiceOpt.telegram != void 0) {
          notificationServiceOpt.telegram.withNoSound = self.config.telegram_withNoSound || false;
          notificationServiceOpt.telegram.userid = self.config.telegram_UserId || "";
          notificationServiceOpt.telegram.chatid = self.config.telegram_ChatID || "";
          notificationServiceOpt.telegram.parse_mode = self.config.telegram_parse_mode || "none";
        }
        if (self.config.whatsapp_Enabled && notificationServiceOpt.whatsapp != void 0) {
          if (self.config.whatsapp_Phonenumber)
            notificationServiceOpt.whatsapp.phonenumber = self.config.whatsapp_Phonenumber;
        }
        if (self.config.pushover_Enabled && notificationServiceOpt.pushover != void 0) {
          notificationServiceOpt.pushover.sound = self.config.pushover_Sound || "none";
          notificationServiceOpt.pushover.priority = self.config.pushover_Priority || false;
          notificationServiceOpt.pushover.device = self.config.pushover_Device || "";
        }
        if (self.config.json_Enabled && notificationServiceOpt.json != void 0) {
        }
        if (self.config.history_Enabled && notificationServiceOpt.history != void 0) {
        }
        if (self.config.email_Enabled && notificationServiceOpt.email != void 0) {
          notificationServiceOpt.email.actions.header = self.config.email_Header;
          notificationServiceOpt.email.actions.footer = self.config.email_Footer;
        }
        if (self.config.alexa2_Enabled && notificationServiceOpt.alexa2 != void 0) {
          notificationServiceOpt.alexa2.volumen = self.config.alexa2_volumen > 0 ? String(self.config.alexa2_volumen) : "";
          notificationServiceOpt.alexa2.audio = self.config.alexa2_Audio || "";
          notificationServiceOpt.alexa2.sounds = self.config.alexa2_sounds || [];
          notificationServiceOpt.alexa2.sounds_enabled = self.config.alexa2_sounds_enabled || false;
          if (self.config.alexa2_device_ids.length == 0 || !self.config.alexa2_device_ids[0]) {
            self.log.error(`Missing devices for alexa - deactivated`);
            delete notificationServiceOpt.alexa2;
            self.config.alexa2_Enabled = false;
          } else if (self.config.alexa2_Adapter == "none") {
            self.log.error(`Missing adapter for alexa - deactivated`);
            delete notificationServiceOpt.alexa2;
            self.config.alexa2_Enabled = false;
          }
        }
        if (self.config.sayit_Enabled && notificationServiceOpt.sayit != void 0) {
          notificationServiceOpt.sayit.volumen = self.config.sayit_volumen > 0 ? String(self.config.sayit_volumen) : "";
          if (self.config.sayit_Adapter == "none") {
            self.log.error(`Missing adapter for alexa - deactivated`);
            delete notificationServiceOpt.sayit;
            self.config.sayit_Enabled = false;
          }
        }
        try {
          await self.providerController.createNotificationService(notificationServiceOpt);
        } catch (error) {
          self.log.error("Execution interrupted - Please check your configuration. ---");
          return;
        }
        for (const a in self.config.dwdwarncellTable) {
          const id = self.config.dwdwarncellTable[a];
          if (self.config.dwdEnabled) {
            if (id.dwdSelectId < 1e4 && isNaN(id.dwdSelectId)) {
              self.log.warn(`DWD is activated, but no valid warning cell is configured.`);
              continue;
            }
            const options = {
              filter: {
                type: self.config.dwdTypeFilter,
                level: self.config.dwdLevelFilter,
                hours: self.config.dwdHourFilter
              }
            };
            self.log.info("DWD activated. Retrieve data.");
            self.providerController.createProviderIfNotExist({
              ...options,
              service: "dwdService",
              customName: id.dwdCityname,
              warncellId: String(id.dwdSelectId),
              providerController: self.providerController,
              language: self.config.dwdLanguage
            });
          }
        }
        for (const a in self.config.zamgwarncellTable) {
          const id = self.config.zamgwarncellTable[a];
          if (self.config.zamgEnabled && id && typeof id.zamgSelectId == "string") {
            self.log.info("ZAMG activated. Retrieve data.");
            const options = {
              filter: {
                type: self.config.zamgTypeFilter,
                level: self.config.zamgLevelFilter,
                hours: self.config.zamgHourFilter
              }
            };
            const zamgArr = id.zamgSelectId.split("/");
            if (zamgArr.length == 2) {
              self.providerController.createProviderIfNotExist({
                ...options,
                service: "zamgService",
                warncellId: zamgArr,
                language: self.config.zamgLanguage,
                providerController: self.providerController,
                customName: id.zamgCityname
              });
            }
          }
        }
        for (const a in self.config.uwzwarncellTable) {
          const id = self.config.uwzwarncellTable[a];
          if (self.config.uwzEnabled && !!id.uwzSelectId) {
            const options = {
              filter: {
                type: self.config.uwzTypeFilter,
                level: self.config.uwzLevelFilter,
                hours: self.config.uwzHourFilter
              }
            };
            self.log.info("UWZ activated. Retrieve data.");
            self.providerController.createProviderIfNotExist({
              ...options,
              service: "uwzService",
              warncellId: "UWZ" + id.uwzSelectId.toUpperCase(),
              providerController: self.providerController,
              language: self.config.uwzLanguage,
              customName: id.uwzCityname
            });
          }
        }
        const holdStates = [];
        for (const a in self.providerController.providers) {
          holdStates.push(self.providerController.providers[a].name);
        }
        holdStates.push("command");
        holdStates.push("info.connection");
        holdStates.push("provider.activeWarnings_json");
        holdStates.push("provider.history");
        holdStates.push("provider.activeWarnings");
        await self.library.cleanUpTree(holdStates, 3);
        self.providerController.updateCommandStates();
        self.providerController.updateEndless(self.providerController);
        self.providerController.updateAlertEndless(self.providerController);
      },
      4e3,
      this
    );
  }
  onUnload(callback) {
    try {
      if (this.providerController)
        this.providerController.delete();
      callback();
    } catch (e) {
      callback();
    }
  }
  async onObjectChange(id, obj) {
    if (obj) {
      if (id == "system.config") {
        if (await this.library.setLanguage(obj.common.language)) {
          if (this.providerController)
            this.providerController.updateMesssages();
        }
      }
    }
  }
  onStateChange(id, state) {
    if (!state)
      return;
    if (state.ack)
      return;
    this.library.setdb(id.replace(`${this.namespace}.`, ""), "state", state.val, void 0, state.ack, state.ts);
    if (import_definitionen.actionStates[id.replace(`${this.namespace}.`, "")] == void 0) {
      if (this.providerController)
        this.providerController.onStatePush(id);
    }
    this.library.writedp(id, false);
  }
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      this.log.debug(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
      let connected = true;
      let state;
      switch (String(obj.command)) {
        case "weekdays":
          {
            this.sendTo(
              obj.from,
              obj.command,
              [
                {
                  label: "Monday",
                  value: "1"
                },
                {
                  label: "Tuesday",
                  value: "2"
                },
                {
                  label: "Wednesday",
                  value: "3"
                },
                {
                  label: "Thursday",
                  value: "4"
                },
                {
                  label: "Friday",
                  value: "5"
                },
                {
                  label: "Saturday",
                  value: "6"
                },
                {
                  label: "Sunday",
                  value: "0"
                }
              ],
              obj.callback
            );
          }
          break;
        case "alexa_audio":
          {
            this.sendTo(
              obj.from,
              obj.command,
              {
                openUrl: "https://developer.amazon.com/en-US/docs/alexa/custom-skills/ask-soundlibrary.html",
                window: "_blank"
              },
              obj.callback
            );
          }
          break;
        case "alexa2_device_ids":
          {
            const data = [];
            if (obj.message.adapter != "none") {
              const objs = await this.getForeignObjectsAsync(obj.message.adapter + ".Echo-Devices.*");
              for (const a in objs) {
                if (a.endsWith(".Commands.speak")) {
                  const channel = await this.getForeignObjectAsync(
                    a.split(".").slice(0, 4).join(".")
                  );
                  if (channel) {
                    data.push({
                      value: a.split(".")[3],
                      label: channel.common.name
                    });
                  }
                }
              }
            }
            this.sendTo(obj.from, obj.command, data, obj.callback);
          }
          break;
        case "addDefault":
        case "restoreDefault":
          {
            let data = {};
            if (obj.message.service == "template") {
              data = {
                native: {
                  templateTable: this.library.cloneGenericObject(import_io_package.default.native.templateTable)
                }
              };
              if (obj.command == "addDefault") {
                const obj2 = await this.getForeignObjectAsync(
                  `system.adapter.${this.name}.${this.instance}`
                );
                if (obj2 && obj2.native && obj2.native.templateTable) {
                  const config = obj2.native.templateTable;
                  for (const a of data.native.templateTable) {
                    const index = config.findIndex((b) => b.templateKey == a.templateKey);
                    if (index == -1) {
                      config.push(a);
                    }
                  }
                  data.native.templateTable = config;
                }
              }
              for (const a in data.native.templateTable) {
                const key = data.native.templateTable[a].template;
                data.native.templateTable[a].template = this.library.getTranslation(key);
              }
            } else {
              data = { native: {} };
              [
                `${obj.message.service}_MessageNew`,
                `${obj.message.service}_MessageRemove`,
                `${obj.message.service}_MessageAllRemove`,
                `${obj.message.service}_MessageAll`
              ].forEach((a) => {
                data.native[a] = import_io_package.default.native[a];
              });
            }
            this.sendTo(obj.from, obj.command, data, obj.callback);
          }
          break;
        case "Messages":
          {
            if (obj.message.service) {
              const templates = this.config.templateTable;
              const reply = [
                {
                  label: `none`,
                  value: `none`
                }
              ];
              for (const a in templates) {
                const t = templates[a];
                if (t.templateKey !== "" && !t.templateKey.startsWith("_")) {
                  reply.push({
                    label: `${t.templateKey}`,
                    value: `${t.templateKey}`
                  });
                }
              }
              this.sendTo(obj.from, obj.command, reply, obj.callback);
            } else {
              this.sendTo(obj.from, obj.command, [], obj.callback);
              this.log.warn(
                `warn(44): Retrieve message with ${obj.command}, but without obj.message.service`
              );
            }
          }
          break;
        case "notificationService":
          {
            if (obj.message && obj.message.service) {
              const temp = {};
              try {
                const objs = await this.getObjectViewAsync("system", "instance", {
                  startkey: `system.adapter.${obj.message.service}.`,
                  endkey: `system.adapter.${obj.message.service}.\u9999`
                });
                if (objs && objs.rows) {
                  for (const a in objs.rows) {
                    const instance = Number(objs.rows[a].id.split(".")[3]);
                    if (instance !== void 0) {
                      temp[instance] = true;
                    }
                  }
                }
              } catch (error) {
                this.log.error(`error(44): ${error}`);
              }
              const reply = [{ label: "none", value: "none" }];
              for (const t in temp) {
                reply.push({
                  label: `${obj.message.service}.${t}`,
                  value: `${obj.message.service}.${t}`
                });
              }
              this.sendTo(obj.from, obj.command, reply, obj.callback);
            }
          }
          break;
        case "filterLevel":
          if (obj.callback) {
            const reply = [];
            const text = messagesDef.textLevels.textGeneric;
            for (const a in text) {
              if (Number(a) == 5)
                break;
              reply.push({
                label: this.library.getTranslation(
                  messagesDef.textLevels.textGeneric[a]
                ),
                value: Number(a)
              });
            }
            this.sendTo(obj.from, obj.command, reply, obj.callback);
          }
          break;
        case "filterType":
          if (obj.callback) {
            const reply = [];
            if (obj.message && obj.message.service && import_provider_def.providerServicesArray.indexOf(obj.message.service) != -1) {
              const service = obj.message.service;
              for (const b in messagesDef.genericWarntyp) {
                const a = Number(b);
                if (messagesDef.genericWarntyp[a][service] !== void 0 && messagesDef.genericWarntyp[a][service].length > 0) {
                  reply.push({
                    label: this.library.getTranslation(messagesDef.genericWarntyp[a].name),
                    value: a
                  });
                }
              }
            } else if (obj.message && obj.message.service && NotificationType.Array.indexOf(obj.message.service) != -1) {
              for (const b in messagesDef.genericWarntyp) {
                const a = Number(b);
                reply.push({
                  label: this.library.getTranslation(messagesDef.genericWarntyp[a].name),
                  value: a
                });
              }
            }
            this.sendTo(obj.from, obj.command, reply, obj.callback);
          }
          break;
        case "dwd.name":
        case "dwd.check":
        case "dwd.name.text":
          {
            if (this.adminTimeoutRef) {
              this.clearTimeout(this.adminTimeoutRef);
              this.adminTimeoutRef = this.setTimeout(this.dwdWarncellIdLongHelper, 2e3, {
                obj,
                that: this
              });
            } else {
              this.dwdWarncellIdLongHelper({
                obj,
                that: this
              });
              this.adminTimeoutRef = this.setTimeout(
                (that) => that.adminTimeoutRef = null,
                2e3,
                this
              );
            }
          }
          break;
        case "test":
          this.log.debug(`Retrieve test message!`);
          this.sendTo(obj.from, "test", "Test Message", obj.callback);
          break;
        case "test-connection":
          if (obj.from !== "system.adapter.test.0") {
            this.sendTo(obj.from, obj.command, "Dont use this command!", obj.callback);
            return;
          }
          this.log.debug(`Retrieve test-connection message!`);
          connected = true;
          [
            "provider.dwd.info.connection",
            "provider.uwz.info.connection",
            "provider.zamg.info.connection",
            "info.connection"
          ].forEach((a) => {
            state = this.library.readdp(a);
            if (state)
              connected = connected && !!state.val;
          });
          this.sendTo(obj.from, obj.command, connected ? "true" : "false", obj.callback);
          break;
        case "test-data":
          if (obj.from !== "system.adapter.test.0") {
            this.sendTo(obj.from, obj.command, "Dont use this command!", obj.callback);
            return;
          }
          connected = false;
          [
            "provider.dwd.info.connection",
            "provider.uwz.info.connection",
            "provider.zamg.info.connection",
            "info.connection"
          ].forEach((a) => {
            state = this.library.readdp(a);
            if (state)
              connected = connected || !!state.val;
          });
          state = this.library.readdp("provider.activeWarnings");
          if (state)
            connected = !!connected || !(state.val && Number(state.val) >= 4);
          else
            connected = true;
          this.sendTo(
            obj.from,
            obj.command,
            !connected ? "ok" : `connect: ${connected} (false) activeWarnings ${state ? state.val : "undefined"} (>=4)`,
            obj.callback
          );
          this.config.useTestWarnings = false;
          break;
        default:
          this.sendTo(obj.from, obj.command, "unknown message", obj.callback);
          this.log.debug(
            `Retrieve unknown command ${obj.command} messsage: ${JSON.stringify(obj.message)} from ${obj.from}`
          );
      }
    }
  }
  dwdWarncellIdLongHelper(obj1) {
    const obj = obj1.obj;
    const that = obj1.that;
    if (obj.callback) {
      const data = import_dwdWarncellIdLong.dwdWarncellIdLong;
      const text = [];
      if (text.length == 0) {
        const dataArray = data.split("\n");
        dataArray.splice(0, 1);
        dataArray.forEach((element) => {
          const value = element.split(";")[0];
          const cityText = element.split(";")[1];
          if (value && (value.startsWith("10") || value.startsWith("9") || value.startsWith("8") || value.startsWith("7"))) {
            if (text)
              text.push({ label: cityText, value: value.trim() });
          }
        });
        text.sort((a, b) => {
          const nameA = a.label.toUpperCase();
          const nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      }
      const msg = obj.message;
      if (msg.dwd.length > 2) {
        const result = text.filter(
          (a) => a.label && a.label.toUpperCase().includes(msg.dwd.toUpperCase()) || !isNaN(msg.dwd) && Number(a.value) == Number(msg.dwd)
        );
        if (obj.command == "dwd.name")
          that.sendTo(obj.from, obj.command, result, obj.callback);
        else if (obj.command == "dwd.name.text" || obj.command == "dwd.check")
          that.sendTo(obj.from, obj.command, result.length == 1 ? result[0].label : "", obj.callback);
      } else {
        if (obj.command == "dwd.name.text" || obj.command == "dwd.check")
          that.sendTo(obj.from, obj.command, "", obj.callback);
        else
          that.sendTo(obj.from, obj.command, text, obj.callback);
      }
      that.adminTimeoutRef = null;
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new WeatherWarnings(options);
} else {
  (() => new WeatherWarnings())();
}
module.exports = WeatherWarnings;
//# sourceMappingURL=main.js.map
