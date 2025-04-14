import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import RecruitPawnCell from "./RecruitPawnCell";
import LangManager from "../../../core/lang/LangManager";
import { ArmyManager } from "../../manager/ArmyManager";
import { ArmyPawn } from "../../datas/ArmyPawn";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { PlayerEffectInfo } from "../../datas/playerinfo/PlayerEffectInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { MasterTypes } from "../../map/castle/data/MasterTypes";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import ColorConstant from "../../constant/ColorConstant";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { VIPManager } from "../../manager/VIPManager";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import AppellModel from "../appell/AppellModel";
import { ArmySocketOutManager } from "../../manager/ArmySocketOutManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { ArmyEvent } from "../../constant/event/NotificationEvent";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { TempleteManager } from "../../manager/TempleteManager";
import QueueItem from "../home/QueueItem";
/**
 * @author:pzlricky
 * @data: 2021-02-19 20:37
 * @description 兵营
 */
export default class CasernWnd extends BaseWindow {
  private upgradeBtn: UIButton; //升级按钮
  public autoHelpBtn: UIButton; //自动招募说明
  public checkAuto: fgui.GButton; //自动招募
  private frame: fgui.GComponent;
  private pawnlist: fgui.GList; //兵营列表
  private pawnLevelTxt: fgui.GTextField; //兵营等级
  private n8: fgui.GTextField; //所需资源
  private needGoldTxt: fgui.GTextField; //金币
  private n11: fgui.GTextField; //所需时间
  private needTimeTxt: fgui.GTextField; //时间
  private maxLevelTxt: fgui.GTextField; //最大等级
  private _itemList: Array<RecruitPawnCell>;
  private _data: BuildInfo; //建筑数据
  public helpBtn: fgui.GButton;
  public timeDescTxt1: fgui.GTextField;
  public timeDescTxt2: fgui.GTextField;
  public timeGroup: fgui.GGroup;
  private _vData1: BuildingOrderInfo;
  private _vData2: BuildingOrderInfo;
  public openVIpDescTxt: fgui.GTextField;
  private pawDataList: ArmyPawn[];
  public vipSpeedTxt: fgui.GTextField;
  private isVIP: fgui.Controller;
  public tipItem: BaseTipItem;
  private casernUpCount: fgui.GTextField;
  public btn1: fgui.GButton;
  public btn2: fgui.GButton;
  private back: Function;
  private cfgOrderValue: number = 1;
  /**界面初始化 */
  public OnInitWind() {
    super.OnInitWind();
    this.isVIP = this.getController("isVIP");
    this.frame.getChild("title").text =
      LangManager.Instance.GetTranslation("CasernWnd.titleTxt");
    this.n8.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needResourceTxt",
    );
    this.n11.text = LangManager.Instance.GetTranslation(
      "CasernWnd.needTimeTxt",
    );
    this.pawnlist.setVirtual();
    this.pawnlist.itemRenderer = Laya.Handler.create(
      this,
      this.renderItem,
      null,
      false,
    );
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
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

    let state =
      PlayerManager.Instance.currentPlayerModel.playerInfo.autoRecruit;
    this.checkAuto.selected = state;

    let cfgItemOrder =
      TempleteManager.Instance.getConfigInfoByConfigName("QuickenOrder_Price");
    if (cfgItemOrder) {
      //冷却
      this.cfgOrderValue = Number(cfgItemOrder.ConfigValue);
    }

