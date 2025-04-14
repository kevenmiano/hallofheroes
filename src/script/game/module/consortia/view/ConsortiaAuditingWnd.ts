/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:48:30
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-26 14:56:22
 * @Description: 公会成员入会审核  v2.46 ConsortiaAuditingFrame  已调试
 */
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import UIButton from "../../../../core/ui/UIButton";
import { ConsortiaAuditingCell } from "./component/ConsortiaAuditingCell";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";

export class ConsortiaAuditingWnd extends BaseWindow {
  public btnAgreeAll: UIButton;
  public btnIngoreAll: UIButton;
  public list: fgui.GList;

  private _contorller: ConsortiaControler;
  private _data: ConsortiaModel;

  private dataList: ThaneInfo[];

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initEvent();
    this.initView();
  }

  private initEvent() {
    this._data.addEventListener(
      ConsortiaEvent.UPDA_APPLY_CONSORTIA_INFO,
      this.__onApplyConsortiaInfoUpdata,
      this,
    );
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._data = this._contorller.model;
  }

  private initView() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false,
    );
    this.list.setVirtual();
  }

  public OnShowWind() {
    super.OnShowWind();
    this._data.clearRecuit();
    this._contorller.sendGetConsortiaApplyInfos();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  private __renderListItem(index: number, item: ConsortiaAuditingCell) {
    let data = this.dataList[index];
    if (data) {
      item.info = data;
    } else {
      item.info = null;
    }
  }

  private __onApplyConsortiaInfoUpdata() {
    this.dataList = this._data.applyConsortiaMapList;
    this.list.numItems = this.dataList.length;
  }

  private btnAgreeAllClick() {
    try {
      this.processApply(true);
    } finally {
      this.hide();
    }
  }

  private btnIngoreAllClick() {
    try {
      this.processApply(false);
    } finally {
      this.hide();
    }
  }

  private processApply(bAgree: boolean) {
    let arr: ThaneInfo[] = [];
    // for (let index = 0; index < this.list.numItems; index++) {
    //     const item = this.list.getChildAt(index) as ConsortiaAuditingCell;
    //     arr.push(item.info);
    // }
    let dataList = this.dataList;
    for (let info of dataList) {
      if (!info) continue;
      arr.push(info);
    }
    this._contorller.consortiaAcceptOrRejectApply(arr, bAgree);
  }

  private removeEvent() {
    this._data.removeEventListener(
      ConsortiaEvent.UPDA_APPLY_CONSORTIA_INFO,
      this.__onApplyConsortiaInfoUpdata,
      this,
    );
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
