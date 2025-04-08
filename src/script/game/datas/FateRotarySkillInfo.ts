import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import {FateGuardEvent} from "../constant/event/NotificationEvent";
import {t_s_skilltemplateData} from "../config/t_s_skilltemplate";
import ConfigMgr from "../../core/config/ConfigMgr";
import {ConfigType} from "../constant/ConfigDefine";
import {t_s_upgradetemplateData} from "../config/t_s_upgradetemplate";
import {TempleteManager} from "../manager/TempleteManager";
import {UpgradeType} from "../constant/UpgradeType";

export class FateRotarySkillInfo extends GameEventDispatcher
{
    private _templateId:number;
    public fateTypes:number;
    private _grades:number;
    private _totalGp:number;//总经验
    public property1:string;
    public property2:string;

    constructor()
    {
        super();
    }

    public get totalGp():number
    {
        return this._totalGp;
    }

    public set totalGp(value:number)
    {
        this._totalGp = value;
        this.dispatchEvent(FateGuardEvent.FATE_GUARD_GP);
    }

    public get grades():number
    {
        return this._grades;
    }

    public set grades(value:number)
    {
        this._grades = value;
    }

    public get templateId():number
    {
        return this._templateId;
    }

    public set templateId(value:number)
    {
        this._templateId = value;
    }

    public get template():t_s_skilltemplateData
    {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this._templateId.toString());
    }

    public get nextUpgradeTemp():t_s_upgradetemplateData
    {
        var upgradeTemp:t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevel(this.grades + 1, UpgradeType.UPGRADE_TYPE_FATE_GUARD);
        return upgradeTemp;
    }

    public get currentGp():number
    {
        var current:number = this._totalGp;
        var upgradeList:any[] = TempleteManager.Instance.getTemplatesByType(UpgradeType.UPGRADE_TYPE_FATE_GUARD);
        // upgradeList.sortOn("TemplateId", Array.NUMERIC);
        var len:number = upgradeList.length;
        var upgradeTemp:t_s_upgradetemplateData;
        for(var i:number = 0; i < len; i++)
        {
            upgradeTemp = upgradeList[i];
            if(current >= upgradeTemp.Data)
            {
                current -= upgradeTemp.Data;
            }
            else
            {
                return current;
            }
        }
        return 0;
    }

}