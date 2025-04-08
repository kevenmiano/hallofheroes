import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { RewardEvent } from "../../constant/event/NotificationEvent";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import BaseOfferReward from "../../module/offerReward/BaseOfferReward";

export class OfferRewardModel extends GameEventDispatcher {
  /**
   *开放悬赏等级
   */
  public static OPEN_REWARD_GRADE: number = 14;
  /**
   *每日基本悬赏次数
   */
  public static BASE_REWARD_COUNT: number = 20;
  /**
   *最大悬赏任务列表数量
   */
  public static MAX_OFFER_TASK_NUM: number = 5;
  /**
   *自动刷新悬赏列表间隔（秒）
   */
  public static AUTO_REFRESH_INTERVAL: number = 1800;
  /**
   *付费刷新悬赏需要支付钻石
   */
  public static REFRESH_REWARD_NEEDPAY: number = 2;
  /**
   *悬赏状态_可接受
   */
  public static REWARD_STATE_CANACCEPT: number = 1;
  /**
   *悬赏状态_已接受
   */
  public static REWARD_STATE_ACCEPTED: number = 2;
  /**
   *悬赏状态_已完成
   */
  public static REWARD_STATE_COMPLETED: number = 3;
  /**
   *悬赏状态_可领奖 客户端增加的状态
   */
  public static REWARD_STATE_REACH_ALLCONDITION: number = 4;
  /**
   *是否登陆
   */
  public static isLogin: boolean = true;
  /**
   *是否第一次付费刷新
   */
  public static isFirstPay: boolean = true;
  /**
   *每日最大悬赏次数
   */
  public maxRewardCount: number = 20;
  /**
   *免费刷新悬赏列表次数
   */
  public freeRefreshCount: number;
  /**
   *悬赏任务模板列表
   */
  private _rewardTempDic: any;

  private _remainTime: number;
  constructor() {
    super();
    this.initData();
  }

  private initData() {
    this._rewardTempDic = TempleteManager.Instance.offerRewardTemplateDic();
    this._baseRewardDic = new SimpleDictionary();
  }

  private __updateHandler() {
    --this._remainTime;
    this.dispatchEvent(Laya.Event.CHANGE);
    if (this.remainTime <= 0) {
      this.dispatchEvent(Laya.Event.COMPLETE);
      Laya.timer.clear(this, this.__updateHandler);
    }
  }

  public set remainTime(value: number) {
    this._remainTime = value;
    this.dispatchEvent(Laya.Event.CHANGE);
    if (this._remainTime > 0) {
      Laya.timer.loop(1000, this, this.__updateHandler);
    }
  }

  public get remainTime(): number {
    return this._remainTime;
  }

  /**
   * 是否存在悬赏数据, 主动向服务器请求后才会推过来
   */
  public get hasData(): boolean {
    return this._lastRefreshRewardListDate ? true : false;
  }

  public get remainRewardCount(): number {
    return this.maxRewardCount - this.thane.rewardCount > 0
      ? this.maxRewardCount - this.thane.rewardCount
      : 0;
  }

  public get rewardTempDic(): any {
    return this._rewardTempDic;
  }

  /**
   *已接悬赏任务列表
   */
  private _baseRewardDic: SimpleDictionary;
  public get baseRewardDic(): SimpleDictionary {
    return this._baseRewardDic;
  }

  /**
   *悬赏任务列表
   */
  private _offerRewardTaskDic: SimpleDictionary;
  public get offerRewardTaskDic(): SimpleDictionary {
    return this._offerRewardTaskDic;
  }
  public set offerRewardTaskDic(value: SimpleDictionary) {
    if (this._offerRewardTaskDic == value) return;
    if (this._offerRewardTaskDic) this._offerRewardTaskDic.clear();
    this._offerRewardTaskDic = value;
  }

  private _offerRewardTaskIndex: SimpleDictionary;
  public get offerRewardTaskIndex(): SimpleDictionary {
    return this._offerRewardTaskIndex;
  }

