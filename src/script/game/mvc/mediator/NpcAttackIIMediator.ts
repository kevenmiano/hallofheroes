import { ArmyState } from "../../constant/ArmyState";
import {
  AiEvents,
  NotificationEvent,
  PhysicsEvent,
} from "../../constant/event/NotificationEvent";
import { NpcEffectiveState } from "../../constant/NpcEffectiveState";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { AiStateType } from "../../map/space/constant/AiStateType";
import { NodeState } from "../../map/space/constant/NodeState";
import Tiles from "../../map/space/constant/Tiles";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { CampaignMapModel } from "../model/CampaignMapModel";
import Logger from "../../../core/logger/Logger";

/**
 * 攻击不追击
 */
export class NpcAttackIIMediator implements IMediator, IEnterFrame {
  private _attackArmy: any;
  private _npc: NpcAvatarView;
  private _handlerRange: number = 0;
  private _mapModel: CampaignMapModel;

  constructor() {}

  public register(target: object) {
    this._npc = <NpcAvatarView>target;
    this._mapModel = CampaignManager.Instance.mapModel;
    let mapId: number = this._mapModel.mapId;
    this._npc.nodeInfo.info.addEventListener(
      PhysicsEvent.UP_STATE,
      this.__stateHandler,
      this,
    );
    this._npc.npcAiInfo.addEventListener(
      AiEvents.MOVE_STATE,
      this.__aiMoveStateHandler,
      this,
    );
  }

  public unregister(target: object) {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this._npc.nodeInfo.info.removeEventListener(
      PhysicsEvent.UP_STATE,
      this.__stateHandler,
      this,
    );
    this._npc.npcAiInfo.removeEventListener(
      AiEvents.MOVE_STATE,
      this.__aiMoveStateHandler,
      this,
    );
    this._mapModel = null;
  }

  private __stateHandler() {
    if (this._npc.nodeInfo.info.state != NodeState.EXIST) {
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
  }

  private __aiMoveStateHandler() {
    if (this._npc.nodeInfo.info.state != NodeState.EXIST) {
      return;
    }
    if (
      this._npc.npcAiInfo.moveState == AiStateType.NPC_RANDOM_MOVE_STATE ||
      this._npc.npcAiInfo.moveState == AiStateType.STAND
    ) {
      this._handlerRange =
        ((<CampaignNode>this._npc.nodeInfo).handlerRange + 1) * Tiles.WIDTH;
      this._handlerRange =
        this._handlerRange > Tiles.WIDTH
          ? this._handlerRange
          : NpcEffectiveState.BATTLE_RADIUS;
      this._attackArmy = this.getArmyView(this.selfArmyId);
      if (this._attackArmy) {
        EnterFrameManager.Instance.registeEnterFrame(this);
      }
    } else {
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
  }

  public enterFrame() {
    if (!this._mapModel || this._mapModel.exit) {
      return;
    }

    let armyPos: Laya.Point = new Laya.Point(
      this._attackArmy.x,
      this._attackArmy.y,
    );
    let attackRect: number = new Laya.Point(this._npc.x, this._npc.y).distance(
      armyPos.x,
      armyPos.y,
    );
    let nodeId: number = (<CampaignNode>this._npc.nodeInfo).nodeId;

    if (this._attackArmy.data.state == ArmyState.STATE_FIGHT) {
      Logger.yyz("部队已进入战斗");
      this._npc.nodeInfo.chatData = null;
      this._attackArmy.aiInfo.pathInfo = [];
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      return;
    }
    if (attackRect < this._handlerRange && this._attackArmy.data.isDie == 0) {
      this._attackArmy.aiInfo.pathInfo = [];
      this._npc.aiInfo.pathInfo = [];
      let mapId: number = this._mapModel.mapId;
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.SEND_CAMPAIGN_ARRIVE,
        null,
      );
      CampaignManager.Instance.controller.sendCampaignArrive(
        this.selfId,
        (<CampaignNode>this._npc.nodeInfo).nodeId,
      );
      Logger.yyz("对 :  " + this.selfId + "发送攻击................");
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      return;
    }
  }

  private getArmyView(id: number): object {
    let aInfo: CampaignArmy = this.getArmyViewByArmyId(id);
    let av: object = CampaignManager.Instance.controller.getArmyView(aInfo);
    if (aInfo) {
      return av;
    }
    return null;
  }

  private getArmyViewByArmyId(id: number): CampaignArmy {
    let serverName: string =
      PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
    return this._mapModel.getBaseArmyByArmyId(id, serverName);
  }

  private get selfArmyId(): number {
    return ArmyManager.Instance.army.id;
  }

  private get selfId(): number {
    return PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
  }
}
