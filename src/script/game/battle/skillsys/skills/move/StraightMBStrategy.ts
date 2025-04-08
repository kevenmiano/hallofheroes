/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 瞬移后退策略
 **/

import { BaseSkill } from "../BaseSkill";
import { BaseMoveStrategy } from "./BaseMoveStrategy";

export class StraightMBStrategy extends BaseMoveStrategy
{
    constructor(skill:BaseSkill, startMoveFun:Function, endMoveFun:Function)
    {
        super(skill, startMoveFun, endMoveFun);
    }
}