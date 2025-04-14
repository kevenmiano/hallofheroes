//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ShopModel } from "../model/ShopModel";
import { BaseItem } from "../../../component/item/BaseItem";
import { NumericStepper } from "../../../component/NumericStepper";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ShopControler } from "../control/ShopControler";
import FUI_Dialog2 from "../../../../../fui/Base/FUI_Dialog2";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import {
  BagEvent,
  NotificationEvent,
  ShopEvent,
} from "../../../constant/event/NotificationEvent";
import { ShopItem } from "./component/ShopItem";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { CampaignManager } from "../../../manager/CampaignManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../component/FilterFrameText";
import { GoodsManager } from "../../../manager/GoodsManager";
import { ShopManager } from "../../../manager/ShopManager";
import { ShopGoodsInfo } from "../model/ShopGoodsInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import BaseTipItem from "../../../component/item/BaseTipItem";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { TempleteManager } from "../../../manager/TempleteManager";
import { NotificationManager } from "../../../manager/NotificationManager";

/**
 * @description 英灵兑换
 * @author yuanzhan.yu
 * @date 2021/11/11 17:14
 * @ver 1.0
 */
export class PetExchangeShopWnd extends BaseWindow {
  public frame: FUI_Dialog2;
  public list: fgui.GList; //英灵商品列表
  public loader_moneyType1_0: fgui.GLoader;
  public loader_moneyType1_1: fgui.GLoader;
  public loader_moneyType1_2: fgui.GLoader;
  public loader_moneyType1_3: fgui.GLoader;
  public txt_hasMoney: fgui.GTextField;
  public txt_hasMoney1: fgui.GTextField;
  public txt_hasMoney2: fgui.GTextField;
  public txt_hasMoney3: fgui.GTextField;
  public item: BaseItem;
  public txt_itemName: fgui.GTextField;
  public txt_hasNum: fgui.GTextField;
  public txt_desc: fgui.GTextField;
  public txt_limit_type: fgui.GTextField;
  public txt_limit: fgui.GTextField;
  public stepper: NumericStepper;
  public btn_buy: fgui.GButton;
  // public loader_moneyType2: fgui.GLoader;
  public txt_price: fgui.GTextField;
  public tipItem: BaseTipItem;
  private _control: ShopControler;
  private _shopModel: ShopModel;
  private _currentSelectedItem: ShopItem;
  private _handler: Laya.Handler;
  private _itemIds: number[] = [3101011, 3101021, 3101031, 3101041]; //对应兑换ID
  private _moneyRes: string[] = [
    "asset.stop.Money101",
    "asset.stop.Money102",
    "asset.stop.Money103",
    "asset.stop.Money104",
    "asset.stop.Money105",
    "asset.stop.Money106",
  ];
  private _hasMoney: number = 0;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initEvent();
    this.initView();
    ShopManager.Instance.getBuyDataInfos();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private initData() {
    this._control = FrameCtrlManager.Instance.getCtrl(
      EmWindow.ShopWnd,
    ) as ShopControler;
    this._shopModel = this._control.model;
    this.updateMoney();
  }

  private initView() {
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      let mapId: number = CampaignManager.Instance.mapId;
      this._control.initPetExchangeShopFrame(mapId);
    } else {
      this._control.initPetExchangeShopFrame();
    }

