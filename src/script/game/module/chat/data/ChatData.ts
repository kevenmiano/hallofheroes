import ObjectUtils from "../../../../core/utils/ObjectUtils";
import XmlMgr from "../../../../core/xlsx/XmlMgr";
import { ChatChannel } from "../../../datas/ChatChannel";
import ChatFormat from "../../../utils/ChatFormat";
import ChatCellData from "./ChatCellData";

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-10 15:57
 */
export default class ChatData {
  public static hashCode = 0;

  public channel: number = 0;
  public uid: number = 0;
  public receiveId: number = 0; //接收者
  public serverName: string = "";
  public serverId: any; //用于区分语音的key
  public type: number = 0;
  public userType: number = 0;
  public vipGrade: number = 0;
  public vipType: number = 0;
  public senderName: string = "";
  public userLevel: number = 0;
  public receiverName: string = "";
  public consortiaId: number = 0;
  public consortiaName: string = "";
  public roomId: number = 0;
  public roomName: string = "";
  public appellId: number = 0;
  public livingId: number = 0;
  public encodemsg: string = "";
  public msg: string = "";
  //翻译后的语言
  private _translateMsg: string = "";
  public translateLangKey = "";
  public channelName: string = "";
  public headId: number = 0; //玩家头像ID
  public job: number = 0;
  public isFromMe: boolean = false;
  public voiceTime: number = 0; //语音时长
  public savePath: string = ""; //语音文件在安卓端的保存路径
  public curTime: any = 0; //当前时间戳
  public sendTime: string = ""; //私聊发送时间
  public bigBugleType: number = 0; // 0为普通大喇叭, 1为99玫瑰大喇叭, 2为999玫瑰大喇叭, 3为武斗会全服公告, 4为跨区大喇叭, 5为烟花大喇叭  13  使用神圣之光
  public fight: number = 0; //战斗力
  public is_centerTip: boolean = false; // 是否屏幕弹黄字
  public is_bigTip: boolean = false; // 是否滚动大喇叭
  public frameId: number = 0; //头像框Id
  public itemList: any[];
  public starList: any[];
  public cardList: any[];
  public isLookInfo: boolean = false;
  public msgUrl: string = "";

  public htmlText: string = "";
  public isRead: boolean = false;

  public bubbleId: number = 0;

  private _cellVector: Array<ChatCellData> = [];
  //翻译中
  public translateing = false;

  public hashCode: number = -1;

  public constructor() {
    this.hashCode = ++ChatData.hashCode;
  }

  public getNormalMsg(): string {
    let html: string = "";
    let srr: Array<string> = [];
    let i: number = 0;
    let str: string;
    let xml: any;
    let name: string;
    srr = this.msg.match(/\<([^>]*)>*/g);
    if (srr) {
      for (i = 0; i < srr.length; i++) {
        try {
          str = srr[i];
          xml = XmlMgr.Instance.decode(str);
          name = xml.a.name;
          this.consortiaId = Number(xml.a.consortiaId);
          if (xml.a.t == 7) {
            this.msg = this.msg.replace(str, "");
            continue;
          }
          this.msg = this.msg.replace(str, "[" + name + "]");
        } catch (e) {
          this.msg = "";
        }
      }
    }
    html = this.msg;
    return html;
  }

  public commit() {
    //只做内容处理

    this._cellVector = ChatFormat.getContentCellData(this);
    let elementText: string = "";
    let elements = this._cellVector;
    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      if (element) {
        elementText += element.text;
      }
    }
    this.htmlText = elementText;
  }

  public getAllElements(): Array<ChatCellData> {
    return this._cellVector;
  }

  public get cellVector(): Array<ChatCellData> {
    return this._cellVector;
  }

  public clone(target?: ChatData): ChatData {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        let data = target[key];
        this[key] = data;
      }
    }
    return this;
  }

  public get translateMsg() {
    return this._translateMsg;
  }

  public set translateMsg(v: string) {
    this.translateing = false;
    this._translateMsg = v;
  }

  public dispose() {
    for (const key in this._cellVector) {
      if (Object.prototype.hasOwnProperty.call(this._cellVector, key)) {
        let data = this._cellVector[key];
        ObjectUtils.disposeObject(data);
        data.dispose();
      }
    }

    this._cellVector = null;
    this.channel = 0;
    this.uid = 0;
    this.serverName = "";
    this.type = 0;
    this.userType = 0;
    this.vipGrade = 0;
    this.senderName = "";
    this.receiverName = "";
    this.consortiaName = "";
    this.roomName = "";
    this.msg = "";
    this.consortiaId = 0;
    this.roomId = 0;
    this.bigBugleType = 0;
    this.is_centerTip = false;
    this.is_bigTip = false;
    this.itemList = null;
    this.starList = null;
    this.cardList = null;
  }
}
