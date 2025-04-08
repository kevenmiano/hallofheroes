// @ts-nocheck
import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import { SimpleDictionary } from '../../../core/utils/SimpleDictionary';
import { RewardConditionType } from '../../constant/RewardConditionType';
import { ArmyPawn } from '../../datas/ArmyPawn';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import { GoodsManager } from '../../manager/GoodsManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { PlayerManager } from '../../manager/PlayerManager';
import RingTaskManager from '../../manager/RingTaskManager';
import OfferRewardTemplate from '../offerReward/OfferRewardTemplate';
import { t_s_rewardcondictionData } from '../../config/t_s_rewardcondiction';
import LangManager from '../../../core/lang/LangManager';
import RewardInfo = com.road.yishi.proto.reward.RewardInfo;
import { RingTaskEvent, DictionaryEvent, NotificationEvent, PawnEvent } from '../../constant/event/NotificationEvent';
export class RingTask extends GameEventDispatcher {
    public sortFlag: boolean;
    /** 环任务的模版 跟悬赏任务共用一套模版 */
    private _ringTaskTemp: OfferRewardTemplate;
    /** 当前环任务的模版ID */
    private _currTaskId: number;
    /** 当前的任务信息 */
    private _currTask: RewardInfo;
    /** 在任务追踪面板中进行排序用   -2悬赏 -1环任务  0主线 1日常 2活动 3VIP*/
    public TemplateType: number = -1;
    /** 任务的进度 */
    private _progress: any[];
    /** 环任务完成条件 */
    private _conditionList: any[];
    /**  环任务奖励*/
    private _rewardList: any[];
    /** 是否完成 */
    public hasCompleted: boolean = false;
    /** 改变时间 */
    private _changeDate: number = 0;

    public Sort: number = 0;

    public isNew: boolean;
    /** 奖励的物品列表 */
    private _rewardGoodsList: any[];
    public get rewardGoodsList(): any[] {
        return this._rewardGoodsList;
    }
    public set rewardGoodsList(value: any[]) {
        this._rewardGoodsList = value;
    }
    /**
     *悬赏任务标题 
     * @return 
     * 
     */
    public get TitleLang(): string {
        return this._ringTaskTemp.TitleLang;
    }

    public get conditionList(): t_s_rewardcondictionData[] {
        return this._ringTaskTemp.conditionList;
    }

    public get rewardList(): any[] {
        return this._ringTaskTemp.rewardItemList;
    }

    public get ringTaskTemp(): OfferRewardTemplate {
        return this._ringTaskTemp;
    }

    public set ringTaskTemp(value: OfferRewardTemplate) {
        this._ringTaskTemp = value;
    }

    public get currTaskId(): number {
        return this._currTaskId;
    }

    public set currTaskId(value: number) {
        this._currTaskId = value
    }

    public get currTask(): RewardInfo {
        return this._currTask;
    }

    public set currTask(value: RewardInfo) {
        this._currTask = value
    }

    public getProgress(): any[] {
        var tempArr: any[] = [];
        var len: number = this.ringTaskTemp.conditionList.length;
        for (var i: number = 0; i < len; i++) {
            var str: string;
            var conditionTemp: t_s_rewardcondictionData = this.ringTaskTemp.conditionList[i];
            switch (conditionTemp.CondictionType) {
                case RewardConditionType.GIVE_PAWNS:  //缴兵
                    str = this.checkPawnsCount(conditionTemp);
                    break;
                case RewardConditionType.STRENGTHEN:  //装备强化
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.MOSAIC:  //镶嵌宝石
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.COLLECTION:  //采集
                    str = this.checkGoodsCount(conditionTemp);
                    break;
                case RewardConditionType.CHARGE:  //神树充能
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.ASTROLOGY:  //占星
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.KILL_MONSTER:  //大地图或副本杀怪
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.PLUNDER:  //掠夺宝藏
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.DONATE:  //公会捐献
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.SYNTHESIS:  //合成物品
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.CONSUME:  //商城消费
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.QTE:  //进行qte
                    str = this.checkQteResult();
                    break;
                case RewardConditionType.ARREST_MONSTER:  //击杀怪物
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.ARREST_HERO:  //击杀英雄
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.HAMSTER_GAME:
                    str = this.checkHamsterGameResult(conditionTemp); //地鼠游戏
                    break;
                case RewardConditionType.TALKTASK:   //送信、对话
                    str = this.checkTalkSetp();
                    break;
                case RewardConditionType.KILLPETMONSTER:  //击杀宠物岛英灵
                    str = this.checkCount(conditionTemp, i);
                    break;
                case RewardConditionType.KILLDUPLICATEMONSTER: //击杀副本怪物
                    str = this.checkDuplicatemonster(this.currTask.condition_1, this.currTask.condition_4);
                    break;
                case RewardConditionType.COMMITITEM: //提交物品
                    str = this.checkGoodsCount2(this.currTask.condition_3);
                    break;
                case RewardConditionType.PETSACRIFICE: //英灵祭献
                    str = this.checkCount(conditionTemp, i);
                    break;
                default:
                    str = LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress01");
            }
            tempArr[i] = str;
        }

        return tempArr;
    }


