//@ts-expect-error: External dependencies
import Logger from "../../../core/logger/Logger";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import ChatPrivatePlayerCell from "./ChatPrivatePlayerCell";
import { NotificationManager } from "../../manager/NotificationManager";
import {
  ChatEvent,
  FriendUpdateEvent,
} from "../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import FriendItemCellInfo from "../../datas/FriendItemCellInfo";
import { ChatManager } from "../../manager/ChatManager";
import { FriendManager } from "../../manager/FriendManager";
import FUI_PriviatePlayerList from "../../../../fui/Chat/FUI_PriviatePlayerList";
import { FriendSocketOutManager } from "../../manager/FriendSocketOutManager";
import IMManager from "../../manager/IMManager";
import IMModel from "../../datas/model/IMModel";
import Utils from "../../../core/utils/Utils";
/**
 * @author:pzlricky
 * @data: 2021-06-03 15:39
 * @description 私聊
 */
export default class ChatPrivateList extends FUI_PriviatePlayerList {
  private _first: boolean = true; // 是否第一次加载
  private _currentSelected: ThaneInfo; //当前选择私聊对象
  /** 当前私聊头像列表 */
  private privateDataList: Array<ThaneInfo>;
  constructor() {
    super();
  }

  private requestOnlineStatus() {
    if (this.privateDataList.length > 0) {
      let userIdList: Array<number> = [];
      let userId: number = 0;
      for (var i = 0; i < this.privateDataList.length; i++) {
        if (this.privateDataList[i]) {
          userId = this.privateDataList[i].userId;
          userIdList.push(userId);
        }
      }
      FriendSocketOutManager.sendReqChatState(userIdList);
    }
  }

  private initView() {
    this.requestOnlineStatus();
    this._first && this.addEvent();
    if (this.privateDataList.length > 0) {
      this.list.numItems = this.privateDataList.length;
      this.list.selectedIndex = 0;
      ChatManager.Instance.model.privateData = (
        this.list.getChildAt(this.list.selectedIndex) as ChatPrivatePlayerCell
      ).info;
    }
  }

