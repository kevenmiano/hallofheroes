import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { ArmyPawn } from "../datas/ArmyPawn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import {
  ArmyEvent,
  NotificationEvent,
  RuneEvent,
  ServiceReceiveEvent,
  SkillEvent,
  SLGSocketEvent,
  TalentEvent,
} from "../constant/event/NotificationEvent";
import { PlayerManager } from "./PlayerManager";
import { SocketGameReader } from "./SocketGameReader";
import { ThaneInfoHelper } from "../utils/ThaneInfoHelper";
import { BaseArmy } from "../map/space/data/BaseArmy";
import { ArmyType } from "../constant/ArmyType";
import { SkillInfo } from "../datas/SkillInfo";
import LangManager from "../../core/lang/LangManager";
import { RuneOperationCode } from "../constant/RuneOperationCode";
import { RuneInfo } from "../datas/RuneInfo";
import { t_s_runetemplateData } from "../config/t_s_runetemplate";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { FateRotarySkillInfo } from "../datas/FateRotarySkillInfo";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { NotificationManager } from "./NotificationManager";
import Logger from "../../core/logger/Logger";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { MessageTipManager } from "./MessageTipManager";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import { RoleCtrl } from "../module/bag/control/RoleCtrl";
import { TattooHole } from "../module/sbag/tattoo/model/TattooHole";
import NewbieBaseConditionMediator from "../module/guide/mediators/NewbieBaseConditionMediator";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
//@ts-expect-error: External dependencies
import ArmyMsg = com.road.yishi.proto.army.ArmyMsg;
//@ts-expect-error: External dependencies
import ArmyPawnInfoMsg = com.road.yishi.proto.army.ArmyPawnInfoMsg;
//@ts-expect-error: External dependencies
import SimpleHeroInfoMsg = com.road.yishi.proto.army.SimpleHeroInfoMsg;
//@ts-expect-error: External dependencies
import ArmyPawnUpdatedMsg = com.road.yishi.proto.army.ArmyPawnUpdatedMsg;
//@ts-expect-error: External dependencies
import ArmyEditRspMsg = com.road.yishi.proto.army.ArmyEditRspMsg;
//@ts-expect-error: External dependencies
import UpdatedSkillMsg = com.road.yishi.proto.army.UpdatedSkillMsg;
//@ts-expect-error: External dependencies
import HeroFastKeyMsg = com.road.yishi.proto.army.HeroFastKeyMsg;
//@ts-expect-error: External dependencies
import HeroTalentMsg = com.road.yishi.proto.army.HeroTalentMsg;
//@ts-expect-error: External dependencies
import TalentUpGradeMsg = com.road.yishi.proto.army.TalentUpGradeMsg;
//@ts-expect-error: External dependencies
import HeroRuneOpMsg = com.road.yishi.proto.army.HeroRuneOpMsg;
//@ts-expect-error: External dependencies
import HeroRuneMsg = com.road.yishi.proto.army.HeroRuneMsg;
//@ts-expect-error: External dependencies
import HeroRuneInfoMsg = com.road.yishi.proto.army.HeroRuneInfoMsg;
//@ts-expect-error: External dependencies
import FateListMsg = com.road.yishi.proto.fate.FateListMsg;
//@ts-expect-error: External dependencies
import FateInfoMsg = com.road.yishi.proto.fate.FateInfoMsg;
//@ts-expect-error: External dependencies
import TattooHoleRspMsg = com.road.yishi.proto.player.TattooHoleRspMsg;
//@ts-expect-error: External dependencies
import TattooHoleMsg = com.road.yishi.proto.player.TattooHoleMsg;
//@ts-expect-error: External dependencies
import FashionInfoMsg = com.road.yishi.proto.simple.FashionInfoMsg;
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { FashionModel } from "../module/bag/model/FashionModel";
import { FashionManager } from "./FashionManager";

/**
 * 部队管理者, 提供部队, 英雄, 士兵的全局访问
 * 并监听服务器对相应信息的修改
 */
export class ArmyManager extends GameEventDispatcher {
  private static _instance: ArmyManager;

  /**
   * 是否正在编制部队  判断任务完成的条件: 战斗的技巧160
   */
  public get isSorted(): boolean {
    return this._isSorted;
  }

  /**
   * @private
   */
  public set isSorted(value: boolean) {
    if (this._isSorted == value) {
      return;
    }
    if (value) {
      let taskTempId = 160;
      if (
        !NewbieBaseConditionMediator.checkConditionCommon(
          3,
          taskTempId.toString(),
        )
      ) {
        Logger.info("任务栏不存在任务: 战斗的技巧, 不设置编制部队");
        return;
      }
    }
    this._isSorted = value;
    this.dispatchEvent(ArmyEvent.SORT_PAWN, null);
  }

