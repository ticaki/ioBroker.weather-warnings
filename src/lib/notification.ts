import WeatherWarnings from '../main';
import { genericStateObjects } from './def/definitionen';
import * as NotificationType from './def/notificationService-def';
import * as library from './library';
import * as Provider from './def/provider-def';
import { MessagesClass } from './messages';

export class NotificationClass extends library.BaseClass {
    options: NotificationType.BaseType;
    takeThemAll = false;
    config: NotificationType.ConfigType;
    providerDB: any;
    removeAllSend: boolean = true;

    //clearAll(): void {}

    constructor(adapter: WeatherWarnings, notifcationOptions: NotificationType.BaseType) {
        super(adapter, notifcationOptions.name);
        this.log.debug(`Create notification service ${this.name}`);
        this.options = notifcationOptions;
        this.config = NotificationType.serciceCapabilities[notifcationOptions.name];
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
                    const targets = [...providers, this.adapter.providerController!];
                    for (const a in targets) {
                        switch (this.name as NotificationType.Type) {
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
                        const state = this.adapter.library.getdb(dp);
                        if (state == undefined) {
                            await this.adapter.library.writedp(dp, '[]', def);
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
     * @param override <boolean> override new/removeall handling
     * @returns
     */
    async sendMessage(
        providers: Provider.BaseProvider[],
        allowActions: NotificationType.ActionsUnionType[],
        override: boolean = false,
    ): Promise<void> {
        let activeWarnings = 0;
        const result: NotificationType.MessageType[] = [];
        for (const a in providers) {
            if (this.options.service.indexOf(providers[a].service) == -1) continue;
            //const resultProvider: NotificationType.MessageType[] = [];
            for (const b in providers[a].messages) {
                const message = providers[a].messages[b];
                if (
                    message &&
                    (this.options.filter.level === undefined || this.options.filter.level <= message.level) &&
                    this.options.filter.type.indexOf(String(message.genericType)) == -1
                ) {
                    if (message.notDeleted) activeWarnings++;
                    for (const c in this.options.actions) {
                        const action: keyof NotificationType.ActionsType = c as keyof NotificationType.ActionsType;
                        if (
                            this.options.actions[action] == 'none' ||
                            this.options.actions[action] == '' ||
                            action == undefined
                        )
                            continue;

                        if (!allowActions.includes(action)) continue;

                        if (!this.config.notifications.includes(action)) continue;

                        const msg = await this.getMessage(
                            message,
                            this.config.notifications,
                            this.options.actions[action as keyof typeof this.options.actions]!,
                            action,
                            override,
                        );
                        if (msg.text != '') {
                            msg.action = action;
                            msg.provider = providers[a];
                            msg.message = message;
                            //if (this.config.notifications.includes('all'))
                            result.push(msg); // hier sammele die Nachrichten

                            //else this.sendNotifications(msg, message, action); // hier versende die Nachrichten aber nicht an Dienste mit all
                        }
                    }
                }
            }
            //if (resultProvider.length > 0) await this.sendNotifications(resultProvider); // hier an alle

            //if (this.config.notifications.includes('all')) result = result.concat(resultProvider); // hier sammele die Nachrichten
        }
        if (result.length > 0 && activeWarnings > 0) {
            await this.sendNotifications(result); // hier an alle
            this.removeAllSend = false;
        } else {
            // no active Warnings every where, notification filter dont care.

            if (
                this.config.notifications.includes('removeAll') &&
                this.options.actions['removeAll'] != 'none' &&
                (override || (!this.removeAllSend && activeWarnings == 0))
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
    async getMessage(
        message: MessagesClass,
        templateType: NotificationType.ActionsUnionType[],
        templateKey: string,
        action: NotificationType.ActionsUnionType,
        override: boolean = false,
    ): Promise<NotificationType.MessageType> {
        return await message.getMessage(templateType, templateKey, action, override);
    }

    async sendNotifications(messages: NotificationType.MessageType[]): Promise<boolean> {
        if (!Array.isArray(messages) || messages.length == 0) return false;

        switch (this.name as NotificationType.Type) {
            case 'telegram':
                {
                    for (const msg of messages) {
                        const opt = { text: msg.text, disable_notification: true };

                        await this.adapter.sendToAsync(this.options.adapter, 'send', opt);
                        this.log.debug(`Send the message: ${msg.text}`);
                    }
                }
                break;
            case 'pushover':
                {
                    for (const msg of messages) {
                        const opt = { message: msg.text };
                        //newMsg.title = topic;newMsg.device sound = `none`
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

                    let opt = `${this.adapter.config.alexa2_volumen}`;
                    for (const a in devices) {
                        for (const msg of messages) {
                            if (Array.isArray(msg)) continue;
                            opt += `;${msg.text}`;
                        }
                        if (opt != `${this.adapter.config.alexa2_volumen}`) {
                            await this.adapter.setForeignStateAsync(
                                `${this.options.adapter}.Echo-Devices.${devices[a]}.Commands.speak`,
                                opt,
                            );
                        }
                    }
                    /*
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
                        let newMsg = msg.text;
                        if (this.adapter.config.history_allinOne) {
                            newMsg = JSON.stringify({ ...msg.message.formatedData, ts: Date.now() });
                        }
                        const targets = [msg.provider.name, msg.provider.providerController.name];
                        for (const a in targets) {
                            try {
                                const dp = `${targets[a]}.history`;
                                const state = this.adapter.library.getdb(dp);
                                let json: object[] = [];
                                if (state && state.val && typeof state.val == 'string' && state.val != '')
                                    json = JSON.parse(state.val);
                                json.unshift(typeof newMsg == 'object' ? JSON.parse(newMsg) : newMsg);
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
                    {
                        const dp = this.adapter.providerController!.name + '.activeWarnings_json';
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
                    const result = messages.filter((i, p) => {
                        if (i.text != '' && i.provider) {
                            if (messages.findIndex((i2) => i2.text == i.text) == p) return true;
                        }
                        return false;
                    });
                    result.sort((a, b) => a.startts - b.startts);
                    const flat: string[] = result.map((a) => a.text);

                    let message = flat.join(this.adapter.config.email_line_break);
                    const templates = this.adapter.config.templateTable;

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
                    await this.adapter.sendToAsync(this.options.adapter, 'send', message);
                    this.log.debug(`Send the message: ${message}`);
                }
                break;
        }

        return true;
    }
}
