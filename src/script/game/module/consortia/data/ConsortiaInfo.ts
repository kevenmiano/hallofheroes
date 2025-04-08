// @ts-nocheck
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import {ConsortiaEvent} from "../../../constant/event/NotificationEvent";
import {ConsortiaOrderInfo} from "./ConsortiaOrderInfo";
import {ClassFactory} from "../../../../core/utils/ClassFactory";
import {ConsortiaUpgradeType} from "../../../constant/ConsortiaUpgradeType";
import { TempleteManager } from "../../../manager/TempleteManager";
import Dictionary from "../../../../core/utils/Dictionary";

/**
 * 公会数据
 * @author yuanzhan.yu
 */
export class ConsortiaInfo extends GameEventDispatcher
{
    /**
     * consortiaId
     */
    public consortiaId:number = 0;

    /**
     * consortiaName
     */
    public consortiaName:string;

    /**
     * creatorID
     */
    public creatorID:number = 0;

    /**
     * creatorName
     */
    public creatorName:string;

    private _createDate:Object;

    /**
     * chairmanID
     */
    public chairmanID:number = 0;

    /**
     * chairmanName
     */
    public chairmanName:string;

    /**
     * description  maxChars="130"
     */
    public description:string;

    /**
     * placard maxChars="250"
     */
    public placard:string;

    /**
     * groupPlacard maxChars="70"
     */
    public groupPlacard:string;

    /**
     * levels
     */
    public levels:number = 0;

    /**
     * addCount
     */
    public addCount:number = 0;

    /**
     * currentCount
     */
    public currentCount:number = 0;

    /**
     * buildPoint
     */
    private _offer: number = 0;
    /**
     * 申请过公会
     */
    public hasApplyed: boolean = false;
    
    /**
     * fightPower
     */
    public get fightPower():number
    {
        return this._fightPower;
    }

    /**
     * @private
     */
    public set fightPower(value:number)
    {
        this._fightPower = value;
    }

    public set offer(value:number)
    {
        if(this._offer != value)
        {
            this._offer = value;
            this.dispatchEvent(ConsortiaEvent.CONSORTIA_OFFER_CHANGE);
        }
        this._offer = value;
    }

    public get offer():number
    {
        return this._offer;
    }

    private _consortiaMaterials:number = 0
    public set consortiaMaterials(value:number)
    {
        if(this._consortiaMaterials != value)
        {
            this._consortiaMaterials = value;
            this.dispatchEvent(ConsortiaEvent.CONSORTIA_MATERIAL);
        }
        this._consortiaMaterials = value;
    }

    public get consortiaMaterials():number
    {
        return this._consortiaMaterials;
    }

    /**
     * honor
     */
    public honor:number = 0;

    /**
     * openApp 是否开放加入公会
     */
    public openApp:boolean;

    /**
     * renames
     */
    public renames:string;

    /**
     * kickDate
     */
    public kickDate:Object;

    /**
     * kickCount
     */
    public kickCount:number = 0;

    private _fightPower:number = 0;

    /**
     * 公会商城等级
     */
    public shopLevel:number = 0;

    /**
     * 公会保管箱等级
     */
    public storeLevel:number = 0;

    /**
     * 祭坛等级
     */
    public altarLevel:number = 0;

    /**
     * 技能塔等级
     */
    public schoolLevel:number = 0;

    /**
     * attackLevel力量
     */
    public attackLevel:number = 0;

    /**
     * defenceLevel
     */
    public defenceLevel:number = 0;

    /**
     * agilityLevel护甲
     */
    public agilityLevel:number = 0;

    /**
     * abilityLevel智力
     */
    public abilityLevel:number = 0;

    /**
     * captainLevel
     */
    public captainLevel:number = 0;

    /**
     * goldLevel
     */
    public goldLevel:number = 0;

    /**
     * physiqueLevel
     */
    public physiqueLevel:number = 0;

    /**
     * ownWildlands
     */
    public ownWildlands:number = 0;

    public isExist:boolean;

    private _deductDate:Object;

    /**
     * 警告日期
     */
    public warnDate:Date;
    /**
     * 公会招收发送的次数
     */
    public speakTimes:number = 0;

    /**
     *冷却类型
     */
    public codeType:number = 0;
    public totalOffer:number = 0;
    public quitResult:string = "";
    private _quitDate:Object;
    private _codeBeginDate:Object;
    private _currentDate:Object;
    public consortiaSkillTypeDic:Dictionary;