  public static get Instance(): ArmyManager {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  /**
   * 用户部队, 唯一
   */
  public army: BaseArmy;
  /**
   * 城堡士兵列表 , 已经招募, 单未编制到部队
   */
  public castlePawnList: SimpleDictionary;
  /**
   * 兵营士兵列表, 可招募的士兵列表
   */
  public casernPawnList: SimpleDictionary;
  private _isSorted: boolean;
  /**
   * 时装列表
   */
  public fashionList: SimpleDictionary = new SimpleDictionary();

  /**
   * 时装列表消息
   */
  public fashionInfoMsg: FashionInfoMsg;

  public dragonFashionList: SimpleDictionary;

  constructor() {
    super();
    this.army = new BaseArmy();
    this.castlePawnList = new SimpleDictionary();
    this.casernPawnList = new SimpleDictionary();
    this.dragonFashionList = new SimpleDictionary();
  }

  /**
   * 10101-10901对应兵营里面可招募的所有士兵的一级模板
   * 初始化的时候赋值, 保证全局只有一个实例,
   * 但是该士兵不包含已经编辑在部队里面的士兵, 部队里面的士兵单独实例化
   *
   */
  private initPawnList() {
    for (let i: number = 1; i <= 11; i++) {
      let ap: ArmyPawn = new ArmyPawn();
      if (i > 9) {
        ap.templateId = Number("1" + i + "01");
      } else {
        ap.templateId = Number("10" + i + "01");
      }
      if (ap.templateInfo) {
        this.casernPawnList.add(ap.templateInfo.SonType, ap);
        this.castlePawnList.add(ap.templateInfo.SonType, ap);
      }
    }
  }

  public setup() {
    this.initPawnList();
    ServerDataManager.listen(
      S2CProtocol.U_C_SERIAL_ARMY,
      this,
      this.__getArmyListHandler,
    );
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_ARMY_UPDATE_ARMYPAWN,
      this,
      this.__recievePawnListHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ARMY_RECRUITED,
      this,
      this.__recievePawnListHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ARMY_EDIT,
      this,
      this.__armypawnUpdateHander,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PAWN_INFO,
      this,
      this.__pawnLeveupHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HERO_INFO,
      this,
      this.__uHeroInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HERO_HP_UPDATE,
      this,
      this.__heroUpdateHp,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HERO_SETFASTKEY,
      this,
      this.__fastKeySetHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HERO_SKILL_UPGRADE,
      this,
      this.__skillUpgradeHandlker,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HERO_SKILLPOINT_RESET,
      this,
      this.__skillResetHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TALENT_GRADE_UP,
      this,
      this.__talentGradeUpHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TALENT_INFO,
      this,
      this.__changeTalentInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_RUNE_OP,
      this,
      this.__runeOperateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_RUNE_RESET,
      this,
      this.__runeResetHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_FATE_REQUEST,
      this,
      this.__fateGuardListHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TATTOO_RSP,
      this,
      this.__tattooHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_FASHION_INFO,
      this,
      this.__fashionHandler,
    );

    ServerDataManager.Instance.addEventListener(
      SLGSocketEvent.UPDTAE_ARMY,
      this.__updateArmyHandler,
      this,
    );
  }

  /********************sockt监听**********************/
  /**
   *  用户登录时, 收到部队列表的处理
   * @param pkg
   *
   */
  private __getArmyListHandler(pkg: PackageIn) {
    this.__recieveArmyHandler(pkg);
    this.initEvent();
    this.dispatchEvent(ArmyEvent.RECIEVED_ARMY, null);
  }

  /**
   * 更新部队列表, 包括英雄和士兵
   * @param pkg
   */
  private __recieveArmyHandler(pkg: PackageIn) {
    let msg: ArmyMsg = pkg.readBody(ArmyMsg) as ArmyMsg;
    SocketGameReader.readArmyInfo(this.army, msg);
    //士兵
    for (let j: number = 0; j < msg.armyPawn.length; j++) {
      let site: number = (msg.armyPawn[j] as ArmyPawnInfoMsg).sites;
      let sonType: number = (msg.armyPawn[j] as ArmyPawnInfoMsg).sonType;
      let ap: ArmyPawn = this.army.getPawnByIndex(site);
      if (this.getCasernPawn(sonType)) {
        ap.canRecruit = true;
      }

      SocketGameReader.readArmyPawnInfo(
        this.army,
        msg.armyPawn[j] as ArmyPawnInfoMsg,
      );
    }
    //英雄
    if (msg.hasOwnProperty("simpleHeroInfo")) {
      let thane = this.army.baseHero;
      this.thane.consortiaID = msg.consortiaId;
      this.thane.consortiaName = msg.consortiaName;
      this.thane.nickName = msg.nickName;

      if (msg.hasOwnProperty("fightingCapacity")) {
        this.thane.fightingCapacity = msg.fightingCapacity;
        PlayerManager.Instance.currentPlayerModel.playerInfo.fightingCapacity =
          msg.fightingCapacity;
      }
      ThaneInfoHelper.readHeroInfo(
        this.thane,
        msg.simpleHeroInfo as SimpleHeroInfoMsg,
        msg,
      );
    }
    this.army.commit();
  }

