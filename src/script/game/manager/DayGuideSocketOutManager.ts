import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";

//@ts-expect-error: External dependencies
import ClickDatasRspMsg = com.road.yishi.proto.leed.ClickDatasRspMsg;
//@ts-expect-error: External dependencies
import ClientReqMsg = com.road.yishi.proto.leed.ClientReqMsg;
//@ts-expect-error: External dependencies
import LeedFinishedReqMsg = com.road.yishi.proto.leed.LeedFinishedReqMsg;

/**
 * @author:pzlricky
 * @data: 2021-06-30 16:52
 * @description 每日引导操作与服务器的相关交互
 */
export default class DayGuideSocketOutManager {
  public static sendProtoBuffer(code: number, message) {
    SocketManager.Instance.send(code, message);
  }

  /**
   * 每日引导完成获取奖励
   * @param index 标示达到的活跃度
   */
  public static sendGetGoods(index: number) {
    var msg: LeedFinishedReqMsg = new LeedFinishedReqMsg();
    msg.site = index;
    this.sendProtoBuffer(C2SProtocol.C_LEED_FINISH, msg);
  }

  /**
   * 每日引导活动增加
   * @param index 标示引导活动增加
   */
  public static sendLeedAdd(index: number) {
    this.sendProtoBuffer(C2SProtocol.C_LEED_ADD, null);
  }

  /**
   * 获取日常活动的完成次数
   */
  public static sendDailyCount() {
    this.sendProtoBuffer(C2SProtocol.C_CLICKDATALIST, null);
  }

  /**
   *每日引导客户端更新
   * @param leedTempId 每日引导任务模板ID
   */
  public static sendLeedClientUpdate(leedTempId: number) {
    var msg: ClientReqMsg = new ClientReqMsg();
    msg.templateId = leedTempId;
    this.sendProtoBuffer(C2SProtocol.C_LEED_CLIENT, msg);
  }
}
