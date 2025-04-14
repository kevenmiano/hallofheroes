import GameEventDispatcher from "../../event/GameEventDispatcher";
import { IView } from "../ViewInterface";
import {
  UICFG,
  EnUIShowType,
  EnUIHideType,
  EmWindow,
} from "../../../game/constant/UIDefine";
import Resolution from "../../comps/Resolution";
/**
 * @author:pzlricky
 * @email:346970513@qq.com
 * @data: 2020-11-04 16:28
 * UI基类
 */
export default class BaseUI extends GameEventDispatcher implements IView {
  protected background: fgui.GComponent; //背景节点

  protected _view: fgui.GComponent;

  protected _viewArgs: any;

  protected _viewCfg: UICFG = null;

  //是否加载完成
  protected _isLoad: boolean = false; //

  protected get Args(): any {
    return this._viewArgs;
  }

  /**
   * 绑定视图
   * @param view 视图节点
   * @param args 传递参数
   * @param layerInfo
   */
  bind(view: fgui.GComponent, args: any, viewCfg: UICFG) {
    this._view = view;
    this._viewArgs = args;
    this._viewCfg = viewCfg;
    this.onRegister(this._view);
    this.onFixBackground();
  }

  /**
   * 适配背景节点
   */
  onFixBackground() {
    //背景缩放
    let sprite = this.background;
    sprite.scaleX = Resolution.newHRatio;
    sprite.scaleY = Resolution.newHRatio;
  }

  /**
   * 添加至舞台
   */
  onAddToStage() {}

  /**
   * 从舞台移除
   */
  onRemoveFromStage() {}

  /**
   * 注册界面内组件
   * @param wnd
   */
  protected onRegister(wnd: fgui.GComponent) {
    let count = wnd.numChildren;
    let index = 0;
    for (index = 0; index < count; index++) {
      let subItem: fgui.GComponent = wnd.getChildAt(index).asCom;
      let subItemName = subItem.name;
      this[subItemName] = subItem;
      this.onRegister(subItem);
    }
  }

  setVisible(f: boolean) {
    if (this._view) {
      this._view.visible = f;
      this._view.displayObject.active = f;
    }
  }

  setOrder(order: number) {
    if (this._view) {
      this._view.parent.setChildIndex(this._view, order);
    }
  }

  getUIType(): EmWindow {
    return this._viewCfg.Type;
  }

  //获取视图节点
  getNode(): fgui.GComponent {
    return this._view;
  }

  //是否加载完成
  isLoad(): boolean {
    return this._isLoad;
  }

  setLoaded(value: boolean) {
    this._isLoad = value;
  }

  //所处层级
  getLayer(): any {}

  setLayer(v: any) {}

  getUICfg(): UICFG {
    return this._viewCfg;
  }

  protected CustomShowAction(caller: any, callback: () => void) {
    callback.call(caller);
  }

  protected CustomHideAction(caller: any, callback: () => void) {
    callback.call(caller);
  }

  resize() {}

  exit() {
    this.hideEffect();
  }

  /**场景,UI有些效果需要自己实现 */
  showEffect() {
    let uicfg = this._viewCfg;
    let showType = uicfg.EffectShow;
    switch (showType) {
      case EnUIShowType.NONE:
        this.CustomShowAction(this, () => {
          this.onAddToStage();
        });
        break;
      case EnUIShowType.POPUP: //需设置界面锚点为中心点 缩放特效,初始尺寸为0.3
        this._view.scaleX = 0.3;
        this._view.scaleY = 0.3;
        Laya.Tween.to(this._view, { scaleX: 1.2, scaleY: 1.2 }, 50);
        Laya.Tween.to(
          this._view,
          { scaleX: 1, scaleY: 1 },
          100,
          undefined,
          Laya.Handler.create(this, () => {
            this.onAddToStage();
          }),
          100,
        );
        break;
      case EnUIShowType.FROM_TOP: //
        this._view.y = -360;
        let targetY = this._view.y + 360;
        Laya.Tween.to(this._view, { y: targetY }, 250).to(
          this._view,
          { y: 0 },
          180,
          undefined,
          Laya.Handler.create(this, () => {
            this.onAddToStage();
          }),
        );
        break;
      case EnUIShowType.FADEIN: //透明度变化 由0-1
        this._view.alpha = 0;
        Laya.Tween.to(
          this._view,
          { alpha: 1 },
          250,
          undefined,
          Laya.Handler.create(this, () => {
            this.onAddToStage();
          }),
        );
        break;
      default:
        this.CustomShowAction(this, () => {
          this.onAddToStage();
        });
        break;
    }
  }

  /**界面关闭效果 */
  hideEffect() {
    let uicfg = this._viewCfg;
    let showType = uicfg.EffectHide;
    let callFunc = () => {
      this._view.dispose();
      this.onRemoveFromStage();
    };
    switch (showType) {
      case EnUIHideType.NONE:
        this.CustomShowAction(this, () => {
          callFunc();
        });
        break;
      case EnUIHideType.POP: //需设置界面锚点为中心点 缩放特效,初始尺寸为0.3
        this._view.scaleX = 1;
        this._view.scaleY = 1;
        this._view.pivotX = 0.5;
        this._view.pivotY = 0.5;
        Laya.Tween.to(this._view, { scaleX: 1.1, scaleY: 1.1 }, 50);
        Laya.Tween.to(
          this._view,
          { scaleX: 0, scaleY: 0 },
          100,
          undefined,
          Laya.Handler.create(this, () => {
            callFunc();
          }),
          100,
        );
        break;
      case EnUIHideType.TO_TOP: //回顶部
        let targetY = this._view.y - 1000;
        Laya.Tween.to(this._view, { y: targetY }, 250).to(
          this._view,
          { y: 0 },
          180,
          undefined,
          Laya.Handler.create(this, () => {
            callFunc();
          }),
        );
        break;
      case EnUIHideType.FADEOUT: //透明度变化 由0-1
        this._view.alpha = 1;
        Laya.Tween.to(
          this._view,
          { alpha: 0 },
          250,
          undefined,
          Laya.Handler.create(this, () => {
            callFunc();
          }),
        );
        break;
      default:
        this.CustomShowAction(this, () => {
          callFunc();
        });
        break;
    }
  }
}
