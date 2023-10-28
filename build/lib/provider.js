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
var provider_exports = {};
__export(provider_exports, {
  BaseProvider: () => BaseProvider,
  DIV: () => DIV,
  DWDProvider: () => DWDProvider,
  METROProvider: () => METROProvider,
  NINAProvider: () => NINAProvider,
  ProviderController: () => ProviderController,
  UWZProvider: () => UWZProvider,
  ZAMGProvider: () => ZAMGProvider
});
module.exports = __toCommonJS(provider_exports);
var import_axios = __toESM(require("axios"));
var definitionen = __toESM(require("./def/definitionen"));
var import_library = require("./library");
var providerDef = __toESM(require("./def/provider-def"));
var import_messages = require("./messages");
var NotificationClass = __toESM(require("./notification"));
var import_test_warnings = require("./test-warnings");
var NotificationType = __toESM(require("./def/notificationService-def"));
var messagesDef = __toESM(require("./def/messages-def"));
const DIV = "-";
class BaseProvider extends import_library.BaseClass {
  service;
  url = "";
  warncellId = "";
  rawData = null;
  library;
  messages = [];
  providerController;
  filter;
  customName = "";
  warncellIdString;
  constructor(adapter, options, name) {
    let warncell = typeof options.warncellId == "string" ? options.warncellId : options.warncellId.join(DIV);
    warncell = warncell.replaceAll(".", "_");
    super(adapter, `provider.${name}.${warncell}`);
    this.warncellIdString = warncell;
    this.service = options.service;
    this.library = this.adapter.library;
    this.providerController = options.providerController;
    this.setService(options.service);
    this.log.setLogPrefix(`${name}-${options.warncellId}`);
    this.filter = options.filter;
    this.customName = options.customName;
    const temp = this.library.cloneGenericObject(
      definitionen.statesObjectsWarnings[this.service]._channel
    );
    temp.common.name = name.toUpperCase();
    this.library.writedp("provider." + name, void 0, temp);
    this.init();
  }
  async init() {
    const temp = this.library.cloneGenericObject(definitionen.defaultChannel);
    temp.common.name = this.customName;
    await this.library.writedp(`${this.name}`, void 0, temp);
    await this.adapter.extendObjectAsync(`${this.name}`, {
      common: { name: this.customName }
    });
    await this.library.writedp(`${this.name}.info`, void 0, definitionen.genericStateObjects.info._channel);
    await this.library.writedp(
      `${this.name}.formatedKeys`,
      void 0,
      definitionen.genericStateObjects.formatedKeysDevice
    );
    this.setConnected(false);
  }
  async delete() {
    super.delete();
    this.rawData = null;
    await this.library.memberDeleteAsync(this.messages);
    this.messages = [];
    await this.setConnected(false);
  }
  getService() {
    if (!this.service) {
      throw new Error(`baseProvider.getService service is ${this.service == "" ? `''` : `undefined`}`);
    }
    return this.service;
  }
  setService(service) {
    if (!service || ["dwdService", "zamgService", "uwzService", "ninaService", "metroService"].indexOf(service) === -1) {
      throw new Error(`baseProvider.setService service ${service} is unknowed!`);
    }
    this.service = service;
    return true;
  }
  setUrl(url = "", keys) {
    if (!url) {
      this.url = definitionen.PROVIDER_OPTIONS[this.service]["url"];
    } else {
      this.url = url;
    }
    let placeholder = "#  #";
    for (const k in keys) {
      this.url = this.url.replace(placeholder, keys[k]);
      placeholder = placeholder.slice(0, 1) + "+" + placeholder.slice(1, -1) + "+" + placeholder.slice(-1);
    }
    return this.url;
  }
  async setConnected(status) {
    this.providerController.connection = this.providerController.connection || status;
    await this.library.writedp(
      `${this.name}.info.connection`,
      !!status,
      definitionen.genericStateObjects.info.connection
    );
  }
  async setAlerts(data) {
    await this.library.writeFromJson(
      this.name + ".alerts",
      "allService.alerts",
      definitionen.statesObjectsWarnings,
      data,
      false
    );
  }
  async getAlertsAndWrite() {
    const reply = {};
    for (const t in messagesDef.genericWarntyp) {
      reply[messagesDef.genericWarntyp[Number(t)].id] = {
        level: -1,
        start: 1,
        end: 1,
        headline: "",
        active: false,
        type: -1
      };
    }
    if (!reply)
      throw new Error("error(234) reply not definied");
    for (const a in this.messages) {
      const m = this.messages[a];
      if (!m)
        continue;
      const name = messagesDef.genericWarntyp[m.genericType].id;
      if (reply[name] === void 0)
        continue;
      if (m.endtime < Date.now())
        continue;
      if (m.starttime <= Date.now() && reply[name].level < m.level) {
        reply[name] = {
          level: m.level,
          start: m.starttime,
          end: m.endtime,
          headline: m.formatedData !== void 0 ? String(m.formatedData.headline) : "",
          active: m.starttime <= Date.now() && m.endtime >= Date.now(),
          type: m.genericType
        };
      }
    }
    await this.setAlerts(reply);
    return reply;
  }
  async getDataFromProvider() {
    if (!this.url || !this.warncellId) {
      this.log.debug(
        `Warn (31) this.url: ${this.url} this.warncellid: ${this.warncellId} this.service: ${this.getService()}`
      );
    }
    try {
      if (this.unload) {
        return;
      }
      this.library.writedp(
        `${this.name}.info.testMode`,
        this.adapter.config.useTestWarnings,
        definitionen.genericStateObjects.info.testMode
      );
      if (this.adapter.config.useTestWarnings) {
        return this.library.cloneGenericObject(
          (0, import_test_warnings.getTestData)(this.service, this.adapter)
        );
      } else {
        const data = await import_axios.default.get(this.url);
        if (data.status == 200) {
          await this.setConnected(true);
          const result = typeof data.data == "object" ? data.data : JSON.parse(data.data);
          this.library.writedp(
            `${this.name}.warning.warning_json`,
            JSON.stringify(result),
            definitionen.genericStateObjects.warnings_json
          );
          if (this.adapter.config.useJsonHistory) {
            const dp = `${this.name}.warning.jsonHistory`;
            const state = this.library.readdp(dp);
            let history = [];
            if (state && state.val && typeof state.val == "string")
              history = JSON.parse(state.val);
            history.unshift(result);
            this.library.writedp(dp, JSON.stringify(history), definitionen.genericStateObjects.jsonHistory);
          }
          this.library.writedp(
            `${this.name}.lastUpdate`,
            Date.now(),
            definitionen.genericStateObjects.lastUpdate
          );
          return result;
        } else {
          this.log.warn("Warn(23) " + data.statusText);
        }
      }
    } catch (error) {
      if (import_axios.default.isAxiosError(error)) {
        this.log.warn(`Warn(21) axios error for ${this.getService()} url: ${this.url}`);
      } else {
        this.log.error(`Error(22) no data for ${this.getService()} from ${this.url} with Error ${error}`);
      }
    }
    await this.setConnected(false);
    return null;
  }
  async finishUpdateData() {
    for (let m = 0; m < this.messages.length; m++) {
      this.messages.sort((a, b) => {
        return a.starttime - b.starttime;
      });
      await this.messages[m].writeFormatedKeys(m);
    }
    await this.library.garbageColleting(
      `${this.name}.formatedKeys`,
      (this.providerController.refreshTime || 6e5) / 2
    );
    await this.library.garbageColleting(
      `${this.name}.warning`,
      (this.providerController.refreshTime || 6e5) / 2
    );
  }
  async updateData(data, counter) {
    if (!data)
      return;
    this.library.writedp(`${this.name}.warning`, void 0, definitionen.genericStateObjects.warningDevice);
    await this.library.writeFromJson(
      `${this.name}.warning.${("00" + counter.toString()).slice(-2)}`,
      `${this.service}.raw`,
      definitionen.statesObjectsWarnings,
      data
    );
  }
  async clearMessages() {
    for (let m = 0; m < this.messages.length; m++) {
      this.messages[m].newMessage = false;
      if (this.messages[m].notDeleted == false) {
        this.log.debug("Remove a warning from db.");
        this.messages.splice(Number(m--), 1);
      }
    }
  }
  async finishTurn() {
    this.adapter.library.writedp(
      `${this.name}.summary`,
      void 0,
      definitionen.genericStateObjects.summary._channel
    );
    this.adapter.library.writedp(
      `${this.name}.summary.warntypes`,
      this.messages.map((a) => a.formatedData ? a.formatedData.warntypegenericname : "").join(", "),
      definitionen.genericStateObjects.summary.warntypes
    );
  }
}
class DWDProvider extends BaseProvider {
  constructor(adapter, options) {
    super(adapter, { ...options, service: "dwdService" }, `dwd`);
    this.warncellId = options.warncellId;
    const url = definitionen.PROVIDER_OPTIONS.dwdService.url_base + (this.warncellId.startsWith("9") || this.warncellId.startsWith("10") ? definitionen.PROVIDER_OPTIONS.dwdService.url_appendix_land : definitionen.PROVIDER_OPTIONS.dwdService.url_appendix_town) + definitionen.PROVIDER_OPTIONS.dwdService.url_language;
    this.url = this.setUrl(url, [this.warncellId, options.language]);
  }
  async updateData() {
    const result = await this.getDataFromProvider();
    if (!result)
      return;
    this.log.debug(`Got ${result.features.length} warnings from server`);
    result.features.sort((a, b) => {
      return new Date(a.properties.ONSET).getTime() - new Date(b.properties.ONSET).getTime();
    });
    this.messages.forEach((a) => a.notDeleted = false);
    for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.features.length; a++) {
      const w = result.features[a];
      if (w.properties.STATUS == "Test")
        continue;
      if (this.filter.hours > 0 && new Date(w.properties.ONSET).getTime() > Date.now() + this.filter.hours * 36e5)
        continue;
      await super.updateData(w.properties, a);
      const index = this.messages.findIndex((m) => m.rawWarning.IDENTIFIER == w.properties.IDENTIFIER);
      if (index == -1) {
        const nmessage = new import_messages.MessagesClass(
          this.adapter,
          "dwd-msg",
          this,
          w.properties,
          this.providerController
        );
        await nmessage.updateFormated();
        if (nmessage && nmessage.filter(this.filter))
          this.messages.push(nmessage);
      } else {
        await this.messages[index].updateData(w.properties);
      }
    }
    for (let n = 0; n < this.messages.length; n++) {
      const newmsg = this.messages[n];
      if (!newmsg.newMessage)
        continue;
      for (let o = 0; o < this.messages.length; o++) {
        const oldmsg = this.messages[o];
        if (oldmsg.newMessage)
          continue;
        if (oldmsg.formatedData === void 0 || newmsg.formatedData === void 0)
          continue;
        if (oldmsg.rawWarning.EC_II != newmsg.rawWarning.EC_II)
          continue;
        if (oldmsg.starttime > newmsg.endtime || newmsg.starttime > oldmsg.endtime)
          continue;
        newmsg.silentUpdate();
        this.log.debug("Remove a old warning.(Silent Update)");
        if (o <= n)
          n--;
        this.messages.splice(o--, 1);
        break;
      }
    }
    await this.finishUpdateData();
  }
}
class ZAMGProvider extends BaseProvider {
  constructor(adapter, options) {
    super(adapter, { ...options, service: "zamgService" }, `zamg`);
    this.warncellId = options.warncellId;
    this.setUrl("", [this.warncellId[0], this.warncellId[1], options.language]);
  }
  async updateData() {
    const result = await this.getDataFromProvider();
    if (!result)
      return;
    if (!result.properties || !result.properties.warnings) {
      this.log.debug(`Got 0 warnings from server`);
      return;
    } else
      this.log.debug(`Got ${result.properties.warnings.length} warnings from server`);
    result.properties.warnings.sort((a, b) => {
      return Number(a.properties.rawinfo.start) - Number(b.properties.rawinfo.start);
    });
    this.messages.forEach((a) => a.notDeleted = false);
    for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.properties.warnings.length; a++) {
      if (this.filter.hours > 0 && Number(result.properties.warnings[a].properties.rawinfo.start) > Date.now() + this.filter.hours * 3600)
        continue;
      result.properties.warnings[a].properties.location = result.properties.location.properties.name;
      result.properties.warnings[a].properties.nachrichtentyp = result.properties.warnings[a].type;
      await super.updateData(result.properties.warnings[a].properties, a);
      const index = this.messages.findIndex((m) => {
        if (this.adapter.config.zamgEveryChange) {
          return JSON.stringify(result.properties.warnings[a].properties) == JSON.stringify(m.rawWarning);
        } else {
          return m.rawWarning.warnid == result.properties.warnings[a].properties.warnid && result.properties.warnings[a].properties.rawinfo.wlevel == m.rawWarning.rawinfo.wlevel && result.properties.warnings[a].properties.rawinfo.wtype == m.rawWarning.rawinfo.wtype;
        }
      });
      if (index == -1) {
        const nmessage = new import_messages.MessagesClass(
          this.adapter,
          "zamg-msg",
          this,
          result.properties.warnings[a].properties,
          this.providerController
        );
        await nmessage.updateFormated();
        if (nmessage && nmessage.filter(this.filter))
          this.messages.push(nmessage);
      } else {
        await this.messages[index].updateData(result.properties.warnings[a].properties);
      }
    }
    await this.finishUpdateData();
  }
}
class UWZProvider extends BaseProvider {
  constructor(adapter, options) {
    super(adapter, { ...options, service: "uwzService" }, `uwz`);
    this.warncellId = options.warncellId.toUpperCase();
    this.setUrl("", [this.warncellId, options.language]);
  }
  async updateData() {
    const result = await this.getDataFromProvider();
    if (!result || !result.results || result.results == null) {
      this.log.warn("Invalid result from uwz server!");
      return;
    }
    result.results.sort((a, b) => {
      if (a && b && a.dtgStart && b.dtgStart)
        return a.dtgStart - b.dtgStart;
      return 0;
    });
    this.messages.forEach((a) => a.notDeleted = false);
    for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.results.length; a++) {
      if (result.results[a] == null)
        continue;
      if (this.filter.hours > 0 && result.results[a].dtgStart > Date.now() + this.filter.hours * 3600)
        continue;
      await super.updateData(result.results[a], a);
      const index = this.messages.findIndex((m) => m.rawWarning.payload.id == result.results[a].payload.id);
      if (index == -1) {
        const nmessage = new import_messages.MessagesClass(
          this.adapter,
          "uwz-msg",
          this,
          result.results[a],
          this.providerController
        );
        await nmessage.updateFormated();
        if (nmessage && nmessage.filter(this.filter))
          this.messages.push(nmessage);
      } else {
        await this.messages[index].updateData(result.results[a]);
      }
    }
    this.log.debug(`Got ${result.results.length} warnings from server`);
    await this.finishUpdateData();
  }
}
class NINAProvider extends BaseProvider {
  constructor(adapter, options) {
    super(adapter, { ...options, service: "ninaService" }, `nina`);
  }
}
class METROProvider extends BaseProvider {
  constructor(adapter, options) {
    super(adapter, { ...options, service: "metroService" }, `nina`);
  }
}
class ProviderController extends import_library.BaseClass {
  providers = [];
  refreshTimeRef = null;
  alertTimeoutRef = null;
  connection = true;
  name = "provider";
  refreshTime = 3e5;
  library;
  notificationServices = [];
  noWarning;
  pushOn = false;
  testStatus = 0;
  activeMessages = 0;
  isSilentTime = true;
  silentTime = {
    forceOff: false,
    profil: [[], [], [], []]
  };
  constructor(adapter) {
    super(adapter, "provider");
    this.library = this.adapter.library;
    this.noWarning = new import_messages.MessagesClass(this.adapter, this.name, null, {}, this);
    this.noWarning.newMessage = false;
    this.noWarning.notDeleted = false;
    this.doEndOfUpdater.bind(this);
  }
  async init() {
    this.pushOn = !this.adapter.config.notPushAtStart;
    this.refreshTime = this.adapter.config.refreshTime * 6e4;
    const states = [];
    for (const a in messagesDef.genericWarntyp) {
      states[a] = this.library.getTranslation(messagesDef.genericWarntyp[a].name);
    }
    definitionen.statesObjectsWarnings.allService.formatedkeys.warntypegeneric.common.states = states;
    if (this.adapter.config.silentTime !== void 0) {
      for (let p = 0; p < providerDef.silentTimeKeys.length; p++) {
        let index = -1;
        this.silentTime.profil[++index] = (this.adapter.config.silentTime || []).filter((f) => f && providerDef.silentTimeKeys[index] == f.profil).map((item) => {
          const result = {
            day: [],
            start: 0,
            end: 0
          };
          for (const a in item) {
            const b = a;
            if (b == "profil")
              continue;
            if (b != "day" && item[b].indexOf(":") != -1) {
              const t = item[b].split(":");
              if (Number.isNaN(t[0]))
                return null;
              if (!Number.isNaN(t[1]) && parseInt(t[1]) > 0) {
                t[1] = String(parseInt(t[1]) / 60);
                item[b] = String(parseFloat(t[0]) + parseFloat(t[1]));
              } else
                item[b] = t[0];
            }
            if (b == "day")
              result.day = item.day;
            else if (b == "end")
              result.end = parseFloat(item.end);
            else
              result.start = parseFloat(item.start);
          }
          this.log.info(
            `Silent time added: Profil: ${providerDef.silentTimeKeys[index]} start: ${result.start} end: ${result.end} days: ${JSON.stringify(result.day)}`
          );
          return result;
        }).filter((f) => f != null);
      }
      this.library.writedp(
        `command.silentTime`,
        void 0,
        definitionen.statesObjectsWarnings.allService.command.silentTime._channel
      );
      for (const dp in definitionen.actionStates) {
        const data = definitionen.actionStates[dp];
        if (!this.library.readdp(dp))
          this.library.writedp(dp, data.default, data.def);
      }
    }
  }
  async createNotificationService(optionList) {
    for (const a in optionList) {
      const options = optionList[a];
      if (options === void 0)
        return;
      const objs = options.adapter != "" ? await this.adapter.getObjectViewAsync("system", "instance", {
        startkey: `system.adapter.${options.adapter}`,
        endkey: `system.adapter.${options.adapter}`
      }) : null;
      if (!options.useadapter || objs && objs.rows && objs.rows.length > 0) {
        const noti = new NotificationClass.NotificationClass(this.adapter, options);
        this.notificationServices.push(noti);
        await noti.init();
      } else {
        this.log.error(`Configuration: ${options.name} is active, but dont find ${options.adapter} adapter!`);
        throw new Error(`Configuration: ${options.name} is active, but dont find ${options.adapter} adapter!`);
      }
    }
  }
  createProviderIfNotExist(options) {
    const index = this.providers.findIndex(
      (p) => p && (typeof p.warncellId == "string" && p.warncellIdString == options.warncellId || typeof options.warncellId == "object" && options.warncellId.join(DIV) == p.warncellIdString) && p.getService() == options.service
    );
    if (index == -1) {
      let p;
      switch (options.service) {
        case "dwdService":
          if (Array.isArray(options.warncellId)) {
            throw new Error("Error 122 warncellId is a Array");
          }
          p = new DWDProvider(this.adapter, {
            ...options,
            warncellId: options.warncellId,
            providerController: this
          });
          break;
        case "uwzService":
          if (Array.isArray(options.warncellId)) {
            throw new Error("Error 123 warncellId is a Array");
          }
          p = new UWZProvider(this.adapter, {
            ...options,
            warncellId: options.warncellId,
            providerController: this
          });
          break;
        case "zamgService":
          if (!Array.isArray(options.warncellId)) {
            throw new Error("Error 124 warncellId is not an Array");
          }
          p = new ZAMGProvider(this.adapter, {
            ...options,
            warncellId: options.warncellId,
            providerController: this
          });
          break;
        case "ninaService":
          if (!Array.isArray(options.warncellId)) {
            throw new Error("Error 125 warncellId is not an Array");
          }
          p = new NINAProvider(this.adapter, {
            ...options,
            warncellId: options.warncellId,
            providerController: this,
            language: this.adapter.config.dwdLanguage
          });
          break;
        default:
          throw new Error("Error 126 service is not defined");
      }
      if (p)
        this.providers.push(p);
      return p;
    } else {
      this.log.error("Attempt to create an existing provider.");
      return this.providers[index];
    }
  }
  async delete() {
    super.delete();
    await this.library.memberDeleteAsync(this.providers);
    await this.library.memberDeleteAsync(this.notificationServices);
    this.providers = [];
    this.notificationServices = [];
    await this.setConnected(false);
    if (this.refreshTimeRef)
      this.adapter.clearTimeout(this.refreshTimeRef);
    if (this.alertTimeoutRef)
      this.adapter.clearTimeout(this.alertTimeoutRef);
  }
  updateEndless(that) {
    if (that.adapter.config.useTestCase) {
      if (++that.testStatus > 3)
        that.testStatus = 1;
      that.adapter.config.useTestWarnings = true;
      that.refreshTime = 6e4;
    }
    that.connection = false;
    if (that.refreshTimeRef)
      that.adapter.clearTimeout(that.refreshTimeRef);
    if (that.providers.length == 0) {
      that.setConnected(false);
      return;
    }
    updater(that);
    async function updater(self, index = 0) {
      const that2 = self;
      if (that2.unload)
        return;
      if (index < that2.providers.length) {
        if (that2.providers[index])
          await that2.providers[index].updateData();
        index++;
        that2.refreshTimeRef = that2.adapter.setTimeout(updater, 500, that2, index);
      } else {
        await that2.doEndOfUpdater();
        that2.refreshTimeRef = that2.adapter.setTimeout(that2.updateEndless, that2.refreshTime || 6e5, that2);
      }
    }
  }
  async updateAlertEndless(that) {
    if (that.unload)
      return;
    await that.setSpeakAllowed();
    that.checkAlerts();
    const timeout = 61333 - Date.now() % 6e4;
    that.alertTimeoutRef = that.adapter.setTimeout(that.updateAlertEndless, timeout, that);
  }
  checkAlerts() {
    for (const p in this.providers) {
      this.providers[p].getAlertsAndWrite();
    }
  }
  async doEndOfUpdater() {
    this.setConnected();
    await this.updateMesssages();
    this.activeMessages = 0;
    for (const a in this.providers) {
      let am = 0;
      for (const b in this.providers[a].messages) {
        if (this.providers[a].messages[b].notDeleted) {
          am++;
        }
      }
      this.adapter.library.writedp(
        `${this.providers[a].name}.activeWarnings`,
        am,
        definitionen.genericStateObjects.activeWarnings
      );
      this.activeMessages += am;
    }
    if (this.pushOn) {
      for (const push of this.notificationServices) {
        await push.sendMessage(this.providers, ["new", "remove", "all", "removeAll"]);
      }
    }
    this.pushOn = true;
    await this.adapter.library.writedp(
      `${this.name}.activeWarnings`,
      this.activeMessages,
      definitionen.genericStateObjects.activeWarnings
    );
    this.providers.forEach((a) => a.clearMessages());
    this.providers.forEach((a) => a.finishTurn());
    this.log.debug(`We have ${this.activeMessages} active messages.`);
  }
  providersExist() {
    return this.providers.length > 0;
  }
  async setConnected(status = this.connection) {
    await this.adapter.library.writedp(
      `info.connection`,
      !!status,
      definitionen.genericStateObjects.info.connection
    );
  }
  async onStatePush(id) {
    id = id.replace(`${this.adapter.namespace}.`, "");
    const cmd = id.split(".").pop();
    const service = id.split(".").slice(0, -2).join(".");
    let index = -1;
    let providers = [];
    if ((index = this.providers.findIndex((a) => a.name == service)) > -1) {
      providers.push(this.providers[index]);
    } else {
      providers = this.providers;
    }
    for (const push of this.notificationServices) {
      if (cmd == push.name && push.canManual())
        await push.sendMessage(providers, [...NotificationType.manual, "removeAll"], true);
    }
  }
  async updateCommandStates() {
    for (const p of [...this.providers, this]) {
      const channel = (p instanceof BaseProvider ? `${this.adapter.namespace}.${p.name}` : `${this.adapter.namespace}`) + ".command";
      const states = this.library.getStates(`${channel}.*`.replace(".", "\\."));
      for (const n of this.notificationServices) {
        if (n.options.notifications.findIndex((a) => NotificationType.manual.indexOf(a) != -1) == -1)
          continue;
        if (!(p instanceof BaseProvider) || n.options.service.indexOf(p.service) != -1) {
          await this.library.writedp(
            channel,
            void 0,
            definitionen.statesObjectsWarnings.allService.command._channel
          );
          const dp = `${channel}.${n.name}`;
          states[dp] = void 0;
          await this.library.writedp(
            dp,
            false,
            definitionen.statesObjectsWarnings.allService.command[n.name]
          );
        }
      }
      for (const dp in states)
        if (states[dp] !== void 0 && definitionen.actionStates[dp] == void 0)
          await this.adapter.delObjectAsync(dp);
      await this.adapter.subscribeStatesAsync(channel + ".*");
    }
  }
  setAllowedDirs(allowedDirs) {
    const dirs = [];
    for (const a in allowedDirs) {
      if (!allowedDirs[a].dpWarning)
        dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9-_]+\\.warning`);
      if (!allowedDirs[a].dpAlerts)
        dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9-_]+\\.alerts`);
      if (!allowedDirs[a].dpFormated)
        dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9-_]+\\.formatedKeys`);
      this.library.setForbiddenDirs(dirs);
    }
  }
  async updateMesssages() {
    for (const a in this.providers) {
      for (const b in this.providers[a].messages) {
        await this.providers[a].messages[b].updateFormatedData();
        await this.providers[a].messages[b].writeFormatedKeys(Number(b));
      }
    }
  }
  async setSpeakAllowed() {
    if (this.isSilentAuto()) {
      const profil = this.getSpeakProfil();
      let isSpeakAllowed = true;
      if (this.silentTime !== void 0) {
        const now = new Date().getHours() + new Date().getMinutes() / 60;
        const day = String(new Date().getDay());
        for (const t of this.silentTime.profil[profil]) {
          if (t === null)
            continue;
          if (t.day.indexOf(day) == -1)
            continue;
          if (t.start < t.end) {
            if (t.start <= now && t.end > now) {
              isSpeakAllowed = false;
              break;
            }
          } else {
            if (t.start <= now || t.end > now) {
              isSpeakAllowed = false;
              break;
            }
          }
          isSpeakAllowed = true;
        }
      }
      if (isSpeakAllowed != this.silentTime.shouldSpeakAllowed) {
        await this.library.writedp(
          `command.silentTime.isSpeakAllowed`,
          isSpeakAllowed,
          definitionen.statesObjectsWarnings.allService.command.silentTime.isSpeakAllowed
        );
        this.silentTime.shouldSpeakAllowed = isSpeakAllowed;
      }
    }
  }
  isSilentAuto() {
    const result = this.library.readdp(`command.silentTime.autoMode`);
    return result != void 0 && !!result.val;
  }
  isSpeakAllowed() {
    const result = this.library.readdp(`command.silentTime.isSpeakAllowed`);
    return result != void 0 && !!result.val || result == void 0;
  }
  getSpeakProfil() {
    const result = this.library.readdp(`command.silentTime.profil`);
    return result != void 0 && typeof result.val == "number" ? result.val : 0;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseProvider,
  DIV,
  DWDProvider,
  METROProvider,
  NINAProvider,
  ProviderController,
  UWZProvider,
  ZAMGProvider
});
//# sourceMappingURL=provider.js.map
