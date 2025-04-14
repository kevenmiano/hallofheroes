import Logger from "../../core/logger/Logger";
import { ArrayUtils } from "../../core/utils/ArrayUtils";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { BufferDamageData } from "../battle/data/BufferDamageData";
import { DamageData } from "../battle/data/DamageData";
import { HeroRoleInfo } from "../battle/data/objects/HeroRoleInfo";
import { PetRoleInfo } from "../battle/data/objects/PetRoleInfo";
import { HeroRoleView } from "../battle/view/roles/HeroRoleView";
import { PawnRoleView } from "../battle/view/roles/PawnRoleView";
import { PetRoleView } from "../battle/view/roles/PetRoleView";
import { BufferProcessType } from "../constant/BattleDefine";
import { ArmyPawn } from "../datas/ArmyPawn";
import { BattlePropItem } from "../datas/BattlePropItem";
import FriendItemCellInfo from "../datas/FriendItemCellInfo";
import FriendModel from "../datas/model/FriendModel";
import { TrailPropInfo } from "../datas/TrailPropInfo";

//@ts-expect-error: External dependencies
import ArmyMsg = com.road.yishi.proto.army.ArmyMsg;
//@ts-expect-error: External dependencies
import ArmyPawnInfoMsg = com.road.yishi.proto.army.ArmyPawnInfoMsg;
//@ts-expect-error: External dependencies
import PropertyMsg = com.road.yishi.proto.army.PropertyMsg;
//@ts-expect-error: External dependencies
import AttackOrderMsg = com.road.yishi.proto.battle.AttackOrderMsg;
//@ts-expect-error: External dependencies
import BufferMsg = com.road.yishi.proto.battle.BufferMsg;
//@ts-expect-error: External dependencies
import DamageMsg = com.road.yishi.proto.battle.DamageMsg;
//@ts-expect-error: External dependencies
import SoldierMsg = com.road.yishi.proto.battle.SoldierMsg;
//@ts-expect-error: External dependencies
import HeroMsg = com.road.yishi.proto.battle.HeroMsg;
//@ts-expect-error: External dependencies
import TrialInfoMsg = com.road.yishi.proto.battle.TrialInfoMsg;
//@ts-expect-error: External dependencies
import BattleItemMsg = com.road.yishi.proto.battle.BattleItemMsg;
//@ts-expect-error: External dependencies
import RelationPlayerMsg = com.road.yishi.proto.simple.RelationPlayerMsg;
import { BaseArmy } from "../map/space/data/BaseArmy";
import { getdefaultLangageCfg } from "../../core/lang/LanguageDefine";
import { TalentData } from "../datas/playerinfo/TalentData";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { t_s_herotemplateData } from "../config/t_s_herotemplate";

/**
 * @author yuanzhan.yu
 */
export class SocketGameReader {
  /**
   * 同步服务器发过来的部队信息, 包括部队的位置, 所在地图当前状态
   * @param army
   * @param info
   *
   */
  public static readArmyInfo(army: BaseArmy, info: ArmyMsg) {
    army.id = info.armyId;
    army.userId = info.playerId;
    army.nickName = info.nickName;
    army.type = info.type;
    army.mapId = info.mapId;
    army.curPosX = info.curPosX;
    army.curPosY = info.curPosY;
    army.state = info.state;
    army.mountTemplateId = info.mountTempId;
    army.mountGrade = info.mountGrade;
  }

  public static readPawnInfo(ap: ArmyPawn, info: ArmyPawnInfoMsg) {
    for (let i: number = 0; i < 6; i++) {
      let property: PropertyMsg = info.pawnLive[i] as PropertyMsg;
      ap.getPropertyByType(i).bagData = property.bag_Data;
      ap.getPropertyByType(i).starData = property.star_Data;
      ap.getPropertyByType(i).skillData = property.skill_Data;
      ap.getPropertyByType(i).effectData = property.effect_Data;

      ap.getPropertyByType(i).bagPer = property.bag_Per;
      ap.getPropertyByType(i).starPer = property.star_Per;
      ap.getPropertyByType(i).skillPer = property.skill_Per;
      ap.getPropertyByType(i).effectPer = property.effect_Per;
    }
    ap.templateId = info.tempateId;
    ap.ownPawns = info.ownPawns;
    ap.specialAbility = info.specialTempIds;
    ap.tempSpecial = info.comprehednTempIds;
    ap.blessNum = info.blessNum;
    ap.commit();
  }

