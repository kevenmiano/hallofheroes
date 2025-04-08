import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import { ExpBackEvent, NotificationEvent } from '../../constant/event/NotificationEvent';
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import DayGuideManager from "../../manager/DayGuideManager";
import { NotificationManager } from '../../manager/NotificationManager';
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { VIPManager } from "../../manager/VIPManager";
import FrameDataBase from "../../mvc/FrameDataBase";
import { VIPModel } from "../../mvc/model/VIPModel";
import DayGuideCatecory from "./data/DayGuideCatecory";
import DegreeActivityBoxData from "./data/DegreeActivityBoxData";
import ExpBackItemData from "./data/ExpBackItemData";
import GrowthFundItemInfo from "./data/GrowthFundItemInfo";
import LevelGiftItemInfo from "./data/LevelGiftItemInfo";
import SevenLoginInfo from "./data/SevenLoginInfo";
import PassRewardInfo from "./data/PassRewardInfo";
import PassTaskModel from "./data/PassTaskModel";
import { DateFormatter } from "../../../core/utils/DateFormatter";

export enum WelfareTab {
    DEGREE_ACTIVITY = 0,//活跃度
    PASS,//通行证
    ONLINE_GIFT,//在线奖励
    SIGN,//签到
    EXP_BACK,//资源找回
    SEVEN_GOALS,//七日目标
    LEVEL_GIFT,//等级礼包
    BIND_PHONE,//绑定手机
    BIND_MAIL,//绑定邮箱
    MONTH_CARD,//超值月卡
    GROUTH_FUND,//成长基金
    ACTIVITY_TIME//活动日程
}
/**
* @author:pzlricky
* @data: 2021-06-23 15:49
* @description 福利界面数据 
*/
export default class WelfareData extends FrameDataBase {

    public static TAB_DATA: Array<string> = [];

    public static SignInView: string = "SignInCom";//签到   1

    public static DegreeActivityView: string = 'DegreeActivityView';//活跃度  2

    public static LevelGiftView: string = "LevelGiftView";//等级礼包  3

    public static MonthCardView: string = "MonthCardView";//超值月卡  4

    public static GrowthFundView: string = "GrowthFundView";//成长基金  5

    public static OnlineGiftView: string = "OnlineGiftView";//在线奖励  6

    public static ExpBackView: string = "ExpBackView";//资源找回

    public static PassportView: string = "PassportView";//通行证

    public _growthFundInfoArr: Array<GrowthFundItemInfo> = [];
    public totalBindCount: number = 0;//成长基金总的可以领取的绑定钻石数量
    public hasGetBindCount: number = 0;//成长基金已经领取的绑定钻石数量
    private _levelPackageArr: Array<LevelGiftItemInfo> = [];
    public currentGetPackageId: number = 0;//当前已经领取等级奖励的最大id
    private _levelArr: Array<number> = [];
    public static dayDegreeType: number = 0;//每日活跃度
    public static weeDegreeType: number = 1;//周活跃度
    public static CAN_GET: number = 1;//可领取
    public static DISSATISIFY_CONDITION = 2;//未满足条件
    public static ENABLE_GET: number = 3;//不可领取
    public static HAS_GET: number = 4;//已经领取

    public dayDegreeBoxs: Array<DegreeActivityBoxData> = [];//日活跃度宝箱数组
    public weekDegreeBoxs: Array<DegreeActivityBoxData> = []//周活跃度宝箱数组
    public dayMaxDegreePoint: number = 0;//每日活跃度最大值
    public sevenLoginStartTime: number = 0;//七日登录开始的时间戳(秒)
    public sevenLoginEndTime: number = 0;//七日登录结束时间的时间戳(秒)
    private _sevenLoginRewardArr: Array<SevenLoginInfo> = [];//七日登录奖励
    public sevenLoginTotalDays: number = 0;//七日登录累计登录的天数
    public needShowGrowFundView: boolean = false;//是否需要展示成长基金tab页签(false不需要 true需要)
    public isPay: number = 1; //1未激活 2可领取钻石奖励 3已经领取钻石奖励 4领取全部的奖励
    public initTotalBindFlag: boolean = false;//有没有计算过可获得的绑定钻石总量
    private _expBackItemDataArr: Array<ExpBackItemData> = [];//资源找回数据
    public expBackDiamontCost: number = 10;//修炼纹章价格
    public hasClickExpTab: boolean = false;//是否点击过资源找回页签
    public passRewardInfo: PassRewardInfo = new PassRewardInfo();//通行证奖励数据
    public passTaskModel: PassTaskModel = new PassTaskModel();//通行证任务数据
    passExp: number = 0;//通行证当前经验
    passGrade: number = 0;//通行证当前等级
    public pvpOpenTimeArr: Array<any>;
    constructor() {
        super();
    }

