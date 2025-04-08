// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description
 **/

import {BattleManager} from "../BattleManager";
import {BaseSkill} from "../skillsys/skills/BaseSkill";

export class SkillProcessStrategy
{
    /**
     * 技能的处理策略常量,表示需要跳过技能的施放,而直接播放被攻击方的掉血效果.
     */
    public static SKIP:number = 0;
    /**
     * 技能的处理策略常量,表示正常播放技能.
     */
    public static NORMAL:number = 1;

    /**
     * 处理时间同步的问题.
     * @param serverTime 服务器端的时间(帧).
     * @return 返回技能施放的策略.值为0时,技能会被跳过,只播放掉血,值为1时,正常播放技能.
     *
     */
    public static processSynchronization(serverTime:number, skill:BaseSkill):number
    {
        let needSkip:number = SkillProcessStrategy.NORMAL;
        let clientTime:number = BattleManager.Instance.BattleFrameCount;
        let differ:number = serverTime - clientTime;
        if(differ < -20)
        {
            BattleManager.Instance.synchronization = serverTime
        }
        else if(differ > 5)
        {
            needSkip = SkillProcessStrategy.processWhenClientSlower(differ, skill);
            BattleManager.Instance.synchronization = serverTime;
        }
        else
        {
            BattleManager.Instance.synchronization = clientTime + (serverTime - clientTime) * 0.2;//修正20%
        }
        return needSkip;
    }

    /**
     * 进一步处理当客户端时间比服务器端时间慢比较多的状况。
     * @param differ 服务器端时间与客户端时间的差值。
     * @return 返回是否调过技能的值。
     *
     */
    private static processWhenClientSlower(differ:number, skillN:BaseSkill):number
    {
        let waitList:any[] = BattleManager.Instance.getWaitSkillList();
        let skill:BaseSkill;
        for(let i:number = 0; i < waitList.length; i++)
        {
            skill = waitList[i] as BaseSkill;
            if(SkillProcessStrategy.checkIsCanSkip(skill.getSkillData().skillId))
            {
                if(skill.getCurrentRole() == BattleManager.Instance.battleModel.selfHero)
                {
                    if(skill.isDefaultSkill())
                    {
                        skill.setProcessStrategy(SkillProcessStrategy.SKIP);
                    }
                }
                else
                {
                    skill.setProcessStrategy(SkillProcessStrategy.SKIP);
                }
            }
        }
        return SkillProcessStrategy.NORMAL
    }

    /**
     * 根据技能ID检查技能是否允许跳过(某些技能不能被跳过,如胜利、失败)
     * @param skillId 技能ID
     * @return
     *
     */
    private static checkIsCanSkip(skillId:number):boolean
    {
        switch(skillId)
        {
            case 1:
            case 2:
            case 3:
            case 4:
                return false;
                break;
            default:
                break;
        }
        return true;
    }
}