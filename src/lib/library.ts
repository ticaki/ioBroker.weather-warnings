import jsonata from 'jsonata';
import _fs from 'fs';
import type { statesObjectsWarningsType } from './def/definition';
import { genericStateObjects } from './def/definition';
import type WeatherWarnings from '../main';

// only change this for other adapters
type AdapterClassDefinition = WeatherWarnings;

type LibraryStateVal = LibraryStateValJson | undefined;
type LibraryStateValJson = {
    type: ioBroker.ObjectType;
    stateTyp: string | undefined;
    val: ioBroker.StateValue | undefined;
    ts: number;
    ack: boolean;
    init: boolean;
};

// Generic library module and base classes, do not insert specific adapter code here.

/**
 * Base class with this.log function
 */
export class BaseClass {
    unload: boolean = false;
    log: CustomLog;
    adapter: AdapterClassDefinition;
    library: Library;
    name: string = ``;

    /**
     * Create a new instance of the BaseClass.
     *
     * @param adapter The adapter instance.
     * @param name The name of the instance, used for logging.
     */
    constructor(adapter: AdapterClassDefinition, name: string = '') {
        this.name = name;
        this.log = new CustomLog(adapter, this.name);
        this.adapter = adapter;
        this.library = adapter.library;
    }
    // hier lassen wir das async nicht das eine übergeordnete Version was mit await aufrufen will.
    //eslint-disable-next-line
    async delete(): Promise<void> {
        this.unload = true;
    }
}

class CustomLog {
    private adapter: AdapterClassDefinition;
    private prefix: string;

    /**
     * Create a new instance of the CustomLog class.
     *
     * @param adapter The adapter instance.
     * @param text The prefix for the log messages.
     */
    constructor(adapter: AdapterClassDefinition, text: string = '') {
        this.adapter = adapter;
        this.prefix = text;
    }
    /**
     * Return the prefix string used for log messages.
     *
     * @returns The prefix string.
     */
    getName(): string {
        return this.prefix;
    }
    /**
     * Writes a debug message to the log.
     *
     * @param log The debug message.
     * @param log2 An additional debug message.
     */
    debug(log: string, log2: string = ''): void {
        this.adapter.log.debug(log2 ? `[${log}] ${log2}` : `[${this.prefix}] ${log}`);
    }
    info(message: string, additionalMessage: string = ''): void {
        const formattedMessage = additionalMessage
            ? `[${message}] ${additionalMessage}`
            : `[${this.prefix}] ${message}`;
        /**
         * Writes an info message to the log.
         *
         * @param message The info message.
         * @param additionalMessage An additional info message.
         */
        this.adapter.log.info(formattedMessage);
    }
    /**
     * Writes a warning message to the log.
     *
     * @param message The warning message.
     * @param additionalMessage An additional warning message.
     */
    warn(message: string, additionalMessage: string = ''): void {
        const formattedMessage = additionalMessage
            ? `[${message}] ${additionalMessage}`
            : `[${this.prefix}] ${message}`;
        this.adapter.log.warn(formattedMessage);
    }
    /**
     * Writes an error message to the log.
     *
     * @param errorMessage The error message.
     * @param additionalErrorMessage An additional error message.
     */
    error(errorMessage: string, additionalErrorMessage: string = ''): void {
        const formattedErrorMessage = additionalErrorMessage
            ? `[${errorMessage}] ${additionalErrorMessage}`
            : `[${this.prefix}] ${errorMessage}`;
        this.adapter.log.error(formattedErrorMessage);
    }
    /**
     * Sets the prefix for log messages.
     *
     * @param prefix - The prefix to be used for log messages. Leading and trailing whitespace are trimmed.
     */
    setLogPrefix(prefix: string): void {
        this.prefix = prefix.trim();
    }
}
/**
 * The Library class is a base class that provides common functionality for the adapter.
 * It extends the BaseClass and provides additional properties and methods for managing the adapter's state.
 */
export class Library extends BaseClass {
    stateDataBase: { [key: string]: LibraryStateVal } = {};
    language: ioBroker.Languages = 'en';
    forbiddenDirs: string[] = [];
    translation: { [key: string]: string } = {};

