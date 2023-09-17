/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';

import { dwdWarncellIdLong } from './lib/others/dwdWarncellIdLong.js';
//const dwdDefinition = require(`${__dirname}/lib/def/dwd.js`);

import axios from 'axios';
import { ProviderController } from './lib/provider.js';
import { Library } from './lib/library.js';
axios.defaults.timeout = 8000;
// Load your modules here, e.g.:
// import * as fs from "fs";

export class WeatherWarnings extends utils.Adapter {
    library: Library;
    providerController: ProviderController | null = null;
    numOfRawWarnings: number = 5;
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
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here
        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info('config option1: ' + this.config.option1);
        this.log.info('config option2: ' + this.config.option2);

        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        await this.setObjectNotExistsAsync('testVariable', {
            type: 'state',
            common: {
                name: 'testVariable',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: true,
            },
            native: {},
        });

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        this.subscribeStates('testVariable');
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates('*');

        /*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
        // the variable testVariable is set to true as command (ack=false)
        await this.setStateAsync('testVariable', true);

        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        await this.setStateAsync('testVariable', { val: true, ack: true });

        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        await this.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });

        // examples for the checkPassword/checkGroup functions
        let result = await this.checkPasswordAsync('admin', 'iobroker');
        this.log.info('check user admin pw iobroker: ' + result);

        result = await this.checkGroupAsync('admin', 'admin');
        this.log.info('check group user admin group admin: ' + result);

        this.providerController = new ProviderController(this);
        //laengen: 13.05501, breiten: 47.80949
        this.setTimeout(
            function (self) {
                if (!self) return;
                //@ts-expect-error naja
                const provider = self.providerController.createProviderIfNotExist({
                    service: 'dwdService',
                    warncellId: '805374012', //805111000 Düssel - kirn 807133052
                });
                if (provider) provider.updateData();
                //@ts-expect-error naja
                const provider2 = self.providerController.createProviderIfNotExist({
                    service: 'zamgService',
                    warncellId: ['13.05501', '47.80949'], //805111000 Düssel - kirn 807133052
                });
                if (provider2) provider2.updateData();
                //@ts-expect-error naja
                const provider3 = self.providerController.createProviderIfNotExist({
                    service: 'uwzService',
                    warncellId: 'DE55606', //Land + PLZ
                });
                if (provider3) provider3.updateData();
            },
            4000,
            this,
        );
        /*const provider = this.providerController.createProviderIfNotExist({
            service: 'dwdService',
            warncellId: '805374012', //805111000 Düssel - kirn 807133052
        });
        if (provider) provider.updateData();*/
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
            this.log.debug(`Retrieve ${obj.command} from ${obj.from} message: JSON.stringify(obj)`);
            switch (obj.command) {
                case 'dwd.name':
                    if (obj.callback) {
                        try {
                            let data = dwdWarncellIdLong;
                            if (!data) data = await axios.get(this.config.dwdWarncellTextUrl);
                            const text: string[] = [];
                            if (true) {
                                const dataArray: string[] = data.split('\n');

                                dataArray.splice(0, 1);
                                dataArray.forEach((element) => {
                                    const value = element.split(';')[0];
                                    const city = element.split(';')[1];
                                    const cityText = element.split(';')[2];
                                    if (
                                        city &&
                                        (city.startsWith('Stadt') ||
                                            city.startsWith('Groß') ||
                                            city.startsWith('Groß') ||
                                            city.startsWith('Gemeinde'))
                                    ) {
                                        if (text) text.push(`${cityText} #${value}`);
                                    }
                                });
                                text.sort((a, b) => {
                                    const nameA = a.toUpperCase(); // ignore upper and lowercase
                                    const nameB = b.toUpperCase(); // ignore upper and lowercase
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
                            if (msg.dwd.length) {
                                const result = text.filter((a) => a.toUpperCase().startsWith(msg.dwd.toUpperCase()));
                                this.sendTo(obj.from, obj.command, result, obj.callback);
                            } else {
                                this.sendTo(obj.from, obj.command, text, obj.callback);
                            }
                        } catch (e) {
                            this.sendTo(obj.from, obj.command, [{ label: 'N/A', value: '' }], obj.callback);
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
