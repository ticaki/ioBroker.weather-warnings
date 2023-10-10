// Provider

import axios from 'axios';
import WeatherWarnings from '../main';
import * as definitionen from './def/definitionen';
import { BaseClass, Library } from './library';
import * as providerDef from './def/provider-def';
import { MessagesClass } from './messages';
import * as NotificationClass from './notification';
import { getTestData } from './test-warnings';
import * as NotificationType from './def/notificationService-def';
import * as messagesDef from './def/messages-def';
export const DIV = '/';
type ProviderOptionsTypeInternal = {
    service: providerDef.providerServices;
    warncellId: string | [string, string];
} & (StringProviderOptionsType | CoordinateProviderOptionsType);

type ProviderOptionsType = ProviderOptionsTypeInternal;

type StringProviderOptionsType = BaseProviderOptionsType & {
    warncellId: string;
};
type CoordinateProviderOptionsType = BaseProviderOptionsType & {
    warncellId: [string, string];
};
type BaseProviderOptionsType = {
    providerController: ProviderController;
    language: string;
    filter: providerDef.messageFilterType;
    customName: string;
};

/** Base class for every provider */
export class BaseProvider extends BaseClass {
    service: providerDef.providerServices;
    url: string = '';
    warncellId: string | Array<string> = '';
    rawData: providerDef.DataImportType = null;
    library: Library;
    messages: MessagesClass[] = [];
    providerController: ProviderController;
    filter: providerDef.messageFilterType;
    customName: string = '';
    warncellIdString: string;
    constructor(adapter: WeatherWarnings, options: ProviderOptionsTypeInternal, name: string) {
        let warncell = typeof options.warncellId == 'string' ? options.warncellId : options.warncellId.join(DIV);
        warncell = warncell.replaceAll('.', '_');
        super(adapter, 'provider.' + `${name}.${warncell}`);

        this.warncellIdString = warncell;
        this.service = options.service;
        this.library = this.adapter.library;
        this.providerController = options.providerController;
        this.setService(options.service);
        this.log.setLogPrefix(`${name}-${options.warncellId}`);
        this.filter = options.filter;
        this.customName = options.customName;

        const temp = this.library.cloneGenericObject(
            //@ts-expect-error ist vorhanden
            definitionen.statesObjectsWarnings[this.service]._channel,
        ) as ioBroker.DeviceObject;
        temp.common.name = name.toUpperCase();
        this.library.writedp('provider.' + name, undefined, temp);

        this.init();
    }
    async init(): Promise<void> {
        const temp = this.library.cloneGenericObject(definitionen.defaultChannel) as ioBroker.ChannelObject;
        temp.common.name = this.customName;
        await this.library.writedp(`${this.name}`, undefined, temp);
        await this.adapter.extendObjectAsync(`${this.name}`, {
            common: { name: this.customName },
        });

        await this.library.writedp(`${this.name}.info`, undefined, definitionen.genericStateObjects.info._channel);
        await this.library.writedp(
            `${this.name}.formatedKeys`,
            undefined,
            definitionen.genericStateObjects.formatedKeysDevice,
        );

        this.setConnected(false);
    }

    delete(): void {
        this.rawData = null;
        this.setConnected(false);
    }

    getService(): providerDef.providerServices {
        if (!this.service) {
            throw new Error(`baseProvider.getService service is ${this.service == '' ? `''` : `undefined`}`);
        }
        return this.service;
    }
    /*getStatesObjectsWarnings(key: string): { [key: string]: ioBroker.Object } {
        return statesObjectsWarnings[this.service][key];
    }*/

    setService(service: providerDef.providerServices): boolean {
        if (
            !service ||
            ['dwdService', 'zamgService', 'uwzService', 'ninaService', 'metroService'].indexOf(service) === -1
        ) {
            throw new Error(`baseProvider.setService service ${service} is unknowed!`);
        }
        this.service = service;
        return true;
    }

