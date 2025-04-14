//@ts-expect-error: External dependencies
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { StarEvent } from "../../constant/StarDefine";
import { NotificationManager } from "../../manager/NotificationManager";
//合成星运快速选择
export default class StarSellSelectWnd extends BaseWindow {
  private list: fgui.GList;
  private _pos: number = 0;
  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.list.getChildAt(0).asButton.selected = true;
    if (this.frameData) {
      this._pos = this.frameData;
    }
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  btnCancelClick() {
    this.OnBtnClose();
  }

  btnConfirmClick() {
    let type = 1;
    if (this.list.getChildAt(0).asButton.selected) {
      type = 1;
    }
    if (this.list.getChildAt(1).asButton.selected) {
      type = 2;
    }
    if (this.list.getChildAt(2).asButton.selected) {
      type = 3;
    }
    if (this.list.getChildAt(3).asButton.selected) {
      type = 4;
    }
    NotificationManager.Instance.dispatchEvent(
      StarEvent.START_SELL_SELECT_STATUS,
      type,
    );
    this.OnBtnClose();
  }
}