  /**添加事件 */
  private addEvent() {
    this._first = false;
    this.addBtn.onClick(this, this.onAddPrivaiteChat);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onPrivatePlayerSelect,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.ADD_PRIVATE_CHAT,
      this._selectTarget,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.CHAT_MESSAGE,
      this.__onChangeSelect,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.REMOVE_PRIVATE_CHAT,
      this.removePlayer,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.ADD_CHAT,
      this.onlineStatus,
      this,
    );
    FriendManager.getInstance().addEventListener(
      FriendUpdateEvent.RECENT_CONTACT_UPDATE,
      this.updateView,
      this,
    );
    FriendManager.getInstance().addEventListener(
      FriendUpdateEvent.ADD_RECENT_CONTACT,
      this.updateView,
      this,
    );
    FriendManager.getInstance().addEventListener(
      FriendUpdateEvent.FRIEND_CHANGE,
      this.onFriendStatusChange,
      this,
    );
  }

  /**
   * 好友上线、下线通知
   */
  onFriendStatusChange(info: ThaneInfo) {
    for (let i = 0; i < this.privateDataList.length; i++) {
      const element = this.privateDataList[i];
      if (element.userId == info.userId) {
        element.state = info.state;
        (this.list.getChildAt(i) as ChatPrivatePlayerCell).setOnlineState();
        break;
      }
    }
    // this.requestOnlineStatus();
    // this.list.numItems = this.privateDataList.length;
    // Logger.log('------好友上线、下线通知');
  }

  private onlineStatus() {
    this.requestOnlineStatus();
    this.list.numItems = this.privateDataList.length;
  }

  /**添加事件 */
  private offEvent() {
    this.addBtn.offClick(this, this.onAddPrivaiteChat);
    // this.list && this.list.itemRenderer && this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    this.list.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onPrivatePlayerSelect,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.ADD_PRIVATE_CHAT,
      this._selectTarget,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.CHAT_MESSAGE,
      this.__onChangeSelect,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.REMOVE_PRIVATE_CHAT,
      this.removePlayer,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.ADD_CHAT,
      this.onlineStatus,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.RECENT_CONTACT_UPDATE,
      this.updateView,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.ADD_RECENT_CONTACT,
      this.updateView,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.FRIEND_CHANGE,
      this.onFriendStatusChange,
      this,
    );
  }

  updateView() {
    if (!this.visible) return;
    this.privateDataList = FriendManager.getInstance().talkingPerson;
    if (!this._currentSelected) {
      this.initView();
    }
    this.refreshData();
  }

  private __onChangeSelect(data: ThaneInfo) {
    if (!data) return;
    this.onSelect(data);
  }

  private _selectTarget(data: FriendItemCellInfo) {
    if (!data) return;
    this.onSelect(data);
  }

  /**
   * 点击一个头像
   * @param data
   */
  private onSelect(data) {
    this._currentSelected = data;
    IMManager.Instance.cleanMsgListByIdAndType(
      data.userId,
      IMModel.MSG_DIC_UNREAD,
    );
    if (this.privateDataList && !this.checkInList(data.userId))
      this.privateDataList.push(data);
    this.requestOnlineStatus();
  }

  public get currentSelected(): any {
    return this._currentSelected;
  }

  /**
   * 删除头像列表中的一个
   * @param data
   * @returns
   */
  private removePlayer(data: ThaneInfo) {
    if (!data) return;
    IMManager.Instance.cleanMsgListByIdAndType(
      data.userId,
      IMModel.MSG_DIC_UNREAD,
    );
    let len: number = this.privateDataList.length;
    for (let i: number = 0; i < len; i++) {
      let thaneInfo: ThaneInfo = this.privateDataList[i];
      if (thaneInfo && data && thaneInfo.userId == data.userId) {
        this.privateDataList.splice(i, 1);
        break;
      }
    }
    this._currentSelected = null;
    this.refreshData();
  }

  private refreshData() {
    this.list.numItems = this.privateDataList.length;
    if (this.privateDataList.length > 0) {
      this.list.selectedIndex = this.getDefaultItem();
      let cell = this.list.getChildAt(
        this.list.selectedIndex,
      ) as ChatPrivatePlayerCell;
      ChatManager.Instance.model.privateData = cell.info;
      this._currentSelected = cell.info;
      IMManager.Instance.cleanMsgListByIdAndType(
        cell.info.userId,
        IMModel.MSG_DIC_UNREAD,
      );
    } else {
      ChatManager.Instance.model.privateData = null;
    }
  }

  private getDefaultItem(): number {
    let len: number = this.list.numChildren;
    let item: ChatPrivatePlayerCell;
    let returnIndex: number = 0;
    if (this._currentSelected) {
      for (let i = 0; i < len; i++) {
        item = this.list.getChildAt(i) as ChatPrivatePlayerCell;
        if (item && item.info.userId == this._currentSelected.userId) {
          returnIndex = i;
          break;
        }
      }
    }
    return returnIndex;
  }

  private checkInList(userId: number): boolean {
    let flag: boolean = false;
    let len: number = this.privateDataList.length;
    for (let i: number = 0; i < len; i++) {
      let thaneInfo: ThaneInfo = this.privateDataList[i];
      if (thaneInfo && thaneInfo.userId == userId) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**添加私聊 */
  onAddPrivaiteChat() {
    Logger.warn("添加私聊");
    if (!UIManager.Instance.isShowing(EmWindow.AddFriendWnd)) {
      UIManager.Instance.ShowWind(EmWindow.AddFriendWnd, {
        callback: this.onConfirmAddFriend.bind(this),
        index: 0,
      });
    }
  }

  /**确定选择发送对象 */
  private onConfirmAddFriend(selectTarget: any) {
    if (selectTarget) {
      this._currentSelected = selectTarget;
      let sendUserName = selectTarget.nickName;
      //添加私聊信息
      Logger.warn("添加私聊对象:", sendUserName);
      NotificationManager.Instance.sendNotification(
        ChatEvent.ADD_PRIVATE_CHAT,
        selectTarget,
      );
    }
  }

  /**渲染私聊信息列表 */
  renderListItem(index: number, item: ChatPrivatePlayerCell) {
    if (item) {
      item.index = index;
      item.info = this.privateDataList[index];
    }
  }

  /**切换私聊对象 */
  __onPrivatePlayerSelect(targetCell: ChatPrivatePlayerCell) {
    let cellData = targetCell.info;
    if (cellData) {
      ChatManager.Instance.model.privateData = cellData;
    }
  }

  /**
   * 私聊列表（上方头像列表）按照时间由近到远排序, 从左往右显示 新消息的人靠前
   */
  sortList(senderId: number) {
    let userId: number = 0;
    let talkingArr = FriendManager.getInstance().talkingPerson;
    let len = talkingArr.length;
    if (len > 1) {
      for (var i = 0; i < len; i++) {
        userId = talkingArr[i].userId;
        if (userId == senderId) {
          let sender = talkingArr.splice(i, 1);
          talkingArr.unshift(sender[0]);
          this.privateDataList = talkingArr;
          this.list.numItems = this.privateDataList.length;
          this.list.selectedIndex = this.getDefaultItem();
          break;
        }
      }
    } else if (len == 1) {
      if (!this.privateDataList) {
        this.privateDataList = talkingArr;
      }
      this.list.numItems = this.privateDataList.length;
    }
  }

  dispose() {
    this.offEvent();
    this.list.numItems = 0;
    this._first = true;
    this._currentSelected = null;
    super.dispose();
  }
}
