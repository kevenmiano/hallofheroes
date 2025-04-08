import { SimplePlayerInfo } from "./SimplePlayerInfo";
import ByteArray from "../../../core/net/ByteArray";
import { BagEvent, ConsortiaEvent } from "../../constant/event/NotificationEvent";
import { ConsortiaUpgradeType } from "../../constant/ConsortiaUpgradeType";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import MonthCardInfo from '../../module/welfare/data/MonthCardInfo';
import { t_s_consortialevelData } from "../../config/t_s_consortialevel";
import ConfigInfosTempInfo from "../ConfigInfosTempInfo";
import { GlobalConfig } from "../../constant/GlobalConfig";
import SDKManager from "../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../core/thirdlib/RptEvent";
import { ArmyManager } from "../../manager/ArmyManager";
import Logger from "../../../core/logger/Logger";
import { SharedManager } from "../../manager/SharedManager";
import { LoginWay } from "../../constant/LoginWay";
import Dictionary from "../../../core/utils/Dictionary";
import ConfigInfoManager from "../../manager/ConfigInfoManager";

export class PlayerInfo extends SimplePlayerInfo {
    protected static TIMEBOX_UPDATE: string = "TIMEBOX_UPDATE";
    protected static RELOGINPROCESS_UPDATE: string = "RELOGINPROCESS_UPDATE";
    protected static SEMINARY_EFFECT: string = "SEMINARY_EFFECT";
    protected static BAG_CAPICITY: string = "BAG_CAPICITY";
    protected static STAR_FREECOUNT: string = "STAR_FREECOUNT";
    protected static STARBAG_CAPICITY: string = "STARBAG_CAPICITY";
    protected static RUNE_GEM_BAG_CAPICITY: string = "RUNE_GEM_BAG_CAPICITY";
    protected static PET_BAG_CAPICITY: string = "PET_BAG_CAPICITY";
    protected static RUNE_GEM_ENERGY: string = "RUNE_GEM_ENERGY";
    protected static STAR_POINT: string = "STAR_POINT";
    protected static SIGNSITE_CHANGE: string = "SIGNSITE_CHANGE";
    protected static REISSUENUM_CHANGE: string = "REISSUENUM_CHANGE";
    protected static REWARDSTATE_CHANGE: string = "REWARDSTATE_CHANGE";
    protected static MONTH_CARD_CHANGE: string = "MONTH_CARD_CHANGE";
    protected static COMPOSE_LIST: string = "COMPOSE_LIST";
    protected static POINT: string = "POINT";
    protected static WEARY: string = "WEARY";
    protected static FIRSTCHARGE: string = "FIRSTCHARGE";
    protected static KINGBUFF: string = "KINGBUFF";
    protected static WORLDPROSPERITY: string = "WORLDPROSPERITY";
    protected static GVGISOPEN: string = "GVGISOPEN";
    protected static MINERAL: string = "MINERAL";
    protected static WORLDBOSSSTATE: string = "WORLDBOSSSTATE";
    protected static ISPVPSTART: string = "ISPVPSTART";
    protected static PVP_WAR_COUNT: string = "PVP_WAR_COUNT";
    protected static ISVEHICLESTART: string = "ISVEHICLESTART";
    protected static VEHICLE_GP: string = "VEHICLE_GP";
    protected static VEHICLE_SCORE: string = "VEHICLE_SCORE";
    protected static VEHICLE_LIST: string = "VEHICLE_LIST";
    protected static GROWTHFUND: string = "GROWTHFUND";
    protected static CHALLREWARD: string = "CHALLREWARD";
    protected static LAST_FREESKILL_LEARN_TIME: string = "LAST_FREESKILL_LEARN_TIME";
    public static get WEARY_MAX(): number {
        let cost: number = 200;
        let temp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("Player_weary");
        if (temp) {
            cost = parseInt(temp.ConfigValue);
        }
        return cost;
    }
    public static get WEARY_GET_MAX(): number {
        let cost: number = 600;
        let temp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("Weary_Limit");
        if (temp) {
            cost = parseInt(temp.ConfigValue);
        }
        return cost;
    }
    public static VOCATION_LEVEL_MAX: number = 8;

    public site: string = "";
    private _campaignSite: string;
    private _questSite: ByteArray = new ByteArray();//任务标志位
    private _point: number = 0;//钻石
    public giftToken: number = 0;//礼金
    public youmeToken: string = '';//游密token
    public lastAward: Date;//每日领取
    public renames: boolean = false;
    public crystals: number = 0;
    public resourceMax: number = 0;
    public trialCount: number = 0;//试练副本进入次数
    public maxTrialCount: number = 0;//试练副本最大进入次数
    private _tailaCount: number = 0;
    public get tailaCount(): number {//泰拉神庙周副本剩余次数
        return this._tailaCount;
    }

