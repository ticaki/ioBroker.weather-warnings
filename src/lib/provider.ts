// Provider

import axios from 'axios';
import WeatherWarnings from '../main';
import * as definitionen from './def/definition';
import { BaseClass, Library } from './library';
import * as providerDef from './def/provider-def';
import { MessagesClass } from './messages';
import * as NotificationClass from './notification';
import { getTestData } from './test-warnings';
import * as NotificationType from './def/notificationService-def';
import * as messagesDef from './def/messages-def';
export const DIV = '-';

axios.defaults.timeout = 5000;
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
    noMessage: MessagesClass;
    providerController: ProviderController;
    filter: providerDef.messageFilterType;
    customName: string = '';
    warncellIdString: string;

    constructor(adapter: WeatherWarnings, options: ProviderOptionsTypeInternal, name: string) {
        let warncell =
            typeof options.warncellId == 'object' && Array.isArray(options.warncellId)
                ? options.warncellId.join(DIV)
                : options.warncellId;
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

        this.noMessage = new MessagesClass(this.adapter, 'noMessage', null, {}, this.providerController, this);
        this.noMessage.updateFormated();
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

    async delete(): Promise<void> {
        super.delete();
        this.rawData = null;
        await this.library.memberDeleteAsync(this.messages);
        this.messages = [];
        await this.setConnected(false);
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
    static getUrl(url: string = '', keys: string[], service: keyof typeof definitionen.PROVIDER_OPTIONS): string {
        let result = '';
        if (!url) {
            result = definitionen.PROVIDER_OPTIONS[service]['url'];
        } else {
            result = url;
        }
        let placeholder = '#  #';
        for (const k in keys) {
            result = result.replace(placeholder, keys[k]);
            placeholder = placeholder.slice(0, 1) + '+' + placeholder.slice(1, -1) + '+' + placeholder.slice(-1);
        }
        return result;
    }
    async setConnected(status: boolean): Promise<void> {
        this.providerController.connection = this.providerController.connection || status;
        await this.library.writedp(
            `${this.name}.info.connection`,
            !!status,
            definitionen.genericStateObjects.info.connection,
        );
    }

    async getAlertsAndWrite(
        allReplys: messagesDef.genericWarntypeAlertJsonType | undefined = undefined,
    ): Promise<messagesDef.genericWarntypeAlertJsonType> {
        const reply: any = { asList: '' };
        for (const t in messagesDef.genericWarntyp) {
            if (t == '0') continue;
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
        if (allReplys === undefined) allReplys = JSON.parse(JSON.stringify(reply));
        [reply, allReplys].forEach((reply) => {
            let warntypeArray: string[] = [];
            for (const a in this.messages) {
                const m = this.messages[a];
                if (!m) continue;
                const name = messagesDef.genericWarntyp[m.genericType].id;
                if (name == 'none') continue;
                if (reply[name] === undefined) continue;
                if (m.endtime < Date.now()) continue;

                if (
                    (m.starttime <= Date.now() && reply[name].level < m.level) ||
                    (m.starttime > Date.now() && (reply[name].start === 1 || reply[name].start > m.starttime))
                ) {
                    warntypeArray.push(this.library.getTranslation(messagesDef.genericWarntyp[m.genericType].name));
                    reply[name] = {
                        level: m.level,
                        start: m.starttime,
                        end: m.endtime,
                        headline: m.formatedData !== undefined ? String(m.formatedData.headline) : '',
                        active: m.starttime <= Date.now() && m.endtime >= Date.now(),
                        type: m.genericType,
                    };
                    if (reply === allReplys) reply[name].provider = m.formatedData ? m.formatedData.provider : '';
                }
            }
            if (reply['asList'] !== undefined) warntypeArray = warntypeArray.concat(reply['asList'].split(', '));
            reply['asList'] = warntypeArray.filter((item, pos, arr) => item && arr.indexOf(item) == pos).join(', ');
        });
        await this.library.writeFromJson(
            this.name + '.alerts',
            'allService.alerts',
            definitionen.statesObjectsWarnings,
            reply,
            false,
        );

        return allReplys!;
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

            // show test mode in Info states
            this.library.writedp(
                `${this.name}.info.testMode`,
                this.adapter.config.useTestWarnings,
                definitionen.genericStateObjects.info.testMode,
            );
            if (this.adapter.config.useTestWarnings) {
                return this.library.cloneGenericObject(
                    getTestData(this.service, this.adapter) as object,
                ) as providerDef.DataImportType;
            } else {
                const data = await axios.get(this.url);
                if (this.unload) return null;
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
        let index = -1;
        this.messages.sort((a, b) => {
            return a.starttime - b.starttime;
        });
        // delete msgs that send a remove with a follow up
        this.messages = this.messages.filter((item) => {
            if (item.notDeleted || item.newMessage) return true;
            if (item.endtime > Date.now()) return true;
            for (const innerItem of this.messages) {
                if (innerItem == item || innerItem.provider !== item.provider || innerItem.type !== item.type) continue;
                const diff = Math.abs(innerItem.starttime - item.endtime);
                if (diff <= this.providerController.refreshTime || innerItem.starttime <= item.endtime) return false;
            }
            return true;
        });
        for (let m = 0; m < this.messages.length && m < this.adapter.config.numOfRawWarnings; m++) {
            index = m;
            await this.messages[m].writeFormatedKeys(m);
        }
        for (index++; index < this.adapter.config.numOfRawWarnings; index++) {
            await this.noMessage.writeFormatedKeys(index);
        }
        await this.library.garbageColleting(
            `${this.name}.formatedKeys`,
            (this.providerController.refreshTime || 600000) / 2,
        );
        await this.library.garbageColleting(
            `${this.name}.warning`,
            (this.providerController.refreshTime || 600000) / 2,
        );
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
    async finishTurn(): Promise<void> {
        this.adapter.library.writedp(
            `${this.name}.summary`,
            undefined,
            definitionen.genericStateObjects.summary._channel,
        );
        this.adapter.library.writedp(
            `${this.name}.summary.warntypes`,
            this.messages.map((a) => (a.formatedData ? a.formatedData.warntypegenericname : '')).join(', '),
            definitionen.genericStateObjects.summary.warntypes,
        );
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
        this.url = DWDProvider.getUrl(url, [this.warncellId, options.language], this.service);
    }
    async updateData(): Promise<void> {
        const result = (await this.getDataFromProvider()) as providerDef.dataImportDwdType;
        if (!result) return;
        this.log.debug(`Got ${result.features.length} warnings from server`);
        result.features.sort((a, b) => {
            return new Date(a.properties.ONSET).getTime() - new Date(b.properties.ONSET).getTime();
        });
        this.messages.forEach((a) => (a.notDeleted = false));
        for (let a = 0; a < this.adapter.config.numOfRawWarnings && a < result.features.length; a++) {
            const w = result.features[a];
            if (w.properties.STATUS == 'Test') continue;
            if (
                this.filter.hours > 0 &&
                new Date(w.properties.ONSET).getTime() > Date.now() + this.filter.hours * 3600000
            )
                continue;
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
                await this.messages[index].updateData(w.properties);
            }
        }
        for (let n = 0; n < this.messages.length; n++) {
            const newmsg = this.messages[n];
            if (!newmsg.newMessage) continue;
            for (let o = 0; o < this.messages.length; o++) {
                const oldmsg = this.messages[o];
                if (oldmsg.newMessage) continue;
                if (oldmsg.formatedData === undefined || newmsg.formatedData === undefined) continue;
                if (oldmsg.rawWarning.EC_II != newmsg.rawWarning.EC_II) continue;
                if (oldmsg.starttime > newmsg.endtime || newmsg.starttime > oldmsg.endtime) continue;
                newmsg.silentUpdate();
                this.log.debug('Remove a old warning.(Silent Update)');
                if (o <= n) n--;
                this.messages.splice(o--, 1);
                break;
            }
        }
        await this.finishUpdateData();
    }
}

export class ZAMGProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: CoordinateProviderOptionsType) {
        super(adapter, { ...options, service: 'zamgService' }, `zamg`);
        this.warncellId = options.warncellId;
        this.url = ZAMGProvider.getUrl('', [this.warncellId[0], this.warncellId[1], options.language], this.service);
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
        let b = 0;
        for (let a = 0; b < this.adapter.config.numOfRawWarnings && a < result.properties.warnings.length; a++) {
            if (
                this.filter.hours > 0 &&
                Number(result.properties.warnings[a].properties.rawinfo.start) >
                    Date.now() / 1000 + this.filter.hours * 3600
            )
                continue;
            if (Number(result.properties.warnings[a].properties.rawinfo.end) < Date.now() / 1000) continue;
            b++;
            // special case for zamg
            result.properties.warnings[a].properties.location = result.properties.location.properties.name;
            result.properties.warnings[a].properties.nachrichtentyp = result.properties.warnings[a].type;
            await super.updateData(result.properties.warnings[a].properties, a);
            const index = this.messages.findIndex((m) => {
                return (
                    m.rawWarning.warnid == result.properties.warnings[a].properties.warnid &&
                    result.properties.warnings[a].properties.rawinfo.wlevel == m.rawWarning.rawinfo.wlevel &&
                    result.properties.warnings[a].properties.rawinfo.wtype == m.rawWarning.rawinfo.wtype &&
                    result.properties.warnings[a].properties.rawinfo.start == m.rawWarning.rawinfo.start
                );
            });
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
                await this.messages[index].updateData(result.properties.warnings[a].properties);
            }
        }
        await this.finishUpdateData();
    }
}

