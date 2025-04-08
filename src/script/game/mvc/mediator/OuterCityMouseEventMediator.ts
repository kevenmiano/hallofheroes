// @ts-nocheck
import { NotificationEvent, OuterCityEvent } from "../../constant/event/NotificationEvent";
import IMediator from "../../interfaces/IMediator";
import DragManager from "../../manager/DragManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { MapPhysicsCastle } from "../../map/outercity/mapphysics/MapPhysicsCastle";
import { OuterCityMap } from "../../map/outercity/OuterCityMap";
import { BagHelper } from "../../module/bag/utils/BagHelper";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { CursorManagerII } from "../../manager/CursorManagerII";
import { TransmitHandler } from "../../map/outercity/TransmitHandler";
import Sprite = Laya.Sprite;
import Point = Laya.Point;
import Logger from "../../../core/logger/Logger";
import { MapPhysicsField } from "../../map/outercity/mapphysics/MapPhysicsField";
import OutercityVehicleArmyView from "../../map/campaign/view/physics/OutercityVehicleArmyView";

/**
 * @description    外城鼠标事件逻辑
 * @author yuanzhan.yu
 * @date 2021/11/23 17:22
 * @ver 1.0
 */
export class OuterCityMouseEventMediator implements IMediator {
    constructor() {
    }

