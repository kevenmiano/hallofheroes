/*
 * @Author: jeremy.xu
 * @Date: 2022-06-22 11:11:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 11:40:37
 * @Description: 该类根据具体情况决定后退使用的策略(如跑回去、跳回去、瞬移等）
 */

import Logger from "../../../../../core/logger/Logger";
import { SkillFrameType } from "../../../../constant/SkillSysDefine";
import { SkillFrameData } from "../../mode/framedata/SkillFrameData";
import { BaseSkill } from "../BaseSkill";
import { IMoveStrategy } from "./IMoveStrategy";
import { JumpMBStrategy } from "./JumpMBStrategy";
import { RunMBStrategy } from "./RunMBStrategy";
import { StraightMBStrategy } from "./StraightMBStrategy";

export class MoveBackContext {
    private _strategy: IMoveStrategy

    constructor(skill: BaseSkill,
        startMoveFun: Function,
        endMoveFun: Function) {
        this._strategy = this.createStrategy(skill, startMoveFun, endMoveFun);
    }
    private createStrategy(skill: BaseSkill,
        startMoveFun: Function,
        endMoveFun: Function): IMoveStrategy {

        let strategy: IMoveStrategy;
        let type: number = -1;
        let backData: SkillFrameData = skill.getActionTemplate().getMoveBackData(skill.getRoleSex())
        if (backData) {
            type = backData.ActionType
        }
        switch (type) {
            case SkillFrameType.MOVE_BACK:
                Logger.battle("[MoveBackContext] 向后移动")
                strategy = new RunMBStrategy(skill, startMoveFun, endMoveFun);
                break;
            case SkillFrameType.JUMP_BACK:
                Logger.battle("[MoveBackContext] 向后跳")
                strategy = new JumpMBStrategy(skill, startMoveFun, endMoveFun);
                break;
            case SkillFrameType.DISPLACEMENT_BACK:
                Logger.battle("[MoveBackContext] 向后瞬移")
                strategy = new StraightMBStrategy(skill, startMoveFun, endMoveFun);
                break;
        }
        return strategy
    }

    public execute() {
        if (this._strategy) {
            this._strategy.execute();
        }
    }
}