export class UWZProvider extends BaseProvider {
    constructor(adapter: WeatherWarnings, options: StringProviderOptionsType) {
        super(adapter, { ...options, service: 'uwzService' }, `uwz`);
        this.warncellId = options.warncellId.toUpperCase();
        this.url = BaseProvider.getUrl('', [this.warncellId, options.language], this.service);
    }

    static async getWarncell(
        warncellId: [string, string],
        service: providerDef.providerServices,
        that: WeatherWarnings,
    ): Promise<string> {
        try {
            const result = await axios.get(
                UWZProvider.getUrl(
                    definitionen.PROVIDER_OPTIONS.uwzService.warncellUrl,
                    [warncellId[0], warncellId[1]],
                    service,
                ),
            );
            if (result) {
                if (result.data && result.data[0]) {
                    return result.data[0].AREA_ID;
                }
            }
            that.log.error(`No valid warncell found for ${JSON.stringify(warncellId)!}`);
        } catch (error: any) {
            that.log.warn(`Dont get warncell. ${JSON.stringify(error.toJSON)}`);
        }
        return '';
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
        for (let a = 0; a < this.adapter.config.numOfRawWarnings && a < result.results.length; a++) {
            if (result.results[a] == null) continue;
            if (this.filter.hours > 0 && result.results[a].dtgStart > Date.now() / 1000 + this.filter.hours * 3600)
                continue;
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
                await this.messages[index].updateData(result.results[a]);
            }
        }
        this.log.debug(`Got ${result.results.length} warnings from server`);

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
    notificationServices: NotificationClass.NotificationClass[] = [];
    noWarning: MessagesClass;

