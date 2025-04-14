// import { IEnterFrame } from "../../../interfaces/IEnterFrame";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";

import { CarnivalRechargeItem } from "../view/CarnivalRechargeItem";

export class LightTurnController implements IEnterFrame {
  private _itemList: Array<CarnivalRechargeItem>;
  private _itemLen: number = 0;
  private _initSpace: number = 0; //初始速度
  private _stopTargetIdx: number = 0;
  private _callBack: Function;
  private _currIdx: number = 0;
  private _lastIdx: number = 0;
  private _stopLightTimes: number = 0; //停下闪几次
  private _stopRun: number = 0;
  private _lastTimer: number = 0;
  private _startTime: number = 0;
  private _runingPassTime: number = 0; //运行总时间
  private _spaceTime: number = 0; //间隔时间
  private _runTime: number = 0; //执行次数
  private _needRun: number = 0; //至少需要执行时间
  private _avSpeed: number = 0; //平稳速度
  private _timeAdd: number = 0;
  private _ft: number = 0;
  private _tweenSpeed: number = 0;
  private _tweenId: number = 0;
  private _callParms: Array<any>;
  private _initIdx: number = 0;
  private _target: any;

  public constructor(
    $itemList: Array<CarnivalRechargeItem>,
    $initSpace: number,
    $needRun: number,
    $avSpeed: number,
    target: any,
    $callBack: Function,
    $stopLgihtTimes: number = 0,
  ) {
    this._itemList = $itemList;
    this._itemLen = this._itemList.length;
    this._initSpace = $initSpace;
    this._needRun = $needRun;
    this._avSpeed = $avSpeed;
    this._target = target;
    this._callBack = $callBack;
    this._stopLightTimes = $stopLgihtTimes;
  }

  public enterFrame() {
    this._runingPassTime = this.getTimer() - this._startTime;
    if (
      this._runingPassTime >= this._needRun &&
      this._currIdx == this._stopTargetIdx
    ) {
      if (this._stopLightTimes == 0) {
        this.stop();
      } else {
        if (this.getTimer() - this._lastTimer > 30) {
          this._lastTimer = this.getTimer();
          this.stopLgiht();
        }
      }
    } else {
      this._spaceTime = this._initSpace + this._tweenSpeed;
      if (this.getTimer() - this._lastTimer > this._spaceTime) {
        this._runTime++;
        this._currIdx++;
        if (this._currIdx >= this._itemLen) {
          this._currIdx = 0;
        }
        this._lastTimer = this.getTimer();
        this.trunLight();
      }
    }
  }

  private trunLight() {
    this._itemList[this._lastIdx].isLight = false;
    this._lastIdx = this._currIdx;
    this._itemList[this._currIdx].isLight = true;
  }

  private stopLgiht() {
    let f = this._itemList[this._currIdx].isLight;
    this._itemList[this._currIdx].isLight = !f;
    this._stopRun++;
    if (this._stopRun >= this._stopLightTimes) {
      this._itemList[this._currIdx].isLight = true;
      this.stop();
    }
  }

  public start(stopTargetIdx: number, callParms: Array<any> = null) {
    if (stopTargetIdx > this._itemList.length - 1) {
      return;
    }
    this._stopTargetIdx = stopTargetIdx;
    this._lastTimer = this.getTimer();
    this._startTime = this._lastTimer;
    this._tweenSpeed = 0;
    this._callParms = callParms;
    let delay = this._needRun / 1000;
    TweenMax.to(this, delay, {
      tweenSpeed: this._avSpeed,
      //@ts-expect-error: External dependencies

      ease: Quint.easeInOut,
    });
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  private stop(needCall = true) {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    TweenMax.killTweensOf(this);
    if (needCall && this._callBack != null)
      this._callBack.apply(this._target, this._callParms);
    this._stopRun = 0;
    this._runTime = 0;
    this._ft = 0;
  }

  public initIdx(value: number) {
    this._initIdx = value;
    this._currIdx = value;
    this._lastIdx = value;
    if (this._itemList[this._currIdx])
      this._itemList[this._currIdx].isLight = true;
  }

  public clearLight(isInit = false) {
    this._itemList[this._currIdx].isLight = false;
    if (isInit) {
      this._currIdx = this._initIdx;
      this._lastIdx = this._initIdx;
    }
  }

  public dispose() {
    this.stop(false);
    this._itemList = null;
    this._callBack = null;
    this._callParms = null;
  }

  public get tweenSpeed() {
    return this._tweenSpeed;
  }

  public set tweenSpeed(value: number) {
    this._tweenSpeed = value;
  }

  private getTimer() {
    return Laya.systemTimer.currTimer;
  }
}
