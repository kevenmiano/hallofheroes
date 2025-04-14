import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import LayerMgr from "../../../core/layer/LayerMgr";
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { ArrayUtils } from "../../../core/utils/ArrayUtils";
import { t_s_heroaiData } from "../../config/t_s_heroai";
import { t_s_herotemplateData } from "../../config/t_s_herotemplate";
import { t_s_pawntemplateData } from "../../config/t_s_pawntemplate";
import {
  BattleType,
  FaceType,
  RoleType,
  SideType,
} from "../../constant/BattleDefine";
import { ConfigType } from "../../constant/ConfigDefine";
import { BattleEvent } from "../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../constant/UIDefine";
import { BattlePropItem } from "../../datas/BattlePropItem";
import { TrailPropInfo } from "../../datas/TrailPropInfo";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SocketGameReader } from "../../manager/SocketGameReader";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { EnterBattleController } from "../control/EnterBattleController";
import { BattleCooldownModel } from "../data/BattleCooldownModel";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { PawnRoleInfo } from "../data/objects/PawnRoleInfo";
import { PetRoleInfo } from "../data/objects/PetRoleInfo";
import { ResourceModel } from "../data/ResourceModel";
import { RoleFigureModel } from "../data/RoleFigureModel";
import { SkillData } from "../data/SkillData";
import { BattleRecordReader } from "../record/BattleRecordReader";
import { SkillResLoaderVO } from "../skillsys/loader/SkillResLoaderVO";
import { SkillResourceLoader } from "../skillsys/loader/SkillResourceLoader";
import { BattleUtils } from "../utils/BattleUtils";
import { BattleTransactionManager } from "./BattleTransactionManager";
import { TransactionBase } from "./TransactionBase";

//@ts-expect-error: External dependencies
import BattlePrepareMsg = com.road.yishi.proto.battle.BattlePrepareMsg;

//@ts-expect-error: External dependencies
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;

//@ts-expect-error: External dependencies
import CoolDownMsg = com.road.yishi.proto.battle.CoolDownMsg;

//@ts-expect-error: External dependencies
import HeroMsg = com.road.yishi.proto.battle.HeroMsg;

//@ts-expect-error: External dependencies
import SoldierMsg = com.road.yishi.proto.battle.SoldierMsg;
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { SecretManager } from "../../manager/SecretManager";
import { t_s_secreteventData } from "../../config/t_s_secretevent";
import SecretModel from "../../datas/secret/SecretModel";
/**
 * 创建战斗
 * @author yuanzhan.yu
 */
export class CreateGameTransaction extends TransactionBase {
  private _battlePkgs: any[] = [];

  constructor() {
    super();

    this.addHandler();
  }

  private addHandler() {
    NotificationManager.Instance.addEventListener(
      BattleEvent.BATTLE_COMPLETE,
      this.onBattleComplete,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_BATTLE_REPORT,
      this,
      this.onBattleInfoResultHandler,
    );
  }

  private onBattleComplete(event: BattleEvent) {
    this._battlePkgs.shift();
    Logger.base(
      "[CreateGameTransaction]战斗完成 是否进行下一场战斗",
      this._battlePkgs.length > 0,
    );
    if (this._battlePkgs.length > 0) {
      this._pkg = this._battlePkgs[0];
      this.startBattle();
    }
  }

  private onBattleInfoResultHandler(pkg: PackageIn) {
    const reportMsg = pkg.readBody(BattleReportMsg) as BattleReportMsg;
    if (this._battlePkgs.length > 0) {
      for (let index = this._battlePkgs.length - 1; index >= 0; index--) {
        const preparePkg = this._battlePkgs[index];
        const prepareMsg = preparePkg.readBody(
          BattlePrepareMsg,
        ) as BattlePrepareMsg;
        // Logger.warn("[CreateGameTransaction]队列中的battleId=", prepareMsg.battleId);
        if (reportMsg.battleId == prepareMsg.battleId) {
          Logger.warn(
            "[CreateGameTransaction]服务端战斗已经结束, 移除未执行的战斗",
            prepareMsg.battleId,
            "当前战斗",
            BattleManager.Instance.battleModel &&
              BattleManager.Instance.battleModel.battleId,
          );
          this._battlePkgs.splice(index, 1);
        }
      }
    }
  }

