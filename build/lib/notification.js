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
var import_messages_def = require("./def/messages-def");
class NotificationClass extends library.BaseClass {
  options;
  takeThemAll = false;
  providerDB;
  removeAllSend = true;
  constructor(adapter, notifcationOptions) {
    super(adapter, notifcationOptions.name);
    this.log.debug(`Create notification service ${this.name}`);
    this.options = notifcationOptions;
    this.options = Object.assign(this.options, NotificationType.serciceCapabilities[notifcationOptions.name]);
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
          if (this.adapter.providerController) {
            const targets = [...providers, this.adapter.providerController];
            for (const a in targets) {
              switch (this.options.name) {
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
              const state = this.adapter.library.readdp(dp);
              if (state == void 0) {
                await this.adapter.library.writedp(dp, "[]", def);
              }
            }
          }
        }
        break;
    }
  }
  async sendMessage(providers, allowActions, manual = false) {
    let activeWarnings = 0;
    const filter = manual && this.options.filter.manual ? this.options.filter.manual : this.options.filter.auto;
    const actions = this.options.actions;
    let result = [];
    const notifications = this.options.notifications;
    for (const a in providers) {
      if (this.options.service.indexOf(providers[a].service) == -1)
        continue;
      for (const b in providers[a].messages) {
        const message = providers[a].messages[b];
        if (message && (filter.level === void 0 || filter.level <= message.level) && !(0, import_messages_def.filterWarntype)(providers[a].service, filter.type, message.type)) {
          if (message.notDeleted)
            activeWarnings++;
          for (const c in actions) {
            const action = c;
            if (manual && NotificationType.manual.indexOf(action) == -1)
              continue;
            if (action == void 0 || actions[action] == "none" || actions[action] == "")
              continue;
            if (!allowActions.includes(action))
              continue;
            if (!notifications.includes(action))
              continue;
            const templateKey = actions[action];
            if (!templateKey)
              continue;
            if (manual || action == "new" && message.newMessage || action == "remove" && !message.notDeleted || action == "manualAll" || action == "all" && notifications.includes("all") && !notifications.includes("new") && !notifications.includes("remove")) {
              const msg = await message.getMessage(templateKey);
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
    }
    if (manual && result.findIndex((a) => a.action != "removeAll") > -1) {
      result = result.filter((a) => a.action != "removeAll");
    }
    if (result.length > 0 && activeWarnings > 0) {
      await this.sendNotifications(result);
      this.removeAllSend = false;
    } else {
      if (this.options.notifications.includes("removeAll") && this.options.actions["removeAll"] != "none" && (manual || !this.removeAllSend && activeWarnings == 0)) {
        const templates = this.adapter.config.templateTable;
        const tempid = templates.findIndex((a) => a.templateKey == this.options.actions["removeAll"]);
        if (tempid != -1) {
          this.sendNotifications([
            {
              text: templates[tempid].template.replaceAll("\\}", "}"),
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
  canManual() {
    if (this.options.notifications.findIndex((a) => NotificationType.manual.indexOf(a) != -1) != -1)
      return true;
    return false;
  }
  async sendNotifications(messages) {
    if (!Array.isArray(messages) || messages.length == 0) {
      this.log.debug(`no messages`);
      return false;
    }
    switch (this.options.name) {
      case "telegram":
        {
          for (const msg of messages) {
            const opt = { text: msg.text, disable_notification: this.options.withNoSound };
            if (this.options.parse_mode != "none")
              opt.parse_mode = this.options.parse_mode;
            if (this.options.userid.length > 0 || this.options.chatid.length > 0) {
              if (this.options.userid.length > 0)
                opt.user = this.options.userid;
              if (this.options.chatid.length > 0) {
                const chatids = this.options.chatid.split(",");
                for (const chatid of chatids)
                  await this.adapter.sendToAsync(this.options.adapter, "send", {
                    ...opt,
                    chatid
                  });
              } else {
                await this.adapter.sendToAsync(this.options.adapter, "send", opt);
              }
            } else
              await this.adapter.sendToAsync(this.options.adapter, "send", opt);
            this.log.debug(`Send the message: ${msg.text}`);
          }
        }
        break;
      case "pushover":
        {
          for (const msg of messages) {
            const opt = {
              message: msg.text,
              sound: this.options.sound || "none"
            };
            if (this.options.priority)
              opt.priority = msg.message ? msg.message.level - 2 : -1;
            if (this.options.device.length > 0)
              opt.device = this.options.device;
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
          let opt = "";
          if (this.options.sounds_enabled) {
            const prefix = `${this.options.volumen}`;
            for (const a in devices) {
              for (const msg of messages) {
                if (Array.isArray(msg))
                  continue;
                let index = -1;
                if (msg.message !== void 0 && msg.message.notDeleted)
                  index = this.options.sounds.findIndex(
                    (a2) => a2.warntypenumber == Number(msg.message.genericType)
                  );
                else
                  index = this.options.sounds.findIndex((a2) => a2.warntypenumber == 0);
                const sound = this.options.sounds[index].sound;
                if (sound)
                  opt += `;${sound}${msg.text}`;
                else
                  opt += `;${msg.text}`;
              }
              this.log.debug(`Send to alexa2: ${prefix + opt}`);
              if (opt != "") {
                await this.adapter.setForeignStateAsync(
                  `${this.options.adapter}.Echo-Devices.${devices[a]}.Commands.speak`,
                  prefix + opt
                );
              }
            }
          } else {
            const prefix = `${this.options.volumen}${this.options.audio ? `;${this.options.audio}` : ""}`;
            for (const a in devices) {
              for (const msg of messages) {
                if (Array.isArray(msg))
                  continue;
                opt += `;${msg.text}`;
              }
              this.log.debug(`Send to alexa2: ${prefix + opt}`);
              if (opt != "") {
                await this.adapter.setForeignStateAsync(
                  `${this.options.adapter}.Echo-Devices.${devices[a]}.Commands.speak`,
                  prefix + opt
                );
              }
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
            let newMsg = { message: msg.text };
            if (this.adapter.config.history_allinOne) {
              newMsg = { ...msg.message.formatedData, ts: Date.now() };
            }
            const targets = [msg.provider.name, msg.provider.providerController.name];
            for (const a in targets) {
              try {
                const dp = `${targets[a]}.history`;
                const state = this.adapter.library.readdp(dp);
                let json = [];
                if (state && state.val && typeof state.val == "string" && state.val != "")
                  json = JSON.parse(state.val);
                json.unshift(newMsg);
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
          if (this.adapter.providerController) {
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
          this.log.info(`start email sending! Messagecount: ${messages.length}`);
          const result = messages.filter((i, p) => {
            if (i.text != "" && i.provider) {
              if (messages.findIndex((i2) => i2.text == i.text) == p)
                return true;
            }
            return false;
          });
          this.log.info(`first filter! Messagecount: ${result.length}`);
          result.sort((a, b) => a.startts - b.startts);
          const opt = {};
          opt.html = result.map((a) => a.text).join(this.adapter.config.email_line_break);
          const templates = this.adapter.config.templateTable;
          this.log.info(`Email message: ${messages.length} warnings`);
          let token = "message.status.new";
          if (messages[0].action == "removeAll")
            token = "message.status.clear";
          opt.subject = await this.adapter.library.getTranslation(token);
          if (this.adapter.config.email_Header !== "none") {
            const tempid = templates.findIndex((a) => a.templateKey == this.adapter.config.email_Header);
            if (tempid != -1) {
              const temp = templates[tempid].template.replace(
                "${emailheader}",
                await this.adapter.library.getTranslation(token)
              );
              opt.html = temp + opt.html;
            }
          }
          if (this.adapter.config.email_Footer !== "none") {
            const tempid = templates.findIndex((a) => a.templateKey == this.adapter.config.email_Footer);
            if (tempid != -1) {
              opt.html = opt.html + templates[tempid].template;
            }
          }
          this.log.debug(`start email sending! Messagecount: ${result.length}`);
          await this.adapter.sendToAsync(this.options.adapter, "send", opt);
          this.log.debug(`Send the message: ${JSON.stringify(opt)}`);
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
