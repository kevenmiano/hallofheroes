// @ts-nocheck
import FUI_ChatMessageCell from "../../../../fui/Base/FUI_ChatMessageCell";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { ChatChannel } from "../../datas/ChatChannel";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import FUIHelper from "../../utils/FUIHelper";
import ChatData from "../chat/data/ChatData";

/**
 * @author:pzlricky
 * @data: 2021-05-10 15:24
 * @description 主界面聊天信息cell
 */
export default class ChatMessageCell extends FUI_ChatMessageCell {
  private _cellData: ChatData;

  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    (this.textTxt.displayObject as Laya.HTMLDivElement).style.wordWrap = false;
    this.addEvent();
  }

  addEvent() {
    this.onClick(this, this.onCellClickHandler);
  }

  offEvent() {
    this.offClick(this, this.onCellClickHandler);
  }

  /**点击打开聊天框 */
  onCellClickHandler() {
    FrameCtrlManager.Instance.open(EmWindow.ChatWnd);
  }

  public set itemdata(value: ChatData) {
    this._cellData = value;
    this.channelIcon.url = FUIHelper.getItemURL(
      EmPackName.Base,
      ChatChannel.getChatChannelIcon(value.channel)
    );
    let elementText: string = "";
    let elements = value.getAllElements();
    if (value.senderName != "") {
      if (elements[1] && elements[1].text == value.senderName) {
      } else {
        elementText = "[" + value.senderName + "]: ";
      }
    }
    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      elementText += element ? element.text : "";
    }
    this.textTxt.valign = "middle";
    let hasEmoji = elementText.indexOf("<img") >= 0;
    this.emoji.selectedIndex = hasEmoji ? 1 : 0;
    this.textTxt.text = elementText;
    if (value.serverId) {
      if (this.voice) {
        this.voice.visible = true;
        this.voice.x = this.textTxt.x + this.textTxt.textWidth;
      }
      this.txt_secR.text = value.voiceTime + '"';
      this.txt_secR.y = 13;
    } else {
      if (this.voice) {
        this.voice.visible = false;
      }
    }
  }

  public get itemdata(): ChatData {
    return this._cellData;
  }
}