    public set tailaCount(value: number) {
        if (this._tailaCount != value) {
            this._changeObj[SimplePlayerInfo.TAILA_COUNT] = true;
            this._tailaCount = value;
        }
    }
    public tailaMaxCount: number = 0;//泰拉神庙周副本最大收益次数
    public castleOrder: number = 0;
    private _weary: number = 0;//体力
    public wearyLimit: number = 0;//使用体力药水已恢复的体力
    public refuseFriend: boolean = false;  //是否拒绝添加好友
    public refuseInvite: boolean = false; //拒绝房间邀请
    public refuseTeamInvite: boolean = false; //拒绝组队邀请
    public refuseLookInfo: boolean = false; //拒绝被查看信息
    public refuseConsortiaInvite: boolean = false; // 是否拒绝公会邀请
    public refuseFamInvite: boolean = false; // 是否拒绝切磋
    public showVersion: boolean = false;//是否需要请求更新公告
    public showStory: boolean = false;//开心时报是否有更新
    public showStoryModule: number = 0;//开心时报更新的模块
    public _isChallReward: boolean = false;//是否有单人竞技排行奖励
    public challRewardLastRank: number = 0;//上次单人竞技排行排名
    private _isGetKingBuffer: boolean = false;//是否领取了专属Buff
    public canAcceptCrossScoreAward: boolean = false;//是否有跨服积分奖励
    public crossScore: number = 0; //跨服积分
    public isReceived: boolean = false; //本周是否分配过公会宝箱
    public mineral: number = 0; //紫晶积分
    public isBackPlayer: boolean = false; //是否为老玩家回归对象
    public canAcceptPetChallDayReward: boolean = false;//是否有领奖（英灵竞技每日奖励）
    public canAcceptPetChallWeekReward: boolean = false;//是否有领奖（英灵竞技每周奖励）
    private _hasBuyGrowthFund: boolean = false;//是否购买了成长基金
    public isOpenTopTool: boolean = false;
    public isTargetOpen: boolean = false;//七日目标是否开启 true 开启 false 关闭
    public isSignOpen: boolean = false;//七日登录是否开启 true 开启 false 关闭
    private _isPassOpen: boolean = false;//通行证是否开启 true 开启 false 关闭
    public selfConsortiaSkillTypeDic:Dictionary;
    public set isPassOpen(b: boolean) {
        this._isPassOpen = b
    }
    public get isPassOpen(): boolean {
        let temp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("passcheck_open_time");
        if (temp) {
            let str = temp.ConfigValue;
            let arr: any[] = str.split(",");
            let registerDay = arr[0]
            let openLevel = arr[1]
            // TODO 注册天数判断
            // if (registerDay) {
            //     return false;
            // }
            if (openLevel && ArmyManager.Instance.thane.grades < openLevel) {
                Logger.info("玩家等级未达到通行证开启等级", openLevel)
                return false;
            }
        }

        return this._isPassOpen
    }
    public isOpenPushMsg: boolean = false;//消息推送是否开启
    public pushFarm: boolean = false;//
    public pushBuildingOrder: boolean = false;
    public pushTempleReward: boolean = false;
    public pushGuildTree: boolean = false;
    public pushGuildWar: boolean = false;
    public pushWorldBoss: boolean = false;
    public pushMultiCamp: boolean = false;
    public isOpenSettingType5: boolean = true;
    public isOpenSettingType6: boolean = true;
    public isOpenSettingType7: boolean = true;
    public isOpenSettingType8: boolean = true;
    public isOpenSettingType9: boolean = true;
    public isOpenSettingType10: boolean = true;
    public isOpenSettingType11: boolean = true;//队内快捷设置
    public isOpenSettingType12: boolean = true;//全局快捷设置
    public teamQChat: string = '';//队内快捷设置
    public battleQChat: string = '';//全局快捷设置
    public chatTranslateKey = "en";//聊天翻译目标语言
    private _todayHasClickGrowthFund: boolean = false;//当天是否点击了成长基金标签页
    public isShowOpenAll: boolean = false;
    public isSkillEditOpen: boolean = false; //战斗编辑是否开启
    /**
     * 命运轮盘次数
     */
    public faterotaryCount: number = 0;
    private _warFieldCount: number = 0;

    private _vehicleGp: number = 0;
    private _vehicleScore: number = 0;
    private _vehicleList: any[] = [];

    public diamondIndex: number = 0;//符文钻石培养次数
    public isFirstSeminary: boolean = true;//是否第一次进入神学院
    public isOpenPvpWar: boolean = false;//是否开放了战场
    public isOpenCrossMutiCampaign: boolean = false;//是否开放了跨服多人本
    public isOpenCrossMutiCampaign2: boolean = false;//是否开放了跨服多人本总开关
    public treasureState: number = 0;//宝藏矿脉的状态
    public petEquipStrengNum: number = 0;//英灵装备强化道具数量

