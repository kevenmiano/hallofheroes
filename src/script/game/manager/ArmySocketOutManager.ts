import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { RuneOperationCode } from "../constant/RuneOperationCode";
import { ArmyManager } from "./ArmyManager";
import { SharedManager } from "./SharedManager";
//@ts-expect-error: External dependencies
import HeroHideFashionReqMsg = com.road.yishi.proto.army.HeroHideFashionReqMsg;
//@ts-expect-error: External dependencies
import HeroRuneOpMsg = com.road.yishi.proto.army.HeroRuneOpMsg;
//@ts-expect-error: External dependencies
import PawnChangeMsg = com.road.yishi.proto.army.PawnChangeMsg;
//@ts-expect-error: External dependencies
import TalentUpGradeMsg = com.road.yishi.proto.army.TalentUpGradeMsg;
//@ts-expect-error: External dependencies
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
//@ts-expect-error: External dependencies
import ArmyFightPosEditMsg = com.road.yishi.proto.army.ArmyFightPosEditMsg;
//@ts-expect-error: External dependencies
import ArmyPawnInfoMsg = com.road.yishi.proto.army.ArmyPawnInfoMsg;
//@ts-expect-error: External dependencies
import HeroAddPointReqMsg = com.road.yishi.proto.army.HeroAddPointReqMsg;
//@ts-expect-error: External dependencies
import HeroFastKeyMsg = com.road.yishi.proto.army.HeroFastKeyMsg;
//@ts-expect-error: External dependencies
import AutoRecruitMsg = com.road.yishi.proto.army.AutoRecruitMsg;

/**
 *部队兵种相关操作及信息与服务器的交互
 * @author gang.liu
 *
 */
export class ArmySocketOutManager {
  constructor() {}

