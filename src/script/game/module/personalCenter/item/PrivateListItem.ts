import FUI_PrivateListItem from "../../../../../fui/PersonalCenter/FUI_PrivateListItem";
import SettingData from "../../setting/SettingData";
import LangManager from "../../../../core/lang/LangManager";
import SDKManager from "../../../../core/sdk/SDKManager";

export default class PrivateListItem extends FUI_PrivateListItem {
  private _info: SettingData;

  onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  get info(): SettingData {
    return this._info;
  }

  set info(value: SettingData) {
    this._info = value;
    let isAutorized: boolean = value.Progress == 1;
    this.txt_name.text = value.Title;
    this.txt_desc.text = value.Value.toString();
    this.txt_state.text = isAutorized
      ? LangManager.Instance.GetTranslation("PrivacyCom.stateTxt1")
      : LangManager.Instance.GetTranslation("PrivacyCom.stateTxt2");
    this.txt_state.color = isAutorized ? "#FFC68F" : "#ff2e2e";
    this.c1.selectedIndex = isAutorized ? 1 : 0;
  }

  private initEvent() {
    this.btn_permission.onClick(this, this.onBtnPermissionClick);
  }

  private onBtnPermissionClick(e: Laya.Event) {
    if (!this._info) {
      return;
    }

    SDKManager.Instance.getChannel().checkPermission(this.info.type, true);
  }

  private removeEvent() {
    this.btn_permission.offClick(this, this.onBtnPermissionClick);
  }

  dispose() {
    this.removeEvent();
    this._info = null;
    super.dispose();
  }
}