    public addGuildCount: number = 0; //加入公会的次数
    public outyardCostEnergy: number = 0;//公会战个人本周消耗的行动力
    public consortiaScoreRank: number = 0;//当日公会总积分排名
    public hasClickFirstCharge: boolean = false;//是否点击了首充

    public userBindState: number = -1;//-1:不能领取 -2: 领取过了  1:领取成功
    public isBindReward: boolean = true;//升级帐号奖励是否已领取
    /**
     * 进入跨服战场的剩余次数
     * @return
     *
     */
    public get warFieldCount(): number {
        return this._warFieldCount;
    }

    public set warFieldCount(value: number) {

        if (this._warFieldCount != value) {
            this._warFieldCount = value;
            this._changeObj[PlayerInfo.PVP_WAR_COUNT] = true;
        }
    }

    /**
     * 是否领取了专属Buff
     * @return
     *
     */
    public get isGetKingBuffer(): boolean {
        return this._isGetKingBuffer;
    }

    public set isGetKingBuffer(value: boolean) {
        if (this._isGetKingBuffer != value) {
            this._isGetKingBuffer = value;
            this._changeObj[PlayerInfo.KINGBUFF] = true;
        }
    }

    public get hasBuyGrowthFund(): boolean {
        return this._hasBuyGrowthFund;
    }

    public set hasBuyGrowthFund(value: boolean) {
        if (this._hasBuyGrowthFund != value) {
            this._hasBuyGrowthFund = value;
            this._changeObj[PlayerInfo.GROWTHFUND] = true;
        }
    }

    public get todayHasClickGrowthFund(): boolean {
        return this._todayHasClickGrowthFund;
    }

    public set todayHasClickGrowthFund(value: boolean) {
        if (this._todayHasClickGrowthFund != value) {
            this._todayHasClickGrowthFund = value;
            this._changeObj[PlayerInfo.GROWTHFUND] = true;
        }
    }

    /**
     * 首次充值
     */
    private _isFirstCharge: boolean = false;
    public get isFirstCharge(): boolean {
        return this._isFirstCharge;
    }

    public set isFirstCharge(value: boolean) {
        if (this._isFirstCharge != value) {
            this._isFirstCharge = value;
            this._changeObj[PlayerInfo.FIRSTCHARGE] = true;
        }
    }

    /****************************************
     *         公会信息
     * *************************************/
    private _consortiaPower: number = 0;

    public get weary(): number {
        return this._weary;
    }

    public set weary(value: number) {
        if (this._weary != value) {
            this._weary = value;
            this._changeObj[PlayerInfo.WEARY] = true;
        }
    }

    public get point(): number {
        return this._point;
    }

    public set point(value: number) {
        if (this._point != value) {
            this._point = value;
            this._changeObj[PlayerInfo.POINT] = true;
        }
    }

    /**
     * 钻石和绑定钻石之和
     * @return 钻石和绑定钻石之和
     *
     */
    public get allPoint(): number {
        return this.point + this.giftToken;
    }

    public get consortiaPower(): number {
        return this._consortiaPower;
    }

    public set consortiaPower(value: number) {
        if (this._consortiaPower == value) {
            return;
        }
        this._consortiaPower = value;
        this.updateConstiaStudy(value, ConsortiaUpgradeType.ATTACK);
    }

    public consortiaDefence: number = 0;
    private _consortiaAgility: number = 0;
    public get consortiaAgility(): number {
        return this._consortiaAgility;
    }

    public set consortiaAgility(value: number) {
        if (this._consortiaAgility == value) {
            return;
        }
        this._consortiaAgility = value;
        this.updateConstiaStudy(value, ConsortiaUpgradeType.AGILITY);
    }

    private _consortiaIntellect: number = 0;
    public get consortiaIntellect(): number {
        return this._consortiaIntellect;
    }

    public set consortiaIntellect(value: number) {
        if (this._consortiaIntellect == value) {
            return;
        }
        this._consortiaIntellect = value;
        this.updateConstiaStudy(value, ConsortiaUpgradeType.ABILITY);
    }

    private _consortiaCaptain: number = 0;
    public get consortiaCaptain(): number {
        return this._consortiaCaptain;
    }

    public set consortiaCaptain(value: number) {
        if (this._consortiaCaptain == value) {
            return;
        }
        this._consortiaCaptain = value;
        this.updateConstiaStudy(value, ConsortiaUpgradeType.CAPTAIN);
    }

    private _consortiaGold: number = 0;
    public get consortiaGold(): number {
        return this._consortiaGold;
    }

