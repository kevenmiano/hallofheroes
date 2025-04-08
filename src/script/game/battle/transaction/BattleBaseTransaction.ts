// @ts-nocheck
import {PackageIn} from "../../../core/net/PackageIn";
import {ISocketTransaction} from "../../interfaces/ISocketTransaction";


export class BattleBaseTransaction implements ISocketTransaction
{
    protected _pkg:PackageIn;

    constructor()
    {

    }

    public disposeWhenComplete():boolean
    {
        return false;
    }

    public isHandleInQueue():boolean
    {
        return false;
    }

    public getCode():number
    {
        throw new Error("getCode()");
        return 0;
    }

    public handlePackage()
    {
    }

    public execute(param:Object = null)
    {
    }

    public configure(param:Object)
    {
        if(this._pkg)
        {
            this._pkg = null;
        }
        this._pkg = <PackageIn>param;
    }

    public finish()
    {
    }

    public get isFinished():boolean
    {
        return false;
    }

    public dispose()
    {
    }
}