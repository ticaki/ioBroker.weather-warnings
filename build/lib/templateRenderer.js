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
var templateRenderer_exports = {};
__export(templateRenderer_exports, {
  finalizeTemplateText: () => finalizeTemplateText,
  renderTemplate: () => renderTemplate
});
module.exports = __toCommonJS(templateRenderer_exports);
function renderTemplate(start, templateKey, formatedData, templates, log) {
  let msg = "";
  if (!formatedData) {
    return msg;
  }
  let count = 0;
  while (count++ < 100) {
    let rerun = false;
    const template = (msg === "" ? start : msg).replaceAll("iconbase64", "htmlicon");
    if (!template) {
      break;
    }
    const temp = template.split(/(?<!\\)\${/g);
    msg = temp[0];
    for (let b = 1; temp.length > b; b++) {
      const t = temp[b].split(/(?<!\\)}/g);
      const key = t[0];
      const configTemplate = templates.filter((a) => a.templateKey == key);
      if (key[0] == "[") {
        const arraykey = key.split("]");
        arraykey[0] = arraykey[0].slice(1);
        if (arraykey[1] && formatedData[arraykey[1]] !== void 0) {
          const n = formatedData[arraykey[1]];
          if (n != "" && !Number.isNaN(n)) {
            try {
              msg += arraykey[0].split(",")[formatedData[arraykey[1]]].trim();
            } catch {
              log.error(`Array is not an array ${arraykey[0]} or index out of range ${n}.`);
            }
          }
        } else {
          log.error(`Unknown or not a number key ${arraykey[1]} in template ${templateKey}!`);
        }
      } else if (key[0] == "(") {
        const arraykey = key.split(")");
        arraykey[0] = arraykey[0].slice(1);
        for (const a of ["<", ">", "=", "!="]) {
          if (arraykey[0].indexOf(a) == -1) {
            continue;
          }
          const funcarray = arraykey[0].split(a);
          const n = formatedData[funcarray[1].trim()];
          if (n !== void 0) {
            let result = false;
            switch (a) {
              case ">":
                {
                  result = funcarray[0].trim() > n;
                }
                break;
              case "<":
                {
                  result = funcarray[0].trim() < n;
                }
                break;
              case "=":
                {
                  result = funcarray[0].trim() == n;
                }
                break;
              case "!=":
                {
                  result = funcarray[0].trim() != n;
                }
                break;
            }
            let temp2 = "";
            if (arraykey[1].indexOf("#") != -1) {
              if (result) {
                temp2 = arraykey[1].split("#")[0];
              } else {
                temp2 = arraykey[1].split("#")[1] !== void 0 ? arraykey[1].split("#")[1] : "";
              }
            } else if (result) {
              temp2 = arraykey[1];
            }
            if (temp2.indexOf("\\${") != -1) {
              temp2 = temp2.replace(/\\\${/g, "${");
              temp2 = temp2.replace(/\\+}/g, "}");
              rerun = true;
            }
            msg += temp2;
          } else {
            log.error(`Unknown key ${funcarray[1]} in template ${templateKey}!`);
            break;
          }
        }
      } else if (configTemplate.length == 1) {
        msg += configTemplate[0].template;
        rerun = true;
      } else if (key && formatedData[key] !== void 0) {
        msg += formatedData[key];
      } else if (key && formatedData[key.toLowerCase()] !== void 0) {
        let m = formatedData[key.toLowerCase()];
        if (typeof m == "string" && m.length > 0) {
          m = m[0].toUpperCase() + (key[key.length - 1] == key[key.length - 1].toUpperCase() ? m.slice(1).toUpperCase() : m.slice(1));
        }
        msg += m;
      } else {
        msg += key;
      }
      if (t.length > 1) {
        msg += t[1];
      }
    }
    if (!rerun) {
      break;
    }
  }
  return msg;
}
function finalizeTemplateText(msg) {
  return msg.replace(/\\+}/g, "}").replace(/\\+n/g, "\n");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  finalizeTemplateText,
  renderTemplate
});
//# sourceMappingURL=templateRenderer.js.map
