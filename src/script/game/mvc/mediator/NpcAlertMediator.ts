import Logger from "../../../core/logger/Logger";
import { AiEvents } from "../../constant/event/NotificationEvent";
import { NpcEffectiveState } from "../../constant/NpcEffectiveState";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { AiStateType } from "../../map/space/constant/AiStateType";
import { NodeState } from "../../map/space/constant/NodeState";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { CampaignMapModel } from "../model/CampaignMapModel";
// import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
// import { CampaignNpcView } from "../../map/campaign/view/physics/CampaignNpcView";

/**
 *  NPC警戒逻辑 <br/>
 *  当人进入npc的警戒范围, 向服务器发送消息
 */
export class NpcAlertMediator implements IEnterFrame, IMediator {
  private _npc: NpcAvatarView;
  private _mapModel: CampaignMapModel;

  constructor() {}
  private _npcPoint: Laya.Point = new Laya.Point();
  private _armyPoint: Laya.Point = new Laya.Point();
  public enterFrame() {
    let controller = CampaignManager.Instance.controller;
    if (!controller) {
      Logger.yyz("[NpcAlertMediator]controller 不存在");
      return;
    }
    if (!this._mapModel || this._mapModel.exit) {
      Logger.yyz("[NpcAlertMediator]_mapModel 不存在");
      return;
    }
    if (!this._mapModel.selfMemberData) {
      Logger.yyz("[NpcAlertMediator]selfMemberData 不存在");
      return;
    }
    var selfArmy: any = controller.getArmyView(this._mapModel.selfMemberData);
    if (!selfArmy) {
      Logger.yyz("[NpcAlertMediator]selfArmy 视图不存在");
      return;
    }
    if (selfArmy.data.state == NodeState.FIGHTING) {
      Logger.yyz("[NpcAlertMediator]selfArmy 正在战斗中");
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      return;
    }
    this._npcPoint.x = this._npc.x;
    this._npcPoint.y = this._npc.y;
    this._armyPoint.x = selfArmy.x;
    this._armyPoint.y = selfArmy.y;
    var dis: number = this._npc.npcAiInfo.centerPoint.distance(
      this._armyPoint.x,
      this._armyPoint.y,
    );
    if (dis > NpcEffectiveState.ATTACK_RADIUS - 20) {
      // Logger.yyz("[NpcAlertMediator]与玩家的距离太远", dis, this.npcNodeId)
      return;
    }
    var leng: number = this._npcPoint.distance(
      this._armyPoint.x,
      this._armyPoint.y,
    );
    if (
      leng > NpcEffectiveState.BATTLE_RADIUS &&
      leng < NpcEffectiveState.ALERT_RADIUS
    ) {
      Logger.yyz(
        "[NpcAlertMediator]玩家到达警戒区域 发送警戒消息",
        dis,
        this.npcNodeId,
      );
      //todo不能让其的攻击路线长过400
      var nodeId: number = (<CampaignNode>this._npc.nodeInfo).nodeId;
      this._npc.aiInfo.pathInfo = [];
      MapSocketOuterManager.sendAlertState(nodeId, true);
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
  }

  public register(target: object) {
    this._mapModel = CampaignManager.Instance.mapModel;
    this._npc = <NpcAvatarView>target;
    if (this._npc && (<CampaignNode>this._npc.nodeInfo).attackTypes == 1) {
      this._npc.npcAiInfo.addEventListener(
        AiEvents.MOVE_STATE,
        this.__moveStateHandler,
        this,
      );
      this.__moveStateHandler(null);
    }
  }

  public unregister(target: object) {
    this._npc.npcAiInfo.removeEventListener(
      AiEvents.MOVE_STATE,
      this.__moveStateHandler,
      this,
    );
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this._mapModel = null;
  }
  private __moveStateHandler(evt: AiEvents) {
    if (this._npc.nodeInfo.info.state != NodeState.EXIST) return;
    if (this._npc.npcAiInfo.moveState == AiStateType.NPC_CHASE_STATE) {
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    } else if (
      this._npc.npcAiInfo.moveState == AiStateType.NPC_RANDOM_MOVE_STATE
    ) {
      if (this._mapModel.chckeNpcFriendState(<CampaignNode>this._npc.nodeInfo))
        return;
      EnterFrameManager.Instance.registeEnterFrame(this);
    } else if (this._npc.npcAiInfo.moveState == AiStateType.STAND) {
      if (this._mapModel.chckeNpcFriendState(<CampaignNode>this._npc.nodeInfo))
        return;
      EnterFrameManager.Instance.registeEnterFrame(this);
    } else {
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
  }

  public get npcNodeId() {
    return (<CampaignNode>this._npc.nodeInfo).nodeId;
  }
}
