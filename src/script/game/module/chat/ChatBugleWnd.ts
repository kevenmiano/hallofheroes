import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import StringHelper from "../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ChatManager } from "../../manager/ChatManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ChatHelper from "../../utils/ChatHelper";
import MagicCardInfo from "../card/MagicCardInfo";
import StarInfo from "../mail/StarInfo";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import ChatModel from "./ChatModel";

import ChatItemInfoMsg = com.road.yishi.proto.chat.ChatItemInfoMsg;
import ChatStarInfoMsg = com.road.yishi.proto.chat.ChatStarInfoMsg;
import ChatPowCardInfoMsg = com.road.yishi.proto.chat.ChatPowCardInfoMsg;
import OpenGrades from "../../constant/OpenGrades";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
/**
 * @author:pzlricky
 * @data: 2021-05-06 17:32
 * @description 聊天喇叭窗口
 */
export default class ChatBugleWnd extends BaseWindow {
  public frame: fgui.GComponent;
  public textbg: fgui.GImage;
  public btnCancel: fgui.GButton;
  public btnSend: fgui.GButton;
  public leftCount: fgui.GRichTextField;
  public limitCount: fgui.GTextField;
  private msgContent: Laya.Input = null;
  public inputTips: fgui.GTextField;

  private _smallBulgeFlag: boolean;
  private _sendItemList: Array<GoodsInfo>;
  private _sendStarList: Array<StarInfo>;
  private _sendCardList: Array<MagicCardInfo>;

