// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description
 **/
import {BattleManager} from "../BattleManager";
import {SkillData} from "../data/SkillData";
import {BaseSkill} from "../skillsys/skills/BaseSkill";
import {SkillFactory} from "../skillsys/skills/SkillFactory";

export class SkillHandlerII
{
    private _skill:BaseSkill;

    constructor(skillData:SkillData)
    {
        this._skill = SkillFactory.createSkillByData(skillData);
    }

    /**
     * 处理
     *
     */
    public handler()
    {
        // BattleLogSystem.addSkillII(this._skill);	
        BattleManager.Instance.getSkillSystem().addSkill(this._skill);
    }

    /**
     * 获取当前技能
     * @return
     *
     */
    public getSkill():BaseSkill
    {
        if(!this._skill)
        {
            throw new Error("SkillHandlerII  this.getSkill Error ,please check！！！");
        }
        return this._skill;
    }
}    