    refreshTimeRef: ioBroker.Timeout | undefined = undefined;
    alertTimeoutRef: ioBroker.Timeout | undefined = undefined;

    connection = true;
    name = 'provider';
    refreshTime: number = 300000;
    library: Library;
    pushOn = false;
    //globalSpeakSilentTime: ({ profil: string; day: number[]; start: number; end: number } | null)[] = [];
    testStatus = 0;
    activeMessages = 0;
    silentTime: { shouldSpeakAllowed?: boolean; forceOff: boolean; profil: providerDef.silentTimeConfigType[][] } = {
        forceOff: false,
        profil: [],
    };
    constructor(adapter: WeatherWarnings) {
        super(adapter, 'provider');
        this.library = this.adapter.library;
        this.noWarning = new MessagesClass(this.adapter, 'noMessage', null, {}, this);
        this.noWarning.newMessage = false;
        this.noWarning.notDeleted = false;
        this.doEndOfUpdater.bind(this);
    }
    async init(): Promise<void> {
        this.pushOn = !this.adapter.config.notPushAtStart; // ups wrong variable name PushAtStart
        this.refreshTime = this.adapter.config.refreshTime * 60000;

        const typeStates: string[] = [];
        for (const a in messagesDef.genericWarntyp) {
            //@ts-expect-error dann so
            typeStates[a] = this.library.getTranslation(messagesDef.genericWarntyp[a].name);
        }
        definitionen.statesObjectsWarnings.allService.formatedkeys.warntypegeneric.common.states = typeStates;
        //update FormatedDataObjects
        const states = await this.adapter.getStatesAsync('provider.*');
        for (const state in states) {
            if (state.includes('.formatedKeys.')) {
                const key = state
                    .split('.')
                    .pop() as keyof typeof definitionen.statesObjectsWarnings.allService.formatedkeys;
                if (definitionen.statesObjectsWarnings.allService.formatedkeys[key] != undefined) {
                    const def = definitionen.statesObjectsWarnings.allService.formatedkeys[key];
                    def.common.name =
                        typeof def.common.name == 'string'
                            ? await this.library.getTranslationObj(def.common.name)
                            : def.common.name;
                    await this.adapter.extendObjectAsync(
                        state.replace(`${this.adapter.name}.${this.adapter.instance}.`, ''),
                        definitionen.statesObjectsWarnings.allService.formatedkeys[key],
                    );
                }
            }
        }

        const profileNames: string[] = [];
        if (this.adapter.config.silentTime !== undefined) {
            for (let p = 0; p < this.adapter.config.silentTime.length; p++) {
                if (!this.adapter.config.silentTime[p].speakProfile) continue;
                if (this.adapter.config.silentTime[p].silentTime.length == 0) continue;
                profileNames.push(this.adapter.config.silentTime[p].speakProfile);
                this.silentTime.profil.push(
                    (this.adapter.config.silentTime[p].silentTime || [])
                        .map((item): providerDef.silentTimeConfigType | null => {
                            const result: providerDef.silentTimeConfigType = {
                                day: [],
                                start: 0,
                                end: 0,
                            };
                            if (
                                typeof item !== 'object' ||
                                item === null ||
                                typeof item.start !== 'string' ||
                                typeof item.end !== 'string' ||
                                item.day === null ||
                                !Array.isArray(item.day) ||
                                item.day.length == 0
                            )
                                return null;
                            for (const a in item) {
                                const b = a as keyof typeof item;
                                if (b != 'day') {
                                    const t = item[b].split(':');
                                    if (Number.isNaN(t[0])) return null;
                                    if (!Number.isNaN(t[1]) && parseInt(t[1]) > 0) {
                                        t[1] = String(parseInt(t[1]) / 60);
                                        item[b] = String(parseFloat(t[0]) + parseFloat(t[1]));
                                    } else item[b] = t[0];
                                }
                                if (b == 'day') result.day = item.day;
                                else if (b == 'end') result.end = parseFloat(item.end);
                                else result.start = parseFloat(item.start);
                            }
                            this.log.info(
                                `Silent time added: Profil: ${this.adapter.config.silentTime[p].speakProfile} start: ${
                                    result.start
                                } end: ${result.end} days: ${JSON.stringify(result.day)}`,
                            );
                            return result.day.length != 0 && result.start != result.end ? result : null;
                        })
                        .filter((f) => f != null) as providerDef.silentTimeConfigType[],
                );
            }
            definitionen.statesObjectsWarnings.allService.commands.silentTime.profil.common.states = profileNames;
            this.library.writedp(
                `commands.silentTime`,
                undefined,
                definitionen.statesObjectsWarnings.allService.commands.silentTime._channel,
            );
            for (const a in definitionen.actionStates) {
                const dp = a as keyof typeof definitionen.actionStates;
                const data = definitionen.actionStates[dp];
                if (!this.library.readdp(String(dp))) await this.library.writedp(String(dp), data.default, data.def);
                else {
                    const def = definitionen.actionStates[dp].def;
                    const obj = await this.adapter.getObjectAsync(String(dp));
                    if (obj) {
                        obj.common = def.common;
                        await this.adapter.setObjectAsync(String(dp), obj);
                    }
                }
            }
        }

        /*
        // this code ist to swap genericWarntyp to ids with a array of warntypes
        const warntyp = messagesDef.genericWarntyp;
        const mixedWarntyp: any = {};
        Object.entries(warntyp).forEach((element) => {
            mixedWarntyp.dwdService = mixedWarntyp.dwdService || {};
            mixedWarntyp.uwzService = mixedWarntyp.uwzService || {};
            mixedWarntyp.zamgService = mixedWarntyp.zamgService || {};
            element[1].dwdService.forEach(
                (a) => (mixedWarntyp.dwdService[`${a}`] = [...(mixedWarntyp.dwdService[`${a}`] || []), element[1].id]),
            );
            element[1].uwzService.forEach(
                (a) => (mixedWarntyp.uwzService[`${a}`] = [...(mixedWarntyp.uwzService[`${a}`] || []), element[1].id]),
            );
            element[1].zamgService.forEach(
                (a) =>
                    (mixedWarntyp.zamgService[`${a}`] = [...(mixedWarntyp.zamgService[`${a}`] || []), element[1].id]),
            );
        });
        const resultWarntyp: any = [];
        for (const a in mixedWarntyp) {
            if (!resultWarntyp[a]) resultWarntyp[a] = [];
            for (const b in mixedWarntyp[a]) {
                let add = true;
                for (const c in resultWarntyp) {
                    if (resultWarntyp[c].type) {
                        if (
                            mixedWarntyp[a][b].every((x: any) => resultWarntyp[c].type.includes(x)) &&
                            resultWarntyp[c].type.every((x: any) => mixedWarntyp[a][b].includes(x))
                        ) {
                            add = false;
                            if (resultWarntyp[c][a] == undefined) resultWarntyp[c][a] = [];
                            resultWarntyp[c][a].push(b);
                            break;
                        }
                    }
                }
                if (add) {
                    const t: any = { type: mixedWarntyp[a][b] };
                    t[a] = [b];
                    resultWarntyp.push(t);
                }
            }
        }
        const result: any = {};
        for (const a in resultWarntyp) {
            if (!resultWarntyp[a].type) continue;
            result[a] = resultWarntyp[a];
            result[a].id = resultWarntyp[a].type.join(', ');
            result[a].name = 'noname';
            delete result[a].type;
        }
        this.log.debug(JSON.stringify(result));*/
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
            let tempAdapters = [options.adapter];
            if (options.useadapterarray && options.adapters) {
                tempAdapters = options.adapters;
            }
            for (const a of tempAdapters) {
                options.adapter = a;
                const objs =
                    options.adapter != ''
                        ? await this.adapter.getObjectViewAsync('system', 'instance', {
                              startkey: `system.adapter.${options.adapter}`,
                              endkey: `system.adapter.${options.adapter}`,
                          })
                        : null;
                if (!options.useadapter || (objs && objs.rows && objs.rows.length > 0)) {
                    const noti = new NotificationClass.NotificationClass(
                        this.adapter,
                        JSON.parse(JSON.stringify(options)),
                    );
                    this.notificationServices.push(noti);
                    await noti.init();
                } else {
                    this.log.error(
                        `Configuration: ${options.name} is active, but dont find ${options.adapter} adapter!`,
                    );
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

    async delete(): Promise<void> {
        super.delete();
        await this.library.memberDeleteAsync(this.providers);
        await this.library.memberDeleteAsync(this.notificationServices);
        this.providers = [];
        this.notificationServices = [];
        await this.setConnected(false);
        if (this.refreshTimeRef) this.adapter.clearTimeout(this.refreshTimeRef);
        if (this.alertTimeoutRef) this.adapter.clearTimeout(this.alertTimeoutRef);
    }

    updateEndless(that: ProviderController): void {
        if (that.adapter.config.useTestCase) {
            if (++that.testStatus > 3) that.testStatus = 1;
            that.adapter.config.useTestWarnings = true;
            that.refreshTime = 60000;
        }
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
                that.refreshTimeRef = that.adapter.setTimeout(updater, 250, that, index);
            } else {
                await that.doEndOfUpdater();
                that.updateAlertEndless(that, false);
                that.refreshTimeRef = that.adapter.setTimeout(that.updateEndless, that.refreshTime || 600000, that);
            }
        }
    }
    async updateAlertEndless(self: any, endless: boolean = true): Promise<void> {
        const that = self as ProviderController;
        if (that.unload) return;
        await that.setSpeakAllowed();
        await that.checkAlerts();
        /** update every minute after 1.333 seconds. Avoid the full minute, full second and half second :) */
        const timeout = 61333 - (Date.now() % 60000);
        if (endless) that.alertTimeoutRef = that.adapter.setTimeout(that.updateAlertEndless, timeout, that);
    }

    async checkAlerts(): Promise<void> {
        let reply = undefined;
        for (const p in this.providers) {
            reply = await this.providers[p].getAlertsAndWrite(reply);
        }
        if (reply !== undefined) {
            await this.library.writeFromJson(
                'alerts',
                'allService.alerts',
                definitionen.statesObjectsWarnings,
                reply,
                false,
            );
        }
    }

    async doEndOfUpdater(): Promise<void> {
        this.setConnected();
        //await this.updateMesssages();
        this.activeMessages = 0;
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
            this.activeMessages += am;
        }

        if (this.pushOn) {
            for (const push of this.notificationServices) {
                await push.sendMessage(this.providers, ['new', 'remove', 'all', 'removeAll']);
            }
        }
        this.pushOn = true;
        await this.adapter.library.writedp(
            `${this.name}.activeWarnings`,
            this.activeMessages,
            definitionen.genericStateObjects.activeWarnings,
        );
        this.providers.forEach((a) => a.clearMessages());
        this.providers.forEach((a) => a.finishTurn());
        this.log.debug(`We have ${this.activeMessages} active messages.`);
    }
    providersExist(): boolean {
        return this.providers.length > 0;
    }
    async setConnected(status: boolean = this.connection): Promise<void> {
        await this.adapter.library.writedp(
            `info.connection`,
            !!status,
            definitionen.genericStateObjects.info.connection,
        );
    }