    /**
     * @param url if '' url from PROVIDER_OPTIONS is taken
     * @param keys [string] values to replace - placeholder #  # #+  +# #++  ++# and so on
     */
    setUrl(url: string = '', keys: string[]): string {
        if (!url) {
            this.url = definitionen.PROVIDER_OPTIONS[this.service]['url'];
        } else {
            this.url = url;
        }
        let placeholder = '#  #';
        for (const k in keys) {
            this.url = this.url.replace(placeholder, keys[k]);
            placeholder = placeholder.slice(0, 1) + '+' + placeholder.slice(1, -1) + '+' + placeholder.slice(-1);
        }
        return this.url;
    }
    async setConnected(status: boolean): Promise<void> {
        this.providerController.connection = this.providerController.connection || status;
        const objDef = await this.library.getObjectDefFromJson(`info.connection`, definitionen.genericStateObjects);
        this.library.writedp(`${this.name}.info.connection`, !!status, objDef);
    }
    async update(): Promise<void> {
        // tue nichts
    }
    static async setAlerts(
        that: BaseProvider | ProviderController,
        prefix: string,
        data: { [key: string]: string | number | boolean },
    ): Promise<void> {
        await that.library.writeFromJson(
            prefix + '.alerts',
            'allService.alerts',
            definitionen.statesObjectsWarnings,
            data,
            false,
        );
    }
    async getAlertsAndWrite(): Promise<messagesDef.genericWarntypeAlertJsonType> {
        const reply: any = {};
        for (const t in messagesDef.genericWarntyp) {
            reply[messagesDef.genericWarntyp[Number(t) as keyof messagesDef.genericWarntypeType].id] = {
                level: -1,
                start: 1,
                end: 1,
                headline: '',
                active: false,
                type: -1,
            };
        }

        if (!reply) throw new Error('error(234) reply not definied');
        for (const a in this.messages) {
            const m = this.messages[a];
            if (!m) continue;
            const name = messagesDef.genericWarntyp[m.genericType].id;
            if (reply[name] === undefined) continue;
            if (m.endtime < Date.now()) continue;

            if (m.starttime < Date.now() && reply[name].level < m.level) {
                reply[name] = {
                    level: m.level,
                    start: m.starttime,
                    end: m.endtime,
                    headline: m.formatedData !== undefined ? String(m.formatedData.headline) : '',
                    active: m.starttime <= Date.now() && m.endtime >= Date.now(),
                    type: -1,
                };
            }
        }
        await BaseProvider.setAlerts(this, this.name, reply);
        return reply;
    }
    // General function that retrieves data
    async getDataFromProvider(): Promise<providerDef.DataImportType> {
        if (!this.url || !this.warncellId) {
            this.log.debug(
                // eslint-disable-next-line prettier/prettier
                `Warn (31) this.url: ${this.url} this.warncellid: ${this.warncellId} this.service: ${this.getService()}`,
            );
        }
        try {
            if (this.unload) {
                return;
            }

            // show text mode in Info states
            const objDef = await this.library.getObjectDefFromJson(`info.testMode`, definitionen.genericStateObjects);
            this.library.writedp(`${this.name}.info.testMode`, this.adapter.config.useTestWarnings, objDef);
            if (this.adapter.config.useTestWarnings) {
                return this.library.cloneGenericObject(
                    getTestData(this.service, this.adapter) as object,
                ) as providerDef.DataImportType;
            } else {
                const data = await axios.get(this.url);
                if (data.status == 200) {
                    await this.setConnected(true);

                    const result = typeof data.data == 'object' ? data.data : JSON.parse(data.data);

                    this.library.writedp(
                        `${this.name}.warning.warning_json`,
                        JSON.stringify(result),
                        definitionen.genericStateObjects.warnings_json,
                    );
                    if (this.adapter.config.useJsonHistory) {
                        const dp = `${this.name}.warning.jsonHistory`;
                        const state = this.library.readdp(dp);
                        let history: object[] = [];
                        if (state && state.val && typeof state.val == 'string') history = JSON.parse(state.val);
                        history.unshift(result);
                        this.library.writedp(dp, JSON.stringify(history), definitionen.genericStateObjects.jsonHistory);
                    }
                    this.library.writedp(
                        `${this.name}.lastUpdate`,
                        Date.now(),
                        definitionen.genericStateObjects.lastUpdate,
                    );
                    return result;
                } else {
                    this.log.warn('Warn(23) ' + data.statusText);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                this.log.warn(`Warn(21) axios error for ${this.getService()} url: ${this.url}`);
            } else {
                this.log.error(`Error(22) no data for ${this.getService()} from ${this.url} with Error ${error}`);
            }
        }
        await this.setConnected(false);
        return null;
    }
    //** Called at the end of updateData() from every childclass */
    async finishUpdateData(): Promise<void> {
        for (let m = 0; m < this.messages.length; m++) {
            this.messages.sort((a, b) => {
                return a.starttime - b.starttime;
            });
            await this.messages[m].writeFormatedKeys(m);

            await this.messages[m].formatMessages();
        }
        this.library.garbageColleting(`${this.name}.formatedKeys`, (this.providerController.refreshTime || 600000) / 2);
    }
    /**
     * generic write function for flat Objects
     * @param prefix {string}   prefix in datatree
     * @param data              json object flat
     * @returns                 void
     */
    async dumpData(prefix: string, data: providerDef.DataImportType): Promise<void> {
        if (!prefix || !data || typeof data !== 'object') return;
        for (const key in data) {
            //@ts-expect-error write code for next line
            this.adapter.library.writeState(`${prefix}`, key, data[key]);
        }
    }
    async updateData(data: any, counter: number): Promise<void> {
        if (!data) return;
        this.library.writedp(`${this.name}.warning`, undefined, definitionen.genericStateObjects.warningDevice);
        await this.library.writeFromJson(
            `${this.name}.warning.${('00' + counter.toString()).slice(-2)}`,
            `${this.service}.raw`,
            definitionen.statesObjectsWarnings,
            data,
        );
    }
    /** Remove marked Messages. */
    async clearMessages(): Promise<void> {
        for (let m = 0; m < this.messages.length; m++) {
            this.messages[m].newMessage = false;
            if (this.messages[m].notDeleted == false) {
                this.log.debug('Remove a warning from db.');
                this.messages.splice(Number(m--), 1);
            }
        }
    }
}

// nuzte klassen um Daten zu parsen
export class DWDProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: StringProviderOptionsType) {
        super(adapter, { ...options, service: 'dwdService' }, `dwd`);
        this.warncellId = options.warncellId;
        const url =
            definitionen.PROVIDER_OPTIONS.dwdService.url_base +
            (this.warncellId.startsWith('9') || this.warncellId.startsWith('10')
                ? definitionen.PROVIDER_OPTIONS.dwdService.url_appendix_land
                : definitionen.PROVIDER_OPTIONS.dwdService.url_appendix_town) +
            definitionen.PROVIDER_OPTIONS.dwdService.url_language;
        this.url = this.setUrl(url, [this.warncellId, options.language]);
    }
    async updateData(): Promise<void> {
        const result = (await this.getDataFromProvider()) as providerDef.dataImportDwdType;
        if (!result) return;

        this.log.debug(`Got ${result.features.length} warnings from server`);
        result.features.sort((a, b) => {
            return new Date(a.properties.ONSET).getTime() - new Date(b.properties.ONSET).getTime();
        });
        this.messages.forEach((a) => (a.notDeleted = false));
        for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.features.length; a++) {
            const w = result.features[a];
            if (w.properties.STATUS == 'Test') continue;
            await super.updateData(w.properties, a);

            /**
             * filter messages dwd
             */
            const index = this.messages.findIndex((m) => m.rawWarning.IDENTIFIER == w.properties.IDENTIFIER);

            if (index == -1) {
                const nmessage = new MessagesClass(
                    this.adapter,
                    'dwd-msg',
                    this,
                    w.properties,
                    this.providerController,
                );
                await nmessage.updateFormated();

                if (nmessage && nmessage.filter(this.filter)) this.messages.push(nmessage);
            } else {
                this.messages[index].updateData(w.properties);
            }
        }
        this.library.garbageColleting(`${this.name}.warning`);

        for (let m = 0; m < this.messages.length; m++) {
            const msg = this.messages[m];
            //const formatedData = await msg.updateFormatedData();
            if (msg.rawWarning.MSGTYPE == 'Update') {
                for (let m2 = 0; m2 < this.messages.length; m2++) {
                    const oldmsg = this.messages[m2];
                    if (msg === oldmsg) continue;
                    if (oldmsg.newMessage) continue;
                    //if (oldmsg.notDeleted) continue;
                    if (oldmsg.formatedData === undefined) continue; // überflüssig?
                    if (oldmsg.rawWarning.EC_II == msg.rawWarning.EC_II) {
                        msg.silentUpdate();
                        this.log.debug('Remove a warning from db.(Update)');
                        this.messages[m2].delete();
                        this.messages.splice(Number(m2--), 1);
                        m--;
                        break;
                    }
                }
            }
        }
        /**
         * Hier war ich dran
         */
        //this.library.writeJson('', '', this.rawData, this.getStatesObjectsWarnings('raw').false);
        await this.finishUpdateData();
    }
}

