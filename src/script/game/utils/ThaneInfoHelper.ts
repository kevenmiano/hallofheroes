import ConfigMgr from "../../core/config/ConfigMgr";
import { t_s_runetemplateData } from "../config/t_s_runetemplate";
import { ConfigType } from "../constant/ConfigDefine";
import { JobType } from "../constant/JobType";
import { RuneEvent } from "../constant/event/NotificationEvent";
import { RuneInfo } from "../datas/RuneInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { BaseArmy } from "../map/space/data/BaseArmy";

import ArmyMsg = com.road.yishi.proto.army.ArmyMsg;
import SimpleHeroInfoMsg = com.road.yishi.proto.army.SimpleHeroInfoMsg;
import HeroRuneInfoMsg = com.road.yishi.proto.army.HeroRuneInfoMsg;

export class ThaneInfoHelper {
  /**
   * 同步外城部队信息, 将服务器数据同步到指定对象
   * @param uArmy
   * @param armyMsg
   * @return
   *
   */
  public static readOuterCityArmyInfo(uArmy: BaseArmy, armyMsg: ArmyMsg): any {
    uArmy.nickName = armyMsg.nickName;
    uArmy.type = armyMsg.type;
    uArmy.mapId = armyMsg.mapId;
    uArmy.curPosX = armyMsg.curPosX;
    uArmy.curPosY = armyMsg.curPosY;
    uArmy.state = armyMsg.state;
    uArmy.onVehicle = armyMsg.onVehicle;
    uArmy.curPosX = armyMsg.curPosX;
    uArmy.curPosY = armyMsg.curPosY;
    let thane: ThaneInfo = uArmy.baseHero;
    thane.nickName = armyMsg.nickName;
    thane.templateId = armyMsg.heroTempId;
    thane.consortiaID = armyMsg.consortiaId;
    thane.consortiaName = armyMsg.consortiaName;
    thane.fightingCapacity = armyMsg.fightingCapacity;
    thane.playerOrdeInfo.gpOrder = armyMsg.gpOrder;
    thane.grades = armyMsg.grades;
    thane.vipType = armyMsg.vipType;
    thane.bodyEquipAvata = armyMsg.cloth;
    armyMsg.hasOwnProperty("wing") && (thane.wingAvata = armyMsg.wing);
    thane.armsEquipAvata = armyMsg.arm;
    thane.job = armyMsg.job;
    thane.userId = armyMsg.playerId;
    thane.changeShapeId = armyMsg.changeSharp;
    thane.honer = armyMsg.geste;
    thane.appellId = armyMsg.appellid;
    if (armyMsg.hasOwnProperty("fateSkills")) {
      thane.fateSkill = armyMsg.fateSkills;
    }
    if (armyMsg.hasOwnProperty("mountTempId")) {
      uArmy.mountTemplateId = armyMsg.mountTempId;
    }
    if (armyMsg.hasOwnProperty("mountGrade")) {
      uArmy.mountGrade = armyMsg.mountGrade;
    }
    if (armyMsg.hasOwnProperty("hide")) {
      thane.hideFashion = armyMsg.hide;
    }
    if (armyMsg.hasOwnProperty("fashionCloth")) {
      thane.bodyFashionAvata = armyMsg.fashionCloth;
    }
    if (armyMsg.hasOwnProperty("fashionArm")) {
      thane.armsFashionAvata = armyMsg.fashionArm;
    }
    if (armyMsg.hasOwnProperty("hat")) {
      thane.hairFashionAvata = armyMsg.hat;
    }
    uArmy.petInfo.petTemplateId = armyMsg.petTempId;
    thane.petTemplateId = armyMsg.petTempId;
    if (armyMsg.hasOwnProperty("petName")) {
      uArmy.petInfo.petName = armyMsg.petName;
      thane.petName = armyMsg.petName;
    }
    if (armyMsg.hasOwnProperty("petQuqlity")) {
      uArmy.petInfo.petQuaity = (armyMsg.petQuqlity - 1) / 5 + 1;
      uArmy.petInfo.petTemQuality = armyMsg.petQuqlity;
      thane.petQuaity = (armyMsg.petQuqlity - 1) / 5 + 1;
      thane.temQuality = armyMsg.petQuqlity;
    }
    return uArmy;
  }

