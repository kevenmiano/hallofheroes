import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { BattleManager } from "../BattleManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { BattleBaseTransaction } from "./BattleBaseTransaction";

//@ts-expect-error: External dependencies
import BattleStartMsg = com.road.yishi.proto.battle.BattleStartMsg;
import Logger from "../../../core/logger/Logger";
import { BattleModel } from "../BattleModel";

/**
 * @author yuanzhan.yu
 */
export class BattleStartTransaction extends BattleBaseTransaction {
  constructor() {
    super();
  }

  public handlePackage() {}

  public configure(param: object) {
    if (!this.battleModel) {
      return;
    }
    this._pkg = param as PackageIn;
    let msg: BattleStartMsg = this._pkg.readBody(
      BattleStartMsg,
    ) as BattleStartMsg;

    let time: number = msg.frame;
    BattleManager.Instance.synchronization = time;
    let mainType: number = msg.mainType; //战斗类型(是否有突击等)
    this.battleModel.battleType = mainType;
    this.battleModel.started = true;
    this.battleModel.hurtUpStart(msg.countDown);
    Logger.base("🔥开始战斗吧！勇士……", mainType);
  }

  public getCode(): number {
    return S2CProtocol.U_B_START;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }
}