    async onStatePush(id: string): Promise<boolean> {
        if (!id.includes('commands.send_message.')) return false;
        id = id.replace(`${this.adapter.namespace}.`, '');
        const cmd = id.split('.').pop() as NotificationType.Type;
        const service = id.split('.').slice(0, -3).join('.');
        let index = -1;
        let providers = [];
        if ((index = this.providers.findIndex((a) => a.name == service)) > -1) {
            providers.push(this.providers[index]);
        } else {
            providers = this.providers;
        }
        let result = false;
        for (const push of this.notificationServices) {
            if (cmd == push.name && push.canManual()) {
                await push.sendMessage(providers, [...NotificationType.manual, 'removeAll'], true);
                await this.library.writedp(id, false);
                result = true;
            }
        }
        return result;
    }

    async finishInit(): Promise<void> {
        for (const p of [...this.providers, this]) {
            const channel =
                (p instanceof BaseProvider ? `${this.adapter.namespace}.${p.name}` : `${this.adapter.namespace}`) +
                '.commands';
            const commandChannel = `${channel}.send_message`;

            await this.library.writedp(
                channel,
                undefined,
                definitionen.statesObjectsWarnings.allService.commands._channel,
            );

            await this.library.writedp(
                commandChannel,
                undefined,
                definitionen.statesObjectsWarnings.allService.commands.send_message._channel,
            );
            await this.library.writedp(
                channel + '.clearHistory',
                false,
                definitionen.statesObjectsWarnings.allService.commands.clearHistory,
            );

            const states = this.library.getStates(`${commandChannel}.*`.replace('.', '\\.'));
            states[`${commandChannel}`] = undefined;
            for (const n of this.notificationServices) {
                if (n.options.notifications.findIndex((a) => NotificationType.manual.indexOf(a) != -1) == -1) continue;
                if (!(p instanceof BaseProvider) || n.options.service.indexOf(p.service) != -1) {
                    const dp = `${commandChannel}.${n.name}`;
                    states[dp] = undefined;
                    await this.library.writedp(
                        dp,
                        false,
                        definitionen.statesObjectsWarnings.allService.commands.send_message[
                            n.name as NotificationType.Type
                        ],
                    );
                }
            }
            for (const dp in states) {
                if (states[dp] !== undefined) {
                    await this.adapter.delObjectAsync(dp);
                    this.log.debug(`Remove state ${dp}`);
                }
            }
            await this.adapter.subscribeStatesAsync(channel + '.*');
        }
    }