export class ZAMGProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: CoordinateProviderOptionsType) {
        super(adapter, { ...options, service: 'zamgService' }, `zamg`);
        this.warncellId = options.warncellId;
        this.setUrl('', [this.warncellId[0], this.warncellId[1], options.language]);
    }

    async updateData(): Promise<void> {
        const result = (await this.getDataFromProvider()) as providerDef.dataImportZamgType;
        if (!result) return;

        if (!result.properties || !result.properties.warnings) {
            this.log.debug(`Got 0 warnings from server`);
            return;
        } else this.log.debug(`Got ${result.properties.warnings.length} warnings from server`);
        result.properties.warnings.sort((a, b) => {
            return Number(a.properties.rawinfo.start) - Number(b.properties.rawinfo.start);
        });
        this.messages.forEach((a) => (a.notDeleted = false));
        for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.properties.warnings.length; a++) {
            // special case for zamg
            result.properties.warnings[a].properties.location = result.properties.location.properties.name;
            result.properties.warnings[a].properties.nachrichtentyp = result.properties.warnings[a].type;
            await super.updateData(result.properties.warnings[a].properties, a);

            const index = this.messages.findIndex(
                (m) => m.rawWarning.warnid == result.properties.warnings[a].properties.warnid,
            );
            if (index == -1) {
                const nmessage = new MessagesClass(
                    this.adapter,
                    'zamg-msg',
                    this,
                    result.properties.warnings[a].properties,
                    this.providerController,
                );
                await nmessage.updateFormated();
                if (nmessage && nmessage.filter(this.filter)) this.messages.push(nmessage);
            } else {
                this.messages[index].updateData(result.properties.warnings[a].properties);
            }
        }
        this.library.garbageColleting(`${this.name}.warning`);
        await this.finishUpdateData();
    }
}

