import { DisplayObject } from "../../component/DisplayObject";
import { IMediator } from "@/script/game/interfaces/Mediator";
import KeyBoardRegister from "../../keyboard/KeyBoardRegister";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { OuterCityMap } from "../../map/outercity/OuterCityMap";
import { MapViewHelper } from "../../map/outercity/utils/MapViewHelper";
import Point = Laya.Point;

/**
 * @description    拖拽大地图的缓动逻辑
 * @author yuanzhan.yu
 * @date 2021/11/23 17:22
 * @ver 1.0
 */
export class OuterCityMapDirectionKeyMediator implements IMediator {
  private _target: DisplayObject;

  constructor() {}

  public register(target: object): void {
    this._target = <DisplayObject>target;
    KeyBoardRegister.Instance.registerMapKey(
      this.__leftMove,
      this.__rightMove,
      this.__topMove,
      this.__downMove,
    );
  }

  public unregister(target: object): void {
    KeyBoardRegister.Instance.removeMapKey(
      this.__leftMove,
      this.__rightMove,
      this.__topMove,
      this.__downMove,
    );
    this._target = null;
  }

  private __leftMove(): void {
    this._target.x += 50;
    // PhysicsMenu.getInstance().close();
    this.dragingCallBack();
    OuterCityManager.Instance.mapView.moveEnd();
  }

  private __rightMove(): void {
    this._target.x -= 50;
    this.dragingCallBack();
    // PhysicsMenu.getInstance().close();
    OuterCityManager.Instance.mapView.moveEnd();
  }

  private __topMove(): void {
    this._target.y += 50;
    // PhysicsMenu.getInstance().close();
    this.dragingCallBack();
    OuterCityManager.Instance.mapView.moveEnd();
  }

  private __downMove(): void {
    this._target.y -= 50;
    // PhysicsMenu.getInstance().close();
    this.dragingCallBack();
    OuterCityManager.Instance.mapView.moveEnd();
  }

  private dragingCallBack(): void {
    let p: Point = MapViewHelper.mapMoveCheck(
      new Point(this._target.x, this._target.y),
    );
    this._target.x = p.x;
    this._target.y = p.y;
    p = null;
  }

  private get mapView(): OuterCityMap {
    return OuterCityManager.Instance.mapView;
  }
}
