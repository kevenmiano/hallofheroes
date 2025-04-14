//@ts-expect-error: External dependencies
import FUI_PayView from "../../../../../../fui/Shop/FUI_PayView";
import LangManager from "../../../../../core/lang/LangManager";
import UIButton from "../../../../../core/ui/UIButton";
import UIManager from "../../../../../core/ui/UIManager";
import Utils from "../../../../../core/utils/Utils";
import { t_s_rechargeData } from "../../../../config/t_s_recharge";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import {
  NotificationEvent,
  ShopEvent,
  VIPEvent,
} from "../../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../../constant/UIDefine";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ConfigManager } from "../../../../manager/ConfigManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { VIPManager } from "../../../../manager/VIPManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { PayItem } from "./PayItem";
import { ChargeLotteryManager } from "../../../../manager/ChargeLotteryManager";
import FunnyType from "../../../funny/model/FunnyType";
import SDKManager from "../../../../../core/sdk/SDKManager";
import { isOversea } from "../../../login/manager/SiteZoneCtrl";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/22 17:47
 * @ver 1.0
 *
 */
export class PayView extends FUI_PayView {
  private _data: t_s_rechargeData[];
  private _helpBtn: UIButton;

  constructor() {
    super();
  }

  public init() {
    this.initData();
    this.initView();
    this.initEvent();
    this._helpBtn = new UIButton(this.helpBtn);
    Utils.setDrawCallOptimize(this.vipExpProgress);
    this.wartTips.visible = Utils.isQQHall();
  }

  public resetUI() {}

  private initData() {
    let datalist = TempleteManager.Instance.getRechargeTempletes();
    this._data = datalist;
  }

  private showUserVipExps() {
    this.vipLevel.text = VIPManager.Instance.model.vipInfo.VipGrade.toString();
    let userVipGrade = VIPManager.Instance.model.vipInfo.VipGrade; //玩家VIP等级
    let userVipGp = VIPManager.Instance.model.vipInfo.VipGp; //玩家VIP累计经验
    let currTempletes: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(userVipGrade, 4); //VIP升级配置
    let nextTempletes: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(userVipGrade + 1, 4); //VIP升级配置
    let upExp = 0;
    let nextExp = 0;
    if (nextTempletes) {
      //
      nextExp = nextTempletes.Data - currTempletes.Data;
      upExp = userVipGp - currTempletes.Data;
    } else {
      nextExp = currTempletes.Data;
      upExp = currTempletes.Data;
    }
    this.vipExpProgress.min = 0;
    this.vipExpProgress.max = nextExp;
    this.vipExpProgress.value = upExp;
    this.vipExpProgress.getChild("progress").text = upExp + "/" + nextExp;
    if (upExp < nextExp) {
      this.txt_vipexp.setVar("exp", (nextExp - upExp).toString()).flushVars();
      if (nextTempletes) {
        //
        this.txt_vipexp
          .setVar("nextlevel", (userVipGrade + 1).toString())
          .flushVars();
      } else {
        this.txt_vipexp
          .setVar("nextlevel", userVipGrade.toString())
          .flushVars();
      }
    } else {
      this.txt_vipexp.text = "";
    }
    let grayed = VIPManager.Instance.model.vipInfo.VipGrade <= 0;
    this.vipLevel.grayed = grayed;
    this.imgVipLv.grayed = grayed;
  }

  private initView() {
    this.showLottery.selectedIndex = ChargeLotteryManager.instance
      .openChargeLottery
      ? 1
      : 0;
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    // this.list.setVirtual();
    this.list.numItems = this._data.length;
    let grayed = VIPManager.Instance.model.vipInfo.VipGrade <= 0;
    this.vipLevel.grayed = grayed;
    this.imgVipLv.grayed = grayed;
    this.txt_uid.setVar("uid", "SFGDFGR484FE84841FGG4R85G").flushVars();
    //描述文本
    this.rTxtReward1.text = LangManager.Instance.GetTranslation(
      "vip.vipPrivilege.helptip",
    ); //VIP特权描述
    //玩家VIP经验
    this.showUserVipExps();
    this.__flashPrivilege();
    this.onSwitch();
  }

  private initEvent() {
    this.list.on(fgui.Events.CLICK_ITEM, this, this.onListItemClick);
    this.btn_service.onClick(this, this.onBtnServiceClick.bind(this));
    this.btn_vip.onClick(this, this.onBtnPrivilegeClick);
    this.helpBtn.onClick(this, this.onHelpBtnClick);
    this.btn_lottery.onClick(this, this.onLotteryBtnClick);
    VIPManager.Instance.addEventListener(
      VIPEvent.VIP_PRIVILEGE_UPDATE,
      this.__flashPrivilege,
      this,
    );
    VIPManager.Instance.addEventListener(
      VIPEvent.UPFRAMEVIEW_CHANGE,
      this.__onUpdateVipInfo,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CUSTOMER_SERVICE_SWITCH,
      this.onSwitch,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ShopEvent.PRODUCT_UPDATE_COUNT,
      this.onUpdateProduct,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CHARGELOTTERY_RESULT_UPDATE,
      this.onUpdateProduct,
      this,
    );
  }

