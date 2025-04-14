//@ts-expect-error: External dependencies
import FUI_OuterCityShopItem from "../../../../../fui/Base/FUI_OuterCityShopItem";
import FUI_ExchangeRandom from "../../../../../fui/OutCityShop/FUI_ExchangeRandom";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import BaseTipItem from "../../../component/item/BaseTipItem";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import {
  BagEvent,
  OuterCityShopEvent,
} from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../constant/UIDefine";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { OuterCityShopManager } from "../../../manager/OuterCityShopManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SharedManager } from "../../../manager/SharedManager";
import { ShopManager } from "../../../manager/ShopManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUIHelper from "../../../utils/FUIHelper";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { OuterCityShopItemInfo } from "../data/OuterCityShopItemInfo";
import { OuterCityShopModel } from "../OuterCityShopModel";
import ExchangeRandomItem from "./ExchangeRandomItem";

/**随机兑换 */
export default class ExchangeRandom extends FUI_ExchangeRandom {
  private _currentLeftFreshTime: number = 0;
  cfgFreeCount: number = 10; //默认初始免费10次, 读配置

  public diamondItem1: BaseTipItem;

  public diamondItem2: BaseTipItem;

  public giftItem: BaseTipItem;

  public tipItem4: BaseTipItem; //积分

  public tipItem5: BaseTipItem; //神秘石

  protected onConstruct() {
    super.onConstruct();
    OuterCityShopManager.instance.sendAction(1); //请求数据
    this.addEvent();
    this.diamondItem1.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
    this.diamondItem2.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
    this.giftItem.setInfo(TemplateIDConstant.TEMP_ID_GIFT);
    this.tipItem4.setInfo(TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE);
    this.tipItem5.setInfo(TemplateIDConstant.TEMP_ID_MYSTERY_STONE);
    this.refreshView();
  }

  private initData() {
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("ShopFresh_DayCount");
    if (cfgItem) {
      this.cfgFreeCount = Number(cfgItem.ConfigValue);
    }

    if (this.outerCityShopModel.lastFreshTime > 0) {
      this.txt_refreshTime.visible = true;
      this.setIsFreeFreshAble(false);
      this._currentLeftFreshTime = this.outerCityShopModel.lastFreshTime;
      Laya.timer.loop(1000, this, this.updatelastFreshTime);
    } else {
      this.__timeCompleteHandler();
    }
  }

  private updatelastFreshTime() {
    this._currentLeftFreshTime--;
    this.txt_refreshTime.text = LangManager.Instance.GetTranslation(
      "auction.view.mysteryshop.MysteryShopFrame.txt_autoRefreshTime",
      DateFormatter.getSevenDateString(this._currentLeftFreshTime),
    );
    if (this._currentLeftFreshTime <= 0) {
      this.__timeCompleteHandler();
    }
  }

  private __timeCompleteHandler() {
    Laya.timer.clear(this, this.updatelastFreshTime);
    this.txt_refreshTime.visible = false;
    this.setIsFreeFreshAble(true);
  }

  private addEvent() {
    this.btn_refresh.onClick(this, this.quickFreshHandler);
    this.btn_freeRefresh.onClick(this, this.freeFreshHandler);
    this.outerCityShopModel.addEventListener(
      OuterCityShopEvent.FRESH_VIEW,
      this.freshViewHandler,
      this,
    );
    this.list_shop.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list_shop.on(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.refreshView,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.refreshView,
      this,
    );
    this.outerCityShopModel.addEventListener(
      OuterCityShopEvent.FRESH_VIEW,
      this.refreshView,
      this,
    );
  }

  private offEvent() {
    this.btn_refresh.offClick(this, this.quickFreshHandler);
    this.btn_freeRefresh.offClick(this, this.freeFreshHandler);
    this.outerCityShopModel.removeEventListener(
      OuterCityShopEvent.FRESH_VIEW,
      this.freshViewHandler,
      this,
    );
    // this.list_shop.itemRenderer.recover();
    Utils.clearGListHandle(this.list_shop);
    this.list_shop.off(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.refreshView,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.refreshView,
      this,
    );
    this.outerCityShopModel.removeEventListener(
      OuterCityShopEvent.FRESH_VIEW,
      this.refreshView,
      this,
    );
  }