    public register(target: Sprite): void {
        target.on(Laya.Event.CLICK, this, this.__onClickHandler);
        target.on(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler);
        target.on(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler);
        target.on(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
        target.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
        target.on(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
    }

    public unregister(target: Sprite): void {
        target.off(Laya.Event.CLICK, this, this.__onClickHandler);
        target.off(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler);
        target.off(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler);
        target.off(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
        target.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
        target.off(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
    }

    private _downPos: Point = new Point();
    private _upPos: Point = new Point();

    private __mouseDownHandler(evt: Laya.Event): void {
        Logger.yyz("💥当前点击的对象: ", evt.target);
        if (BagHelper.Instance.isSelling) {
            return;
        }
        if (DragManager.Instance.isDraging) {
            return;
        }
        this._downPos.x = StageReferance.stage.mouseX;
        this._downPos.y = StageReferance.stage.mouseY;
        // let id = ArmyManager.Instance.army.id;
        // let army: BaseArmy = OuterCityManager.Instance.model.allArmyDict[id];
        // if(army && army.armyView){
        //     let x = army.armyView.x;
        //     let y = army.armyView.y;
        //     Logger.yyz(`外城人物坐标x==${x} ,y==${y} `);
        // }
    }

    private __mouseUpHandler(evt: Laya.Event): void {
        // if (BagHelper.Instance.isSelling) {
        //     return;
        // }
        // if (DragManager.Instance.isDraging) {
        //     return;
        // }
        // if (TransmitHandler.Instance.mouseCursor) {
        //     return;
        // }
        // if (CursorManagerII.Instance.currentState == CursorManagerII.PVP_ATTACT_CURSOR) {
        //     return;
        // }
        // this._upPos.x = StageReferance.stage.mouseX;
        // this._upPos.y = StageReferance.stage.mouseY;
        // let leng: number = this._downPos.distance(this._upPos.x, this._upPos.y);
        // if (leng < 3) {
        //     if (!(evt.target && evt.target["mouseClickHandler"] && evt.target["mouseClickHandler"]())) {
        //         this.mapView.worldWalkLayer.mouseClickHandler(evt);
        //         NotificationManager.Instance.dispatchEvent(NotificationEvent.CLICK_MAP, evt.target);
        //     }
        // }
    }

    private __mouseMoveHandler(evt: Laya.Event): void {
        if (BagHelper.Instance.isSelling) {
            return;
        }
        if (DragManager.Instance.isDraging) {
            return;
        }
        if (TransmitHandler.Instance.mouseCursor) {
            return;
        }
        if (CursorManagerII.Instance.currentState == CursorManagerII.PVP_ATTACT_CURSOR) {
            return;
        }
        let b: boolean = this.mapView.npcLayer.mouseMoveHandler(evt);
        if (b) {
            CursorManagerII.Instance.showCursorByType(CursorManagerII.ATTACK_CURSOR);
        }
        else {
            let mc: any = evt.target;
            if (mc) {
                if (mc['parent'] == this.mapView.mainBuidingLayer) {
                    if (mc instanceof MapPhysicsCastle) {
                        if ((<MapPhysicsCastle>mc).info.info.occupyPlayerId > 0) {
                            // if (!mc['isSelfCastle'] && mc.getCurrentPixels() > 10 && CursorManagerII.Instance.currentState != CursorManagerII.SELL_CIRSOR) {
                            //     CursorManagerII.Instance.showCursorByType(CursorManagerII.ATTACK_CURSOR);
                            // }
                            // else {
                            //     this.resetCursor();
                            // }
                            this.resetCursor();
                        }
                        else {
                            this.resetCursor();
                        }
                    }
                    else if (mc instanceof MapPhysicsField) {
                        // if (!mc['isSelfField'] && mc.getCurrentPixels() > 10 && CursorManagerII.Instance.currentState != CursorManagerII.SELL_CIRSOR) {
                        //     CursorManagerII.Instance.showCursorByType(CursorManagerII.ATTACK_CURSOR);
                        // }
                        // else {
                        //     this.resetCursor();
                        // }
                        this.resetCursor();
                    }
                    else if (CursorManagerII.Instance.currentState != CursorManagerII.SELL_CIRSOR) {
                        CursorManagerII.Instance.showCursorByType(CursorManagerII.ATTACK_CURSOR);
                    }
                }else if(mc['parent'] == this.mapView.worldWalkLayer){
                    if (mc instanceof OutercityVehicleArmyView) {
                        if(OuterCityManager.Instance.model.checkMouseStatus(mc.wildInfo)){
                            CursorManagerII.Instance.showCursorByType(CursorManagerII.ATTACK_CURSOR);
                        }else{
                            this.resetCursor();
                        }
                    }
                }
                else {
                    this.resetCursor();
                }
            }
            else {
                this.resetCursor();
            }
        }
    }

    private resetCursor(): void {
        let cursorState: string = CursorManagerII.Instance.currentState;
        if (cursorState != CursorManagerII.DRAG_CURSOR && cursorState != CursorManagerII.SELL_CIRSOR) {
            if (!TransmitHandler.Instance.mouseCursor) {
                CursorManagerII.Instance.resetCursor();
            }
        }


    }

    private __onClickHandler(evt: Laya.Event): void {
        if (BagHelper.Instance.isSelling) {
            return;
        }
        if (DragManager.Instance.isDraging) {
            return;
        }
        if (TransmitHandler.Instance.mouseCursor) {
            return;
        }
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_CLICK);
        this._upPos.x = StageReferance.stage.mouseX;
        this._upPos.y = StageReferance.stage.mouseY;
        let leng: number = this._downPos.distance(this._upPos.x, this._upPos.y);
        if (leng < 3) {
            let ret = this.mapView.mainBuidingLayer.mouseClickHandler(evt);
            if (!ret) {
                this.mapView.worldWalkLayer.mouseClickHandler(evt);
                NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_UNLOCK_WAR_FIGHT);
                NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_UNLOCK_VEHICLE_FIGHT);
                NotificationManager.Instance.dispatchEvent(NotificationEvent.CLICK_MAP, evt.target);
            }
        }

        if (CursorManagerII.Instance.currentState == CursorManagerII.PVP_ATTACT_CURSOR) {
            this.resetCursor();
        }
    }

    private __mouseOverHandler(evt: Laya.Event): void {
        evt.stopPropagation();
        if (BagHelper.Instance.isSelling) {
            return;
        }
        if (DragManager.Instance.isDraging) {
            return;
        }
        this.mapView.mainBuidingLayer.mouseOverHandler(evt);
    }

    private __mouseOutHandler(evt: Laya.Event): void {
        evt.stopPropagation();
        if (BagHelper.Instance.isSelling) {
            return;
        }
        if (DragManager.Instance.isDraging) {
            return;
        }
        this.mapView.mainBuidingLayer.mouseOutHandler(evt);
        if (CursorManagerII.Instance.currentState == CursorManagerII.PVP_ATTACT_CURSOR) {
            return;
        }
        this.resetCursor();
    }

    private get mapView(): OuterCityMap {
        return OuterCityManager.Instance.mapView;
    }
}