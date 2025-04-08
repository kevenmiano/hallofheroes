// @ts-nocheck
import Dictionary from "../../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { t_s_carnivaldailychallengeData } from "../../../config/t_s_carnivaldailychallenge";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PathManager } from "../../../manager/PathManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalTaskInfo from "./CarnivalTaskInfo";

/**目录定义 */
export enum CARNIVAL_FOLDER {
    BAO = "bao",
    DAYTASK = "daytask",
    DISCOUNT = "discount",
    ONLINE = "online",
    RECHARGE = "recharge"
}

/**主题 */
export enum CARNIVAL_THEME {
    SUMMER = "summer",
    WINTER = "winter"
}

export default class CarnivalModel {
    public openFrameTime: number = 0;//打开界面的时间
    public score: number = 0;// 积分1
    public scoreRewardInfo: string = "";// 积分奖励信息1
    public totalCharge: number = 0;// 累计充值2
    public lotteryCount: number = 0;// 可用抽奖次数2
    public dayCharge: number = 0;// 每日充值3
    public giftBuyInfo: string = "";// 礼包购买信息3
    public dayOnline: number = 0;// 在线分钟4
    public onlineDate: string = "";//在线计时时间
    public onlineRewardInfo: string = "";// 在线奖励信息4
    public luckCount: number = 0;// 可用幸运抽奖次数5
    public luckNum: number = 0;// 幸运数字5
    public gameInfo: string = "";// 小游戏收益信息6
    public result: string = "";//抽奖结果

    private _configActId: string = "";

    private _taskDic: SimpleDictionary;

    public static GOODS: number = 1;
    public static FASHION: number = 2;
    public static MOUNTS: number = 3;
    public static PET: number = 4;

    public static TypeAdd: number = 3;

    //1积分奖励、2每日礼包、3在线奖励区分活动类型、4记忆翻牌、5连连看、6梭哈扑克
    public static TYPE_AWARD: number = 1;
    public static TYPE_DAYGIFT: number = 2;
    public static TYPE_ONLINE: number = 3;
    public static TYPE_GAME_MEMORY: number = 4;
    public static TYPE_GAME_LLK: number = 5;
    public static TYPE_GAME_SHPK: number = 6;

    public static GAME_TYPE_1: number = 5;//连连看
    public static GAME_TYPE_2: number = 4;//记忆翻牌
    public static GAME_TYPE_3: number = 6;//数独

    constructor() {
        this._taskDic = new SimpleDictionary();
    }

    public get themeType(): string {
        if (this._configActId == "") {
            let cfg = TempleteManager.Instance.getConfigInfoByConfigName("CarnivalTabControl");
            if (cfg) {
                this._configActId = cfg.ConfigValue;
            }
        }
        return this._configActId;
    }

    /**获取主题子资源 */
    public getThemeFolderImgPath(type: CARNIVAL_FOLDER, name: string, fileType: string = ".png"): string {
        let theme = this.themeType;
        return PathManager.getCarnivalFolderPath(theme, type, name, fileType);
    }

    /**获取猪蹄资源 */
    public getThemeImgPath(name: string, fileType: string = ".png"): string {
        let theme = this.themeType;
        return PathManager.getCarnivalPath(theme, name, fileType);
    }

    public getTaskInfo(tId: number): CarnivalTaskInfo {
        if (!this._taskDic) {
            return null;
        }
        return this._taskDic[tId];
    }

    public putTaskInfo(info: CarnivalTaskInfo): void {
        if (!this._taskDic) {
            this._taskDic = new SimpleDictionary();
        }
        this._taskDic.add(info.taskId, info);
    }

    public getAllTaskInfo(): Array<CarnivalTaskInfo> {
        if (!this._taskDic) return [];
        return this._taskDic.getList();
    }

    /**积分奖励 */
    public hasScoreRewardInfoAward(): boolean {
        let _tempList = TempleteManager.Instance.getCarnivalByType(CarnivalModel.TYPE_AWARD);

        var hasRewardStr: string = this.scoreRewardInfo;
        var hasRewardList: Array<string> = hasRewardStr.split(",");

        let len = _tempList.length;
        let tInfo: t_s_carnivalpointexchangeData;
        let awardState = false;
        for (let i = 0; i < len; i++) {
            tInfo = _tempList[i];
            let findId = tInfo.Id + "";
            if (hasRewardList.indexOf(findId) != -1) {
                awardState = false;
            } else {
                if (tInfo.Target <= this.score) {
                    awardState = true;
                    break;
                }
            }
        }
        return awardState;
    }

    /**
     * 是否有游戏收益次数
     * @returns 
     */
    public hasGameCounts(): boolean {
        let hasCount: boolean = false;
        let cfg = TempleteManager.Instance.getConfigInfoByConfigName("CarnivalGameCount");
        if (!cfg) return;
        let countsValue: Array<string> = cfg.ConfigValue.split(",");
        for (var i: number = 1; i < 4; i++) {
            let tempInfo = TempleteManager.Instance.getCarnivalByType(i + CarnivalModel.TypeAdd);
            let tempData = null;
            if (tempInfo.length) {
                tempData = tempInfo[0]
            }
            let selectType = tempData.Type - CarnivalModel.TypeAdd;
            if (this.gameInfo != "") {
                var list: Array<string> = this.gameInfo.split("|");
                var arr: Array<string>;
                var isFind: boolean = false;
                for (let key in list) {
                    if (Object.prototype.hasOwnProperty.call(list, key)) {
                        let str = list[key];
                        arr = str.split(",");
                        if (Number(arr[0]) == tempData.Type) {
                            isFind = true;
                            var leftNum: number = Number(countsValue[selectType - 1]) - Number(arr[1]);
                            if (leftNum < 0) leftNum = 0;
                            if (leftNum > 0) {
                                hasCount = true;
                                break;
                            }
                        }
                    }
                }
                if (!isFind) {
                    var leftNum: number = Number(countsValue[selectType - 1]);
                    if (leftNum > 0) {
                        hasCount = true;
                        break;
                    }
                }
            } else {
                var leftNum: number = Number(countsValue[selectType - 1]);
                if (leftNum > 0) {
                    hasCount = true;
                    break;
                }
            }
        }
        return hasCount;
    }

