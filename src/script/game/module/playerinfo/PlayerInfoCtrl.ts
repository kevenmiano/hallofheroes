//@ts-expect-error: External dependencies
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import PlayerPetOpMsg = com.road.yishi.proto.pet.PlayerPetOpMsg;
import { SocketManager } from "../../../core/net/SocketManager";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { PlayerManager } from "../../manager/PlayerManager";
import LangManager from "../../../core/lang/LangManager";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";

export class PlayerInfoCtrl extends FrameCtrlBase {
  constructor() {
    super();
  }

  /**
   * 查看玩家英灵神器信息
   * @param target_userid  玩家ID
   */
  public static sendRequestPetArtifact() {
    var msg: PlayerPetOpMsg = new PlayerPetOpMsg();
    msg.targetUserid =
      PlayerManager.Instance.currentPlayerModel.lookTargetUserId;
    SocketManager.Instance.send(C2SProtocol.C_GET_PET_ARTIFACT_LIST, msg);
  }
}
