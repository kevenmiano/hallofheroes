import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { t_s_extrajobData } from "../../../config/t_s_extrajob";
import { t_s_extrajobequipData } from "../../../config/t_s_extrajobequip";
import { t_s_extrajobequipstrengthenData } from "../../../config/t_s_extrajobequipstrengthen";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { BagType } from "../../../constant/BagDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import OpenGrades from "../../../constant/OpenGrades";
import { ExtraJobEvent } from "../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FrameDataBase from "../../../mvc/FrameDataBase";
import { GoodsHelp } from "../../../utils/GoodsHelp";
import { ExtraJobEquipItemInfo } from "./ExtraJobEquipItemInfo ";
import { ExtraJobItemInfo } from "./ExtraJobItemInfo";

/**
 * 专精数据模型
 */
export default class ExtraJobModel extends FrameDataBase {
  private static _instance: ExtraJobModel;
  /**激活秘典列表 */
  private _activeList: Array<ExtraJobItemInfo> = [];
  /**激活魂器列表 */
  private _equipList: Array<ExtraJobEquipItemInfo> = [];
  /** 已激活数量 */
  private _activedNum: number = 0;
  /** 剩余可激活数量 */
  public leftNum: number = 0;
  /** 可激活数量 */
  public canActiveNum: number = 0;
  /** 等级为下一数量所需秘典总等级 */
  public nextLevel: number = 0;
  public equipGemOpenArr: any = [];
  private _allPropertys: { [key: string]: number }[] = [];

  public get allPropertys(): any {
    return this._allPropertys;
  }

  private _totalLevel: number = 0;
  /**
   * 秘典总等级
   */
  public get totalLevel(): number {
    let total: number = 0;
    for (let i = 0; i < this._activeList.length; i++) {
      const element = this._activeList[i];
      if (element) {
        total += element.jobLevel;
      }
    }
    this._totalLevel = total;
    return total;
  }

  public get activeList(): Array<ExtraJobItemInfo> {
    return this._activeList;
  }

  public get equipList(): Array<ExtraJobEquipItemInfo> {
    return this._equipList;
  }

  public static get instance(): ExtraJobModel {
    if (!ExtraJobModel._instance) ExtraJobModel._instance = new ExtraJobModel();
    return ExtraJobModel._instance;
  }

