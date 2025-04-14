import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import Dictionary from "../../../core/utils/Dictionary";
import Utils from "../../../core/utils/Utils";
import { EmailEvent } from "../../constant/event/NotificationEvent";
import RelationType from "../../constant/RelationType";
import { ArmyManager } from "../../manager/ArmyManager";
import { ConsortiaManager } from "../../manager/ConsortiaManager";
import { FriendManager } from "../../manager/FriendManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { AddFriendsItem } from "../friend/view/component/AddFriendsItem";
import MailAddFriendCell from "./MailAddFriendCell";
/**
 * @author:pzlricky
 * @data: 2021-04-12 19:45
 * @description ***
 */
export default class AddFriendWnd extends BaseWindow {
  private listData: Array<any> = [];
  private callbackFunc: Function = null;
  private selectItem: any;

  private frame: fgui.GComponent;
  private list: fgui.GList;
  private confirmBtn: UIButton;
  private cancelBtn: UIButton;
  private tabSelectController: fgui.Controller;
  private selectTabIndex: number = 0;
  private selectItemIndex: number = -1;

  /**初始化界面 */
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    if (this.params) {
      // {callback: this.onConfirmAddFriend.bind(this) }
      this.callbackFunc = this.params.callback;
      this.selectTabIndex = this.params.index;
      this.selectItemIndex =
        this.params.itemIndex >= 0 ? this.params.itemIndex : -1;
    }
    this.tabSelectController = this.getController("tabSelect");
    this.tabSelectController.on(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onChangeTab,
    );
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    Utils.setDrawCallOptimize(this.list);
    NotificationManager.Instance.addEventListener(
      EmailEvent.ADD_FRIEND_CELL_CHECK,
      this.onSelectItem,
      this,
    );
    this.confirmBtn.onClick(this, this.onConfirmCall);
    this.cancelBtn.onClick(this, this.onCancelCall);
    this.getFriendNameList();
    //初始化默认选择好友栏
    this.initComboBox(this.getFriendNameList());
    this.list.clearSelection();
  }

  /**选中某个 */
  onSelectItem(selectIndex: number) {
    this.list.clearSelection();
    this.list.selectedIndex = selectIndex;
    this.selectItemIndex = selectIndex;
  }

  /**切换Tab选项 */
  onChangeTab() {
    Logger.log("Tab:", this.tabSelectController.selectedIndex);
    this.removeLists();
    switch (this.tabSelectController.selectedIndex) {
      case 0:
        this.initComboBox(this.getFriendNameList());
        break;
      case 1:
        this.initComboBox(
          ConsortiaManager.Instance.model.consortiaMemberList.getList(),
        );
        break;
    }
    if (
      this.tabSelectController.selectedIndex == this.selectTabIndex &&
      this.selectItemIndex >= 0
    ) {
      this.list.selectedIndex = this.selectItemIndex;
    }
  }

  private _friendList: Array<any> = [];
  private getFriendNameList(): Array<any> {
    this._friendList.splice(0, this._friendList.length);
    var list: Dictionary = FriendManager.getInstance().friendList;
    for (let key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        let info = list[key];
        if (info.relation == RelationType.FRIEND) this._friendList.push(info);
      }
    }
    return this._friendList;
  }

  /**刷新单元格 */
  renderListItem(index: number, item: MailAddFriendCell) {
    item.index = index;
    item.Itemdata = this.currselectData[index];
  }

  /**删除列表 */
  removeLists() {
    try {
      this.list.removeChildrenToPool(0, this.list.numChildren - 1);
    } catch (error) {
      Logger.error(error);
    }
  }

  private currselectData = null;
  private initComboBox(list) {
    let listModel = [];
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        let info = list[key];
        if (info.userId == ArmyManager.Instance.thane.userId) continue;
        listModel.push(info);
      }
    }

    this.currselectData = listModel;
    this.list.numItems = listModel.length;
  }

  /**确定回调 */
  private onConfirmCall() {
    let selectCell: number[] = this.list.getSelection();
    if (selectCell.length > 0) {
      let selectData: any = this.list.getChildAt(selectCell[0]);
      this.selectItem = selectData.Itemdata;
    }
    super.hide();
  }

  /**取消 */
  private onCancelCall() {
    this.selectItem = null;
    super.hide();
  }

  public getAddBtnByIndex(idx: number): fgui.GButton {
    for (let index = 0; index < this.list.numItems; index++) {
      if (idx == index) {
        return (this.list.getChildAt(index) as AddFriendsItem).bbtn_add;
      }
    }
  }

  OnShowWind() {
    super.OnShowWind();
    this.tabSelectController.selectedIndex = this.selectTabIndex;
    this.onChangeTab();
    if (this.selectItemIndex >= 0) {
      this.list.selectedIndex = this.selectItemIndex;
    }
  }

  OnHideWind() {
    super.OnHideWind();
    this.callbackFunc &&
      this.callbackFunc(
        this.selectItem,
        this.tabSelectController.selectedIndex,
        this.list.selectedIndex,
      );
  }
}
