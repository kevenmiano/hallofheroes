import { MapBaseAction } from "./MapBaseAction";
import { SceneManager } from "../../map/scene/SceneManager";
import { PlayerManager } from "../../manager/PlayerManager";
import LangManager from "../../../core/lang/LangManager";
/**
 * @author yuanzhan.yu
 */
export class CaseGoodsSendBackByMailAction extends MapBaseAction {
  private _isPop: boolean;

  constructor() {
    super();
  }

  public prepare() {
    SceneManager.Instance.lockScene = false;
  }

  public update() {
    if (!this._isPop) {
      this.createTipsFrame();
      this._isPop = true;
    }
  }

  // private _alert:BaseAlerFrame;

  private createTipsFrame() {
    // var prompt:string = LangManager.Instance.GetTranslation("public.prompt");
    // this._alert = AlertManager.Instance.simpleAlert(prompt, this.msg, "");
    // this._alert.submitButton.y = 99;
    // this._alert.addEventListener(FrameEvent.RESPONSE, this.__requestFrameCloseHandler);
  }

  private get msg(): string {
    var currentDate: Date = new Date();
    var targetDate: Date = new Date();
    currentDate.setTime(PlayerManager.Instance.currentPlayerModel.nowDate);
    targetDate.setTime(currentDate.getTime() + 30 * 24 * 3600 * 1000);
    return (
      LangManager.Instance.GetTranslation(
        "yishi.actions.consortia.CaseGoodsSendBackByMailAction.sendBack",
      ) +
      (currentDate.getMonth() + 1) +
      LangManager.Instance.GetTranslation("public.month") +
      currentDate.getDate() +
      LangManager.Instance.GetTranslation("public.daily") +
      "—" +
      (targetDate.getMonth() + 1) +
      LangManager.Instance.GetTranslation("public.month") +
      targetDate.getDate() +
      LangManager.Instance.GetTranslation("public.daily")
    );
  }

  // private __requestFrameCloseHandler(e:FrameEvent)
  // {
  //     this._alert.removeEventListener(FrameEvent.RESPONSE, this.__requestFrameCloseHandler);
  //     this._alert.dispose();
  //     this._alert = null;
  //     this.actionOver();
  // }
}