  public static readArmyPawnInfo($army: any, info: ArmyPawnInfoMsg) {
    let armyId: number = info.armyId;
    let site: number = info.sites;
    let sonType: number = info.sonType;
    let templeId: number = info.tempateId;
    let ap: ArmyPawn = $army.getPawnByIndex(site);
    for (let i: number = 0; i < 6; i++) {
      let property: PropertyMsg = info.pawnLive[i] as PropertyMsg;
      ap.getPropertyByType(i).bagData = property.bag_Data;
      ap.getPropertyByType(i).starData = property.star_Data;
      ap.getPropertyByType(i).skillData = property.skill_Data;
      ap.getPropertyByType(i).effectData = property.effect_Data;

      ap.getPropertyByType(i).bagPer = property.bag_Per;
      ap.getPropertyByType(i).starPer = property.star_Per;
      ap.getPropertyByType(i).skillPer = property.skill_Per;
      ap.getPropertyByType(i).effectPer = property.effect_Per;
    }
    ap.fightPos = info.fightPos;
    ap.armyId = armyId;
    ap.templateId = templeId;
    ap.ownPawns = info.ownPawns;
    ap.specialAbility = info.specialTempIds;
    ap.tempSpecial = info.comprehednTempIds;
    ap.commit();
  }

  public static readBufferII(msg: AttackOrderMsg): BufferDamageData[] {
    let size: number = msg.buffers.length;

    let buffers: BufferDamageData[] = [];
    let buffer: BufferDamageData;

    /*读取buffer的数据*/
    let bufferMsg: BufferMsg;
    for (let i: number = 0; i < size; i++) {
      bufferMsg = msg.buffers[i] as BufferMsg;
      buffer = new BufferDamageData();
      buffer.id = bufferMsg.bufferId;
      buffer.templateId = bufferMsg.templateId;
      buffer.bufferUser = bufferMsg.sourceId; //buffer 使用者 roleId
      buffer.target = bufferMsg.targetId;
      buffer.currentTurn = bufferMsg.curTurn;
      buffer.countWay = bufferMsg.curRound;
      buffer.processType = bufferMsg.seeType;
      buffer.effectiveType = bufferMsg.exeWay;
      buffer.layerCount = bufferMsg.pressedNum;
      buffer.unAblesSillIds = bufferMsg.unSkillIds;
      buffer.isPermanent = bufferMsg.isPermanent;
      buffer.level = bufferMsg.level;
      if (buffer.processType == BufferProcessType.ADD) {
        buffer.curMaxTurn = bufferMsg.maxTurn;
      }

      buffer.damages = [];
      let damageMsg: DamageMsg;
      let damageData: DamageData;
      for (let j: number = 0; j < bufferMsg.damage.length; j++) {
        damageMsg = bufferMsg.damage[j] as DamageMsg;
        buffer.isIcon = damageMsg.hasIcon;
        damageData = this.readDamage(damageMsg);
        buffer.damages.push(damageData);
      }

      buffer.execFrameTime = bufferMsg.execFrame;
      buffers.push(buffer);

      if (Logger.openBattleBuffCon(buffer)) {
        Logger.info(
          "XXX[socketGameReader]readBufferII bufferName=" +
            buffer.getBufferName() +
            ", processType=" +
            bufferMsg.seeType +
            ", templateId= " +
            bufferMsg.templateId +
            ", currentTurn = " +
            bufferMsg.curTurn +
            ", countWay = " +
            bufferMsg.curRound,
        );
      }
    }
    return buffers;
  }

