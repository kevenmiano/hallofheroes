// @ts-nocheck
import { DisplayObject } from "../../component/DisplayObject";
import OneStatusButton from '../../component/OneStatusButton';
import IMediator from "../../interfaces/IMediator";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceBuildingLayer } from "../../map/space/view/layer/SpaceBuildingLayer";
import { SpaceNpcLayer } from "../../map/space/view/layer/SpaceNpcLayer";
import { SpaceWalkLayer } from "../../map/space/view/layer/SpaceWalkLayer";
import Logger from "../../../core/logger/Logger";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { CursorManagerII } from "../../manager/CursorManagerII";
import { TweenDrag } from "../../map/castle/utils/TweenDrag";
import SpaceScene from "../../scene/SpaceScene";


import Point = Laya.Point;
import { NotificationEvent, OuterCityEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";

export class SpaceMouseEventMediator implements IMediator {
    private _target: DisplayObject;
    private _controller: SpaceScene;
    private _downPos: Point = new Point();
    private _upPos: Point = new Point();

    public register(target: any) {
        this._target = target;
        this._controller = SpaceManager.Instance.controller;
        // this._target.on(Laya.Event.ROLL_OUT, this, this.__rollOutHandler);
        // this._target.on(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler);
        // this._target.on(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
        // this._target.on(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler);
        this._target.on(Laya.Event.CLICK, this, this.__onClickHandler);
        this._target.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
        // this._target.on(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
    }

    public unregister(target: any) {
        this._controller = SpaceManager.Instance.controller;
        // this._target.off(Laya.Event.ROLL_OUT, this, this.__rollOutHandler);
        // this._target.off(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler);
        // this._target.off(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
        // this._target.off(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler);
        this._target.off(Laya.Event.CLICK, this, this.__onClickHandler);
        this._target.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
        // this._target.off(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
        this._target = null;
        this._controller = null;
    }

    private __mouseDownHandler(evt: Laya.Event) {
        Logger.yyz("💥当前点击的对象mouseDown: ", evt.target);

        if (evt.target instanceof OneStatusButton) {
            return;
        }
        this._downPos.x = StageReferance.stage.mouseX;
        this._downPos.y = StageReferance.stage.mouseY;
    }

    private __mouseUpHandler(evt: Laya.Event) {
        
    }

    private __onClickHandler(evt: Laya.Event) {
        Logger.yyz("💥当前点击的对象: ", evt.target);

        if (evt.target instanceof OneStatusButton) {
            return;
        }

        this._upPos.x = StageReferance.stage.mouseX;
        this._upPos.y = StageReferance.stage.mouseY;
        let leng: number = this._downPos.distance(this._upPos.x, this._upPos.y);
        
        NotificationManager.Instance.dispatchEvent(NotificationEvent.MAP_CLICK);
        if (leng < TweenDrag.SlidThreshold) {
            if (this.buildingLayer && !this.buildingLayer.onClickHandler(evt)) {
                if (this.npcLayer && !this.npcLayer.onClickHandler(evt)) {
                    if (this.walkLayer) {
                        this.walkLayer.onClickHandler(evt);
                    }
                }
            }
        }
    }

    private __rollOutHandler(Evt: Laya.Event) {

    }

    private __mouseOutHandler(evt: Laya.Event) {
        if (evt.target instanceof OneStatusButton) {
            return;
        }
        SpaceManager.Instance.model.glowTarget = null;
        if (this.buildingLayer) {
            this.buildingLayer.mouseOutHandler(evt);
        }
    }

    private __mouseMoveHandler(evt: Laya.Event) {
        if (evt.target instanceof OneStatusButton) {
            return;
        }
        SpaceManager.Instance.model.glowTarget = null;
        if (this.npcLayer) {
            this.npcLayer.mouseMoveHandler(evt);
        }
    }

    private __mouseOverHandler(evt: Laya.Event) {
        if (this.buildingLayer) {
            this.buildingLayer.mouseOverHandler(evt);
        }
    }

    private resetCursor(): void {
        let cursorState: string = CursorManagerII.Instance.currentState;
        if (cursorState != CursorManagerII.DRAG_CURSOR && cursorState != CursorManagerII.SELL_CIRSOR) {
            CursorManagerII.Instance.resetCursor();
        }
    }

    private get npcLayer(): SpaceNpcLayer {
        return SpaceManager.Instance.mapView.npcLayer;
    }

    private get buildingLayer(): SpaceBuildingLayer {
        return SpaceManager.Instance.mapView.buildingLayer;
    }

    private get walkLayer(): SpaceWalkLayer {
        return SpaceManager.Instance.mapView.walkLayer;
    }
}