  /**
   * 克隆一个部队信息
   * @param uArmy 克隆结果
   * @param armyMsg 目标部队
   * @return
   *
   */
  public static cloneArmyInfo(uArmy: BaseArmy, armyMsg: any): any {
    uArmy.nickName = armyMsg.nickName;
    uArmy.type = armyMsg.type;
    uArmy.mapId = armyMsg.mapId;
    uArmy.curPosX = armyMsg.curPosX;
    uArmy.curPosY = armyMsg.curPosY;
    uArmy.state = armyMsg.state;
    uArmy.mountTemplateId = armyMsg.mountTemplateId;
    uArmy.mountGrade = armyMsg.mountGrade;
    uArmy.onVehicle = armyMsg.onVehicle;
    let thane: ThaneInfo = uArmy.baseHero;
    let thaneMsg: ThaneInfo = armyMsg.baseHero;
    thane.nickName = thaneMsg.nickName;
    thane.templateId = thaneMsg.templateId;
    thane.consortiaID = thaneMsg.consortiaID;
    thane.consortiaName = thaneMsg.consortiaName;
    thane.fightingCapacity = thaneMsg.fightingCapacity;
    thane.playerOrdeInfo.gpOrder = thaneMsg.playerOrdeInfo.gpOrder;
    thane.grades = thaneMsg.grades;
    thane.bodyEquipAvata = thaneMsg.bodyEquipAvata;
    thane.armsEquipAvata = thaneMsg.armsEquipAvata;
    thane.wingAvata = thaneMsg.wingAvata;
    thane.job = thaneMsg.job;
    thane.userId = thaneMsg.userId;
    thane.changeShapeId = thaneMsg.changeShapeId;
    thane.honer = thaneMsg.honer;
    thane.appellId = thaneMsg.appellId;

    thane.hideFashion = thaneMsg.hideFashion;
    thane.bodyFashionAvata = thaneMsg.bodyFashionAvata;
    thane.armsFashionAvata = thaneMsg.armsFashionAvata;
    thane.hairFashionAvata = thaneMsg.hairFashionAvata;
    thane.wingAvata = thaneMsg.wingAvata;

    thane.fateSkill = thaneMsg.fateSkill;
    thane.petTemplateId = thaneMsg.petTemplateId;
    thane.petName = thaneMsg.petName;
    thane.petQuaity = thaneMsg.petQuaity;
    thane.temQuality = thaneMsg.temQuality;

    return uArmy;
  }

  /**
   * 英雄血量更新
   * @param thane
   * @param pkgInfo
   * @param aMsg
   */
  public static readHeroHp(
    thane: ThaneInfo,
    pkgInfo: SimpleHeroInfoMsg,
    aMsg: ArmyMsg = null
  ) {
    thane.beginChanges();
    if (pkgInfo) {
      if (pkgInfo.hasOwnProperty("heroId")) {
        thane.id = pkgInfo.heroId;
      }
      if (pkgInfo.hasOwnProperty("hp")) {
        thane.hp = pkgInfo.hp;
      }
      if (pkgInfo.hasOwnProperty("blood")) {
        thane.blood = pkgInfo.blood;
      }
      if (pkgInfo.hasOwnProperty("bloodId")) {
        thane.bloodId = pkgInfo.bloodId;
      }
    }
    thane.checkFirst();
    thane.commit();
  }

