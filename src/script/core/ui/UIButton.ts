import { SoundIds } from "../../game/constant/SoundIds";
import { EmPackName } from "../../game/constant/UIDefine";
import FUIHelper from "../../game/utils/FUIHelper";
import AudioManager from "../audio/AudioManager";
import { UIFilter } from "./UIFilter";

/**
 * @author:jeremy.xu
 * @data: 2021-01-04 15:00
 * @description 按钮组件
 *
 **/

export enum UIButtonChangeType {
  None = 0,
  Scale,
  Light,
  Dark,
}

export enum UIButtonType {
  Common = 0,
  Check,
}

export class UIButtonScaleParas {
  paraScale: number = 1.1;
  //缓动参数
}

export default class UIButton {
  public buttonType: number = UIButtonType.Common;
  public changeType: number = UIButtonChangeType.Scale;
  public scaleParas: UIButtonScaleParas = new UIButtonScaleParas();

  public args: any[];
  public thisObj: any;
  public callBack: Function; //
  public callBackEx: Function; //
  public soundRes: string = SoundIds.CONFIRM_SOUND;

  private initScale: number = 1;
  public btnInternal: number = 100; //100毫秒限制点击事件
  private currentTarget: any; //当前触发事件对象
  private timeCounter = 0;

  // 关联列表 只关联visible,alpha,touchable  TODO 记录相对位置
  public linkedList: fgui.GObject[] = [];

  //
  private defaultTitleColor: string = "";
  private defaultStrokeColor: string = "";
  public addToLinkList(obj: fgui.GObject) {
    if (this.linkedList.indexOf(obj) == -1) {
      this.linkedList.push(obj);
    }
  }

  private _view: fgui.GComponent;
  public get view(): fgui.GComponent {
    return this._view;
  }

  // 选中底框
  public selectedShapeImgUrl: string = "";
  private _selectedShapeImg: fgui.GLoader;
  private _selectedShape: boolean = false;
  set selectedShape(value: boolean) {
    if (!this._selectedShapeImg) return;

    this._selectedShape = value;
    this._selectedShapeImg.visible = value;
    this._selectedShapeImg.displayObject.active = value;
    this._selectedShapeImg.displayObject.active = value;
    if (this._selectedShapeImg.url != this.selectedShapeImgUrl) {
      this._selectedShapeImg.url = this.selectedShapeImgUrl;
    }
  }
  get selectedShape(): boolean {
    return this._selectedShape;
  }

  // 单选框
  // public checkImgUrl: string = ""
  // private _checked: boolean = false
  // private _checkImg: fgui.GLoader
  // set checked(value: boolean) {
  //     this._checked = value
  //     this._checkImg.visible = value
  //     if (this._checkImg.url != this.checkImgUrl) {
  //         this._checkImg.url = this.checkImgUrl
  //     }
  // }
  // get checked(): boolean {
  //     return this._checked
  // }

  constructor(button: fgui.GObject) {
    this._view = button as fgui.GComponent;
    this.initScale = button.scaleX != 0 ? button.scaleX : 1;

    if (button instanceof fgui.GButton) {
      this.defaultTitleColor = button.titleColor;

      const titleObject = (button as fgui.GButton).getChild("title") as any;
      if (titleObject && titleObject.strokeColor !== undefined) {
        this.defaultStrokeColor = titleObject.strokeColor;
      }
    }

    // let selectShapeImg = this._view.getChild("selectShapeImg") as fgui.GLoader
    // if (!selectShapeImg) {
    //     this._selectedShapeImg = new fgui.GLoader();
    //     this._view.addChildAt(this._selectedShapeImg, 0)
    // } else {
    //     this._selectedShapeImg = selectShapeImg
    // }

    // let checkImg = this._view.getChild("checkImg") as fgui.GLoader
    // if(!checkImg){
    //     this._checkImg = new fgui.GLoader();
    //     this._view.addChildAt(this._checkImg, this._view.numChildren)
    // }else{
    //     this._checkImg = checkImg
    // }

    this.addClickEvent();
  }

  __mouseout(evt: Laya.Event) {
    if (this.changeType == UIButtonChangeType.Scale) {
      this.setScale(this.initScale);
    } else if (this.changeType == UIButtonChangeType.Light) {
      this.setFilter([UIFilter.normalFilter]);
    } else if (this.changeType == UIButtonChangeType.Dark) {
      this.setFilter([UIFilter.normalFilter]);
    }
  }

  __mousedown(evt: Laya.Event) {
    if (!this.checkCanClick()) return;
    this.currentTarget = evt.currentTarget;
    AudioManager.Instance.playSound(this.soundRes);
    if (this.changeType == UIButtonChangeType.Scale) {
      this.setScale(this.scaleParas.paraScale * this.initScale);
    } else if (this.changeType == UIButtonChangeType.Light) {
      this.setFilter([UIFilter.lightFilter]);
    } else if (this.changeType == UIButtonChangeType.Dark) {
      this.setFilter([UIFilter.darkFilter]);
    }
  }

