import { DisplayObject } from "../../component/DisplayObject";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { TweenDrag } from "../../map/castle/utils/TweenDrag";
import { MapViewHelper } from "../../map/outercity/utils/MapViewHelper";
import Point = Laya.Point;
import { OuterCityMapCameraMediator } from "./OuterCityMapCameraMediator";

/**
 * @description    拖拽大地图的缓动逻辑
 * @author yuanzhan.yu
 * @date 2021/11/23 17:22
 * @ver 1.0
 */
export class OuterCityDragMediator implements IMediator {
  private _target: DisplayObject;
  private _dragObj: TweenDrag;

  constructor() {}

  public register(target: object): void {
    this._target = <DisplayObject>target;
    this._dragObj = new TweenDrag(this._target, <DisplayObject>this._target);
    this._dragObj.onDragStart = this.dragStartCallBack.bind(this);
    this._dragObj.onDraging = this.dragingCallBack.bind(this);
    this._dragObj.onDragDrop = this.dropCallBack.bind(this);
    this._dragObj.onTweening = this.dragingCallBack.bind(this);
    this._dragObj.onTweenEnd = this.onTweenEnd.bind(this);
  }

  public unregister(target: object): void {
    if (this._dragObj) {
      this._dragObj.dispose();
    }
    this._dragObj = null;
    this._target = null;
  }

  private dropCallBack(): void {
    if (this._dragTimeId > 0) {
      clearInterval(this._dragTimeId);
    }
    this._dragTimeId = 0;
    OuterCityManager.Instance.mapView.moveEnd();
    this._target.event(OuterCityEvent.DRAG_SCENE_END, this._target);
    if (OuterCityManager.Instance.model.checkOutScene()) {
      OuterCityMapCameraMediator.lockMapCamera();
    }
  }

  private dragingCallBack(): void {
    let p: Point = MapViewHelper.mapMoveCheck(
      new Point(this._target.x, this._target.y),
    );
    this._target.x = p.x;
    this._target.y = p.y;
    if (
      !this._dispatchStartEvent &&
      p.distance(this._startPoint.x, this._startPoint.y) > 20
    ) {
      this.dragSceneImp();
    }
    p = null;
    OuterCityManager.Instance.mapView.onDraging();
  }

  private onTweenEnd(): void {
    this.dropCallBack();
  }

  private _dragTimeId: number = 0;
  private _dispatchStartEvent: boolean = false;
  private _startPoint: Point = new Point();

  private dragStartCallBack(): void {
    OuterCityMapCameraMediator.isLockCamera = true;
    this._dispatchStartEvent = false;
    if (this._dragTimeId > 0) {
      clearInterval(this._dragTimeId);
    }
    this._dragTimeId = 0;
    this._dragTimeId = <number>(
      (<unknown>setInterval(this.dragSceneImp.bind(this), 300))
    );
    this._startPoint.x = this._target.x;
    this._startPoint.y = this._target.y;
  }

  private dragSceneImp(): void {
    TweenLite.killTweensOf(this._target);
    if (this._target) {
      this._target["isMove"] = false;
    }
    this._dispatchStartEvent = true;
    if (this._dragTimeId > 0) {
      clearInterval(this._dragTimeId);
    }
    this._dragTimeId = 0;
    if (this._target) {
      this._target.event(OuterCityEvent.DRAG_SCENE_START, this._target);
    }
  }
}
