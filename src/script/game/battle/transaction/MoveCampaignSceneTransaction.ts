import { NotificationManager } from "../../manager/NotificationManager";
import { TransactionBase } from "./TransactionBase";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { PackageIn } from "../../../core/net/PackageIn";

/**
 *  移屏事务
 */
export class MoveCampaignSceneTransaction extends TransactionBase {
  constructor() {
    super();
  }

  public handlePackage() {
    NotificationManager.Instance.dispatchEvent(
      S2CProtocol.U_C_CAMERA_MOVE.toString(),
      this.pkg,
    );
  }

  get pkg(): PackageIn {
    return this._pkg;
  }

  public getCode(): number {
    return S2CProtocol.U_C_CAMERA_MOVE;
  }
}
