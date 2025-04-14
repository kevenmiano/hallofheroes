import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LayerMgr from "../../core/layer/LayerMgr";
import { EmLayer } from "../../core/ui/ViewInterface";
import { DisplayObject } from "../component/DisplayObject";
import { SkillEvent } from "../constant/event/NotificationEvent";

export class DragType {
  public static CLICK: string = "click";
  public static DOWN: string = "down";
}

/**
 * @author:pzlricky
 * @data: 2021-03-01 11:42
 * @description 拖拽管理器
 */
export default class DragManager extends GameEventDispatcher {
  private _stage: Laya.Stage = Laya.stage;
  private _isDraging: boolean = false;
  private _isMoving: boolean = false;

  private dragMapCall: Map<any, object> = new Map();

  private curTargetObj: any; //当前拖拽对象

  private storeX: number = 0; //原始坐标X
  private storeY: number = 0; //原始坐标Y

  private displayStoreX: number = 0; //显示坐标X
  private displayStoreY: number = 0; //显示坐标Y

  private globalStoreX: number = 0;
  private globalStoreY: number = 0;

  private mouseDownPoint: Laya.Point = null;

  private XTouch: number = 0; //原始坐标X
  private YTouch: number = 0; //原始坐标Y

  private sourceTarget: any; //拖拽原始对象

  private static _instance: DragManager;
  public static get Instance(): DragManager {
    if (!DragManager._instance) {
      this._instance = new DragManager();
    }
    return DragManager._instance;
  }

  constructor() {
    super();
    this.dragMapCall = new Map();
  }

  /**注册拖拽对象 */
  public registerDragObject(dragCom, dragUpCallBack?: Function) {
    if (dragCom["getDragType"] != null) {
      if (this.dragMapCall.has(dragCom)) {
        return;
      }
      //Obj对象的坐标
      this.storeX = dragCom.x;
      this.storeY = dragCom.y;
      this.dragMapCall.set(dragCom, {
        Func: dragUpCallBack,
        parent: dragCom.parent,
        displayParent: dragCom.displayObject.parent,
      });
      dragCom.on(Laya.Event.MOUSE_DOWN, this, this._onClickDragCom);
    }
  }

  /**移除拖拽对象 */
  public removeDragObject(dragCom) {
    if (dragCom) {
      if (!this.dragMapCall.has(dragCom)) {
        return;
      }
      //Obj对象的坐标
      dragCom.off(Laya.Event.MOUSE_DOWN, this, this._onClickDragCom);
      this.dragMapCall.delete(dragCom);
    }
  }

  /**单击选中拖拽对象 */
  private _onClickDragCom(evt: Laya.Event) {
    this._isDraging = true;
    this.sourceTarget = fgui.GObject.cast(evt.target);
    this.sourceTarget.off(Laya.Event.MOUSE_DOWN, this, this._onClickDragCom);
    this.displayStoreX = this.sourceTarget.displayObject.x;
    this.displayStoreY = this.sourceTarget.displayObject.y;
    this.mouseDownPoint = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
    this.addStageEvent();
  }

  /**添加舞台鼠标移动事件 */
  private addStageEvent() {
    this._stage.on(Laya.Event.MOUSE_MOVE, this, this._onDragComMove);
    this._stage.on(Laya.Event.MOUSE_UP, this, this._onDragComMouseUp);
    this._stage.on(Laya.Event.MOUSE_OUT, this, this._onDragComMouseUp);
  }

  /**移除舞台鼠标移动事件 */
  private removeStageEvent() {
    this._stage.off(Laya.Event.MOUSE_MOVE, this, this._onDragComMove);
    this._stage.off(Laya.Event.MOUSE_UP, this, this._onDragComMouseUp);
    this._stage.off(Laya.Event.MOUSE_OUT, this, this._onDragComMouseUp);
  }

  /**鼠标移动 */
  private _onDragComMove(evt: Laya.Event) {
    evt.stopPropagation();
    if (!this._isMoving) {
      this.dispatchEvent(SkillEvent.DRAGING, true);
      this._isMoving = true;
    }
    let distance = this.mouseDownPoint.distance(
      Laya.stage.mouseX,
      Laya.stage.mouseY,
    );
    if (distance < 20) return;
    if (!this.sourceTarget || !this.sourceTarget.displayObject) {
      this.stopDrag();
      return;
    }
    //拷贝对象
    this.curTargetObj = this.sourceTarget;
    this.sourceTarget.displayObject.mouseEnabled = false;
    //想办法记录鼠标移动的记录的坐标
    this.XTouch = evt.stageX;
    this.YTouch = evt.stageY;
    LayerMgr.Instance.addToLayer(
      this.curTargetObj.displayObject,
      EmLayer.STAGE_DRAG_LAYER,
    );
    this.moveToStageXY(evt);
    this.globalStoreX = this.curTargetObj.x;
    this.globalStoreY = this.curTargetObj.y;
  }

