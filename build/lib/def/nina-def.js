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
var nina_def_exports = {};
__export(nina_def_exports, {
  ninaDefaultSources: () => ninaDefaultSources,
  ninaSources: () => ninaSources
});
module.exports = __toCommonJS(nina_def_exports);
const ninaSources = ["MOWAS", "KATWARN", "BIWAPP", "POLICE", "DWD", "LHP"];
const ninaDefaultSources = ["MOWAS", "KATWARN", "BIWAPP", "POLICE"];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ninaDefaultSources,
  ninaSources
});
//# sourceMappingURL=nina-def.js.map
