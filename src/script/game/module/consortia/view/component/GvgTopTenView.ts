// @ts-nocheck
import FUI_GvgTopTenView from "../../../../../../fui/Consortia/FUI_GvgTopTenView";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { GvgEvent } from "../../../../constant/event/NotificationEvent";
import { GvgMapModel } from "../../model/GvgMapModel";
import { GvgTopTenInfo } from "../../data/gvg/GvgTopTenInfo";
import { GvgContributionInfo } from "../../data/gvg/GvgContributionInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { GvgTop10Item } from "./GvgTop10Item";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/28 15:39
 * @ver 1.0
 */
export class GvgTopTenView extends FUI_GvgTopTenView {
  private _infos: GvgContributionInfo[] = [];

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.initView();
    this.addEvent();
  }

  private initView() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onListItemRender,
      null,
      false
    );
    this._inWarNumTxt.text = "0";
    this._rewardTxt01.text = "0";
    this._rewardTxt02.text = "0";
    this._contributionTxt.text = "0";
    this.__updatePlayerCount();
  }

  private addEvent() {
    CampaignManager.Instance.gvgModel.addEventListener(
      GvgEvent.TOP_TEN_CHANGE,
      this.__topTenChangeHandler,
      this
    );
    CampaignManager.Instance.gvgModel.addEventListener(
      GvgEvent.GUILDWAR_PLAYER_COUNT,
      this.__updatePlayerCount,
      this
    );
  }

  private onListItemRender(index: number, item: GvgTop10Item) {
    if (this._infos && this._infos[index]) {
      this._infos[index].index = index;
      item.info = this._infos[index];
    }
  }

  /**
   * 更新参战人数
   */
  private __updatePlayerCount(): void {
    this._inWarNumTxt.text = this.getSelfPlayerCount().toString();
  }

  private getSelfPlayerCount(): number {
    let count: number = 1;
    let model: GvgMapModel = CampaignManager.Instance.gvgModel;
    if (model.joinPlayerinfo) {
      if (model.selfConsortiaId == model.joinPlayerinfo.red_id) {
        return model.joinPlayerinfo.red_count;
      } else if (model.selfConsortiaId == model.joinPlayerinfo.blue_id) {
        return model.joinPlayerinfo.blue_count;
      }
    }
    return count;
  }

  /**
   * 前10排名有变化
   * @param data
   */
  private __topTenChangeHandler(data: GvgTopTenInfo): void {
    this._rewardTxt01.text = "0";
    this._rewardTxt02.text = "0";
    if (data) {
      this._infos = data.list;
      this.list.numItems = data.list.length;

      for (let i: number = 0; i < 10; i++) {
        let info = this._infos[i];
        if (
          info &&
          info.userId == ArmyManager.Instance.thane.userId &&
          info.contribution != 0
        ) {
          this._rewardTxt01.text = "150";
          this._rewardTxt02.text = "150";
        }
      }

      this._contributionTxt.text = data.contribution.toString();
    }
  }

  private removeEvent() {
    CampaignManager.Instance.gvgModel.removeEventListener(
      GvgEvent.TOP_TEN_CHANGE,
      this.__topTenChangeHandler,
      this
    );
    CampaignManager.Instance.gvgModel.removeEventListener(
      GvgEvent.GUILDWAR_PLAYER_COUNT,
      this.__updatePlayerCount,
      this
    );
  }

  dispose() {
    this._infos = null;
    this.removeEvent();
    super.dispose();
  }
}
