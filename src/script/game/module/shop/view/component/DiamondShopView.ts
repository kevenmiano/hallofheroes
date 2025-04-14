//@ts-expect-error: External dependencies
import FUI_DiamondShopView from "../../../../../../fui/Shop/FUI_DiamondShopView";
import { BaseItem } from "../../../../component/item/BaseItem";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { GoodsManager } from "../../../../manager/GoodsManager";
import {
  BagEvent,
  ShopEvent,
} from "../../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../../component/FilterFrameText";
import LangManager from "../../../../../core/lang/LangManager";
import { ShopManager } from "../../../../manager/ShopManager";
import { ShopGoodsInfo } from "../../model/ShopGoodsInfo";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../../constant/ConfigDefine";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import { MainShopInfo } from "../../model/MainShopInfo";
import { ResourceManager } from "../../../../manager/ResourceManager";
import MazeModel from "../../../maze/MazeModel";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ShopControler } from "../../control/ShopControler";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ShopModel } from "../../model/ShopModel";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { NumericStepper } from "../../../../component/NumericStepper";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { ShopItem } from "./ShopItem";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import UIManager from "../../../../../core/ui/UIManager";
import UIButton from "../../../../../core/ui/UIButton";
import Logger from "../../../../../core/logger/Logger";
import { BagType } from "../../../../constant/BagDefine";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import Utils from "../../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/22 15:00
 * @ver 1.0
 */
export class DiamondShopView extends FUI_DiamondShopView {
  private _btnDiscount: UIButton;
  private _btnBuy: UIButton;

  public item: BaseItem;

  public stepper: NumericStepper;

  private _listdata: any[];
  private _currentSelectedItem: ShopItem;
  private _currentSelectedItemData: any;
  private _handler: Laya.Handler;

  private _discountTempleteId: number = 0;
  private _discountTempleteData: GoodsInfo = null;

  public tipBtn: BaseTipItem;

  constructor() {
    super();
  }

  public init() {
    this.resetUI();
    this.initData();
    this.initView();
    this.initEvent();
  }

  public resetUI() {
    this._userBindHandler = false;
    this._discountTempleteId = 0;
    this._discountTempleteData = null;
    this.c_discount.selectedIndex = 0;
    this.checkbox_useBind && (this.checkbox_useBind.enabled = true);
    // if (this._btnBuy) {
    //     this._btnBuy.enabled = (true && !ShopManager.Instance.requestBuyState);
    //     this.btn_buy.titleColor = this._btnBuy.enabled ? '#ffecc6' : '#aaaaaa';
    //     Utils.strokeColor(this._btnBuy.view as fgui.GButton, this._btnBuy.enabled);
    // }
  }

  private initData() {
    this._listdata = [];
  }

  private initView() {
    this.list_shop.setVirtual();
    this._btnDiscount = new UIButton(this.btn_discount);
    this._btnBuy = new UIButton(this.btn_buy);
    this._btnBuy.btnInternal = 300;
    this.onTabChanged();
    this._btnDiscount.visible = GoodsManager.Instance.hasDiscount;
  }

  private initEvent() {
    this.list_shop.on(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
    this._btnBuy.onClick(this, this.onBtnBuyClick);
    this._btnDiscount.onClick(this, this.onBtnDiscount);
    this.checkbox_useBind.onClick(this, this.onUseBindDiamond);

    this.playerInfo.addEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.updateMoney,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateGoodsHandler,
      this,
    );
    // NotificationManager.Instance.addEventListener(ShopEvent.MAIN_TAB_CHANGE, this.onMainTabChanged, this);
    NotificationManager.Instance.addEventListener(
      ShopEvent.SHOP_BUY_RESULT,
      this.onBuyResult,
      this,
    );
    if (ShopManager.Instance.model) {
      ShopManager.Instance.model.addEventListener(
        ShopEvent.GOODS_INFO_UPDATE,
        this.updateLimit,
        this,
      );
    }
  }