  /**
   * 同步领主信息
   * @param thane 领主信息
   * @param pkgInfo 玩家信息
   * @param aMsg 部队信息
   *
   */
  public static readHeroInfo(
    thane: ThaneInfo,
    pkgInfo: SimpleHeroInfoMsg,
    aMsg: ArmyMsg = null
  ) {
    thane.beginChanges();
    if (aMsg) {
      thane.bodyEquipAvata = aMsg.cloth;
      thane.armsEquipAvata = aMsg.arm;
      thane.wingAvata = aMsg.wing;
      thane.hideFashion = aMsg.hide;
      thane.bodyFashionAvata = aMsg.fashionCloth;
      thane.armsFashionAvata = aMsg.fashionArm;
      thane.hairFashionAvata = aMsg.hat;
      thane.appellId = aMsg.appellid;
    }
    if (pkgInfo) {
      if (pkgInfo.hasOwnProperty("heroId")) {
        thane.id = pkgInfo.heroId;
      }
      if (pkgInfo.hasOwnProperty("hp")) {
        thane.hp = pkgInfo.hp;
      }
      thane.blood = pkgInfo.blood;
      if (pkgInfo.hasOwnProperty("bloodId")) {
        thane.bloodId = pkgInfo.bloodId;
      }
      if (pkgInfo.hasOwnProperty("nickName")) {
        thane.nickName = pkgInfo.nickName;
      }
      if (pkgInfo.hasOwnProperty("tempateId")) {
        thane.templateId = pkgInfo.tempateId;
      }
      if (pkgInfo.hasOwnProperty("headId")) {
        thane.headId = pkgInfo.headId;
      }
      if (pkgInfo.hasOwnProperty("playerId")) {
        thane.userId = pkgInfo.playerId;
      }
      //剩余属性点
      if (pkgInfo.hasOwnProperty("remainPoint")) {
        thane.baseProperty.remainPoint = pkgInfo.remainPoint;
      }
      // 基础点
      if (pkgInfo.hasOwnProperty("basePower")) {
        thane.baseProperty.basePowerPoint = pkgInfo.basePower;
      }
      if (pkgInfo.hasOwnProperty("baseAgility")) {
        thane.baseProperty.baseAgilityPoint = pkgInfo.baseAgility;
      }
      if (pkgInfo.hasOwnProperty("baseIntellect")) {
        thane.baseProperty.baseIntellectPoint = pkgInfo.baseIntellect;
      }
      if (pkgInfo.hasOwnProperty("baseCaptain")) {
        thane.baseProperty.baseCaptainPoint = pkgInfo.baseCaptain;
      }
      if (pkgInfo.hasOwnProperty("basePhysique")) {
        thane.baseProperty.basePhysiquePoint = pkgInfo.basePhysique;
      }
      //自由加点
      if (pkgInfo.hasOwnProperty("powerPoint")) {
        thane.baseProperty.addPowerPoint = pkgInfo.powerPoint;
      }
      if (pkgInfo.hasOwnProperty("agilityPoint")) {
        thane.baseProperty.addAgilityPoint = pkgInfo.agilityPoint;
      }
      if (pkgInfo.hasOwnProperty("intellectPoint")) {
        thane.baseProperty.addIntellectPoint = pkgInfo.intellectPoint;
      }
      if (pkgInfo.hasOwnProperty("physiquePoint")) {
        thane.baseProperty.addPhysiquePoint = pkgInfo.physiquePoint;
      }
      if (pkgInfo.hasOwnProperty("captainPoint")) {
        thane.baseProperty.addCaptainPoint = pkgInfo.captainPoint;
      }
      //总加成属性点
      if (pkgInfo.hasOwnProperty("totalPower")) {
        thane.baseProperty.totalPower = pkgInfo.totalPower;
      }
      if (pkgInfo.hasOwnProperty("totalAgility")) {
        thane.baseProperty.totalAgility = pkgInfo.totalAgility;
      }
      if (pkgInfo.hasOwnProperty("totalIntellect")) {
        thane.baseProperty.totalIntellect = pkgInfo.totalIntellect;
      }
      if (pkgInfo.hasOwnProperty("totalCaptain")) {
        thane.baseProperty.totalCaptain = pkgInfo.totalCaptain;
      }
      if (pkgInfo.hasOwnProperty("totalPhysique")) {
        thane.baseProperty.totalPhysique = pkgInfo.totalPhysique;
      }

      //基础攻击属性
      if (pkgInfo.hasOwnProperty("basePhyAttack")) {
        thane.attackProrerty.basePhyAttack = pkgInfo.basePhyAttack;
      }
      if (pkgInfo.hasOwnProperty("basePhyDefence")) {
        thane.attackProrerty.basePhyDefence = pkgInfo.basePhyDefence;
      }
      if (pkgInfo.hasOwnProperty("baseMagicAttack")) {
        thane.attackProrerty.baseMagicAttack = pkgInfo.baseMagicAttack;
      }
      if (pkgInfo.hasOwnProperty("baseMagicDefence")) {
        thane.attackProrerty.baseMagicDefence = pkgInfo.baseMagicDefence;
      }
      if (pkgInfo.hasOwnProperty("baseForceHit")) {
        thane.attackProrerty.baseForceHit = pkgInfo.baseForceHit;
      }
      if (pkgInfo.hasOwnProperty("baseLive")) {
        thane.attackProrerty.baseLive = pkgInfo.baseLive;
      }
      if (pkgInfo.hasOwnProperty("baseConatArmy")) {
        thane.attackProrerty.baseConatArmy = pkgInfo.baseConatArmy;
      }
      if (pkgInfo.hasOwnProperty("baseParry")) {
        thane.attackProrerty.baseParry = pkgInfo.baseParry;
      }
      //总加成攻击属性
      if (pkgInfo.hasOwnProperty("totalPhyAttack")) {
        thane.attackProrerty.totalPhyAttack = pkgInfo.totalPhyAttack;
      }
      if (pkgInfo.hasOwnProperty("totalPhyDefence")) {
        thane.attackProrerty.totalPhyDefence = pkgInfo.totalPhyDefence;
      }
      if (pkgInfo.hasOwnProperty("totalMagicAttack")) {
        thane.attackProrerty.totalMagicAttack = pkgInfo.totalMagicAttack;
      }
      if (pkgInfo.hasOwnProperty("totalMagicDefence")) {
        thane.attackProrerty.totalMagicDefence = pkgInfo.totalMagicDefence;
      }
      if (pkgInfo.hasOwnProperty("totalForceHit")) {
        thane.attackProrerty.totalForceHit = pkgInfo.totalForceHit;
      }
      if (pkgInfo.hasOwnProperty("totalLive")) {
        thane.attackProrerty.totalLive = pkgInfo.totalLive;
      }
      if (pkgInfo.hasOwnProperty("totalConatArmy")) {
        thane.attackProrerty.totalConatArmy = pkgInfo.totalConatArmy;
      }
      if (pkgInfo.hasOwnProperty("totalParry")) {
        thane.attackProrerty.totalParry = pkgInfo.totalParry;
      }
      if (pkgInfo.hasOwnProperty("baseStrength")) {
        thane.attackProrerty.baseIntensity = pkgInfo.baseStrength;
      }
      if (pkgInfo.hasOwnProperty("totalStrength")) {
        thane.attackProrerty.totalIntensity = pkgInfo.totalStrength;
      } else {
        thane.attackProrerty.totalIntensity = 0;
      }
      if (pkgInfo.hasOwnProperty("baseTenacity")) {
        thane.attackProrerty.baseTenacity = pkgInfo.baseTenacity;
      }
      if (pkgInfo.hasOwnProperty("totalTenacity")) {
        thane.attackProrerty.totalTenacity = pkgInfo.totalTenacity;
      } else {
        thane.attackProrerty.totalTenacity = 0;
      }
      //技能点
      thane.skillCate.beginChange();
      if (pkgInfo.hasOwnProperty("skillPoint")) {
        thane.skillCate.skillPoint = pkgInfo.skillPoint;
      } else {
        thane.skillCate.skillPoint = 0;
      }
      if (pkgInfo.hasOwnProperty("extraSkillPoint")) {
        thane.skillCate.extraSkillPoint = pkgInfo.extraSkillPoint;
      } else {
        thane.skillCate.extraSkillPoint = 0;
      }
      if (pkgInfo.hasOwnProperty("skillScript")) {
        thane.skillCate.skillScript = pkgInfo.skillScript;
      } else {
        thane.skillCate.skillScript = "";
      }
      if (pkgInfo.hasOwnProperty("fastKey")) {
        thane.skillCate.fastKey = pkgInfo.fastKey;
      } else {
        thane.skillCate.fastKey = "";
      }
      if (pkgInfo.hasOwnProperty("skillIndex")) {
        thane.skillCate.skillIndex = pkgInfo.skillIndex;
      } else {
        thane.skillCate.skillIndex = 0;
      }
      if (pkgInfo.hasOwnProperty("isActiveSecond")) {
        thane.skillCate.activeDouble = pkgInfo.isActiveSecond;
      } else {
        thane.skillCate.activeDouble = false;
      }

      //天赋点
      thane.talentData.beginChange();
      if (pkgInfo.hasOwnProperty("talentPoint")) {
        thane.talentData.talentPoint = pkgInfo.talentPoint;
      } else {
        thane.talentData.talentPoint = 0;
      }
      if (pkgInfo.hasOwnProperty("talentGrade")) {
        thane.talentData.talentGrade = pkgInfo.talentGrade;
      }
      thane.talentData.resetUserTalentSkill();
      if (pkgInfo.hasOwnProperty("talentSkill")) {
        thane.talentData.talentSkill = pkgInfo.talentSkill;
      } else {
        thane.talentData.talentSkill = "";
      }
      //符文
      if (pkgInfo.hasOwnProperty("rune")) {
        this.readHeroRuneInfo(thane, pkgInfo);
      }

      thane.fightPos = pkgInfo.fightPos;
      thane.baseProperty.commit();
      thane.attackProrerty.commit();
      thane.skillCate.commit();
      thane.talentData.commit();
      thane.checkFirst();
      thane.commit();
    }
  }

