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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var notificationServiceConfig_exports = {};
__export(notificationServiceConfig_exports, {
  resolveNotificationServices: () => resolveNotificationServices
});
module.exports = __toCommonJS(notificationServiceConfig_exports);
var NotificationType = __toESM(require("./def/notificationService-def"));
var import_notificationService_def = require("./def/notificationService-def");
var import_notificationServicesModel = require("./notificationServicesModel");
function resolveNotificationServices(config, log) {
  var _a;
  const cfg = {
    ...config,
    ...(0, import_notificationServicesModel.modelToFlatConfig)(
      config.notificationServices
    )
  };
  const notificationServiceOpt = {};
  const disabledServices = [];
  for (const n of NotificationType.Array) {
    const notificationService = n;
    if (!cfg[`${notificationService}_Enabled`]) {
      continue;
    }
    const service = [];
    if (cfg[`${notificationService}_DwdEnabled`]) {
      service.push("dwdService");
    }
    if (cfg[`${notificationService}_UwzEnabled`]) {
      service.push("uwzService");
    }
    if (cfg[`${notificationService}_ZamgEnabled`]) {
      service.push("zamgService");
    }
    const template = {
      new: cfg[`${notificationService}_MessageNew`] !== void 0 ? cfg[`${notificationService}_MessageNew`] : "none",
      remove: cfg[`${notificationService}_MessageRemove`],
      removeAll: cfg[`${notificationService}_MessageAllRemove`],
      all: cfg[`${notificationService}_MessageAll`] !== void 0 ? cfg[`${notificationService}_MessageAll`] : cfg[`${notificationService}_MessageNew`] !== void 0 ? cfg[`${notificationService}_MessageNew`] : "none",
      manualAll: cfg[`${notificationService}_manualAll`] !== void 0 ? cfg[`${notificationService}_manualAll`] : "none",
      removeManualAll: cfg[`${notificationService}_removeManualAll`] !== void 0 ? cfg[`${notificationService}_removeManualAll`] : "none",
      title: cfg[`${notificationService}_Title`] !== void 0 ? cfg[`${notificationService}_Title`] : "none"
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
          level: cfg[`${notificationService}_LevelFilter`] || -1,
          type: (cfg[`${notificationService}_TypeFilter`] || []).map((a) => String(a))
        },
        manual: {
          level: cfg[`${notificationService}_ManualLevelFilter`] ? cfg[`${notificationService}_ManualLevelFilter`] : -1,
          type: (cfg[`${notificationService}_ManualTypeFilter`] ? cfg[`${notificationService}_ManualTypeFilter`] : []).map((a) => String(a))
        }
      },
      adapter: cfg[`${notificationService}_Adapter`],
      name: notificationService,
      actions: template,
      useadapter: true
    };
    Object.assign(
      notificationServiceOpt[notificationService],
      import_notificationService_def.notificationServiceDefaults[notificationService]
    );
  }
  if (cfg.telegram_Enabled && notificationServiceOpt.telegram != void 0) {
    notificationServiceOpt.telegram.withNoSound = cfg.telegram_withNoSound || false;
    notificationServiceOpt.telegram.userid = cfg.telegram_UserId || "";
    notificationServiceOpt.telegram.chatid = cfg.telegram_ChatID || "";
    notificationServiceOpt.telegram.parse_mode = cfg.telegram_parse_mode || "none";
  }
  if (cfg.whatsapp_Enabled && notificationServiceOpt.whatsapp != void 0) {
    if (cfg.whatsapp_Phonenumber) {
      notificationServiceOpt.whatsapp.phonenumber = cfg.whatsapp_Phonenumber;
    }
  }
  if (cfg.pushover_Enabled && notificationServiceOpt.pushover != void 0) {
    notificationServiceOpt.pushover.sound = cfg.pushover_Sound || "none";
    notificationServiceOpt.pushover.priority = cfg.pushover_Priority || false;
    notificationServiceOpt.pushover.device = cfg.pushover_Device || "";
  }
  if (cfg.gotify_Enabled && notificationServiceOpt.gotify != void 0) {
    notificationServiceOpt.gotify.priority = cfg.gotify_Priority !== void 0 ? parseInt(cfg.gotify_Priority) : 0;
    notificationServiceOpt.gotify.contentType = cfg.gotify_contentType || "text/plain";
  }
  if (cfg.nspanel_Enabled && notificationServiceOpt.nspanel != void 0) {
    notificationServiceOpt.nspanel.priority = cfg.nspanel_Priority !== void 0 && cfg.nspanel_Priority > 0 ? Math.ceil(cfg.nspanel_Priority) : 50;
    notificationServiceOpt.nspanel.alwaysOn = (_a = cfg.nspanel_alwaysOn) != null ? _a : true;
  }
  if (cfg.email_Enabled && notificationServiceOpt.email != void 0) {
    notificationServiceOpt.email.actions.header = cfg.email_Header;
    notificationServiceOpt.email.actions.footer = cfg.email_Footer;
    notificationServiceOpt.email.recipients = cfg.email_Recipients;
  }
  if (cfg.alexa2_Enabled && notificationServiceOpt.alexa2 != void 0) {
    notificationServiceOpt.alexa2.volumen = cfg.alexa2_volumen > 0 ? String(cfg.alexa2_volumen) : "";
    notificationServiceOpt.alexa2.audio = cfg.alexa2_Audio || "";
    notificationServiceOpt.alexa2.sounds = cfg.alexa2_sounds || [];
    notificationServiceOpt.alexa2.sounds_enabled = cfg.alexa2_sounds_enabled || false;
    if (!cfg.alexa2_device_ids || cfg.alexa2_device_ids.length == 0 || !cfg.alexa2_device_ids[0]) {
      log.error(`Missing devices for alexa - deactivated`);
      delete notificationServiceOpt.alexa2;
      disabledServices.push("alexa2");
    } else if (cfg.alexa2_Adapter == "none") {
      log.error(`Missing adapter for alexa - deactivated`);
      delete notificationServiceOpt.alexa2;
      disabledServices.push("alexa2");
    }
  }
  if (cfg.sayit_Enabled && notificationServiceOpt.sayit != void 0) {
    notificationServiceOpt.sayit.volumen = cfg.sayit_volumen > 0 ? String(cfg.sayit_volumen) : "";
    if (!cfg.sayit_Adapter_Array || cfg.sayit_Adapter_Array.length == 0 || cfg.sayit_Adapter_Array[0].sayit_Adapter == "none") {
      log.warn(`Missing adapter for sayit - deactivated`);
      delete notificationServiceOpt.sayit;
      disabledServices.push("sayit");
    } else {
      notificationServiceOpt.sayit.adapters = cfg.sayit_Adapter_Array.map((a) => a.sayit_Adapter);
    }
  }
  return { options: notificationServiceOpt, disabledServices };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resolveNotificationServices
});
//# sourceMappingURL=notificationServiceConfig.js.map
