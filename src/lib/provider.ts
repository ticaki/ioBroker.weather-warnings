// Provider

import axios from 'axios';
import WeatherWarnings from '../main';
import { PROVIDER_OPTIONS, genericStateObjects, statesObjectsWarnings } from './def/definitionen';
import { BaseClass, Library } from './library';
import {
    DataImportType,
    dataImportDwdType,
    dataImportUWZType,
    dataImportZamgType,
    providerServices,
} from './def/provider-def';
import { Messages } from './messages';
import { getTestData } from './test';

type ProvideOptionsTypeInternal = {
    service: providerServices;
    warncellId: string | [string, string];
    providerController: ProviderController;
};

type ProvideOptionsType = ProvideOptionsTypeInternal;

type StringProvideOptionsType = {
    warncellId: string;
    providerController: ProviderController;
};
type CoordinateProvideOptionsType = {
    warncellId: [string, string];
    providerController: ProviderController;
};

class BaseProvider extends BaseClass {
    service: providerServices;
    url: string = '';
    warncellId: string | Array<string> = '';
    rawData: DataImportType = null;
    library: Library;
    messages: Messages[] = [];
    providerController: ProviderController;

    constructor(adapter: WeatherWarnings, options: ProvideOptionsTypeInternal, name: string) {
        super(adapter, 'provider.' + name);
        this.service = options.service;
        this.library = this.adapter.library;
        this.providerController = options.providerController;
        this.setService(options.service);
        this.log.setLogPrefix(`${name}-${options.warncellId}`);
        this.init();
    }
    async init(): Promise<void> {
        this.library.writedp(`${this.name}.info`, undefined, genericStateObjects.info._channel);
        this.library.writedp(`${this.name}.messages`, undefined, genericStateObjects.messageStates._channel);
        this.library.writedp(`${this.name}.formatedKeys`, undefined, genericStateObjects.formatedKeysDevice);

        this.setConnected(false);
    }

    delete(): void {
        this.rawData = null;
        this.setConnected(false);
    }

    getService(): providerServices {
        if (!this.service) {
            throw new Error(`baseProvider.getService service is ${this.service == '' ? `''` : `undefined`}`);
        }
        return this.service;
    }
    /*getStatesObjectsWarnings(key: string): { [key: string]: ioBroker.Object } {
        return statesObjectsWarnings[this.service][key];
    }*/

    setService(service: providerServices): boolean {
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
            this.url = PROVIDER_OPTIONS[this.service]['url'];
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
        const objDef = await this.library.getObjectDefFromJson(`info.connection`, genericStateObjects);
        this.library.writedp(`${this.name}.info.connection`, !!status, objDef);
    }
    async update(): Promise<void> {
        // tue nichts
    }
    // General function that retrieves data
    async getDataFromProvider(): Promise<DataImportType> {
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

            /*let result = await axios.get(
                'https://feeds.meteoalarm.org/api/v1/warnings/feeds-italy/12f80051-b8f8-4c13-b31d-f960796e73a2?index_info=0&amp;index_area=0&amp;index_geocode=0',
                //'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-italy',
            );
            this.log.debug(result.data);
            result = await axios.get(
                //'https://feeds.meteoalarm.org/api/v1/warnings/feeds-italy/12f80051-b8f8-4c13-b31d-f960796e73a2?index_info=0&amp;index_area=0&amp;index_geocode=0',
                'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-italy',
            );
            this.log.debug('22    ' + result.data);
            return;*/

            // show text mode in Info states
            const objDef = await this.library.getObjectDefFromJson(`info.testMode`, genericStateObjects);
            this.library.writedp(`${this.name}.info.testMode`, this.adapter.config.useTestWarnings, objDef);
            if (this.adapter.config.useTestWarnings) {
                return getTestData(this.service);
            } else {
                const result = await axios.get(this.url);
                if (result.status == 200) {
                    await this.setConnected(true);
                    return typeof result.data == 'object' ? result.data : JSON.parse(result.data);
                } else {
                    this.log.warn('Warn(23) ' + result.statusText);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                this.log.warn(`Warn(21) axios error for ${this.getService()} url: ${this.url}`);
            } else {
                this.log.error(`Error(22) no data for ${this.getService()} with Error ${error}`);
            }
        }
        await this.setConnected(false);
        return null;
    }
    async finishUpdateData(): Promise<void> {
        for (let m = 0; m < this.messages.length; m++) {
            await this.messages[m].writeFormatedKeys(m);
            await this.messages[m].formatMessages();
        }
    }
    /**
     * generic write function for flat Objects
     * @param prefix {string}   prefix in datatree
     * @param data              json object flat
     * @returns                 void
     */
    async dumpData(prefix: string, data: DataImportType): Promise<void> {
        if (!prefix || !data || typeof data !== 'object') return;
        for (const key in data) {
            //@ts-expect-error write code for next line
            this.adapter.library.writeState(`${prefix}`, key, data[key]);
        }
    }
    async updateData(data: any, counter: number): Promise<void> {
        if (!data) return;
        this.library.writedp(`${this.name}.warning`, undefined, genericStateObjects.warningDevice);
        await this.library.writeFromJson(
            `${this.name}.warning.${('00' + counter.toString()).slice(-2)}`,
            `${this.service}.raw`,
            statesObjectsWarnings,
            data,
        );
    }
    async sendMessages(override = false): Promise<number> {
        if (this.messages.length == 0 && !override) {
            /**
             * All Warnings removed should be done by providercontroller.
             */
            return 0;
        } else {
            /**
             * send Messages, remove old one
             */
            let messagesSend = 0;
            for (let m = 0; m < this.messages.length; m++) {
                messagesSend += await this.messages[m].sendMessage();
            }
            return messagesSend;
        }
    }
}

