//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import Utils from "../../../core/utils/Utils";
import { t_s_chatbubbleData } from "../../config/t_s_chatbubble";
import { CharBubbleEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import { TempleteManager } from "../../manager/TempleteManager";
import ChatAirBubbleItemCell from "./ChatAirBubbleItemCell";

/**
 * 聊天气泡购买窗口
 */
export default class ChatAirBubbleWnd extends BaseWindow {
  private frame: fgui.GComponent;
  private list: fgui.GList;

  private listData: t_s_chatbubbleData[] = [];

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.onEvent();
    this.onInitData();
  }

  /** */
  onEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      CharBubbleEvent.CHAT_BUBBLES_OPT,
      this.onOptBubbleData,
      this,
    );
  }

  /** */
  offEvent() {
    // this.list.itemRenderer && this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    NotificationManager.Instance.removeEventListener(
      CharBubbleEvent.CHAT_BUBBLES_OPT,
      this.onOptBubbleData,
      this,
    );
  }

  onInitData() {
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "buildings.offerreward.OfferRewardFrame.title",
    );
    this.listData = [];
    let cfgDatas = TempleteManager.Instance.getAllAirBubbles();
    this.listData = cfgDatas;
    let count = cfgDatas.length;
    this.list.numItems = count;
  }

  /**渲染 */
  renderListItem(index: number, item: ChatAirBubbleItemCell) {
    if (!item || item.isDisposed) return;
    item.itemData = this.listData[index];
  }

  /**气泡 */
  private onOptBubbleData(op: number, bubbleId: number) {
    let count = this.listData.length;
    if (op == 1) {
      this.list.numItems = count;
    } else if (op == 2) {
      this.list.numItems = count;
    }
  }

  private clearData() {
    this.listData = [];
  }

  helpBtnClick() {
    let title = LangManager.Instance.GetTranslation("mounts.HelpTitle");
    let content = LangManager.Instance.GetTranslation("mounts.helpTxt");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  OnHideWind() {
    this.offEvent();
    this.clearData();
    super.OnHideWind();
  }
}
