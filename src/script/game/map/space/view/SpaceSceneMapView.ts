//@ts-expect-error: External dependencies
import { SpaceModel } from "../SpaceModel";
import SpaceScene from "../../../scene/SpaceScene";
import SpaceManager from "../SpaceManager";
import SceneType from "../../scene/SceneType";
import {
  CampaignMapEvent,
  SceneViewEvent,
} from "../../../constant/event/NotificationEvent";
import MediatorMananger from "../../../manager/MediatorMananger";
import { LockTargetMediator } from "../../../mvc/mediator/LockTargetMediator";
import { SpaceActivationMovieMediator } from "../../../mvc/mediator/SpaceActivationMovieMediator";
import { SpaceMapCameraMediator } from "../../../mvc/mediator/SpaceMapCameraMediator";
import { SpaceMouseEventMediator } from "../../../mvc/mediator/SpaceMouseEventMediator";
import { SpaceUIMediator } from "../../../mvc/mediator/SpaceUIMediator";
import { MouseData } from "../data/MouseData";
import { SpaceMapViewHelper } from "../utils/SpaceMapViewHelper";
import { SpaceBuildingLayer } from "./layer/SpaceBuildingLayer";
import { SpaceNpcLayer } from "./layer/SpaceNpcLayer";
import { SpaceWalkLayer } from "./layer/SpaceWalkLayer";
import { NotificationManager } from "../../../manager/NotificationManager";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { FreedomTeamFollowMediator } from "../../../mvc/mediator/FreedomTeamFollowMediator";
import { BgLayer } from "../bg/BgLayer";
import { PathManager } from "../../../manager/PathManager";
import ResMgr from "../../../../core/res/ResMgr";
import UIManager from "../../../../core/ui/UIManager";
import { OuterCityStaticLayer } from "../../view/layer/OuterCityStaticLayer";
import SpaceWarlordsLayer from "./layer/SpaceWarlordsLayer";
import {
  ShadowUILayer,
  ShadowUILayerHandler,
} from "../../view/layer/ShadowUILayer";
import {
  AvatarInfoUILayer,
  AvatarInfoUILayerHandler,
  AvatarInfoUIName,
} from "../../view/layer/AvatarInfoUILayer";
import SpacePKMediator from "../../scene/SpacePKMediator";
import SpaceActivationAvatarTranslucenceMediator from "../../../mvc/mediator/SpaceActivationAvatarTranslucenceMediator";
import { SpaceDragMediator } from "../../../mvc/mediator/SpaceDragMediator";

export enum SpaceSceneMapZOrder {
  BlurMask = 0,
  BuildingLayer,
  ShadowUILayer,
  WalkLayer,
  AvatarInfoUILayer,
  SpaceBtnUI,
}

/**
 * 天空之城场景显示
 *
 */
export class SpaceSceneMapView extends Laya.Sprite {
  private _bgLayer: BgLayer;
  private _blurMask: Laya.Sprite;
  private _model: SpaceModel;
  private _controller: SpaceScene;
  private _staticLayer: OuterCityStaticLayer;
  private _footLayer: Laya.Sprite;
  private _walkLayer: SpaceWalkLayer;
  private _avatarInfoUILayer: AvatarInfoUILayer;
  private _buildingLayer: SpaceBuildingLayer;
  private _warlordsLayer: SpaceWarlordsLayer;
  private _shadowUILayer: ShadowUILayer;
  private _npcLayer: SpaceNpcLayer;
  private _lookAtTimeId: any = 0;
  public static NAME: string = "map.space.view.SpaceMapView";
  protected _mediatorKey: string;

  constructor($controller: SpaceScene, $model: SpaceModel) {
    super();
    SpaceManager.Instance.mapView = this;
    this._controller = $controller;
    this._model = $model;
    this.size(10000, 50000);
    this.initView();
    this.addEvent();
  }