export class UWZProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: StringProviderOptionsType) {
        super(adapter, { ...options, service: 'uwzService' }, `uwz`);
        this.warncellId = options.warncellId.toUpperCase();
        this.setUrl('', [this.warncellId, options.language]);
    }
    async updateData(): Promise<void> {
        const result = (await this.getDataFromProvider()) as providerDef.dataImportUWZType;
        if (!result || !result.results || result.results == null) {
            this.log.warn('Invalid result from uwz server!');
            return;
        }
        result.results.sort((a, b) => {
            if (a && b && a.dtgStart && b.dtgStart) return a.dtgStart - b.dtgStart;
            return 0;
        });
        this.messages.forEach((a) => (a.notDeleted = false));
        for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.results.length; a++) {
            if (result.results[a] == null) continue;
            await super.updateData(result.results[a], a);

            const index = this.messages.findIndex((m) => m.rawWarning.payload.id == result.results[a].payload.id);
            if (index == -1) {
                const nmessage = new MessagesClass(
                    this.adapter,
                    'uwz-msg',
                    this,
                    result.results[a],
                    this.providerController,
                );
                await nmessage.updateFormated();
                if (nmessage && nmessage.filter(this.filter)) this.messages.push(nmessage);
            } else {
                this.messages[index].updateData(result.results[a]);
            }
        }

        this.log.debug(`Got ${result.results.length} warnings from server`);

        this.library.garbageColleting(`${this.name}.warning`);
        await this.finishUpdateData();
    }
}
export class NINAProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: CoordinateProviderOptionsType) {
        super(adapter, { ...options, service: 'ninaService' }, `nina`);
    }
}
export class METROProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: CoordinateProviderOptionsType) {
        super(adapter, { ...options, service: 'metroService' }, `nina`);
    }
}

