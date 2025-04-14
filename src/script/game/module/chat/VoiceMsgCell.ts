import FUI_VoiceMsgCell from "../../../../fui/Chat/FUI_VoiceMsgCell";
import { AndroidWebviewChannel } from "../../../core/sdk/android_webview/AndroidWebviewChannel";
import BaseChannel from "../../../core/sdk/base/BaseChannel";
import DevChannel from "../../../core/sdk/dev/DevChannel";
import SDKManager from "../../../core/sdk/SDKManager";
import WanChannel from "../../../core/sdk/wan/WanChannel";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { IconFactory } from "../../../core/utils/IconFactory";
import { ChatEvent } from "../../constant/event/NotificationEvent";
import { IconType } from "../../constant/IconType";
import { ChatChannel } from "../../datas/ChatChannel";
import AppellManager from "../../manager/AppellManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import ChatFormat from "../../utils/ChatFormat";
import FUIHelper from "../../utils/FUIHelper";
import ChatData from "./data/ChatData";
import { NativeChannel } from "../../../core/sdk/native/NativeChannel";
import IMManager from "../../manager/IMManager";
import GoodsSonType from "../../constant/GoodsSonType";
import AppellModel from "../appell/AppellModel";
/**
 * 语音消息ITEM
 */
export default class VoiceMsgCell extends FUI_VoiceMsgCell {
  private _cellData: ChatData = null;

  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    this.addEvent();
    this.chatControl.selectedIndex = 1;
    this.vipImg0.visible = false;
    this.vipImg1.visible = false;
  }

  private addEvent() {
    this.userName0.on(Laya.Event.CLICK, this, this.__playerClickHandler);
    this.headIcon.on(Laya.Event.CLICK, this, this.__playerClickHandler);
    this.clickRectL.on(Laya.Event.CLICK, this, this.onPlayVoice);
    this.clickRectR.on(Laya.Event.CLICK, this, this.onPlayVoice);
  }
  /**
   * 播放语音
   */
  private onPlayVoice() {
    this._cellData.isRead = true;
    this.redpoint.visible = false;
    IMManager.Instance.updateVoiceStatus(
      this._cellData.uid,
      this._cellData.serverId,
    );
    let channel: BaseChannel = SDKManager.Instance.getChannel();
    if (channel instanceof AndroidWebviewChannel) {
    } else if (channel instanceof WanChannel) {
      channel.startPlayAudio(this._cellData.serverId);
    } else if (channel instanceof NativeChannel) {
      let msgId: string = this._cellData.serverId;
      let chatData: ChatData = NativeChannel.msgHash.get(
        this._cellData.serverId,
      );
      if (chatData.savePath && chatData.savePath != "null") {
        //语音文件存在就直接播放
        channel.startPlayAudio(chatData.savePath);
      } else {
        //语音文件不存在先下载, 在下载成功回调中播放
        let savePath: string = msgId + "_" + chatData.curTime;
        channel.downloadVoice(msgId, savePath);
      }
    }
  }

  /**点击头像 */
  private __playerClickHandler(evt) {
    if (this._cellData) {
      if (this._cellData.uid < 1) {
        return;
      }
      let ret = ChatFormat.createPlayerCellDataNew(this._cellData);
      NotificationManager.Instance.sendNotification(
        ChatEvent.PLAYER_NAME_CLICK,
        ret,
      );
    }
  }

  set chatData(value) {
    if (value) {
      this._cellData = value;

      //系统 或 信息 栏
      if (value.uid != 0) {
        //发送者非系统
        let isSelf =
          value.uid ==
          PlayerManager.Instance.currentPlayerModel.userInfo.userId;
        //紫钻
        if (isSelf || value.isFromMe) {
          //自己
          this.chatCahnnelImg0.url = FUIHelper.getItemURL(
            "Base",
            ChatChannel.getChatChannelIcon(value.channel),
          );
          this.userName0.color = ChatChannel.getChatChannelColor(value.channel);
          this.userName0.text = value.senderName;
          this.txt_curTime.align = "left";
          this.txt_secR.text = value.voiceTime + '"';
          let w = (value.voiceTime / 60) * 290;
          w = Math.min(w, 290);
          w = Math.max(w, 48);
          this.img_voicebgR.width = w;
          this.redpoint.x =
            this.msgbgself.x - this.msgbgself.width - this.redpoint.width / 2;
          this.redpoint.visible = false;
        } else {
          //其他人
          this.chatCahnnelImg1.url = FUIHelper.getItemURL(
            "Base",
            ChatChannel.getChatChannelIcon(value.channel),
          );
          this.userName1.color = ChatChannel.getChatChannelColor(value.channel);
          this.userName1.text = value.senderName;
          if (
            value.vipGrade <= 0 &&
            value.channel == ChatChannel.BUBBLETYPE_TARGET
          ) {
            this.infoGroup1.x = 74;
          }
          this.txt_curTime.align = "right";
          this.txt_secL.text = value.voiceTime + '"';
          let w = (value.voiceTime / 60) * 290;
          w = Math.min(w, 290);
          w = Math.max(w, 48);
          this.img_voicebgL.width = w;
          this.redpoint.visible = !value.isRead;
          this.redpoint.x =
            this.img_voicebgL.x +
            this.img_voicebgL.width +
            this.redpoint.width / 2 -
            3;
        }
        if (value.userLevel) {
          this.levelGroup.visible = true;
          this.userLevel.text = value.userLevel.toString(); //玩家等级
        } else {
          this.levelGroup.visible = false;
          this.userLevel.text = ""; //玩家等级
        }

        let _headId: number = this._cellData.headId;
        if (_headId == 0) {
          //说明没修改过头像, 使用默认头像
          _headId = this._cellData.job;
        }
        this.headIcon.icon = IconFactory.getPlayerIcon(
          _headId,
          IconType.HEAD_ICON,
        );
        this.chatControl.selectedIndex = isSelf ? 0 : 1;

        if (this._cellData.appellId == 0) {
          // this.appellIcon.url = "";
          this.appellTxt.text = "";
        } else {
          let appellData = AppellManager.Instance.model.getAppellInfo(
            this._cellData.appellId,
          );
          if (
            appellData &&
            appellData.PerfixLang != "" &&
            appellData.PerfixLang != undefined
          ) {
            this.appellTxt.text = appellData.PerfixLang;
            this.appellTxt.color = AppellModel.getTextColorAB(
              appellData.TextColorIdx,
            );
            // let url = this.getAppellUrl(this._cellData.appellId);
            // this.appellIcon.url = FUIHelper.getItemURL("Chat", url);
            appellData = null;
          } else {
            // this.appellIcon.url = "";
            this.appellTxt.text = "";
          }
        }
        let len = this._cellData.sendTime.length;
        if (len > 0) {
          this.txt_curTime.text = this._cellData.sendTime;
        } else {
          //显示时间
          if (this._cellData.curTime) {
            this.txt_curTime.text = DateFormatter.transDateToMin(
              this._cellData.curTime,
            );
          } else {
            this.txt_curTime.text = "";
          }
        }
      }
    }
  }

  get chatData(): ChatData {
    return this._cellData;
  }

  private getAppellUrl(appellId: number): string {
    return (
      "asset.chatII.Appell" +
      AppellManager.Instance.model.getPerfixStyle(appellId)
    );
  }

  private removeEvent() {
    this.userName0.off(Laya.Event.CLICK, this, this.__playerClickHandler);
    this.headIcon.off(Laya.Event.CLICK, this, this.__playerClickHandler);
    this.clickRectL.off(Laya.Event.CLICK, this, this.onPlayVoice);
    this.clickRectR.off(Laya.Event.CLICK, this, this.onPlayVoice);
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
