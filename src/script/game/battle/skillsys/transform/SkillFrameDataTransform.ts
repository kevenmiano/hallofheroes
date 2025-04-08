// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description   帧数据转换类.
 * 该类用于将字符串描述的帧属性转换成SkillFrameData数据.
 **/

import { t_s_actionData } from "../../../config/t_s_action";
import { ColorTransformFrameData, DisplacementFrameData, EffectFrameData, HideFrameData, MoveFrameData, ShockFrameData, ShootFrameData, ZoomFrameData } from "../mode/framedata/FrameDatas";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";

export class SkillFrameDataTransform {

    constructor() {
    }

    public static transformStringToFrameData(frameData: SkillFrameData, element: t_s_actionData) {
        if (frameData.ActionType > -1) {
            SkillFrameDataTransform["createFrameData" + frameData.ActionType](frameData, element);
        }
    }

    /**
     * 向前移动. 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData0(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para;
        frameData.moveForwardData = new MoveFrameData();
        frameData.moveForwardData.soundRes = element.Sound;
        frameData.moveForwardData.target = Number(paraArr[0])
        frameData.moveForwardData.distance = Number(paraArr[1])
        frameData.moveForwardData.type = Number(paraArr[2])
        frameData.moveForwardData.speed = Number(paraArr[3])
        frameData.moveForwardData.dustRes = paraArr.length > 4 ? paraArr[4] : null;
        frameData.moveForwardData.dustGap = Number(paraArr.length > 5 ? paraArr[5] : 0);
    }
    /**
     * 攻击动作. 
     * @param frameData
     * @param info
     * 
     */
    private static createFrameData1(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para;
        frameData.attackSound = element.Sound;
        frameData.attackLabel = paraArr[0]
    }
    /**
     * 施法效果
     * @param frameData
     * @param info
     * 
     */
    private static createFrameData2(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para;
        frameData.effectData = new EffectFrameData();
        frameData.effectData.soundRes = element.Sound;
        frameData.effectData.type = Number(paraArr[0])
        frameData.effectData.target = Number(paraArr[1])
        frameData.effectData.posX = Number(paraArr[2])
        frameData.effectData.posY = Number(paraArr[3])
        frameData.effectData.effectRes = paraArr[4]
        frameData.effectData.arrange = Number(paraArr.length > 5 ? paraArr[5] : 1);
    }
    /**
     * 受伤 
     * @param frameData
     * @param info
     * 
     */
    private static createFrameData3(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para;
        frameData.effectData = new EffectFrameData();
        frameData.effectData.soundRes = element.Sound;
        frameData.effectData.type = Number(paraArr[0])
        frameData.effectData.posX = Number(paraArr[1])
        frameData.effectData.posY = Number(paraArr[2])
        frameData.effectData.effectRes = paraArr[3]
        frameData.effectData.backDistance = Number(paraArr.length > 4 ? paraArr[4] : 0);
        frameData.effectData.delayBleed = Number(paraArr.length > 5 ? paraArr[5] : 0);

    }
    /**
     * 地图缩放. 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData4(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.zoomData = new ZoomFrameData();
        frameData.zoomData.soundRes = element.Sound;
        frameData.zoomData.zoom = Number(paraArr[0])
        frameData.zoomData.zoomType = Number(paraArr[1])
        frameData.zoomData.zoomTime = Number(paraArr[2])
        frameData.zoomData.stopTime = Number(paraArr[3])
        frameData.zoomData.backTime = Number(paraArr[4])
        frameData.zoomData.posX = Number(paraArr[5])
        frameData.zoomData.posY = Number(paraArr[6])
    }

    /**
     * 施法效果(气浪效果)
     * @param frameData
     **/
    private static createFrameData5(frameData: SkillFrameData, element: t_s_actionData) {
        //			frameData.effectData = new EffectFrameData();
        //			frameData.effectData.type = paraArr[0]
        //			frameData.effectData.target = paraArr[1]
        //			frameData.effectData.posX = paraArr[2]
        //			frameData.effectData.posY = paraArr[3]
        //			frameData.effectData.effectRes = paraArr[4]
        SkillFrameDataTransform.createFrameData2(frameData, element);
    }

    /**
     * 背景变色. 
     * @param frameData
     * @param paraArr
     */
    private static createFrameData6(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.bgColorData = new ColorTransformFrameData();
        frameData.bgColorData.soundRes = element.Sound;
        frameData.bgColorData.color = Number(paraArr[0])
        frameData.bgColorData.tweenTime = Number(paraArr[1])
        frameData.bgColorData.stopTime = Number(paraArr[2])
        frameData.bgColorData.atOnceBool = Number(paraArr[3]) == 0 ? false : true;
        frameData.bgColorData.isReduce = Number(paraArr[4]) == 0 ? true : false;
    }

