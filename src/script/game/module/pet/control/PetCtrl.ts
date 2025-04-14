//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-09-20 12:18:39
 * @LastEditors: jeremy.xu
 * @Description:
 */

import { SocketManager } from "../../../../core/net/SocketManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import { PetData } from "../data/PetData";
import Logger from "../../../../core/logger/Logger";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

import PlayerPetMsg = com.road.yishi.proto.pet.PlayerPetMsg;
import PlayerPetOpMsg = com.road.yishi.proto.pet.PlayerPetOpMsg;
import PetEquipReqMsg = com.road.yishi.proto.pet.PetEquipReqMsg;
import PetEquipResolveReqMsg = com.road.yishi.proto.pet.PetEquipResolveReqMsg;
import StoreReqMsg = com.road.yishi.proto.store.StoreReqMsg;
import StoreRspMsg = com.road.yishi.proto.store.StoreRspMsg;
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import LangManager from "../../../../core/lang/LangManager";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ArrayUtils, ArrayConstant } from "../../../../core/utils/ArrayUtils";
import { EmWindow } from "../../../constant/UIDefine";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
export default class PetCtrl extends FrameCtrlBase {
  constructor() {
    super();
  }

  protected addEventListener() {
    super.addEventListener();
    ServerDataManager.listen(
      S2CProtocol.U_C_UPACCOUNT_ARTIFACT_RECAST,
      this,
      this.__artifactRespHandler,
    );
  }

  protected delEventListener() {
    super.delEventListener();
    ServerDataManager.cancel(
      S2CProtocol.U_C_UPACCOUNT_ARTIFACT_RECAST,
      this,
      this.__artifactRespHandler,
    );
  }

