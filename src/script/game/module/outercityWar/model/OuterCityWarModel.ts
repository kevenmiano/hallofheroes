//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-26 14:48:17
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-12 16:53:32
 * @Description:
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Logger from "../../../../core/logger/Logger";
import { ConfigType } from "../../../constant/ConfigDefine";
import OuterCityWarBuildingView from "../view/OuterCityWarBuildingView";
import { OuterCityWarBuildInfo } from "./OuterCityWarBuildInfo";
import { ConsortiaDutyLevel } from "../../consortia/data/ConsortiaDutyLevel";
import { OuterCityWarPlayerInfo } from "./OuterCityWarPlayerInfo";
import { OuterCityWarManager } from "../control/OuterCityWarManager";
import { OuterCityWarBuildSiteInfo } from "./OuterCityWarBuildSiteInfo";
import {
  EmOuterCityWarCastlePeriodType,
  EmOuterCityWarHeroType,
  EmOuterCityWarPlayerState,
} from "../../../constant/OuterCityWarDefine";
import { BooleanType, CampType } from "../../../constant/Const";
import { BaseCastle } from "../../../datas/template/BaseCastle";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import Dictionary from "../../../../core/utils/Dictionary";
import { t_s_castlebattlebuildingskillData } from "../../../config/t_s_castlebattlebuildingskill";
import { OuterCityWarGuildInfo } from "./OuterCityWarGuildInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import { DateTest } from "./DateTest";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ArmyPawn } from "../../../datas/ArmyPawn";
import { t_s_pawntemplateData } from "../../../config/t_s_pawntemplate";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";

export class OuterCityWarModel extends GameEventDispatcher {
  static BattleVictory: boolean = false;
  /** 根据建筑sontype取一个建筑模板 */
  static TempKey = "01";
  /** 每个建筑的占领点数量 */
  static BuildSiteCount = 5;
  /** 进攻公会阵营点数量 */
  static AttackCampSite = 4;
  static MaxEnterWarPetCnt = 3;
  /** 最大防守人数 */
  static MaxDefenceCnt = 30;
  /** 最大进攻人数 */
  static MaxAttackCnt = 20;
  static ShowReplaceTipTime = 30000;
  /** 行动力 */
  ActionPointPrice: number = 100;
  ActionPointBuyGet: number = 200;
  /** 显示的建筑 */
  buildingSontypeList: number[] = [
    101, 301, 402, 501, 901, 1201, 1504, 1506, 1512, 1513, 1514, 1515, 1516,
    1517, 1518, 1519,
  ];
  /** 进攻公会阵营   */
  attackBuildingList: number[] = [1516, 1517, 1518, 1519];
  buildingInfoMap: Map<number, OuterCityWarBuildInfo> = new Map();
  buildingViewMap: Map<number, OuterCityWarBuildingView> = new Map();

  /** 城堡数据  打完还要返回城战界面不能清理 */
  private _castleInfo: BaseCastle;
  set castleInfo(v: BaseCastle) {
    // Logger.outcityWar("设置城堡信息", v)
    this._castleInfo = v;
  }
  get castleInfo(): BaseCastle {
    return this._castleInfo;
  }
  /** 城堡节点 */
  get castleNodeId(): number {
    return this.castleInfo && this.castleInfo.nodeId;
  }
  get castleNodeName(): string {
    return (
      this.castleInfo &&
      this.castleInfo.tempInfo &&
      this.castleInfo.tempInfo.NameLang
    );
  }
  get castleDefenceNpcName(): string {
    return (
      this.castleInfo &&
      this.castleInfo.defenceNpcTemp &&
      this.castleInfo.defenceNpcTemp.TemplateNameLang
    );
  }
  /** 守军怪物积分 守军为NPC的时候服务器主动推送 */
  castleDefenceNpcScore: number = 0;

  /** 攻下某建筑驻点 战斗结束提示：是否放弃之前占领的驻点并占领新攻下的驻点 */
  attackSonType: number = 0;
  attackOrderId: number = 0;