    /**
     * 地图震动. 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData7(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.bgShockData = new ShockFrameData();
        frameData.bgShockData.soundRes = element.Sound;
        frameData.bgShockData.time = Number(paraArr[0])
        frameData.bgShockData.range = Number(paraArr[1])
    }

    /**
     * 飞行(射箭)
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData11(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.shootData = new ShootFrameData();
        frameData.shootData.soundRes = element.Sound;
        frameData.shootData.arrowRes = paraArr[0]
        frameData.shootData.flyType = Number(paraArr[1])
        frameData.shootData.speed = Number(paraArr[2])
        frameData.shootData.dannyRes = paraArr.length > 3 ? paraArr[3] : "";
        frameData.shootData.rippleRes = paraArr.length > 4 ? paraArr[4] : null;
        frameData.shootData.rippleGap = Number(paraArr.length > 5 ? paraArr[5] : 0);
        frameData.shootData.curve = Number(paraArr.length > 6 ? paraArr[6] : 0);

    }
    /**
     * 射箭(射出的箭类似光束的效果)
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData12(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.shootData = new ShootFrameData();
        frameData.shootData.soundRes = element.Sound;
        frameData.shootData.arrowRes = paraArr[0]
        frameData.shootData.startX = Number(paraArr[1])
        frameData.shootData.startY = Number(paraArr[2])
        frameData.shootData.arrowWidth = Number(paraArr[3])
        frameData.shootData.dannyRes = paraArr[4]
        frameData.shootData.dannyFrame = Number(paraArr.length > 5 ? paraArr[5] : 0);
    }
    /**
     * 跳向前 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData21(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.moveForwardData = new MoveFrameData();
        frameData.moveForwardData.soundRes = element.Sound;
        frameData.moveForwardData.target = Number(paraArr[0])
        frameData.moveForwardData.distance = Number(paraArr[1])
        frameData.moveForwardData.dustRes = paraArr.length > 2 ? paraArr[2] : null;
    }
    /**
     *跳回来 
        * @param frameData
        * @param paraArr
        * 
        */
    private static createFrameData22(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.moveBackData = new MoveFrameData();
        frameData.moveBackData.soundRes = element.Sound;
        frameData.moveBackData.dustRes = paraArr.length > 0 ? paraArr[0] : null;
    }
    /**
     * 瞬移前进 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData23(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.displacementForward = new DisplacementFrameData();
        frameData.displacementForward.soundRes = element.Sound;
        frameData.displacementForward.isForward = true;
        frameData.displacementForward.target = Number(paraArr[0])
        frameData.displacementForward.offsetX = Number(paraArr[1])
        frameData.displacementForward.offsetY = Number(paraArr[2])
        frameData.displacementForward.disappearEffect = paraArr[3]
        frameData.displacementForward.persistentFrames = Number(paraArr[4])
        frameData.displacementForward.appearEffect = paraArr.length > 5 ? paraArr[5] : ""
    }

    /**
     * 瞬移回来 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData24(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.displacementBack = new DisplacementFrameData();
        frameData.displacementBack.soundRes = element.Sound;
        frameData.displacementBack.disappearEffect = paraArr[0]
        frameData.displacementBack.persistentFrames = Number(paraArr[1])
        frameData.displacementBack.appearEffect = paraArr.length > 2 ? paraArr[2] : ""
    }
    /**
     * 隐藏. 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData25(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.hideData = new HideFrameData()
        frameData.hideData.soundRes = element.Sound;
        frameData.hideData.target = Number(paraArr[0])
        frameData.hideData.disappearEffect = paraArr[1]
        frameData.hideData.persistentFrame = Number(paraArr[2])
        frameData.hideData.appearEffect = paraArr[3]
    }

    /**
     * 完成. 
     * @param frameData
     * @param info
     * 
     */
    private static createFrameData99(frameData: SkillFrameData, element: t_s_actionData) {
    }

    /**
     * 回退移动. 
     * @param frameData
     * @param paraArr
     * 
     */
    private static createFrameData100(frameData: SkillFrameData, element: t_s_actionData) {
        let paraArr: string[] = element.Para
        frameData.moveBackData = new MoveFrameData();
        frameData.moveBackData.soundRes = element.Sound;
        frameData.moveBackData.type = Number(paraArr[0])
        frameData.moveBackData.speed = Number(paraArr[1])
        frameData.moveBackData.dustRes = paraArr.length > 2 ? paraArr[2] : null;
        frameData.moveBackData.dustGap = Number(paraArr.length > 3 ? paraArr[3] : 0);
    }

}
