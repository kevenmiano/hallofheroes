import FUI_ShopItem from "../../../../../../fui/Base/FUI_ShopItem";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import ResMgr from "../../../../../core/res/ResMgr";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import {
  ArrayConstant,
  ArrayUtils,
} from "../../../../../core/utils/ArrayUtils";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { BaseItem } from "../../../../component/item/BaseItem";
import { MovieClip } from "../../../../component/MovieClip";
import { t_s_startemplateData } from "../../../../config/t_s_startemplate";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { EmWindow } from "../../../../constant/UIDefine";
import { UpgradeType } from "../../../../constant/UpgradeType";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { ShopManager } from "../../../../manager/ShopManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../../consortia/control/ConsortiaControler";
import StarInfo from "../../../mail/StarInfo";
import { ShopGoodsInfo } from "../../model/ShopGoodsInfo";
import { StarBagType } from "../../../../constant/StarDefine";
import {
  FilterFrameText,
  eFilterFrameText,
} from "../../../../component/FilterFrameText";
import { ResRefCountManager } from "../../../../managerRes/ResRefCountManager";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { OuterCityShopManager } from "../../../../manager/OuterCityShopManager";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/26 11:52
 * @ver 1.0
 *
 */
export class ShopItem extends FUI_ShopItem {
  public item: BaseItem;
  public tipData: any;
  public extData: any;
  public tipType: EmWindow;
  canOperate: boolean = false;
  protected _movie: MovieClip = new MovieClip();
  protected _info: any;

  public tipBtn: BaseTipItem;
  get info(): any {
    return this._info;
  }

