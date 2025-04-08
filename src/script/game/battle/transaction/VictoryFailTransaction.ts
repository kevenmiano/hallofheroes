import {PackageIn} from "../../../core/net/PackageIn";
import {SkillHandlerII} from "../handler/SkillHandlerII";
import {SkillData} from "../data/SkillData";
import {BattleModel} from "../BattleModel";
import {BattleManager} from "../BattleManager";
import {HeroRoleInfo} from "../data/objects/HeroRoleInfo";
import PrepareOverMsg = com.road.yishi.proto.battle.PrepareOverMsg;
import PrepareOverLivingMsg = com.road.yishi.proto.battle.PrepareOverLivingMsg;

/**
 * 胜利失败事务处理
 * @author yuanzhan.yu
 */
export class VictoryFailTransaction
{
    constructor()
    {
    }

    public static handle(pkg:PackageIn)
    {
        let skillHandler:SkillHandlerII;
        let skillData:SkillData

        let msg:PrepareOverMsg = pkg.readBody(PrepareOverMsg) as PrepareOverMsg;
        let liftTime:number = msg.frame//pkg.readInt();
        let battleModel:BattleModel = BattleManager.Instance.battleModel;
        if(!BattleManager.Instance.getSkillSystem() || !battleModel)
        {
            return;
        }

        let length:number = msg.prepareOverLivings.length//pkg.readInt();
        let living:PrepareOverLivingMsg;
        let vSide:number;
        let vIds:any[] = []
        let vTempData:SkillData
        for(let i:number = 0; i < length; i++)
        {
            living = msg.prepareOverLivings[i] as PrepareOverLivingMsg
            skillData = new SkillData();
            skillData.liftTime = liftTime;
            skillData.skillId = living.calcType;//pkg.readInt();
            skillData.fId = living.livingId//pkg.readInt();
            skillData.sp = living.sp//pkg.readInt();
            if(skillData.skillId == 3)
            {//胜利.
                vIds.push(skillData.fId)
                if(!vTempData)
                {
                    vTempData = skillData;
					//BaseRoleInfo
                    let role = battleModel.getRoleById(skillData.fId);
                    if(role)
                    {
                        vSide = role.side;
                    }
                }
            }

            skillHandler = new SkillHandlerII(skillData);
            skillHandler.handler();
        }
        VictoryFailTransaction.deadPlayerPlayVictory(vSide, vTempData, vIds);

    }

    private static deadPlayerPlayVictory(vSide:number, tempSkillData:SkillData, addedIds:any[])
    {
        let roles:any[] = BattleManager.Instance.battleModel.getRoleBySide(vSide);
        let skillData:SkillData
        let skillHandler:SkillHandlerII;
        roles.forEach(role =>
        {
            if(role instanceof HeroRoleInfo && addedIds.indexOf(role.livingId) == -1)
            {
                skillData = new SkillData();

                skillData.liftTime = tempSkillData.liftTime;

                skillData.skillId = tempSkillData.skillId;
                skillData.fId = role.livingId
                skillData.sp = (role as HeroRoleInfo).sp;

                skillHandler = new SkillHandlerII(skillData);
                skillHandler.handler();
            }
        });
    }
}