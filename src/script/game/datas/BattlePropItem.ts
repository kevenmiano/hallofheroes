import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import {BattleEvent} from "../constant/event/NotificationEvent";
import ConfigMgr from "../../core/config/ConfigMgr";
import {ConfigType} from "../constant/ConfigDefine";
import {t_s_skilltemplateData} from "../config/t_s_skilltemplate";
import {t_s_itemtemplateData} from "../config/t_s_itemtemplate";

export class BattlePropItem extends GameEventDispatcher
{
    public userId:number;
    public battleId:string;
    public uItemId:number;
    private _useCount:number;
    public get useCount():number
    {
        return this._useCount;
    }

    public set useCount(value:number)
    {
        this._useCount = value;
        this.dispatchEvent(BattleEvent.PROP_USECOUNT_CHANGE, null);
    }

    public tempId:number;
    public bagPos:number;
    public skillTempId:number;
    public sonType:number;

    public getSkillTemplate():t_s_skilltemplateData
    {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this.skillTempId.toString());
    }

    public getGoodsTemplated():t_s_itemtemplateData
    {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this.tempId.toString());
    }

    public clone():BattlePropItem
    {
        var item:BattlePropItem = new BattlePropItem();
        item.userId = this.userId;
        item.battleId = this.battleId;
        item.uItemId = this.uItemId;
        item.useCount = this.useCount;
        item.tempId = this.tempId;
        item.bagPos = this.bagPos;
        item.skillTempId = this.skillTempId;
        item.sonType = this.sonType;
        return item;
    }
}