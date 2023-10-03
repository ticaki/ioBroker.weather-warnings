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
  genericWarntyp: () => genericWarntyp,
  genericWarntypState: () => genericWarntypState,
  isKeyOfObject: () => isKeyOfObject,
  level: () => level,
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
  countdown: "Remaining time until the start of the warning."
};
const textLevels = {
  textGeneric: {
    "0": {
      en: "none",
      de: "keiner",
      ru: "\u043D\u0438\u043A\u0442\u043E",
      pt: "nenhum",
      nl: "geen",
      fr: "aucun",
      it: "nessuno",
      es: "ninguno",
      pl: "nic",
      uk: "\u043D\u0435\u043C\u0430\u0454",
      "zh-cn": "\u6CA1\u6709\u4EFB\u4F55"
    },
    "1": {
      en: "minor",
      de: "unerheblich",
      ru: "\u043D\u0435\u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439",
      pt: "menor",
      nl: "minderjarige",
      fr: "mineure",
      it: "minore",
      es: "menor",
      pl: "drobny",
      uk: "\u0434\u0440\u0443\u0433\u043E\u0440\u044F\u0434\u043D\u0438\u0439",
      "zh-cn": "\u6B21\u8981\u7684"
    },
    "2": {
      en: "moderate",
      de: "m\xE4\xDFig",
      ru: "\u0443\u043C\u0435\u0440\u0435\u043D\u043D\u044B\u0439",
      pt: "moderado",
      nl: "gematigd",
      fr: "mod\xE9r\xE9",
      it: "moderare",
      es: "moderado",
      pl: "umiarkowany",
      uk: "\u043F\u043E\u043C\u0456\u0440\u043D\u0438\u0439",
      "zh-cn": "\u7F13\u548C"
    },
    "3": {
      en: "severe",
      de: "schwer",
      ru: "\u0441\u0435\u0440\u044C\u0435\u0437\u043D\u044B\u0439",
      pt: "forte",
      nl: "streng",
      fr: "grave",
      it: "acuto",
      es: "severo",
      pl: "ci\u0119\u017Cki : silny",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0438\u0439",
      "zh-cn": "\u4E25\u91CD"
    },
    "4": {
      en: "extreme",
      de: "extrem",
      ru: "\u043A\u0440\u0430\u0439\u043D\u0438\u0439",
      pt: "extremo",
      nl: "extreem",
      fr: "extr\xEAme",
      it: "estremo",
      es: "extremo",
      pl: "skrajny",
      uk: "\u0435\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u044C\u043D\u0438\u0439",
      "zh-cn": "\u6781\u7AEF"
    },
    "5": {
      en: "terrible",
      de: "schrecklich",
      ru: "\u0443\u0436\u0430\u0441\u043D\u044B\u0439",
      pt: "Terr\xEDvel",
      nl: "vreselijk",
      fr: "terrible",
      it: "terribile",
      es: "horrible",
      pl: "straszny",
      uk: "\u0436\u0430\u0445\u043B\u0438\u0432\u0438\u0439",
      "zh-cn": "\u7CDF\u7CD5\u7684"
    }
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
    "0": {
      en: "green",
      de: "gr\xFCn",
      ru: "\u0437\u0435\u043B\u0435\u043D\u044B\u0439",
      pt: "verde",
      nl: "groente",
      fr: "vert",
      it: "verde",
      es: "verde",
      pl: "zielony",
      uk: "\u0437\u0435\u043B\u0435\u043D\u0438\u0439",
      "zh-cn": "\u7EFF\u8272\u7684"
    },
    "1": {
      en: "dark green",
      de: "dunkelgr\xFCn",
      ru: "\u0442\u0435\u043C\u043D\u043E-\u0437\u0435\u043B\u0435\u043D\u044B\u0439",
      pt: "verde escuro",
      nl: "donkergroen",
      fr: "vert fonc\xE9",
      it: "verde scuro",
      es: "verde oscuro",
      pl: "ciemnozielony",
      uk: "\u0442\u0435\u043C\u043D\u043E-\u0437\u0435\u043B\u0435\u043D\u0438\u0439",
      "zh-cn": "\u6DF1\u7EFF\u8272"
    },
    "2": {
      en: "yellow",
      de: "gelb",
      ru: "\u0436\u0435\u043B\u0442\u044B\u0439",
      pt: "amarelo",
      nl: "geel",
      fr: "jaune",
      it: "giallo",
      es: "amarillo",
      pl: "\u017C\xF3\u0142ty",
      uk: "\u0436\u043E\u0432\u0442\u0438\u0439",
      "zh-cn": "\u9EC4\u8272\u7684"
    },
    "3": {
      en: "orange",
      de: "orange",
      ru: "\u0430\u043F\u0435\u043B\u044C\u0441\u0438\u043D",
      pt: "laranja",
      nl: "oranje",
      fr: "orange",
      it: "arancia",
      es: "naranja",
      pl: "pomara\u0144czowy",
      uk: "\u043F\u043E\u043C\u0430\u0440\u0430\u043D\u0447\u0435\u0432\u0438\u0439",
      "zh-cn": "\u6A59\u5B50"
    },
    "4": {
      en: "red",
      de: "rot",
      ru: "\u043A\u0440\u0430\u0441\u043D\u044B\u0439",
      pt: "vermelho",
      nl: "rood",
      fr: "rouge",
      it: "rosso",
      es: "rojo",
      pl: "czerwony",
      uk: "\u0447\u0435\u0440\u0432\u043E\u043D\u0438\u0439",
      "zh-cn": "\u7EA2\u8272\u7684"
    },
    "5": {
      en: "violet",
      de: "violett",
      ru: "\u0444\u0438\u043E\u043B\u0435\u0442\u043E\u0432\u044B\u0439",
      pt: "tolet",
      nl: "paars",
      fr: "violet",
      it: "viola",
      es: "violeta",
      pl: "fioletowy",
      uk: "\u0444\u0456\u043E\u043B\u0435\u0442\u043E\u0432\u0438\u0439",
      "zh-cn": "\u7D2B\u8272"
    }
  }
};
const genericWarntypState = {
  level: {
    _id: "",
    type: "state",
    common: {
      name: "Level of warning as number",
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
      name: "Start time of warning",
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
      name: "End time of warning",
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
      name: "Headline of warning.",
      type: "string",
      role: "",
      read: true,
      write: false
    },
    native: {}
  },
  type: {
    _id: "",
    type: "state",
    common: {
      name: "Warntype as number.",
      type: "number",
      role: "",
      read: true,
      write: false
    },
    native: {}
  },
  active: {
    _id: "",
    type: "state",
    common: {
      name: "Now is between start and end.",
      type: "boolean",
      role: "",
      read: true,
      write: false
    },
    native: {}
  }
};
function isKeyOfObject(key, obj) {
  return key in obj;
}
const genericWarntyp = {
  1: {
    name: "unknown",
    id: "unknown",
    dwdService: [],
    uwzService: [0, 1],
    zamgService: [0, 8]
  },
  2: {
    name: "storm",
    id: "storm",
    dwdService: [40, 41, 44, 45, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 96, 79],
    uwzService: [2],
    zamgService: [1]
  },
  4: {
    name: "rain",
    id: "rain",
    dwdService: [96, 95, 66, 65, 64, 63, 62, 61, 59, 49, 48, 46, 45, 44, 42],
    uwzService: [4],
    zamgService: [2]
  },
  3: {
    name: "snowfall",
    id: "snowfall",
    dwdService: [70, 71, 72, 73, 74, 75, 76],
    uwzService: [3],
    zamgService: [3]
  },
  5: {
    name: "cold",
    id: "cold",
    dwdService: [82, 22],
    uwzService: [10, 11, 5],
    zamgService: [7]
  },
  6: {
    name: "forest fire",
    id: "forest_fire",
    dwdService: [],
    uwzService: [6],
    zamgService: []
  },
  7: {
    name: "thunderstorm",
    id: "thunderstorm",
    dwdService: [90, 91, 92, 93, 95, 96, 31, 33, 34, 36, 38, 40, 41, 42, 44, 45, 46, 48, 49],
    uwzService: [7],
    zamgService: [5]
  },
  8: {
    name: "black ice/slippery",
    id: "black_ice_slippery",
    dwdService: [87, 85, 84, 24],
    uwzService: [8],
    zamgService: [4]
  },
  9: {
    name: "heat",
    id: "heat",
    dwdService: [247, 248],
    uwzService: [9],
    zamgService: [6]
  },
  10: {
    name: "hail",
    id: "hail",
    dwdService: [95, 96, 45, 46, 48, 49],
    uwzService: [],
    zamgService: []
  },
  11: {
    name: "fog",
    id: "fog",
    dwdService: [59],
    uwzService: [],
    zamgService: []
  },
  12: {
    name: "thaw",
    id: "thaw",
    dwdService: [88, 89],
    uwzService: [],
    zamgService: []
  }
};
const warnTypeName = {
  uwzService: {
    "0": {
      en: "n_a",
      de: "n/A",
      ru: "\u043D\u0435\u0442",
      pt: "n/D",
      nl: "n_a",
      fr: "n/A",
      it: "n/a",
      es: "n/A",
      pl: "nie",
      uk: "n_a",
      "zh-cn": "\u4E0D\u5B58\u5728"
    },
    "1": {
      en: "unknown",
      de: "Unbekannt",
      ru: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439",
      pt: "Desconhecido",
      nl: "Onbekend",
      fr: "Inconnu",
      it: "Sconosciuto",
      es: "Desconocido",
      pl: "Nieznany",
      uk: "\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0438\u0439",
      "zh-cn": "\u672A\u77E5"
    },
    "2": {
      en: "Storm",
      de: "Sturm",
      ru: "\u0411\u0443\u0440\u044F",
      pt: "Tempestade",
      nl: "Storm",
      fr: "Temp\xEAte",
      it: "Tempesta",
      es: "Tormenta",
      pl: "Burza",
      uk: "\u0411\u0443\u0440\u044F",
      "zh-cn": "\u98CE\u66B4"
    },
    "3": {
      en: "Snowfall",
      de: "Schneefall",
      ru: "\u0421\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
      pt: "Queda de neve",
      nl: "Sneeuwval",
      fr: "Chute de neige",
      it: "Nevicata",
      es: "Nevada",
      pl: "Opady \u015Bniegu",
      uk: "\u0421\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
      "zh-cn": "\u964D\u96EA"
    },
    "4": {
      en: "Heavy rain",
      de: "Starkregen",
      ru: "\u041B\u0438\u0432\u0435\u043D\u044C",
      pt: "Chuva pesada",
      nl: "Zware regen",
      fr: "Forte pluie",
      it: "Pioggia forte",
      es: "Lluvia Pesada",
      pl: "Ulewa",
      uk: "\u0421\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u043E\u0449",
      "zh-cn": "\u503E\u76C6\u5927\u96E8"
    },
    "5": {
      en: "Extreme frost",
      de: "Extremer Frost",
      ru: "\u042D\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u043C\u043E\u0440\u043E\u0437",
      pt: "Geada extrema",
      nl: "Extreme vorst",
      fr: "Gel extr\xEAme",
      it: "Gelo estremo",
      es: "heladas extremas",
      pl: "Ekstremalny mr\xF3z",
      uk: "\u0421\u0438\u043B\u044C\u043D\u0438\u0439 \u043C\u043E\u0440\u043E\u0437",
      "zh-cn": "\u6781\u5EA6\u971C\u51BB"
    },
    "6": {
      en: "Danger of forest fire",
      de: "Waldbrandgefahr",
      ru: "\u041E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u043B\u0435\u0441\u043D\u043E\u0433\u043E \u043F\u043E\u0436\u0430\u0440\u0430",
      pt: "Perigo de inc\xEAndio florestal",
      nl: "Gevaar voor bosbrand",
      fr: "Risque d'incendie de for\xEAt",
      it: "Pericolo di incendio boschivo",
      es: "Peligro de incendio forestal",
      pl: "Niebezpiecze\u0144stwo po\u017Caru lasu",
      uk: "\u041D\u0435\u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u043B\u0456\u0441\u043E\u0432\u0438\u0445 \u043F\u043E\u0436\u0435\u0436",
      "zh-cn": "\u68EE\u6797\u706B\u707E\u7684\u5371\u9669"
    },
    "7": {
      en: "Thunderstorm",
      de: "Gewitter",
      ru: "\u0413\u0440\u043E\u0437\u0430",
      pt: "Trovoada",
      nl: "Onweersbui",
      fr: "Orage",
      it: "Temporale",
      es: "Tormenta",
      pl: "Burza z piorunami",
      uk: "\u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u96F7\u96E8"
    },
    "8": {
      en: "Slippery",
      de: "Rutschig",
      ru: "\u0421\u043A\u043E\u043B\u044C\u0437\u043A\u0438\u0439",
      pt: "Escorregadio",
      nl: "Glad",
      fr: "Glissant",
      it: "Scivoloso",
      es: "Resbaladizo",
      pl: "\u015Aliski",
      uk: "\u0421\u043B\u0438\u0437\u044C\u043A\u0438\u0439",
      "zh-cn": "\u6ED1"
    },
    "9": {
      en: "Heat",
      de: "Hitze",
      ru: "\u041D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u044C",
      pt: "Aquecer",
      nl: "Warmte",
      fr: "Chaleur",
      it: "Calore",
      es: "Calor",
      pl: "Ciep\u0142o",
      uk: "\u0422\u0435\u043F\u043B\u043E",
      "zh-cn": "\u70ED"
    },
    "10": {
      en: "Freezing rain",
      de: "Gefrierender Regen",
      ru: "\u041B\u0435\u0434\u044F\u043D\u043E\u0439 \u0434\u043E\u0436\u0434\u044C",
      pt: "Chuva congelante",
      nl: "Ijskoude regen",
      fr: "Pluie vergla\xE7ante",
      it: "Grandine",
      es: "Lluvia helada",
      pl: "Marzn\u0105cy deszcz",
      uk: "\u041A\u0440\u0438\u0436\u0430\u043D\u0438\u0439 \u0434\u043E\u0449",
      "zh-cn": "\u51BB\u96E8"
    },
    "11": {
      en: "Ground frost",
      de: "Bodenfrost",
      ru: "\u041C\u043E\u0440\u043E\u0437\u043D\u044B\u0439 \u0438\u043D\u0435\u0439",
      pt: "Geada terrestre",
      nl: "Grondvorst",
      fr: "Gel au sol",
      it: "Gelo terrestre",
      es: "Escarcha en el suelo",
      pl: "Przymrozek",
      uk: "\u0413\u0440\u0443\u043D\u0442\u043E\u0432\u0430 \u0437\u0430\u043C\u043E\u0440\u043E\u0437\u043A\u0430",
      "zh-cn": "\u5730\u9762\u971C"
    }
  },
  zamgService: {
    "0": {
      en: "Unknown",
      de: "Unbekannt",
      ru: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439",
      pt: "Desconhecido",
      nl: "Onbekend",
      fr: "Inconnu",
      it: "Sconosciuto",
      es: "Desconocido",
      pl: "Nieznany",
      uk: "\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0438\u0439",
      "zh-cn": "\u672A\u77E5"
    },
    "1": {
      en: "Storm",
      de: "Sturm",
      ru: "\u0411\u0443\u0440\u044F",
      pt: "Tempestade",
      nl: "Storm",
      fr: "Temp\xEAte",
      it: "Tempesta",
      es: "Tormenta",
      pl: "Burza",
      uk: "\u0411\u0443\u0440\u044F",
      "zh-cn": "\u98CE\u66B4"
    },
    "2": {
      en: "Rain",
      de: "Regen",
      ru: "\u0414\u043E\u0436\u0434\u044C",
      pt: "Chuva",
      nl: "Regen",
      fr: "Pluie",
      it: "Piovere",
      es: "Lluvia",
      pl: "Deszcz",
      uk: "\u0414\u043E\u0449",
      "zh-cn": "\u96E8"
    },
    "3": {
      en: "Snow",
      de: "Schnee",
      ru: "\u0421\u043D\u0435\u0433",
      pt: "Neve",
      nl: "Sneeuw",
      fr: "Neige",
      it: "Nevicare",
      es: "Nieve",
      pl: "\u015Anieg",
      uk: "\u0441\u043D\u0456\u0433",
      "zh-cn": "\u96EA"
    },
    "4": {
      en: "Black ice",
      de: "Glatteis",
      ru: "\u0427\u0435\u0440\u043D\u044B\u0439 \u043B\u0435\u0434",
      pt: "Gelo preto",
      nl: "Zwart ijs",
      fr: "Glace noir",
      it: "Ghiaccio nero",
      es: "Hielo negro",
      pl: "Czarny l\xF3d",
      uk: "\u0427\u043E\u0440\u043D\u0438\u0439 \u043B\u0456\u0434",
      "zh-cn": "\u9ED1\u51B0"
    },
    "5": {
      en: "Thunderstorm",
      de: "Gewitter",
      ru: "\u0413\u0440\u043E\u0437\u0430",
      pt: "Trovoada",
      nl: "Onweersbui",
      fr: "Orage",
      it: "Temporale",
      es: "Tormenta",
      pl: "Burza z piorunami",
      uk: "\u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u96F7\u96E8"
    },
    "6": {
      en: "Heat",
      de: "Hitze",
      ru: "\u041D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u044C",
      pt: "Aquecer",
      nl: "Warmte",
      fr: "Chaleur",
      it: "Calore",
      es: "Calor",
      pl: "Ciep\u0142o",
      uk: "\u0422\u0435\u043F\u043B\u043E",
      "zh-cn": "\u70ED"
    },
    "7": {
      en: "Cold",
      de: "K\xE4lte",
      ru: "\u0425\u043E\u043B\u043E\u0434\u043D\u044B\u0439",
      pt: "Frio",
      nl: "Koud",
      fr: "Froid",
      it: "Freddo",
      es: "Fr\xEDo",
      pl: "Zimno",
      uk: "\u0425\u043E\u043B\u043E\u0434\u043D\u0438\u0439",
      "zh-cn": "\u5BD2\u51B7\u7684"
    },
    "8": {
      en: "Unknown",
      de: "Unbekannt",
      ru: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439",
      pt: "Desconhecido",
      nl: "Onbekend",
      fr: "Inconnu",
      it: "Sconosciuto",
      es: "Desconocido",
      pl: "Nieznany",
      uk: "\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0438\u0439",
      "zh-cn": "\u672A\u77E5"
    }
  },
  dwdService: {
    "22": {
      en: "frost",
      de: "Frost",
      ru: "\u043C\u043E\u0440\u043E\u0437",
      pt: "geada",
      nl: "vorst",
      fr: "gel",
      it: "gelo",
      es: "escarcha",
      pl: "mr\xF3z",
      uk: "\u043C\u043E\u0440\u043E\u0437",
      "zh-cn": "\u971C"
    },
    "24": {
      en: "Slightly slippery",
      de: "geringf\xFCgige Gl\xE4tte",
      ru: "\u041D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u043A\u043E\u043B\u044C\u0437\u043A\u0438\u0439",
      pt: "Um pouco escorregadio",
      nl: "Enigszins glad",
      fr: "L\xE9g\xE8rement glissant",
      it: "Leggermente scivoloso",
      es: "Ligeramente resbaladizo",
      pl: "Lekko \u015Bliskie",
      uk: "\u0422\u0440\u043E\u0445\u0438 \u0441\u043B\u0438\u0437\u044C\u043A\u0438\u0439",
      "zh-cn": "\u6709\u70B9\u6ED1"
    },
    "31": {
      en: "thunderstorm",
      de: "Gewitter",
      ru: "\u0433\u0440\u043E\u0437\u0430",
      pt: "trovoada",
      nl: "onweersbui",
      fr: "orage",
      it: "temporale",
      es: "tormenta",
      pl: "burza z piorunami",
      uk: "\u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u96F7\u96E8"
    },
    "33": {
      en: "severe thunderstorm",
      de: "starkes Gewitter",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
      pt: "tempestade severa",
      nl: "zware onweersbui",
      fr: "orage violent",
      it: "forte temporale",
      es: "tormenta severa",
      pl: "Ci\u0119\u017Cka burza",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4"
    },
    "34": {
      en: "severe thunderstorm",
      de: "starkes Gewitter",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
      pt: "tempestade severa",
      nl: "zware onweersbui",
      fr: "orage violent",
      it: "forte temporale",
      es: "tormenta severa",
      pl: "Ci\u0119\u017Cka burza",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4"
    },
    "36": {
      en: "severe thunderstorm",
      de: "starkes Gewitter ",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
      pt: "tempestade severa",
      nl: "zware onweersbui",
      fr: "orage violent",
      it: "forte temporale",
      es: "tormenta severa",
      pl: "Ci\u0119\u017Cka burza",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4"
    },
    "38": {
      en: "severe thunderstorm",
      de: "starkes Gewitter",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
      pt: "tempestade severa",
      nl: "zware onweersbui",
      fr: "orage violent",
      it: "forte temporale",
      es: "tormenta severa",
      pl: "Ci\u0119\u017Cka burza",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4"
    },
    "40": {
      en: "severe thunderstorm with gale-force winds",
      de: "schweres Gewitter mit Orkanb\xF6en",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C",
      pt: "forte tempestade com ventos fortes",
      nl: "zware onweersbui met harde wind",
      fr: "orage violent avec des vents violents",
      it: "forte temporale con venti di burrasca",
      es: "tormenta fuerte con vientos huracanados",
      pl: "silna burza z porywistym wiatrem",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437\u0456 \u0448\u043A\u0432\u0430\u043B\u0438\u0441\u0442\u0438\u043C \u0432\u0456\u0442\u0440\u043E\u043C",
      "zh-cn": "\u4F34\u6709\u5927\u98CE\u7684\u4E25\u91CD\u96F7\u66B4"
    },
    "41": {
      en: "severe thunderstorm with extreme gale-force winds",
      de: "schweres Gewitter mit extremen Orkanb\xF6en",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C",
      pt: "tempestade severa com ventos fortes e fortes",
      nl: "zware onweersbui met extreme stormwinden",
      fr: "orage violent avec des vents violents violents",
      it: "forte temporale con venti di forte burrasca",
      es: "tormenta severa con vientos huracanados extremos",
      pl: "pot\u0119\u017Cna burza z ekstremalnymi wichurami",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0448\u0442\u043E\u0440\u043C\u043E\u0432\u0438\u043C \u0432\u0456\u0442\u0440\u043E\u043C",
      "zh-cn": "\u5F3A\u70C8\u96F7\u66B4\u5E76\u4F34\u6709\u72C2\u98CE"
    },
    "42": {
      en: "severe thunderstorm with heavy rain",
      de: "schweres Gewitter mit heftigem Starkregen",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C",
      pt: "forte trovoada com chuva forte",
      nl: "zware onweersbui met zware regen",
      fr: "violent orage avec fortes pluies",
      it: "forte temporale con forti piogge",
      es: "tormenta severa con fuertes lluvias",
      pl: "silna burza z ulewnymi opadami deszczu",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C",
      "zh-cn": "\u4E25\u91CD\u96F7\u9635\u96E8\u5E76\u4F34\u6709\u5927\u96E8"
    },
    "44": {
      en: "severe thunderstorm with gale-force winds and heavy rain",
      de: "schweres Gewitter mit Orkanb\xF6en und heftigem Starkregen",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C \u0438 \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C",
      pt: "forte tempestade com ventos fortes e chuva forte",
      nl: "zware onweersbui met harde wind en hevige regen",
      fr: "orage violent avec des vents violents et de fortes pluies",
      it: "forte temporale con venti di burrasca e forti piogge",
      es: "Tormenta fuerte con vientos huracanados y fuertes lluvias.",
      pl: "silna burza z wichurami i ulewnymi opadami deszczu",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437\u0456 \u0448\u043A\u0432\u0430\u043B\u0438\u0441\u0442\u0438\u043C \u0432\u0456\u0442\u0440\u043E\u043C \u0456 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4\u5E76\u4F34\u6709\u5927\u98CE\u548C\u5927\u96E8"
    },
    "45": {
      en: "severe thunderstorm with extreme gale-force winds and heavy heavy rain heavy heavy rain and hail",
      de: "schweres Gewitter mit extremen Orkanb\xF6en und heftigem Starkregen heftigem Starkregen und Hagel",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C \u0438 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C, \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u043E\u0439 \u0434\u043E\u0436\u0434\u044C \u0438 \u0433\u0440\u0430\u0434",
      pt: "forte tempestade com ventos fortes e fortes chuvas fortes, chuvas fortes e granizo",
      nl: "zware onweersbui met extreme stormachtige wind en zware zware regen zware zware regen en hagel",
      fr: "orage violent avec des vents violents violents et de fortes pluies fortes de fortes pluies et de la gr\xEAle",
      it: "forte temporale con venti di burrasca estrema e forti piogge forti piogge forti e grandine",
      es: "Tormenta severa con vientos huracanados extremos y lluvias intensas, lluvias intensas y granizo",
      pl: "silna burza z ekstremalnymi wichurami i ulewnymi opadami deszczu, ulewnymi deszczami i gradem",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0448\u0442\u043E\u0440\u043C\u043E\u0432\u0438\u043C \u0432\u0456\u0442\u0440\u043E\u043C \u0456 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u043E\u0449 \u0456 \u0433\u0440\u0430\u0434",
      "zh-cn": "\u5F3A\u96F7\u66B4\uFF0C\u5927\u98CE\uFF0C\u5927\u66B4\u96E8\uFF0C\u5927\u66B4\u96E8\uFF0C\u51B0\u96F9"
    },
    "46": {
      en: "severe thunderstorm with heavy rain and hail",
      de: "schweres Gewitter mit heftigem Starkregen und Hagel",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C \u0438 \u0433\u0440\u0430\u0434\u043E\u043C",
      pt: "forte tempestade com chuva forte e granizo",
      nl: "zware onweersbui met zware regen en hagel",
      fr: "violent orage avec fortes pluies et gr\xEAle",
      it: "forte temporale con forti piogge e grandinate",
      es: "tormenta severa con fuertes lluvias y granizo",
      pl: "pot\u0119\u017Cna burza z ulewnymi deszczami i gradem",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C \u0456 \u0433\u0440\u0430\u0434\u043E\u043C",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4\u5E76\u4F34\u6709\u5927\u96E8\u548C\u51B0\u96F9"
    },
    "48": {
      en: "severe thunderstorm with gale-force winds, heavy rain and hail",
      de: "schweres Gewitter mit Orkanb\xF6en, heftigem Starkregen und Hagel",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C, \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C \u0438 \u0433\u0440\u0430\u0434\u043E\u043C",
      pt: "forte tempestade com ventos fortes, chuva forte e granizo",
      nl: "zware onweersbui met stormachtige wind, zware regen en hagel",
      fr: "orage violent avec vents violents, fortes pluies et gr\xEAle",
      it: "forte temporale con venti di burrasca, forti piogge e grandinate",
      es: "tormenta fuerte con vientos huracanados, fuertes lluvias y granizo",
      pl: "silna burza z wichurami, ulewnymi opadami deszczu i gradem",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437\u0456 \u0448\u043A\u0432\u0430\u043B\u0438\u0441\u0442\u0438\u043C \u0432\u0456\u0442\u0440\u043E\u043C, \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u043E\u0449 \u0456 \u0433\u0440\u0430\u0434",
      "zh-cn": "\u5F3A\u96F7\u66B4\uFF0C\u4F34\u6709\u5927\u98CE\u3001\u5927\u96E8\u548C\u51B0\u96F9"
    },
    "49": {
      en: "severe thunderstorm with extreme gale-force winds, heavy rain and hail",
      de: "schweres Gewitter mit extremen Orkanb\xF6en, heftigem Starkregen und Hagel",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C, \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C \u0438 \u0433\u0440\u0430\u0434\u043E\u043C",
      pt: "forte tempestade com ventos fortes, chuva forte e granizo",
      nl: "zware onweersbui met extreme stormwinden, zware regen en hagel",
      fr: "orage violent accompagn\xE9 de vents violents, de fortes pluies et de gr\xEAle",
      it: "forte temporale con venti di burrasca estrema, forti piogge e grandine",
      es: "tormenta severa con vientos huracanados extremos, fuertes lluvias y granizo",
      pl: "silna burza z silnymi wichurami, ulewnymi deszczami i gradem",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0448\u0442\u043E\u0440\u043C\u043E\u0432\u0438\u043C \u0432\u0456\u0442\u0440\u043E\u043C, \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C \u0456 \u0433\u0440\u0430\u0434\u043E\u043C",
      "zh-cn": "\u5F3A\u70C8\u96F7\u66B4\uFF0C\u4F34\u6709\u5927\u98CE\u3001\u5927\u96E8\u548C\u51B0\u96F9"
    },
    "51": {
      en: "Wind gusts",
      de: "Windb\xF6en",
      ru: "\u041F\u043E\u0440\u044B\u0432\u044B \u0432\u0435\u0442\u0440\u0430",
      pt: "Rajadas de vento",
      nl: "Windvlagen",
      fr: "Rafales de vent",
      it: "Raffiche di vento",
      es: "R\xE1fagas de viento",
      pl: "Porywy wiatru",
      uk: "\u041F\u043E\u0440\u0438\u0432\u0438 \u0432\u0456\u0442\u0440\u0443",
      "zh-cn": "\u9635\u98CE"
    },
    "52": {
      en: "squalls",
      de: "Sturmb\xF6en",
      ru: "\u0448\u043A\u0432\u0430\u043B\u044B",
      pt: "rajadas",
      nl: "buien",
      fr: "bourrasques",
      it: "burrasche",
      es: "chubascos",
      pl: "szkwa\u0142y",
      uk: "\u0448\u043A\u0432\u0430\u043B\u0438",
      "zh-cn": "\u72C2\u98CE"
    },
    "53": {
      en: "severe squalls",
      de: "schwere Sturmb\xF6en",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0435 \u0448\u043A\u0432\u0430\u043B\u044B",
      pt: "tempestades severas",
      nl: "zware buien",
      fr: "violentes rafales",
      it: "forti raffiche",
      es: "fuertes tormentas",
      pl: "powa\u017Cne szkwa\u0142y",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0456 \u0448\u043A\u0432\u0430\u043B\u0438",
      "zh-cn": "\u4E25\u91CD\u72C2\u98CE"
    },
    "54": {
      en: "hurricane-force gusts",
      de: "orkanartige B\xF6en",
      ru: "\u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u0440\u044B\u0432\u044B",
      pt: "rajadas com for\xE7a de furac\xE3o",
      nl: "windstoten met orkaankracht",
      fr: "rafales de force ouragan",
      it: "raffiche di forza di uragano",
      es: "r\xE1fagas con fuerza de hurac\xE1n",
      pl: "porywy o sile huraganu",
      uk: "\u0443\u0440\u0430\u0433\u0430\u043D\u043D\u0456 \u043F\u043E\u0440\u0438\u0432\u0438",
      "zh-cn": "\u98D3\u98CE\u7EA7\u9635\u98CE"
    },
    "55": {
      en: "hurricane-force gusts",
      de: "Orkanb\xF6en",
      ru: "\u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u0440\u044B\u0432\u044B",
      pt: "rajadas com for\xE7a de furac\xE3o",
      nl: "windstoten met orkaankracht",
      fr: "rafales de force ouragan",
      it: "raffiche di forza di uragano",
      es: "r\xE1fagas con fuerza de hurac\xE1n",
      pl: "porywy o sile huraganu",
      uk: "\u0443\u0440\u0430\u0433\u0430\u043D\u043D\u0456 \u043F\u043E\u0440\u0438\u0432\u0438",
      "zh-cn": "\u98D3\u98CE\u7EA7\u9635\u98CE"
    },
    "56": {
      en: "extreme gale-force winds",
      de: "extremE Orkanb\xF6en",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u0439 \u0432\u0435\u0442\u0435\u0440",
      pt: "ventos fortes com for\xE7a de vendaval",
      nl: "extreme stormachtige wind",
      fr: "vents extr\xEAmes de force coup de vent",
      it: "venti di burrasca estrema",
      es: "vientos huracanados extremos",
      pl: "ekstremalne wichury",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0448\u0442\u043E\u0440\u043C\u043E\u0432\u0438\u0439 \u0432\u0456\u0442\u0435\u0440",
      "zh-cn": "\u6781\u7AEF\u5927\u98CE"
    },
    "57": {
      en: "strong wind",
      de: "Starkwind",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0432\u0435\u0442\u0435\u0440",
      pt: "vento forte",
      nl: "harde wind",
      fr: "vent fort",
      it: "vento forte",
      es: "viento fuerte",
      pl: "silny wiatr",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0432\u0456\u0442\u0435\u0440",
      "zh-cn": "\u5927\u98CE"
    },
    "58": {
      en: "Storm",
      de: "Sturm",
      ru: "\u0411\u0443\u0440\u044F",
      pt: "Tempestade",
      nl: "Storm",
      fr: "Temp\xEAte",
      it: "Tempesta",
      es: "Tormenta",
      pl: "Burza",
      uk: "\u0411\u0443\u0440\u044F",
      "zh-cn": "\u98CE\u66B4"
    },
    "59": {
      en: "Fog",
      de: "Nebel",
      ru: "\u0422\u0443\u043C\u0430\u043D",
      pt: "N\xE9voa",
      nl: "Mist",
      fr: "Brouillard",
      it: "Nebbia",
      es: "Niebla",
      pl: "Mg\u0142a",
      uk: "\u0422\u0443\u043C\u0430\u043D",
      "zh-cn": "\u591A\u96FE\u8DEF\u6BB5"
    },
    "61": {
      en: "heavy rain",
      de: "Starkregen",
      ru: "\u043B\u0438\u0432\u0435\u043D\u044C",
      pt: "chuva pesada",
      nl: "zware regen",
      fr: "forte pluie",
      it: "forte pioggia",
      es: "Lluvia Pesada",
      pl: "ulewa",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u043E\u0449",
      "zh-cn": "\u503E\u76C6\u5927\u96E8"
    },
    "62": {
      en: "heavy downpour",
      de: "heftiger Starkregen",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043B\u0438\u0432\u0435\u043D\u044C",
      pt: "forte chuva",
      nl: "zware stortbui",
      fr: "pluie diluvienne",
      it: "violento acquazzone",
      es: "fuerte aguacero",
      pl: "ci\u0119\u017Ckie ulewy",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0437\u043B\u0438\u0432\u0430",
      "zh-cn": "\u503E\u76C6\u5927\u96E8"
    },
    "63": {
      en: "continuous rain",
      de: "Dauerregen",
      ru: "\u043D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
      pt: "chuva cont\xEDnua",
      nl: "aanhoudende regen",
      fr: "pluie continue",
      it: "pioggia continua",
      es: "lluvia continua",
      pl: "ci\u0105g\u0142y deszcz",
      uk: "\u0431\u0435\u0437\u043F\u0435\u0440\u0435\u0440\u0432\u043D\u0438\u0439 \u0434\u043E\u0449",
      "zh-cn": "\u6301\u7EED\u4E0B\u96E8"
    },
    "64": {
      en: "heavy continuous rain",
      de: "ergiebiger Dauerregen",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
      pt: "chuva forte e cont\xEDnua",
      nl: "hevige aanhoudende regen",
      fr: "forte pluie continue",
      it: "forte pioggia continua",
      es: "fuertes lluvias continuas",
      pl: "ulewny, ci\u0105g\u0142y deszcz",
      uk: "\u0431\u0435\u0437\u043F\u0435\u0440\u0435\u0440\u0432\u043D\u0438\u0439 \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u043E\u0449",
      "zh-cn": "\u6301\u7EED\u5927\u96E8"
    },
    "65": {
      en: "extremely heavy continuous rain",
      de: "extrem ergiebiger Dauerregen",
      ru: "\u043E\u0447\u0435\u043D\u044C \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
      pt: "chuva cont\xEDnua extremamente forte",
      nl: "extreem zware aanhoudende regen",
      fr: "pluie continue extr\xEAmement forte",
      it: "pioggia continua estremamente forte",
      es: "lluvia continua extremadamente intensa",
      pl: "wyj\u0105tkowo ulewny, ci\u0105g\u0142y deszcz",
      uk: "\u043D\u0430\u0434\u0437\u0432\u0438\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0431\u0435\u0437\u043F\u0435\u0440\u0435\u0440\u0432\u043D\u0438\u0439 \u0434\u043E\u0449",
      "zh-cn": "\u7279\u5927\u8FDE\u7EED\u964D\u96E8"
    },
    "66": {
      en: "extremely heavy heavy rain",
      de: "extrem heftiger Starkregen",
      ru: "\u043E\u0447\u0435\u043D\u044C \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
      pt: "chuva muito forte",
      nl: "extreem zware zware regen",
      fr: "pluie extr\xEAmement forte et forte",
      it: "pioggia intensa estremamente forte",
      es: "lluvia muy intensa",
      pl: "wyj\u0105tkowo ulewny deszcz",
      uk: "\u043D\u0430\u0434\u0437\u0432\u0438\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u0438\u0439 \u0434\u043E\u0449",
      "zh-cn": "\u7279\u5927\u66B4\u96E8"
    },
    "70": {
      en: "light snowfall",
      de: "leichter Schneefall",
      ru: "\u043B\u0435\u0433\u043A\u0438\u0439 \u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
      pt: "nevasca leve",
      nl: "lichte sneeuwval",
      fr: "l\xE9g\xE8res chutes de neige",
      it: "leggera nevicata",
      es: "nevadas ligeras",
      pl: "lekkie opady \u015Bniegu",
      uk: "\u043B\u0435\u0433\u043A\u0438\u0439 \u0441\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
      "zh-cn": "\u5C0F\u96EA"
    },
    "71": {
      en: "Snowfall",
      de: "Schneefall",
      ru: "\u0421\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
      pt: "Queda de neve",
      nl: "Sneeuwval",
      fr: "Chute de neige",
      it: "Nevicata",
      es: "Nevada",
      pl: "Opady \u015Bniegu",
      uk: "\u0421\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
      "zh-cn": "\u964D\u96EA"
    },
    "72": {
      en: "heavy snowfall",
      de: "starker Schneefall",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
      pt: "forte nevasca",
      nl: "zware sneeuwval",
      fr: "fortes chutes de neige",
      it: "forte nevicata",
      es: "fuerte nevada",
      pl: "obfite opady \u015Bniegu",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0441\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
      "zh-cn": "\u5927\u96EA"
    },
    "73": {
      en: "extremely heavy snowfall",
      de: "extrem starker Schneefall",
      ru: "\u043E\u0447\u0435\u043D\u044C \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
      pt: "queda de neve extremamente forte",
      nl: "extreem zware sneeuwval",
      fr: "chutes de neige extr\xEAmement abondantes",
      it: "nevicate estremamente abbondanti",
      es: "nevadas extremadamente fuertes",
      pl: "wyj\u0105tkowo obfite opady \u015Bniegu",
      uk: "\u043D\u0430\u0434\u0437\u0432\u0438\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0441\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
      "zh-cn": "\u7279\u5927\u964D\u96EA"
    },
    "74": {
      en: "Snowdrift",
      de: "Schneeverwehung",
      ru: "\u0421\u0443\u0433\u0440\u043E\u0431",
      pt: "Monte de neve",
      nl: "Sneeuwjacht",
      fr: "Cong\xE8re",
      it: "Cumulo di neve",
      es: "Ventisquero",
      pl: "Zaspa",
      uk: "\u0421\u043D\u0456\u0433\u043E\u0432\u0438\u0439 \u0437\u0430\u043C\u0435\u0442",
      "zh-cn": "\u96EA\u5806"
    },
    "75": {
      en: "heavy snow drift",
      de: "starke Schneeverwehung",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u043D\u0435\u0436\u043D\u044B\u0439 \u0437\u0430\u043D\u043E\u0441",
      pt: "forte deriva de neve",
      nl: "zware sneeuwstorm",
      fr: "forte cong\xE8re de neige",
      it: "forte cumulo di neve",
      es: "fuertes nevadas",
      pl: "ci\u0119\u017Ckie zaspy \u015Bnie\u017Cne",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0441\u043D\u0456\u0433\u043E\u0432\u0438\u0439 \u0437\u0430\u043C\u0435\u0442",
      "zh-cn": "\u5927\u96EA\u98D8\u79FB"
    },
    "76": {
      en: "extremely heavy snowdrift",
      de: "extrem starke Schneeverwehung",
      ru: "\u043E\u0447\u0435\u043D\u044C \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u0443\u0433\u0440\u043E\u0431",
      pt: "monte de neve extremamente pesado",
      nl: "extreem zware sneeuwjacht",
      fr: "cong\xE8re extr\xEAmement importante",
      it: "cumulo di neve estremamente intenso",
      es: "ventisquero extremadamente fuerte",
      pl: "wyj\u0105tkowo ci\u0119\u017Cka zaspa \u015Bnie\u017Cna",
      uk: "\u043D\u0430\u0434\u0437\u0432\u0438\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0437\u0430\u043C\u0435\u0442",
      "zh-cn": "\u7279\u5927\u96EA\u5806"
    },
    "79": {
      en: "ladder wire vibration",
      de: "Leiterseilschwingungen ",
      ru: "\u0432\u0438\u0431\u0440\u0430\u0446\u0438\u044F \u043B\u0435\u0441\u0442\u043D\u0438\u0447\u043D\u043E\u0433\u043E \u0442\u0440\u043E\u0441\u0430",
      pt: "vibra\xE7\xE3o do fio da escada",
      nl: "trillingen van ladderdraad",
      fr: "vibration du fil d'\xE9chelle",
      it: "vibrazione del filo della scala",
      es: "vibraci\xF3n del alambre de la escalera",
      pl: "wibracje drutu drabiny",
      uk: "\u0432\u0456\u0431\u0440\u0430\u0446\u0456\u044F \u0434\u0440\u0430\u0431\u0438\u043D\u0438",
      "zh-cn": "\u68AF\u7EBF\u632F\u52A8"
    },
    "82": {
      en: "severe frost",
      de: "strenger Frost",
      ru: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043C\u043E\u0440\u043E\u0437",
      pt: "geada severa",
      nl: "strenge vorst",
      fr: "fortes gel\xE9es",
      it: "forte gelo",
      es: "heladas severas",
      pl: "silny mr\xF3z",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u043C\u043E\u0440\u043E\u0437",
      "zh-cn": "\u4E25\u91CD\u971C\u51BB"
    },
    "84": {
      en: "black ice",
      de: "Gl\xE4tte",
      ru: "\u0447\u0435\u0440\u043D\u044B\u0439 \u043B\u0435\u0434",
      pt: "gelo preto",
      nl: "zwart ijs",
      fr: "glace noir",
      it: "ghiaccio nero",
      es: "hielo negro",
      pl: "czarny l\xF3d",
      uk: "\u0447\u043E\u0440\u043D\u0438\u0439 \u043B\u0456\u0434",
      "zh-cn": "\u9ED1\u51B0"
    },
    "85": {
      en: "black ice",
      de: "Glatteis",
      ru: "\u0447\u0435\u0440\u043D\u044B\u0439 \u043B\u0435\u0434",
      pt: "gelo preto",
      nl: "zwart ijs",
      fr: "glace noir",
      it: "ghiaccio nero",
      es: "hielo negro",
      pl: "czarny l\xF3d",
      uk: "\u0447\u043E\u0440\u043D\u0438\u0439 \u043B\u0456\u0434",
      "zh-cn": "\u9ED1\u51B0"
    },
    "87": {
      en: "widespread slipperiness",
      de: "verbreitet Gl\xE4tte",
      ru: "\u0448\u0438\u0440\u043E\u043A\u043E \u0440\u0430\u0441\u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0435\u043D\u043D\u0430\u044F \u0441\u043A\u043E\u043B\u044C\u0437\u043A\u043E\u0441\u0442\u044C",
      pt: "escorregadio generalizado",
      nl: "wijdverbreide gladheid",
      fr: "glissance g\xE9n\xE9ralis\xE9e",
      it: "scivolosit\xE0 diffusa",
      es: "resbaladizo generalizado",
      pl: "powszechna \u015Blisko\u015B\u0107",
      uk: "\u043F\u043E\u0448\u0438\u0440\u0435\u043D\u0430 \u0441\u043B\u0438\u0437\u044C\u043A\u0456\u0441\u0442\u044C",
      "zh-cn": "\u666E\u904D\u6253\u6ED1"
    },
    "88": {
      en: "Thaw",
      de: "Tauwetter",
      ru: "\u041E\u0442\u0442\u0435\u043F\u0435\u043B\u044C",
      pt: "Descongelamento",
      nl: "Dooi",
      fr: "D\xE9gel",
      it: "Scongelare",
      es: "Deshielo",
      pl: "Odwil\u017C",
      uk: "\u0412\u0456\u0434\u043B\u0438\u0433\u0430",
      "zh-cn": "\u89E3\u51BB"
    },
    "89": {
      en: "heavy thaw",
      de: "starkes Tauwetter",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u043E\u0442\u0442\u0435\u043F\u0435\u043B\u044C",
      pt: "degelo pesado",
      nl: "zware dooi",
      fr: "fort d\xE9gel",
      it: "forte disgelo",
      es: "deshielo pesado",
      pl: "silna odwil\u017C",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0432\u0456\u0434\u043B\u0438\u0433\u0430",
      "zh-cn": "\u4E25\u91CD\u89E3\u51BB"
    },
    "90": {
      en: "thunderstorm",
      de: "Gewitter",
      ru: "\u0433\u0440\u043E\u0437\u0430",
      pt: "trovoada",
      nl: "onweersbui",
      fr: "orage",
      it: "temporale",
      es: "tormenta",
      pl: "burza z piorunami",
      uk: "\u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u96F7\u96E8"
    },
    "91": {
      en: "severe thunderstorm",
      de: "starkes Gewitter",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
      pt: "tempestade severa",
      nl: "zware onweersbui",
      fr: "orage violent",
      it: "forte temporale",
      es: "tormenta severa",
      pl: "ci\u0119\u017Cka burza",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4"
    },
    "92": {
      en: "severe thunderstorm",
      de: "schweres Gewitter",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
      pt: "tempestade severa",
      nl: "zware onweersbui",
      fr: "orage violent",
      it: "forte temporale",
      es: "tormenta severa",
      pl: "ci\u0119\u017Cka burza",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4"
    },
    "93": {
      en: "extreme thunderstorm",
      de: "extremes Gewitter",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
      pt: "tempestade extrema",
      nl: "extreem onweer",
      fr: "orage extr\xEAme",
      it: "temporale estremo",
      es: "tormenta extrema",
      pl: "ekstremalna burza",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
      "zh-cn": "\u6781\u7AEF\u96F7\u66B4"
    },
    "95": {
      en: "severe thunderstorm with extremely heavy rain and hail",
      de: "schweres Gewitter mit extrem heftigem Starkregen und Hagel",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0447\u0440\u0435\u0437\u0432\u044B\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C \u0438 \u0433\u0440\u0430\u0434\u043E\u043C",
      pt: "forte tempestade com chuva extremamente forte e granizo",
      nl: "zware onweersbui met extreem zware regen en hagel",
      fr: "orage violent avec pluie extr\xEAmement forte et gr\xEAle",
      it: "severe thunderstorm with extremely heavy rain and hail",
      es: "tormenta severa con lluvias extremadamente intensas y granizo",
      pl: "pot\u0119\u017Cna burza z niezwykle intensywnymi opadami deszczu i gradu",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437 \u043D\u0430\u0434\u0437\u0432\u0438\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C \u0456 \u0433\u0440\u0430\u0434\u043E\u043C",
      "zh-cn": "\u4E25\u91CD\u96F7\u66B4\uFF0C\u4F34\u6709\u7279\u5927\u66B4\u96E8\u548C\u51B0\u96F9"
    },
    "96": {
      en: "extreme thunderstorm with gale-force winds, extremely heavy rain and hail",
      de: "extremes Gewitter mit Orkanb\xF6en, extrem heftigem Starkregen und Hagel",
      ru: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u043E\u0437\u0430 \u0441 \u0443\u0440\u0430\u0433\u0430\u043D\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C, \u0447\u0440\u0435\u0437\u0432\u044B\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0435\u043C \u0438 \u0433\u0440\u0430\u0434\u043E\u043C",
      pt: "tempestade extrema com ventos fortes, chuva extremamente forte e granizo",
      nl: "extreem onweer met stormachtige wind, extreem zware regen en hagel",
      fr: "orage extr\xEAme avec vents violents, pluie extr\xEAmement forte et gr\xEAle",
      it: "temporale intenso con venti di burrasca, pioggia estremamente forte e grandine",
      es: "tormenta extrema con vientos huracanados, lluvias extremadamente intensas y granizo.",
      pl: "ekstremalna burza z wichurami, niezwykle ulewnymi deszczami i gradem",
      uk: "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430 \u0437\u0456 \u0448\u043A\u0432\u0430\u043B\u0438\u0441\u0442\u0438\u043C \u0432\u0456\u0442\u0440\u043E\u043C, \u043D\u0430\u0434\u0437\u0432\u0438\u0447\u0430\u0439\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u043E\u0449 \u0456 \u0433\u0440\u0430\u0434",
      "zh-cn": "\u6781\u7AEF\u96F7\u66B4\u3001\u5927\u98CE\u3001\u7279\u5927\u66B4\u96E8\u548C\u51B0\u96F9"
    },
    "98": {
      en: "TEST WARNING",
      de: "TEST-WARNUNG",
      ru: "\u0422\u0415\u0421\u0422\u041E\u0412\u041E\u0415 \u041F\u0420\u0415\u0414\u0423\u041F\u0420\u0415\u0416\u0414\u0415\u041D\u0418\u0415",
      pt: "AVISO DE TESTE",
      nl: "TEST-WAARSCHUWING",
      fr: "AVERTISSEMENT DE TEST",
      it: "ATTENZIONE ALLA PROVA",
      es: "ADVERTENCIA DE PRUEBA",
      pl: "OSTRZE\u017BENIE TESTOWE",
      uk: "\u0422\u0415\u0421\u0422 \u041F\u041E\u041F\u0415\u0420\u0415\u0414\u0416\u0415\u041D\u041D\u042F",
      "zh-cn": "\u6D4B\u8BD5\u8B66\u544A"
    },
    "99": {
      en: "TEST-UNWEATHER-WARNING",
      de: "TEST-UNWETTERWARNUNG",
      ru: "\u0422\u0415\u0421\u0422-\u041D\u0415\u041F\u041E\u0413\u041E\u0414\u0410-\u041F\u0420\u0415\u0414\u0423\u041F\u0420\u0415\u0416\u0414\u0415\u041D\u0418\u0415",
      pt: "TESTE-AVISO DE TEMPO",
      nl: "TEST-ONWEER-WAARSCHUWING",
      fr: "TEST-AVERTISSEMENT M\xC9T\xC9O",
      it: "TEST-INTEMPO-AVVERTIMENTO",
      es: "PRUEBA-ADVERTENCIA INMETEOROL\xD3GICA",
      pl: "TEST-OSTRZE\u017BENIE NIEPOGODOWE",
      uk: "\u0422\u0415\u0421\u0422-\u041D\u0415\u041F\u041E\u0413\u041E\u0414\u0410-\u041F\u041E\u041F\u0415\u0420\u0415\u0414\u0416\u0415\u041D\u041D\u042F",
      "zh-cn": "\u6D4B\u8BD5-\u6076\u52A3\u5929\u6C14-\u8B66\u544A"
    },
    247: {
      en: "Heat",
      de: "Hitze",
      ru: "\u0422\u0435\u043F\u043B\u043E",
      pt: "Calor de calor",
      nl: "Heet",
      fr: "Heat",
      it: "Calore",
      es: "Calor",
      pl: "Heat",
      uk: "\u0422\u0435\u043F\u043B\u0438\u0446\u044F",
      "zh-cn": "Heat"
    },
    248: {
      en: "extreme heat",
      de: "extreme Hitze",
      ru: "\u044D\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0442\u0435\u043F\u043B\u043E",
      pt: "calor extremo",
      nl: "extreme hitte",
      fr: "chaleur extr\xEAme",
      it: "calore estremo",
      es: "calor extremo",
      pl: "ciep\u0142o",
      uk: "\u0435\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u044C\u043D\u0430 \u0442\u0435\u043F\u043B\u0430",
      "zh-cn": "\u6781\u7AEF\u5371\u9669"
    }
  }
};
const level = {
  uwz: { green: 0, darkgreen: 0, yellow: 1, orange: 2, red: 3, violet: 4 }
};
const dwdLevel = { minor: 1, moderate: 2, severe: 3, extreme: 4 };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  color,
  customFormatedTokensJson,
  dwdLevel,
  genericWarntyp,
  genericWarntypState,
  isKeyOfObject,
  level,
  textLevels,
  warnTypeName
});
//# sourceMappingURL=messages-def.js.map
