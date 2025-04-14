import FUI_RewardMsgItem from "../../../../../fui/Funny/FUI_RewardMsgItem";
import { ITipedDisplay } from "../../../tips/ITipedDisplay";
import { EmWindow } from "../../../constant/UIDefine";
import Logger from "../../../../core/logger/Logger";
import ChatCellType from "../../chat/data/ChatCellType";
import ChatFormat from "../../../utils/ChatFormat";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import ChatData from "../../chat/data/ChatData";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/22 21:29
 * @ver 1.0
 */
export class RewardMsgItem extends FUI_RewardMsgItem implements ITipedDisplay {
  tipData: any;
  tipType: EmWindow;

  private _cellVector: Array<any> = [];

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.addEvent();
  }

  private addEvent() {
    this.content.on(Laya.Event.LINK, this, this.onClickLink);
  }

  onClickLink(evtData: string) {
    /**点击文本链接 */
    Logger.warn("Click TextMessage!", evtData);
    //转换为Json数据
    let textData = evtData;
    if (!textData) {
      return;
    }
    let linkData = textData.split("|");
    let jsonData: any = {};
    for (let index = 0; index < linkData.length; index++) {
      let element = linkData[index];
      if (element.indexOf(":") == -1) {
        continue;
      }
      let params = element.split(":");
      if (params[0] == "" || params[1] == "") {
        continue;
      }
      jsonData[params[0]] = params[1];
    }
    let clickType = Number(jsonData.cellType);
    let ret = null;
    switch (
      clickType //具体类型看ChatData里面定义
    ) {
      case ChatCellType.GENERAL:
        this.tipType = EmWindow.PropTips;
        break;
      case ChatCellType.PROP:
        this.tipType = EmWindow.PropTips;
        break;
      case ChatCellType.EQUIP:
        this.tipType = EmWindow.EquipTip;
        break;
      case ChatCellType.HONER:
        this.tipType = EmWindow.EquipTip;
        break;
      case ChatCellType.STAR:
        this.tipType = EmWindow.StarTip;
        break;
      default:
        break;
    }
    ret = ChatFormat.createPropCellData(jsonData);
    this.tipData = ret.data;
    ToolTipsManager.Instance.showTip(new Laya.Event(), this.displayObject);
  }

  private _chatData: ChatData;

  public set info(value: ChatData) {
    this._chatData = value;
    if (this._chatData) {
      this.refreshView();
    }
  }

  private refreshView() {
    this._cellVector = [];
    this._cellVector = this._cellVector.concat(
      ChatFormat.getContentCellData(this._chatData),
    );
    let elementText: string = "";
    let elements = this._cellVector;
    let count = elements.length;
    let split = "";
    let splitIndex: number = 0;
    for (let index = 0; index < count; index++) {
      let element = elements[index];
      if (element) {
        split = "";
        if (element.type == ChatCellType.PROP) {
          if (splitIndex > 0) split = ",&nbsp;";
          splitIndex++;
        }
        elementText += split + element.text;
      }
    }
    this.content.text = elementText;
  }

  private removeEvent() {
    this.content.off(Laya.Event.LINK, this, this.onClickLink);
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
