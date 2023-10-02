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
var import_axios = __toESM(require("axios"));
var import_register = require("source-map-support/register");
var import_dwdWarncellIdLong = require("./lib/def/dwdWarncellIdLong");
var import_provider = require("./lib/provider.js");
var import_library = require("./lib/library.js");
var import_messages_def = require("./lib/def/messages-def");
var import_provider_def = require("./lib/def/provider-def");
var import_notificationService_def = require("./lib/def/notificationService-def");
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
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.library = new import_library.Library(this);
    this.providerController = new import_provider.ProviderController(this);
  }
  async onReady() {
    if (this.providerController) {
      this.providerController.init();
      this.log.info(`Refresh Interval: ${this.providerController.refreshTime / 6e4} minutes`);
    } else {
      throw new Error("Provider controller doesnt exists.");
    }
    setTimeout(
      async function(that) {
        const self = that;
        if (!self.providerController)
          return;
        if (!self)
          return;
        await self.library.init();
        const notificationServiceOpt = {};
        for (const a in import_notificationService_def.notificationServiceArray) {
          const notificationService = import_notificationService_def.notificationServiceArray[a];
          if (notificationService === void 0)
            continue;
          if (self.config[notificationService + "_Enabled"]) {
            const service = [];
            if (self.config[notificationService + "_DwdEnabled"])
              service.push("dwdService");
            if (self.config[notificationService + "_UwzEnabled"])
              service.push("uwzService");
            if (self.config[notificationService + "_UwzEnabled"])
              service.push("zamgService");
            const template = {
              new: self.config[notificationService + "_MessageNew"],
              remove: self.config[notificationService + "_MessageRemove"],
              removeAll: self.config[notificationService + "_MessageAllRemove"],
              all: ""
            };
            template.new = template.new ? template.new : "none";
            template.remove = template.remove ? template.remove : "none";
            template.removeAll = template.removeAll ? template.removeAll : "none";
            template.all = template.all ? template.all : "none";
            notificationServiceOpt[notificationService] = {
              ...import_notificationService_def.notificationServiceDefaults[notificationService],
              service,
              filter: {
                level: self.config[notificationService + "_LevelFilter"],
                type: self.config[notificationService + "_TypeFilter"].map((a2) => String(a2))
              },
              adapter: self.config[notificationService + "_Adapter"],
              name: notificationService,
              template
            };
          }
        }
        if (self.config.telegram_Enabled) {
        }
        if (self.config.whatsapp_Enabled) {
        }
        if (self.config.pushover_Enabled) {
        }
        if (self.config.json_Enabled) {
        }
        if (self.config.history_Enabled) {
        }
        if (self.config.email_Enabled) {
        }
        self.providerController.createNotificationService(notificationServiceOpt);
        try {
          const states = await self.getStatesAsync("*");
          self.library.initStates(states);
        } catch (error) {
          self.log.error(`catch (1): init error while reading states! ${error}`);
        }
        for (const a in self.config.dwdwarncellTable) {
          const id = self.config.dwdwarncellTable[a];
          if (id.dwdSelectId > 1e4 && !isNaN(id.dwdSelectId) && self.config.dwdEnabled) {
            const options = {
              filter: { type: self.config.dwdTypeFilter, level: self.config.dwdLevelFilter }
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
          } else {
            self.log.warn(`dont create dwd provider ${JSON.stringify(self.config.dwdwarncellTable)}`);
          }
        }
        if (self.config.zamgEnabled && self.config.zamgSelectID && typeof self.config.zamgSelectID == "string") {
          self.log.info("ZAMG activated. Retrieve data.");
          const options = {
            filter: { type: self.config.zamgTypeFilter }
          };
          const zamgArr = self.config.zamgSelectID.split(import_provider.DIV);
          if (zamgArr.length == 2) {
            self.providerController.createProviderIfNotExist({
              ...options,
              service: "zamgService",
              warncellId: zamgArr,
              language: self.config.zamgLanguage,
              providerController: self.providerController,
              customName: ""
            });
          }
        }
        if (self.config.uwzEnabled && !!self.config.uwzSelectID) {
          const options = {
            filter: { type: self.config.uwzTypeFilter }
          };
          self.log.info("UWZ activated. Retrieve data.");
          self.providerController.createProviderIfNotExist({
            ...options,
            service: "uwzService",
            warncellId: "UWZ" + self.config.uwzSelectID.toUpperCase(),
            providerController: self.providerController,
            language: self.config.uwzLanguage,
            customName: ""
          });
        }
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
  onStateChange(id, state) {
    if (!state)
      return;
    if (state.ack)
      return;
  }
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      this.log.debug(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
      let connected = true;
      let state;
      switch (String(obj.command)) {
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
                if (t.templateKey !== "") {
                  reply.push({
                    label: `${t.templateKey}`,
                    value: `${t.templateKey}`
                  });
                }
              }
              this.log.debug(obj.command + ": " + JSON.stringify(reply));
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
              this.log.debug(obj.command + ": " + JSON.stringify(reply));
              this.sendTo(obj.from, obj.command, reply, obj.callback);
            }
          }
          break;
        case "templateHelp":
          if (obj.callback) {
            let reply = "Tokens: ";
            for (const a in import_messages_def.customFormatedTokensJson) {
              reply += "${" + a + "}: " + (await this.library.getTranslation(
                import_messages_def.customFormatedTokensJson[a]
              ) + " - / - ");
            }
            reply = reply.slice(0, -7);
            this.sendTo(obj.from, obj.command, reply, obj.callback);
          }
          break;
        case "filterLevel":
          if (obj.callback) {
            const reply = [];
            const text = import_messages_def.textLevels.textGeneric;
            for (const a in text) {
              if (Number(a) == 5)
                break;
              reply.push({
                label: await this.library.getTranslation(
                  import_messages_def.textLevels.textGeneric[a]
                ),
                value: Number(a)
              });
            }
            this.log.debug(obj.command + ": " + JSON.stringify(reply));
            this.sendTo(obj.from, obj.command, reply, obj.callback);
          }
          break;
        case "filterType":
          if (obj.callback) {
            const reply = [];
            if (obj.message && obj.message.service && import_provider_def.providerServicesArray.indexOf(obj.message.service) != -1) {
              const service = obj.message.service;
              for (const b in import_messages_def.genericWarntyp) {
                const a = Number(b);
                if (import_messages_def.genericWarntyp[a][service] !== void 0 && import_messages_def.genericWarntyp[a][service].length > 0) {
                  reply.push({
                    label: await this.library.getTranslation(import_messages_def.genericWarntyp[a].name),
                    value: a
                  });
                }
              }
            } else if (obj.message && obj.message.service && import_notificationService_def.notificationServiceArray.indexOf(obj.message.service) != -1) {
              for (const b in import_messages_def.genericWarntyp) {
                const a = Number(b);
                reply.push({
                  label: await this.library.getTranslation(import_messages_def.genericWarntyp[a].name),
                  value: a
                });
              }
            }
            this.log.debug(obj.command + ": " + JSON.stringify(reply));
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
            state = this.library.getdb(a);
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
            state = this.library.getdb(a);
            if (state)
              connected = connected || !!state.val;
          });
          state = this.library.getdb("provider.activWarnings");
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
