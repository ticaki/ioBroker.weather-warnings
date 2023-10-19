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
  customFormatedTokensJson: () => customFormatedTokensJson,
  dwdLevel: () => dwdLevel,
  genericCombinedWarntype: () => genericCombinedWarntype,
  genericWarntyp: () => genericWarntyp,
  genericWarntypState: () => genericWarntypState,
  isKeyOfObject: () => isKeyOfObject,
  level: () => level,
  status: () => status,
  textLevels: () => textLevels,
  warnTypeName: () => warnTypeName
});
module.exports = __toCommonJS(messages_def_exports);
const customFormatedTokensJson = {
  starttime: "Start time",
  startdate: "Start date",
  endtime: "End time",
  enddate: "End Date",
  startdayofweek: "Start day of the week",
  enddayofweek: "End day of the week",
  startdayofweekshort: "Start day of the week short",
  enddayofweekshort: "End day of the week short",
  headline: "Headline",
  description: "Description",
  weathertext: "Weathertext",
  ceiling: "Maximum validity height",
  altitude: "Minimum validity height",
  warnlevelname: "Textname of level",
  warnlevelnumber: "Number of level",
  warnlevelcolorname: "Textname of level color",
  warnlevelcolorhex: "Hexnumber of level color",
  warntypename: "Warning type retrieved from the provider",
  warntypegenericname: "Warntype generic",
  location: "Location retrieved from the provider",
  instruction: "Instructions",
  provider: "Provider",
  locationcustom: "Location from admin configuration",
  countdown: "Remaining time until the start of the warning.",
  status: "Status of warning. new, hold, all clear",
  starttimems: "Start time in ms",
  endtimems: "End Time in ms",
  iconurl: "Url to Icon"
};
const textLevels = {
  textGeneric: {
    "0": "textLevels.textGeneric.0",
    "1": "textLevels.textGeneric.1",
    "2": "textLevels.textGeneric.2",
    "3": "textLevels.textGeneric.3",
    "4": "textLevels.textGeneric.4",
    "5": "textLevels.textGeneric.5"
  }
};
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
    "0": "color.textGeneric.0",
    "1": "color.textGeneric.1",
    "2": "color.textGeneric.2",
    "3": "color.textGeneric.3",
    "4": "color.textGeneric.4",
    "5": "color.textGeneric.5"
  }
};
const genericWarntypState = {
  level: {
    _id: "",
    type: "state",
    common: {
      name: "genericWarntypState.level",
      type: "number",
      role: "",
      read: true,
      write: false
    },
    native: {}
  },
  start: {
    _id: "",
    type: "state",
    common: {
      name: "genericWarntypState.start",
      type: "string",
      role: "date",
      read: true,
      write: false
    },
    native: {}
  },
  end: {
    _id: "",
    type: "state",
    common: {
      name: "genericWarntypState.end",
      type: "string",
      role: "date",
      read: true,
      write: false
    },
    native: {}
  },
  headline: {
    _id: "",
    type: "state",
    common: {
      name: "genericWarntypState.headline",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  },
  type: {
    _id: "",
    type: "state",
    common: {
      name: "genericWarntypState.type",
      type: "number",
      role: "value",
      read: true,
      write: false
    },
    native: {}
  },
  active: {
    _id: "",
    type: "state",
    common: {
      name: "genericWarntypState.active",
      type: "boolean",
      role: "indicator",
      read: true,
      write: false
    },
    native: {}
  }
};
function isKeyOfObject(key, obj) {
  return key in obj;
}
const genericCombinedWarntype = {
  "0": { dwdService: ["22", "82"], uwzService: ["5", "10", "11"], zamgService: ["7"], id: "cold", name: "noname" },
  "1": {
    dwdService: ["24", "84", "85", "87"],
    uwzService: ["8"],
    zamgService: ["4"],
    id: "black_ice_slippery",
    name: "noname"
  },
  "2": {
    dwdService: ["31", "33", "34", "36", "38", "90", "91", "92", "93"],
    uwzService: ["7"],
    zamgService: ["5"],
    id: "thunderstorm",
    name: "noname"
  },
  "3": { dwdService: ["40", "41"], id: "storm, thunderstorm", name: "noname" },
  "4": { dwdService: ["42"], id: "rain, thunderstorm", name: "noname" },
  "5": { dwdService: ["44", "45"], id: "storm, rain, thunderstorm", name: "noname" },
  "6": { dwdService: ["46", "95"], id: "rain, thunderstorm, hail", name: "noname" },
  "7": { dwdService: ["48", "49", "96"], id: "storm, rain, thunderstorm, hail", name: "noname" },
  "8": {
    dwdService: ["51", "52", "53", "54", "55", "56", "57", "58", "79"],
    uwzService: ["2"],
    zamgService: ["1"],
    id: "storm",
    name: "noname"
  },
  "9": { dwdService: ["59"], id: "fog", name: "noname" },
  "10": {
    dwdService: ["61", "62", "63", "64", "65", "66"],
    uwzService: ["4"],
    zamgService: ["2"],
    id: "rain",
    name: "noname"
  },
  "11": {
    dwdService: ["70", "71", "72", "73", "74", "75", "76"],
    uwzService: ["3"],
    zamgService: ["3"],
    id: "snowfall",
    name: "noname"
  },
  "12": { dwdService: ["88", "89"], id: "thaw", name: "noname" },
  "13": { dwdService: ["247", "248"], uwzService: ["9"], zamgService: ["6"], id: "heat", name: "noname" },
  "14": { uwzService: ["0", "1"], zamgService: ["0", "8"], id: "unknown", name: "noname" },
  "15": { uwzService: ["6"], id: "forest_fire", name: "noname" }
};
const genericWarntyp = {
  "1": { name: "genericWarntyp.1.name", id: "unknown", dwdService: [], uwzService: [0, 1], zamgService: [0, 8] },
  "2": {
    name: "genericWarntyp.2.name",
    id: "storm",
    dwdService: [40, 41, 44, 45, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 96, 79],
    uwzService: [2],
    zamgService: [1]
  },
  "3": {
    name: "genericWarntyp.3.name",
    id: "snowfall",
    dwdService: [70, 71, 72, 73, 74, 75, 76],
    uwzService: [3],
    zamgService: [3]
  },
  "4": {
    name: "genericWarntyp.4.name",
    id: "rain",
    dwdService: [96, 95, 66, 65, 64, 63, 62, 61, 49, 48, 46, 45, 44, 42],
    uwzService: [4],
    zamgService: [2]
  },
  "5": { name: "genericWarntyp.5.name", id: "cold", dwdService: [82, 22], uwzService: [10, 11, 5], zamgService: [7] },
  "6": { name: "genericWarntyp.6.name", id: "forest_fire", dwdService: [], uwzService: [6], zamgService: [] },
  "7": {
    name: "genericWarntyp.7.name",
    id: "thunderstorm",
    dwdService: [90, 91, 92, 93, 95, 96, 31, 33, 34, 36, 38, 40, 41, 42, 44, 45, 46, 48, 49],
    uwzService: [7],
    zamgService: [5]
  },
  "8": {
    name: "genericWarntyp.8.name",
    id: "black_ice_slippery",
    dwdService: [87, 85, 84, 24],
    uwzService: [8],
    zamgService: [4]
  },
  "9": { name: "genericWarntyp.9.name", id: "heat", dwdService: [247, 248], uwzService: [9], zamgService: [6] },
  "10": {
    name: "genericWarntyp.10.name",
    id: "hail",
    dwdService: [95, 96, 46, 48, 49],
    uwzService: [],
    zamgService: []
  },
  "11": { name: "genericWarntyp.11.name", id: "fog", dwdService: [59], uwzService: [], zamgService: [] },
  "12": { name: "genericWarntyp.12.name", id: "thaw", dwdService: [88, 89], uwzService: [], zamgService: [] }
};
const warnTypeName = {
  uwzService: {
    "0": "warnTypeName.uwzService.0",
    "1": "warnTypeName.uwzService.1",
    "2": "warnTypeName.uwzService.2",
    "3": "warnTypeName.uwzService.3",
    "4": "warnTypeName.uwzService.4",
    "5": "warnTypeName.uwzService.5",
    "6": "warnTypeName.uwzService.6",
    "7": "warnTypeName.uwzService.7",
    "8": "warnTypeName.uwzService.8",
    "9": "warnTypeName.uwzService.9",
    "10": "warnTypeName.uwzService.10",
    "11": "warnTypeName.uwzService.11"
  },
  zamgService: {
    "0": "warnTypeName.zamgService.0",
    "1": "warnTypeName.zamgService.1",
    "2": "warnTypeName.zamgService.2",
    "3": "warnTypeName.zamgService.3",
    "4": "warnTypeName.zamgService.4",
    "5": "warnTypeName.zamgService.5",
    "6": "warnTypeName.zamgService.6",
    "7": "warnTypeName.zamgService.7",
    "8": "warnTypeName.zamgService.8"
  },
  dwdService: {
    "22": "warnTypeName.dwdService.22",
    "24": "warnTypeName.dwdService.24",
    "31": "warnTypeName.dwdService.31",
    "33": "warnTypeName.dwdService.33",
    "34": "warnTypeName.dwdService.34",
    "36": "warnTypeName.dwdService.36",
    "38": "warnTypeName.dwdService.38",
    "40": "warnTypeName.dwdService.40",
    "41": "warnTypeName.dwdService.41",
    "42": "warnTypeName.dwdService.42",
    "44": "warnTypeName.dwdService.44",
    "45": "warnTypeName.dwdService.45",
    "46": "warnTypeName.dwdService.46",
    "48": "warnTypeName.dwdService.48",
    "49": "warnTypeName.dwdService.49",
    "51": "warnTypeName.dwdService.51",
    "52": "warnTypeName.dwdService.52",
    "53": "warnTypeName.dwdService.53",
    "54": "warnTypeName.dwdService.54",
    "55": "warnTypeName.dwdService.55",
    "56": "warnTypeName.dwdService.56",
    "57": "warnTypeName.dwdService.57",
    "58": "warnTypeName.dwdService.58",
    "59": "warnTypeName.dwdService.59",
    "61": "warnTypeName.dwdService.61",
    "62": "warnTypeName.dwdService.62",
    "63": "warnTypeName.dwdService.63",
    "64": "warnTypeName.dwdService.64",
    "65": "warnTypeName.dwdService.65",
    "66": "warnTypeName.dwdService.66",
    "70": "warnTypeName.dwdService.70",
    "71": "warnTypeName.dwdService.71",
    "72": "warnTypeName.dwdService.72",
    "73": "warnTypeName.dwdService.73",
    "74": "warnTypeName.dwdService.74",
    "75": "warnTypeName.dwdService.75",
    "76": "warnTypeName.dwdService.76",
    "79": "warnTypeName.dwdService.79",
    "82": "warnTypeName.dwdService.82",
    "84": "warnTypeName.dwdService.84",
    "85": "warnTypeName.dwdService.85",
    "87": "warnTypeName.dwdService.87",
    "88": "warnTypeName.dwdService.88",
    "89": "warnTypeName.dwdService.89",
    "90": "warnTypeName.dwdService.90",
    "91": "warnTypeName.dwdService.91",
    "92": "warnTypeName.dwdService.92",
    "93": "warnTypeName.dwdService.93",
    "95": "warnTypeName.dwdService.95",
    "96": "warnTypeName.dwdService.96",
    "98": "warnTypeName.dwdService.98",
    "99": "warnTypeName.dwdService.99",
    "247": "warnTypeName.dwdService.247",
    "248": "warnTypeName.dwdService.248"
  }
};
const level = {
  uwz: { green: 0, darkgreen: 0, yellow: 1, orange: 2, red: 3, violet: 4 }
};
const dwdLevel = { minor: 1, moderate: 2, severe: 3, extreme: 4 };
const status = {
  new: "message.status.new",
  hold: "message.status.hold",
  clear: "message.status.clear"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  color,
  customFormatedTokensJson,
  dwdLevel,
  genericCombinedWarntype,
  genericWarntyp,
  genericWarntypState,
  isKeyOfObject,
  level,
  status,
  textLevels,
  warnTypeName
});
//# sourceMappingURL=messages-def.js.map
