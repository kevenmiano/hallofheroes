import { KingContractModel } from "../module/kingcontract/KingContractModel";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import { KingContractInfo } from "../module/kingcontract/KingContractInfo";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { NotificationManager } from "./NotificationManager";
import { KingContractEvents } from "../constant/event/NotificationEvent";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { ArmyManager } from "./ArmyManager";
//@ts-expect-error: External dependencies
import KingContractMsg = com.road.yishi.proto.player.KingContractMsg;
//@ts-expect-error: External dependencies
import KingContractBuyMsg = com.road.yishi.proto.player.KingContractBuyMsg;

export class KingContractManager {
  private _model: KingContractModel;
  private static _instance: KingContractManager;

  public static get Instance(): KingContractManager {
    if (KingContractManager._instance == null) {
      KingContractManager._instance = new KingContractManager();
    }
    return KingContractManager._instance;
  }

  public setup() {
    this.initEvent();
    this._model = new KingContractModel();
  }

  public get model(): KingContractModel {
    return this._model;
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_KING_CONTRACTE,
      this,
      this.__updateKingContractHandler,
    );
  }

  private __updateKingContractHandler(pkg: PackageIn) {
    let msg: KingContractMsg = pkg.readBody(KingContractMsg) as KingContractMsg;
    let infos = msg.kingContractInfos;
    for (let msgItem of infos) {
      let info: KingContractInfo = this._model.getInfoById(msgItem.contractId);
      if (info) {
        info.endData = DateFormatter.parse(
          msgItem.endData,
          "YYYY-MM-DD hh:mm:ss",
        );
      }
    }
    NotificationManager.Instance.dispatchEvent(
      KingContractEvents.UPDATE_KINGCONTRACT,
      null,
    );
  }

  public sendKingContract(ids: any[]) {
    let msg: KingContractBuyMsg = new KingContractBuyMsg();
    msg.ids = ids;
    msg.use = false;
    msg.friendId = ArmyManager.Instance.army.userId;
    msg.friendname = ArmyManager.Instance.army.nickName;
    SocketManager.Instance.send(C2SProtocol.C_KING_CONTRACT, msg);
  }

  public sendKingContractFench() {
    let msg: KingContractBuyMsg = new KingContractBuyMsg();
    msg.ids = [];
    msg.use = true;
    msg.friendId = 0;
    SocketManager.Instance.send(C2SProtocol.C_KING_CONTRACT, msg);
  }

  public presentKingContract(ids: any[], friendId: number, friendname: string) {
    let msg: KingContractBuyMsg = new KingContractBuyMsg();
    msg.ids = ids;
    msg.use = false;
    msg.friendId = friendId;
    msg.friendname = friendname;
    SocketManager.Instance.send(C2SProtocol.C_KING_CONTRACT, msg);
  }

  /**
   * 检查是否开通指定Buff
   */
  public checkHasBuffById(id: number): boolean {
    let info: KingContractInfo = this.model.getInfoById(id);
    if (info && info.leftTime > 0) {
      return true;
    }
    return false;
  }
}
