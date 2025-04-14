import BaseWindow from "../../../core/ui/Base/BaseWindow";

/**
 *
 */
export default class WaitingWnd extends BaseWindow {
  private txt_tips: fgui.GTextField;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.txt_tips.text = "";
    if (this.frameData) {
      let tipText = this.frameData.text;
      if (tipText && tipText != "") {
        this.txt_tips.text = tipText;
      }
    }
  }

  protected OnClickModal() {}

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
