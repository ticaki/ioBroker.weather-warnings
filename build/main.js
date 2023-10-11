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
var import_messages_def = require("./lib/def/messages-def");
var import_provider_def = require("./lib/def/provider-def");
var NotificationType = __toESM(require("./lib/def/notificationService-def"));
var import_notificationConfig_d = require("./lib/def/notificationConfig-d");
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
      const obj = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
      if (obj && obj.native) {
        obj.native.allowedDirs = this.config.allowedDirs;
        await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj);
        this.log.warn("Fixed configuration for allowed datapoints! ");
      }
    }
    try {
      await this.library.init();
      await this.library.initStates(await this.getStatesAsync("*"));
      await this.library.initStates(await this.getChannelsAsync());
    } catch (error) {
      this.log.error(`catch(1): init error while reading states! ${error}`);
    }
    const config = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
    if (config && config.native && config.native.templateTable[0] && config.native.templateTable[0].template == "template.NewMessage") {
      const templateTable = this.library.cloneGenericObject(config.native.templateTable);
      for (const a in config.native.templateTable) {
        templateTable[a].template = await this.library.getTranslation(
          config.native.templateTable[a].template
        );
        this.log.debug(await this.library.getTranslation(config.native.templateTable[a].template));
      }
      this.log.debug(`Write default templates to config for ${this.namespace}!`);
      await this.extendForeignObjectAsync(`system.adapter.${this.namespace}`, {
        native: { templateTable }
      });
    }
    setTimeout(
      async function(that) {
        const self = that;
        if (!self)
          return;
        if (!self.providerController)
          return;
        self.providerController.setAllowedDirs(allowedDirsConfig);
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
              all: self.config[notificationService + "_MessageAll"] !== void 0 ? self.config[notificationService + "_MessageAll"] : ""
            };
            template.new = template.new ? template.new : "none";
            template.remove = template.remove ? template.remove : "none";
            template.removeAll = template.removeAll ? template.removeAll : "none";
            template.all = template.all ? template.all : "none";
            notificationServiceOpt[notificationService] = {
              ...import_notificationConfig_d.notificationServiceDefaults[notificationService],
              service,
              filter: {
                level: self.config[notificationService + "_LevelFilter"],
                type: self.config[notificationService + "_TypeFilter"].map((a2) => String(a2))
              },
              adapter: self.config[notificationService + "_Adapter"],
              name: notificationService,
              actions: template,
              useadapter: true
            };
            Object.assign(
              notificationServiceOpt[notificationService],
              import_notificationConfig_d.notificationServiceDefaults[notificationService]
            );
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
        if (self.config.email_Enabled && notificationServiceOpt.email != void 0) {
          notificationServiceOpt.email.actions.header = self.config.email_Header;
          notificationServiceOpt.email.actions.footer = self.config.email_Footer;
        }
        try {
          await self.providerController.createNotificationService(notificationServiceOpt);
        } catch (error) {
          self.log.error(
            "--- Status undefined - execution interrupted - Please check your configuration. ---"
          );
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
        await self.library.cleanUpTree(holdStates, 3);
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
  }
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      this.log.debug(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
      let connected = true;
      let state;
      switch (String(obj.command)) {
        case "alexa2_device_ids":
          {
            const data = [];
            if (obj.message.adapter != "none") {
              const objs = await this.getForeignObjectsAsync(obj.message.adapter + ".Echo-Devices.*");
              for (const a in objs) {
                if (a.endsWith(".Commands.announcement")) {
                  const channel = await this.getForeignObjectAsync(
                    a.split(".").slice(0, 4).join(".")
                  );
                  data.push({
                    value: a.split(".")[3],
                    label: channel ? channel.common.name : ""
                  });
                }
              }
            }
            this.sendTo(obj.from, obj.command, data, obj.callback);
          }
          break;
        case "restoreDefault":
          {
            let data = {};
            if (obj.message.service == "template") {
              data = {
                native: {
                  templateTable: this.library.cloneGenericObject(import_io_package.default.native.templateTable)
                }
              };
              for (const a in data.native.templateTable) {
                const key = `template.${data.native.templateTable[a].templateKey}`;
                data.native.templateTable[a].template = await this.library.getTranslation(key);
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
            } else if (obj.message && obj.message.service && NotificationType.Array.indexOf(obj.message.service) != -1) {
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
          state = this.library.getdb("provider.activeWarnings");
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
