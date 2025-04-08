/*
 * @Author: jeremy.xu
 * @Date: 2023-01-10 15:11:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-02-09 14:08:22
 * @Description: 
 */

import Resolution from "../../../core/comps/Resolution";
import Logger from "../../../core/logger/Logger";
import { DisplayObject } from "../../component/DisplayObject";
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { PlayerVisualFollow } from "../../constant/PlayerVisualFollow";
import IMediator from "../../interfaces/IMediator";
import { TweenDrag } from "../../map/castle/utils/TweenDrag";
import Tiles from "../../map/space/constant/Tiles";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceSocketOutManager } from "../../map/space/SpaceSocketOutManager";
import { SpaceSceneMapView } from "../../map/space/view/SpaceSceneMapView";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { SpaceMapCameraMediator } from "./SpaceMapCameraMediator";

import Point = Laya.Point;
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { SpaceArmyView } from "../../map/space/view/physics/SpaceArmyView";
import { PointUtils } from "../../../core/utils/PointUtils";
import { MouseData } from "../../map/space/data/MouseData";

export class SpaceDragMediator implements IMediator {
    public static drawOff = 120
    private _target: DisplayObject;
    private _dragObj: TweenDrag;
    private _startPoint: Point = new Point();
    private _endPoint: Point = new Point();

    public register(target: Object): void {
        this._target = <DisplayObject>target;
        this._dragObj = new TweenDrag(this._target, <DisplayObject>this._target);
        this._dragObj.onDragStart = this.__dragStartCallBack.bind(this);
        this._dragObj.onDraging = this.__dragingCallBack.bind(this);
        this._dragObj.onDragDrop = this.__dragDropCallBack.bind(this);
        this._dragObj.SlidSpeedFactor = 2 / 3;
    }

    public unregister(target: Object): void {
        if (this._dragObj) {
            this._dragObj.dispose();
        }
        this._dragObj = null;
        this._target = null;
    }

    private __dragDropCallBack(): void {
        let mapModel = SpaceManager.Instance.model;
        if (mapModel.checkOutScene()) {
            SpaceMapCameraMediator.lockMapCamera();
        }
        this.sendPath();
    }

    private __dragingCallBack(): void {
        let mapModel = SpaceManager.Instance.model;
        if (!mapModel) return
        let mapTempInfo = mapModel.mapTempInfo;
        if (!mapTempInfo) return

        let target = this._target;
        let mapWidth = mapTempInfo.Width;
        let mapHeight = mapTempInfo.Height;

        if ((mapWidth * target.scaleX) < Resolution.gameWidth) {
            target.x = 0;
        }
        else if (target.x < Resolution.gameWidth - mapWidth * target.scaleX) {
            target.x = Resolution.gameWidth - mapWidth * target.scaleX;
        }
        else if (target.x > 0) {
            target.x = 0;
        }

        if ((mapHeight * target.scaleY) < Resolution.gameHeight) {
            target.y = 0;
        }
        else if (target.y < Resolution.gameHeight - mapHeight * target.scaleY) {
            target.y = Resolution.gameHeight - mapHeight * target.scaleY;
        }
        else if (target.y > 0) {
            target.y = 0;
        }

        // 距离检查   拖拽结束才请求同步
        this._endPoint.x = target.x;
        this._endPoint.y = target.y;
        if (this._endPoint.distance(this._startPoint.x, this._startPoint.y) > SpaceDragMediator.drawOff) {
            this._startPoint.x = this._endPoint.x;
            this._startPoint.y = this._endPoint.y;
            this.dragingSceneImp();
        }
    }

    private __dragStartCallBack(): void {
        // SpaceMapCameraMediator.lockMapCamera();
        SpaceMapCameraMediator.isLockCamera = true;
        MouseData.Instance.curState = MouseData.LOCK;
        this._startPoint.x = this._target.x;
        this._startPoint.y = this._target.y;
    }

    private dragingSceneImp(): void {
        (this._target as SpaceSceneMapView).event(CampaignMapEvent.MOVE_SCENET_END, this._target);
    }

    private _walkPath: Laya.Point[] = [];
    private sendPath() {
        this._walkPath = [];
        let centerX: number = Math.abs(StageReferance.stageWidth / 2 - this._target.x);
        let centerY: number = Math.abs(StageReferance.stageHeight / 2 - this._target.y);
        let centerTilePos = this.getTilePos(centerX, centerY);
        this._walkPath.push(centerTilePos);
        Logger.info("天空之城屏幕拖动", centerTilePos)
        SpaceSocketOutManager.Instance.move(this._walkPath, PlayerVisualFollow.Type2);
    }

    /**
     * 转换当前坐标为格子坐标 
     */
    public getTilePos(x: number, y: number): Laya.Point {
        return new Laya.Point(parseInt((x / Tiles.WIDTH).toString()), parseInt((y / Tiles.HEIGHT).toString()));
    }
}