    private checkDuplicatemonster(curr: number, max: number): string {
        var str: string = "";
        if (curr >= max) {
            str = LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
        }
        else {
            str = " (" + curr + "/" + max + ")";
        }
        return str;
    }


    public get NeedFightId(): number {
        return this._ringTaskTemp.NeedFightId;
    }

    private checkGoodsCount2(templeteId: number): string {
        var str: string = "";
        if (this.getflag(templeteId)) {
            str = LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
        }
        else {
            this.hasCompleted = false;
            str = " (0/1)";
        }
        return str;
    }

    public set changeDate(value: number) {
        this._changeDate = value;
    }

    public get changeDate(): number {
        return this._changeDate;
    }


    private _talkTaskState: boolean = false;

    public get talkTaskState(): boolean {
        return this._talkTaskState;
    }

    public set talkTaskState(value: boolean) {
        if (this._talkTaskState == value) return;
        this._talkTaskState = value;
        if (this._talkTaskState) {
            this.commit();
            RingTaskManager.Instance.updataState();
        }
    }

    /** 检查对话任务是否完成 */
    public checkTalkSetp(): string {
        var str: string = "";
        if (this.currTask) {
            if (this._talkTaskState) {
                str = LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
            } else {
                this.hasCompleted = false;
                str = LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress01");
            }
            if (this.currTask.condition_1 >= 1) {
                this.hasCompleted = true;
                str = LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
            }
        }
        return str;
    }

    /**
     *是否完成（不同于RewardInfo的isComplete） 
     */
    public get isCompleted(): boolean {
        if (this.ringTaskTemp.Type == 3) {
            return false;
        } else {
            var progress: any[] = this.getProgress();
            for (var i: number = 0; this.ringTaskTemp.conditionList[i] != null; i++) {
                if (progress[i] != LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress")) {
                    return false;
                }
            }
            return true;
        }

    }

    /**
     *QTE是否完成（QTE任务才用到） 
     */
    private _qteResult: boolean = false;
    public get qteResult(): boolean {
        return this._qteResult;
    }
    public set qteResult(value: boolean) {
        if (this._qteResult == value) return;
        this._qteResult = value;
        if (this._qteResult) {
            this.commit();
            RingTaskManager.Instance.updataState();
        }
    }

    private checkQteResult(): string {
        if (this._qteResult)
            return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
        else
            return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress01");
    }

    /** 某兵种士兵数量（缴兵任务才用到） */
    private _pawnsNum: number = -1;
    /** 兵种 */
    private __pawnsChangeHandler(e: ArmyPawn) {
        var pawn: ArmyPawn = e;
        var nowPawnsNum: number = ArmyManager.Instance.getTotalPawnsNumberBySonType(pawn.templateInfo.SonType);
        if (this._pawnsNum != nowPawnsNum && (this._pawnsNum < this.conditionList[0].Para2 || nowPawnsNum < this.conditionList[0].Para2)) {
            if (nowPawnsNum < this.conditionList[0].Para2) {
                this.hasCompleted = false;
            } else {
                this.hasCompleted = true;
                // RingTaskManager.Instance.updataState();
            }

            this._pawnsNum = nowPawnsNum;
            this.commit();
        }
    }

    private checkPawnsCount(conditionTemp: t_s_rewardcondictionData): string {
        var pawnsNum: number = ArmyManager.Instance.getTotalPawnsNumberBySonType(conditionTemp.Para1);
        if (pawnsNum >= conditionTemp.Para2)
            return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
        return " (" + pawnsNum.toString() + "/" + conditionTemp.Para2.toString() + ")";

    }


    /**
     *打地鼠游戏 
     */

    private _hamsterGameResult: boolean = false;
    public get hamsterGameResult(): boolean {
        return this._hamsterGameResult;
    }
    public set hamsterGameResult(value: boolean) {
        if (this._hamsterGameResult == value) return;
        this._hamsterGameResult = value;
        if (this._hamsterGameResult) {
            this.commit();
            RingTaskManager.Instance.updataState();
        }
    }
    private checkHamsterGameResult(conditionTemp: t_s_rewardcondictionData): string {
        if (this._hamsterGameResult)
            return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
        else
            return " (0/" + conditionTemp.Para2 + ")";
    }


    /** 采集 */
    private checkGoodsCount(conditionTemp: t_s_rewardcondictionData): string {
        var count: number = GoodsManager.Instance.getGoodsNumByTempId(conditionTemp.Para1);
        count += this.getCount(conditionTemp.Para1);
        if (count >= conditionTemp.Para2)
            return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
        return " (" + count + "/" + conditionTemp.Para2 + ")";
    }



    public commit() {
        this.ringTaskManager.dispatchEvent(RingTaskEvent.REFRESHRING, this);
    }


    /** 添加监听 */
    public addConditionListener() {
        for (let i: number = 0; i < this.conditionList.length; i++) {
            let conTemp: t_s_rewardcondictionData = this.conditionList[i];
            this.addListenerByCondition(conTemp);
        }
    }

