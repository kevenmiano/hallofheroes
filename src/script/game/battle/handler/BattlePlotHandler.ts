// @ts-nocheck
import {IEnterFrame} from "../../interfaces/IEnterFrame";
import {IAction} from "../../interfaces/IAction";
import {PackageIn} from "../../../core/net/PackageIn";
import {BattleModel} from "../BattleModel";
import {BattleManager} from "../BattleManager";
import {EnterFrameManager} from "../../manager/EnterFrameManager";
import {BattleDialogAction} from "../actions/BattleDialogAction";

/**
 * 战斗情节处理
 * @author yuanzhan.yu
 */
export class BattlePlotHandler implements IEnterFrame
{
    private _actions:IAction[];
    private _current:IAction;
    private _checking:boolean;

    constructor()
    {
        this._actions = [];
    }

    public handler(pkg:PackageIn)
    {
        // TODO by jeremy.xu  战斗中剧情结束开始战斗  先直接跳过剧情
        // SocketSendManager.Instance.sendBattlePlotComplete()

        this._actions.push(new BattleDialogAction(pkg));
    }

    public enterFrame()
    {
        if(!this._current)
        {
            if(this._actions.length > 0)
            {
                if(!this._checking)
                {
                    Laya.timer.once(100, this, this.checkEnd);
                    this._checking = true;
                }
            }
        }
        if(this._current)
        {
            if(this._current.finished)
            {
                this._current.dispose();
                this._current = null;
            }
            else
            {
                this._current.update();
            }
        }
    }

    private checkEnd()
    {
        var model:BattleModel = BattleManager.Instance.battleModel;
        if(!model)
        {
            this._checking = false;
            this.inactive();
            return;
        }
        if(model.isRolesStatic())
        {
            this._current = this._actions.shift();
            this._current.prepare();
        }
        this._checking = false;
    }

    public activate()
    {
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    public inactive()
    {
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
}