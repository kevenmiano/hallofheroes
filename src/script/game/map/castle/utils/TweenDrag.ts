// @ts-nocheck
import Logger from "../../../../core/logger/Logger";

export class TweenDrag {
    public onDraging: Function;
    public onDragStart: Function;
    public onDragDrop: Function;
    public onTweening: Function;
    public onTweenEnd: Function;

    /**
     * 判断滑动的阈值
     */
    public static SlidThreshold: number = 20;
    /**
     * 滑动速度系数
     */
    public SlidSpeedFactor: number = 1;
    private preMousePostion: Laya.Point = new Laya.Point();
    private mouseDownPoint: Laya.Point = new Laya.Point();
    private forceVector: Laya.Point = new Laya.Point();
    private _maxForce: number = 60;
    private _target: Laya.Sprite;
    private _eventTarget: Laya.Sprite;
    private _isTweening: boolean = false;
    private _enable: boolean = true;
    private _triggerDragStartFuncFlag: boolean = false;

    constructor(target: Laya.Sprite = null, eventTarget: Laya.Sprite = null) {
        this.target = target;
        this.eventTarget = eventTarget;
    }

    public set eventTarget(value: Laya.Sprite) {
        if (this._eventTarget == value) {
            return;
        }
        this.removeEvent();
        this._eventTarget = value;
        if (this.enable) {
            this.addEvent();
        }
    }

    public get eventTarget(): Laya.Sprite {
        return this._eventTarget;
    }

    private addEvent() {
        if (this._eventTarget == null) {
            return;
        }
        // Logger.info("TweenDrag addEvent")
        this._eventTarget.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDown);
    }

    private __mouseDown(event: Laya.Event) {
        // Logger.info("TweenDrag __mouseDown")
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.__mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.__mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.__mouseMove);
        this.preMousePostion = new Laya.Point(event.stageX, event.stageY);
        this.mouseDownPoint.x = event.stageX;
        this.mouseDownPoint.y = event.stageY;
        this._isTweening = false;
        this._triggerDragStartFuncFlag = false;
    }

    private __mouseUp(event: Event) {
        // Logger.info("TweenDrag __mouseUp")
        Laya.MouseManager.instance.setCapture(Laya.stage, false);
        Laya.MouseManager.instance.releaseCapture();
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.__mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.__mouseMove);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.__mouseUp);
        this.startTween();
        this.onDragDrop && this.onDragDrop();
    }

    private __mouseMove(event: Event) {
        if (!this._target || !this._target.stage) return;
        // Logger.info("TweenDrag __mouseMove")

        this.forceVector.x = this._target.stage.mouseX - this.preMousePostion.x;
        this.forceVector.y = this.target.stage.mouseY - this.preMousePostion.y;
        this.preMousePostion.x = this.target.stage.mouseX;
        this.preMousePostion.y = this.target.stage.mouseY;

        let dis = this.mouseDownPoint.distance(this._target.stage.mouseX, this._target.stage.mouseY)
        if (dis < TweenDrag.SlidThreshold) {
            // Logger.info("滑动距离不足", dis)
            return
        }
        
        if (!this._triggerDragStartFuncFlag) {
            this._triggerDragStartFuncFlag = true;
            this.onDragStart && this.onDragStart();
        }
        
        Laya.MouseManager.instance.setCapture(Laya.stage, true);

        this.target.x += Math.ceil(this.forceVector.x * this.SlidSpeedFactor);
        this.target.y += Math.ceil(this.forceVector.y * this.SlidSpeedFactor);

        var offX: number = 2;
        var offY: number = 2;
        var temp: number = this.mouseDownPoint.x - this.target.stage.mouseX;
        if (temp > 1) {
            offX = -2;
        }
        else if (temp < -1) {
            offX = 2;
        }
        else {
            offX = 0;
        }
        temp = this.mouseDownPoint.y - this.target.stage.mouseY
        if (temp > 1) {
            offY = -2;
        }
        else if (temp < -1) {
            offY = 2;
        }
        else {
            temp = 0;
        }
        this.forceVector.x = this.forceVector.x + offX;
        this.forceVector.y = this.forceVector.y + offY;
        this.onDraging && this.onDraging();
    }

    private startTween() {
        if ((this.forceVector.x != 0) && (this.forceVector.y != 0)) {
            this.setForcVectorMaxValue();
            this._isTweening = true;
        }
    }

    private setForcVectorMaxValue() {
        this.forceVector.x = this.forceVector.x > this._maxForce ? this._maxForce : this.forceVector.x;
        this.forceVector.x = this.forceVector.x < -this._maxForce ? -this._maxForce : this.forceVector.x;
        this.forceVector.y = this.forceVector.y > this._maxForce ? this._maxForce : this.forceVector.y;
        this.forceVector.y = this.forceVector.y < -this._maxForce ? -this._maxForce : this.forceVector.y;
    }

    private removeEvent() {
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.__mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.__mouseMove);
        this._isTweening = false;
        if (this._eventTarget == null) {
            return;
        }
        this._eventTarget.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDown);
    }

    public get isTweening(): boolean {
        return this._isTweening;
    }

    public get enable(): boolean {
        return this._enable;
    }

    public set enable(value: boolean) {
        if (this._enable == value) {
            return;
        }
        if (value) {
            this.addEvent();
        }
        else {
            this.removeEvent();
        }
        this._enable = value;
    }

    public get target(): Laya.Sprite {
        return this._target;
    }

    public set target(value: Laya.Sprite) {
        if (this._target == value) {
            return;
        }
        this._target = value;
    }

    public dispose() {
        Laya.MouseManager.instance.setCapture(Laya.stage, false);
        Laya.MouseManager.instance.releaseCapture();
        this.removeEvent();
        this._target = null;
        this._eventTarget = null;
        this.onDraging = null;
        this.onDragStart = null;
        this.onDragDrop = null;
        this.onTweening = null;
        this.onTweenEnd = null;
    }
}
