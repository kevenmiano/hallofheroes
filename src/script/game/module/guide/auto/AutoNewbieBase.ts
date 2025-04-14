import LangManager from "../../../../core/lang/LangManager";

/*
 * @Author: jeremy.xu
 * @Date: 2023-03-17 15:34:08
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-10-30 16:41:34
 * @Description:
 */
export default class AutoNewbieBase {
  public autoTime: number = 5;
  public autoTimeMs: number = 5000;
  public channelName: string = "";

  public addEvent() {}

  public removEvent() {}

  public showAllTip(b: boolean) {}

  public processFunc(time: number) {}

  public processEndFunc() {}

  public get open() {
    return false;
  }

  public get autoDialogue() {
    return false;
  }

  public getAutoExecTip(time: number) {
    return LangManager.Instance.GetTranslation(
      "newbie.auto.autoExecTip",
      time ? time : this.autoTime,
    );
  }

  public getAutoDialogueTip(time: number) {
    return LangManager.Instance.GetTranslation(
      "newbie.auto.autoExecTip",
      time ? time : this.autoTime,
    );
  }

  public dispose() {
    this.removEvent();
  }
}
