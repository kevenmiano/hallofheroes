import { SocketManager } from "../../../../core/net/SocketManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";

//@ts-expect-error: External dependencies

import RecoverReqMsg = com.road.yishi.proto.recover.RecoverReqMsg;
export default class ExpBackCtr extends FrameCtrlBase {
  show() {
    super.show();
  }

  hide() {
    super.hide();
  }

  dispose() {
    super.dispose();
  }
  protected addEventListener() {
    super.addEventListener();
  }

  protected delEventListener() {
    super.delEventListener();
  }

  /**
   *
   * @param petId 领取普通奖励
   */
  public getComReward() {
    var msg: RecoverReqMsg = new RecoverReqMsg();
    msg.way = 1;
    msg.type = 1;
    SocketManager.Instance.send(C2SProtocol.C_RECOVER, msg);
  }

  /**
   *
   * @param petId 领取额外奖励
   */
  public getExtraReward(payType: number = 1) {
    var msg: RecoverReqMsg = new RecoverReqMsg();
    msg.way = 2;
    msg.type = 1;
    msg.payType = payType;
    SocketManager.Instance.send(C2SProtocol.C_RECOVER, msg);
  }
}
