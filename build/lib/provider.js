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
  DWDProvider: () => DWDProvider,
  METROProvider: () => METROProvider,
  NINAProvider: () => NINAProvider,
  ProviderController: () => ProviderController,
  UWZProvider: () => UWZProvider,
  ZAMGProvider: () => ZAMGProvider
});
module.exports = __toCommonJS(provider_exports);
var import_axios = __toESM(require("axios"));
var import_definitionen = require("./def/definitionen");
var import_library = require("./library");
var import_messages = require("./messages");
var import_test_warnings = require("./test-warnings");
class BaseProvider extends import_library.BaseClass {
  service;
  url = "";
  warncellId = "";
  rawData = null;
  library;
  messages = [];
  providerController;
  constructor(adapter, options, name) {
    super(adapter, "provider." + name);
    this.service = options.service;
    this.library = this.adapter.library;
    this.providerController = options.providerController;
    this.setService(options.service);
    this.log.setLogPrefix(`${name}-${options.warncellId}`);
    this.init();
  }
  async init() {
    this.library.writedp(`${this.name}.info`, void 0, import_definitionen.genericStateObjects.info._channel);
    this.library.writedp(`${this.name}.messages`, void 0, import_definitionen.genericStateObjects.messageStates._channel);
    this.library.writedp(`${this.name}.formatedKeys`, void 0, import_definitionen.genericStateObjects.formatedKeysDevice);
    this.setConnected(false);
  }
  delete() {
    this.rawData = null;
    this.setConnected(false);
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
      this.url = import_definitionen.PROVIDER_OPTIONS[this.service]["url"];
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
    const objDef = await this.library.getObjectDefFromJson(`info.connection`, import_definitionen.genericStateObjects);
    this.library.writedp(`${this.name}.info.connection`, !!status, objDef);
  }
  async update() {
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
      const objDef = await this.library.getObjectDefFromJson(`info.testMode`, import_definitionen.genericStateObjects);
      this.library.writedp(`${this.name}.info.testMode`, this.adapter.config.useTestWarnings, objDef);
      if (this.adapter.config.useTestWarnings) {
        return this.library.cloneGenericObject((0, import_test_warnings.getTestData)(this.service));
      } else {
        const result = await import_axios.default.get(this.url);
        if (result.status == 200) {
          await this.setConnected(true);
          return typeof result.data == "object" ? result.data : JSON.parse(result.data);
        } else {
          this.log.warn("Warn(23) " + result.statusText);
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
        if (a.formatedData && a.formatedData.startunixtime && b.formatedData && b.formatedData.startunixtime)
          return a.formatedData.startunixtime - b.formatedData.startunixtime;
        return 0;
      });
      await this.messages[m].writeFormatedKeys(m);
      await this.messages[m].formatMessages();
    }
    this.library.garbageColleting(`${this.name}.formatedKeys`, (this.providerController.refreshTime || 6e5) / 2);
  }
  async dumpData(prefix, data) {
    if (!prefix || !data || typeof data !== "object")
      return;
    for (const key in data) {
      this.adapter.library.writeState(`${prefix}`, key, data[key]);
    }
  }
  async updateData(data, counter) {
    if (!data)
      return;
    this.library.writedp(`${this.name}.warning`, void 0, import_definitionen.genericStateObjects.warningDevice);
    await this.library.writeFromJson(
      `${this.name}.warning.${("00" + counter.toString()).slice(-2)}`,
      `${this.service}.raw`,
      import_definitionen.statesObjectsWarnings,
      data
    );
  }
  async sendMessages(override = false) {
    if (this.messages.length == 0 && !override) {
      return;
    } else {
      const jsonMessage = {};
      for (const m in this.messages) {
        const removeIt = await this.messages[m].sendMessage();
        if (removeIt)
          this.messages.splice(Number(m), 1);
        else {
          for (const k in this.messages[m].messages) {
            const key = this.messages[m].messages[k].key;
            const msg = this.messages[m].messages[k].message;
            jsonMessage[key] = jsonMessage[key] || [];
            jsonMessage[key].push(msg);
          }
        }
      }
      for (const key in jsonMessage) {
        this.library.writedp(
          `${this.name}.messages.${key}_array`,
          JSON.stringify(jsonMessage[key]),
          import_definitionen.genericStateObjects.messageStates.messageJson
        );
      }
      return;
    }
  }
}
class DWDProvider extends BaseProvider {
  constructor(adapter, options) {
    super(adapter, { ...options, service: "dwdService" }, `dwd`);
    this.warncellId = options.warncellId;
    const url = import_definitionen.PROVIDER_OPTIONS.dwdService.url_base + (this.warncellId.startsWith("9") || this.warncellId.startsWith("10") ? import_definitionen.PROVIDER_OPTIONS.dwdService.url_appendix_land : import_definitionen.PROVIDER_OPTIONS.dwdService.url_appendix_town) + import_definitionen.PROVIDER_OPTIONS.dwdService.url_language;
    this.url = this.setUrl(url, [this.warncellId, options.language]);
  }
  async updateData() {
    const result = await this.getDataFromProvider();
    if (!result)
      return;
    this.log.debug(`Got ${result.totalFeatures} warnings from server`);
    result.features.sort((a, b) => {
      return new Date(a.properties.ONSET).getTime() - new Date(b.properties.ONSET).getTime();
    });
    this.messages.forEach((a) => a.notDeleted = false);
    for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.totalFeatures; a++) {
      const w = result.features[a];
      if (w.properties.STATUS == "Test")
        continue;
      await super.updateData(w.properties, a);
      const index = this.messages.findIndex((m) => m.rawWarning.IDENTIFIER == w.properties.IDENTIFIER);
      if (index == -1) {
        const nmessage = new import_messages.Messages(this.adapter, "dwd-msg", this, w.properties);
        await nmessage.init();
        if (nmessage)
          this.messages.push(nmessage);
      } else {
        this.messages[index].updateData(w.properties);
      }
    }
    this.library.garbageColleting(`${this.name}.warning`);
    for (const m in this.messages) {
      const msg = this.messages[m];
      const formatedData = await msg.updateFormatedData();
      let breakit = false;
      if (msg.rawWarning.MSGTYPE == "Update") {
        for (const m2 in this.messages) {
          const delMsg = this.messages[m2];
          if (msg === delMsg)
            continue;
          if (delMsg.formatedData === void 0)
            continue;
          if (delMsg.rawWarning.EC_II == msg.rawWarning.EC_II) {
            if (delMsg.formatedData.warnlevelnumber !== void 0 && formatedData.warnlevelnumber !== void 0 && delMsg.formatedData.warnlevelnumber <= formatedData.warnlevelnumber) {
              msg.silentUpdate();
            }
            this.messages[m2].delete();
            this.messages.slice(Number(m2), 1);
            breakit = true;
            break;
          }
        }
      }
      if (breakit)
        break;
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
      result.properties.warnings[a].properties.location = result.properties.location.properties.name;
      result.properties.warnings[a].properties.nachrichtentyp = result.properties.warnings[a].type;
      await super.updateData(result.properties.warnings[a].properties, a);
      const index = this.messages.findIndex(
        (m) => m.rawWarning.warnid == result.properties.warnings[a].properties.warnid
      );
      if (index == -1) {
        const nmessage = new import_messages.Messages(this.adapter, "zamg-msg", this, result.properties.warnings[a].properties);
        await nmessage.init();
        this.messages.push(nmessage);
      } else {
        this.messages[index].updateData(result.properties.warnings[a].properties);
      }
    }
    this.library.garbageColleting(`${this.name}.warning`);
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
    if (!result || !result.results)
      return;
    result.results.sort((a, b) => {
      return a.dtgStart - b.dtgStart;
    });
    this.messages.forEach((a) => a.notDeleted = false);
    for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.results.length; a++) {
      await super.updateData(result.results[a], a);
      const index = this.messages.findIndex((m) => m.rawWarning.payload.id == result.results[a].payload.id);
      if (index == -1) {
        const nmessage = new import_messages.Messages(this.adapter, "uwz-msg", this, result.results[a]);
        await nmessage.init();
        this.messages.push(nmessage);
      } else {
        this.messages[index].updateData(result.results[a]);
      }
    }
    this.log.debug(`Got ${result.results.length} warnings from server`);
    this.library.garbageColleting(`${this.name}.warning`);
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
  provider = [];
  refreshTimeRef = null;
  connection = true;
  name = "provider";
  refreshTime = 3e5;
  constructor(adapter) {
    super(adapter, "provider");
  }
  init() {
    this.refreshTime = (this.adapter.config.refreshTime < 5 ? 5 : this.adapter.config.refreshTime) * 6e4;
  }
  createProviderIfNotExist(options) {
    const index = this.provider.findIndex(
      (p) => p && p.warncellId == options.warncellId && p.getService() == options.service
    );
    if (index == -1) {
      let p;
      switch (options.service) {
        case "dwdService":
          if (Array.isArray(options.warncellId)) {
            throw new Error("Error 122 warncellId is a Array");
          }
          p = new DWDProvider(this.adapter, {
            warncellId: options.warncellId,
            providerController: this,
            language: this.adapter.config.dwdLanguage
          });
          break;
        case "uwzService":
          if (Array.isArray(options.warncellId)) {
            throw new Error("Error 123 warncellId is a Array");
          }
          p = new UWZProvider(this.adapter, {
            warncellId: options.warncellId,
            providerController: this,
            language: this.adapter.config.uwzLanguage
          });
          break;
        case "zamgService":
          if (!Array.isArray(options.warncellId)) {
            throw new Error("Error 124 warncellId is not an Array");
          }
          p = new ZAMGProvider(this.adapter, {
            warncellId: options.warncellId,
            providerController: this,
            language: this.adapter.config.zamgLanguage
          });
          break;
        case "ninaService":
          if (!Array.isArray(options.warncellId)) {
            throw new Error("Error 125 warncellId is not an Array");
          }
          p = new NINAProvider(this.adapter, {
            warncellId: options.warncellId,
            providerController: this,
            language: this.adapter.config.dwdLanguage
          });
          break;
        default:
          throw new Error("Error 126 service is not defined");
      }
      if (p)
        this.provider.push(p);
      return p;
    } else {
      return this.provider[index];
    }
  }
  delete() {
    super.delete();
    for (const p of this.provider) {
      if (p)
        p.delete();
    }
    this.provider = [];
    if (this.refreshTimeRef)
      this.adapter.clearTimeout(this.refreshTimeRef);
  }
  sendNoMessages() {
  }
  updateEndless(that) {
    that.connection = false;
    if (that.refreshTimeRef)
      that.adapter.clearTimeout(that.refreshTimeRef);
    if (that.provider.length == 0) {
      that.setConnected(false);
      return;
    }
    updater(that);
    async function updater(that2, index = 0) {
      if (that2.unload)
        return;
      if (index < that2.provider.length) {
        if (that2.provider[index])
          await that2.provider[index].updateData();
        index++;
        that2.refreshTimeRef = that2.adapter.setTimeout(updater, 500, that2, index);
      } else {
        await that2.doEndOfUpdater();
        that2.refreshTimeRef = that2.adapter.setTimeout(that2.updateEndless, that2.refreshTime || 6e5, that2);
      }
    }
  }
  async doEndOfUpdater() {
    this.setConnected();
    let activMessages = 0;
    for (const a in this.provider) {
      let am = 0;
      for (const b in this.provider[a].messages) {
        if (this.provider[a].messages[b].notDeleted)
          am++;
      }
      this.adapter.library.writedp(
        `${this.provider[a].name}.activWarnings`,
        am,
        import_definitionen.genericStateObjects.activWarnings
      );
      activMessages += am;
    }
    if (activMessages) {
      for (const a in this.provider) {
        try {
          await this.provider[a].sendMessages();
        } catch (error) {
          this.log.error(error);
        }
      }
    } else {
      this.sendNoMessages();
    }
    this.adapter.library.writedp(`${this.name}.activWarnings`, activMessages, import_definitionen.genericStateObjects.activWarnings);
    this.log.debug(`We have ${activMessages} active messages.`);
  }
  providersExist() {
    return this.provider.length > 0;
  }
  async setConnected(status = this.connection) {
    const objDef = await this.adapter.library.getObjectDefFromJson(`info.connection`, import_definitionen.genericStateObjects);
    this.adapter.library.writedp(`info.connection`, !!status, objDef);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DWDProvider,
  METROProvider,
  NINAProvider,
  ProviderController,
  UWZProvider,
  ZAMGProvider
});
//# sourceMappingURL=provider.js.map
