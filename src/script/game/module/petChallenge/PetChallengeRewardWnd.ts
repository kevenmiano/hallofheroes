/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 20:16:46
 * @LastEditTime: 2023-06-09 12:03:08
 * @LastEditors: jeremy.xu
 * @Description: 排名奖励
 */

import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import PetChallengeCtrl from "./PetChallengeCtrl";
import { PetChallengeRewardTemplate } from "./data/PetChallengeRewardTemplate";
import { PetChallengeRankRewardItem } from "./item/PetChallengeRankRewardItem";
import { PetChallengeScoreRewardItem } from "./item/PetChallengeScoreRewardItem";

export default class PetChallengeRewardWnd extends BaseWindow {
  private weekRewadList: fgui.GList;

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
    this.weekRewadList.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderWeekRewadListItem,
      null,
      false,
    );
    this.weekRewadList.setVirtual();

    if (this.weekRewards.length > 0) {
      this.weekRewadList.numItems = this.weekRewards.length;

      for (let index = 0; index < 3; index++) {
        let rankIndex = index + 1;
        let item = this["itemRank" + rankIndex] as PetChallengeRankRewardItem;
        item.info = rankIndex;
      }
    }
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  private onRenderWeekRewadListItem(
    index: number,
    item: PetChallengeScoreRewardItem,
  ) {
    let tmp = this.weekRewards[index];
    item.info = tmp;
  }

  public get control() {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.PetChallenge,
    ) as PetChallengeCtrl;
  }

  private get weekRewards(): PetChallengeRewardTemplate[] {
    return this.control.data.weekGoodRewards;
  }
}