    async clearHistory(id: string): Promise<boolean> {
        if (!id.endsWith('.clearHistory')) return false;
        let targets: any[] = [];
        this.providers.forEach((a) => {
            if (id.includes(a.name)) targets.push(a);
        });
        if (targets.length == 0) targets = [...this.providers, this];
        let result = false;
        for (const a in targets) {
            try {
                const dp = `${targets[a].name}.history`;
                await this.adapter.library.writedp(dp, '[]', definitionen.genericStateObjects.history);
                result = true;
            } catch (error: any) {
                this.log.error(error);
            }
        }
        if (result) await this.library.writedp(id.replace(`${this.adapter.namespace}.`, ''), false);
        return result;
    }

    setAllowedDirs(allowedDirs: any): void {
        const dirs = [];
        for (const a in allowedDirs) {
            if (!allowedDirs[a].dpWarning)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9\-_]+\\.warning`);
            if (!allowedDirs[a].dpAlerts)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9\-_]+\\.alerts`);
            /*if (!allowedDirs[a].dpMessage)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9\-_]+\\.messages`);*/
            if (!allowedDirs[a].dpFormated)
                dirs.push(`^provider\\.${a.replace(`Service`, ``)}\\.[a-zA-Z0-9\-_]+\\.formatedKeys`);

