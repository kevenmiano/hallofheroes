//@ts-expect-error: External dependencies
import FUI_HomePrivate from "../../../../fui/Home/FUI_HomePrivate";
import { IconFactory } from "../../../core/utils/IconFactory";
import { IconType } from "../../constant/IconType";
import { EmWindow } from "../../constant/UIDefine";
import {
  IMFrameEvent,
  IMEvent,
  ChatEvent,
} from "../../constant/event/NotificationEvent";
import BaseIMInfo from "../../datas/BaseIMInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ChatManager } from "../../manager/ChatManager";
import IMManager from "../../manager/IMManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { SharedManager } from "../../manager/SharedManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ChatData from "../chat/data/ChatData";

export default class HomePrivate extends FUI_HomePrivate {
  private _playerIcon: fgui.GLoader;
  private _info: ChatData;
  private _privatePersonData: ChatData;
  private chatPrivateMessages: Array<ChatData> = []; /**私聊消息 */
  onConstruct() {
    super.onConstruct();
    this._playerIcon = this.playerIcon.getChild("n0") as fgui.GLoader;
    this.visible = false;
    this.initEvent();
  }

  private initEvent() {
    this._playerIcon.onClick(this, this.playerHandler);
    IMManager.Instance.addEventListener(
      IMFrameEvent.REMOVE,
      this.updateHomePrivateVisible,
      this,
    );
    IMManager.Instance.addEventListener(
      IMEvent.MSG_LIST_DEL,
      this.updateHomePrivateVisible,
      this,
    );
    // IMManager.Instance.addEventListener(IMEvent.RECEIVE_MSG, this.__receiveMsgHandler, this);
    // IMManager.Instance.addEventListener(IMEvent.RECEIVE_VOICE_MSG, this.__receiveVoiceMsgHandler, this);
    NotificationManager.Instance.addEventListener(
      ChatEvent.SHOW_NEW_MSG,
      this.getPrivatePerson,
      this,
    );
  }

  private removeEvent() {
    this._playerIcon.offClick(this, this.playerHandler);
    IMManager.Instance.removeEventListener(
      IMFrameEvent.REMOVE,
      this.updateHomePrivateVisible,
      this,
    );
    IMManager.Instance.removeEventListener(
      IMEvent.MSG_LIST_DEL,
      this.updateHomePrivateVisible,
      this,
    );
    // IMManager.Instance.removeEventListener(IMEvent.RECEIVE_MSG, this.__receiveMsgHandler, this);
    // IMManager.Instance.removeEventListener(IMEvent.RECEIVE_VOICE_MSG, this.__receiveVoiceMsgHandler, this);
    NotificationManager.Instance.removeEventListener(
      ChatEvent.SHOW_NEW_MSG,
      this.getPrivatePerson,
      this,
    );
  }

  private playerHandler() {
    if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {
      FrameCtrlManager.Instance.open(EmWindow.ChatWnd, this._info);
    }
  }

  public getPrivatePerson() {
    let msgArr = ChatManager.Instance.chatPrivateMessages;
    let len: number = msgArr.length;
    this._privatePersonData = msgArr[len - 1];
    if (
      this._privatePersonData &&
      !this._privatePersonData.isRead &&
      this._privatePersonData.senderName !=
        ArmyManager.Instance.thane.nickName &&
      SharedManager.Instance.privacyMsgCount > 0
    ) {
      this.info = this._privatePersonData;
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  private updateHomePrivateVisible() {
    if (
      this._privatePersonData &&
      !this._privatePersonData.isRead &&
      this._privatePersonData.senderName !=
        ArmyManager.Instance.thane.nickName &&
      SharedManager.Instance.privacyMsgCount > 0
    ) {
      this.info = this._privatePersonData;
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  private __receiveMsgHandler(msg: BaseIMInfo) {
    if (msg) {
      this.chatPrivateMessages.push(this.createMsgItem(msg));
      this.getPrivatePerson();
    }
  }

  private __receiveVoiceMsgHandler(msg: ChatData) {
    this.chatPrivateMessages.push(msg);
    this.getPrivatePerson();
  }

  private createMsgItem(msg: BaseIMInfo): ChatData {
    if (!msg) return null;
    var chatData: ChatData = new ChatData();
    chatData.uid = msg.userId;
    chatData.serverId = msg.serverId;
    chatData.userLevel = msg.userLevel;
    chatData.senderName = msg.nickName;
    chatData.job = msg.job;
    chatData.headId = msg.headId;
    chatData.frameId = msg.frameId;
    chatData.msg = msg.msg;
    chatData.encodemsg = msg.msg;
    chatData.sendTime = msg.sendTime;
    chatData.voiceTime = msg.voiceTime;
    chatData.receiveId = msg.toId;
    chatData.isRead = msg.isRead;
    if (msg.serverId) {
      chatData.serverId = msg.serverId;
    } else {
      chatData.msg = ChatManager.Instance.analyzeExpressionForIMChat(
        chatData.msg,
      );
      chatData.commit();
    }

    return chatData;
  }

  public set info(value: ChatData) {
    this._info = value;
    if (this._info) {
      if (this._info.headId == 0) {
        this._playerIcon.url = IconFactory.getHeadIcon(
          this._info.job,
          IconType.HEAD_ICON,
        );
      } else {
        this._playerIcon.url = IconFactory.getHeadIcon(
          this._info.headId,
          IconType.HEAD_ICON,
        );
      }
    } else {
      this._playerIcon.url = "";
    }
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