    public set consortiaGold(value: number) {
        if (this._consortiaGold == value) {
            return;
        }
        this._consortiaGold = value;
        this.updateConstiaStudy(value, ConsortiaUpgradeType.GOLD);
    }

    private _consortiaPhysique: number = 0;
    public get consortiaPhysique(): number {
        return this._consortiaPhysique;
    }

    public set consortiaPhysique(value: number) {
        if (this._consortiaPhysique == value) {
            return;
        }
        this._consortiaPhysique = value;
        this.updateConstiaStudy(value, ConsortiaUpgradeType.PHYSIQUE);
    }

    private updateConstiaStudy(value: number, type: number) {
        if (value == 1) {
            this.dispatchEvent(ConsortiaEvent.CONSORTIA_STUDY, type);
        }
        else {
            this.dispatchEvent(ConsortiaEvent.CONSORTIA_STUDY_UPGRADE, type);
        }
    }


    public op: number = 0;
    public gradeProcess: number = 0; //新手礼包的进度
    private _timeProcess: number = 0; //时间宝箱的进度
    public get timeProgress(): number {
        return this._timeProcess;
    }

    public set timeProgress(value: number) {
        if (value != this._timeProcess) {
            this._timeProcess = value;
            this._changeObj[PlayerInfo.TIMEBOX_UPDATE] = true;
            this.isOpenTopTool = true;
        }
    }

    private _timeGet: boolean = false; //进度中的时间宝箱是否已经领取
    public get timeGet(): boolean {
        return this._timeGet;
    }

    public set timeGet(value: boolean) {
        if (value != this._timeGet) {
            this._timeGet = value;
            this._changeObj[PlayerInfo.TIMEBOX_UPDATE] = true;
        }
    }

    private _timeRun: number = 0;
    public get timeRun(): number {
        return this._timeRun;
    }

    public set timeRun(value: number) {
        if (value != this._timeRun) {
            this._timeRun = value;
            this._changeObj[PlayerInfo.TIMEBOX_UPDATE] = true;
        }
    }


    private _reloginProcess: number = 0;
    public get reloginProcess(): number {
        return this._reloginProcess;
    }

    public set reloginProcess(value: number) {
        if (value != this._reloginProcess) {
            this._reloginProcess = value;
            this._changeObj[PlayerInfo.RELOGINPROCESS_UPDATE] = true;
        }
    }

    private _seminaryEffect: number = 0;
    public get seminaryEffect(): number {
        return this._seminaryEffect;
    }

    public set seminaryEffect(value: number) {
        if (value != this._seminaryEffect) {
            this._seminaryEffect = value;
            this._changeObj[PlayerInfo.SEMINARY_EFFECT] = true;
        }
    }

    public seminaryMax: number = 0;
    public seminaryCount: number = 0;

    public reloginCount: number = 0;

    public totalGP: number = 0;
    public signDate: Date;// 上一次签到时间
    public signTimes: number = 0;// 累计签到次数
    private _signSite: number = 0;//签到记录
    private _reissueNum: number = 0;//剩余补签次数
    private _rewardState: string = "0,0,0,0,0";//累计签到领取奖励状态 1,1,1,0,0  0未领取 1已领取
    public hasGetData: boolean = true;
    public set signSite(value: number) {
        if (this._signSite != value) {
            this._changeObj[PlayerInfo.SIGNSITE_CHANGE] = true;
            this._signSite = value;
        }
    }

    public get signSite(): number {
        return this._signSite;
    }

    public set reissueNum(value: number) {
        if (this._reissueNum != value) {
            this._changeObj[PlayerInfo.REISSUENUM_CHANGE] = true;
            this._reissueNum = value;
        }
    }

    public get reissueNum(): number {
        return this._reissueNum;
    }

    public set rewardState(value: string) {
        if (this._rewardState != value) {
            this._changeObj[PlayerInfo.REWARDSTATE_CHANGE] = true;
            this._rewardState = value;
        }
    }

    public get rewardState(): string {
        return this._rewardState;
    }

    private _lastFreeSkillLearnTime: string = "";
    public get lastFreeSkillLearnTime(): string {
        return this._lastFreeSkillLearnTime;
    }
    public set lastFreeSkillLearnTime(value: string) {
        if (this._lastFreeSkillLearnTime != value) {
            this._changeObj[PlayerInfo.LAST_FREESKILL_LEARN_TIME] = true;
            this._lastFreeSkillLearnTime = value;
        }
    }

    private _monthCardInfos: Array<MonthCardInfo> = [];

    public set monthCardInfos(value: Array<MonthCardInfo>) {
        if (this._monthCardInfos != value) {
            this._changeObj[PlayerInfo.MONTH_CARD_CHANGE] = true;
            this._monthCardInfos = value;
        }
    }

