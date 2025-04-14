/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 跳动动作
 **/

import { ActionMovie } from "../../component/tools/ActionMovie";
import {
  ActionLabesType,
  InheritIActionType,
} from "../../constant/BattleDefine";
import { MovePointAction } from "./MovePointAction";

export class JumpMoveAction extends MovePointAction {
  public inheritType: InheritIActionType = InheritIActionType.JumpMoveAction;

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
  ) {
    super(
      $id,
      $tarPoint,
      $speed,
      $leftTime,
      $moveScene,
      $setScale,
      autoStand,
      $canReplace,
      endFun,
      startFun,
      playWalkAct,
      dustRes,
      dustGap,
    );
  }
  protected playWalkAction() {
    if (this._playWalkAct) {
      this._currentRole.action(ActionLabesType.WALK, ActionMovie.STOP);
    }
  }

  protected processBackDust() {}
  public prepare() {
    let dis: number = this._tarPoint.distance(
      this._currentRole.point.x,
      this._currentRole.point.y,
    );
    this._speed = Math.ceil(
      dis /
        this._currentRole.actionMovie.getLabelFrameNum(ActionLabesType.WALK),
    );

    super.prepare();
  }
}
