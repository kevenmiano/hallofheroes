import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import { NotificationManager } from "./NotificationManager";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import CCCActiveType from "../constant/CCCActiveType";

//@ts-expect-error: External dependencies
import ChargePointLotteryMsg = com.road.yishi.proto.active.ChargePointLotteryMsg;
//@ts-expect-error: External dependencies//@ts-expect-error: External dependencies
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
//@ts-expect-error: External dependencies
import LotteryItemMsg = com.road.yishi.proto.active.LotteryItemMsg;

import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/5/22 17:31
 * @ver 1.0
 */
export class ChargeLotteryManager {
  private static _instance: ChargeLotteryManager;
  public openChargeLottery: boolean = false;
  private _chargeLotteryMsg: ChargePointLotteryMsg;

  public static get instance(): ChargeLotteryManager {
    if (!this._instance) {
      this._instance = new ChargeLotteryManager();
    }
    return this._instance;
  }

  public setup(): void {
    this.initEvent();
    // ChargeLotteryManager.instance.OperateChargeReq(1);
  }

  private initEvent(): void {
    ServerDataManager.listen(
      S2CProtocol.U_C_CHARGELOTTERYINFO,
      this,
      this.__chargelotteryHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CHARGELOTTERY_STATE,
      this,
      this.__openStateHandler,
    );
  }

  private __chargelotteryHandler(pkg: PackageIn): void {
    let msg: ChargePointLotteryMsg = pkg.readBody(
      ChargePointLotteryMsg,
    ) as ChargePointLotteryMsg;

    if (msg.op == 1) {
      this._chargeLotteryMsg = msg;
    } else if (msg.op == 2) {
      this._chargeLotteryMsg.op = msg.op;
      this._chargeLotteryMsg.leftNeedPoint = msg.leftNeedPoint;
      this._chargeLotteryMsg.leftCount = msg.leftCount;
      this._chargeLotteryMsg.dayAddCount = msg.dayAddCount;
      this._chargeLotteryMsg.isOneKey = msg.isOneKey;
      this._chargeLotteryMsg.isRare = msg.isRare;
      this._chargeLotteryMsg.resultPos = msg.resultPos.slice(
        0,
        msg.resultPos.length,
      );
    } else if (msg.op == 3) {
      this._chargeLotteryMsg.op = msg.op;
      this._chargeLotteryMsg.logs = msg.logs.slice(0, msg.logs.length);
    }
    NotificationManager.Instance.sendNotification(
      NotificationEvent.CHARGELOTTERY_RESULT_UPDATE,
    );
  }

  private __openStateHandler(pkg: PackageIn): void {
    let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;

    this.openChargeLottery = msg.param7;
    if (!this.openChargeLottery) {
      if (FrameCtrlManager.Instance.isOpen(EmWindow.Funny))
        FrameCtrlManager.Instance.exit(EmWindow.Funny);
    }
    NotificationManager.Instance.sendNotification(
      NotificationEvent.REFRESH_TOPTOOLS,
    );
  }

  public get chargeMsg(): ChargePointLotteryMsg {
    return this._chargeLotteryMsg;
  }

  public get normalArr(): LotteryItemMsg[] {
    return this._chargeLotteryMsg.reward as LotteryItemMsg[];
  }

  public get rareArr(): any[] {
    let arr: any[] = [];
    for (let i: number = 0; i < this._chargeLotteryMsg.reward.length; i++) {
      if (this._chargeLotteryMsg.reward[i].templateType == 2) {
        arr.push(this._chargeLotteryMsg.reward[i]);
      }
    }
    return arr;
  }

  public OperateChargeReq(op: number, isOneKey: boolean = false): void {
    let msg: ChargePointLotteryMsg = new ChargePointLotteryMsg();
    msg.op = op;
    msg.isOneKey = isOneKey;
    SocketManager.Instance.send(
      C2SProtocol.C_CCCACTIVE_CLIENTOP,
      msg,
      CCCActiveType.CHARGELOTTERY,
    );
  }
}
