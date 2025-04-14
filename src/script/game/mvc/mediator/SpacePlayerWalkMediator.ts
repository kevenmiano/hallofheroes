import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import AudioManager from "../../../core/audio/AudioManager";
import Logger from "../../../core/logger/Logger";
import { AiEvents, ObjectsEvent } from "../../constant/event/NotificationEvent";
import { PlayerVisualFollow } from "../../constant/PlayerVisualFollow";
import { SoundIds } from "../../constant/SoundIds";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";

import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { PlayerManager } from "../../manager/PlayerManager";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceModel } from "../../map/space/SpaceModel";
import { SpaceSocketOutManager } from "../../map/space/SpaceSocketOutManager";
import { SpaceArmyViewHelper } from "../../map/space/utils/SpaceArmyViewHelper";
import { SpaceMapCameraMediator } from "./SpaceMapCameraMediator";

export class SpacePlayerWalkMediator implements IMediator, IEnterFrame {
  private _target: any;
  private _data: SpaceArmy;
  private _model: SpaceModel;
  private _sendPosRate: number = 0;

  constructor() {}

  public register(target: any) {
    this._target = target;
    this._data = this._target.data;
    this._model = SpaceManager.Instance.model;
    this._target.aiInfo.addEventListener(
      ObjectsEvent.WALK_OVER,
      this.__walkOverHandler.bind(this),
    );
    this._target.aiInfo.addEventListener(
      ObjectsEvent.WALK_NEXT,
      this.__walkNextHandler.bind(this),
    );
    this._target.aiInfo.addEventListener(
      AiEvents.UPDATE_PATHS,
      this.__updatePathHandler.bind(this),
    );
    this._sendPosRate = 7;
    this._walkPath = [];
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  public unregister(target: any) {
    if (this._target && this._target.aiInfo) {
      this._target.aiInfo.removeEventListener(
        AiEvents.UPDATE_PATHS,
        this.__updatePathHandler.bind(this),
      );
      this._target.aiInfo.removeEventListener(
        ObjectsEvent.WALK_OVER,
        this.__walkOverHandler.bind(this),
      );
      this._target.aiInfo.removeEventListener(
        ObjectsEvent.WALK_NEXT,
        this.__walkNextHandler.bind(this),
      );
    }
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this._target = null;
    this._data = null;
    this._model = null;
  }

  private __updatePathHandler(e: AiEvents) {
    if (
      this._target.aiInfo.pathInfo &&
      this._target.aiInfo.pathInfo.length > 0
    ) {
      this._nextPoint = this._target.aiInfo.pathInfo[0];
    } else {
      this._nextPoint = null;
    }
  }

  private _nextPoint: Laya.Point;
  private __walkNextHandler(data: any) {
    var point: Laya.Point = data.point;
    this._nextPoint = new Laya.Point();
    this._nextPoint.x = point.x;
    this._nextPoint.y = point.y;
    this.pushPathStep();
    if (this._walkPath.length >= this._sendPosRate) {
      this.sendPath();
    }
  }

  private pushPathStep() {
    if (!this._nextPoint) return;
    if (this._walkPath.length > 0) {
      var top: Laya.Point = this._walkPath[this._walkPath.length - 1];
      if (top.distance(this._nextPoint.x, this._nextPoint.y) >= 2) {
        Logger.log("break point!!!!!");
        // throw new Error("break point!!!!!");
      }
    }

    if (this._walkPath.length >= 2) {
      var p1: Laya.Point = this._walkPath[this._walkPath.length - 1];
      var p2: Laya.Point = this._walkPath[this._walkPath.length - 2];
      if (
        this.isNeighborPoint(this._nextPoint, p1) &&
        this.isNeighborPoint(this._nextPoint, p2)
      ) {
        this._walkPath.pop();
      }
    }

    this._walkPath.push(this._nextPoint);
    this._nextPoint = null;
  }

  private isNeighborPoint(p1: Laya.Point, p2: Laya.Point): boolean {
    var dx: number = Math.abs(p1.x - p2.x);
    var dy: number = Math.abs(p1.y - p2.y);

    return Boolean(dx <= 1 && dy <= 1);
  }

  private _walkPath: Laya.Point[];
  private sendPath() {
    var str: string = "";
    this._walkPath.forEach((element) => {
      str += element.x + "_" + element.y + ", ";
    });
    if (this._walkPath.length > 0) {
      let vType = PlayerVisualFollow.Type0;
      if (SpaceMapCameraMediator.isLockCamera) {
        vType = PlayerVisualFollow.Type1;
      }
      // Logger.info("天空之城人物移动", this._target.objName, str, vType)
      SpaceSocketOutManager.Instance.move(this._walkPath, vType);
      this._walkPath.length = 0;
    }
  }

  private _count: number = 0;
  public enterFrame() {
    this._count++;
    if (this._count % 12 != 0 || !SpaceManager.Instance.controller) {
      return;
    }
    var nodeInfo: SpaceNode = this._model.getMapNodeById(
      this._model.checkNodeId,
    );
    var selfInfo: SpaceArmy = this._model.selfArmy;
    var selfView: any = SpaceManager.Instance.controller.getArmyView(selfInfo);
    if (nodeInfo && selfView) {
      var star: Laya.Point = new Laya.Point(
        parseInt((selfView.x / 20).toString()),
        parseInt((selfView.y / 20).toString()),
      );
      var end: Laya.Point = new Laya.Point(nodeInfo.posX, nodeInfo.posY);
      var leng: number = star.distance(end.x, end.y);
      if (Math.floor(leng) > nodeInfo.handlerRange * 2) {
        //为了解决"玩家在天空之城移动到特定位置与英灵竞技npc对话, 对话框打开后会自己关闭"
        if (nodeInfo.dialogue) {
          SpaceArmyViewHelper.closeNodeDialog();
        }
        if (nodeInfo.param3) {
          var options: any[] = nodeInfo.param3.split("|");
          var option: any[];
          var type: number = 0;
          for (var i: number = 0; i < options.length; i++) {
            option = options[i].split(",");
            type = parseInt(option[0]);
            SpaceArmyViewHelper.closeNodeFrame(type);
          }
        }
        this._model.checkNodeId = -1;
      }
    }
  }

  private __walkOverHandler(evt: ObjectsEvent) {
    this.pushPathStep();
    this.sendPath();
    this._model.updateWalkTarget(null);
    if (
      this._target.aiInfo.pathInfo &&
      this._target.aiInfo.pathInfo.length > 0
    ) {
      AudioManager.Instance.playSound(SoundIds.CAMPAIGN_WALK_SOUND);
      SpaceArmyViewHelper.selfArmyToEnd(this._target.aiInfo, this._target);
      // TreasureMapManager.Instance.checkReinforce();
    }
  }

  protected get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }
}
