import LangManager from "../../core/lang/LangManager";
import StringHelper from "../../core/utils/StringHelper";
import XmlMgr from "../../core/xlsx/XmlMgr";
import { t_s_appellData } from "../config/t_s_appell";
// import { t_s_campaignData } from "../config/t_s_campaign";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { t_s_powcardtemplateData } from "../config/t_s_powcardtemplate";
import { t_s_startemplateData } from "../config/t_s_startemplate";
import { GlobalConfig } from "../constant/GlobalConfig";
import { GoodsType } from "../constant/GoodsType";
// import UserType from "../constant/UserType";
import { ChatChannel } from "../datas/ChatChannel";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import AppellManager from "../manager/AppellManager";
import { CampaignManager } from "../manager/CampaignManager";
// import { KingTowerManager } from "../manager/KingTowerManager";
import { TempleteManager } from "../manager/TempleteManager";
import MagicCardBuffInfo from "../module/card/MagicCardBuffInfo";
import MagicCardInfo from "../module/card/MagicCardInfo";
import ChatCellData from "../module/chat/data/ChatCellData";
import ChatCellType from "../module/chat/data/ChatCellType";
import ChatData from "../module/chat/data/ChatData";
import StarInfo from "../module/mail/StarInfo";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import { GoodsHelp } from "./GoodsHelp";

/**
 * author:pzlricky
 * data: 2021-04-27 18:32
 * description ***
 */