    public get monthCardInfos(): Array<MonthCardInfo> {
        return this._monthCardInfos;
    }
    /**
     * 额外花钱开启的背包格子数量
     */
    private _bagCount: number = 0;

    public get bagCount(): number {
        return this._bagCount;
    }

    public set bagCount(value: number) {
        if (this._bagCount != value) {
            this._changeObj[PlayerInfo.BAG_CAPICITY] = true;
            this._bagCount = value;
        }
    }

    /** 废弃：免费占星次数 */
    private _starFreeCount: number = 0;
    public set starFreeCount(val: number) {
        if (this._starFreeCount != val) {
            this._starFreeCount = val;
            this._changeObj[PlayerInfo.STAR_FREECOUNT] = true;
        }
    }

    public get starFreeCount(): number {
        return this._starFreeCount;
    }

    private _starBagCount: number = 0;
    public set starBagCount(value: number) {
        if (this._starBagCount != value) {
            this._changeObj[PlayerInfo.STARBAG_CAPICITY] = true;
            this._starBagCount = value;
        }
    }

    /**
     * 开放星运背包数量
     */
    public get starBagCount(): number {
        return this._starBagCount;
    }

    private _starPoint: number = 0;
    /**
     * 占星积分
     */
    public get starPoint(): number {
        return this._starPoint;
    }

    public set starPoint(value: number) {
        if (this._starPoint != value) {
            this._changeObj[PlayerInfo.STAR_POINT] = true;
            this._starPoint = value;
        }
    }

    /**
     * 英灵背包扩展数量    
     */
    private _petBagCount: number = 0;
    public get petBagCount(): number {
        return this._petBagCount;
    }
    public set petBagCount(value: number) {
        if (this._petBagCount != value) {
            this._changeObj[PlayerInfo.PET_BAG_CAPICITY] = true;
            this._petBagCount = value;

        }
    }

    /**
     * 开放f符文石背包数量
     */
    private _runeGemBagCount: number = 0;
    public get runeGemBagCount(): number {
        return this._runeGemBagCount;
    }
    public set runeGemBagCount(value: number) {
        if (this._runeGemBagCount != value) {
            this._changeObj[PlayerInfo.RUNE_GEM_BAG_CAPICITY] = true;
            this._runeGemBagCount = value;

        }
    }

    /**
     * 符石能量点数量
     */
    private _runePowerPoint: number = 0;
    public get runePowerPoint(): number {
        return this._runePowerPoint;
    }
    public set runePowerPoint(value: number) {
        if (this._runePowerPoint != value) {
            this._changeObj[PlayerInfo.RUNE_GEM_ENERGY] = true;
            this._runePowerPoint = value;

        }
    }

    /**
     *参与过该公会的魔神祭坛
     */
    public demonConsortiaId: number = 0;

    private _composeList: number[] = [];
    public set composeList(list: number[]) {
        if (!this._composeList) {
            this._composeList = list;
            this._changeObj[PlayerInfo.COMPOSE_LIST] = true;
        }
    }

    public get composeList(): number[] {
        return this._composeList;
    }

    public addCompose: number[];

    public addComposeTemp(arr: number[]) {
        if (!this._composeList) {
            this._composeList = arr;
            return;
        }
        this.addCompose = arr;
        for (let id of arr) {
            if (this._composeList.indexOf(id) >= 0) continue;
            this._composeList.push(id);
            this._changeObj[PlayerInfo.COMPOSE_LIST] = true;
        }
    }

    /**
     * 已开启的背包格子总数
     */
    public get bagTotalCount(): number {
        return this.bagCount + ConfigInfoManager.Instance.playerBagCount();
    }

    // 新版新手
    private _newNoviceProcess: string = "";
    public get newNoviceProcess(): string {
        return this._newNoviceProcess;
    }

    public set newNoviceProcess(value: string) {
        if (value == "" || this._newNoviceProcess == value) {
            return;
        }
        this._newNoviceProcess = value;
    }

    private _noviceProcess: number = 0;
    public get noviceProcess(): number {
        return this._noviceProcess;
    }

