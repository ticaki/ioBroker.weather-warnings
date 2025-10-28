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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_io_package = __toESM(require("../io-package.json"));
var import_register = require("source-map-support/register");
var import_provider = require("./lib/provider.js");
var import_library = require("./lib/library.js");
var messagesDef = __toESM(require("./lib/def/messages-def"));
var providerDef = __toESM(require("./lib/def/provider-def"));
var NotificationType = __toESM(require("./lib/def/notificationService-def"));
var import_notificationService_def = require("./lib/def/notificationService-def");
var import_definition = require("./lib/def/definition.js");
class WeatherWarnings extends utils.Adapter {
  startDelay = void 0;
  library;
  providerController = null;
  numOfRawWarnings = 5;
  adminTimeoutRef = null;
  fetchs = /* @__PURE__ */ new Map();
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
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    if (!this.providerController) {
      throw new Error("Provider controller doesnt exists.");
    }
    this.subscribeForeignObjects("system.config");
    if (!Array.isArray(this.config.allowedDirs)) {
      this.config.allowedDirs = [];
    }
    let i = 0;
    let change = false;
    let allowedDirsConfig = {};
    while (i++ < 2) {
      const allowedDirs = this.config.allowedDirs;
      for (const a of providerDef.providerServicesArray) {
        let hit = -1;
        for (const b of allowedDirs) {
          if (b.providerService == a.replace("Service", "").toUpperCase()) {
            hit = Number(b);
            break;
          }
        }
        if (hit == -1) {
          change = true;
          this.config.allowedDirs.push({
            providerService: a.replace("Service", "").toUpperCase(),
            dpWarning: true,
            dpMessage: true,
            dpFormated: true,
            dpAlerts: true
          });
        }
        allowedDirsConfig[a] = this.config.allowedDirs[hit == -1 ? this.config.allowedDirs.length - 1 : hit];
      }
      if (providerDef.providerServicesArray.length != this.config.allowedDirs.length) {
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
        for (const a of keys) {
          reply += `\${${a}}: ${this.library.getTranslation(
            import_definition.statesObjectsWarnings.allService.formatedkeys[a].common.name
          )}
`;
        }
        reply = reply.slice(0, -1);
        if (obj.native.templateHelp && obj.native.templateHelp.valueOf() != reply.valueOf()) {
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
          this.log.info("Update configuration. Reason: icons_description");
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
        if (!sounds || !Array.isArray(sounds)) {
          sounds = [];
        }
        for (const w in messagesDef.genericWarntyp) {
          const index2 = sounds.findIndex(
            (a) => a.warntypenumber == Number(w)
          );
          if (index2 != -1) {
            const t = this.library.getTranslation(
              messagesDef.genericWarntyp[Number(w)].name
            );
            if (t != sounds[index2].warntype) {
              sounds[index2].warntype = t;
            }
          } else {
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
        await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj);
        this.log.info("Update configuration: Done");
      }
    }
    this.config.numOfRawWarnings = typeof this.config.numOfRawWarnings == "number" && this.config.numOfRawWarnings > 0 ? this.config.numOfRawWarnings : 5;
    this.startDelay = this.setTimeout(async () => {
      if (!this.providerController) {
        return;
      }
      if (this.providerController.unload) {
        return;
      }
      await this.providerController.init();
      this.log.info(`Refresh Interval: ${this.providerController.refreshTime / 6e4} minutes`);
      const notificationServiceOpt = {};
      for (const n of NotificationType.Array) {
        const notificationService = n;
        if (this.config[`${notificationService}_Enabled`]) {
          const service = [];
          if (this.config[`${notificationService}_DwdEnabled`]) {
            service.push("dwdService");
          }
          if (this.config[`${notificationService}_UwzEnabled`]) {
            service.push("uwzService");
          }
          if (this.config[`${notificationService}_ZamgEnabled`]) {
            service.push("zamgService");
          }
          const template = {
            new: this.config[`${notificationService}_MessageNew`] !== void 0 ? this.config[`${notificationService}_MessageNew`] : "none",
            remove: this.config[`${notificationService}_MessageRemove`],
            removeAll: this.config[`${notificationService}_MessageAllRemove`],
            all: this.config[`${notificationService}_MessageAll`] !== void 0 ? this.config[`${notificationService}_MessageAll`] : this.config[`${notificationService}_MessageNew`] !== void 0 ? this.config[`${notificationService}_MessageNew`] : "none",
            manualAll: this.config[`${notificationService}_manualAll`] !== void 0 ? this.config[`${notificationService}_manualAll`] : "none",
            removeManualAll: this.config[`${notificationService}_removeManualAll`] !== void 0 ? this.config[`${notificationService}_removeManualAll`] : "none",
            title: this.config[`${notificationService}_Title`] !== void 0 ? this.config[`${notificationService}_Title`] : "none"
          };
          for (const a in template) {
            const b = a;
            if (template[b] == void 0) {
              continue;
            }
            template[b] = template[b] ? template[b] : "none";
          }
          notificationServiceOpt[notificationService] = {
            ...import_notificationService_def.notificationServiceDefaults[notificationService],
            service,
            filter: {
              auto: {
                level: this.config[`${notificationService}_LevelFilter`] || -1,
                type: (this.config[`${notificationService}_TypeFilter`] || []).map((a) => String(a))
              },
              manual: {
                level: this.config[`${notificationService}_ManualLevelFilter`] ? this.config[`${notificationService}_ManualLevelFilter`] : -1,
                type: (this.config[`${notificationService}_ManualTypeFilter`] ? this.config[`${notificationService}_ManualTypeFilter`] : []).map((a) => String(a))
              }
            },
            adapter: this.config[`${notificationService}_Adapter`],
            name: notificationService,
            actions: template,
            useadapter: true
          };
          Object.assign(
            //@ts-expect-error verstehe ich nicht
            notificationServiceOpt[notificationService],
            import_notificationService_def.notificationServiceDefaults[notificationService]
          );
        }
      }
      if (this.config.telegram_Enabled && notificationServiceOpt.telegram != void 0) {
        notificationServiceOpt.telegram.withNoSound = this.config.telegram_withNoSound || false;
        notificationServiceOpt.telegram.userid = this.config.telegram_UserId || "";
        notificationServiceOpt.telegram.chatid = this.config.telegram_ChatID || "";
        notificationServiceOpt.telegram.parse_mode = this.config.telegram_parse_mode || "none";
      }
      if (this.config.whatsapp_Enabled && notificationServiceOpt.whatsapp != void 0) {
        if (this.config.whatsapp_Phonenumber) {
          notificationServiceOpt.whatsapp.phonenumber = this.config.whatsapp_Phonenumber;
        }
      }
      if (this.config.pushover_Enabled && notificationServiceOpt.pushover != void 0) {
        notificationServiceOpt.pushover.sound = this.config.pushover_Sound || "none";
        notificationServiceOpt.pushover.priority = this.config.pushover_Priority || false;
        notificationServiceOpt.pushover.device = this.config.pushover_Device || "";
      }
      if (this.config.gotify_Enabled && notificationServiceOpt.gotify != void 0) {
        notificationServiceOpt.gotify.priority = this.config.gotify_Priority !== void 0 ? parseInt(this.config.gotify_Priority) : 0;
        notificationServiceOpt.gotify.contentType = this.config.gotify_contentType || "text/plain";
      }
      if (this.config.json_Enabled && notificationServiceOpt.json != void 0) {
      }
      if (this.config.history_Enabled && notificationServiceOpt.history != void 0) {
      }
      if (this.config.email_Enabled && notificationServiceOpt.email != void 0) {
        notificationServiceOpt.email.actions.header = this.config.email_Header;
        notificationServiceOpt.email.actions.footer = this.config.email_Footer;
        notificationServiceOpt.email.recipients = this.config.email_Recipients;
      }
      if (this.config.alexa2_Enabled && notificationServiceOpt.alexa2 != void 0) {
        notificationServiceOpt.alexa2.volumen = this.config.alexa2_volumen > 0 ? String(this.config.alexa2_volumen) : "";
        notificationServiceOpt.alexa2.audio = this.config.alexa2_Audio || "";
        notificationServiceOpt.alexa2.sounds = this.config.alexa2_sounds || [];
        notificationServiceOpt.alexa2.sounds_enabled = this.config.alexa2_sounds_enabled || false;
        if (this.config.alexa2_device_ids.length == 0 || !this.config.alexa2_device_ids[0]) {
          this.log.error(`Missing devices for alexa - deactivated`);
          delete notificationServiceOpt.alexa2;
          this.config.alexa2_Enabled = false;
        } else if (this.config.alexa2_Adapter == "none") {
          this.log.error(`Missing adapter for alexa - deactivated`);
          delete notificationServiceOpt.alexa2;
          this.config.alexa2_Enabled = false;
        }
      }
      if (this.config.sayit_Enabled && notificationServiceOpt.sayit != void 0) {
        notificationServiceOpt.sayit.volumen = this.config.sayit_volumen > 0 ? String(this.config.sayit_volumen) : "";
        if (this.config.sayit_Adapter_Array.length == 0 || this.config.sayit_Adapter_Array[0].sayit_Adapter == "none") {
          this.log.warn(`Missing adapter for sayit - deactivated`);
          delete notificationServiceOpt.sayit;
          this.config.sayit_Enabled = false;
        } else {
          notificationServiceOpt.sayit.adapters = this.config.sayit_Adapter_Array.map((a) => a.sayit_Adapter);
        }
      }
      try {
        await this.providerController.createNotificationService(notificationServiceOpt);
      } catch {
        this.log.error("Execution interrupted - Please check your configuration. ---");
        return;
      }
      for (const id of this.config.dwdwarncellTable) {
        if (this.config.dwdEnabled) {
          if (isNaN(id.dwdSelectId) || Number(id.dwdSelectId) < 1e4) {
            this.log.warn(`DWD "${id.dwdSelectId}" warning cell is invalid.`);
            continue;
          }
          const options = {
            filter: {
              type: this.config.dwdTypeFilter,
              level: this.config.dwdLevelFilter,
              hours: this.config.dwdHourFilter
            }
          };
          this.log.info(`DWD ${id.dwdSelectId} activated. Retrieve data.`);
          this.providerController.createProviderIfNotExist({
            ...options,
            service: "dwdService",
            customName: id.dwdCityname,
            warncellId: String(id.dwdSelectId),
            providerController: this.providerController,
            language: this.config.dwdLanguage
          });
        }
      }
      for (const id of this.config.zamgwarncellTable) {
        if (this.config.zamgEnabled && id && typeof id.zamgSelectId == "string" && id.zamgSelectId) {
          this.log.info("ZAMG activated. Retrieve data.");
          const options = {
            filter: {
              type: this.config.zamgTypeFilter,
              level: this.config.zamgLevelFilter,
              hours: this.config.zamgHourFilter
            }
          };
          const zamgArr = id.zamgSelectId.split("/");
          if (zamgArr.length == 2) {
            this.providerController.createProviderIfNotExist({
              ...options,
              service: "zamgService",
              warncellId: zamgArr,
              language: this.config.zamgLanguage,
              providerController: this.providerController,
              customName: id.zamgCityname
            });
          }
        }
      }
      const tempTable = JSON.parse(JSON.stringify(this.config.uwzwarncellTable));
      for (const id of this.config.uwzwarncellTable) {
        if (this.config.uwzEnabled) {
          if (id && typeof id.uwzSelectId == "string" && id.uwzSelectId.split("/").length == 2 || id.realWarncell && typeof id.realWarncell === "string") {
            if (!id.realWarncell) {
              const tempWarncell = await providerDef.UWZProvider.getWarncell(
                id.uwzSelectId.split("/"),
                "uwzService",
                this
              );
              if (this.providerController.unload) {
                return;
              }
              if (tempWarncell) {
                id.realWarncell = tempWarncell;
              }
            }
            const options = {
              filter: {
                type: this.config.uwzTypeFilter,
                level: this.config.uwzLevelFilter,
                hours: this.config.uwzHourFilter
              }
            };
            if (!id.realWarncell || typeof id.realWarncell !== "string") {
              this.log.warn(`Dont find a UWZ warncell for ${id.uwzSelectId}!`);
              continue;
            }
            this.log.info("UWZ activated. Retrieve data.");
            this.providerController.createProviderIfNotExist({
              ...options,
              service: "uwzService",
              warncellId: id.realWarncell,
              providerController: this.providerController,
              language: this.config.uwzLanguage,
              customName: id.uwzCityname
            });
          } else {
            this.log.warn(
              `Something is wrong with uwz coordinates: ${id.uwzSelectId} or warncell: ${id.realWarncell}`
            );
          }
        }
      }
      if (JSON.stringify(tempTable) != JSON.stringify(this.config.uwzwarncellTable)) {
        const obj2 = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
        if (obj2) {
          this.log.debug("change config uwzwarncellTable");
          obj2.native.uwzwarncellTable = tempTable;
          await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj2);
        }
      }
      const holdStates = [];
      const holdStates2 = [];
      const reCheckStates = [];
      for (const a of this.providerController.providers) {
        holdStates.push(a.name);
        reCheckStates.push(`${a.name}.formatedKeys`);
        reCheckStates.push(`${a.name}..warning`);
        for (let b = 0; b < this.config.numOfRawWarnings; b++) {
          holdStates2.push(`${a.name}.formatedKeys.${`00${b}`.slice(-2)}`);
          holdStates2.push(`${a.name}..warning.${`00${b}`.slice(-2)}`);
        }
      }
      holdStates.push("commands.");
      holdStates.push("alerts.");
      holdStates.push("info.connection");
      holdStates.push("provider.activeWarnings_json");
      holdStates.push("provider.history");
      holdStates.push("provider.activeWarnings");
      await this.library.cleanUpTree(holdStates, null, 3);
      await this.library.cleanUpTree(holdStates2, reCheckStates, 5);
      await this.providerController.finishInit();
      this.providerController.updateEndless().catch(() => {
      });
      await this.providerController.updateAlertEndless();
    }, 2e3);
  }
  /**
   * Is called when the adapter is unloaded.
   *
   * @param callback - function that must be called when the unload is finished.
   *                  The callback is called with one argument: `null`.
   */
  async onUnload(callback) {
    try {
      if (this.startDelay) {
        this.clearTimeout(this.startDelay);
      }
      if (this.providerController) {
        await this.providerController.delete();
      }
      for (const [controller, timeoutId] of this.fetchs.entries()) {
        try {
          if (timeoutId) {
            this.clearTimeout(timeoutId);
          }
          controller.abort();
        } catch {
        }
      }
      this.fetchs.clear();
      callback();
    } catch {
      callback();
    }
  }
  /**
   * Is called when an object is changed
   *
   * @param id - id of the object that changed
   * @param obj - the changed object
   * @returns - a promise that resolves to void
   */
  async onObjectChange(id, obj) {
    if (obj) {
      if (id == "system.config") {
        if (await this.library.setLanguage(obj.common.language)) {
          if (this.providerController) {
            await this.providerController.updateMesssages();
          }
        }
      }
    }
  }
  /**
   * Is called when a state changes
   *
   * @param id - id of the state that changed
   * @param state - the new state
   * @returns - a promise that resolves to void
   */
  async onStateChange(id, state) {
    if (!state) {
      return;
    }
    if (state.ack) {
      return;
    }
    this.library.setdb(id.replace(`${this.namespace}.`, ""), "state", state.val, void 0, state.ack, state.ts);
    if (await this.providerController.onStatePush(id)) {
      return;
    }
    if (await this.providerController.clearHistory(id)) {
      return;
    }
    if (await this.providerController.setSpeakAllowed(id)) {
      return;
    }
  }
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      console.log(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
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
                  label: this.library.getTranslation("Monday"),
                  value: "1"
                },
                {
                  label: this.library.getTranslation("Tuesday"),
                  value: "2"
                },
                {
                  label: this.library.getTranslation("Wednesday"),
                  value: "3"
                },
                {
                  label: this.library.getTranslation("Thursday"),
                  value: "4"
                },
                {
                  label: this.library.getTranslation("Friday"),
                  value: "5"
                },
                {
                  label: this.library.getTranslation("Saturday"),
                  value: "6"
                },
                {
                  label: this.library.getTranslation("Sunday"),
                  value: "0"
                }
              ],
              obj.callback
            );
          }
          break;
        /*case 'alexa_audio':
            {
                this.sendTo(
                    obj.from,
                    obj.command,
                    {
                        openUrl:
                            'https://developer.amazon.com/en-US/docs/alexa/custom-skills/ask-soundlibrary.html',
                        window: '_blank',
                    },
                    obj.callback,
                );
            }
            break;*/
        case "alexa2_device_ids":
          {
            const data = [];
            if (obj.message.adapter != "none") {
              const objs = await this.getForeignObjectsAsync(`${obj.message.adapter}.Echo-Devices.*`);
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
        /** defaults for templates */
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
              for (const t of templates) {
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
                  for (const row of objs.rows) {
                    const instance = Number(row.id.split(".")[3]);
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
              switch (a) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4": {
                  reply.push({
                    label: this.library.getTranslation(
                      messagesDef.textLevels.textGeneric[a]
                    ),
                    value: Number(a)
                  });
                  break;
                }
              }
              if (Number(a) == 5) {
                break;
              }
            }
            this.sendTo(obj.from, obj.command, reply, obj.callback);
          }
          break;
        case "filterType":
          if (obj.callback) {
            const reply = [];
            if (obj.message && obj.message.service && providerDef.providerServicesArray.indexOf(obj.message.service) != -1) {
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
        case "test":
          this.log.debug(`Retrieve test message!`);
          this.sendTo(obj.from, "test", "Test Message", obj.callback);
          break;
        /**testing online */
        case "test-connection":
          if (obj.from !== "system.adapter.test.0") {
            this.sendTo(obj.from, obj.command, "Dont use this command!", obj.callback);
            return;
          }
          this.log.debug(`Retrieve test-connection message!`);
          connected = false;
          [
            "provider.dwd.info.connection",
            "provider.uwz.info.connection",
            "provider.zamg.info.connection",
            "info.connection"
          ].forEach((a) => {
            state = this.library.readdp(a);
            if (state) {
              connected = connected || !!state.val;
            }
          });
          this.sendTo(obj.from, obj.command, connected ? "true" : "false", obj.callback);
          break;
        /** testing with testdata and switch then to online */
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
            if (state) {
              connected = connected || !!state.val;
            }
          });
          state = this.library.readdp("provider.activeWarnings");
          if (state) {
            connected = !!connected || !(state.val && Number(state.val) >= 4);
          } else {
            connected = true;
          }
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
  handleFetchError(error) {
    var _a;
    if (error.name !== "AbortError") {
      const errorDetails = [];
      if (error instanceof Error) {
        let isHttpError = false;
        errorDetails.push(`  Name: ${error.name}`);
        if (error.cause && typeof error.cause === "object" && "code" in error.cause && typeof error.cause.code === "string") {
          isHttpError = true;
          errorDetails.push(`  code: ${error.cause.code}`);
        }
        errorDetails.push(`  Message: ${error.message}`);
        isHttpError = isHttpError || error.message.includes("HTTP") || error.status || error.url;
        if (error.stack && !isHttpError) {
          errorDetails.push(`  Stack: ${error.stack}`);
        }
      } else if (typeof error === "object" && error !== null) {
        errorDetails.push(`  Type: ${((_a = error.constructor) == null ? void 0 : _a.name) || "Object"}`);
        if (error.status) {
          errorDetails.push(`  HTTP Status: ${error.status}`);
        }
        if (error.statusText) {
          errorDetails.push(`  Status Text: ${error.statusText}`);
        }
        if (error.code) {
          errorDetails.push(`  Error Code: ${error.code}`);
        }
        errorDetails.push(`  Full Error: ${JSON.stringify(error, null, 2)}`);
      } else {
        errorDetails.push(`  Raw Error: ${String(error)}`);
      }
      this.log.error(errorDetails.join("\n"));
    }
  }
  async fetch(url, init, timeout = 3e4) {
    var _a;
    const controller = new AbortController();
    const timeoutId = this.setTimeout(() => {
      try {
        controller.abort();
      } catch {
      }
      this.fetchs.delete(controller);
    }, timeout);
    this.fetchs.set(controller, timeoutId);
    try {
      const response = await fetch(url, {
        ...init,
        method: (_a = init == null ? void 0 : init.method) != null ? _a : "GET",
        signal: controller.signal
      });
      if (response.status === 200) {
        return await response.json();
      }
      throw new Error({ status: response.status, statusText: response.statusText });
    } finally {
      const id = this.fetchs.get(controller);
      if (typeof id !== "undefined") {
        this.clearTimeout(id);
      }
      this.fetchs.delete(controller);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => (
    //@ts-expect-error no idea why options need log
    new WeatherWarnings(options)
  );
} else {
  (() => new WeatherWarnings())();
}
module.exports = WeatherWarnings;
//# sourceMappingURL=main.js.map
