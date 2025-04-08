// @ts-nocheck
export class DictionaryEvent {
    public static PREADD: string = "preaddDictionary";
    public static PREUPDATE: string = "preupdateDictionary";
    public static PREDELETE: string = "predeleteDictionary";
    public static PRECLEAR: string = "preclearDictionary";
    public static ADD: string = "addDictionary";
    public static UPDATE: string = "updateDictionary";
    public static DELETE: string = "deleteDictionary";
    public static CLEAR: string = "clearDictionary";

    private _oldData: any;
    private _newData: any;
    private _key: string;

    public get oldData(): any {
        return this._oldData;
    }

    public get newData(): any {
        return this._newData;
    }

    public get key(): string {
        return this._key;
    }

    constructor(type: string, $newData: any = null, $oldData: any = null, key: string = "") {
        // super(type)
        this._newData = $newData;
        this._oldData = $oldData;
        this._key = key;
    }

}