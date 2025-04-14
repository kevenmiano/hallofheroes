//@ts-expect-error: External dependencies
import FUI_AccountSetting from "../../../../../fui/Login/FUI_AccountSetting";
import LangManager from "../../../../core/lang/LangManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../core/thirdlib/RptEvent";
import UIButton from "../../../../core/ui/UIButton";
import Utils from "../../../../core/utils/Utils";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { TrackEventNode } from "../../../constant/GameEventCode";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SharedManager } from "../../../manager/SharedManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

/**
 * 账户设置
 */
export class AccountSetting extends FUI_AccountSetting {
  private _btn_account: UIButton;
  private _btn_region: UIButton;

  onInit() {
    this.offEvent();
    this.onInitData();
    this.addEvent();
    this._btn_account.visible = Utils.isApp();
  }

  private addEvent() {
    this._btn_region && this._btn_region.onClick(this, this._onSwitchRegion);
    this._btn_account && this._btn_account.onClick(this, this._onSwitchAccount);
  }

  private offEvent() {
    this._btn_region && this._btn_region.onClick(this, this._onSwitchRegion);
    this._btn_account && this._btn_account.onClick(this, this._onSwitchAccount);
  }

  private onInitData() {
    this._btn_account = new UIButton(this.btn_account);
    this._btn_region = new UIButton(this.btn_region);
  }

  _onSwitchRegion() {
    SDKManager.Instance.getChannel().trackEvent(
      0,
      TrackEventNode.CLICK_AREA_CONFIRM,
      "click_area_confirm",
      "点击切换大区按钮",
      "",
      "",
    );
    SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_AREA_CONFIRM);
    let user = SharedManager.Instance.getProperty("userName");
    FrameCtrlManager.Instance.open(EmWindow.SiteZone, { user: user });
  }

  /**切换账号 */
  _onSwitchAccount() {
    //关闭当前界面,交由Login处理
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var confirm1: string =
      LangManager.Instance.GetTranslation("public.confirm");
    var cancel1: string = LangManager.Instance.GetTranslation("public.cancel");
    let msg = LangManager.Instance.GetTranslation(
      "LoginSetting.AccountSetting.AccountMsg",
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      msg,
      confirm1,
      cancel1,
      (ok: boolean, v2: boolean) => {
        if (ok) {
          NotificationManager.Instance.emit(NotificationEvent.SWITCH_ACCOUNT);
          FrameCtrlManager.Instance.exit(EmWindow.LoginSetting);
          return;
        }
      },
    );
  }

  private get isIOS(): boolean {
    return Utils.isIOS();
  }

  private get isAndroid(): boolean {
    return Utils.isAndroid();
  }

  dispose(): void {
    this.offEvent();
    super.dispose();
  }
}
