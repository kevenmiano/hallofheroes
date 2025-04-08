// @ts-nocheck
import { TransactionBase } from "./TransactionBase";
import { BattleManager } from "../BattleManager";
import { SkillResourceLoader } from "../skillsys/loader/SkillResourceLoader";
import { SkillResLoaderVO } from "../skillsys/loader/SkillResLoaderVO";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import ArmyResMsg = com.road.yishi.proto.battle.ArmyResMsg;
import PreLoadResMsg = com.road.yishi.proto.battle.PreLoadResMsg;
import { BattleModel } from "../BattleModel";

/**
 * 增援相关的技能资源加载事务处理类
 * @author yuanzhan.yu
 */
export class ReinfoResTransaction extends TransactionBase {
    constructor() {
        super();
    }

    public configure(param: Object) {
        super.configure(param);
        if (!this.battleModel) {
            return
        }
        let msg: ArmyResMsg = this._pkg.readBody(ArmyResMsg) as ArmyResMsg;

        let loaderRes: PreLoadResMsg;
        let pawnIds: any[] = [];
        let heroIds: any[] = [];
        let skillVos: any[] = [];
        let id: number;
        let pawnSkillIds: any[] = [];
        let p: number;
        let reinforceType: number = msg.reinforceType; //增援类型  1 怪物增援   2  玩家增援
        for (let i: number = 0; i < msg.loadRes.length; i++) {
            loaderRes = msg.loadRes[i] as PreLoadResMsg;
            for (let j: number = 0; j < loaderRes.soldierTempId.length; j++) {
                id = loaderRes.soldierTempId[j];
                if (pawnIds.indexOf(id) == -1) {
                    pawnIds.push(id);
                }

            }
            for (let k: number = 0; k < loaderRes.heroSkill.length; k++) {
                id = loaderRes.heroSkill[k];
                if (heroIds.indexOf(id) == -1) {
                    heroIds.push(id);
                }
            }
            for (p = 0; p < loaderRes.soldierSkill.length; p++) {
                if (pawnSkillIds.indexOf(loaderRes.soldierSkill[p]) == -1) {
                    pawnSkillIds.push(loaderRes.soldierSkill[p]);
                }
            }
            // pawnIds = pawnIds.concat(loaderRes.soldierTempId);
            // heroIds = heroIds.concat(loaderRes.heroSkill);
        }

        if (reinforceType == 1) {
            let battleWnd = BattleManager.Instance.battleUIView
            if (battleWnd) {
                battleWnd.reinforceViewHandler.setReinforceWaveInfo(msg.reinforceCount, 1);
            } else {
                BattleManager.Instance.battleModel.reinforceWave = msg.reinforceCount;
            }
        }


        let skillIds: any[] = [];

        for (p = 0; p < pawnIds.length; p++) {
            skillIds = skillIds.concat(SkillResourceLoader.getPawnSkillIds(pawnIds[p]));
        }

        skillIds = skillIds.concat(pawnSkillIds);
        skillIds.forEach(pawnSkillId => {
            skillVos.push(new SkillResLoaderVO(pawnSkillId, 2));
        })
        let heroFullSkillIds: any[] = SkillResourceLoader.getHeroFullSkillIds(heroIds)
        skillIds = skillIds.concat(heroFullSkillIds);

        heroFullSkillIds.forEach(heroSkillId => {
            skillVos.push(new SkillResLoaderVO(heroSkillId, 3));
        })

        // SkillResourceLoader.add(skillIds);
        SkillResourceLoader.addSkillVOs(skillVos);
    }

    public getCode(): number {
        return S2CProtocol.U_B_LOAD_RES;
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }
}