import { SocketManager } from "../../core/net/SocketManager";
import { PlayerVisualFollow } from "../constant/PlayerVisualFollow";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
//@ts-expect-error: External dependencies
import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
//@ts-expect-error: External dependencies
import NodeLockReqMsg = com.road.yishi.proto.campaign.NodeLockReqMsg;
//@ts-expect-error: External dependencies
import ArriveAltarReqMsg = com.road.yishi.proto.campaign.ArriveAltarReqMsg;
//@ts-expect-error: External dependencies
import CampaignNodeMsg = com.road.yishi.proto.campaign.CampaignNodeMsg;
//@ts-expect-error: External dependencies
import GuildMsg = com.road.yishi.proto.guildcampaign.GuildMsg;
//@ts-expect-error: External dependencies
import PosMoveMsg = com.road.yishi.proto.worldmap.PosMoveMsg;
//@ts-expect-error: External dependencies
import WorldBossBufferMsg = com.road.yishi.proto.campaign.WorldBossBufferMsg;
//@ts-expect-error: External dependencies
import WarFieldAttackMsg = com.road.yishi.proto.campaign.WarFieldAttackMsg;
//@ts-expect-error: External dependencies
import HangupAttackMsg = com.road.yishi.proto.campaign.HangupAttackMsg;
//@ts-expect-error: External dependencies
import RouteMsg = com.road.yishi.proto.worldmap.RouteMsg;

/**
 * 副本中 向服务器发送消息的类
 * 所有发送消息的都要写在这个类中
 *
 */
export class MapSocketOuterManager {
  private static _sendCount: number = 0;

  constructor() {}

  /**
   * 节点锁定状态
   * @param id   节点ID CampaignNode.nodeId
   * @param state  状态  （true:锁定  false:不锁定）
   *
   */
  public static sendAlertState(id: number, state: boolean) {
    //0x2004
    let msg: NodeLockReqMsg = new NodeLockReqMsg();
    msg.nodeId = id;
    msg.lock = state;
    SocketManager.Instance.send(C2SProtocol.C_NODE_LOCKSTATE, msg);
  }

  /**
   * 发送NPC到达
   * @param nodeId  节点ID CampaignNode.nodeId
   * @param uid  唯一标识符  CampaignNode.uid
   *
   */
  public static sendNpcArrive(nodeId: number, uid: string) {
    let msg: ArriveAltarReqMsg = new ArriveAltarReqMsg();
    msg.nodeId = nodeId;
    msg.uuId = uid;
    SocketManager.Instance.send(C2SProtocol.ARRIVE_ALTAR, msg);
  }

