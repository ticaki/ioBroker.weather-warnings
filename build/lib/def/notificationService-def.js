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
var notificationService_def_exports = {};
__export(notificationService_def_exports, {
  Array: () => Array,
  manual: () => manual,
  serciceCapabilities: () => serciceCapabilities
});
module.exports = __toCommonJS(notificationService_def_exports);
const manual = ["manualAll"];
const push = [...manual, "new", "remove", "removeAll"];
const history = ["new", "remove"];
const json = ["all", "removeAll"];
const email = [...manual, "new", "all", "removeAll", "remove"];
const serciceCapabilities = {
  telegram: { notifications: push },
  email: { notifications: email },
  json: { notifications: json },
  whatsapp: { notifications: push },
  pushover: { notifications: push },
  history: { notifications: history },
  alexa2: { notifications: push }
};
const Array = ["telegram", "pushover", "whatsapp", "json", "history", "email", "alexa2"];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Array,
  manual,
  serciceCapabilities
});
//# sourceMappingURL=notificationService-def.js.map
