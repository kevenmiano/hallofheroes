//@ts-expect-error: External dependencies
import Resolution from "../../../../core/comps/Resolution";
import MouseMgr from "../../../../core/Input/MouseMgr";
import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { t_s_buildingtemplateData } from "../../../config/t_s_buildingtemplate";
import { CursorManagerII } from "../../../manager/CursorManagerII";
import NewbieUtils from "../../../module/guide/utils/NewbieUtils";
import BuildingManager from "../BuildingManager";
import { BuildInfo } from "../data/BuildInfo";
import { MasterTypes } from "../data/MasterTypes";
import { BuildingEvent } from "../event/BuildingEvent";
import CastleConfigUtil from "../utils/CastleConfigUtil";
import { TweenDrag } from "../utils/TweenDrag";
import CastleAnimalLayer from "./layer/CastleAnimalLayer";
import CastleBackgroundLayer from "./layer/CastleBackgroundLayer";
import CastleBuildingView from "./layer/CastleBuildingView";
import CastleWalkLayer from "./layer/CastleWalkLayer";
/**
 * 内城地图视图<br/>
 * 对鼠标, 键盘, 创建新建筑, 升级建筑等事件进行了对应的处理<br/>
 *
 */
export class CastleMapViewII extends Laya.Sprite {
  /**
   * 各种屏幕下把此点显示到中心
   */
  public static MAP_SHOW_ANCHOR_POINT: Laya.Point = new Laya.Point(0.5, 0.4);
  /**
   *背景层
   */
  protected _backgroundLayer: CastleBackgroundLayer;
  /**
   * 特效层
   */
  protected _animalLayer: CastleAnimalLayer;
  /**
   * 行走层
   */
  protected _walkLayer: CastleWalkLayer;

  private _mouseDown: boolean;

  private _dragObj: TweenDrag;

  constructor() {
    super();
    this.mouseEnabled = true;
    this.initBackgroundLayer();
    this.initAnimalLayer();
    this.initWalklayer();
    this.size(
      CastleConfigUtil.MAP_SCENE_WIDTH,
      CastleConfigUtil.MAP_SCENE_HEIGHT,
    );
    this.initEvent();
  }

  private initBackgroundLayer() {
    this._backgroundLayer = new CastleBackgroundLayer();
    this.addChild(this._backgroundLayer);
  }

  private initAnimalLayer() {
    this._animalLayer = new CastleAnimalLayer();
    this.addChild(this._animalLayer);
  }

  private initWalklayer() {
    this._walkLayer = new CastleWalkLayer();
    this.addChild(this._walkLayer);
  }

  private initEvent() {
    this._dragObj = new TweenDrag(this, this);
    this._dragObj.onDraging = this.dragingCallBack.bind(this);
    this._dragObj.onDragDrop = this.dropCallBack.bind(this);
    this._dragObj.onTweening = this.dragingCallBack.bind(this);
    BuildingManager.Instance.on(
      BuildingEvent.CREATE_NEW_BUILDING,
      this.__createNewBuildHandler,
      this,
    );
    BuildingManager.Instance.on(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__buildUpgradeHandler,
      this,
    );
  }

  private removeEvent() {
    MouseMgr.Instance.remove(this);
    // this._dragObj.enable = false;
    BuildingManager.Instance.off(
      BuildingEvent.CREATE_NEW_BUILDING,
      this.__createNewBuildHandler,
      this,
    );
    BuildingManager.Instance.off(
      BuildingEvent.BUILDING_UPGRADE_RECEIVE,
      this.__buildUpgradeHandler,
      this,
    );
  }

  resize() {
    // this.addName(this.scaleX);
    this.dragingCallBack();
    this.dropCallBack();
  }

  private addName(value: number) {
    this._walkLayer.buildingsDic.forEach(
      (v: CastleBuildingView, key: number) => {
        v.addChildByScale(value);
      },
    );
  }

  private __buildUpgradeHandler(data: BuildInfo) {
    if (data instanceof BuildInfo) {
      let build: BuildInfo = <BuildInfo>data;
      let btemp: t_s_buildingtemplateData = build.templeteInfo;
      if (
        btemp.MasterType == MasterTypes.MT_INTERNALTECHNOLOGY ||
        btemp.MasterType == MasterTypes.MT_WARTECHNOLOGY
      )
        return;
      this._walkLayer.updateBuildingView(data);
    }
  }

  private __createNewBuildHandler(data: BuildInfo) {
    if (data instanceof BuildInfo) {
      let build: BuildInfo = <BuildInfo>data;
      let btemp: t_s_buildingtemplateData = build.templeteInfo;
      if (
        btemp.MasterType == MasterTypes.MT_INTERNALTECHNOLOGY ||
        btemp.MasterType == MasterTypes.MT_WARTECHNOLOGY
      )
        return;
      this._walkLayer.updateBuildingView(data);
    }
  }

  private dragStart() {
    Laya.timer.clear(this, this.dragStart);
    if (this._mouseDown) this.dragStartCallBack();
  }

  private dragStartCallBack() {
    TweenMax.killTweensOf(this);
    CursorManagerII.Instance.showCursorByType(CursorManagerII.DRAG_CURSOR);
  }

  public dropCallBack() {
    CursorManagerII.Instance.resetCursor();
  }

