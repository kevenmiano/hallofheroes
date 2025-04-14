import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import LangManager from "../../../core/lang/LangManager";
import Dictionary from "../../../core/utils/Dictionary";
import StarInfo from "./StarInfo";
import MailModel from "./MailModel";
import BattleReportHelp from "../../utils/BattleReportHelp";
import BattleInfo from "./BattleInfo";
//@ts-expect-error: External dependencies
import MailInfoMsg = com.road.yishi.proto.mail.MailInfoMsg;
import EmailType from "./EmailType";
/**
 * @author:pzlricky
 * @data: 2021-04-13 14:44
 * @description ***
 */
export default class EmailInfo {
  public Id: number = 0;
  public MailType: number = 0;
  public SendId: number = 0;
  public SendType: number = 0;
  public SendNickName: string = "";
  public SendPlayerGrade: number = 0;
  public ReceiveId: number = 0;
  public ReceiveNickName: string = "";
  public SendDate: string = "";
  public ReadDate: string = "";
  public Title: string = "";
  public Contents: string = "";
  public RemoveDate: string = "";
  public ValidityDate: number = 0;
  public Annex1: number = 0; //物品ID
  public Annex1Name: number = 0;
  public Annex1Count: number = 0;
  public Annex1Grade: number = 0;
  public IsAnnex1: boolean = false;
  public Annex2: number = 0;
  public Annex2Name: number = 0;
  public Annex2Count: number = 0;
  public Annex2Grade: number = 0;
  public IsAnnex2: boolean = false;
  public Annex3: number = 0;
  public Annex3Name: number = 0;
  public Annex3Count: number = 0;
  public Annex3Grade: number = 0;
  public IsAnnex3: boolean = false;
  public Annex4: number = 0;
  public Annex4Name: number = 0;
  public Annex4Count: number = 0;
  public Annex4Grade: number = 0;
  public IsAnnex4: boolean = false;
  public Annex5: number = 0;
  public Annex5Name: number = 0;
  public Annex5Count: number = 0;
  public Annex5Grade: number = 0;
  public IsAnnex5: boolean = false;
  public IsExist: boolean = false;
  public report: BattleInfo = null;
  public Params: string = "";

  public get isRead(): boolean {
    if (this.readDate.getFullYear() == MailModel.UNREAD_YEAR) return false;
    return true;
  }

  public get hasGoods(): boolean {
    return this.getFirstGoods() != 0;
  }

  public getFirstGoods(): number {
    for (var i: number = 1; i <= 5; i++) {
      if (!this["IsAnnex" + i] && this["Annex" + i] != 0)
        return this["Annex" + i + "Name"];
    }
    return 0;
  }