  protected registerList() {
    let arr: any[] = [
      SpaceDragMediator,
      SpaceMouseEventMediator,
      SpaceMapCameraMediator,
      FreedomTeamFollowMediator,
      SpaceActivationMovieMediator,
      SpaceUIMediator,
      LockTargetMediator,
      SpacePKMediator,
      SpaceActivationAvatarTranslucenceMediator,
      // ChatBubbleMediator
    ];
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      SpaceSceneMapView.NAME,
    );
  }

  protected initView() {
    this._bgLayer = new BgLayer(
      this,
      this._model.mapTempInfo,
      this._model.floorData,
      true,
    );

    this._blurMask = new Laya.Sprite();
    // this._blurMask.zOrder = SpaceSceneMapZOrder.BlurMask;
    // this.addChild(this._blurMask);
    // this.initBlurMask(this._model.mapId, this._model.mapTempInfo.Width, this._model.mapTempInfo.Height)

    this._buildingLayer = new SpaceBuildingLayer();
    this.addChild(this._buildingLayer);

    this._shadowUILayer = new ShadowUILayer();
    this.addChild(this._shadowUILayer);
    ShadowUILayerHandler.setHandlerView(
      this._shadowUILayer,
      AvatarInfoUIName.SpaceSceneMapView,
    );

    this._walkLayer = new SpaceWalkLayer();
    this.addChild(this._walkLayer);

    this._avatarInfoUILayer = new AvatarInfoUILayer();
    this.addChild(this._avatarInfoUILayer);
    AvatarInfoUILayerHandler.setHandlerView(
      this._avatarInfoUILayer,
      AvatarInfoUIName.SpaceSceneMapView,
    );

    this._controller.buildLayer = this._buildingLayer;
    this._controller.walkLayer = this._walkLayer;
    this._npcLayer = new SpaceNpcLayer(this._walkLayer);
    this._warlordsLayer = new SpaceWarlordsLayer(this._walkLayer);
  }

  private addEvent() {
    this.on(Laya.Event.DISPLAY, this, this.__addToStageHandler);
    Laya.stage.on(Laya.Event.RESIZE, this, this.__stageResizeHandler);
    // NotificationManager.Instance.addEventListener(SceneEvent.BLUR_MASK, this.mBlurMask, this);
  }

  private removeEvent() {
    this.off(Laya.Event.DISPLAY, this, this.__addToStageHandler);
    Laya.stage.off(Laya.Event.RESIZE, this, this.__stageResizeHandler);
    // NotificationManager.Instance.removeEventListener(SceneEvent.BLUR_MASK, this.mBlurMask, this);
  }

  private __addToStageHandler() {
    if (this._walkLayer) {
      this._walkLayer.addToStage();
    }
    this.registerList();
    this.lookAtTarget();
    NotificationManager.Instance.dispatchEvent(
      SceneViewEvent.ADD_TO_STAGE,
      SceneType.SPACE_SCENE,
    );
    // SmallMapBar.Instance.initData(TempleteManager.Instance.mapTemplateCate.getTemplateByID(10000));
  }

  private __stageResizeHandler() {
    if (this._staticLayer) {
      this._staticLayer.resize();
    }
    this.lookAtTarget();
  }

  private lookAtTarget(isAdd: boolean = false) {
    if (this._lookAtTimeId > 0) {
      clearInterval(this._lookAtTimeId);
    }
    this._lookAtTimeId = 0;
    if (!this._model.selfArmy) {
      this._lookAtTimeId = setInterval(this.lookAtTarget.bind(this), 1000);
      return;
    }
    let lookAtRole: any = this._controller.getArmyView(this._model.selfArmy);
    if (!lookAtRole) {
      return;
    }
    if (isAdd) {
      this.moveCenterPoint(
        new Laya.Point(lookAtRole.x, lookAtRole.y),
        0.1,
        false,
      );
    }
    this.event(CampaignMapEvent.LOOK_AT_ROLE, lookAtRole);
  }

  private moveCenterPoint(
    p: Laya.Point,
    dealy: number = 0.6,
    isTween: boolean = true,
  ) {
    MouseData.Instance.curState = MouseData.ON_DRAG;
    p.x = -p.x;
    p.y = -p.y;
    p.x = p.x + this.stage.width / 2;
    p.y = p.y + this.stage.height / 2;
    TweenLite.killTweensOf(this, false);
    let cur: Laya.Point = new Laya.Point(this.x, this.y);
    if (p.distance(cur.x, cur.y) < 20) {
      return;
    }
    if (isTween) {
      TweenLite.to(this, dealy, {
        x: p.x,
        y: p.y,
        onUpdate: this.moveEndCheck,
      });
    } else {
      this.setPosition(p.x, p.y);
    }
  }

  private moveEndCheck() {
    this.setPosition(this.x, this.y);
  }

  private _prePoint: Laya.Point = new Laya.Point();

  public setPosition($x: number, $y: number) {
    this.x = $x;
    this.y = $y;
    if (
      Math.abs((this._prePoint.x - this.x) >> 0) >
        OuterCityStaticLayer.drawOff ||
      Math.abs((this._prePoint.y - this.y) >> 0) > OuterCityStaticLayer.drawOff
    ) {
      this.moveOver(this.x, this.y);
    }
  }

  public moveOver($x: number, $y: number) {
    this._prePoint.x = $x;
    this._prePoint.y = $y;
    if (this._staticLayer && this.stage) {
      let rect: Laya.Rectangle = SpaceMapViewHelper.getCurrentMapRect(this);
      this._controller.moveMapCallBack(rect);
      this._staticLayer.backgroundXandY(-this.x, -this.y);
      this._staticLayer.upDateNextRend();
    }
    this.event(CampaignMapEvent.MOVE_SCENET_END, this);
  }

  private initBlurMask(mapId: number, mapWidth: number, mapHeight: number) {
    let url: string = PathManager.getMapBackPaths(mapId) + "small.jpg";
    ResMgr.Instance.loadRes(url, (content: Laya.Texture) => {
      this._blurMask.texture = content;
      this._blurMask.width = mapWidth;
      this._blurMask.height = mapHeight;
    });
    this._blurMask.visible = false;
  }

  private mBlurMask(data: any) {
    if (!data) {
      return;
    }
    if (UIManager.Instance.isShowingModelWin(data.type)) {
      return;
    }

    if (data.isBlur) {
      this._blurMask.visible = true;
    } else {
      this._blurMask.visible = false;
    }
  }

  set x(value: number) {
    if (super.x == value) {
      return;
    }
    super.x = value;
    // SmallMapBar.Instance.iconContainerX = value / UIConfig.SMALL_MAP_SCALE;
  }

  set y(value: number) {
    if (super.y == value) {
      return;
    }
    super.y = value;
    // SmallMapBar.Instance.iconContainerY = value / UIConfig.SMALL_MAP_SCALE;
  }

  get x(): number {
    return super.x;
  }

  get y(): number {
    return super.y;
  }

  public get npcLayer(): SpaceNpcLayer {
    return this._npcLayer;
  }

  public get buildingLayer(): SpaceBuildingLayer {
    return this._buildingLayer;
  }

  public get walkLayer(): SpaceWalkLayer {
    return this._walkLayer;
  }

  public get footLayer(): Laya.Sprite {
    return this._footLayer;
  }

  public dispose() {
    this.removeEvent();
    TweenLite.killTweensOf(this);
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    if (this._bgLayer) {
      ObjectUtils.disposeObject(this._bgLayer);
    }
    this._bgLayer = null;
    if (this._blurMask) {
      ObjectUtils.disposeObject(this._blurMask);
    }
    if (this._staticLayer) {
      ObjectUtils.disposeObject(this._staticLayer);
    }
    this._staticLayer = null;
    if (this._walkLayer) {
      ObjectUtils.disposeObject(this._walkLayer);
    }
    this._walkLayer = null;
    if (this._footLayer) {
      ObjectUtils.disposeObject(this._footLayer);
    }
    this._footLayer = null;
    if (this._buildingLayer) {
      ObjectUtils.disposeObject(this._buildingLayer);
    }
    this._buildingLayer = null;
    if (this._warlordsLayer) ObjectUtils.disposeObject(this._warlordsLayer);
    this._warlordsLayer = null;
    if (this._shadowUILayer) ObjectUtils.disposeObject(this._shadowUILayer);
    this._shadowUILayer = null;
    if (this._npcLayer) ObjectUtils.disposeObject(this._npcLayer);
    this._npcLayer = null;
    this._controller = null;
    this._model = null;
  }
}
