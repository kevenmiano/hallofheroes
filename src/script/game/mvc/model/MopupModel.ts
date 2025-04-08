import {
  MopupEvent,
  NotificationEvent,
} from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";

export class MopupModel extends GameEventDispatcher {
  protected static MOPUP_LIST_REFRESH: string = "MOPUP_LIST_REFRESH";
  protected static MOPUP_END: string = "MOPUP_END";
  /**
   *副本ID
   */
  private _campaignId: number = 0;
  /**
   * 副本次数
   */
  private _mopupCount: number = 0;
  /**
   * 迷宫层数
   */
  private _mopupLayer: number = 0;
  /**
   * 是否处于扫荡状态
   */
  private _isMopup: boolean;
  /**
   * 返回结果列表
   * @ 	type:number 			响应类型 1 完成 2 未完成
   * 		gold:number 			得到的金钱
   * 		gp:number 				得到的经验
   * 		campaign_id:number 	副本ID
   * 		time:number			剩余时间
   * 		template_id:array 	得到的物品模板ID
   * 		cIndex:number 			迷宫扫荡当前层
   * 		eIndex:number			迷宫扫荡结束层
   */
  private _resultInfoList: any[];
  /**
   * 消耗时间
   */
  private _mopupTime: number = 0;
  /**
   * 剩余时间
   */
  private _mopupRemainTime: number = 0;
  /**
   * 消耗黄金
   */
  private _mopupPayGold: number = 0;
  /**
   * 累积经验
   */
  private _mopupExt: number = 0;
  /**
   * 扫荡是否结束
   */
  private _mopupEnd: boolean;
  /**
   * 是否正常结束
   */
  private _isNormalEnd: boolean = true;
  /**
   * 是否双倍效益
   */
  private _isDoubleProfit: number = 1;
  /**
   * 下线上线返回的物品列表
   */
  private _mopupGoods: any[];

  protected _changeObj: Map<string, boolean>;

  constructor() {
    super();
    this._changeObj = new Map();
  }

  public beginChanges() {
    this._changeObj.clear();
  }

  public set campaignId(value: number) {
    this._campaignId = value;
  }

  public get campaignId(): number {
    return this._campaignId;
  }

  public set mopupCount(value: number) {
    this._mopupCount = value;
  }

  public get mopupCount(): number {
    return this._mopupCount;
  }

  public set mopupLayer(value: number) {
    this._mopupLayer = value;
  }

  public get mopupLayer(): number {
    return this._mopupLayer;
  }

  public set resultInfoList(value: any[]) {
    this._resultInfoList = value;
    this._changeObj[MopupModel.MOPUP_LIST_REFRESH] = true;
  }

  public get resultInfoList(): any[] {
    return this._resultInfoList;
  }

  public set mopupExt(value: number) {
    this._mopupExt = value;
  }

  public get mopupExt(): number {
    return this._mopupExt;
  }

  public set mopupEnd(value: boolean) {
    this._mopupEnd = value;
    this._changeObj[MopupModel.MOPUP_END] = value;
  }

  public get mopupEnd(): boolean {
    return this._mopupEnd;
  }

  public get isNormalEnd(): boolean {
    return this._isNormalEnd;
  }

  public set isNormalEnd(value: boolean) {
    this._isNormalEnd = value;
  }

  public set mopupRemainTime(value: number) {
    this._mopupRemainTime = value;
  }

  public get mopupRemainTime(): number {
    return this._mopupRemainTime;
  }

  public set isDoubleProfit(value: number) {
    this._isDoubleProfit = value;
  }

  public get isDoubleProfit(): number {
    return this._isDoubleProfit;
  }

  public set isMopup(value: boolean) {
    this._isMopup = value;
    if (this._isMopup) {
      //上线时扫荡中有奖励界面则关闭
      // if (FrameControllerManager.instance.dayGuideController.frame) {
      //     FrameControllerManager.instance.dayGuideController.frame.dispose();
      // }
      NotificationManager.Instance.sendNotification(
        NotificationEvent.LOCK_TEAM_FOLLOW_TARGET,
        0
      );
    }
  }

  public get isMopup(): boolean {
    return this._isMopup;
  }

  public set mopupGoods(value: any[]) {
    this._mopupGoods = value;
  }

  public get mopupGoods(): any[] {
    return this._mopupGoods;
  }

  public commit() {
    if (this._changeObj[MopupModel.MOPUP_LIST_REFRESH])
      this.dispatchEvent(MopupEvent.MOPUP_RESULT_LIST_REFRESH);
    if (this._changeObj[MopupModel.MOPUP_END] && this._mopupEnd)
      this.dispatchEvent(MopupEvent.MOPUP_END);
  }
}
