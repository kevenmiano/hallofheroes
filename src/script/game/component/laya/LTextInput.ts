// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-19 21:10:38
 * @LastEditTime: 2023-07-10 14:34:49
 * @LastEditors: jeremy.xu
 * @Description: 封装 Laya.TextInput
 */

import { EmPackName, EmWindow } from "../../constant/UIDefine"
import FUIHelper from "../../utils/FUIHelper"

export default class LTextInput extends Laya.Input {
    private _funcInput: Function
    private _funcFocus: Function
    private _funcBlur: Function
    private btnShelter: fgui.GButton
    public setForbiddenFunc(func: Function) {
        if (!this.btnShelter) {
            let btnShelter = FUIHelper.createFUIInstance(EmPackName.Base, "Btn_Common") as fgui.GButton
            btnShelter.setSize(this.width, this.height)
            btnShelter.setSize(this.width, this.height)
            btnShelter.setXY(this.x, this.y)
            this.btnShelter = btnShelter
        }

        if (func) {
            this.btnShelter.onClick(this, () => {
                func()
            })
            this.parent.addChild(this.btnShelter.displayObject)
        } else {
            this.btnShelter.displayObject.removeSelf()
        }
    }
    private _target: any

    constructor() {
        super()
    }

    public static create(parent: Laya.Sprite, text: string = "",
        fontSize: number = 24, color: string = "#FFECC6",
        width: number = 100, height: number = 100,
        x: number = 0, y: number = 0, leading: number = 30): LTextInput {

        let tf = new LTextInput();
        tf.text = text;
        tf.fontSize = fontSize;
        tf.color = color;
        tf.width = width;
        tf.height = height;
        tf.x = x;
        tf.y = y;
        tf.leading = leading;
        tf.wordWrap = true;
        tf.multiline = true;
        if (parent) {
            parent.addChild(tf)
        }
        return tf
    }

    register(target: any, onInput: Function, onFocus?: Function, onBlur?: Function) {
        this._target = target
        this._funcInput = onInput
        this._funcFocus = onFocus
        this._funcBlur = onBlur
        this.on(Laya.Event.INPUT, this._target, this._funcInput);
        this.on(Laya.Event.FOCUS, this._target, this._funcFocus);
        this.on(Laya.Event.BLUR, this._target, this._funcBlur);
    }

    unRegister() {
        this.off(Laya.Event.INPUT, this._target, this._funcInput);
        this.off(Laya.Event.FOCUS, this._target, this._funcFocus);
        this.off(Laya.Event.BLUR, this._target, this._funcBlur);
        this._funcInput = null
        this._funcFocus = null
        this._funcBlur = null
    }
}