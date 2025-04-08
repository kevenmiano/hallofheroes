import {PackageIn} from "../../../core/net/PackageIn";
import {NotificationManager} from "../../manager/NotificationManager";
import {TransactionBase} from "./TransactionBase";
import {S2CProtocol} from '../../constant/protocol/S2CProtocol';

/**
 *  剧情事务
 */
export class DialogTransation extends TransactionBase
{
    constructor()
    {
        super();
    }

    public handlePackage()
    {
        this.pkg.position = PackageIn.HEADER_SIZE;
        NotificationManager.Instance.sendNotification(S2CProtocol.U_C_GAME_PLOT.toString(), this.pkg);

    }

    get pkg():PackageIn
    {
        return this._pkg;
    }

    public getCode():number
    {
        return S2CProtocol.U_C_GAME_PLOT;
    }
}