    public set noviceProcess(value: number) {
        if (this._noviceProcess == value) {
            return;
        }
        if (this._noviceProcess == GlobalConfig.NEWBIE_11300 && value == GlobalConfig.NEWBIE_11400) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.FIRST_KILL);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_13500 && value == GlobalConfig.NEWBIE_14000) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.TASK_RESCUE_GIRL);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_16000 && value == GlobalConfig.NEWBIE_16500) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_WEAPON);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_17500 && value == GlobalConfig.NEWBIE_18000) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.TASK_KILL_DEMONS);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_19000 && value == GlobalConfig.NEWBIE_20000) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.TASK_GET_TOWN);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_22000 && value == GlobalConfig.NEWBIE_22500) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.TASK_RECRUIT_GUNMEN);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_22800 && value == GlobalConfig.NEWBIE_23000) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.TASK_GET_GOLDMINE);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_24000 && value == GlobalConfig.NEWBIE_25500) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.TASK_KILL_NEST);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_33000 && value == GlobalConfig.NEWBIE_34000) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_JOIN_CLUB);
        } else if (this._noviceProcess == GlobalConfig.NEWBIE_35400 && value == GlobalConfig.NEWBIE_35600) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.TASK_TO_SKYCITY);
        }
        this._noviceProcess = value;
    }

    public get campaignSite(): string {
        if (this._campaignSite == null) {
            this._campaignSite = "";
        }
        return this._campaignSite;
    }

    public isCompleteCampaign(id: number): boolean {
        let completeCampaignList: any[] = this.campaignSite.split(",");
        if (completeCampaignList.indexOf(id) >= 0) {
            return true;
        }
        return false;
    }

    public set campaignSite(value: string) {
        if (this._campaignSite != value) {
            this._campaignSite = value;
        }
    }

    public get questSite(): ByteArray {
        return this._questSite;
    }

    public set questSite(value: ByteArray) {
        this._questSite = value;
    }

    /**
     * 世界繁荣度
     */
    private _worldProsperity: number = 0;
    public set worldProsperity(value: number) {
        if (this._worldProsperity == value) {
            return;
        }
        this._worldProsperity = value;
        this._changeObj[PlayerInfo.WORLDPROSPERITY] = true;
    }

    public get worldProsperity(): number {
        return this._worldProsperity;
    }

    /**
     *紫晶矿场活动是否开启
     */
    private _mineralIsOpen: boolean = false;
    public set mineralIsOpen(value: boolean) {
        if (this._mineralIsOpen != value) {
            this._changeObj[PlayerInfo.MINERAL] = true;
            this._mineralIsOpen = value;
            if (value == true) {
                // ExternalInterfaceManager.Instance.initNews("10");
                this.isOpenTopTool = true;
            }
        }
    }

    public get mineralIsOpen(): boolean {
        return this._mineralIsOpen;
    }

    /**
     *公会战是否开启
     */
    private _gvgIsOpen: boolean = false;
    public set gvgIsOpen(value: boolean) {
        if (this._gvgIsOpen != value) {
            this._changeObj[PlayerInfo.GVGISOPEN] = true;
            this._gvgIsOpen = value;
            if (value == true) {
                // ExternalInterfaceManager.Instance.initNews("11");
                this.isOpenTopTool = true;
            }
        }
    }

    public get gvgIsOpen(): boolean {
        return this._gvgIsOpen;
    }

    /**
     *世界boss开启
     */
    private _worldbossState: boolean = false;
    public set worldbossState(value: boolean) {
        if (this._worldbossState != value) {
            this._changeObj[PlayerInfo.WORLDBOSSSTATE] = true;
            this._worldbossState = value;
            if (value == true) {
                // ExternalInterfaceManager.Instance.initNews("12");
                this.isOpenTopTool = true;
            }
        }
    }

    public get worldbossState(): boolean {
        return this._worldbossState;
    }

    /**
     *竞技场开启
     */
    private _isPVPStart: boolean = false;
    public set isPVPStart(value: boolean) {
        if (this._isPVPStart != value) {
            this._changeObj[PlayerInfo.ISPVPSTART] = true;
            this._isPVPStart = value;
            if (value == true) {
                // ExternalInterfaceManager.Instance.initNews("13");
                this.isOpenTopTool = true;
            }
        }
    }

    public get isPVPStart(): boolean {
        return this._isPVPStart;
    }

    private _isVehicleStart: boolean = false;

    /**
     * 载具活动是否开放
     */
    public get isVehicleStart(): boolean {
        return this._isVehicleStart;
    }

    /**
     * @private
     */
    public set isVehicleStart(value: boolean) {
        if (this._isVehicleStart != value) {
            this._changeObj[PlayerInfo.ISVEHICLESTART] = true;
            this._isVehicleStart = value;
            if (value == true) {
                // ExternalInterfaceManager.Instance.initNews("14");
                this.isOpenTopTool = true;
            }

        }
    }

    public get isChallReward(): boolean {
        return this._isChallReward;
    }

    public set isChallReward(value: boolean) {
        if (value != this._isChallReward) {
            this._isChallReward = value;
            this._changeObj[PlayerInfo.CHALLREWARD] = true;
        }
    }

    public getConsortiaSkills(): Array<t_s_consortialevelData> {
        let arr: Array<t_s_consortialevelData> = [];
        let skillTemp: t_s_consortialevelData;
        if (this._consortiaPower > 0) {
            skillTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.ATTACK, this._consortiaPower);
            arr.push(skillTemp);
        }
        if (this._consortiaAgility > 0) {
            skillTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.AGILITY, this._consortiaAgility);
            arr.push(skillTemp);
        }
        if (this._consortiaIntellect > 0) {
            skillTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.ABILITY, this._consortiaIntellect);
            arr.push(skillTemp);
        }
        if (this._consortiaPhysique > 0) {
            skillTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.PHYSIQUE, this._consortiaPhysique);
            arr.push(skillTemp);
        }
        if (this._consortiaCaptain > 0) {
            skillTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.CAPTAIN, this._consortiaCaptain);
            arr.push(skillTemp);
        }
        if (this._consortiaGold > 0) {
            skillTemp = TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(ConsortiaUpgradeType.GOLD, this._consortiaGold);
            arr.push(skillTemp);
        }
        return arr;
    }

    /**
     * 试练之塔是否达到进入的最大次数
     * @return
     *
     */
    public get isTrailOverMaxCount(): boolean {
        return this.trialCount >= this.maxTrialCount;
    }

    public exitUnReceivedLogin(): boolean {
        for (let i: number = 0; i < 7; i++) {
            if (!(this._reloginProcess & (1 << i))) {
                return true;
            }
        }
        return false;
    }

    public checkIsReceived(index: number): boolean {
        let flag: number = 1 << (index - 1);
        return flag == (this._reloginProcess & flag);
    }

    public commit() {
        if (this._changeObj[PlayerInfo.BAG_CAPICITY]) {
            this.dispatchEvent(PlayerEvent.BAG_CAPICITY_INCRESS, this);
            this.dispatchEvent(BagEvent.CHECK_BAG_FULL, null);
        }
        if (this._changeObj[PlayerInfo.STAR_FREECOUNT]) {
            this.dispatchEvent(PlayerEvent.STAR_FREECOUNT_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.STARBAG_CAPICITY]) {
            this.dispatchEvent(PlayerEvent.STARBAG_CAPICITY_INCRESS, this);
        }
        if (this._changeObj[PlayerInfo.STAR_POINT]) {
            this.dispatchEvent(PlayerEvent.STAR_POINT_UPDATE, this);
        }
        if (this._changeObj[PlayerInfo.SIGNSITE_CHANGE]) {
            this.dispatchEvent(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.REISSUENUM_CHANGE]) {
            this.dispatchEvent(PlayerEvent.REISSUENUM_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.REWARDSTATE_CHANGE]) {
            this.dispatchEvent(PlayerEvent.REWARDSTATE_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.MONTH_CARD_CHANGE]) {
            this.dispatchEvent(PlayerEvent.MONTH_CARD_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.COMPOSE_LIST]) {
            this.dispatchEvent(PlayerEvent.COMPOSE_LIST_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.TIMEBOX_UPDATE]) {
            this.dispatchEvent(PlayerEvent.TIMEBOX_UPDATE, this);
        }
        if (this._changeObj[PlayerInfo.POINT]) {
            this.dispatchEvent(PlayerEvent.POINT_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.WEARY]) {
            this.dispatchEvent(PlayerEvent.WEARY_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.WEARY]) {
            this.dispatchEvent(PlayerEvent.RELOGINPROCESS_UPDATE, this);
        }
        if (this._changeObj[PlayerInfo.RELOGINPROCESS_UPDATE]) {
            this.dispatchEvent(PlayerEvent.RELOGINPROCESS_UPDATE, this);
        }
        if (this._changeObj[PlayerInfo.SEMINARY_EFFECT]) {
            this.dispatchEvent(PlayerEvent.SEMINARY_EFFECT, this);
        }
        if (this._changeObj[PlayerInfo.FIRSTCHARGE]) {
            this.dispatchEvent(PlayerEvent.FIRSTCHARGE, this);
        }
        if (this._changeObj[PlayerInfo.KINGBUFF]) {
            this.dispatchEvent(PlayerEvent.GET_KING_BUFF, this);
        }
        if (this._changeObj[PlayerInfo.WORLDPROSPERITY]) {
            this.dispatchEvent(PlayerEvent.WORLDPROSPERITY, this);
        }
        if (this._changeObj[PlayerInfo.GVGISOPEN]) {
            this.dispatchEvent(PlayerEvent.GVGISOPEN, this);
        }
        if (this._changeObj[PlayerInfo.MINERAL]) {
            this.dispatchEvent(PlayerEvent.MINERAL, this);
        }
        if (this._changeObj[PlayerInfo.WORLDBOSSSTATE]) {
            this.dispatchEvent(PlayerEvent.WORLDBOSSSTATE, this);
        }
        if (this._changeObj[PlayerInfo.ISPVPSTART]) {
            this.dispatchEvent(PlayerEvent.ISPVPSTART, this);
        }
        if (this._changeObj[PlayerInfo.PVP_WAR_COUNT]) {
            this.dispatchEvent(PlayerEvent.PVP_CONUT_CHANGE, this);
        }
        if (this.canAcceptCrossScoreAward) {
            this.dispatchEvent(PlayerEvent.CROSS_SCORE_RAWARD, this);
        }
        if (this._changeObj[PlayerInfo.ISVEHICLESTART]) {
            this.dispatchEvent(PlayerEvent.VEHICLESTART, this);
        }
        if (this._changeObj[PlayerInfo.VEHICLE_GP]) {
            this.dispatchEvent(PlayerEvent.VEHICLE_GP, this);
        }
        if (this._changeObj[PlayerInfo.VEHICLE_SCORE] || this._changeObj[PlayerInfo.VEHICLE_LIST]) {
            this.dispatchEvent(PlayerEvent.PLAYER_VEHICLEINFO_CHANGE, this);
        }
        if (this._changeObj[PlayerInfo.GROWTHFUND]) {
            this.dispatchEvent(PlayerEvent.GROWTHFUND, this);
        }
        if (this._changeObj[PlayerInfo.CHALLREWARD]) {
            this.dispatchEvent(PlayerEvent.CHALLREWARD, this);
        }
        if (this._changeObj[PlayerInfo.RUNE_GEM_BAG_CAPICITY]) {
            this.dispatchEvent(PlayerEvent.RUNE_GEM_BAG_CAPICITY, this);
        }
        if (this._changeObj[PlayerInfo.RUNE_GEM_ENERGY]) {
            this.dispatchEvent(PlayerEvent.RUNE_GEM_ENERGY, this);
        }
        if (this._changeObj[PlayerInfo.PET_BAG_CAPICITY]) {
            this.dispatchEvent(PlayerEvent.PET_BAG_CAPICITY, this);
        }
        if (this._changeObj[PlayerInfo.LAST_FREESKILL_LEARN_TIME]) {
            this.dispatchEvent(PlayerEvent.LAST_FREESKILL_LEARN_TIME, this);
        }
        super.commit();
    }

    /**
     * 载具经验
     */
    public get vehicleGp(): number {
        return this._vehicleGp;
    }

    /**
     * @private
     */
    public set vehicleGp(value: number) {
        if (this._vehicleGp != value) {
            this._changeObj[PlayerInfo.VEHICLE_GP] = true;
            this._vehicleGp = value;
        }
    }

    /**
     * 载具积分
     */
    public get vehicleScore(): number {
        return this._vehicleScore;
    }

    /**
     * @private
     */
    public set vehicleScore(value: number) {
        if (this._vehicleScore != value) {
            this._changeObj[PlayerInfo.VEHICLE_SCORE] = true;
            this._vehicleScore = value;
        }
    }

    public get vehicleList(): any[] {
        return this._vehicleList;
    }

    public addVehicle(tempId: number) {
        if (this._vehicleList.indexOf(tempId) < 0) {
            this._vehicleList.push(tempId);
            this._changeObj[PlayerInfo.VEHICLE_LIST] = true;
        }
    }

    public get vehicleGrade(): number {
        let gp: number = this.vehicleGp;
        let arr: t_s_upgradetemplateData[] = TempleteManager.Instance.getTemplatesByType(24);
        let tempArr = ArrayUtils.sortOn(arr, ["Grades"], [ArrayConstant.NUMERIC]);
        let g: number = 1;
        let totalGp: number = 0;
        let tempGp: number = 0;
        for (let i: number = 0; i < tempArr.length; i++) {
            tempGp = totalGp + tempArr[i].Data;
            if (gp >= totalGp && gp < tempGp) {
                break;
            }
            g = tempArr[i].Grades;
            totalGp = tempGp;
        }
        return g;
    }

    public transfer() {
        this.dispatchEvent(PlayerEvent.DRAGON_SOUL_TRANSFER, this);
    }

    /**
     *是否设置密码 0没有设置, 1设置
     */
    public hasVicePassword: number = 0;
    /**
     *是否处于物品锁重置时间内,0: 正常, 1: 在重置时间内
     */
    public isDuringResetTime: number = 0;
    public needViceGuild: boolean = false;
    public needShowReward: boolean = false;

    //bind
    public get showBindReward(): boolean {
        let loginWay = SharedManager.Instance.getWindowItem("loginWay");
        if (Number(loginWay) == LoginWay.Type_GUEST) {
            return true;
        }
        return !this.isBindReward;
    }
}