// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-06-08 18:09:36
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-04-04 18:37:45
 * @Description: 跑动的移动回来策略
 */

import Logger from "../../../../../core/logger/Logger";
import { MovePointAction } from "../../../actions/MovePointAction";
import { SkillData } from "../../../data/SkillData";
import { MoveFrameData } from "../../mode/framedata/FrameDatas";
import { BaseSkill } from "../BaseSkill";
import { BaseMoveStrategy } from "./BaseMoveStrategy";

export class RunMBStrategy extends BaseMoveStrategy {
    constructor(skill: BaseSkill, startMoveFun: Function, endMoveFun: Function) {
        super(skill, startMoveFun, endMoveFun);
    }

    public execute() {
        let moveFrameData: MoveFrameData = this.getMoveBackFrameData()
        let skillData: SkillData = this._skill.getSkillData()

        let tarPos = this.getMoveBackPoint()
        Logger.battle("[RunMBStrategy] fId=" + skillData.fId + ", speed=" + moveFrameData.speed + ", tarPos=", tarPos)
        new MovePointAction(skillData.fId, tarPos, moveFrameData.speed, skillData.liftTime + 5,
            false, false, true, false, this._endMoveFun, null, true,
            moveFrameData.dustRes, moveFrameData.dustGap);
    }
}