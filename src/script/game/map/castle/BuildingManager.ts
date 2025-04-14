import LangManager from "../../../core/lang/LangManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import StringHelper from "../../../core/utils/StringHelper";
import { t_s_pawntemplateData } from "../../config/t_s_pawntemplate";
import { BuildOrderEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { BuildingSocketOutManager } from "../../manager/BuildingSocketOutManager";
import { NotificationManager } from "../../manager/NotificationManager";
import BuildingModel from "./BuildingModel";
import BuildingType from "./consant/BuildingType";
import { BuildInfo } from "./data/BuildInfo";
import { FieldData } from "./data/FieldData";
import { MasterTypes } from "./data/MasterTypes";
import { BuildingEvent } from "./event/BuildingEvent";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
//@ts-expect-error: External dependencies

import CastleYieldMsg = com.road.yishi.proto.castle.CastleYieldMsg;
//@ts-expect-error: External dependencies

import WildYieldMsg = com.road.yishi.proto.castle.CastleYieldMsg.WildYieldMsg;
//@ts-expect-error: External dependencies

import GoldImposeMsg = com.road.yishi.proto.simple.GoldImposeMsg;
//@ts-expect-error: External dependencies

import BuildingInfoListMsg = com.road.yishi.proto.building.BuildingInfoListMsg;
//@ts-expect-error: External dependencies

import OrderQuickRspMsg = com.road.yishi.proto.building.OrderQuickRspMsg;
//@ts-expect-error: External dependencies

import OrderInfoMsg = com.road.yishi.proto.building.OrderInfoMsg;
//@ts-expect-error: External dependencies

import BuildingInfoMsg = com.road.yishi.proto.building.BuildingInfoMsg;
//@ts-expect-error: External dependencies

import BuildOrderList = com.road.yishi.proto.building.BuildOrderList;
//@ts-expect-error: External dependencies

import TransInfoMsg = com.road.yishi.proto.building.TransInfoMsg;
//@ts-expect-error: External dependencies

import GiveupWildLandMsg = com.road.yishi.proto.building.GiveupWildLandMsg;
import { TempleteManager } from "../../manager/TempleteManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { ResourceManager } from "../../manager/ResourceManager";
import FightIngModel from "../../mvc/model/FightIngModel";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import { t_s_configData } from "../../config/t_s_config";
export default class BuildingManager extends GameEventDispatcher {
  private static _instance: BuildingManager;
  public static get Instance(): BuildingManager {
    if (!this._instance) this._instance = new BuildingManager();
    return this._instance;
  }
  private _model: BuildingModel = new BuildingModel();
  private _isShowBuildingName: boolean = true;

  public setup() {
    this.initEvent();
  }

  initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_BUILDINGINFO_LIST,
      this,
      this.__updateBuildInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BUILDING_ORDER_SEND,
      this,
      this.__loadBuildOrderHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BUILDING_ORDER_QUICK,
      this,
      this.__orderCoolHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BUILDING_ORDERADD,
      this,
      this.__addOrderHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BUILDING_ORDER_INFO,
      this,
      this.__userOrderHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BUILDING_UPENERGY,
      this,
      this.__transerAddPowerHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_UNOCCPWILDLAND,
      this,
      this.__unoccupyHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_GOLD_IMPOSERESULT,
      this,
      this.__levyUpdateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_SECURITY_INFO_UPDATE,
      this,
      this.__politicsDataHandler,
    );
  }

  /**
   * 内政厅数据
   * @param e
   *
   */
  private __politicsDataHandler(pkg: PackageIn) {
    this._model.fieldArray = [];
    let fInfo: FieldData;
    let wildYieldMsg: WildYieldMsg;
    let castleMsg = pkg.readBody(CastleYieldMsg) as CastleYieldMsg;
    for (let i: number = 0; i < castleMsg.wildYield.length; i++) {
      wildYieldMsg = castleMsg.wildYield[i] as WildYieldMsg;
      fInfo = new FieldData();
      fInfo.mapId = wildYieldMsg.mapId;
      fInfo.site = wildYieldMsg.wildPoxName;
      fInfo.pos = wildYieldMsg.wildPox;
      fInfo.fieldGrade = wildYieldMsg.wildGrade;
      fInfo.fieldName = wildYieldMsg.wildName;
      fInfo.yield = wildYieldMsg.wildYield;
      fInfo.refreshTime = wildYieldMsg.wildRefreshTime;
      fInfo.createDate = DateFormatter.parse(
        wildYieldMsg.createTime,
        "YYYY-MM-DD hh:mm:ss",
      );
      fInfo.nodeId = wildYieldMsg.nodeId;
      fInfo.sonNodeId = wildYieldMsg.sonNodeId;
      this._model.fieldArray.push(fInfo);
    }
    this.dispatchEvent(BuildingEvent.U_SECURITY_INFO_UPDATE);
  }

  /**
   * 征收
   */
  private __levyUpdateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(GoldImposeMsg) as GoldImposeMsg;
    let info: BuildInfo = this.model.getBuildingInfoBySonType(
      BuildingType.OFFICEAFFAIRS,
    );
    if (info) {
      info.property1 = msg.leftImpose;
      info.property2 = msg.maxImpose;
      info.payImpose = msg.payImpose;
      if (this.model.alchemyOrder) {
        this.model.alchemyOrder.dispatchEvent(Laya.Event.CHANGE);
      }
      this.dispatchEvent(BuildingEvent.U_C_GOLD_IMPOSERESULT);
    }
  }
  /**
   * 建筑升级
   * @param e
   *
   */
  private __updateBuildInfoHandler(pkg: PackageIn) {
    let msg = pkg.readBody(BuildingInfoListMsg) as BuildingInfoListMsg;
    let result: boolean = msg.result;
    if (result) {
      for (const key in msg.building) {
        let item: BuildingInfoMsg = msg.building[key] as BuildingInfoMsg;
        let info: BuildInfo = this._model.getBuildingInfoByBID(item.buildingId);
        let isNew: boolean = false;
        if (!info) {
          info = new BuildInfo();
          isNew = true;
        }
        info.buildingId = item.buildingId;
        info.templateId = item.templateId;
        info.property1 = item.propterty1;
        info.property2 = item.propterty2;
        info.payImpose = item.levyNum;
        info.sonType = item.sonType;
        if (isNew) {
          this._model.addBuildInfo(info);
          this.dispatchEvent(BuildingEvent.CREATE_NEW_BUILDING, info);
        } else {
          this.dispatchEvent(BuildingEvent.BUILDING_UPGRADE_RECEIVE, info);
        }
        if (
          info.templeteInfo.MasterType == MasterTypes.MT_INTERNALTECHNOLOGY ||
          info.templeteInfo.MasterType == MasterTypes.MT_WARTECHNOLOGY
        ) {
          NotificationManager.Instance.sendNotification(
            PlayerEvent.UPDATE_EXTRABUFFER,
          );
        }
      }
    }
  }

  /**
   * 更新冷却队列
   *
   */
  private calcOrderCount() {
    this.model.buildOrderCount = 0;
    this.model.tecOrderCount = 0;
    for (const key in this.model.buildOrderList) {
      let oInfo = this.model.buildOrderList[key];
      if (oInfo.remainTime > 0) this.model.buildOrderCount++;
    }
    for (const key in this.model.tecOrderList) {
      let oInfo = this.model.tecOrderList[key];
      if (oInfo.remainTime > 0) this.model.tecOrderCount++;
    }
  }

  /**
   * 建筑队列数据
   * @param evt
   *
   */
  private __loadBuildOrderHandler(pkg: PackageIn) {
    let msg = pkg.readBody(BuildOrderList) as BuildOrderList;
    for (const key in msg.buildOrder) {
      let bInfo: OrderInfoMsg = msg.buildOrder[key] as OrderInfoMsg;
      let oInfo: BuildingOrderInfo = this.model.getOrderById(bInfo.orderId);
      if (oInfo) {
        oInfo.remainTime = bInfo.remainTime;
      }
    }
    this.calcOrderCount();
    this.dispatchEvent(BuildOrderEvent.UPDATE_ORDER);
  }
  /**
   * 冷却建筑队列
   * @param e
   *
   */
  private __orderCoolHandler(pkg: PackageIn) {
    let msg = pkg.readBody(OrderQuickRspMsg) as OrderQuickRspMsg;
    let count: number = msg.orderInfo.length;
    for (let i: number = 0; i < count; i++) {
      let orderId: number = (msg.orderInfo[i] as OrderInfoMsg).orderId;
      let order: BuildingOrderInfo = this._model.getOrderById(orderId);
      if (!order) {
        let str: string = LangManager.Instance.GetTranslation(
          "yishi.manager.BuildingManager.command01",
        );
        MessageTipManager.Instance.show(str);
        return;
      }
      order.remainTime = (msg.orderInfo[i] as OrderInfoMsg).remainTime;
      this.calcOrderCount();
      this.dispatchEvent(BuildOrderEvent.COLL_ONE_ORDER, order);
    }
  }
  /**
   * 购买一个建筑队列
   * @param e
   *
   */
  private __addOrderHandler(pkg: PackageIn) {
    let msg = pkg.readBody(OrderInfoMsg) as OrderInfoMsg;
    let order: BuildingOrderInfo = new BuildingOrderInfo();
    order.orderId = msg.orderId;
    order.orderType = msg.orderType;
    order.remainTime = msg.remainTime;
    this._model.addNewOrder(order);
    this.dispatchEvent(BuildOrderEvent.ADD_ONE_ORDER, order);
  }
  /**
   * 使用一个建筑队列
   * @param e
   *
   */
  private __userOrderHandler(pkg: PackageIn) {
    let msg = pkg.readBody(OrderInfoMsg) as OrderInfoMsg;
    let id: number = msg.orderId;
    let time: number = msg.remainTime;
    let order: BuildingOrderInfo = this._model.getOrderById(id);
    order.remainTime = time;
    this.calcOrderCount();
    this.dispatchEvent(BuildOrderEvent.USE_ONE_ORDER, order);
  }

  /**
   * 增加传送能量
   * @param e
   *
   */
  private __transerAddPowerHandler(pkg: PackageIn) {
    let msg = pkg.readBody(TransInfoMsg) as TransInfoMsg;
    let result: number = msg.currentEnergy;
    let info: BuildInfo = this.model.buildingListByID[-11];
    info.property1 = result;
    this.dispatchEvent(BuildingEvent.TRANSFER_POWER_SUCCESS, result);
  }
  /**
   * 删除一个野地
   * @param e
   *
   */
  private __unoccupyHandler(pkg: PackageIn) {
    let msg = pkg.readBody(GiveupWildLandMsg) as GiveupWildLandMsg;
    let result: string = msg.wildLandPos;
    if (result != "" && result != null) {
      let str: string = LangManager.Instance.GetTranslation(
        "yishi.manager.BuildingManager.command02",
      );
      MessageTipManager.Instance.show(str);
    }
    this.dispatchEvent(BuildingEvent.U_UNOCCPWILDLAND, result);
  }

  /**********************************请求********************************/
  /**
   * 升级建筑
   * @param bInfo
   *
   */
  public upgradeBuildingByBuildingInfo(bInfo: BuildInfo) {
    if (!bInfo) return;
    BuildingSocketOutManager.sendUpgradeBuild(bInfo.buildingId);
  }

  public upgradeOrderList() {
    BuildingSocketOutManager.upgradeOrderList();
  }

  /**********************************数据处理********************************/
  /**
   * 初始化建筑列表
   * @param list
   *
   */
  public setSelfBuildingInfo(list: any[]) {
    for (const key in list) {
      let bInfo: BuildInfo = list[key];
      this._model.addBuildInfo(bInfo);
    }
  }
  /**
   * 激活科技
   * @param
   *
   */
  public creatBuilding(sonType: number) {
    let templete: t_s_buildingtemplateData =
      TempleteManager.Instance.getMinGradeBuildTemplate(sonType);
    let msg: string = ResourceManager.Instance.canSubtractResources(
      templete.GoldConsume,
      templete.CrystalsConsume,
    );
    if (msg != null) {
      let str: string = LangManager.Instance.GetTranslation(
        "yishi.manager.BuildingManager.command03",
        msg,
      );
      MessageTipManager.Instance.show(str);
      return;
    } else {
      let bInfo: BuildInfo = new BuildInfo();
      bInfo.templateId = templete.TemplateId;
      bInfo.sonType = templete.SonType;
      msg =
        BuildingManager.Instance.model.canBuildOrUpgradeByBuildingInfo(bInfo);
      if (StringHelper.isNullOrEmpty(msg) == false) {
        let str: string = LangManager.Instance.GetTranslation(
          "yishi.manager.BuildingManager.command04",
          msg,
        );
        MessageTipManager.Instance.show(str);
        return;
      }
      BuildingSocketOutManager.sendCreateBuild(sonType);
    }
  }

  /**
   * 检查是否有可用建筑队列
   * @param info
   * @return
   *
   */
  public checkBuildList(info: BuildInfo): boolean {
    if (this._model.buildOrderCount >= this._model.buildOrderTotal) {
      let str: string = "";
      if (this._model.buildOrderTotal >= this._model.buildOrderLimit) {
        str = LangManager.Instance.GetTranslation(
          "yishi.manager.BuildingManager.command05",
        );
        MessageTipManager.Instance.show(str);
        // QueueBar.instance.playItemEffect(QueueItem.QUEUE_TYPE_BUILD);
      } else {
        str = LangManager.Instance.GetTranslation(
          "yishi.manager.BuildingManager.command06",
        );
        MessageTipManager.Instance.show(str);
        // QueueBar.instance.playItemEffect(QueueItem.QUEUE_TYPE_BUILD);
      }
      return false;
    }
    return true;
  }

  /**
   * 检查是否有可用科技队列
   * @param info
   * @return
   *
   */
  public checkTecList(info: BuildInfo): boolean {
    if (this._model.tecOrderCount >= this._model.tecOrderTotal) {
      if (this._model.tecOrderTotal >= this._model.tecOrderLimit) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "yishi.manager.BuildingManager.checkTecList01",
          ),
        );
        // QueueBar.instance.playItemEffect(QueueItem.QUEUE_TYPE_TEC);
      } else {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "yishi.manager.BuildingManager.checkTecList02",
          ),
        );
        // QueueBar.instance.playItemEffect(QueueItem.QUEUE_TYPE_TEC);
      }
      return false;
    }
    return true;
  }

  /**
   * 冷却回调函数
   * @param result
   * @param id
   * @param type
   *
   */
  public allCoolBack(
    result: boolean,
    id: number = 0,
    type: number = 0,
    useBind: boolean = true,
  ) {
    if (result) {
      if (id != 0) {
        let order: BuildingOrderInfo = this._model.getOrderById(id);
        if (order.remainTime <= 0) return;
      } else {
        if (this.point <= 0) return;
      }
      BuildingSocketOutManager.sendCoolOrder(id, type, useBind);
    }
    this.dispatchEvent(BuildingEvent.UNAPPLY, this._model.getOrderById(id));
  }

  private get point(): number {
    let num: number = 0;
    for (const key in this._model.buildOrderList) {
      let order: BuildingOrderInfo = this._model.buildOrderList[key];
      num += Math.ceil(order.remainTime / 600);
    }
    return num;
  }

  /**
   * 是否可升级建筑
   * @param bInfo
   * @return
   *
   */
  public isUpgradeAvaliable(bInfo: BuildInfo): boolean {
    if (this.checkIsMaxLevel(bInfo)) return false;
    if (!this.checkEnoughResource(bInfo)) return false;
    if (!this.checkPreBuild(bInfo)) return false;
    if (!this.checkPlayerGrade(bInfo)) return false;
    return true;
  }

  public isUpgradeAvaliableNotTips(bInfo: BuildInfo): boolean {
    if (this.checkIsMaxLevel(bInfo)) return false;
    if (!this.checkEnoughResourceNotTips(bInfo)) return false;
    if (!this.checkPreBuildNotTips(bInfo)) return false;
    if (!this.checkPlayerGradeNotTips(bInfo)) return false;
    return true;
  }

  private checkPlayerGradeNotTips(bInfo: BuildInfo): boolean {
    let templete: t_s_buildingtemplateData = bInfo.templeteInfo;
    if (templete && templete.BuildingGrade >= this.thane.grades) {
      return false;
    }
    return true;
  }

  private checkPreBuildNotTips(bInfo: BuildInfo): boolean {
    let msg: string = this.model.canBuildOrUpgradeByBuildingInfoTec(bInfo);
    if (StringHelper.isNullOrEmpty(msg) == false) {
      return false;
    }
    return true;
  }

  private checkEnoughResourceNotTips(bInfo: BuildInfo): boolean {
    let nextTemp: t_s_buildingtemplateData =
      TempleteManager.Instance.getBuildTemplateByID(
        parseInt(bInfo.templeteInfo.NextGradeTemplateId.toString()),
      );
    let msg: string = ResourceManager.Instance.canSubtractResources(
      nextTemp.GoldConsume,
      nextTemp.CrystalsConsume,
    );
    if (StringHelper.isNullOrEmpty(msg) == false) {
      return false;
    }
    return true;
  }

  /**
   * 建筑是否达到最大等级
   * @param bInfo
   * @return
   *
   */
  public checkIsMaxLevel(bInfo: BuildInfo): boolean {
    return this._model.isMaxLevel(bInfo.buildingId);
  }
  /**
   * 升级建筑所需资源是否足够
   * @param bInfo
   * @return
   *
   */
  private checkEnoughResource(bInfo: BuildInfo): boolean {
    let nextTemp: t_s_buildingtemplateData =
      TempleteManager.Instance.getBuildTemplateByID(
        parseInt(bInfo.templeteInfo.NextGradeTemplateId.toString()),
      );
    let msg: string = ResourceManager.Instance.canSubtractResources(
      nextTemp.GoldConsume,
      nextTemp.CrystalsConsume,
    );
    if (StringHelper.isNullOrEmpty(msg) == false) {
      MessageTipManager.Instance.show(msg);
      return false;
    }
    return true;
  }
  /**
   * 升级建筑所需前置建筑是否满足条件
   * @param bInfo
   * @return
   *
   */
  private checkPreBuild(bInfo: BuildInfo): boolean {
    let msg: string = this.model.canBuildOrUpgradeByBuildingInfo(bInfo);
    if (StringHelper.isNullOrEmpty(msg) == false) {
      let str: string = LangManager.Instance.GetTranslation(
        "yishi.manager.BuildingManager.command07",
        msg,
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    return true;
  }
  /**
   * 升级建筑所需玩家等级是否满足条件
   * @param bInfo
   * @return
   *
   */
  private checkPlayerGrade(bInfo: BuildInfo): boolean {
    let templete: t_s_buildingtemplateData = bInfo.templeteInfo;
    let nextTemp: t_s_buildingtemplateData =
      TempleteManager.Instance.getBuildTemplateByID(
        templete.NextGradeTemplateId,
      );
    if (nextTemp && nextTemp.PlayerGrades > this.thane.grades) {
      let str: string = LangManager.Instance.GetTranslation(
        "yishi.manager.BuildingManager.command08",
        nextTemp.PlayerGrades,
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    return true;
  }
  /**
   * 检查对应sontype的建筑是否存在
   * @param sontype
   * @return
   *
   */
  public isExistBuildingBySonType(sontype: number): boolean {
    return this._model.isExistBuildingBySonType(sontype);
  }
  /**
   * 检查对应songtype和等级的建筑是否存在
   * @param sontype
   * @param level
   * @return
   *
   */
  public isExistBuildBySontypeAndLevel(
    sontype: number,
    level: number,
  ): boolean {
    return this._model.isExistBuildingBySontypeAndLevel(sontype, level);
  }
  /**
   * 根据sontype获取建筑
   * @param sontype
   * @return
   *
   */
  public getBuildingInfoBySonType(sonType: number): BuildInfo {
    return this._model.getBuildingInfoBySonType(sonType);
  }

  /**
   * 获取对指定士兵招募有影响的建筑列表
   * @param temp
   * @return
   *
   */
  public getMaxEffectBuildingTemplate(
    temp: t_s_pawntemplateData,
  ): Array<t_s_buildingtemplateData> {
    return this._model.getMaxEffectBuildingTemplate(temp);
  }
  /**
   * 获取有大力神像影响的士兵的建造时间
   * @param temp
   * @return
   *
   */
  public getTitanPawnTimeEffect(temp: t_s_pawntemplateData): number {
    return this._model.getTitanPawnTimeEffect(temp);
  }
  /**
   * 获取建筑的前置建筑
   * @param temp
   * @return
   *
   */
  public getPreBuildingList(
    temp: t_s_buildingtemplateData,
  ): Array<t_s_buildingtemplateData> {
    let list: Array<t_s_buildingtemplateData> = [];
    let preTemplateId: number = temp.PreTemplateId;
    if (preTemplateId != 0) {
      let preTemplate: t_s_buildingtemplateData =
        TempleteManager.Instance.getBuildTemplateByID(preTemplateId);
      list.push(preTemplate);
    }
    return list;
  }

  /**
   * 检查是否需要提示升级科技
   * @return
   *
   */
  public checkMilitaryTecMaxGrade(): boolean {
    let flag: boolean = false;
    this._model.buildingListByID.getList().forEach((info) => {
      if (
        info.templeteInfo.MasterType == MasterTypes.MT_TECHNICAL &&
        info.templeteInfo.BuildingGrade < this.thane.grades - 3 &&
        info.templeteInfo.NextGradeTemplateId > 0
      )
        flag = true;
    });
    return flag;
  }

  public get model(): BuildingModel {
    return this._model;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public get isShowBuildingName(): boolean {
    return this._isShowBuildingName;
  }

  public set isShowBuildingName(value: boolean) {
    if (this._isShowBuildingName == value) return;
    this._isShowBuildingName = value;
    this.dispatchEvent(BuildingEvent.BUILDING_NAME_SHOW_HIDE, null);
  }

  /**额外征收今日不在提示 */
  public levyExAlertDate: Date;
  /**额外征收使用绑钻 */
  public levyExUseBind: boolean = false;
  public get innerLevy(): string[] {
    let result = [];
    let configInfo: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName("Inner_Levy");
    if (configInfo && configInfo.ConfigValue) {
      result = configInfo.ConfigValue.split(",");
    }
    return result;
  }
}
