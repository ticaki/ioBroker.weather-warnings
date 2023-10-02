import jsonata from 'jsonata';
import { genericStateObjects, statesObjectsWarningsType } from './def/definitionen';
import WeatherWarnings from '../main';

import {
    customFormatedTokensJson,
    genericWarntyp,
    genericWarntypeType,
    textLevels,
    warnTypeName,
} from './def/messages-def';
import { geti18nTranslation, seti18nTranslation, writei18nTranslation } from './translations';

// only change this for other adapters
type AdapterClassDefinition = WeatherWarnings;

type LibraryStateVal = LibraryStateValJson | undefined;
type LibraryStateValJson = {
    type: ioBroker.ObjectType;
    stateTyp: string | undefined;
    val: ioBroker.StateValue | undefined;
    ts: number;
    ack: boolean;
};

// Generic library module and base classes, do not insert specific adapter code here.

/**
 * Base class with this.log function
 */
export class BaseClass {
    unload: boolean = false;
    log: CustomLog;
    adapter: AdapterClassDefinition;
    name: string = ``;
    constructor(adapter: AdapterClassDefinition, name: string = '') {
        this.name = name;
        this.log = new CustomLog(adapter, this.name);
        this.adapter = adapter;
    }
    delete(): void {
        this.unload = true;
    }
}

class CustomLog {
    #adapter: AdapterClassDefinition;
    #prefix: string;
    constructor(adapter: AdapterClassDefinition, text: string = '') {
        this.#adapter = adapter;
        this.#prefix = text;
    }
    getName(): string {
        return this.#prefix;
    }
    debug(log: string, log2: string = ''): void {
        this.#adapter.log.debug(log2 ? `[${log}] ${log2}` : `[${this.#prefix}] ${log}`);
    }
    info(log: string, log2: string = ''): void {
        this.#adapter.log.info(log2 ? `[${log}] ${log2}` : `[${this.#prefix}] ${log}`);
    }
    warn(log: string, log2: string = ''): void {
        this.#adapter.log.warn(log2 ? `[${log}] ${log2}` : `[${this.#prefix}] ${log}`);
    }
    error(log: string, log2: string = ''): void {
        this.#adapter.log.error(log2 ? `[${log}] ${log2}` : `[${this.#prefix}] ${log}`);
    }
    setLogPrefix(text: string): void {
        this.#prefix = text;
    }
}

export class Library extends BaseClass {
    stateDataBase: { [key: string]: LibraryStateVal } = {};
    language: string | undefined;
    constructor(adapter: AdapterClassDefinition, _options: any = null) {
        super(adapter, 'library');
        this.stateDataBase = {};
    }

    /**
     * Write/create from a Json with defined keys, the associated states and channels
     * @param prefix iobroker datapoint prefix where to write
     * @param objNode Entry point into the definition json.
     * @param def the definition json
     * @param data The Json to read
     * @param expandTree expand arrays up to 99
     * @returns  void
     */
    async init(): Promise<void> {
        await this.updateTranslations();
    }

