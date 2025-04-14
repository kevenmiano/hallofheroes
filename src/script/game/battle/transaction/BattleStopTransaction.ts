import { BattleBaseTransaction } from "./BattleBaseTransaction";
import { PackageIn } from "../../../core/net/PackageIn";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";

//@ts-expect-error: External dependencies
import UserStopMsg = com.road.yishi.proto.battle.UserStopMsg;

/**
 * @author yuanzhan.yu
 */
export class BattleStopTransaction extends BattleBaseTransaction {
  constructor() {
    super();
  }

  public configure(param: object) {
    this._pkg = null;
    this._pkg = <PackageIn>param;
  }

  public getCode(): number {
    return S2CProtocol.U_B_USER_STOP;
  }

  //服务器传来的值
  //停止类型
  //      1.演示技能
  //      2.对话框
  //针对类型附加值
  public handlePackage() {
    let msg: UserStopMsg = this._pkg.readBody(UserStopMsg) as UserStopMsg;

    let stopType: number = msg.type;
    let value: number = msg.order;
  }
}
