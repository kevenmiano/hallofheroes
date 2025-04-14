import { ArmyPawn } from "../../datas/ArmyPawn";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { BaseCastle } from "../../datas/template/BaseCastle";
import TreasureInfo from "../data/TreasureInfo";
import { WildLand } from "../data/WildLand";
import { PosType } from "../space/constant/PosType";
import { MapPhysics } from "../space/data/MapPhysics";
import { PhysicInfo } from "../space/data/PhysicInfo";
import { SystemArmy } from "../space/data/SystemArmy";
import OutCityNodeTypeConstant from "./OutCityNodeTypeConstant";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/17 12:05
 * @ver 1.0
 */
export class CopyNodeDataHelper {
  constructor() {}

  public static cloneMapPhysics(pInfo: MapPhysics): MapPhysics {
    if (pInfo instanceof WildLand) {
      return CopyNodeDataHelper.cloneWildLandData(<WildLand>pInfo);
    } else if (pInfo instanceof BaseCastle) {
      return CopyNodeDataHelper.cloneCastleInfo(<BaseCastle>pInfo);
    } else if (pInfo instanceof TreasureInfo) {
      return CopyNodeDataHelper.cloneTreasureInfo(<TreasureInfo>pInfo);
    }
    return null;
  }

  public static cloneWildLandData(wildInfo: WildLand): WildLand {
    let wInfo: WildLand = new WildLand();
    let pInfo: PhysicInfo = new PhysicInfo();
    let sysArmy: SystemArmy = new SystemArmy();
    pInfo.id = wildInfo.info.id;
    pInfo.types = wildInfo.info.types;
    pInfo.mapId = wildInfo.info.mapId;
    pInfo.grade = wildInfo.info.grade;
    pInfo.state = wildInfo.info.state;
    if (pInfo.types == OutCityNodeTypeConstant.TYPE_MINE) {
      //金矿节点
      wInfo.allNodeInfo = wildInfo.allNodeInfo;
      wInfo.selfOccpuyArr = wildInfo.selfOccpuyArr;
    }
    if (pInfo.types == PosType.OUTERCITY_VEHICLE) {
      pInfo.posX = parseInt(wildInfo.movePosX.toString());
      pInfo.posY = parseInt(wildInfo.movePosY.toString());
    } else {
      pInfo.posX = wildInfo.info.posX;
      pInfo.posY = wildInfo.info.posY;
    }
    wInfo.types = wildInfo.types;
    wInfo.nodeId = wildInfo.nodeId;
    wInfo.pushPlayer = wildInfo.pushPlayer;
    wInfo.leftTime = wildInfo.leftTime;
    wInfo.protectPlayer = wildInfo.protectPlayer;
    wInfo.targetPosX = wInfo.targetPosX;
    wInfo.targetPosY = wInfo.targetPosY;
    wInfo.templateId = wildInfo.templateId;
    wInfo.refreshTime = wildInfo.refreshTime;
    wInfo.pushStatus = wildInfo.pushStatus;
    wInfo.protectStatus = wildInfo.protectStatus;
    wInfo.fightUserIdArray = wildInfo.fightUserIdArray;
    pInfo.occupyPlayerId = wildInfo.info.occupyPlayerId;
    pInfo.occupyPlayerName = wildInfo.info.occupyPlayerName;
    pInfo.occupyLeagueName = wildInfo.info.occupyLeagueName;
    pInfo.occupyLeagueConsortiaId = wildInfo.info.occupyLeagueConsortiaId;
    wInfo.createDate = wildInfo.createDate;
    wInfo.curArmyId = wildInfo.curArmyId;
    wInfo.info = pInfo;
    if (wildInfo.ownSysArmy) {
      CopyNodeDataHelper.cloneHeroInfo(
        sysArmy.baseHero,
        wildInfo.ownSysArmy.baseHero,
      );
      for (let i: number = 0; i < 2; i++) {
        let sysPawn: ArmyPawn = sysArmy.getPawnByIndex(i);
        let wMsg: ArmyPawn = wildInfo.ownSysArmy.getPawnByIndex(i);
        if (wMsg) {
          sysPawn.id = wMsg.id;
          sysPawn.armyId = wMsg.armyId;
          sysPawn.templateId = wMsg.templateId;
          sysPawn.ownPawns = wMsg.ownPawns;
        } else if (sysPawn) {
          sysArmy.removeArmyPawnCountByIndex(i, sysPawn.ownPawns);
        }
      }
    }
    wInfo.ownSysArmy = sysArmy;
    wInfo.commit();
    return wInfo;
  }