// nuzte klassen um Daten zu parsen
export class DWDProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: StringProvideOptionsType) {
        super(adapter, { ...options, service: 'dwdService' }, `dwd`);
        this.warncellId = options.warncellId;
        const url =
            PROVIDER_OPTIONS.dwdService.url_base +
            (this.warncellId.startsWith('9') || this.warncellId.startsWith('10')
                ? PROVIDER_OPTIONS.dwdService.url_appendix_land
                : PROVIDER_OPTIONS.dwdService.url_appendix_town);
        this.url = this.setUrl(url, [this.warncellId]);
    }

    async updateData(): Promise<void> {
        const result = (await this.getDataFromProvider()) as dataImportDwdType;
        if (!result) return;
        //this.log.debug(JSON.stringify(result));
        this.log.debug(`Got ${result.totalFeatures} warnings from server`);
        for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.totalFeatures; a++) {
            const w = result.features[a];
            if (w.properties.STATUS == 'Test') continue;
            await super.updateData(w.properties, a);

            /**
             * filter messages dwd
             */
            const index = this.messages.findIndex((m) => m.rawWarning.IDENTIFIER == w.properties.IDENTIFIER);

            if (index == -1) {
                const nmessage = new Messages(this.adapter, 'dwd-msg', this, w.properties);
                await nmessage.init();
                if (nmessage) this.messages.push(nmessage);
            } else {
                this.messages[index].updateData(w.properties);
            }
        }
        this.library.garbageColleting(`${this.name}.warning`);

        for (const m in this.messages) {
            const msg = this.messages[m];
            const formatedData = await msg.updateFormatedData();
            let breakit = false;
            if (msg.rawWarning.MSGTYPE == 'Update') {
                for (const m2 in this.messages) {
                    const delMsg = this.messages[m2];
                    if (msg === delMsg) continue;
                    if (delMsg.notDeleted) continue;
                    if (delMsg.formatedData === undefined) continue; // überflüssig?
                    if (delMsg.rawWarning.EC_II == msg.rawWarning.EC_II) {
                        if (
                            delMsg.formatedData.warnlevelnumber !== undefined &&
                            formatedData.warnlevelnumber !== undefined &&
                            delMsg.formatedData.warnlevelnumber >= formatedData.warnlevelnumber
                        ) {
                            msg.silentUpdate();
                        }
                        this.messages[m2].delete();
                        this.messages.slice(Number(m2), 1);
                        breakit = true;
                        break;
                    }
                }
            }
            if (breakit) break;
        }
        /**
         * Hier war ich dran
         */
        //this.library.writeJson('', '', this.rawData, this.getStatesObjectsWarnings('raw').false);
        await this.finishUpdateData();
    }
}

export class ZAMGProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: CoordinateProvideOptionsType) {
        super(adapter, { ...options, service: 'zamgService' }, `zamg`);
        this.warncellId = options.warncellId;
        this.setUrl('', [this.warncellId[0], this.warncellId[1]]);
    }

    async updateData(): Promise<void> {
        const result = (await this.getDataFromProvider()) as dataImportZamgType;
        if (!result) return;
        //this.log.debug(JSON.stringify(result));
        if (!result.properties || !result.properties.warnings) {
            this.log.debug(`Got 0 warnings from server`);
            return;
        } else this.log.debug(`Got ${result.properties.warnings.length} warnings from server`);
        for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.properties.warnings.length; a++) {
            // special case for zamg
            result.properties.warnings[a].properties.nachrichtentyp = result.properties.warnings[a].type;
            await super.updateData(result.properties.warnings[a].properties, a);

            const index = this.messages.findIndex(
                (m) => m.rawWarning.properties.warnid == result.properties.warnings[a].properties.warnid,
            );
            if (index == -1) {
                const nmessage = new Messages(this.adapter, 'zamg-msg', this, result.properties.warnings[a].properties);
                await nmessage.init();
                this.messages.push(nmessage);
            } else {
                this.messages[index].updateData(result.properties.warnings[a].properties);
            }
        }
        this.library.garbageColleting(`${this.name}.warning`);
        await this.finishUpdateData();
    }
}

