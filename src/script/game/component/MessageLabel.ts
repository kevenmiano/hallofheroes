import BaseWindow from "../../core/ui/Base/BaseWindow";
import UIManager from "../../core/ui/UIManager";
import { EmWindow } from "../constant/UIDefine";
import HintUtils, { FontType, HintAniData } from "./HintUtils";

/**
 * @author:pzlricky
 * @data: 2021-01-11 19:26
 * @description 飘字提示
 */
export default class MessageLabel extends BaseWindow {
  protected txt: fgui.GTextField;

  protected animationData: HintAniData = null;

  /**打开界面 */
  OnShowWind() {
    super.OnShowWind();
    this.alpha = 1;
    this.animationData = this.params.aniData;
    if (this.animationData.point) {
      this.x = this.animationData.point.x;
      this.y = this.animationData.point.y;
    }

    if (!this.params.viewData) {
      this.txt.x = this.contentPane.width / 2;
    }

    this.txt.text = this.params.text;
    if (
      this.animationData.type == FontType.MessageLabel ||
      this.animationData.type == FontType.NONE
    ) {
      let fontCfg = this.animationData.fontCfg;
      this.txt.color = fontCfg.color;
      this.txt.fontSize = fontCfg.fontSize;
    } else {
      let cfgType = this.animationData.type;
      let BMFontCfg = HintUtils.BMFontCfgMap.get(cfgType);
      this.txt.font = BMFontCfg.url;
      this.txt.letterSpacing = BMFontCfg.distance;
    }
  }

  doShowAnimation(): Promise<boolean> {
    return new Promise((resolve) => {
      //向上移动
      Laya.timer.clearAll(this);
      let targetY = this.animationData.point.y - 150;
      Laya.timer.once(1000, this, () => {
        //延迟1s再向上飘
        Laya.Tween.to(
          this,
          { y: targetY },
          500,
          undefined,
          Laya.Handler.create(this, (target) => {
            UIManager.Instance.HideTips(
              EmWindow.MessageLabel + "_" + this.animationData.type,
              EmWindow.MessageLabel,
              this,
            );
            Laya.Tween.clearAll(target);
            Laya.timer.clearAll(this);
            resolve(true);
          }),
          0,
          this.animationData.once,
          true,
        );
      });
    });
  }

  OnHideWind() {
    super.OnHideWind();
    Laya.Tween.clearAll(this);
    Laya.timer.clearAll(this);
  }
}