export default class ChatFormat {
  public static createChannelCellData(channel: number): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.CHANNEL;
    cellData.channel = channel;
    cellData.text = "[ " + ChatChannel.getChatChannelName(channel) + " ]";
    return cellData;
  }

  public static createExtraChatCellByContent(
    srr: Array<string>,
    chatdata: ChatData,
  ): Array<ChatCellData> {
    let i: number = 0;
    let index: number = 0;
    let str: string = "";
    let cellData: ChatCellData;
    let msg: string = chatdata.msg;
    let xml: any;
    let list: Array<ChatCellData> = [];
    for (i = 0; i < srr.length; i++) {
      index = 0;
      str = srr[i];
      index = msg.indexOf(str);
      if (index > 0) {
        cellData = ChatFormat.createGeneralCellData(
          msg.substr(0, index),
          chatdata.channel,
        );
        list.push(cellData);
      }
      msg = msg.substr(index + str.length, msg.length);
      if (
        chatdata.channel == ChatChannel.SYSTEM ||
        chatdata.channel == ChatChannel.INFO ||
        chatdata.channel == ChatChannel.SYS_ALERT ||
        chatdata.channel == ChatChannel.NOTICE
      ) {
        list = list.concat(
          ChatFormat.createSysCellDataByContent(
            str,
            chatdata.userType,
            chatdata.vipGrade,
            chatdata.channel,
            chatdata.senderName,
            chatdata.receiverName,
          ),
        );
      } else if (chatdata.type == 3) {
        xml = XmlMgr.Instance.decode(str);
        cellData = ChatFormat.createGeneralCellData("[", chatdata.channel);
        list.push(cellData);
        cellData = ChatFormat.createPlayerCellData(
          chatdata.channel,
          chatdata.userType,
          Number(xml.a.id),
          xml.a.serverName,
          chatdata.vipGrade,
          Number(xml.a.consortiaId),
          String(xml.a.name),
        );
        list.push(cellData);
        cellData = ChatFormat.createGeneralCellData("]", chatdata.channel);
        list.push(cellData);
      } else if (chatdata.type == 4) {
        cellData = ChatFormat.createRoomCellData(str);
        list.push(cellData);
      } else {
        list = list.concat(
          ChatFormat.createSysCellDataByContent(
            str,
            chatdata.userType,
            chatdata.vipGrade,
            chatdata.channel,
            chatdata.senderName,
            chatdata.receiverName,
          ),
        );
      }
    }
    if (msg != "") {
      //如果字符长度超出,分割成多段文本
      // let msgArray = chatdata.msg.split('');
      // let msgTempString = "";
      // let msgTempArray = [];
      // for (let index = 0; index < msgArray.length; index++) {
      //     let temp = msgArray[index];
      //     if (msgTempString.length >= 27) {
      //         msgTempArray.push(msgTempString);
      //         msgTempString = temp;
      //     } else {
      //         msgTempString += temp;
      //     }
      // }
      // msgTempArray.push(msgTempString);//最后一段也要PushJin去
      // for (let index = 0; index < msgTempArray.length; index++) {
      //     let tempmsg = msgTempArray[index];
      cellData = ChatFormat.createGeneralCellData(msg, chatdata.channel);
      list.push(cellData);
      // }
    }
    return list;
  }

  public static createSysCellDataByContent(
    content: string,
    userType: number,
    vipGrade: number,
    channel: number,
    senderName: string,
    receiverName: string,
  ): Array<ChatCellData> {
    let list: Array<ChatCellData> = new Array<ChatCellData>();
    let cellData: ChatCellData;
    let xml: any = XmlMgr.Instance.decode(content);
    let type: number = Number(xml.a.t);
    if (type == 1) {
      cellData = ChatFormat.createGeneralCellData("[", channel);
      list.push(cellData);
      cellData = ChatFormat.createPlayerCellData(
        channel,
        userType,
        Number(xml.a.id),
        xml.a.serverName,
        vipGrade,
        Number(xml.a.consortiaId),
        String(xml.a.name),
      );
      list.push(cellData);
      cellData = ChatFormat.createGeneralCellData("]", channel);
      list.push(cellData);
    } else if (type == 2 || type == 14) {
      cellData = ChatFormat.createGoodsCellData(content);
      //玫瑰颜色品质颜色 TODO

      list.push(cellData);
    } else if (type == 3) {
      cellData = ChatFormat.createStarCellData(content);
      list.push(cellData);
    } else if (type == 7) {
      cellData = ChatFormat.createVipLinkCellData(channel, xml.a.name);
      list.push(cellData);
    } else if (type == 8) {
      let sonType: number = Number(xml.a.sontype);
      cellData = ChatFormat.createImageCellDataBySonType(sonType, channel);
      list.push(cellData);
    } else if (type == 9) {
      let eindex: string = xml.a.index;
      cellData = ChatFormat.createExpressionByIndex(eindex, channel);
      list.push(cellData);
    } else if (type == 10) {
      cellData = ChatFormat.createAppellLinkCellData(content);
      list.push(cellData);
    } else if (type == 11) {
      cellData = ChatFormat.createRoseBackCellData(
        content,
        senderName,
        receiverName,
      );
      list.push(cellData);
    } else if (type == 12) {
      cellData = ChatFormat.createReinforceCellData(content);
      list.push(cellData);
    } else if (type == 100) {
      ///12

      cellData = ChatFormat.createSeekLinkCellData(content);
      list.push(cellData);
    } else if (type == 101) {
      //13

      cellData = ChatFormat.createCardCellData(content);
      list.push(cellData);
    } else if (type == 102) {
      //14

      cellData = ChatFormat.createFishCellData(content);
      list.push(cellData);
    } else if (type == 111) {
      //外城攻击BOSS

      cellData = ChatFormat.createOuterCityBossCellData(content);
      list.push(cellData);
    }
    return list;
  }

  public static createOuterCityBossCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cellData: any = new ChatCellData();
    cellData.cellType = ChatCellType.OUTERCITY_ATTACK_BOSS;
    cellData.text = xml.a.name;
    return cellData;
  }

  public static createExpressionByIndex(
    eindex: string,
    channel?: number,
  ): ChatCellData {
    let cellData: any = new ChatCellData();
    cellData.cellType = ChatCellType.EXPRESSION;
    cellData.faceLink = "asset.chatII.Expression" + eindex;
    // cellData.text = "asset.chatII.Expression" + eindex;
    // if (eindex == '23') {
    //     eindex = "03";
    // }
    cellData.text =
      " <img src='res/game/face/face" +
      eindex +
      ".png' width='30' height='30'></img> ";
    return cellData;
  }

  private static createImageCellDataBySonType(
    sonType: number,
    channel: number,
  ): ChatCellData {
    let valueTxt: string = "";
    let cfg: t_s_appellData = null;
    let cellData: any = new ChatCellData();
    switch (sonType) {
      case 1: //最强领主
        cellData.cellType = ChatCellType.FIRST_PLAYER;
        cfg = TempleteManager.Instance.getAppellTemplateByID(1);
        if (cfg) {
          valueTxt = cfg.TitleLang;
        }
        cellData.text = valueTxt + " ";
        break;
      case 2: //最受欢迎
        cellData.cellType = ChatCellType.POPULAR_PLAYER;
        cfg = TempleteManager.Instance.getAppellTemplateByID(35);
        if (cfg) {
          valueTxt = cfg.TitleLang;
        }
        cellData.text = valueTxt + " ";
        break;
      case 3: //第一公会会长
        cellData.cellType = ChatCellType.FIRST_CONSORTIA;
        cfg = TempleteManager.Instance.getAppellTemplateByID(3);
        if (cfg) {
          valueTxt = cfg.TitleLang;
        }
        cellData.text = valueTxt + " ";
        break;
    }
    return cellData;
  }

  public static createChannelCellLinkData(msg: string): ChatCellData {
    let cellData: any = new ChatCellData();
    cellData.cellType = ChatCellType.WEB_LINK;
    cellData.text = LangManager.Instance.GetTranslation(
      "appell.AppellFrame.AppellLink.LinkText",
    );
    cellData.data = msg;
    return cellData;
  }

  public static createVipLinkCellData(
    channel: number,
    content: string,
  ): ChatCellData {
    let cellData: any = new ChatCellData();
    cellData.cellType = ChatCellType.VipLink;
    cellData.text = content;
    return cellData;
  }

  public static createStarCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let startemp: t_s_startemplateData =
      TempleteManager.Instance.getStarTemplateById(Number(xml.a.id));
    if (!startemp) return null;
    let sInfo: StarInfo = new StarInfo();
    sInfo.grade = Number(xml.a.grades);
    sInfo.template = startemp;
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.STAR;
    cellData.data = sInfo;
    let dataTxt: string = `|grade:${sInfo.grade}|id:${xml.a.id}`;
    //物品名称颜色区分
    let goodsName: string =
      "[url='event:'|type:" +
      cellData.cellType +
      dataTxt +
      "]" +
      "[color=" +
      GoodsHelp.getGoodColorString(startemp.Profile) +
      "]" +
      "[" +
      xml.a.name +
      "]" +
      "[/color]" +
      "[/url]";
    cellData.text = goodsName;
    return cellData;
  }

  public static createCardCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cardtemp: t_s_powcardtemplateData =
      TempleteManager.Instance.getPowerCardTemplateByID(Number(xml.a.id));
    if (!cardtemp) return null;
    let cInfo: MagicCardInfo = new MagicCardInfo();
    cInfo.templateId = Number(xml.a.id);
    cInfo.grade = Number(xml.a.grades);
    cInfo.currentGP = 0;
    let buffInfo: MagicCardBuffInfo = new MagicCardBuffInfo();
    buffInfo.bufId = Number(xml.a.bufId);
    buffInfo.sonType = Number(xml.a.sonType);
    buffInfo.fixvalue = Number(xml.a.fixValue);
    buffInfo.percent = Number(xml.a.percent);
    cInfo.buff = buffInfo;
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.MAGIC_CARD;
    cellData.data = cInfo;
    cellData.text = xml.a.name;
    return cellData;
  }

  public static createGoodsCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let join: string = xml.a.join;
    let skill: string = xml.a.skill;
    let tempinfo: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(
        Number(xml.a.tempid),
      );
    if (!tempinfo) return null;
    let info: GoodsInfo = new GoodsInfo();
    info.templateId = Number(xml.a.tempid);
    info.id = Number(xml.a.id);
    info.strengthenGrade = Number(xml.a.grade);
    info.isBinds = String(xml.a.bind) == "true";
    info.appraisal_skill = Number(xml.a.appSkill);
    let cellData: ChatCellData = new ChatCellData();
    if (
      tempinfo.MasterType == GoodsType.PROP ||
      tempinfo.MasterType == GoodsType.PET_CARD
    ) {
      cellData.cellType = ChatCellType.PROP;
    } else if (
      tempinfo.MasterType == GoodsType.EQUIP ||
      tempinfo.MasterType == GoodsType.HONER
    ) {
      cellData.cellType = ChatCellType.EQUIP;
      if (join && skill) {
        let joinarr: Array<string> = join.split(",");
        let skillarr: Array<string> = skill.split(",");
        if (joinarr.length) {
          info.join1 = Number(joinarr[0]);
          info.join2 = Number(joinarr[1]);
          info.join3 = Number(joinarr[2]);
          info.join4 = Number(joinarr[3]);
        }
        if (skillarr.length) {
          info.randomSkill1 = Number(skillarr[0]);
          info.randomSkill2 = Number(skillarr[1]);
          info.randomSkill3 = Number(skillarr[2]);
          info.randomSkill4 = Number(skillarr[3]);
          info.randomSkill5 = Number(skillarr[4]);
        }
      }
    } else {
      cellData.cellType = ChatCellType.PROP;
    }
    cellData.data = info;
    let dataTxt: string = "";
    for (const key in info) {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        let infoData = info[key];
        dataTxt += "|" + key + ":" + infoData;
      }
    }
    //物品名称颜色区分
    let goodsName: string =
      "&nbsp;[url='event:'|cellType:" +
      cellData.cellType +
      dataTxt +
      "]" +
      "[color=" +
      GoodsHelp.getGoodColorString(tempinfo.Profile) +
      "]" +
      "[" +
      xml.a.name +
      "]" +
      "[/color]" +
      "[/url]&nbsp;";
    cellData.text = goodsName;
    return cellData;
  }

  public static createGeneralCellData(
    content: string,
    channel: number,
  ): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.GENERAL;
    cellData.text = StringHelper.removeHtmlTagByTextField(content);
    return cellData;
  }

  public static createGMCellData(channel: number): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.GM;
    cellData.faceLink = "asset.chatII.GmIcon";
    return cellData;
  }

  public static createGuiderCellData(channel: number): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.GUIDER;
    cellData.faceLink = "asset.chatII.GuiderIcon";
    return cellData;
  }

  public static createAppellCellData(
    channel: number,
    appellId: number,
  ): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.APPELL;
    cellData.appellId = appellId;
    cellData.faceLink =
      "chatII.Appell" + AppellManager.Instance.model.getPerfixStyle(appellId);
    let appellInfo: t_s_appellData =
      TempleteManager.Instance.getAppellInfoTemplateByID(appellId);
    if (appellInfo) cellData.text = appellInfo.PerfixLang;
    return cellData;
  }

  public static createVipCellData(
    channel: number,
    vipType: number,
  ): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.VIP;
    cellData.faceLink = "asset.chatII.VipEffect";
    if (vipType == 2) {
      cellData.faceLink = "asset.chatII.VipEffect2";
    } else {
      cellData.faceLink = "asset.chatII.VipEffect";
    }
    return cellData;
  }

  public static createPlayerCellData(
    channel: number,
    userType: number,
    userId: number,
    serverName: string,
    vipGrade: number,
    consortiaId: number,
    name: string,
  ): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.Player;
    cellData.channel = channel;
    cellData.userType = userType;
    cellData.userId = userId;
    cellData.serverName = serverName;
    cellData.vipGrade = vipGrade;
    cellData.consortiaId = consortiaId;
    cellData.data = name;
    cellData.text = name;
    return cellData;
  }

  public static createPlayerCellDataNew(chatData: ChatData): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.Player;
    cellData.channel = chatData.channel;
    cellData.userType = chatData.userType;
    cellData.userId = chatData.uid;
    cellData.serverName = chatData.serverName;
    cellData.vipGrade = chatData.vipGrade;
    cellData.consortiaId = chatData.consortiaId;
    cellData.data = chatData.senderName;
    cellData.text = chatData.senderName;
    cellData.fight = chatData.fight;
    cellData.consortName = chatData.consortiaName;
    cellData.userLevel = chatData.userLevel;
    cellData.nickName = chatData.senderName;
    cellData.job = chatData.job;
    cellData.headId = chatData.headId;
    cellData.frameId = chatData.frameId;
    return cellData;
  }

  public static createConsortiaCellData(
    consortiaId: number,
    consortiaName: string,
  ): ChatCellData {
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.CONSORTIA;
    cellData.consortiaId = consortiaId;
    let str: string =
      "[" +
      consortiaName +
      "], " +
      LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.recruit.ConsortiaRecruitFrame.command01",
      );
    let roomData = {
      cellType: cellData.cellType,
      consortiaId: cellData.consortiaId,
    };
    let linkText = this.formatlinkData(roomData, str);
    cellData.text = linkText;
    cellData.data = roomData;
    return cellData;
  }

  public static createRoomCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cellData: ChatCellData = new ChatCellData();
    let rInfo: RoomInfo = new RoomInfo();
    rInfo.id = Number(xml.a.id);
    rInfo.campaignId = Number(xml.a.campaignId);
    rInfo.isLock = Number(xml.a.position) == 0 ? true : false;
    cellData.cellType = ChatCellType.ROOM;
    // <a href='xxx'>link text</a>
    let roomData = {
      cellType: cellData.cellType,
      id: rInfo.id,
      campaignId: rInfo.campaignId,
      isLock: rInfo.isLock,
    };

    let str = "";
    if (rInfo.campaignId == 0) {
      str =
        LangManager.Instance.GetTranslation(
          "QuickInviteWnd.PvpInviteTipPrefix02",
          rInfo.id,
        ) + LangManager.Instance.GetTranslation("welcomeTojoin");
    } else {
      str = this.parseInviteMsg(rInfo);
    }

    // let linkText = this.formatlinkData(roomData, xml.a.name);
    let linkText = this.formatlinkData(roomData, str);
    // [url=event:xx]I am link, click me[/url]
    cellData.text = linkText;
    cellData.data = rInfo;
    return cellData;
  }

  public static parseInviteMsg(roomInfo: RoomInfo): string {
    let inviteMsg: string = "";
    if (roomInfo.campaignId == GlobalConfig.CampaignID.AncientRuins) {
      inviteMsg = StringHelper.format(
        LangManager.Instance.GetTranslation(
          "QuickInviteWnd.AncientRuinsInviteTipPrefix",
          roomInfo.mapName,
          roomInfo.id,
        ),
      );
    } else {
      let mapName: string = "";
      let templateInfo = roomInfo.mapTemplate
        ? roomInfo.mapTemplate
        : CampaignManager.Instance.mapModel.campaignTemplate;
      let lvstr = "";
      if (templateInfo) {
        lvstr = LangManager.Instance.GetTranslation(
          "public.level3",
          templateInfo.MinLevel.toString(),
        );
      }
      mapName = LangManager.Instance.GetTranslation(
        "public.format.concat2word",
        templateInfo.CampaignNameLang,
        lvstr,
      );
      inviteMsg = LangManager.Instance.GetTranslation(
        "QuickInviteWnd.PveInviteTipPrefix2",
        mapName,
        roomInfo.id,
      );
    }
    return inviteMsg + LangManager.Instance.GetTranslation("welcomeTojoin");
  }

  public static createAppellLinkCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.APPELL_LINK;
    cellData.data = xml.a.appellId;
    let linkData = {
      cellType: cellData.cellType,
      text: cellData.text,
      id: xml.a.appellId,
    };
    let linkText = this.formatlinkData(
      linkData,
      LangManager.Instance.GetTranslation(
        "appell.AppellFrame.AppellLink.LinkText",
      ),
    );
    cellData.text = linkText;
    return cellData;
  }

  public static createRoseBackCellData(
    content: string,
    senderName: string,
    receiverName: string,
  ): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.ROSE_BACK;
    cellData.text =
      "[url='event:'|cellType:" +
      ChatCellType.ROSE_BACK +
      "]" +
      "[color=#00F0FF]" +
      LangManager.Instance.GetTranslation("chat.utils.ChatFormat.presentBack") +
      "[/color]" +
      "[/url]";
    cellData.nickName = senderName;
    cellData.receiverName = receiverName;
    cellData.vipGrade = 0;
    cellData.cellContentElement();
    return cellData;
  }

  public static createReinforceCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.REINFORCE;
    cellData.text = LangManager.Instance.GetTranslation(
      "chat.utils.Chatformat.Reinforce",
    );
    cellData.userId = xml.a.userId;
    cellData.data = {
      userId: xml.a.userId,
      mapId: xml.a.mapId,
      posX: xml.a.posX,
      posY: xml.a.posY,
    };
    return cellData;
  }

  public static createSeekLinkCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.SEEK_LINK;
    cellData.userId = xml.a.userId;
    cellData.data = {
      userId: xml.a.userId,
      mapId: xml.a.mapId,
      posX: xml.a.posX,
      posY: xml.a.posY,
    };
    let linkData = {
      cellType: cellData.cellType,
      userId: xml.a.userId,
      mapId: xml.a.mapId,
      posX: xml.a.posX,
      posY: xml.a.posY,
    };
    let linkText = this.formatlinkData(
      linkData,
      LangManager.Instance.GetTranslation("hunt.huntLink.gotoSeek"),
    );
    cellData.text = linkText;
    return cellData;
  }

  public static createFishCellData(content: string): ChatCellData {
    let xml: any = XmlMgr.Instance.decode(content);
    let cellData: ChatCellData = new ChatCellData();
    cellData.cellType = ChatCellType.FISH;
    cellData.text = xml.a.name;
    cellData.userId = xml.a.userId;
    return cellData;
  }

  public static getContentCellData(chatdata: ChatData): Array<ChatCellData> {
    let list: Array<ChatCellData> = [];
    let msg: string = "";
    let srr: Array<string> = [];
    let cellData: ChatCellData;
    msg = chatdata.msg;
    srr = msg.match(/\<([^>]*)>*/g);
    if (srr && srr.length > 0) {
      //存在特殊字符表情等
      list = list.concat(
        ChatFormat.createExtraChatCellByContent(srr, chatdata),
      );
    } else if (chatdata.type == 2) {
      //公会招收
      cellData = ChatFormat.createConsortiaCellData(
        chatdata.consortiaId,
        chatdata.consortiaName,
      );
      list.push(cellData);

      cellData = ChatFormat.createGeneralCellData(
        chatdata.msg,
        chatdata.channel,
      );
      list.push(cellData);
    } else {
      //如果字符长度超出,分割成多段文本
      // let msgArray = chatdata.msg.split('');
      // let msgTempString = "";
      // let msgTempArray = [];
      // let wordlength = 0;
      // //汉字长度与字母长度不一样
      // for (let index = 0; index < msgArray.length; index++) {
      //     let temp = msgArray[index];
      //     if (StringUtils.checkStringLength(msgTempString) >= 27) {
      //         msgTempArray.push(msgTempString);
      //         msgTempString = temp;
      //     } else {
      //         msgTempString += temp;
      //     }
      // }
      // msgTempArray.push(msgTempString);//最后一段也要PushJin去
      // for (let index = 0; index < msgTempArray.length; index++) {
      //     let tempmsg = msgTempArray[index];
      cellData = ChatFormat.createGeneralCellData(
        chatdata.msg,
        chatdata.channel,
      );
      list.push(cellData);
      // }
    }
    return list;
  }

  public static getConsortiaNameFormat() {
    return null;
  }

  public static getProfileFormat(profile: number) {
    // switch (profile) {
    //     case 1:
    //         eleFormat.color = 0xffffff;
    //         break;
    //     case 2:
    //         eleFormat.color = 0x59cd41;
    //         break;
    //     case 3:
    //         eleFormat.color = 0x32a2f8;
    //         break;
    //     case 4:
    //         eleFormat.color = 0xa838f7;
    //         break;
    //     case 5:
    //         eleFormat.color = 0xeb9504;
    //         break;
    //     case 6:
    //         eleFormat.color = 0xce0f0f;
    //         break;
    //     case 7:
    //         eleFormat.color = 0xce0f0f;
    //         break;
    // }
    return null;
  }

  private static formatlinkData(data: object, content?: string): string {
    let linkText = "";
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        let element = data[key];
        linkText += key + ":" + element + "|";
      }
    }
    let temp = "[url=event:|" + linkText + "]" + content + "[/url] ";
    if (linkText == "") {
      return content;
    }
    return temp;
  }

  public static getContentColor(channel: number): number {
    switch (channel) {
      case ChatChannel.CROSS_BIGBUGLE:
      case ChatChannel.GOLD_BIGBUGLE:
        return 0xfff001;
        break;
      case ChatChannel.BIGBUGLE:
        return 0x00d8ff;
        break;
      case ChatChannel.WORLD:
        return 0xeb9504;
        break;
      case ChatChannel.SYSTEM:
      case ChatChannel.SYS_ALERT:
        return 0xfff600;
        break;
      case ChatChannel.INFO:
        return 0xfff600;
        break;
      case ChatChannel.CONSORTIA:
        return 0x4cd551;
        break;
      case ChatChannel.TEAM:
        return 0x939dff;
        break;
      case ChatChannel.CURRENT:
        return 0xffffff;
        break;
      case ChatChannel.NOTICE:
        return 0xf33bff;
        break;
      case ChatChannel.MYSTERYSHOP_LUCKYPLAYER:
        return 0xc3a98d;
        break;
      case ChatChannel.CHAT_POP:
        return 0x643804;
        break;
      case ChatChannel.BUBBLETYPE_SELF:
        return 0xffffff;
        break;
      case ChatChannel.BUBBLETYPE_TARGET:
        return 0x2d2d2d;
        break;
    }
    return 0xffffff;
  }

  /**
   * 神秘商店的精品道具提示
   * @param jsonData
   * @returns
   */
  public static createPropCellData(jsonData: any): ChatCellData {
    let tempinfo: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(
        Number(jsonData.templateId),
      );
    if (!tempinfo) return null;
    let info: GoodsInfo = new GoodsInfo();
    info.templateId = Number(jsonData.templateId);
    info.id = Number(jsonData.id);
    info.strengthenGrade = Number(jsonData.strengthenGrade);
    info.isBinds = String(jsonData.isBinds) == "true";
    info.appraisal_skill = Number(jsonData.appraisal_skill);
    let cellData: ChatCellData = new ChatCellData();
    if (
      tempinfo.MasterType == GoodsType.PROP ||
      tempinfo.MasterType == GoodsType.PET_CARD
    ) {
      cellData.cellType = ChatCellType.PROP;
    } else if (
      tempinfo.MasterType == GoodsType.EQUIP ||
      tempinfo.MasterType == GoodsType.HONER
    ) {
      cellData.cellType = ChatCellType.EQUIP;

      info.join1 = Number(jsonData.join1);
      info.join2 = Number(jsonData.join2);
      info.join3 = Number(jsonData.join3);
      info.join4 = Number(jsonData.join4);

      info.randomSkill1 = Number(jsonData.randomSkill1);
      info.randomSkill2 = Number(jsonData.randomSkill2);
      info.randomSkill3 = Number(jsonData.randomSkill3);
      info.randomSkill4 = Number(jsonData.randomSkill4);
      info.randomSkill5 = Number(jsonData.randomSkill5);
    } else {
      cellData.cellType = ChatCellType.PROP;
    }
    cellData.data = info;
    let dataTxt: string = "";
    for (const key in info) {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        let infoData = info[key];
        dataTxt += "|" + key + ":" + infoData;
      }
    }
    //物品名称颜色区分
    let goodsName: string =
      "[url='event:'|cellType:" +
      cellData.cellType +
      dataTxt +
      "]" +
      "[color=" +
      GoodsHelp.getGoodColorString(tempinfo.Profile) +
      "]" +
      "[" +
      info.templateInfo.TemplateNameLang +
      "]" +
      "[/color]" +
      "[/url]";
    cellData.text = goodsName;
    return cellData;
  }
}
