import Logger from "../../../core/logger/Logger";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { MovieClip } from "../../component/MovieClip";
import { ArmyState } from "../../constant/ArmyState";
import {
  AiEvents,
  NotificationEvent,
  PhysicsEvent,
} from "../../constant/event/NotificationEvent";
import { NpcEffectiveState } from "../../constant/NpcEffectiveState";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { BaseArmyAiInfo } from "../../map/ai/BaseArmyAiInfo";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { AiStateType } from "../../map/space/constant/AiStateType";
import { NodeState } from "../../map/space/constant/NodeState";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { SearchPathHelper } from "../../utils/SearchPathHelper";
import { EmPackName } from "../../constant/UIDefine";
import FUIHelper from "../../utils/FUIHelper";
import AudioManager from "../../../core/audio/AudioManager";
import { SoundIds } from "../../constant/SoundIds";

/**
 * 追击并攻击
 * @author
 *
 */
export class NpcAttackAndChaseMediator implements IMediator, IEnterFrame {
  private _npc: NpcAvatarView;
  private _attackArmy: any;
  private _aiInfo: BaseArmyAiInfo;
  private _alertIcon: fgui.GComponent;
  private _attackView: MovieClip;
  private _isFirst: boolean = true;
  private _count: number = 0;
  private _preDis: number = 0;

  constructor() {}

