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
  daytimes: () => daytimes,
  dwdLevel: () => dwdLevel,
  filterWarntype: () => filterWarntype,
  genericWarntyp: () => genericWarntyp,
  genericWarntypState: () => genericWarntypState,
  isKeyOfObject: () => isKeyOfObject,
  level: () => level,
  status: () => status,
  temporalAdverbs: () => temporalAdverbs,
  textLevels: () => textLevels,
  warnTypeIconsBase64: () => warnTypeIconsBase64,
  warnTypeName: () => warnTypeName
});
module.exports = __toCommonJS(messages_def_exports);
const customFormatedTokensJson = {
  starttime: "Start time",
  startdate: "Start date",
  startday: "Start Day",
  startmonth: "Start Month",
  startdaytime: "Start: Time of day.",
  startadverb: "Start: temporal adverb (yesterday, today, tomorrow, day after tomorrow)",
  endtime: "End Time",
  enddate: "End Date",
  endday: "End Day",
  endmonth: "End Month",
  enddaytime: "End: Time of the day.",
  startdayofweek: "Start day of the week",
  enddayofweek: "End day of the week",
  startdayofweekshort: "Start day of the week short",
  enddayofweekshort: "End day of the week short",
  headline: "Headline",
  description: "Description",
  impact: "Impact text",
  ceiling: "Maximum validity height",
  altitude: "Minimum validity height",
  warnlevelname: "Textname of level",
  warnlevelnumber: "Number of level",
  warnlevelcolorname: "Textname of level color",
  warnlevelcolorhex: "Hexnumber of level color",
  warntypename: "Warning type retrieved from the provider",
  warntypegenericname: "Warntype name generic",
  warntypegeneric: "Warntype number generic",
  location: "Location retrieved from the provider",
  instruction: "Instructions",
  provider: "Provider",
  locationcustom: "Location from admin configuration",
  countdown: "Remaining time until the start of the warning.",
  cdhour: "Remaining time hours part. Up to 30 * 24 hours.",
  cdminute: "Remaining time minutes part.",
  cdfuture: "Countdown warning lies ahead.",
  status: "Status of warning. new, hold, all clear",
  starttimems: "Start time in ms",
  endtimems: "End Time in ms",
  iconurl: "Url to Icon",
  warningcount: "Number of Warnings",
  htmlicon: "Blue png icons as base64 string with html tags",
  weatheremoji: "Emoji for each warning type."
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
  uwzColor: {
    0: `#00ff00`,
    1: `#fffc04`,
    2: `#ffb400`,
    3: `#ff0000`,
    4: `#ff00ff`
  },
  zamgColor: {
    0: `#01DF3A`,
    1: `#fffc04`,
    2: `#ffc400`,
    3: `#ff0404`,
    4: `#ff00ff`
  },
  textuwz: {
    "0": "color.textGeneric.0",
    "1": "color.textGeneric.2",
    "2": "color.textGeneric.3",
    "3": "color.textGeneric.4",
    "4": "color.textGeneric.5"
  },
  textzamg: {
    "0": "color.textGeneric.0",
    "1": "color.textGeneric.2",
    "2": "color.textGeneric.3",
    "3": "color.textGeneric.4",
    "4": "color.textGeneric.5"
  },
  textdwd: {
    "0": "color.textGeneric.0",
    "1": "color.textGeneric.2",
    "2": "color.textGeneric.3",
    "3": "color.textGeneric.4",
    "4": "color.textGeneric.5",
    "5": ""
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
const genericWarntyp = {
  "0": {
    name: "textLevels.textGeneric.0",
    id: "none",
    dwdService: [0],
    uwzService: [0],
    zamgService: [0],
    emoji: "\u2728"
  },
  "1": {
    name: "genericWarntyp.1.name",
    id: "unknown",
    dwdService: [],
    uwzService: [1],
    zamgService: [8],
    emoji: "\u2754"
  },
  "2": {
    name: "genericWarntyp.2.name",
    id: "storm",
    dwdService: [40, 41, 44, 45, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 96, 79],
    uwzService: [2],
    zamgService: [1],
    emoji: "\u{1F32C}\uFE0F"
  },
  "3": {
    name: "genericWarntyp.3.name",
    id: "snowfall",
    dwdService: [70, 71, 72, 73, 74, 75, 76],
    uwzService: [3],
    zamgService: [3],
    emoji: "\u{1F328}\uFE0F"
  },
  "4": {
    name: "genericWarntyp.4.name",
    id: "rain",
    dwdService: [96, 95, 66, 65, 64, 63, 62, 61, 49, 48, 46, 45, 44, 42],
    uwzService: [4],
    zamgService: [2],
    emoji: "\u2614"
  },
  "5": {
    name: "genericWarntyp.5.name",
    id: "cold",
    dwdService: [82, 22],
    uwzService: [10, 11, 5],
    zamgService: [7],
    emoji: "\u2744\uFE0F"
  },
  "6": {
    name: "genericWarntyp.6.name",
    id: "forest_fire",
    dwdService: [],
    uwzService: [6],
    zamgService: [],
    emoji: "\u{1F525}"
  },
  "7": {
    name: "genericWarntyp.7.name",
    id: "thunderstorm",
    dwdService: [90, 91, 92, 93, 95, 96, 31, 33, 34, 36, 38, 40, 41, 42, 44, 45, 46, 48, 49],
    uwzService: [7],
    zamgService: [5],
    emoji: "\u26A1"
  },
  "8": {
    name: "genericWarntyp.8.name",
    id: "black_ice_slippery",
    dwdService: [87, 85, 84, 24],
    uwzService: [8],
    zamgService: [4],
    emoji: "\u26F8\uFE0F"
  },
  "9": {
    name: "genericWarntyp.9.name",
    id: "heat",
    dwdService: [247, 248],
    uwzService: [9],
    zamgService: [6],
    emoji: "\u{1F975}"
  },
  "10": {
    name: "genericWarntyp.10.name",
    id: "hail",
    dwdService: [95, 96, 46, 48, 49],
    uwzService: [],
    zamgService: [],
    emoji: "\u{1F9CA}"
  },
  "11": { name: "genericWarntyp.11.name", id: "fog", dwdService: [59], uwzService: [], zamgService: [], emoji: "\u{1F9CA}" },
  "12": {
    name: "genericWarntyp.12.name",
    id: "thaw",
    dwdService: [88, 89],
    uwzService: [],
    zamgService: [],
    emoji: "\u{1F4A6}"
  }
};
const warnTypeIconsBase64 = {
  "0": '<img src="data:image/png;base64,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" />',
  "2": '<img src="data:image/png;base64,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" />',
  "3": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAABfvA/wAAAACXBIWXMAAAsTAAALEwEAmpwYAAACyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NjQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4Kiv76YwAACPRJREFUWAmlV2tsFNcVPvfOzM6ud/3al73GxsYQA7vGGFMIpMRAS0KhilSqhjZ9SI1AoYkJBPqMRNStEkUqTaC4lBaqqkSq1MSOIKJVSX5UPNqitgFs82wIBAwG1mt77V3bu97ZmTs9Z9aLH8QqKEe2586d757z3fO61wAPKmGTQ4sp3QdvaRmbM01mfbeeOKY1n1lI2TjDC5/br9Tvbiuq/0Nb0YpwWCb9JmHCx6xxVfiYfbzNe++EMe8nlGU8fsX4cTjMIRwWNFXV3LFEVqTvJAUsjWkjZcJkpt+uxroy8BZsrd1JmMJ956pVwU6CEEeiW+a/4Pv1xWXMyBwGxdYcfT74KmEmy9QEcsZxZ5U+3+4hITb3GTLYWQZqVA64HehIS9DoEMnFswqefeNi6qlK0I6muNTM7C6PORQ7jL5ZInmnB4yByKumCYxJXLOIkDcYM4mM5bbJrNBVBBDk1uke99FOybGqQusXG2vdYkZ5EXfaVfwOkBhKmYX5dvVWd+JtsMnMLmKx4ZHEk1zoJ0BR1zEuARrfDZn0u7zA22EOx2+Whf/85h3Gkjmbn54kra3WfKXf88ubimtVIxvUXlkzly+ZP032Fju5XZWZigZLvPm8wKVIpW6XKEl1w4AOa3q3LT2L7DYxmx1MQzsVbardDkx6jCkqJcs7d8JPjRrHTaLcHwLK3DATlbvPLh2S5VNOXRM70LjXnQfpNPkRl2R/KPkg2jcIndFB893L3ZBhCrMz8f0BIV2wuQo/MFOJP4Geel0wpZXJtjmmNnISNfxRKPL7saZ5t8jT94cgmCWl2G3f7ksz2DivVPjceXwEjXOe5UuGFRuDS1d7YcehSwCqxKBQNXHLOHa8OY0bd7VEL5KFJ4HZviq5ilVjuD8jFXobmcvdKHpuXoKnoQ4BmFUThcF6ZlCp3cVst4MO1dOKuIF1YO38HpaBgbZKvfmweXkV+NE7Aa+L6bowj57uNI/E9EAZE0hH8oApMkZy4CdYGYfEQDQEycQTuJML0AoGeWBSDliJCVJdfUFM08pq7BzyMOFMi8A965MG2TU0Sf0AhUNGowCzhK6jFRD5ssQT+L3QJnNl4k4mVUH4uARh0Cv9nQPnu2aafDTeYyZytk2Q0OsRjP/ek50ANmyGBZhkApG6AY/6nOxKUoPZDsWMZYT6iSG9XiHJr31sKrzAEwBn7PZl1HSAQjDWRqnbNc0wfHvaHulL+XdioS2+MjgiPzGjiOU7VciGIUuANiHQK56CPFhe44Gg1wGReAoGsDe8trwaFs/ywaH2u/CVGi/75mNVkLzdY7QPpKSnA2o6YAy/0nZrcBsc/93gWAjIOMa+ePfpL6uS3PaJqTzbpWXUxmI72BQZcbmdT3xiRkNFIB9qZ/ogohmwqtgBdXN8WC06AHqobygNJUhuZTAgQTxtzJsZUF/+Vk0Uwosjx0xTRg/gHyo7NO7d215jZ9I7XamMc0O1I7M4GFLynXZQJD5h95MpCMHg5t04pG4NwYK6Moj0pOC3/7xuhaW1Mw6VH3bBnCoPoCL4z7VeCFW7vofZcnAlY8gSgEOw1aqtfK78qEsozu9W5WfWfn6m4inKA5lzK6wTjY5/y4YigNXw3IrpUILVsPeD/8LV+AhsqPHCUrcD3jh+Ha7dGoCXl1fxRdMLsCikyuZ/xVykhZJWhvXrjfJdLQ5NGI+DpsGjc2ehzwEymbG6H29y/JhylHKjuMABa5fNhIFEGvIVDi8tqoDlCytgYXQY0ic+BnQiLKorY+k0iJYTN/wtt+MHUM83MJey7TC065S7i6kf+RTZu2PNHNPpsGEVjzf1/8fUnKhRGbhQxvhTkqIDsShwHpkSCawasfnoNV6eJ18o6TjVcObApozVB+LQlXIpSuxqWkBqRLMWiodkkKsMMkZNihLXQON0ahE5Cevt/NUeA+wOPFHhCBmnw8665XRtX5+yMfZ3sDng35cjOjVjRaEDkTrgg//SjglPT/qV0CMy9loV23bHR93G/isxpZxlEsMiQyFAOSFkuEQRBxgcMXaWq/D1g9eHXJxfM5eGysChKviFGBBikmACkTX8NFWVYsIJGEqmoe1qFA5c6ZdKCgvwbBp+MfJSQ6d1y8Lqy6oe7QOePWfWObh0qCuZFnk2hc912oBZ6seRILq0ytABKWDvxYDTtnPzOZ64Ds8vOJ9IYYcUUO5y9OtCbI9sWXAQ6B6JyU/QLAEaZXdk+n91rt0uS/M1Ld0dxYVUKQRCXZhWJCZZNPCAKMajBCtGJPCZxnkKAAGwM5A6U1Y5T7o5FCp2p2tkZPiZ7q0Nb8P+0wps+lyGgCS4aFR+hucAiSkOaU43GuR/2Zh3piLEM6GQPflIUE/UBXWjrl7mcxoTibJSm/SLAPb1gM323pfk7op5DiVYO4qbi9h6hc8e2dZQLhjflXZg/TOp0dJfvHB0I9bbOA+MXkRK9nTUoms7kElPWuZz4y/U9SOU+ZvPnkC+meiW+i/SUnfz2aAM0nnERREXnApXurc9hN3yHMayV7Y5Qnc2ze7NeZv0jHkAb0F4A+bdW+dfwJj+TXKXlaia9gyBvD//B3YuXsqcxV/w7flwLc3FtjRcQqWEK1U1Y0pcZHP9RUtfccCvjwx/jdZCzts4HCNAH4I/tYKIGbZP77sjMI5Rmu798bJBzOjfM3seMG7bQHNZMffpsQfAicxvjFhE4L2i11oXXEEpa8lEAlgWNBt9ccF76o0rLogPvU9esZCK+pbo7+4ELluk6BCzcHrSpcTFXxEzNW7rwsM2fTiHAzr8LJ33FuXe6Em5gKJVBxuYx93j96zD0wugpykUYTduh6JNoSZ6zx1impS/QPcoPf695zfR9APgnidc7r+tiR6gD6Ono2B6MS/w0b9ZP8j9e9X9xuphfKcsHg0VvkiGG3F5WOs/fCic5QVsI6hsSvE1tx3DU0mNDsQbIbwSO4/V/e7FL7fQv6cNK8S0Rfvjjz8UDjcy+Vac02k9/THbaoCLEA2vp8sDdbz7jBMwr7999Q13iQnhtQ+HQ9aWoU//g7sdk/HjsVlr9Nlw/wPpMAw7bCK4sAAAAABJRU5ErkJggg==" />',
  "4": '<img src="data:image/png;base64,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" />',
  "5": '<img src="data:image/png;base64,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" />',
  "7": '<img src="data:image/png;base64,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" />',
  "9": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAABfvA/wAAAACXBIWXMAAAsTAAALEwEAmpwYAAACyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NjQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4Kiv76YwAABilJREFUWAm9V2tsFFUUvndmdrd0d4vdbrdAlYINj5aQNiz8MZqgISK/TET6zwcaISaKYlTUaGhjNEiMgcoPISoa//Ew/pKHGEl8/IEWNkptIVUotvaxrXR3+9jO43q+OzPb2XZRtj5uOjt3zj3nO+eeex63jM19cI+od+4h/3dTqTC+7bwvfvC8z1EzJyOUOdgIRYL+eM8q9dT1rHaSvh2afBcFeXMDmpsVJsTsXQnSTWNB64UoLd5LPPctaG2PSqKzJufuDzCAVdzwKM4TBtg3GmsWEjC2/8JpPBIbNKyRZ3K6ZsrmFqYn08w5GgC4iO5LrJiytKHUC6tG5A7q6zlrajJdNpw/W87my+/LbaNth7br7ho7ckRlHR2C5Kyy9y5F/IpRmXy+ocs2jtsudJjzDYDFJATlXFN/ZJaeEFw8mHx2TR/4o+98Fy4PBTdbin9TyjRX39CnIoiGcl9gOKwpPzFhfDmaTn+e3HV3WvK/376IC+ULpmiNwjBXSyMcHY5+ln82u3dL67BzZugJX/XKtdxkj4B58YHEY8FgOHHFKjncPSmaNIvV1ZcGqlYFS6pUIeq7J0RTt+n/BDzVrYlHIaNY4ilf9Yp1zDQuSkwQHR2YYuR7ABTXC7CelA+NZz5eUhF9McV8L4+k0mzLonnGmtoor4wEecDvk/LZKV0MjYyJ9u6kONo3oZWXhVnYMvb0DPcdiIXKn7RU9qH04ozdFzbAYwSmNR9c2juilL5Umkkaz921RFlWE1VU8ptl0eOcpkJmKEQziXblWtLa/8NVayxcoUWM7J6ep+teBY7MKJ5//iDnHwEoGAg4GnB7mvul8jfuX6nW1UYVk8KQNswMeiPr8GAOGtbAA95gethIK9or7nGwo4V1zT4CmUaUBRRwOM9rE8bSt+9ZbAF4clLQTguIwFpnWOSWkhLOfu5OWq99e12pmaf+MjaWbrQD084wlxdvrwe4dFPzWRUL5aGyzdeEf+mWRaUG3J7Nws1/rVwCEg94IfMwxQth3Dk/GH4IawzYdnHLAbkGgCCYPKP1dJJ0voq6iekmQ8DhzLF860MwyMRJFhhM0zbZsoRtxwHApBGAtpWT66mkVrJmbqHIpChvF1KuIdoRcIUSBtTCg8sghSww0rq5Or7toA/YUkdOJ+MwQEBhrDVxxhLKYKz14ilUuBuGEYkFOEOqIdp5zmmFVXqp4IUMZIFxQ9cjbHl8fmz/xdOOjjPM7qJ2TWdxr7g7l9t2P/7Rm6qpbT5F2UwgeQRt29fqgzsaNyjcitF7I7vMRm/T/CODWcFQZBB7hRrdTDD3G7yQgewAYZRrgWFG/QLYjo4NjHQSv30EmNAj+nesGUKnazu0Vi+jXvC7qTBUOBSZYoNQoVyCbL+hMPQJ2awIW+qwwaROCe2g22nIzkqaYpknmKayNiqvqHC2jXjfyuCyKLV1DwnmI0usqRO2FGFPp6E8DtcArNtp2Lye8oaxPzKp4zV86tdjfeMaymsgQDhu7QXDTQZ4wAuZY32TGjBGM2PHJTuwp9NQkrwGOJBUr6mfo3KRiS2RsjKG2t47kBGocHb5FXkx4aWBp7c/I/Z9f9WKUFMChqyCuCPQPWOm3QUMIBZcJmj0PNPwacjS946HKrQ3T3eaKK8qwaAJ0unI1ETKYQ4a1sDT8lWnOUHNCLLAkEodTDn3/CAQ8oenHauG2JoZTX1UUVW1M6PY7RjlFRWuUDtGvByjdoydhxgpH06+WxkKPUFJ+NmttWMECJ0RrlEBVT/pu33FOrOn4/WBnfG30BnJ2t3oD2h/C1WLxQJwoGBItX7KGLgCZw63Y+eVre27fNV1e/TezvNZw79RXu8cHe6u84+gpUV6BHc4pmqNem/XOVPjh8EMQOpqDbXq1OO1JfyIQQ2vY2xyoGM8O2Bx3gHaMmVyK3hct2Pn+m9d55jia5CYAHJ0YIox+wjcdvy3l1Kq7VReJQoVLtQOOcdPEZfSnEz+hGx3B2IiN4j+L1/Lc9CzJlBsF438JYeGrkb/Ewg8ToejcPAY7kqBlrcJd2Hub9c7nDrn13gIKkcrFpb+kyl6oEZAobgjYDwA6UGkgkPD9/813F1Dn3delP4/AfPEInFrI9v9AAAAAElFTkSuQmCC" />',
  "11": '<img src="data:image/png;base64,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" />',
  "12": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAABfvA/wAAAACXBIWXMAAAsTAAALEwEAmpwYAAACyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NjQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4Kiv76YwAABjJJREFUWAmtV2tsVEUUPnOfu9vSlrZbpLRdaCuUIrJkW2qMGKtGIUGFEBr++gNJDNBg4g+iJssfYmIiqRCTSqI//EOaGIIaIDGhTayKULCoIMjLvnh0ZcujbLt3773jOXP37rZ3V7M1TDJ7Z86cxzfnnDkzC1BIi3IJqLvNO3fpj/nLADiDHi67ets+OVUS+XCg1J1DT09mLUOb4wCN5G1E5+5KxYGBpmLJv+++abQB56xM108/mEq9F38nfEGA6OiwXN65fvMBcIzj7sov1hXZ5b4Gv6wev8WVBY0wLfRf5RpUy1Z82mRr47tWXBThiTJ7rsaJX/EICeORtwbU4dvyd2w+b9XAkkanbN+2Bs1cG14uXP794LBxaBTKF6v2vjjARo+OOU2ziTVTLEITxhkHbdLkWr3K+XPhkFIUUBn1teE6bQkk4YFhtDZiXoDYPeZLps0cZ4h5B14AIu5nt7ekYrvC7eUKNN4DmKj060yRJG6aANQlSYJKXYG4ZemluqIJzZmMIeMIHX/yWvQQvQA8y2gM1dici4xkpJrU4txGExIaklOWY3rvXlohDl4d/SZAXGllaXp65vl4ARAzRLoH1GDXL30TFlwB2y7jtkhysebIs8z2rGnZoTc305cHu86uMyvqYpVdZ7YK3qgIx796xAvA0U+/TLgxO8874swITAl0lTeqadcIga2SqxYHJIu30LSm5Ccdor2U7HlBeAEIt7k5MF+GJ4FJ95gkkt91KenNNL+tSVUHfj0q+Yt/e6JrsB09Ns0NcVwfLTh4vi2pFJ2rKi/rg+5uFYVyQHgBZBTPcWDLFTUhrmonQZbftSZuAZfVbVizTikV1U1C19n8Gr0AcnOA58uBtDLMyEdGMR/f+fQmMza01TaNEfTWIrBSFmPSQuD2uHl39M3x+NHn4bPtKYoPSs7ypBdAFmZBOQBQUpIV+T8jL4CcHOD/mQMcrOlJVnXg96+UYOiwpKi1eGLGQFZlzu1bmD9VSkXtF8HyjX0QjWIi5tYHL4CcTbg+o3qAx190qgUCKf7IBtUBBHJ3dIilUi+CZX0kz18IzEodQic+Y8Zv/oFCNjQ3CxGvAS8AsjerDtiYAwzrABYj9nX/n0CdDDLsdPtM+igHVm7m8YmnbneGe7FM+pjmIzVFd3as+lm/fikS67/yEjg3prsfWhfNexm5dKppTvlDiobbN1I2nLkzKdZfxjHRqCmmKXTELsSmBIHx89b4XwlbZgM0Hy3dkoT94qbMMU7rXg+Qm5hTB1a3l9nJpRjHOJcUqny8RJWBOjXyATlB0m1DEHq2kENYrDNyQrk7HPy7s/WwoEczcS8oBCTD3ZdOUg/oCpNKKAQS7pjuBOo0BtsEVZJL7qf8NcLQXkKEsnjUbkZfS+CY5tTIcF7jtOj1APEyEa+dx3SJsy9Ng+ltoTJLVSV2J2nBbeyKwlhbbamdMkDH+/FzQN7slUw7zj3vZCxfywXQ44BavLT67WvM17p+gWK2rqiW+wdHYMyw4Cb2H86PwpqVNdK6oGJelQJriFcoj/al34iF3CMOnFwAHUxcLlxWNkMiARtaQtKl6zH49PQYhHwKhPAdQGOibVhTJ0HiEZZd5KUWbcfXwtyaB4BwHR3D0pFksn71PBkCfo2dvDwOUqkOe15pgj2vYmnHcS/Sinw6W1Usw1jSqCcZx7Sjo1AYHgCOmJV4SIcQ642bRwAqDmlGXcuSHQ6sEUKmUKsz+DwAnNgN7m6/X6NrN849NGEqafD2pUFI4jHvPHZRdAPHLyAtMW3wwUkLFiEvyTh6C48/8XsAICX9eJC5eQQCATgxMGIub6iC99c1QqRYg8g8DT7AcVN9EI4NDJvEg6/FIyjJ07Kkt+A2w5muDMUQd7G7xx9qWPbjENfCr5faxvqWWsWv64xjHUigV46fGTa/fahoIZYcHLp2+VnY34GVMC3rqirgmwcASon/fsz2d1+oq0qZR4ckf5hORGSeIioKhYZ2HrKnBsdV5Y2p7SuGXZkCbM5iyQ+AWNIg4OMe/xJt2Q6LKZtGktNLSKAWY05uv3HtykGxc5d3lurHMSHF2cbC+3vL0sctC3w2T5b78Y0wrk5izlYpaHM787MVOLN/AL6si0gFEAHHAAAAAElFTkSuQmCC" />'
};
function filterWarntype(p, f, o) {
  for (const i in genericWarntyp) {
    const id = i;
    const w = genericWarntyp[id];
    if (w[p] == void 0)
      continue;
    if (Array.isArray(w[p]) && w[p].indexOf(o) != -1) {
      if (f.indexOf(String(id)) == -1) {
        return false;
      }
    }
  }
  return true;
}
const warnTypeName = {
  uwzService: {
    "0": "textLevels.textGeneric.0",
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
    "0": "textLevels.textGeneric.0",
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
    "0": "textLevels.textGeneric.0",
    "22": "warnTypeName.dwdService.22",
    "24": "warnTypeName.dwdService.24",
    "31": "warnTypeName.dwdService.31",
    "33": "warnTypeName.dwdService.33",
    "34": "warnTypeName.dwdService.33",
    "36": "warnTypeName.dwdService.33",
    "38": "warnTypeName.dwdService.33",
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
    "90": "warnTypeName.dwdService.31",
    "91": "warnTypeName.dwdService.33",
    "92": "warnTypeName.dwdService.33",
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
const dwdLevel = { none: 0, minor: 1, moderate: 2, severe: 3, extreme: 4 };
const status = {
  new: "message.status.new",
  hold: "message.status.hold",
  clear: "message.status.clear"
};
const daytimes = {
  morning: { start: 6, end: 10 },
  forenoon: { start: 10, end: 12 },
  noon: { start: 12, end: 14 },
  afternoon: { start: 14, end: 17 },
  evening: { start: 17, end: 21 },
  night: { start: 21, end: 6 }
};
const temporalAdverbs = {
  yesterday: -1,
  today: 0,
  tomorrow: 1,
  tomorrow2: 2
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  color,
  customFormatedTokensJson,
  daytimes,
  dwdLevel,
  filterWarntype,
  genericWarntyp,
  genericWarntypState,
  isKeyOfObject,
  level,
  status,
  temporalAdverbs,
  textLevels,
  warnTypeIconsBase64,
  warnTypeName
});
//# sourceMappingURL=messages-def.js.map
