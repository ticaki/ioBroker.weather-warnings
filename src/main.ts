/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';

import axios from 'axios';
import 'source-map-support/register';
import { dwdWarncellIdLong } from './lib/others/dwdWarncellIdLong.js';
import { ProviderController } from './lib/provider.js';
import { Library } from './lib/library.js';
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
        // Initialize your adapter here
        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:

        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        /*await this.setObjectNotExistsAsync('testVariable', {
            type: 'state',
            common: {
                name: 'testVariable',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: true,
            },
            native: {},
        });*/

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        //this.subscribeStates('testVariable');
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates('*');

        /*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */

        // examples for the checkPassword/checkGroup functions
        let result = await this.checkPasswordAsync('admin', 'iobroker');
        this.log.info('check user admin pw iobroker: ' + result);

        result = await this.checkGroupAsync('admin', 'admin');
        this.log.info('check group user admin group admin: ' + result);

        //laengen: 13.05501, breiten: 47.80949
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
                    const zamgArr = self.config.zamgSelectID.split('#');
                    if (zamgArr.length == 2) {
                        self.providerController.createProviderIfNotExist({
                            service: 'zamgService',
                            warncellId: zamgArr, //805111000 Düssel - kirn 807133052
                        });
                    }
                }
                if (self.config.uwzEnabled && self.config.uwzSelectID) {
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