  public register(target: any) {
    this._npc = <NpcAvatarView>target;
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

  public unregister(target: any) {
    this.removeAlertIcon();
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
  }

  private __stateHandler(evt: PhysicsEvent) {
    if (this._npc.nodeInfo.info.state != NodeState.EXIST) {
      if (this._attackArmy) {
        this._attackArmy.aiInfo.removeEventListener(
          AiEvents.UPDATE_PATHS,
          this.__updatePathHandler,
          this,
        );
      }
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
  }

  private __aiMoveStateHandler(evt: AiEvents) {
    if (
      !this._npc ||
      !this._npc.nodeInfo.info ||
      this._npc.nodeInfo.info.state != NodeState.EXIST
    ) {
      Logger.yyz(
        "[NpcAttackAndChaseMediator]__aiMoveStateHandler npc节点或节点信息不存在",
      );
      return;
    }
    Logger.yyz(
      "[NpcAttackAndChaseMediator]__aiMoveStateHandler moveState",
      this._npc.npcAiInfo.moveState,
      this.npcNodeId,
    );
    if (
      CampaignManager.Instance.mapModel &&
      CampaignManager.Instance.mapModel.chckeNpcFriendState(
        <CampaignNode>this._npc.nodeInfo,
      )
    )
      return;
    if (this._npc.npcAiInfo.moveState == AiStateType.NPC_CHASE_STATE) {
      this._attackArmy = this.getArmyView(
        this._npc.npcAiInfo.attackArmyId,
        this._npc.npcAiInfo.attackArmyServerName,
      );
      if (!this._attackArmy) {
        Logger.warn(
          "[NpcAttackAndChaseMediator]__aiMoveStateHandler 找不到攻击对象",
          this.npcNodeId,
        );
        return;
      }

      // Logger.yyz("[NpcAttackAndChaseMediator]__aiMoveStateHandler2 NPC 警戒动画", this.npcNodeId)

      this._aiInfo = this._attackArmy.aiInfo;
      this._aiInfo.addEventListener(
        AiEvents.UPDATE_PATHS,
        this.__updatePathHandler,
        this,
      );
      this._preDis = 10000;
      this.removeAlertIcon();
      this._alertIcon = FUIHelper.createFUIInstance(
        EmPackName.CampaignCommon,
        "CampaignAlertMC",
      );
      this._alertIcon.y =
        this._npc.showNamePosY - this._alertIcon.height / 2 - 28;
      this._alertIcon.x = -this._alertIcon.width / 2;
      this._npc.addChild(this._alertIcon.displayObject);
      if (this._isFirst) {
        AudioManager.Instance.playSound(SoundIds.UNCOVER_ALERT_SOUND);
        this._isFirst = false;
      }
      EnterFrameManager.Instance.registeEnterFrame(this);
    } else {
      this.removeAlertIcon();
      if (this._aiInfo) {
        this._aiInfo.removeEventListener(
          AiEvents.UPDATE_PATHS,
          this.__updatePathHandler,
          this,
        );
      }
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
  }

  private __updatePathHandler(evt: AiEvents) {
    Logger.yyz("[NpcAttackAndChaseMediator]__updatePathHandler 跟随玩家");
    this.searchPath();
    this._count = 1;
  }

  private searchPath() {
    let start: Laya.Point =
      CampaignManager.Instance.mapModel.getAroundWalkPoint(
        this._npc.x,
        this._npc.y,
      );
    if (!start) {
      return;
    }
    let end: Laya.Point = CampaignManager.Instance.mapModel.getAroundWalkPoint(
      this._attackArmy.x,
      this._attackArmy.y,
    );
    if (!end) {
      return;
    }
    // if(ExternalInterface.available && LocalConnectionManager.instance.isUse)
    // {
    //     let para1 : Array = [_npc.x,_npc.y,_attackArmy.x,_attackArmy.y];
    //     LocalConnectionManager.instance.Call("searchPathAngle",para1,searchPathSyc,null);
    // }
    // else
    // {
    let arr: any[] = SearchPathHelper.searchPath(
      new Laya.Point(this._npc.x, this._npc.y),
      new Laya.Point(end.x * 20, end.y * 20),
    );
    if (!arr) {
      return;
    }
    if (arr.length > 2) {
      arr.shift();
    }
    this._npc.aiInfo.pathInfo = arr;
    // }
  }

  private searchPathSyc(arr: any[], para: object) {
    if (!arr && !this._npc && !this._npc.aiInfo) {
      return;
    }
    for (let i: number = 0; i < arr.length; i++) {
      arr[i] = new Laya.Point(arr[i].x, arr[i].y);
    }
    if (arr.length > 2) {
      arr.shift();
    }
    this._npc.aiInfo.pathInfo = arr;
  }

  public enterFrame() {
    let armyPos: Laya.Point = new Laya.Point(
      this._attackArmy.x,
      this._attackArmy.y,
    );
    let dis: number = this._npc.npcAiInfo.centerPoint.distance(
      armyPos.x,
      armyPos.y,
    );
    let attackRect: number = new Laya.Point(this._npc.x, this._npc.y).distance(
      armyPos.x,
      armyPos.y,
    );
    let nodeId: number = (<CampaignNode>this._npc.nodeInfo).nodeId;
    let attackArmy: CampaignArmy = this.getArmyViewByArmyId(
      this._npc.npcAiInfo.attackArmyId,
      this._npc.npcAiInfo.attackArmyServerName,
    );

    if (!attackArmy) {
      Logger.yyz("[NpcAttackAndChaseMediator]未找到攻击对象");
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      return;
    }
    let isSelf: boolean = this.selfId == attackArmy.userId ? true : false;
    if (this._attackArmy.data.state == ArmyState.STATE_FIGHT) {
      Logger.yyz("[NpcAttackAndChaseMediator]部队已进入战斗");
      this._npc.nodeInfo.chatData = null;
      this._aiInfo.pathInfo = [];
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      MapSocketOuterManager.sendAlertState(nodeId, false);
      return;
    }
    if (attackRect < NpcEffectiveState.BATTLE_RADIUS && isSelf) {
      Logger.yyz(
        "[NpcAttackAndChaseMediator]部队开始进入战斗 攻击玩家",
        this.selfId,
      );
      this._aiInfo.pathInfo = [];
      this._npc.aiInfo.pathInfo = [];
      this.startAttack();
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.SEND_CAMPAIGN_ARRIVE,
        null,
      );
      CampaignManager.Instance.controller.sendCampaignArrive(
        this.selfId,
        (<CampaignNode>this._npc.nodeInfo).nodeId,
      );
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      return;
    }

    //魔狼巢穴第一个图 第一个怪
    // if(this.npcNodeId==101102 && isSelf && this._npc.npcAiInfo.moveState == AiStateType.NPC_CHASE_STATE){
    //     Logger.yyz("attackRect",attackRect, "this._count", this._count, "this._preDis", this._preDis, dis)
    // }

    this._count++;
    if (
      (dis > NpcEffectiveState.ATTACK_RADIUS ||
        attackRect > NpcEffectiveState.ALERT_RADIUS + 10) &&
      isSelf
    ) {
      Logger.yyz(
        "[NpcAttackAndChaseMediator]玩家离开攻击范围 dis=",
        dis,
        "attackRect=",
        attackRect,
        "armyPos=",
        armyPos,
        "attackArmy=",
        attackArmy,
      );
      this._npc.nodeInfo.chatData = null;
      MapSocketOuterManager.sendAlertState(nodeId, false);
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      return;
    } else if (
      attackRect > NpcEffectiveState.BATTLE_RADIUS &&
      ((this._count % 5 == 0 && this._preDis < dis) || this._count % 20 == 0)
    ) {
      Logger.yyz(
        "[NpcAttackAndChaseMediator]NPC追击玩家 dis=",
        dis,
        "attackRect=",
        attackRect,
        "armyPos=",
        armyPos,
        "attackArmy=",
        attackArmy,
      );
      this.searchPath();
    }
    this._preDis = dis;
  }

  private getArmyView(id: number, serverName: string = ""): any {
    let aInfo: CampaignArmy = this.getArmyViewByArmyId(id, serverName);
    let av = CampaignManager.Instance.controller.getArmyView(aInfo);
    if (aInfo) {
      return av;
    }
    return null;
  }

  private getArmyViewByArmyId(
    id: number,
    serverName: string = "",
  ): CampaignArmy {
    return CampaignManager.Instance.mapModel.getBaseArmyByArmyId(
      id,
      serverName,
    );
  }

  private get selfId(): number {
    return PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
  }

  private startAttack() {
    // if (!this._attackView) this._attackView = ComponentFactory.Instance.creatCustomObject("asset.campaign.attack.AttackMovieAsset");
    // let sim: SimpleMovie = new SimpleMovie(this._attackView, this.__call);
    // this._attackView.y = -100;
    // this._npc.addChild(sim);
  }

  private __call() {
    if (this._attackView) {
      ObjectUtils.disposeObject(this._attackView);
      this._attackView = null;
    }
  }

  public get npcNodeId() {
    return (<CampaignNode>this._npc.nodeInfo).nodeId;
  }

  private removeAlertIcon() {
    if (this._alertIcon) {
      ObjectUtils.disposeObject(this._alertIcon);
      this._alertIcon = null;
    }
  }
}
