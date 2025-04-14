import GameEventDispatcher from "../../event/GameEventDispatcher";
import UIButton from "../UIButton";
/**
 * @author:pzlricky
 * @data: 2021-02-22 17:01
 * @description ***
 */
export default class BaseFguiCom extends GameEventDispatcher {
  public UIObj: Map<string, any> = new Map<string, any>();
  protected comPart: fgui.GComponent;

  constructor(target: fgui.GComponent) {
    super();
    this.reseveCom(target);
  }

  public get view(): fgui.GComponent {
    return this.comPart;
  }

  getController(name: string): fgui.Controller {
    return this.comPart.getController(name);
  }

  /**
   * 遍历所有按钮节点
   * @param node 遍历节点
   */
  reseveCom(node: fgui.GComponent) {
    this.comPart = node;
    let nodeChildCount: number = node.numChildren;
    for (var index = 0; index < nodeChildCount; index++) {
      var element: fgui.GComponent = node.getChildAt(index).asCom;
      let elementName = element.name;
      if (elementName.toUpperCase().indexOf("BTN") != -1) {
        let uiBtn = new UIButton(element);
        this[elementName] = uiBtn;
        uiBtn.callBack = (target: fgui.GButton, evt: Laya.Event) => {
          this._onBtnClick(target, evt);
        };
      } else {
        this[elementName] = element;
      }
      this.UIObj.set(elementName, element);
    }
  }

  /**
   * 界面中所有按钮点击事件回调(不可可重写)
   * 实现 (组件名称 + Click)  回调接口
   * @param evt  fairygui.GButton   点击目标按钮
   * */
  private _onBtnClick(target: fgui.GButton, evt: Laya.Event) {
    let btnName = target.name;
    if (this[btnName + "Click"]) {
      this[btnName + "Click"](target, evt);
    }
  }

  // TODO 提供只遍历一层的接口
  public static autoGenerate(
    target: fgui.GComponent,
    toTarget: any,
    prefix: string = "",
  ) {
    if (!target || !toTarget) return;
    let nodeChildCount: number = target.numChildren;
    for (var index = 0; index < nodeChildCount; index++) {
      var element: fgui.GComponent = target.getChildAt(index).asCom;
      let elementName = element.name;
      if (prefix) {
        elementName = prefix + "_" + element.name;
      }
      if (elementName.toUpperCase().indexOf("BTN") != -1) {
        // 有些继承BaseWindow的时候生成了一遍 再调用此接口会重复生成
        if (!toTarget[elementName]) {
          toTarget[elementName] = new UIButton(element);
          toTarget[elementName].callBack = (
            target: fgui.GButton,
            evt: Laya.Event,
          ) => {
            let btnName = target.name;
            if (toTarget[btnName + "Click"]) {
              toTarget[btnName + "Click"](target, evt);
            }
          };
        }
      } else {
        toTarget[elementName] = element;
      }

      let extprefix;
      if (prefix) {
        extprefix = element.name;
      }
      this.autoGenerate(element, toTarget, extprefix);
    }
  }

  /**转换实例对象 */
  public static createComponent(com: fgui.GComponent, cls: any) {
    let extCom = new cls(com);
    return extCom;
  }

  get visible(): boolean {
    return this.comPart.visible;
  }

  set visible(value: boolean) {
    this.comPart.visible = value;
    if (this.comPart.displayObject) {
      this.comPart.displayObject.active = value;
    }
  }

  dispose(destred = true) {
    if (this.comPart && !this.comPart.isDisposed) {
      if (destred) {
        this.comPart.dispose();
      }
    }
  }
}
