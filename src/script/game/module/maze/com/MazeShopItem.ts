/*
 * @Author: jeremy.xu
 * @Date: 2023-08-08 10:00:38
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-21 18:45:20
 * @Description:
 */
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import LangManager from "../../../../core/lang/LangManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { IconFactory } from "../../../../core/utils/IconFactory";
import MazeModel from "../MazeModel";
import { PlayerManager } from "../../../manager/PlayerManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import FUI_MazeShopItem from "../../../../../fui/Maze/FUI_MazeShopItem";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";

import {
  FilterFrameText,
  eFilterFrameText,
} from "../../../component/FilterFrameText";

export default class MazeShopItem extends FUI_MazeShopItem {
  private _vData: ShopGoodsInfo;

  public tipItem: BaseTipItem;

  public GoodsIcon: any;

  private goodsData: GoodsInfo;
  private __clickHandler() {
    MazeModel.instance.selectedItem = this._vData;
  }

  public get vdata(): ShopGoodsInfo {
    return this._vData;
  }

  public set vdata(value: ShopGoodsInfo) {
    this._vData = value;
    this.GoodsNameText.text = "";
    this.GoodsPriceTxt.text = "";
    this.OpenDescibleTxt.text = "";
    this.tipItem.visible = false;
    this.enabled = true;
    UIFilter.normal(this);
    if (this._vData) {
      this.OpenDescibleTxt.text = "";
      if (
        this._vData.MazeLayers >
        PlayerManager.Instance.currentPlayerModel.towerInfo1.maxIndex
      ) {
        this.OpenDescibleTxt.text = LangManager.Instance.GetTranslation(
          "maze.shop.tips",
          this._vData.MazeLayers,
        );
        UIFilter.gray(this);
        this.state.selectedIndex = 1;
      }
      if (
        this._vData.MazeLayers2 >
        PlayerManager.Instance.currentPlayerModel.towerInfo2.maxIndex
      ) {
        this.OpenDescibleTxt.text = LangManager.Instance.GetTranslation(
          "maze.shop.tips2",
          this._vData.MazeLayers2,
        );
        UIFilter.gray(this);
        this.state.selectedIndex = 1;
      }
      if (this.OpenDescibleTxt.text == "") {
        this.GoodsPriceTxt.text = this._vData.price + "";
        this.tipItem.visible = true;
        this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_MAZE, false);
        this.state.selectedIndex = 0;
      }
      this.GoodsNameText.text = this.getName();
    } else {
      this.GoodsIcon.info = null;
    }
  }

  private getName(): string {
    var goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = this._vData.ItemId;
    let goodsTempInfo: t_s_itemtemplateData =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        this._vData.ItemId,
      );
    if (!goodsTempInfo) {
      this._vData = null;
      var noFindGoods: string = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.building.ConsortiaShopGoodsItem.noFindGoods",
      );
      return noFindGoods;
    }
    this.GoodsIcon.info = goodsInfo;
    this.GoodsNameText.color =
      FilterFrameText.Colors[eFilterFrameText.ItemQuality][
        goodsInfo.templateInfo.Profile - 1
      ];
    return goodsTempInfo.TemplateNameLang;
  }

  public dispose() {}
}
