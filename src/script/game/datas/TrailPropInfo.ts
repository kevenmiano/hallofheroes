import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import {BattleEvent} from "../constant/event/NotificationEvent";
import {t_s_skilltemplateData} from "../config/t_s_skilltemplate";
import ConfigMgr from "../../core/config/ConfigMgr";
import {ConfigType} from "../constant/ConfigDefine";
import Logger from "../../core/logger/Logger";

export class TrailPropInfo extends GameEventDispatcher
{
    public index:number = 0;
    public id:number = 0;
    private _useCount:number = 0;//使用次数
    public currentCount:number = 0;//剩余购买次数
    public maxCount:number;//最大购买次数
    public cost:number;//购买该道具的花费
    public coolDown:number;//冷却时间
    constructor()
    {
        super();
    }

    public get useCount():number
    {
        return this._useCount;
    }

    public set useCount(value:number)
    {
        var isIncrest:boolean = this._useCount < value;
        this._useCount = value;
        Logger.xjy("掉落数量事件:" + isIncrest);
        this.dispatchEvent(BattleEvent.TRAIL_USECOUNT_CHANGE, isIncrest);
    }

    public get skillTemp():t_s_skilltemplateData
    {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this.id.toString());
    }
}