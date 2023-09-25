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
var messages_def_exports = {};
__export(messages_def_exports, {
  color: () => color,
  dwdLevel: () => dwdLevel,
  level: () => level,
  warnTypeName: () => warnTypeName
});
module.exports = __toCommonJS(messages_def_exports);
const color = {
  generic: {
    0: `#00ff00`,
    1: `#00ff00`,
    2: `#fffc04`,
    3: `#ffb400`,
    4: `#ff0000`,
    5: `#ff00ff`
  },
  zamgColor: {
    0: `#00ff00`,
    1: `#00ff00`,
    2: `#01DF3A`,
    3: `#ffc400`,
    4: `#ff0404`
  },
  textGeneric: {
    0: "green",
    1: "dark green",
    2: "yellow",
    3: "orange",
    4: "red",
    5: "violet"
  }
};
const warnTypeName = {
  zamgService: {
    0: `unbekannt1`,
    1: `Sturm`,
    2: `Regen`,
    3: `Schnee`,
    4: `Glatteis`,
    5: `Gewitter`,
    6: `Hitze`,
    7: `K\xE4lte`,
    8: `unbekannt2`
  }
};
const level = {
  uwz: { green: 0, darkgreen: 0, yellow: 1, orange: 2, red: 3, violet: 4 }
};
const dwdLevel = { minor: 1, moderate: 2, severe: 3, extreme: 4 };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  color,
  dwdLevel,
  level,
  warnTypeName
});
//# sourceMappingURL=messages-def.js.map
