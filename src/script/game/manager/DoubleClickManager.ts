/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-22 15:07:18
 * @LastEditTime: 2021-02-23 10:00:18
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import Logger from "../../core/logger/Logger";
import { TimerEvent, TimerTicker } from "../utils/TimerTicker";
import {InteractiveEvent} from "../constant/event/NotificationEvent";

export class DoubleClickManager {
    private static _instance: DoubleClickManager;
    public static get Instance(): DoubleClickManager {
        if (!DoubleClickManager._instance)
            DoubleClickManager._instance = new DoubleClickManager();
        return DoubleClickManager._instance;
    }

    private DoubleClickSpeed: number = 350;

    private _timer: TimerTicker;
    private _currentTarget: Laya.Sprite;
    private _isClicking: boolean;
    public get isClicking(): boolean {
        return this._isClicking;
    }
    public set isClicking(value: boolean){
        this._isClicking = value;
    }

    constructor() {
        this.init();
    }

    private init() {
        this._timer = new TimerTicker(this.DoubleClickSpeed, 1);
        this._timer.addEventListener(TimerEvent.TIMER_COMPLETE, this.__timerCompleteHandler, this);
    }

    /**
     * 开启组件双击, 需要监听 InteractiveEvent.CLICK 和 InteractiveEvent.DOUBLE_CLICK 事件
     * @param target 需要监听双击事件的对象
     */
    public enableDoubleClick(target: Laya.Sprite) {
        target.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler, [target]);
    }

    /**
     * 关闭组件双击, 需要移除 InteractiveEvent.CLICK 和 InteractiveEvent.DOUBLE_CLICK 事件
     * @param target 需要移除双击事件的对象
     */
    public disableDoubleClick(target: Laya.Sprite) {
        target.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    }

    private __timerCompleteHandler(evt: TimerEvent) {
        this.isClicking = false;
        this._currentTarget.event(InteractiveEvent.CLICK);
    }

    private __mouseDownHandler(target:Laya.Sprite, evt: Laya.Event) {
        if (this._timer.running) {
            this._timer.stop();
            this.isClicking = false;
            if (this._currentTarget != target) {
                return;
            }
            this._currentTarget.event(InteractiveEvent.DOUBLE_CLICK);
            Logger.log("[DoubleClickManager]doubleclick");
        }
        else {
            this._timer.reset();
            this._timer.start();
            this._currentTarget = target;
            this.isClicking = true;
        }
    }
}