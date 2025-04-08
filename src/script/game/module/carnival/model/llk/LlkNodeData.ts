// @ts-nocheck
import Logger from "../../../../../core/logger/Logger";

/**
 * 连连看节点数据
 */
export default class LlkNodeData {

    /**
     * 所在行
     */
    public row: number = 0;
    /**
     * 所在列
     */
    public col: number = 0;
    /**
     * 值（0-26）26种图案, 0代表没东西
     */
    public val: number = 0;

    private _mcType: number = 0;


    /**
     * 消除动画的类型(0,1,2,3,4,5,6,7,8) 
     * 0:无动画
     * 1:横向动画
     * 2:纵向动画
     * 3:起点动画
     * 4:终点动画
     * 5:左下角动画
     * 6:左上角动画
     * 7:右上角动画
     * 8:右下角动画
     */
    public get mcType(): number {
        return this._mcType;
    }

    public set mcType(value: number) {
        if (this._mcType == 1 && value != 1) {
            Logger.info(3423424234);
        }
        if (value == 1 || value == 2) {
            Logger.info("连线" + this.col + " " + this.row);
        }
        this._mcType = value;
    }
}