  public static readDamage(damageMsg: DamageMsg): DamageData {
    let damageData: DamageData = new DamageData();
    damageData.bloodType = damageMsg.damageType;
    damageData.damageValue = damageMsg.damageValue; // 当前伤害值
    if (damageMsg.hpLimit) {
      damageData.hpMaxAdd = damageMsg.hpLimit;
    }
    damageData.displayBlood = damageData.damageValue;
    damageData.leftValue = damageMsg.leftValue; // 伤后剩余值
    damageData.extraData = damageMsg.extraData; // 是否爆击
    damageData.target = damageMsg.livingId;
    damageData.damageCount = damageMsg.order;
    for (let drop of damageMsg.dropInfos) {
      damageData.dropList.push(drop);
    }
    return damageData;
  }

  public static readAwakenData(msg: AttackOrderMsg): any[] {
    let data: any[];
    let soldier: SoldierMsg;
    if (msg.awakenSoldiers.length > 0) {
      data = [];
      for (let i: number = 0; i < msg.awakenSoldiers.length; i++) {
        soldier = msg.awakenSoldiers[i] as SoldierMsg;
        data.push(this.readPawnRoleInfo(soldier));
      }
    }
    return data;
  }

  public static readPawnRoleInfo(soldier: SoldierMsg): any {
    let info = Laya.ClassUtils.getClass("PawnRoleInfo");
    let role = new info();
    role.livingId = soldier.livingId;
    role.templateId = soldier.tempId;
    role.armyType = soldier.type;
    role.side = soldier.side;
    role.pos = soldier.pos;

    role.totalBloodA = soldier.maxHp;
    role.bloodA = soldier.hp;
    role.skillIds = soldier.skillId;
    role.maxHp = soldier.maxHp;
    let cdTime: number = soldier.qteTime;
    cdTime += soldier.castTime;
    role.coldDownTime = cdTime;

    role.initView(new PawnRoleView(role));
    return role;
  }

  public static readLookHeroRoleInfo(
    heroMsg: HeroMsg,
    petMsg: HeroMsg,
  ): HeroRoleInfo {
    let bloodA: number;
    let bloodB: number;
    let role: HeroRoleInfo = new HeroRoleInfo();
    role.petLivingId = heroMsg.livingId2;
    role.heroInfo.id = heroMsg.heroId; //领主ID
    role.heroInfo.headId = heroMsg.headId; //领主头像ID
    role.livingId = heroMsg.livingId;
    role.userId = heroMsg.userId;
    role.serverName = heroMsg.serverName;
    role.playerIconId = heroMsg.userPics;
    role.templateId = heroMsg.tempId;
    role.type = heroMsg.type; //英雄类型   3为boss
    role.canTakeDamage = true;

    let multi = heroMsg.multiLanNickName;
    let count = multi.length;
    let lanCfg = getdefaultLangageCfg();
    let lanIndex = lanCfg.index;
    let nickName = heroMsg.nickName;
    for (let index = 0; index < count; index++) {
      let element = multi[index];
      if (lanIndex == element.lan) {
        nickName = element.param.toString();
        break;
      }
    }
    role.heroInfo.nickName = nickName;

    role.heroInfo.grades = heroMsg.grade;
    role.side = heroMsg.side;
    role.pos = heroMsg.pos;
    //			debugTrace("********服务器发送过来英雄站位信息 side:"+ role.side , "       pos:"+role.pos + "*************");
    role.heroInfo.sexs = role.heroInfo.templateInfo.Sexs;
    role.totalBloodA = heroMsg.maxHp;
    bloodA = heroMsg.hp; // 英雄实际血量   是死是活全由他

    role.totalBloodB = heroMsg.initHp2;
    bloodB = heroMsg.hp2;
    role.updateSpMax(heroMsg.spMax);
    role.updateSp(heroMsg.sp, true, false, false);

    role.heroInfo.userId = heroMsg.userId;
    role.heroInfo.armsEquipAvata = heroMsg.slotAvata;
    role.heroInfo.bodyEquipAvata = heroMsg.clothAvate;
    role.heroInfo.cloakAvata = heroMsg.cloakPath;
    role.heroInfo.hairEquipAvata = heroMsg.hairPath;
    role.heroInfo.wingAvata = heroMsg.wingAvata;
    role.heroInfo.bodyFashionAvata = heroMsg.fashionClothAvata;
    role.heroInfo.armsFashionAvata = heroMsg.fashionArmAvata;
    role.heroInfo.hairFashionAvata = heroMsg.hairPath;
    role.heroInfo.fateSkill = heroMsg.fateSkillTempIds;

    role.pawnTempId = heroMsg.pawnTempId;
    role.consortiaId = heroMsg.consortiaId;
    role.resPath = heroMsg.res; //资源路径
    role.needShow = heroMsg.isShow; //该角色是否需要创建视图view  默认false为需要创建
    role.showShadow = heroMsg.hasShadow;
    let cdTime: number = heroMsg.qteTime;
    cdTime += heroMsg.castTime;
    role.coldDownTime = cdTime;

    role.skillIds = ArrayUtils.cloneArray(heroMsg.skillId);
    role.petSkillIds = ArrayUtils.cloneArray(heroMsg.changeSkillId);
    role.props = this.readBattleProps(heroMsg);
    role.trialProps = this.readTrialProps(heroMsg);
    role.talentData = this.readTalentData(heroMsg);
    role.battleServerName = heroMsg.serverName;

    role.refreshEffectInfo();

    role.totalBlood = bloodA;
    role.initBloodA = bloodA;
    role.initBloodB = bloodB;
    role.bloodA = bloodA;
    role.bloodB = bloodB;
    if (bloodA <= 0) {
      role.isLiving = false;
    }
    this.readReinforceBuffer(heroMsg, role);
    role.isPetState = heroMsg.isChange;

    role.updateAwaken(heroMsg.awake);

    if (petMsg) {
      role.petRoleInfo = SocketGameReader.readPetRoleInfo(petMsg);
      role.petRoleInfo.heroRoleInfo = role;
      role.heroInfo.petTemplateId = petMsg.tempId;
    }

    role.initView(new HeroRoleView(role));
    if (role.petRoleInfo) {
      role.petRoleInfo.initView(new PetRoleView(role.petRoleInfo));
    }
    return role;
  }

