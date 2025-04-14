import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";

//@ts-expect-error: External dependencies
import ChangeFrameReq = com.road.yishi.proto.frame.ChangeFrameReq;
//@ts-expect-error: External dependencies

import ChangeFrameResp = com.road.yishi.proto.frame.ChangeFrameResp;

import { SocketManager } from "../../../../core/net/SocketManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import HeadIconModel from "./HeadIconModel";
import HeadFrameInfo from "./HeadFrameInfo";
import Dictionary from "../../../../core/utils/Dictionary";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
export default class HeadIconCtr extends FrameCtrlBase {
  constructor() {
    super();
  }

  protected addEventListener() {
    super.addEventListener();
    ServerDataManager.listen(
      S2CProtocol.U_C_CHANGE_FRAME,
      this,
      this.__frameChangeHandler,
    );
  }

  protected delEventListener() {
    super.delEventListener();
    ServerDataManager.cancel(
      S2CProtocol.U_C_CHANGE_FRAME,
      this,
      this.__frameChangeHandler,
    );
  }

  private __frameChangeHandler(pkg: PackageIn) {
    let msg: ChangeFrameResp = pkg.readBody(ChangeFrameResp) as ChangeFrameResp;
    if (msg) {
      if (msg.ret) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "armyII.viewII.information.InformationView.saveSucceed",
          ),
        );
      }
    }
  }

  /**
   * 头像框切换
   * @param frameId 头像框Id id=0就相当于卸载 不为0替换
   */
  public static changeFrameId(frameId: number) {
    let msg: ChangeFrameReq = new ChangeFrameReq();
    msg.frameId = frameId;
    SocketManager.Instance.send(C2SProtocol.C_FRAME_CHANGE, msg);
  }

  public static requestAllFrame() {
    SocketManager.Instance.send(C2SProtocol.C_GET_ALL_FRAME);
  }
}
