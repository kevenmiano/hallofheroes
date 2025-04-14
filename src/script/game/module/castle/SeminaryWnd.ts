import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { TechnologyItemEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { NotificationManager } from "../../manager/NotificationManager";
import { VIPManager } from "../../manager/VIPManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { MasterTypes } from "../../map/castle/data/MasterTypes";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import SeminaryItem from "./SeminaryItem";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { PlayerEffectInfo } from "../../datas/playerinfo/PlayerEffectInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import Logger from "../../../core/logger/Logger";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import ColorConstant from "../../constant/ColorConstant";
import Utils from "../../../core/utils/Utils";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import AppellModel from "../appell/AppellModel";
import { MessageTipManager } from "../../manager/MessageTipManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { ArmyManager } from "../../manager/ArmyManager";
import { TempleteManager } from "../../manager/TempleteManager";
import QueueItem from "../home/QueueItem";

/**
 * 神学院
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2021-04-26 15:24
 */
export default class SeminaryWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public n3Txt: fgui.GTextField;
  public n4Txt: fgui.GTextField;
  public n5Txt: fgui.GTextField;
  public LvTxt: fgui.GTextField;
  public MaxValueTxt: fgui.GTextField;
  public CurrentValueTxt: fgui.GTextField;
  public TimeValueTxt: fgui.GTextField;
  public n15Txt: fgui.GTextField;
  public ReduceTimeValueTxt: fgui.GTextField;
  public Btn_upgrade: UIButton;
  public Btn_Reduce: UIButton;
  public itemList: fgui.GList = null;
  private _data: BuildInfo;
  public timeDescTxt1: fgui.GTextField;
  public timeDescTxt2: fgui.GTextField;
  public timeGroup: fgui.GGroup;
  private _vData1: BuildingOrderInfo;
  private _vData2: BuildingOrderInfo;
  public openVIpDescTxt: fgui.GTextField;
  public vipSpeedTxt: fgui.GTextField;
  private isVIP: fgui.Controller;
  private _itemList: BuildInfo[] = [];
  private _itemList1: BuildInfo[] = [];
  private _itemList2: BuildInfo[] = [];
  public tab: fgui.Controller;
  public primaryBtn: fgui.GButton;
  public advanceBtn: fgui.GButton;
  public tipItem: BaseTipItem;
  public btn1: fgui.GButton;
  public btn2: fgui.GButton;
  private back: Function;
  private cfgOrderValue: number = 1;
  public OnInitWind() {
    super.OnInitWind();
    this.isVIP = this.getController("isVIP");
    this.tab = this.getController("tab");
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "HigherGradeOpenTipView.content10",
    );
    this.n3Txt.text = LangManager.Instance.GetTranslation(
      "HigherGradeOpenTipView.content10",
    );
    this.n4Txt.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needResourceTxt",
    );
    this.n5Txt.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needTimeTxt",
    );
    Utils.setDrawCallOptimize(this.itemList);
    this.itemList.setVirtual();
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.initData();
    this.tab.selectedIndex = 0;
    this.onTabChanged();
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
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
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
    this.initBuindInfo();
    this.updateView();
    if (this._data.templeteInfo && this._data.templeteInfo.BuildingGrade < 50) {
      this.advanceBtn.visible = false;
    } else {
      this.advanceBtn.visible = true;
    }
    this.itemList.numItems = this._itemList.length;
    this.itemList.selectionMode = fgui.ListSelectionMode.None;
  }

  private renderListItem(index: number, item: SeminaryItem) {
    item.vdata = this._itemList[index];
  }

  private addEvent() {
    this.Btn_upgrade.onClick(this, this.__upgradeClickHandler.bind(this));
    this.Btn_Reduce.onClick(this, this.__reduceClickHandler.bind(this));
    BuildingManager.Instance.addEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__technologyUpdateHandler,
      this,
    );
    BuildingManager.Instance.addEventListener(
      BuildingEvent.CREATE_NEW_BUILDING,
      this.__createNewTechItemHandler,
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
    if (this.timeGroup.visible) this.initQuestEvent();
    this.tab.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    this.btn1.onClick(this, this.onCoolHandler1);
    this.btn2.onClick(this, this.onCoolHandler2);
  }

  private removeEvent() {
    this.Btn_upgrade.offClick(this, this.__upgradeClickHandler.bind(this));
    this.Btn_Reduce.offClick(this, this.__reduceClickHandler.bind(this));
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__technologyUpdateHandler,
      this,
    );
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.CREATE_NEW_BUILDING,
      this.__createNewTechItemHandler,
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
    if (this.timeGroup.visible) this.removeQuestEvent();
    this.tab.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    this.btn1.offClick(this, this.onCoolHandler1);
    this.btn2.offClick(this, this.onCoolHandler2);
  }

  private onTabChanged() {
    if (this.tab.selectedIndex == 0) {
      this._itemList = this._itemList1;
    } else if (this.tab.selectedIndex == 1) {
      if (ArmyManager.Instance.thane.grades < 50) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("SeminaryWnd.tabTips"),
        );
        this.tab.selectedIndex = 0;
        this._itemList = this._itemList1;
        return;
      }
      this._itemList = this._itemList2;
    }
    this.itemList.numItems = this._itemList.length;
    this.itemList.scrollToView(0, true); //切换Tab默认第0个
  }

  private initQuestEvent() {
    let buildOrderList: Array<BuildingOrderInfo> =
      BuildingManager.Instance.model.buildOrderList;
    for (let i: number = 0; i < buildOrderList.length; i++) {
      if (i == 0) {
        this._vData1 = buildOrderList[i];
        this._vData1.addEventListener(
          Laya.Event.COMPLETE,
          this.__completeHandler,
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
          this.__completeHandler,
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
          this.__completeHandler,
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
          this.__completeHandler,
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
          "还没有科技队列, 账号数据问题 LoginInitDataAccept __loadBuildOrderHandler 不存在orderType==2的情况",
        );
      }
    }
  }

  private initData() {
    this._itemList1 = [];
    this._itemList2 = [];
    this._itemList = [];
    let dic: BuildInfo[] =
      BuildingManager.Instance.model.buildingListByID.getList();
    dic = ArrayUtils.sortOn(dic, "sonType", ArrayConstant.NUMERIC);
    dic.forEach((element: BuildInfo) => {
      if (element && element.templeteInfo) {
        if (
          element.templeteInfo.MasterType ==
            MasterTypes.MT_INTERNALTECHNOLOGY ||
          element.templeteInfo.MasterType == MasterTypes.MT_WARTECHNOLOGY
        ) {
          if (this.isPrimary(element)) {
            this._itemList1.push(element);
          } else if (this.advanced(element)) {
            this._itemList2.push(element);
          }
        }
      }
    });
  }

  private isPrimary(buildInfo: BuildInfo): boolean {
    if (
      buildInfo &&
      buildInfo.templeteInfo &&
      (buildInfo.templeteInfo.SonType == 1304 ||
        buildInfo.templeteInfo.SonType == 1420 ||
        buildInfo.templeteInfo.SonType == 1421 ||
        buildInfo.templeteInfo.SonType == 1422 ||
        buildInfo.templeteInfo.SonType == 1423 ||
        buildInfo.templeteInfo.SonType == 1424 ||
        buildInfo.templeteInfo.SonType == 1441 ||
        buildInfo.templeteInfo.SonType == 1442 ||
        buildInfo.templeteInfo.SonType == 1443 ||
        buildInfo.templeteInfo.SonType == 1444 ||
        buildInfo.templeteInfo.SonType == 1445 ||
        buildInfo.templeteInfo.SonType == 1446)
    ) {
      return true;
    }
    return false;
  }

  private advanced(buildInfo: BuildInfo): boolean {
    if (
      buildInfo &&
      buildInfo.templeteInfo &&
      (buildInfo.templeteInfo.SonType == 2304 ||
        buildInfo.templeteInfo.SonType == 2420 ||
        buildInfo.templeteInfo.SonType == 2421 ||
        buildInfo.templeteInfo.SonType == 2422 ||
        buildInfo.templeteInfo.SonType == 2423 ||
        buildInfo.templeteInfo.SonType == 2424 ||
        buildInfo.templeteInfo.SonType == 2441 ||
        buildInfo.templeteInfo.SonType == 2442 ||
        buildInfo.templeteInfo.SonType == 2443 ||
        buildInfo.templeteInfo.SonType == 2444 ||
        buildInfo.templeteInfo.SonType == 2445 ||
        buildInfo.templeteInfo.SonType == 2446)
    ) {
      return true;
    }
    return false;
  }

  private initBuindInfo() {
    this.LvTxt.text = LangManager.Instance.GetTranslation(
      "fish.FishFrame.levelText",
      this._data.templeteInfo.BuildingGrade,
    );
    var currentTemp: t_s_buildingtemplateData = this._data.templeteInfo;
    this.CurrentValueTxt.text = currentTemp.ActivityLang;
    var nextTemp: t_s_buildingtemplateData = this._data.nextTemplateInfo;
    if (nextTemp) {
      this.CurrentValueTxt.text = this._data
        .getNextNeedResource(nextTemp)
        ["GoldConsume"].toString();
      this.tipItem.visible = true;
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
      this.MaxValueTxt.text = "";
      this.openVIpDescTxt.x = 46;
    } else {
      this.n4Txt.text = "";
      this.n5Txt.text = "";
      this.CurrentValueTxt.text = "";
      this.TimeValueTxt.text = "";
      this.tipItem.visible = false;
      this.MaxValueTxt.text = LangManager.Instance.GetTranslation(
        "buildings.BaseBuildFrame.maxGrade",
      );
      this.openVIpDescTxt.x = 75;
    }
    if (BuildingManager.Instance.checkIsMaxLevel(this._data)) {
      this.Btn_upgrade.enabled = false;
    }
  }

  protected __upgradeBuildingReceive(info: BuildInfo) {
    this.initBuindInfo();
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
        let costPoint: number = 0;
        let tempValue = 1;
        let cfg =
          TempleteManager.Instance.getConfigInfoByConfigName(
            "Land_Up_Mulriple",
          );
        if (cfg) {
          tempValue = Number(cfg.ConfigValue);
        }
        costPoint = tempValue * point;
        UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
          orderId: this.order.orderId,
          pointNum: costPoint,
          backFun: back.bind(BuildingManager.Instance),
        });
      }
    }
  }

  private __technologyUpdateHandler(data: BuildInfo) {
    var buildInfo: BuildInfo = data;
    var bTemp: t_s_buildingtemplateData = buildInfo.templeteInfo;
    if (
      (bTemp && bTemp.MasterType == MasterTypes.MT_INTERNALTECHNOLOGY) ||
      bTemp.MasterType == MasterTypes.MT_WARTECHNOLOGY
    ) {
      NotificationManager.Instance.dispatchEvent(
        TechnologyItemEvent.UPDATA,
        buildInfo,
      );
    }
    this.initBuindInfo();
    this.itemList.refreshVirtualList();

    if (
      this._data.templeteInfo &&
      this._data.templeteInfo.BuildingGrade >= 50
    ) {
      this.advanceBtn.visible = true;
    }
  }

  private __createNewTechItemHandler() {
    this.refreshTec();
    if (
      this._data.templeteInfo &&
      this._data.templeteInfo.BuildingGrade >= 50
    ) {
      this.advanceBtn.grayed = false;
    }
  }

  private refreshTec() {
    this.initData();
    if (this.tab.selectedIndex == 0) {
      this._itemList = this._itemList1;
    } else {
      this._itemList = this._itemList2;
    }
    this.itemList.numItems = this._itemList.length;
  }

  private __completeHandler() {
    BuildingManager.Instance.upgradeOrderList();
  }

  private updateView() {
    var txt1: string = LangManager.Instance.GetTranslation(
      "buildings.seminary.view.TechnologyOrderItemView.content",
    );
    var txt2: string = LangManager.Instance.GetTranslation(
      "buildings.seminary.view.TechnologyOrderItemView.content2",
    );
    this.updateTxt(txt1, txt2);
  }

  public getItemByIndex(idx: number): SeminaryItem {
    for (let index = 0; index < this.itemList.numItems; index++) {
      if (idx == index) return this.itemList.getChildAt(index) as SeminaryItem;
    }
  }

  private get order(): BuildingOrderInfo {
    return BuildingManager.Instance.model.tecOrderList[0];
  }

  private get playerEffect(): PlayerEffectInfo {
    return PlayerManager.Instance.currentPlayerModel.playerEffect;
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

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose() {
    super.dispose();
    this.itemList.itemRenderer = null;
    this._itemList = null;
  }
}
