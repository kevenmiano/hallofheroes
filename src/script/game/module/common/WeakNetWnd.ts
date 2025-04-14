import BaseWindow from "../../../core/ui/Base/BaseWindow";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2022/2/8 12:16
 * @ver 1.0
 */
export class WeakNetWnd extends BaseWindow {
  public bg: fgui.GImage;
  public txt_hint: fgui.GTextField;

  private _info: string;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();

    this._info = this.params;
  }

  protected OnClickModal() {}

  public OnShowWind() {
    super.OnShowWind();
    if (this.txt_hint && !this.txt_hint.isDisposed)
      this.txt_hint.text = this._info;
  }

  public OnHideWind() {
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
