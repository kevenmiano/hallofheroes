/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  
 **/

import { SkillFrameType, ActionPresentType } from "../../../constant/SkillSysDefine";
import { SkillFrameData } from "./framedata/SkillFrameData";

export class ActionTemplateData {

    public ActionId: number = 0;
    public ActionName: string;

    private _presentType: number = -1;
    /**
     * 技能帧数据数组. 
     */
    public frames: SkillFrameData[];

    public dannyCountForTest: number = 0;   //用于测试技能配置数据中的受作次数是否和收到的实际数据一致
    public shootTime: number = 0;        //一个action射箭的次数 射箭技能中射箭的次数.


    constructor() {
        this.frames = [];
    }


    public get presentType(): number {
        if (this._presentType == -1) {
            for (let index = 0; index < this.frames.length; index++) {
                const frame = this.frames[index];
                if (frame.ActionType == SkillFrameType.SHOOT || frame.ActionType == SkillFrameType.SHOOT2) {
                    this._presentType = ActionPresentType.SHOOT_ACTION;
                    break;
                } else {
                    this._presentType = ActionPresentType.COMMON_ACTION;
                }
            }
        }
        return this._presentType;
    }

    /**
     * 获得向前移动的数据. 
     * @return 
     * 
     */
    public getMoveForwardData(sex: number): SkillFrameData {
        for (let index = 0; index < this.frames.length; index++) {
            const frame = this.frames[index];
            if (frame.moveForwardData != null && frame.Sex == sex) {
                return frame
            }
        }
        if (sex != 2) {
            return this.getMoveForwardData(2);
        }
        return null;
    }

    /**
     * 获得回退移动的数据. 
     * @return 
     * 
     */
    public getMoveBackData(sex: number): SkillFrameData {
        for (let index = 0; index < this.frames.length; index++) {
            const frame = this.frames[index];
            if (frame.moveBackData != null && frame.Sex == sex) {
                return frame
            }
        }
        if (sex != 2) {
            return this.getMoveBackData(2);
        }
        return null;
    }
    /**
     * 配置帧动作数据
     * count0和count1分别为男职业和女职业受伤时的扣血次数
     * 
     */
    public refreshMembers() {
        let frame: SkillFrameData;
        let count0: number = 0;
        let count1: number = 0;
        //配置要求,1和0要成对出现,如:2,1,0,2,2,1,0
        for (let i: number = 0; i < this.frames.length; i++) {
            frame = this.frames[i];
            if (frame.ActionType == SkillFrameType.ADD_DANNY) {
                if (frame.Sex == 2) {//任何职业都扣血
                    frame.effectData.count = count0;
                    count0++
                    count1++;
                }
                else if (frame.Sex == 0) {//女职业扣血
                    frame.effectData.count = count0;
                    count0++;
                }
                else if (frame.Sex == 1) {//男职业扣血
                    frame.effectData.count = count1;
                    count1++;
                }
            }
            else if (frame.ActionType == SkillFrameType.SHOOT || frame.ActionType == SkillFrameType.SHOOT2) {
                this.shootTime += 1;
                if (frame.Sex == 0) {//因为0和1是成对的.所以此处减去重复的值.
                    this.shootTime -= 1;
                }
            }
        }
        this.dannyCountForTest = count0;
    }
    /**
     * 返回该动作帧所有帧数据的相关资源 
     * @param sex
     * @return 
     * 
     */
    public getRes(sex: number): any[] {
        let arr: any[] = [];
        for (let index = 0; index < this.frames.length; index++) {
            const mem = this.frames[index];
            if (mem.Sex == 2 || mem.Sex == sex || sex == 3) {//等于3时会加所有的技能
                arr = arr.concat(mem.getRes());
            }
        }

        return arr;
    }
    /**
     * 返回动作结束帧 
     * @return 
     * 
     */
    public getCompleteFrameIndex(): number {
        for (let index = 0; index < this.frames.length; index++) {
            const frame = this.frames[index];
            if (frame.ActionType == 99) {
                return frame.Frame;
            }
        }
        return 0;
    }

    public getSoundRes(): string[] {
        let result = []
        for (let index = 0; index < this.frames.length; index++) {
            const frame = this.frames[index];
            const tempArr = frame.getSoundRes();
            if (tempArr.length > 0) {
                result = result.concat(tempArr);
            }
        }
        return result;
    }
}