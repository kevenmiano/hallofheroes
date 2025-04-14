/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 胜利技能
 **/

import { ActionMovie } from "../../../component/tools/ActionMovie";
import {
  InheritIActionType,
  InheritRoleType,
  ActionLabesType,
} from "../../../constant/BattleDefine";
import { SimpleScriptAction } from "../../actions/common/SimpleScriptAction";
import { HeroRoleInfo } from "../../data/objects/HeroRoleInfo";
import { BaseSkill } from "./BaseSkill";

export class SuccessSkill extends BaseSkill {
  public inheritType: InheritIActionType = InheritIActionType.SuccessSkill;

  constructor() {
    super();
  }

  protected startRun() {
    this.started = true;
    let action: SimpleScriptAction = new SimpleScriptAction();
    action.onPrepare = () => {
      // if (this._currentRole instanceof HeroRoleInfo) {
      if (this._currentRole.inheritType == InheritRoleType.Hero) {
        let hero = this._currentRole as HeroRoleInfo;
        if (hero.petRoleInfo) {
          hero.petRoleInfo.action(ActionLabesType.STAND, ActionMovie.STOP);
        }
      }
      this._currentRole.action(ActionLabesType.VICTORY, ActionMovie.STOP);
      this.updataSp();
    };
    action.onUpdate = () => {
      if (action.frameCount == 20) {
        action.finish();
      }
    };

    this._currentRole.addAction(action);
    this.finished = true;
  }
}