    this.back = BuildingManager.Instance.allCoolBack;
    this.__pawnChangeHandler();
    this.addEvent();
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this._itemList = [];
    let pawDataList: any[] = ArmyManager.Instance.casernPawnList.getList();
    pawDataList.sort(this.sortByNeedBuild);
    this.pawDataList = pawDataList;
    this.pawnlist.numItems = this.pawDataList.length;
    this.initBuildData();
  }

  private renderItem(index: number, obj: fgui.GObject) {
    let item: RecruitPawnCell = obj as RecruitPawnCell;
    if (item) {
      item.setArmyData(this.pawDataList[index]);
    }
  }

  private initBuildData() {
    this._data = this.frameData;
    this.refreshView();
  }

  protected sortByNeedBuild(pawn1: ArmyPawn, pawn2: ArmyPawn): number {
    var needBuild1: number = parseInt(
      pawn1.templateInfo.NeedBuilding.toString(),
    );
    var needBuild2: number = parseInt(
      pawn2.templateInfo.NeedBuilding.toString(),
    );
    if (needBuild1 > needBuild2) return 1;
    else if (needBuild1 < needBuild2) return -1;
    else return 0;
  }

  private addEvent() {
    this.upgradeBtn.onClick(this, this.__upgradeClickHandler.bind(this));
    BuildingManager.Instance.addEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__upgradeBuildingReceive,
      this,
    );
    if (this.timeGroup.visible) this.initQuestEvent();
    this.checkAuto.onClick(this, this.onCheckAuto);
    this.autoHelpBtn.onClick(this, this.onAutoHelp);
    ArmyManager.Instance.army.addEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.__pawnChangeHandler,
      this,
    );
    this.btn1.onClick(this, this.onCoolHandler1);
    this.btn2.onClick(this, this.onCoolHandler2);
  }

  private removeEvent() {
    this.upgradeBtn.offClick(this, this.__upgradeClickHandler.bind(this));
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__upgradeBuildingReceive,
      this,
    );
    if (this.timeGroup.visible) this.removeQuestEvent();

    if (this.pawnlist.itemRenderer instanceof Laya.Handler) {
      this.pawnlist.itemRenderer.clear();
    }

    this.pawnlist.itemRenderer = null;
    this.checkAuto.offClick(this, this.onCheckAuto);
    this.autoHelpBtn.offClick(this, this.onAutoHelp);
    ArmyManager.Instance.army.removeEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.__pawnChangeHandler,
      this,
    );
    this.btn1.offClick(this, this.onCoolHandler1);
    this.btn2.offClick(this, this.onCoolHandler2);
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

  __pawnChangeHandler() {
    let nowCount = ResourceManager.Instance.population.count;
    let totalCount = ResourceManager.Instance.population.limit;
    this.casernUpCount.text = nowCount + "/" + totalCount;
  }

  /** */
  private onCheckAuto() {
    let state = this.checkAuto.selected;
    ArmySocketOutManager.sendAutoRecurit(state);
  }

  private onAutoHelp() {
    let title: string = LangManager.Instance.GetTranslation(
      "buildings.casern.view.casern.autoHelpTitle",
    );
    let content: string = LangManager.Instance.GetTranslation(
      "buildings.casern.view.casern.autoHelp",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
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

  private __completeHandler() {
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

  private __upgradeClickHandler() {
    if (BuildingManager.Instance.isUpgradeAvaliable(this._data)) {
      if (BuildingManager.Instance.checkBuildList(this._data)) {
        BuildingManager.Instance.upgradeBuildingByBuildingInfo(this._data);
      }
    }
  }

  protected __upgradeBuildingReceive(info: BuildInfo) {
    this.refreshView();
    let pawDataList: any[] = ArmyManager.Instance.casernPawnList.getList();
    pawDataList.sort(this.sortByNeedBuild);
    this.pawDataList = pawDataList;
    this.pawnlist.refreshVirtualList();
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
    this.pawnLevelTxt.text = LangManager.Instance.GetTranslation(
      "CasernWnd.pawnLevelTxt",
      this._data.templeteInfo.BuildingGrade,
    );
    if (nextTemp) {
      this.needGoldTxt.text = this._data
        .getNextNeedResource(nextTemp)
        ["GoldConsume"].toString();
      this.needGoldTxt.visible = true;
      this.tipItem.visible = true;
      this.n8.text = LangManager.Instance.GetTranslation(
        "CasernWnd.needResourceTxt",
      );
      this.n11.text = LangManager.Instance.GetTranslation(
        "CasernWnd.needTimeTxt",
      );
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
      this.needTimeTxt.text = DateFormatter.getCountDate(value);
      this.needTimeTxt.visible = true;
      this.openVIpDescTxt.x = 50;
    } else {
      this.n8.text = "";
      this.n11.text = "";
      this.tipItem.visible = false;
      this.needGoldTxt.visible = false;
      this.needTimeTxt.visible = false;
      this.maxLevelTxt.visible = true;
      this.maxLevelTxt.text = LangManager.Instance.GetTranslation(
        "buildings.BaseBuildFrame.maxGrade",
      );
      this.openVIpDescTxt.x = 84;
    }
    if (BuildingManager.Instance.checkIsMaxLevel(this._data)) {
      this.upgradeBtn.enabled = false;
    }
  }

  public getRecruitPawnBtn(sontype: number) {
    for (let index = 0; index < this.pawnlist.numItems; index++) {
      const item = this.pawnlist.getChildAt(index) as RecruitPawnCell;
      if (item.ArmyData.templateInfo.SonType == sontype) {
        return item.Btn_RecruitPawn;
      }
    }
    return null;
  }

  private get playerEffect(): PlayerEffectInfo {
    return PlayerManager.Instance.currentPlayerModel.playerEffect;
  }

  OnHideWind() {
    this.pawnlist.numItems = 0;
    this._itemList = [];
    this.removeEvent();
    if (UIManager.Instance.isShowing(EmWindow.SoliderInfoTipWnd)) {
      //如果有弹窗
      UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
    }
    super.OnHideWind();
  }

  dispose() {
    super.dispose();
  }
}