  private static cloneHeroInfo(
    thane: ThaneInfo,
    pkgInfo: ThaneInfo,
  ): ThaneInfo {
    thane.beginChanges();

    thane.id = pkgInfo.id;
    thane.nickName = pkgInfo.nickName;
    thane.templateId = pkgInfo.templateId;
    thane.userId = pkgInfo.userId;
    thane.hp = pkgInfo.hp;
    thane.blood = pkgInfo.blood;
    thane.bloodId = pkgInfo.bloodId;

    thane.baseProperty.remainPoint = pkgInfo.baseProperty.remainPoint;
    thane.baseProperty.basePowerPoint = pkgInfo.baseProperty.basePowerPoint;
    thane.baseProperty.baseAgilityPoint = pkgInfo.baseProperty.baseAgilityPoint;
    thane.baseProperty.baseIntellectPoint =
      pkgInfo.baseProperty.baseIntellectPoint;
    thane.baseProperty.baseCaptainPoint = pkgInfo.baseProperty.baseCaptainPoint;
    thane.baseProperty.basePhysiquePoint =
      pkgInfo.baseProperty.basePhysiquePoint;
    //自由加点
    thane.baseProperty.addPowerPoint = pkgInfo.baseProperty.addPowerPoint;
    thane.baseProperty.addAgilityPoint = pkgInfo.baseProperty.addAgilityPoint;
    thane.baseProperty.addIntellectPoint =
      pkgInfo.baseProperty.addIntellectPoint;
    thane.baseProperty.addPhysiquePoint = pkgInfo.baseProperty.addPhysiquePoint;
    thane.baseProperty.addCaptainPoint = pkgInfo.baseProperty.addCaptainPoint;
    //总加成属性点
    thane.baseProperty.totalPower = pkgInfo.baseProperty.totalPower;
    thane.baseProperty.totalAgility = pkgInfo.baseProperty.totalAgility;
    thane.baseProperty.totalIntellect = pkgInfo.baseProperty.totalIntellect;
    thane.baseProperty.totalCaptain = pkgInfo.baseProperty.totalCaptain;
    thane.baseProperty.totalPhysique = pkgInfo.baseProperty.totalPhysique;

    //基础攻击属性
    thane.attackProrerty.basePhyAttack = pkgInfo.attackProrerty.basePhyAttack;
    thane.attackProrerty.basePhyDefence = pkgInfo.attackProrerty.basePhyDefence;
    thane.attackProrerty.baseMagicAttack =
      pkgInfo.attackProrerty.baseMagicAttack;
    thane.attackProrerty.baseMagicDefence =
      pkgInfo.attackProrerty.baseMagicDefence;
    thane.attackProrerty.baseForceHit = pkgInfo.attackProrerty.baseForceHit;
    thane.attackProrerty.baseLive = pkgInfo.attackProrerty.baseLive;
    thane.attackProrerty.baseConatArmy = pkgInfo.attackProrerty.baseConatArmy;
    thane.attackProrerty.baseIntensity = pkgInfo.attackProrerty.baseIntensity;
    thane.attackProrerty.baseTenacity = pkgInfo.attackProrerty.baseTenacity;
    //总加成攻击属性
    thane.attackProrerty.totalPhyAttack = pkgInfo.attackProrerty.totalPhyAttack;
    thane.attackProrerty.totalPhyDefence =
      pkgInfo.attackProrerty.totalPhyDefence;
    thane.attackProrerty.totalMagicAttack =
      pkgInfo.attackProrerty.totalMagicAttack;
    thane.attackProrerty.totalMagicDefence =
      pkgInfo.attackProrerty.totalMagicDefence;
    thane.attackProrerty.totalForceHit = pkgInfo.attackProrerty.totalForceHit;
    thane.attackProrerty.totalLive = pkgInfo.attackProrerty.totalLive;
    thane.attackProrerty.totalConatArmy = pkgInfo.attackProrerty.totalConatArmy;
    thane.attackProrerty.totalIntensity = pkgInfo.attackProrerty.totalIntensity;
    thane.attackProrerty.totalTenacity = pkgInfo.attackProrerty.totalTenacity;
    //技能点
    thane.skillCate.beginChange();
    thane.skillCate.skillPoint = pkgInfo.skillCate.skillPoint;
    thane.skillCate.skillScript = pkgInfo.skillCate.skillScript;
    thane.skillCate.fastKey = pkgInfo.skillCate.fastKey;
    thane.fightPos = pkgInfo.fightPos;
    thane.baseProperty.commit();
    thane.attackProrerty.commit();
    thane.skillCate.commit();
    thane.commit();
    return thane;
  }

  public static cloneCastleInfo(cInfo: BaseCastle): BaseCastle {
    let castleInfo: BaseCastle = new BaseCastle();
    let pInfo: PhysicInfo = new PhysicInfo();
    castleInfo.defenceLeftTime = cInfo.defenceLeftTime;
    pInfo.id = cInfo.info.id;
    pInfo.mapId = cInfo.info.mapId;
    pInfo.occupyLeagueName = cInfo.info.occupyLeagueName;
    pInfo.occupyPlayerId = cInfo.info.occupyPlayerId;
    pInfo.occupyPlayerName = cInfo.info.occupyPlayerName;
    pInfo.posX = cInfo.info.posX;
    pInfo.posY = cInfo.info.posY;
    pInfo.state = cInfo.info.state;
    pInfo.names = cInfo.info.names;
    pInfo.types = cInfo.info.types;
    castleInfo.templateId = cInfo.templateId;
    castleInfo.info = pInfo;
    return castleInfo;
  }

  public static cloneTreasureInfo(info: TreasureInfo): TreasureInfo {
    let treasureInfo: TreasureInfo = new TreasureInfo();
    treasureInfo.id = info.id;
    treasureInfo.mapId = info.mapId;
    treasureInfo.templateId = info.templateId;
    let pInfo: PhysicInfo;
    pInfo = new PhysicInfo();
    pInfo.posX = info.posX;
    pInfo.posY = info.posY;
    pInfo.types = info.type;
    pInfo.occupyPlayerId = info.info.occupyPlayerId;
    pInfo.occupyPlayerName = info.info.occupyPlayerName;
    pInfo.occupyLeagueConsortiaId = info.info.occupyLeagueConsortiaId;
    pInfo.occupyLeagueName = info.info.occupyLeagueName;
    pInfo.state = 1;
    treasureInfo.info = pInfo;
    return treasureInfo;
  }
}
