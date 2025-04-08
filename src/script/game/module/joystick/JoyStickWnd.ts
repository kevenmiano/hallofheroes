import Resolution from '../../../core/comps/Resolution';
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIManager from '../../../core/ui/UIManager';
import { JoyStickEvent } from '../../constant/event/NotificationEvent';
import { EmWindow } from '../../constant/UIDefine';
import { IEnterFrame } from '../../interfaces/IEnterFrame';
import { EnterFrameManager } from '../../manager/EnterFrameManager';
import { NotificationManager } from '../../manager/NotificationManager';
/**
* @author:pzlricky
* @data: 2021-02-01 10:29
* @description 遥杆
*/
export default class JoyStickWnd extends BaseWindow implements IEnterFrame {

    private _InitX: number = 0;
    private _InitY: number = 0;
    private _touchId: number = -1;
    private _tweener: fgui.GTweener;

    private _startMove: boolean = false;
    private _tmpDeg: number = 0;
    private _tmpRad: number = 0;
    public radius: number = 0;

    private center: fgui.GObject;
    private bgPress: fgui.GObject;
    private bgNormal: fgui.GButton;

    private static inst: JoyStickWnd = null;

    public static get Instance(): JoyStickWnd {
        if (!this.inst) {
            this.inst = new JoyStickWnd();
        }
        return this.inst;
    }

    public OnInitWind() {
        this.width = this.bgPress.width;
        this.height = this.bgPress.width;
        this.resize();
        //按钮初始位置
        this._InitX = this.center.x;
        this._InitY = this.center.y;
        this._touchId = -1;
        this.radius = this.width / 2 - 16;

        this.changeState()
        this.bgNormal.off(Laya.Event.MOUSE_DOWN, this, this.onTouchDown);
        this.bgNormal.on(Laya.Event.MOUSE_DOWN, this, this.onTouchDown);

        EnterFrameManager.Instance.registeEnterFrame(this)
        NotificationManager.Instance.addEventListener(JoyStickEvent.JoystickTriggerUp, this.TriggerUp, this);
    }

    public enterFrame() {
        if (this._startMove) {
            NotificationManager.Instance.dispatchEvent(JoyStickEvent.JoystickMoving, this._tmpRad, this._tmpDeg);
        }
    }

    public Trigger(evt: Laya.Event) {
        this.onTouchDown(evt);
    }

    public TriggerUp(evt: Laya.Event) {
        this.OnTouchUp(evt);
    }

    private changeState(down: boolean = false) {
        this.center.visible = down
        this.bgPress.visible = down
        this.bgNormal.visible = !down
    }

    private onTouchDown(evt: Laya.Event) {
        if (this._touchId == -1) {//First touch
            this._touchId = evt.touchId;

            if (this._tweener != null) {
                this._tweener.kill();
                this._tweener = null;
            }

            this.changeState(true)
            let beginPos = this.bgPress.globalToLocal(Laya.stage.mouseX, Laya.stage.mouseY)
            var bx: number = beginPos.x;
            var by: number = beginPos.y;

            if (bx < 0)
                bx = 0;
            else if (bx > this.width)
                bx = this.width;

            if (by > this.height)
                by = this.height;
            else if (by < 0)
                by = 0;

            this.center.setXY(bx, by)

            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.OnTouchMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.OnTouchUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.OnTouchUp);
        }
    }

    private OnTouchUp(evt: Laya.Event) {
        this._touchId = -1;
        // this._thumb.rotation = this._thumb.rotation + 180;
        this._startMove = false
        this.changeState(false)
        this._tweener = fgui.GTween.to2(this.center.x, this.center.y, this._InitX, this._InitY, 0.5)
            .setTarget(this.center, this.center.setXY)
            .setEase(fgui.EaseType.CircOut)
            .onComplete(this.onTweenComplete, this);

        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.OnTouchMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.OnTouchUp);

        NotificationManager.Instance.dispatchEvent(JoyStickEvent.JoystickUp);
    }

    private onTweenComplete() {
        this._tweener = null;
        this.center.setXY(this._InitX, this._InitY)
    }

    private OnTouchMove(evt: Laya.Event) {
        if (this._touchId != -1 && evt.touchId == this._touchId) {
            this._startMove = true

            let movePos = this.bgPress.globalToLocal(Laya.stage.mouseX, Laya.stage.mouseY)
            var offsetX: number = movePos.x - this._InitX;
            var offsetY: number = movePos.y - this._InitY;

            var rad: number = Math.atan2(offsetY, offsetX);
            var maxX: number = this.radius * Math.cos(rad);
            var maxY: number = this.radius * Math.sin(rad);
            if (Math.abs(offsetX) > Math.abs(maxX))
                offsetX = maxX;
            if (Math.abs(offsetY) > Math.abs(maxY))
                offsetY = maxY;

            this.center.x = this._InitX + offsetX;
            this.center.y = this._InitY + offsetY;

            this._tmpRad = Math.atan2(-offsetY, offsetX);
            this._tmpDeg = this._tmpRad * 180 / Math.PI;

            // Logger.log("[JoyStickWnd]OnTouchMove", offsetX, -offsetY, "_tmpRad="+this._tmpRad,  "_tmpDeg="+this._tmpDeg )
        }
    }

    async Show() {
        await UIManager.Instance.ShowWind(EmWindow.JoyStick);
    }

    async Hide() {
        await UIManager.Instance.HideWind(EmWindow.JoyStick)
    }

    resize() {
        this.x = 100;
        this.y = Resolution.gameHeight - 160 - 100;
    }

    public dispose() {
        EnterFrameManager.Instance.unRegisteEnterFrame(this)
        NotificationManager.Instance.removeEventListener(JoyStickEvent.JoystickTriggerUp, this.TriggerUp, this);
        this.center.off(Laya.Event.MOUSE_DOWN, this, this.onTouchDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.OnTouchMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.OnTouchUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.OnTouchUp);
        super.dispose();
        JoyStickWnd.inst = null;
    }

}