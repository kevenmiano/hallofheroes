// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-06-08 18:09:36
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-04-04 18:37:45
 * @Description: 跑动的移动前进策略
 */

import Logger from "../../../../../core/logger/Logger";
import { MovePointAction } from "../../../actions/MovePointAction";
import { SkillData } from "../../../data/SkillData";
import { MoveFrameData } from "../../mode/framedata/FrameDatas";
import { BaseSkill } from "../BaseSkill";
import { BaseMoveStrategy } from "./BaseMoveStrategy";

export class RunMFStrategy extends BaseMoveStrategy {
    constructor(skill: BaseSkill, startMoveFun: Function, endMoveFun: Function) {
        super(skill, startMoveFun, endMoveFun);
    }

    public execute() {
        let toRole: any = this.getToRole();
        if (!toRole) { return; }

        let moveFrameData: MoveFrameData = this.getMoveForwardFrameData()
        let skillData: SkillData = this.getSkillData()
        let tarPos = this.getMoveForwardPoint(toRole)
        Logger.battle("[RunMFStrategy] fId=" + skillData.fId + ", speed=" + moveFrameData.speed, "tarPos=", tarPos, "toRole=", toRole)
        new MovePointAction(skillData.fId, tarPos, moveFrameData.speed, skillData.liftTime,
            false, false, true, false, null, this._startMoveFun, true,
            moveFrameData.dustRes, moveFrameData.dustGap, true);
    }
}