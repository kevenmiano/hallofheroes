/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description :  记录连击
 **/

import { BattleNotic } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";

export class BatterModel {
  private _isStart: boolean = false; //是否开始连击计数;
  private _batterCount: number = 0;
  private _damageTotal: number = 0;

  private _isSendVisible: boolean = false; //是否发送过 连击的ui为可视
  private _lock: boolean = false; //当为true时, 连击和伤害数不增长(不通知显示);
  public maxBatterCount: number = 0;

  constructor() {}

  public get isStart(): boolean {
    return this._isStart;
  }

  public set isStart(value: boolean) {
    if (this._isStart == value) return;

    if (value == false) {
      this.batterCount = 0;
      this.damageTotal = 0;
      this._isSendVisible = false;
    }
    this._isStart = value;

    if (this._isStart == false)
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_BATTERUI_VISIBLE,
        false,
      );
  }

  public get batterCount(): number {
    return this._batterCount;
  }

  public set batterCount(value: number) {
    if (this._isStart == false) return;
    this._batterCount = value;
    if (this.maxBatterCount < this._batterCount) {
      this.maxBatterCount = this._batterCount;
    }
    if (this._lock == false) {
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_BATTER_COUNT,
        this._batterCount,
      );
    }
    if (!this._isSendVisible && this._batterCount > 2) {
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_BATTERUI_VISIBLE,
        true,
      );
      this._isSendVisible = true;
    }
  }

  public get damageTotal(): number {
    return this._damageTotal;
  }

  public set damageTotal(value: number) {
    if (this._isStart == false) return;
    this._damageTotal = value;
    if (this._lock == false) {
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_TOTAL_DAMAGE,
        this._damageTotal,
      );
    }
  }

  public get lock(): boolean {
    return this._lock;
  }

  public set lock(value: boolean) {
    if (this._lock == value) return;
    this._lock = value;
    if (this._lock == false) {
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_BATTER_COUNT,
        this._batterCount,
      );
      NotificationManager.Instance.sendNotification(
        BattleNotic.SET_TOTAL_DAMAGE,
        this._damageTotal,
      );
    }
  }
}
