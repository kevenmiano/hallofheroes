// @ts-nocheck
import { BattleBaseTransaction } from "./BattleBaseTransaction";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { PackageIn } from "../../../core/net/PackageIn";
import { BattleModel } from "../BattleModel";
import { BattleManager } from "../BattleManager";
import { SkillData } from "../data/SkillData";
import { SocketGameReader } from "../../manager/SocketGameReader";
import { BloodHelper } from "../skillsys/helper/BloodHelper";
import { SkillHandlerII } from "../handler/SkillHandlerII";
import { SkillProcessStrategy } from "../handler/SkillProcessStrategy";
import { AttackData } from "../data/AttackData";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import AttackOrderMsg = com.road.yishi.proto.battle.AttackOrderMsg;
import DamageMsg = com.road.yishi.proto.battle.DamageMsg;
import WaitReviveMsg = com.road.yishi.proto.battle.WaitReviveMsg;
import Logger from "../../../core/logger/Logger";
import ReliveInfo from "../data/ReliveInfo";

/**
 * 攻击
 * @author yuanzhan.yu
 */
export class BattleAttackTransaction extends BattleBaseTransaction {
    private _isFirstAttack: boolean = true;

    constructor() {
        super();
    }

    public getCode(): number {
        return S2CProtocol.U_B_ATTACKING;
    }

    public configure(param: Object) {
        let battleModel: BattleModel = BattleManager.Instance.battleModel;
        if (!battleModel) return

        if (this._isFirstAttack) {
            this._isFirstAttack = false;
        }
        this._pkg = param as PackageIn;

        let msg: AttackOrderMsg = this._pkg.readBody(AttackOrderMsg) as AttackOrderMsg;

        if (msg.battleId != battleModel.battleId) {
            // let desc:string = LangManager.Instance.GetTranslation("battle.transaction.BattleAttackTransaction.desc");
            // let get:string = LangManager.Instance.GetTranslation("battle.transaction.BattleAttackTransaction.get");
            // LoggerSys.info("BattleId"+desc+battleModel.battleId+get+msg.battleId);
            //如果不是同一场战斗.
            return;
        }

        let skillData: SkillData = this.readSkill(msg);
        Logger.battle("收到攻击指令:", battleModel.getRoleById(skillData.fId) && battleModel.getRoleById(skillData.fId).roleName, skillData);
        skillData.buffers = SocketGameReader.readBufferII(msg);
        skillData.awakens = SocketGameReader.readAwakenData(msg);
        if (skillData.awakens && skillData.awakens.length > 0) {
            battleModel.cacheAwakenRoles(skillData.awakens)
        }
        BloodHelper.processBlood(skillData);

        let skillHandler: SkillHandlerII = new SkillHandlerII(skillData);
        let skillStrategy: number = SkillProcessStrategy.processSynchronization(msg.frame, skillHandler.getSkill());
        skillData.processStrategy = skillStrategy;
        skillHandler.handler();//对最后一个技能执行处理函数.
    }

    private readSkill(skillMsg: AttackOrderMsg): SkillData {
        let skillData: SkillData = this.readSkillData(skillMsg);
        if (skillData.skillId == 0) {
            skillData.skillId = -1
        }
        return skillData;
    }

    /**
     * 数据格式转换
     * @param ids
     * @param list
     * @return
     *
     */
    private dataFormatConversion(ids: number[], list: AttackData[]): AttackData[][] {
        let items: AttackData[][] = [];
        let attackTimes: number = list.length / ids.length;
        for (let i: number = 0; i < attackTimes; i++) {
            let item: AttackData[] = [];
            for (let j: number = 0; j < ids.length; j++) {
                let data: AttackData = list[i + j * attackTimes] as AttackData
                item.push(data);
            }
            items.push(item);
        }
        return items;
    }

    private readSkillData(skillMsg: AttackOrderMsg): SkillData {
        let skillData: SkillData = new SkillData();
        skillData.skillId = skillMsg.orderId;
        skillData.fId = skillMsg.livingId;
        skillData.sp = skillMsg.sp;
        skillData.spAdded = skillMsg.spAdded;
        skillData.attackMillis = DateFormatter.parse(skillMsg.attackMillis, "YYYY-MM-DD hh:mm:ss").getTime();
        skillData.battleId = skillMsg.battleId;
        skillData.passive = skillMsg.isPassive;
        skillData.liftTime = skillMsg.execFrame;
        let vSize: number = skillMsg.damages.length;//攻击人数
        let ids: number[] = [];
        let tId: number = 0;
        let list: AttackData[] = [];
        let damageMsg: DamageMsg;

        for (let i: number = 0; i < vSize; i++) {
            damageMsg = skillMsg.damages[i] as DamageMsg;
            tId = damageMsg.livingId;//攻击对象
            let data: AttackData = new AttackData();
            data.bloodType = damageMsg.damageType;
            data.roleId = tId;
            data.fId = skillData.fId;
            data.damageValue = damageMsg.damageValue;
            data.displayBlood = damageMsg.damageValue;
            data.extraData = damageMsg.extraData;
            data.parry = damageMsg.parry;
            data.leftHp = damageMsg.leftValue;
            data.resistValue = damageMsg.resistValue;
            data.resistType = damageMsg.resistType;
            data.resitPercent = damageMsg.resistPercent;

            damageMsg.dropInfos.forEach((drop, index, array) => {
                data.dropList.push(drop);
            })
            if (ids.indexOf(tId) == -1) {
                ids.push(tId);
            }
            list.push(data);
        }
        skillData.data = this.dataFormatConversion(ids, list);
        for (let i: number = 0; i < skillMsg.waitRevives.length; i++) {
            let itemMsg: WaitReviveMsg = skillMsg.waitRevives[i] as WaitReviveMsg;
            var reliveInfo: ReliveInfo = ReliveInfo.createFromMsg(itemMsg);
            skillData.reliveList.push(reliveInfo);
        }
        return skillData;
    }
}