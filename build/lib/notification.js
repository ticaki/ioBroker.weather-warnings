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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var notification_exports = {};
__export(notification_exports, {
  NotificationClass: () => NotificationClass
});
module.exports = __toCommonJS(notification_exports);
var import_definition = require("./def/definition");
var NotificationType = __toESM(require("./def/notificationService-def"));
var library = __toESM(require("./library"));
var import_messages_def = require("./def/messages-def");
class NotificationClass extends library.BaseClass {
  options;
  takeThemAll = false;
  providerDB;
  removeAllSend = true;
  //clearAll(): void {}
  /**
   * Creates a new notification class.
   *
   * @param adapter The adapter instance.
   * @param notifcationOptions The options for the notification service.
   */
  constructor(adapter, notifcationOptions) {
    super(adapter, notifcationOptions.name);
    this.options = notifcationOptions;
    this.options = Object.assign(this.options, NotificationType.serciceCapabilities[notifcationOptions.name]);
    this.log.info(
      `Create notification service ${this.name}${this.options.adapter != void 0 ? this.name == "alexa2" ? ` state: ${this.adapter.config.alexa2_device_ids.map((a) => `${this.options.adapter}.Echo-Devices.${a}.Commands.speak`).join(", ")}` : ` adapter: ${this.options.adapter}` : ""}.`
    );
    this.log.setLogPrefix(this.options.adapter != void 0 ? this.options.adapter : this.name);
  }
  /**
   * Initialisiere class - create channel, states etc
   */
  async init() {
    switch (this.name) {
      case "history":
      case "json":
        {
          let dp = "";
          let def = import_definition.genericStateObjects.history;
          const providers = this.adapter.providerController.providers.filter(
            (a) => this.options.service.includes(a.service)
          );
          if (this.adapter.providerController) {
            const targets = [...providers, this.adapter.providerController];
            for (const a of targets) {
              switch (this.options.name) {
                case "history":
                  {
                    dp = `${a.name}.history`;
                    def = import_definition.genericStateObjects.history;
                  }
                  break;
                case "json":
                  {
                    dp = `${a.name}.activeWarnings_json`;
                    def = import_definition.genericStateObjects.activeWarningsJson;
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
  /**
   * Sends notifications based on the `allowActions` array.
   *
   * @param providers - The providers to get messages from.
   * @param allowActions - The actions that are allowed to be sent.
   * @param manual - If true, sends all messages, otherwise only sends messages that have changed.
   */
  async sendMessage(providers, allowActions, manual = false) {
    if (!manual && !this.allowSending()) {
      this.log.debug("Sending the notification is not allowed.");
      return;
    }
    let activeWarnings = 0;
    const filter = manual && this.options.filter.manual ? this.options.filter.manual : this.options.filter.auto;
    const actions = this.options.actions;
    let result = [];
    const notifications = this.options.notifications;
    for (const a of providers) {
      if (this.options.service.indexOf(a.service) == -1) {
        continue;
      }
      for (const message of a.messages) {
        if (message && (filter.level === void 0 || filter.level <= message.level) && !(0, import_messages_def.filterWarntype)(a.service, filter.type, message.type)) {
          if (message.notDeleted) {
            activeWarnings++;
          }
          for (const c in actions) {
            const action = c;
            if (manual && NotificationType.manual.indexOf(action) == -1) {
              continue;
            }
            if (action == void 0 || actions[action] == "none" || actions[action] == "") {
              continue;
            }
            if (!allowActions.includes(action)) {
              continue;
            }
            if (!notifications.includes(action)) {
              continue;
            }
            const templateKey = actions[action];
            if (!templateKey || templateKey == "none") {
              continue;
            }
            if (action == "removeAll") {
              continue;
            }
            if (manual || // get every message
            action == "new" && message.newMessage || // new message
            action == "remove" && !message.notDeleted || // remove message
            action == "manualAll" || action == "all" && // bei Diensten mit all sollten keine neuen oder entfernten nachrichten bei all durchlaufen.
            notifications.includes("all") && !(notifications.includes("new") && message.newMessage) && !(notifications.includes("remove") && !message.notDeleted)) {
              const msg = await message.getMessage(templateKey, this);
              if (msg.text != "") {
                msg.action = action;
                msg.provider = a;
                msg.message = message;
                if (notifications.includes("title") && actions.title !== void 0 && actions.title !== "none") {
                  const title = await message.getMessage(actions.title, this);
                  msg.title = title.text;
                }
                result.push(msg);
              }
            }
          }
        }
      }
    }
    if (notifications.includes("all") && notifications.includes("new") && notifications.includes("remove")) {
      let sendthem = manual;
      if (!sendthem) {
        for (const msg of result) {
          if (msg.message && (msg.message.newMessage || !msg.message.notDeleted)) {
            sendthem = true;
            break;
          }
        }
      }
      if (!sendthem) {
        result = [];
      } else {
        result.sort((a, b) => {
          if (!a.message) {
            return 1;
          }
          if (!b.message) {
            return -1;
          }
          if (a.message.newMessage && b.message.newMessage || !a.message.notDeleted && !b.message.notDeleted) {
            return a.startts == b.startts ? 0 : a.startts < b.startts ? -1 : 1;
          }
          if (a.message.newMessage) {
            return -1;
          }
          if (b.message.newMessage) {
            return 1;
          }
          if (!a.message.notDeleted) {
            return -1;
          }
          if (!b.message.notDeleted) {
            return 1;
          }
          return a.startts == b.startts ? 0 : a.startts < b.startts ? -1 : 1;
        });
      }
    }
    if (result.length > 0 && (activeWarnings > 0 || !notifications.includes("removeAll"))) {
      await this.sendNotifications(result);
      this.removeAllSend = false;
    } else {
      if (!manual && this.options.notifications.includes("removeAll") && this.options.actions.removeAll != "none" && allowActions.includes("removeAll") && !this.removeAllSend && activeWarnings == 0 || this.options.notifications.includes("removeManualAll") && this.options.actions.removeManualAll && this.options.actions.removeManualAll != "none" && allowActions.includes("removeAll") && manual) {
        const templates = this.adapter.config.templateTable;
        const tempid = templates.findIndex(
          (a) => a.templateKey == this.options.actions[manual ? "removeManualAll" : "removeAll"]
        );
        if (tempid != -1) {
          const result2 = await this.adapter.providerController.noWarning.getMessage(
            this.options.actions[manual ? "removeManualAll" : "removeAll"],
            this
          );
          const msg = [
            {
              text: result2.text,
              // templates[tempid].template.replaceAll('\\}', '}'),
              startts: result2.startts,
              template: result2.template,
              action: result2.action
            }
          ];
          const res = this.options.actions.title && this.options.actions.title != "none" && templates.findIndex((a) => a.templateKey == this.options.actions.title) != -1 ? await this.adapter.providerController.noWarning.getMessage(
            this.options.actions.title,
            this
          ) : null;
          if (res !== null && res.text) {
            msg[0].title = res.text;
          }
          await this.sendNotifications(msg);
        }
        this.removeAllSend = true;
      }
    }
  }
  /**
   * Returns true if the given notification service is allowed to send notifications.
   *
   * For some services like alexa2 and sayit, the result of `isSpeakAllowed` is used.
   * For all other services, always true is returned.
   */
  allowSending() {
    switch (this.options.name) {
      case "telegram":
      case "gotify":
      case "pushover":
      case "whatsapp":
      case "json":
      case "history":
      case "email":
        break;
      case "sayit":
      case "alexa2": {
        return this.adapter.providerController.isSpeakAllowed();
      }
    }
    return true;
  }
  /**
   * Checks if the given notification service is allowed to send manual messages.
   *
   * A notification service is allowed to send manual messages if its configuration
   * includes at least one of the following actions: 'manualAll', 'removeManualAll'.
   *
   * @returns true if the given notification service is allowed to send manual messages, false otherwise.
   */
  canManual() {
    if (this.options.notifications.findIndex((a) => NotificationType.manual.indexOf(a) != -1) != -1) {
      return true;
    }
    return false;
  }
  /**
   * Goes through all messages and removes unwanted information from sayit and alexa2 messages.
   * This function is used to clean up the messages before sending them to the user.
   *
   * @param messages The array of messages to clean up.
   * @returns The cleaned up messages.
   */
  cleanupMessage(messages) {
    for (const message of messages) {
      if (message === null || message == void 0) {
        continue;
      }
      switch (this.options.name) {
        case "telegram":
        case "gotify":
        case "pushover":
        case "whatsapp":
        case "json":
        case "history":
        case "email":
          break;
        case "sayit":
        case "alexa2": {
          switch (this.library.language) {
            case "en":
            case "ru":
            case "pt":
            case "nl":
            case "fr":
            case "it":
            case "es":
            case "pl":
            case "zh-cn":
            case "uk":
            case "de":
              {
                message.text = message.text.replace(/\([0-9]+.m\/s, [0-9]+.kn, Bft.[0-9]+../g, "");
                message.text = message.text.replace(/°C/g, this.library.getTranslation("celsius"));
                message.text = message.text.replace(/km\/h/g, this.library.getTranslation("kmh"));
                message.text = message.text.replace(/l\/m²/g, this.library.getTranslation("lm"));
                message.text = message.text.replace(
                  / [a-zA-Z][a-zA-Z], \d{1,2}\.\d{1,2}\.\d{4} /g,
                  (x) => this.library.convertSpeakDate(x, this.options.name, true)
                );
                message.text = message.text.replace(/\\+n/g, "");
                let count = 0;
                let pos = 250;
                while (pos <= message.text.length && count++ < 50) {
                  const oldpos = pos;
                  pos = message.text.lastIndexOf(";", oldpos);
                  if (pos == -1 || pos == oldpos - 250) {
                    pos = message.text.lastIndexOf(".", oldpos);
                  }
                  if (pos == -1) {
                    pos = message.text.lastIndexOf(" ", oldpos);
                  }
                  if (pos == -1) {
                    break;
                  }
                  message.text = `${message.text.slice(0, pos)};${message.text.slice(pos + 1)}`;
                  pos += 250;
                }
              }
              break;
          }
        }
      }
    }
    return messages;
  }
  /**
   * @description Send notifications based on the settings of the adapter
   * @param  messages - The messages to be sent.
   * @returns A promise that resolves to True if the sending was successful, false if not.
   * @example
   * adapter.sendNotifications([
   *     {
   *         text: 'Hello World',
   *     },
   *     {
   *         text: 'Hello Universe',
   *     },
   * ]);
   */
  async sendNotifications(messages) {
    if (!Array.isArray(messages) || messages.length == 0) {
      this.log.debug(`no messages`);
      return false;
    }
    messages = this.cleanupMessage(Object.assign([], messages));
    switch (this.options.name) {
      case "telegram":
        {
          for (const msg of messages) {
            const opt = { text: msg.text, disable_notification: this.options.withNoSound };
            if (this.options.parse_mode != "none") {
              opt.parse_mode = this.options.parse_mode;
            }
            try {
              if (this.options.userid.length > 0 || this.options.chatid.length > 0) {
                if (this.options.userid.length > 0) {
                  opt.user = this.options.userid;
                }
                if (this.options.chatid.length > 0) {
                  const chatids = this.options.chatid.split(",");
                  for (const chatid of chatids) {
                    this.adapter.sendTo(this.options.adapter, "send", {
                      ...opt,
                      chatId: chatid
                    });
                  }
                } else {
                  this.adapter.sendTo(this.options.adapter, "send", opt);
                }
              } else {
                this.adapter.sendTo(this.options.adapter, "send", opt);
              }
              await library.sleep(20);
              this.log.debug(`Send the message: ${msg.text}`);
            } catch (error) {
              if (error.message == "Timeout exceeded") {
                this.log.warn(
                  `Error sending a notification: ${this.options.adapter} does not react in the given time.`
                );
              } else {
                throw error;
              }
            }
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
            if (msg.title !== void 0 && msg.title != "") {
              opt.title = msg.title;
            }
            if (this.options.priority) {
              opt.priority = msg.message ? msg.message.level - 2 : -1;
            }
            if (this.options.device.length > 0) {
              opt.device = this.options.device;
            }
            try {
              await this.adapter.sendToAsync(this.options.adapter, "send", opt, { timeout: 2e3 });
              this.log.debug(`Send the message: ${msg.text}`);
            } catch (error) {
              if (error.message == "Timeout exceeded") {
                this.log.warn(
                  `Error sending a notification: ${this.options.adapter} does not react in the given time.`
                );
              } else {
                throw error;
              }
            }
          }
        }
        break;
      case "whatsapp":
        {
          for (const msg of messages) {
            if (Array.isArray(msg)) {
              return false;
            }
            const opt = { text: msg.text };
            if (this.options.phonenumber) {
              opt.phone = this.options.phonenumber;
            }
            try {
              await this.adapter.sendToAsync(this.options.adapter, "send", opt, { timeout: 2e3 });
              this.log.debug(`Send the message: ${msg.text}`);
            } catch (error) {
              if (error.message == "Timeout exceeded") {
                this.log.warn(
                  `Error sending a notification: ${this.options.adapter} does not react in the given time.`
                );
              } else {
                throw error;
              }
            }
          }
        }
        break;
      case "gotify":
        {
          for (const msg of messages) {
            if (Array.isArray(msg)) {
              return false;
            }
            const opt = { message: msg.text, contentType: this.options.contentType };
            if (this.options.priority) {
              opt.priority = this.options.priority;
            }
            if (this.options.actions.title && msg.title) {
              opt.title = msg.title;
            }
            try {
              this.adapter.sendTo(this.options.adapter, "send", opt);
              this.log.debug(`Send the message: ${msg.text}`);
            } catch (error) {
              if (error.message == "Timeout exceeded") {
                this.log.warn(
                  `Error sending a notification: ${this.options.adapter} does not react in the given time.`
                );
              } else {
                throw error;
              }
            }
          }
        }
        break;
      case "alexa2":
        {
          const devices = this.adapter.config.alexa2_device_ids;
          if (devices.length == 0) {
            break;
          }
          let opt = "";
          if (this.options.sounds_enabled) {
            const prefix = `${this.options.volumen}`;
            for (const device of devices) {
              for (const msg of messages) {
                if (Array.isArray(msg)) {
                  continue;
                }
                let index = -1;
                if (msg.message !== void 0 && msg.message.notDeleted) {
                  index = this.options.sounds.findIndex(
                    (a) => a.warntypenumber == Number(msg.message.genericType)
                  );
                } else {
                  index = this.options.sounds.findIndex((a) => a.warntypenumber == 0);
                }
                const sound = this.options.sounds[index].sound;
                if (sound) {
                  opt += `;${sound};${msg.text}`;
                } else {
                  opt += `;${msg.text}`;
                }
              }
              this.log.debug(`Send to alexa2: ${prefix + opt}`);
              if (opt != "") {
                await this.adapter.setForeignStateAsync(
                  `${this.options.adapter}.Echo-Devices.${device}.Commands.speak`,
                  prefix + opt
                );
              }
            }
          } else {
            const prefix = `${this.options.volumen}${this.options.audio ? `;${this.options.audio}` : ""}`;
            for (const device of devices) {
              for (const msg of messages) {
                if (Array.isArray(msg)) {
                  continue;
                }
                opt += `;${msg.text}`;
              }
              this.log.debug(`Send to alexa2: ${prefix + opt}`);
              if (opt != "") {
                await this.adapter.setForeignStateAsync(
                  `${this.options.adapter}.Echo-Devices.${device}.Commands.speak`,
                  prefix + opt
                );
              }
            }
          }
        }
        break;
      case "sayit":
        {
          let d = "";
          const prefix = `${this.options.volumen};`;
          for (const msg of messages) {
            if (Array.isArray(msg)) {
              continue;
            }
            if (msg.text != "") {
              await this.adapter.setForeignStateAsync(
                `${this.options.adapter}.tts.text`,
                prefix + msg.text
              );
              d += prefix + msg.text;
            }
          }
          this.log.debug(`Send to sayit: ${d}`);
        }
        break;
      case "history":
        {
          for (const msg of messages) {
            if (Array.isArray(msg)) {
              return false;
            }
            if (!msg || !msg.provider || !this.adapter.config.history_Enabled || !msg.message) {
              return false;
            }
            let newMsg = { message: msg.text };
            if (this.adapter.config.history_allinOne) {
              newMsg = { ...msg.message.formatedData, ts: Date.now() };
            } else {
              try {
                const temp = JSON.parse(newMsg.message);
                newMsg.message = temp;
              } catch {
                this.log.debug(` write message: ${newMsg.message}`);
              }
            }
            const targets = [msg.provider.name, msg.provider.providerController.name];
            for (const a of targets) {
              try {
                const dp = `${a}.history`;
                const state = this.adapter.library.readdp(dp);
                let json = [];
                if (state && state.val && typeof state.val == "string" && state.val != "") {
                  json = JSON.parse(state.val);
                }
                json.unshift(newMsg);
                json.splice(100);
                await this.adapter.library.writedp(
                  dp,
                  JSON.stringify(json),
                  import_definition.genericStateObjects.history
                );
              } catch {
                this.log.error(
                  `${this.name} template has wrong formate. ${this.name} deactivated! template: ${msg.action ? this.options.actions[msg.action] : "unknown"}, message: ${JSON.stringify(msg)}`
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
          for (const msg of messages) {
            try {
              try {
                const temp = this.adapter.config.json_parse ? JSON.parse(msg.text) : msg.text;
                result.push({
                  startts: msg.startts,
                  message: temp,
                  provider: msg.provider
                });
              } catch {
                const temp = this.adapter.config.json_parse ? JSON.parse(msg.text.replace("\u201E", '"').replace("\u201C", '"')) : msg.text;
                result.push({
                  startts: msg.startts,
                  message: temp,
                  provider: msg.provider
                });
              }
              providers.push(msg.provider !== void 0 ? msg.provider.name : "");
            } catch {
              this.log.error(
                `Json template has wrong formate. Conversion deactivated! template: ${msg.template}, message: ${msg.text}`
              );
              this.adapter.config.json_parse = false;
              continue;
            }
          }
          providers = providers.filter((i, p) => {
            if (i != "") {
              if (providers.indexOf(i) == p) {
                return true;
              }
            }
            return false;
          });
          result = result.filter((i, p) => {
            if (i.message != "" && i.provider) {
              if (result.findIndex(
                (i2) => i2.provider.name == i.provider.name && i2.message == i.message
              ) == p) {
                return true;
              }
            }
            return false;
          });
          result.sort((a, b) => {
            if (a.provider > b.provider) {
              return 1;
            } else if (a.provider < b.provider) {
              return -1;
            }
            return a.startts - b.startts;
          });
          for (const p of providers) {
            const dp = `${p}.activeWarnings_json`;
            const data = result.filter((a) => a.provider && a.provider.name == p).map((a) => a.message);
            await this.adapter.library.writedp(
              dp,
              JSON.stringify(data),
              import_definition.genericStateObjects.activeWarningsJson
            );
          }
          result = result.map((a) => a.message);
          result = result.filter((i, p) => {
            if (i != "") {
              if (result.findIndex((i2) => i2 == i) == p) {
                return true;
              }
            }
            return false;
          }) || [];
          if (this.adapter.providerController) {
            const dp = `${this.adapter.providerController.name}.activeWarnings_json`;
            await this.adapter.library.writedp(
              dp,
              JSON.stringify(result),
              import_definition.genericStateObjects.activeWarningsJson
            );
          }
        }
        break;
      case "email":
        {
          const result = messages.filter((i, p) => {
            if (i.text != "") {
              if (messages.findIndex((i2) => i2.text == i.text) == p) {
                return true;
              }
            }
            return false;
          });
          const opt = {};
          if (result.length > 0 && messages.length > 0 && messages[0].title) {
            opt.subject = messages[0].title;
          }
          opt.html = result.map((a) => a.text).join(this.adapter.config.email_line_break);
          const templates = this.adapter.config.templateTable;
          let token = "message.status.new";
          if (messages[0].action == "removeAll") {
            token = "message.status.clear";
          }
          if (this.adapter.config.email_Header !== "none") {
            const tempid = templates.findIndex((a) => a.templateKey == this.adapter.config.email_Header);
            if (tempid != -1) {
              const temp = templates[tempid].template.replace(
                "${emailheader}",
                this.adapter.library.getTranslation(token)
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
          try {
            this.adapter.sendTo(this.options.adapter, "send", opt);
            this.log.debug(`Send the message: ${JSON.stringify(opt)}`);
            await library.sleep(200);
          } catch (error) {
            if (error.message == "Timeout exceeded") {
              this.log.warn(
                `Error sending a notification: ${this.options.adapter} does not react in the given time.`
              );
            } else {
              throw error;
            }
          }
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
