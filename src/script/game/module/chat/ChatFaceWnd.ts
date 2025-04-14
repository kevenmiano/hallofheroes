import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { NotificationManager } from "../../manager/NotificationManager";
import { ChatEvent } from "../../constant/event/NotificationEvent";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { PathManager } from "../../manager/PathManager";
import Utils from "../../../core/utils/Utils";
/**
 * @author:pzlricky
 * @data: 2021-04-29 10:16
 * @description 聊天表情窗口
 */
export default class ChatFaceWnd extends BaseWindow {
  public list: fgui.GList;
  private btnDelete: fairygui.GButton;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    if (this.params) {
      let point = this.params;
      this.x = point.x;
      this.y = point.y - this.contentPane.height - 30;
    }
    this.onInitFacelist();
    Utils.setDrawCallOptimize(this.list);
    this.onInitEvent();
  }

  /**
   * 初始化表情列表
   */
  onInitFacelist() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderFaceListItem,
      null,
      false,
    );
    let count = PathManager.info.FACE_NUM;
    this.list.numItems = count; //表情数量FACE_NUM
    this.list.resizeToFit();
  }

  onInitEvent() {
    this.list.on(fairygui.Events.CLICK_ITEM, this, this.__onFaceItemSelect);
    this.btnDelete.onClick(this, this.onDelete);
  }

  onDelete() {
    NotificationManager.Instance.dispatchEvent(ChatEvent.CHAT_EMJOY_CLICK);
  }

  onRemoveEvent() {
    this.btnDelete.offClick(this, this.onDelete);
    this.list.off(fairygui.Events.CLICK_ITEM, this, this.__onFaceItemSelect);
  }

  /**渲染表情item */
  renderFaceListItem(index: number, item) {
    let eindex: string = "";
    if (index < 10) {
      // if(index == 3){
      //     eindex = "23";
      // }else
      // {
      eindex = "0" + index.toString();
      // }
    } else {
      eindex = index.toString();
    }
    let data = {
      eindex: eindex,
      ename: LangManager.Instance.GetTranslation(
        "chat.view.ExpressionList.Ename" + eindex,
      ),
    };
    item.itemdata = data;
    item.icon = "res/game/face/face" + eindex + ".png";
  }

  /**选择表情 */
  __onFaceItemSelect(targetItem) {
    let targetData = targetItem.itemdata;
    Logger.warn("选择表情:", targetData.ename);
    NotificationManager.Instance.dispatchEvent(
      ChatEvent.CHAT_EMJOY_CLICK,
      targetData,
    );
    this.OnBtnClose();
    // UIManager.Instance.HideWind(EmWindow.ChatFaceWnd);
  }
}
