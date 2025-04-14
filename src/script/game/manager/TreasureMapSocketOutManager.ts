// import { Message } from "../../../../protobuf/library/protobuf-library";
import { PackageOut } from "../../core/net/PackageOut";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { TreasureMapModel } from "../mvc/model/Treasuremap/TreasureMapModel";

//@ts-expect-error: External dependencies
import PlayerTreasureMsg = com.road.yishi.proto.treasuremap.PlayerTreasureMsg;

//@ts-expect-error: External dependencies
import GuildMsg = com.road.yishi.proto.guildcampaign.GuildMsg;
export class TreasureMapSocketOutManager {
  /**
   * 请求藏宝图信息
   *
   */
  public static sendRequestTreasureMap() {
    var msg: PlayerTreasureMsg = new PlayerTreasureMsg();
    msg.opType = TreasureMapModel.REQUEST_TREASUREMAP;
    SocketManager.Instance.send(C2SProtocol.C_TREASUREMAP_OP, msg);
  }
  /**
   * 刷新藏宝图
   * @param quickly	是否一键刷新
   * @param useBind	是否使用绑钻
   *
   */
  public static sendRefreshTreasureMap(
    quickly: boolean = false,
    useBind: boolean = false,
  ) {
    var msg: PlayerTreasureMsg = new PlayerTreasureMsg();
    msg.opType = TreasureMapModel.REFRESH;
    msg.refreshType = quickly;
    if (useBind) {
      msg.payType = 0;
    } else {
      msg.payType = 1;
    }
    SocketManager.Instance.send(C2SProtocol.C_TREASUREMAP_OP, msg);
  }

  /**
   * 领取藏宝图
   *
   */
  public static sendGetTreasureMap() {
    var msg: PlayerTreasureMsg = new PlayerTreasureMsg();
    msg.opType = TreasureMapModel.GET_TREASUREMAP;
    SocketManager.Instance.send(C2SProtocol.C_TREASUREMAP_OP, msg);
  }

  /**
   * 立即挖掘
   * @param pos		藏宝图背包位置
   * @param useBind	是否使用绑钻
   *
   */
  public static sendDigTreasureMap(pos: number, useBind: boolean = false) {
    var msg: PlayerTreasureMsg = new PlayerTreasureMsg();
    msg.opType = TreasureMapModel.EXCAVATEIMM;
    msg.index = pos;
    if (useBind) {
      msg.payType = 0;
    } else {
      msg.payType = 1;
    }
    SocketManager.Instance.send(C2SProtocol.C_TREASUREMAP_OP, msg);
  }

  /**
   * 使用藏宝图
   * @param pos		藏宝图背包位置
   *
   */
  public static sendUseTreasureMap(pos: number) {
    var msg: PlayerTreasureMsg = new PlayerTreasureMsg();
    msg.opType = TreasureMapModel.USE_TREASUREMAP;
    msg.index = pos;
    SocketManager.Instance.send(C2SProtocol.C_TREASUREMAP_OP, msg);
  }

  /**
   * 确定获得奖励
   * @param pos		藏宝图背包位置
   * @param flag		是否获得
   *
   */
  public static sendReceiveTreasureMap(pos: number, flag: boolean) {
    var msg: PlayerTreasureMsg = new PlayerTreasureMsg();
    msg.opType = TreasureMapModel.CONFIRM_GET_REWARD;
    msg.index = pos;
    msg.isReward = flag;
    SocketManager.Instance.send(C2SProtocol.C_TREASUREMAP_OP, msg);
  }

  /**
   * 藏宝图增援
   * @param userId	用户ID（增援的目标）
   *
   */
  public static sendReinforceTreasureMap(userId: number) {
    var msg: GuildMsg = new GuildMsg();
    msg.param1 = userId;
    SocketManager.Instance.send(
      C2SProtocol.C_TREASUREMAP_BATTLE_REINFORCE,
      msg,
    );
  }
}
