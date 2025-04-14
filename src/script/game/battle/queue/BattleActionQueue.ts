/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  角色身上的动作序列, 角色按照该动作序列里面的动作信息执行动作脚本
 **/

import { IAction } from "@/script/game/interfaces/Actiont";
import { ActionQueueManager } from "../../manager/ActionQueueManager";
import { GameBaseAction } from "../actions/GameBaseAction";
import { BattleManager } from "../BattleManager";

export class BattleActionQueue extends ActionQueueManager {
  public constructor() {
    super();
  }

  // override
  protected shiftAction() {
    if (this._actions.length > 0) {
      let temp: IAction = this._actions[0];
      if (!temp.ready(BattleManager.Instance.BattleFrameCount)) {
        return;
      }
      this._current = this._actions.shift();
      this._current.prepare();
    }
  }

  public get nextLiftTime(): number {
    let next: GameBaseAction = this._actions[0];
    if (next) {
      return next.liftTime;
    }
    return -1;
  }

  public get isOver(): boolean {
    if (this._actions.length <= 0 && this._current == null) {
      return true;
    }
    return false;
  }
}
