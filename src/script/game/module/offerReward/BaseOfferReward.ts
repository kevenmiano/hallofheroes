import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import {
  RewardEvent,
  DictionaryEvent,
  PawnEvent,
} from "../../constant/event/NotificationEvent";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { ArmyManager } from "../../manager/ArmyManager";
import { ConfigManager } from "../../manager/ConfigManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { KingContractManager } from "../../manager/KingContractManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import { PlayerManager } from "../../manager/PlayerManager";
import OfferRewardTemplate from "./OfferRewardTemplate";
import LangManager from "../../../core/lang/LangManager";
import { t_s_rewardcondictionData } from "../../config/t_s_rewardcondiction";
//@ts-expect-error: External dependencies

import RewardInfo = com.road.yishi.proto.reward.RewardInfo;
import { RewardConditionType } from "../../constant/RewardConditionType";
import { KingContractInfo } from "../kingcontract/KingContractInfo";
export default class BaseOfferReward extends GameEventDispatcher {
  /**
   *改变时间（有进度任务排序用）
   */
  public changeDate: number = 0;
  /**
   *任务模板配的排序（0为最前）
   */
  public Sort: number = 0;
  public isNew: boolean = false;
  public sortFlag: boolean = false;
  /**
   *任务类型排序, 从小到大, 悬赏-2,主线0, 日常1, 活动2, VIP3（不能改变该值, 影响排序顺序）
   */
  private _TemplateType: number = -2;
  public get TemplateType(): number {
    return this._TemplateType;
  }

  constructor() {
    super();
  }

  /**
   *悬赏任务ID
   */
  private _rewardID: number = 0;
  public get rewardID(): number {
    return this._rewardID;
  }
  public set rewardID(value: number) {
    this._rewardID = value;
  }

  /**
   *悬赏任务模板
   */
  private _rewardTemp: OfferRewardTemplate;
  public get rewardTemp(): OfferRewardTemplate {
    return this._rewardTemp;
  }
  public set rewardTemp(value: OfferRewardTemplate) {
    if (this._rewardTemp == value) return;
    this._rewardTemp = value;
  }

  /**
   *悬赏任务信息
   */
  private _rewardInfo: RewardInfo;
  public get rewardInfo(): RewardInfo {
    return this._rewardInfo;
  }

  public set rewardInfo(value: RewardInfo) {
    if (this._rewardInfo == value) return;
    this._rewardInfo = value;
    this.dispatchEvent(RewardEvent.REWARD_TASK_UPDATE, this);
  }

  /**
   *悬赏任务完成条件列表
   * @return
   *
   */
  public get conditionList(): any[] {
    return this._rewardTemp.conditionList;
  }

  /**
   *悬赏任务奖励物品列表
   * @return
   *
   */
  public get rewardItemList(): any[] {
    return this._rewardTemp.rewardItemList;
  }

  /**
   *悬赏任务标题
   * @return
   *
   */
  public get TitleLang(): string {
    return this._rewardTemp.TitleLang;
  }

  /**
   *悬赏任务副本ID
   * @return
   *
   */
  public get NeedFightId(): number {
    return this._rewardTemp.NeedFightId;
  }

  /**
   *悬赏任务品质
   * @return
   *
   */
  public get profile(): number {
    return this._rewardInfo.quality;
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
    if (this._qteResult) this.commit();
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
    if (this._hamsterGameResult) this.commit();
  }

  /**
   *某兵种士兵数量（缴兵任务才用到）
   */
  private _pawnsNum: number = 0;

  /**
   *是否已经完成
   */
  public hasCompleted: boolean = false;

