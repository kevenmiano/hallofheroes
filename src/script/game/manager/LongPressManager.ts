import {InteractiveEvent} from "../constant/event/NotificationEvent";
import Logger from "../../core/logger/Logger";

/**
 * 长按操作
 * fixme 鼠标按下后就移出去的问题
 */
export class LongPressManager
{
    private static _instance:LongPressManager;
    private _evt:Laya.Event = new Laya.Event();

    public static get Instance():LongPressManager
    {
        if(!LongPressManager._instance)
        {
            LongPressManager._instance = new LongPressManager();
        }
        return LongPressManager._instance;
    }

    private _longPressTime:number = 500;

    private _currentTarget:Laya.Sprite;

    constructor()
    {
    }

    public enableLongPress(target:Laya.Sprite)
    {
        target.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler, [target]);
    }

    private __timerCompleteHandler(evt:Laya.Event, target:Laya.Sprite)
    {
        this._currentTarget.event(InteractiveEvent.LONG_PRESS, [evt, target]);
    }

    private __mouseDownHandler(target:Laya.Sprite, evt:Laya.Event)
    {
        // Logger.yyz("1111111111=====target", target["$owner"]);
        // Logger.yyz("2222222222=====evt", evt.currentTarget);
        this._currentTarget = target;
        // evt.stopPropagation();//阻止事件流冒泡, 不然的话会导致使用evt.currentTarget的时候变化
        Laya.timer.once(this._longPressTime, this, this.__timerCompleteHandler, [evt, target]);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler, [target]);
    }

    private __mouseUpHandler(target:Laya.Sprite, evt:Laya.Event)
    {
        // evt.stopPropagation();
        Laya.timer.clear(this, this.__timerCompleteHandler);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
        this._currentTarget.event(InteractiveEvent.LONG_PRESS_END, [evt, target]);
    }

    public disableLongPress(target:Laya.Sprite)
    {
        target.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    }
}