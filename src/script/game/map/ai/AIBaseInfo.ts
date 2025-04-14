import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import Logger from "../../../core/logger/Logger";
import { AiEvents } from "../../constant/event/NotificationEvent";
/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-07 11:32
 */
export default class AIBaseInfo extends GameEventDispatcher {
  private _pathInfo: Laya.Point[];
  private _walkIndex: number = 0;
  private _nextIndex: number = 0;
  private _moveState: number = 0; //移动的状态
  private _speed: number = 5;
  private _isLiving: boolean = true;
  private _willWalkDis: number = 0; //发送路径的累计距离

  public moveOverState: number = 0; //移动结束后的状态, 处理是否在视野范围的逻辑
  public totalFrame: number = 0;
  public currentFrame: number = 0;

  public sysInfo(aInfo: AIBaseInfo) {
    this.isLiving = aInfo.isLiving;
    this._pathInfo = aInfo.pathInfo;
    this.speed = aInfo.speed;
    this._walkIndex = aInfo.walkIndex;
    this.moveState = aInfo.moveState;
    this.currentFrame = aInfo.currentFrame;
    this.totalFrame = aInfo.totalFrame;
  }

  public get isLiving(): boolean {
    return this._isLiving;
  }

  public set isLiving(value: boolean) {
    if (this._isLiving == value) return;
    this._isLiving = value;
    this.dispatchEvent(AiEvents.IS_LIVING, value);
  }

  public get speed(): number {
    return this._speed;
  }

  public set speed(value: number) {
    if (this._speed == value) return;
    this._speed = value;
    this.dispatchEvent(AiEvents.UPDATE_SPEED, this._speed);
  }

  public get nextIndex(): number {
    return this._nextIndex;
  }
  public get walkIndex(): number {
    return this._walkIndex;
  }
  public set walkIndex(value: number) {
    if (this._walkIndex == value) return;
    this._walkIndex = value;
  }
  public get walkIndexToNext(): number {
    this._walkIndex++;
    this._nextIndex = this._walkIndex - 1;
    this.dispatchEvent(AiEvents.NEXT_POINT, this._nextIndex);
    return this._nextIndex;
  }

  private resetFrame() {
    this.currentFrame = 0;
    this.totalFrame = 0;
  }

  public get willWalkDis(): number {
    return this._willWalkDis;
  }

  public set willWalkDis(value: number) {
    this._willWalkDis = value;
  }

  public get pathInfo(): Laya.Point[] {
    return this._pathInfo;
  }

  public set pathInfo(value: Laya.Point[]) {
    this._walkIndex = 1;
    this._willWalkDis = 0;
    this.resetFrame();
    this._pathInfo = value;
    this.dispatchEvent(AiEvents.UPDATE_PATHS, this._pathInfo);
  }
  public get moveState(): number {
    return this._moveState;
  }

  public set moveState(value: number) {
    //Logger.log("[AIBaseInfo]moveState", value)
    this._moveState = value;
    this.dispatchEvent(AiEvents.MOVE_STATE, this._moveState);
  }
}
