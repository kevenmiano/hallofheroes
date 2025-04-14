import Logger from "../../core/logger/Logger";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
//@ts-expect-error: External dependencies
import OutercityReqMsg = com.road.yishi.proto.outercity.OutercityReqMsg;
//@ts-expect-error: External dependencies
import PhysicUpdateReqMsg = com.road.yishi.proto.army.PhysicUpdateReqMsg;
//@ts-expect-error: External dependencies
import ChallengeMsg = com.road.yishi.proto.player.ChallengeMsg;
//@ts-expect-error: External dependencies
import MapPhysicAttackMsg = com.road.yishi.proto.worldmap.MapPhysicAttackMsg;
//@ts-expect-error: External dependencies
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
//@ts-expect-error: External dependencies
import PosMoveMsg = com.road.yishi.proto.worldmap.PosMoveMsg;
//@ts-expect-error: External dependencies
import HangupAttackMsg = com.road.yishi.proto.campaign.HangupAttackMsg;
//@ts-expect-error: External dependencies
import BuildingReqMsg = com.road.yishi.proto.building.BuildingReqMsg;
/**
 * @description 外城相关操作对服务器发送Socket请求
 * @author yuanzhan.yu
 * @date 2021/11/17 10:05
 * @ver 1.0
 */
export class OuterCitySocketOutManager {
  /**
   *告诉服务器当前在哪个屏幕
   *      AMF数据请求
   *      屏幕同步
   * @param position 位置
   * 按区域取数据
   * 格式为0_0,1_0,x_x
   * @param mapId  地图Id
   *
   */
  public static sendCurrentScreen(position: string, mapId: number): void {
    var msg: OutercityReqMsg = new OutercityReqMsg();
    msg.mapId = mapId;
    msg.position = position;
    SocketManager.Instance.send(C2SProtocol.U_C_USER_DISPLAY, msg);
  }

  /**
   *更新同屏见部队列表
   * @param mapId  地图Id
   * @param files  取得当前9宫格中变动的格子
   * 再按区域取数据
   * 格式为0_0,1_0,x_x
   */
  public static sendGetArmyByGrid(mapId: number, files: string): void {
    var msg: OutercityReqMsg = new OutercityReqMsg();
    msg.mapId = mapId;
    msg.files = files;
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_UPDATE_GRID, msg);
  }

  /**
   *请求相关屏所在的地图对象列表
   * @param mapId 地图Id
   * @param files 取得当前9宫格中变动的格子
   * 再按区域取数据
   * 格式为0_0,1_0,x_x
   *
   */
  public static sendGetWildLandByGrid(mapId: number, files: string): void {
    var msg: PhysicUpdateReqMsg = new PhysicUpdateReqMsg();
    msg.mapId = mapId;
    msg.reqGrid = files;
    SocketManager.Instance.send(C2SProtocol.C_PHYSICLIST_BYGRID, msg);
  }

  /**
   *请求部队位置
   *
   */
  public static sendArmyPosRequest(): void {
    SocketManager.Instance.send(C2SProtocol.C_ARMYPOS_REQUEST);
  }

  /**
   * 外城攻击玩家
   * @param userId 玩家Id
   *
   */
  public static sendPvpAttack(userId: number): void {
    var msg: ChallengeMsg = new ChallengeMsg();
    msg.tarUserId = userId;
    SocketManager.Instance.send(C2SProtocol.C_WORLDMAP_PVPFIGHT, msg);
  }

  /**
   * 增加攻击次数
   * @param count 次数
   *
   */
  public static setAddAttackCount(count: number, type: number): void {
    var msg: OutercityReqMsg = new OutercityReqMsg();
    msg.attackCount = count;
    msg.type = type;
    SocketManager.Instance.send(C2SProtocol.C_CASTLE_ATTACK, msg);
  }

  /**
   *攻打城堡与野地
   * @param mapId 地图Id
   * @param posX  X坐标
   * @param posY  Y坐标
   *
   */
  public static sendAttack(mapId: number, posX: number, posY: number): void {
    var msg: MapPhysicAttackMsg = new MapPhysicAttackMsg();
    msg.mapId = mapId;
    msg.posX = posX;
    msg.posY = posY;
    Logger.xjy("[OuterCitySocketOutManager]sendAttack", mapId, posX, posY);
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_ATTACK, msg);
  }

  /**
   *攻打金矿某一资源
   * @param mapId 地图Id
   * @param posX  X坐标
   * @param posY  Y坐标
   * @param nodeId 矿的节点id
   * @param sonNodeId 矿子节点id
   *
   */
  public static sendAttackMine(
    mapId: number,
    posX: number,
    posY: number,
    nodeId: number = 0,
    sonNodeId: number = 0,
  ): void {
    var msg: MapPhysicAttackMsg = new MapPhysicAttackMsg();
    msg.mapId = mapId;
    msg.posX = posX;
    msg.posY = posY;
    msg.nodeId = nodeId;
    msg.sonNodeId = sonNodeId;
    Logger.xjy(
      "[OuterCitySocketOutManager]sendAttack",
      mapId,
      posX,
      posY,
      nodeId,
      sonNodeId,
    );
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_ATTACK, msg);
  }
  /**
   *传回城堡
   * @param type 类型
   *
   */
  public static sendArmyBack(type: number): void {
    var msg: PayTypeMsg = new PayTypeMsg();
    msg.payType = type;
    SocketManager.Instance.send(C2SProtocol.U_C_ARMY_RETURNHOME, msg);
  }

  /**
   *外城移动
   * @param msg
   *
   */
  public static sendMovePaths(msg: PosMoveMsg): void {
    SocketManager.Instance.send(C2SProtocol.C_MOVE_POS, msg);
  }

  /**
   *挑战CD加速
   * @param type 类型
   *
   */
  public static treasureCD(type: number) {
    var msg: PayTypeMsg = new PayTypeMsg();
    msg.payType = type;
    SocketManager.Instance.send(C2SProtocol.C_TREASURE_MINE_LIVE, msg);
  }

  /**
   *
   * @param targetId 外城攻击玩家
   */
  public static sendAttackPerson(targetId: number) {
    var msg: HangupAttackMsg = new HangupAttackMsg();
    msg.defenceId = targetId;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_FIGHT, msg);
  }

  /**
   * 外城放弃金矿
   * @param
   */
  public static removeMine(
    position: string,
    nodeId: number,
    sonNodeId: number,
  ) {
    let msg: BuildingReqMsg = new BuildingReqMsg();
    msg.position = position;
    msg.nodeId = nodeId;
    msg.sonNodeId = sonNodeId;
    SocketManager.Instance.send(C2SProtocol.U_C_UNOCCPWILDLAND, msg);
  }

  /**
   * 请求金矿二级节点下面的子节点数据
   */
  public static requestSonNodeData(
    mapId: number,
    posX: number,
    posY: number,
    nodeId: number,
  ) {
    var msg: MapPhysicAttackMsg = new MapPhysicAttackMsg();
    msg.mapId = mapId;
    msg.posX = posX;
    msg.posY = posY;
    msg.nodeId = nodeId;
    SocketManager.Instance.send(C2SProtocol.C_OUT_CITY_GOLDN_LIST, msg);
  }
}
