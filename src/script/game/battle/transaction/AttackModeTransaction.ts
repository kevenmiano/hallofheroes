import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { TransactionBase } from "./TransactionBase";
import AttackModeMsg = com.road.yishi.proto.battle.AttackModeMsg;

/**
 * 动作类型处理（msg.mode普通0  格挡1  攻击2）
 * @author yuanzhan.yu
 */
export class AttackModeTransaction extends TransactionBase {
    constructor() {
        super();
    }

    public configure(param: Object) {
        super.configure(param);
        if (!this.battleModel) {
            return
        }

        let msg: AttackModeMsg = this._pkg.readBody(AttackModeMsg) as AttackModeMsg;
        let role = this.battleModel.getRoleInfoByUserId(msg.userId);
        let sp: number = msg.heroSp;
        if (role) {
            this.battleModel.setAttackModelById(role.livingId, msg.mode);
            if (role == this.battleModel.selfHero) {
                this.battleModel.actionCount = msg.fmTurn;//回合数
                if (sp > 0) {//更新sp
                    (role as HeroRoleInfo).updateSp((role as HeroRoleInfo).sp + sp);
                }
            }
        }
    }

    public getCode(): number {
        return S2CProtocol.U_B_FIGHT_MODE;
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }
}