export class ProviderController extends BaseClass {
    providers: providerDef.ProviderClassType[] = [];
    refreshTimeRef: any = null;
    alertTimeoutRef: any = null;
    connection = true;
    name = 'provider';
    refreshTime: number = 300000;
    library: Library;
    notificationServices: NotificationClass.NotificationClass[] = [];

    pushOn = false;

    constructor(adapter: WeatherWarnings) {
        super(adapter, 'provider');
        this.library = this.adapter.library;
        this.pushOn = this.adapter.config.notPushAtStart; // ups wrong variable name PushAtStart
    }
    async init(): Promise<void> {
        this.refreshTime = this.adapter.config.refreshTime * 60000;
    }
    /**
     * Create a notificationService
     * @param optionList specialcase: adapter == '' then it is createn anyway
     * @returns
     */
    async createNotificationService(optionList: NotificationType.OptionsType): Promise<void> {
        for (const a in optionList) {
            const options = optionList[a as keyof NotificationType.OptionsType];
            if (options === undefined) return;
            const objs =
                options.adapter != ''
                    ? await this.adapter.getObjectViewAsync('system', 'instance', {
                          startkey: `system.adapter.${options.adapter}`,
                          endkey: `system.adapter.${options.adapter}`,
                      })
                    : null;
            if (!options.useadapter || (objs && objs.rows && objs.rows.length > 0)) {
                const noti = new NotificationClass.NotificationClass(this.adapter, options);
                this.notificationServices.push(noti);
                await noti.init();
            } else {
                this.log.error(`Configuration: ${options.name} is active, but dont find ${options.adapter} adapter!`);
                if (this.adapter && this.adapter.stop) this.adapter.stop();
                else {
                    throw new Error(
                        `Configuration: ${options.name} is active, but dont find ${options.adapter} adapter!`,
                    );
                }
            }
        }
    }

    createProviderIfNotExist(options: ProviderOptionsType): providerDef.ProviderClassType {
        const index = this.providers.findIndex(
            (p) =>
                p &&
                ((typeof p.warncellId == 'string' && p.warncellIdString == options.warncellId) ||
                    (typeof options.warncellId == 'object' && options.warncellId.join(DIV) == p.warncellIdString)) &&
                p.getService() == options.service,
        );
        if (index == -1) {
            let p: providerDef.ProviderClassType;
            switch (options.service) {
                case 'dwdService':
                    if (Array.isArray(options.warncellId)) {
                        throw new Error('Error 122 warncellId is a Array');
                    }
                    p = new DWDProvider(this.adapter, {
                        ...options,
                        warncellId: options.warncellId,
                        providerController: this,
                    });
                    break;
                case 'uwzService':
                    if (Array.isArray(options.warncellId)) {
                        throw new Error('Error 123 warncellId is a Array');
                    }
                    p = new UWZProvider(this.adapter, {
                        ...options,
                        warncellId: options.warncellId,
                        providerController: this,
                    });
                    break;
                case 'zamgService':
                    if (!Array.isArray(options.warncellId)) {
                        throw new Error('Error 124 warncellId is not an Array');
                    }
                    p = new ZAMGProvider(this.adapter, {
                        ...options,
                        warncellId: options.warncellId,
                        providerController: this,
                    });
                    break;
                case 'ninaService':
                    if (!Array.isArray(options.warncellId)) {
                        throw new Error('Error 125 warncellId is not an Array');
                    }
                    p = new NINAProvider(this.adapter, {
                        ...options,
                        warncellId: options.warncellId,
                        providerController: this,
                        language: this.adapter.config.dwdLanguage,
                    });
                    break;
                default:
                    throw new Error('Error 126 service is not defined');
                //todo add metroServicce
            }
            if (p) this.providers.push(p);
            return p;
        } else {
            this.log.error('Attempt to create an existing provider.');
            return this.providers[index];
        }
    }