  /** 城堡状态 */
  castleState: number = EmOuterCityWarCastlePeriodType.None;
  /** 城堡当前阶段剩余时间 */
  leftTime: number = 0;

  /** 自己当前城堡的行动力*/
  curCastleActionPoint: number = 0;
  /** 自己公会通知*/
  curCastleNoticeStr: string = "";

  /** 公会信息 */
  guildInfoList: OuterCityWarGuildInfo[] = [];
  /** 玩家信息 key=userId+"_"+heroType */
  playerListMap: Map<string, OuterCityWarPlayerInfo> = new Map();
  selfPlayInfo: OuterCityWarPlayerInfo;

  initConfig() {
    for (let index = 0; index < this.buildingSontypeList.length; index++) {
      let sonType = this.buildingSontypeList[index];

      let tempId = Number(sonType + OuterCityWarModel.TempKey);
      let tempInfo = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_buildingtemplate,
        tempId,
      );
      if (tempInfo) {
        let buildInfo = new OuterCityWarBuildInfo(sonType, tempId);
        this.buildingInfoMap.set(sonType, buildInfo);
      } else {
        Logger.error("建筑模板数据不存在：" + tempId);
      }
    }

    this.buildingInfoMap.forEach((buildInfo) => {
      buildInfo.initData();
    });