    /**
     * Creates a new instance of the Library class.
     *
     * @param adapter The adapter instance.
     * @param _options The configuration options for the adapter. Not used.
     */
    constructor(adapter: AdapterClassDefinition, _options: any = null) {
        super(adapter, 'library');
        this.stateDataBase = {};
    }

    /**
     * Initializes the Library by setting the language based on the system configuration.
     * If the system configuration's language is not available, defaults to English.
     *
     * @returns A promise that resolves when initialization is complete.
     */
    async init(): Promise<void> {
        const obj = await this.adapter.getForeignObjectAsync('system.config');
        if (obj) {
            await this.setLanguage(obj.common.language, true);
        } else {
            await this.setLanguage('en', true);
        }
    }

    /**
     * Write/create from a Json with defined keys, the associated states and channels
     *
     * @param prefix iobroker datapoint prefix where to write
     * @param objNode Entry point into the definition json.
     * @param def the definition json
     * @param data The Json to read
     * @param expandTree expand arrays up to 99
     * @returns  void
     */
    async writeFromJson(
        // provider.dwd.*warncellid*.warnung*1-5*
        prefix: string,
        objNode: string, // the json path to object def for jsonata
        def: statesObjectsWarningsType,
        data: any,
        expandTree: boolean = false,
    ): Promise<void> {
        if (!def || typeof def !== 'object') {
            return;
        }
        if (data === undefined || ['string', 'number', 'boolean', 'object'].indexOf(typeof data) == -1) {
            return;
        }

        const objectDefinition = objNode ? this.getObjectDefFromJson(`${objNode}`, def) : null;

        if (objectDefinition) {
            objectDefinition.native = {
                ...(objectDefinition.native || {}),
                objectDefinitionReference: objNode,
            };
        }

        if (typeof data === 'object' && data !== null) {
            // handle array
            if (Array.isArray(data)) {
                if (!objectDefinition) {
                    return;
                }
                if (this.adapter.config.expandArray || objectDefinition.type !== 'state' || expandTree) {
                    let a = 0;
                    for (const k of data) {
                        const defChannel = this.getChannelObject(objectDefinition);

                        const dp = `${prefix}${`00${a++}`.slice(-2)}`;
                        // create folder
                        await this.writedp(dp, null, defChannel);

                        await this.writeFromJson(dp, `${objNode}`, def, k, expandTree);
                    }
                } else {
                    await this.writeFromJson(prefix, objNode, def, JSON.stringify(data) || '[]', expandTree);
                }
                //objectDefinition._id = `${this.adapter.name}.${this.adapter.instance}.${prefix}.${key}`;
            } else {
                // create folder
                if (objectDefinition) {
                    const defChannel = this.getChannelObject(objectDefinition);
                    await this.writedp(prefix, null, defChannel);
                }
                if (data === null) {
                    return;
                }

                for (const k in data) {
                    await this.writeFromJson(`${prefix}.${k}`, `${objNode}.${k}`, def, data[k], expandTree);
                }
            }
        } else {
            if (!objectDefinition) {
                return;
            }
            await this.writedp(prefix, data, objectDefinition);
        }
    }

    /**
     * Get the ioBroker.Object out of stateDefinition
     *
     * @param key is the deep linking key to the definition
     * @param data  is the definition dataset
     * @returns ioBroker.ChannelObject | ioBroker.DeviceObject | ioBroker.StateObject
     */
    getObjectDefFromJson(key: string, data: any): ioBroker.Object {
        //let result = await jsonata(`${key}`).evaluate(data);
        let result = this.deepJsonValue(key, data);
        if (result === null || result === undefined) {
            const k = key.split('.');
            if (k && k[k.length - 1].startsWith('_')) {
                result = genericStateObjects.customString;
            } else {
                this.log.warn(`No definition for ${key}!`);
                result = genericStateObjects.state;
            }
        }
        return this.cloneObject(result);
    }

    /**
     * Retrieve a value from a nested object.
     *
     * @param key string of dot-separated keys to traverse the object.
     * @param data The object to traverse.
     * @returns The value at the key. If the key does not exist, throws an error.
     */
    deepJsonValue(key: string, data: any): any {
        if (!key || !data || typeof data !== 'object' || typeof key !== 'string') {
            throw new Error(`Error(222) data or key are missing/wrong type!`);
        }
        const k = key.split(`.`);
        let c = 0,
            s = data;
        while (c < k.length) {
            s = s[k[c++]];
        }
        return s;
    }

