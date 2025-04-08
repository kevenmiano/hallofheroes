// @ts-nocheck
/**
 * @author yuanzhan.yu
 */
export class ConsortiaActivityInfo
{

    private _id:number;              //活动ID
    private _promptTxt:string = ""        //提示文字
    private _isOpen:boolean;         //活动是否是开放的
    private _gotoFunction:Function;  //大的图标按钮方法
    private _operatingFun:Function;  //右上角小的按钮方法
    private _btnLabel:string;        //按钮文字
    private _isEnabled:boolean = true;//操作按钮是否置灰
    private _type:number;


    constructor()
    {
    }

    public get id():number
    {
        return this._id;
    }

    public set id(value:number)
    {
        this._id = value;
    }

    public get promptTxt():string
    {
        return this._promptTxt;
    }

    public set promptTxt(value:string)
    {
        this._promptTxt = value;
    }

    public get isOpen():boolean
    {
        return this._isOpen;
    }

    public set isOpen(value:boolean)
    {
        this._isOpen = value;
    }

    public get gotoFunction():Function
    {
        return this._gotoFunction;
    }

    public set gotoFunction(value:Function)
    {
        this._gotoFunction = value;
    }

    public get operatingFun():Function
    {
        return this._operatingFun;
    }

    public set operatingFun(value:Function)
    {
        this._operatingFun = value;
    }

    public get btnLabel():string
    {
        return this._btnLabel;
    }

    public set btnLabel(value:string)
    {
        this._btnLabel = value;
    }

    public get isEnabled():boolean
    {
        return this._isEnabled;
    }

    public set isEnabled(value:boolean)
    {
        this._isEnabled = value;
    }

    public get type():number
    {
        return this._type;
    }

    public set type(value:number)
    {
        this._type = value;
    }

}