  __mouseup(evt: Laya.Event) {
    //限制点击
    if (this.currentTarget != evt.currentTarget) return;
    if (!this.checkCanClick()) return;
    this.timeCounter = Date.now();
    if (this.changeType == UIButtonChangeType.Scale) {
      this.setScale(this.initScale);
    } else if (this.changeType == UIButtonChangeType.Light) {
      this.setFilter([UIFilter.normalFilter]);
    }
    // else if (this.buttonType == UIButtonType.Check) {
    //     this.checked = !this.checked
    // }

    if (evt.type == Laya.Event.MOUSE_UP && this.callBack) {
      this.currentTarget = null;
      if (this.thisObj) {
        this.callBack.call(this.thisObj, this.view, evt, this.args);
      } else {
        this.callBack(this.view, evt, this.args);
      }
      if (this.callBackEx) {
        this.callBackEx(this.view, evt, this.args);
      }
    }
  }

  private checkCanClick() {
    let nowTime = Date.now();
    let padingTime = nowTime - this.timeCounter;
    if (padingTime < this.btnInternal) return false;
    return true;
  }

  selfRedDot(num: number, forceScale: number = 0.8) {
    UIButton.setRedDot(this.view, num, forceScale);
  }

  selfRedDotPos(x: number, y: number, force: boolean = false) {
    UIButton.setRedDotPos(this.view, x, y, force);
  }

  selfRedDotCom() {
    return UIButton.getRedDotCom(this.view);
  }

  /**
   * 设置红点
   * @param target
   * @param num
   * @param forceScale
   */
  static setRedDot(
    target: fgui.GComponent,
    num: number,
    forceScale: number = 0.8,
  ) {
    let redPointCom = target.getChild("redPoint");
    if (!redPointCom) {
      redPointCom = FUIHelper.createFUIInstance(EmPackName.Base, "RedPoint");
      redPointCom.name = "redPoint";
      target.addChild(redPointCom);
      redPointCom.addRelation(target, fgui.RelationType.Right_Right);
      redPointCom.addRelation(target, fgui.RelationType.Top_Top);
      redPointCom.x = target.width - redPointCom.width / 2 + 10;
      redPointCom.y = 0 + redPointCom.height / 2;
    }

    redPointCom.visible = num > 0;
    redPointCom.displayObject.active = num > 0;
    if (num < 0) return;

    if (num == 1) {
      redPointCom.text = "";
      redPointCom.setScale(forceScale, forceScale);
    } else {
      redPointCom.text = num > 99 ? "99+" : num.toString();
      redPointCom.setScale(1, 1);
    }
  }

  /**
   * 设置红点位置
   * @param target
   * @param x
   * @param y
   * @param force
   * @returns
   */
  static setRedDotPos(
    target: fgui.GComponent,
    x: number,
    y: number,
    force: boolean = false,
  ) {
    let redPointCom = target.getChild("redPoint");
    if (!redPointCom) return;
    if (force) {
      redPointCom.x = x;
      redPointCom.y = y;
    } else {
      redPointCom.x += x;
      redPointCom.y += y;
    }
  }

  static getRedDotCom(target: fgui.GComponent) {
    return target.getChild("redPoint");
  }

  static hasRedDot(target: fgui.GComponent) {
    let redDot = target.getChild("redPoint");
    return target && redDot && redDot.visible;
  }

  setCommonClickInternal() {
    this.btnInternal = 1000;
  }

  getView(): fgui.GComponent {
    return this._view;
  }

  private setScale(num: number) {
    this._view.scaleX = num;
    this._view.scaleY = num;

    // this._selectedShapeImg.scaleX = num
    // this._selectedShapeImg.scaleY = num

    // this._checkImg.scaleX = num
    // this._checkImg.scaleY = num
  }

  private setFilter(arr: Laya.Filter[]) {
    this._view.filters = arr;
  }

  /**
   *
   * @param target 设置光效
   * @param num
   */
  static setEffect(target: fgui.GComponent, num: number) {
    if (!target || target.isDisposed) return;
    let control = target.getController("effect");
    if (control && control.selectedIndex != num) control.selectedIndex = num;
  }

  static getEffectVisible(target: fgui.GComponent) {
    if (!target || target.isDisposed) return;
    let control = target.getController("effect");
    return control && control.selectedIndex == 1;
  }

  // 兼容
  onClick(thisObj: any, listener: Function, args?: any[]) {
    this.callBack = listener;
    this.thisObj = thisObj;
    this.args = args;
  }

  // 兼容
  offClick(thisObj: any, listener?: Function) {
    this.callBack = null;
    this.thisObj = null;
    this.args = null;
  }

  public addClickEvent() {
    if (!this._view || this._view.isDisposed) return;
    this._view.on(Laya.Event.MOUSE_DOWN, this, this.__mousedown);
    this._view.on(Laya.Event.MOUSE_UP, this, this.__mouseup);
    this._view.on(Laya.Event.MOUSE_OUT, this, this.__mouseout);
  }

