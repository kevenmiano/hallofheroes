// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 12:23:14
 * @LastEditTime: 2024-04-23 16:04:24
 * @LastEditors: jeremy.xu
 * @Description: 战斗地图 
 */

import Dictionary from "../../../../core/utils/Dictionary";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { DisplayObject } from "../../../component/DisplayObject";
import { SharedManager } from "../../../manager/SharedManager";
import Shaker from "../../../utils/Shaker";
import { BattleEffect } from "../../skillsys/effect/BattleEffect";
import { EffectContainer } from "../../skillsys/effect/EffectContainer";
import { BaseRoleView } from "../roles/BaseRoleView";
import { BattleCameraScene } from "./BattleCameraScene";
import SDKManager from '../../../../core/sdk/SDKManager';
import Resolution from "../../../../core/comps/Resolution";

export class BattleMap extends BattleCameraScene {
    protected _rolesContainer: Laya.Sprite;
    /**
     * 角色特效容器 
     */
    private _roleBackContainer: EffectContainer
    /**
     * 奥义特效容器 
     */
    private _profoundContainer: Laya.Sprite;
    protected _rolesDict: Dictionary;
    /**
     * 场景特效容器 
     */
    private _effectContainer: EffectContainer;
    private _layerColorTransform: Laya.ColorFilter;
    private _cameraTarget: Function;
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    protected _mapBg: DisplayObject;
    protected _mapBgAni: fgui.GComponent;

    private _moveCameraTween: TweenMax;

    constructor() {
        super();
        this.initView();
        this.addEvent();
    }

    protected initView() {
        this._rolesContainer = new Laya.Sprite();
        this._roleBackContainer = new EffectContainer();
        this._effectContainer = new EffectContainer;
        this._profoundContainer = new Laya.Sprite();
        this.addLayer(this._roleBackContainer);
        this.addLayer(this._profoundContainer);
        this.addLayer(this._rolesContainer);
        this.addLayer(this._effectContainer);

        this._mapBg = new DisplayObject();
        this._mapBg.autoSize = true;
        this.addLayerAt(this._mapBg, 0);
        this._rolesDict = new Dictionary();
        this._layerColorTransform = new Laya.ColorFilter();
    }

    protected addEvent() {

    }

    protected delEvent() {

    }

    /**
     * 
     * @param color 24位不带alpha颜色
     * @param easeInOutTime
     * @param stopTime
     * @param now
     * @param reversColor 是添加颜色值还是减少颜色值
     */
    public backGroundToColor(color: number = 0, easeInOutTime: number = 0.3, stopTime: number = 0.5, now: boolean = false, reversColor: boolean = false) {
        var tweenLayers: any[] = [];
        var a: number = reversColor ? -1 : 1;
        var rOff: number = ((color & 0xff0000) >>> 16) * a;
        var gOff: number = ((color & 0x00ff00) >>> 8) * a;
        var bOff: number = (color & 0x0000ff) * a;

        var updateFun = () => {
            // for (const key in tweenLayers) {
            //     if (Object.prototype.hasOwnProperty.call(tweenLayers, key)) {
            //         var element = tweenLayers[key];
            //         if (element && element.transform)
            //             element.transform.colorTransform = this._layerColorTransform;
            //     }
            // }
            this._mapBg.filters = [this._layerColorTransform];
            if (this._mapBgAni) {
                this._mapBgAni.filters = [this._layerColorTransform];
            }
        }
        // for (const key in this.childLayerSettingMap) {
        //     if (Object.prototype.hasOwnProperty.call(this.childLayerSettingMap, key)) {
        //         let element = this.childLayerSettingMap[key];
        //         if ((element != this._effectContainer) && (element != this._rolesContainer) && (element != this._profoundContainer)) {
        //             tweenLayers.push(element);
        //         }
        //     }
        // }
        if (!now) {
            TweenLite.killTweensOf(this._layerColorTransform);
            this._mapBg.filters = [this._layerColorTransform];
            if (this._mapBgAni) {
                this._mapBgAni.filters = [this._layerColorTransform];
            }
            TweenLite.to(this._layerColorTransform, easeInOutTime, { redOffset: rOff, greenOffset: gOff, blueOffset: bOff, onUpdate: updateFun });
            TweenLite.to(this._layerColorTransform, easeInOutTime, { redOffset: 0, greenOffset: 0, blueOffset: 0, delay: easeInOutTime + stopTime, overwrite: 0, onUpdate: updateFun });
        } else {
            this._layerColorTransform.color(rOff, gOff, bOff);
            this._mapBg.filters = [this._layerColorTransform];
            if (this._mapBgAni) {
                this._mapBgAni.filters = [this._layerColorTransform];
            }
            updateFun();
        }
    }

