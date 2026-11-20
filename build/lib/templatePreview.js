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
var templatePreview_exports = {};
__export(templatePreview_exports, {
  buildTemplatePreview: () => buildTemplatePreview
});
module.exports = __toCommonJS(templatePreview_exports);
var import_messages = require("./messages");
var import_test_warnings = require("./test-warnings");
var import_templateRenderer = require("./templateRenderer");
const MAX_PREVIEWS = 3;
async function buildTemplatePreview(adapter, request) {
  var _a, _b;
  const errors = [];
  const log = {
    error: (...message) => {
      const text = message.join(" ");
      if (!errors.includes(text)) {
        errors.push(text);
      }
    }
  };
  const templates = Array.isArray(request.templateTable) ? request.templateTable : adapter.config.templateTable;
  const templateKey = request.templateKey || "preview";
  const template = typeof request.template === "string" ? request.template : "";
  const sources = [];
  const providers = (_b = (_a = adapter.providerController) == null ? void 0 : _a.providers) != null ? _b : [];
  for (const provider of providers) {
    for (const message of provider.messages) {
      if (sources.length >= MAX_PREVIEWS) {
        break;
      }
      if (!message.formatedData || message.name === "noMessage") {
        continue;
      }
      sources.push({ label: describe(message.formatedData), sample: false, data: message.formatedData });
    }
  }
  if (sources.length === 0 && providers.length > 0 && adapter.providerController) {
    const provider = providers[0];
    const raw = (0, import_test_warnings.getPreviewSample)(provider.service);
    if (raw) {
      const message = new import_messages.MessagesClass(adapter, "preview", provider, raw, adapter.providerController);
      try {
        const data = await message.updateFormated();
        sources.push({ label: describe(data), sample: true, data });
      } catch (error) {
        errors.push(`Sample data could not be formatted: ${String(error)}`);
      } finally {
        await message.delete();
      }
    }
  }
  const results = sources.map((source) => ({
    label: source.label,
    sample: source.sample,
    text: (0, import_templateRenderer.finalizeTemplateText)((0, import_templateRenderer.renderTemplate)(template, templateKey, source.data, templates, log))
  }));
  return { results, errors };
}
function describe(data) {
  if (!data) {
    return "";
  }
  return [data.provider, data.locationcustom || data.location, data.headline].filter((a) => a !== void 0 && a !== "").join(" \u2013 ");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildTemplatePreview
});
//# sourceMappingURL=templatePreview.js.map
