import ObjectUtils from "../../../../core/utils/ObjectUtils";
import Resolution from "../../../../core/comps/Resolution";
import { EmPackName } from "../../../constant/UIDefine";
/**
 * @author:pzlricky
 * @data: 2021-03-24 12:15
 * @description : 自己领主被暴击时屏幕变红效果类.
 */
export default class RedScreenEffect extends Laya.Sprite {
  private _redBm: fgui.GImage;

  constructor() {
    super();
    this.mouseEnabled = false;
    this._redBm = fgui.UIPackage.createObject(
      EmPackName.Base,
      "Img_RedScreenBMD",
    ).asImage;

    this.addChild(this._redBm.displayObject);
    this._redBm.visible = false;
    this._redBm.alpha = 0.5;
    this.resize();
  }

  public resize() {
    this.width = Resolution.gameWidth;
    this.height = Resolution.gameHeight;
    this._redBm.width = Resolution.gameWidth;
    this._redBm.height = Resolution.gameHeight;
  }

  public play() {
    this._redBm.visible = true;
    Laya.timer.loop(200, this, this.onTimerComplete, null);
  }
  private onTimerComplete(event) {
    this.removeTimer();
    this._redBm.visible = false;
  }

  private removeTimer() {
    Laya.timer.clearAll(this);
  }

  public stop() {
    this.onTimerComplete(null);
  }

  public dispose() {
    ObjectUtils.disposeObject(this._redBm);
    stop();
  }
}