    delete(): void {
        super.delete();
        for (const p of this.providers) {
            if (p) p.delete();
        }
        this.providers = [];
        if (this.refreshTimeRef) this.adapter.clearTimeout(this.refreshTimeRef);
        if (this.alertTimeoutRef) this.adapter.clearTimeout(this.alertTimeoutRef);
    }

    updateEndless(that: ProviderController): void {
        //that.adapter.config.useTestWarnings = !that.adapter.config.useTestWarnings;
        that.connection = false;
        if (that.refreshTimeRef) that.adapter.clearTimeout(that.refreshTimeRef);
        if (that.providers.length == 0) {
            that.setConnected(false);
            return;
        }
        updater(that);
        async function updater(self: any, index: number = 0): Promise<void> {
            const that = self; //as ProviderController;
            if (that.unload) return;
            if (index < that.providers.length) {
                if (that.providers[index]) await that.providers[index].updateData();
                index++;
                that.refreshTimeRef = that.adapter.setTimeout(updater, 500, that, index);
            } else {
                await that.doEndOfUpdater();
                that.refreshTimeRef = that.adapter.setTimeout(that.updateEndless, that.refreshTime || 600000, that);
            }
        }
    }
    updateAlertEndless(that: any): void {
        if (that.unload) return;

        that.checkAlerts();
        /** update every minute after 1.333 seconds. Avoid the full minute, full second and half second :) */
        const timeout = 61333 - (Date.now() % 60000);
        that.alertTimeoutRef = that.adapter.setTimeout(that.updateAlertEndless, timeout, that);
    }

    checkAlerts(): void {
        for (const p in this.providers) {
            this.providers[p].getAlertsAndWrite();
        }
    }

    async doEndOfUpdater(): Promise<void> {
        this.setConnected();
        await this.updateMesssages();
        let activMessages = 0;
        for (const a in this.providers) {
            let am = 0;
            for (const b in this.providers[a].messages) {
                if (this.providers[a].messages[b].notDeleted) {
                    am++;
                }
            }
            this.adapter.library.writedp(
                `${this.providers[a].name}.activeWarnings`,
                am,
                definitionen.genericStateObjects.activeWarnings,
            );
            activMessages += am;
        }

        if (this.pushOn) {
            for (const push of this.notificationServices) {
                await push.sendMessage(this.providers, ['new', 'remove', 'all']);
            }
        }
        this.pushOn = true;
        await this.adapter.library.writedp(
            `${this.name}.activeWarnings`,
            activMessages,
            definitionen.genericStateObjects.activeWarnings,
        );
        this.providers.forEach((a) => a.clearMessages());

        this.log.debug(`We have ${activMessages} active messages.`);
    }
    providersExist(): boolean {
        return this.providers.length > 0;
    }
    async setConnected(status: boolean = this.connection): Promise<void> {
        const objDef = await this.adapter.library.getObjectDefFromJson(
            `info.connection`,
            definitionen.genericStateObjects,
        );
        this.adapter.library.writedp(`info.connection`, !!status, objDef);
    }
    setAllowedDirs(allowedDirs: any): void {
        const dirs = [];
        for (const a in allowedDirs) {
            if (!allowedDirs[a].dpWarning)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9#_]+\\.warning`);
            if (!allowedDirs[a].dpMessage)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9#_]+\\.alerts`);
            /*if (!allowedDirs[a].dpFormated)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9#_]+\\.messages`);*/
            if (!allowedDirs[a].dpAlerts)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9#_]+\\.formatedKeys`);

            this.library.setAllowedDirs(dirs);
        }
    }
    async updateMesssages(): Promise<void> {
        for (const a in this.providers) {
            for (const b in this.providers[a].messages) {
                await this.providers[a].messages[b].updateFormatedData(true);
                await this.providers[a].messages[b].writeFormatedKeys(Number(b));
            }
        }
    }
}
