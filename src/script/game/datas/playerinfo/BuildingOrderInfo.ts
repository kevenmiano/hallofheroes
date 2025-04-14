import GameEventDispatcher from "../../../core/event/GameEventDispatcher";

export class BuildingOrderInfo extends GameEventDispatcher {
  public userId: number = 0;
  public orderType: number = 0;
  public orderId: number = 0;
  public totalCount: number = 0;
  public currentCount: number = 0;
  public totalBuyCount: number = 0;
  public beginTime: Date;
  public needTime: number = 0;
  private _remainTime: number = 0;
  public type: number = 0;

  constructor() {
    super();
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

  public get remainCount(): number {
    var count: number = this.totalCount - this.currentCount;
    return count > 0 ? count : 0;
  }

  /**
   * 剩余可购买次数
   */
  public get remainBuyCount(): number {
    if (this.remainCount > 0) {
      return this.totalBuyCount;
    } else {
      return this.totalBuyCount - (this.currentCount - this.totalCount);
    }
  }

  /**
   * 已购买次数
   */
  public get currentBuyCount(): number {
    return this.totalBuyCount - this.remainBuyCount;
  }
}