  public static readHeroRoleInfo(
    heroMsg: HeroMsg,
    petMsg: HeroMsg,
  ): HeroRoleInfo {
    let bloodA: number;
    let bloodB: number;
    let role: HeroRoleInfo = new HeroRoleInfo();
    role.petLivingId = heroMsg.livingId2;
    role.heroInfo.id = heroMsg.heroId; //领主ID
    role.heroInfo.headId = heroMsg.headId; //领主头像ID
    role.livingId = heroMsg.livingId;
    role.userId = heroMsg.userId;
    role.serverName = heroMsg.serverName;
    role.playerIconId = heroMsg.userPics;
    role.templateId = heroMsg.tempId;
    role.type = heroMsg.type; //英雄类型   3为boss
    role.canTakeDamage = true;

    let multi = heroMsg.multiLanNickName;
    let count = multi.length;
    let lanCfg = getdefaultLangageCfg();
    let lanIndex = lanCfg.index;
    let nickName = heroMsg.nickName;
    for (let index = 0; index < count; index++) {
      let element = multi[index];
      if (lanIndex == element.lan) {
        nickName = element.param.toString();
        break;
      }
    }
    role.heroInfo.nickName = nickName;

    role.heroInfo.grades = heroMsg.grade;
    role.side = heroMsg.side;
    role.pos = heroMsg.pos;
    //			debugTrace("********服务器发送过来英雄站位信息 side:"+ role.side , "       pos:"+role.pos + "*************");
    role.heroInfo.sexs = role.heroInfo.templateInfo.Sexs;
    role.totalBloodA = heroMsg.maxHp;
    bloodA = heroMsg.hp; // 英雄实际血量   是死是活全由他

    role.totalBloodB = heroMsg.initHp2;
    bloodB = heroMsg.hp2;
    role.updateSpMax(heroMsg.spMax);
    role.updateSp(heroMsg.sp, true, false, false);

    role.heroInfo.userId = heroMsg.userId;
    role.heroInfo.armsEquipAvata = heroMsg.slotAvata;
    role.heroInfo.bodyEquipAvata = heroMsg.clothAvate;
    role.heroInfo.cloakAvata = heroMsg.cloakPath;
    role.heroInfo.hairEquipAvata = heroMsg.hairPath;
    role.heroInfo.wingAvata = heroMsg.wingAvata;
    role.heroInfo.bodyFashionAvata = heroMsg.fashionClothAvata;
    role.heroInfo.armsFashionAvata = heroMsg.fashionArmAvata;
    role.heroInfo.hairFashionAvata = heroMsg.hairPath;
    role.heroInfo.fateSkill = heroMsg.fateSkillTempIds;

    role.pawnTempId = heroMsg.pawnTempId;
    role.consortiaId = heroMsg.consortiaId;
    role.resPath = heroMsg.res; //资源路径
    role.needShow = heroMsg.isShow; //该角色是否需要创建视图view  默认false为需要创建
    role.showShadow = heroMsg.hasShadow;
    let cdTime: number = heroMsg.qteTime;
    cdTime += heroMsg.castTime;
    role.coldDownTime = cdTime;

    role.skillIds = ArrayUtils.cloneArray(heroMsg.skillId);
    role.petSkillIds = ArrayUtils.cloneArray(heroMsg.changeSkillId);
    role.props = this.readBattleProps(heroMsg);
    role.trialProps = this.readTrialProps(heroMsg);
    role.battleServerName = heroMsg.serverName;

    role.refreshEffectInfo();

    role.totalBlood = bloodA;
    role.initBloodA = bloodA;
    role.initBloodB = bloodB;
    role.bloodA = bloodA;
    role.bloodB = bloodB;
    if (bloodA <= 0) {
      role.isLiving = false;
    }
    this.readReinforceBuffer(heroMsg, role);
    role.isPetState = heroMsg.isChange;

    role.updateAwaken(heroMsg.awake);

    if (petMsg) {
      role.petRoleInfo = SocketGameReader.readPetRoleInfo(petMsg);
      role.petRoleInfo.heroRoleInfo = role;
      role.heroInfo.petTemplateId = petMsg.tempId;
    }

    role.initView(new HeroRoleView(role));
    if (role.petRoleInfo) {
      role.petRoleInfo.initView(new PetRoleView(role.petRoleInfo));
    }
    return role;
  }

