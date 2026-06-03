/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import io_package from '../io-package.json';
import 'source-map-support/register';
import { ProviderController } from './lib/provider.js';
import { Library } from './lib/library.js';
import * as messagesDef from './lib/def/messages-def';
import * as providerDef from './lib/def/provider-def';
import * as NotificationType from './lib/def/notificationService-def';
import { statesObjectsWarnings } from './lib/def/definition.js';
import { resolveNotificationServices } from './lib/notificationServiceConfig.js';
import { SERVICE_TYPES, flatEntryToModel, type NotificationServicesConfig } from './lib/notificationServicesModel.js';
// Load your modules here, e.g.:
// import * as fs from "node:fs";

class WeatherWarnings extends utils.Adapter {
    startDelay: ioBroker.Timeout | undefined = undefined;
    library: Library;
    providerController: ProviderController | null = null;
    numOfRawWarnings: number = 5;
    adminTimeoutRef: any = null;
    fetchs: Map<AbortController, ioBroker.Timeout | undefined> = new Map();

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
        if (!Array.isArray(this.config.allowedDirs)) {
            this.config.allowedDirs = [];
        }
        let i = 0;
        let change = false;
        let allowedDirsConfig = {};
        while (i++ < 2) {
            const allowedDirs = this.config.allowedDirs;

            for (const a of providerDef.providerServicesArray) {
                let hit = -1;
                for (let b = 0; b < allowedDirs.length; b++) {
                    if (allowedDirs[b].providerService == a.replace('Service', '').toUpperCase()) {
                        hit = b;
                        break;
                    }
                }
                if (hit == -1) {
                    change = true;
                    this.config.allowedDirs.push({
                        providerService: a.replace('Service', '').toUpperCase(),
                        dpWarning: true,
                        dpMessage: true,
                        dpFormated: true,
                        dpAlerts: true,
                    });
                }
                //@ts-expect-error dann so
                allowedDirsConfig[a] = this.config.allowedDirs[hit == -1 ? this.config.allowedDirs.length - 1 : hit];
            }
            if (providerDef.providerServicesArray.length != this.config.allowedDirs.length) {
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
            //const states = await this.getStatesAsync('*');
            await this.library.init();
            this.providerController.setAllowedDirs(allowedDirsConfig);
            await this.library.initStates(await this.getStatesAsync('*'));
        } catch (error) {
            this.log.error(`catch(1): init error while reading states! ${error as string}`);
        }
        change = false;
        const obj = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
        //create template Help
        if (obj) {
            {
                let reply = 'Tokens:\n';
                const keys = Object.keys(messagesDef.customFormatedTokensJson);
                keys.sort();
                for (const a of keys) {
                    reply += `\${${a}}: ${this.library.getTranslation(
                        statesObjectsWarnings.allService.formatedkeys[
                            a as keyof typeof statesObjectsWarnings.allService.formatedkeys
                        ].common.name as string,
                    )}\n`;
                }
                reply = reply.slice(0, -1);
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
                    .map(a => messagesDef.genericWarntyp[a].id)
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
                if (!sounds || !Array.isArray(sounds)) {
                    sounds = [];
                }
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
                            sounds[index].warntype = t;
                        }
                    } else {
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

        this.config.numOfRawWarnings =
            typeof this.config.numOfRawWarnings == 'number' && this.config.numOfRawWarnings > 0
                ? this.config.numOfRawWarnings
                : 5;

        this.startDelay = this.setTimeout(async () => {
            if (!this.providerController) {
                return;
            }
            if (this.providerController.unload) {
                return;
            }

            await this.providerController.init();
            this.log.info(`Refresh Interval: ${this.providerController.refreshTime / 60_000} minutes`);

            // one-time migration of the legacy flat per-service config keys into
            // the structured notificationServices object. Only services that are
            // not yet present get migrated, so later admin edits are never lost.
            {
                const existing: NotificationServicesConfig =
                    (this.config.notificationServices as NotificationServicesConfig) ?? {};
                const merged: NotificationServicesConfig = { ...existing };
                let migrated = false;
                for (const service of SERVICE_TYPES) {
                    if (!merged[service]) {
                        merged[service] = flatEntryToModel(service, this.config);
                        migrated = true;
                    }
                }
                if (migrated) {
                    const obj = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
                    if (obj) {
                        this.log.info('Migrating notification service configuration to the new structured format.');
                        obj.native.notificationServices = merged;
                        await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj);
                        return; // adapter restarts with the migrated configuration
                    }
                }
            }

            const { options: notificationServiceOpt, disabledServices } = resolveNotificationServices(
                this.config,
                this.log,
            );
            for (const service of disabledServices) {
                (this.config as unknown as Record<string, any>)[`${service}_Enabled`] = false;
            }
            try {
                await this.providerController.createNotificationService(notificationServiceOpt);
            } catch {
                this.log.error('Execution interrupted - Please check your configuration. ---');
                return;
            }
            // dwdSelectID gegen Abfrage prüfen und erst dann als valide erklären.
            for (const id of this.config.dwdwarncellTable) {
                if (this.config.dwdEnabled) {
                    if (isNaN(id.dwdSelectId) || Number(id.dwdSelectId) < 10_000) {
                        this.log.warn(`DWD "${id.dwdSelectId}" warning cell is invalid.`);
                        continue;
                    }
                    const options: providerDef.messageFilterTypeWithFilter & {
                        [key: string]: any;
                    } = {
                        filter: {
                            type: this.config.dwdTypeFilter,
                            level: this.config.dwdLevelFilter,
                            hours: this.config.dwdHourFilter,
                        },
                    };
                    this.log.info(`DWD ${id.dwdSelectId} activated. Retrieve data.`);
                    this.providerController.createProviderIfNotExist({
                        ...options,
                        service: 'dwdService',
                        customName: id.dwdCityname,
                        warncellId: String(id.dwdSelectId),
                        providerController: this.providerController,
                        language: this.config.dwdLanguage,
                    });
                }
            }

            for (const id of this.config.zamgwarncellTable) {
                if (this.config.zamgEnabled && id && typeof id.zamgSelectId == 'string' && id.zamgSelectId) {
                    this.log.info('ZAMG activated. Retrieve data.');
                    const options: providerDef.messageFilterTypeWithFilter & {
                        [key: string]: any;
                    } = {
                        filter: {
                            type: this.config.zamgTypeFilter,
                            level: this.config.zamgLevelFilter,
                            hours: this.config.zamgHourFilter,
                        },
                    };
                    const zamgArr = id.zamgSelectId.split('/') as [string, string];
                    if (zamgArr.length == 2) {
                        this.providerController.createProviderIfNotExist({
                            ...options,
                            service: 'zamgService',
                            warncellId: zamgArr,
                            language: this.config.zamgLanguage,
                            providerController: this.providerController,
                            customName: id.zamgCityname,
                        });
                    }
                }
            }
            const tempTable: any = JSON.parse(JSON.stringify(this.config.uwzwarncellTable));
            for (const id of this.config.uwzwarncellTable) {
                if (this.config.uwzEnabled) {
                    if (
                        (id && typeof id.uwzSelectId == 'string' && id.uwzSelectId.split('/').length == 2) ||
                        (id.realWarncell && typeof id.realWarncell === 'string')
                    ) {
                        if (!id.realWarncell) {
                            const tempWarncell = await providerDef.UWZProvider.getWarncell(
                                id.uwzSelectId.split('/') as [string, string],
                                'uwzService',
                                this,
                            );
                            if (this.providerController.unload) {
                                return;
                            }

                            if (tempWarncell) {
                                id.realWarncell = tempWarncell;
                            }
                        }
                        const options: providerDef.messageFilterTypeWithFilter = {
                            filter: {
                                type: this.config.uwzTypeFilter,
                                level: this.config.uwzLevelFilter,
                                hours: this.config.uwzHourFilter,
                            },
                        };
                        if (!id.realWarncell || typeof id.realWarncell !== 'string') {
                            this.log.warn(`Dont find a UWZ warncell for ${id.uwzSelectId}!`);
                            continue;
                        }
                        this.log.info('UWZ activated. Retrieve data.');
                        this.providerController.createProviderIfNotExist({
                            ...options,
                            service: 'uwzService',
                            warncellId: id.realWarncell,
                            providerController: this.providerController,
                            language: this.config.uwzLanguage,
                            customName: id.uwzCityname,
                        });
                    } else {
                        this.log.warn(
                            `Something is wrong with uwz coordinates: ${id.uwzSelectId} or warncell: ${id.realWarncell}`,
                        );
                    }
                }
            }
            if (JSON.stringify(tempTable) != JSON.stringify(this.config.uwzwarncellTable)) {
                const obj = await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`);
                if (obj) {
                    this.log.debug('change config uwzwarncellTable');
                    obj.native.uwzwarncellTable = tempTable;
                    await this.setForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`, obj);
                }
            }
            //clear tree
            const holdStates = [];
            const holdStates2 = [];
            const reCheckStates = [];
            for (const a of this.providerController.providers) {
                holdStates.push(a.name);
                reCheckStates.push(`${a.name}.formatedKeys`);
                reCheckStates.push(`${a.name}..warning`);
                for (let b = 0; b < this.config.numOfRawWarnings; b++) {
                    holdStates2.push(`${a.name}.formatedKeys.${`00${b}`.slice(-2)}`);
                    holdStates2.push(`${a.name}..warning.${`00${b}`.slice(-2)}`);
                }
            }
            holdStates.push('commands.');
            holdStates.push('alerts.');
            holdStates.push('info.connection');
            holdStates.push('provider.activeWarnings_json');
            holdStates.push('provider.history');
            holdStates.push('provider.activeWarnings');
            await this.library.cleanUpTree(holdStates, null, 3);
            await this.library.cleanUpTree(holdStates2, reCheckStates, 5);

            await this.providerController.finishInit();

            this.providerController.updateEndless().catch(() => {});
            await this.providerController.updateAlertEndless();
        }, 2000);
    }

    /**
     * Is called when the adapter is unloaded.
     *
     * @param callback - function that must be called when the unload is finished.
     *                  The callback is called with one argument: `null`.
     */
    private async onUnload(callback: () => void): Promise<void> {
        try {
            if (this.startDelay) {
                this.clearTimeout(this.startDelay);
            }
            if (this.providerController) {
                await this.providerController.delete();
            }
            for (const [controller, timeoutId] of this.fetchs.entries()) {
                try {
                    if (timeoutId) {
                        this.clearTimeout(timeoutId);
                    }
                    controller.abort();
                } catch {
                    // ignore errors during abort/clear
                }
            }
            this.fetchs.clear();
            callback();
        } catch {
            callback();
        }
    }

    /**
     * Is called when an object is changed
     *
     * @param id - id of the object that changed
     * @param obj - the changed object
     * @returns - a promise that resolves to void
     */
    private async onObjectChange(id: string, obj: ioBroker.Object | null | undefined): Promise<void> {
        if (obj) {
            // The object was changed
            if (id == 'system.config') {
                if (await this.library.setLanguage(obj.common.language)) {
                    if (this.providerController) {
                        await this.providerController.updateMesssages();
                    }
                }
            }
        }
    }

    /**
     * Is called when a state changes
     *
     * @param id - id of the state that changed
     * @param state - the new state
     * @returns - a promise that resolves to void
     */
    private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (!state) {
            return;
        }
        if (state.ack) {
            return;
        }
        this.library.setdb(id.replace(`${this.namespace}.`, ''), 'state', state.val, undefined, state.ack, state.ts);

        if (await this.providerController!.onStatePush(id)) {
            return;
        }
        if (await this.providerController!.clearHistory(id)) {
            return;
        }
        if (await this.providerController!.setSpeakAllowed(id)) {
            return;
        }
    }

    private async onMessage(obj: ioBroker.Message): Promise<void> {
        if (typeof obj === 'object' && obj.message) {
            console.log(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
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
                                    label: this.library.getTranslation('Monday'),
                                    value: '1',
                                },
                                {
                                    label: this.library.getTranslation('Tuesday'),
                                    value: '2',
                                },
                                {
                                    label: this.library.getTranslation('Wednesday'),
                                    value: '3',
                                },
                                {
                                    label: this.library.getTranslation('Thursday'),
                                    value: '4',
                                },
                                {
                                    label: this.library.getTranslation('Friday'),
                                    value: '5',
                                },
                                {
                                    label: this.library.getTranslation('Saturday'),
                                    value: '6',
                                },
                                {
                                    label: this.library.getTranslation('Sunday'),
                                    value: '0',
                                },
                            ],
                            obj.callback,
                        );
                    }
                    break;
                /*case 'alexa_audio':
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
                    break;*/
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
                            const objs = await this.getForeignObjectsAsync(`${obj.message.adapter}.Echo-Devices.*`);
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
                            ].forEach(a => {
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
                            for (const t of templates) {
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
                                    for (const row of objs.rows) {
                                        const instance = Number(row.id.split('.')[3]);
                                        if (instance !== undefined) {
                                            temp[instance] = true;
                                        }
                                    }
                                }
                            } catch (error) {
                                this.log.error(`error(44): ${error as string}`);
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
                            switch (a) {
                                case '0':
                                case '1':
                                case '2':
                                case '3':
                                case '4': {
                                    reply.push({
                                        label: this.library.getTranslation(
                                            messagesDef.textLevels.textGeneric[a as unknown as keyof typeof text],
                                        ),
                                        value: Number(a),
                                    });
                                    break;
                                }
                            }
                            if (Number(a) == 5) {
                                break;
                            }
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
                            providerDef.providerServicesArray.indexOf(obj.message.service) != -1
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
                    connected = false;
                    [
                        'provider.dwd.info.connection',
                        'provider.uwz.info.connection',
                        'provider.zamg.info.connection',
                        'info.connection',
                    ].forEach(a => {
                        state = this.library.readdp(a);
                        if (state) {
                            connected = connected || !!state.val;
                        }
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
                    ].forEach(a => {
                        state = this.library.readdp(a);
                        if (state) {
                            connected = connected || !!state.val;
                        }
                    });
                    state = this.library.readdp('provider.activeWarnings');
                    if (state) {
                        connected = !!connected || !(state.val && Number(state.val) >= 4);
                    } else {
                        connected = true;
                    } //error
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

    handleFetchError(error: any): void {
        if (error.name === 'AbortError') {
            return;
        }

        if (error instanceof Error) {
            const causeCode: string | undefined =
                error.cause &&
                typeof error.cause === 'object' &&
                'code' in error.cause &&
                typeof (error.cause as any).code === 'string'
                    ? (error.cause as any).code
                    : undefined;

            // Readable messages for common network errors
            const networkMessages: Record<string, string> = {
                ENOTFOUND: 'Host not found (DNS lookup failed)',
                ECONNREFUSED: 'Connection refused',
                ECONNRESET: 'Connection reset by remote host',
                ETIMEDOUT: 'Connection timed out',
                ENETUNREACH: 'Network unreachable',
                ENOTCONN: 'Not connected to network',
            };

            if (causeCode && networkMessages[causeCode]) {
                this.log.warn(`Network error: ${networkMessages[causeCode]} (${causeCode})`);
                return;
            }

            // HTTP errors (e.g. "HTTP 503: Service Unavailable")
            if (error.message.startsWith('HTTP ')) {
                this.log.warn(`Server returned ${error.message}`);
                return;
            }

            // Other errors
            const parts = [`Error: ${error.message}`];
            if (error.name && error.name !== 'Error' && error.name !== 'TypeError') {
                parts.unshift(`Error Name: ${error.name}`);
            }
            this.log.warn(parts.join(' | '));
        } else if (typeof error === 'object' && error !== null) {
            const parts: string[] = [];
            if (error.status) {
                parts.push(`HTTP Status: ${error.status}`);
            }
            if (error.statusText) {
                parts.push(`Status Text: ${error.statusText}`);
            }
            if (error.code) {
                parts.push(`Error Code: ${error.code}`);
            }
            if (!parts.length) {
                parts.push(`Error: ${JSON.stringify(error)}`);
            }
            this.log.warn(parts.join(', '));
        } else {
            this.log.warn(`Error: ${String(error)}`);
        }
    }
    async fetch(url: string, init?: RequestInit, timeout = 30_000): Promise<unknown> {
        const controller = new AbortController();

        // 30 seconds timeout
        const timeoutId = this.setTimeout(() => {
            // Abort and remove entry to avoid leak
            try {
                controller.abort();
            } catch {
                // ignore
            }
            this.fetchs.delete(controller);
        }, timeout);

        this.fetchs.set(controller, timeoutId);

        try {
            const response = await fetch(url, {
                ...init,
                method: init?.method ?? 'GET',
                signal: controller.signal,
            });
            if (response.status === 200) {
                return await response.json();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        } finally {
            // always clear timeout and remove the controller
            const id = this.fetchs.get(controller);
            if (typeof id !== 'undefined') {
                this.clearTimeout(id);
            }
            this.fetchs.delete(controller);
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
