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
var notificationConfig_d_exports = {};
__export(notificationConfig_d_exports, {
  notificationServiceDefaults: () => notificationServiceDefaults
});
module.exports = __toCommonJS(notificationConfig_d_exports);
var import_messages = require("../messages");
const notificationServiceDefaults = {
  telegram: {
    class: import_messages.NotificationClass,
    useadapter: true
  },
  pushover: {
    class: import_messages.NotificationClass,
    useadapter: true
  },
  whatsapp: {
    class: import_messages.NotificationClass,
    useadapter: true
  },
  json: {
    class: import_messages.AllNotificationClass,
    useadapter: false
  },
  history: {
    class: import_messages.AllNotificationClass,
    useadapter: false
  },
  email: {
    class: import_messages.AllNotificationClass,
    useadapter: true
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  notificationServiceDefaults
});
//# sourceMappingURL=notificationConfig-d.js.map
