import LangManager from "../../core/lang/LangManager";
import BaseChannel from "../../core/sdk/base/BaseChannel";
import SDKManager from "../../core/sdk/SDKManager";
import SimpleAlertHelper, {
  AlertBtnType,
} from "../component/SimpleAlertHelper";
import { t_s_rechargeData } from "../config/t_s_recharge";
import {
  NotificationEvent,
  ShopEvent,
} from "../constant/event/NotificationEvent";
import { EmWindow } from "../constant/UIDefine";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import ComponentSetting from "../utils/ComponentSetting";
import { NotificationManager } from "./NotificationManager";
import { PathManager } from "./PathManager";
import { PlayerManager } from "./PlayerManager";
import { ShopManager } from "./ShopManager";
import { TempleteManager } from "./TempleteManager";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import ProductType from "../constant/ProductType";
import { MessageTipManager } from "./MessageTipManager";
import Utils from "../../core/utils/Utils";
import { ConfigManager } from "./ConfigManager";
import DisplayLoader from "../utils/DisplayLoader";
import { GameEventCode, GameEventString } from "../constant/GameEventCode";
import { SharedManager } from "./SharedManager";
import { LoginWay } from "../constant/LoginWay";
import Logger from "../../core/logger/Logger";
import { isOversea } from "../module/login/manager/SiteZoneCtrl";

/**
 * @author:pzlricky
 * @data: 2021-06-29 15:03
 * @description 充值
 */
export default class RechargeAlertMannager extends GameEventDispatcher {
  private static _instance: RechargeAlertMannager;

  public static get Instance(): RechargeAlertMannager {
    if (!this._instance) {
      this._instance = new RechargeAlertMannager();
      this._instance.setup();
    }
    return this._instance;
  }

