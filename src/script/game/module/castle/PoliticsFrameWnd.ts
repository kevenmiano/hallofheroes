//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { PlayerEffectInfo } from "../../datas/playerinfo/PlayerEffectInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { MasterTypes } from "../../map/castle/data/MasterTypes";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import UIButton from "../../../core/ui/UIButton";
import { BuildOrderEvent } from "../../constant/event/NotificationEvent";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import BuildingType from "../../map/castle/consant/BuildingType";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { VIPManager } from "../../manager/VIPManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import Logger from "../../../core/logger/Logger";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import ColorConstant from "../../constant/ColorConstant";
/**
 * 内政厅
 */
import QueueItem from "../home/QueueItem";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import AppellModel from "../appell/AppellModel";
import { MessageTipManager } from "../../manager/MessageTipManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { t_s_configData } from "../../config/t_s_config";
import { TempleteManager } from "../../manager/TempleteManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
export default class PoliticsFrameWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public n5Txt: fgui.GTextField;
  public n6Txt: fgui.GTextField;
  public n7Txt: fgui.GTextField;
  public LvTxt: fgui.GTextField;
  public politicsTitle: fgui.GTextField;
  public CurrentValueTxt: fgui.GTextField;
  public ResourceValueTxt: fgui.GTextField;
  public TimeValueTxt: fgui.GTextField;
  public n13Txt: fgui.GTextField;
  public n14Txt: fgui.GTextField;
  public n15Txt: fgui.GTextField;
  public LevyValueTxt: fgui.GTextField;
  public LevyGoldValueTxt: fgui.GTextField;
  public ReduceTimeValueTxt: fgui.GTextField;
  public Btn_Reduce: UIButton;
  public BtnLevy: UIButton;
  public BtnLevy_ex: UIButton;
  public BtnUpGrade: UIButton;
  public NextValueTxt: fgui.GTextField;
  public helpBtn: fgui.GButton;
  private _data: BuildInfo; //建筑数据
  public timeDescTxt1: fgui.GTextField;
  public timeDescTxt2: fgui.GTextField;
  public timeGroup: fgui.GGroup;
  private _vData1: BuildingOrderInfo;
  private _vData2: BuildingOrderInfo;
  public openVIpDescTxt: fgui.GTextField;
  public vipSpeedTxt: fgui.GTextField;
  private isVIP: fgui.Controller;
  private ex: fgui.Controller;
  public tipItem1: BaseTipItem;
  public tipItem2: BaseTipItem;
  public tipItem3: BaseTipItem;
  public tipItem4: BaseTipItem;
  public tipItem_ex: BaseTipItem;
  public LevyValueTxt_ex: fgui.GTextField;
  private _inner_Levy: string[] = ["20", "40", "60", "80", "100", "120"]; //20,40,60,80,100,120   【内城】单日额外征收次数及每次增加征收次数消耗钻石数
  public btn1: fgui.GButton;
  public btn2: fgui.GButton;
  private back: Function;
  private cfgOrderValue: number = 1;
  public OnInitWind() {
    super.OnInitWind();

    let configInfo: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName("Inner_Levy");
    if (configInfo && configInfo.ConfigValue) {
      this._inner_Levy = configInfo.ConfigValue.split(",");
    }
    this.isVIP = this.getController("isVIP");
    this.ex = this.getController("ex");
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "PoliticsFrameWnd.title",
    );
    this.politicsTitle.text = LangManager.Instance.GetTranslation(
      "PoliticsFrameWnd.title",
    );
    this.n5Txt.text = LangManager.Instance.GetTranslation(
      "ResidenceFrameWnd.n5Txt",
    );
    this.n6Txt.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needResourceTxt",
    );
    this.n7Txt.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needTimeTxt",
    );
    this.n13Txt.text = LangManager.Instance.GetTranslation(
      "PoliticsFrameWnd.n13Txt",
    );
    this.n14Txt.text = LangManager.Instance.GetTranslation(
      "PoliticsFrameWnd.n14Txt",
    );
    this.n15Txt.text = LangManager.Instance.GetTranslation(
      "PoliticsFrameWnd.n15Txt",
    );
    this.helpBtn.visible = false;
    let grade = VIPManager.Instance.model.vipInfo.VipGrade;
    if (
      VIPManager.Instance.model.isOpenPrivilege(
        VipPrivilegeType.COLD_QUEUE,
        grade,
      )
    ) {
      this.timeGroup.visible = false;
      this.openVIpDescTxt.visible = true;
    } else {
      this.timeGroup.visible = true;
      this.openVIpDescTxt.visible = false;
    }
    let isOpenVip = VIPManager.Instance.model.isOpenPrivilege(
      VipPrivilegeType.BUILD_COOLDOWN,
      grade,
    );
    this.isVIP.selectedIndex = isOpenVip ? 1 : 0;
    this.vipSpeedTxt.color = AppellModel.getTextColorAB(1);
    this.addEvent();
    this.setCenter();
    this.BtnLevy.enabled = false;
    this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem3.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem4.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem_ex.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
    let cfgItemOrder =
      TempleteManager.Instance.getConfigInfoByConfigName("QuickenOrder_Price");
    if (cfgItemOrder) {
      //冷却
      this.cfgOrderValue = Number(cfgItemOrder.ConfigValue);
    }
    this.back = BuildingManager.Instance.allCoolBack;
  }

  OnShowWind() {
    super.OnShowWind();
    this._data = this.params;
    this.refreshView();
    this.updateView();
    this.refrehBottom();
  }

  private addEvent() {
    this.BtnUpGrade.onClick(this, this.__upgradeClickHandler.bind(this));
    BuildingManager.Instance.addEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__upgradeBuildingReceive,
      this,
    );
    this.BtnLevy.onClick(this, this.__levyHandler.bind(this));
    this.BtnLevy_ex.onClick(this, this.__levyExHandler.bind(this));
    BuildingManager.Instance.addEventListener(
      BuildOrderEvent.COLL_ONE_ORDER,
      this.__orderChangeHandler,
      this,
    );
    BuildingManager.Instance.addEventListener(
      BuildingEvent.U_C_GOLD_IMPOSERESULT,
      this.__changeHandler,
      this,
    );
    if (this.order) {
      this.order.addEventListener(
        Laya.Event.COMPLETE,
        this.__completeHandler,
        this,
      );
      this.order.addEventListener(Laya.Event.CHANGE, this.updateView, this);
    }
    this.Btn_Reduce.onClick(this, this.__reduceClickHandler.bind(this));
    if (this.timeGroup.visible) this.initQuestEvent();
    this.btn1.onClick(this, this.onCoolHandler1);
    this.btn2.onClick(this, this.onCoolHandler2);
  }

  private removeEvent() {
    this.BtnUpGrade.offClick(this, this.__upgradeClickHandler.bind(this));
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__upgradeBuildingReceive,
      this,
    );
    this.BtnLevy.offClick(this, this.__levyHandler.bind(this));
    this.BtnLevy_ex.offClick(this, this.__levyExHandler.bind(this));
    BuildingManager.Instance.removeEventListener(
      BuildOrderEvent.COLL_ONE_ORDER,
      this.__orderChangeHandler,
      this,
    );
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.U_C_GOLD_IMPOSERESULT,
      this.__changeHandler,
      this,
    );
    if (this.order) {
      this.order.removeEventListener(
        Laya.Event.COMPLETE,
        this.__completeHandler,
        this,
      );
      this.order.removeEventListener(Laya.Event.CHANGE, this.updateView, this);
    }
    this.Btn_Reduce.offClick(this, this.__reduceClickHandler.bind(this));
    if (this.timeGroup.visible) this.removeQuestEvent();
    this.btn1.offClick(this, this.onCoolHandler1);
    this.btn2.offClick(this, this.onCoolHandler2);
  }

  private initQuestEvent() {
    let buildOrderList: Array<BuildingOrderInfo> =
      BuildingManager.Instance.model.buildOrderList;
    for (let i: number = 0; i < buildOrderList.length; i++) {
      if (i == 0) {
        this._vData1 = buildOrderList[i];
        this._vData1.addEventListener(
          Laya.Event.COMPLETE,
          this.buildOrderCompleteHandler,
          this,
        );
        this._vData1.addEventListener(
          Laya.Event.CHANGE,
          this.__changeHandler1,
          this,
        );
        this.__changeHandler1();
      } else if (i == 1) {
        this._vData2 = buildOrderList[i];
        this._vData2.addEventListener(
          Laya.Event.COMPLETE,
          this.buildOrderCompleteHandler,
          this,
        );
        this._vData2.addEventListener(
          Laya.Event.CHANGE,
          this.__changeHandler2,
          this,
        );
        this.__changeHandler2();
      }
    }
  }

  private removeQuestEvent() {
    let buildOrderList: Array<BuildingOrderInfo> =
      BuildingManager.Instance.model.buildOrderList;
    for (let i: number = 0; i < buildOrderList.length; i++) {
      if (i == 0) {
        this._vData1 = buildOrderList[i];
        this._vData1.removeEventListener(
          Laya.Event.COMPLETE,
          this.buildOrderCompleteHandler,
          this,
        );
        this._vData1.removeEventListener(
          Laya.Event.CHANGE,
          this.__changeHandler1,
          this,
        );
      } else if (i == 1) {
        this._vData2 = buildOrderList[i];
        this._vData2.removeEventListener(
          Laya.Event.COMPLETE,
          this.buildOrderCompleteHandler,
          this,
        );
        this._vData2.removeEventListener(
          Laya.Event.CHANGE,
          this.__changeHandler2,
          this,
        );
      }
    }
  }

  private buildOrderCompleteHandler() {
    BuildingManager.Instance.upgradeOrderList();
  }

  private __changeHandler1() {
    this.updateBuilderOrderTxt(this._vData1, 1);
  }

  private __changeHandler2() {
    this.updateBuilderOrderTxt(this._vData2, 2);
  }

  protected updateBuilderOrderTxt(vData: BuildingOrderInfo, tyep: number = 1) {
    var txt1: string = LangManager.Instance.GetTranslation(
      "mainBar.view.QueueItem.BUILD",
    );
    var txt2: string = LangManager.Instance.GetTranslation(
      "mainBar.view.QueueItem.BUILD2",
    );
    if (tyep == 1) {
      if (vData && parseInt(vData.remainTime.toString()) <= 0) {
        //剩余时间小于0
        this.timeDescTxt1.color = ColorConstant.GREEN_COLOR;
        this.timeDescTxt1.text = txt1;
        this.btn1.visible = false;
      } else {
        this.timeDescTxt1.color = ColorConstant.RED_COLOR;
        this.timeDescTxt1.text =
          txt2 + ":" + DateFormatter.getCountDate(vData.remainTime);
        this.btn1.visible = true;
      }
    } else if (tyep == 2) {
      if (vData && parseInt(vData.remainTime.toString()) <= 0) {
        //剩余时间小于0
        this.timeDescTxt2.color = ColorConstant.GREEN_COLOR;
        this.timeDescTxt2.text = txt1;
        this.btn2.visible = false;
      } else {
        this.timeDescTxt2.color = ColorConstant.RED_COLOR;
        this.timeDescTxt2.text =
          txt2 + ":" + DateFormatter.getCountDate(vData.remainTime);
        this.btn2.visible = true;
      }
    }
  }

  private __levyHandler() {
    PlayerManager.Instance.sendLevy(0);
  }

  private get todayNeedAlertForLevyEx(): boolean {
    let needAlert: boolean = true;
    let lastSaveDate: Date = BuildingManager.Instance.levyExAlertDate;
    if (lastSaveDate) {
      let today: Date = new Date();
      if (
        today.getFullYear() == lastSaveDate.getFullYear() &&
        today.getMonth() == lastSaveDate.getMonth() &&
        today.getDate() == lastSaveDate.getDate()
      ) {
        needAlert = false;
      }
    }
    return needAlert;
  }

  private needPoint: number = 0;
  private showAlertForLevyEx() {
    let info: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      BuildingType.OFFICEAFFAIRS,
    );
    let maxLevy: number = this._inner_Levy.length;
    let leftTimes: number = maxLevy - info.payImpose;
    this.needPoint = parseInt(this._inner_Levy[info.payImpose]);
    let content: string = LangManager.Instance.GetTranslation(
      "fashion.view.compose.notEnoughLuckyCharm3",
      this.needPoint,
      leftTimes,
    );
    UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
      content: content,
      backFunction: this.alertCallback.bind(this),
      state: 0,
    });
  }

  private alertCallback(notAlert: boolean, useBind: boolean) {
    let hasMoney =
      PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
    if (this.needPoint > hasMoney) {
      this.hide();
      RechargeAlertMannager.Instance.show();
      return;
    }
    BuildingManager.Instance.levyExUseBind = useBind;
    if (notAlert) {
      BuildingManager.Instance.levyExAlertDate = new Date();
    }

    if (!BuildingManager.Instance.levyExUseBind) {
      PlayerManager.Instance.sendLevy(1, 2);
    } else {
      PlayerManager.Instance.sendLevy(1, 1);
    }
  }

  private __levyExHandler() {
    let info: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      BuildingType.OFFICEAFFAIRS,
    );
    let maxLevy: number = this._inner_Levy.length;
    let leftTimes: number = maxLevy - info.payImpose;
    if (leftTimes <= 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "fashion.view.compose.notEnoughLuckyCharm4",
        ),
      );
      return;
    }

    if (this.todayNeedAlertForLevyEx) {
      this.showAlertForLevyEx();
    } else {
      if (!BuildingManager.Instance.levyExUseBind) {
        PlayerManager.Instance.sendLevy(1, 2);
      } else {
        PlayerManager.Instance.sendLevy(1, 1);
      }
    }
  }

  private __orderChangeHandler(data: BuildingOrderInfo) {
    if (data == this.order) {
      this.refrehBottom();
    }
  }

  private __changeHandler(e: BuildingEvent) {
    this.refrehBottom();
  }

  private __completeHandler() {
    BuildingManager.Instance.upgradeOrderList();
  }

  private refrehBottom() {
    var info: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      BuildingType.OFFICEAFFAIRS,
    );
    if (info && this.order) {
      if (info.property2 - info.property1 <= 0) {
        this.ex.selectedIndex = 1;
        this.LevyValueTxt_ex.text = this._inner_Levy[info.payImpose];
        this.n13Txt.text = LangManager.Instance.GetTranslation(
          "PoliticsFrameWnd.n13Txt1",
        );
        this.LevyValueTxt.text =
          this._inner_Levy.length -
          info.payImpose +
          " / " +
          this._inner_Levy.length;
        if (this._inner_Levy.length - info.payImpose < 1)
          this.tipItem_ex.visible = false;
        if (
          BuildingManager.Instance.levyExUseBind &&
          !this.todayNeedAlertForLevyEx
        ) {
          this.tipItem_ex.setInfo(TemplateIDConstant.TEMP_ID_GIFT);
        } else {
          this.tipItem_ex.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
        }
      } else {
        this.ex.selectedIndex = 0;
        this.n13Txt.text = LangManager.Instance.GetTranslation(
          "PoliticsFrameWnd.n13Txt",
        );
        this.LevyValueTxt.text =
          info.property2 - info.property1 + " / " + info.property2;
      }
      this.BtnLevy.enabled =
        info.property2 - info.property1 > 0 &&
        this.order.remainTime <= 0 &&
        this.thane.grades >= 14;
      this.n15Txt.visible = this.ReduceTimeValueTxt.visible = true;
      if (parseInt(this.order.remainTime.toString()) <= 0) {
        this.Btn_Reduce.visible = false;
      } else {
        this.Btn_Reduce.visible = true;
      }
    } else {
      this.n15Txt.visible =
        this.ReduceTimeValueTxt.visible =
        this.Btn_Reduce.visible =
          false;
    }
    var gold: number = info.templeteInfo.Property1 * 6;
    var crystalBuildingInfo: BuildInfo =
      BuildingManager.Instance.getBuildingInfoBySonType(
        BuildingType.CRYSTALFURNACE,
      );
    if (crystalBuildingInfo)
      gold += crystalBuildingInfo.templeteInfo.Property1 * 3;
    if (this.thane.grades >= 14) this.LevyGoldValueTxt.text = gold.toString();
    else this.LevyGoldValueTxt.text = "0";
  }

  private updateView() {
    var txt1: string = LangManager.Instance.GetTranslation(
      "buildings.politics.view.update",
    );
    var txt2: string = LangManager.Instance.GetTranslation(
      "buildings.politics.view.update2",
    );
    this.updateTxt(txt1, txt2);
  }

  protected updateTxt(str1: string, str2: string) {
    if (this.order && parseInt(this.order.remainTime.toString()) <= 0) {
      this.Btn_Reduce.visible = false;
      this.n15Txt.text = str1;
      this.ReduceTimeValueTxt.color = "##FFC68F";
      this.ReduceTimeValueTxt.text = "";
    } else {
      if (this.order) {
        this.ReduceTimeValueTxt.text = DateFormatter.getCountDate(
          this.order.remainTime,
        );
        this.Btn_Reduce.visible = true;
        this.n15Txt.text = str2;
        this.ReduceTimeValueTxt.color = "#00F0FF";
      } else {
        this.ReduceTimeValueTxt.text = "";
        this.Btn_Reduce.visible = false;
        this.n15Txt.text = "";
        this.ReduceTimeValueTxt.color = "#00F0FF";
        Logger.error(
          "还没有冷却队列, 账号数据问题 LoginInitDataAccept __loadBuildOrderHandler 不存在orderType==3的情况",
        );
      }
    }
  }

  private __upgradeClickHandler() {
    if (BuildingManager.Instance.isUpgradeAvaliable(this._data)) {
      if (BuildingManager.Instance.checkBuildList(this._data)) {
        BuildingManager.Instance.upgradeBuildingByBuildingInfo(this._data);
      }
    }
  }

  private __reduceClickHandler() {
    let back: Function;
    if (this.order.remainTime > 0) {
      back = BuildingManager.Instance.allCoolBack;
      var point: number = Math.ceil(this.order.remainTime / 600);
      if (VIPManager.Instance.model.vipCoolPrivilege) {
        back(true, this.order.orderId);
      } else {
        UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
          type: QueueItem.QUEUE_TYPE_COLOSSEUM,
          orderId: this.order.orderId,
          pointNum: point,
          backFun: back.bind(BuildingManager.Instance),
        });
      }
    }
  }

  protected __upgradeBuildingReceive(info: BuildInfo) {
    this.refreshView();
    this.refrehBottom();
    var btemp: t_s_buildingtemplateData = info.templeteInfo;
    if (
      btemp.MasterType == MasterTypes.MT_INTERNALTECHNOLOGY ||
      btemp.MasterType == MasterTypes.MT_WARTECHNOLOGY
    ) {
      return;
    }
  }

  private refreshView() {
    var nextTemp: t_s_buildingtemplateData = this._data.nextTemplateInfo;
    this.LvTxt.text = LangManager.Instance.GetTranslation(
      "public.level2",
      this._data.templeteInfo.BuildingGrade,
    );
    var currentTemp: t_s_buildingtemplateData = this._data.templeteInfo;
    this.CurrentValueTxt.text = currentTemp.ActivityLang;
    if (nextTemp) {
      this.ResourceValueTxt.text = this._data
        .getNextNeedResource(nextTemp)
        ["GoldConsume"].toString();
      this.tipItem4.visible = true;
      var time: number = parseInt(
        this.playerEffect
          .getBuildTimeAdditionValue(nextTemp.UpgradeTime)
          .toString(),
      );
      let grade = VIPManager.Instance.model.vipInfo.VipGrade;
      let param1 = VIPManager.Instance.model.getPrivilegeParam1ByGrade(
        VipPrivilegeType.BUILD_COOLDOWN,
        grade,
      );
      let value = time - param1 > 0 ? time - param1 : 0;
      this.TimeValueTxt.text = DateFormatter.getCountDate(value);
      this.TimeValueTxt.visible = true;
      this.NextValueTxt.text = nextTemp.ActivityLang;
      this.NextValueTxt.color = "#71F000";
    } else {
      this.n6Txt.text = "";
      this.n7Txt.text = "";
      this.ResourceValueTxt.text = "";
      this.TimeValueTxt.text = "";
      this.tipItem4.visible = false;
      this.NextValueTxt.text = LangManager.Instance.GetTranslation(
        "buildings.BaseBuildFrame.maxGrade",
      );
      this.NextValueTxt.color = "#FF0000";
    }
    if (BuildingManager.Instance.checkIsMaxLevel(this._data)) {
      this.BtnUpGrade.enabled = false;
    }
  }

  private onCoolHandler1() {
    let point = this.cfgOrderValue * Math.ceil(this._vData1.remainTime / 600);
    if (VIPManager.Instance.model.vipCoolPrivilege) {
      this.back(true, this._vData1.orderId);
    } else {
      UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
        type: QueueItem.QUEUE_TYPE_BUILD,
        orderId: this._vData1.orderId,
        pointNum: point,
        backFun: this.back.bind(BuildingManager.Instance),
      });
    }
  }

  private onCoolHandler2() {
    let point = this.cfgOrderValue * Math.ceil(this._vData2.remainTime / 600);
    if (VIPManager.Instance.model.vipCoolPrivilege) {
      this.back(true, this._vData2.orderId);
    } else {
      UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
        type: QueueItem.QUEUE_TYPE_BUILD,
        orderId: this._vData2.orderId,
        pointNum: point,
        backFun: this.back.bind(BuildingManager.Instance),
      });
    }
  }

  private get playerEffect(): PlayerEffectInfo {
    return PlayerManager.Instance.currentPlayerModel.playerEffect;
  }

  private get order(): BuildingOrderInfo {
    return BuildingManager.Instance.model.alchemyOrderList[0];
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    this.removeSelf();
  }
}