    protected show(): void {
        WelfareData.TAB_DATA = [];
        WelfareData.TAB_DATA[WelfareTab.SIGN] = WelfareData.SignInView;
        WelfareData.TAB_DATA[WelfareTab.DEGREE_ACTIVITY] = WelfareData.DegreeActivityView;
        WelfareData.TAB_DATA[WelfareTab.LEVEL_GIFT] = WelfareData.LevelGiftView;
        WelfareData.TAB_DATA[WelfareTab.MONTH_CARD] = WelfareData.MonthCardView;
        WelfareData.TAB_DATA[WelfareTab.GROUTH_FUND] = WelfareData.GrowthFundView;
        WelfareData.TAB_DATA[WelfareTab.ONLINE_GIFT] = WelfareData.OnlineGiftView;
        WelfareData.TAB_DATA[WelfareTab.EXP_BACK] = WelfareData.ExpBackView;
        WelfareData.TAB_DATA[WelfareTab.PASS] = WelfareData.PassportView;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("RECOVER_POINT");
        if (cfgItem) {
            this.expBackDiamontCost = parseInt(cfgItem.ConfigValue);
        }
        let str = TempleteManager.Instance.getConfigInfoByConfigName("MatchTime").ConfigValue;
        let array = str.split("|")
        this.pvpOpenTimeArr = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let temp = element.split(",")
            var starray: any[] = temp[0].split(":");
            var endarray: any[] = temp[1].split(":");
            let startTimeMin = Number(starray[0]) * 60 + Number(starray[1])
            let endTimeMin = Number(endarray[0]) * 60 + Number(endarray[1])
            let obj = { startTimeMin: startTimeMin, endTimeMin: endTimeMin }
            this.pvpOpenTimeArr.push(obj)
        }
    }

    /**
     * 得到付费礼包数组
     * @returns 
     */
    public getLevelGiftDimaondArr(): Array<LevelGiftItemInfo> {
        let arrItemId: number;
        let arrPreItemId: number;
        let arrPreItem: LevelGiftItemInfo;
        let diamondArr: Array<LevelGiftItemInfo> = [];
        if (this._levelPackageArr && this._levelPackageArr.length > 0) {
            if (this.currentGetPackageId == this._levelPackageArr.length) {
                arrItemId = this._levelPackageArr.length + 1;//数组第一条数据的id
            }
            else {
                arrItemId = this._levelPackageArr[0].id;//数组第一条数据的id
            }
            if (arrItemId > 2)//数组第一项是30级以及以上的。
            {
                arrPreItemId = arrItemId - 1;
                for (let i = 0; i < this._levelPackageArr.length; i++) {
                    if (this._levelPackageArr[i].id == arrPreItemId || this._levelPackageArr[i].id == arrPreItemId - 1) {
                        arrPreItem = this._levelPackageArr[i];
                        diamondArr.push(arrPreItem);
                    }
                }
            }
            else//显示10级和20级的
            {
                for (let i = 0; i < this._levelPackageArr.length; i++) {
                    if (this._levelPackageArr[i].id == 1 || this._levelPackageArr[i].id == 2) {
                        arrPreItem = this._levelPackageArr[i];
                        diamondArr.push(arrPreItem);
                    }
                }
            }
            diamondArr = ArrayUtils.sortOn(diamondArr, ["id"], [ArrayConstant.NUMERIC]);
        }
        return diamondArr;
    }

    public set growthFundInfoArr(value: Array<GrowthFundItemInfo>) {
        this._growthFundInfoArr = value;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.GROWTH_FUND_UPDATE);
    }

    public get growthFundInfoArr(): Array<GrowthFundItemInfo> {
        return this._growthFundInfoArr;
    }

    public set levelArr(value: Array<number>) {
        this._levelArr = value;
    }

    public get levelArr(): Array<number> {
        return this._levelArr;
    }

    public set levelPackageArr(value: Array<LevelGiftItemInfo>) {
        this._levelPackageArr = value;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.LEVEL_GIFT_UPDATE);
    }

    public get levelPackageArr(): Array<LevelGiftItemInfo> {
        return this._levelPackageArr;
    }

    private get cate(): DayGuideCatecory {
        return DayGuideManager.Instance.cate;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get today(): Date {
        return PlayerManager.Instance.currentPlayerModel.sysCurtime;
    }
    private get vipModel(): VIPModel {
        return VIPManager.Instance.model;
    }

    /**是否能签到或补签 */
    public get canSign(): boolean {
        let index = Math.floor(DateFormatter.compareDayIndex(this.playerInfo.signDate, this.today));
        if (index <= 0) {
            index = 1;
        }
        let todaySign = !this.cate.hasSigned(index);
        return todaySign;
    }

    /**
     * 可购买等级礼包的特惠礼包
     */
    public get canBuyLevelGift(): boolean {
        let flag: boolean = false;
        for (let i = 0; i < this.getLevelGiftDimaondArr().length; i++) {
            let item: LevelGiftItemInfo = this.getLevelGiftDimaondArr()[i];
            if (item && item.packageState2 == 1 && this.currentGetPackageId >= item.id) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    /**
     * 可领取等级礼包的等级礼包
     */
    public get canReceiveLevelGift(): boolean {
        let flag: boolean = false;
        for (let i = 0; i < this._levelPackageArr.length; i++) {
            let item: LevelGiftItemInfo = this._levelPackageArr[i];
            if (item && item.packageState1 == WelfareData.CAN_GET) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    /**
     * 可领取通行证奖励
     */
    public get canReceivePassCheckReward(): number {
        let flag: number = 0;
        let array = TempleteManager.Instance.getPassCheckCfeByJob(this.passRewardInfo.passIndex);
        if (array.length == 0) {
            array = TempleteManager.Instance.getPassCheckCfeByJob(0);
        }
        if (array) {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                let isclaimed: boolean = this.passRewardInfo.isReceivedBase(element.Grade);
                if (!isclaimed) {//未领取
                    if (this.passGrade >= element.Grade) { //可领取
                        flag = element.Grade;
                        break;
                    }
                }
                isclaimed = this.passRewardInfo.isReceivedAdvance(element.Grade);
                if (!isclaimed) {//未领取
                    if (this.passGrade >= element.Grade && this.passRewardInfo.isPay) { //可领取
                        flag = element.Grade;
                        break;
                    }
                }
            }
        }
        if (this.passRewardInfo.rewardGrade < this.passGrade && this.passRewardInfo.rewardGrade > 0) {
            flag = this.passRewardInfo.rewardGrade;
        }
        return flag;
    }

    /**
     * 可领取通行证任务奖励
     */
    public get canReceivePassCheckTaskReward(): boolean {
        let flag: boolean = false;
        let array = this.passTaskModel.taskListData;
        if (array) {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if (element.status == 1) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**
     * 可领取通行证任务奖励
     */
    public canReceivePassTaskByArea(area: number): boolean {
        let flag: boolean = false;
        let array = this.passTaskModel.taskListData;
        if (array) {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if (element.status == 1 && element.area == area) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**是否需要显示等级礼包按钮 
     * 所有的等级礼包领取完毕并且成长特惠礼包已经购买
    */
    public get needShowLevelGiftBtn(): boolean {
        let flag: boolean = false;
        for (let i = 0; i < this._levelPackageArr.length; i++) {
            let item: LevelGiftItemInfo = this._levelPackageArr[i];
            if (item && item.packageState1 != WelfareData.HAS_GET) {//有任何一个还没有领取, 则现在等级礼包项目
                flag = true;
                break;
            }
        }
        if (!flag) {
            let giftArray: Array<LevelGiftItemInfo> = this.getLevelGiftDimaondArr();
            let item: LevelGiftItemInfo;
            for (let i = 0; i < giftArray.length; i++) {
                item = giftArray[i];
                if (item && this.currentGetPackageId < item.id) {
                    flag = true;
                    break;
                }
                else if (item && item.packageState2 == 1) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**是否有可领取的日活跃宝箱 */
    public get canReceiveActive(): boolean {
        let flag: boolean = false;
        if (this.dayDegreeBoxs.length <= 0) return false;
        for (let i = 0; i < 5; i++) {
            let value = this.dayDegreeBoxs[i].point;
            if (this.cate.canPick(value) && !this.cate.hasPick(i + 1)) {
                flag = true;
                break;
            }
        }
        return flag;
    }


    /**是否有可领取的周活跃宝箱 */
    public get canReceiveWeekActive(): boolean {
        let flag: boolean = false;
        if (this.weekDegreeBoxs.length <= 0) return false;
        for (let i = 0; i < 2; i++) {
            let value = this.weekDegreeBoxs[i].point;
            if (this.cate.canPickWeek(value) && !this.cate.hasPick(i + 6)) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    public set sevenLoginRewardArr(value: Array<SevenLoginInfo>) {
        this._sevenLoginRewardArr = value;
    }

    public get sevenLoginRewardArr(): Array<SevenLoginInfo> {
        return this._sevenLoginRewardArr
    }

    /**
     * 七日登录检测某天的奖励是否可领取
     * @param day 天数
     * @returns true 可领取 false 不可领取
     */
    public checkSevenLoginDayRed(day: number): boolean {
        let flag: boolean = false;
        for (let i = 0; i < this._sevenLoginRewardArr.length; i++) {
            let sevenLoginInfo = this._sevenLoginRewardArr[i];
            if (sevenLoginInfo.status == 1) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    /**得到七日登录奖励领取状态 */
    public getSevenLoginRewardStatus(day: number, site: number, currentDay: number) {
        let status: number = 0;//默认是不可领取
        if (site >> day & 0x01) {//已经领取
            status = 2;
        }
        else if (day <= currentDay)//可领取
        {
            status = 1;
        }
        return status;
    }

    public get expBackItemDataArr(): Array<ExpBackItemData> {
        return this._expBackItemDataArr;
    }
    public set expBackItemDataArr(value: Array<ExpBackItemData>) {
        this._expBackItemDataArr = value;
        NotificationManager.Instance.dispatchEvent(ExpBackEvent.UPDATE_INFO);
    }
}