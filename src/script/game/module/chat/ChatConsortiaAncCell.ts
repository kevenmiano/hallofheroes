// @ts-nocheck
import Logger from "../../../core/logger/Logger";
import { ChatEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import ChatFormat from "../../utils/ChatFormat";
import FUI_ChatConsortiaAncCell from "../../../../fui/Chat/FUI_ChatConsortiaAncCell";
import ChatCellType from "./data/ChatCellType";
import ChatData from "./data/ChatData";

/**
 * @author:pzlricky
 * @data: 2021-12-01 11:32
 * @description 公会聊天cell
 */
export default class ChatConsortiaAncCell extends FUI_ChatConsortiaAncCell {
  private _cellData: ChatData = null;

  onConstruct() {
    super.onConstruct();
  }

  public get cellData(): ChatData {
    return this._cellData;
  }

  private addEvent() {
    this.msgContent.on(Laya.Event.LINK, this, this.onMessageHandler);
  }

  /**点击文本链接 */
  private onMessageHandler(evtData: string) {
    Logger.warn("Click TextMessage!", evtData);
    //转换为Json数据
    let textData = evtData;
    if (!textData) return;
    let linkData = textData.split("|");
    let jsonData: any = {};
    for (let index = 0; index < linkData.length; index++) {
      let element = linkData[index];
      if (element.indexOf(":") == -1) continue;
      let params = element.split(":");
      if (params[0] == "" || params[1] == "") continue;
      jsonData[params[0]] = params[1];
    }
    let clickType = Number(jsonData.cellType);
    let ret = null;
    switch (
      clickType //具体类型看ChatData里面定义
    ) {
      case ChatCellType.Player:
        ret = ChatFormat.createPlayerCellData(
          this._cellData.channel,
          this._cellData.userType,
          this._cellData.uid,
          this._cellData.serverName,
          this._cellData.vipGrade,
          this._cellData.consortiaId,
          this._cellData.senderName
        );
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.PLAYER_NAME_CLICK,
          ret
        );
        break;
      case ChatCellType.GENERAL:
        // NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK,ret);
        break;
      case ChatCellType.PROP:
        ret = ChatFormat.createPlayerCellData(
          this._cellData.channel,
          this._cellData.userType,
          this._cellData.uid,
          this._cellData.serverName,
          this._cellData.vipGrade,
          this._cellData.consortiaId,
          this._cellData.senderName
        );
        NotificationManager.Instance.dispatchEvent(ChatEvent.PROP_CLICK, ret);
        break;
      case ChatCellType.EQUIP:
        NotificationManager.Instance.dispatchEvent(ChatEvent.EQUIP_CLICK, ret);
        break;
      case ChatCellType.HONER:
        // NotificationManager.Instance.dispatchEvent(ChatEvent.,ret);
        break;
      case ChatCellType.STAR:
        NotificationManager.Instance.dispatchEvent(ChatEvent.STAR_CLICK, ret);
        break;
      case ChatCellType.CONSORTIA:
        ret = ChatFormat.createConsortiaCellData(
          this._cellData.consortiaId,
          this._cellData.consortiaName
        );
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.CONSORTIA_CLICK,
          ret
        );
        break;
      case ChatCellType.ROOM:
        ret = ChatFormat.createRoomCellData(this._cellData.msg);
        NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK, ret);
        break;
      case ChatCellType.CHANNEL:
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.CHANNEL_CLICK,
          ret
        );
        break;
      case ChatCellType.GM:
        NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK, ret);
        break;
      case ChatCellType.VIP:
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.VIP_LINK_CLICK,
          ret
        );
        break;
      case ChatCellType.VipLink:
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.VIP_LINK_CLICK,
          ret
        );
        break;
      default:
        break;
    }
  }

  set chatData(value) {
    if (value) {
      this.msgContent.text = "";
      this._cellData = value;
      //系统 或 信息 栏
      if (value.uid != 0) {
        //发送者非系统
        let isSelf =
          value.uid ==
          PlayerManager.Instance.currentPlayerModel.userInfo.userId;
        let elements = this._cellData.getAllElements();
        for (let index = 0; index < elements.length; index++) {
          let element = elements[index];
          if (element && element.data) this.msgContent.data = element.data;
          if (element && element.text) this.msgContent.text += element.text;
        }
      }
    }
  }

  get chatData(): ChatData {
    return this._cellData;
  }
}
