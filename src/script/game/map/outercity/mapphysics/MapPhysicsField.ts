import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { PhysicsFieldView } from "./PhysicsFieldView";

/**
 * @description    野矿 金矿 宝藏矿脉
 * @author yuanzhan.yu
 * @date 2021/11/18 17:05
 * @ver 1.0
 */
export class MapPhysicsField extends PhysicsFieldView {
  // implements ITipedDisplay
  protected initView() {
    super.initView();
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    return true;
  }

  public async attackFun() {
    let event: Laya.Event = new Laya.Event();
    event.currentTarget = this;
    ToolTipsManager.Instance.showTip(event);
  }

  dispose() {
    super.dispose();
  }
}
