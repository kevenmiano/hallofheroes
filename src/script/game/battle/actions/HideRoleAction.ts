/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 隐藏角色动作.
 * 有些怪物攻击角色时,要求被攻击对像隐藏.
 **/

import { InheritIActionType } from "../../constant/BattleDefine";
import { SkillEffect } from "../skillsys/effect/SkillEffect";
import { HideFrameData } from "../skillsys/mode/framedata/FrameDatas";
import { GameBaseAction } from "./GameBaseAction";

export class HideRoleAction extends GameBaseAction {
  public inheritType: InheritIActionType = InheritIActionType.HideRoleAction;

  private _frameData: HideFrameData;
  private _count: number = 0;

  /**
   *role BaseRoleInfo
   **/
  constructor(role, frameData: HideFrameData) {
    super();
    this._currentRole = role;
    this._frameData = frameData;
    this._currentRole.addConcurrentAction(this);

    this.prepare();
  }
  public prepare() {
    if (!this._currentRole) {
      this.finished = true;
      return;
    }
    this._currentRole.hideBody();
    if (
      this._frameData.disappearEffect &&
      this._frameData.disappearEffect != ""
    ) {
      this.addEffect(this._frameData.disappearEffect);
    }
  }
  public update() {
    this._count++;
    if (this._count >= this._frameData.persistentFrame) {
      this._count = 0;
      this.showBody();
      if (this._frameData.appearEffect && this._frameData.appearEffect != "") {
        this.addEffect(this._frameData.appearEffect);
      }
    }
  }
  private addEffect(effectName: string) {
    let effect: SkillEffect = new SkillEffect(effectName);

    effect.getDisplayObject().x = this._currentRole.point.x;
    effect.getDisplayObject().y = this._currentRole.point.y;
    if (this._currentRole.map) {
      this._currentRole.map.addEffect(effect);
    }
  }
  private showBody() {
    this.finished = true;
    if (this._currentRole) {
      this._currentRole.showBody();
    }
  }
  public dispose() {
    this.finished = true;
  }
}
