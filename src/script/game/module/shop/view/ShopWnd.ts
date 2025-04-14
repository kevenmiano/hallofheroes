//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { DiamondShopView } from "./component/DiamondShopView";
import { ShopManager } from "../../../manager/ShopManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ShopEvent, VIPEvent } from "../../../constant/event/NotificationEvent";
import { PayView } from "./component/PayView";
import { VIPManager } from "../../../manager/VIPManager";
import LimitShopView from "./component/LimitShopView";
import { ShopModel } from "../model/ShopModel";
import { MainShopInfo } from "../model/MainShopInfo";
import Promotion from "./component/Promotion";
import DiscountShopView from "./component/DiscountShopView";
import { ConfigManager } from "../../../manager/ConfigManager";
import { DiscountShopManager } from "../control/DiscountShopManager";
import { DiscountShopModel } from "../model/DiscountShopModel";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import Utils from "../../../../core/utils/Utils";
import ComponentSetting from "../../../utils/ComponentSetting";
import { ShopCommonView } from "./component/ShopCommonView";
import { ShopGoodsInfo } from "../model/ShopGoodsInfo";
import { PvpShopView } from "./component/PvpShopView";
import { MazeShopView } from "./component/MazeShopView";
import { AccountCom } from "../../common/AccountCom";
import FUIHelper from "../../../utils/FUIHelper";
import LangManager from "../../../../core/lang/LangManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import OpenGrades from "../../../constant/OpenGrades";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ConsortiaControler } from "../../consortia/control/ConsortiaControler";
import WishPoolView from "./component/WishPoolView";

/**
 * @description 商城
 * @author yuanzhan.yu
 * @date 2021/4/25 15:20
 * @ver 1.0
 */
export class ShopWnd extends BaseWindow {
  public tab1: fgui.Controller;
  public tab2: fgui.Controller;
  public frame: fgui.GLabel;
  public diamondShopView: DiamondShopView;
  public limitShopView: LimitShopView;
  public payView: PayView;
  public promotion: Promotion;
  public discountShopView: DiscountShopView;
  public consortiaShopView: ShopCommonView;
  public pvpShopView: PvpShopView;
  public mazeShopView: MazeShopView;
  public account: AccountCom;
  public tab_diamond: fgui.GButton;
  public tab_consortia: fgui.GButton;
  public tab_pvp: fgui.GButton;
  public tab_maze: fgui.GButton;
  public tab_hope: fgui.GButton;
  public tab_discount: fgui.GButton;
  public tab_promotion: fgui.GButton;
  public tab_recharge: fgui.GButton;
  public tab_limit: fgui.GButton;
  public Img_limitIcon: fgui.GImage; //限时tab Icon
  public wishPoolView: WishPoolView;
  private tabGroup: Array<fgui.GButton> = [];
  public modelEnable: boolean = false;
  protected resizeContent: boolean = true;
  protected resizeFullContent: boolean = true;
  private _currentView: any;
  private _consortiaShopLevel: number = 0;
  protected setSceneVisibleOpen: boolean = true;
  protected setOptimize: boolean = true;

  constructor() {
    super();
  }

  public OnInitWind() {
    this.setCenter();
    this.contentPane.displayObject["dyna"] = true;
    Utils.setDrawCallOptimize(this.contentPane);
    this.tab1 = this.getController("tab1");
    this.tab2 = this.getController("tab2");
    this.tab1.selectedIndex = -1;
    this.tab2.selectedIndex = -1;
    this.tabGroup = [
      this.tab_diamond,
      this.tab_consortia,
      this.tab_pvp,
      this.tab_maze,
      this.tab_hope,
      this.tab_discount,
      this.tab_promotion,
      this.tab_recharge,
    ];

    // if(!(Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION))
    // {
    //     this.tabGroup.push(this.tab_recharge);
    //     this.tabGroup.push(this.tab_promotion);
    // }

    this.initData();
    this.initView();
    this.initEvent();
    ShopManager.Instance.requestLimitData();
  }

  private initData() {
    let contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    if (contorller && contorller.model) {
      this._consortiaShopLevel = contorller.model.consortiaInfo.shopLevel;
    }
  }

