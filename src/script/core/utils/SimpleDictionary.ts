import Dictionary from "./Dictionary";
import GameEventDispatcher from '../event/GameEventDispatcher';

export class SimpleDictionary extends Dictionary {
    /**
     * 不记录进keys的属性值
     */
    private __dispatcher: GameEventDispatcher;
    private __list: any[];

    constructor() {
        super();
        this.__dispatcher = new GameEventDispatcher();
        this.__list = [];
    }

    public get keys(): any[] {
        let temp: any[] = [];

        for (let key in this) {
            if (!key.startsWith("__")) {
                temp.push(key);
            }
        }

        return temp;
    }

    private setValue(key: any, data: Object) {
        if (this[key]) {
            this.__dispatcher.dispatchEvent(DictionaryEvent.PREUPDATE, [data, this[key], key]);//参数为newData,oldData,key
            this.updateInArray(this[key], data);
            this[key] = data;
            this.__dispatcher.dispatchEvent(DictionaryEvent.UPDATE, [data, this[key], key]);//参数为newData,oldData,key
        }
        else {
            this.__dispatcher.dispatchEvent(DictionaryEvent.PREADD, [data, this[key], key]);//参数为newData,oldData,key
            this.addInArray(data);
            this[key] = data;
            this.__dispatcher.dispatchEvent(DictionaryEvent.ADD, [data, this[key], key]);//参数为newData,oldData,key
        }
    }

    private addInArray(obj: Object) {
        this.__list.push(obj);
    }

    private updateInArray(oldObj: Object, newObj: Object) {
        let index: number = this.__list.indexOf(oldObj);
        if (index > -1) {
            this.__list.splice(index, 1, newObj);
        }
    }

    private delInArray(obj: Object) {
        let index: number = this.__list.indexOf(obj);
        if (index > -1) {
            this.__list.splice(index, 1);
        }
    }

    private delValue(key: any) {
        if (this[key]) {
            let old: Object = this[key];
            this.__dispatcher.dispatchEvent(DictionaryEvent.PREDELETE, [null, old, key]);//参数为newData,oldData,key
            this.delInArray(old);
            delete this[key];
            this.__dispatcher.dispatchEvent(DictionaryEvent.DELETE, [null, old, key]);//参数为newData,oldData,key
            old = null;
        }
    }

    private checkToAddOrUpdate(key: any, data: Object): boolean {
        if (data == null) {
            this.delValue(key);
            return false;
        }

        return true;
    }

    public add(key: any, data: Object) {
        if (this.checkToAddOrUpdate(key, data)) {
            this.setValue(key, data);
        }
    }

    public update(key: any, data: Object) {
        if (this.checkToAddOrUpdate(key, data)) {
            this.setValue(key, data);
        }
    }

    public del(key: any) {
        this.delValue(key);
    }

    public clear() {
        this.__dispatcher.dispatchEvent(DictionaryEvent.PRECLEAR);
        let temp: any[] = this.keys;

        for (const s of temp) {
            delete this[s];
        }

        this.__list = [];
        this.__dispatcher.dispatchEvent(DictionaryEvent.CLEAR);
    }

    public setDictionary(dic: SimpleDictionary) {
        this.clear();
        for (let i in dic) {
            this.add(i, dic[i]);
        }
    }

    /* 返回一个键/值对的数组,使用key 和 value访问 */
    public slice(startIndex: number = 0, endIndex: number = 166777215): any[] {
        let sliced: any[] = this.keys.slice(startIndex, endIndex);
        let returnArray: any[] = [];

        for (let i: number = 0; i < sliced.length; i++) {
            let obj: Object = {};

            obj["key"] = sliced[i];
            obj["value"] = this[sliced[i]];

            returnArray.push(obj);

            this.delInArray(this[sliced[i]]);
            delete this[sliced[i]];
        }

        return returnArray;
    }

    /* 返回一个键/值对的数组,使用key 和 value访问 */
    public splice(startIndex: number, deleteCount: number): any[] {
        let spliced: any[] = this.keys.splice(startIndex, deleteCount);

        let returnArray: any[] = [];

        for (let i: number = 0; i < spliced.length; i++) {
            let obj: Object = {};

            obj["key"] = spliced[i];
            obj["value"] = this[spliced[i]];

            returnArray.push(obj);
            this.delInArray(this[spliced[i]]);
            delete this[spliced[i]];
        }

        return returnArray;
    }

    public getList(): any[] {
        return this.__list;
    }

    public setList(list: any[]) {
        this.__list = list;
    }

    public dispatchEvent(event: DictionaryEvent) {
        this.__dispatcher.dispatchEvent(event);
    }

    public addEventListener(type: string, listener: Function, target: Object) {
        this.__dispatcher.addEventListener(type, listener, target);
    }

    public removeEventListener(type: string, listener: Function, target: Object) {
        this.__dispatcher.removeEventListener(type, listener, target);
    }

    public static Copy(data: SimpleDictionary) {
        let list = data.getList().concat();
        let copy = new SimpleDictionary();
        copy.setList(list);
        return copy
    }
    
}


enum DictionaryEvent {
    PREADD = "preaddDictionary",
    PREUPDATE = "preupdateDictionary",
    PREDELETE = "predeleteDictionary",
    PRECLEAR = "preclearDictionary",
    ADD = "addDictionary",
    UPDATE = "updateDictionary",
    DELETE = "deleteDictionary",
    CLEAR = "clearDictionary"
}