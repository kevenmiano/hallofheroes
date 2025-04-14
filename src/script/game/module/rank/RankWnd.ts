/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:32:05
 * @LastEditTime: 2023-07-10 14:19:01
 * @LastEditors: jeremy.xu
 * @Description: 通用排行榜界面
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import Utils from "../../../core/utils/Utils";
import { RankIndex, RankItemType } from "../../constant/RankDefine";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import RankInfoSelf from "./item/RankInfoSelf";
import { RankItemData } from "./RankData";

export default class RankWnd extends BaseWindow {
  private frame: fgui.GComponent;
  private rankListTitle: fgui.GList;
  private rankList: fgui.GList;
  private phSelfInfo: fgui.GImage;
  private rankInfoSelf: RankInfoSelf;
  private _rankListHeight: number = 0;
  private _itemTitle: any;

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    Utils.setDrawCallOptimize(this.contentPane);
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.initItem();
    this.initTitle();
    this.initSelfInfo();
    this.initHelpBtn();

    this.rankList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.rankList.setVirtual();
    this._rankListHeight = this.rankList.height;
    this.initRankListSize();

    this.ctrl.initRankData();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  refresh() {
    this.rankList.numItems = this.model.rankDatas.length;
    if (this.rankInfoSelf && !ObjectUtils.isEmptyObj(this.model.selfInfo)) {
      this.rankInfoSelf.info = this.model.selfInfo;
    }
  }

  private renderListItem(index: number, item: any) {
    if (!this.model) return;
    let itemDatas = this.model.rankDatas as RankItemData[];
    if (!itemDatas) return;
    let itemData = itemDatas[index];
    if (!itemData) {
      item.info = null;
      return;
    }
    item.info = itemData;
  }

  private initItem() {
    let url: string;
    switch (this.ctrl.rankItemType) {
      case RankItemType.RankItemR3:
        url = fgui.UIPackage.getItemURL(EmPackName.Base, "RankItemR3");
        break;
      case RankItemType.RankItemR4:
        url = fgui.UIPackage.getItemURL(EmPackName.Base, "RankItemR4");
        break;
      case RankItemType.RankItemR5:
        url = fgui.UIPackage.getItemURL(EmPackName.Base, "RankItemR5");
        break;
      default:
        break;
    }

    if (!url) return;

    this.rankList.defaultItem = url;
    this.rankListTitle.defaultItem = url;
  }

  private initTitle() {
    let itemTitle = this.rankListTitle.addItemFromPool() as any;
    itemTitle.info = this.model.getTitleDataByIndex(this.ctrl.rankIndex);
    itemTitle.titleColorList = this.model.getTitleColorByIndex(
      this.ctrl.rankIndex,
    );
    itemTitle.titleBg = "";
    this._itemTitle = itemTitle;
  }

  helpBtnClick() {
    let title = "";
    let content = "";
    switch (this.ctrl.rankIndex) {
      case RankIndex.RankItemR5_001:
        title = LangManager.Instance.GetTranslation("pvpHeroHelperFrame.title");
        content = LangManager.Instance.GetTranslation(
          "pvpHeroHelperFrame.content",
        );
        break;
      default:
        break;
    }

    if (content) {
      UIManager.Instance.ShowWind(EmWindow.Help, {
        title: title,
        content: content,
      });
    }
  }

  private initSelfInfo() {
    let rankInfoSelf;
    switch (this.ctrl.rankIndex) {
      case RankIndex.RankItemR5_001:
        rankInfoSelf = fgui.UIPackage.createObject(
          EmPackName.Base,
          "RankInfoSelf",
        ) as RankInfoSelf;
        break;
      default:
        break;
    }
    if (!rankInfoSelf) return;

    this.addChild(rankInfoSelf.displayObject);
    rankInfoSelf.x = this.phSelfInfo.x;
    rankInfoSelf.y = this.phSelfInfo.y;
    this.rankInfoSelf = rankInfoSelf;
  }

  private initHelpBtn() {
    switch (this.ctrl.rankIndex) {
      case RankIndex.RankItemR4_001:
        this.frame.getController("c1").selectedIndex = 1;
        break;
      default:
        break;
    }
  }

  private initRankListSize() {
    if (this.rankInfoSelf) {
      this.rankList.height = this._rankListHeight - this.rankInfoSelf.height;
    }
    if (this._itemTitle) {
      this.rankList.width = this._itemTitle.width;
    }
  }
}