  public static readPetRoleInfo(msg: HeroMsg): PetRoleInfo {
    let petInfo: PetRoleInfo = new PetRoleInfo();
    petInfo.userLivingId = msg.livingId2;
    petInfo.userId = msg.userId;
    petInfo.petId = msg.heroId;
    petInfo.templateId = msg.tempId;
    let multi = msg.multiLanNickName;
    let count = multi.length;
    let lanCfg = getdefaultLangageCfg();
    let lanIndex = lanCfg.index;
    let nickName = msg.nickName;
    for (let index = 0; index < count; index++) {
      let element = multi[index];
      if (lanIndex == element.lan) {
        nickName = element.param.toString();
        break;
      }
    }
    petInfo.petName = nickName;
    petInfo.quality = Math.floor((msg.petQuality - 1) / 5 + 1);
    petInfo.temQuality = msg.petQuality;
    petInfo.livingId = msg.livingId;
    petInfo.canTakeDamage = true;
    petInfo.grades = msg.grade;
    if (msg.pos) {
      petInfo.pos = msg.pos;
    }
    petInfo.side = msg.side;
    if (msg.hp) {
      petInfo.bloodA = msg.hp;
    }
    petInfo.totalBloodA = msg.maxHp;
    petInfo.skillIds = ArrayUtils.cloneArray(msg.skillId);

    return petInfo;
  }

