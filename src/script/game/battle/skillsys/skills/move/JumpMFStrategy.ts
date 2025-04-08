/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 跳动向前策略
 **/

import { JumpMoveAction } from "../../../actions/JumpMoveAction";
import { SkillData } from "../../../data/SkillData";
import { MoveFrameData } from "../../mode/framedata/FrameDatas";
import { BaseSkill } from "../BaseSkill";
import { BaseMoveStrategy } from "./BaseMoveStrategy";

export class JumpMFStrategy extends BaseMoveStrategy
{
    constructor(skill:BaseSkill, startMoveFun:Function, endMoveFun:Function)
    {
        super(skill, startMoveFun, endMoveFun);
    }
    
    public execute()
    {
		//BaseRoleInfo
        let toRole : any = this.getToRole();
        if(!toRole){
            return;
        }
        let moveFrameData : MoveFrameData = this.getMoveForwardFrameData()
        let skillData : SkillData = this.getSkillData()
        let toPt : Laya.Point = this.getMoveForwardPoint(toRole)

        new JumpMoveAction(skillData.fId, toPt, 0,
            skillData.liftTime,false,false,true,false,null,this._startMoveFun,true,
            moveFrameData.dustRes,moveFrameData.dustGap);
        super.execute();
    }
}