  /**
   * 军队到达某个节点 向服务器发送消息
   * @param armyId 军队id  ArmyManager.Instance.army.id
   * @param nodeId 节点id
   *
   */
  public static sendCampaignArrive(
    armyId: number,
    nodeId: number,
    reject: boolean = true,
    protocolId: number = 0,
  ) {
    let msg: CampaignReqMsg = new CampaignReqMsg();
    msg.paraInt1 = nodeId;
    msg.paraBool1 = reject;
    SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ARRIVE, msg);
  }

  /**
   * 战斗增援
   * @param nodeId 正在战斗的节点id
   *
   */
  public static sendReinforce(nodeId: number) {
    let msg: CampaignNodeMsg = new CampaignNodeMsg();
    msg.campDataId = nodeId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_REINFORCE, msg);
  }

  /**
   * 公会战中攻击玩家
   * @param enemyUserId 玩家的userId   CampaignManager.Instance.mapModel.armyGvgFight.userId
   *
   */
  public static gvgPlayerFight(enemyUserId: number) {
    let msg: GuildMsg = new GuildMsg();
    msg.param1 = enemyUserId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_REFAIRE, msg);
  }

  /**
   * 查看战役中的部队
   * type  /当type==1时, id表示另一个玩家的userId. 当type==2时, id表示CampaignNodeId.
   * @return
   *
   */
  public static sendSelectCampaignArmy(
    type: number,
    id: number,
    armyId: number = -1,
  ) {
    armyId = armyId != -1 ? armyId : ArmyManager.Instance.army.id;
    let msg: CampaignReqMsg = new CampaignReqMsg();
    msg.paraInt1 = type;
    msg.paraInt2 = id;
    SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ARMY, msg);
  }

  /**
   *弹窗回调方法
   *战役确认框
   * @param mapId 副本id
   * @param nodeId 节点id
   * @param b: (true:确认, false: 取消)
   */
  public static sendFrameCallBack(mapId: number, nodeId: number, b: boolean) {
    let msg: CampaignReqMsg = new CampaignReqMsg();
    msg.paraInt1 = mapId;
    msg.paraInt2 = nodeId;
    msg.paraBool1 = b;
    SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_CONFIRM, msg);
  }

  /**
   * 发送军队的路径信息
   * @param armyId 军队id
   * @param paths 包含路径点(20X20)的数组
   * @param mapId 地图id
   * @param type 移动类型
   *
   */
  public static sendCampaignArmyMove(
    armyId: number,
    paths: any[],
    mapId: number,
    type: PlayerVisualFollow,
  ) {
    if (CampaignManager.CampaignOverState) {
      return;
    }
    let msg: PosMoveMsg = new PosMoveMsg();
    msg.armyId = armyId;
    msg.mapId = mapId;
    let list: any[] = [];
    for (let i: number = 0; i < paths.length; i++) {
      let node: RouteMsg = new RouteMsg();
      node.x = paths[i].x * 20;
      node.y = paths[i].y * 20;
      list.push(node);
    }
    msg.routes = list;
    msg.moveType = type;
    SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_SYNCPOS, msg);
  }

  /**
   * 使用点卷或礼金购买世界bossbuffer  op=2 表示购买
   * @param type 1--点卷  2--礼金
   *
   */
  public static sendBuyWorldBossBuffer(op: number, type: number) {
    let msg: WorldBossBufferMsg = new WorldBossBufferMsg();
    msg.op = op;
    msg.type = type;
    SocketManager.Instance.send(C2SProtocol.C_WORLDBOSS_BUFFER, msg);
  }

  /**
   * 接受切磋邀请
   * @param defencer 防御者userid  CampaignManager.Instance.mapModel.selfMemberData.userId
   * @param attacker 攻击者userid
   *
   */
  public static receivePKRequest(defencer: number, attacker: number) {
    let msg: HangupAttackMsg = new HangupAttackMsg();
    msg.defenceId = defencer;
    msg.attackId = attacker;
    msg.op = 2; //HookMapAttackOP.ACCEPT; //接受
    SocketManager.Instance.send(C2SProtocol.C_SPACEMAP_ATTACK, msg);
  }

  /**
   * 拒绝切磋邀请
   * @param defencer 防御者userid  CampaignManager.Instance.mapModel.selfMemberData.userId
   * @param attacker 攻击者userid
   *
   */
  public static refusePKRequest(defencer: number, attacker: number) {
    let msg: HangupAttackMsg = new HangupAttackMsg();
    msg.defenceId = defencer;
    msg.attackId = attacker;
    msg.op = 3; //HookMapAttackOP.ACCEPT; //接受
    SocketManager.Instance.send(C2SProtocol.C_SPACEMAP_ATTACK, msg);
  }

  /**
   * 接受英灵切磋邀请
   * @param defencer 防御者userid  CampaignManager.Instance.mapModel.selfMemberData.userId
   * @param attacker 攻击者userid
   *
   */
  public static receivePetPKRequest(defencer: number, attacker: number) {
    let msg: HangupAttackMsg = new HangupAttackMsg();
    msg.defenceId = defencer;
    msg.attackId = attacker;
    msg.op = 5; //HookMapAttackOP.ACCEPT; //接受
    SocketManager.Instance.send(C2SProtocol.C_SPACEMAP_ATTACK, msg);
  }

  /**
   * 拒绝英灵切磋邀请
   * @param defencer 防御者userid  CampaignManager.Instance.mapModel.selfMemberData.userId
   * @param attacker 攻击者userid
   *
   */
  public static refusePetPKRequest(defencer: number, attacker: number) {
    let msg: HangupAttackMsg = new HangupAttackMsg();
    msg.defenceId = defencer;
    msg.attackId = attacker;
    msg.op = 6; //HookMapAttackOP.ACCEPT; //接受
    SocketManager.Instance.send(C2SProtocol.C_SPACEMAP_ATTACK, msg);
  }

  /**
   * 战场中发起攻击
   * @param targetId
   * @param targetService
   *
   */
  public static sendAttackInPvpMap(targetId: number, targetService: string) {
    let msg: WarFieldAttackMsg = new WarFieldAttackMsg();
    msg.userId = targetId;
    msg.defenceServerName = targetService;
    SocketManager.Instance.send(C2SProtocol.C_WARFIELD_ATTACK, msg);
  }

  /**
   * 英灵岛、紫晶矿场发起攻击
   * @param targetId
   *
   */
  public static sendAttackInPetLand(targetId: number) {
    let msg: HangupAttackMsg = new HangupAttackMsg();
    msg.defenceId = targetId;
    SocketManager.Instance.send(C2SProtocol.C_HANGUP_PVP, msg);
  }
}
