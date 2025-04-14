//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 20:16:46
 * @LastEditTime: 2023-08-11 15:32:59
 * @LastEditors: jeremy.xu
 * @Description: 战报
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import PetChallengeData from "./PetChallengeData";
import Logger from "../../../core/logger/Logger";
import PetChallengeCtrl from "./PetChallengeCtrl";
import { NotificationManager } from "../../manager/NotificationManager";
import { PetChallengeEvent } from "../../constant/PetDefine";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import Utils from "../../../core/utils/Utils";

export default class PetChallengeEventWnd extends BaseWindow {
  public itemList: fgui.GList;

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    this.itemList.setVirtual();
    this.itemList.numItems = 0;
    Logger.xjy(
      "[PetChallengeEventWnd]OnShowWind",
      this.model.challengeEventList,
    );
    this.control.requestChallengeData(3); //请求英灵竞技日志列表
  }

  private addEvent() {
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      PetChallengeEvent.CHALLENGE_EVENT_CHANGE,
      this.__refreshChallengeInfo,
      this,
    );
  }

  private delEvent() {
    // this.itemList.itemRenderer.recover();
    Utils.clearGListHandle(this.itemList);
    NotificationManager.Instance.removeEventListener(
      PetChallengeEvent.CHALLENGE_EVENT_CHANGE,
      this.__refreshChallengeInfo,
      this,
    );
  }

  private __refreshChallengeInfo() {
    let challengeEventList = this.control.data.challengeEventList;
    if (challengeEventList.length <= 0) return;
    this.itemList.numItems = challengeEventList.length;
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.refresh();
  }

  public get control() {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.PetChallenge,
    ) as PetChallengeCtrl;
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  private refresh() {}

  private renderListItem(index: number, item: fgui.GComponent) {
    let data = this.model.challengeEventList[index];
    let str = (data.logDate as string).substring(5, 16) + " ";
    let tarNickName = LangManager.Instance.GetTranslation(
      "public.bracket",
      data.tarNickName,
    );
    let score = data.score;
    let lgkey = "";
    let win: boolean = false;
    if (data.isAttack) {
      win = data.result == 1;
      if (win) {
        lgkey =
          score > 0
            ? "colosseum.challenge.attacked.txt1"
            : "colosseum.challenge.attacked.txt11";
      } else {
        lgkey =
          score < 0
            ? "colosseum.challenge.attacked.txt2"
            : "colosseum.challenge.attacked.txt22";
      }
    } else {
      win = data.result == 2;
      if (win) {
        lgkey =
          score > 0
            ? "colosseum.challenge.beAttacked.txt1"
            : "colosseum.challenge.beAttacked.txt11";
      } else {
        lgkey =
          score < 0
            ? "colosseum.challenge.beAttacked.txt2"
            : "colosseum.challenge.beAttacked.txt22";
      }
    }

    str += LangManager.Instance.GetTranslation(
      lgkey,
      tarNickName,
      Math.abs(score),
    );

    item.text = str;
  }

  public get model() {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.PetChallenge)
      .data as PetChallengeData;
  }

  dispose() {
    this.delEvent();
    super.dispose();
  }
}
