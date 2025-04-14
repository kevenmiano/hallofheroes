/*
 * @Author: jeremy.xu
 * @Date: 2023-01-10 15:11:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-10 17:08:32
 * @Description:
 */

import Resolution from "../../../core/comps/Resolution";
import Logger from "../../../core/logger/Logger";
import { DisplayObject } from "../../component/DisplayObject";
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { PlayerVisualFollow } from "../../constant/PlayerVisualFollow";
// import { MapBoundaryLimit } from "../../datas/map/MapBoundaryLimit";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import { TweenDrag } from "../../map/castle/utils/TweenDrag";
import Tiles from "../../map/space/constant/Tiles";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { MapCameraMediator } from "./MapCameraMediator";

import Point = Laya.Point;
import { MouseData } from "../../map/space/data/MouseData";

export class CampaignMapDragMediator implements IMediator {
  private _target: DisplayObject;
  private _dragObj: TweenDrag;
  private _startPoint: Point = new Point();
  private _endPoint: Point = new Point();

  public register(target: object): void {
    this._target = <DisplayObject>target;
    this._dragObj = new TweenDrag(this._target, <DisplayObject>this._target);
    this._dragObj.onDragStart = this.__dragStartCallBack.bind(this);
    this._dragObj.onDraging = this.__dragingCallBack.bind(this);
    this._dragObj.onDragDrop = this.__dragDropCallBack.bind(this);
    this._dragObj.SlidSpeedFactor = 2 / 3;
  }

  public unregister(target: object): void {
    if (this._dragObj) {
      this._dragObj.dispose();
    }
    this._dragObj = null;
    this._target = null;
  }

  private __dragDropCallBack(): void {
    let mapModel = CampaignManager.Instance.mapModel;
    if (mapModel.checkOutScene()) {
      MapCameraMediator.lockMapCamera();
    }
    this.sendPath();
  }

  private __dragingCallBack(): void {
    let mapModel = CampaignManager.Instance.mapModel;
    if (!mapModel) return;
    let mapTempInfo = mapModel.mapTempInfo;
    if (!mapTempInfo) return;

    let target = this._target;
    let mapWidth = mapTempInfo.Width;
    let mapHeight = mapTempInfo.Height;

    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;
    // let mapDic = MapBoundaryLimit.mapDic[mapTempInfo.CampaignId]
    // if (mapDic) {
    //     top = mapDic.top ? mapDic.top : 0
    //     bottom = mapDic.bottom ? mapDic.bottom : 0
    //     left = mapDic.left ? mapDic.left : 0
    //     right = mapDic.right ? mapDic.right : 0
    // }

    if (mapWidth * target.scaleX < Resolution.gameWidth) {
      target.x = left + 0;
    } else if (target.x < Resolution.gameWidth - mapWidth * target.scaleX) {
      target.x = right + Resolution.gameWidth - mapWidth * target.scaleX;
    } else if (target.x > 0) {
      target.x = left + 0;
    }

    if (mapHeight * target.scaleY < Resolution.gameHeight) {
      target.y = top + 0;
    } else if (target.y < Resolution.gameHeight - mapHeight * target.scaleY) {
      target.y = bottom + Resolution.gameHeight - mapHeight * target.scaleY;
    } else if (target.y > 0) {
      target.y = top + 0;
    }

    // 距离检查
    this._endPoint.x = target.x;
    this._endPoint.y = target.y;
    if (
      this._endPoint.distance(this._startPoint.x, this._startPoint.y) >
      this.checkDistance
    ) {
      this._startPoint.x = this._endPoint.x;
      this._startPoint.y = this._endPoint.y;
      this.dragingSceneImp();
    }
  }

  private __dragStartCallBack(): void {
    // MapCameraMediator.lockMapCamera();
    MapCameraMediator.isLockCamera = true;
    MouseData.Instance.curState = MouseData.LOCK;
    this._startPoint.x = this._target.x;
    this._startPoint.y = this._target.y;
  }

  private dragingSceneImp(): void {
    (this._target as CampaignMapView).event(
      CampaignMapEvent.MOVE_SCENET_END,
      this._target,
    );
  }

  private _walkPath: Laya.Point[] = [];
  private sendPath() {
    this._walkPath = [];
    let centerX: number = Math.abs(
      StageReferance.stageWidth / 2 - this._target.x,
    );
    let centerY: number = Math.abs(
      StageReferance.stageHeight / 2 - this._target.y,
    );
    let centerTilePos = this.getTilePos(centerX, centerY);
    this._walkPath.push(centerTilePos);
    // Logger.info("副本屏幕拖动", centerTilePos)

    let army = CampaignManager.Instance.mapModel.selfMemberData;
    if (army) {
      MapSocketOuterManager.sendCampaignArmyMove(
        army.id,
        this._walkPath,
        army.mapId,
        PlayerVisualFollow.Type2,
      );
    }
  }

  /**
   * 转换当前坐标为格子坐标
   */
  public getTilePos(x: number, y: number): Laya.Point {
    return new Laya.Point(
      parseInt((x / Tiles.WIDTH).toString()),
      parseInt((y / Tiles.HEIGHT).toString()),
    );
  }

  private get checkDistance(): number {
    let mapModel = CampaignManager.Instance.mapModel;
    if (!mapModel) return;
    let mapTempInfo = mapModel.mapTempInfo;
    if (!mapTempInfo) return;

    switch (mapTempInfo.CampaignId) {
      case 7501: // 公会秘境
        return 10;
    }
    return 120;
  }
}