  /**
   * 招募士兵
   * @param e
   *
   */
  private __recievePawnListHandler(pkg: PackageIn) {
    //0x0064
    let msg: ArmyPawnUpdatedMsg = pkg.readBody(
      ArmyPawnUpdatedMsg,
    ) as ArmyPawnUpdatedMsg;
    let size: number = msg.armyPawn.length;
    let needDelete: boolean = false;
    let armyPawnInfoMsg: ArmyPawnInfoMsg;
    for (let i: number = 0; i < size; i++) {
      armyPawnInfoMsg = msg.armyPawn[i] as ArmyPawnInfoMsg;
      let armyId: number = armyPawnInfoMsg.armyId;
      let site: number = armyPawnInfoMsg.sites;
      let sonType: number = armyPawnInfoMsg.sonType;
      let templeId: number = armyPawnInfoMsg.tempateId;
      let ap: ArmyPawn = this.getCasernPawn(sonType);
      if (!ap) {
        ap = this.getCastlePawn(templeId, sonType);
      }
      ap.templateId = templeId;
      SocketGameReader.readPawnInfo(ap, armyPawnInfoMsg);
      if (ap.ownPawns <= 0) {
        needDelete = true;
      }
    }
    if (needDelete) {
      this.dispatchEvent(ArmyEvent.ARMY_INFO_CHANGE, null);
    }
  }

  /**
   *  编制部队
   * @param e
   *
   */
  private __armypawnUpdateHander(pkg: PackageIn) {
    let msg: ArmyEditRspMsg = pkg.readBody(ArmyEditRspMsg) as ArmyEditRspMsg;
    if (msg.armyPawn.length == 0) {
      let ap: ArmyPawn = this.army.getPawnByIndex(0);
      if (ap) {
        this.army.removeArmyPawnCountByIndex(0, ap.ownPawns);
      }
    }
    for (let i: number = 0; i < msg.armyPawn.length; i++) {
      SocketGameReader.readArmyPawnInfo(
        this.army,
        msg.armyPawn[i] as ArmyPawnInfoMsg,
      );
    }
    this.army.commit();
  }

  /**
   * 兵种升级
   * @param e
   *
   */
  private __pawnLeveupHandler(pkg: PackageIn) {
    let ap: ArmyPawn = new ArmyPawn();
    let msg: ArmyPawnInfoMsg = pkg.readBody(ArmyPawnInfoMsg) as ArmyPawnInfoMsg;
    ap.templateId = msg.tempateId;
    ap.tempSpecial = msg.comprehednTempIds;
    ap.specialAbility = msg.specialTempIds;
    ap.blessNum = msg.blessNum;
    let sontype: number = msg.sonType;
    this.synchronizationAllArmyPawns(ap);
    this.dispatchEvent(ServiceReceiveEvent.UPGRADE_PAWN_SUCCESS, true, sontype);
  }

  /**
   * 更新部队信息
   * @param armyMsg
   */
  private __updateArmyHandler(armyMsg: ArmyMsg) {
    let uArmy: BaseArmy;
    let armyId: number = armyMsg.armyId;
    let userId: number = armyMsg.playerId;
    if (
      userId == this.thane.userId &&
      (this.army.id == 0 || armyId == this.army.id)
    ) {
      uArmy = this.army;
      if (!uArmy) {
        return;
      }
    } else {
      uArmy = new BaseArmy();
      uArmy.id = armyId;
      uArmy.userId = userId;
    }
    uArmy = ThaneInfoHelper.readOuterCityArmyInfo(uArmy, armyMsg);
    if (
      uArmy.type == ArmyType.ARMY_INVITE ||
      uArmy.type == ArmyType.ARMY_SYSTEM ||
      uArmy.type == ArmyType.ARMY_TYPE_SERIAL
    ) {
      NotificationManager.Instance.sendNotification(
        NotificationEvent.UPDTAE_ARMY,
        uArmy,
      );
    }
  }

  /**
   * 更新英雄信息
   * @param event
   *
   */
  private __uHeroInfoHandler(pkg: PackageIn) {
    let heroMsg: SimpleHeroInfoMsg = pkg.readBody(
      SimpleHeroInfoMsg,
    ) as SimpleHeroInfoMsg;
    ThaneInfoHelper.readHeroInfo(this.thane, heroMsg);
  }

  /**
   * 更新英雄血量
   */
  private __heroUpdateHp(pkg: PackageIn) {
    let heroMsg: SimpleHeroInfoMsg = pkg.readBody(
      SimpleHeroInfoMsg,
    ) as SimpleHeroInfoMsg;
    ThaneInfoHelper.readHeroHp(this.thane, heroMsg);
  }

