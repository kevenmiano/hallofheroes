//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-07 21:20:03
 * @LastEditTime: 2022-08-05 14:35:13
 * @LastEditors: jeremy.xu
 * @Description: 试炼之塔、王者之塔 对话框
 */

import BaseWindow from "../../../core/ui/Base/BaseWindow";

export default class TrailDialogWnd extends BaseWindow {
  public txtName: fgui.GLabel;
  public txtContent: fgui.GLabel;
  private _mapId: number;
  private _nodeId: number;
  private _callBack: Function;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    if (this.frameData) {
      this.txtName.text = this.frameData.title;
      this.txtContent.text = this.frameData.content;
      this._mapId = this.frameData.mapId;
      this._nodeId = this.frameData.nodeId;
      this._callBack = this.frameData.callBack;
    }
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  btnConfirmClick() {
    if (this._callBack) {
      this._callBack(true, this._mapId, this._nodeId);
    }
    this.OnBtnClose();
  }

  btnCancelClick() {
    this.OnBtnClose();
  }
}