export class UWZProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: StringProvideOptionsType) {
        super(adapter, { ...options, service: 'uwzService' }, `uwz`);
        this.warncellId = options.warncellId.toUpperCase();
        this.setUrl('', [this.warncellId]);
    }
    async updateData(): Promise<void> {
        const result = (await this.getDataFromProvider()) as dataImportUWZType;
        if (result && result.results) {
            for (let a = 0; a < this.adapter.numOfRawWarnings && a < result.results.length; a++) {
                await super.updateData(result.results[a], a);

                const index = this.messages.findIndex((m) => m.rawWarning.payload.id == result.results[a].payload.id);
                if (index == -1) {
                    const nmessage = new Messages(this.adapter, 'uwz-msg', this, result.results[a]);
                    await nmessage.init();
                    this.messages.push(nmessage);
                } else {
                    this.messages[index].updateData(result.results[a]);
                }
            }
            //this.log.debug(JSON.stringify(result));
            this.log.debug(`Got ${result.results.length} warnings from server`);
        }
        this.library.garbageColleting(`${this.name}.warning`);
        await this.finishUpdateData();
    }
}
export class NINAProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: CoordinateProvideOptionsType) {
        super(adapter, { ...options, service: 'ninaService' }, `nina`);
    }
}
export class METROProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: CoordinateProvideOptionsType) {
        super(adapter, { ...options, service: 'metroService' }, `nina`);
    }
}

export class ProviderController extends BaseClass {
    provider: ProvideClassType[] = [];
    refreshTimeRef = null;
    connection = true;
    name = 'all';

    constructor(adapter: WeatherWarnings) {
        super(adapter, 'Provider Controller');
        //@ts-expect-error write code for next line
        this.refreshTime = (this.adapter.config.refreshTime < 5 ? 5 : this.adapter.config.refreshTime) * 60000;
    }

    createProviderIfNotExist(options: ProvideOptionsType): ProvideClassType {
        const index = this.provider.findIndex(
            (p) => p && p.warncellId == options.warncellId && p.getService() == options.service,
        );
        if (index == -1) {
            let p: ProvideClassType;
            switch (options.service) {
                case 'dwdService':
                    if (Array.isArray(options.warncellId)) {
                        throw new Error('Error 122 warncellId is a Array');
                    }
                    p = new DWDProvider(this.adapter, { warncellId: options.warncellId, providerController: this });
                    break;
                case 'uwzService':
                    if (Array.isArray(options.warncellId)) {
                        throw new Error('Error 123 warncellId is a Array');
                    }
                    p = new UWZProvider(this.adapter, { warncellId: options.warncellId, providerController: this });
                    break;
                case 'zamgService':
                    if (!Array.isArray(options.warncellId)) {
                        throw new Error('Error 124 warncellId is not an Array');
                    }
                    p = new ZAMGProvider(this.adapter, { warncellId: options.warncellId, providerController: this });
                    break;
                case 'ninaService':
                    if (!Array.isArray(options.warncellId)) {
                        throw new Error('Error 125 warncellId is not an Array');
                    }
                    p = new NINAProvider(this.adapter, { warncellId: options.warncellId, providerController: this });
                    break;
                default:
                    throw new Error('Error 126 service is not defined');
                //todo add metroServicce
            }
            if (p) this.provider.push(p);
            return p;
        } else {
            return this.provider[index];
        }
    }

    delete(): void {
        super.delete();
        for (const p of this.provider) {
            if (p) p.delete();
        }
        this.provider = [];
        if (this.refreshTimeRef) this.adapter.clearTimeout(this.refreshTimeRef);
    }

    updateEndless(that: ProviderController): void {
        that.connection = false;
        if (that.refreshTimeRef) that.adapter.clearTimeout(that.refreshTimeRef);
        if (that.provider.length == 0) {
            that.setConnected(false);
            return;
        }
        updater(that);
        async function updater(that: any, index: number = 0): Promise<void> {
            if (that.unload) return;
            if (index < that.provider.length) {
                if (that.provider[index]) await that.provider[index].updateData();
                index++;
                that.refreshTimeRef = that.adapter.setTimeout(updater, 500, that, index);
            } else {
                that.setConnected();
                let messagesSend = 0;
                for (const a in that.provider) {
                    try {
                        messagesSend += await that.provider[a].sendMessages();
                    } catch (error) {
                        that.log.error(error);
                    }
                }
                that.log.debug(`send ${messagesSend} messages.`);
                that.refreshTimeRef = that.adapter.setTimeout(that.updateEndless, that.refreshTime || 600000, that);
            }
        }
    }
    providersExist(): boolean {
        return this.provider.length > 0;
    }
    async setConnected(status: boolean = this.connection): Promise<void> {
        const objDef = await this.adapter.library.getObjectDefFromJson(`info.connection`, genericStateObjects);
        this.adapter.library.writedp(`info.connection`, !!status, objDef);
    }
}
export type ProvideClassType = DWDProvider | ZAMGProvider | UWZProvider | NINAProvider | METROProvider;
