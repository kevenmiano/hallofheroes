/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:32:05
 * @LastEditTime: 2022-09-10 12:12:35
 * @LastEditors: jeremy.xu
 * @Description: 英灵排行榜界面
 */

import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { PetChallengeEvent } from "../../constant/PetDefine";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { PetChallengeRankHeadItem } from "./item/PetChallengeRankHeadItem";
import PetChallengeRankItem from "./item/PetChallengeRankItem";
import PetChallengeCtrl from "./PetChallengeCtrl";

export default class PetChallengeRankWnd extends BaseWindow {
  private rankList: fgui.GList;

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    this.rankList.setVirtual();
    this.rankList.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );
    this.control.requestChallengeData(2);
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
    this.delEvent();
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      PetChallengeEvent.CHALLENGE_INFO_CHAGNE,
      this.__refreshChallengeInfo,
      this,
    );
  }

  private delEvent() {
    NotificationManager.Instance.removeEventListener(
      PetChallengeEvent.CHALLENGE_INFO_CHAGNE,
      this.__refreshChallengeInfo,
      this,
    );
  }

  private __refreshChallengeInfo() {
    let challengeTopList = this.control.data.challengeTopList;
    if (challengeTopList.length <= 0) return;
    this.rankList.numItems = challengeTopList.length;
  }

  private onRenderListItem(index: number, item: PetChallengeRankItem) {
    if (!this.control) return;
    let itemDatas = this.control.data.challengeTopList;
    if (!itemDatas) return;
    let itemData = itemDatas[index];
    if (!itemData) {
      item.info = null;
      return;
    }
    item.info = itemData;
  }

  public get control() {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.PetChallenge,
    ) as PetChallengeCtrl;
  }

  dispose() {
    for (let index = 0; index < this.rankList.numChildren; index++) {
      const element = this.rankList.getChildAt(
        index,
      ) as PetChallengeRankHeadItem;
      element.dispose();
    }
    super.dispose();
  }
}
