/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';

import axios from 'axios';
import 'source-map-support/register';
import { dwdWarncellIdLong } from './lib/def/dwdWarncellIdLong';
import { DIV, ProviderController } from './lib/provider.js';
import { Library } from './lib/library.js';
import {
    customFormatedTokens,
    customFormatedTokensJson,
    genericWarntyp,
    genericWarntypeType,
    textLevels,
} from './lib/def/messages-def';
import { messageFilterTypeWithFilter, providerServices, providerServicesArray } from './lib/def/provider-def';
import * as NotificationType from './lib/def/notificationService-def';
import { notificationServiceDefaults } from './lib/def/notificationConfig-d';
axios.defaults.timeout = 8000;
// Load your modules here, e.g.:
// import * as fs from "fs";

class WeatherWarnings extends utils.Adapter {
    library: Library;
    providerController: ProviderController | null = null;
    numOfRawWarnings: number = 5;
    adminTimeoutRef: any = null;
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'weather-warnings',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('objectChange', this.onObjectChange.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.library = new Library(this);
        this.providerController = new ProviderController(this);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        if (!this.providerController) {
            throw new Error('Provider controller doesnt exists.');
        }
        this.subscribeForeignObjects('system.config');

        // dynamic create of configuration datapoint.
        if (!Array.isArray(this.config.allowedDirs)) this.config.allowedDirs = [];
        let i = 0;
        let change = false;
        let allowedDirsConfig = {};
        while (i++ < 2) {
            const allowedDirs = this.config.allowedDirs;

            for (const a in providerServicesArray) {
                let hit = -1;
                for (const b in allowedDirs) {
                    if (
                        allowedDirs[b].providerService == providerServicesArray[a].replace('Service', '').toUpperCase()
                    ) {
                        hit = Number(b);
                        break;
                    }
                }
                if (hit == -1) {
                    change = true;
                    this.config.allowedDirs.push({
                        providerService: providerServicesArray[a].replace('Service', '').toUpperCase(),
                        dpWarning: true,
                        dpMessage: true,
                        dpFormated: true,
                        dpAlerts: true,
                    });
                }
                //@ts-expect-error dann so
                allowedDirsConfig[providerServicesArray[a]] =
                    this.config.allowedDirs[hit == -1 ? this.config.allowedDirs.length - 1 : hit];
            }
            if (providerServicesArray.length != this.config.allowedDirs.length) {
                this.config.allowedDirs = [];
                allowedDirsConfig = {};
                change = false;
                continue;
            }
            break;
        }
        if (change) {
            const obj = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
            if (obj && obj.native) {
                obj.native.allowedDirs = this.config.allowedDirs;
                await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj);
                this.log.warn('Fixed configuration for allowed datapoints! ');
            }
        }
        this.providerController.setAllowedDirs(allowedDirsConfig);