  private renderListItem(index: number, item: ShopItem) {
    if (!item) {
      return;
    }
    item.info = this._listdata[index];
    //固定为钻石
    item.setMoneyType();
  }

  private onMainTabChanged(index: number) {
    this.onTabChanged();
  }

  private onTabChanged() {
    // let mainIndex: number = ShopManager.Instance.model.mainTabIndex;
    // switch (cc.selectedIndex) {
    //     case 0:
    //         // if (mainIndex == 1) {//钻石
    //         //     this._data = this.shopModel.gemstoneGoodsList1;
    //         // } else if (mainIndex == 2) {//绑定钻石
    //         //     this._data = this.shopModel.gemstoneGoodsList2;
    //         // }
    //         this._data = this.shopModel.gemstoneGoodsList;
    //         break;
    //     case 1:
    //         // if (mainIndex == 1) {//钻石
    //         //     this._data = this.shopModel.petGoodsList1;
    //         // } else if (mainIndex == 2) {//绑定钻石
    //         //     this._data = this.shopModel.petGoodsList2;
    //         // }
    //         this._data = this.shopModel.petGoodsList;
    //         break;
    //     case 2:
    //         // if (mainIndex == 1) {//钻石
    //         //     this._data = this.shopModel.homeItemList1.concat(this.shopModel.propGoodsList1);
    //         // } else if (mainIndex == 2) {//绑定钻石
    //         //     this._data = this.shopModel.homeItemList2.concat(this.shopModel.propGoodsList2);
    //         // }
    //         this._data = this.shopModel.homeItemList.concat(this.shopModel.propGoodsList);
    //         break;
    //     case 3:
    //         // if (mainIndex == 1) {//钻石
    //         //     this._data = this.shopModel.cardReelList1;
    //         // } else if (mainIndex == 2) {//绑定钻石
    //         //     this._data = this.shopModel.cardReelList2;
    //         // }
    //         this._data = this.shopModel.cardReelList;
    //         break;
    // }

    this._listdata = this.shopModel.gemstoneGoodsList.concat(
      this.shopModel.petGoodsList,
      this.shopModel.homeItemList.concat(this.shopModel.propGoodsList),
      this.shopModel.cardReelList,
    );
    // this.list_shop.itemRenderer && this.list_shop.itemRenderer.recover();
    Utils.clearGListHandle(this.list_shop);
    this.list_shop.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list_shop.numItems = this._listdata.length;
    if (this._listdata.length > 0) {
      this.list_shop.scrollToView(0);
      this.list_shop.selectedIndex = 0;
      Laya.stage.frameOnce(1, this, () => {
        let childIndex: number = this.list_shop.itemIndexToChildIndex(
          this.list_shop.selectedIndex,
        );
        let selectItem = this.list_shop.getChildAt(childIndex) as ShopItem;
        if (selectItem) {
          this.onSelectItem(selectItem);
        }
      });
    }
  }

  private updateMoney(flag) {
    this.setBuybtnState();
    let dataInfo = this._listdata[this.list_shop.selectedIndex];
    if (dataInfo) {
      this.txt_hasNum.text =
        GoodsManager.Instance.getGoodsNumByTempId(dataInfo.ItemId) + ""; //更新已拥有数量
    }
  }

  private __updateGoodsHandler(infos: GoodsInfo[]) {
    // this.txt_hasNum.text = info.count + "";
    this.setBuybtnState();
    for (let info of infos)
      this.txt_hasNum.text =
        GoodsManager.Instance.getGoodsNumByTempId(info.templateId) + "";
  }

  private onListShopClick(item: ShopItem, evt: Laya.Event) {
    this._userBindHandler = false;
    this._discountTempleteId = 0;
    this._discountTempleteData = null;
    this.c_discount.selectedIndex = 0;
    this.checkbox_useBind.enabled = true;
    this.onSelectItem(item);
  }

