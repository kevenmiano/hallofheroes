//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 15:04:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-28 17:06:39
 * @Description: 建筑信息
 * 完全占领：一个建筑的5个争夺点，全部由进攻方占领(可能是多个公会)or防守方占领
 */
import { t_s_buildingtemplateData } from "../../../config/t_s_buildingtemplate";
import { OuterCityWarModel } from "./OuterCityWarModel";
import { OuterCityWarBuildSiteInfo } from "./OuterCityWarBuildSiteInfo";
import { OuterCityWarManager } from "../control/OuterCityWarManager";
import BuildingType from "../../../map/castle/consant/BuildingType";
import {
  EmOuterCityWarBuildSortType,
  EmOuterCityWarCastlePeriodType,
  EmOuterCityWarPlayerState,
} from "../../../constant/OuterCityWarDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityWarEvent } from "../../../constant/event/NotificationEvent";
import LangManager from "../../../../core/lang/LangManager";
import { BooleanType, CampType } from "../../../constant/Const";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { t_s_castlebattlebuildingData } from "../../../config/t_s_castlebattlebuilding";
import Logger from "../../../../core/logger/Logger";

export class OuterCityWarBuildInfo {
  private _sonType: number = 0;
  set sonType(v: number) {
    if (this._sonType != v) {
      this._sonType = v;
      this.fightBuildTemplate = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_castlebattlebuilding,
        this._sonType,
      ) as t_s_castlebattlebuildingData;
    }
  }
  get sonType(): number {
    return this._sonType;
  }
  fightBuildTemplate: t_s_castlebattlebuildingData;

  private _tempId: number = 0;
  set tempId(v: number) {
    if (this._tempId != v) {
      this._tempId = v;
      this.buildTemplate = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_buildingtemplate,
        this._tempId,
      ) as t_s_buildingtemplateData;
    }
  }
  get tempId(): number {
    return this._tempId;
  }
  buildTemplate: t_s_buildingtemplateData;

  petType: number = 0;
  /** 建筑的buff类型 每次城战结束重置*/
  buffType: number = 0;
  /** 建筑的buff类型 随机出的子类型 */
  buffCondition: number = 0;
  /** 完全占领积分 */
  completeOccupyScore: number = 0;
  /** 本建筑完全占领的阵营 */
  completeOccupyCamp: CampType = CampType.Neutrality;

  /** 进攻方攻打此建筑的前置建筑sontype */
  preBuildListAttacker: number[] = [];
  /** 防守方攻打此建筑的前置建筑sontype */
  preBuildListDefencer: number[] = [];
  /** 本建筑有一个前置建筑完全被进攻方占领 */
  preOneCompleteOccupyByAttacker: boolean = true;
  /** 本建筑有一个前置建筑完全被防守方占领 */
  preOneCompleteOccupyByDefencer: boolean = true;
  /** 进攻方攻打此建筑的条件提示 */
  strAttackerAttackBuildTip: string;
  /** 防守方攻打此建筑的条件提示 */
  strDefencerAttackBuildTip: string;

  /** 进攻营地：公会Id */
  attackGuildId: number = 0;
  attackGuildName: string = "";
  /** 进攻营地：公会参战且未被击退的数量 */
  get attackGuildCurCnt(): number {
    return this.fightModel.getGuildPlayerCnt(
      this.attackGuildId,
      false,
      BooleanType.TRUE,
      [EmOuterCityWarPlayerState.FREE, EmOuterCityWarPlayerState.DEFANCE],
    );
  }
  /** 进攻营地：公会参战的数量 */
  get attackGuildTotalCnt(): number {
    return this.fightModel.getGuildPlayerCnt(
      this.attackGuildId,
      false,
      BooleanType.TRUE,
    );
  }

  /** 防守营地：驻防点信息 */
  siteInfoList: OuterCityWarBuildSiteInfo[] = [];

  constructor(sonType: number, tempId: number) {
    this.sonType = sonType;
    this.tempId = tempId;
  }

  /** 检查该建筑的前置节点是否有一个完全占领 */
  public checkPreOneCompleteOccupy() {
    let list1 = this.preBuildListAttacker;
    if (list1.length > 0) {
      let b = false;
      for (let index = 0; index < list1.length; index++) {
        const sontype = list1[index];
        let buildInfo = this.fightModel.buildingInfoMap.get(sontype);
        if (buildInfo) {
          let isCompleteOccupy =
            buildInfo.completeOccupyCamp == CampType.Attack;
          b = b || isCompleteOccupy;
        }
      }
      this.preOneCompleteOccupyByAttacker = b;
    }

    let list2 = this.preBuildListDefencer;
    if (list2.length > 0) {
      let b = false;
      for (let index = 0; index < list2.length; index++) {
        const sontype = list2[index];
        let buildInfo = this.fightModel.buildingInfoMap.get(sontype);
        if (buildInfo) {
          let isCompleteOccupy =
            buildInfo.completeOccupyCamp == CampType.Defence;
          b = b || isCompleteOccupy;
        }
      }
      this.preOneCompleteOccupyByDefencer = b;
    }

    NotificationManager.Instance.dispatchEvent(
      OuterCityWarEvent.BUILD_PRE_COMPLETE_OCCUPY_STATE,
      this,
    );
    // Logger.outcityWar("建筑完全占领状态 建筑类型：" + this.buildName + "，占领阵营：" + this.completeOccupyCamp + "，作为攻击方前置占领：" + this.preOneCompleteOccupyByAttacker + "，作为防守方前置占领：" + this.preOneCompleteOccupyByDefencer)
  }

  public initData() {
    if (!this.isAttackSite) {
      if (this.fightBuildTemplate) {
        this.initPetType();
        this.initSiteInfoList();
        this.initOccupyScore();
        this.initPreBuildList();
      }
    }
    return this;
  }

  /** 初始化前置节点 */
  private initPreBuildList() {
    let cfg = this.fightBuildTemplate;

    if (this.sonType == BuildingType.CASERN) {
      Logger.outcityWar("");
    }
    if (cfg.AttackPreBattleBuilding.length > 0) {
      this.preBuildListAttacker = [];
      let nameArr = [];
      let cfgArr = cfg.AttackPreBattleBuilding.split(",");
      for (let index = 0; index < cfgArr.length; index++) {
        const sontype = Number(cfgArr[index]);
        this.preBuildListAttacker.push(sontype);
        let buildInfo = this.fightModel.buildingInfoMap.get(sontype);
        if (buildInfo) {
          nameArr.push(buildInfo.getBuildName());
        }
      }
      if (nameArr.length > 0) {
        this.strAttackerAttackBuildTip = nameArr.join(
          LangManager.Instance.GetTranslation("public.or"),
        );
      }
    }

    if (cfg.DefendPreBattleBuilding.length > 0) {
      this.preBuildListDefencer = [];
      let nameArr = [];
      let cfgArr = cfg.DefendPreBattleBuilding.split(",");
      for (let index = 0; index < cfgArr.length; index++) {
        const sontype = Number(cfgArr[index]);
        this.preBuildListDefencer.push(sontype);
        let buildInfo = this.fightModel.buildingInfoMap.get(sontype);
        if (buildInfo) {
          nameArr.push(buildInfo.getBuildName());
        }
      }
      if (nameArr.length > 0) {
        this.strDefencerAttackBuildTip = nameArr.join(
          LangManager.Instance.GetTranslation("public.or"),
        );
      }
    }
  }

  private initSiteInfoList() {
    for (let index = 0; index < OuterCityWarModel.BuildSiteCount; index++) {
      this.siteInfoList[index] = new OuterCityWarBuildSiteInfo(this);
      this.siteInfoList[index].orderId = index + 1;
    }
  }

  private initOccupyScore() {
    this.completeOccupyScore = Number(
      this.fightBuildTemplate.CompleteOwnExtraPoint,
    );
    for (let index = 0; index < OuterCityWarModel.BuildSiteCount; index++) {
      let siteInfo = this.siteInfoList[index];
      siteInfo.occupyScore = this.fightBuildTemplate.SingleOwnPoint;
    }
  }

  /** 英灵建筑：该英灵类型计算此建筑buff 配置固定写死 */
  private initPetType() {
    if (this.isPetBuild) {
      this.petType = Number(this.fightBuildTemplate.BattleBuffConditionParam);
    }
  }

  public get buildName() {
    if (this.isAttackSite) {
      if (this.attackGuildId) {
        return this.getAttackGuildName();
      } else {
        if (
          this.fightModel.castleState == EmOuterCityWarCastlePeriodType.Fighting
        ) {
          return LangManager.Instance.GetTranslation("public.notHave");
        } else {
          return this.getBuildName();
        }
      }
    } else {
      return this.getBuildName();
    }
  }

  public getBuildName() {
    return this.buildTemplate && this.buildTemplate.BuildingNameLang;
  }

  public getAttackGuildName() {
    if (this.attackGuildId <= 0) return "";

    let str = "";
    if (this.isRepulsed) {
      str = LangManager.Instance.GetTranslation(
        "public.playerInfo.repulsedState",
      );
    } else {
      str = LangManager.Instance.GetTranslation(
        "public.diagonalSign",
        this.attackGuildCurCnt,
        this.attackGuildTotalCnt,
      );
    }
    return LangManager.Instance.GetTranslation(
      "public.parentheses3",
      this.attackGuildName,
      str,
    );
  }

  public get isRepulsed() {
    if (this.attackGuildId <= 0) return false;
    let guildInfo = this.fightModel.getGuildInfo(this.attackGuildId);
    return guildInfo && guildInfo.guildStatus == 2;
  }

  public get isAttackSite() {
    return !this.isHeroBuild && !this.isPetBuild;
  }

  public get isHeroBuild() {
    return this.buildSortType == EmOuterCityWarBuildSortType.Hero;
  }

  public get isPetBuild() {
    return this.buildSortType == EmOuterCityWarBuildSortType.Pet;
  }

  public get buildSortType() {
    switch (this.sonType) {
      case BuildingType.ATTACK_CAMP_SITE1:
      case BuildingType.ATTACK_CAMP_SITE2:
      case BuildingType.ATTACK_CAMP_SITE3:
      case BuildingType.ATTACK_CAMP_SITE4:
        return EmOuterCityWarBuildSortType.AttackSite;
      default:
        return this.fightBuildTemplate && this.fightBuildTemplate.BattleType;
    }
  }

  private get fightModel(): OuterCityWarModel {
    return OuterCityWarManager.Instance.model;
  }
}
