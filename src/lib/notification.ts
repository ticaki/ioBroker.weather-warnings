import WeatherWarnings from '../main';
import { genericStateObjects } from './def/definitionen';
import * as NotificationType from './def/notificationService-def';
import * as library from './library';
import * as Provider from './def/provider-def';

export class NotificationClass extends library.BaseClass {
    options: NotificationType.BaseType;
    takeThemAll = false;
    providerDB: any;
    removeAllSend: boolean = true;

    //clearAll(): void {}

    constructor(adapter: WeatherWarnings, notifcationOptions: NotificationType.BaseType) {
        super(adapter, notifcationOptions.name);
        this.log.debug(`Create notification service ${this.name}`);
        this.options = notifcationOptions;
        this.options = Object.assign(this.options, NotificationType.serciceCapabilities[notifcationOptions.name]);
    }

    /**
     * Initialisiere class - create channel, states etc
     */
    async init(): Promise<void> {
        switch (this.name as NotificationType.Type) {
            case 'history':
            case 'json':
                {
                    let dp = '';
                    let def: any = genericStateObjects.history;
                    const providers = this.adapter.providerController!.providers.filter((a) =>
                        this.options.service.includes(a.service),
                    );
                    if (this.adapter.providerController) {
                        const targets = [...providers, this.adapter.providerController];
                        for (const a in targets) {
                            switch (this.options.name as NotificationType.Type) {
                                case 'history':
                                    {
                                        dp = `${targets[a].name}.history`;
                                        def = genericStateObjects.history;
                                    }
                                    break;
                                case 'json':
                                    {
                                        dp = `${targets[a].name}.activeWarnings_json`;
                                        def = genericStateObjects.activeWarningsJson;
                                    }
                                    break;
                            }
                            const state = this.adapter.library.readdp(dp);
                            if (state == undefined) {
                                await this.adapter.library.writedp(dp, '[]', def);
                            }
                        }
                    }
                }
                break;
        }
    }

    /**
     *  Send this message after filtering to services REWRITED
     * @param messages the message with MessageClassRef Ref can be null
     * @param action <string>
     * @param manual <boolean> manual new/removeall handling
     * @returns
     */
    async sendMessage(
        providers: Provider.BaseProvider[],
        allowActions: NotificationType.ActionsUnionType[],
        manual: boolean = false,
    ): Promise<void> {
        let activeWarnings = 0;
        const filter = manual && this.options.filter.manual ? this.options.filter.manual : this.options.filter.auto;
        const actions = this.options.actions;
        let result: NotificationType.MessageType[] = [];
        const notifications = this.options.notifications;
        for (const a in providers) {
            if (this.options.service.indexOf(providers[a].service) == -1) continue;
            //const resultProvider: NotificationType.MessageType[] = [];
            for (const b in providers[a].messages) {
                const message = providers[a].messages[b];
                if (
                    message &&
                    (filter.level === undefined || filter.level <= message.level) &&
                    filter.type.indexOf(String(message.genericType)) == -1
                ) {
                    if (message.notDeleted) activeWarnings++;
                    for (const c in actions) {
                        const action: keyof NotificationType.ActionsType = c as keyof NotificationType.ActionsType;
                        if (manual && NotificationType.manual.indexOf(action) == -1) continue;
                        if (action == undefined || actions[action] == 'none' || actions[action] == '') continue;

                        if (!allowActions.includes(action)) continue;

                        if (!notifications.includes(action)) continue;

                        const templateKey = actions[action as keyof typeof this.options.actions];
                        if (!templateKey) continue;
                        if (
                            manual || // get every message
                            (action == 'new' && message.newMessage) || // new message
                            (action == 'remove' && !message.notDeleted) || // remove message
                            action == 'manualAll' ||
                            (action == 'all' &&
                                notifications.includes('all') &&
                                !notifications.includes('new') &&
                                !notifications.includes('remove')) // all without extension
                        ) {
                            const msg = await message.getMessage(templateKey);
                            if (msg.text != '') {
                                msg.action = action;
                                msg.provider = providers[a];
                                msg.message = message;
                                result.push(msg); // hier sammele die Nachrichten
                            }
                        }
                    }
                }
            }
        }
        if (manual && result.findIndex((a) => a.action != 'removeAll') > -1) {
            result = result.filter((a) => a.action != 'removeAll');
        }
        if (result.length > 0 && activeWarnings > 0) {
            await this.sendNotifications(result); // hier an alle
            this.removeAllSend = false;
        } else {
            // no active Warnings every where, notification filter dont care.

            if (
                this.options.notifications.includes('removeAll') &&
                this.options.actions['removeAll'] != 'none' &&
                (manual || (!this.removeAllSend && activeWarnings == 0))
            ) {
                const templates = this.adapter.config.templateTable;
                const tempid = templates.findIndex((a) => a.templateKey == this.options.actions['removeAll']);
                if (tempid != -1) {
                    this.sendNotifications([
                        {
                            text: templates[tempid].template.replaceAll('\\', ''),
                            startts: 1,
                            template: templates[tempid].template,
                            action: 'removeAll',
                        },
                    ]);
                }
                this.removeAllSend = true;
            }
        }
    }

