import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import {
  ChatEvent,
  FriendUpdateEvent,
} from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import RequestInfoRientation from "../../datas/RequestInfoRientation";
import { ArmyManager } from "../../manager/ArmyManager";
import { FriendManager } from "../../manager/FriendManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { GoodsHelp } from "../../utils/GoodsHelp";

/**
 * @author:zhihua.zhou
 * @data: 2021-12-21
 * @description 收到赠花
 */
export default class ReceiveFlowerWnd extends BaseWindow {
  private txt_desc: fairygui.GTextField;
  private btn_close: fairygui.GButton;
  private btn_send: fairygui.GButton;
  private btn_talk: fairygui.GButton;
  private frame: fairygui.GComponent;
  private item: BaseItem;
  private senderName: string;
  private templateId: number;
  private _userId: number;

  public OnInitWind() {
    super.OnInitWind();
    this.btn_close = this.frame.getChild("closeBtn").asButton;
    this.setCenter();
    this.addEvent();

    this.senderName = this.params[1];
    this.templateId = this.params[0];
    this._userId = this.params[2];
    let presentRose: string = "";
    let goods: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(this.templateId);
    if (goods) {
      let info = new GoodsInfo();
      info.templateId = this.templateId;
      this.item.info = info;
      presentRose = goods.TemplateNameLang;
    }
    let name: string =
      "[color=" +
      GoodsHelp.getGoodColorString(goods.Profile) +
      "][" +
      presentRose +
      "][/color]";
    this.txt_desc.text =
      "[" +
      this.senderName +
      "] " +
      LangManager.Instance.GetTranslation(
        "simplegame.roses.RosePresentBackView.presentShowContent",
        name,
      );
  }

  private addEvent() {
    this.btn_send.onClick(this, this.onSend);
    this.btn_close.onClick(this, this.onClose);
    this.btn_talk.onClick(this, this.onTalk);
  }

  private removeEvent() {
    this.btn_send.offClick(this, this.onSend);
    this.btn_close.offClick(this, this.onClose);
    this.btn_talk.offClick(this, this.onTalk);
  }

  onSend() {
    this.onClose();
    UIManager.Instance.ShowWind(EmWindow.SendFlowerWnd, this.senderName);
  }

  onTalk() {
    if (ArmyManager.Instance.thane.grades < 6) {
      var str: string = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      this.onClose();
      return;
    }
    FriendManager.getInstance().addEventListener(
      FriendUpdateEvent.FRIEND_CHANGE,
      this.getSnsInfo,
      this,
    );
    PlayerManager.Instance.sendRequestSimpleAndSnsInfo(
      this._userId,
      RequestInfoRientation.IM_INFO,
    );
    this.onClose();
  }

  private getSnsInfo(snsInfo) {
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.FRIEND_CHANGE,
      this.getSnsInfo,
      this,
    );
    var info: ThaneInfo = new ThaneInfo();
    info.userId = this._userId;
    info.nickName = this.senderName;
    info.isRobot = false;
    info.snsInfo = snsInfo;

    if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {
      FrameCtrlManager.Instance.open(EmWindow.ChatWnd, {
        thaneInfo: info,
        type: 1,
      });
    } else {
      NotificationManager.Instance.dispatchEvent(ChatEvent.CHAT_MESSAGE, info);
    }
  }

  onClose() {
    UIManager.Instance.HideWind(EmWindow.ReceiveFlowerWnd);
  }

  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
