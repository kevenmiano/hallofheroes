/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description SkillFrameData 中的数据类
 **/


export interface IFrameData {
    /**
     * 获得帧数据使用到的资源(链接名)数组 
     * @return 
     */
    getRes(): any[];
    soundRes: string;
}


/**
 * 射箭帧数据
 */
export class ShootFrameData implements IFrameData {
    public static FLY_TYPE_COMMON: number = 1;//普通的飞行方式;
    public static LFY_TYPE_CURVE: number = 2;//抛物线飞行方式;
    /**
     * 射出的箭的资源. 
     */
    public arrowRes: string;
    /**
     * 飞行的方式. 
     */
    public flyType: number = 0;
    /**
     * 飞行的速度. 
     */
    public speed: number = 0;
    /**
     * 受击的资源. 
     */
    public dannyRes: string;
    /**
     * 涟漪资源 
     */
    public rippleRes: string// = "hunter.pokong.T5";
    /**
     * 涟漪空间间隔
     */
    public rippleGap: number// = 100
    /**
     * 曲线弧度参数. 
     */
    public curve: number = 300;
    /**
     * 箭矢的长度.根据此值来确定射出的箭的实际长度. 
     */
    public arrowWidth: number
    /**
     * 箭(或光束)开始的坐标点(相对于人的坐标原点) 
     */
    public startX: number = 0;
    public startY: number = 0;
    /**
     * 光束特效中的受击帧. 
     */
    public dannyFrame: number

    public soundRes: string;

    public getRes(): any[] {
        return [this.arrowRes, this.dannyRes, this.rippleRes];
    }
}


/**
 * 效果帧数据
 */
export class EffectFrameData implements IFrameData {
    /**
     * 该类型的技能要添加到地图上. 
     */
    public static TYPE_MAP: number = 0;
    /**
     * 该类型的技能要添加到角色身上. 
     */
    public static TYPE_ROLE: number = 1;
    /**
     * 该类型的技能要添加到受击的角色身上. 
     */
    public static TYPE_TARGET: number = 2;

    /**
     * 技能的类型. 
     */
    public type: number = 0;
    /**
     * 存储释放技能效果所用的资源的键值,如果是受击效果,effectRes可以为空
     */
    public effectRes: string;
    /**
     * 作用的目标.为0时,表示以默认的攻击对象作为作用目标,为1-9时,该值作为指定的作用目标值. 
     */
    public target: number = 0;
    /**
     * X坐标. 
     */
    public posX: number = 0;
    /**
     * Y坐标. 
     */
    public posY: number = 0;
    /**
     * 特效前后层标识(0表示后,1表示前). 
     */
    public arrange: number
    /**
     * 该值只针对受伤效果有效.
     * 用于记录是第几次掉血,从而可以正确获得掉血的数据. 
     */
    public count: number = 0;
    /**
     * 受击时后退的距离,只有受击帧有效. 
     */
    public backDistance: number = 0;
    /**
     * 延迟掉血的时间.只有受击帧有效 
     */
    public delayBleed: number = 0;

    public soundRes: string;

    public getRes(): any[] {
        return [this.effectRes];
    }

}

/**
 * 
 */
export class MoveFrameData implements IFrameData {
    /**
     * 移动类型. 
     */
    public type: number = 0;
    /**
     * 移动速度. 
     */
    public speed: number = 0;
    /**
     * 移动标.为0时以实际攻击目标为准.为1-9时以此值为准. 
     */
    public target: number = 0;
    /**
     * 移动距离. 
     */
    public distance: number
    /**
     * 尘土资源 
     */
    public dustRes: string;
    public dustGap: number = 0;
    public soundRes: string;
    public getRes(): any[] {
        return [this.dustRes];
    }
}

/**
 * 
 */
export class HideFrameData implements IFrameData {
    public target: number = 0;
    public disappearEffect: string;
    public appearEffect: string;
    public persistentFrame: number;
    public soundRes: string;
    public getRes(): any[] {
        return [this.disappearEffect, this.appearEffect];
    }
}

/**
 * 地图震动帧数据.
 **/
export class ShockFrameData implements IFrameData {
    public time: number = 0;//震动次数.
    public range: number = 0;//震幅
    public soundRes: string;
    public getRes(): any[] {
        return [];
    }
}

/**
 * 
 */
export class ZoomFrameData implements IFrameData {
    /**
     * 缩放类型.0时表示以地图为中心,1表示以角色为中心.仅值为1时, posX和posY才有效.
     */
    public zoomType: number = 0;
    /**
     * 缩放的时间,指的是从默认缩放到指定值这个过程所需时间.
     */
    public zoomTime: number = 0;
    /**
     * 缩放完成后,保持缩放的状态的时间. 
     */
    public stopTime: number = 0;
    /**
     * 还原为默认状态的过程所需时间. 
     */
    public backTime: number = 0;
    public zoom: number = 0;
    public posX: number = 0;
    public posY: number = 0;
    public soundRes: string;
    public getRes(): any[] {
        return [];
    }
}

/**
 * 地图场景颜色转换帧数据.
 */
export class ColorTransformFrameData implements IFrameData {
    /**
     * 需要增加或减少的色彩值. 
     */
    public color: number = 0;
    /**
     * 变色过程的时间. 
     */
    public tweenTime: number = 0;
    /**
     * 变色中途停留的时间 
     */
    public stopTime: number = 0;
    /**
     * 是否立即执行 
     */
    public atOnceBool: boolean;
    /**
     * 是否是减色. 
     */
    public isReduce: boolean;
    public soundRes: string;
    public getRes(): any[] {
        return [];
    }
}

/**
 * 瞬移帧数据.
 */
export class DisplacementFrameData implements IFrameData {
    public disappearEffect: string;
    public appearEffect: string;
    public persistentFrames: number = 0;

    public target: number
    public offsetX: number = 0;
    public offsetY: number = 0;

    public isForward: boolean
    public soundRes: string;
    public getRes(): any[] {
        let arr: any[] = [];
        if (this.disappearEffect && this.disappearEffect != "") {
            arr.push(this.disappearEffect);
        }
        if (this.appearEffect && this.appearEffect != "") {
            arr.push(this.appearEffect);
        }
        return arr;
    }
}