  public delClickEvent() {
    if (!this._view || this._view.isDisposed) return;
    this._view.off(Laya.Event.MOUSE_DOWN, this, this.__mousedown);
    this._view.off(Laya.Event.MOUSE_UP, this, this.__mouseup);
    this._view.off(Laya.Event.MOUSE_OUT, this, this.__mouseout);
  }

  /////////////////GButton中的接口 /////////////////
  private _grayed: boolean = false;
  set grayed(grayed: boolean) {
    this._grayed = grayed;
    if (this._view.displayObject) {
      this._view.grayed = grayed;
    }
    this.setLinkedValue({ grayed: grayed });
  }
  get grayed(): boolean {
    return this._grayed;
  }

  private _enabled: boolean = false;
  set enabled(enabled: boolean) {
    this._enabled = enabled;

    if (this._view.isDisposed) return;
    if (this._view.displayObject) {
      this._view.enabled = enabled;
    }

    if (this._view instanceof fgui.GButton) {
      if (enabled) {
        this._view.titleColor = this.defaultTitleColor;
        const titleObject = (this._view as fgui.GButton).getChild(
          "title",
        ) as any;
        if (titleObject && titleObject.strokeColor !== undefined) {
          titleObject.strokeColor = this.defaultStrokeColor;
        }
      } else {
        // 按钮文字和描边直接设置为灰色, 但是能点击
        this._view.titleColor = "#aaaaaa";
        const titleObject = (this._view as fgui.GButton).getChild(
          "title",
        ) as any;
        if (titleObject && titleObject.strokeColor !== undefined) {
          titleObject.strokeColor = "#666666";
        }
      }
    }
    this.setLinkedValue({ enabled: enabled });
  }
  get enabled(): boolean {
    return this._enabled;
  }

  set icon(value: string) {
    this._view.icon = value;
  }

  get icon(): string {
    return this._view.icon;
  }

  set selectedIcon(value: string) {
    if (this._view.hasOwnProperty("selectedIcon")) {
      //@ts-expect-error: selectedIcon is not defined in GObject
      this._view.selectedIcon = value;
    }
  }

  get selectedIcon(): string {
    if (this._view.hasOwnProperty("selectedIcon")) {
      //@ts-expect-error: selectedIcon is not defined in GObject
      return this._view.selectedIcon;
    }
    return "";
  }

  set title(value: string) {
    (this._view as fgui.GButton).title = value;
  }

  get title(): string {
    return (this._view as fgui.GButton).title;
  }

  set visible(value: boolean) {
    if (this._view && !this._view.isDisposed) {
      this._view.visible = value;
      this._view.displayObject.active = value;
    }
    this.setLinkedValue({ visible: value });
  }
  get visible(): boolean {
    if (this._view && !this._view.isDisposed) return this._view.visible;
    return false;
  }

  set x(value: number) {
    this._view.x = value;
    this.setLinkedValue({ x: value });
  }
  get x(): number {
    return this._view.x;
  }
  set y(value: number) {
    this._view.y = value;
    this.setLinkedValue({ y: value });
  }
  get y(): number {
    return this._view.y;
  }
  set scaleX(value: number) {
    this._view.scaleX = value;
    this.setLinkedValue({ scaleX: value });
  }
  get scaleX(): number {
    return this._view.scaleX;
  }
  set scaleY(value: number) {
    this._view.scaleY = value;
    this.setLinkedValue({ scaleY: value });
  }
  get scaleY(): number {
    return this._view.scaleY;
  }
  set width(value: number) {
    this._view.width = value;
  }
  get width(): number {
    return this._view.width;
  }
  set height(value: number) {
    this._view.height = value;
  }
  get height(): number {
    return this._view.height;
  }
  set selected(value: boolean) {
    this._view.asButton.selected = value;
  }
  get selected(): boolean {
    return this._view.asButton.selected;
  }
  set alpha(value: number) {
    this._view.alpha = value;
    this.setLinkedValue({ alpha: value });
  }
  get alpha(): number {
    return this._view.alpha;
  }
  set touchable(value: boolean) {
    this._view.touchable = value;
  }
  get touchable(): boolean {
    return this._view.touchable;
  }
  set rotation(value: number) {
    this._view.rotation = value;
    this.setLinkedValue({ rotation: value });
  }
  get rotation(): number {
    return this._view.rotation;
  }

  private setLinkedValue(obj: any) {
    let visible: boolean = obj.visible;
    let alpha: number = obj.alpha;
    let scaleX: number = obj.scaleX;
    let scaleY: number = obj.scaleY;
    for (let index = 0; index < this.linkedList.length; index++) {
      const element = this.linkedList[index];

      if (visible !== undefined) {
        element.visible = visible;
        element.displayObject.active = visible;
      }
      if (alpha !== undefined) {
        element.alpha = alpha;
      }
      if (scaleX !== undefined) {
        element.scaleX = scaleX;
      }
      if (scaleY !== undefined) {
        element.scaleY = scaleY;
      }
    }
  }

  //////////////////////////////////
  dispose() {
    this.delClickEvent();
    this._view = null;
    this.thisObj = null;
    this.callBack = null;
    this.callBackEx = null;
    this.scaleParas = null;
    this.args = null;
  }
}