  onUpdateProduct() {
    this.list.numItems = this._data.length;
  }

  onSwitch() {
    this.btn_service.visible = ConfigManager.info.CUSTOMER_SERVICE;
  }

  /**刷新玩家VIP信息 */
  __onUpdateVipInfo() {
    this.showUserVipExps();
  }

  /**
   * 刷新会员特权礼包展示状态
   */
  __flashPrivilege() {
    let effectState = VIPManager.Instance.vipGiftState;
    this.effectShow.selectedIndex = effectState ? 1 : 0;
    this.showUserVipExps();
  }

  private renderListItem(index: number, item: PayItem) {
    item.index = index + 1;
    item.info = this._data[index];
  }

  private onListItemClick(item: PayItem, e: Laya.Event) {
    if (item && !item.isDisposed) {
      RechargeAlertMannager.Instance.recharge(item.info.ProductId);
    }
  }

  /**
   * 打开客服
   * @param e
   */
  private onBtnServiceClick(e: Laya.Event) {
    let isCustomer = ConfigManager.info.COMPREHENSIVE_CUSTOMER;
    if (isCustomer) {
      let title: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "CustomerService.tip",
      );
      UIManager.Instance.ShowWind(EmWindow.Help, {
        title: title,
        content: content,
        callback: this.openCustomerServie.bind(this),
      });
    } else {
      this.openCustomerServie();
    }
  }

  private openCustomerServie() {
    if (isOversea()) {
      SDKManager.Instance.getChannel().openCustomerService();
    } else {
      UIManager.Instance.ShowWind(EmWindow.CustomerServiceWnd);
    }
  }

  /**VIP特权 */
  private onBtnPrivilegeClick() {
    FrameCtrlManager.Instance.open(
      EmWindow.VipPrivilege,
      { returnToWin: EmWindow.ShopWnd, returnToWinFrameData: { page: 7 } },
      null,
      EmWindow.ShopWnd,
    );
  }

  /**Vip帮助说明 */
  private _showingTip: boolean = false;

  onHelpBtnClick(evt?: any) {
    this._showingTip = !this._showingTip;
    this.helpTips.visible = this._showingTip;
    if (this._showingTip) {
      Laya.stage.on(Laya.Event.CLICK, this, this.onStageClick);
    } else {
      Laya.stage.off(Laya.Event.CLICK, this, this.onStageClick);
    }
    evt.stopPropagation();
  }

  onStageClick(evt: Laya.Event) {
    let sourceTarget = evt.target["$owner"];
    if (this._helpBtn.view == sourceTarget) {
      evt.stopPropagation();
      return;
    }
    if (this._showingTip) {
      this.onHelpBtnClick(evt);
    }
    evt.stopPropagation();
  }

  private onLotteryBtnClick() {
    FrameCtrlManager.Instance.open(
      EmWindow.Funny,
      {
        activityType: FunnyType.RECHARGE_LOTTERY,
        returnToWin: EmWindow.ShopWnd,
        returnToWinFrameData: { page: 7 },
      },
      null,
      EmWindow.ShopWnd,
    );
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private removeEvent() {
    this.list.off(fgui.Events.CLICK_ITEM, this, this.onListItemClick);
    this.btn_service.offClick(this, this.onBtnServiceClick.bind(this));
    this.btn_vip.offClick(this, this.onBtnPrivilegeClick);
    this._helpBtn && this._helpBtn.offClick(this, this.onHelpBtnClick);
    this.btn_lottery.offClick(this, this.onLotteryBtnClick);
    Laya.stage.off(Laya.Event.CLICK, this, this.onStageClick);
    VIPManager.Instance.removeEventListener(
      VIPEvent.VIP_PRIVILEGE_UPDATE,
      this.__flashPrivilege,
      this,
    );
    VIPManager.Instance.removeEventListener(
      VIPEvent.UPFRAMEVIEW_CHANGE,
      this.__onUpdateVipInfo,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CUSTOMER_SERVICE_SWITCH,
      this.onSwitch,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ShopEvent.PRODUCT_UPDATE_COUNT,
      this.onUpdateProduct,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CHARGELOTTERY_RESULT_UPDATE,
      this.onUpdateProduct,
      this,
    );
  }

  dispose(destroy = true) {
    this.removeEvent();
    this.list.itemRenderer && this.list.itemRenderer.recover();
    this.list.itemRenderer = null;
    this._data = null;
    destroy && super.dispose();
  }
}
