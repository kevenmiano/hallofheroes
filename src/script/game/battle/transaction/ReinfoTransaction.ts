import {S2CProtocol} from "../../constant/protocol/S2CProtocol";
import {TransactionBase} from "./TransactionBase";
import {ReinforceHandler} from "../handler/ReinforceHandler";
import {IPackageHandler} from "../handler/IPackageHandler";
import Logger from "../../../core/logger/Logger";

/**
 * @author yuanzhan.yu
 */
export class ReinfoTransaction extends TransactionBase
{
    constructor()
    {
        super();
    }

    public configure(param:Object)
    {
        super.configure(param);
        var handler:IPackageHandler = new ReinforceHandler();
        handler.handle(this._pkg);
    }

    public getCode():number
    {
        return S2CProtocol.U_B_USER_REINFORCE;
    }

    public handlePackage()
    {

    }

}