    canManual(): boolean {
        if (this.options.notifications.findIndex((a) => NotificationType.manual.indexOf(a) != -1) != -1) return true;
        return false;
    }

    async sendNotifications(messages: NotificationType.MessageType[]): Promise<boolean> {
        if (!Array.isArray(messages) || messages.length == 0) {
            this.log.debug(`no messages`);
            return false;
        }

        switch (this.options.name) {
            case 'telegram':
                {
                    /*this.log.debug(
                        JSON.stringify(
                            messages.map((a) => {
                                if (a.message) return a.message.rawWarning;
                            }),
                        ),
                    );*/
                    for (const msg of messages) {
                        const opt: any = { text: msg.text, disable_notification: this.options.withNoSound };
                        if (this.options.userid.length > 0 || this.options.chatid.length > 0) {
                            if (this.options.userid.length > 0) opt.user = this.options.userid;
                            if (this.options.chatid.length > 0) {
                                const chatids = this.options.chatid.split(',');
                                for (const chatid of chatids)
                                    await this.adapter.sendToAsync(this.options.adapter, 'send', {
                                        ...opt,
                                        chatid: chatid,
                                    });
                            } else {
                                await this.adapter.sendToAsync(this.options.adapter, 'send', opt);
                            }
                        } else await this.adapter.sendToAsync(this.options.adapter, 'send', opt);
                        this.log.debug(`Send the message: ${msg.text}`);
                    }
                }
                break;
            case 'pushover':
                {
                    for (const msg of messages) {
                        const opt: NotificationType.pushover_options = {
                            message: msg.text,
                            sound: this.options.sound || 'none',
                        };
                        //newMsg.title = topic
                        if (this.options.priority) opt.priority = msg.message ? msg.message.level - 2 : -1;
                        if (this.options.device.length > 0) opt.device = this.options.device;
                        await this.adapter.sendToAsync(this.options.adapter, 'send', opt);
                        this.log.debug(`Send the message: ${msg.text}`);
                    }
                }
                break;
            case 'whatsapp':
                {
                    for (const msg of messages) {
                        if (Array.isArray(msg)) return false;
                        const service = this.options.adapter.replace('whatsapp', 'whatsapp-cmb');
                        // obj.message.phone
                        const opt = { text: msg.text };

                        await this.adapter.sendToAsync(service, 'send', opt);
                        this.log.debug(`Send the message: ${msg.text}`);
                    }
                }
                break;
            case 'alexa2':
                {
                    const devices = this.adapter.config.alexa2_device_ids;

                    if (devices.length == 0) break;

                    let opt = '';
                    if (this.options.sounds_enabled) {
                        const prefix = `${this.options.volumen}`;
                        for (const a in devices) {
                            for (const msg of messages) {
                                if (Array.isArray(msg)) continue;
                                let index = -1;
                                if (msg.message !== undefined && msg.message.notDeleted)
                                    index = this.options.sounds.findIndex(
                                        (a) => a.warntypenumber == Number(msg.message!.genericType),
                                    );
                                else index = this.options.sounds.findIndex((a) => a.warntypenumber == 0);
                                const sound = this.options.sounds[index].sound;
                                if (sound) opt += `;${sound};${msg.text}`;
                                else opt += `;${msg.text}`;
                            }
                            this.log.debug(`Send to alexa2: ${prefix + opt}`);
                            if (opt != '') {
                                await this.adapter.setForeignStateAsync(
                                    `${this.options.adapter}.Echo-Devices.${devices[a]}.Commands.speak`,
                                    prefix + opt,
                                );
                            }
                        }
                    } else {
                        const prefix = `${this.options.volumen}` + (this.options.audio ? ';' : '') + this.options.audio;
                        for (const a in devices) {
                            for (const msg of messages) {
                                if (Array.isArray(msg)) continue;
                                opt += `;${msg.text}`;
                            }
                            this.log.debug(`Send to alexa2: ${prefix + opt}`);
                            if (opt != '') {
                                await this.adapter.setForeignStateAsync(
                                    `${this.options.adapter}.Echo-Devices.${devices[a]}.Commands.speak`,
                                    prefix + opt,
                                );
                            }
                        }
                    }
                    /* Alexa code ask Apollon later
                    const opt: any = {
                        // value
                        deviceSerialNumber: devices[0], // Serial number of one device to get Meta data which will be used if no device is pecified on the commands
                        sequenceNodes: [], // list of sequences or commands
                        sequenceType: 'ParallelNode', // "SerialNode" or "ParallelNode" for the provided sequenceNodes on main level. Default is "SerialNode"
                    };
                    for (const a in devices) {
                        const optsub: any = { sequenceType: 'SerialNode', nodes: [] };
                        optsub.nodes.push({
                            command: 'speak-volume',
                            value: 1, //this.adapter.config.alexa2_volumen,
                            device: devices[a],
                        });
                        for (const msg of messages) {
                            if (Array.isArray(msg)) continue;
                            optsub.nodes.push({
                                command: 'speak',
                                value: `${this.adapter.config.alexa2_volumen};${msg.text}`,
                                device: devices[a],
                            });
                        }
                        opt.sequenceNodes.push(optsub);
                    }
                    this.log.debug(
                        JSON.stringify(
                            await this.adapter.sendToAsync(this.options.adapter, 'sendSequenceCommand', opt),
                        ),
                    );*/
                }
                break;
            case 'history':
                {
                    for (const msg of messages) {
                        if (Array.isArray(msg)) return false;
                        if (!msg || !msg.provider || !this.adapter.config.history_Enabled || !msg.message) return false;
                        let newMsg: object = { message: msg.text };
                        if (this.adapter.config.history_allinOne) {
                            newMsg = { ...msg.message.formatedData, ts: Date.now() };
                        }
                        const targets = [msg.provider.name, msg.provider.providerController.name];
                        for (const a in targets) {
                            try {
                                const dp = `${targets[a]}.history`;
                                const state = this.adapter.library.readdp(dp);
                                let json: object[] = [];
                                if (state && state.val && typeof state.val == 'string' && state.val != '')
                                    json = JSON.parse(state.val);
                                json.unshift(newMsg);
                                json.splice(500);
                                await this.adapter.library.writedp(
                                    dp,
                                    JSON.stringify(json),
                                    genericStateObjects.history,
                                );
                            } catch (error) {
                                this.log.error(
                                    `${this.name} template has wrong formate. ${this.name} deactivated! template: ${
                                        msg.action ? this.options.actions[msg.action] : 'unknown'
                                    }, message: ${msg}`,
                                );
                                this.adapter.config.history_Enabled = false;
                                return false;
                            }
                        }
                    }
                }
                break;
            case 'json':
                {
                    // testrun to get a good error
                    let result: any[] = [];
                    let providers: string[] = [];
                    for (const a in messages) {
                        try {
                            const temp = this.adapter.config.json_parse
                                ? JSON.parse(messages[a].text)
                                : messages[a].text;
                            result.push({
                                startts: messages[a].startts,
                                message: temp,
                                provider: messages[a].provider,
                            });
                            providers.push(messages[a].provider !== undefined ? messages[a].provider!.name : '');
                        } catch (error) {
                            this.log.error(
                                `Json template has wrong formate. Conversion deactivated! template: ${messages[a].template}, message: ${messages[a].text}`,
                            );
                            this.adapter.config.json_parse = false;
                            continue;
                        }
                    }
                    // double providers
                    providers = providers.filter((i, p) => {
                        if (i != '') {
                            if (providers.indexOf(i) == p) return true;
                        }
                        return false;
                    });
                    // double message
                    result = result.filter((i, p) => {
                        if (i.message != '' && i.provider) {
                            if (
                                result.findIndex(
                                    (i2) => i2.provider.name == i.provider.name && i2.message == i.message,
                                ) == p
                            )
                                return true;
                        }
                        return false;
                    });
                    // sort
                    result.sort((a, b) => {
                        if (a.provider > b.provider) return 1;
                        else if (a.provider < b.provider) return -1;
                        else return a.startts - b.startts;
                    });
                    for (const p of providers) {
                        const dp = p + '.activeWarnings_json';
                        const data = result.filter((a) => a.provider && a.provider.name == p).map((a) => a.message);
                        await this.adapter.library.writedp(
                            dp,
                            JSON.stringify(data),
                            genericStateObjects.activeWarningsJson,
                        );
                    }
                    // filter double all
                    result = result.filter((i, p) => {
                        if (i.message != '' && i.provider) {
                            if (result.findIndex((i2) => i2.message == i.message) == p) return true;
                        }
                        return false;
                    });
                    if (this.adapter.providerController) {
                        const dp = this.adapter.providerController.name + '.activeWarnings_json';
                        await this.adapter.library.writedp(
                            dp,
                            JSON.stringify(result.map((a) => a.message)),
                            genericStateObjects.activeWarningsJson,
                        );
                    }
                }
                break;
            case 'email':
                {
                    this.log.info(`start email sending! Messagecount: ${messages.length}`);
                    const result = messages.filter((i, p) => {
                        if (i.text != '' && i.provider) {
                            if (messages.findIndex((i2) => i2.text == i.text) == p) return true;
                        }
                        return false;
                    });
                    this.log.info(`first filter! Messagecount: ${result.length}`);
                    result.sort((a, b) => a.startts - b.startts);
                    const flat: string[] = result.map((a) => a.text);

                    let message = flat.join(this.adapter.config.email_line_break);
                    const templates = this.adapter.config.templateTable;
                    this.log.info(`Email message: ${message.length}`);
                    if (this.adapter.config.email_Header !== 'none') {
                        const tempid = templates.findIndex((a) => a.templateKey == this.adapter.config.email_Header);
                        if (tempid != -1) {
                            let token = 'notification.warning';
                            if (messages[0].action == 'removeAll') token = 'notification.allclear';
                            const temp = templates[tempid].template.replace(
                                '${emailheader}',
                                await this.adapter.library.getTranslation(token),
                            );
                            message = temp + message;
                        }
                    }
                    if (this.adapter.config.email_Footer !== 'none') {
                        const tempid = templates.findIndex((a) => a.templateKey == this.adapter.config.email_Header);
                        if (tempid != -1) {
                            message = message + templates[tempid];
                        }
                    }
                    this.log.debug(`start email sending! Messagecount: ${result.length}`);
                    await this.adapter.sendToAsync(this.options.adapter, 'send', message);
                    this.log.debug(`Send the message: ${message}`);
                }
                break;
        }
        return true;
    }
}
