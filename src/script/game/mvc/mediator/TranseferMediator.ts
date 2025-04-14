import { DisplayObject } from "../../component/DisplayObject";
import {
  NotificationEvent,
  ServiceReceiveEvent,
} from "../../constant/event/NotificationEvent";
import { BaseCastle } from "../../datas/template/BaseCastle";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { OuterCityModel } from "../../map/outercity/OuterCityModel";
import { MapViewHelper } from "../../map/outercity/utils/MapViewHelper";
import { MapUtils } from "../../map/space/utils/MapUtils";
import { EmWindow } from "../../constant/UIDefine";
import Point = Laya.Point;
import { IMediator } from "@/script/game/interfaces/Mediator";

/**
 * @description    大地图传送逻辑
 * @author yuanzhan.yu
 * @date 2021/11/23 17:22
 * @ver 1.0
 */
export class TranseferMediator implements IMediator {
  private _target: DisplayObject;

  constructor() {}

  public register(target: object): void {
    this._target = <DisplayObject>target;
    PlayerManager.Instance.addEventListener(
      ServiceReceiveEvent.TRANSEFER_CASTLE_SUCCESS,
      this.__transeferHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SWITCH_MAP_TRANSFER,
      this.__switchMapTranseferHandler,
      this,
    );
  }

  public unregister(target: object): void {
    this._target = null;
    PlayerManager.Instance.removeEventListener(
      ServiceReceiveEvent.TRANSEFER_CASTLE_SUCCESS,
      this.__transeferHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SWITCH_MAP_TRANSFER,
      this.__switchMapTranseferHandler,
      this,
    );
  }

  private __switchMapTranseferHandler(evt: NotificationEvent): void {}

  /**
   * 传送成功
   * @param evt
   *
   */
  private __transeferHandler(evt: ServiceReceiveEvent): void {
    let cInfo: BaseCastle =
      PlayerManager.Instance.currentPlayerModel.mapNodeInfo;
    // let movie:fgui.GMovieClip = fgui.UIPackage.createObject(EmWindow.OuterCity, "asset.outercity.TranseferEffAsset").asMovieClip;
    // movie.setPivot(0.5, 0.6, true);
    // this._target.addChild(movie.displayObject);
    // movie.x = cInfo.x;
    // movie.y = cInfo.y;
    let model: OuterCityModel = OuterCityManager.Instance.model;
    let file: string = MapUtils.getFileName(
      model.targetPoint.x,
      model.targetPoint.y,
      1000,
      1000,
    );
    model.upPreNineSliceScaling(file);
    model.targetPoint.x = cInfo.x;
    model.targetPoint.y = cInfo.y;
    let file2: string = MapUtils.getFileName(
      model.targetPoint.x,
      model.targetPoint.y,
      1000,
      1000,
    );
    model.upPreNineSliceScaling(file2);

    let center: Point = MapViewHelper.targetSolveCenter(model.targetPoint);
    this._target.x = center.x;
    this._target.y = center.y;
    OuterCityManager.Instance.mapView.moveEnd();
  }
}