  public handlePackage() {
    this._battlePkgs.push(this._pkg);
    const prepareMsg = this._pkg.readBody(BattlePrepareMsg) as BattlePrepareMsg;
    Logger.base(
      "🔥新战斗 准备加载战斗资源",
      prepareMsg.battleId,
      Laya.Browser.now(),
    );
    if (this._battlePkgs.length > 1) {
      let desc: string = LangManager.Instance.GetTranslation(
        "battle.transaction.CreateGameTransaction.desc",
      );
      Logger.warn(
        "[CreateGameTransaction]收到创建战斗协议,但当前正在战斗状态中!",
      );
      return;
    }

    if (SceneManager.Instance.currentType == SceneType.PVP_ROOM_SCENE) {
      let msg: BattlePrepareMsg = this._pkg.readBody(
        BattlePrepareMsg,
      ) as BattlePrepareMsg;
      FrameCtrlManager.Instance.open(EmWindow.PvpPreviewWnd, msg.heros);
      Laya.timer.once(3000, this, this.startBattle);
    } else if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      // 【【战斗】玩家组队战斗时会有卡住无法进入战斗场景的现象, 详见描述、视频】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001045513
      Laya.timer.once(3000, this, this.startBattle);
    } else {
      this.startBattle();
    }
  }

  private startBattle() {
    Logger.base("🔥新战斗 startBattle");
    NotificationManager.Instance.addEventListener(
      BattleEvent.ENTER_BATTLE_SCENE,
      this.__enterBattleSceneHandler,
      this,
    );
    SkillData.resetIndexId();
    BattleModel.battleUILoaded = false;
    BattleUtils.initRolePos();
    this.initBattleInfo();
    this.initRoleFigureRes();
    this.initBattleSkillRes();
    this.initBattleManager();
  }

  private initBattleInfo() {
    let gameInfo: BattleModel = new BattleModel();
    BattleManager.Instance.model = gameInfo;
    BattleManager.Instance.resourceModel = new ResourceModel();

    let msg: BattlePrepareMsg = this._pkg.readBody(
      BattlePrepareMsg,
    ) as BattlePrepareMsg;

    gameInfo.battleId = msg.battleId;
    gameInfo.mapId = msg.mapTempId;
    gameInfo.useWay = msg.useWay; //类型0-普通战斗,1-增援战斗
    gameInfo.battleType = msg.battleType; //战斗类型（世界boss, 挑战, 多人战, 试练战等）
    gameInfo.reinforceWave = 3; //增援总批数
    gameInfo.reinforceWave = msg.reinforceCount; //增援总批数
    gameInfo.currentReinforceWave = msg.currentReinforce; //当前增援批数
    gameInfo.battleCapity = msg.battleCapity; //1为单人本    4 为多人本
    gameInfo.hurtUpStart(msg.countDown, msg.damageImprove);

    // 秘境地图跟随在秘境副本中的
    if (WorldBossHelper.checkSecretFb(gameInfo.mapId)) {
      let scereType = SecretModel.getScereType(gameInfo.mapId);
      let secretInfo = SecretManager.Instance.model.getSecretInfo(scereType);
      let secreteventCfg = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_secretevent,
        secretInfo.eventId,
      ) as t_s_secreteventData;
      gameInfo.mapResId = secreteventCfg && secreteventCfg.SceneId;
      if (!gameInfo.mapResId) {
        Logger.error(
          "战斗地图模板数据获取错误 秘境",
          msg.mapTempId,
          secretInfo.eventId,
        );
      }
    } else {
      let mapTemp = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_map,
        msg.mapTempId,
      );
      gameInfo.mapResId = mapTemp && mapTemp.BattleGround;
      if (!gameInfo.mapResId) {
        Logger.error("战斗地图模板数据获取错误", msg.mapTempId);
      }
    }
    gameInfo.isSelfCharge = msg.needAnimation; //是否显示突击
    gameInfo.isNoCharge = !msg.hasAssault; //是否不存在突击和反击
    gameInfo.selfSide = msg.side;
    if (BattleRecordReader.inRecordMode) {
      this.refreshSelfSide(gameInfo, msg);
    }
    gameInfo.trialLayer = msg.currentWave; //试练之塔当前层数
    gameInfo.initAutoFight(msg.attackModel); //是否自动战斗
    gameInfo = this.createPawnRoleInfo(gameInfo, msg);
    gameInfo = this.createHeroRoleInfo(gameInfo, msg); //同时创建英雄和英灵
    gameInfo = this.createPetRoleInfo(gameInfo, msg);
    gameInfo = this.createLookBattleHeroRoleInfo(gameInfo, msg);
    if (!gameInfo.selfHero) {
      //该场战斗里面不存在自己
      return;
    }
    gameInfo.armyInfoLeft.face = gameInfo.armyInfoLeft.face;
    gameInfo.armyInfoRight.face = gameInfo.armyInfoRight.face;
    gameInfo.soldierTemplates = msg.soldierTemplated;
    if (msg.coolDown.length > 0) {
      //技能冷却队列
      Logger.battle("技能冷却队列:: ", msg.coolDown);
      let cdMode: BattleCooldownModel;
      let cdMsg: CoolDownMsg;
      for (let i: number = 0; i < msg.coolDown.length; i++) {
        cdMsg = msg.coolDown[i] as CoolDownMsg;
        cdMode = new BattleCooldownModel();
        cdMode.templateId = cdMsg.templatedId;
        cdMode.cooldown = cdMsg.coolDown / 1000;
        cdMode.appearCoolDown = cdMsg.appearCoolDown / 1000;
        cdMode.coolType = cdMsg.coolType;
        cdMode.start();
        gameInfo.cooldownInfo.push(cdMode);
      }
    }
    if (BattleManager.loginToBattleFlag) {
      gameInfo.isNoCharge = true;
    }
    this.checkFace(gameInfo);
    gameInfo.initAfterRolesAdded();
    msg = null;
  }

  private initBattleManager() {
    BattleTransactionManager.getInstance().setup();
    BattleManager.Instance.initSkillSystem();
    BattleManager.Instance.started = true;
    BattleManager.Instance.setup();
    // BattleLogSystem.clear();
    // KeyBoardRegister.instance.battleFlag = true;
    LayerMgr.Instance.clearnGameDynamic();
    BattleManager.Instance.resourceModel.startLoad();
    EnterBattleController.getInstance().handler();
  }

  /**
   * 添加人物形象资源
   */
  private initRoleFigureRes() {
    let roleList = BattleManager.Instance.model.roleList;
    RoleFigureModel.clear();
    RoleFigureModel.initRoleFigure(roleList);
  }

  /**
   * 添加技能资源
   */
  private initBattleSkillRes() {
    let skillIds: any[] = [];
    this.initPawnSkill(skillIds);
    this.initHeroSkill(skillIds);
    this.initPetSkill(skillIds);
    SkillResourceLoader.loadList = ArrayUtils.unique(
      SkillResourceLoader.loadList,
      "url",
    );
    SkillResourceLoader.soundLoadList = Array.from(
      new Set(SkillResourceLoader.soundLoadList),
    );
    BattleManager.Instance.battleModel.skillIds = skillIds;
  }

  /**
   * 初始化兵加载士兵技能资源
   * @param skillIds
   *
   */
  private initPawnSkill(skillIds: any[]) {
    let pawnSkillIds: any[] = [];
    let model: BattleModel = BattleManager.Instance.battleModel;
    let pId: number;
    let pawnTemp: t_s_pawntemplateData;
    if (model.soldierTemplates) {
      //召唤怪的id列表
      model.soldierTemplates.forEach((pId) => {
        pawnTemp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_pawntemplate,
          pId,
        );
        pawnSkillIds = pawnSkillIds.concat(
          this.getAwakenSkillByAi(pawnTemp.AI),
        ); //召唤怪的ai技能
      });
    }

    model.roleList.forEach((role) => {
      if (role instanceof PawnRoleInfo) {
        //服务器发过来的士兵列表
        let len: number = role.skillIds.length; //服务器发过来的士兵列表里面已经包含士兵的ai技能, 需要加入士兵默认技能
        for (let k: number = 0; k < len; k++) {
          if (pawnSkillIds.indexOf(role.skillIds[k]) == -1) {
            pawnSkillIds.push(role.skillIds[k]);
          }
        }
      }
    });

    pawnSkillIds.forEach((pId) => {
      //将兵的技能放入技能数组.
      if (pId != 0 && skillIds.indexOf(pId) == -1) {
        skillIds.push(pId);
        SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(pId, 2)]);
      }
    });
  }

  /**
   * 初始化兵加载英雄技能资源
   * @param skillIds
   *
   */
  private initHeroSkill(skillIds: any[]) {
    let selfSideSkillIds: any[] = [];
    let selfSkillIds: any[] = [];
    let heroSkillIds: any[] = [];
    let hero: HeroRoleInfo;
    let model: BattleModel = BattleManager.Instance.battleModel;
    let morphSkills: any[] = [
      SkillData.PET_MORPH_SKILL,
      SkillData.PET_UNMORPH_SKILL,
    ];

    let skillId: number;
    model.roleList.forEach((role) => {
      if (role instanceof HeroRoleInfo) {
        hero = <HeroRoleInfo>role;
        //道具技能（符文）
        hero.props.forEach((prop) => {
          if (
            (prop as BattlePropItem).skillTempId != 0 &&
            skillIds.indexOf(prop.skillTempId) == -1
          ) {
            skillIds.push(prop.skillTempId);
            SkillResourceLoader.addSkillVOs([
              new SkillResLoaderVO(prop.skillTempId, 2),
            ]);
          }
        });

        let defaultSkill: number;
        let heroTempInfo: t_s_herotemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_herotemplate,
            hero.templateId,
          );
        if (heroTempInfo) {
          defaultSkill = heroTempInfo.DefaultSkill;
        }
        if (skillIds.indexOf(defaultSkill) == -1) {
          //默认技能
          skillIds.push(defaultSkill);
          heroSkillIds.push(defaultSkill);
          if (hero == model.selfHero) {
            selfSkillIds.push(defaultSkill);
          }
        }

        if (hero.petRoleInfo && hero.petRoleInfo.template) {
          let idArr: any[] = hero.petRoleInfo.template.DefaultSkills;
          idArr.forEach((id) => {
            defaultSkill = parseInt(id);
            if (skillIds.indexOf(defaultSkill) == -1) {
              skillIds.push(defaultSkill);
              SkillResourceLoader.addSkillVOs([
                new SkillResLoaderVO(defaultSkill, 2),
              ]);
            }
          });
        }

        for (
          let k: number = 0;
          k < hero.skillIds.length;
          k++ //英雄技能
        ) {
          if (skillIds.indexOf(hero.skillIds[k]) == -1) {
            skillIds.push(hero.skillIds[k]);
            heroSkillIds.push(hero.skillIds[k]);
          }
          if (hero == model.selfHero) {
            selfSkillIds.push(hero.skillIds[k]);
          }
          if (
            hero.side == model.selfSide &&
            selfSideSkillIds.indexOf(hero.skillIds[k]) == -1
          ) {
            selfSideSkillIds.push(hero.skillIds[k]);
          }
        }
        for (
          let j: number = 0;
          j < hero.trialProps.length;
          j++ //试练技能
        ) {
          let trailProp: TrailPropInfo = hero.trialProps[j];
          if (skillIds.indexOf(trailProp.id) == -1) {
            skillIds.push(trailProp.id);
            heroSkillIds.push(trailProp.id);
          }
          if (hero == model.selfHero) {
            selfSkillIds.push(trailProp.id);
          }
        }

        for (let k = 0; k < hero.petSkillIds.length; k++) {
          //变身后技能
          skillId = hero.petSkillIds[k];
          if (skillIds.indexOf(skillId) == -1) {
            skillIds.push(skillId);
            heroSkillIds.push(skillId);
          }
          if (hero == model.selfHero) {
            selfSkillIds.push(skillId);
          }
        }

        if (hero.petRoleInfo) {
          //觉醒技能
          for (let k = 0; k < morphSkills.length; k++) {
            skillId = morphSkills[k];
            if (skillIds.indexOf(skillId) == -1) {
              skillIds.push(skillId);
              heroSkillIds.push(skillId);
            }
            if (hero == model.selfHero) {
              selfSkillIds.push(skillId);
            }
          }
        }

        heroSkillIds = SkillResourceLoader.getHeroFullSkillIds(heroSkillIds); //获取qte技能

        let sex: number;
        if (hero.type == RoleType.T_NPC_BOSS) {
          sex = 2;
        } else {
          sex = hero.heroInfo.sexs;
        }

        heroSkillIds.forEach((heroSkillId) => {
          SkillResourceLoader.addSkillVOs([
            new SkillResLoaderVO(heroSkillId, sex),
          ]);
        });
        hero.petSkillIds.forEach((skillId) => {
          SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(skillId, 2)]);
        });
      }
    });
    selfSkillIds = selfSkillIds.concat(
      SkillResourceLoader.getHeroFullSkillIds(selfSkillIds),
    );
    let skillNameIds: any[] = selfSkillIds;
    if (
      model.battleType == BattleType.PET_PK ||
      model.battleType == BattleType.REMOTE_PET_BATLE
    ) {
      skillNameIds = selfSideSkillIds.concat(
        SkillResourceLoader.getHeroFullSkillIds(selfSideSkillIds),
      );
    }
    SkillResourceLoader.addSkillNameIds(skillNameIds);
  }

  private initPetSkill(skillids: any[]) {
    let model: BattleModel = BattleManager.Instance.battleModel;

    let petRoleInfo: PetRoleInfo;
    model.roleList.forEach((role) => {
      if (role instanceof PetRoleInfo) {
        petRoleInfo = <PetRoleInfo>role;
        petRoleInfo.skillIds.forEach((skillId) => {
          if (skillids.indexOf(skillId) == -1) {
            skillids.push(skillId);
            SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(skillId, 2)]);
          }
        });
        let idArr: any[] = petRoleInfo.template.DefaultSkills;
        idArr.forEach((id) => {
          let skillId: number = parseInt(id);
          if (skillids.indexOf(skillId) == -1) {
            skillids.push(skillId);
            SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(skillId, 2)]);
          }
        });
      }
    });
  }

  /**
   * 通过ai获取召唤怪的技能
   * @param ai
   * @return
   *
   */
  private getAwakenSkillByAi(ai: number): any[] {
    let heroAisTemp: t_s_heroaiData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_heroai,
      ai,
    );
    let soldierIds: any[] = [];
    let soldierArr: any[];
    let arr: any[] = [];
    let soldierAi: number;
    let pawnAisTemp: t_s_heroaiData;
    if (heroAisTemp) {
      //Soldiers:XXXX,Y,xxxx为士兵模板id, y为召唤出的士兵的站位
      if (heroAisTemp.Soldiers != null && heroAisTemp.Soldiers != "") {
        soldierArr = heroAisTemp.Soldiers.split("|");
        soldierArr.forEach((soldierInfo) => {
          let pId: number = soldierInfo.split(",")[0];
          if (soldierIds.indexOf(pId) == -1) {
            soldierIds.push(pId);
          }
        });

        soldierIds.forEach((id) => {
          let pawnTemp: t_s_pawntemplateData =
            ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_pawntemplate, id);
          if (pawnTemp) {
            heroAisTemp = ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_heroai,
              pawnTemp.AI,
            );
            if (heroAisTemp) {
              arr = arr.concat(heroAisTemp.getSkills());
            }
          }
        });
      }
    }
    return arr;
  }

  /**
   * 创建部队信息
   * @param gameInfo    战斗模型
   * @param msg 战斗准备数据
   * @return
   *
   */
  private createPawnRoleInfo(
    gameInfo: BattleModel,
    msg: BattlePrepareMsg,
  ): BattleModel {
    let leng: number = msg.soldiers.length;
    let role: PawnRoleInfo;
    let soldier: SoldierMsg;
    for (let i: number = 0; i < leng; i++) {
      soldier = msg.soldiers[i] as SoldierMsg;
      role = SocketGameReader.readPawnRoleInfo(soldier);
      gameInfo.addRole(role);

      role.totalBlood = role.bloodA;
      role.initBloodA = role.bloodA;
    }
    return gameInfo;
  }

  /**
   * 创建战斗中的英雄信息
   * @param gameInfo
   * @param msg
   * @return
   *
   */
  private createHeroRoleInfo(
    gameInfo: BattleModel,
    msg: BattlePrepareMsg,
  ): BattleModel {
    if (gameInfo.isSinglePetPKBattle()) {
      return gameInfo;
    }
    let leng: number = msg.heros.length;
    let role: HeroRoleInfo;
    let heroMsg: HeroMsg;
    let petMsg: HeroMsg;
    for (let i: number = 0; i < leng; i++) {
      heroMsg = msg.heros[i] as HeroMsg;
      petMsg = this.findPetMsgForHero(msg.pets, heroMsg.livingId);

      role = SocketGameReader.readHeroRoleInfo(heroMsg, petMsg);
      Logger.battle(
        "收到战斗英雄列表:" + role.heroInfo.nickName,
        heroMsg,
        petMsg,
        msg.pets,
      );
      gameInfo.addRole(role);
      if (role.petRoleInfo) {
        gameInfo.addRole(role.petRoleInfo);
      }
      heroMsg = null;
      petMsg = null;
    }

    if (
      gameInfo.battleType == BattleType.REMOTE_PET_BATLE ||
      gameInfo.battleType == BattleType.OUT_CITY_WAR_PET_PK ||
      gameInfo.battleType == BattleType.OUT_CITY_WAR_PET_MONSTER_PK
    ) {
      leng = msg.pets.length;
      for (let i = 0; i < leng; i++) {
        petMsg = msg.pets[i] as HeroMsg;
        role = SocketGameReader.readHeroRoleInfo(petMsg, null); //把英灵当做hero
        role.petRoleInfo = SocketGameReader.readPetRoleInfo(petMsg); //记录英灵信息
        role.petRoleInfo.heroRoleInfo = role;
        role.heroInfo.petTemplateId = petMsg.tempId;
        // 英灵竞技、英灵远征 服务器没传英灵名字就用默认的
        if (!role.heroInfo.nickName) {
          role.heroInfo.nickName = role.petRoleInfo.petName;
        }
        if (
          gameInfo.battleType == BattleType.REMOTE_PET_BATLE ||
          gameInfo.battleType == BattleType.OUT_CITY_WAR_PET_PK ||
          gameInfo.battleType == BattleType.OUT_CITY_WAR_PET_MONSTER_PK
        ) {
          role.isPetState = true;
          role.heroInfo.sexs = 2;
        } else {
          // role.isPetFake = true;
        }
        gameInfo.addRole(role);
        petMsg = null;
      }
    } else {
      for (let item of gameInfo.roleList.values()) {
        if (item instanceof HeroRoleInfo) {
          // 服务器没传英雄/BOSS名字读取模板名字
          if (!item.heroInfo.nickName) {
            let temp = ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_herotemplate,
              role.templateId,
            ) as t_s_herotemplateData;
            role.heroInfo.nickName = temp && temp.TemplateNameLang;
          }
        }
      }
    }

    return gameInfo;
  }

  /**
   * 玩家被攻击的回放；如果要支持玩家攻击别人的回放, 还要做修改
   * gameInfo.selfSide保存的是自己side, 回放文件中存的是攻击方的数据, 即msg.side=1,当自己是守方的时候side是2, 所以要修正一下side
   * @param gameInfo
   * @param msg
   * @returns
   */
  private refreshSelfSide(
    gameInfo: BattleModel,
    msg: BattlePrepareMsg,
  ): BattleModel {
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    if (!gameInfo || !playerInfo) return;

    // let leng: number = msg.heros.length;
    // for (let i: number = 0; i < leng; i++) {
    //     let heroMsg = msg.heros[i] as HeroMsg;
    //     // 不能用这个判断,合区后userId、serverName会改变
    //     if (heroMsg.userId == playerInfo.userId && heroMsg.serverName == playerInfo.serviceName) {
    gameInfo.selfSide = SideType.DEFANCE_TEAM;
    //     }
    // }
  }

  /**
   * 只有在英灵竞技调用
   * @param gameInfo
   * @param msg
   * @return
   *
   */
  private createPetRoleInfo(
    gameInfo: BattleModel,
    msg: BattlePrepareMsg,
  ): BattleModel {
    if (gameInfo.isAllPetPKBattle()) {
      let leng: number = msg.pets.length;
      let role: HeroRoleInfo;
      let heroMsg: HeroMsg;
      for (let i: number = 0; i < leng; i++) {
        heroMsg = msg.pets[i] as HeroMsg;
        role = SocketGameReader.readHeroRoleInfo(heroMsg, null); //把英灵当做hero
        role.petRoleInfo = SocketGameReader.readPetRoleInfo(heroMsg); //记录英灵信息
        role.heroInfo.petTemplateId = heroMsg.tempId;
        role.heroInfo.sexs = 2;
        role.isPetState = true;
        // 英灵竞技、英灵远征 服务器没传英灵名字就用默认的
        if (!role.heroInfo.nickName) {
          role.heroInfo.nickName = role.petRoleInfo.petName;
        }
        Logger.battle("收到战斗英灵英雄列表:" + role.roleName);
        gameInfo.addRole(role);
        heroMsg = null;
      }
      return gameInfo;
    } else {
      return gameInfo;
    }
  }

  private createLookBattleHeroRoleInfo(
    gameInfo: BattleModel,
    msg: BattlePrepareMsg,
  ): BattleModel {
    if (gameInfo.isAllPetPKBattle()) {
      let leng: number = msg.watchHeros.length;
      let role: HeroRoleInfo;
      let heroMsg: HeroMsg;
      for (let i: number = 0; i < leng; i++) {
        heroMsg = msg.watchHeros[i] as HeroMsg;
        role = SocketGameReader.readLookHeroRoleInfo(heroMsg, null);
        role.petRoleInfo = SocketGameReader.readPetRoleInfo(heroMsg); //记录英灵信息
        role.heroInfo.petTemplateId = heroMsg.tempId;
        role.heroInfo.sexs = 2;
        role.isPetState = true;
        // 英灵竞技、英灵远征 服务器没传英灵名字就用默认的
        if (!role.heroInfo.nickName) {
          role.heroInfo.nickName = role.petRoleInfo.petName;
        }
        gameInfo.addRole(role, false);
        heroMsg = null;
      }
    }
    return gameInfo;
  }

  private findPetMsgForHero(petMsgList: any[], heroLivingId: number): HeroMsg {
    for (let index = 0; index < petMsgList.length; index++) {
      const petMsg = petMsgList[index];
      if (petMsg.livingId2 == heroLivingId) {
        return petMsg;
      }
    }
    return null;
  }

  /**
   * 设置英雄朝向
   * @param gameInfo
   *
   */
  private checkFace(gameInfo: BattleModel) {
    gameInfo.armyInfoLeft.site = gameInfo.selfSide;
    gameInfo.armyInfoLeft.face = FaceType.LEFT_TEAM;
    gameInfo.armyInfoRight.face = FaceType.RIGHT_TEAM;
    gameInfo.armyInfoRight.site = 3 - gameInfo.selfSide;
  }

  private __enterBattleSceneHandler(e: BattleEvent) {
    NotificationManager.Instance.removeEventListener(
      BattleEvent.ENTER_BATTLE_SCENE,
      this.__enterBattleSceneHandler,
      this,
    );
    this.loadRoleView();
    // this.initResLoad();
  }

  /**
   * 加载战斗资源
   */
  // private initResLoad()
  // {
  //     this.loadRoleView();
  //     this.loadBattleSkill();
  // }

  /**
   * 初始化并加载战斗需要的技能
   * 包括
   * 1.己方英雄技能
   * 2.己方士兵技能
   * 3.对方英雄技能（对方为玩家, 则为玩家英雄技能；对方为boss则为boss的ai技能）
   * 4.对方士兵技能（进入战斗时的士兵技能；可能包含ai召唤的士兵的技能）
   * ai技能包含多种技能
   *
   * 自己的英雄技能需要显示技能名字
   */
  private loadBattleSkill() {
    let skillIds: any[] = [];
    this.initPawnSkill(skillIds);
    this.initHeroSkill(skillIds);
    this.initPetSkill(skillIds);
    SkillResourceLoader.loadList = ArrayUtils.unique(
      SkillResourceLoader.loadList,
      "url",
    );
    BattleManager.Instance.battleModel.skillIds = skillIds;
  }

  /**
   * 初始化兵加载战斗avatar
   * @param gameInfo
   * @param resource
   *
   */
  private loadRoleView() {
    let gameInfo: BattleModel = BattleManager.Instance.battleModel;
    gameInfo.roleList.forEach((roleInfo) => {
      roleInfo && roleInfo.load();
    });
  }

  public getCode(): number {
    return S2CProtocol.U_B_PREPARE;
  }
}
