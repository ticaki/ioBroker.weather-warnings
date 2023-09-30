/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';

import axios from 'axios';
import 'source-map-support/register';
import { dwdWarncellIdLong } from './lib/def/dwdWarncellIdLong';
import { ProviderController } from './lib/provider.js';
import { Library } from './lib/library.js';
import { genericWarntyp, genericWarntypeType, textLevels } from './lib/def/messages-def';
import { messageFilterTypeWithFilter, providerServices } from './lib/def/provider-def';
import { notificationServiceOptionsType, notificationTemplateType } from './lib/def/notificationService-def';
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
        // this.on('objectChange', this.onObjectChange.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.library = new Library(this);
        this.providerController = new ProviderController(this);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        if (this.providerController) {
            this.providerController.init();
            this.log.info(`Refresh Interval: ${this.providerController.refreshTime / 60000} minutes`);
        } else {
            throw new Error('Provider controller doesnt exists.');
        }

        setTimeout(
            async function (self: any) {
                if (!self.providerController) return;
                if (!self) return;
                await self.library.init();
                let notificationServiceOpt: notificationServiceOptionsType = {};
                if (self.config.telegram_Enabled) {
                    const service: providerServices[] = [];
                    if (self.config.telegram_DwdEnabled) service.push('dwdService');
                    if (self.config.telegram_UwzEnabled) service.push('uwzService');
                    if (self.config.telegram_UwzEnabled) service.push('zamgService');
                    const template: notificationTemplateType = {
                        new: self.config.telegram_MessageNew,
                        remove: self.config.telegram_MessageRemove,
                        removeAll: self.config.telegram_MessageAllRemove,
                    };

                    notificationServiceOpt = {
                        ...notificationServiceOpt,
                        telegram: {
                            service: service,
                            filter: { level: self.config.telegram_LevelFilter, type: self.config.telegram_TypeFilter },
                            adapter: self.config.telegram_Adapter,
                            name: 'telegram',
                            template: template,
                        },
                    };
                }
                if (self.config.whatsapp_Enabled) {
                    const service: providerServices[] = [];
                    if (self.config.whatsapp_DwdEnabled) service.push('dwdService');
                    if (self.config.whatsapp_UwzEnabled) service.push('uwzService');
                    if (self.config.whatsapp_ZamgEnabled) service.push('zamgService');
                    const template: notificationTemplateType = {
                        new: self.config.whatsapp_MessageNew,
                        remove: self.config.whatsapp_MessageRemove,
                        removeAll: self.config.whatsapp_MessageAllRemove,
                    };
                    notificationServiceOpt = {
                        ...notificationServiceOpt,
                        whatsapp: {
                            service: service,
                            filter: { level: self.config.whatsapp_LevelFilter, type: self.config.whatsapp_TypeFilter },
                            adapter: self.config.whatsapp_Adapter,
                            name: 'whatsapp',
                            template: template,
                        },
                    };
                }
                if (self.config.pushover_Enabled) {
                    const service: providerServices[] = [];
                    if (self.config.pushover_DwdEnabled) service.push('dwdService');
                    if (self.config.pushover_UwzEnabled) service.push('uwzService');
                    if (self.config.pushover_ZamgEnabled) service.push('zamgService');
                    const template: notificationTemplateType = {
                        new: self.config.pushover_MessageNew,
                        remove: self.config.pushover_MessageRemove,
                        removeAll: self.config.pushover_MessageAllRemove,
                    };
                    notificationServiceOpt = {
                        ...notificationServiceOpt,
                        pushover: {
                            service: service,
                            filter: { level: self.config.pushover_LevelFilter, type: self.config.pushover_TypeFilter },
                            adapter: self.config.pushover_Adapter,
                            name: 'pushover',
                            template: template,
                        },
                    };
                }

                self.providerController.createNotificationService(notificationServiceOpt);
                try {
                    const states = await self.getStatesAsync('*');
                    self.library.initStates(states);
                } catch (error) {
                    self.log.error(`catch (1): init error while reading states! ${error}`);
                }

                // dwdSelectID gegen Abfrage prüfen und erst dann als valide erklären.
                if (self.config.dwdSelectId > 10000 && self.config.dwdEnabled) {
                    const options: messageFilterTypeWithFilter & { [key: string]: any } = {
                        filter: { type: self.config.dwdTypeFilter, level: self.config.dwdLevelFilter },
                        language: self.config.dwdLanguage,
                    };
                    self.log.info('DWD activated. Retrieve data.');
                    self.providerController.createProviderIfNotExist({
                        ...options,
                        service: 'dwdService',
                        warncellId: self.config.dwdSelectId, //805111000 Düssel - kirn 807133052
                    });
                }
                if (
                    self.config.zamgEnabled &&
                    self.config.zamgSelectID &&
                    typeof self.config.zamgSelectID == 'string'
                ) {
                    self.log.info('ZAMG activated. Retrieve data.');
                    const options: messageFilterTypeWithFilter & { [key: string]: any } = {
                        filter: { type: self.config.zamgTypeFilter },
                        language: self.config.zamgLanguage,
                    };
                    const zamgArr = self.config.zamgSelectID.split('#');
                    if (zamgArr.length == 2) {
                        self.providerController.createProviderIfNotExist({
                            ...options,
                            service: 'zamgService',
                            warncellId: zamgArr, //
                        });
                    }
                }
                if (self.config.uwzEnabled && self.config.uwzSelectID) {
                    const options: messageFilterTypeWithFilter & { [key: string]: any } = {
                        filter: { type: self.config.uwzTypeFilter },
                        language: self.config.uwzLanguage,
                    };
                    self.log.info('UWZ activated. Retrieve data.');
                    self.providerController.createProviderIfNotExist({
                        ...options,
                        service: 'uwzService',
                        warncellId: 'UWZ' + self.config.uwzSelectID.toUpperCase(), //UWZ + Land + PLZ
                    });
                }

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
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);
            if (this.providerController) this.providerController.delete();
            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    // 	if (obj) {
    // 		// The object was changed
    // 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    // 	} else {
    // 		// The object was deleted
    // 		this.log.info(`object ${id} deleted`);
    // 	}
    // }

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
                                if (t.templateKey !== '') {
                                    reply.push({
                                        label: `${t.templateKey}`,
                                        value: `${t.templateKey}`,
                                    });
                                }
                            }
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
                            this.log.debug(JSON.stringify(reply));

                            this.sendTo(obj.from, obj.command, reply, obj.callback);
                        }
                    }
                    break;
                case 'filterLevel':
                    if (obj.callback) {
                        const reply = [];
                        for (const a in textLevels.textGeneric) {
                            if (Number(a) == 5) break;
                            reply.push({
                                //@ts-expect-error ...
                                label: await this.library.getTranslation(textLevels.textGeneric[a]),
                                value: a,
                            });
                        }
                        this.sendTo(obj.from, obj.command, reply, obj.callback);
                    }
                    break;
                case 'filterType':
                    if (obj.callback) {
                        const reply = [];
                        if (
                            obj.message &&
                            obj.message.service &&
                            ['dwdService', 'uwzService', 'zamgService'].indexOf(obj.message.service) != -1
                        ) {
                            const service = obj.message.service as 'dwdService' | 'uwzService' | 'zamgService';
                            for (const b in genericWarntyp) {
                                const a = Number(b) as keyof genericWarntypeType;
                                if (genericWarntyp[a][service].length > 0) {
                                    reply.push({
                                        label: await this.library.getTranslation(genericWarntyp[a].name),
                                        value: a,
                                    });
                                }
                            }
                        } else if (
                            obj.message &&
                            obj.message.service &&
                            ['telegram'].indexOf(obj.message.service) != -1
                        ) {
                            for (const b in genericWarntyp) {
                                const a = Number(b) as keyof genericWarntypeType;
                                reply.push({
                                    label: await this.library.getTranslation(genericWarntyp[a].name),
                                    value: a,
                                });
                            }
                        }
                        this.sendTo(obj.from, obj.command, reply, obj.callback);
                    }
                    break;
                case 'dwd.name':
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
                /**testing with testdata and switch then to online */
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
                    state = this.library.getdb('provider.activWarnings');
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
                    this.log.debug(`Retrieve unknown command ${obj.command} from ${obj.from}`);
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
                if (result.length == 1) that.config.dwdSelectId = result[0].value;

                if (obj.command == 'dwd.name') that.sendTo(obj.from, obj.command, result, obj.callback);
                else if (obj.command == 'dwd.name.text')
                    that.sendTo(obj.from, obj.command, result.length == 1 ? result[0].label : '', obj.callback);
                that.log.debug(`ID is is: ${that.config.dwdSelectId}`);
            } else {
                if (obj.command == 'dwd.name.text') that.sendTo(obj.from, obj.command, '', obj.callback);
                else that.sendTo(obj.from, obj.command, text, obj.callback);
            }
            that.adminTimeoutRef = null;
        }
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    //@ts-expect-error no idea why options need log
    module.exports = (options: WeatherWarnings | undefined) => new WeatherWarnings(options);
} else {
    // otherwise start the instance directly
    (() => new WeatherWarnings())();
}
export = WeatherWarnings;
