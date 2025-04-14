import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { BagEvent, ShopEvent } from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsType } from "../../../constant/GoodsType";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { ShopManager } from "../../../manager/ShopManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ShopControler } from "../../shop/control/ShopControler";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { ShopModel } from "../../shop/model/ShopModel";
import FarmShopItem from "./item/FarmShopItem";
import { BaseItem } from "../../../component/item/BaseItem";
import { ResourceManager } from "../../../manager/ResourceManager";
import { NumericStepper } from "../../../component/NumericStepper";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import ShopCommWnd from "../../common/ShopCommWnd";
import { DataCommonManager } from "../../../manager/DataCommonManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
/**
 * 农场商店
 */
export default class FarmShopWnd extends BaseWindow {
  // public tab: fgui.Controller;
  public frame: fgui.GLabel;
  public item: BaseItem;
  public btn_buy: fgui.GButton;
  public list_shop: fgui.GList;
  public txt_name: fgui.GTextField;
  public txt_hasNum: fgui.GTextField;
  public txt_price: fgui.GTextField;
  public profitTxt: fgui.GTextField;
  public timeTxt: fgui.GTextField;
  public stepper: NumericStepper;
  private _handler: Laya.Handler;
  private _shopGoodsArr: Array<any> = [];
  private _model: ShopModel;
  private _selectedItemData: ShopGoodsInfo;
  private MaxCanBuyCount: number = 0; //最大可购买数量
  private tipItem: BaseTipItem;
  public OnInitWind() {
    super.OnInitWind();
    // this.tab = this.getController("tab");
    this._model = ShopManager.Instance.model;
    this.setCenter();
    this.addEvent();
    this.list_shop.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list_shop.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.list_shop.scrollPane.mouseWheelEnabled = false;
    this.list_shop.setVirtual();
    this.shopCtrl.initFarmShopFrame();
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.refreshGoods();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  private addEvent() {
    // this.tab.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    this._model.addEventListener(
      ShopEvent.GOODS_LIST_UPDATE,
      this.refreshGoods,
      this,
    );
    this.btn_buy.onClick(this, this.buyHandler);
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.updateHandler,
      this,
    );
  }

  private removeEvent() {
    // this.tab.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    this._model.removeEventListener(
      ShopEvent.GOODS_LIST_UPDATE,
      this.refreshGoods,
      this,
    );
    this.btn_buy.offClick(this, this.buyHandler);
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.updateHandler,
      this,
    );
  }

  private refreshGoods() {
    this.list_shop.numItems = this._model.farmShopList.length;
    if (this.list_shop.numItems > 0) {
      this.list_shop.scrollToView(0);
      this.list_shop.selectedIndex = 0;
      this.onClickItem(this.list_shop.getChildAt(0) as FarmShopItem);
    }
  }

  private updateHandler() {
    this.updateMaxCanBuyCount();
    this.updatePropsCount();
  }

  buyHandler() {
    if (this._selectedItemData) {
      var itemid: number = this._selectedItemData.ItemId;
      let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        itemid,
      );
      if (
        GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
        GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(goods.TemplateId)
      ) {
        this.showAlert(); //物品时装备 背包中已存在
        return;
      }
      this.showBuyAlert();
    }
  }

  private showAlert() {
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
    var content: string =
      LangManager.Instance.GetTranslation("BuyFrameI.tip02");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.result.bind(this),
    );
  }

  private showBuyAlert() {
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
    let totalCost: number = this.stepper.value * this._selectedItemData.price;
    let str: string = ShopCommWnd.getCurrencyNameByType(
      ShopGoodsInfo.FARM_SHOP,
    );
    let content: string = LangManager.Instance.GetTranslation(
      "shopcommwnd.buy.alert",
      totalCost,
      str,
      this.stepper.value,
      this.txt_name.text,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.result.bind(this),
    );
  }

  private result(b: boolean, flag: boolean) {
    if (b) this.buy(false);
  }

  private buy(useBind: boolean = true) {
    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this._selectedItemData.ItemId,
    );
    if (this.isFashionGoods(temp)) {
      ShopManager.Instance.sendShoping(
        this._selectedItemData.Id,
        this.stepper.value,
        DataCommonManager.playerInfo.userId,
        false,
        C2SProtocol.C_FASHION_SHOP_BUY,
        useBind,
      );
    } else {
      ShopManager.Instance.sendShoping(
        this._selectedItemData.Id,
        this.stepper.value,
        DataCommonManager.playerInfo.userId,
        false,
        C2SProtocol.U_C_SHOP_BUY,
        useBind,
      );
    }
  }

  private renderListItem(index: number, item: FarmShopItem) {
    item.info = this._model.farmShopList[index]
      ? this._model.farmShopList[index]
      : null;
  }

  private onClickItem(item: FarmShopItem) {
    this._selectedItemData = item.info;
    this.refreshRight();
  }

  private refreshRight() {
    if (this._selectedItemData) {
      this.txt_name.text = this.getName();
      var goodsInfo: GoodsInfo = new GoodsInfo();
      let profile: number = 0;
      goodsInfo.templateId = this._selectedItemData.ItemId;
      let goodsTempInfo: t_s_itemtemplateData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          this._selectedItemData.ItemId,
        );
      if (
        goodsTempInfo &&
        goodsTempInfo.MasterType != GoodsType.EQUIP &&
        goodsTempInfo.MasterType != GoodsType.HONER
      ) {
        profile = goodsTempInfo.Profile;
        if (parseInt((goodsTempInfo.Property1 / 60).toString()) <= 0)
          this.timeTxt.text = LangManager.Instance.GetTranslation(
            "public.needMinutes",
            goodsTempInfo.Property1 % 60,
          );
        else if (goodsTempInfo.Property1 % 60 == 0)
          this.timeTxt.text =
            parseInt((goodsTempInfo.Property1 / 60).toString()) +
            LangManager.Instance.GetTranslation("public.time.hour");
        else
          this.timeTxt.text = LangManager.Instance.GetTranslation(
            "public.needHM",
            parseFloat((goodsTempInfo.Property1 / 60).toString()),
            goodsTempInfo.Property1 % 60,
          );
        var outputTemp: t_s_itemtemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_itemtemplate,
            goodsTempInfo.Property2,
          );
        if (outputTemp)
          this.profitTxt.text =
            goodsTempInfo.Property3 + " " + outputTemp.TemplateNameLang;
        else this.profitTxt.text = goodsTempInfo.Property3.toString();
      }
      this.txt_name.color = GoodsSonType.getColorByProfile(profile);
      this.updateMaxCanBuyCount();
      this.txt_hasNum.text =
        GoodsManager.Instance.getGoodsNumByTempId(
          this._selectedItemData.ItemId,
        ) + "";
      this._handler && this._handler.recover();
      this._handler = Laya.Handler.create(
        this,
        this.stepperChangeHandler,
        null,
        false,
      );
      this.stepper.show(0, 1, 1, this.MaxCanBuyCount, 999, 1, this._handler);
      this.txt_price.text = (
        this.stepper.value * this._selectedItemData.price
      ).toString();
    }
  }

  private updateMaxCanBuyCount() {
    this.MaxCanBuyCount = Math.floor(
      ResourceManager.Instance.gold.count / this._selectedItemData.price,
    );
    if (this.MaxCanBuyCount <= 0) this.MaxCanBuyCount = 0;
    this.stepper.resetStepper();
    this.stepper.updateLimit(
      this.MaxCanBuyCount > 0 ? this.MaxCanBuyCount : 1,
      this.MaxCanBuyCount > 0 ? this.MaxCanBuyCount : 1,
    );
    this.btn_buy.enabled = this.MaxCanBuyCount > 0;
  }

  private stepperChangeHandler(value: number) {
    this.updatePropsCount();
  }

  private updatePropsCount() {
    this.txt_price.text = (
      this.stepper.value * this._selectedItemData.price
    ).toString();
    if (this._selectedItemData) {
      this.txt_hasNum.text =
        GoodsManager.Instance.getGoodsNumByTempId(
          this._selectedItemData.ItemId,
        ) + "";
    } else {
      this.txt_hasNum.text = "";
    }
  }

  // private onTabChanged() {
  //     let index: number = this.tab.selectedIndex;
  //     switch (index) {
  //         case 0:
  //             this._model.currentTab = ShopModel.TAB1;
  //             break;
  //         // case 1:
  //         //     this._model.currentTab = ShopModel.TAB2;
  //         //     break;
  //         // case 2:
  //         //     this._model.currentTab = ShopModel.TAB3;
  //         //     break;
  //         case 3:
  //             this._model.currentTab = ShopModel.TAB4;
  //             break;
  //         default:
  //             this._model.currentTab = ShopModel.TAB1;
  //             break;
  //     }
  //     this.list_shop.selectedIndex = 0;
  // }

  private isFashionGoods(temp: t_s_itemtemplateData): boolean {
    if (
      temp.SonType == GoodsSonType.FASHION_CLOTHES ||
      temp.SonType == GoodsSonType.FASHION_HEADDRESS ||
      temp.SonType == GoodsSonType.FASHION_WEAPON ||
      temp.SonType == GoodsSonType.SONTYPE_WING
    ) {
      return true;
    }
    return false;
  }

  private getName(): string {
    let str: string = "";
    var goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = this._selectedItemData.ItemId;
    this.item.info = goodsInfo;
    let goodsTempInfo: t_s_itemtemplateData =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        this._selectedItemData.ItemId,
      );
    if (!goodsTempInfo) {
      this._selectedItemData = null;
      str = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.building.ConsortiaShopGoodsItem.noFindGoods",
      );
    }
    if (
      goodsTempInfo.MasterType != GoodsType.EQUIP &&
      goodsTempInfo.MasterType != GoodsType.HONER
    ) {
      str = goodsTempInfo.TemplateNameLang;
      let arr = str.split("-");
      if (arr) {
        str = arr[0];
      }
    }
    return str;
  }

  private get shopCtrl(): ShopControler {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.ShopWnd) as ShopControler;
  }

  dispose() {
    super.dispose();
  }
}