            this.library.setForbiddenDirs(dirs);
        }
    }
    async updateMesssages(): Promise<void> {
        for (const a in this.providers) {
            for (let b = 0; b < this.providers[a].messages.length && b < this.adapter.config.numOfRawWarnings; b++) {
                await this.providers[a].messages[b].updateFormatedData();
                await this.providers[a].messages[b].writeFormatedKeys(Number(b));
            }
        }
    }
    async setSpeakAllowed(id: string = ''): Promise<boolean> {
        if (id !== '') {
            id = id.replace(`${this.adapter.namespace}.`, '');
            if (definitionen.actionStates[id] === undefined) return false;
            this.log.debug(`Set speak ${id.split('.').slice(-1).join('.')} to ${this.library.readdp(id)!.val}`);
            this.library.writedp(id, this.library.readdp(id)!.val);
            if (definitionen.actionStates[id].onlyAck) return true;
        }
        if (this.isSilentAuto()) {
            const profil = this.getSpeakProfil();
            let isSpeakAllowed = true;

            if (
                this.silentTime !== undefined &&
                this.silentTime.profil[profil] &&
                Array.isArray(this.silentTime.profil[profil])
            ) {
                const now = new Date().getHours() + new Date().getMinutes() / 60;
                const day = String(new Date().getDay());
                for (const t of this.silentTime.profil[profil]) {
                    if (t === null) continue;
                    if (t.day.indexOf(day) == -1) continue;
                    if (t.start < t.end) {
                        if (t.start <= now && t.end > now) {
                            isSpeakAllowed = false;
                            break;
                        }
                    } else {
                        if (t.start <= now || t.end > now) {
                            isSpeakAllowed = false;
                            break;
                        }
                    }
                    isSpeakAllowed = true;
                }
            }
            if (isSpeakAllowed !== this.silentTime.shouldSpeakAllowed) {
                await this.library.writedp(
                    `commands.silentTime.isSpeakAllowed`,
                    isSpeakAllowed,
                    definitionen.statesObjectsWarnings.allService.commands.silentTime.isSpeakAllowed,
                );
                this.silentTime.shouldSpeakAllowed = isSpeakAllowed;
            }
        } else this.silentTime.shouldSpeakAllowed = undefined;
        return true;
    }
    isSilentAuto(): boolean {
        const result = this.library.readdp(`commands.silentTime.autoMode`);
        return result != undefined && !!result.val;
    }
    isSpeakAllowed(): boolean {
        const result = this.library.readdp(`commands.silentTime.isSpeakAllowed`);
        return (result != undefined && !!result.val) || result == undefined;
    }
    getSpeakProfil(): number {
        const result = this.library.readdp(`commands.silentTime.profil`);
        return result != undefined && typeof result.val == 'number' ? result.val : 0;
    }
}