  private initView() {
    this.setTabRechargeStyle();
    //更新显示礼包红点
    this.__flashPrivilege();
    this.__updateDiscountRedDot();
    //更新充值按钮红点
    this.tab_discount.visible =
      this.discountModel.open && ConfigManager.info.DISCOUNT_SHOP_SWITCH;
    this.tab_limit.visible = this.shopModel.getTimeBuyList(0).length > 0; //限时商店
    this.Img_limitIcon.visible = this.tab_limit.visible;
    this.tab_maze.visible =
      ArmyManager.Instance.thane.grades >= OpenGrades.MAZE;
    this.tab_consortia.visible =
      PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0 &&
      this._consortiaShopLevel > 0;
    this.tab_pvp.visible =
      ArmyManager.Instance.thane.grades >= OpenGrades.CHALLENGE;
    this.tab_hope.visible = ComponentSetting.SHOP_TAB_HOPE;
    //
    // this.tab_promotion.visible = false;
    if (this.tab_limit.visible) {
      this.__flashLimitDiscount();
    }

    this.tab_recharge.visible = !(
      Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION
    );
    this.tab_promotion.visible = !(
      Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION
    );
    this.account.showRechargeBtn(false);
  }

  private get shopModel(): ShopModel {
    return ShopManager.Instance.model;
  }

  /**
   * 刷新会员特权礼包展示状态
   */
  private __flashPrivilege() {
    let vipGiftState = VIPManager.Instance.vipGiftState;
    this.updateRedDot(7, vipGiftState);
  }

  private __updateDiscountRedDot() {
    let state = DiscountShopManager.Instance.model.myDiscount <= 0;
    this.updateRedDot(5, state);
  }

  /**
   * 刷新限时礼包展示状态
   * 当免费礼包未领取时
   */
  private __flashLimitDiscount() {
    let shopModel = ShopManager.Instance.model;
    let isFree = false;
    if (shopModel) {
      let discountlist = shopModel.mainDiscountList;
      for (let key in discountlist) {
        if (Object.prototype.hasOwnProperty.call(discountlist, key)) {
          let shopItem: MainShopInfo = discountlist[key];
          if (shopItem.discount == 0 && shopItem.count < shopItem.oneDayCount) {
            isFree = true;
            break;
          }
        }
      }
    }
    this.updateRedDot(0, isFree);
  }

  private initEvent() {
    this.tab1 &&
      this.tab1.on(fgui.Events.STATE_CHANGED, this, this.onTab1Changed);
    this.tab2 &&
      this.tab2.on(fgui.Events.STATE_CHANGED, this, this.onTab2Changed);
    VIPManager.Instance.addEventListener(
      VIPEvent.VIP_PRIVILEGE_UPDATE,
      this.__flashPrivilege,
      this,
    );
    NotificationManager.Instance.dispatchEvent(
      ShopEvent.GOODS_DISCOUNT_UPDATE,
      this.__flashLimitDiscount,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ShopEvent.PAGE_SELECTED,
      this.onPageSelect,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ShopEvent.DISCOUNTSHOP_OPENSTATE,
      this.onDiscountShopOpenState,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ShopEvent.DISCOUNTSHOP_UPDATE,
      this.__updateDiscountRedDot,
      this,
    );
  }

  private onPageSelect(index) {
    if (Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION && index == 3) {
      index = 1;
    }
    if (index) {
      this.tab1.selectedIndex = index;
    }
  }

  private onDiscountShopOpenState() {
    this.tab_discount.visible =
      this.discountModel.open && ConfigManager.info.DISCOUNT_SHOP_SWITCH;
    if (!this.discountModel.open && this.tab1.selectedIndex == 5) {
      FrameCtrlManager.Instance.exit(EmWindow.ShopWnd);
    }
  }

  public OnShowWind() {
    super.OnShowWind();
    let frameData = this.params.frameData;
    if (frameData) {
      // let pageValue = frameData.page == 2 ? 1 : frameData.page;
      let pageValue = frameData.page;
      if (
        Utils.isWxMiniGame() &&
        ComponentSetting.IOS_VERSION &&
        pageValue == 3
      ) {
        pageValue = 1;
      }
      this.tab1.selectedIndex = pageValue;
    } else {
      this.tab1.selectedIndex = 0;
    }
  }