    let priceCfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "CastleBattle_ActionPoint_BuyPrice",
    );
    if (priceCfg) {
      this.ActionPointPrice = Number(priceCfg.ConfigValue);
    }
    let numCfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "CastleBattle_ActionPoint_BuyNum",
    );
    if (numCfg) {
      this.ActionPointBuyGet = Number(numCfg.ConfigValue);
    }
    let Cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "CastleBattle_BuildSiteCount",
    );
    if (Cfg && Cfg.ConfigValue) {
      OuterCityWarModel.BuildSiteCount = Number(Cfg.ConfigValue);
    }

    // DateTest.initial()
    Logger.outcityWar("城战数据初时化完成！");
  }

  /** 获取公会信息 */
  public getGuildInfo(guildId: number): OuterCityWarGuildInfo {
    for (let index = 0; index < this.guildInfoList.length; index++) {
      const element = this.guildInfoList[index];
      if (element.guildId == guildId) {
        return element;
      }
    }
    return null;
  }

  /** 获取玩家信息 npc与玩家英雄的ID可能相同 */
  public getPlayerInfo(
    uid: number,
    utype = EmOuterCityWarHeroType.Hero,
  ): OuterCityWarPlayerInfo {
    for (let info of this.playerListMap.values()) {
      if (info.userId == uid && info.heroType == utype) {
        return info;
      }
    }
    return null;
  }

  /**
   * 获取公会列表
   * @param guildId
   * @param isPet
   * @param enterWar 是否参战
   * @param stateList 状态（人物或英灵）
   * @returns
   */
  public getGuildPlayerInfoList(
    guildId: number,
    isPet: boolean = false,
    enterWar?: BooleanType,
    stateList?: EmOuterCityWarPlayerState[],
  ): OuterCityWarPlayerInfo[] {
    let temp = [];
    if (guildId <= 0) return temp;

    for (const info of this.playerListMap.values()) {
      if (info.guildId == guildId) {
        let b1 = true;
        let b2 = true;
        if (enterWar != undefined) {
          b1 = this.checkInCurCastleJoinBattleList(info.userId);
          // Logger.outcityWar("获取玩家列表 参战", b, info.userName, info.enterWar)
        }
        if (stateList != undefined) {
          let state = isPet ? info.statePet : info.state;
          b2 = stateList.indexOf(state) != -1;
          // Logger.outcityWar("获取玩家列表 被击退", b, info.userName, state)
        }
        if (b1 && b2) {
          temp.push(info);
        }
      }
    }
    return temp;
  }

  public getGuildPlayerCnt(
    guildId: number,
    isPet: boolean = false,
    enterWar?: BooleanType,
    stateList?: EmOuterCityWarPlayerState[],
  ): number {
    let temp = this.getGuildPlayerInfoList(guildId, isPet, enterWar, stateList);
    return temp.length;
  }

  /** 获取某个建筑的驻防点英雄信息 */
  public getBuildSitePlayerList(
    sonType: number,
    orderId: number,
  ): OuterCityWarPlayerInfo {
    for (const info of this.playerListMap.values()) {
      if (info.defenseSite == sonType && info.orderId == orderId) {
        return info;
      }
    }
    return null;
  }

  /** 获取公会的所有当前城堡参战玩家 */
  public getCurCastleJoinWarGuildPlayerList(
    guildID: number,
  ): OuterCityWarPlayerInfo[] {
    let temp = [];
    for (const info of this.playerListMap.values()) {
      if (info.guildId == guildID) {
        if (this.checkInCurCastleJoinBattleList(info.userId)) {
          temp.push(info);
        }
      }
    }
    return temp;
  }

  public getAttackDuty(uid: number) {
    let dutyId = this.getGuildDutyId(uid);
    return (
      dutyId == ConsortiaDutyLevel.CHAIRMAN ||
      dutyId == ConsortiaDutyLevel.VICE_CHAIRMAN
    );
  }

  public getSelfAttackDuty() {
    let dutyId = this.playerInfo.dutyId;
    // Logger.outcityWar("自己的公会职责", dutyId)
    return (
      dutyId == ConsortiaDutyLevel.CHAIRMAN ||
      dutyId == ConsortiaDutyLevel.VICE_CHAIRMAN
    );
  }

  public getGuildId(uid: number) {
    let info = this.getPlayerInfo(uid);
    return info && info.guildId;
  }

  public getGuildDutyId(uid: number) {
    let info = this.getPlayerInfo(uid);
    return info && info.guildDutyId;
  }

  /** 检查在参战列表的玩家 所有城堡*/
  // public checkInJoinBattleList(uid: number): boolean {
  //     let playinfo = this.getPlayerInfo(uid);
  //     return playinfo.enterWar == BooleanType.TRUE
  // }

  /** 检查在参战列表的玩家  当前城堡 */
  public checkInCurCastleJoinBattleList(
    uid: number,
    heroType: EmOuterCityWarHeroType = EmOuterCityWarHeroType.Hero,
  ): boolean {
    if (!this.castleNodeId) return;

    let playinfo = this.getPlayerInfo(uid, heroType);
    if (!playinfo) return;

    if (playinfo.camp == CampType.Defence) {
      if (
        playinfo.enterWarCastleNodeId &&
        this.castleNodeId != playinfo.enterWarCastleNodeId
      ) {
        Logger.outcityWar(
          "防守方玩家在别的城作为防守参战, 在本城不属于参战",
          playinfo,
          this.castleNodeId,
        );
        return false;
      }
      return playinfo.enterWar == BooleanType.TRUE;
    } else {
      return playinfo.enterWar == BooleanType.TRUE;
    }
  }

  /** 检查玩家是否被击退 */
  public checkPlayerOut(uid: number) {
    if (!this.checkJoin(uid)) return true;
    let playinfo = this.getPlayerInfo(uid);
    return playinfo.state == EmOuterCityWarPlayerState.REPULSED;
  }

  /** 检查玩家所属公会是否淘汰 */
  public checkPlayerGuildOut(uid: number) {
    if (!this.checkJoin(uid)) return true;

    let guildId = this.getGuildId(uid);
    let guildInfo = this.getGuildInfo(guildId);
    return guildInfo.guildStatus == 2;
  }

  public checkGuildOut(guildId: number) {
    let guildInfo = this.getGuildInfo(guildId);
    if (!guildInfo) return true;
    return guildInfo.guildStatus == 2;
  }

  /** 检查玩家是否参加了此次城战 */
  public checkJoin(uid: number) {
    let guildId = this.getGuildId(uid);
    let guildInfo = this.getGuildInfo(guildId);
    return Boolean(guildInfo);
  }

  /** 检查uid与驻防玩家同公会 */
  public checkSameGuild(uid: number, sitePInfo: OuterCityWarPlayerInfo) {
    // 怪物不存在公会
    if (sitePInfo.heroType == EmOuterCityWarHeroType.Npc) return false;
    // 排除自己
    if (sitePInfo.userId == uid) return false;

    let guildId = this.getGuildId(uid);
    let guild2Id = this.getGuildId(sitePInfo.userId);
    return guildId == guild2Id;
  }

  /** 检查uid是驻防玩家 */
  public checkIsDefencePlayer(uid: number, sitePInfo: OuterCityWarPlayerInfo) {
    if (sitePInfo.heroType == EmOuterCityWarHeroType.Npc) return false;
    return uid == sitePInfo.userId;
  }

  /** 检查uid能否直接占领驻防点 */
  public checkCanBeOccupied(uid: number, siteInfo: OuterCityWarBuildSiteInfo) {
    // let b = !siteInfo.playerInfo && this.checkJoin(uid) && this.checkInJoinBattleList(uid) && !this.checkPlayerGuildOut(uid)
    let b = !siteInfo.playerInfo;
    return b;
  }

  /** 检查驻防点在战斗中 */
  public checkFighting(siteInfo: OuterCityWarBuildSiteInfo) {
    return siteInfo.fightingState;
  }

  /** 检查uid能设置防守某建筑*/
  public checkCanSettingDefence(uid: number) {
    let b1 = this.checkDefenceGuild(this.getGuildId(uid));
    let b2 = this.getAttackDuty(uid);
    let b3 = !this.isCastleFighting;
    let b = b1 && b2 && b3;

    if (!b) {
      if (!b1) {
        // Logger.outcityWar("不能设置防守:" + uid + "不是守方公会")
      }
      if (!b2) {
        // Logger.outcityWar("不能设置防守:" + uid + "没有权限")
      }
      if (!b3) {
        Logger.outcityWar("不能设置防守:" + uid + "在争夺期");
      }
    }
    return b;
  }

  /** 检查公会是否参战 */
  public checkGuildEnterWar(guildId: number) {
    return this.checkDefenceGuild(guildId) || this.checkAttackGuild(guildId);
  }

  public checkDefenceGuild(guildId: number) {
    let guildInfo = this.getGuildInfo(guildId);
    return guildInfo && guildInfo.camp == CampType.Defence;
  }
  public checkAttackGuild(guildId: number) {
    let guildInfo = this.getGuildInfo(guildId);
    return guildInfo && guildInfo.camp == CampType.Attack;
  }

  public getCastleName(nodeId: number) {
    let baseCastle: BaseCastle;
    for (let key in this.outerCityModel.allCastles) {
      let dic: Dictionary = this.outerCityModel.allCastles[key];
      for (let k in dic) {
        baseCastle = dic[k];
        if (baseCastle.info.id == nodeId) {
          return baseCastle.tempInfo && baseCastle.tempInfo.NameLang;
        }
      }
    }
  }

  public getAttackGuildId(sonType: number): number {
    let idx = this.attackBuildingList.indexOf(sonType);
    if (idx == -1) return 0;

    let attackGuildInfoList = this.getAttackGuildInfoList();
    let guildInfo = attackGuildInfoList[idx];
    if (!guildInfo) return 0;
    return guildInfo.guildId;
  }

  public getAttackGuildInfoList(): OuterCityWarGuildInfo[] {
    let attackGuildInfoList: OuterCityWarGuildInfo[] = [];
    for (let index = 0; index < this.guildInfoList.length; index++) {
      const element = this.guildInfoList[index];
      if (element.camp == CampType.Attack) {
        attackGuildInfoList.push(element);
      }
    }
    return attackGuildInfoList;
  }

  public getDefenceGuildInfoList(): OuterCityWarGuildInfo {
    for (let index = 0; index < this.guildInfoList.length; index++) {
      const element = this.guildInfoList[index];
      if (element.camp == CampType.Defence) {
        return element;
      }
    }
  }

  /** 获取玩家在此建筑能否拥有buff */
  public getBuildBuffByUserId(
    userId: number,
    sonType: number,
  ): t_s_castlebattlebuildingskillData {
    let playerInfo = this.getPlayerInfo(userId);

    if (!playerInfo) return null;
    for (let index = 0; index < playerInfo.buffInfoList.length; index++) {
      const buffInfo = playerInfo.buffInfoList[index];
      if (!buffInfo.buffId) continue;
      if (buffInfo.buildId != sonType) continue;

      // let flag = false
      // switch (buffInfo.buffType) {
      //     case 101:
      //         let ap: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
      //         if (ap && ap.templateInfo) {
      //             flag = ap.templateInfo.MasterType == buffInfo.buffCondition;
      //         }
      //         Logger.outcityWar("自己是否符合buff条件101", ap, buffInfo.buffCondition)
      //         break;
      //     case 102:
      //         flag = this.playerInfo.jobMaster == buffInfo.buffCondition;
      //         Logger.outcityWar("自己是否符合buff条件102", this.playerInfo.job, buffInfo.buffCondition)
      //         break;
      //     case 201:
      //         let petFormation = this.playerInfo.petChallengeFormation
      //         if (petFormation) {
      //             let arr = petFormation.split(",")
      //             for (let index = 0; index < arr.length; index++) {
      //                 const petId = Number(arr[index]);
      //                 let petData = this.playerInfo.getPet(petId);
      //                 Logger.outcityWar("自己是否符合buff条件201", petData, buffInfo.buffCondition)
      //                 if (petData && petData.template && petData.template.PetType == buffInfo.buffCondition) {
      //                     flag = true;
      //                     break
      //                 }
      //             }
      //             if (!flag) {
      //                 Logger.outcityWar("自己是否符合buff条件201", "没携带对应系的英灵", petFormation, buffInfo.buffCondition)
      //             }
      //         } else {
      //             Logger.outcityWar("自己是否符合buff条件201", "没带英灵", buffInfo.buffCondition)
      //         }
      //         break;
      // }

      // if (flag) {
      let temp = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_castlebattlebuildingskill,
        buffInfo.buffId,
      ) as t_s_castlebattlebuildingskillData;
      return temp;
      // }
    }

    return null;
  }

  /** 获取建筑默认的buff */
  public getBuildBuffTemplateBySontype(
    sonType: number,
  ): t_s_castlebattlebuildingskillData {
    let temp;
    let cfg = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_castlebattlebuildingskill,
    );
    for (const key in cfg) {
      if (cfg.hasOwnProperty(key)) {
        let item = cfg[key] as t_s_castlebattlebuildingskillData;
        if (item.BattleBuilding == sonType && item.ActiveSkillLevel == 1) {
          temp = item;
          break;
        }
      }
    }
    return temp;
  }

  /** 获取进攻建筑的buff:20~18人时为1级效果，17~15人时为2级效果，5~0人时为10级效果 */
  public getBuildBuffTemplateByPlayerCnt(
    playerCnt: number,
  ): t_s_castlebattlebuildingskillData {
    let targetCnt;
    switch (playerCnt) {
      case 20:
      case 19:
      case 18:
        targetCnt = 20;
        break;
      case 17:
      case 16:
      case 15:
        targetCnt = 17;
        break;
      case 14:
      case 13:
        targetCnt = 14;
        break;
      case 12:
      case 11:
        targetCnt = 12;
        break;
      case 10:
      case 9:
      case 8:
      case 7:
      case 6:
        targetCnt = playerCnt;
        break;
      default:
        targetCnt = 5;
        break;
    }
    let temp;
    let cfg = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_castlebattlebuildingskill,
    );
    for (const key in cfg) {
      if (cfg.hasOwnProperty(key)) {
        let item = cfg[key] as t_s_castlebattlebuildingskillData;
        if (this.attackBuildingList.indexOf(item.BattleBuilding) != -1) {
          if (item.ActiveConditionNum == targetCnt) {
            temp = item;
            break;
          }
        }
      }
    }

    return temp;
  }

  public getPawnTemplateByMastType(mastType: number): t_s_pawntemplateData {
    let temp;
    let cfg = ConfigMgr.Instance.getDicSync(ConfigType.t_s_pawntemplate);
    for (const key in cfg) {
      if (cfg.hasOwnProperty(key)) {
        let item = cfg[key] as t_s_pawntemplateData;
        if (item.MasterType == mastType) {
          temp = item;
          break;
        }
      }
    }
    return temp;
  }

  public getBuildSiteInfo(
    sonType: number,
    orderId: number,
  ): OuterCityWarBuildSiteInfo {
    for (let info of this.buildingInfoMap.values()) {
      if (info.sonType == sonType) {
        for (let index = 0; index < info.siteInfoList.length; index++) {
          const element = info.siteInfoList[index];
          if (element.orderId == orderId) {
            return element;
          }
        }
      }
    }
    return null;
  }

  public get isCastleFighting(): boolean {
    // 测试
    // return true
    return (
      OuterCityWarManager.Instance.model.castleState ==
      EmOuterCityWarCastlePeriodType.Fighting
    );
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public get selfUserId(): number {
    return this.playerInfo.userId;
  }

  public get selfGuildId(): number {
    return this.playerInfo.consortiaID;
  }

  public get selfGuildName(): string {
    return this.playerInfo.consortiaName;
  }

  public get selfGuildDuty(): number {
    return this.playerInfo.dutyId;
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  public resetReplaceTip() {
    this.attackSonType = 0;
    this.attackOrderId = 0;
    OuterCityWarModel.BattleVictory = false;
  }

  public showReplaceTip() {
    if (this.attackSonType <= 0) return;

    if (!OuterCityWarModel.BattleVictory) {
      Logger.outcityWar("驻防点没被攻下");
      this.resetReplaceTip();
      return;
    }

    let siteInfo = this.getBuildSiteInfo(
      this.attackSonType,
      this.attackOrderId,
    );
    Logger.outcityWar(
      "驻防点被攻下 提示放弃原先的占领新攻下的驻点",
      siteInfo && siteInfo.noOccupyState,
    );
    if (siteInfo) {
      Laya.timer.once(
        OuterCityWarModel.ShowReplaceTipTime,
        this,
        this.onShowReplaceTipTimer,
      );
      let content = LangManager.Instance.GetTranslation(
        "outerCityWar.occupyReplace",
      );
      SimpleAlertHelper.Instance.Show(
        null,
        null,
        null,
        content,
        null,
        null,
        (b) => {
          if (b) {
            OuterCityWarManager.Instance.sendOccupyBuildSite(
              this.attackSonType,
              this.attackOrderId,
            );
          } else {
            OuterCityWarManager.Instance.sendUnLockBuildSite(
              this.attackSonType,
              this.attackOrderId,
            );
          }
          this.resetReplaceTip();
          Laya.timer.clear(this, this.onShowReplaceTipTimer);
        },
      );
    } else {
      this.resetReplaceTip();
      Logger.outcityWar("找不到驻防点", this.attackSonType, this.attackOrderId);
    }
  }

  private onShowReplaceTipTimer() {
    SimpleAlertHelper.Instance.Hide();
  }

  public clear() {
    this.resetReplaceTip();
    this.castleDefenceNpcScore = 0;
    this.castleInfo = null;
    for (let index = 0; index < this.buildingSontypeList.length; index++) {
      let sonType = this.buildingSontypeList[index];
      let buildInfo = this.buildingInfoMap.get(sonType);
      if (buildInfo) {
        if (buildInfo.isAttackSite) {
          buildInfo.attackGuildId = 0;
          buildInfo.attackGuildName = "";
        }
      }
    }

    this.guildInfoList = [];
    this.playerListMap.clear();
    this.selfPlayInfo = null;
  }
}
