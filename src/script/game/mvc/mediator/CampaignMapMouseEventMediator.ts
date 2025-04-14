import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignMainBuidingLayer } from "../../map/campaign/view/layer/CampaignMainBuidingLayer";
import { CampaignWalkLayer } from "../../map/campaign/view/layer/CampaignWalkLayer";
import { NpcLayer } from "../../map/campaign/view/layer/NpcLayer";
import { CampaignNpcView } from "../../map/campaign/view/physics/CampaignNpcView";
import { PosType } from "../../map/space/constant/PosType";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignMapModel } from "../model/CampaignMapModel";
import Logger from "../../../core/logger/Logger";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { CampaignMapDragMediator } from "./CampaignMapDragMediator";

import Point = Laya.Point;
import { TweenDrag } from "../../map/castle/utils/TweenDrag";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";

/**
 * 副本地图上鼠标事件的逻辑
 *
 */
export class CampaignMapMouseEventMediator implements IMediator {
  private _target: any;
  private _controller: any;
  private _mapModel: CampaignMapModel;
  private _downPos: Point = new Point();
  private _upPos: Point = new Point();
  private _isDown: boolean = false;

  private npcLayer: NpcLayer;
  private mainBuidingLayer: CampaignMainBuidingLayer;
  private walkLayer: CampaignWalkLayer;

  public register(target: any) {
    this._target = target;
    this._controller = CampaignManager.Instance.controller;
    this._mapModel = CampaignManager.Instance.mapModel;
    this.npcLayer = CampaignManager.Instance.mapView.npcLayer;
    this.mainBuidingLayer = CampaignManager.Instance.mapView.mainBuidingLayer;
    this.walkLayer = CampaignManager.Instance.mapView.walkLayer;

    this._target.on(Laya.Event.ROLL_OUT, this, this.__rollOutHandler);
    this._target.on(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler); //此用法在Laya中不会生效
    this._target.on(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
    this._target.on(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler); //此用法在Laya中不会生效
    this._target.on(Laya.Event.CLICK, this, this.__onClickHandler);
    this._target.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    this._target.on(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
  }

  public unregister(target: any) {
    this._target.off(Laya.Event.ROLL_OUT, this, this.__rollOutHandler);
    this._target.off(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler);
    this._target.off(Laya.Event.MOUSE_MOVE, this, this.__mouseMoveHandler);
    this._target.off(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler);
    this._target.off(Laya.Event.CLICK, this, this.__onClickHandler);
    this._target.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    this._target.off(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
  }

  private __mouseDownHandler(evt: Laya.Event) {
    Logger.yyz("💥当前点击的对象mouseDown: ", evt.target);

    if (this.isFGUIButton(evt)) {
      return;
    }

    let mapId: number = this._mapModel.mapId;
    if (WorldBossHelper.checkConsortiaDemon(mapId)) {
      if (evt.target instanceof CampaignNpcView) {
        let target: CampaignNpcView = evt.target;
        if (
          target &&
          target.info &&
          target.info.info.types == PosType.TOWER_DEFENCE
        ) {
          return;
        }
      }
    }
    this._downPos.x = StageReferance.stage.mouseX;
    this._downPos.y = StageReferance.stage.mouseY;

    this._isDown = true;
  }

  private __mouseUpHandler(evt: Laya.Event) {
    this._isDown = false;
  }

  private __onClickHandler(evt: any) {
    Logger.yyz("💥当前点击的对象: ", evt.target);
    PlayerManager.Instance.currentPlayerModel.setAutoWalk(
      PlayerModel.CANCAL_AUTO_WALK,
    );
    PlayerManager.Instance.currentPlayerModel.setWorldBossAutoFight(
      PlayerModel.WORLDBOSS_CANCAL_AUTO_FIGHT,
    );
    if (this.isFGUIButton(evt)) {
      return;
    }

    this._upPos.x = StageReferance.stage.mouseX;
    this._upPos.y = StageReferance.stage.mouseY;
    let leng: number = this._downPos.distance(this._upPos.x, this._upPos.y);

    if (leng < TweenDrag.SlidThreshold) {
      CampaignManager.Instance.mapModel.selectNode = null;
      PlayerManager.Instance.currentPlayerModel.reinforce = null;
      let isBuildingClick = this.mainBuidingLayer.onClickHandler(evt);
      if (!isBuildingClick) {
        this.walkLayer.onClickHandler(evt);
      }
    }
  }

  private __rollOutHandler(evt: Laya.Event) {}

  private __mouseOutHandler(evt: Laya.Event) {
    if (this.isFGUIButton(evt)) {
      return;
    }
    this.mainBuidingLayer.mouseOutHandler(evt);
  }

  private __mouseMoveHandler(evt: Laya.Event) {
    if (this.isFGUIButton(evt)) {
      return;
    }
    this.npcLayer.mouseOverHandler(evt);
  }

  private __mouseOverHandler(evt: Laya.Event) {
    this.mainBuidingLayer.mouseOverHandler(evt);
  }

  private isFGUIButton(evt) {
    if (
      evt &&
      evt.target &&
      fgui.GObject.cast(evt.target) instanceof fgui.GButton
    ) {
      return true;
    }
    return false;
  }
}
