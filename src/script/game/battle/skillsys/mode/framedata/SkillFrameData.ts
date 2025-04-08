/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  技能帧数据
 * 该类描述了技能中的一个帧中要做的事情的数据.
 * 每个技能将根据这些数据作相应的操作.
 **/

import { EffectFrameData, MoveFrameData, ShootFrameData, ZoomFrameData, ColorTransformFrameData, ShockFrameData, DisplacementFrameData, HideFrameData, IFrameData } from "./FrameDatas";


export class SkillFrameData {
    public Frame: number = 0;
    public Frame2: number = 0;//女性帧数
    public ActionType: number = 0;
    public Sex: number = 0;//性别限制(0,表示仅限女性使用,1表示仅限男性使用,2表示男女通用).

    /**
     *  存储播放指定的攻击动作的键值.
     */
    public attackLabel: string;
    /**
     *  存储播放指定的攻击动作的声音.
     */
    public attackSound: string;


    /**
     * 播放效果帧数据. 
     */
    public effectData: EffectFrameData;
    /**
     * 向前移动数据. 
     */
    public moveForwardData: MoveFrameData;
    /**
     * 回退移动数据. 
     */
    public moveBackData: MoveFrameData;

    /**
     * 射箭数据
     */
    public shootData: ShootFrameData;

    /**
     * 地图缩放数据 
     */
    public zoomData: ZoomFrameData;
    /**
     * 地图颜色修改数据.
     */
    public bgColorData: ColorTransformFrameData;
    /**
     * 地图震动数据. 
     */
    public bgShockData: ShockFrameData;

    public displacementForward: DisplacementFrameData;
    public displacementBack: DisplacementFrameData
    public hideData: HideFrameData

    public getRes(): any[] {
        let arr: any[] = [this.effectData, this.moveForwardData, this.moveBackData,
        this.shootData, this.zoomData, this.bgColorData, this.bgShockData,
        this.displacementForward, this.displacementBack, this.hideData];

        let len: number = arr.length;
        let mem: IFrameData;
        let result: any[] = [];
        for (let i: number = 0; i < len; i++) {
            mem = arr[i] as IFrameData;
            if (mem) {
                result = result.concat(mem.getRes());
            }
        }
        return result;
    }

    public getSoundRes(): any[] {
        let arr: any[] = [this.effectData, this.moveForwardData, this.moveBackData,
        this.shootData, this.zoomData, this.bgColorData, this.bgShockData,
        this.displacementForward, this.displacementBack, this.hideData];

        let len: number = arr.length;
        let mem: IFrameData;
        let result: any[] = [];
        if (this.attackSound) {
            result.push(this.attackSound) 
        }
        for (let i: number = 0; i < len; i++) {
            mem = arr[i] as IFrameData;
            if (mem && mem.soundRes) {
                result = result.concat(mem.soundRes);
            }
        }

        return result;
    }

    /**
     * 克隆（目前仅为了复制射箭技能数据） 
     * @return 
     * 
     */
    public clone(): SkillFrameData {
        let frame: SkillFrameData = new SkillFrameData();
        frame.ActionType = this.ActionType
        frame.Frame = this.Frame;
        frame.Frame2 = this.Frame2;
        frame.shootData = this.shootData;
        frame.Sex = this.Sex;
        return frame;
    }

}