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
    this.log.info(`Refresh Interval: ${this.config.refreshTime} minutes`);
    this.library.internalConvert();
    setTimeout(
      async function(self) {
        if (!self.providerController)
          return;
        if (!self)
          return;
        try {
          const states = await self.getStatesAsync("*");
          self.library.initStates(states);
        } catch (error) {
          self.log.error(`catch (1): init error while reading states! ${error}`);
        }
        if (self.config.dwdSelectId > 1e4 && self.config.dwdEnabled) {
          self.log.info("DWD activated. Retrieve data.");
          self.providerController.createProviderIfNotExist({
            service: "dwdService",
            warncellId: self.config.dwdSelectId
          });
        }
        if (self.config.zamgEnabled && self.config.zamgSelectID && typeof self.config.zamgSelectID == "string") {
          self.log.info("ZAMG activated. Retrieve data.");
          const zamgArr = self.config.zamgSelectID.split("#");
          if (zamgArr.length == 2) {
            self.providerController.createProviderIfNotExist({
              service: "zamgService",
              warncellId: zamgArr
            });
          }
        }
        if (self.config.uwzEnabled && self.config.uwzSelectID) {
          self.log.info("UWZ activated. Retrieve data.");
          self.providerController.createProviderIfNotExist({
            service: "uwzService",
            warncellId: "UWZ" + self.config.uwzSelectID.toUpperCase()
          });
        }
        self.providerController.updateEndless(self.providerController);
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
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      this.log.debug(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
      switch (obj.command) {
        case "dwd.name":
        case "dwd.name.text":
          if (obj.callback) {
            if (this.adminTimeoutRef)
              this.clearTimeout(this.adminTimeoutRef);
            try {
              this.log.debug(`message ${obj.command} start gathering data.`);
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
                if (result.length == 1)
                  this.config.dwdSelectId = result[0].value;
                this.log.debug("inside of send to " + msg.dwd + "   " + JSON.stringify(result));
                if (obj.command == "dwd.name")
                  this.sendTo(obj.from, obj.command, result, obj.callback);
                else if (obj.command == "dwd.name.text")
                  this.sendTo(
                    obj.from,
                    obj.command,
                    result.length == 1 ? result[0].label : "",
                    obj.callback
                  );
                this.log.debug(`ID is is: ${this.config.dwdSelectId}`);
              } else {
                this.log.debug(`else because length is: ${msg.dwd.length}`);
                if (obj.command == "dwd.name.text")
                  this.sendTo(obj.from, obj.command, "", obj.callback);
                else
                  this.sendTo(obj.from, obj.command, text, obj.callback);
              }
            } catch (e) {
              this.log.error(`catch (41): ${e}`);
              if (obj.command == "dwd.name.text")
                this.sendTo(obj.from, obj.command, "", obj.callback);
              else
                this.sendTo(obj.from, obj.command, [{ label: "N/A", value: "" }], obj.callback);
            }
          }
          break;
      }
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
