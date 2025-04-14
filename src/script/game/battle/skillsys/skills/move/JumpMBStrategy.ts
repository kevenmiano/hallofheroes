/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 跳动后退策略
 **/

import { JumpMoveAction } from "../../../actions/JumpMoveAction";
import { SkillData } from "../../../data/SkillData";
import { MoveFrameData } from "../../mode/framedata/FrameDatas";
import { BaseSkill } from "../BaseSkill";
import { BaseMoveStrategy } from "./BaseMoveStrategy";

export class JumpMBStrategy extends BaseMoveStrategy {
  constructor(skill: BaseSkill, startMoveFun: Function, endMoveFun: Function) {
    super(skill, startMoveFun, endMoveFun);
  }
  public execute() {
    let moveFrameData: MoveFrameData = this.getMoveBackFrameData();
    let skillData: SkillData = this._skill.getSkillData();

    let toPt: Laya.Point = this.getMoveBackPoint();

    new JumpMoveAction(
      skillData.fId,
      toPt,
      0,
      skillData.liftTime + 5,
      false,
      false,
      true,
      false,
      this._endMoveFun,
      null,
      true,
      moveFrameData.dustRes,
      moveFrameData.dustGap,
    );
  }
}
