/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import io_package from '../io-package.json';
import axios from 'axios';
import 'source-map-support/register';
import { dwdWarncellIdLong } from './lib/def/dwdWarncellIdLong';
import { ProviderController } from './lib/provider.js';
import { Library } from './lib/library.js';
import * as messagesDef from './lib/def/messages-def';
import { messageFilterTypeWithFilter, providerServices, providerServicesArray } from './lib/def/provider-def';
import * as NotificationType from './lib/def/notificationService-def';
import { notificationServiceDefaults } from './lib/def/notificationService-def.js';
import { actionStates } from './lib/def/definitionen.js';
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

        try {
            //const states = await self.getStatesAsync('*');
            await this.library.init();
            this.providerController.setAllowedDirs(allowedDirsConfig);
            await this.library.initStates(await this.getStatesAsync('*'));
        } catch (error) {
            this.log.error(`catch(1): init error while reading states! ${error}`);
        }
        change = false;
        const obj = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
        //create alexa sound array
        if (obj) {
            {
                let reply = 'Tokens:\n';
                const keys = Object.keys(messagesDef.customFormatedTokensJson);
                keys.sort();
                for (const a in keys) {
                    reply +=
                        '${' +
                        keys[a] +
                        '}: ' +
                        (this.library.getTranslation(
                            messagesDef.customFormatedTokensJson[keys[a] as keyof messagesDef.customFormatedTokens],
                        ) +
                            '\n');
                }
                reply = reply.slice(0, -2);
                if (obj.native.templateHelp && obj.native.templateHelp.valueOf() != reply.valueOf()) {
                    obj.native.templateHelp = reply;
                    change = true;
                    this.log.info('Update configuration. Reason: templateHelp');
                }
            }
            {
                let reply = ' ';
                reply = Object.keys(messagesDef.genericWarntyp)
                    //@ts-expect-error is keyof
                    .map((a) => messagesDef.genericWarntyp[a].id)
                    .join(', ');
                if (this.config.icons_description != reply) {
                    obj.native.icons_description = reply;
                    this.log.info('Update configuration. Reason: icons_description');
                    change = true;
                }
            }
            {
                if (this.config.silentTime) {
                    let update = false;
                    for (const a of this.config.silentTime) {
                        if (a.profil != undefined) {
                            update = true;
                        }
                    }
                    if (update) {
                        this.log.debug('update config');
                        change = true;
                        obj.native.silentTime = [];
                        this.log.info('Update configuration. Reason: silentTime');
                    }
                }
            }
            {
                let sounds = obj.native.alexa2_sounds || [];
                if (!sounds || !Array.isArray(sounds)) sounds = [];
                for (const w in messagesDef.genericWarntyp) {
                    const index = sounds.findIndex(
                        (a: { warntype: string; sound: string; warntypenumber: number }) =>
                            a.warntypenumber == Number(w),
                    );
                    if (index != -1) {
                        const t = this.library.getTranslation(
                            messagesDef.genericWarntyp[Number(w) as keyof messagesDef.genericWarntypeType].name,
                        );
                        if (t != sounds[index].warntype) {
                            change = true;
                            sounds[index].warntype = t;
                        }
                    } else {
                        change = true;
                        sounds.push({
                            warntypenumber: Number(w),
                            warntype: this.library.getTranslation(
                                messagesDef.genericWarntyp[Number(w) as keyof messagesDef.genericWarntypeType].name,
                            ),
                            sound: '',
                        });
                    }
                }

                const index = sounds.findIndex(
                    (a: { warntype: string; sound: string; warntypenumber: number }) => a.warntypenumber == Number(0),
                );
                if (index == -1) {
                    sounds.push({
                        warntypenumber: Number(0),
                        warntype: this.library.getTranslation('template.RemoveAllMessage'),
                        sound: '',
                    });
                } else {
                    const t = this.library.getTranslation('template.RemoveAllMessage');
                    if (t != sounds[index].warntype) {
                        sounds[index].warntype = t;
                    }
                }
                if (JSON.stringify(obj.native.alexa2_sounds) != JSON.stringify(sounds)) {
                    change = true;
                    this.log.info('Update configuration. Reason: alexa2_sounds');
                    obj.native.alexa2_sounds = sounds;
                }
            }

            /** write default templates to config if template 0 == translation token */
            if (
                obj &&
                obj.native &&
                obj.native.templateTable[0] &&
                obj.native.templateTable[0].template == 'template.NewMessage'
            ) {
                this.log.info(`First start after installation detected.`);
                const templateTable: any = this.library.cloneGenericObject(obj.native.templateTable);
                for (const a in obj.native.templateTable) {
                    templateTable[a as keyof typeof this.config.templateTable].template = this.library.getTranslation(
                        obj.native.templateTable[a].template,
                    );
                    this.log.debug(
                        `Read default template from i18n: ${this.library.getTranslation(
                            obj.native.templateTable[a].template,
                        )}`,
                    );
                }
                this.config.templateTable = templateTable;
                this.log.info(`Write default templates to config for ${this.namespace}!`);

                obj.native = { ...obj.native, templateTable: templateTable };
                this.log.info('Update configuration. Reason: templateTable');
                change = true;
            }
            if (change) {
                await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj);
                this.log.info('Update configuration: Done');
            }
        }
        this.setTimeout(
            async function (that: any) {
                const self = that as WeatherWarnings;
                if (!self) return;
                if (!self.providerController) return;

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
                            new:
                                self.config[(notificationService + '_MessageNew') as keyof ioBroker.AdapterConfig] !==
                                undefined
                                    ? (self.config[
                                          (notificationService + '_MessageNew') as keyof ioBroker.AdapterConfig
                                      ] as string)
                                    : '',
                            remove: self.config[
                                (notificationService + '_MessageRemove') as keyof ioBroker.AdapterConfig
                            ] as string,
                            removeAll: self.config[
                                (notificationService + '_MessageAllRemove') as keyof ioBroker.AdapterConfig
                            ] as string,
                            all:
                                self.config[(notificationService + '_MessageAll') as keyof ioBroker.AdapterConfig] !==
                                undefined
                                    ? (self.config[
                                          (notificationService + '_MessageAll') as keyof ioBroker.AdapterConfig
                                      ] as string)
                                    : self.config[
                                          (notificationService + '_MessageNew') as keyof ioBroker.AdapterConfig
                                      ] !== undefined
                                    ? (self.config[
                                          (notificationService + '_MessageNew') as keyof ioBroker.AdapterConfig
                                      ] as string)
                                    : '',
                            manualAll:
                                self.config[(notificationService + '_manualAll') as keyof ioBroker.AdapterConfig] !==
                                undefined
                                    ? (self.config[
                                          (notificationService + '_manualAll') as keyof ioBroker.AdapterConfig
                                      ] as string)
                                    : '',
                            title:
                                self.config[(notificationService + '_Title') as keyof ioBroker.AdapterConfig] !==
                                undefined
                                    ? (self.config[
                                          (notificationService + '_Title') as keyof ioBroker.AdapterConfig
                                      ] as string)
                                    : '',
                        };
                        for (const a in template) {
                            const b = a as keyof NotificationType.ActionsType;
                            if (template[b] == undefined) continue;
                            template[b] = template[b] ? template[b]! : 'none';
                        }

                        // @ts-expect-error keine ahnung :)
                        notificationServiceOpt[notificationService] = {
                            ...notificationServiceDefaults[notificationService],
                            service: service,
                            filter: {
                                auto: {
                                    level:
                                        (self.config[
                                            (notificationService + '_LevelFilter') as keyof ioBroker.AdapterConfig
                                        ] as number) || -1,
                                    type: (
                                        (self.config[
                                            (notificationService + '_TypeFilter') as keyof ioBroker.AdapterConfig
                                        ] as string[]) || []
                                    ).map((a) => String(a)),
                                },
                                manual: {
                                    level: (self.config[
                                        (notificationService + '_ManualLevelFilter') as keyof ioBroker.AdapterConfig
                                    ] as number)
                                        ? (self.config[
                                              (notificationService +
                                                  '_ManualLevelFilter') as keyof ioBroker.AdapterConfig
                                          ] as number)
                                        : -1,
                                    type: ((self.config[
                                        (notificationService + '_ManualTypeFilter') as keyof ioBroker.AdapterConfig
                                    ] as string[])
                                        ? (self.config[
                                              (notificationService +
                                                  '_ManualTypeFilter') as keyof ioBroker.AdapterConfig
                                          ] as string[])
                                        : []
                                    ).map((a) => String(a)),
                                },
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
                if (self.config.telegram_Enabled && notificationServiceOpt.telegram != undefined) {
                    notificationServiceOpt.telegram.withNoSound = self.config.telegram_withNoSound || false;
                    notificationServiceOpt.telegram.userid = self.config.telegram_UserId || '';
                    notificationServiceOpt.telegram.chatid = self.config.telegram_ChatID || '';
                    notificationServiceOpt.telegram.parse_mode = self.config.telegram_parse_mode || 'none';
                }
                if (self.config.whatsapp_Enabled && notificationServiceOpt.whatsapp != undefined) {
                    if (self.config.whatsapp_Phonenumber)
                        notificationServiceOpt.whatsapp.phonenumber = self.config.whatsapp_Phonenumber;
                }
                if (self.config.pushover_Enabled && notificationServiceOpt.pushover != undefined) {
                    notificationServiceOpt.pushover.sound = self.config.pushover_Sound || 'none';
                    notificationServiceOpt.pushover.priority = self.config.pushover_Priority || false;
                    notificationServiceOpt.pushover.device = self.config.pushover_Device || '';
                }
                if (self.config.json_Enabled && notificationServiceOpt.json != undefined) {
                }
                if (self.config.history_Enabled && notificationServiceOpt.history != undefined) {
                }
                if (self.config.email_Enabled && notificationServiceOpt.email != undefined) {
                    notificationServiceOpt.email.actions.header = self.config.email_Header;
                    notificationServiceOpt.email.actions.footer = self.config.email_Footer;
                }
                if (self.config.alexa2_Enabled && notificationServiceOpt.alexa2 != undefined) {
                    notificationServiceOpt.alexa2.volumen =
                        self.config.alexa2_volumen > 0 ? String(self.config.alexa2_volumen) : '';
                    notificationServiceOpt.alexa2.audio = self.config.alexa2_Audio || '';
                    notificationServiceOpt.alexa2.sounds = self.config.alexa2_sounds || [];
                    notificationServiceOpt.alexa2.sounds_enabled = self.config.alexa2_sounds_enabled || false;
                    if (self.config.alexa2_device_ids.length == 0 || !self.config.alexa2_device_ids[0]) {
                        self.log.error(`Missing devices for alexa - deactivated`);
                        delete notificationServiceOpt.alexa2;
                        self.config.alexa2_Enabled = false;
                    } else if (self.config.alexa2_Adapter == 'none') {
                        self.log.error(`Missing adapter for alexa - deactivated`);
                        delete notificationServiceOpt.alexa2;
                        self.config.alexa2_Enabled = false;
                    }
                }
                if (self.config.sayit_Enabled && notificationServiceOpt.sayit != undefined) {
                    notificationServiceOpt.sayit.volumen =
                        self.config.sayit_volumen > 0 ? String(self.config.sayit_volumen) : '';
                    if (self.config.sayit_Adapter == 'none') {
                        self.log.error(`Missing adapter for alexa - deactivated`);
                        delete notificationServiceOpt.sayit;
                        self.config.sayit_Enabled = false;
                    }
                }
                try {
                    await self.providerController.createNotificationService(notificationServiceOpt);
                } catch (error) {
                    self.log.error('Execution interrupted - Please check your configuration. ---');
                    return;
                }
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
                                hours: self.config.dwdHourFilter,
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
                            filter: {
                                type: self.config.zamgTypeFilter,
                                level: self.config.zamgLevelFilter,
                                hours: self.config.zamgHourFilter,
                            },
                        };
                        const zamgArr = id.zamgSelectId.split('/') as [string, string];
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
                            filter: {
                                type: self.config.uwzTypeFilter,
                                level: self.config.uwzLevelFilter,
                                hours: self.config.uwzHourFilter,
                            },
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
                holdStates.push('command');
                holdStates.push('info.connection');
                holdStates.push('provider.activeWarnings_json');
                holdStates.push('provider.history');
                holdStates.push('provider.activeWarnings');
                await self.library.cleanUpTree(holdStates, 3);

                self.providerController.updateCommandStates();

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
     * Respond to language changes.
     */
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
     * We need this later, dont remove
     */
    private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (!state) return;
        if (state.ack) return;
        this.library.setdb(id.replace(`${this.namespace}.`, ''), 'state', state.val, undefined, state.ack, state.ts);
        if (actionStates[id.replace(`${this.namespace}.`, '')] == undefined)
            if (this.providerController) this.providerController.onStatePush(id);
        await this.library.writedp(id.replace(`${this.namespace}.`, ''), state.val);
        await this.providerController!.setSpeakAllowed();
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
                case 'weekdays':
                    {
                        this.sendTo(
                            obj.from,
                            obj.command,
                            [
                                {
                                    label: 'Monday',
                                    value: '1',
                                },
                                {
                                    label: 'Tuesday',
                                    value: '2',
                                },
                                {
                                    label: 'Wednesday',
                                    value: '3',
                                },
                                {
                                    label: 'Thursday',
                                    value: '4',
                                },
                                {
                                    label: 'Friday',
                                    value: '5',
                                },
                                {
                                    label: 'Saturday',
                                    value: '6',
                                },
                                {
                                    label: 'Sunday',
                                    value: '0',
                                },
                            ],
                            obj.callback,
                        );
                    }
                    break;
                case 'alexa_audio':
                    {
                        this.sendTo(
                            obj.from,
                            obj.command,
                            {
                                openUrl:
                                    'https://developer.amazon.com/en-US/docs/alexa/custom-skills/ask-soundlibrary.html',
                                window: '_blank',
                            },
                            obj.callback,
                        );
                    }
                    break;
                case 'alexa2_device_ids':
                    {
                        const data: any[] = [];
                        if (obj.message.adapter != 'none') {
                            /* Wenn Doku oder testbar dann so:
                            const test = await this.getObjectViewAsync('system', 'device', {
                                startkey: `${obj.message.adapter}.`,
                                endkey: `${obj.message.adapter}.\u9999`,
                            });
                            */
                            const objs = await this.getForeignObjectsAsync(obj.message.adapter + '.Echo-Devices.*');
                            for (const a in objs) {
                                if (a.endsWith('.Commands.speak')) {
                                    const channel = await this.getForeignObjectAsync(
                                        a.split('.').slice(0, 4).join('.'),
                                    );
                                    if (channel) {
                                        data.push({
                                            value: a.split('.')[3],
                                            label: channel.common.name,
                                        });
                                    }
                                }
                            }
                        }
                        this.sendTo(obj.from, obj.command, data, obj.callback);
                    }
                    break;

                /** defaults for templates */
                case 'addDefault':
                case 'restoreDefault':
                    {
                        let data: any = {};
                        if (obj.message.service == 'template') {
                            data = {
                                native: {
                                    templateTable: this.library.cloneGenericObject(io_package.native.templateTable),
                                },
                            };
                            if (obj.command == 'addDefault') {
                                const obj = await this.getForeignObjectAsync(
                                    `system.adapter.${this.name}.${this.instance}`,
                                );
                                if (obj && obj.native && obj.native.templateTable) {
                                    const config = obj.native.templateTable;
                                    for (const a of data.native.templateTable) {
                                        const index = config.findIndex((b: any) => b.templateKey == a.templateKey);
                                        if (index == -1) {
                                            config.push(a);
                                        }
                                    }
                                    data.native.templateTable = config;
                                }
                            }
                            for (const a in data.native.templateTable) {
                                const key = data.native.templateTable[a].template;
                                data.native.templateTable[a].template = this.library.getTranslation(key);
                            }
                        } else {
                            data = { native: {} };
                            [
                                `${obj.message.service}_MessageNew`,
                                `${obj.message.service}_MessageRemove`,
                                `${obj.message.service}_MessageAllRemove`,
                                `${obj.message.service}_MessageAll`,
                            ].forEach((a) => {
                                data.native[a] = io_package.native[a as keyof typeof io_package.native];
                            });
                        }
                        this.sendTo(obj.from, obj.command, data, obj.callback);
                    }
                    break;
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
                            //this.log.debug(obj.command + ': ' + JSON.stringify(reply));
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
                            //this.log.debug(obj.command + ': ' + JSON.stringify(reply));
                            this.sendTo(obj.from, obj.command, reply, obj.callback);
                        }
                    }
                    break;
                case 'filterLevel':
                    if (obj.callback) {
                        const reply = [];
                        const text = messagesDef.textLevels.textGeneric;
                        for (const a in text) {
                            if (Number(a) == 5) break;
                            reply.push({
                                label: this.library.getTranslation(
                                    messagesDef.textLevels.textGeneric[a as keyof typeof text],
                                ),
                                value: Number(a),
                            });
                        }
                        //this.log.debug(obj.command + ': ' + JSON.stringify(reply));
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
                            for (const b in messagesDef.genericWarntyp) {
                                const a = Number(b) as keyof messagesDef.genericWarntypeType;
                                if (
                                    messagesDef.genericWarntyp[a][service] !== undefined &&
                                    messagesDef.genericWarntyp[a][service].length > 0
                                ) {
                                    reply.push({
                                        label: this.library.getTranslation(messagesDef.genericWarntyp[a].name),
                                        value: a,
                                    });
                                }
                            }
                        } else if (
                            obj.message &&
                            obj.message.service &&
                            NotificationType.Array.indexOf(obj.message.service) != -1
                        ) {
                            for (const b in messagesDef.genericWarntyp) {
                                const a = Number(b) as keyof messagesDef.genericWarntypeType;
                                reply.push({
                                    label: this.library.getTranslation(messagesDef.genericWarntyp[a].name),
                                    value: a,
                                });
                            }
                        }
                        //this.log.debug(obj.command + ': ' + JSON.stringify(reply));
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
                        state = this.library.readdp(a);
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
                        state = this.library.readdp(a);
                        if (state) connected = connected || !!state.val;
                    });
                    state = this.library.readdp('provider.activeWarnings');
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
