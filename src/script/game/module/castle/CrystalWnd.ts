import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { PlayerEffectInfo } from "../../datas/playerinfo/PlayerEffectInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { MasterTypes } from "../../map/castle/data/MasterTypes";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import { VIPManager } from "../../manager/VIPManager";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import ColorConstant from "../../constant/ColorConstant";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import AppellModel from "../appell/AppellModel";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { TempleteManager } from "../../manager/TempleteManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import QueueItem from "../home/QueueItem";
/**
 * 精炼炉
 */
export default class CrystalWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public n3Txt: fgui.GTextField;
  public n4Txt: fgui.GTextField;
  public n5Txt: fgui.GTextField;
  public n6Txt: fgui.GTextField;
  public LvTxt: fgui.GTextField;
  public CurrentValueTxt: fgui.GTextField;
  public ResourceValueTxt: fgui.GTextField;
  public TimeValueTxt: fgui.GTextField;
  public NextValueTxt: fgui.GTextField;
  public Btn_UpGrade: UIButton;
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
  public tipItem1: BaseTipItem;
  public tipItem2: BaseTipItem;
  public tipItem3: BaseTipItem;
  public btn1: fgui.GButton;
  public btn2: fgui.GButton;
  private back: Function;
  private cfgOrderValue: number = 1;
  public OnInitWind() {
    super.OnInitWind();
    this.isVIP = this.getController("isVIP");
    this.frame.getChild("title").text =
      LangManager.Instance.GetTranslation("CrystalWnd.title");
    this.n3Txt.text = LangManager.Instance.GetTranslation("CrystalWnd.title");
    this.n4Txt.text = LangManager.Instance.GetTranslation(
      "ResidenceFrameWnd.n5Txt",
    );
    this.n5Txt.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needResourceTxt",
    );
    this.n6Txt.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needTimeTxt",
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
    //
    let isOpenVip = VIPManager.Instance.model.isOpenPrivilege(
      VipPrivilegeType.BUILD_COOLDOWN,
      grade,
    );
    this.isVIP.selectedIndex = isOpenVip ? 1 : 0;
    this.vipSpeedTxt.color = AppellModel.getTextColorAB(1);
    this.addEvent();
    this.setCenter();
    this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.tipItem3.setInfo(TemplateIDConstant.TEMP_ID_GOLD);

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
  }

  private addEvent() {
    this.Btn_UpGrade.onClick(this, this.__upgradeClickHandler.bind(this));
    BuildingManager.Instance.addEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__upgradeBuildingReceive,
      this,
    );
    if (this.timeGroup.visible) this.initQuestEvent();
    this.btn1.onClick(this, this.onCoolHandler1);
    this.btn2.onClick(this, this.onCoolHandler2);
  }

  private removeEvent() {
    this.Btn_UpGrade.offClick(this, this.__upgradeClickHandler.bind(this));
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__upgradeBuildingReceive,
      this,
    );
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

  private __completeHandler() {
    BuildingManager.Instance.upgradeOrderList();
  }

  private __changeHandler1() {
    this.updateTxt(this._vData1, 1);
  }

  private __changeHandler2() {
    this.updateTxt(this._vData2, 2);
  }

  protected updateTxt(vData: BuildingOrderInfo, tyep: number = 1) {
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

  private __upgradeClickHandler() {
    if (BuildingManager.Instance.isUpgradeAvaliable(this._data)) {
      if (BuildingManager.Instance.checkBuildList(this._data)) {
        BuildingManager.Instance.upgradeBuildingByBuildingInfo(this._data);
      }
    }
  }

  protected __upgradeBuildingReceive(info: BuildInfo) {
    this.refreshView();
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
      this.tipItem3.visible = true;
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
      this.n5Txt.text = "";
      this.n6Txt.text = "";
      this.ResourceValueTxt.text = "";
      this.TimeValueTxt.text = "";
      this.tipItem3.visible = false;
      this.NextValueTxt.text = LangManager.Instance.GetTranslation(
        "buildings.BaseBuildFrame.maxGrade",
      );
      this.NextValueTxt.color = "#FF0000";
    }
    if (BuildingManager.Instance.checkIsMaxLevel(this._data)) {
      this.Btn_UpGrade.enabled = false;
    }
  }

  private get playerEffect(): PlayerEffectInfo {
    return PlayerManager.Instance.currentPlayerModel.playerEffect;
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }
}
