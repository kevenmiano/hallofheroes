export class MultipleDictionaryInfo
{
    private _data:Array<Map<string, string>>;

    constructor()
    {
        this._data = [];
    }

    public addItem(key:string, value:string)
    {
        let dic:Map<string, string> = new Map();
        dic.set(key, value);
        this._data.push(dic);
    }

    public addItemAt(key:string, value:string, index:number = 0)
    {
        let dic:Map<string, string> = new Map();
        dic.set(key, value);
        this._data.unshift(dic);
    }

    public get data():Array<Map<string, string>>
    {
        return this._data;
    }
}
