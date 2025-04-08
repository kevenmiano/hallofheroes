// @ts-nocheck
import { MovieClip } from "../../component/MovieClip";

/**
 * @author jeremy.xu
 * @data: 2020-11-23 12:00
 * @description  
 */
export class Helpers {
    public static setChildPos(child: Laya.Sprite, pos: Laya.Sprite, fitSize: boolean = false) {
        child.x = pos.x;
        child.y = pos.y;
        pos.visible = false;
        if (fitSize) {
            child.width = pos.width;
            child.height = pos.height;
        }
    }
    /**
     * 读取资源中位置信息 
     * @param p 记录位置
     * @param mc 资源mc
     * @param pos 位置名称
     * @return 
     * 
     */
    public static getPos(p: Laya.Point, mc: MovieClip, pos: string): Laya.Point {
        if (p && mc && pos && mc.hasOwnProperty(pos) && mc[pos] != null) {
            p.x = mc[pos].x;
            p.y = mc[pos].y;
        }
        return p;
    }

    public static delayCall(func: Function, delay: number = 20) {
        setTimeout(func, delay)
    }

    /**
     * 返回一个数, 不能小于min,且不能大于max 
     * @param num
     * @param min
     * @param max
     * @return 
     * 
     */
    public static limitRange(num: number, min: number = 0, max: number = 1): number {
        if (num < min)
            return min;
        if (num > max)
            return max;
        return num;
    }
    
}