import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { TransactionBase } from "./TransactionBase";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import BattleNoticeMsg = com.road.yishi.proto.battle.BattleNoticeMsg;

/**
 * @author yuanzhan.yu
 */
export class BattleNoticeTransaction extends TransactionBase {
    constructor() {
        super();
    }

    public configure(param: Object) {
        super.configure(param);
        if (!this.battleModel) {
            return
        }
        let msg = this._pkg.readBody(BattleNoticeMsg) as BattleNoticeMsg;
        if (msg.buffType == 1) {
            this.battleModel.updateBattleNotice(msg.buffType, msg.damageImprove);
        } else if (msg.buffType == 2) {
            this.battleModel.hurtUpStart(msg.countDown, msg.damageImprove);
        }
    }

    public getCode(): number {
        return S2CProtocol.U_B_BATTLE_NOTICE;
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }
}