  /**
   *是否完成（不同于RewardInfo的isComplete）
   */
  public get isCompleted(): boolean {
    let progress: any[] = this.getProgress();
    for (let i: number = 0; this.rewardTemp.conditionList[i] != null; i++) {
      if (
        progress[i] !=
        LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        )
      ) {
        return false;
      }
    }
    return true;
  }

  private get kingInfo(): KingContractInfo {
    return KingContractManager.Instance.model.getInfoById(2);
  }

  /**
   *任务进度
   * @return
   *
   */
  public getProgress(): any[] {
    if (this.kingInfo && this.kingInfo.leftTime > 0)
      return [
        LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        ),
      ];
    let tempArr: any[] = [];
    let len: number = this.rewardTemp.conditionList.length;
    for (let i: number = 0; i < len; i++) {
      let str: string;
      let conditionTemp: t_s_rewardcondictionData =
        this.rewardTemp.conditionList[i];
      switch (conditionTemp.CondictionType) {
        case RewardConditionType.GIVE_PAWNS: //缴兵
          str = this.checkPawnsCount(conditionTemp);
          break;
        case 2: //装备强化
          str = this.checkCount(conditionTemp, i);
          break;
        case 3: //镶嵌宝石
          str = this.checkCount(conditionTemp, i);
          break;
        case RewardConditionType.COLLECTION: //采集
          str = this.checkGoodsCount(conditionTemp);
          break;
        case 5: //神树充能
          str = this.checkCount(conditionTemp, i);
          break;
        case 6: //占星
          str = this.checkCount(conditionTemp, i);
          break;
        case 7: //大地图或副本杀怪
          str = this.checkCount(conditionTemp, i);
          break;
        case 8: //掠夺宝藏
          str = this.checkCount(conditionTemp, i);
          break;
        case 9: //公会捐献
          str = this.checkCount(conditionTemp, i);
          break;
        case 10: //合成物品
          str = this.checkCount(conditionTemp, i);
          break;
        case 11: //商城消费
          str = this.checkCount(conditionTemp, i);
          break;
        case RewardConditionType.QTE: //进行qte
          str = this.checkQteResult();
          break;
        case RewardConditionType.ARREST_MONSTER: //击杀怪物
          str = this.checkCount(conditionTemp, i);
          break;
        case RewardConditionType.ARREST_HERO: //击杀英雄
          str = this.checkCount(conditionTemp, i);
          break;
        case RewardConditionType.HAMSTER_GAME:
          str = this.checkHamsterGameResult(conditionTemp); //地鼠游戏
          break;
        default:
          str = LangManager.Instance.GetTranslation(
            "buildings.offerreward.data.BaseOfferReward.progress01",
          );
      }
      tempArr[i] = str;
    }
    return tempArr;
  }

  /**
   * 添加任务进度监听
   */
  public addConditionListener() {
    for (let key in this.conditionList) {
      if (Object.prototype.hasOwnProperty.call(this.conditionList, key)) {
        let conTemp: t_s_rewardcondictionData = this.conditionList[key];
        this.addListenerByCondition(conTemp);
      }
    }
  }

  /**
   *移除任务进度监听
   */
  public removeConditionListener() {
    this.goodsCountByTempId.removeEventListener(
      DictionaryEvent.ADD,
      this.__goodsChangeHandler,
      this,
    );
    this.goodsCountByTempId.removeEventListener(
      DictionaryEvent.DELETE,
      this.__goodsChangeHandler,
      this,
    );
    this.goodsCountByTempId.removeEventListener(
      DictionaryEvent.UPDATE,
      this.__goodsChangeHandler,
      this,
    );
    let list = ArmyManager.Instance.castlePawnList.getList();
    list.forEach((ap: ArmyPawn) => {
      ap.removeEventListener(
        PawnEvent.PAWN_PROPERTY_CHAGER,
        this.__pawnsChangeHandler,
        this,
      );
    });
  }

  public commit() {
    this.changeDate =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
    this.dispatchEvent(RewardEvent.REWARD_TASK_UPDATE, this);
    this.rewardManager.dispatchEvent(RewardEvent.REWARD_TASK_UPDATE, this);
  }

  private addListenerByCondition(temp: t_s_rewardcondictionData) {
    switch (temp.CondictionType) {
      case RewardConditionType.GIVE_PAWNS: //缴兵
        this.getCastlePawnBySonType(temp.Para1).addEventListener(
          PawnEvent.PAWN_PROPERTY_CHAGER,
          this.__pawnsChangeHandler,
          this,
        );
        break;
      case RewardConditionType.COLLECTION: //采集
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.ADD,
          this.__goodsChangeHandler,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.DELETE,
          this.__goodsChangeHandler,
          this,
        );
        this.goodsCountByTempId.addEventListener(
          DictionaryEvent.UPDATE,
          this.__goodsChangeHandler,
          this,
        );
        break;
    }
  }

  private __pawnsChangeHandler(e: ArmyPawn) {
    let pawn: ArmyPawn = e;
    let nowPawnsNum: number = ArmyManager.Instance.getTotalPawnsNumberBySonType(
      pawn.templateInfo.SonType,
    );
    if (
      this._pawnsNum != nowPawnsNum &&
      (this._pawnsNum < this.conditionList[0].Para2 ||
        nowPawnsNum < this.conditionList[0].Para2)
    ) {
      if (nowPawnsNum < this.conditionList[0].Para2) {
        this.hasCompleted = false;
      }
      this._pawnsNum = nowPawnsNum;
      this.commit();
    }
  }

  private __goodsChangeHandler(arr: any[]) {
    for (let i: number = 0; i < this.conditionList.length; i++) {
      let conTemp: t_s_rewardcondictionData = this.conditionList[i];
      if (conTemp.Para1 == parseInt(arr[2])) {
        if (this.goodsCountByTempId[conTemp.Para1] < conTemp.Para2) {
          this.hasCompleted = false;
        }
        this.commit();
        return;
      }
    }
  }

  private checkCount(
    conditionTemp: t_s_rewardcondictionData,
    index: number,
  ): string {
    if (this.rewardInfo) {
      if (this.rewardInfo["condition_" + (index + 1)] >= conditionTemp.Para2) {
        return LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        );
      }
      return (
        " (" +
        this.rewardInfo["condition_" + (index + 1)] +
        "/" +
        conditionTemp.Para2 +
        ") "
      );
    }
    return "";
  }

  private checkPawnsCount(conditionTemp: t_s_rewardcondictionData): string {
    let pawnsNum: number = ArmyManager.Instance.getTotalPawnsNumberBySonType(
      conditionTemp.Para1,
    );
    if (pawnsNum >= conditionTemp.Para2)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    return (
      " (" + pawnsNum.toString() + "/" + conditionTemp.Para2.toString() + ") "
    );
  }

  private checkGoodsCount(conditionTemp: t_s_rewardcondictionData): string {
    let count: number = GoodsManager.Instance.getGoodsNumByTempId(
      conditionTemp.Para1,
    );
    if (count >= conditionTemp.Para2)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    return " (" + count + "/" + conditionTemp.Para2 + ") ";
  }

  private checkQteResult(): string {
    if (this._qteResult)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    else
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress01",
      );
  }

  private checkHamsterGameResult(
    conditionTemp: t_s_rewardcondictionData,
  ): string {
    if (this._hamsterGameResult)
      return LangManager.Instance.GetTranslation(
        "buildings.offerreward.data.BaseOfferReward.progress",
      );
    else return " (0/" + conditionTemp.Para2 + ") ";
  }

  private get rewardManager(): OfferRewardManager {
    return OfferRewardManager.Instance;
  }

  private getCastlePawnBySonType(sontype: number): ArmyPawn {
    return ArmyManager.Instance.castlePawnList[sontype];
  }

  private get goodsCountByTempId(): SimpleDictionary {
    return GoodsManager.Instance.goodsCountByTempId;
  }
}