    /**
     * Create a ioBroker.ChannelObject or ioBroker.DeviceObject out of a
     * ioBroker.Object definition.
     *
     * @param definition the ioBroker.Object definition
     * @returns ioBroker.ChannelObject | ioBroker.DeviceObject
     */
    getChannelObject(
        definition:
            | (ioBroker.Object & {
                  _channel?: ioBroker.Object;
              })
            | null = null,
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
     *
     * @param dp Data point to be written. Library.clean() is called with it.
     * @param val Value for this data point. Channel vals (old and new) are undefined so they never will be written.
     * @param obj The object definition for this data point (ioBroker.ChannelObject | ioBroker.DeviceObject | ioBroker.StateObject)
     * @returns void
     */
    async writedp(dp: string, val: ioBroker.StateValue | undefined, obj: ioBroker.Object | null = null): Promise<void> {
        dp = this.cleandp(dp);
        let node = this.readdp(dp);
        const del = !this.isDirAllowed(dp);

        if (node === undefined) {
            if (!obj) {
                throw new Error('writedp try to create a state without object informations.');
            }
            obj._id = `${this.adapter.name}.${this.adapter.instance}.${dp}`;
            if (typeof obj.common.name == 'string') {
                obj.common.name = await this.getTranslationObj(obj.common.name);
            }
            if (!del) {
                await this.adapter.extendObjectAsync(dp, obj);
            }
            const stateType = obj && obj.common && obj.common.type;
            node = this.setdb(dp, obj.type, undefined, stateType, true);
        } else if (node.init && obj) {
            if (typeof obj.common.name == 'string') {
                obj.common.name = await this.getTranslationObj(obj.common.name);
            }
            if (!del) {
                await this.adapter.extendObjectAsync(dp, obj);
            }
        }

        if (obj && obj.type !== 'state') {
            return;
        }

        if (node) {
            this.setdb(dp, node.type, val, node.stateTyp, true);
        }

        if (node && (node.val != val || !node.ack)) {
            const typ = (obj && obj.common && obj.common.type) || node.stateTyp;
            if (typ && typ != typeof val && val !== undefined) {
                val = this.convertToType(val, typ);
            }
            if (!del) {
                await this.adapter.setStateAsync(dp, {
                    val: val,
                    ts: Date.now(),
                    ack: true,
                });
            }
        }
    }

    /**
     * Concatenates the given array of forbidden directory patterns with the current array of patterns.
     * The given array elements are strings which are used to create a regular expression, so special characters should be escaped.
     *
     * @param dirs Array of strings which are used to create a regular expression to check if a directory is allowed.
     */
    setForbiddenDirs(dirs: any[]): void {
        this.forbiddenDirs = this.forbiddenDirs.concat(dirs);
    }

    /**
     * Checks if the given directory path is allowed to be used.
     * The rules are as follows:
     * - The path must not contain any of the strings from the `forbiddenDirs` array.
     * - The path must not consist of more than 2 parts (i.e. it must not contain any dots).
     *
     * @param dp The directory path to check.
     * @returns true if the directory path is allowed, false otherwise.
     */
    isDirAllowed(dp: string): boolean {
        if (dp && dp.split('.').length <= 2) {
            return true;
        }
        for (const a of this.forbiddenDirs) {
            if (dp.search(new RegExp(a, 'g')) != -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get all states that match the given string.
     * The string is used as a regular expression to filter the state paths.
     * The result is an object where the keys are the state paths and the values are the state values.
     *
     * @param str The string to filter the states with.
     * @returns An object with the state paths as keys and the state values as values.
     */
    getStates(str: string): { [key: string]: LibraryStateVal } {
        const result: { [key: string]: LibraryStateVal } = {};
        for (const dp in this.stateDataBase) {
            if (dp.search(new RegExp(str, 'g')) != -1) {
                result[dp] = this.stateDataBase[dp];
            }
        }
        return result;
    }

    /**
     * Clean up the state data base by deleting all states that do not have a hold object in the given array
     * and do not match any of the given filter strings.
     * Additionally, the given deep parameter is used to slice the state path and delete the resulting object
     * from the adapter object list.
     *
     * @param hold An array of strings which are used to determine if a state should be kept or deleted.
     * @param filter An array of strings which are used to filter the states to be deleted. If a state's path
     * starts with any of the strings in this array, it will not be deleted.
     * @param deep The number of path parts to slice from the state path to delete from the adapter object list.
     * @returns A promise that resolves when all states have been deleted.
     */
    async cleanUpTree(hold: string[], filter: string[] | null, deep: number): Promise<void> {
        let del = [];
        for (const dp in this.stateDataBase) {
            if (filter && filter.filter(a => dp.startsWith(a) || a.startsWith(dp)).length == 0) {
                continue;
            }
            if (hold.filter(a => dp.startsWith(a) || a.startsWith(dp)).length > 0) {
                continue;
            }
            delete this.stateDataBase[dp];
            del.push(dp.split('.').slice(0, deep).join('.'));
        }
        del = del.filter((item, pos, arr) => {
            return arr.indexOf(item) == pos;
        });
        for (const a of del) {
            await this.adapter.delObjectAsync(a, { recursive: true });
            this.log.debug(`Clean up tree delete: ${a}`);
        }
    }

    /**
     * Cleans a given string by replacing forbidden characters with underscores.
     *
     * @param string - The input string to be cleaned.
     * @param lowerCase - If true, converts the string to lowercase after cleaning.
     * @param removePoints - If true, removes all non-alphanumeric characters except underscores and hyphens.
     *                       If false, retains periods as valid characters.
     * @returns The cleaned string with forbidden characters replaced and optionally converted to lowercase.
     */
    cleandp(string: string, lowerCase: boolean = false, removePoints: boolean = false): string {
        if (!string && typeof string != 'string') {
            return string;
        }

        string = string.replace(this.adapter.FORBIDDEN_CHARS, '_');
        // hardliner
        if (removePoints) {
            string = string.replace(/[^0-9A-Za-z_-]/gu, '_');
        } else {
            string = string.replace(/[^0-9A-Za-z._-]/gu, '_');
        }
        return lowerCase ? string.toLowerCase() : string;
    }

    /**
     * Convert a value to the given type
     *
     * @param value then value to convert
     * @param type the target type
     */
    convertToType(value: ioBroker.StateValue | Array<any> | JSON, type: string): ioBroker.StateValue {
        if (value === null) {
            return null;
        }
        if (type === undefined) {
            throw new Error('convertToType type undefined not allowed!');
        }
        if (value === undefined) {
            value = '';
        }

        const old_type = typeof value;
        let newValue: ioBroker.StateValue = typeof value == 'object' ? JSON.stringify(value) : value;

        if (type !== old_type) {
            switch (type) {
                case 'string':
                    // eslint-disable-next-line
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

    /**
     * reads a datapoint from the state database
     *
     * @param dp the datapointname
     * @returns the data of the datapoint
     */
    readdp(dp: string): LibraryStateVal {
        return this.stateDataBase[this.cleandp(dp)];
    }

    /**
     * Stores a datapoint in the state database
     *
     * @param dp datapoint name
     * @param type type of the datapoint
     * @param val the value
     * @param stateType the state type
     * @param [ack] ack flag
     * @param [ts] timestamp
     * @param [init] init flag
     * @returns the new state
     */
    setdb(
        dp: string,
        type: ioBroker.ObjectType,
        val: ioBroker.StateValue | undefined,
        stateType: string | undefined,
        ack: boolean = true,
        ts: number = Date.now(),
        init: boolean = false,
    ): LibraryStateVal {
        this.stateDataBase[dp] = {
            type: type,
            stateTyp:
                stateType !== undefined
                    ? stateType
                    : this.stateDataBase[dp] !== undefined && this.stateDataBase[dp].stateTyp !== undefined
                      ? this.stateDataBase[dp].stateTyp
                      : undefined,
            val: val,
            ack: ack,
            ts: ts ? ts : Date.now(),
            init: init,
        };
        return this.stateDataBase[dp];
    }

    /**
     * Delete all objects in data array
     *
     * @param data array of ioBroker objects
     * @returns Promise that resolves when all objects are deleted
     */
    async memberDeleteAsync(data: any[]): Promise<void> {
        for (const d of data) {
            await d.delete();
        }
    }

    /**
     * Clones a ioBroker object.
     *
     * @param obj the object to clone
     * @returns the cloned object
     * @throws {Error} if target is not an object
     */
    cloneObject(obj: ioBroker.Object): ioBroker.Object {
        if (typeof obj !== 'object') {
            this.log.error(`Error clone object target is type: ${typeof obj}`);
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Deep clones a generic object.
     *
     * @param obj the object to clone
     * @returns the cloned object
     */
    cloneGenericObject(obj: object): object {
        if (typeof obj !== 'object') {
            this.log.error(`Error clone object target is type: ${typeof obj}`);
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Checks if a file exists in the './admin/' directory.
     *
     * @param file - The name of the file to check.
     * @returns True if the file exists, otherwise false.
     */
    fileExistAsync(file: string): boolean {
        if (_fs.existsSync(`./admin/${file}`)) {
            return true;
        }
        return false;
    }
    /**
     * Evaluate a jsonata command on given data.
     *
     * @param data The data which is used to evaluate the jsonata command.
     * @param cmd The jsonata command or an object with multiple commands.
     * @returns The result of the jsonata command. If the command is invalid or
     * the jsonata command returns undefined, an empty string is returned. If
     * an object with multiple commands is given, the result is an object with
     * the same keys as the input object, but with the results of the jsonata
     * commands as values. If an error occurs during evaluation, an error is
     * logged and an empty string is returned for the corresponding key.
     */

    /**
     * Evaluates a jsonata command on given data.
     *
     * @param data The data which is used to evaluate the jsonata command.
     * @param cmd The jsonata command or an object with multiple commands.
     * @returns The result of the jsonata command. If the command is invalid or
     * the jsonata command returns undefined, an empty string is returned. If
     * an object with multiple commands is given, the result is an object with
     * the same keys as the input object, but with the results of the jsonata
     * commands as values. If an error occurs during evaluation, an error is
     * logged and an empty string is returned for the corresponding key.
     */
    async readWithJsonata(
        data: object,
        cmd: { [key: string]: string } | string,
    ): Promise<string | { [key: string]: string }> {
        let result: any;
        if (typeof cmd === 'string') {
            if (cmd == '') {
                return '';
            }
            try {
                result = await jsonata(cmd).evaluate(data);
                if (result == undefined) {
                    return '';
                }
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
     *
     * @param states States that are to be read into the database during initialisation.
     * @returns void
     */
    async initStates(states: {
        [key: string]: {
            val: ioBroker.StateValue;
            ts: number;
            ack: boolean;
        };
    }): Promise<void> {
        if (!states) {
            return;
        }
        const removedChannels: string[] = [];
        for (const state in states) {
            const dp = state.replace(`${this.adapter.name}.${this.adapter.instance}.`, '');
            const del = !this.isDirAllowed(dp);
            if (!del) {
                const obj = await this.adapter.getObjectAsync(dp);
                if (!this.adapter.config.useJsonHistory && dp.endsWith('.warning.jsonHistory')) {
                    this.log.debug(`delete state: ${dp}`);
                    await this.adapter.delObjectAsync(dp);
                    continue;
                }
                this.setdb(
                    dp,
                    'state',
                    states[state] && states[state].val ? states[state].val : undefined,
                    obj && obj.common && obj.common.type ? obj.common.type : undefined,
                    states[state] && states[state].ack,
                    states[state] && states[state].ts ? states[state].ts : Date.now(),
                    true,
                );
            } else {
                if (!removedChannels.every(a => !dp.startsWith(a))) {
                    continue;
                }
                const channel = dp.split('.').slice(0, 4).join('.');
                removedChannels.push(channel);
                await this.adapter.delObjectAsync(channel, { recursive: true });
                this.log.debug(`Delete channel with dp:${channel}`);
            }
        }
    }

    /**
     * Resets states that have not been updated in the database in offset time.
     *
     * @param prefix String with which states begin that are reset.
     * @param offset Time in ms since last update.
     * @returns void
     */
    async garbageColleting(prefix: string, offset: number = 2000): Promise<void> {
        if (!prefix) {
            return;
        }
        if (this.stateDataBase) {
            for (const id in this.stateDataBase) {
                if (id.startsWith(prefix)) {
                    const state = this.stateDataBase[id];
                    if (!state || state.val == undefined) {
                        continue;
                    }
                    if (state.ts < Date.now() - offset) {
                        let newVal: -1 | '' | '{}' | '[]' | false | null | undefined;
                        switch (state.stateTyp) {
                            case 'string':
                                if (typeof state.val == 'string') {
                                    if (state.val.startsWith('{') && state.val.endsWith('}')) {
                                        newVal = '{}';
                                    } else if (state.val.startsWith('[') && state.val.endsWith(']')) {
                                        newVal = '[]';
                                    } else {
                                        newVal = '';
                                    }
                                } else {
                                    newVal = '';
                                }
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

    /**
     * Get the local language as a string
     * The language is determined from the admin settings and is 'en-En' if no language is set
     *
     * @returns The local language as a string
     */
    getLocalLanguage(): string {
        if (this.language) {
            return this.language;
        }
        return 'en-En';
    }
    /**
     * Return the translation of the given key
     * If no translation is found the key itself is returned
     *
     * @param key The key to translate
     * @returns The translated string
     */
    getTranslation(key: string): string {
        if (this.translation[key] !== undefined) {
            return this.translation[key];
        }
        return key;
    }
    /**
     * Checks if a translation exists for the given key.
     *
     * @param key The key to check for translation.
     * @returns True if the translation exists, otherwise false.
     */
    existTranslation(key: string): boolean {
        return this.translation[key] !== undefined;
    }

    /**
     * Return the translation of the given key for all languages
     * If no translation is found the key itself is returned
     *
     * @param key The key to translate
     * @returns The translated string or a object with the translations for all languages
     */
    async getTranslationObj(key: string): Promise<ioBroker.StringOrTranslated> {
        const language: (ioBroker.Languages | 'uk')[] = [
            'en',
            'de',
            'ru',
            'pt',
            'nl',
            'fr',
            'it',
            'es',
            'pl',
            'uk',
            'zh-cn',
        ];
        const result: { [key: string]: string } = {};
        for (const l of language) {
            try {
                const i = await import(`../../admin/i18n/${l}/translations.json`);
                if (i[key] !== undefined) {
                    result[l as string] = i[key];
                }
            } catch {
                return key;
            }
        }
        if (result.en == undefined) {
            return key;
        }
        return result as ioBroker.StringOrTranslated;
    }

    /**
     * Sets the language for all getTranslation and getTranslationObj calls.
     * If the language does not exist, it will not be changed and an error message will be logged.
     * If force is true, the language will be changed even if it is already set.
     *
     * @param language The language to set.
     * @param force Set to true to force the language to be changed.
     * @returns True if the language was changed, otherwise false.
     */
    async setLanguage(language: ioBroker.Languages | 'uk', force = false): Promise<boolean> {
        if (!language) {
            language = 'en';
        }
        if (force || this.language != language) {
            try {
                this.translation = await import(`../../admin/i18n/${language}/translations.json`);
                this.language = language;
                return true;
            } catch {
                this.log.error(`Language ${language} not exist!`);
            }
        }
        return false;
    }
    /**
     * Sorts an array of strings in an alphabetical order, ignoring case.
     *
     * @param text The array of strings to sort.
     * @returns The sorted array.
     */
    sortText(text: string[]): string[] {
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
        return text;
    }
    /**
     *
     * @param text string to replace a Date
     * @param noti appendix to translation key
     * @param day true = Mo, 12.05 - false = 12.05
     * @returns Monday first March
     */
    convertSpeakDate(text: string, noti: string = '', day = false): string {
        if (!text || typeof text !== `string`) {
            return ``;
        }
        const b = text.split(`.`);
        if (day) {
            b[0] = b[0].split(' ')[2];
        }
        return ` ${`${new Date(`${b[1]}/${b[0]}/${new Date().getFullYear()}`).toLocaleString(this.language, {
            weekday: day ? 'long' : undefined,
            day: 'numeric',
            month: `long`,
        })} `.replace(/([0-9]+\.)/gu, x => {
            const result = this.getTranslation(x + noti);
            if (result != x + noti) {
                return result;
            }
            return this.getTranslation(x);
        })}`;
    }
}

/**
 * Pauses execution for a specified amount of time.
 *
 * @param time The duration to sleep in milliseconds.
 * @returns A promise that resolves after the specified duration.
 */
export async function sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
}