  /**
   * 通知服务器指定的英雄发生改变, 让服务器通知其他客户端
   * @param heroId
   *
   */
  public static sendChangeHeroInfo(heroId: number) {
    //0x1390
    var msg: HeroHideFashionReqMsg = new HeroHideFashionReqMsg();
    msg.hide = 0;
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_UPDATE_EQUIPMENT, msg);
  }
  /**
   * 招募士兵
   * @param templateId 兵种模板ID
   * @param count  招募数量
   *
   */
  public static sendRecruitPawn(templateId: number, count: number) {
    //0x1423
    var msg: ArmyPawnInfoMsg = new ArmyPawnInfoMsg();
    msg.tempateId = templateId;
    msg.ownPawns = count;
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_RECRUITED, msg);
  }
  /**
   *  遣散士兵
   * @param tempId 兵种模板ID
   * @param count 遣散数量
   *
   */
  public static sendDismissPawn(tempId: number, count: number) {
    //0x1425
    var msg: ArmyPawnInfoMsg = new ArmyPawnInfoMsg();
    msg.tempateId = tempId;
    msg.ownPawns = count;
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_DEMOBPAWN, msg);
  }
  /**
   * 编辑部队
   * @param pos1  兵种位置
   * @param tempId1
   * @param count1
   *
   */
  public static sendEditArmyPawn(
    pos1: number,
    tempId1: number,
    count1: number,
  ) {
    //0x1424
    var msg: ArmyPawnInfoMsg = new ArmyPawnInfoMsg();
    msg.sites = pos1;
    msg.tempateId = tempId1;
    msg.ownPawns = count1;
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_EDIT, msg);
  }
  /**
   * 调整部队阵形
   * @param userId
   * @param heroPos  英雄站位
   * @param pawnPos  兵种站位
   *
   */
  public static sendEditArmyPos(
    userId: number,
    heroPos: number,
    pawnPos: number,
  ) {
    //0x2054
    var msg: ArmyFightPosEditMsg = new ArmyFightPosEditMsg();
    msg.userId = userId;
    msg.heroPos = heroPos;
    msg.pawnPos = pawnPos;
    SocketManager.Instance.send(C2SProtocol.C_ARMYPOS_EDIT, msg);
  }
  /**
   * 士兵升级
   * @param tempId 兵种模板ID
   *
   */
  public static sendUpgradePawn(tempId: number) {
    //0x1426
    var msg: ArmyPawnInfoMsg = new ArmyPawnInfoMsg();
    msg.tempateId = tempId;
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_UPGRADEPAWN, msg);
  }

  /**
   * 兵种特性等级转换
   * @param  oldId  旧属性ID
   * @param  newId  新属性ID
   * @param  payType
   */
  public static sendPawnChange(
    oldId: number,
    newId: number,
    payType: number,
    useBind: boolean = true,
  ) {
    //0x1426
    var msg: PawnChangeMsg = new PawnChangeMsg();
    msg.curPawnTempId = oldId;
    msg.tarPawnTempId = newId;
    msg.payType = payType;
    if (payType == 1) {
      if (SharedManager.Instance.pownConveruseBind) {
        msg.payType = 3;
      }
    }
    SocketManager.Instance.send(C2SProtocol.C_PAWN_CHANGE, msg);
  }
  /**
   * 学习符文技能
   * @param runeId     对应符文ID
   * @param runeItemPos  对应位置
   * @param runeItemCount  对应数量
   */
  public static sendStudyRune(
    runeId: number,
    runeItemPos: number,
    runeItemCount: number = 1,
  ) {
    var msg: HeroRuneOpMsg = new HeroRuneOpMsg();
    msg.opType = RuneOperationCode.RUNE_STUDY;
    msg.userId = ArmyManager.Instance.army.userId;
    msg.runeId = runeId;
    msg.learnRunePos = runeItemPos;
    msg.learnRuneCount = runeItemCount;
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_RUNE_OP, msg);
  }
  /**
   * 升级符文技能
   *
   */
  public static sendUpgradeRune(runeId: number, runeCount: number) {
    var msg: HeroRuneOpMsg = new HeroRuneOpMsg();
    msg.opType = RuneOperationCode.RUNE_UPGRADE;
    msg.userId = ArmyManager.Instance.army.userId;
    msg.runeId = runeId;
    msg.count = runeCount;
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_RUNE_OP, msg);
  }
  /**
   * 携带符文技能
   * @fastKey 快捷键
   */
  public static sendTakeRune(fastKey: string) {
    var msg: HeroRuneOpMsg = new HeroRuneOpMsg();
    msg.opType = RuneOperationCode.RUNE_TAKE;
    msg.userId = ArmyManager.Instance.army.userId;
    msg.runeKey = fastKey;
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_RUNE_OP, msg);
  }

  /**
   * 技能和天赋加点
   * @param tempId		技能或天赋模版ID
   * @param type  		0 普通技能	1天赋 2:专精技能
   * @param subType  		子类专精时对应秘典jobType
   */
  public static sendAddSkillpoint(
    tempId: number,
    type: number = 0,
    useBind: boolean = true,
    subType: number = 0,
  ) {
    //0x1441
    var msg: HeroAddPointReqMsg = new HeroAddPointReqMsg();
    msg.skillTempId = tempId;
    msg.type = type;
    msg.subType = subType;
    if (!useBind) {
    }
    SocketManager.Instance.send(C2SProtocol.C_HERO_SKILL_UPGRADE, msg);
  }
  /**
   *技能和天赋洗点
   * @param payType		付费类型
   * @param type				0 普通技能   1 天赋技能
   */
  public static sendWashSkillPoint(
    payType: number,
    type: number = 0,
    useBind: boolean = true,
  ) {
    //0x1440
    var msg: PayTypeMsg = new PayTypeMsg();
    msg.payType = 0;
    if (!useBind) {
      msg.payType = 1;
    }
    msg.type = type;
    SocketManager.Instance.send(C2SProtocol.C_HERO_SKILLPOINT_RESET, msg);
  }
  /**
   *天赋加点
   * @param tempId 技能或天赋模版ID
   *
   */
  public static sendAddTalentpoint(tempId: number) {
    //0x1441
    var msg: HeroAddPointReqMsg = new HeroAddPointReqMsg();
    msg.skillTempId = tempId;
    SocketManager.Instance.send(C2SProtocol.C_HERO_SKILL_UPGRADE, msg);
  }

  /**
   *天赋等级升级
   *
   */
  public static sendUpTalentGrade() {
    var msg: TalentUpGradeMsg = new TalentUpGradeMsg();
    SocketManager.Instance.send(C2SProtocol.C_TALENT_GRADE_UP, msg);
  }

  /**
   * 设置快捷键
   */
  public static sendSetFastKey(fastKey: string) {
    //0x142F
    var msg: HeroFastKeyMsg = new HeroFastKeyMsg();
    msg.fastKey = fastKey;
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_SETFASTKEY, msg);
  }
  /**
   * 技能洗点
   *
   */
  public static sendWashPoint() {
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_RESETPOINT);
  }
  /**
   * 隐藏时装
   * @param hide 标示是否隐藏
   *
   */
  public static sendHideFashion(hide: boolean) {
    var msg: HeroHideFashionReqMsg = new HeroHideFashionReqMsg();
    if (hide) {
      msg.hide = 1;
    } else {
      msg.hide = 2;
    }
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_UPDATE_EQUIPMENT, msg);
  }

  /**
   * 符孔操作
   * @param runeId 符文模版 ID
   * @param opType 4:符孔激活 5:符孔雕刻 6:替换符孔
   */
  public static reqRuneHoleOpt(runeId: number, opType: number) {
    var msg: HeroRuneOpMsg = new HeroRuneOpMsg();
    msg.opType = opType;
    msg.runeId = runeId;
    msg.userId = ArmyManager.Instance.army.userId;
    SocketManager.Instance.send(C2SProtocol.U_C_HERO_RUNE_OP, msg);
  }

  /**
   * 自动招募
   * @param state
   */
  public static sendAutoRecurit(state: boolean) {
    var msg: AutoRecruitMsg = new AutoRecruitMsg();
    msg.autoRecruit = state;
    SocketManager.Instance.send(C2SProtocol.C_CASERN_AUTO_SETTING, msg);
  }
}
