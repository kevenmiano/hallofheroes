import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import FrameDataBase from "../../mvc/FrameDataBase";
import EmailInfo from "./EmailInfo";
import EmailType from "./EmailType";

/**
 * @author:pzlricky
 * @data: 2021-04-12 16:28
 * @description 邮件模型数据
 */
export default class MailModel extends FrameDataBase {
  public pageCapicity: number = 30; //初始展示数量
  public pageAddCapicity: number = 6; //每一页增加的邮件数量
  private _currentReadEmail: EmailInfo = null;
  public reply: string = "";
  public static UNREAD_YEAR: number = 2999;
  public static WRITE_MAIL_NEEDED_GOLD: number = 100;
  public totalLength: number = 0;
  public selectedMailId: number = 0; //当前选中的邮件Id
  public inited = false;
  public allList: SimpleDictionary = new SimpleDictionary();
  public allBattleList: EmailInfo[] = [];
  public normalEmails: EmailInfo[] = [];
  public sysEmails: EmailInfo[] = [];

  public updateAllListEmail(info: EmailInfo) {
    let mail: EmailInfo;
    for (let key in this.allList) {
      if (Object.prototype.hasOwnProperty.call(this.allList, key)) {
        mail = this.allList[key];
        if (mail && mail.Id == info.Id) {
          mail.synchronization(info);
          return;
        }
      }
    }
  }

  public updateBattleEmail(info: EmailInfo) {
    let len: number = this.allBattleList.length;
    let emailInfo: EmailInfo;
    for (let i: number = 0; i < len; i++) {
      emailInfo = this.allBattleList[i];
      if (emailInfo && info && emailInfo.Id == info.Id)
        this.allBattleList[i] = info;
      break;
    }
  }

  public updateNormalEmail(info: EmailInfo) {
    let len: number = this.normalEmails.length;
    let emailInfo: EmailInfo;
    for (let i: number = 0; i < len; i++) {
      emailInfo = this.normalEmails[i];
      if (emailInfo && info && emailInfo.Id == info.Id)
        this.normalEmails[i] = info;
      break;
    }
  }

  public updateSystemEmail(info: EmailInfo) {
    let len: number = this.sysEmails.length;
    let emailInfo: EmailInfo;
    for (let i: number = 0; i < len; i++) {
      emailInfo = this.sysEmails[i];
      if (emailInfo && info && emailInfo.Id == info.Id)
        this.sysEmails[i] = info;
      break;
    }
  }

  public addNewMail(email: EmailInfo) {
    this.allList[email.Id] = email;
    if (email.MailType == EmailType.BATTLE_REPORT) {
      this.allBattleList.push(email);
    } else if (email.MailType == EmailType.NORMAL_MAIL) {
      this.normalEmails.push(email);
    } else {
      this.sysEmails.push(email);
    }
  }

  public getEmailById(id: number): EmailInfo {
    for (let key in this.allList) {
      if (Object.prototype.hasOwnProperty.call(this.allList, key)) {
        let info = this.allList[key];
        if (info.Id == id) return info;
      }
    }
    return null;
  }

  private removeEmailById(id: number) {
    let idArray: Array<number> = this.allList.keys;
    let len: number = idArray.length;
    let key: number;
    let info: EmailInfo;
    for (let i: number = 0; i < len; i++) {
      key = idArray[i];
      info = this.allList[key] as EmailInfo;
      if (info && info.Id == id) {
        this.allList.delete(info.Id);
        this.totalLength--;
        return;
      }
    }
  }

  public removeEmailList(list: Array<number>) {
    if (list) {
      let len: number = list.length;
      for (let i: number = 0; i < len; i++) {
        this.removeEmailById(list[i]);
      }
    }
    this.resetData();
  }

  public initMailList(list: EmailInfo[], curPage: number, maxPage: number) {
    for (let info of list) {
      this.allList[info.Id] = info;
    }
    if (curPage == maxPage) {
      //分批发送接收完成
      this.inited = true;
      this.resetData();
    }
  }

  public resetData() {
    this.sysEmails = [];
    this.allBattleList = [];
    this.normalEmails = [];
    let idArray: Array<number> = this.allList.keys;
    let len: number = idArray.length;
    let key: number;
    let info: EmailInfo;
    for (let i: number = 0; i < len; i++) {
      key = idArray[i];
      info = this.allList[key] as EmailInfo;
      if (info && !this.checkIsOutDate(info)) {
        if (info.MailType == EmailType.BATTLE_REPORT) {
          this.allBattleList.push(info);
        } else if (info.MailType == EmailType.NORMAL_MAIL) {
          this.normalEmails.push(info);
        } else {
          this.sysEmails.push(info);
        }
      }
    }
    this.sysEmails.sort(this.sortMail);
    this.normalEmails.sort(this.sortMail);
    this.allBattleList.sort(this.sortMail);
  }

  private sortMail(mail1: EmailInfo, mail2: EmailInfo): number {
    if (mail1.sortValue != mail2.sortValue) {
      return mail2.sortValue - mail1.sortValue;
    } else {
      if (mail1.sendDate >= mail2.sendDate) return -1;
      else return 1;
    }
  }
  /**
   *
   * @param mail 检测邮件是否过期
   * @returns
   */
  public checkIsOutDate(mail: EmailInfo): boolean {
    if (mail && mail.remainTime() <= 0) {
      return true;
    }
    return false;
  }

  public filterOutDateEmails() {
    let idArray: Array<number> = this.allList.keys;
    let len: number = idArray.length;
    let key: number;
    for (let i: number = 0; i < len; i++) {
      let mail: EmailInfo = this.allList[key];
      if (mail && mail.remainTime() <= 0) {
        this.removeEmailById(mail.Id);
      }
    }
  }

  public isBattleUnreadExist(): boolean {
    let mail: EmailInfo;
    for (let key in this.allBattleList) {
      if (Object.prototype.hasOwnProperty.call(this.allBattleList, key)) {
        mail = this.allBattleList[key];
        if (mail && !mail.isRead) {
          return true;
        }
      }
    }
    return false;
  }

  public get currentReadEmail(): EmailInfo {
    return this._currentReadEmail;
  }

  public set currentReadEmail(value: EmailInfo) {
    if (value != this._currentReadEmail) {
      this._currentReadEmail = value;
    }
  }

  public existUnreadSysMailCount(): number {
    let unreadMailCount = 0;
    for (let i: number = 0; i < this.sysEmails.length; i++) {
      let info = this.sysEmails[i] as EmailInfo;
      if (info && !info.isRead) {
        unreadMailCount++;
      }
    }
    return unreadMailCount;
  }
  public existUnreadNormalMailCount(): number {
    let unreadMailCount = 0;
    for (let i: number = 0; i < this.normalEmails.length; i++) {
      let info = this.normalEmails[i] as EmailInfo;
      if (info && !info.isRead) {
        unreadMailCount++;
      }
    }
    return unreadMailCount;
  }
  public existUnreadBattleMailCount(): number {
    let unreadMailCount = 0;
    for (let i: number = 0; i < this.allBattleList.length; i++) {
      let info = this.allBattleList[i] as EmailInfo;
      if (info && !info.isRead) {
        unreadMailCount++;
      }
    }
    return unreadMailCount;
  }
}