  private _currentSelectedItem: ExchangeRandomItem = null;
  private onListShopClick(item: ExchangeRandomItem, evt: Laya.Event) {
    let targetObj = fgui.GObject.cast(evt.target);
    if (targetObj instanceof FUI_OuterCityShopItem) {
      this._currentSelectedItem = item;
      let goodsInfo: GoodsInfo = new GoodsInfo();
      goodsInfo.templateId = parseInt(item.info.itemTemInfo.ItemId);
      if (item.info.isBuy) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("ExchangeRandomItem.hasbuy"),
        );
        return;
      }
      // 符文石
      if (
        item.itemInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL &&
        item.itemInfo.Property1 > 0
      ) {
        let state = this.outerCityShopModel.getRuneState(item.itemInfo);
        if (state > 0) {
          let strKey =
            state == 1
              ? "ExchangeRandomItem.tips.study"
              : "ExchangeRandomItem.tips.isOwn";
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(strKey),
          );
          return;
        }
      }
      FrameCtrlManager.Instance.open(EmWindow.BuyFrame2, {
        info: goodsInfo,
        count: 1,
        OuterCityShopItemInfo: item.info,
      });
    }
  }

  /**刷新积分, 神秘石数量显示 */
  private refreshView() {
    this.txt_Mystery.text = GoodsManager.Instance.getGoodsNumByTempId(
      ShopGoodsInfo.MYSTERY_STONE,
    ).toString(); //神秘石
    this.txt_Point.text = this.outerCityShopModel.consumePoints.toString(); //积分
    var num: number =
      Math.pow(2, this.outerCityShopModel.fresh_count + 1) *
      this.outerCityShopModel.refreshNeedStrategy;
    if (num >= this.outerCityShopModel.refreshNeedStrategyMax) {
      num = this.outerCityShopModel.refreshNeedStrategyMax;
    }
    let cfgValue = 10;
    let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName(
      "ShopFresh_NeedDiamond",
    );
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    this.outerCityShopModel.refreshNeedPoint = cfgValue;
    if (
      this.outerCityShopModel.refreshNeedPoint >
      this.playerModel.playerInfo.point + this.playerModel.playerInfo.giftToken
    ) {
      this.moneyTxt1.color = "#FF2E2E";
    } else {
      this.moneyTxt1.color = "#FFECC6";
    }
    this.giftTxt.text = this.playerModel.playerInfo.giftToken.toString();
    this.diamondTxt.text = this.playerModel.playerInfo.point.toString();
    this.moneyTxt1.text = this.outerCityShopModel.refreshNeedPoint.toString();
  }

  private renderListItem(index: number, item: ExchangeRandomItem) {
    item.info = this.outerCityShopModel.goodsList[index];
  }

  private freshViewHandler() {
    this.initData();
    this.list_shop.setVirtual();
    this.list_shop.numItems = this.outerCityShopModel.goodsList.length;
  }

  /**免费刷新 */
  private freeFreshHandler() {
    this.setIsFreeFreshAble(false);
    this.freshGoods();
  }

  /**立即刷新 */
  private quickFreshHandler() {
    if (ShopManager.Instance.isCannotUsePoint) {
      return;
    }

    if (!this.outerCityShopModel.goodsList) return;
    this.outerCityShopModel.payType = 1;
    if (this.checkGoods) {
      var content: string = LangManager.Instance.GetTranslation(
        "outercityshop.QuickRefreshGoodsTip",
      );
      let checkStr = LangManager.Instance.GetTranslation(
        "mainBar.view.VipCoolDownFrame.useBind",
      );
      let checkStr2 = LangManager.Instance.GetTranslation(
        "mainBar.view.VipCoolDownFrame.promptTxt",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        {
          checkRickText: checkStr,
          checkRickText2: checkStr2,
          checkDefault: true,
        },
        null,
        content,
        null,
        null,
        this.checkGoodsHandlerBack.bind(this),
      );
      return;
    }
    this.checkFresh();
  }

  private checkGoodsHandlerBack(result: boolean, flag: boolean) {
    if (result) {
      this.checkFresh();
    }
  }

  private checkFresh() {
    if (this.outerCityShopModel.payType == 1) {
      if (
        this.outerCityShopModel.refreshNeedPoint >
        this.playerModel.playerInfo.point +
          this.playerModel.playerInfo.giftToken
      ) {
        RechargeAlertMannager.Instance.show();
        return;
      }
      this.alertTodayFrame();
    }
  }

  private alertTodayFrame() {
    var preDate: Date = new Date(
      SharedManager.Instance.outercityShopRefreshCheckDate,
    );
    var check: boolean = SharedManager.Instance.outercityShopRefresh;
    var now: Date = new Date();
    var outdate: boolean = false;
    if (
      !check ||
      (preDate.getMonth <= preDate.getMonth && preDate.getDate < now.getDate)
    )
      outdate = true;
    if (outdate) {
      var content: string = LangManager.Instance.GetTranslation(
        "outercityshop.QuickRefreshPointTip",
        this.outerCityShopModel.refreshNeedPoint,
      );
      UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
        content: content,
        backFunction: this.todayNotAlertFresh.bind(this),
        closeFunction: null,
        point: this.outerCityShopModel.refreshNeedPoint,
      });
    } else {
      this.freshGoods(SharedManager.Instance.outercityshopFreshUseBind);
    }
  }

  private todayNotAlertFresh(b: boolean, useBind: boolean) {
    SharedManager.Instance.outercityShopRefresh = b;
    SharedManager.Instance.outercityShopRefreshCheckDate = new Date();
    SharedManager.Instance.outercityshopFreshUseBind = useBind;
    this.freshGoods(useBind);
  }

  /**检测有无精品道具 */
  private get checkGoods(): boolean {
    for (let i = 0; i < this.outerCityShopModel.goodsList.length; i++) {
      var temp: OuterCityShopItemInfo = this.outerCityShopModel.goodsList[i];
      if (!temp.isBuy && temp.itemTemInfo.IsDrop == 1) {
        return true;
      }
    }
    return false;
  }

  /**刷新物品 */
  private freshGoods(useBind: boolean = true) {
    OuterCityShopManager.instance.sendAction(
      3,
      this.outerCityShopModel.payType,
      useBind ? 2 : 1,
    );
    this.setIsFreeFreshAble(false);
  }

  /**设置免费刷新、立即刷新状态 */
  public setIsFreeFreshAble(isAble: boolean) {
    // isAble = this.outerCityShopModel.fresh_count < this.cfgFreeCount;
    isAble = false;
    if (isAble) {
      this.btn_freeRefresh.visible = true;
      this.btn_refresh.visible = false;
    } else {
      this.btn_freeRefresh.visible = false;
      this.btn_refresh.visible = true;
    }
    this.btn_refresh.title =
      LangManager.Instance.GetTranslation("OfferRewardWnd.nowRefreshTxt") +
      ` (${this.cfgFreeCount - this.outerCityShopModel.fresh_count}) `;
  }

  private get outerCityShopModel(): OuterCityShopModel {
    return OuterCityShopManager.instance.model;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose() {
    Laya.timer.clear(this, this.updatelastFreshTime);
    this.offEvent();
    super.dispose();
  }
}
