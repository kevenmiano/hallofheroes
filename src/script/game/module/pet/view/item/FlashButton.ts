//@ts-expect-error: External dependencies
import FUI_TabButton3 from "../../../../../../fui/Base/FUI_TabButton3";
import { UIFilter } from "../../../../../core/ui/UIFilter";

export class FlashButton extends FUI_TabButton3 {
  constructor() {
    super();
  }

  protected onConstruct(): void {
    super.onConstruct();
  }

  /**
   * 闪烁
   * @param target 闪烁目标对象
   * @param disTime 间隔时间
   */
  public flashTarget() {
    Laya.timer.loop(300, this, this.callFalshTarget, [UIFilter.yellowFilter]);
  }

  /**
   * 闪烁
   * @param target 闪烁目标对象
   * @param disTime 间隔时间
   */
  public clearflashTarget() {
    Laya.timer.clear(this, this.callFalshTarget);
    this.filters = [];
  }

  private callFalshTarget() {
    if (this.filters && this.filters.length) {
      this.filters = [];
    } else {
      this.filters = [UIFilter.yellowFilter];
    }
  }

  dispose(): void {
    Laya.timer.clear(this, this.callFalshTarget);
    super.dispose();
  }
}