    /**
     * 幸运夺宝
     * @returns 
     */
    public hasLuckyDarwCount(): boolean {
        let _goodId = 0;
        let cfg = TempleteManager.Instance.getConfigInfoByConfigName("CarnivalLuckyDraw");
        if (cfg) {
            let list: Array<string> = cfg.ConfigValue.split(",");
            _goodId = parseInt(list[0]);
        }
        let hasNum: number = 0;
        if (_goodId > 0) {
            hasNum = GoodsManager.Instance.getGoodsNumByTempId(_goodId);
        }
        return hasNum > 0;
    }

    /**
     * 每日挑战
     * @returns 
     */
    public hasDayTaskReward(): boolean {
        let hasReward: boolean = false;
        var list: Array<CarnivalTaskInfo> = this.getAllTaskInfo();
        let count = list.length;
        for (let index = 0; index < count; index++) {
            let value = list[index];
            let _tempInfo: t_s_carnivaldailychallengeData = TempleteManager.Instance.getCarnivalDailyChallengeTempInfo(value.taskId);
            if (_tempInfo) {
                if (!value.isReward && _tempInfo.Para1 <= value.data) {
                    hasReward = true;
                    break;
                }
            }
        }
        return hasReward;
    }

    /**
     * 特惠礼包免费礼包
     * @returns 
     */
    public hasFreeDiscount(): boolean {
        let hasRewardState: boolean = false;

        let dicLimit = new Dictionary();
        let limitArr: Array<string>;
        let limitInfo = TempleteManager.Instance.getConfigInfoByConfigName("carnival_buy_gift_limit");
        if (limitInfo != null) {
            limitArr = limitInfo.ConfigValue.split("|");
            let temArr: Array<string>;
            for (const key in limitArr) {
                if (Object.prototype.hasOwnProperty.call(limitArr, key)) {
                    let str: string = limitArr[key];
                    temArr = str.split(",");
                    dicLimit[temArr[0]] = parseInt(temArr[1]);
                }
            }
        }

        var hasRewardStr: string = this.giftBuyInfo;
        var hasRewardList: Array<string> = hasRewardStr.split("|");//【id,num | ...】
        var dicBuy: Dictionary = new Dictionary();
        var temArr: Array<string>;
        for (let key in hasRewardList) {
            if (Object.prototype.hasOwnProperty.call(hasRewardList, key)) {
                let str = hasRewardList[key];
                temArr = str.split(",");
                dicBuy[temArr[0]] = Number(temArr[1]);
            }
        }

        let _tempList = TempleteManager.Instance.getCarnivalByType(CarnivalModel.TYPE_DAYGIFT);
        var len: number = _tempList ? _tempList.length : 0;
        var _tempInfo: t_s_carnivalpointexchangeData;
        for (var i: number = 0; i < len; i++) {
            _tempInfo = _tempList[i];
            if (_tempInfo) {
                var findId: string = "" + _tempInfo.Id;
                var maxNum: number = dicLimit[findId];
                var hasByNum: number = 0;
                if (dicBuy[findId]) {
                    hasByNum = Number(dicBuy[findId]);
                } else {
                    hasByNum = 0;
                }
                var leftNum: number = maxNum - hasByNum;
                if (leftNum < 0) leftNum = 0;
                //刷新次数
                if (_tempInfo.Target == 0 && _tempInfo.Price == 0 && leftNum > 0) {//免费购买
                    hasRewardState = true;
                    break;
                }
            }
        }

        return hasRewardState;
    }

    /**
     * 在线奖励
     * @returns 
     */
    public hasOnlineReward(): boolean {
        let rewardState: boolean = false;
        let tempList = TempleteManager.Instance.getCarnivalByType(CarnivalModel.TYPE_ONLINE);
        var hasRewardStr: string = this.onlineRewardInfo;
        var hasRewardList: Array<string> = hasRewardStr.split(",");
        let tempCount = tempList.length;
        let onLineTimes: number = (new Date().getTime() - this.openFrameTime) / 1000 / 60;
        onLineTimes += this.dayOnline;
        for (let index = 0; index < tempCount; index++) {
            let tempInfo = tempList[index];
            if (tempInfo) {
                var findId: string = "" + tempInfo.Id;
                if (hasRewardList.indexOf(findId) != -1) {
                    rewardState = false;
                } else {
                    if (tempInfo.Target <= onLineTimes) {
                        rewardState = true;
                        break;
                    } else {
                        rewardState = false;
                    }
                }
            }
        }
        return rewardState;
    }

    /**
     * 充值有礼
     * @returns 
     */
    public hasLeftlotteryCount(): boolean {
        let flag:boolean;
        if(this.lotteryCount >0){
            flag = true;
        }
        return flag;
    }

}
