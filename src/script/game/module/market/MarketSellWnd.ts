import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { NumericStepper } from "../../component/NumericStepper";
import { EmWindow } from "../../constant/UIDefine";
import MarketManager from "../../manager/MarketManager";
import MarkGoodsItem from "./component/MarkGoodsItem";
import MarketSellGoodsInfo from "./component/MarketSellGoodsInfo";
import GoodsSonType from "../../constant/GoodsSonType";
import FUIHelper from "../../utils/FUIHelper";
import UIButton from "../../../core/ui/UIButton";

import MarketItemSellInfoMsg = com.road.yishi.proto.market.MarketItemSellInfoMsg;
import MarketOrderRespMsg = com.road.yishi.proto.market.MarketOrderRespMsg;
import { MessageTipManager } from "../../manager/MessageTipManager";
import ColorConstant from "../../constant/ColorConstant";
import { ResourceManager } from "../../manager/ResourceManager";
import UIManager from "../../../core/ui/UIManager";
import { SharedManager } from "../../manager/SharedManager";
/**
 * 市场出售
 */
export default class MarketSellWnd extends BaseWindow {
  public resizeContent = true;
  public setOptimize = true;

  public frame: fgui.GLabel;
  public tb1: fgui.GImage;
  public tb2: fgui.GImage;
  public u1: fgui.GImage;
  public itemBg: fgui.GImage;
  public gtb1: fgui.GImage;
  public sellHelpBtn: UIButton;
  public buyHelpBtn: UIButton;
  public pushBtn: fgui.GButton;
  public sellStepper: NumericStepper;
  public goodsItem: MarkGoodsItem;
  public sellGoodsList: fgui.GList;
  public sellCountLab: fgui.GRichTextField;
  public buyCountLab: fgui.GRichTextField;
  public pushCountLab: fgui.GRichTextField;
  public sellTxt: fgui.GTextField;
  public buyPriceLab: fgui.GTextField;
  public buyTxt: fgui.GTextField;
  public goodsNameLab: fgui.GTextField;
  public main: fgui.GGroup;
  public pushGoldLab: fgui.GRichTextField;
  public checkBtn: fgui.GButton;
  public goldIcon: fgui.GImage;

  private sellItems: MarketSellGoodsInfo[] = [];

  private curItem: MarketSellGoodsInfo;

  private msg: MarketItemSellInfoMsg;

  private payGold = 0;
  //是否出售中
  private isSelling = false;

  OnInitWind(): void {
    this.initTranslate();
    this.goodsItem.hideTitle();
  }

  OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    this.resetView();
    this.initHelpTips();
  }

  OnHideWind(): void {
    if (this.changeHandler) {
      this.changeHandler.recover();
      this.changeHandler = null;
    }

    MarketManager.Instance.removeEventListener(
      MarketManager.OnMarketSellList,
      this.OnMarketSellList,
      this,
    );
    MarketManager.Instance.removeEventListener(
      MarketManager.OnMarketOrderOption,
      this.OnMarketOrderOption,
      this,
    );
    super.OnHideWind();
  }

  private initTranslate() {
    this.frame.title = LangManager.Instance.GetTranslation("Market.sell.title");
    // this.sellCountLab.text = LangManager.Instance.GetTranslation("Market.sell.buyMaxPrice", 0);
    // this.buyCountLab.text = LangManager.Instance.GetTranslation("Market.sell.buyMinPrice", 0);
    this.sellTxt.text = LangManager.Instance.GetTranslation(
      "Market.sell.sellPrice",
    );
    this.buyTxt.text = LangManager.Instance.GetTranslation(
      "Market.sell.buyPrice",
    );

    // let c = MarketManager.Instance.curPuchareCount;
    // let m = MarketManager.Instance.marketPuchareMax;
    // this.pushCountLab.text = LangManager.Instance.GetTranslation("Market.sell.pushCount", c, m);
    this.pushGoldLab.text = MarketManager.Instance.payUseMarketOrderGold + "";
    this.pushBtn.title = LangManager.Instance.GetTranslation(
      "Market.sell.pushBtn",
    );
  }

  private addEvent() {
    this.pushBtn.onClick(this, this.onPushBtnTap);
    this.sellGoodsList.setVirtual();
    this.sellGoodsList.itemRenderer = Laya.Handler.create(
      this,
      this.onItemRender,
      null,
      false,
    );
    this.sellGoodsList.on(fairygui.Events.CLICK_ITEM, this, this.onItemClick);
    MarketManager.Instance.addEventListener(
      MarketManager.OnMarketSellList,
      this.OnMarketSellList,
      this,
    );
    MarketManager.Instance.addEventListener(
      MarketManager.OnMarketOrderOption,
      this.OnMarketOrderOption,
      this,
    );
    this.checkBtn.onClick(this, this.onCheckBtnClick);
  }

  private onItemRender(index: number, item: MarkGoodsItem) {
    item.MarketGoodsInfo = this.sellItems[index];
    item.itemTouch = false;
    item.selectedCrl.selectedIndex =
      this.curItem == item.MarketGoodsInfo ? 1 : 0;
  }

  private changeHandler: Laya.Handler;

  private OnMarketSellList(msg: MarketItemSellInfoMsg) {
    if (this.curItem && this.curItem.goodsInfo.templateId == msg.templateId) {
      this.msg = msg;
      this.sellCountLab.text = LangManager.Instance.GetTranslation(
        "Market.sell.buyMaxPrice",
        msg.purchaseMaxPrice == 0 ? "--" : msg.purchaseMaxPrice,
      );
      this.buyCountLab.text = LangManager.Instance.GetTranslation(
        "Market.sell.buyMinPrice",
        msg.sellMinPrice == 0 ? "--" : msg.sellMinPrice,
      );
      this.goodsNameLab.text =
        this.curItem.goodsInfo.templateInfo.TemplateNameLang;
      this.goodsNameLab.color = GoodsSonType.getColorByProfile(
        this.curItem.goodsInfo.templateInfo.Profile,
      );
      this.goodsItem.MarketGoodsInfo = this.curItem;
      let limit = this.curItem.limitInfo;

      if (!this.changeHandler) {
        this.changeHandler = Laya.Handler.create(
          this,
          this.onPriceChange,
          null,
          false,
        );
      }

      //市场价格
      // let marketOrder = MarketManager.Instance.getMarketByTemplateId(msg.templateId);

      //自己求购/发布 价格
      let myOrder = MarketManager.Instance.getOrderByTemplateId(msg.templateId);

      //取自己订单价格 ；没有自己订单，取 在售最低价格 或者 模板最高价格。
      let defaultPoint = limit.MinPrice;
      let mmPrice = msg.sellMinPrice;

      if (!myOrder) {
        defaultPoint = mmPrice > 0 ? mmPrice : limit.MaxPrice;
      } else {
        defaultPoint = myOrder.point;
      }

      let priceStep = Math.floor(limit.MinPrice * 0.2);
      this.sellStepper.show(
        0,
        defaultPoint,
        limit.MinPrice,
        limit.MaxPrice,
        limit.MaxPrice,
        priceStep,
        this.changeHandler,
      );
      this.onPriceChange();
      this.checkBtn.visible = true;
    }
  }

  private OnMarketOrderOption(msg: MarketOrderRespMsg) {
    if (msg.op == 1 && msg.result) {
      this.isSelling = false;
      this.resetView();
    }
  }

  private onItemClick(item: MarkGoodsItem) {
    if (this.curItem == item.MarketGoodsInfo) return;
    this.curItem = item.MarketGoodsInfo;
    MarketManager.Instance.reqMarketOpertion(4, item.info.templateId);
    this.sellGoodsList.refreshVirtualList();
  }

  private onPushBtnTap() {
    if (!this.curItem) return;

    let pc = MarketManager.Instance.curPuchareCount;
    let pm = MarketManager.Instance.marketPuchareMax;
    if (pc >= pm) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("market.push.countMax"),
      );
      return;
    }

    if (
      this.payGold > 0 &&
      ResourceManager.Instance.gold.count < this.payGold
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Market.sell.pushTips2"),
      );
      return;
    }

    //最大求购订单
    let myMaxOrder = MarketManager.Instance.getSellOrderMaxByTemplateId(
      this.curItem.goodsInfo.templateId,
    );
    //您正以更高价格求购相同物品
    if (myMaxOrder && this.sellStepper.value <= myMaxOrder.point) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Market.buy.errorSame"),
      );
      return;
    }

    this.checkConfirm();
  }

  private checkConfirm() {
    //免费发布
    if (this.payGold == 0 || SharedManager.Instance.marketNotAlertThisLogin) {
      this.sendBuy();
      return;
    }
    let content: string = LangManager.Instance.GetTranslation(
      "Market.sell.pushTips1",
      this.payGold,
    );
    UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
      content: content,
      state: 2,
      backFunction: this.confirmSell.bind(this),
      closeFunction: null,
    });
  }

  private confirmSell(b: boolean) {
    SharedManager.Instance.marketNotAlertThisLogin = b;
    this.sendBuy();
  }

  private sendBuy() {
    if (this.isSelling) return;
    this.isSelling = true;
    let count = 1;
    let price = this.sellStepper.value * count;
    MarketManager.Instance.reqMarketOrderOpertion(
      1,
      "",
      1,
      this.curItem.goodsInfo.templateId,
      count,
      price,
    );
  }

  private onPriceChange() {
    let v = this.sellStepper.value;
    let tax = MarketManager.Instance.marketTaxRare / 100;
    v = v - Math.ceil(v * tax);
    this.buyPriceLab.text = v == 0 ? "--" : v + "";
  }

  private resetView() {
    this.curItem = null;
    this.sellCountLab.text = LangManager.Instance.GetTranslation(
      "Market.sell.buyMaxPrice",
      "--",
    );
    this.buyCountLab.text = LangManager.Instance.GetTranslation(
      "Market.sell.buyMinPrice",
      "--",
    );
    this.sellItems = MarketManager.Instance.getSellsItems();
    this.sellGoodsList.numItems = this.sellItems.length;
    this.goodsItem.MarketGoodsInfo = null;
    this.goodsNameLab.text = "";
    this.sellStepper.show(0, 0, 0, 0);
    this.onPriceChange();
    this.checkBtn.visible = false;
    this.msg = null;
    this.updatePushInfo();
  }

  private updatePushInfo() {
    let freeCount = MarketManager.Instance.freeUseMarkeOrderCount2;
    let freeMax = MarketManager.Instance.freeUseMarkeOrderMax2;

    let payCount = MarketManager.Instance.payUseMarketOrderCount2;
    let payMax = MarketManager.Instance.payUseMarketOrderMax2;
    // let payGold = MarketManager.Instance.payUseMarketOrderGold;
    let haveNoFree = freeCount >= freeMax;
    let haveNoPay = payCount >= payMax;

    this.pushBtn.enabled = true;
    this.goldIcon.visible = false;
    this.pushGoldLab.visible = false;
    this.payGold = 0;
    //免费
    if (!haveNoFree) {
      this.pushCountLab.text = LangManager.Instance.GetTranslation(
        "Market.sell.pushCount1",
        freeMax - freeCount,
        freeMax,
      );
      return;
    }
    //付费
    if (!haveNoPay) {
      this.goldIcon.visible = true;
      this.pushGoldLab.visible = true;
      this.payGold = MarketManager.Instance.payUseMarketOrderGold2;
      this.pushCountLab.text = LangManager.Instance.GetTranslation(
        "Market.sell.pushCount2",
        payMax - payCount,
        payMax,
      );
      this.updatePushGoldColor();
      return;
    }
    //已达上限
    this.pushCountLab.text = LangManager.Instance.GetTranslation(
      "Market.sell.pushTips3",
    );
    this.pushBtn.enabled = false;
  }

  private updatePushGoldColor() {
    this.pushGoldLab.color =
      ResourceManager.Instance.gold.count >= this.payGold
        ? ColorConstant.LIGHT_TEXT_COLOR
        : ColorConstant.RED_COLOR;
  }

  private initHelpTips() {
    let tip01 = LangManager.Instance.GetTranslation("Market.sell.helpTip01");
    FUIHelper.setTipData(
      this.sellHelpBtn.view,
      EmWindow.CommonTips,
      tip01,
      new Laya.Point(-360, -135),
    );

    let tip02 = LangManager.Instance.GetTranslation("Market.sell.helpTip02");
    FUIHelper.setTipData(
      this.buyHelpBtn.view,
      EmWindow.CommonTips,
      tip02,
      new Laya.Point(-360, 0),
    );
  }

  private helpBtnClick() {
    // let title = LangManager.Instance.GetTranslation("public.help");
    // let content = LangManager.Instance.GetTranslation("Market.sell.help");
    // UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
  }

  public onCheckBtnClick() {
    if (!this.curItem) return;
    if (!this.msg) return;
    let haveNot = this.msg.purchaseMaxPrice == 0 && this.msg.sellMinPrice == 0;
    if (haveNot) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Market.sell.notInfoTip"),
      );
      return;
    }
    MarketManager.Instance.reqMarketOpertion(
      5,
      this.curItem.goodsInfo.templateId,
    );
  }
}
