/*
 * @Author: jeremy.xu
 * @Date: 2022-06-22 11:11:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 11:40:17
 * @Description: 该类根据具体情况决定前进使用的策略(如跑过去、跳过去、瞬移等）.
 */

import Logger from "../../../../../core/logger/Logger";
import { SkillFrameType } from "../../../../constant/SkillSysDefine";
import { SkillFrameData } from "../../mode/framedata/SkillFrameData";
import { BaseSkill } from "../BaseSkill";
// import { IMoveStrategy } from "./IMoveStrategy";
import { JumpMFStrategy } from "./JumpMFStrategy";
import { RunMFStrategy } from "./RunMFStrategy";
import { StraightMFStrategy } from "./StraightMFStrategy";

interface IMoveStrategy {
  execute(): void;
}

export class MoveForwardContext {
  private _strategy: IMoveStrategy;

  constructor(skill: BaseSkill, startMoveFun: Function, endMoveFun: Function) {
    this._strategy = MoveForwardContext.createStrategy(
      skill,
      startMoveFun,
      endMoveFun,
    );
  }

  private static createStrategy(
    skill: BaseSkill,
    startMoveFun: Function,
    endMoveFun: Function,
  ): IMoveStrategy {
    let strategy: IMoveStrategy;
    let type: number = -1;
    let backData: SkillFrameData = skill
      .getActionTemplate()
      .getMoveForwardData(skill.getRoleSex());
    if (backData) {
      type = backData.ActionType;
    }
    switch (type) {
      case SkillFrameType.MOVE_FORWARD:
        Logger.battle("[MoveBackContext] 向前移动");
        strategy = new RunMFStrategy(skill, startMoveFun, endMoveFun);
        break;
      case SkillFrameType.JUMP_FORWARD:
        Logger.battle("[MoveBackContext] 向前跳");
        strategy = new JumpMFStrategy(skill, startMoveFun, endMoveFun);
        break;
      case SkillFrameType.DISPLACEMENT_FORWARD:
        Logger.battle("[MoveBackContext] 向前瞬移");
        strategy = new StraightMFStrategy(skill, startMoveFun, endMoveFun);
        break;
    }
    return strategy;
  }

  public execute() {
    if (this._strategy) {
      this._strategy.execute();
    }
  }
}
