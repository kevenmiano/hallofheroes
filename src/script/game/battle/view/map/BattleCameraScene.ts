// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 12:22:45
 * @LastEditTime: 2023-01-03 17:34:17
 * @LastEditors: jeremy.xu
 * @Description: 战斗地图摄像机 
 */

import Resolution from '../../../../core/comps/Resolution';
import Dictionary from '../../../../core/utils/Dictionary';
import { DisplayObject } from "../../../component/DisplayObject";
import { RepeatBackGroundLayer } from './RepeatBackGroundLayer';

export class BattleCameraScene extends Laya.Sprite {
    protected _cameraX: number = Resolution.gameWidth / 2;
    protected _cameraY: number = Resolution.gameHeight / 2;
    protected _preCameraX: number = 0;
    protected _zoom: number = 1;
    protected childLayerSettingMap: Dictionary;
    protected _cameraScaleCenterPoint: Laya.Point = new Laya.Point(Resolution.gameWidth / 2, Resolution.gameHeight / 2);
    protected _sceneWidth: number = Resolution.gameWidth;
    protected _sceneHeight: number = Resolution.gameHeight;
    constructor() {
        super();
        this.childLayerSettingMap = new Dictionary();
    }

    public addLayerAt(layer: DisplayObject, childIndex: number, moveCoefficient: number = 1) {
        this.addChildAt(layer, childIndex);
        //@ts-ignore
        this.childLayerSettingMap[layer] = { moveCoefficient: moveCoefficient };
    }

    public addLayer(layer: DisplayObject, moveCoefficient: number = 0) {
        this.addLayerAt(layer, this.numChildren, moveCoefficient);
    }

    public removeLayer(layer: DisplayObject) {
        this.removeChild(layer);
        //@ts-ignore
        delete this.childLayerSettingMap(layer);
    }

    public get cameraY(): number {
        return this._cameraY;
    }

    public set cameraY(value: number) {
        if (this._cameraY == value) return;
        this._cameraY = value;
        this.upDateNextRend();
    }

    public get cameraX(): number {
        return this._cameraX;
    }

    public set cameraX(value: number) {
        if (this._cameraX == value) return;
        this._cameraX = value;
        this.upDateNextRend();
    }

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(value: number) {
        if (this._zoom == value) return;
        this._zoom = value;
        this.upDateNextRend();
    }

    /**
     * 相机缩放中点 
     * @return 
     * 
     */
    public get cameraScaleCenterPoint(): Laya.Point {
        return this._cameraScaleCenterPoint;
    }

    public set cameraScaleCenterPoint(value: Laya.Point) {
        this._cameraScaleCenterPoint = value;
        this.upDateNextRend();
    }

    /**
     * 停止所有影片的移动. 
     * 
     */
    protected stopMovingAllMembers() {
        if (this.childLayerSettingMap) {
            for (const key in this.childLayerSettingMap) {
                if (Object.prototype.hasOwnProperty.call(this.childLayerSettingMap, key)) {
                    let element = this.childLayerSettingMap[key];
                    element.moveCoefficient = 0;
                    if (element instanceof RepeatBackGroundLayer) {
                        element.moveSpeed = 0;
                    }
                }
            }
        }
    }
    protected playMovingAllMembers() {
        if (this.childLayerSettingMap) {
            for (const key in this.childLayerSettingMap) {
                if (Object.prototype.hasOwnProperty.call(this.childLayerSettingMap, key)) {
                    let element = this.childLayerSettingMap[key];
                    element.moveCoefficient = element.getParaData().moveCoefficient;
                    if (element instanceof RepeatBackGroundLayer) {
                        element.moveSpeed = element.getParaData().moveSpeed;
                    }
                }
            }
        }
    }

    public get preCameraX(): number {
        return this._preCameraX;
    }

    public get sceneWidth(): number {
        return this._sceneWidth;
    }

    public set sceneWidth(value: number) {
        if (this._sceneWidth == value) return;
        this._sceneWidth = value;
        this.upDateNextRend();
    }
    public get sceneHeight(): number {
        return this._sceneHeight;
    }

    public set sceneHeight(value: number) {
        if (this._sceneHeight == value) return;
        this._sceneHeight = value;
        this.upDateNextRend();
    }
    /**
     * 更新摄像机中点 
     * 
     */
    private updateCenterPoint() {
        this._cameraScaleCenterPoint.x = this._sceneWidth / 2;
        this._cameraScaleCenterPoint.y = this._sceneHeight / 2;
    }
    public dispose() {
        this.childLayerSettingMap = null;
        while (this.numChildren > 0) {
            this.removeChildAt(0);
        }
    }

    private _isCanceled: boolean = false;
    protected upDateNextRend() {
        this._isCanceled = false;
        this.updateCenterPoint();

        this._preCameraX = this.cameraX;
        let coefficient: number = 0;

        if (this.childLayerSettingMap) {
            for (const key in this.childLayerSettingMap) {
                if (Object.prototype.hasOwnProperty.call(this.childLayerSettingMap, key)) {
                    const element = this.childLayerSettingMap[key];
                    coefficient = element.moveCoefficient;
                    element.x = -(this._cameraX - this._cameraScaleCenterPoint.x) * coefficient;
                }
            }
        }

        if (this.getStyle()) {
            this.scaleX = this._zoom;
            this.scaleY = this._zoom;
        }

        let fixY = this._cameraY 
            
        this.y = -(fixY * this._zoom);
        this.x = -(this._cameraX * this._zoom);
    }


}