  public synchronization(info: EmailInfo) {
    ObjectUtils.copyPropertiesTo(this, info, false) as EmailInfo;
    for (const key in info) {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        let value = info[key];
        this[key] = value;
      }
    }
    if (info.MailType == EmailType.BATTLE_REPORT && info.Contents) {
      info.report = BattleReportHelp.covertToBattleInfo(info.Contents);
    }
  }

  /**
   * 得到第一个物品的位置 从1开始
   * @return
   */
  public getFirstGoodsIndex(): number {
    for (var i: number = 1; i <= 5; i++) {
      if (!this["IsAnnex" + i] && this["Annex" + i] != 0) {
        return i;
      }
    }
    return -1;
  }

  /**
   *  得到第一个物品, 没有返回null
   * @return
   *
   */
  public getFirstGoodsInfo(): GoodsInfo {
    var index: number = this.getFirstGoodsIndex();
    if (index != -1) {
      return this.getAnnexByIndex(index);
    }
    return null;
  }

  /**
   * 获取第一个星运
   * @return
   *
   */
  public getFirstStarInfo(): StarInfo {
    var index: number = this.getFirstGoodsIndex();
    if (index != -1) {
      return this.getAnnexStarByIndex(index);
    }
    return null;
  }

  public getAnnexByIndex(index: number): GoodsInfo {
    //case -100://黄金
    //case -200://紫晶
    //case -300://战魂
    //case -400://钻石
    //     -900 //空白英灵封印卡
    if (this["Annex" + index] > 0) {
      let value = this["Annex" + index];
      // return EmailManager.Instance.cate.annexGoodsList[value];
      return null;
    } else {
      var info: GoodsInfo = new GoodsInfo();
      info.templateId = Number(this["Annex" + index + "Name"]);
      info.id = index;
      info.count = this["Annex" + index + "Count"];
      info.count = this["Annex" + index + "Grade"];
      return info;
    }
  }

  public getAnnexStarByIndex(index: number): StarInfo {
    // return EmailManager.Instance.cate.annexStarList[this["Annex" + index]];
    return null;
  }

  private _annexGoods: GoodsInfo[];
  private _starGoods: StarInfo[];
  public getAnnexs() {
    this._annexGoods = [];
    let templateId = 0;
    let count = 0;
    let goods: GoodsInfo;
    for (let j: number = 1; j <= 5; j++) {
      templateId = this["Annex" + j + "Name"];
      if (templateId == 0 || this["IsAnnex" + j]) continue;
      count = this["Annex" + j + "Count"];
      goods = new GoodsInfo();
      goods.templateId = templateId;
      goods.count = count;
      this._annexGoods.push(goods);
    }
    return this._annexGoods;
  }

  public getUngetAnnexId(): number {
    for (var i: number = 1; i <= 5; i++) {
      if (!this["IsAnnex" + i] && this["Annex" + i] != 0)
        return this["Annex" + i];
    }
    return 0;
  }

  public getStar() {
    this._starGoods = [];
    let templateId = 0;
    let count = 0;
    let grade = 0;
    let starInfo: StarInfo;
    for (let j: number = 1; j <= 5; j++) {
      templateId = this["Annex" + j + "Name"];
      if (templateId == 0 || this["IsAnnex" + j]) continue;
      count = this["Annex" + j + "Count"];
      grade = this["Annex" + j + "Grade"];
      starInfo = new StarInfo();
      starInfo.tempId = templateId;
      starInfo.count = count;
      starInfo.grade = grade;
      this._starGoods.push(starInfo);
    }
    return this._starGoods;
  }

  public get leftTime(): string {
    var time: string = "";
    var remain: number = 0;
    remain = this.remainTime();
    if (remain > 0) {
      time = Math.round(remain / 24).toString();
      // } else if (remain > 0 && remain < 24) {
      //     time = (Math.round(remain)).toString();
      time = LangManager.Instance.GetTranslation(
        "emailII.view.EmailItemView.leftTime",
        time,
      );
    } else {
      time = LangManager.Instance.GetTranslation(
        "emailII.data.EmailInfo.leftTime.timeOut",
      );
    }
    return time;
  }

  public remainTime(): number {
    var remain: number = 0;
    if (this.isRead) {
      remain =
        this.ValidityDate * 24 -
        (this.nowDate - this.readDate.getTime()) / (60 * 60 * 1000);
    } else {
      remain =
        this.ValidityDate * 24 -
        (this.nowDate - this.sendDate.getTime()) / (60 * 60 * 1000);
    }

    if (remain && remain > 0) {
      return remain;
    } else {
      return -1;
    }
  }
  private get nowDate(): number {
    return PlayerManager.Instance.currentPlayerModel.nowDate;
  }

  public get removeDate(): Date {
    return DateFormatter.parse(this.RemoveDate, "YYYY-MM-DD hh:mm:ss");
  }
  public get readDate(): Date {
    return DateFormatter.parse(this.ReadDate, "YYYY-MM-DD hh:mm:ss");
  }
  public get sendDate(): Date {
    return DateFormatter.parse(this.SendDate, "YYYY-MM-DD hh:mm:ss");
  }

  public get sortValue() {
    let a1 = this.isRead ? 0 : 10;
    let a2 = this.hasGoods ? 1 : 0;
    let sum = a1 + a2;
    return sum;
  }

  public copy(info: EmailInfo) {
    for (let key in info) {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        let value = info[key];
        if (typeof this[key] == "number") {
          this[key] = Number(value);
        } else if (typeof this[key] == "string") {
          this[key] = value + "";
        } else if (typeof this[key] == "boolean") {
          this[key] = value == "true" ? true : false;
        } else {
          //结构体
          //这里会把 eventMap 覆盖掉,跳过吧。
          if (key == "eventMap") continue;
          this[key] = value;
        }
      }
    }
  }
}
