import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";

import AppellExchangeMsg = com.road.yishi.proto.player.AppellExchangeMsg;

/**
 * 称号相关操作与服务器的交互
 * @author gang.liu
 *
 */
export default class AppellSocketOutManager {
  public static sendProtoBuffer(code: number, message: any) {
    SocketManager.Instance.send(code, message);
  }

  /**
   * 改变玩家称号
   * @param appellId 称号ID
   */
  public static exchangeAppell(appellId: number = 0) {
    var msg: AppellExchangeMsg = new AppellExchangeMsg();
    msg.appellId = appellId;
    msg.look = false;
    this.sendProtoBuffer(C2SProtocol.C_APPELL_EXCHANGE, msg);
  }

  /**
   * 查看称号信息
   */
  public static lookAppellInfos() {
    var msg: AppellExchangeMsg = new AppellExchangeMsg();
    msg.appellId = 0;
    msg.look = true;
    this.sendProtoBuffer(C2SProtocol.C_APPELL_EXCHANGE, msg);
  }
}
