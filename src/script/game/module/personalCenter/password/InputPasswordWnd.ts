//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";

/**
 * @author:zhihua.zhou
 * @data: 2021-12-9 11:27
 * @description 请输入密码界面
 */
export default class InputPasswordWnd extends BaseWindow {
  private txt_input0: fairygui.GTextInput;
  private txt_warn0: fairygui.GTextField;
  private btn_reset: fairygui.GButton;
  private btn_submit: fairygui.GButton;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    this.txt_input0.restrict = "0-9";
  }

  private addEvent(): void {
    this.btn_submit.onClick(this, this.onSubmit);
  }

  private removeEvent(): void {
    this.btn_submit.offClick(this, this.onSubmit);
  }

  private onReset() {}

  private onSubmit() {}

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }
}
