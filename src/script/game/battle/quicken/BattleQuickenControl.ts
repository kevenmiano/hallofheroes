import Dictionary from "../../../core/utils/Dictionary";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import BattleQuickenModel from "./BattleQuickenModel";
// import { IQuickenEffect } from "./IQuickenEffect";

interface IQuickenEffect {
  setSpeed(value: number): void;
}

export default class BattleQuickenControl implements IEnterFrame {
  private _model: BattleQuickenModel;
  private _effects: Dictionary;

  private _fps: number;
  private _frameCount: number;
  private static CHECK_NUM: number = 10;
  private _startTime: number;
  private _sleep: boolean;
  private _sleepTimer: ReturnType<typeof setInterval> | null;
  constructor(model: BattleQuickenModel) {
    this._model = model;
    this._effects = new Dictionary();
    EnterFrameManager.Instance.registeEnterFrame(this);

    this.startCheck();
  }

  private startCheck() {
    this._frameCount = 0;
    this._startTime = new Date().getTime();
    this._sleep = false;
  }
  public enterFrame() {
    if (!this._sleep) {
      this._frameCount++;
      if (this._frameCount == BattleQuickenControl.CHECK_NUM) {
        this._frameCount = 0;
        this._fps =
          (1000 * BattleQuickenControl.CHECK_NUM) /
          (new Date().getTime() - this._startTime);

        this.rolveSpeed();
        this.sleep();
      }
    }
  }

  /**
   * 确定速度.
   */
  private rolveSpeed() {
    var speed: number = 5 - Math.ceil(this._fps / 5);
    if (speed > 5) {
      speed = 5;
    } else if (speed < 1) {
      speed = 1;
    }

    this.setSpeed(speed);
  }

  private sleep() {
    this.removeSleepTimer();
    this._sleep = true;
    this._sleepTimer = setInterval(this.onTimerComplete.bind(this), 500);
  }

  private onTimerComplete(event) {
    this._startTime = new Date().getTime();
    this.removeSleepTimer();
    this._sleep = false;
  }

  private removeSleepTimer() {
    if (this._sleepTimer) {
      clearInterval(this._sleepTimer);
      this._sleepTimer = null;
    }
  }

  /**
   * 设置战斗中的动画的播放速度.
   * @param value
   *
   */
  public setSpeed(value: number) {
    if (this._model.speed != value) {
      this._model.speed = value;
      for (const key in this._effects) {
        if (Object.prototype.hasOwnProperty.call(this._effects, key)) {
          var effect: IQuickenEffect = this._effects[key];
          effect.setSpeed(this._model.speed);
        }
      }
    }
  }
  public getFps(): number {
    return this._fps;
  }

  /**
   * 注册需要加速的动画效果
   * @param effect
   *
   */
  public register(effect) {
    this._effects[effect] = effect;
  }

  /**
   * 移除需要加速的动画效果.
   * @param effect
   */
  public unregister(effect) {
    delete this._effects[effect];
  }

  public dispose() {
    this.removeSleepTimer();
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    ObjectUtils.clearDictionary(this._effects);
    this._model = null;
    this._effects = null;
  }
}
