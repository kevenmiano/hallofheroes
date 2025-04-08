/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2020-12-28 16:17:10
 * @LastEditTime: 2023-03-23 11:51:42
 * @LastEditors: jeremy.xu
 * @Description:
 */
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Logger from "../../core/logger/Logger";
// import { IEnterFrame } from "../interfaces/IEnterFrame";
import { EnterFrameManager } from "../manager/EnterFrameManager";

export class TimerTicker extends GameEventDispatcher {
  private _currentCount: number = 0;
  private _delay: number;
  private _repeatCount: number = 0;
  private _currentTime: number = 0;
  private _running: boolean = false;
  private _tickFunc: Function;
  private _completeFunc: Function;
  public get running() {
    return this._running;
  }
  public get currentCount() {
    return this._currentCount;
  }
  public set repeatCount(value: number) {
    this._repeatCount = value;
  }
  public get repeatCount(): number {
    return this._repeatCount;
  }
  public get cowndownCount(): number {
    return this._repeatCount - this._currentCount;
  }

  constructor(
    delay: number,
    repeatCount: number = 0,
    tickFunc: Function = null,
    completeFunc: Function = null
  ) {
    super();

    this._delay = delay;
    this._repeatCount = repeatCount;
    this._tickFunc = tickFunc;
    this._completeFunc = completeFunc;
  }

  public start() {
    if (!this._running) {
      this._currentTime = Laya.Browser.now();
      this._running = true;
      EnterFrameManager.Instance.registeEnterFrame(this);
    }
  }

  public stop() {
    this.reset();
    this.offAll();
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  public reset() {
    this._currentCount = 0;
    this._running = false;
  }

  public enterFrame() {
    var t: number = Laya.Browser.now();
    var d: number = t - this._currentTime;
    var count: number = Math.floor(d / this._delay);
    if (count > 0 && this._running) {
      this._currentCount++;
      this.dispatchEvent(TimerEvent.TIMER);
      this._tickFunc && this._tickFunc();
      if (this._repeatCount > 0 && this._currentCount >= this._repeatCount) {
        this.stop();
        this.dispatchEvent(TimerEvent.TIMER_COMPLETE);
        this._completeFunc && this._completeFunc();
      }
    }
    this._currentTime = t - (d % this._delay);
  }
}

export enum TimerEvent {
  TIMER = "timer",
  TIMER_COMPLETE = "timerComplete",
}