  public dragingCallBack() {
    if (CastleConfigUtil.MAP_SCENE_WIDTH * this.scaleX < Resolution.gameWidth) {
      this.x = 0;
    } else if (
      this.x <
      Resolution.gameWidth - CastleConfigUtil.MAP_SCENE_WIDTH * this.scaleX
    ) {
      this.x =
        Resolution.gameWidth - CastleConfigUtil.MAP_SCENE_WIDTH * this.scaleX;
    } else if (this.x > 0) {
      this.x = 0;
    }

    if (
      CastleConfigUtil.MAP_SCENE_HEIGHT * this.scaleY <
      Resolution.gameHeight
    ) {
      this.y = 0;
    } else if (
      this.y <
      Resolution.gameHeight - CastleConfigUtil.MAP_SCENE_HEIGHT * this.scaleY
    ) {
      this.y =
        Resolution.gameHeight - CastleConfigUtil.MAP_SCENE_HEIGHT * this.scaleY;
    } else if (this.y > 0) {
      this.y = 0;
    }
  }

  public get buildingsDic(): Map<number, CastleBuildingView> {
    return this._walkLayer.buildingsDic;
  }

  public getBuildingBySonType(sonType: number): CastleBuildingView {
    let view: CastleBuildingView;
    let dic = this._walkLayer.buildingsDic;
    for (let element of dic.values()) {
      if (sonType == element.buildingInfo.templeteInfo.SonType) {
        view = element;
        break;
      }
    }
    return view;
  }

  /**
   * 移动建筑到屏幕中心
   * @param sontype
   * @param isTween
   * @param callback
   * @param callArgs
   */
  public moveBuildToCenter(
    sonType: number,
    isTween: boolean = true,
    tweenTime: number = 500,
    callback?: Function,
    callArgs?: Array<any>,
  ) {
    let pt = CastleConfigUtil.Instance.getBuildPos(sonType);
    if (!pt) {
      Logger.warn("建筑点未配置", sonType);
      NewbieUtils.execFunc(callback, callArgs);
      return;
    }

    let pos = new Laya.Point(pt.x, pt.y);
    // 设计分辨率变大了, 内城背景图未重新设计；采用宽适配模式缩放地图
    if (Laya.Browser.onPC) {
      let scalePosX = pt.x * this.scaleY;
      pos.x = scalePosX;
    } else {
      if (Resolution.scaleFixWidth) {
        let scalePosX = pt.x * Resolution.screenScaleH;
        pos.x = scalePosX;
      }
    }
    let bInfoII: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      Number(sonType),
    );
    let build = this.buildingsDic.get(bInfoII.buildingId) as CastleBuildingView;

    if (build && build.curView) {
      pos.x += build.curView.width / 2;
      pos.y += build.curView.height / 2;
    }

    let toPosX = -(pos.x - Resolution.gameWidth / 2);
    let toPosY = -(pos.y - Resolution.gameHeight / 2);

    if (build.curView) {
      Logger.xjy(
        "[CastleConfigUtil]moveBuildToCenter",
        bInfoII.templeteInfo.BuildingNameLang,
        build.curView.width,
        build.curView.height,
        "pos[" + pos.x + "," + pos.y + "]",
        toPosX,
      );
    }
    this.moveToPos(toPosX, toPosY, isTween, tweenTime, callback, callArgs);
  }

  /**
   * 移动地图到某个位置 不超出屏幕
   * @param x
   * @param y
   * @param isTween
   * @param callback
   * @param callArgs
   */
  public moveToPos(
    x: number = -130,
    y: number = -180,
    isTween: boolean = false,
    tweenTime: number = 500,
    callback?: Function,
    callArgs?: Array<any>,
  ) {
    let posX = x;
    let posY = y;
    if (CastleConfigUtil.MAP_SCENE_WIDTH * this.scaleX < Resolution.gameWidth) {
      posX = 0;
    } else if (
      posX <
      Resolution.gameWidth - CastleConfigUtil.MAP_SCENE_WIDTH * this.scaleX
    ) {
      posX =
        Resolution.gameWidth - CastleConfigUtil.MAP_SCENE_WIDTH * this.scaleX;
    } else if (posX > 0) {
      posX = 0;
    }

    if (CastleConfigUtil.MAP_RAW_HEIGHT * this.scaleY < Resolution.gameHeight) {
      posY = 0;
    } else if (
      posY <
      Resolution.gameHeight - CastleConfigUtil.MAP_RAW_HEIGHT * this.scaleY
    ) {
      posY =
        Resolution.gameHeight - CastleConfigUtil.MAP_RAW_HEIGHT * this.scaleY;
    } else if (posY > 0) {
      posY = 0;
    }

    if (isTween) {
      Laya.Tween.to(
        this,
        { x: posX, y: posY },
        tweenTime,
        null,
        Laya.Handler.create(this, () => {
          NewbieUtils.execFunc(callback, callArgs);
        }),
      );
    } else {
      this.x = posX;
      this.y = posY;
    }
  }

  public getRealWidth() {
    return CastleConfigUtil.MAP_SCENE_WIDTH * this.scaleX;
  }

  public getRealHeight() {
    return CastleConfigUtil.MAP_SCENE_HEIGHT * this.scaleY;
  }

  public dispose() {
    this.removeEvent();
    TweenMax.killTweensOf(this);
    this._dragObj.dispose();
    this._dragObj = null;
    ObjectUtils.disposeObject(this._backgroundLayer);
    this._backgroundLayer = null;
    ObjectUtils.disposeObject(this._animalLayer);
    this._animalLayer = null;
    ObjectUtils.disposeObject(this._walkLayer);
    this._walkLayer = null;
    this._backgroundLayer = null;
    this._animalLayer = null;
    this._walkLayer = null;
    this.removeSelf();
  }
}
