import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import FUI_ReinforceWaveBall from "../../../../../../fui/Battle/FUI_ReinforceWaveBall";

/**
 * 增援波数显示对象
 */
export default class ReinforceWaveBall extends FUI_ReinforceWaveBall {
  private isFirst = true;

  constructor() {
    super();
  }

  public showReinforce(b: boolean) {
    //第一次, 且隐藏
    if (this.isFirst && !b) {
      this.isFirst = false;
      //播放消失动画后, 隐藏
      this.mc2.visible = true;
      this.mc2.setPlaySettings(
        0,
        -1,
        1,
        -1,
        Laya.Handler.create(this, () => {
          this.mc1.playing = this.mc1.visible = false;
          this.mc2.playing = this.mc2.visible = false;
        }),
      );
    }
  }

  public dispose() {
    super.dispose();
  }
}
