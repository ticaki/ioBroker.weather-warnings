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
var notificationServicesModel_exports = {};
__export(notificationServicesModel_exports, {
  MESSAGE_SUFFIX: () => MESSAGE_SUFFIX,
  SERVICE_CAPS: () => SERVICE_CAPS,
  SERVICE_TYPES: () => SERVICE_TYPES,
  flatConfigToModel: () => flatConfigToModel,
  flatEntryToModel: () => flatEntryToModel,
  modelEntryToFlat: () => modelEntryToFlat,
  modelToFlatConfig: () => modelToFlatConfig
});
module.exports = __toCommonJS(notificationServicesModel_exports);
const SERVICE_TYPES = [
  "telegram",
  "gotify",
  "nspanel",
  "pushover",
  "whatsapp",
  "json",
  "history",
  "email",
  "alexa2",
  "sayit"
];
const MESSAGE_SUFFIX = {
  new: "MessageNew",
  remove: "MessageRemove",
  removeAll: "MessageAllRemove",
  all: "MessageAll",
  manualAll: "manualAll",
  removeManualAll: "removeManualAll",
  title: "Title",
  header: "Header",
  footer: "Footer"
};
const BASE_MESSAGES = ["new", "remove", "removeAll"];
const MANUAL_MESSAGES = ["manualAll", "removeManualAll"];
const SERVICE_CAPS = {
  telegram: {
    adapter: "single",
    multiInstance: true,
    manualFilter: true,
    messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
    extras: ["UserId", "withNoSound", "parse_mode", "ChatID"]
  },
  whatsapp: {
    adapter: "single",
    multiInstance: true,
    manualFilter: true,
    messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
    extras: ["Phonenumber"]
  },
  pushover: {
    adapter: "single",
    multiInstance: true,
    manualFilter: true,
    messages: [...BASE_MESSAGES, "title", ...MANUAL_MESSAGES],
    extras: ["Sound", "Priority", "Device"]
  },
  gotify: {
    adapter: "single",
    multiInstance: true,
    manualFilter: true,
    messages: [...BASE_MESSAGES, "title", ...MANUAL_MESSAGES],
    extras: ["Priority", "contentType"]
  },
  nspanel: {
    adapter: "single",
    manualFilter: true,
    messages: [...BASE_MESSAGES, "title", ...MANUAL_MESSAGES],
    extras: ["Priority", "alwaysOn", "Target"]
  },
  alexa2: {
    adapter: "single",
    manualFilter: true,
    messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
    extras: ["device_ids", "volumen", "Audio", "sounds_enabled", "sounds"]
  },
  sayit: {
    adapter: "array",
    manualFilter: true,
    messages: [...BASE_MESSAGES, ...MANUAL_MESSAGES],
    extras: ["volumen", "Audio", "sounds_enabled"]
  },
  email: {
    adapter: "single",
    multiInstance: true,
    manualFilter: true,
    messages: [...BASE_MESSAGES, "title", "header", "footer", ...MANUAL_MESSAGES],
    extras: ["line_break", "Recipients"]
  },
  json: {
    adapter: "none",
    manualFilter: false,
    messages: ["all", "removeAll"],
    extras: ["parse"]
  },
  history: {
    adapter: "none",
    manualFilter: false,
    messages: ["new", "remove"],
    extras: ["allinOne"]
  }
};
function flatEntryToModel(service, flat) {
  var _a, _b, _c;
  const caps = SERVICE_CAPS[service];
  const entry = {
    providers: {
      dwd: !!flat[`${service}_DwdEnabled`],
      uwz: !!flat[`${service}_UwzEnabled`],
      zamg: !!flat[`${service}_ZamgEnabled`],
      // NINA came later: a missing key (older configs) counts as enabled
      nina: flat[`${service}_NinaEnabled`] !== false
    },
    filter: {
      auto: {
        type: flat[`${service}_TypeFilter`] || [],
        level: (_a = flat[`${service}_LevelFilter`]) != null ? _a : 0
      }
    },
    messages: {},
    extras: {}
  };
  if (caps.adapter === "single") {
    entry.adapter = (_b = flat[`${service}_Adapter`]) != null ? _b : "none";
  } else if (caps.adapter === "array") {
    entry.adapters = flat[`${service}_Adapter_Array`] || [];
  }
  if (caps.manualFilter) {
    entry.filter.manual = {
      type: flat[`${service}_ManualTypeFilter`] || [],
      level: (_c = flat[`${service}_ManualLevelFilter`]) != null ? _c : 0
    };
  }
  for (const key of caps.messages) {
    const v = flat[`${service}_${MESSAGE_SUFFIX[key]}`];
    if (v !== void 0) {
      entry.messages[key] = v;
    }
  }
  for (const suffix of caps.extras) {
    const v = flat[`${service}_${suffix}`];
    if (v !== void 0) {
      entry.extras[suffix] = v;
    }
  }
  return entry;
}
function modelEntryToFlat(service, entry) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  const caps = SERVICE_CAPS[service];
  const flat = {};
  flat[`${service}_DwdEnabled`] = !!((_a = entry.providers) == null ? void 0 : _a.dwd);
  flat[`${service}_UwzEnabled`] = !!((_b = entry.providers) == null ? void 0 : _b.uwz);
  flat[`${service}_ZamgEnabled`] = !!((_c = entry.providers) == null ? void 0 : _c.zamg);
  flat[`${service}_NinaEnabled`] = ((_d = entry.providers) == null ? void 0 : _d.nina) !== false;
  flat[`${service}_TypeFilter`] = (_g = (_f = (_e = entry.filter) == null ? void 0 : _e.auto) == null ? void 0 : _f.type) != null ? _g : [];
  flat[`${service}_LevelFilter`] = (_j = (_i = (_h = entry.filter) == null ? void 0 : _h.auto) == null ? void 0 : _i.level) != null ? _j : 0;
  if (caps.adapter === "single") {
    flat[`${service}_Adapter`] = (_k = entry.adapter) != null ? _k : "none";
  } else if (caps.adapter === "array") {
    flat[`${service}_Adapter_Array`] = (_l = entry.adapters) != null ? _l : [];
  }
  if (caps.manualFilter) {
    flat[`${service}_ManualTypeFilter`] = (_o = (_n = (_m = entry.filter) == null ? void 0 : _m.manual) == null ? void 0 : _n.type) != null ? _o : [];
    flat[`${service}_ManualLevelFilter`] = (_r = (_q = (_p = entry.filter) == null ? void 0 : _p.manual) == null ? void 0 : _q.level) != null ? _r : 0;
  }
  for (const key of caps.messages) {
    const v = (_s = entry.messages) == null ? void 0 : _s[key];
    if (v !== void 0) {
      flat[`${service}_${MESSAGE_SUFFIX[key]}`] = v;
    }
  }
  for (const suffix of caps.extras) {
    const v = (_t = entry.extras) == null ? void 0 : _t[suffix];
    if (v !== void 0) {
      flat[`${service}_${suffix}`] = v;
    }
  }
  return flat;
}
function flatConfigToModel(flat) {
  const model = {};
  for (const service of SERVICE_TYPES) {
    model[service] = flatEntryToModel(service, flat);
  }
  return model;
}
function modelToFlatConfig(model) {
  const flat = {};
  if (!model) {
    return flat;
  }
  for (const service of SERVICE_TYPES) {
    const entry = model[service];
    if (entry) {
      Object.assign(flat, modelEntryToFlat(service, entry));
    }
  }
  return flat;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MESSAGE_SUFFIX,
  SERVICE_CAPS,
  SERVICE_TYPES,
  flatConfigToModel,
  flatEntryToModel,
  modelEntryToFlat,
  modelToFlatConfig
});
//# sourceMappingURL=notificationServicesModel.js.map
