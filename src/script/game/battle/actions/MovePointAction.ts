/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 移动到指定点的动作
 **/
import { MovieClip } from "../../component/MovieClip";
import { ActionMovie } from "../../component/tools/ActionMovie";
import {
  ActionLabesType,
  InheritIActionType,
} from "../../constant/BattleDefine";
import { BattleEvent } from "../../constant/event/NotificationEvent";
import { IAction } from "@/script/game/interfaces/Actiont";
import { NotificationManager } from "../../manager/NotificationManager";
import { BattleManager } from "../BattleManager";
import { BattleEffect } from "../skillsys/effect/BattleEffect";
import { MovieClipEffect } from "../skillsys/effect/MovieClipEffect";
import { GameBaseAction } from "./GameBaseAction";

export class MovePointAction extends GameBaseAction {
  public inheritType: InheritIActionType = InheritIActionType.MovePointAction;

  protected _tarPoint: Laya.Point;
  protected _speed: number = 0;
  private _idMoveScene: boolean;
  private _setScale: boolean;
  private _autoStand: boolean;
  private _frame: number = 0;
  private _canReplace: boolean;
  private _endFun: Function;
  private _startFun: Function;
  protected _playWalkAct: boolean;
  private _dustRes: string;
  private _dustGap: number = 0;
  private _dustPt: Laya.Point;
  private _moveForward: boolean;

  /**
   *
   * @param $id
   * @param $tarPoint 目标坐标
   * @param $speed 移速
   * @param $leftTime 播放时间
   * @param $moveScene
   * @param $setScale
   * @param autoStand 是否播放完成恢复站立
   * @param $canReplace
   * @param endFun
   * @param startFun
   * @param playWalkAct 是否播放行走动画
   * @param dustRes 灰尘资源
   * @param dustGap 灰尘与角色间隔
   * @param moveForward 是否向前移动
   */
  constructor(
    $id: number,
    $tarPoint: Laya.Point,
    $speed: number,
    $leftTime: number = 0,
    $moveScene: boolean = false,
    $setScale: boolean = false,
    autoStand: boolean = true,
    $canReplace: boolean = false,
    endFun: Function = null,
    startFun: Function = null,
    playWalkAct: boolean = true,
    dustRes: string = null,
    dustGap: number = 100,
    moveForward: boolean = false,
  ) {
    super($moveScene);
    this._tarPoint = $tarPoint;
    this._speed = $speed;
    this._liftTime = $leftTime;
    this._setScale = $setScale;
    this._autoStand = autoStand;
    this._canReplace = $canReplace;
    this._currentRole = this.battleModel.getRoleById($id);
    this._endFun = endFun;
    this._startFun = startFun;
    this._playWalkAct = playWalkAct;
    this._dustRes = dustRes;
    this._dustGap = dustGap;
    this._moveForward = moveForward;
    if (this._dustRes && this._dustGap < 0) {
      this._dustGap = 100;
    }

    if (this._startFun != null) {
      this._startFun();
    }
    this.addAct();
  }

  public update() {
    if (!this._currentRole.isLiving) {
      this.finish();
      return;
    }
    if (this._currentRole.actionMovie.currentLabel == ActionLabesType.STAND) {
      this.playWalkAction();
    }
    let leng: number = this._currentRole.point.distance(
      this._tarPoint.x,
      this._tarPoint.y,
    );
    let time: number = Math.abs(leng / this._speed);
    if (time < 1) {
      this.finish();
      this._currentRole.point = this._tarPoint;
      if (this._autoStand) this._currentRole.action(ActionLabesType.STAND);
      return;
    } else {
      let x =
        this._currentRole.point.x +
        ((this._tarPoint.x - this._currentRole.point.x) * 1) / time;
      let y =
        this._currentRole.point.y +
        ((this._tarPoint.y - this._currentRole.point.y) * 1) / time;
      this._currentRole.point = new Laya.Point(x, y);
      // this.processBackDust(); //TODO
    }
  }

  protected processBackDust() {
    let angle: number = 0;
    let dir: number = 1;
    if (this._dustRes && this._dustRes != "") {
      let len = this._dustPt.distance(
        this._currentRole.point.x,
        this._currentRole.point.y,
      );
      if (len > this._dustGap) {
        if (this._currentRole.point.x - this._dustPt.x < 0) {
          dir = -1;
        }
        angle = Math.atan2(
          this._currentRole.point.y - this._dustPt.y,
          this._currentRole.point.x - this._dustPt.x,
        );
        this._dustPt.x += this._dustGap * Math.cos(angle);
        this._dustPt.y += this._dustGap * Math.sin(angle);
        this.addDust(this._dustPt, dir);
        this.processBackDust();
      }
    }
  }
  protected addDust(pos: Laya.Point, dir: number) {
    let effect: BattleEffect = new MovieClipEffect(this._dustRes);
    this._currentRole.map.effectContainer.addEffect(effect);
    effect.getDisplayObject().x = pos.x;
    effect.getDisplayObject().y = pos.y;
    effect.getDisplayObject().scaleX = dir;
  }
  public replace(action: IAction): boolean {
    return this._canReplace;
  }
  public prepare() {
    super.prepare();
    if (!this._currentRole.isLiving) {
      this.finish();
      return;
    }
    if (
      !this._moveForward &&
      this._currentRole.actionMovie.currentLabel == ActionLabesType.READY
    ) {
      this.finish();
      return;
    }

    this.playWalkAction();

    this._dustPt = new Laya.Point(
      this._currentRole.point.x,
      this._currentRole.point.y,
    );
    let leng = this._tarPoint.distance(
      this._currentRole.point.x,
      this._currentRole.point.y,
    );
    this._frame = Math.abs(leng / this._speed);

    this._currentRole.moving = true;
    if (this._currentRole == this.battleModel.selfHero) {
      NotificationManager.Instance.sendNotification(
        BattleEvent.SELF_MOVE_START,
      );
    }
  }
  protected playWalkAction() {
    if (this._playWalkAct) {
      this._currentRole.action(ActionLabesType.WALK, ActionMovie.REPEAT);
    }
  }
  private finish() {
    this._currentRole.moving = false;
    if (this._endFun != null) {
      this._endFun();
    }
    this.finished = true;
  }
}
