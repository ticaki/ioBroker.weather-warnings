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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var provider_def_exports = {};
__export(provider_def_exports, {
  providerServicesArray: () => providerServicesArray,
  silentTimeKeys: () => silentTimeKeys
});
module.exports = __toCommonJS(provider_def_exports);
__reExport(provider_def_exports, require("../provider"), module.exports);
const providerServicesArray = ["dwdService", "zamgService", "uwzService"];
const silentTimeKeys = ["alldays", "holiday", "guess", "custom"];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  providerServicesArray,
  silentTimeKeys
});
//# sourceMappingURL=provider-def.js.map
