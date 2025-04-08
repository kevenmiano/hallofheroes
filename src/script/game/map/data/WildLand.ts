import {MapPhysics} from "../space/data/MapPhysics";
import {SystemArmy} from "../space/data/SystemArmy";
import {t_s_mapphysicstemplateData} from "../../config/t_s_mapphysicstemplate";
import ConfigMgr from "../../../core/config/ConfigMgr";
import {ConfigType} from "../../constant/ConfigDefine";
import { OuterCityModel } from "../outercity/OuterCityModel";
import { PosType } from "../space/constant/PosType";
import { t_s_mapphysicpositionData } from "../../config/t_s_mapphysicposition";
import OutCityMineNode from "../outercity/OutCityMineNode";
import OutCityOneMineInfo from "../outercity/OutCityOneMineInfo";
import VehiclePlayerInfo from "./VehiclePlayerInfo";

/**
 * @description    野矿对应的数据模型    外城中的元素, 可以占领
 * @author yuanzhan.yu
 * @date 2021/11/15 21:05
 * @ver 1.0
 */
export class WildLand extends MapPhysics
{
    constructor()
    {
        super();
    }

    public createDate:Date;
    public refreshTime:number;
    
    public loadTime:number;
    private _templateId:number;
    public allNodeInfo:Array<OutCityMineNode> = [];//金矿数据,只有是金矿节点才有这个数据
	public selfOccpuyArr:Array<OutCityOneMineInfo> = [];//个人在当前节点下占领的所有三级节点
    private _tempInfo:t_s_mapphysicpositionData;
    protected _ownSysArmy:SystemArmy; // 当前系统部队
    
    public curArmyId:any[];//
    private _types:number = 0;

    public leftTime:number = 0;//物资车距离终点的时间(秒)
    public status:number = 0;
    public pushPlayer:Array<VehiclePlayerInfo> = [];//推进人员
    public protectPlayer:Array<VehiclePlayerInfo> = [];//护卫人员
    public protectStatus:number = 0;//护送队伍状态 0正常状态 1战斗中
    public pushStatus:number = 0;//推进队伍状态 0正常状态 1战斗中
    public fightUserIdArray:Array<string> = [];
    public nodeId:number = 0;
    public targetPosX:number = 0;
    public targetPosY:number = 0;
    public movePosX:number = 0;
    public movePosY:number = 0;
    public speed:number = 1;
    /**
     *boss名
     */
     public bossName:string;
     /**
      *boss等级
      */
     public grade:number;
     /**
      *boss状态(0已消失, 1存在, 4战斗中)
      */
     public bossStatus:number;

     
    public get types():number{
        return this._types;
    }
    public set types(value:number){
        this._types = value;
    }

    public get tempInfo():t_s_mapphysicpositionData
    {
        return this._tempInfo;
    }
    
    public get templateId():number
    {
        return this._templateId;
    }

    public set templateId(value:number)
    {
        this._templateId = value;
        this._tempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapphysicposition, this._templateId.toString()) as t_s_mapphysicpositionData;
    }

    /**
     * 占领的领主
     * @return
     *
     */
    public get ownSysArmy():SystemArmy
    {
        return this._ownSysArmy;
    }

    public set ownSysArmy(value:SystemArmy)
    {
        if(!this._ownSysArmy)
        {
            this._ownSysArmy = value;
        }
    }
}