  /**
   * 队友增援 读取场景内英雄buffer信息
   * @param heroMsg
   * @param role
   *
   */
  public static readReinforceBuffer(heroMsg: HeroMsg, role) {
    Logger.yyz("收到增援战斗里面原有人物的buff列表: ");
    if (heroMsg.buffers) {
      let length: number = heroMsg.buffers.length;
      let bufferMsg: BufferMsg;
      let buffer: BufferDamageData;
      for (let i: number = 0; i < length; i++) {
        bufferMsg = heroMsg.buffers[i] as BufferMsg;
        Logger.yyz(
          heroMsg.nickName + "拥有buffer:::::::" + bufferMsg.templateId,
        );
        buffer = new BufferDamageData();

        buffer.id = bufferMsg.bufferId;
        buffer.templateId = bufferMsg.templateId;
        buffer.bufferUser = bufferMsg.sourceId; //buffer 使用者 roleId
        buffer.target = bufferMsg.targetId;
        buffer.currentTurn = bufferMsg.curTurn; //剩余回合
        buffer.countWay = bufferMsg.curRound; //当前是第几次.
        buffer.processType = BufferProcessType.ADD;
        buffer.effectiveType = bufferMsg.exeWay;
        buffer.layerCount = bufferMsg.pressedNum;
        buffer.level = bufferMsg.level;
        buffer.unAblesSillIds = bufferMsg.unSkillIds;
        buffer.isPermanent = bufferMsg.isPermanent; //是否是常驻buff
        buffer.damages = [];

        let damageMsg: DamageMsg;
        for (let j: number = 0; j < bufferMsg.damage.length; j++) {
          damageMsg = bufferMsg.damage[j] as DamageMsg;

          buffer.isIcon = damageMsg.hasIcon;
          let damageData: DamageData = new DamageData();
          damageData.bloodType = damageMsg.damageType;
          damageData.damageValue = damageMsg.damageValue; // 当前伤害值
          damageData.displayBlood = damageData.damageValue;
          damageData.leftValue = damageMsg.leftValue; // 伤后剩余值
          damageData.extraData = damageMsg.extraData; // 是否爆击
          damageData.target = damageMsg.livingId;
          damageData.damageCount = damageMsg.order;
          buffer.damages.push(damageData);
        }

        buffer.execFrameTime = bufferMsg.execFrame; //pkg.readInt();

        role.addBuffer(buffer);
      }
    }
  }

  private static readTrialProps(heroMsg: HeroMsg): any[] {
    let arr: any[] = [];
    Logger.yyz(
      "英雄: : : " +
        heroMsg.userId +
        "收到试练buff长度: : : " +
        heroMsg.trials.length,
    );
    let trials = heroMsg.trials;
    for (const key in trials) {
      let item: TrialInfoMsg = trials[key] as TrialInfoMsg;
      let info: TrailPropInfo = new TrailPropInfo();
      info.id = item.skillId;
      info.index = item.index;
      info.useCount = item.count;
      info.coolDown = item.param4;
      arr.push(info);
      Logger.yyz("试练buffer序号: : : " + info.index);
    }
    return arr;
  }

  /**
   *
   * @param heroMsg 读取天赋数据
   * @returns
   */
  private static readTalentData(heroMsg: HeroMsg): TalentData {
    let talentData: TalentData = new TalentData();
    talentData.sealOrder = heroMsg.talentSealOrder;
    talentData.lookTalentSkill = heroMsg.skillId;
    return talentData;
  }

  private static readBattleProps(heroMsg: HeroMsg): any[] {
    let arr: any[] = [];
    let prop: BattlePropItem;
    let itemMsg: BattleItemMsg;
    for (let i: number = 0; i < heroMsg.item.length; i++) {
      prop = new BattlePropItem();
      itemMsg = heroMsg.item[i] as BattleItemMsg;
      prop.userId = itemMsg.userId;
      prop.battleId = itemMsg.battleId;
      prop.uItemId = itemMsg.uItemId;
      prop.useCount = itemMsg.count;
      prop.tempId = itemMsg.tempId;
      prop.bagPos = itemMsg.bagPos;
      prop.skillTempId = itemMsg.skillTempId;
      prop.sonType = itemMsg.sonType;

      arr.push(prop);
    }
    return arr;
  }

