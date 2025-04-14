import FUI_ChatMsgCell from "../../../../fui/Chat/FUI_ChatMsgCell";
import Logger from "../../../core/logger/Logger";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { IconFactory } from "../../../core/utils/IconFactory";
import Utils from "../../../core/utils/Utils";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { ChatEvent } from "../../constant/event/NotificationEvent";
import { IconType } from "../../constant/IconType";
import { EmWindow } from "../../constant/UIDefine";
import { ChatChannel } from "../../datas/ChatChannel";
import AppellManager from "../../manager/AppellManager";
import { ConfigManager } from "../../manager/ConfigManager";
import IMManager from "../../manager/IMManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../tips/ITipedDisplay";
import ChatFormat from "../../utils/ChatFormat";
import AppellModel from "../appell/AppellModel";
import ChatCellType from "./data/ChatCellType";
import ChatData from "./data/ChatData";
/**
 * @author:pzlricky
 * @data: 2021-04-29 11:12
 * @description ***
 */
export default class ChatMsgCell
  extends FUI_ChatMsgCell
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
  alphaTest?: boolean;
  tipDirctions?: string;
  tipGapV?: number;
  tipGapH?: number;

  public headIcon: IconAvatarFrame;
  public _cellData: ChatData = null;

  offsetX: number = 30; //文字距离背景的间隙
  minWidth: number = 58; //内容背景最小宽度
  maxWidth: number = 324; //内容背景最大宽度

  private isOpenChatTranslate = false;

  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    this.addEvent();
    this.chatControl.selectedIndex = 1;
    // this.txt_msg_R.div.style.wordWrap = true;
    // this.txt_msg_L.div.style.wordWrap = true;
    // this.txt_msg_R.div.style.width = this.maxWidth;
    // this.txt_msg_L.div.style.width = this.maxWidth;
    Utils.setDrawCallOptimize(this);
  }

  private addEvent() {
    this.userName0.on(Laya.Event.CLICK, this, this.__playerClickHandler);
    this.headIcon.on(Laya.Event.CLICK, this, this.__playerClickHandler);
    this.txt_msg_L.on(Laya.Event.LINK, this, this.onMessageHandler);
    this.txt_msg_R.on(Laya.Event.LINK, this, this.onMessageHandler);
    this.tr_btn_L.on(Laya.Event.CLICK, this, this.onTapTranslateMsg);
    this.tr_btn_R.on(Laya.Event.CLICK, this, this.onTapTranslateMsg);
  }

  /**点击头像 */
  private __playerClickHandler(evt: Laya.Event) {
    evt.stopPropagation();
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
          this._cellData.senderName,
        );
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.PLAYER_NAME_CLICK,
          ret,
        );
        break;
      case ChatCellType.GENERAL:
        // NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK,ret);
        break;
      case ChatCellType.PROP:
        // ret = ChatFormat.createPlayerCellData(this._cellData.channel, this._cellData.userType, this._cellData.uid, this._cellData.serverName, this._cellData.vipGrade, this._cellData.consortiaId, this._cellData.senderName);
        // NotificationManager.Instance.dispatchEvent(ChatEvent.PROP_CLICK, ret);
        this.tipType = EmWindow.PropTips;
        ret = ChatFormat.createPropCellData(jsonData);
        this.tipData = ret.data;
        ToolTipsManager.Instance.showTip(new Laya.Event(), this.displayObject);
        break;
      case ChatCellType.EQUIP:
        ret = jsonData;
        this.tipType = EmWindow.EquipTip;
        ret = ChatFormat.createPropCellData(jsonData);
        this.tipData = ret.data;
        ToolTipsManager.Instance.showTip(new Laya.Event(), this.displayObject);
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
          this._cellData.consortiaName,
        );
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.CONSORTIA_CLICK,
          ret,
        );
        break;
      case ChatCellType.ROOM:
        ret = ChatFormat.createRoomCellData(this._cellData.msg);
        NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK, ret);
        break;
      case ChatCellType.CHANNEL:
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.CHANNEL_CLICK,
          ret,
        );
        break;
      case ChatCellType.GM:
        NotificationManager.Instance.dispatchEvent(ChatEvent.ROOM_CLICK, ret);
        break;
      case ChatCellType.VIP:
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.VIP_LINK_CLICK,
          ret,
        );
        break;
      case ChatCellType.VipLink:
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.VIP_LINK_CLICK,
          ret,
        );
        break;
      case ChatCellType.APPELL_LINK:
        let appellId = Number(jsonData.id);
        ret = ChatFormat.createAppellCellData(this._cellData.channel, appellId);
        NotificationManager.Instance.dispatchEvent(
          ChatEvent.APPELL_LINK_CLICK,
          ret,
        );
        break;
      default:
        break;
    }
  }

  //聊天翻译点击
  private onTapTranslateMsg() {
    if (!this._cellData) return;
    if (
      this._cellData.translateMsg.trim() &&
      this._cellData.translateLangKey ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.chatTranslateKey
    )
      return;
    IMManager.Instance.sendTranslateMsg(this.chatData);
  }

  /**
   * 设置聊天数据
   */
  public set chatData(value: ChatData) {
    if (!value) return;
    this.isOpenChatTranslate = ConfigManager.info.CHAT_TRANSLATE;
    this._cellData = value;
    //系统 或 信息 栏
    if (value.uid == 0) return;
    //是否有聊天翻译
    let hasTranslate = !!value.translateMsg.trim();

    let isSameServer: boolean = true;
    if (value.serverName && value.serverName != "")
      //跨服判断
      isSameServer =
        value.serverName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;

    let isSelf =
      value.uid == PlayerManager.Instance.currentPlayerModel.userInfo.userId &&
      isSameServer;
    this.chatControl.selectedIndex = isSelf ? 0 : 1;
    let str: string = "";
    let elements = this._cellData.getAllElements();
    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      if (element && element.data) {
        this.txt_msg_L.data = element.data;
        this.txt_msg_R.data = element.data;
      }
      if (element && element.text) {
        str += element.text;
      }
    }

    let channel = this._cellData.channel;
    let consortiaName = "";
    if (this._cellData.consortiaName) {
      consortiaName = `[${this._cellData.consortiaName}]`;
    }

    if (isSelf) {
      // this.chatCahnnelImg0.url = FUIHelper.getItemURL('Base', ChatChannel.getChatChannelIcon(channel));
      this.consortiaName0.text = consortiaName;
      this.userName0.color = ChatChannel.getChatChannelColor(channel);
      this.userName0.text = this._cellData.senderName;
      this.txt_curTime.align = "left";
    } else {
      // this.chatCahnnelImg1.url = FUIHelper.getItemURL('Base', ChatChannel.getChatChannelIcon(channel));
      this.consortiaName1.text = consortiaName;
      this.userName1.color = ChatChannel.getChatChannelColor(channel);
      this.userName1.text = this._cellData.senderName;
      if (channel == ChatChannel.BUBBLETYPE_TARGET) {
        // this.infoGroup1.x = 74;
        this.userName1.x = 127;
      }
      this.txt_curTime.align = "right";
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
    this.headIcon.headId = _headId;
    if (this._cellData.frameId > 0) {
      let itemData: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(
          this._cellData.frameId,
        );
      if (itemData) {
        this.headIcon.headFrame = itemData.Avata;
        this.headIcon.headEffect =
          Number(itemData.Property1) == 1 ? itemData.Avata : "";
      }
    } else {
      this.headIcon.headFrame = "";
      this.headIcon.headEffect = "";
    }
    this.setAppellTxt(this._cellData.appellId, isSelf);
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

    this.tr_btn_R.visible = false;
    this.tr_btn_L.visible = false;
    this.img_ttrbg_R.visible = false;
    this.img_ttrbg_L.visible = false;
    this.tr_msg_L.visible = false;
    this.tr_msg_R.visible = false;

    if (isSelf) {
      this.tr_btn_R.visible = true && this.isOpenChatTranslate;
      this.txt_msg_R.autoSize = fgui.AutoSizeType.Both;
      this.txt_msg_R.align = "right";
      this.txt_msg_R.text = str;

      if (this.txt_msg_R.width >= this.maxWidth) {
        this.txt_msg_R.autoSize = fgui.AutoSizeType.Height;
        this.txt_msg_R.width = this.maxWidth;
        this.txt_msg_R.align = "left";
        this.txt_msg_R.text = str;
      }

      this.height = this.img_textbg_R.y + this.img_textbg_R.height;

      if (hasTranslate) {
        this.img_ttrbg_R.visible = true;
        this.tr_msg_R.visible = true;
        this.tr_msg_R.autoSize = fgui.AutoSizeType.Both;
        this.tr_msg_R.align = "right";
        this.tr_msg_R.text = value.translateMsg;

        if (this.tr_msg_R.width >= this.maxWidth) {
          this.tr_msg_R.autoSize = fgui.AutoSizeType.Height;
          this.tr_msg_R.width = this.maxWidth;
          this.tr_msg_R.align = "left";
          //重新赋值,触发自动布局
          this.tr_msg_R.text = value.translateMsg;
        }
        this.height = this.img_ttrbg_R.y + this.img_ttrbg_R.height;
      }
      return;
    }

    this.tr_btn_L.visible = true && this.isOpenChatTranslate;
    this.txt_msg_L.autoSize = fgui.AutoSizeType.Both;
    this.txt_msg_L.align = "right";
    this.txt_msg_L.text = str;

    if (this.txt_msg_L.width >= this.maxWidth) {
      this.txt_msg_L.autoSize = fgui.AutoSizeType.Height;
      this.txt_msg_L.width = this.maxWidth;
      this.txt_msg_L.align = "left";
      this.txt_msg_L.text = str;
    }

    this.height = this.img_textbg_L.y + this.img_textbg_L.height;

    if (hasTranslate) {
      this.img_ttrbg_L.visible = true;
      this.tr_msg_L.visible = true;
      this.tr_msg_L.autoSize = fgui.AutoSizeType.Both;
      this.tr_msg_L.align = "right";
      this.tr_msg_L.text = value.translateMsg;

      if (this.tr_msg_L.width >= this.maxWidth) {
        this.tr_msg_L.autoSize = fgui.AutoSizeType.Height;
        this.tr_msg_L.width = this.maxWidth;
        this.tr_msg_L.align = "left";
        //重新赋值,触发自动布局
        this.tr_msg_L.text = value.translateMsg;
      }
      this.height = this.img_ttrbg_L.y + this.img_ttrbg_L.height;
    }
  }

  /**设置称号 */
  setAppellTxt(appellId: number = 0, isSelf: boolean) {
    this.appellTxt0.text = "";
    this.appellTxt1.text = "";
    let appellTxt = "";
    let appellColor = "";
    let appellData = AppellManager.Instance.model.getAppellInfo(appellId);
    if (
      appellData &&
      appellData.PerfixLang != "" &&
      appellData.PerfixLang != undefined
    ) {
      appellTxt = appellData.PerfixLang;
      appellColor = AppellModel.getTextColorAB(appellData.TextColorIdx);
    }
    if (isSelf) {
      this.appellTxt0.text = appellTxt;
      this.appellTxt0.color = appellColor;
    } else {
      this.appellTxt1.text = appellTxt;
      this.appellTxt1.color = appellColor;
    }
  }

  private GetAppellTxt(isSelf: boolean = false): fgui.GTextField {
    if (isSelf) {
      return this.appellTxt0;
    }
    return this.appellTxt1;
  }

  /**
   * 显示自己的消息内容
   * @param str
   */
  private showSelfEmoji(str: string) {
    this.txt_msg_R.text = str;
    // this.txt_msg_R.autoSize = 0;
    // //❌❎ ➕
    // this.txt_msg_R.div.style.width = this.maxWidth;

    // let first = this.txt_msg_R.div.x == 35;

    // this.txt_msg_R.div.x = 35;
    // this.txt_msg_R.div.innerHTML = str;
    // let W: number = this.txt_msg_R.div.contextWidth;
    // let H: number = this.txt_msg_R.div.contextHeight;

    // if (str.indexOf('❌') >= 0 || str.indexOf('➕') >= 0 || str.indexOf('❎') >= 0) {
    //     this.txt_msg_R.width = W + 15;
    //     this.img_textbg_R.width = W + 30;
    // } else {
    //     this.txt_msg_R.width = W + 2;//输入 我是VIP9 显示会异常, 所以这里的宽+2
    // }
    // this.txt_msg_R.height = H;
    // // Logger.log("-----encodemsg",str,':', 'contextWidth',W,'contextHeight',H,'textWidth:',this.txt_msg_R.textWidth,'textHeight',this.txt_msg_R.height);
    // // 现在的表情变成高30,div高40, 文字div高28
    // if (H > 40) {
    //     if (!first) this.txt_msg_R.div.x = 35 + this.maxWidth - W;
    //     this.txt_msg_R.div.style.align = 'left';
    // } else {
    //     this.txt_msg_R.div.style.align = 'right'
    // }
    // this.height = this.img_textbg_R.height + 41;
  }

  /**
   * 显示他人的消息内容
   * @param str
   */
  private showOtherEmoji(str: string) {
    // this.txt_msg_L.autoSize = 0;
    // this.txt_msg_L.div.style.width = this.maxWidth;
    // this.txt_msg_L.div.x = 135;
    // this.txt_msg_L.div.innerHTML = str;
    // let W: number = this.txt_msg_L.div.contextWidth;
    // let H: number = this.txt_msg_L.div.contextHeight;
    // this.txt_msg_L.width = W;
    // this.txt_msg_L.height = H;
    // this.height = this.img_textbg_L.height + 41;
  }

  public get chatData(): ChatData {
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
    this.txt_msg_L.off(Laya.Event.LINK, this, this.onMessageHandler);
    this.txt_msg_R.off(Laya.Event.LINK, this, this.onMessageHandler);
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
