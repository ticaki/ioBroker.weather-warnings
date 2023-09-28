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
var translations_exports = {};
__export(translations_exports, {
  geti18nTranslation: () => geti18nTranslation,
  seti18nTranslation: () => seti18nTranslation,
  showi18nTranslation: () => showi18nTranslation
});
module.exports = __toCommonJS(translations_exports);
var import_translations = __toESM(require("../../admin/i18n/de/translations.json"));
var import_translations2 = __toESM(require("../../admin/i18n/en/translations.json"));
var import_translations3 = __toESM(require("../../admin/i18n/es/translations.json"));
var import_translations4 = __toESM(require("../../admin/i18n/fr/translations.json"));
var import_translations5 = __toESM(require("../../admin/i18n/it/translations.json"));
var import_translations6 = __toESM(require("../../admin/i18n/pl/translations.json"));
var import_translations7 = __toESM(require("../../admin/i18n/nl/translations.json"));
var import_translations8 = __toESM(require("../../admin/i18n/pt/translations.json"));
var import_translations9 = __toESM(require("../../admin/i18n/ru/translations.json"));
var import_translations10 = __toESM(require("../../admin/i18n/uk/translations.json"));
var import_translations11 = __toESM(require("../../admin/i18n/zh-cn/translations.json"));
const allTranslations = {
  de: import_translations.default,
  en: import_translations2.default,
  es: import_translations3.default,
  fr: import_translations4.default,
  it: import_translations5.default,
  pl: import_translations6.default,
  nl: import_translations7.default,
  pt: import_translations8.default,
  ru: import_translations9.default,
  uk: import_translations10.default,
  "zh-cn": import_translations11.default
};
function geti18nTranslation(key) {
  const result = {};
  if (allTranslations) {
    for (const l in allTranslations) {
      const ll = l;
      if (allTranslations[ll][key] !== void 0) {
        result[ll] = allTranslations[ll][key];
      }
    }
    if (result.en !== void 0 && result.en !== "")
      return result;
  }
  return "";
}
function seti18nTranslation(key, val) {
  if (!key || !val)
    return;
  if (allTranslations.en[key] !== void 0 && allTranslations.en[key] !== "")
    return;
  if (typeof val == "object") {
    for (const l in allTranslations) {
      allTranslations[l][key] = val[l];
    }
  } else {
    allTranslations.en[key] = val;
  }
}
function showi18nTranslation() {
  const en2 = JSON.stringify(allTranslations.en);
  const de2 = JSON.stringify(allTranslations.de);
  if (en2 != de2) {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  geti18nTranslation,
  seti18nTranslation,
  showi18nTranslation
});
//# sourceMappingURL=translations.js.map