  //重铸操作结果
  private __artifactRespHandler(pkg: PackageIn) {
    let msg: StoreRspMsg = pkg.readBody(StoreRspMsg) as StoreRspMsg;
    if (msg) {
      if (!msg.composeResult) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("artifact.result"),
        );
        return;
      }
      let goodsArr = [];
      let goodsInfo: GoodsInfo = new GoodsInfo();
      goodsInfo.templateId = msg.composeTemplateId;
      goodsInfo.count = 1;
      goodsArr.push(goodsInfo);
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.ARTIFACT_SUCCESS_UPDATE,
      );
      FrameCtrlManager.Instance.open(EmWindow.WishPoolResultWnd, {
        arr: goodsArr,
        type: 1,
      });
    }
  }

  show() {
    super.show();
  }

  hide() {
    super.hide();
  }

  dispose() {
    this._selectedPet = null;
    super.dispose();
  }

  private _succinctEquip: boolean = false;
  public get succinctEquip(): boolean {
    return this._succinctEquip;
  }
  public set succinctEquip(value: boolean) {
    this._succinctEquip = value;
  }

  private _selectedPet: PetData;
  public get selectedPet(): PetData {
    return this._selectedPet;
  }

  public set selectedPet(value: PetData) {
    this._selectedPet = value;
    if (value && this.view) {
      // NotificationManager.Instance.dispatchEvent(PetEvent.PET_SELECT_CHANGE, value);
      this.view.data = value;
    }
  }

  private _selectPart: number = -1;
  public get selectPart(): number {
    return this._selectPart;
  }
  public set selectPart(val: number) {
    this._selectPart = val;
  }

  /**
   * 当前选中的英灵装备部位上是否有装备
   */
  private _curPartInfo: GoodsInfo;
  public get curPartInfo(): GoodsInfo {
    return this._curPartInfo;
  }
  public set curPartInfo(val: GoodsInfo) {
    this._curPartInfo = val;
  }

  /**
   * 献祭
   * @param petId
   *
   */
  public static sacrifice(petId: number) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 6;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 分解
   * @param petId
   *
   */
  public static resolvePet(petIds: number[]) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petIds = petIds;
    msg.opType = 16;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 宠物重命名
   * @param petId
   * @param petName
   */
  public static reNamePet(petId: number, petName: string = "") {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.petName = petName;
    msg.opType = 14;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 吞噬宠物
   * @param petA 主宠
   * @param petB 副宠, 被吞噬
   *
   */
  public static swallowPet(petA: number, petB: number, payType: number = -1) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petA;
    msg.opType = 1;
    msg.value = petB;
    msg.payType = payType;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 出战
   * @param petId
   *
   */
  public static enterWar(petId: number) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 9;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 休息
   * @param petId
   *
   */
  public static rest(petId: number) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 10;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 加点
   * @param petId
   * @param points 加点方案 [力量, 智力, 体质, 护甲]
   *
   */
  public static addPoint(petId: number, points: any[]) {
    if (points == null || points.length != 4) return;
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 2;
    for (var i: number = 0; i < points.length; i++) {
      msg.attributes.push(points[i]);
    }
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 重置加点
   * @param petId
   *
   */
  public static washPoint(petId: number, useBind: boolean) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 3;
    msg.payType = 0;
    if (!useBind) {
      msg.payType = 1;
    }
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 培养资质
   * @param petId
   * @param value 次数
   * @param bind  0表示默认（优先用绑定）,1表示绑定, 2表示未绑定
   */
  public static trainCoe(petId: number, value: number = 1, bind: number = 0) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 7;
    msg.value = value;
    msg.itemPos = bind;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 学习技能  //op_type为5并且value为1,skillId表示指定学习的技能ID, value为2 , 随机学习不需要传skillId。op_type为18时, 表示指定遗忘的技能ID
   * @param petId
   * @param goodsPos 技能书
   * @param skillId
   */
  public static learnSkill(
    petId: number,
    goodsPos: number,
    skillId: number,
    type: number = 1,
    flag: boolean = true,
  ) {
    Logger.info(
      "[PetCtrl]学习技能: petId=" +
        petId +
        ", goodsPos=" +
        goodsPos +
        ", skillId=" +
        skillId,
      type,
      flag ? 0 : 1,
    );
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 5;
    msg.value = type;
    msg.itemPos = goodsPos;
    msg.payType = flag ? 0 : 1;
    msg.skillId = skillId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 遗忘技能
   * @param petId
   * @param skillId
   */
  public static forgetSkill(
    petId: number,
    skillId: number,
    flag: boolean = true,
  ) {
    Logger.info("[PetCtrl]遗忘技能: petId=" + petId + ", skillId=" + skillId);
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 18;
    msg.skillId = skillId;
    msg.payType = flag ? 0 : 1;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 抗性培养
   * @param petid
   * @param resType 抗性类型
   *
   */
  public static trainResistance(
    petId: number,
    resType: number,
    goodsPos: number,
  ) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 8;
    msg.value = resType;
    msg.itemPos = goodsPos;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 提升成长率
   * @param petId
   * @type 类型 1普通 2高级
   * @useBind 是否使用绑定钻石
   * @useBindGoodsType 是否使用绑定物品 0表示默认（优先用绑定）,1表示绑定, 2表示未绑定
   */
  public static trainGrowthRate(
    petId: number,
    type: number = 1,
    useBind: boolean = true,
    useBindGoodsType: number = 0,
  ) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 4;
    msg.value = type;
    msg.payType = 0;
    if (!useBind) {
      msg.payType = 1;
    }
    msg.itemPos = useBindGoodsType;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  public static setSkillFastKey(petId: number, fastKey: string) {
    Logger.info("发送快捷键", petId, fastKey);
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 11;
    msg.petName = fastKey;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 激活第二技能
   * @param b
   * @param flag
   * @param payPoint
   */
  public static sendActiveDoubleSkill(petId: number, useBind: boolean = true) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 19;
    if (!useBind) {
      msg.payType = 1;
    }
    Logger.info("英灵激活第二技能", petId, useBind);
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**切换技能 */
  public static switchSkillIndex(petId: number, skillIndex: number) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.petId = petId;
    msg.opType = 20;
    msg.value = skillIndex;

    Logger.info("英灵切换技能", petId, skillIndex);
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 增加英灵携带上限
   * @param count 激活的数量
   * @param payType 0表示优先使用绑定钻石,1表示不使用绑定钻石
   *
   */
  public static addPetCarryNum(count: number, payType: number = 0) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.opType = 12;
    msg.payType = payType;
    msg.value = count;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 英灵融合
   * @param payType -1代表一般融合 1 代表100%属性继承
   */
  public static composePet(petId: number, payType: number = -1) {
    Logger.xjy("[PetCtrl]composePet", petId, payType);
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.opType = 13;
    msg.payType = payType;
    msg.petId = petId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 英灵转换
   * @author zhongjyuan
   * @email zhognjyuan@outlook.com
   * @website http://zhongjyuan.club
   * @date 2023年7月25日09:38:23
   * @param sourcePetId 源头英灵标识
   * @param targetPetId 目标英灵标识
   */
  public static reqPetExchange(sourcePetId: number, targetPetId: number) {
    Logger.xjy("[PetCtrl]reqPetExchange", sourcePetId, targetPetId);
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.opType = 15;
    msg.petId = sourcePetId;
    msg.value = targetPetId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 英灵装备强化
   *@param bagType = 1; //背包类型
   *@param pos = 2; //背包中位置
   *@param petId = 3; //英灵id(装备中的需要传petId)
   *@param isContinue = 4; //true 一键强化
   */
  public static reqPetEquipStren(
    petId: number,
    bagType: number,
    pos: number,
    isContinue: boolean,
  ) {
    Logger.xjy("[PetCtrl]reqPetEquipStren", petId, bagType, pos, isContinue);
    let msg: PetEquipReqMsg = new PetEquipReqMsg();
    msg.petId = petId;
    msg.bagType = bagType;
    msg.pos = pos;
    msg.isContinue = isContinue;
    SocketManager.Instance.send(C2SProtocol.C_PET_EQUIP_STRENTH, msg);
  }

  /**
   * 英灵装备分解
   * @param pos
   */
  public static reqPetEquipResolve(pos: string) {
    let msg: PetEquipResolveReqMsg = new PetEquipResolveReqMsg();
    msg.pos = pos;
    SocketManager.Instance.send(C2SProtocol.C_PET_EQUIP_RESOLVE, msg);
  }

  /**英灵洗炼 */
  public static reqPetEquipSuccinc(
    petId: number,
    bagType: number,
    pos: number,
    op: number,
  ) {
    let msg: PetEquipReqMsg = new PetEquipReqMsg();
    msg.petId = petId;
    msg.bagType = bagType;
    msg.pos = pos;
    msg.op = op; // 0:洗炼 1:替换 2:洗炼属性
    SocketManager.Instance.send(C2SProtocol.C_PET_EQUIP_SUCCINCT, msg);
  }

  public get curTabIndex(): number {
    return this.view && this.view.curTabIndex;
  }

  public static sendPetFormation(s: string, index: string) {
    Logger.xjy("[PetChallengeCtrl]sendPetFormation", s);
    let msg: PlayerPetMsg = new PlayerPetMsg();
    msg.chaPos = s;
    msg.fightIndex = index;
    SocketManager.Instance.send(C2SProtocol.C_PET_CHALLENGE_FORMATION, msg);
  }

  public static sendPetPotencyActive(
    petId: number,
    templateId: number,
    count: number,
  ) {
    let msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.opType = 17;
    msg.petId = petId;
    msg.itemPos = templateId;
    msg.value = count;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_PET_OP, msg);
  }

  /**
   * 神器鉴定
   * @param pos 物品在玩家背包的位置
   */
  public static sendArtifactIndentify(pos: number) {
    let msg: StoreReqMsg = new StoreReqMsg();
    msg.bagPos = pos;
    SocketManager.Instance.send(C2SProtocol.C_ARTIFACT_APPLRAISAL, msg);
  }

  /**
   * 神器重铸
   * @param pos 物品在玩家背包的位置
   */
  public static sendArtifactReset(
    pos1: number,
    objectId1: number,
    pos2: number,
    objectId2: number,
  ) {
    let msg: StoreReqMsg = new StoreReqMsg();
    msg.holePos = pos1;
    msg.bagPos = pos2;
    msg.srcItemid = objectId1;
    msg.desItemid = objectId2;
    SocketManager.Instance.send(C2SProtocol.C_ARTIFACT_RECAST, msg);
  }
}