  constructor() {
    super();
    this.initActiveList();
    this.initEquipList();

    let cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "ExtraJob_EquipGemOpen",
    ); //  "ConfigValue": "2,3,4,5","Description": "【专精】魂器宝石孔开放所需阶数",
    if (cfg) {
      let value: string = cfg.ConfigValue;
      this.equipGemOpenArr = value.split(",");
    }
  }

  public MasteryRedDot() {
    if (ArmyManager.Instance.thane.grades < OpenGrades.MASTERY) {
      return false;
    }
    return this.checkSecretRedDot() || this.checkSoulEquipRedDot();
  }

  /**
   * 秘典红点检测
   * @returns
   */
  public checkSecretRedDot() {
    //玩家拥有可激活秘典数量≥1时
    if (this.leftNum >= 1) {
      return true;
    }
    //2.玩家已解锁的秘典满足升级条件时
    for (let i = 0; i < this._activeList.length; i++) {
      const element = this._activeList[i];
      if (element) {
        //是否已激活
        let isActived = element.jobLevel > 0;
        if (isActived) {
          //是否可升级
          let canLevelUp: boolean = false;
          var nextInfo: t_s_extrajobData =
            TempleteManager.Instance.getExtrajobCfg(
              element.jobType,
              element.jobLevel + 1,
            );
          if (nextInfo) {
            canLevelUp = this.checkCondition(nextInfo);
            if (canLevelUp) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * 玩家拥有可激活魂器时
   * @returns
   */
  public checkSoulEquipRedDot() {
    for (let i = 0; i < this._equipList.length; i++) {
      const element = this._equipList[i];
      if (element) {
        //是否已激活
        let isActived = element.equipLevel > 0;
        if (!isActived) {
          //是否可升级
          //是否可激活
          let cfg = TempleteManager.Instance.getExtrajobEquipCfg(
            element.equipType,
            1,
          ) as t_s_extrajobequipData;
          if (cfg) {
            //是否可以解锁
            if (ExtraJobModel.instance.totalLevel >= cfg.NeedTotalJobLevel) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  private checkCondition(nextInfo: t_s_extrajobData): boolean {
    if (
      ArmyManager.Instance.thane.grades >= nextInfo.NeedPlayerLevel &&
      this._totalLevel >= nextInfo.NeedTotalJobLevel
    ) {
      if (ResourceManager.Instance.gold.count >= nextInfo.CostGold) {
        let ownProp = GoodsManager.Instance.getBagCountByTempId(
          BagType.Player,
          nextInfo.CostItemId,
        );
        if (ownProp >= nextInfo.CostItemCount) {
          return true;
        }
      }
    }
    return false;
  }

  initActiveList() {
    let job = ArmyManager.Instance.thane.job;
    this.getCfgByJob(job, this._activeList);
    this._activeList.push(null);
    this.updateTotalLevel();
  }

  public getCfgByJob(job, arr) {
    let cfg: t_s_extrajobData;
    let info: ExtraJobItemInfo;
    switch (job) {
      case 1:
      case 4:
        // cfg = TempleteManager.Instance.getExtrajobCfg(42, 1);
        info = new ExtraJobItemInfo();
        info.jobType = 42;
        info.jobLevel = 0;
        info.skillScript = "";
        arr.push(info);

        // cfg = TempleteManager.Instance.getExtrajobCfg(43, 1)
        info = new ExtraJobItemInfo();
        info.jobType = 43;
        info.jobLevel = 0;
        info.skillScript = "";
        arr.push(info);
        break;
      case 2:
      case 5:
        // cfg = TempleteManager.Instance.getExtrajobCfg(41, 1);
        info = new ExtraJobItemInfo();
        info.jobType = 41;
        info.jobLevel = 0;
        info.skillScript = "";
        arr.push(info);

        // cfg = TempleteManager.Instance.getExtrajobCfg(43, 1)
        info = new ExtraJobItemInfo();
        info.jobType = 43;
        info.jobLevel = 0;
        info.skillScript = "";
        arr.push(info);
        break;
      case 3:
      case 6:
        // cfg = TempleteManager.Instance.getExtrajobCfg(41, 1);
        info = new ExtraJobItemInfo();
        info.jobType = 41;
        info.jobLevel = 0;
        info.skillScript = "";
        arr.push(info);

        // cfg = TempleteManager.Instance.getExtrajobCfg(42, 1)
        info = new ExtraJobItemInfo();
        info.jobType = 42;
        info.jobLevel = 0;
        info.skillScript = "";
        arr.push(info);
        break;
    }

    info = new ExtraJobItemInfo();
    info.jobType = 44;
    info.jobLevel = 0;
    info.skillScript = "";
    arr.push(info);
  }

  initEquipList() {
    let info: ExtraJobEquipItemInfo;
    for (let i = 1; i < 7; i++) {
      info = new ExtraJobEquipItemInfo();
      info.equipType = i;
      info.equipLevel = 0;
      this._equipList.push(info);
    }
  }

  updateItemInfo(info: ExtraJobItemInfo) {
    Logger.info("[ExtraJobModel]刷新秘典信息", info);
    this._activedNum = 0;
    for (let index = 0; index < this._activeList.length; index++) {
      const element = this._activeList[index];
      if (element) {
        if (info.jobType == element.jobType) {
          element.jobLevel = info.jobLevel;
          element.skillScript = info.skillScript;
        }
        if (element.jobLevel > 0) {
          this._activedNum++;
        }
      }
    }
    this.updateTotalLevel();
    NotificationManager.Instance.dispatchEvent(ExtraJobEvent.LEVEL_UP, info);
  }

  /**
   * 获得指定秘典的等级
   * @param jobtype
   */
  public getExtrajobItemLevel(jobtype: number): number {
    for (let index = 0; index < this._activeList.length; index++) {
      const element = this._activeList[index];
      if (element) {
        if (jobtype == element.jobType) {
          return element.jobLevel;
        }
      }
    }
    return 0;
  }

  private updateTotalLevel() {
    //【专精】秘典可激活数量对应所需总等级 "0,40"
    let totalLevel = this.totalLevel;
    this.canActiveNum = 0;
    this.nextLevel = 0;
    let cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "ExtraJob_CountActive",
    );
    if (cfg) {
      let value: string = cfg.ConfigValue;
      if (value) {
        let arr = value.split(",");
        let next: string = "";
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          if (totalLevel >= parseInt(element)) {
            this.canActiveNum++;
          } else {
            this.nextLevel = parseInt(element);
            break;
          }
        }
        //可激活数量显示：“可激活数量：”+玩家剩余激活数量/可激活数量总数
        this.leftNum = this.canActiveNum - this._activedNum;
      }
    }
  }

  updateEquipItemInfo(info: ExtraJobEquipItemInfo) {
    for (let index = 0; index < this._equipList.length; index++) {
      const element = this._equipList[index];
      if (element) {
        if (info.equipType == element.equipType) {
          element.equipLevel = info.equipLevel;
          element.strengthenLevel = info.strengthenLevel;
          element.join1 = info.join1;
          element.join2 = info.join2;
          element.join3 = info.join3;
          element.join4 = info.join4;
          break;
        }
      }
    }
    NotificationManager.Instance.dispatchEvent(ExtraJobEvent.STAGE_UP, info);
  }

  /**
   * 1:男战
   * 2:男弓
   * 3:男法
   * 4:女战
   * 5:女弓
   * 6:女法
   * //41战士秘典 42射手秘典 43法师秘典，仅有这三个秘典需要屏蔽对应职业，例如战士需要屏蔽战士秘典，后续新增秘典都是通用类型
   */
  public getSecretByJob(job: number) {}

  //合并相同属性值
  public concatSameProperty(list: { [key: string]: number }[]) {
    let result: { [key: string]: number } = {};
    for (let item of list) {
      for (let p in item) {
        if (result[p]) {
          result[p] += item[p];
        } else {
          result[p] = item[p];
        }
      }
    }
    return result;
  }

  public resetAllPropertys() {
    this._allPropertys.length = 0;
  }

  public getTotalProperty(): any {
    return this.concatSameProperty(this._allPropertys);
  }

  /**
   * 计算单个魂器的属性
   * @param info
   */
  public getAttr(info: ExtraJobEquipItemInfo) {
    let ctrl = ExtraJobModel.instance;
    let strenCfg: t_s_extrajobequipstrengthenData =
      TempleteManager.Instance.getExtrajobEquipStrenthenCfg(
        info.strengthenLevel,
      );
    let cfg = TempleteManager.Instance.getExtrajobEquipCfg(
      info.equipType,
      info.equipLevel,
    );
    if (cfg) {
      let propertyObject: { [key: string]: number } = {};
      if (cfg.Attack > 0) {
        let pVal: number = cfg.Attack;
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * cfg.Attack
          : 0;
        if (strenCfg) {
          pVal += Math.floor(addValue);
        }
        propertyObject[
          LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13")
        ] = pVal;
      }
      if (cfg.Defence > 0) {
        let pVal: number = cfg.Defence;
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * cfg.Defence
          : 0;
        if (strenCfg) {
          pVal += Math.floor(addValue);
        }
        propertyObject[
          LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14")
        ] = pVal;
      }
      if (cfg.MagicAttack > 0) {
        let pVal: number = cfg.MagicAttack;
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * cfg.MagicAttack
          : 0;
        if (strenCfg) {
          pVal += Math.floor(addValue);
        }
        propertyObject[
          LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15")
        ] = pVal;
      }
      if (cfg.MagicDefence > 0) {
        let pVal: number = cfg.MagicDefence;
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * cfg.MagicDefence
          : 0;
        if (strenCfg) {
          pVal += Math.floor(addValue);
        }
        propertyObject[
          LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16")
        ] = pVal;
      }
      if (cfg.Live > 0) {
        let pVal: number = cfg.Live;
        //强化等级增加的属性（绿色字体） 强化属性=强化加成百分比*魂器当前阶数的属性
        let addValue = strenCfg
          ? (strenCfg.ExtraPropertyPercent / 100) * cfg.Live
          : 0;
        if (strenCfg) {
          pVal += Math.floor(addValue);
        }
        propertyObject[
          LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11")
        ] = pVal;
      }
      this._allPropertys.push(propertyObject);
      for (let i = 1; i <= 4; i++) {
        //镶嵌宝石增加的属性
        const tempId = info["join" + i];
        if (tempId > 0) {
          let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_itemtemplate,
            tempId,
          );
          this._allPropertys.push(ctrl.parseJewelAddProperty(temp));
        }
      }
    }
  }

  //属性解析
  public parseJewelAddProperty(templateInfo: t_s_itemtemplateData) {
    let propertyObject: { [key: string]: number } = {};
    if (!templateInfo) return propertyObject;

    let addValue: number = Math.floor(
      (templateInfo.totalAttribute *
        GoodsHelp.getJewelEffecyByGrade(this.thane.jewelGrades)) /
        100,
    );

    if (templateInfo.Power)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01")
      ] = templateInfo.Power + addValue;
    if (templateInfo.Agility)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02")
      ] = templateInfo.Agility + addValue;
    if (templateInfo.Intellect)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03")
      ] = templateInfo.Intellect + addValue;
    if (templateInfo.Physique)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04")
      ] = templateInfo.Physique + addValue;
    if (templateInfo.Captain)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05")
      ] = templateInfo.Captain + addValue;
    if (templateInfo.Attack)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13")
      ] = templateInfo.Attack + addValue;
    if (templateInfo.Defence)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14")
      ] = templateInfo.Defence + addValue;
    if (templateInfo.MagicAttack)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15")
      ] = templateInfo.MagicAttack + addValue;
    if (templateInfo.MagicDefence)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16")
      ] = templateInfo.MagicDefence + addValue;
    if (templateInfo.ForceHit)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10")
      ] = templateInfo.ForceHit + addValue;
    if (templateInfo.Live)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11")
      ] = templateInfo.Live + addValue;
    if (templateInfo.Parry)
      propertyObject[
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19")
      ] = templateInfo.Parry + addValue;
    return propertyObject;
  }

  public get activedNum(): number {
    return this._activedNum;
  }

  private get thane() {
    return ArmyManager.Instance.thane;
  }
}