    async writeFromJson(
        // provider.dwd.*warncellid*.warnung*1-5*
        prefix: string,
        objNode: string, // the json path to object def for jsonata
        def: statesObjectsWarningsType,
        data: any,
        expandTree: boolean = false,
    ): Promise<void> {
        if (!def || typeof def !== 'object') return;
        if (data === undefined || ['string', 'number', 'boolean', 'object'].indexOf(typeof data) == -1) return;
        // wir arbeiten immer nur mit einem Datenpunkt ist dieses ein json wird mit expandTree recrusise aufgerufen für arrays erstmal immer plain
        const objectDefinition = objNode ? await this.getObjectDefFromJson(`${objNode}`, def) : null;

        if (objectDefinition)
            objectDefinition.native = { ...(objectDefinition.native || {}), objectDefinitionReference: objNode };

        if (typeof data === 'object' && data !== null) {
            // handle array
            if (Array.isArray(data)) {
                if (!objectDefinition) return;
                if (this.adapter.config.expandArray || objectDefinition.type !== 'state' || expandTree) {
                    let a = 0;
                    for (const k in data) {
                        const defChannel = this.getChannelObject(objectDefinition);

                        const dp = `${prefix}${`00${a++}`.slice(-2)}`;
                        // create folder
                        await this.writedp(dp, null, defChannel);

                        await this.writeFromJson(dp, `${objNode}`, def, data[k], expandTree);
                    }
                } else {
                    this.writeFromJson(prefix, objNode, def, JSON.stringify(data) || '[]', expandTree);
                }
                //objectDefinition._id = `${this.adapter.name}.${this.adapter.instance}.${prefix}.${key}`;
            } else {
                // create folder
                if (objectDefinition) {
                    const defChannel = this.getChannelObject(objectDefinition);
                    await this.writedp(prefix, null, defChannel);
                }
                if (data === null) return;

                for (const k in data) {
                    await this.writeFromJson(`${prefix}.${k}`, `${objNode}.${k}`, def, data[k], expandTree);
                }
            }
        } else {
            if (!objectDefinition) return;
            await this.writedp(prefix, data, objectDefinition);
        }
        /**
         * überlegungen zur Defintion von states
         * const def : {id: objectdefinition...}
         * bei objecten im State funktioniert es nicht gleichzeitig den channel und die darunter liegende States zu definieren
         *
         * bei def =  {id: Pfadname}
         * gibts kein Problem mit channels... scheint mir die beste Lösung zu sein
         * Pfade die als Erinnerungshilfe ohne name und instance
         * provider.dwd.*warncellid*.warnung*1-5*
         */
    }

    /**
     * Get the ioBroker.Object out of stateDefinition
     *
     * @param key is the deep linking key to the definition
     * @param data  is the definition dataset
     * @returns ioBroker.ChannelObject | ioBroker.DeviceObject &| ioBroker.StateObject/s
     */
    async getObjectDefFromJson(key: string, data: any): Promise<ioBroker.Object> {
        let result = await jsonata(`${key}`).evaluate(data);
        if (result === null || result === undefined) {
            this.log.warn(`No definition for ${key}!`);
            result = genericStateObjects.state;
        }
        return this.cloneObject(result);
    }

    /**
     * Get a channel/device definition from property _channel out of a getObjectDefFromJson() result or a default definition.
     *
     * @param def the data coming from getObjectDefFromJson()
     * @returns ioBroker.ChannelObject | ioBroker.DeviceObject or a default channel obj
     */
    getChannelObject(
        definition: (ioBroker.Object & { _channel?: ioBroker.Object }) | null = null,
    ): ioBroker.ChannelObject | ioBroker.DeviceObject {
        const def = (definition && definition._channel) || null;
        const result: ioBroker.ChannelObject | ioBroker.DeviceObject = {
            _id: def ? def._id : '',
            type: def && def.type != 'device' ? 'channel' : 'device',
            common: {
                name: (def && def.common && def.common.name) || 'no definition',
            },
            native: (def && def.native) || {},
        };
        return result;
    }

    /**
     * Write/Create the specified data point with value, will only be written if val != oldval and obj.type == state or the data point value in the DB is not undefined. Channel and Devices have an undefined value.
     * @param dp Data point to be written. Library.clean() is called with it.
     * @param val Value for this data point. Channel vals (old and new) are undefined so they never will be written.
     * @param obj The object definition for this data point (ioBroker.ChannelObject | ioBroker.DeviceObject | ioBroker.StateObject)
     * @returns void
     */
    async writedp(dp: string, val: ioBroker.StateValue | undefined, obj: ioBroker.Object | null = null): Promise<void> {
        dp = this.cleandp(dp);
        let node = this.readdp(dp);
        if (node === undefined) {
            if (!obj) {
                throw new Error('writedp try to create a state without object informations.');
            }
            obj._id = `${this.adapter.name}.${this.adapter.instance}.${dp}`;
            await this.adapter.setObjectNotExistsAsync(dp, obj);
            const stateType = obj && obj.common && obj.common.type;
            node = this.setdb(dp, obj.type, undefined, stateType, true);
        }

        if (obj && obj.type !== 'state') return;

        if (node) this.setdb(dp, node.type, val, node.stateTyp, true);

        if (node && node.val != val) {
            const typ = (obj && obj.common && obj.common.type) || node.stateTyp;
            if (typ && typ != typeof val && val !== undefined) val = this.convertToType(val, typ);
            await this.adapter.setStateAsync(dp, { val: val, ts: Date.now(), ack: true });
        }
    }