  public set offerRewardTaskIndex(value: SimpleDictionary) {
    if (this._offerRewardTaskIndex == value) return;
    if (this._offerRewardTaskIndex) this._offerRewardTaskIndex.clear();
    this._offerRewardTaskIndex = value;
  }
  /**
   *悬赏任务状态列表
   * state:number, 1为可接受, 2为已接受, 3为已完成
   */
  private _offerRewardTaskStateDic: SimpleDictionary;
  public get offerRewardTaskStateDic(): SimpleDictionary {
    return this._offerRewardTaskStateDic;
  }
  public set offerRewardTaskStateDic(value: SimpleDictionary) {
    if (this._offerRewardTaskStateDic == value) return;
    if (this._offerRewardTaskStateDic) this._offerRewardTaskStateDic.clear();
    this._offerRewardTaskStateDic = value;
  }

  /**
   *悬赏任务品质列表
   */
  private _offerRewardTaskProfileDic: SimpleDictionary;
  public get offerRewardTaskProfileDic(): SimpleDictionary {
    return this._offerRewardTaskProfileDic;
  }
  public set offerRewardTaskProfileDic(value: SimpleDictionary) {
    if (this._offerRewardTaskProfileDic == value) return;
    if (this._offerRewardTaskProfileDic)
      this._offerRewardTaskProfileDic.clear();
    this._offerRewardTaskProfileDic = value;
  }

  /**
   *上次刷新悬赏任务列表时间
   */
  private _lastRefreshRewardListDate: Date;
  public set lastRefreshRewardListDate(value: Date) {
    if (this._lastRefreshRewardListDate == value) return;
    this._lastRefreshRewardListDate = value;
  }
  public get lastRefreshRewardListTime(): number {
    if (this._lastRefreshRewardListDate)
      return this._lastRefreshRewardListDate.getTime();
    return 0;
  }

  /**
   *距离刷新剩余时间
   * @return time（秒）
   *
   */
  public get refreshRemainTime(): number {
    if (this._lastRefreshRewardListDate) {
      var remainTime: number =
        OfferRewardModel.AUTO_REFRESH_INTERVAL -
        (this.playerModel.sysCurTimeBySecond -
          this._lastRefreshRewardListDate.getTime() / 1000);
      if (remainTime > 0)
        //
        return remainTime > 1800 ? 1800 : remainTime;
      else return 0;
    }
    return 0;
  }

  /**
   *是否需要重置（每日5点重置）
   */
  private _isNeedReset: boolean = false;
  public get isNeedReset(): boolean {
    return this._isNeedReset;
  }

  public set isNeedReset(value: boolean) {
    if (this._isNeedReset == value) return;
    this._isNeedReset = value;
    if (this._isNeedReset)
      this.dispatchEvent(RewardEvent.NEED_RESET_DATA, null);
  }

  /**
   *是否有完成的任务
   * @return
   *
   */
  public get hasCompletedTask(): boolean {
    for (let index = 0; index < this._baseRewardDic.keys.length; index++) {
      let key = this._baseRewardDic.keys[index];
      let baseReward = this._baseRewardDic[key] as BaseOfferReward;
      if (baseReward.isCompleted) return true;
    }
    return false;
  }

  public hasTaskAndNotCompleted(taskTempId: number): boolean {
    var result: boolean = false;
    for (let index = 0; index < this._baseRewardDic.keys.length; index++) {
      let key = this._baseRewardDic.keys[index];
      let baseReward = this._baseRewardDic[key] as BaseOfferReward;
      if (
        baseReward.rewardTemp &&
        baseReward.rewardTemp.TemplateId == taskTempId &&
        !baseReward.isCompleted
      ) {
        result = true;
        break;
      }
    }
    return result;
  }

  public getAcceptTaskTemp(templateId: number): BaseOfferReward {
    let baseRewardDic = this._baseRewardDic;
    for (let index = 0; index < baseRewardDic.keys.length; index++) {
      let key = baseRewardDic.keys[index];
      let baseReward = baseRewardDic[key] as BaseOfferReward;
      if (
        baseReward.rewardTemp &&
        baseReward.rewardTemp.TemplateId == templateId
      ) {
        return baseReward;
      }
    }
    return null;
  }

  /**
   * 是否有橙色任务未完成
   * @return 是否有橙色任务未完成
   *
   */
  public get hasOrangeTaskNotComplete(): boolean {
    for (
      let index = 0;
      index < this.offerRewardTaskProfileDic.keys.length;
      index++
    ) {
      let key = this.offerRewardTaskProfileDic.keys[index];
      let baseReward = this.offerRewardTaskProfileDic[key];
      if (baseReward > 4 && this.offerRewardTaskStateDic[key] == 1) {
        //橙色可接受
        return true;
      }
    }
    return false;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
