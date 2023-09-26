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
import { existsSync } from 'fs';
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
        this.library.internalConvert();
        setTimeout(
            async function (self: any) {
                if (!self.providerController) return;
                if (!self) return;
                try {
                    const states = await self.getStatesAsync('*');
                    self.library.initStates(states);
                } catch (error) {
                    self.log.error(`catch (1): init error while reading states! ${error}`);
                }
                // dwdSelectID gegen Abfrage prüfen und erst dann als valide erklären.
                if (self.config.dwdSelectId > 10000 && self.config.dwdEnabled) {
                    self.log.info('DWD activated. Retrieve data.');
                    self.providerController.createProviderIfNotExist({
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
                    const zamgArr = self.config.zamgSelectID.split('#');
                    if (zamgArr.length == 2) {
                        self.providerController.createProviderIfNotExist({
                            service: 'zamgService',
                            warncellId: zamgArr, //805111000 Düssel - kirn 807133052
                        });
                    }
                }
                if (self.config.uwzEnabled && self.config.uwzSelectID) {
                    self.log.info('UWZ activated. Retrieve data.');
                    self.providerController.createProviderIfNotExist({
                        service: 'uwzService',
                        warncellId: 'UWZ' + self.config.uwzSelectID.toUpperCase(), //UWZ + Land + PLZ
                    });
                }

                self.providerController.updateEndless(self.providerController);
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
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    /**
     * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
     * Using this method requires "common.messagebox" property to be set to true in io-package.json
     */
    private async onMessage(obj: ioBroker.Message): Promise<void> {
        if (typeof obj === 'object' && obj.message) {
            this.log.debug(`Retrieve ${obj.command} from ${obj.from} message: ${JSON.stringify(obj)}`);
            switch (obj.command) {
                case 'dwd.name':
                case 'dwd.name.text':
                    if (obj.callback) {
                        if (this.adminTimeoutRef) this.clearTimeout(this.adminTimeoutRef);
                        try {
                            this.log.debug(`message ${obj.command} start gathering data.`);
                            const data = dwdWarncellIdLong;
                            //if (!data) data = await axios.get(this.config.dwdWarncellTextUrl);
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
                                if (result.length == 1) this.config.dwdSelectId = result[0].value;
                                this.log.debug('inside of send to ' + msg.dwd + '   ' + JSON.stringify(result));
                                if (obj.command == 'dwd.name') this.sendTo(obj.from, obj.command, result, obj.callback);
                                else if (obj.command == 'dwd.name.text')
                                    this.sendTo(
                                        obj.from,
                                        obj.command,
                                        result.length == 1 ? result[0].label : '',
                                        obj.callback,
                                    );
                                this.log.debug(`ID is is: ${this.config.dwdSelectId}`);
                            } else {
                                this.log.debug(`else because length is: ${msg.dwd.length}`);
                                if (obj.command == 'dwd.name.text')
                                    this.sendTo(obj.from, obj.command, '', obj.callback);
                                else this.sendTo(obj.from, obj.command, text, obj.callback);
                            }
                        } catch (e) {
                            this.log.error(`catch (41): ${e}`);
                            if (obj.command == 'dwd.name.text') this.sendTo(obj.from, obj.command, '', obj.callback);
                            else this.sendTo(obj.from, obj.command, [{ label: 'N/A', value: '' }], obj.callback);
                        }
                    }
                    break;
            }
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
