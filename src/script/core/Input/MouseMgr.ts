// @ts-nocheck
import GameEventDispatcher from "../event/GameEventDispatcher";
// import IManager from "../Interface/IManager";
import { Func } from "../comps/Func";

export class MouseFunc {
  public target: any;
  public args: any;
  public MouseDown: Func;
  public MouseUp: Func;
  public MouseWheel: Func;
  public MouseOver: Func;
  public MouseOut: Func;

  constructor(data?: Object) {
    for (let i in data) {
      this[i] = data[i];
    }
  }

  dispose() {
    this.args = null;
    this.MouseDown = null;
    this.MouseUp = null;
    this.MouseWheel = null;
    this.MouseOver = null;
    this.MouseOut = null;
  }
}

/**
 * 鼠标事件管理类
 * @author:pzlricky
 * @data: 2020-11-25 17:36
 * @description ***
 */
export default class MouseMgr extends GameEventDispatcher {
  private maps: Map<any, MouseFunc> = new Map();
  private static instance: MouseMgr;

  public static get Instance(): MouseMgr {
    if (!this.instance) {
      this.instance = new MouseMgr();
    }
    return this.instance;
  }

  preSetup(t?: any) {
    this.maps = new Map();
  }

  setup(t?: any) {}

  /**
   * 注册鼠标事件
   * @param target 目标对象
   * @param args 传递参数
   * @param mouseDown 鼠标按下
   * @param mouseUp 鼠标抬起
   * @param mouseWheel 鼠标滚动
   * @param mouseOver 鼠标移入
   * @param mouseOut 鼠标移出
   */
  register(
    target: Laya.Sprite,
    args?: any,
    mouseDown?: Function,
    mouseUp?: Function,
    mouseWheel?: Function,
    mouseOver?: Function,
    mouseOut?: Function
  ) {
    if (this.maps.has(target)) {
      return;
    }
    let func = new MouseFunc();
    func.target = target;
    func.args = args;
    func.MouseDown = new Func(target, mouseDown);
    func.MouseUp = new Func(target, mouseUp);
    func.MouseWheel = new Func(target, mouseWheel);
    func.MouseOver = new Func(target, mouseOver);
    func.MouseOut = new Func(target, mouseOut);
    this.maps.set(target, func);
    target.on(Laya.Event.MOUSE_DOWN, this, this.__onMouseDownHandler);
    target.on(Laya.Event.MOUSE_UP, this, this.__onMouseUpHandler);
    target.on(Laya.Event.MOUSE_WHEEL, this, this.__onMouseWheel);
    target.on(Laya.Event.MOUSE_OVER, this, this.__onMouseOver);
    target.on(Laya.Event.MOUSE_OUT, this, this.__onMouseOut);
  }

  /**
   * 移除鼠标事件
   * @param target 事件对象
   */
  remove(target: any): boolean {
    if (!this.maps.has(target)) {
      return;
    }
    let func = this.maps.get(target);
    func.dispose();
    func = null;
    target.off(Laya.Event.MOUSE_DOWN, this, this.__onMouseDownHandler);
    target.off(Laya.Event.MOUSE_UP, this, this.__onMouseUpHandler);
    target.off(Laya.Event.MOUSE_WHEEL, this, this.__onMouseWheel);
    target.off(Laya.Event.MOUSE_OVER, this, this.__onMouseOver);
    target.off(Laya.Event.MOUSE_OUT, this, this.__onMouseOut);
    return this.maps.delete(target);
  }

  __onMouseDownHandler(evt: Event) {
    if (!this.maps.has(evt.target)) {
      return;
    }
    let func = this.maps.get(evt.target);
    if (func.MouseDown) {
      func.MouseDown.Invoke(func.target, func.args);
    }
  }

  __onMouseUpHandler(evt: Event) {
    if (!this.maps.has(evt.target)) {
      return;
    }
    let func = this.maps.get(evt.target);
    if (func.MouseUp) {
      func.MouseUp.Invoke(func.target, func.args);
    }
  }

  __onMouseWheel(evt: Event) {
    if (!this.maps.has(evt.target)) {
      return;
    }
    let func = this.maps.get(evt.target);
    if (func.MouseWheel) {
      func.MouseWheel.Invoke(func.target, func.args);
    }
  }

  __onMouseOver(evt: Event) {
    if (!this.maps.has(evt.target)) {
      return;
    }
    let func = this.maps.get(evt.target);
    if (func.MouseOver) {
      func.MouseOver.Invoke(func.target, func.args);
    }
  }

  __onMouseOut(evt: Event) {
    if (!this.maps.has(evt.target)) {
      return;
    }
    let func = this.maps.get(evt.target);
    if (func.MouseOut) {
      func.MouseOut.Invoke(func.target, func.args);
    }
  }
}