  private onTab1Changed(cc: fgui.Controller) {
    // if (this._currentView) {
    //     this._currentView.dispose();
    // }

    switch (cc.selectedIndex) {
      case 0: //钻石商店
        this.account.switchIcon(0);
        this.tab2.selectedIndex = -1;
        this.tab2.selectedIndex = 0;
        this._currentView = this.diamondShopView;
        break;
      case 1: //公会商店
        this.account.switchIcon(9);
        this.consortiaShopView.init(ShopGoodsInfo.CONSORTIA_SHOP);
        this._currentView = this.consortiaShopView;
        break;
      case 2: //竞技商店
        this.account.switchIcon(12);
        this.pvpShopView.init();
        this._currentView = this.pvpShopView;
        break;
      case 3: //迷宫商店
        this.account.switchIcon(11);
        this.mazeShopView.init();
        this._currentView = this.mazeShopView;
        break;
      case 4: //许愿池
        this.account.switchIcon(13);
        this.wishPoolView.init();
        this._currentView = this.wishPoolView;
        break;
      case 5:
        this.account.switchIcon(0);
        this.discountShopView.init();
        this._currentView = this.discountShopView;
        break;
      case 6:
        this.account.switchIcon(0);
        this.promotion.init();
        this._currentView = this.promotion;
        break;
      case 7:
        this.account.switchIcon(0);
        this.payView.init();
        this._currentView = this.payView;
        break;
    }
    // ShopManager.Instance.model.mainTabIndex = cc.selectedIndex;
    // NotificationManager.Instance.sendNotification(ShopEvent.MAIN_TAB_CHANGE, cc.selectedIndex);
  }

  private onTab2Changed(cc: fgui.Controller) {
    this.diamondShopView.removeEvent();
    this.limitShopView.removeEvent();
    switch (cc.selectedIndex) {
      case 0:
        this.account.switchIcon(0);
        this.diamondShopView.init();
        this._currentView = this.diamondShopView;
        break;
      case 1:
        this.account.switchIcon(0);
        this.limitShopView.init();
        this._currentView = this.limitShopView;
        break;
    }
  }

  /**
   * 更新按钮红点
   * @param index 索引
   * @param light 红点
   */
  private updateRedDot(index: number = 0, light: boolean = false) {
    let btn = this.tabGroup[index];
    if (btn) {
      btn.getChild("redDot").visible = light;
      btn.getChild("redDotLabel").visible = false;
    }
  }

  public get discountModel(): DiscountShopModel {
    return DiscountShopManager.Instance.model;
  }

  private removeEvent() {
    this.tab1 &&
      this.tab1.off(fgui.Events.STATE_CHANGED, this, this.onTab1Changed);
    this.tab2 &&
      this.tab2.off(fgui.Events.STATE_CHANGED, this, this.onTab2Changed);
    VIPManager.Instance.removeEventListener(
      VIPEvent.VIP_PRIVILEGE_UPDATE,
      this.__flashPrivilege,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ShopEvent.GOODS_DISCOUNT_UPDATE,
      this.__flashLimitDiscount,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ShopEvent.PAGE_SELECTED,
      this.onPageSelect,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ShopEvent.DISCOUNTSHOP_OPENSTATE,
      this.onDiscountShopOpenState,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ShopEvent.DISCOUNTSHOP_UPDATE,
      this.__updateDiscountRedDot,
      this,
    );
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  private setTabRechargeStyle() {
    if (this.tab_recharge) {
      let titleStr = LangManager.Instance.GetTranslation(
        "ShopWnd.tabRechargeTxt",
      );
      this.tab_recharge.title = this.getTitleNameStr(titleStr);
      this.tab_recharge.selectedTitle = this.getSelectTitleNameStr(titleStr);
      this.tab_recharge.icon = FUIHelper.getItemURL(
        EmPackName.Base,
        "Tab_Dia2Y2_Nor",
      );
      this.tab_recharge.selectedIcon = FUIHelper.getItemURL(
        EmPackName.Base,
        "Tab_Dia2Y2_Sel",
      );
    }
  }

  private getTitleNameStr(str: string): string {
    return `[size=24][color=#FFDC57][B]${str}[/B][/color][/size]`;
  }

  private getSelectTitleNameStr(titleStr: string): string {
    return `[size=24][color=#FFFAD6][B]${titleStr}[/B][/color][/size]`;
  }

  dispose(dispose?: boolean) {
    this.diamondShopView && this.diamondShopView.dispose();
    this.limitShopView && this.limitShopView.dispose();
    this.payView && this.payView.dispose();
    this.promotion && this.promotion.dispose();
    this.discountShopView && this.discountShopView.dispose();
    this.consortiaShopView && this.consortiaShopView.dispose();
    this.pvpShopView && this.pvpShopView.dispose();
    this.mazeShopView && this.mazeShopView.dispose();
    this.wishPoolView && this.wishPoolView.dispose();
    this.diamondShopView = null;
    this.limitShopView = null;
    this.payView = null;
    this.promotion = null;
    this.discountShopView = null;
    this.consortiaShopView = null;
    this.pvpShopView = null;
    this.mazeShopView = null;
    this.tabGroup = null;
    this.wishPoolView = null;
    super.dispose(dispose);
  }
}
