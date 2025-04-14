//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import { PackageOut } from "../../../core/net/PackageOut";
import { SocketManager } from "../../../core/net/SocketManager";
import OpenGrades from "../../constant/OpenGrades";
import { PlayerVisualFollow } from "../../constant/PlayerVisualFollow";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import SpaceArmy from "./data/SpaceArmy";
import SpaceManager from "./SpaceManager";
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import SpacePlayerMoveMsg = com.road.yishi.proto.campaign.SpacePlayerMoveMsg;
import SpacePlayerMsg = com.road.yishi.proto.campaign.SpacePlayerMsg;
import PosMsg = com.road.yishi.proto.campaign.PosMsg;
import SpacePlayerArmyInfoReqMsg = com.road.yishi.proto.campaign.SpacePlayerArmyInfoReqMsg;
import HangupAttackMsg = com.road.yishi.proto.campaign.HangupAttackMsg;

export class SpaceSocketOutManager {
  private static _instance: SpaceSocketOutManager;
  public static get Instance(): SpaceSocketOutManager {
    if (!SpaceSocketOutManager._instance)
      SpaceSocketOutManager._instance = new SpaceSocketOutManager();
    return SpaceSocketOutManager._instance;
  }

  constructor() {}

  /**
   * 通知服务器重置玩家在天空之城的坐标
   *
   */
  public resetSpacePosition() {
    SocketManager.Instance.send(C2SProtocol.C_CHECK_MOVEABLE);
  }

  public enterSpace(mapId: number = 10000) {
    let msg: PropertyMsg = new PropertyMsg();
    msg.param1 = mapId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_SPACE_ENTER, msg);
  }

  public leaveSpace(nodeId: number = 0) {
    let msg: PropertyMsg = new PropertyMsg();
    msg.param1 = nodeId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_SPACE_LEAVE, msg);
  }

  public move(paths: any[], type: PlayerVisualFollow) {
    let msg: SpacePlayerMoveMsg = new SpacePlayerMoveMsg();
    let playerMsg: SpacePlayerMsg = new SpacePlayerMsg();
    playerMsg.playerId = ArmyManager.Instance.army.userId;
    let posMsg: PosMsg;
    for (const key in paths) {
      let pos: Laya.Point = paths[key];
      posMsg = new PosMsg();
      posMsg.x = pos.x;
      posMsg.y = pos.y;
      playerMsg.path.push(posMsg);
    }
    msg.players.push(playerMsg);
    msg.isVisualFollow = type;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_SPACE_MOVE, msg);
  }

  public nodeTrigger(nodeId: number = 0) {
    let msg: PropertyMsg = new PropertyMsg();
    msg.param1 = nodeId;
    SocketManager.Instance.send(C2SProtocol.C_PLAYER_SPACE_NODE_TRIGGER, msg);
  }

  /**
   * 天空之城切磋邀请
   * @param targetId 玩家Id
   */
  public sendMapPkInviteTo(targetId: number) {
    var self: SpaceArmy = SpaceManager.Instance.model.selfArmy;
    var msg: HangupAttackMsg = new HangupAttackMsg();
    msg.op = 1;
    msg.attackId = self.userId;
    msg.attackName = self.nickName;
    msg.defenceId = targetId;
    SocketManager.Instance.send(C2SProtocol.C_SPACEMAP_ATTACK, msg);
  }

  /**
   * 天空之城英灵切磋邀请
   * @param targetId 玩家Id
   */
  public sendMapPetPkInviteTo(targetId: number) {
    var self: SpaceArmy = SpaceManager.Instance.model.selfArmy;
    var msg: HangupAttackMsg = new HangupAttackMsg();
    msg.op = 4;
    msg.attackId = self.userId;
    msg.attackName = self.nickName;
    msg.defenceId = targetId;
    SocketManager.Instance.send(C2SProtocol.C_SPACEMAP_ATTACK, msg);
  }

  public requestPlayerInfos(list: any[]) {
    let msg: SpacePlayerArmyInfoReqMsg = new SpacePlayerArmyInfoReqMsg();
    msg.userList = list;
    SocketManager.Instance.send(C2SProtocol.C_GET_SPACE_PLAYER_ARMY_INFO, msg);
  }

  /**前往紫金矿产 */
  public nodeMineral() {
    SocketManager.Instance.send(C2SProtocol.C_ENTER_MINE_FIELD, null);
  }

  /**
   * 2015新年礼箱采集读条
   * @param nodeId节点id
   */
  public sendYearBoxCollect(nodeId: number) {
    if (ArmyManager.Instance.thane.grades < OpenGrades.SPACE_COLLECT) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "map.sapce.view.frame.DialogOptionItem.lifeskillTips",
        ),
      );
      return;
    }
    var msg: PropertyMsg = new PropertyMsg();
    msg.param1 = 1;
    msg.param2 = nodeId;
    SocketManager.Instance.send(C2SProtocol.C_NEW_YEAR_BOX_ACTIVE, msg);
  }
  /**
   * 2015新年礼箱采集确认
   * @param type 节点Id
   */
  public sendYearBoxCollectConfirm(nodeId: number) {
    var msg: PropertyMsg = new PropertyMsg();
    msg.param1 = 2;
    msg.param2 = nodeId;
    SocketManager.Instance.send(C2SProtocol.C_NEW_YEAR_BOX_ACTIVE, msg);
  }
  /**
   * 2015新年礼箱采集查询
   * @param type 节点Id
   */
  public searchYearBox() {
    var msg: PropertyMsg = new PropertyMsg();
    msg.param1 = 3;
    SocketManager.Instance.send(C2SProtocol.C_NEW_YEAR_BOX_ACTIVE, msg);
  }
}