    /**
     * Remove forbidden chars from datapoint string.
     * @param string Datapoint string to clean
     * @param lowerCase lowerCase() first param.
     * @returns void
     */
    cleandp(string: string, lowerCase: boolean = false): string {
        if (!string && typeof string != 'string') return string;

        string = string.replace(this.adapter.FORBIDDEN_CHARS, '#');

        return lowerCase ? string.toLowerCase() : string;
    }
    /* Convert a value to the given type
     * @param {string|boolean|number} value 	then value to convert
     * @param {string}   type  					the target type
     * @returns
     */
    convertToType(value: ioBroker.StateValue | Array<any> | JSON, type: string): ioBroker.StateValue {
        if (value === null) return null;
        if (type === undefined) {
            throw new Error('convertToType type undefifined not allowed!');
        }
        if (value === undefined) value = '';

        const old_type = typeof value;
        let newValue: ioBroker.StateValue = typeof value == 'object' ? JSON.stringify(value) : value;

        if (type !== old_type) {
            switch (type) {
                case 'string':
                    newValue = value.toString() || '';
                    break;
                case 'number':
                    newValue = value ? Number(value) : 0;
                    break;
                case 'boolean':
                    newValue = !!value;
                    break;
                case 'array':
                case 'json':
                    //JSON.stringify() is done before
                    break;
            }
        }
        // get a warning message when we try to convert a object/array.
        return newValue;
    }
    setdb(
        dp: string,
        type: ioBroker.ObjectType,
        val: ioBroker.StateValue | undefined,
        stateType: string | undefined,
        ack: boolean = true,
        ts: number = Date.now(),
    ): LibraryStateVal {
        this.stateDataBase[dp] = { type: type, stateTyp: stateType, val: val, ack: ack, ts: ts ? ts : Date.now() };
        return this.stateDataBase[dp];
    }
    getdb(dp: string): LibraryStateVal | undefined {
        return this.stateDataBase[dp];
    }
    cloneObject(obj: ioBroker.Object): ioBroker.Object {
        if (typeof obj !== 'object') {
            this.log.error(`Error clone object target is type: ${typeof obj}`);
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }
    cloneGenericObject(obj: object): object {
        if (typeof obj !== 'object') {
            this.log.error(`Error clone object target is type: ${typeof obj}`);
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }
    readdp(dp: string): LibraryStateVal {
        return this.stateDataBase[this.cleandp(dp)];
    }
    async readWithJsonata(
        data: object,
        cmd: { [key: string]: string } | string,
    ): Promise<string | { [key: string]: string }> {
        let result: any;
        if (typeof cmd === 'string') {
            if (cmd === '') return '';
            try {
                result = await jsonata(cmd).evaluate(data);
            } catch (error: any) {
                this.log.error(error.message);
                this.log.error(`The cmd: ${cmd} is invaild Message: ${error.message}.`);
            }
        } else {
            result = {};
            for (const k in cmd) {
                if (cmd[k]) {
                    try {
                        result[k] = await jsonata(cmd[k]).evaluate(data);
                    } catch (error: any) {
                        this.log.error(error);
                        this.log.error(`The cmd: ${cmd[k]} for key ${k} is invaild.`);
                    }
                }
            }
        }
        return result;
    }
    /**
     * Initialise the database with the states to prevent unnecessary creation and writing.
     * @param states States that are to be read into the database during initialisation.
     * @returns void
     */
    async initStates(states: { [key: string]: { val: ioBroker.StateValue; ts: number; ack: boolean } }): Promise<void> {
        if (!states) return;
        for (const state in states) {
            const dp = state.replace(`${this.adapter.name}.${this.adapter.instance}.`, '');
            const obj = await this.adapter.getObjectAsync(dp);

            this.setdb(
                dp,
                'state',
                states[state] && states[state].val ? states[state].val : undefined,
                obj && obj.common && obj.common.type ? obj.common.type : undefined,
                states[state] && states[state].ack,
                states[state] && states[state].ts ? states[state].ts : Date.now(),
            );
        }
    }

    /**
     * Resets states that have not been updated in the database in offset time.
     * @param prefix String with which states begin that are reset.
     * @param offset Time in ms since last update.
     * @returns void
     */
    async garbageColleting(prefix: string, offset: number = 2000): Promise<void> {
        if (!prefix) return;
        if (this.stateDataBase) {
            for (const id in this.stateDataBase) {
                if (id.startsWith(prefix)) {
                    const state = this.stateDataBase[id];
                    if (!state || state.val == undefined) continue;
                    if (state.ts < Date.now() - offset) {
                        let newVal: -1 | '' | '{}' | '[]' | false | null | undefined;
                        switch (state.stateTyp) {
                            case 'string':
                                if (typeof state.val == 'string') {
                                    if (state.val.startsWith('{') && state.val.endsWith('}')) newVal = '{}';
                                    else if (state.val.startsWith('[') && state.val.endsWith(']')) newVal = '[]';
                                    else newVal = '';
                                } else newVal = '';
                                break;
                            case 'bigint':
                            case 'number':
                                newVal = -1;
                                break;

                            case 'boolean':
                                newVal = false;
                                break;
                            case 'symbol':
                            case 'object':
                            case 'function':
                                newVal = null;
                                break;
                            case 'undefined':
                                newVal = undefined;
                                break;
                        }
                        await this.writedp(id, newVal);
                    }
                }
            }
        }
    }

    async getTranslation(text: string | { [key: string]: string }): Promise<string> {
        if (typeof text == 'object') {
            if (!this.language) {
                const obj = await this.adapter.getForeignObjectAsync('system.config');
                if (obj) this.language = obj.common.language;

                if (!this.language) this.language = 'en';
            }
            if (!text[this.language]) return text['en'];
            return text[this.language];
        } else return text;
    }
    getLocalLanguage(): string {
        if (this.language) return this.language;
        return 'en-En';
    }

    async updateTranslations(): Promise<void> {
        for (const b in genericWarntyp) {
            const l = Number(b) as keyof genericWarntypeType;
            const key = 'genericWarntyp.' + l + '.name';
            const translation = geti18nTranslation(key);
            if (translation != '' && typeof translation == 'object' && translation.en !== '') {
                genericWarntyp[l].name = translation as ioBroker.StringOrTranslated;
            } else {
                seti18nTranslation(key, genericWarntyp[l].name);
            }
        }
        for (const l in warnTypeName) {
            //@ts-expect-error faulheit
            for (const l2 in warnTypeName[l]) {
                const key = 'warnTypeName.' + l + '.' + l2;
                const translation = geti18nTranslation(key);
                if (translation != '' && typeof translation == 'object' && translation.en !== '') {
                    //@ts-expect-error faulheit
                    warnTypeName[l][l2] = translation as ioBroker.StringOrTranslated;
                } else {
                    //@ts-expect-error faulheit
                    seti18nTranslation(key, warnTypeName[l][l2]);
                }
            }
        }
        for (const l in textLevels) {
            //@ts-expect-error faulheit
            for (const l2 in textLevels[l]) {
                const key = 'textLevels.' + l + '.' + l2;
                const translation = geti18nTranslation(key);
                if (translation != '' && typeof translation == 'object' && translation.en !== '') {
                    //@ts-expect-error faulheit
                    textLevels[l][l2] = translation as ioBroker.StringOrTranslated;
                } else {
                    //@ts-expect-error faulheit
                    seti18nTranslation(key, textLevels[l][l2]);
                }
            }
        }
        for (const l in customFormatedTokensJson) {
            const key = 'customFormatedTokensJson.' + l;
            const translation = geti18nTranslation(key);
            //@ts-expect-error faulheit
            if (customFormatedTokensJson[l] !== '') {
                if (translation != '' && typeof translation == 'object' && translation.en !== '') {
                    //@ts-expect-error faulheit
                    customFormatedTokensJson[l] = translation as ioBroker.StringOrTranslated;
                } else {
                    //@ts-expect-error faulheit
                    seti18nTranslation(key, customFormatedTokensJson[l]);
                }
            }
        }
        await writei18nTranslation();
    }
}
