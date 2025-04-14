//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2024-01-25 15:28:08
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 18:15:49
 * @Description:
 */

import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../../constant/UIDefine";
import UIHelper from "../../../utils/UIHelper";
import DebugModule from "../DebugModule";
import { QuickOpenFrameItem } from "./QuickOpenFrameItem";
import { QuickOpenFrameModel } from "./QuickOpenFrameModel";

export class QuickOpenFrameWnd extends BaseWindow {
  protected setScenterValue: boolean = true;
  data: QuickOpenFrameModel;
  list: fgui.GList;
  itemTitle: QuickOpenFrameItem;

  OnInitWind() {
    super.OnInitWind();
    this.addEvent();
    this.initData();
    this.initView();
  }

  addEvent() {}

  removeEvent() {}

  initData() {
    this.data = new QuickOpenFrameModel();
  }

  initView() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );
    this.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    this.list.numItems = this.data.dataList.length;
  }

  private onRenderListItem(index: number, item: QuickOpenFrameItem) {
    item.info = this.data.dataList[index];
  }

  private onClickItem(item: QuickOpenFrameItem) {
    DebugModule.Instance.hide();
    UIHelper.closeWindow(EmWindow.QuickOpenFrameWnd);
    UIHelper.openWindow(item.info.type, item.info.frameData);
    DebugModule.Instance.autoShowDebugWnd = item.info.type;
  }

  protected get modelAlpha() {
    return 0;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
