/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 瞬移向前策略
 **/

import { BaseSkill } from "../BaseSkill";
import { BaseMoveStrategy } from "./BaseMoveStrategy";

export class StraightMFStrategy extends BaseMoveStrategy
{
    constructor(skill:BaseSkill, startMoveFun:Function, endMoveFun:Function)
    {
        super(skill, startMoveFun, endMoveFun);
    }
}
