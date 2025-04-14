//@ts-expect-error: External dependencies
import FUI_listMsgItem from "../../../../../fui/OutCityShop/FUI_listMsgItem";
import Logger from "../../../../core/logger/Logger";
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import ChatFormat from "../../../utils/ChatFormat";
import ChatCellType from "../../chat/data/ChatCellType";
import ChatData from "../../chat/data/ChatData";

export default class listMsgItem
  extends FUI_listMsgItem
  implements ITipedDisplay
{
  tipType: EmWindow;
  tipData: any;
  showType?: TipsShowType;
  canOperate?: boolean;
  extData?: any;
  startPoint?: Laya.Point;
  iSDown?: boolean;
  isMove?: boolean;
  mouseDownPoint?: Laya.Point;
  moveDistance?: number;
  tipDirctions?: string;
  tipGapV?: number;
  tipGapH?: number;

  private _cellVector: Array<any> = [];
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  private addEvent() {
    this.msg.on(Laya.Event.LINK, this, this.onClickLink);
    // ToolTipsManager.Instance.register(this);
  }

  private offEvent() {
    this.msg.off(Laya.Event.LINK, this, this.onClickLink);
    // ToolTipsManager.Instance.unRegister(this);
  }

  onClickLink(evtData: string) {
    /**点击文本链接 */
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
    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      if (element) {
        elementText += element.text;
      }
    }
    this.msg.text = elementText;
  }

  dispose() {
    this.offEvent();
    super.dispose();
  }
}
