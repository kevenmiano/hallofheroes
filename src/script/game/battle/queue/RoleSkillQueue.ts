/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  角色身上的技能队列.
 * 该类可以访问角色信息(RoleInfo),从而根据具体情况作相应调整.
 **/
import { IAction } from "@/script/game/interfaces/Actiont";
import { BattleManager } from "../BattleManager";
import { BufferHandler } from "../handler/BufferHandler";
import { BattleActionQueue } from "./BattleActionQueue";

export class RoleSkillQueue extends BattleActionQueue {
  private _roleInfo: any; //BaseRoleInfo
  constructor(roleInfo: any) {
    super();
    this._roleInfo = roleInfo;
  }
  protected shiftAction() {
    if (this._actions.length > 0) {
      var temp: IAction = this._actions[0];
      if (!temp.ready(BattleManager.Instance.BattleFrameCount)) return;

      this._roleInfo.readyFlag = true;
      if (this._roleInfo.waitBool) {
        return;
      }

      if (BattleManager.Instance.getSkillSystem().isNeedWait(this._roleInfo)) {
        return;
      }

      this._current = this._actions.shift();
      this._current.prepare();
      BufferHandler.excuteCount = 0;
      this._roleInfo.readyFlag = false;
    }
  }
}
