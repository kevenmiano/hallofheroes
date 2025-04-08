// @ts-nocheck
 /**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description : 
 **/


import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { SkillType, ActionPresentType } from "../../../constant/SkillSysDefine";
import { SkillData } from "../../data/SkillData";
import { ActionTemplateData } from "../mode/ActionTemplateData";
import { BaseSkill } from "./BaseSkill";
import { CommonActionSkill } from "./CommonActionSkill";
import { EmptyActionSkill } from "./EmptyActionSkill";
import { FailedSkill } from "./FailedSkill";
import { ShootActionSkill } from "./ShootActionSkill";
import { SuccessSkill } from "./SuccessSkill";
 import {SpecialActionSkill105} from "./SpecialActionSkill105";

export class SkillFactory
{
    /**
     * 根据收到的技能数据创建技能. 
     * @param skillData
     * @return 
     * 
     */		
    public static createSkillByData(skillData : SkillData):BaseSkill
    {
        let skill : BaseSkill;
        //当被束缚的时候, 就创建一个空技能来处理当前回合
        if(skillData.skillId == -1){
            skill = new EmptyActionSkill();
        }else{
            skill = SkillFactory.createSkillBySkillId(skillData.skillId);
        }
        
        skill.setData(skillData);
        
        return skill;
    }
    
    /**
     * 根据技能ID创建技能 
     * @param skillId
     * @return 
     * 
     */		
    private static createSkillBySkillId(skillId : number):BaseSkill
    {			
        let skillTemplate:t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID( ConfigType.t_s_skilltemplate, skillId);
        if(!skillTemplate){
            return new BaseSkill();
        }
        let skill = SkillFactory.createSkillBySkillTemp(skillTemplate);
        skill.actionId = skillTemplate.ActionId;
        
        return skill;
    }
    
    /**
     * 根据技能模板数据创建技能. 
     * @param skillTemplate
     * @return 
     * 
     */		
    private static createSkillBySkillTemp(skillTemplate : t_s_skilltemplateData):BaseSkill
    {
        let skill : BaseSkill;
        let actionId : number = skillTemplate.ActionId
        let actionTemplate : ActionTemplateData = ConfigMgr.Instance.actionTemplate2[actionId];
        Logger.battle("[SkillFactory]createSkillBySkillTemp", actionId, actionTemplate)
        if(!actionTemplate){
            return new BaseSkill();
        }
        skill = SkillFactory.createSpecialSkill(skillTemplate);
        
        if(!skill){
            switch(actionId)
            {
                case SkillType.SUCCESS:
                    skill = new SuccessSkill();
                    break;
                case SkillType.FAILED:
                    skill = new FailedSkill();
                    break;
                default:
                    skill = SkillFactory.createSkillByPresentType(actionTemplate.presentType);
                    break;
            }
        }		
        
        skill.setTemplate(actionTemplate);
        return skill;
    }

    /**据表现ID创建相应的技能类. 
     * @param presentType
     * @return 
     * 
     */		
    private static createSkillByPresentType(presentType : number):BaseSkill
    {
        let skill : BaseSkill;
        switch(presentType){
            case ActionPresentType.COMMON_ACTION:
                skill = new CommonActionSkill();
                break;
            case ActionPresentType.SHOOT_ACTION:
                skill = new ShootActionSkill();
                break;
        }
        return skill;
    }	
    
    /**
     * 创建特殊的技能. 
     * @param skillTemplate
     * @return 
     * 
     */		
    private static createSpecialSkill(skillTemplate : t_s_skilltemplateData):BaseSkill
    {
        if(skillTemplate.TemplateId == SkillType.SPECIAL_SKILL){
            return new SpecialActionSkill105();
        }
        return null;
    }
}