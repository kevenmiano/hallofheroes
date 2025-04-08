// @ts-nocheck
// import ShaderDissolve from "./ShaderDissolve";
import ShaderMosaicDissolve from "./ShaderMosaicDissolves";
// import ShaderTranslation from "./ShaderTranslation";

/**
* @author:pzlricky
* @data: 2021-06-04 09:50
* @description Shader管理器
*/
export default class ShaderMgr {

    private static _inst: ShaderMgr;

    public static get Instance(): ShaderMgr {
        if (!this._inst) {
            this._inst = new ShaderMgr();
        }
        return this._inst;
    }

    public preSetup() {
        // Laya.Shader.preCompile2D(0, ShaderDissolve.SHADER_MAIN_ID, ShaderDissolve.vs, ShaderDissolve.ps, null);
        Laya.Shader.preCompile2D(0, ShaderMosaicDissolve.SHADER_MAIN_ID, ShaderMosaicDissolve.vs, ShaderMosaicDissolve.ps, null);
        // Laya.Shader.preCompile2D(0, ShaderTranslation.SHADER_MAIN_ID, ShaderTranslation.vs, ShaderTranslation.ps, null);
    }

    public setup() {
    }

    /**
     * 流光Shader
     * @param nodeTarget 
     */
    public ambiLight(nodetext: Laya.Sprite, valueForAlpa: number = 0.5, x: number = 0, y: number = 0) {

    }

    /**
     * 消融对象
     * @param target 消融Target Laya.Image或Laya.Sprite
     * @param totalTime 消散时间
     */
    public dissolveTarget(target: Laya.Image | Laya.Sprite, totalTime: number = 150) {
        // let targetDissolve = target.getComponent(ShaderDissolve);
        // if (!targetDissolve) {
        //     targetDissolve = target.addComponent(ShaderDissolve);
        // }
        // Laya.timer.loop(totalTime, this, () => {
        //     targetDissolve.dissolveThreshold += 0.1;
        //     if (targetDissolve.dissolveThreshold >= 1) {
        //         Laya.timer.clearAll(this);
        //     }
        // })
    }

    /**
     * 马赛克消融对象
     * @param target 消融MovieClip 不能用未封装的animation
     * @param totalTime 消散时间
     */
    public MosaicDissolveTarget(target: Laya.Image | Laya.Sprite, totalTime: number = 3.5) {
        return new Promise<any>((resolve, reject) => {
            let delay = 0.01;
            if(!target || target.destroyed) return; 
            let targetDissolve = target.getComponent(ShaderMosaicDissolve);
            if (!targetDissolve) {
                targetDissolve = target.addComponent(ShaderMosaicDissolve);
            }
            Laya.timer.loop(delay, this, () => {
                targetDissolve.setTime(targetDissolve.getTime() + delay);
                if (targetDissolve.getTime() >= totalTime) {
                    Laya.timer.clearAll(this);
                    targetDissolve.setTime(4);
                    resolve(target);
                }
            })
        });
        
    }

    /**对象是否翻转 */
    private getTextureScaleX(texture): number {
        if (this.getTargetScale(texture)) {
            return -1;
        }
        return 1;
    }

    /**获取目标Scale为-1的对象 */
    private getTargetScale(target, targetScale: number = -1) {
        if (target) {
            if (target.scaleX == targetScale) {
                return target;
            }
            return this.getTargetScale(target.parent, targetScale);
        }
        return null;
    }

}