  setup() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CHARGE_ORDER_RSP,
      this.startToRecharge,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SHOW_RECHARGE,
      this.showRecharge,
      this,
    );
  }

  private showRecharge() {
    this.show();
  }

  public show(closeFun: Function = null) {
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let content: string = LangManager.Instance.GetTranslation(
      "yishi.manager.RechargeAlertMannager.content",
    );
    if (Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION) {
      content = LangManager.Instance.GetTranslation("Auction.ResultAlert11");
    }
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      (b: boolean, flag: boolean, arr: any[]) => {
        if (b && !(Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION)) {
          if (FrameCtrlManager.Instance.isOpen(EmWindow.ShopWnd)) {
            NotificationManager.Instance.dispatchEvent(
              ShopEvent.PAGE_SELECTED,
              7,
            );
          } else {
            RechargeAlertMannager.Instance.openShopRecharge();
          }
          closeFun && closeFun();
        }
      },
    );
  }

  public navigateToRechargePage() {
    let url: string;
    if (ComponentSetting.SITE && ComponentSetting.SITE.slice(0, 5) == "7road") {
      let site: string =
        PlayerManager.Instance.currentPlayerModel.userInfo.site;
      let user: string =
        PlayerManager.Instance.currentPlayerModel.userInfo.user;
      url = PathManager.info.PAY + "&site=" + site + "&uid=" + user;
      Laya.Browser.window.open(url); //开新的窗口打开
    } else {
      url = PathManager.info.PAY;
      Laya.Browser.window.open(url); //开新的窗口打开
    }
  }

  private showWaiting() {
    FrameCtrlManager.Instance.open(EmWindow.Waiting, {
      text: LangManager.Instance.GetTranslation("shop.common.recharge"),
    });
    Laya.stage.timerOnce(10000, this, this.hideWaiting);
  }

  private hideWaiting() {
    FrameCtrlManager.Instance.exit(EmWindow.Waiting);
  }

  private onConfirmBindAccount(b: boolean) {
    if (b) {
      SDKManager.Instance.getChannel()
        .bindAccount(LoginWay.Type_7ROAD)
        .then((result) => {
          Logger.error("onUpgradeAccount---result:", result);
          var prompt: string =
            LangManager.Instance.GetTranslation("public.prompt");
          var confirm1: string =
            LangManager.Instance.GetTranslation("public.confirm");
          var cancel1: string =
            LangManager.Instance.GetTranslation("public.cancel");
          let msg = "";
          if (result > 0) {
            msg = LangManager.Instance.GetTranslation(
              "UpgradeAccountWnd.bindAccountRet1",
            );
            SimpleAlertHelper.Instance.Show(
              SimpleAlertHelper.SIMPLE_ALERT,
              null,
              prompt,
              msg,
              confirm1,
              cancel1,
              (ok: boolean, v2: boolean) => {
                if (ok) {
                  SharedManager.Instance.setWindowItem(
                    "bindAccountRet",
                    "true",
                  );
                  SDKManager.Instance.getChannel().logout(true);
                  SDKManager.Instance.getChannel().reload();
                }
              },
              AlertBtnType.O,
              false,
              true,
            );
          } else {
            msg = LangManager.Instance.GetTranslation(
              "UpgradeAccountWnd.bindAccountRet0",
            );
            MessageTipManager.Instance.show(msg);
          }
        });
    }
  }

  private hasRequestProduct: boolean = false;
  private rechargeIntervalState: boolean = false;
  /**
   * 调用充值
   * */
  public recharge(productId: string = "", count: number = 1) {
    let loginWay = SharedManager.Instance.getWindowItem("loginWay");
    if (
      isOversea() &&
      Utils.isApp() &&
      Number(loginWay) == LoginWay.Type_GUEST
    ) {
      SDKManager.Instance.getChannel()
        .checkBindState()
        .then((ret: Array<any>) => {
          Logger.yyz("checkBindState:", ret);
          if (ret && ret.length > 0) {
            var prompt: string =
              LangManager.Instance.GetTranslation("public.prompt");
            var confirm1: string =
              LangManager.Instance.GetTranslation("public.confirm");
            var cancel1: string =
              LangManager.Instance.GetTranslation("public.cancel");
            let msg = LangManager.Instance.GetTranslation(
              "UpgradeAccountWnd.bindAccountRechargeReloadTips",
            );
            SimpleAlertHelper.Instance.Show(
              SimpleAlertHelper.SIMPLE_ALERT,
              null,
              prompt,
              msg,
              confirm1,
              cancel1,
              (ok: boolean, v2: boolean) => {
                if (ok) {
                  SharedManager.Instance.setWindowItem(
                    "bindAccountRet",
                    "true",
                  );
                  SDKManager.Instance.getChannel().logout(true);
                  SDKManager.Instance.getChannel().reload();
                  return;
                }
              },
              AlertBtnType.O,
              false,
              true,
            );
            return;
          } else {
            var confirm: string =
              LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string =
              LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string =
              LangManager.Instance.GetTranslation("BuyFrameI.tip01");
            var content: string = LangManager.Instance.GetTranslation(
              "UpgradeAccountWnd.bindAccountRechargeSafeTips",
            );
            SimpleAlertHelper.Instance.Show(
              SimpleAlertHelper.SIMPLE_ALERT,
              null,
              prompt,
              content,
              confirm,
              cancel,
              this.onConfirmBindAccount.bind(this),
            );
            return;
          }
        });
      return;
    }
    //小游戏平台判断
    if (!this.checkRecharge()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("public.notsurrpot.pay"),
      );
      return;
    }
    if (productId == "") {
      return;
    } else if (DisplayLoader.isDebug) {
      //debug端跳转链接
      this.showWaiting();
      let url: string = PathManager.info.PAY;
      Laya.Browser.window.open(url); //开新的窗口打开
    } else {
      if (this.hasRequestProduct || this.rechargeIntervalState) {
        return;
      }
      this.showWaiting();
      this.hasRequestProduct = true;
      this.rechargeIntervalState = true;
      Laya.timer.once(1500, this, () => {
        this.rechargeIntervalState = false;
        this.hasRequestProduct = false;
      });
      ShopManager.Instance.requestChargeOrderId(productId, count);
    }
  }

  private checkRecharge(): boolean {
    if (Utils.isWxMiniGame() && Laya.Browser.onIOS) {
      return ConfigManager.info.MINI_GAME_PAY;
    }
    if (Utils.isIOS() && Laya.Browser.onIOS) {
      return ConfigManager.info.IOS_PAY;
    }
    return true;
  }

  /**打开充值 */
  public startToRecharge(orderId: string, productId: string) {
    this.hideWaiting();
    let channel2: BaseChannel = SDKManager.Instance.getChannel();
    let selectedItemData: t_s_rechargeData =
      TempleteManager.Instance.getRechargeTempleteByProductID(productId);
    if (!selectedItemData) return;
    SDKManager.Instance.getChannel().postGameEvent(
      GameEventCode.Code_9999,
      JSON.stringify({ eventToken: GameEventString.view_purchase_ui }),
    );
    if (selectedItemData.ProductType == ProductType.GROWTH_RECHARGE) {
      //成长基金

      channel2.pay(
        0 /*selectedItemData.ProductType*/,
        orderId,
        productId,
        productId,
        selectedItemData.ProductName,
        selectedItemData.ProductDesc,
        selectedItemData.MoneyNum.toString(),
        Number(selectedItemData.Para1),
        "",
        1,
        selectedItemData.MoneyType,
        "钻石",
        "",
      );
    } else if (
      selectedItemData.ProductType == ProductType.PROMOTION ||
      selectedItemData.ProductType == ProductType.PROMOTION_WEEK
    ) {
      //特惠礼包
      channel2.pay(
        0 /*selectedItemData.ProductType*/,
        orderId,
        productId,
        productId,
        selectedItemData.ProductName,
        selectedItemData.ProductDesc,
        selectedItemData.MoneyNum.toString(),
        Number(0),
        "",
        1,
        selectedItemData.MoneyType,
        "钻石",
        "",
      );
    } else {
      //其他
      channel2.pay(
        0 /*selectedItemData.ProductType*/,
        orderId,
        productId,
        productId,
        selectedItemData.ProductName,
        selectedItemData.ProductDesc,
        selectedItemData.MoneyNum.toString(),
        Number(selectedItemData.Para2),
        "",
        1,
        selectedItemData.MoneyType,
        "钻石",
        "",
      );
    }
    this.hasRequestProduct = false; //调用接口后重置请求
  }

  /**
   * 打开商城页签,默认7充值
   * @param page tab页签
   */
  public openShopRecharge(page: number = 7) {
    FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: page });
  }
}
