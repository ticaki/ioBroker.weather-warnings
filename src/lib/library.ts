import { WeatherWarnings } from '../main';
import jsonata from 'jsonata';
import { statesObjectsWarningsType } from './def/dwd';
type LibraryStateVal = LibraryStateValJson | undefined;
type LibraryStateValJson = {
    type: ioBroker.ObjectType;
    val: ioBroker.StateValue | undefined;
    ts: number;
    ack: boolean;
};

/**
 * Generic state handle class dont insert adapter code here
 */
export class BaseClass {
    unload: boolean = false;
    log: CustomLog;
    adapter: WeatherWarnings;
    name: string = ``;
    constructor(adapter: WeatherWarnings, name: string = '') {
        this.name = name;
        this.log = new CustomLog(adapter, this.name);
        this.adapter = adapter;
    }
    delete(): void {
        this.unload = true;
    }
}
class CustomLog {
    #adapter: WeatherWarnings;
    #prefix: string;
    constructor(adapter: WeatherWarnings, text: string = '') {
        this.#adapter = adapter;
        this.#prefix = text;
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
    tempdb: any = {};
    constructor(adapter: WeatherWarnings, _options: any = null) {
        super(adapter, 'library');
        this.stateDataBase = {};
    }

    async writeJson(
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

        if (typeof data === 'object') {
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

                        await this.writeJson(dp, `${objNode}`, def, data[k], expandTree);
                    }
                } else {
                    this.writeJson(prefix, objNode, def, JSON.stringify(data) || '[]', expandTree);
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
                    await this.writeJson(`${prefix}.${k}`, `${objNode}.${k}`, def, data[k], expandTree);
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
    async getObjectDefFromJson(key: string, data: any): Promise<ioBroker.Object | null> {
        let result = await jsonata(`${key}`).evaluate(data);
        if (result === null) {
            result = await jsonata(`noService.default`).evaluate(data);
        }
        return this.cloneObject(result);
    }

    getChannelObject(def: ioBroker.Object): ioBroker.Object {
        const result: ioBroker.Object = {
            _id: def._id,
            type: def.type != 'device' ? 'channel' : 'device',
            common: {
                name: (def.common && def.common.name) || 'no definition',
                description: (def.common && def.common.description) || '',
            },
            native: def.native || {},
        };
        return result;
    }

    async writedp(dp: string, val: ioBroker.StateValue, obj: ioBroker.Object): Promise<void> {
        dp = this.cleandp(dp);
        /*if (![dp]) {
            // schreibe daten irgendwo hin um definitionen zu erzeugen
            this.tempdb[dp] = {
                type: val != undefined ? 'state' : 'channel',
                common: {
                    type: val != undefined ? typeof val : undefined,
                    role: val != undefined ? 'value' : undefined,
                    read: true,
                    write: false,
                },
                nativ: {},
            };
        }*/
        let node = this.readdp(dp);
        if (node === undefined) {
            obj._id = `${this.adapter.name}.${this.adapter.instance}.${dp}`;
            await this.adapter.setObjectNotExistsAsync(dp, obj);
            node = this.setdb(dp, obj.type, undefined, true);
        }

        if (obj.type !== 'state') return;

        //if (node && ( || !node.ack) && obj.type === 'state') {
        await this.adapter.setStateAsync(dp, { val: val, ts: Date.now(), ack: true });
        //}
    }
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
        ack: boolean = true,
    ): LibraryStateVal {
        this.stateDataBase[dp] = { type: type, val: val, ack: ack, ts: Date.now() };
        return this.stateDataBase[dp];
    }
    cloneObject(obj: ioBroker.Object): ioBroker.Object {
        if (typeof obj !== 'object') {
            this.log.error(`Error clone object target is type: ${typeof obj}`);
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }
    readdp(dp: string): LibraryStateVal {
        return this.stateDataBase[this.cleandp(dp)];
    }
}
