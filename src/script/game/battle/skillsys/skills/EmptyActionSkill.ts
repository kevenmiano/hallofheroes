/**
* @author:jeremy.xu
* @data: 2020-11-30 11:00
* @description :  技能基类
**/

import { InheritIActionType } from "../../../constant/BattleDefine";
import { BufferDamageData } from "../../data/BufferDamageData";
import { BaseSkill } from "./BaseSkill";

export class EmptyActionSkill extends BaseSkill {
    public inheritType: InheritIActionType = InheritIActionType.EmptyActionSkill

    constructor() {
        super();
    }
    protected startRun() {
        this.skillComplete();
        this.started = true;
    }
    protected bufferProcess(skip: boolean = false) {
        let buffer: BufferDamageData;
        if (this._skillData.buffers && this._skillData.buffers.length > 0) {
            for (let i: number = 0; i < this._skillData.buffers.length; i++) {
                buffer = this._skillData.buffers[i];
                this.executeBufferAffectives(buffer);
            }
        }
    }
}