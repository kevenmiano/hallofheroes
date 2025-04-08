// @ts-nocheck
import { AiEvents } from "../../constant/event/NotificationEvent";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { HumanAvatar } from "../../map/avatar/view/HumanAvatar";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { MineralArmyView } from "../../map/campaign/view/physics/MineralArmyView";
import MineralCarView from "../../map/campaign/view/physics/MineralCarView";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { PvpWarFightArmyView } from "../../map/campaign/view/physics/PvpWarFightArmyView";
import { AiStateType } from "../../map/space/constant/AiStateType";
import { SpeedEnumerate } from "../../map/space/constant/SpeedEnumerate";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { WorldBossHelper } from "../../utils/WorldBossHelper";

/**
 *  
 * 控制npc的状态及动画播放速度
 * 
 */
export class NpcStateMediator implements IMediator {
	private _npc: NpcAvatarView;
	constructor() {
	}

	public register(target: Object) {
		this._npc = <NpcAvatarView>target;
		this._npc.npcAiInfo.addEventListener(AiEvents.MOVE_STATE, this.__moveStateHandler, this);
		this.__moveStateHandler(null);
	}

	public unregister(target: Object) {
		this._npc.npcAiInfo.removeEventListener(AiEvents.MOVE_STATE, this.__moveStateHandler, this);

	}
	private __moveStateHandler(evt: AiEvents) {
		if (this._npc.npcAiInfo.moveState == AiStateType.NPC_CHASE_STATE) {
			this._npc.npcAiInfo.speed = SpeedEnumerate.NPC_CHASE_SPEED;
			(<HumanAvatar>this._npc.avatarView).stepFrame = 2;

		}
		else if (this._npc.npcAiInfo.moveState == AiStateType.NPC_RANDOM_MOVE_STATE) {
			this._npc.npcAiInfo.speed = SpeedEnumerate.NPC_RANDOM_MOVE_SPEED;
			(<HumanAvatar>this._npc.avatarView).stepFrame = 2;
		}
		else if (this._npc.npcAiInfo.moveState == AiStateType.STAND) {
			this._npc.npcAiInfo.nextPoint = new Laya.Point(this._npc.x, this._npc.y);
			(<HumanAvatar>this._npc.avatarView).stepFrame = 5;
			return;
		}
		else if (this._npc.npcAiInfo.moveState == AiStateType.NPC_FOLLOW_STATE) {
			var armyView: any;
			var mapId: number = CampaignManager.Instance.mapModel.mapId;
			if (WorldBossHelper.checkPvp(mapId)) {
				if (this._npc.nodeInfo instanceof CampaignNode) {
					var node: CampaignNode = <CampaignNode>this._npc.nodeInfo;
					var followId: number = node.followTarget;
					var target: CampaignArmy = CampaignManager.Instance.mapModel.getBaseArmyByArmyId(followId);
					armyView = CampaignManager.Instance.controller.getArmyView(target);
					if (target && armyView && armyView instanceof PvpWarFightArmyView) {
						armyView.changeSpeedTo(.5);
						this._npc.npcAiInfo.speed = armyView.info.speed;
					} else {
						this._npc.npcAiInfo.speed = CampaignArmyView.HALF_SPEED;
					}
				} else {
					this._npc.npcAiInfo.speed = CampaignArmyView.HALF_SPEED;
				}
			} else if ((WorldBossHelper.checkMineral(mapId))) {
				if (this._npc.nodeInfo instanceof CampaignNode) {
					var node1: CampaignNode = <CampaignNode>this._npc.nodeInfo;
					var followId1: number = node1.followTarget;
					var target1: CampaignArmy = CampaignManager.Instance.mapModel.getBaseArmyByArmyId(followId1);
					armyView = CampaignManager.Instance.controller.getArmyView(target1);
					if (this.inMineralAndHasMinerals) armyView.changeSpeedTo(.5);
					this._npc.npcAiInfo.speed = armyView.info.speed;
				} else {
					this._npc.npcAiInfo.speed = CampaignArmyView.HALF_SPEED;
				}
			}
			(<HumanAvatar>this._npc.avatarView).stepFrame = 3;
		}
	}
	private get inMineralAndHasMinerals(): boolean {
		var node: CampaignNode = <CampaignNode>this._npc.nodeInfo;
		var followId: number = node.followTarget;
		var target: CampaignArmy = CampaignManager.Instance.mapModel.getBaseArmyByArmyId(followId);
		var armyView: Object = CampaignManager.Instance.controller.getArmyView(target);
		if (this._npc instanceof MineralCarView && target && armyView instanceof MineralArmyView) {
			if ((<MineralCarView>this._npc).cadInfo && (<MineralCarView>this._npc).cadInfo.minerals > 0) {
				return true;
			}
		}
		return false;
	}
}