  /**
   * 技能升级
   * @param e
   *
   */
  private __skillUpgradeHandlker(pkg: PackageIn) {
    let msg: UpdatedSkillMsg = pkg.readBody(UpdatedSkillMsg) as UpdatedSkillMsg;
    let type: number = msg.type; //0 普通技能  1 天赋技能
    let tempId: number = 0;
    let index: number = 0;
    let info: SkillInfo;
    if (type == 0) {
      tempId = msg.templateId;
      index = msg.index;
      info = this.thane.skillCate.allSkillList[index];
      if (tempId != 0) {
        info.templateId = tempId;
        info.grade = info.templateInfo.Grades;
        info.commit();
      } else {
        try {
          info.reset();
        } catch {
          Logger.error("__skillResetHandler  reset错误!");
        }
      }
      NotificationManager.Instance.sendNotification(
        SkillEvent.SKILL_UPGRADE,
        info,
      );
      //yuyuanzhan 这个是干嘛的？
      // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.NOVICE, this.qteSkillGuide, [info]);
    } else if (type == 1) {
      tempId = msg.templateId;
      index = msg.index;
      info = this.thane.talentData.allTalentList[index];
      if (tempId != 0) {
        info.templateId = tempId;
        info.grade = info.templateInfo.Grades;
        info.commit(1);
      } else {
        try {
          info.reset();
        } catch {
          Logger.error("__skillResetHandler  reset错误!");
        }
      }
      NotificationManager.Instance.sendNotification(
        TalentEvent.TALENT_UPGRADE,
        info,
      );
    } else if (type == 2) {
      //专精技能升级
      tempId = msg.templateId;
      let cfg: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        tempId.toString(),
      );
      if (cfg) {
        let key = cfg.MasterType + "_" + msg.index;
        info = this.thane.skillCate.allExtrajobSkillList[key];
        if (tempId != 0) {
          info.templateId = tempId;
          info.grade = info.templateInfo.Grades;
          info.commit();
        }
      } else {
        try {
          info.reset();
        } catch {
          Logger.error("__skillResetHandler  reset错误!");
        }
      }
      NotificationManager.Instance.sendNotification(
        SkillEvent.SKILL_UPGRADE,
        info,
      );
    }
  }

  // private qteSkillGuide(args:any[])
  // {
  //     QteSkillGuide.guide(args[0]);
  // }

  /**
   * 技能洗点
   * @param e
   *
   */
  private __skillResetHandler(pkg: PackageIn) {
    let msg: UpdatedSkillMsg = pkg.readBody(UpdatedSkillMsg) as UpdatedSkillMsg;
    let type: number = msg.type; //0 普通技能  1 天赋技能
    if (type == 0) {
      if (msg.resetResult) {
        let list = this.thane.skillCate.allSkillList;
        for (const key in list) {
          let info: SkillInfo = list[key];
          if (info instanceof SkillInfo) {
            try {
              info.reset();
            } catch {
              Logger.error("__skillResetHandler  reset错误!");
            }
          }
        }
        NotificationManager.Instance.sendNotification(
          SkillEvent.SKILL_RESET,
          null,
        );
      }
    } else if (type == 1) {
      if (msg.resetResult) {
        // this.thane.talentData.talentScript = this.thane.talentData.talentSkill;
        // let list = this.thane.talentData.allTalentList;
        // for (const key in list) {
        //     let talentInfo: SkillInfo = list[key];
        //     if (talentInfo instanceof SkillInfo) {
        //         talentInfo.reset();
        //     }
        // }
        this.thane.talentData.initAllSkill(-1);
        NotificationManager.Instance.sendNotification(
          TalentEvent.TALENT_RESET,
          null,
        );
      }
    }
  }

  /**
   * 设置快捷键
   * @param e
   *
   */
  private __fastKeySetHandler(pkg: PackageIn) {
    let msg: HeroFastKeyMsg = pkg.readBody(HeroFastKeyMsg) as HeroFastKeyMsg;
    this.thane.skillCate.fastKey = msg.fastKey;
    let result: boolean = msg.setResult;
    this.thane.skillCate.commit();
  }

  /**
     * 更新英雄天赋信息 	int32 talent_point = 2;	//天赋点

     * @param event
     *
     */
  protected __changeTalentInfoHandler(pkg: PackageIn) {
    let msg: HeroTalentMsg = pkg.readBody(HeroTalentMsg) as HeroTalentMsg;
    if (this.thane.userId == msg.userId) {
      this.thane.talentData.talentPoint = msg.talentPoint;
      this.thane.talentData.talentGrade = msg.talentGrade;
      this.thane.talentData.currentBranch = msg.currentBranch;
      this.thane.talentData.sealOrder = msg.sealOrder;
      this.thane.talentData.talentSkill = msg.talentSkill;
      this.thane.talentData.is_activeSecond = msg.isActiveSecond;
      this.thane.talentData.talent_index = msg.talentIndex;
      this.dispatchEvent(TalentEvent.UPDATE_TREE, null);
    }
  }

  /**
   *天赋等级升级
   * @param event
   *
   */
  protected __talentGradeUpHandler(pkg: PackageIn) {
    let msg: TalentUpGradeMsg = pkg.readBody(
      TalentUpGradeMsg,
    ) as TalentUpGradeMsg;
    if (msg.upresult) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "this.army.talent.TalentGradeUpSucc",
        ),
      );
      this.dispatchEvent(TalentEvent.TALENT_GRADUP_SUCC, null);
    }
  }

  /**
   * 英雄符文操作返回结果
   * @param event
   *
   */
  protected __runeOperateHandler(pkg: PackageIn) {
    let msg: HeroRuneOpMsg = pkg.readBody(HeroRuneOpMsg) as HeroRuneOpMsg;
    if (msg.count) {
      PlayerManager.Instance.currentPlayerModel.playerInfo.diamondIndex =
        msg.count;
    }
    if (msg.opResult) {
      let heroRuneMsg: HeroRuneMsg = msg.runeInfo as HeroRuneMsg;
      if (msg.opType == RuneOperationCode.RUNE_TAKE) {
        this.thane.runeCate.runeScript = heroRuneMsg.runeKey;
        NotificationManager.Instance.sendNotification(RuneEvent.RUNE_UPGRADE);
      } else {
        if (msg.opType == RuneOperationCode.RUNE_STUDY) {
          let str: string = LangManager.Instance.GetTranslation(
            "armyII.viewII.rune.RuneStudyTipTxt",
          );
          MessageTipManager.Instance.show(str);
        }
        let len: number = heroRuneMsg.runeinfo.length;
        let runeMsg: HeroRuneInfoMsg;
        let info: RuneInfo;
        let temp: t_s_runetemplateData;
        let changeInfo: RuneInfo;
        for (let i: number = 0; i < len; i++) {
          runeMsg = heroRuneMsg.runeinfo[i] as HeroRuneInfoMsg;
          temp = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_runetemplate,
            runeMsg.runeId.toString(),
          );
          info = this.thane.runeCate.getInfoByIndex(temp.RuneIndex);
          if (
            msg.opType == RuneOperationCode.RUNE_HOLE_ACTIVE ||
            msg.opType == RuneOperationCode.RUNE_HOLE_CARVE ||
            msg.opType == RuneOperationCode.RUNE_HOLE_REPLACE
          ) {
            //激活符文孔返回
            if (info && runeMsg.runeHole) {
              info.runeHole = runeMsg.runeHole; //120, 210, 220|
              info.runeId = runeMsg.runeId;
              info.tempHole = runeMsg.tempHole; // 雕刻出临时符文孔
              info.newSkillTempId = runeMsg.newSkillTempId; //  >0有效 为符文新的技能模版ID
              info.baseProperties = runeMsg.baseProperties; // 基本属性加成
              info.commit();
              changeInfo = info;
              if (msg.opType == RuneOperationCode.RUNE_HOLE_CARVE) {
                MessageTipManager.Instance.show(
                  LangManager.Instance.GetTranslation("runeGem.str21"),
                );
                NotificationManager.Instance.sendNotification(
                  RuneEvent.CARVE_RUNE,
                  changeInfo,
                );
              } else if (msg.opType == RuneOperationCode.RUNE_HOLE_REPLACE) {
                NotificationManager.Instance.sendNotification(
                  RuneEvent.RECV_REPLACE_RUNE_HOLE,
                  changeInfo,
                );
              }
            }
          } else {
            if (
              info &&
              (info.grade < temp.RuneGrade || info.runeCurGp < runeMsg.runeGp)
            ) {
              info.grade = temp.RuneGrade;
              info.runeId = runeMsg.runeId; // 符文ID
              info.runeCurGp = runeMsg.runeGp; // 符文当前经验
              info.swallowCount = runeMsg.swallowCount; // 该符文当天吞噬符文书数量
              info.runeHole = runeMsg.runeHole; // id1,id2,id3|s1,s2,s3,s4 符文孔id|形状id
              info.tempHole = runeMsg.tempHole; // 雕刻出临时符文孔
              info.newSkillTempId = runeMsg.newSkillTempId; //  >0有效 为符文新的技能模版ID
              info.baseProperties = runeMsg.baseProperties; // 基本属性加成
              info.commit();
              changeInfo = info;
            }
          }
        }
        if (msg.opType == RuneOperationCode.RUNE_HOLE_CARVE) {
        } else if (msg.opType == RuneOperationCode.RUNE_HOLE_REPLACE) {
        } else {
          NotificationManager.Instance.sendNotification(
            RuneEvent.RUNE_UPGRADE,
            changeInfo,
          );
        }
      }
    }
  }

  /**
   * 英雄符文重置符文吞噬数量
   * @param event
   *
   */
  protected __runeResetHandler(pkg: PackageIn) {
    let runeInfos: any[] = this.thane.runeCate.allRuneList.getList();
    let len: number = runeInfos.length;
    let info: RuneInfo;
    for (let i: number = 0; i < len; i++) {
      info = runeInfos[i] as RuneInfo;
      if (info) {
        info.swallowCount = 0;
        info.commit();
      }
    }
    NotificationManager.Instance.sendNotification(RuneEvent.RUNE_UPGRADE, null);
  }

  protected __fateGuardListHandler(pkg: PackageIn) {
    let msg: FateListMsg = pkg.readBody(FateListMsg) as FateListMsg;
    let info: FateRotarySkillInfo;

    for (let key in msg.fateInfo) {
      let infoMsg: FateInfoMsg = msg.fateInfo[key] as FateInfoMsg;
      info = this.thane.getFateGuardSkill(infoMsg.fateTypes);
      if (!info) {
        info = new FateRotarySkillInfo();
        this.thane.fateRotarySkillList.push(info);
      }
      info.fateTypes = infoMsg.fateTypes;
      info.templateId = infoMsg.templateId;
      info.grades = infoMsg.grades;
      info.totalGp = infoMsg.totalGp;
      info.property1 = infoMsg.property1;
      info.property2 = infoMsg.property2;
      PlayerManager.Instance.currentPlayerModel.faterotaryCount =
        infoMsg.turnCount;
    }
  }

  /**
   * 龙纹信息
   */
  protected __tattooHandler(pkg: PackageIn): void {
    let msg: TattooHoleRspMsg = pkg.readBody(
      TattooHoleRspMsg,
    ) as TattooHoleRspMsg;
    let info: FateRotarySkillInfo;
    let i: number = 0;
    let ctrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.SRoleWnd,
    ) as RoleCtrl;
    ctrl.tattooModel.coreStep = msg.param1; //龙纹核心阶级
    ctrl.tattooModel.lastOpType = msg.opType; //opType:	1所有孔信息	2洗练	3替换原属性   4核心升阶
    if (ctrl.tattooModel.holes == null) {
      let holes: TattooHole[] = [];
      let hole: TattooHole;
      for (const holeMsg of msg.holeInfo) {
        //TattooHoleMsg
        hole = new TattooHole();
        hole.index = holeMsg.hole; //i++;
        if (
          msg.opType == RoleCtrl.OP_REFRESH ||
          msg.opType == RoleCtrl.OP_ADVANCE_REFRESH
        ) {
          //remark by yuyuanzhan 龙纹优化：升级和高级升级操作后，直接用服务器传过来的新属性覆盖旧属性，因为没有替换操作了
          hole.oldAddProperty = holeMsg.NewAddProperty;
          hole.oldAddingValue = holeMsg.NewAddingValue;
          hole.oldReduceProperty = holeMsg.NewReduceProperty;
          hole.oldReduceValue = holeMsg.NewReduceValue;
          hole.oldStep = holeMsg.NewStage;
          //旧属性就保存在last字段中
          hole.lastAddProperty = holeMsg.OldAddProperty;
          hole.lastAddingValue = holeMsg.OldAddingValue;
          hole.lastReduceProperty = holeMsg.OldReduceProperty;
          hole.lastReduceValue = holeMsg.OldReduceValue;
          hole.lastOldStep = holeMsg.OldStage;
        } else {
          hole.oldAddProperty = holeMsg.OldAddProperty;
          hole.oldAddingValue = holeMsg.OldAddingValue;
          hole.oldReduceProperty = holeMsg.OldReduceProperty;
          hole.oldReduceValue = holeMsg.OldReduceValue;
          hole.oldStep = holeMsg.OldStage;
          //旧属性就保存在last字段中
          hole.lastAddProperty = holeMsg.OldAddProperty;
          hole.lastAddingValue = holeMsg.OldAddingValue;
          hole.lastReduceProperty = holeMsg.OldReduceProperty;
          hole.lastReduceValue = holeMsg.OldReduceValue;
          hole.lastOldStep = holeMsg.OldStage;
        }
        hole.newAddProperty = holeMsg.NewAddProperty;
        hole.newAddingValue = holeMsg.NewAddingValue;
        hole.newReduceProperty = holeMsg.NewReduceProperty;
        hole.newReduceValue = holeMsg.NewReduceValue;
        hole.newStep = holeMsg.NewStage; //ctrl.tattooModel.getTattooStepByLevel(holeMsg.NewGrades);
        hole.isLock = ctrl.tattooModel.checkHoleIsLock(hole.index);
        holes.push(hole);
      }
      ctrl.tattooModel.holes = holes;
    } else {
      for (let j = 0, len = msg.holeInfo.length; j < len; j++) {
        const refreshHoleMsg = msg.holeInfo[j];
        let hole2: TattooHole = ctrl.tattooModel.holes[refreshHoleMsg.hole];
        if (
          msg.opType == RoleCtrl.OP_REFRESH ||
          msg.opType == RoleCtrl.OP_ADVANCE_REFRESH
        ) {
          //remark by yuyuanzhan 龙纹优化：升级和高级升级操作后，直接用服务器传过来的新属性覆盖旧属性，因为没有替换操作了
          hole2.oldAddProperty = refreshHoleMsg.NewAddProperty;
          hole2.oldAddingValue = refreshHoleMsg.NewAddingValue;
          hole2.oldReduceProperty = refreshHoleMsg.NewReduceProperty;
          hole2.oldReduceValue = refreshHoleMsg.NewReduceValue;
          hole2.oldStep = refreshHoleMsg.NewStage;
          //旧属性就保存在last字段中
          hole2.lastAddProperty = refreshHoleMsg.OldAddProperty;
          hole2.lastAddingValue = refreshHoleMsg.OldAddingValue;
          hole2.lastReduceProperty = refreshHoleMsg.OldReduceProperty;
          hole2.lastReduceValue = refreshHoleMsg.OldReduceValue;
          hole2.lastOldStep = refreshHoleMsg.OldStage;
        } else {
          hole2.oldAddProperty = refreshHoleMsg.OldAddProperty;
          hole2.oldAddingValue = refreshHoleMsg.OldAddingValue;
          hole2.oldReduceProperty = refreshHoleMsg.OldReduceProperty;
          hole2.oldReduceValue = refreshHoleMsg.OldReduceValue;
          hole2.oldStep = refreshHoleMsg.OldStage;
          //旧属性就保存在last字段中
          hole2.lastAddProperty = refreshHoleMsg.OldAddProperty;
          hole2.lastAddingValue = refreshHoleMsg.OldAddingValue;
          hole2.lastReduceProperty = refreshHoleMsg.OldReduceProperty;
          hole2.lastReduceValue = refreshHoleMsg.OldReduceValue;
          hole2.lastOldStep = refreshHoleMsg.OldStage;
        }
        hole2.newAddProperty = refreshHoleMsg.NewAddProperty;
        hole2.newAddingValue = refreshHoleMsg.NewAddingValue;
        hole2.newReduceProperty = refreshHoleMsg.NewReduceProperty;
        hole2.newReduceValue = refreshHoleMsg.NewReduceValue;
        hole2.newStep = refreshHoleMsg.NewStage; //ctrl.tattooModel.getTattooStepByLevel(refreshHoleMsg.NewGrades);
        hole2.isLock = ctrl.tattooModel.checkHoleIsLock(hole2.index);
      }
    }
    NotificationManager.Instance.dispatchEvent(
      ArmyEvent.TATTOO_INFO,
      msg.opType,
    );
  }

  public sendFashionChange(msg: FashionInfoMsg) {
    SocketManager.Instance.send(C2SProtocol.C_FASHION_EXCHANGE, msg);
  }

  protected __fashionHandler(pkg: PackageIn) {
    let msg = pkg.readBody(FashionInfoMsg) as FashionInfoMsg;
    this.fashionInfoMsg = msg;
    let fashionList = this.fashionList;
    fashionList.clear();
    this.dragonFashionList.clear();
    if (msg.hatAvata) {
      //帽子
      let good2: GoodsInfo = new GoodsInfo();
      good2.pos = 9;
      good2.bagType = 4;
      good2.templateId = msg.hatAvata;
      let skillInfo: t_s_skilltemplateData =
        this.fashionModel.getFashionObjectSkillTemplate(good2.templateInfo);
      good2.appraisal_skill = skillInfo != null ? skillInfo.TemplateId : 0;
      fashionList.add(good2.pos, good2);
    }
    if (msg.clothAvata) {
      //衣服
      let good4: GoodsInfo = new GoodsInfo();
      good4.pos = 10;
      good4.bagType = 4;
      good4.templateId = msg.clothAvata;
      let skillInfo: t_s_skilltemplateData =
        this.fashionModel.getFashionObjectSkillTemplate(good4.templateInfo);
      good4.appraisal_skill = skillInfo != null ? skillInfo.TemplateId : 0;
      fashionList.add(good4.pos, good4);
    }
    if (msg.armAvata) {
      //武器
      let good3: GoodsInfo = new GoodsInfo();
      good3.pos = 11;
      good3.bagType = 4;
      good3.templateId = msg.armAvata;
      let skillInfo: t_s_skilltemplateData =
        this.fashionModel.getFashionObjectSkillTemplate(good3.templateInfo);
      good3.appraisal_skill = skillInfo != null ? skillInfo.TemplateId : 0;
      fashionList.add(good3.pos, good3);
    }
    if (msg.wingAvata) {
      //翅膀
      let good1: GoodsInfo = new GoodsInfo();
      good1.pos = 8;
      good1.bagType = 4;
      good1.templateId = msg.wingAvata;
      let skillInfo: t_s_skilltemplateData =
        this.fashionModel.getFashionObjectSkillTemplate(good1.templateInfo);
      good1.appraisal_skill = skillInfo != null ? skillInfo.TemplateId : 0;
      fashionList.add(good1.pos, good1);
    }
    if (msg.dragonHatAvata) {
      //龙语者帽子
      var good6: GoodsInfo = new GoodsInfo();
      good6.pos = 9;
      good6.bagType = 4;
      good6.templateId = msg.dragonHatAvata;
      this.dragonFashionList.add(good6.pos, good6);
    }
    if (msg.dragonClothAvata) {
      //龙语者衣服
      var good8: GoodsInfo = new GoodsInfo();
      good8.pos = 10;
      good8.bagType = 4;
      good8.templateId = msg.dragonClothAvata;
      this.dragonFashionList.add(good8.pos, good8);
    }
    if (msg.dragonArmAvata) {
      //龙语者武器
      var good7: GoodsInfo = new GoodsInfo();
      good7.pos = 11;
      good7.bagType = 4;
      good7.templateId = msg.dragonArmAvata;
      this.dragonFashionList.add(good7.pos, good7);
    }
    if (msg.dragonWingAvata) {
      //龙语者翅膀
      var good5: GoodsInfo = new GoodsInfo();
      good5.pos = 8;
      good5.bagType = 4;
      good5.templateId = msg.dragonWingAvata;
      this.dragonFashionList.add(good5.pos, good5);
    }
    if (!this.fashionModel.isIdentify) {
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.FASHION_SHOW_CHANGE,
      );
    } else {
      this.fashionModel.isIdentify = false; //鉴定完成
    }
  }
  public get fashionModel(): FashionModel {
    return FashionManager.Instance.fashionModel;
  }

  public get vice(): ThaneInfo {
    return this.army.viceHero;
  }

  /************socket发送************/

  public get thane(): ThaneInfo {
    return this.army.baseHero;
  }

  /**
   *通过士兵SonType取得拥有士兵数量（包括城堡和部队士兵）
   * @param sontype  士兵SonType
   *
   */
  public getTotalPawnsNumberBySonType(sontype: number): number {
    let total: number = 0;
    let armyPawn1: ArmyPawn = this.army.armyPawns[0];
    let castlePawn: ArmyPawn = this.castlePawnList[sontype];
    if (armyPawn1 && armyPawn1.templateId > 0) {
      if (armyPawn1.templateInfo.SonType == sontype) {
        total += armyPawn1.ownPawns;
      }
    }
    if (castlePawn) {
      total += castlePawn.ownPawns;
    }
    return total;
  }

  /**已上阵士兵数量 */
  public getCasernOnPawn(sonType: number): number {
    let apOn = this.army.getPawnByIndex(0);
    if (apOn) {
      if (apOn.templateInfo && apOn.templateInfo.SonType == sonType) {
        return apOn.ownPawns;
      }
    }
    return 0;
  }

  /**
   * 根据士兵sontype取得城堡部队里面的士兵
   * @param sonType
   * @return
   *
   */
  public getCasernPawn(sonType: number): ArmyPawn {
    let ap: ArmyPawn = this.casernPawnList[sonType];
    if (ap) {
      ap.canRecruit = true;
    }
    return ap;
  }

  /**
   * 根据士兵mastertype取得城堡部队里面的士兵
   * @param mastertype
   * @return
   *
   */
  public getCasernPawnByMastertype(mastertype: number): ArmyPawn {
    for (let key in this.casernPawnList) {
      let ap: ArmyPawn = this.casernPawnList[key];
      if (ap.templateInfo.MasterType == mastertype) {
        return ap;
      }
    }
    return null;
  }

  /**
   * 根据士兵模板id和sontyoe取得 城堡部队里面的士兵,
   * 如果城堡部队里面默认不存在, 比如召唤的士兵, 则新增加一个
   * @param tempId
   * @param sonType
   * @return
   *
   */
  public getCastlePawn(tempId: number, sonType: number): ArmyPawn {
    let ap: ArmyPawn = this.castlePawnList[sonType];
    if (!ap) {
      ap = new ArmyPawn();
      ap.templateId = tempId;
      this.castlePawnList.add(ap.templateInfo.SonType, ap);
    }
    return ap;
  }

  /**
   * 根据士兵模板id取得城堡部队里面的士兵
   * @param tid
   * @return
   *
   */
  public getPawnById(tid: number): ArmyPawn {
    for (let key in this.castlePawnList) {
      let armyPawn: ArmyPawn = this.castlePawnList[key];
      if (armyPawn.templateId == tid) {
        return armyPawn;
      }
    }
    return null;
  }

  /**
   * 在城堡部队里面增加指定模板id是士兵一定数量
   * @param tid
   * @param count
   *
   */
  public addPawnCountById(tid: number, count: number) {
    for (let key in this.castlePawnList) {
      let ap: ArmyPawn = this.castlePawnList[key];
      if (ap.templateId == tid) {
        ap.ownPawns += count;
        ap.commit();
      }
    }
    this.dispatchEvent(ArmyEvent.ARMY_INFO_CHANGE, null);
  }

  /**
   * 在城堡部队里面, 根据模板id减少城堡部队里面指定士兵的数量
   * @param tid
   * @param count
   *
   */
  public removePawnCountById(tid: number, count: number) {
    for (let key in this.castlePawnList) {
      let ap: ArmyPawn = this.castlePawnList[key];
      if (ap.templateId == tid) {
        ap.ownPawns -= count;
        ap.commit();
      }
    }
    this.dispatchEvent(ArmyEvent.ARMY_INFO_CHANGE, null);
  }

  /**
   * 检查已编制部队里面是否有可升级的兵种
   * @return
   *
   */
  public checkCanUpgraeSeriaPawn(): boolean {
    if (this.army.getPawnByIndex(0).templateId == 0) {
      return false;
    }
    if (this.army.getPawnByIndex(0).templateInfo.NextLevelTemplateId == 0) {
      return false;
    }
    return (
      this.army.getPawnByIndex(0).templateInfo.Level < this.thane.grades - 3
    );
  }

  /**
   * 检查城堡部队里面的最高等级士兵是否达到最高等级
   * 士兵最高等级受玩家等级限制
   * @return
   *
   */
  public checkCanUpgraeMaxLevelPawn(): boolean {
    let max: ArmyPawn;
    for (let key in this.casernPawnList) {
      let ap: ArmyPawn = this.casernPawnList[key];
      if (!max) {
        max = ap;
      }
      if (max.templateInfo.Level < ap.templateInfo.Level) {
        max = ap;
      }
    }
    return (
      max.templateInfo.Level < this.thane.grades - 3 &&
      max.templateInfo.NextLevelTemplateId > 0
    );
  }

  /**
   * 检查指定士兵是否可以升级
   * @param ap
   * @return
   *
   */
  public canUpgradePawn(ap: ArmyPawn): boolean {
    if (!ap) {
      return false;
    }
    if (ap.templateInfo.NextLevelTemplateId != 0) {
      return true;
    }
    return false;
  }

  /**
   * 同步所有部队
   * 包括城堡部队和已编制部队
   * @param ap
   *
   */
  public synchronizationAllArmyPawns(ap: ArmyPawn) {
    let armyPawn: ArmyPawn = this.getCastlePawn(
      ap.templateId,
      ap.templateInfo.SonType,
    );
    if (armyPawn) {
      armyPawn.synchronization(ap);
      armyPawn.commit();
    }
    this.army.synchronizationAllPawn(ap);
  }

  /**
   * 请求命运轮盘技能信息
   *
   */
  public getFateRotarySkillList() {
    SocketManager.Instance.send(C2SProtocol.C_FATE_REQUEST);
  }
}
