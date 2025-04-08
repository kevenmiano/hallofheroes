// @ts-nocheck
import {PackageIn} from "../../../core/net/PackageIn";
import {SocketSendManager} from "../../manager/SocketSendManager";
import {DialogAction} from "./DialogAction";

/**
 * 战斗场景对话动作
 * @author yuanzhan.yu
 */
export class BattleDialogAction extends DialogAction
{
    constructor($pkg:PackageIn)
    {
        super($pkg);
    }

    protected actionOver()
    {
        super.actionOver();
        SocketSendManager.Instance.sendBattlePlotComplete();
    }
}