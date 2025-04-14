/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-16 10:56:40
 * @LastEditTime: 2021-12-01 21:12:44
 * @LastEditors: jeremy.xu
 * @Description:
 */

import FUI_MopupItem from "../../../../../fui/BaseCommon/FUI_MopupItem";
import LangManager from "../../../../core/lang/LangManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { eMopupItemType, eMopupState, eMopupType } from "../MopupData";
import { BaseItem } from "../../../component/item/BaseItem";
import Logger from "../../../../core/logger/Logger";

export default class MopupItem extends FUI_MopupItem {
  private mopupType: eMopupType;
  private mopupState: eMopupState;
  private _info: any;

  private _itemType: eMopupItemType;
  public get itemType(): eMopupItemType {
    return this._itemType;
  }
  public set itemType(value: eMopupItemType) {
    this._itemType = value;
    this.setTxtDescState(value);
    this.gTitleBar.visible = value != eMopupItemType.MopupEnd;
  }

  onConstruct() {
    super.onConstruct();
    this.itemType = eMopupItemType.None;
  }

  public set info(data: any) {
    this._info = data;
    if (data.gp && data.gp > 0) {
      this.txtGetExp.text =
        LangManager.Instance.GetTranslation(
          "yishi.view.tips.TaskTraceTip.gpTxt",
        ) + data.gp;
    } else {
      this.txtGetExp.text = "";
    }
  }

  public get info() {
    return this._info;
  }

  public setItemList(data: GoodsInfo[]) {
    if (!data) {
      this.list.removeChildrenToPool();
      return;
    }
    for (let i = 0; i < data.length; i++) {
      let baseItem = this.list.addItemFromPool() as BaseItem;
      baseItem.info = data[i];
    }
  }

  private setTxtDescState(itemType: eMopupItemType = eMopupItemType.None) {
    switch (itemType) {
      case eMopupItemType.Mopuping:
        this.txtStateDesc.text = LangManager.Instance.GetTranslation(
          "MopupWnd.MopupItem.Sweeping",
        );
        break;
      case eMopupItemType.MopupEnd:
        this.txtStateDesc.text = LangManager.Instance.GetTranslation(
          "MopupWnd.MopupItem.SweepEnd",
        );
        break;
      case eMopupItemType.Mopuped:
      case eMopupItemType.None:
        this.txtStateDesc.text = "";
        break;
    }
  }

  public setTitle(numStr: string, type?: number) {
    this.title.text = LangManager.Instance.GetTranslation(
      "mopup.MopupManager.RewardsTip",
    );
    return;
    if (type == eMopupType.CampaignMopup) {
      this.title.text = LangManager.Instance.GetTranslation(
        "mopup.view.CampaignMopupIngFrame.resultTitle",
        numStr,
      );
    } else if (type == eMopupType.PetCampaignMopup) {
      this.title.text = LangManager.Instance.GetTranslation(
        "mopup.view.CampaignMopupIngFrame.resultTitle",
        numStr,
      );
    } else {
      this.title.text = LangManager.Instance.GetTranslation(
        "mopup.view.MazeMopupIngFrame.resultTitle",
        numStr,
      );
    }
  }

  public dispose() {
    try {
      this.list.removeChildrenToPool();
    } catch (error) {
      Logger.error(error);
    }
  }
}