    public backGroundToColorUseFrames(color: number, easeInFrame: number, easeOutFrame: number, endFrame: number, reversColor: boolean = false) {
        var tweenLayers: any[] = [];
        for (const key in this.childLayerSettingMap) {
            if (Object.prototype.hasOwnProperty.call(this.childLayerSettingMap, key)) {
                const element = this.childLayerSettingMap[key];
                if ((element != this._effectContainer) && (element != this._rolesContainer) && (element != this._profoundContainer)) {
                    tweenLayers.push(element);
                }
            }
        }
        var updateFun = () => {
            for (const key in tweenLayers) {
                if (Object.prototype.hasOwnProperty.call(tweenLayers, key)) {
                    var element = tweenLayers[key];
                    element.transform.colorTransform = this._layerColorTransform;
                }
            }
        };

        var a: number = reversColor ? -1 : 1;
        var rOff: number = ((color & 0xff0000) >>> 16) * a;
        var gOff: number = ((color & 0x00ff00) >>> 8) * a;
        var bOff: number = (color & 0x0000ff) * a;

        TweenLite.to(this._layerColorTransform, easeInFrame, { useFrames: true, redOffset: rOff, greenOffset: gOff, blueOffset: bOff, onUpdate: updateFun });
        TweenLite.to(this._layerColorTransform, endFrame - easeOutFrame, { useFrames: true, delay: easeOutFrame, redOffset: 0, greenOffset: 0, blueOffset: 0, overwrite: 0, onUpdate: updateFun });
    }

    private _revertTimeoutId: number
    public backGroundToColor2(brightness: number, time: number) {
        var filter: Laya.ColorFilter
        var matrix: any[] = new Array();
        matrix = matrix.concat([brightness, 0, 0, 0, 0]);// red
        matrix = matrix.concat([0, brightness, 0, 0, 0]);// green
        matrix = matrix.concat([0, 0, brightness, 0, 0]);// blue
        matrix = matrix.concat([0, 0, 0, 1, 0]);// alpha
        filter = new Laya.ColorFilter(matrix);
        // for (const key in this.childLayerSettingMap) {
        //     if (Object.prototype.hasOwnProperty.call(this.childLayerSettingMap, key)) {
        //         let element = this.childLayerSettingMap[key];
        //         if ((element != this._effectContainer) && (element != this._rolesContainer)) {
        //             element.filters = [filter];
        //         }
        //     }
        // }
        clearTimeout(this._revertTimeoutId);
        this._revertTimeoutId = setTimeout(this.revertBackGroundColor.bind(this), time);
        this._mapBg.filters = [filter];
        if (this._mapBgAni) {
            this._mapBgAni.filters = [filter];
        }
    }

    private revertBackGroundColor() {
        clearTimeout(this._revertTimeoutId);
        this._revertTimeoutId = 0;
        // for (const key in this.childLayerSettingMap) {
        //     if (Object.prototype.hasOwnProperty.call(this.childLayerSettingMap, key)) {
        //         let element = this.childLayerSettingMap[key];
        //         if ((element != this._effectContainer) && (element != this._rolesContainer)) {
        //             if ((element != this._effectContainer) && (element != this._rolesContainer)) {
        //                 element.filters = null;
        //             }
        //         }
        //     }
        // }
        this._mapBg.filters = null;
        if (this._mapBgAni) {
            this._mapBgAni.filters = null;
        }
    }

