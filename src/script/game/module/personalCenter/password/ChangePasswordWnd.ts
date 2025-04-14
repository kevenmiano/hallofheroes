//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { VicePasswordUtil } from "../../vicePassword/VicePasswordUtil";

/**
 * @author:zhihua.zhou
 * @data: 2021-12-9 11:27
 * @description 修改密码界面
 */
export default class ChangePasswordWnd extends BaseWindow {
  private txt_input0: fairygui.GTextInput;
  private txt_input1: fairygui.GTextInput;
  private txt_input2: fairygui.GTextInput;
  private txt_warn0: fairygui.GTextField;
  private txt_warn1: fairygui.GTextField;
  private txt_warn2: fairygui.GTextField;
  private btn_reset: fairygui.GButton;
  private btn_submit: fairygui.GButton;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    this.txt_input0.restrict =
      this.txt_input1.restrict =
      this.txt_input2.restrict =
        "0-9";
    this.txt_input0.promptText = LangManager.Instance.GetTranslation(
      "vicepassword.description9",
    );
    this.txt_input1.password = true;
    this.txt_input2.password = true;
  }

  private addEvent(): void {
    this.btn_reset.onClick(this, this.onReset);
    this.btn_submit.onClick(this, this.onSubmit);
    this.txt_input0.on(Laya.Event.INPUT, this, this.onChange, [0]);
    this.txt_input1.on(Laya.Event.INPUT, this, this.onChange, [1]);
    this.txt_input2.on(Laya.Event.INPUT, this, this.onChange, [2]);
  }

  private removeEvent(): void {
    this.btn_reset.offClick(this, this.onReset);
    this.btn_submit.offClick(this, this.onSubmit);
    this.txt_input0.off(Laya.Event.INPUT, this, this.onChange);
    this.txt_input1.off(Laya.Event.INPUT, this, this.onChange);
    this.txt_input2.off(Laya.Event.INPUT, this, this.onChange);
  }

  private onChange(type: number) {
    if (type == 0) {
      this.txt_warn0.text = "";
      if (VicePasswordUtil.numCheck(this.txt_input0.text) == 1) {
        this.txt_warn0.text = LangManager.Instance.GetTranslation(
          "vicepassword.description8",
        );
      } else if (VicePasswordUtil.numCheck(this.txt_input0.text) == 2) {
        //超过6位数字
        this.txt_warn0.text = LangManager.Instance.GetTranslation(
          "vicepassword.description9",
        );
        // MessageTipManager.instance().show(msg);
      }
    } else if (type == 1) {
      this.txt_warn1.text = "";
      if (VicePasswordUtil.numCheck(this.txt_input1.text) == 1) {
        this.txt_warn1.text = LangManager.Instance.GetTranslation(
          "vicepassword.description8",
        );
        // MessageTipManager.instance().show(msg);
      } else if (VicePasswordUtil.numCheck(this.txt_input1.text) == 2) {
        //超过6位数字
        this.txt_warn1.text = LangManager.Instance.GetTranslation(
          "vicepassword.description9",
        );
        // MessageTipManager.instance().show(msg);
      }
    } else {
      if (VicePasswordUtil.numCheck(this.txt_input2.text) == 1) {
        this.txt_warn2.text = LangManager.Instance.GetTranslation(
          "vicepassword.description8",
        );
        // MessageTipManager.instance().show(msg);
      } else if (VicePasswordUtil.numCheck(this.txt_input2.text) == 2) {
        //超过6位数字
        this.txt_warn2.text = LangManager.Instance.GetTranslation(
          "vicepassword.description9",
        );
        // MessageTipManager.instance().show(msg);
      }
    }
  }

  private onReset() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "vicepassword.description5",
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.resetCallback.bind(this),
    );
  }

  private resetCallback(b: boolean) {
    if (b) {
      VicePasswordUtil.vpOp(VicePasswordUtil.RESET_PW);
    }
  }

  private onSubmit() {
    //判断是否为6位数字
    var msg: string;
    if (
      this.txt_input0.text ==
        LangManager.Instance.GetTranslation(
          "mainBar.vicePassword.setviewinputdes",
        ) ||
      this.txt_input0.text == ""
    ) {
      msg = LangManager.Instance.GetTranslation("vicepassword.description15");
      MessageTipManager.Instance.show(msg);
      return;
    }
    if (
      this.txt_input1.text ==
        LangManager.Instance.GetTranslation(
          "mainBar.vicePassword.setviewinputdes",
        ) ||
      this.txt_input1.text == ""
    ) {
      msg = LangManager.Instance.GetTranslation("vicepassword.description14");
      MessageTipManager.Instance.show(msg);
      return;
    }
    if (
      this.txt_input2.text ==
        LangManager.Instance.GetTranslation(
          "mainBar.vicePassword.setviewinputdes",
        ) ||
      this.txt_input2.text == ""
    ) {
      msg = LangManager.Instance.GetTranslation("vicepassword.description13");
      MessageTipManager.Instance.show(msg);
      return;
    }
    if (
      VicePasswordUtil.strCheck(this.txt_input2.text) &&
      VicePasswordUtil.strCheck(this.txt_input1.text)
    ) {
      if (this.txt_input2.text != this.txt_input1.text) {
        msg = LangManager.Instance.GetTranslation("vicepassword.description7");
        MessageTipManager.Instance.show(msg);
        return;
      } else if (
        VicePasswordUtil.numCheckSame(this.txt_input2.text) ||
        VicePasswordUtil.numCheckSame(this.txt_input1.text)
      ) {
        msg = LangManager.Instance.GetTranslation(
          "vicepassword.description111",
        );
        MessageTipManager.Instance.show(msg);
        return;
      } else if (
        VicePasswordUtil.numCheckContinuity(this.txt_input2.text) ||
        VicePasswordUtil.numCheckContinuity(this.txt_input1.text)
      ) {
        msg = LangManager.Instance.GetTranslation(
          "vicepassword.description112",
        );
        MessageTipManager.Instance.show(msg);
        return;
      } else if (this.txt_input2.text == this.txt_input1.text) {
        VicePasswordUtil.vpOp(
          VicePasswordUtil.CHANGE_PW,
          this.txt_input1.text,
          this.txt_input2.text,
          this.txt_input0.text,
        );
        return;
      }
    } else {
      msg = LangManager.Instance.GetTranslation("vicepassword.description6");
      MessageTipManager.Instance.show(msg);
      return;
    }
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }
}