  private static readHeroRuneInfo(
    thane: ThaneInfo,
    pkgInfo: SimpleHeroInfoMsg
  ) {
    if (!pkgInfo.rune) return;
    thane.runeCate.runeScript = pkgInfo.rune.runeKey;
    let len: number = pkgInfo.rune.runeinfo.length;
    let runeMsg: HeroRuneInfoMsg;
    let info: RuneInfo;
    let temp: t_s_runetemplateData;
    for (let i: number = 0; i < len; i++) {
      runeMsg = pkgInfo.rune.runeinfo[i] as HeroRuneInfoMsg;
      temp = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_runetemplate,
        runeMsg.runeId.toString()
      );
      if (!temp) continue; //以免服务器传过来的数据有问题导致报错
      info = new RuneInfo();
      info.grade = temp.RuneGrade;
      info.runeId = runeMsg.runeId; // 符文ID
      info.runeCurGp = runeMsg.runeGp; // 符文当前经验
      info.swallowCount = runeMsg.swallowCount; // 该符文当天吞噬符文书数量
      info.runeHole = runeMsg.runeHole;
      info.tempHole = runeMsg.tempHole;
      info.newSkillTempId = runeMsg.newSkillTempId; //  >0有效 为符文新的技能模版ID
      info.baseProperties = runeMsg.baseProperties; // 基本属性加成
      // if (info.grade >= 10) {//符石镶嵌或卸载后数据更新
      //     NotificationManager.Instance.sendNotification(RuneEvent.RUNE_UPGRADE, info);
      // }//需求改动后不需要这步了
      thane.runeCate.studiedRuneList.add(info.templateInfo.RuneType, info);
    }
  }

  /**
   * 根据模板id取得职业, 忽略性别
   * @param job
   * @return
   *
   */
  public static getJob(job: number): number {
    if (job <= 3) {
      return job;
    }
    switch (job) {
      case 4:
        return 1;
        break;
      case 5:
        return 2;
        break;
      case 6:
        return 3;
        break;
    }
    return 1;
  }

  public static getSelfJobStr(): string {
    let jobStr: string;
    let job: number = ArmyManager.Instance.thane.templateInfo.Job;
    switch (job) {
      case JobType.WARRIOR:
        jobStr = "warrior";
        break;
      case JobType.HUNTER:
        jobStr = "hunter";
        break;
      case JobType.WIZARD:
        jobStr = "wizard";
        break;
      default:
        jobStr = "wizard";
    }
    return jobStr;
  }

  /**
   * 根据songtype获取士兵的最大等级
   * @param sontype
   * @return
   *
   */
  public static getPawnMaxTempIDBySontype(sontype: number): number {
    return Number(sontype + "80");
  }
}