    /**
     *
     */
    public op:number = 0;

    /**
     * 冷却所需时间
     */
    public codeNeedDate:number = 0;
    private _isRobot:boolean = false;

    public orderInfo:ConsortiaOrderInfo;

    constructor()
    {
        super();
    }

    /**
     * 本次扣费日期
     */
    public get deductDate():Object
    {
        return this._deductDate;
    }

    /**
     * @private
     */
    public set deductDate(value:Object)
    {
        if(!value)
        {
            return;
        }
        if(value instanceof Date)
        {
            this._deductDate = value;
        }
        else
        {
            this._deductDate = ClassFactory.copyDateType(value);
        }
    }

    /**
     * createDate
     */
    public get createDate():Object
    {
        return this._createDate;
    }

    /**
     * @private
     */
    public set createDate(value:Object)
    {
        if(!value)
        {
            return;
        }
        if(value instanceof Date)
        {
            this._createDate = value;
        }
        else
        {
            this._createDate = ClassFactory.copyDateType(value);
        }
    }

    /**
     * 冷却开始时间
     */
    public get codeBeginDate():Object
    {
        return this._codeBeginDate;
    }

    /**
     * @private
     */
    public set codeBeginDate(value:Object)
    {
        if(value instanceof Date)
        {
            this._codeBeginDate = value;
        }
        else
        {
            this._codeBeginDate = ClassFactory.copyDateType(value);
        }
    }

    /**
     * 服务器当前时间
     */
    public get currentDate():Object
    {
        return this._currentDate;
    }

    /**
     * @private
     */
    public set currentDate(value:Object)
    {
        if(value instanceof Date)
        {
            this._currentDate = value;
        }
        else
        {
            this._currentDate = ClassFactory.copyDateType(value);
        }
    }

    public getLevelByUpgradeType(type:number):number
    {
        switch(type)
        {
            case ConsortiaUpgradeType.CONSORTIA:
                return this.levels;
            case ConsortiaUpgradeType.CONSORTIA_SHOP:
                return this.shopLevel;
            case ConsortiaUpgradeType.CONSORTIA_ALTAR:
                return this.altarLevel;
            case ConsortiaUpgradeType.LING_SHI:
                return this.schoolLevel;
            case ConsortiaUpgradeType.SAFE_DEPOSIT_BOX:
                return this.storeLevel;
            case ConsortiaUpgradeType.ATTACK:
                return this.attackLevel;
            case ConsortiaUpgradeType.DEFENCE:
                return this.defenceLevel;
            case ConsortiaUpgradeType.AGILITY:
                return this.agilityLevel;
            case ConsortiaUpgradeType.ABILITY:
                return this.abilityLevel;
            case ConsortiaUpgradeType.CAPTAIN:
                return this.captainLevel;
            case ConsortiaUpgradeType.GOLD:
                return this.goldLevel;
            case ConsortiaUpgradeType.PHYSIQUE:
                return this.physiqueLevel;
        }
        return 0;
    }

    public getHighLevelByUpgradeType(type:number):number{
        if(this.consortiaSkillTypeDic.has(type)){
            return this.consortiaSkillTypeDic.get(type);
        }else{
            return 0;
        }
    }

    public get quitDate():Object
    {
        return this._quitDate;
    }

    public set quitDate(value:Object)
    {
        if(!value)
        {
            return;
        }
        if(value instanceof Date)
        {
            this._quitDate = value;
        }
        else
        {
            this._quitDate = ClassFactory.copyDateType(value);
        }
    }

    public get isRobot():boolean
    {
        return this._isRobot;
    }

    public set isRobot(value:boolean)
    {
        this._isRobot = value;
    }


    //-----------------------------------------------------------------------------------
    //--------------------------选举信息-------------------------------------------------
    //-----------------------------------------------------------------------------------
    /**
     * 选举开始时间
     */
    public votingDate:Date = null;

    /**
     * 选举的当前的状态
     */
    public votingState:number = -1;

    /**
     * 投票序号
     */
    public votingId:number = -1;

    /**
     * 打到的波数
     */
    public maxMave:number = 0;

    public get SortiaMaxMembers(): number {
        let config = TempleteManager.Instance.getConfigInfoByConfigName("Consortia_Member");
        let levelAdd = 0;
        if (config) {
            let add = Number(config.ConfigValue);
            levelAdd = this.levels * add;
        }
        return 30 + levelAdd;
    }

}