    /** 条件判断 */
    private checkCount(conditionTemp: t_s_rewardcondictionData, index: number): string {
        if (this.currTask) {
            if (this.currTask["condition_" + (index + 1)] >= conditionTemp.Para2) {
                return LangManager.Instance.GetTranslation("buildings.offerreward.data.BaseOfferReward.progress");
            }
            return " (" + this.currTask["condition_" + (index + 1)] + "/" + conditionTemp.Para2 + ")";
        }
        return "";
    }

    /** 移除监听 */
    public removeConditionListener() {
        this.goodsCountByTempId.removeEventListener(DictionaryEvent.ADD, this.__goodsChangeHandler, this);
        this.goodsCountByTempId.removeEventListener(DictionaryEvent.DELETE, this.__goodsChangeHandler, this);
        this.goodsCountByTempId.removeEventListener(DictionaryEvent.UPDATE, this.__goodsChangeHandler, this);
        this.goodsCountByTempId.removeEventListener(DictionaryEvent.ADD, this.__goodsChangeHandler2, this);
        this.goodsCountByTempId.removeEventListener(DictionaryEvent.UPDATE, this.__goodsChangeHandler2, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.TALKRINGTASK_COMPLETE, this.__talkTaskComplete, this);
        let list = ArmyManager.Instance.castlePawnList.getList();
        list.forEach((ap: ArmyPawn) => {
            ap.removeEventListener(PawnEvent.PAWN_PROPERTY_CHAGER, this.__pawnsChangeHandler, this);
        });
    }

    private addListenerByCondition(temp: t_s_rewardcondictionData) {
        switch (temp.CondictionType) {
            case RewardConditionType.GIVE_PAWNS:  //缴兵
                this.getCastlePawnBySonType(temp.Para1).addEventListener(PawnEvent.PAWN_PROPERTY_CHAGER, this.__pawnsChangeHandler, this);
                break;
            case RewardConditionType.COLLECTION:  //采集
                this.goodsCountByTempId.addEventListener(DictionaryEvent.ADD, this.__goodsChangeHandler2, this);
                this.goodsCountByTempId.addEventListener(DictionaryEvent.UPDATE, this.__goodsChangeHandler2, this);
                break;
            case RewardConditionType.TALKTASK:
                NotificationManager.Instance.addEventListener(NotificationEvent.TALKRINGTASK_COMPLETE, this.__talkTaskComplete, this);
                break;
            case RewardConditionType.COMMITITEM:
                if (this.getflag(this.currTask.condition_3)) {
                    this.commit();
                    return;
                } else {
                    this.goodsCountByTempId.addEventListener(DictionaryEvent.ADD, this.__goodsChangeHandler, this);
                    this.goodsCountByTempId.addEventListener(DictionaryEvent.DELETE, this.__goodsChangeHandler, this);
                    this.goodsCountByTempId.addEventListener(DictionaryEvent.UPDATE, this.__goodsChangeHandler, this);
                }
                break;
        }
    }

    /** 提交物品任务, 判断背包中是否有这个物品 */
    private getflag(templeteId: number): boolean {
        var goodsInfo: GoodsInfo = GoodsManager.Instance.getBagGoodsByTemplateId(templeteId)[0];
        if (goodsInfo) {
            if (goodsInfo.count >= 1) {
                return true;
            }
        }
        return false;
    }

    private __talkTaskComplete(e: NotificationEvent) {
        RingTaskManager.Instance.updataState();
        this.talkTaskState = true;
    }

    private __goodsChangeHandler(arr: any[]) {
        if (arr[2] == this.currTask.condition_3) {
            if (this.goodsCountByTempId[this.currTask.condition_3] >= 1) {
            }
            this.commit();
        }
    }

    private __goodsChangeHandler2(arr: any[]) {
        for (let i: number = 0; i < this.conditionList.length; i++) {
            var conTemp: t_s_rewardcondictionData = this.conditionList[i];
            if (conTemp.Para1 == arr[2]) {
                if (this.goodsCountByTempId[conTemp.Para1] + this.getCount(conTemp.Para1) < conTemp.Para2)
                    this.hasCompleted = false;
                this.commit();
                return;
            }
        }
    }

    private getCount(templateId: number): number {
        var count: number = 0;
        for (let key in this.consortiaGoodsCount) {
            if (Object.prototype.hasOwnProperty.call(this.consortiaGoodsCount, key)) {
                let info: GoodsInfo = this.consortiaGoodsCount[key];
                if (info.templateId == templateId) {
                    count += info.count;
                }
            }
        }
        return count;
    }

    private get ringTaskManager(): RingTaskManager {
        return RingTaskManager.Instance;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get goodsCountByTempId(): SimpleDictionary {
        return GoodsManager.Instance.goodsCountByTempId;
    }

    private get consortiaGoodsCount(): SimpleDictionary {
        return GoodsManager.Instance.consoritaBagList;
    }

    private getCastlePawnBySonType(sontype: number): ArmyPawn {
        return ArmyManager.Instance.castlePawnList[sontype];
    }
}