  private _smallBugleCache: object;
  private _currentInChannel: number;
  private _currentChatStr: string = "";

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.onInitData();
    this.addEvent();
  }

  private onInitData() {
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "ChatBugleWnd.titleTxt",
    );
    this.msgContent = new Laya.Input();
    this.msgContent.wordWrap = true;
    this.msgContent.fontSize = 20;
    this.msgContent.color = "#94866E";
    this.msgContent.leading = 10;
    // this.msgContent.padding = '3';
    this.msgContent.width = this.textbg.width - 30;
    this.msgContent.height = this.textbg.height - 30;
    this.msgContent.x = this.textbg.x + 15;
    this.msgContent.y = this.textbg.y + 15;
    this.msgContent.multiline = true;
    this.msgContent.wordWrap = true;
    this.msgContent.text = "";
    this.addChild(this.msgContent);

    let maxCount = TempleteManager.Instance.CfgMaxWordCount;
    this.limitCount.text = "0/" + maxCount;

    this._sendItemList = new Array<GoodsInfo>();
    this._sendStarList = new Array<StarInfo>();
    this._sendCardList = new Array<MagicCardInfo>();
    this._currentInChannel = this.chatModel.currentInChannel;
    this._smallBugleCache = new Object();
    this.refreshBugleCount();
  }

  private addEvent() {
    this.btnCancel.onClick(this, this.onCloseWnd.bind(this));
    this.btnSend.onClick(this, this.onSendBugle.bind(this));
    this.msgContent.on(Laya.Event.INPUT, this, this.__onContentChange);
    this.msgContent.on(Laya.Event.FOCUS, this, this.onMailContentFocusIn);
    this.msgContent.on(Laya.Event.BLUR, this, this.onMailContentFocusOut);
  }

  /**文本内容变化 */
  private contentWords: string = "";
  private __onContentChange(evt: Event) {
    let mailContent: string = ChatHelper.parasMsgs(this.msgContent.text);
    let maxCount = TempleteManager.Instance.CfgMaxWordCount;
    if (mailContent.length > maxCount) {
      this.contentWords = mailContent.slice(0, maxCount);
      this.limitCount.text = maxCount + "/" + maxCount;
      this.msgContent.text = this.contentWords;
      this._currentChatStr = this.contentWords;
      return;
    }
    this.limitCount.text = mailContent.length + "/" + maxCount;
    this.contentWords = mailContent;
    this.inputTips.visible = this.contentWords == "";
    this._currentChatStr = this.contentWords;
  }

  private onMailContentFocusIn() {
    this.inputTips.visible = false;
  }

  private onMailContentFocusOut() {
    let mailContent: string = this.msgContent.text;
    this.inputTips.visible = mailContent == "";
  }

  private refreshBugleCount() {
    var num: number = GoodsManager.Instance.getGoodsNumByTempId(
      ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
    );
    this.leftCount.setVar("count", num.toString()).flushVars();
  }

  private _flag: boolean;
  private crossBugleHandler(str: string, itemList, starList, cardList) {
    if (!this._flag) {
      let num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.CROSS_BUGLE_TEMP_ID,
      );
      if (num == 0) {
        var command: string = LangManager.Instance.GetTranslation(
          "chat.view.ChatInputView.command06",
        );
        MessageTipManager.Instance.show(command);
        var data: ShopGoodsInfo =
          TempleteManager.Instance.getShopTempInfoByItemId(
            ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
          );
        let obj = {
          info: data,
          count: 1,
          callback: this.shopBugleBack.bind(this),
          param: [
            ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
            itemList,
            starList,
            cardList,
          ],
        };
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
        return;
      }
    }
    ChatManager.Instance.chatByCross(str, itemList, starList, cardList);
    this.onCloseWnd();
  }

  private bigBugleHandler(str: string, itemList, starList, cardList) {
    if (!this._flag) {
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
      );
      if (num == 0) {
        var command: string = LangManager.Instance.GetTranslation(
          "chat.view.ChatInputView.command06",
        );
        MessageTipManager.Instance.show(command);
        var data: ShopGoodsInfo =
          TempleteManager.Instance.getShopTempInfoByItemId(
            ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
          );
        let obj = {
          info: data,
          count: 1,
          callback: this.shopBugleBack.bind(this),
          param: [
            ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
            itemList,
            starList,
            cardList,
          ],
        };
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
        return;
      }
    }

    let content: string = LangManager.Instance.GetTranslation("Chat.Bigbugle");
    SimpleAlertHelper.Instance.Show(
      null,
      null,
      null,
      content,
      null,
      null,
      function (b) {
        if (b) {
          ChatManager.Instance.chatByBugle(str, itemList, starList, cardList);
          UIManager.Instance.HideWind(EmWindow.ChatBugleWnd);
        }
      },
    );
  }

  private shopBugleBack(flag: boolean, data: object) {
    if (flag) {
      this._flag = true;
      var itemId: number = Number(data[0]);
      if (itemId == ShopGoodsInfo.SMALL_BUGLE_TEMP_ID) {
        ChatManager.Instance.chatBySmallBugle(
          this._currentChatStr,
          data[1],
          data[2],
          data[3],
        );
      } else if (itemId == ShopGoodsInfo.BIG_BUGLE_TEMP_ID) {
        ChatManager.Instance.chatByBugle(
          this._currentChatStr,
          data[1],
          data[2],
          data[3],
        );
      } else if (itemId == ShopGoodsInfo.CROSS_BUGLE_TEMP_ID) {
        ChatManager.Instance.chatByCross(
          this._currentChatStr,
          data[1],
          data[2],
          data[3],
        );
      }
      this._flag = false;
    }
    this.refreshBugleCount();
    this.onCloseWnd();
  }

  private get chatModel(): ChatModel {
    return ChatManager.Instance.model;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private onCloseWnd() {
    UIManager.Instance.HideWind(EmWindow.ChatBugleWnd);
  }

  private onSendBugle() {
    let item: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(
        ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
      );
    if (item) {
      if (item.NeedGrades > ArmyManager.Instance.thane.grades) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "chatWnd.bigBugle.tips",
            item.NeedGrades,
          ),
          undefined,
          true,
        );
        return;
      }
    }

    var chatStr: string = this.msgContent.text;
    if (
      chatStr == "" ||
      StringHelper.trim(chatStr) == "" ||
      StringHelper.trim(chatStr) == undefined
    ) {
      //空字符串不发送
      var command: string = LangManager.Instance.GetTranslation(
        "yishi.view.ConfirmSellFrame.inputNull",
      );
      MessageTipManager.Instance.show(command, undefined, true);
      return;
    }

    //过滤非法字符
    let retStr = ChatHelper.parasMsgs(chatStr);

    var itemList: Array<ChatItemInfoMsg> = [];
    var starList: Array<ChatStarInfoMsg> = [];
    var cardList: Array<ChatPowCardInfoMsg> = [];
    this.bigBugleHandler(retStr, itemList, starList, cardList);
    //发送关闭窗口
  }
}
