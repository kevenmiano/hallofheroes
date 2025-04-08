import {PackageIn} from "../../../core/net/PackageIn";
import {ISocketTransaction} from "../../interfaces/ISocketTransaction";

export class TransactionBase implements ISocketTransaction
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
        this._pkg = param as PackageIn;
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