    this.__refreshGoods();
    this.list.selectedIndex = 0;
    let childIndex: number = this.list.itemIndexToChildIndex(
      this.list.selectedIndex,
    );
    this.onListItemClick(this.list.getChildAt(childIndex) as ShopItem, null);
  }

  private initEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onListItemRender,
      null,
      false,
    );
    this.list.on(fgui.Events.CLICK_ITEM, this, this.onListItemClick);
    this.frame.helpBtn.onClick(this, this.onBtnHelp);
    this.btn_buy.onClick(this, this.onBtnBuy);
    this._shopModel.addEventListener(
      ShopEvent.GOODS_LIST_UPDATE,
      this.__refreshGoods,
      this,
    );
    this._shopModel.addEventListener(
      ShopEvent.GOODS_INFO_UPDATE,
      this.__updateGoodsHandler,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateGoodsHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SHOP_TIME_BUY_REFRESH,
      this.__refreshGoods,
      this,
    );
  }

  private onListItemRender(index: number, item: ShopItem) {
    item.info = this._shopModel.showGoodsList[index];
    // let url: string = fgui.UIPackage.getItemURL("Space", this._moneyRes[item.info.PayType - ShopGoodsInfo.PAY_BY_FRAGMENT_1001]);
    let payType: number =
      item.info.PayType - ShopGoodsInfo.PAY_BY_FRAGMENT_1001;
    let templateId = this.getTempalteIdByType(payType);
    item.setMoneyType(templateId);
  }

  private getTempalteIdByType(type: number): number {
    let templateId: number = TemplateIDConstant.TEMP_ID_JINGHUA_GUANG;
    // switch(type){
    //     case 0://火
    //     templateId = TemplateIDConstant.TEMP_ID_JINGHUA_HUO;
    //     break;
    //     case 1://水
    //     templateId = TemplateIDConstant.TEMP_ID_JINGHUA_SHUI;
    //     break;
    //     case 2://电
    //     templateId = TemplateIDConstant.TEMP_ID_JINGHUA_DIAN;
    //     break;
    //     case 3://风
    //     templateId = TemplateIDConstant.TEMP_ID_JINGHUA_FENG;
    //     break;
    //     case 4://暗
    //     templateId = TemplateIDConstant.TEMP_ID_JINGHUA_AN;
    //     break;
    //     case 5://光
    //     templateId = TemplateIDConstant.TEMP_ID_JINGHUA_GUANG;
    //     break;
    // }
    return templateId;
  }

  private onBtnHelp() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let titleStr = "public.help";
    let tipStr = "PetExchangeShopFrame.HelpFrame.Txt";
    let title: string = LangManager.Instance.GetTranslation(titleStr);
    let content: string = LangManager.Instance.GetTranslation(tipStr);
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private __refreshGoods(): void {
    this.list.numItems = this._shopModel.showGoodsList.length;
  }

  private onListItemClick(item: ShopItem, evt: Laya.Event) {
    this._currentSelectedItem = item;
    this._hasMoney = GoodsManager.Instance.getGoodsNumByTempId(
      this._currentSelectedItem.info.NeedItem,
    );
    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = item.info.ItemId;
    this.item.info = goodsInfo;
    this.txt_itemName.text = goodsInfo.templateInfo.TemplateNameLang;
    this.txt_itemName.color =
      FilterFrameText.Colors[eFilterFrameText.ItemQuality][
        goodsInfo.templateInfo.Profile - 1
      ];
    let leftNum = 0;
    let maxCount = 999;
    if (item.info.WeeklyLimit > -1) {
      this.txt_limit_type.text = LangManager.Instance.GetTranslation(
        "Shop.Promotion.weeklimit",
      );
      this.txt_limit.text =
        item.info.WeeklyLimit -
        item.info.weekCount +
        "/" +
        item.info.WeeklyLimit;
      leftNum = item.info.WeeklyLimit - item.info.weekCount;
      leftNum = Math.min(this.currentCanCount, leftNum, maxCount);
    } else {
      //当前可购买次数/最大购买次数
      this.txt_limit_type.text = LangManager.Instance.GetTranslation(
        "Shop.Promotion.daylimit",
      );
      this.txt_limit.text =
        item.info.OneDayCount != -1 && item.info.OneDayCount != undefined
          ? item.info.OneDayCount -
            item.info.OneCurrentCount +
            "/" +
            item.info.OneDayCount
          : LangManager.Instance.GetTranslation(
              "shop.view.GoodsItem.limited07",
            );
    }
    this.btn_buy.enabled = leftNum > 0;
    this.txt_hasNum.text =
      GoodsManager.Instance.getGoodsNumByTempId(item.info.ItemId) + "";
    this.txt_desc.text = goodsInfo.templateInfo.DescriptionLang;

    this._handler && this._handler.recover();
    this._handler = Laya.Handler.create(
      this,
      this.stepperChangeHandler,
      null,
      false,
    );
    if (item.info.WeeklyLimit > -1) {
      this.stepper.show(0, 1, 1, leftNum, leftNum, 1, this._handler);
      this.btn_buy.enabled =
        leftNum > 0 && !ShopManager.Instance.requestBuyState;
    } else {
      this.stepper.show(
        0,
        1,
        1,
        this.currentCanCount > 0 ? this.currentCanCount : 1,
        this.currentCanCount,
        1,
        this._handler,
      );
      this.btn_buy.enabled = this.currentCanCount > 0;
    }
    // this.loader_moneyType2.url = fgui.UIPackage.getItemURL("Space", this._moneyRes[item.info.PayType - ShopGoodsInfo.PAY_BY_FRAGMENT_1001]);
    let payType: number =
      item.info.PayType - ShopGoodsInfo.PAY_BY_FRAGMENT_1001;
    let templateId = this.getTempalteIdByType(payType);
    this.tipItem.setInfo(templateId);
    this.costGoods =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(templateId);
    // let costNum = GoodsManager.Instance.getGoodsNumByTempId(templateId);
    //消耗物品数字处显示修改为“当前道具数量/所需道具数量”
    this.txt_price.text =
      this._hasMoney + "/" + item.info.price * this.stepper.value;
    this.stepperChangeHandler(null);
  }

  private costGoods: t_s_itemtemplateData;

  private updateMoney() {
    let count = this._moneyRes.length;
    for (let index = 0; index < 4; index++) {
      let element = this._moneyRes[index];
      let key = index > 0 ? index.toString() : "";
      let id = this._itemIds[index];
      this["loader_moneyType1_" + index].url = fgui.UIPackage.getItemURL(
        "Space",
        element,
      );
      let hasMoney = GoodsManager.Instance.getGoodsNumByTempId(id);
      this["txt_hasMoney" + key].text = hasMoney + "";
    }
  }

  private __updateGoodsHandler(infos: GoodsInfo[]) {
    this.updateMoney();
    if (this._currentSelectedItem) {
      this.onListItemClick(this._currentSelectedItem, null);
    }
  }

  private stepperChangeHandler(value: number) {
    this.txt_price.text =
      this._hasMoney +
      "/" +
      this._currentSelectedItem.info.price * this.stepper.value;
    if (
      Number(this.txt_price.text) >
      GoodsManager.Instance.getGoodsNumByTempId(
        this._currentSelectedItem.info.NeedItem,
      )
    ) {
      this.txt_price.color = "#CC0000";
    } else {
      this.txt_price.color = "#FFFFFF";
    }
  }

  private get currentCanCount(): number {
    let pointCount: number = Math.floor(
      this._hasMoney / this._currentSelectedItem.info.price,
    );
    if (this._currentSelectedItem.info.canBuyNum == -1) {
      return pointCount;
    } else if (pointCount < 1) {
      return 0;
    } else {
      return Math.min(pointCount, this._currentSelectedItem.info.canBuyNum);
    }
  }

  private onBtnBuy() {
    let info: ShopGoodsInfo = this._currentSelectedItem.info as ShopGoodsInfo;
    if (this._hasMoney < info.price * this.stepper.value) {
      let itemName: string = (
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          info.NeedItem,
        ) as t_s_itemtemplateData
      ).TemplateNameLang;
      let str: string = LangManager.Instance.GetTranslation(
        "notEnough",
        itemName,
      );
      MessageTipManager.Instance.show(str);
      return;
    }

    //英灵兑换增加确认框，和商城用同样的提示格式
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
    let totalCost: number = this.stepper.value * info.price;
    var content: string = LangManager.Instance.GetTranslation(
      "shopcommwnd.buy.alert",
      totalCost,
      this.costGoods.TemplateNameLang,
      this.stepper.value,
      this.item.info.templateInfo.TemplateNameLang,
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
    if (b) {
      let info: ShopGoodsInfo = this._currentSelectedItem.info as ShopGoodsInfo;
      ShopManager.Instance.sendShoping(info.Id, this.stepper.value, 0);
    }
  }

  private showBuyalert() {}

  private removeEvent() {
    this.list.itemRenderer && this.list.itemRenderer.recover();
    this.list.off(fgui.Events.CLICK_ITEM, this, this.onListItemClick);
    this.frame.helpBtn.offClick(this, this.onBtnHelp);
    this.btn_buy.offClick(this, this.onBtnBuy);
    this._shopModel.removeEventListener(
      ShopEvent.GOODS_LIST_UPDATE,
      this.__refreshGoods,
      this,
    );
    this._shopModel.removeEventListener(
      ShopEvent.GOODS_INFO_UPDATE,
      this.__updateGoodsHandler,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateGoodsHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SHOP_TIME_BUY_REFRESH,
      this.__refreshGoods,
      this,
    );
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._control = null;
    this._shopModel = null;
    this._currentSelectedItem = null;
    this._handler && this._handler.recover();
    this._handler = null;
    super.dispose(dispose);
  }
}
