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
var notification_exports = {};
__export(notification_exports, {
  NotificationClass: () => NotificationClass
});
module.exports = __toCommonJS(notification_exports);
var import_definitionen = require("./def/definitionen");
var NotificationType = __toESM(require("./def/notificationService-def"));
var library = __toESM(require("./library"));
class NotificationClass extends library.BaseClass {
  options;
  takeThemAll = false;
  config;
  providerDB;
  removeAllSend = true;
  constructor(adapter, notifcationOptions) {
    super(adapter, notifcationOptions.name);
    this.log.debug(`Create notification service ${this.name}`);
    this.options = notifcationOptions;
    this.config = NotificationType.serciceCapabilities[notifcationOptions.name];
  }
  async init() {
    switch (this.name) {
      case "history":
      case "json":
        {
          let dp = "";
          let def = import_definitionen.genericStateObjects.history;
          const providers = this.adapter.providerController.providers.filter(
            (a) => this.options.service.includes(a.service)
          );
          const targets = [...providers, this.adapter.providerController];
          for (const a in targets) {
            switch (this.name) {
              case "history":
                {
                  dp = `${targets[a].name}.history`;
                  def = import_definitionen.genericStateObjects.history;
                }
                break;
              case "json":
                {
                  dp = `${targets[a].name}.activeWarnings_json`;
                  def = import_definitionen.genericStateObjects.activeWarningsJson;
                }
                break;
            }
            const state = this.adapter.library.getdb(dp);
            if (state == void 0) {
              await this.adapter.library.writedp(dp, "[]", def);
            }
          }
        }
        break;
    }
  }
  async sendMessage(providers, allowActions, override = false) {
    let activeWarnings = 0;
    const result = [];
    for (const a in providers) {
      if (this.options.service.indexOf(providers[a].service) == -1)
        continue;
      for (const b in providers[a].messages) {
        const message = providers[a].messages[b];
        if (message && (this.options.filter.level === void 0 || this.options.filter.level <= message.level) && this.options.filter.type.indexOf(String(message.genericType)) == -1) {
          if (message.notDeleted)
            activeWarnings++;
          for (const c in this.options.actions) {
            const action = c;
            if (this.options.actions[action] == "none" || this.options.actions[action] == "" || action == void 0)
              continue;
            if (!allowActions.includes(action))
              continue;
            if (!this.config.notifications.includes(action))
              continue;
            const msg = await this.getMessage(
              message,
              this.config.notifications,
              this.options.actions[action],
              action,
              override
            );
            if (msg.text != "") {
              msg.action = action;
              msg.provider = providers[a];
              msg.message = message;
              result.push(msg);
            }
          }
        }
      }
    }
    if (result.length > 0 && activeWarnings > 0) {
      await this.sendNotifications(result);
      this.removeAllSend = false;
    } else {
      if (this.config.notifications.includes("removeAll") && this.options.actions["removeAll"] != "none" && (override || !this.removeAllSend && activeWarnings == 0)) {
        const templates = this.adapter.config.templateTable;
        const tempid = templates.findIndex((a) => a.templateKey == this.options.actions["removeAll"]);
        if (tempid != -1) {
          this.sendNotifications([
            {
              text: templates[tempid].template.replaceAll("\\", ""),
              startts: 1,
              template: templates[tempid].template,
              action: "removeAll"
            }
          ]);
        }
        this.removeAllSend = true;
      }
    }
  }
  async getMessage(message, templateType, templateKey, action, override = false) {
    return await message.getMessage(templateType, templateKey, action, override);
  }
  async sendNotifications(messages) {
    if (!Array.isArray(messages) || messages.length == 0)
      return false;
    switch (this.name) {
      case "telegram":
        {
          for (const msg of messages) {
            const opt = { text: msg.text, disable_notification: true };
            await this.adapter.sendToAsync(this.options.adapter, "send", opt);
            this.log.debug(`Send the message: ${msg.text}`);
          }
        }
        break;
      case "pushover":
        {
          for (const msg of messages) {
            const opt = { message: msg.text };
            await this.adapter.sendToAsync(this.options.adapter, "send", opt);
            this.log.debug(`Send the message: ${msg.text}`);
          }
        }
        break;
      case "whatsapp":
        {
          for (const msg of messages) {
            if (Array.isArray(msg))
              return false;
            const service = this.options.adapter.replace("whatsapp", "whatsapp-cmb");
            const opt = { text: msg.text };
            await this.adapter.sendToAsync(service, "send", opt);
            this.log.debug(`Send the message: ${msg.text}`);
          }
        }
        break;
      case "alexa2":
        {
          const devices = this.adapter.config.alexa2_device_ids;
          if (devices.length == 0)
            break;
          let opt = `${this.adapter.config.alexa2_volumen}`;
          for (const a in devices) {
            for (const msg of messages) {
              if (Array.isArray(msg))
                continue;
              opt += `;${msg.text}`;
            }
            if (opt != `${this.adapter.config.alexa2_volumen}`) {
              await this.adapter.setForeignStateAsync(
                `${this.options.adapter}.Echo-Devices.${devices[a]}.Commands.speak`,
                opt
              );
            }
          }
        }
        break;
      case "history":
        {
          for (const msg of messages) {
            if (Array.isArray(msg))
              return false;
            if (!msg || !msg.provider || !this.adapter.config.history_Enabled || !msg.message)
              return false;
            let newMsg = msg.text;
            if (this.adapter.config.history_allinOne) {
              newMsg = JSON.stringify({ ...msg.message.formatedData, ts: Date.now() });
            }
            const targets = [msg.provider.name, msg.provider.providerController.name];
            for (const a in targets) {
              try {
                const dp = `${targets[a]}.history`;
                const state = this.adapter.library.getdb(dp);
                let json = [];
                if (state && state.val && typeof state.val == "string" && state.val != "")
                  json = JSON.parse(state.val);
                json.unshift(typeof newMsg == "object" ? JSON.parse(newMsg) : newMsg);
                json.splice(500);
                await this.adapter.library.writedp(
                  dp,
                  JSON.stringify(json),
                  import_definitionen.genericStateObjects.history
                );
              } catch (error) {
                this.log.error(
                  `${this.name} template has wrong formate. ${this.name} deactivated! template: ${msg.action ? this.options.actions[msg.action] : "unknown"}, message: ${msg}`
                );
                this.adapter.config.history_Enabled = false;
                return false;
              }
            }
          }
        }
        break;
      case "json":
        {
          let result = [];
          let providers = [];
          for (const a in messages) {
            try {
              const temp = this.adapter.config.json_parse ? JSON.parse(messages[a].text) : messages[a].text;
              result.push({
                startts: messages[a].startts,
                message: temp,
                provider: messages[a].provider
              });
              providers.push(messages[a].provider !== void 0 ? messages[a].provider.name : "");
            } catch (error) {
              this.log.error(
                `Json template has wrong formate. Conversion deactivated! template: ${messages[a].template}, message: ${messages[a].text}`
              );
              this.adapter.config.json_parse = false;
              continue;
            }
          }
          providers = providers.filter((i, p) => {
            if (i != "") {
              if (providers.indexOf(i) == p)
                return true;
            }
            return false;
          });
          result = result.filter((i, p) => {
            if (i.message != "" && i.provider) {
              if (result.findIndex(
                (i2) => i2.provider.name == i.provider.name && i2.message == i.message
              ) == p)
                return true;
            }
            return false;
          });
          result.sort((a, b) => {
            if (a.provider > b.provider)
              return 1;
            else if (a.provider < b.provider)
              return -1;
            else
              return a.startts - b.startts;
          });
          for (const p of providers) {
            const dp = p + ".activeWarnings_json";
            const data = result.filter((a) => a.provider && a.provider.name == p).map((a) => a.message);
            await this.adapter.library.writedp(
              dp,
              JSON.stringify(data),
              import_definitionen.genericStateObjects.activeWarningsJson
            );
          }
          result = result.filter((i, p) => {
            if (i.message != "" && i.provider) {
              if (result.findIndex((i2) => i2.message == i.message) == p)
                return true;
            }
            return false;
          });
          {
            const dp = this.adapter.providerController.name + ".activeWarnings_json";
            await this.adapter.library.writedp(
              dp,
              JSON.stringify(result.map((a) => a.message)),
              import_definitionen.genericStateObjects.activeWarningsJson
            );
          }
        }
        break;
      case "email":
        {
          const result = messages.filter((i, p) => {
            if (i.text != "" && i.provider) {
              if (messages.findIndex((i2) => i2.text != i.text) == p)
                return true;
            }
            return false;
          });
          result.sort((a, b) => a.startts - b.startts);
          const flat = result.map((a) => a.text);
          let message = flat.join(this.adapter.config.email_line_break);
          const templates = this.adapter.config.templateTable;
          if (this.adapter.config.email_Header !== "none") {
            const tempid = templates.findIndex((a) => a.templateKey == this.adapter.config.email_Header);
            if (tempid != -1) {
              let token = "notification.warning";
              if (messages[0].action == "removeAll")
                token = "notification.allclear";
              const temp = templates[tempid].template.replace(
                "${emailheader}",
                await this.adapter.library.getTranslation(token)
              );
              message = temp + message;
            }
          }
          if (this.adapter.config.email_Footer !== "none") {
            const tempid = templates.findIndex((a) => a.templateKey == this.adapter.config.email_Header);
            if (tempid != -1) {
              message = message + templates[tempid];
            }
          }
          await this.adapter.sendToAsync(this.options.adapter, "send", message);
          this.log.debug(`Send the message: ${message}`);
        }
        break;
    }
    return true;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NotificationClass
});
//# sourceMappingURL=notification.js.map