    public set cameraTarget(value: Function) {
        this._cameraTarget = value;
    }
    public get cameraTarget(): Function {
        return this._cameraTarget;
    }

    public get rolesDict(): Dictionary {
        return this._rolesDict;
    }

    public update() {
        if (this._cameraTarget == null) return;
        var t_point: Laya.Point = this._cameraTarget();
        var toX: number = t_point.x + this._offsetX;
        var deltaX: number = toX - this.cameraX;
        if (Math.abs(deltaX) < 20) {
            this.cameraX = toX;
        } else {
            this.cameraX += deltaX / Math.abs(deltaX) * 20;
        }
    }

    public addRole(role: BaseRoleView) {

    }

    public removeRole(id: number) {

    }
    /**
     * 移动摄像机 
     * @param point
     * @param time
     * @param delay
     * @return 
     * 
     */
    public moveCamera(point: Laya.Point, time: number = 0.5, delay: number = 0): TweenMax {
        var f_point = new Laya.Point(this.cameraX + point.x, this.cameraY + point.y);
        return this.setCamera(f_point, time, delay);
    }
    /**
     * 摄像机移动的缓动方法 
     * @param point
     * @param time
     * @param delay
     * @return 
     * 
     */
    public setCamera(point: Laya.Point, time: number = 0.5, delay: number = 0): TweenMax {
        this._moveCameraTween = TweenMax.to(this, time, { cameraX: point.x, cameraY: point.y, overwrite: 2, delay: delay });
        return this._moveCameraTween;
    }

    private shake: Shaker;
    public shakeScreen(shakeCount: number = 5, shakeDegree: number = 7) {
        if (this.shake) {
            this.shake.stop();
            this.shake = null;
        }
        //取消震屏  ID1041021
        // this.shake = new Shaker(this, shakeCount, shakeDegree);
        SDKManager.Instance.getChannel().shake();
    }

    public get effectContainer(): EffectContainer {
        return this._effectContainer;
    }

    public set effectContainer(value: EffectContainer) {
        this._effectContainer = value;
    }

    public get roleBackContainer(): EffectContainer {
        return this._roleBackContainer;
    }

    public getProfoundLayer(): Laya.Sprite {
        return this._profoundContainer;
    }

    /**
     * 战斗地图中添加特效 
     * @param effect
     * @param repeat
     * @param arrange
     * 
     */
    public addEffect(effect: BattleEffect, repeat: number = 1, arrange: number = 1) {
        if (!SharedManager.Instance.allowAttactedEffect) {
            return;
        }
        if (arrange == 1) {
            this._effectContainer.addEffect(effect, repeat);
        } else {
            this._roleBackContainer.addEffect(effect, repeat);
        }
    }
    /**
     * 如要排序, child必须是DepthSprite;根据pointY属性排序。 
     * @return 
     */
    public get rolesContainer(): Laya.Sprite {
        return this._rolesContainer;
    }
    /**
     * 技能选中目标 
     * @param indexs
     * 
     */
    public addSkillAimFlag(indexs: any[]) {
        var aimRole: BaseRoleView;
        for (const key in indexs) {
            if (Object.prototype.hasOwnProperty.call(indexs, key)) {
                let indexValue = Number(indexs[key]);
                aimRole = this.rolesDict[indexValue];
                aimRole && aimRole.addSkillAimFlag();
            }
        }
    }

    public dispose() {
        this.delEvent();
        for (const key in this._rolesDict) {
            if (Object.prototype.hasOwnProperty.call(this._rolesDict, key)) {
                const role = this._rolesDict[key] as BaseRoleView;
                ObjectUtils.disposeObject(role);
            }
        }
        ObjectUtils.disposeObject(this._rolesContainer);
        this._rolesContainer = null;
        this._rolesDict = null;
        this._cameraTarget = null;
        this._effectContainer = null;
        this._roleBackContainer = null;
        super.dispose();
    }

}