  public static readSimpleAndSnsInfo(
    pInfo: FriendItemCellInfo,
    msg: RelationPlayerMsg,
  ) {
    pInfo.userId = msg.player.userId;
    pInfo.nickName = msg.player.nickName;
    pInfo.templateId = msg.player.job;
    pInfo.job = msg.player.job;
    pInfo.sexs = msg.player.sexs;
    pInfo.pics = msg.player.pics;
    pInfo.camp = msg.player.camp;
    pInfo.state = msg.player.state;
    pInfo.jewelGrades = msg.player.storeGrade;
    pInfo.consortiaID = msg.player.consortiaID;
    // pInfo.strategy = new Num(Number(msg.player.strategy));
    pInfo.consortiaName = msg.player.consortiaName;
    pInfo.consortiaOffer = msg.player.consortiaOffer;
    pInfo.consortiaTotalOffer = msg.player.consortiaTotalOffer;
    pInfo.consortiaJianse = msg.player.consortiaBuild;
    pInfo.consortiaTotalJianse = msg.player.consortiaTotalBuild;
    pInfo.claimId = msg.player.claimId;
    pInfo.claimName = msg.player.claimName;
    pInfo.grades = msg.player.grades;
    pInfo.gp = msg.player.gp;
    pInfo.repute = msg.player.repute;
    pInfo.logOutTime = DateFormatter.parse(
      msg.player.logOutTime,
      "YYYY-MM-DD hh:mm:ss",
    );
    pInfo.dutyId = msg.player.dutyId;
    pInfo.parameter1 = msg.player.parameter1;
    pInfo.playerOrdeInfo.gpOrder = msg.player.gpOrder;

    pInfo.fightingCapacity = msg.player.fightingCapacity;
    pInfo.matchWin = msg.player.matchWin;
    pInfo.matchFailed = msg.player.matchFailed;
    pInfo.right = msg.player.right;
    pInfo.relation = msg.relation;
    pInfo.groupId = msg.groupId;
    pInfo.type = FriendModel.ITEMTYPE_FRIEND;
    pInfo.friendGp = msg.friendRp;
    pInfo.friendGrade = msg.friendGrade;
    pInfo.frameId = msg.player.frameId;
    if (msg.snsInfo) {
      // if(msg.snsInfo.userId)
      {
        pInfo.snsInfo.userId = msg.snsInfo.userId;
      }
      // if(msg.snsInfo.nickname)
      {
        pInfo.snsInfo.nickName = msg.snsInfo.nickname;
      }
      // if(msg.snsInfo.headId)
      {
        pInfo.snsInfo.headId = msg.snsInfo.headId;
      }
      // if(msg.snsInfo.signDesc)
      {
        pInfo.snsInfo.sign = msg.snsInfo.signDesc;
      }
      // if(msg.snsInfo.sex)
      {
        pInfo.snsInfo.sex = msg.snsInfo.sex;
      }
      // if(msg.snsInfo.birthdayType)
      {
        pInfo.snsInfo.birthdayType = msg.snsInfo.birthdayType;
      }
      // if(msg.snsInfo.birthYear)
      {
        pInfo.snsInfo.birthYear = msg.snsInfo.birthYear;
      }
      // if(msg.snsInfo.birthMonth)
      {
        pInfo.snsInfo.birthMonth = msg.snsInfo.birthMonth;
      }
      // if(msg.snsInfo.birthDay)
      {
        pInfo.snsInfo.birthDay = msg.snsInfo.birthDay;
      }
      // if(msg.snsInfo.starId)
      {
        pInfo.snsInfo.horoscope = msg.snsInfo.starId;
      }
      // if(msg.snsInfo.bloodType)
      {
        pInfo.snsInfo.bloodType = msg.snsInfo.bloodType;
      }
      // if(msg.snsInfo.country)
      {
        pInfo.snsInfo.country = msg.snsInfo.country;
      }
      // if(msg.snsInfo.province)
      {
        pInfo.snsInfo.province = msg.snsInfo.province;
      }
      // if(msg.snsInfo.city)
      {
        pInfo.snsInfo.city = msg.snsInfo.city;
      }
    }
  }
}
