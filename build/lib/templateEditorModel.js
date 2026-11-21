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
var templateEditorModel_exports = {};
__export(templateEditorModel_exports, {
  TOKEN_GROUPS: () => TOKEN_GROUPS,
  findTemplateUsages: () => findTemplateUsages,
  groupTokens: () => groupTokens,
  parseTemplateHelp: () => parseTemplateHelp,
  readServiceModel: () => readServiceModel,
  renameTemplate: () => renameTemplate,
  uniqueTemplateKey: () => uniqueTemplateKey,
  validateTemplateKey: () => validateTemplateKey
});
module.exports = __toCommonJS(templateEditorModel_exports);
var import_notificationServicesModel = require("./notificationServicesModel");
const TOKEN_GROUPS = [
  {
    id: "warning",
    tokens: [
      "headline",
      "description",
      "instruction",
      "impact",
      "warnlevelname",
      "warnlevelnumber",
      "warnlevelcolorname",
      "warnlevelcolorhex",
      "warntypename",
      "warntypegenericname",
      "warntypegeneric",
      "status",
      "warningcount"
    ]
  },
  {
    id: "time",
    tokens: [
      "starttime",
      "startdate",
      "startdayofweek",
      "startdayofweekshort",
      "startadverb",
      "startdaytime",
      "startday",
      "startmonth",
      "endtime",
      "enddate",
      "enddayofweek",
      "enddayofweekshort",
      "enddaytime",
      "endday",
      "endmonth",
      "countdown",
      "cdhour",
      "cdminute",
      "cdfuture",
      "starttimems",
      "endtimems",
      "zamgdayPeriod"
    ]
  },
  { id: "location", tokens: ["locationcustom", "location", "provider", "altitude", "ceiling"] },
  { id: "icons", tokens: ["weatheremoji", "iconurl", "htmlicon"] }
];
function parseTemplateHelp(help) {
  const result = {};
  if (typeof help !== "string") {
    return result;
  }
  for (const line of help.split("\n")) {
    const m = /^\$\{([^}]+)\}:\s?(.*)$/.exec(line.trim());
    if (m) {
      result[m[1]] = m[2];
    }
  }
  return result;
}
function groupTokens(tokens) {
  const known = new Set(TOKEN_GROUPS.flatMap((g) => g.tokens));
  const available = new Set(tokens);
  const groups = TOKEN_GROUPS.map((g) => ({ id: g.id, tokens: g.tokens.filter((t) => available.has(t)) })).filter(
    (g) => g.tokens.length > 0
  );
  const other = tokens.filter((t) => !known.has(t)).sort();
  if (other.length) {
    groups.push({ id: "other", tokens: other });
  }
  return groups;
}
function validateTemplateKey(table, index) {
  var _a, _b;
  const key = ((_b = (_a = table[index]) == null ? void 0 : _a.templateKey) != null ? _b : "").trim();
  if (!key) {
    return "tpl_key_empty";
  }
  if (table.some((row, i) => i !== index && row.templateKey.trim() === key)) {
    return "tpl_key_duplicate";
  }
  return void 0;
}
function readServiceModel(data) {
  var _a;
  const stored = data.notificationServices;
  const model = {};
  for (const service of import_notificationServicesModel.SERVICE_TYPES) {
    model[service] = (_a = stored == null ? void 0 : stored[service]) != null ? _a : (0, import_notificationServicesModel.flatEntryToModel)(service, data);
  }
  return model;
}
function findTemplateUsages(data, key) {
  var _a, _b;
  const usages = [];
  if (!key) {
    return usages;
  }
  const model = readServiceModel(data);
  for (const service of import_notificationServicesModel.SERVICE_TYPES) {
    const entry = model[service];
    if (!entry) {
      continue;
    }
    for (const slot of import_notificationServicesModel.SERVICE_CAPS[service].messages) {
      if (((_a = entry.messages) == null ? void 0 : _a[slot]) === key) {
        usages.push({ service, slot });
      }
    }
  }
  const table = (_b = data.templateTable) != null ? _b : [];
  const needle = `\${${key}}`;
  for (const row of table) {
    if (row.templateKey !== key && typeof row.template === "string" && row.template.includes(needle)) {
      usages.push({ service: "template", slot: row.templateKey });
    }
  }
  return usages;
}
function renameTemplate(data, oldKey, newKey) {
  var _a, _b;
  const copy = JSON.parse(JSON.stringify(data));
  if (!oldKey || !newKey || oldKey === newKey) {
    return copy;
  }
  const table = (_a = copy.templateTable) != null ? _a : [];
  const from = `\${${oldKey}}`;
  const to = `\${${newKey}}`;
  for (const row of table) {
    if (row.templateKey === oldKey) {
      row.templateKey = newKey;
    }
    if (typeof row.template === "string") {
      row.template = row.template.split(from).join(to);
    }
  }
  const hadModel = !!copy.notificationServices;
  const model = readServiceModel(copy);
  for (const service of import_notificationServicesModel.SERVICE_TYPES) {
    const entry = model[service];
    if (!entry) {
      continue;
    }
    for (const slot of import_notificationServicesModel.SERVICE_CAPS[service].messages) {
      if (((_b = entry.messages) == null ? void 0 : _b[slot]) === oldKey) {
        entry.messages[slot] = newKey;
      }
      const flatKey = `${service}_${import_notificationServicesModel.MESSAGE_SUFFIX[slot]}`;
      if (copy[flatKey] === oldKey) {
        copy[flatKey] = newKey;
      }
    }
  }
  if (hadModel) {
    copy.notificationServices = model;
  }
  return copy;
}
function uniqueTemplateKey(table, base) {
  const keys = new Set(table.map((r) => r.templateKey));
  if (!keys.has(base)) {
    return base;
  }
  let n = 2;
  while (keys.has(`${base}_${n}`)) {
    n++;
  }
  return `${base}_${n}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TOKEN_GROUPS,
  findTemplateUsages,
  groupTokens,
  parseTemplateHelp,
  readServiceModel,
  renameTemplate,
  uniqueTemplateKey,
  validateTemplateKey
});
//# sourceMappingURL=templateEditorModel.js.map
