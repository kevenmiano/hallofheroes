/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description 射箭技能的效果.
 **/

import { SkillEffect } from "./SkillEffect";

export class ArrowSkillEffect extends SkillEffect {
  public startPoint: Laya.Point;
  public travelPoints: Laya.Point[];
  public lastPoint: Laya.Point;
  public travelDistance: number = 0;
  public rippleCount: number = 0;

  constructor(className: string) {
    super(className);
  }
}