        setTimeout(
            async function (that: any) {
                const self = that as WeatherWarnings;
                if (!self.providerController) return;
                if (!self) return;
                try {
                    //const states = await self.getStatesAsync('*');
                    await self.library.init();
                    await self.library.initStates(await self.getStatesAsync('*'));
                    await self.library.initStates((await self.getChannelsAsync()) as any);
                } catch (error) {
                    self.log.error(`catch(1): init error while reading states! ${error}`);
                }

                self.providerController.init();
                self.log.info(`Refresh Interval: ${self.providerController.refreshTime / 60000} minutes`);

                const notificationServiceOpt: NotificationType.OptionsType = {};
                for (const a in NotificationType.Array) {
                    const notificationService = NotificationType.Array[a] as NotificationType.Type;
                    if (self.config[(notificationService + '_Enabled') as keyof ioBroker.AdapterConfig]) {
                        const service: providerServices[] = [];
                        if (self.config[(notificationService + '_DwdEnabled') as keyof ioBroker.AdapterConfig])
                            service.push('dwdService');
                        if (self.config[(notificationService + '_UwzEnabled') as keyof ioBroker.AdapterConfig])
                            service.push('uwzService');
                        if (self.config[(notificationService + '_UwzEnabled') as keyof ioBroker.AdapterConfig])
                            service.push('zamgService');
                        const template: NotificationType.ActionsType = {
                            new: self.config[
                                (notificationService + '_MessageNew') as keyof ioBroker.AdapterConfig
                            ] as string,
                            remove: self.config[
                                (notificationService + '_MessageRemove') as keyof ioBroker.AdapterConfig
                            ] as string,
                            removeAll: self.config[
                                (notificationService + '_MessageAllRemove') as keyof ioBroker.AdapterConfig
                            ] as string,
                            all: '',
                        };
                        template.new = template.new ? template.new : 'none';
                        template.remove = template.remove ? template.remove : 'none';
                        template.removeAll = template.removeAll ? template.removeAll : 'none';
                        template.all = template.all ? template.all : 'none';
                        // @ts-expect-error keine ahnung :)
                        notificationServiceOpt[notificationService] = {
                            ...notificationServiceDefaults[notificationService],
                            service: service,
                            filter: {
                                level: self.config[
                                    (notificationService + '_LevelFilter') as keyof ioBroker.AdapterConfig
                                ] as number,
                                type: (
                                    self.config[
                                        (notificationService + '_TypeFilter') as keyof ioBroker.AdapterConfig
                                    ] as string[]
                                ).map((a) => String(a)),
                            },
                            adapter: self.config[
                                (notificationService + '_Adapter') as keyof ioBroker.AdapterConfig
                            ] as string,
                            name: notificationService,
                            actions: template,
                            useadapter: true,
                        };
                        Object.assign(
                            //@ts-expect-error verstehe ich nicht
                            notificationServiceOpt[notificationService],
                            notificationServiceDefaults[notificationService],
                        );
                    }
                }
                // hold this for some specialcases
                if (self.config.telegram_Enabled) {
                }
                if (self.config.whatsapp_Enabled) {
                }
                if (self.config.pushover_Enabled) {
                }
                if (self.config.json_Enabled) {
                }
                if (self.config.history_Enabled) {
                }
                if (self.config.email_Enabled && notificationServiceOpt.email != undefined) {
                    notificationServiceOpt.email.actions.header = self.config.email_Header;
                    notificationServiceOpt.email.actions.footer = self.config.email_Footer;
                }

                self.providerController.createNotificationService(notificationServiceOpt);

                // dwdSelectID gegen Abfrage prüfen und erst dann als valide erklären.
                for (const a in self.config.dwdwarncellTable) {
                    const id = self.config.dwdwarncellTable[a];
                    if (self.config.dwdEnabled) {
                        if (id.dwdSelectId < 10000 && isNaN(id.dwdSelectId)) {
                            self.log.warn(`DWD is activated, but no valid warning cell is configured.`);
                            continue;
                        }
                        const options: messageFilterTypeWithFilter & {
                            [key: string]: any;
                        } = {
                            filter: {
                                type: self.config.dwdTypeFilter,
                                level: self.config.dwdLevelFilter,
                            },
                        };
                        self.log.info('DWD activated. Retrieve data.');
                        self.providerController.createProviderIfNotExist({
                            ...options,
                            service: 'dwdService',
                            customName: id.dwdCityname,
                            warncellId: String(id.dwdSelectId),
                            providerController: self.providerController,
                            language: self.config.dwdLanguage,
                        });
                    }
                }

                for (const a in self.config.zamgwarncellTable) {
                    const id = self.config.zamgwarncellTable[a];
                    if (self.config.zamgEnabled && id && typeof id.zamgSelectId == 'string') {
                        self.log.info('ZAMG activated. Retrieve data.');
                        const options: messageFilterTypeWithFilter & {
                            [key: string]: any;
                        } = {
                            filter: { type: self.config.zamgTypeFilter },
                        };
                        const zamgArr = id.zamgSelectId.split(DIV) as [string, string];
                        if (zamgArr.length == 2) {
                            self.providerController.createProviderIfNotExist({
                                ...options,
                                service: 'zamgService',
                                warncellId: zamgArr,
                                language: self.config.zamgLanguage,
                                providerController: self.providerController,
                                customName: id.zamgCityname,
                            });
                        }
                    }
                }
                for (const a in self.config.uwzwarncellTable) {
                    const id = self.config.uwzwarncellTable[a];
                    if (self.config.uwzEnabled && !!id.uwzSelectId) {
                        const options: messageFilterTypeWithFilter = {
                            filter: { type: self.config.uwzTypeFilter },
                        };
                        self.log.info('UWZ activated. Retrieve data.');
                        self.providerController.createProviderIfNotExist({
                            ...options,
                            service: 'uwzService',
                            warncellId: 'UWZ' + id.uwzSelectId.toUpperCase(), //UWZ + Land + PLZ
                            providerController: self.providerController,
                            language: self.config.uwzLanguage,
                            customName: id.uwzCityname,
                        });
                    }
                }

                //clear tree
                const holdStates = [];
                for (const a in self.providerController.providers) {
                    holdStates.push(self.providerController.providers[a].name);
                }
                await self.library.cleanUpTree(holdStates, 3);

                self.providerController.updateEndless(self.providerController);
                self.providerController.updateAlertEndless(self.providerController);
            },
            4000,
            this,
        );
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            if (this.providerController) this.providerController.delete();
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     *  We need this later, dont remove
     */
    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    private async onObjectChange(id: string, obj: ioBroker.Object | null | undefined): Promise<void> {
        if (obj) {
            // The object was changed
            if (id == 'system.config') {
                if (await this.library.setLanguage(obj.common.language)) {
                    if (this.providerController) this.providerController.updateMesssages();
                }
            }
        }
    }

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (!state) return;
        if (state.ack) return;
    }

    /**
     * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
     * Using this method requires "common.messagebox" property to be set to true in io-package.json
     */
    private async onMessage(obj: ioBroker.Message): Promise<void> {
        if (typeof obj === 'object' && obj.message) {
            this.log.debug(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
            let connected = true;
            let state;
            switch (String(obj.command)) {
                case 'Messages':
                    {
                        if (obj.message.service) {
                            const templates = this.config.templateTable;
                            const reply = [
                                {
                                    label: `none`,
                                    value: `none`,
                                },
                            ];
                            for (const a in templates) {
                                const t = templates[a];
                                if (t.templateKey !== '' && !t.templateKey.startsWith('_')) {
                                    reply.push({
                                        label: `${t.templateKey}`,
                                        value: `${t.templateKey}`,
                                    });
                                }
                            }
                            this.log.debug(obj.command + ': ' + JSON.stringify(reply));
                            this.sendTo(obj.from, obj.command, reply, obj.callback);
                        } else {
                            this.sendTo(obj.from, obj.command, [], obj.callback);
                            this.log.warn(
                                `warn(44): Retrieve message with ${obj.command}, but without obj.message.service`,
                            );
                        }
                    }

                    break;
                case 'notificationService':
                    {
                        if (obj.message && obj.message.service) {
                            const temp: { [key: number]: boolean } = {};
                            try {
                                const objs = await this.getObjectViewAsync('system', 'instance', {
                                    startkey: `system.adapter.${obj.message.service}.`,
                                    endkey: `system.adapter.${obj.message.service}.\u9999`,
                                });

                                if (objs && objs.rows) {
                                    for (const a in objs.rows) {
                                        const instance = Number(objs.rows[a].id.split('.')[3]);
                                        if (instance !== undefined) {
                                            temp[instance] = true;
                                        }
                                    }
                                }
                            } catch (error) {
                                this.log.error(`error(44): ${error}`);
                            }

                            const reply = [{ label: 'none', value: 'none' }];

                            for (const t in temp) {
                                reply.push({
                                    label: `${obj.message.service}.${t}`,
                                    value: `${obj.message.service}.${t}`,
                                });
                            }
                            this.log.debug(obj.command + ': ' + JSON.stringify(reply));
                            this.sendTo(obj.from, obj.command, reply, obj.callback);
                        }
                    }
                    break;
                case 'templateHelp':
                    if (obj.callback) {
                        let reply = 'Tokens: ';

                        for (const a in customFormatedTokensJson) {
                            reply +=
                                '${' +
                                a +
                                '}: ' +
                                ((await this.library.getTranslation(
                                    customFormatedTokensJson[a as keyof customFormatedTokens],
                                )) +
                                    ' - / - ');
                        }
                        reply = reply.slice(0, -7);
                        //this.log.debug(obj.command + ': ' + JSON.stringify(reply));
                        this.sendTo(obj.from, obj.command, reply, obj.callback);
                    }
                    break;
                case 'filterLevel':
                    if (obj.callback) {
                        const reply = [];
                        const text = textLevels.textGeneric;
                        for (const a in text) {
                            if (Number(a) == 5) break;
                            reply.push({
                                label: await this.library.getTranslation(
                                    textLevels.textGeneric[a as keyof typeof text],
                                ),
                                value: Number(a),
                            });
                        }
                        this.log.debug(obj.command + ': ' + JSON.stringify(reply));
                        this.sendTo(obj.from, obj.command, reply, obj.callback);
                    }
                    break;
                case 'filterType':
                    if (obj.callback) {
                        const reply = [];
                        if (
                            obj.message &&
                            obj.message.service &&
                            providerServicesArray.indexOf(obj.message.service) != -1
                        ) {
                            const service = obj.message.service as 'dwdService' | 'uwzService' | 'zamgService';
                            for (const b in genericWarntyp) {
                                const a = Number(b) as keyof genericWarntypeType;
                                if (genericWarntyp[a][service] !== undefined && genericWarntyp[a][service].length > 0) {
                                    reply.push({
                                        label: await this.library.getTranslation(genericWarntyp[a].name),
                                        value: a,
                                    });
                                }
                            }
                        } else if (
                            obj.message &&
                            obj.message.service &&
                            NotificationType.Array.indexOf(obj.message.service) != -1
                        ) {
                            for (const b in genericWarntyp) {
                                const a = Number(b) as keyof genericWarntypeType;
                                reply.push({
                                    label: await this.library.getTranslation(genericWarntyp[a].name),
                                    value: a,
                                });
                            }
                        }
                        this.log.debug(obj.command + ': ' + JSON.stringify(reply));
                        this.sendTo(obj.from, obj.command, reply, obj.callback);
                    }
                    break;
                case 'dwd.name':
                case 'dwd.check':
                case 'dwd.name.text':
                    {
                        //debounce
                        if (this.adminTimeoutRef) {
                            this.clearTimeout(this.adminTimeoutRef);
                            this.adminTimeoutRef = this.setTimeout(this.dwdWarncellIdLongHelper, 2000, {
                                obj: obj,
                                that: this,
                            });
                        } else {
                            this.dwdWarncellIdLongHelper({
                                obj: obj,
                                that: this,
                            });
                            this.adminTimeoutRef = this.setTimeout(
                                (that: any) => (that.adminTimeoutRef = null),
                                2000,
                                this,
                            );
                        }
                    }
                    break;
                case 'test':
                    this.log.debug(`Retrieve test message!`);
                    this.sendTo(obj.from, 'test', 'Test Message', obj.callback);
                    break;
                /**testing online */
                case 'test-connection':
                    if (obj.from !== 'system.adapter.test.0') {
                        this.sendTo(obj.from, obj.command, 'Dont use this command!', obj.callback);
                        return;
                    }
                    this.log.debug(`Retrieve test-connection message!`);
                    connected = true;
                    [
                        'provider.dwd.info.connection',
                        'provider.uwz.info.connection',
                        'provider.zamg.info.connection',
                        'info.connection',
                    ].forEach((a) => {
                        state = this.library.getdb(a);
                        if (state) connected = connected && !!state.val;
                    });
                    // connected === true is right
                    this.sendTo(obj.from, obj.command, connected ? 'true' : 'false', obj.callback);
                    break;
                /** testing with testdata and switch then to online */
                case 'test-data':
                    if (obj.from !== 'system.adapter.test.0') {
                        this.sendTo(obj.from, obj.command, 'Dont use this command!', obj.callback);
                        return;
                    }
                    connected = false;
                    [
                        'provider.dwd.info.connection',
                        'provider.uwz.info.connection',
                        'provider.zamg.info.connection',
                        'info.connection',
                    ].forEach((a) => {
                        state = this.library.getdb(a);
                        if (state) connected = connected || !!state.val;
                    });
                    state = this.library.getdb('provider.activeWarnings');
                    if (state) connected = !!connected || !(state.val && Number(state.val) >= 4);
                    else connected = true; //error
                    // connected === false is right
                    this.sendTo(
                        obj.from,
                        obj.command,
                        !connected
                            ? 'ok'
                            : `connect: ${connected} (false) activeWarnings ${state ? state.val : 'undefined'} (>=4)`,
                        obj.callback,
                    );
                    this.config.useTestWarnings = false;
                    break;
                default:
                    this.sendTo(obj.from, obj.command, 'unknown message', obj.callback);
                    this.log.debug(
                        `Retrieve unknown command ${obj.command} messsage: ${JSON.stringify(obj.message)} from ${
                            obj.from
                        }`,
                    );
            }
        }
    }
    dwdWarncellIdLongHelper(obj1: any): void {
        const obj = obj1.obj as ioBroker.Message;
        const that = obj1.that as WeatherWarnings;
        if (obj.callback) {
            const data = dwdWarncellIdLong;
            //if (!data) data = await axios.get(that.config.dwdWarncellTextUrl);
            const text: any[] = [];
            if (text.length == 0) {
                const dataArray: string[] = data.split('\n');

                dataArray.splice(0, 1);
                dataArray.forEach((element) => {
                    const value = element.split(';')[0];
                    const cityText = element.split(';')[1];
                    //const cityText = element.split(';')[2];
                    if (
                        value &&
                        (value.startsWith('10') ||
                            value.startsWith('9') ||
                            value.startsWith('8') ||
                            value.startsWith('7'))
                    ) {
                        //if (text) text.push(`${cityText} #${value}`);
                        if (text) text.push({ label: cityText, value: value.trim() });
                    }
                });
                text.sort((a, b) => {
                    const nameA = a.label.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.label.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                });
            }
            const msg = obj.message;
            if (msg.dwd.length > 2) {
                const result = text.filter(
                    (a) =>
                        (a.label && a.label.toUpperCase().includes(msg.dwd.toUpperCase())) ||
                        (!isNaN(msg.dwd) && Number(a.value) == Number(msg.dwd)),
                );
                //if (result.length == 1) that.config.dwdSelectId = result[0].value;

                if (obj.command == 'dwd.name') that.sendTo(obj.from, obj.command, result, obj.callback);
                else if (obj.command == 'dwd.name.text' || obj.command == 'dwd.check')
                    that.sendTo(obj.from, obj.command, result.length == 1 ? result[0].label : '', obj.callback);
                //that.log.debug(`ID is is: ${that.config.dwdSelectId}`);
            } else {
                if (obj.command == 'dwd.name.text' || obj.command == 'dwd.check')
                    that.sendTo(obj.from, obj.command, '', obj.callback);
                else that.sendTo(obj.from, obj.command, text, obj.callback);
            }
            that.adminTimeoutRef = null;
        }
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode

    module.exports = (options: WeatherWarnings | undefined) =>
        //@ts-expect-error no idea why options need log
        new WeatherWarnings(options);
} else {
    // otherwise start the instance directly
    (() => new WeatherWarnings())();
}
export = WeatherWarnings;