  private moveToStageXY(evt: Laya.Event) {
    if (this.curTargetObj) {
      this.curTargetObj.x =
        evt.stageX +
        (this.curTargetObj.pivotX == 0 ? -this.curTargetObj.width / 2 : 0);
      this.curTargetObj.y =
        evt.stageY +
        (this.curTargetObj.pivotY == 0 ? -this.curTargetObj.height / 2 : 0);
    }
  }

  /**鼠标释放 */
  private _onDragComMouseUp(evt: Laya.Event) {
    this._isMoving = false;
    this.dispatchEvent(SkillEvent.DRAGING, false);
    this.sourceTarget.displayObject.mouseEnabled = true;
    let dropTarget: any = fgui.GObject.cast(evt.target);
    if (dropTarget) {
      //处理交换拖拽处理
      let isDropTarget =
        dropTarget["getDragEnable"] && dropTarget["getDragType"];
      if (!isDropTarget) {
        //非拖拽对象或容器
        evt.stopPropagation();
        if (this.curTargetObj) {
          //uncaught error: Tween:target is null
          Laya.Tween.to(
            this.curTargetObj,
            { x: this.globalStoreX, y: this.globalStoreY },
            150,
            Laya.Ease.cubicOut,
            Laya.Handler.create(this, () => {
              Laya.Tween.clearAll(this.curTargetObj);
              this.doDrag(null, this.sourceTarget);
            }),
          );
        }
        return;
      }
      let dragEnable = dropTarget.getDragEnable();
      let dragType = dropTarget.getDragType();
      let sourceDragType = this.sourceTarget.getDragType();
      if (dragType == sourceDragType) {
        this.doDrag(dropTarget, this.sourceTarget);
      } else {
        if (this.curTargetObj) {
          Laya.Tween.to(
            this.curTargetObj,
            { x: this.globalStoreX, y: this.globalStoreY },
            150,
            Laya.Ease.cubicOut,
            Laya.Handler.create(this, () => {
              Laya.Tween.clearAll(this.curTargetObj);
              this.doDrag(null, this.sourceTarget);
            }),
          );
        }
      }
      evt.stopPropagation();
    } else {
      if (this.curTargetObj) {
        Laya.Tween.to(
          this.curTargetObj,
          { x: this.globalStoreX, y: this.globalStoreY },
          150,
          Laya.Ease.cubicOut,
          Laya.Handler.create(this, () => {
            Laya.Tween.clearAll(this.curTargetObj);
            this.doDrag(null, this.sourceTarget);
          }),
        );
      }
      evt.stopPropagation();
    }
  }

  /**处理拖拽交换对象 */
  private doDrag(container, dropTarget) {
    this.stopDrag();
    let dragData: any = this.dragMapCall.get(dropTarget);
    let Func = dragData && dragData.Func;
    Func && Func(container, dropTarget);
  }

  public stopDrag() {
    this._isDraging = false;
    if (this.sourceTarget && this.sourceTarget.displayObject) {
      this.sourceTarget.displayObject.removeSelf();
      let dragData: any = this.dragMapCall.get(this.sourceTarget);
      let targetParent = dragData && dragData.parent;
      targetParent.addChild(this.sourceTarget); //还原至父容器
      if (!this.sourceTarget.displayObject.parent) {
        targetParent.displayObject.addChild(this.sourceTarget.displayObject); //还原至父容器
      }
      this.sourceTarget.x = this.storeX;
      this.sourceTarget.y = this.storeY;
      this.sourceTarget.displayObject.x = this.displayStoreX;
      this.sourceTarget.displayObject.y = this.displayStoreY;
      this.sourceTarget.displayObject.mouseEnabled = true;
      this.sourceTarget.on(Laya.Event.MOUSE_DOWN, this, this._onClickDragCom);
    }
    this.removeStageEvent();
  }

  public get isDraging(): boolean {
    return this._isDraging;
  }
}