  set info(value: any) {
    this._info = value;
    this.moneyTxt.visible = false;
    this.tipBtn.visible = false;
    this.runeGroup.visible = false;
    this._movie.stop();
    this._movie.visible = false;
    this.item.visible = false;
    if (this._info) {
      if (this._info instanceof ShopGoodsInfo) {
        this._info.init(); //解决初始加载顺序Bug
        let goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.validDate = value.ValidDate;
        goodsInfo.templateId = this._info.ItemId;
        this.item.visible = true;
        this.item.info = goodsInfo;
        this.txt_name.text = goodsInfo.templateInfo.TemplateNameLang;
        this.txt_name.color = GoodsSonType.getColorByProfile(
          goodsInfo.templateInfo.Profile,
        );
        let templateId: number = ShopManager.Instance.model.getTemplateId(
          this._info.PayType,
        );
        this.tipBtn.setInfo(templateId, false);
        this.txt_price.text = this._info.price.toString();
        this.tipBtn.visible = true;
        this.runeGroup.visible = false;
        if (
          this._info.ShopType == ShopGoodsInfo.CONSORTIA_SHOP ||
          this._info.ShopType == ShopGoodsInfo.ADVCONSORTIA_SHOP ||
          this._info.ShopType == ShopGoodsInfo.CONSORTIA_HIGH_SHOP
        ) {
          //公会商城
          this.enabled = true;
          let goods: t_s_itemtemplateData =
            TempleteManager.Instance.getGoodsTemplatesByTempleteId(
              this._info.ItemId,
            );
          if (this.checkIsRunes(this._info) && goods.Property1 > 0) {
            //是符文
            let state = OuterCityShopManager.instance.model.getRuneState(goods);
            if (state == 1) {
              //已经学习
              this.runeDescTxt.text = LangManager.Instance.GetTranslation(
                "yishi.view.tips.goods.ComposeTip.vStudy",
              );
              this.runeGroup.visible = true;
            } else if (state == 2) {
              //已经拥有
              this.runeDescTxt.text = LangManager.Instance.GetTranslation(
                "ExchangeRandomItem.isOwn",
              );
              this.runeGroup.visible = true;
            } else {
              this.runeGroup.visible = false;
            }
          } else {
            this.runeGroup.visible = false;
          }
          if (this._info.NeedConsortiaLevels > this.consortiaLevel) {
            UIFilter.gray(this);
            this.enabled = true;
            this.tipBtn.visible = false;
            this.txt_price.text = "";
            this.txt_openDescible.visible = true;
            this.txt_openDescible.text = LangManager.Instance.GetTranslation(
              "consortia.view.myConsortia.building.ConsortiaShopGoodsItem.tips",
              this._info.NeedConsortiaLevels,
            );
          } else {
            UIFilter.normal(this);
            this.txt_openDescible.visible = false;
            this.txt_openDescible.text = "";
          }
        } else if (
          this._info.ShopType == ShopGoodsInfo.ATHLETICS_SHOP ||
          this._info.ShopType == ShopGoodsInfo.WARLORDS_SHOP
        ) {
          var honorTemp: t_s_upgradetemplateData;
          var tempList: Array<t_s_upgradetemplateData> =
            TempleteManager.Instance.getTemplatesByType(
              UpgradeType.UPGRADE_TYPE_HONER,
            );
          tempList = ArrayUtils.sortOn(tempList, "Data", ArrayConstant.NUMERIC);
          for (var i: number = 0; i < tempList.length; i++) {
            var temp: t_s_upgradetemplateData = tempList[
              i
            ] as t_s_upgradetemplateData;
            if (temp && this._info.NeedGeste >= temp.Data) {
              honorTemp = temp;
            }
          }
          this.enabled = true;
          if (this._info.NeedGeste > ArmyManager.Instance.thane.honer) {
            this.tipBtn.visible = false;
            UIFilter.gray(this);
            this.txt_price.text = "";
            this.txt_openDescible.visible = true;
            this.txt_openDescible.text = LangManager.Instance.GetTranslation(
              "room.view.pvp.PVPShop.Condition",
              honorTemp.TemplateNameLang,
            );
          } else {
            this.txt_openDescible.visible = false;
            this.txt_openDescible.text = "";
            UIFilter.normal(this);
          }
        }
      } else if (this._info instanceof t_s_startemplateData) {
        var info: StarInfo = new StarInfo();
        info.template = this._info;
        info.bagType = StarBagType.SHOP;
        info.grade = 1;
        this.tipType = EmWindow.StarTip;
        this.tipData = info;
        this.item.info = null;
        this.displayObject.addChild(this._movie);
        let realPath = IconFactory.getStarIconPath(this._info.Icon);
        ResRefCountManager.loadRes(realPath, (res) => {
          if (!res || !this._info) {
            Logger.warn("[ShopItem]info realPath assets is null", realPath);
            return;
          }
          let prefix = res.meta.prefix;
          let frames = res.frames;
          let sourceSize = new Laya.Rectangle();
          for (let key in frames) {
            if (Object.prototype.hasOwnProperty.call(frames, key)) {
              let sourceItem = frames[key].sourceSize;
              sourceSize.width = sourceItem.w;
              sourceSize.height = sourceItem.h;
              break;
            }
          }

          let cacheName = prefix + String(this._info.Icon);
          let aniCahce = AnimationManager.Instance.getCache(cacheName);
          let success: boolean;
          if (!aniCahce) {
            success = AnimationManager.Instance.createAnimation(
              cacheName,
              "",
              0,
            );
          }

          this._movie.visible = true;
          this._movie.gotoAndPlay(0, true, cacheName);
          this._movie.pos(
            (110 - sourceSize.width) / 2,
            (120 - sourceSize.height) / 2,
          );

          ResRefCountManager.setAniCacheName(realPath, cacheName);
          ResRefCountManager.getRes(realPath);
        });
        this.item.visible = false;
        this.txt_name.text = this._info.TemplateNameLang;
        let Colors = FilterFrameText.Colors[eFilterFrameText.PetQuality];
        let profile = this._info.Profile;
        if (this._info.Profile > Colors.length) {
          profile = Colors.length;
        }
        let nameColor = Colors[profile - 1];
        this.txt_name.color = nameColor;
        // Logger.xjy("ShopItem", this._info.TemplateName, this._info.Profile, nameColor);
        this.txt_price.text = this._info.StarPoint.toString();
        this.moneyTxt.visible = true;
      }
    }
  }

  private checkIsRunes(info: ShopGoodsInfo): boolean {
    let flag: boolean = false;
    var goods: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(info.ItemId);
    if (goods && goods.SonType == 302) {
      flag = true;
    }
    return flag;
  }

  protected get consortiaLevel(): number {
    var lv: number;
    let contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    if (contorller && contorller.model) {
      lv = contorller.model.consortiaInfo.shopLevel;
    }
    return lv;
  }

  public setMoneyType(templateId: number = TemplateIDConstant.TEMP_ID_DIAMOND) {
    this.tipBtn.setInfo(templateId, false);
  }

  dispose() {
    if (this._info && this._info instanceof t_s_startemplateData) {
      let realPath = IconFactory.getStarIconPath(this._info.Icon);
      ResRefCountManager.clearRes(realPath);
    }
    this._info = null;
    this._movie.stop();
    this._movie = null;
    super.dispose();
  }
}
