//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-20 20:36:44
 * @Description: 宝箱分配
 */
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";

export class ConsortiaTreasureBoxWnd extends BaseWindow {
  private _contorller: ConsortiaControler;
  private _data: ConsortiaModel;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initEvent();
    this.initView();
  }

  private initEvent() {}

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._data = this._contorller.model;
  }

  private initView() {}

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  private removeEvent() {}

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
