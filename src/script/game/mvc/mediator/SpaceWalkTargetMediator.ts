import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceModel } from "../../map/space/SpaceModel";
import { SpaceSceneMapView } from "../../map/space/view/SpaceSceneMapView";
import Sprite = Laya.Sprite;
import { IMediator } from "@/script/game/interfaces/Mediator";

/**
 *
 * 控制地图上行走目标点
 *
 */
export class SpaceWalkTargetMediator implements IMediator {
  private _target: Sprite;
  private _walkTarget: fgui.GMovieClip;
  private _curLayer: number = 0;
  private static fogUpLayer: number = 1;
  private static npcDownLayer: number = 2;

  constructor() {}

  public register(target: Sprite) {
    this._target = target;
    this._walkTarget = SpaceManager.Instance.controller.walkTarget;
    this.model.addEventListener(
      CampaignMapEvent.UPDATE_WALK_TARGET,
      this.__updateWalkTargetHandler,
      this,
    );
  }

  public unregister(target: Sprite) {
    this.model.removeEventListener(
      CampaignMapEvent.UPDATE_WALK_TARGET,
      this.__updateWalkTargetHandler,
      this,
    );
  }

  private __updateWalkTargetHandler(data: any) {
    var end: Laya.Point = <Laya.Point>data;
    if (end) {
      this._walkTarget.x = end.x;
      this._walkTarget.y = end.y;
      if (this._walkTarget instanceof fgui.GMovieClip) {
        this._target.addChild(this._walkTarget.displayObject);
      }
    } else {
      this._walkTarget.displayObject.removeSelf();
    }
  }

  private get mapView(): SpaceSceneMapView {
    return SpaceManager.Instance.mapView;
  }

  private get model(): SpaceModel {
    return SpaceManager.Instance.model;
  }
}