  private onSelectItem(item: ShopItem) {
    this.c_discount.selectedIndex = 0;
    this._discountTempleteId = 0;
    this._discountTempleteData = null;
    this._currentSelectedItem = item;
    this._currentSelectedItemData = this._currentSelectedItem.info;
    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = item.info.ItemId;
    this.item.info = goodsInfo;
    this.txt_name.text = goodsInfo.templateInfo.TemplateNameLang;
    this.txt_name.color =
      FilterFrameText.Colors[eFilterFrameText.ItemQuality][
        goodsInfo.templateInfo.Profile - 1
      ];
    this.txt_hasNum.text =
      GoodsManager.Instance.getGoodsNumByTempId(item.info.ItemId) + "";

    //周限购字段的优先级比日限购的优先级高, 当周限购字段填写数量大于0时, 优先判断每周限购次数显示, 当WeeklyLimit字段填写为-1时, 周限购不限量, 则先判断日限购字段显示
    if (item.info.WeeklyLimit > -1) {
      this.txt_limit_type.text = LangManager.Instance.GetTranslation(
        "Shop.Promotion.weeklimit",
      );
      let leftValue = item.info.WeeklyLimit - item.info.weekCount;
      this.txt_limit.text =
        (leftValue > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") +
        leftValue +
        "[/color]/" +
        item.info.WeeklyLimit;
    } else {
      //当前可购买次数/最大购买次数
      this.txt_limit_type.text = LangManager.Instance.GetTranslation(
        "Shop.Promotion.daylimit",
      );
      if (item.info.OneDayCount != -1 && item.info.OneDayCount != undefined) {
        let leftValue = item.info.OneDayCount - item.info.OneCurrentCount;
        this.txt_limit.text =
          (leftValue > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") +
          leftValue +
          "[/color]/" +
          item.info.OneDayCount;
      } else {
        this.txt_limit.text = LangManager.Instance.GetTranslation(
          "shop.view.GoodsItem.limited07",
        );
      }
    }
    this.txt_desc.getChild("content").text =
      goodsInfo.templateInfo.DescriptionLang;

    this._handler && this._handler.recover();
    this._handler = Laya.Handler.create(
      this,
      this.stepperChangeHandler,
      null,
      false,
    );
    let leftNum = 0;
    let maxCount = 999;
    if (
      Number(item.info.OneDayCount) != -1 &&
      item.info.OneDayCount != undefined
    ) {
      //日限购
      leftNum = item.info.OneDayCount - item.info.OneCurrentCount;
      leftNum = Math.min(this.currentCanCount, leftNum, maxCount);
      this.stepper.show(0, 1, 1, leftNum, leftNum, 1, this._handler);
      // this._btnBuy.enabled = leftNum > 0 && !ShopManager.Instance.requestBuyState;
    } else if (
      Number(item.info.WeeklyLimit) != -1 &&
      item.info.WeeklyLimit != undefined
    ) {
      //周限购
      leftNum = item.info.WeeklyLimit - item.info.weekCount;
      leftNum = Math.min(this.currentCanCount, leftNum, maxCount);
      this.stepper.show(0, 1, 1, leftNum, leftNum, 1, this._handler);
      // this._btnBuy.enabled = leftNum > 0 && !ShopManager.Instance.requestBuyState;
    } else {
      leftNum = Math.min(this.currentCanCount, maxCount);
      this.stepper.show(
        0,
        1,
        1,
        this.currentCanCount,
        leftNum,
        1,
        this._handler,
      );
      // this._btnBuy.enabled = this.currentCanCount > 0 && !ShopManager.Instance.requestBuyState;
    }
    // this.btn_buy.titleColor = this._btnBuy.enabled ? '#ffecc6' : '#aaaaaa';
    // Utils.strokeColor(this._btnBuy.view as fgui.GButton, this._btnBuy.enabled);
    this.txt_price.text = "" + item.info.price * this.stepper.value;
    this.checkUseBind(this._currentSelectedItemData);
    let sysDiscountTemp = ShopManager.Instance.getDefaultSelectGoods(
      Number(this.txt_price.text),
    );
    if (sysDiscountTemp) {
      this.onDiscountHandler(sysDiscountTemp.templateId, sysDiscountTemp);
    }
  }

  private checkUseBind(item) {
    this.usebind.selectedIndex =
      item.PayType == ShopGoodsInfo.PAY_BY_POINT ? 0 : 1;
    if (this.usebind.selectedIndex == 1 && !this._userBindHandler) {
      this.checkbox_useBind.selected = true;
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_GIFT);
    } else {
      this.onsetMoneyType(item.PayType);
    }
  }

  private _currPayType: number = 0; //当前支付货币类型 1钻石  2绑定钻石
  private onsetMoneyType(value: number) {
    let templateId: number = ShopManager.Instance.model.getTemplateId(value);
    this.tipBtn.setInfo(templateId);
    this._currPayType = value;
  }

  private _userBindHandler: boolean = false;
  /**切换使用绑定钻石 */
  private onUseBindDiamond() {
    this._userBindHandler = true;
    if (this.checkbox_useBind.selected) {
      //绑钻
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_GIFT);
      this.onDiscountHandler(0, null);
    } else {
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_POINT);
      let totalCost = Number(
        this._currentSelectedItemData.price * this.stepper.value,
      );
      let sysDiscountTemp =
        ShopManager.Instance.getDefaultSelectGoods(totalCost);
      if (sysDiscountTemp) {
        this.onDiscountHandler(sysDiscountTemp.templateId, sysDiscountTemp);
      } else {
        this.onDiscountHandler(0, null);
      }
    }
  }

  private onBtnDiscount() {
    if (this._currentSelectedItem && this._currentSelectedItemData) {
      let stepCount = this.stepper.value;
      let price = this._currentSelectedItemData.price;
      let totalCost = stepCount * price;
      FrameCtrlManager.Instance.open(EmWindow.DiscountWnd, {
        count: totalCost,
        selectId: this._discountTempleteId,
        selectData: this._discountTempleteData,
        posId: 0,
        callFunc: this.onDiscountHandler.bind(this),
      });
    }
  }

  private onDiscountHandler(templeteId: number, templeteData: GoodsInfo) {
    this._discountTempleteId = templeteId;
    this._discountTempleteData = templeteData;
    this.txt_discount.visible = false;
    this.txt_price2.visible = false;
    Logger.warn(
      "onDiscountHandler:",
      this._discountTempleteId,
      this._discountTempleteData,
    );
    let totalCost = Number(
      this._currentSelectedItemData.price * this.stepper.value,
    );
    this.c_discount.selectedIndex = 0;
    if (this._discountTempleteData) {
      this.c_discount.selectedIndex = 1;
      this.txt_discount.visible = true;
      this.txt_price2.visible = true;
      let discountValue = Number(
        this._discountTempleteData.templateInfo.Property3,
      );
      this.txt_price.text = (totalCost - discountValue).toString();
      this.txt_price2.text = totalCost.toString();
      this.txt_discount.text = LangManager.Instance.GetTranslation(
        "shop.discount.discountText",
        discountValue,
      );
      this.checkbox_useBind.selected = false; //使用折扣券不勾选
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_POINT);
    } else {
      this.txt_price.text = totalCost.toString();
      this.txt_price2.text = "";
    }
  }

  private onBtnBuyClick() {
    if (this._currentSelectedItemData.WeeklyLimit != -1) {
      //周限购数量判断
      if (
        this._currentSelectedItemData.weekCount >=
        this._currentSelectedItemData.WeeklyLimit
      ) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.utils.ShopingHelper.command06",
          ),
        );
        return;
      }
    }

    if (this._currentSelectedItemData.OneDayCount != -1) {
      //日限购数量判断
      if (
        this._currentSelectedItemData.OneCurrentCount >=
        this._currentSelectedItemData.OneDayCount
      ) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.utils.ShopingHelper.command06",
          ),
        );
        return;
      }
    }
    let useBind: boolean = this._currPayType == ShopGoodsInfo.PAY_BY_GIFT;
    let leftCount = 0;
    if (this._discountTempleteId > 0) {
      leftCount = GoodsManager.Instance.getBagCountByTempId(
        BagType.Player,
        this._discountTempleteId,
      );
    }
    let userDiscount: boolean = this._discountTempleteId != 0 && leftCount > 0;
    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this._currentSelectedItemData.ItemId,
    );
    //如果绑定钻石不够,客户端提醒,不发给服务器
    //读取商城配置表价格数据
    let item: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoById(
      this._currentSelectedItemData.Id,
    );
    if (useBind) {
      this.showAlert(true, item, false);
      return;
    } else {
      this.showAlert(false, item, userDiscount);
      // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('consortia.ConsortiaControler.command07'));
      return;
    }
  }

  private showAlert(
    useBind: boolean,
    temp: ShopGoodsInfo,
    useDiscount: boolean = false,
  ) {
    let content: string = "";
    let countValue = 0;
    let discountValue = 0;
    if (useBind) {
      //绑定钻石购买
      countValue = this._currentSelectedItemData.price * this.stepper.value;
      content = LangManager.Instance.GetTranslation(
        "ShopWnd.Alert.BindDiamondBuy",
        countValue,
      );
    } else {
      //钻石购买
      if (useDiscount) {
        if (this._discountTempleteData)
          discountValue = this._discountTempleteData.templateInfo.Property3;
        countValue =
          this._currentSelectedItemData.price * this.stepper.value -
          discountValue;
        content = LangManager.Instance.GetTranslation(
          "ShopWnd.Alert.DiamondDiscountBuy",
          countValue,
          discountValue,
        );
      } else {
        countValue = this._currentSelectedItemData.price * this.stepper.value;
        content = LangManager.Instance.GetTranslation(
          "ShopWnd.Alert.DiamondBuy",
          countValue,
        );
      }
    }
    UIManager.Instance.ShowWind(EmWindow.BuyGoodsAlert, {
      price: this._currentSelectedItemData.price,
      count: this.stepper.value,
      temp: temp,
      useBind: useBind,
      useDiscount: useDiscount,
      content: content,
      goodsId: temp.ItemId,
      goodsCount: this.stepper.value,
      callback: this.canBuyCallback.bind(this),
    });
    // SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [temp, useBind], prompt, content, confirm, cancel, this.canBuyCallback.bind(this));
  }

  private canBuyCallback(b: boolean, data: any) {
    let temp = data.temp;
    let useBind = data.useBind;
    let useDiscount = data.useDiscount;
    let price = data.price;
    let count = data.count;
    if (b) {
      //如果为钻石,则提醒玩家钻石不足
      let costCount = 0;
      let disCountTempId: number = 0;
      let disCountValue = 0;
      if (useDiscount) {
        disCountTempId = this._discountTempleteData.id;
        let disTemplete =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(
            disCountTempId,
          ) as t_s_itemtemplateData;
        if (disTemplete) {
          disCountValue = Number(disTemplete.Property3);
        }
      }
      if (useBind) {
        //绑钻
        costCount =
          PlayerManager.Instance.currentPlayerModel.playerInfo.point +
          PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
      } else {
        //真钻
        costCount = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
      }
      if (costCount < price * count - disCountValue) {
        RechargeAlertMannager.Instance.show();
        return;
      }

      this.buy(temp, useBind, disCountTempId);
    }
  }

  private buy(
    temp: t_s_itemtemplateData,
    useBind: boolean,
    disCountTempId: number = 0,
  ) {
    if (
      this._currentSelectedItem &&
      this._currentSelectedItemData &&
      this.stepper
    ) {
      if (
        temp.SonType == GoodsSonType.FASHION_CLOTHES ||
        temp.SonType == GoodsSonType.FASHION_HEADDRESS ||
        temp.SonType == GoodsSonType.FASHION_WEAPON ||
        temp.SonType == GoodsSonType.SONTYPE_WING
      ) {
        ShopManager.Instance.sendShoping(
          this._currentSelectedItemData.Id,
          this.stepper.value,
          this.playerInfo.userId,
          false,
          C2SProtocol.C_FASHION_SHOP_BUY,
          useBind,
          disCountTempId,
        );
      } else {
        ShopManager.Instance.sendShoping(
          this._currentSelectedItemData.Id,
          this.stepper.value,
          this.playerInfo.userId,
          false,
          C2SProtocol.U_C_SHOP_BUY,
          useBind,
          disCountTempId,
        );
      }
      this.setBuybtnState();
    }
  }

  private get currentCanCount(): number {
    let pointCount: number = Math.floor(
      this.PayMoney / this._currentSelectedItemData.price,
    );
    if (this._currentSelectedItemData.canBuyNum == -1) {
      return pointCount;
    } else if (pointCount < 1) {
      return 0;
    } else {
      return Math.min(pointCount, this._currentSelectedItemData.canBuyNum);
    }
  }

  public get PayMoney(): number {
    if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_POINT ||
      this._currentSelectedItemData instanceof MainShopInfo
    ) {
      return this.playerInfo.point;
    } else if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_GIFT
    ) {
      return this.playerInfo.giftToken + this.playerInfo.point;
    } else if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_GOLD
    ) {
      return ResourceManager.Instance.gold.count;
    } else if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_OFFER
    ) {
      return this.playerInfo.consortiaOffer;
    } else if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_HONOR
    ) {
      return GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.MEDAL_TEMPID,
      );
    } else if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_MAZE
    ) {
      return GoodsManager.Instance.getGoodsNumByTempId(
        MazeModel.SHOP_MAZE_COIN_TEMPID,
      );
    } else if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_GLORY
    ) {
      return PlayerManager.Instance.currentPlayerModel.playerInfo.gloryPoint;
    } else if (
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_BACKPLAYER
    ) {
      return GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.BACKPLAYER_TEMPID,
      );
    } else {
      return this.playerInfo.point;
    }
  }

  private get shopController(): ShopControler {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.ShopWnd) as ShopControler;
  }

  private get shopModel(): ShopModel {
    return ShopManager.Instance.model;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private stepperChangeHandler(value: number) {
    let totalCost = Number(
      this._currentSelectedItemData.price * this.stepper.value,
    );
    let sysDiscountTemp = ShopManager.Instance.getDefaultSelectGoods(totalCost);
    if (sysDiscountTemp) {
      this.onDiscountHandler(sysDiscountTemp.templateId, sysDiscountTemp);
    } else {
      this.onDiscountHandler(0, null);
    }

    if (totalCost > this.PayMoney) {
      this.txt_price.color = "#CC0000";
    } else {
      this.txt_price.color = "#FFFFFF";
    }
    //
    //discount
    let discountReq = 0;
    if (this._discountTempleteData) {
      this.c_discount.selectedIndex = 1;
      discountReq = Number(this._discountTempleteData.templateInfo.Property2);
      let discountValue = Number(
        this._discountTempleteData.templateInfo.Property3,
      );
      this.txt_price.text = (totalCost - discountValue).toString();
      this.txt_price2.text = totalCost.toString();
    } else {
      this.c_discount.selectedIndex = 0;
      this.txt_price.text = totalCost.toString();
      this.txt_price2.text = "";
    }
    if (totalCost < discountReq) {
      //清除不使用折扣卷
      this._discountTempleteId = 0;
      this._discountTempleteData = null;
      this.checkbox_useBind.enabled = true;
      this._userBindHandler = false;

      this.c_discount.selectedIndex = 0;
      this.checkUseBind(this._currentSelectedItemData);
    }
  }

  private updateLimit() {
    this.setBuybtnState();
    let maxCount = 999;
    if (this._currentSelectedItemData.WeeklyLimit > -1) {
      // this.txt_limit_type.text = "每周限购";//LangManager.Instance.GetTranslation("Shop.Promotion.weeklimit");
      let weekLeftCount =
        this._currentSelectedItemData.WeeklyLimit -
        this._currentSelectedItemData.weekCount;
      this.txt_limit.text =
        (weekLeftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") +
        weekLeftCount +
        "[/color]/" +
        this._currentSelectedItemData.WeeklyLimit;
      maxCount = Math.min(weekLeftCount, maxCount, this.currentCanCount);
    } else if (this._currentSelectedItemData.OneDayCount > -1) {
      let dayLeftCount =
        this._currentSelectedItemData.OneDayCount -
        this._currentSelectedItemData.OneCurrentCount;
      this.txt_limit.text =
        (dayLeftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") +
        dayLeftCount +
        "[/color]/" +
        this._currentSelectedItemData.OneDayCount;
      maxCount = Math.min(dayLeftCount, maxCount, this.currentCanCount);
    } else {
      this.txt_limit.text = LangManager.Instance.GetTranslation(
        "shop.view.GoodsItem.limited07",
      );
      // this._btnBuy.enabled = this.currentCanCount > 0 && !ShopManager.Instance.requestBuyState;
      maxCount = Math.min(maxCount, this.currentCanCount);
    }

    this.stepper.resetStepper();
    this.stepper.updateLimit(maxCount, maxCount);
    this.txt_price.text =
      "" + this._currentSelectedItemData.price * this.stepper.value;
    // this._btnBuy.enabled = maxCount > 0 && !ShopManager.Instance.requestBuyState;
    // this.btn_buy.titleColor = this._btnBuy.enabled ? '#ffecc6' : '#aaaaaa';
    // Utils.strokeColor(this._btnBuy.view as fgui.GButton, this._btnBuy.enabled);
  }

  /**购买返回结果 */
  private onBuyResult() {
    this.setBuybtnState();
    this._btnDiscount.visible = GoodsManager.Instance.hasDiscount;
    if (this._discountTempleteId > 0) {
      //重置购买数量
      this.stepper.resetStepper();
      this.txt_price.text =
        "" + this._currentSelectedItemData.price * this.stepper.value;
    }
    this.updateLimit();
    this._discountTempleteId = 0;
    this._discountTempleteData = null;
    this.c_discount.selectedIndex = 0;
    let usebind =
      this._currentSelectedItemData.PayType == ShopGoodsInfo.PAY_BY_POINT
        ? false
        : true;
    this.checkbox_useBind.enabled = usebind;
    if (usebind) {
      //bind
      this.checkbox_useBind.selected = true;
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_GIFT);
    } else {
      this.checkbox_useBind.selected = false;
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_POINT);
    }
  }

  public removeEvent() {
    this.list_shop.off(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
    this._btnBuy && this._btnBuy.offClick(this, this.onBtnBuyClick);
    this._btnDiscount && this._btnDiscount.offClick(this, this.onBtnDiscount);
    this.checkbox_useBind.offClick(this, this.onUseBindDiamond);

    this.playerInfo.removeEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.updateMoney,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateGoodsHandler,
      this,
    );
    // NotificationManager.Instance.removeEventListener(ShopEvent.MAIN_TAB_CHANGE, this.onMainTabChanged, this);
    NotificationManager.Instance.removeEventListener(
      ShopEvent.SHOP_BUY_RESULT,
      this.onBuyResult,
      this,
    );
    if (ShopManager.Instance.model) {
      ShopManager.Instance.model.removeEventListener(
        ShopEvent.GOODS_INFO_UPDATE,
        this.updateLimit,
        this,
      );
    }
  }

  private setBuybtnState() {
    // let state = ShopManager.Instance.requestBuyState;
    // this._btnBuy.enabled = !state;
    // this.btn_buy.titleColor = this._btnBuy.enabled ? '#ffecc6' : '#aaaaaa';
    // Utils.strokeColor(this._btnBuy.view as fgui.GButton, this._btnBuy.enabled);
  }

  dispose(destroy = true) {
    this.removeEvent();
    if (this._handler) this._handler.recover();
    this._handler = null;
    // this.list_shop.itemRenderer && this.list_shop.itemRenderer.recover();
    Utils.clearGListHandle(this.list_shop);
    this._listdata = null;
    this._currentSelectedItem = null;
    destroy && super.dispose();
  }
}
