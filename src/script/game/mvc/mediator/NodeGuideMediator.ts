// @ts-nocheck
import { DisplayObject } from "../../component/DisplayObject";
import { MovieClip } from "../../component/MovieClip";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { GameBaseQueueManager } from "../../manager/GameBaseQueueManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { HeroAvatarViewHelper } from "../../utils/HeroAvatarViewHelper";
import { CampaignMapScene } from "../../scene/CampaignMapScene";
import { CampaignMapModel } from "../model/CampaignMapModel";
import FUIHelper from "../../utils/FUIHelper";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import StringHelper from "../../../core/utils/StringHelper";

/**
 * 副本自动寻路 
 * 依照节点 从起始节点开始寻找
 * 
 */
export class NodeGuideMediator implements IMediator, IEnterFrame {
	public static CheckTime = 1;
	private _count: number = 0;
	private _arrow: fgui.GMovieClip;
	private _aInfo: CampaignArmy;
	private _aView: any;

	constructor() {
		this.createGuideArrow()
	}

	public register(target: Object) {
		EnterFrameManager.Instance.registeEnterFrame(this);
		NotificationManager.Instance.addEventListener(NotificationEvent.SEND_CAMPAIGN_ARRIVE, this.__resetTimeHandler, this);
		NotificationManager.Instance.addEventListener(NotificationEvent.CAMPAIGN_GUIDE, this.__campaignGuideHandler, this);
		NotificationManager.Instance.addEventListener(NotificationEvent.WORK_NEXT_NODE, this.__walkNextNodeHandler, this);
	}

	public unregister(target: Object) {
		EnterFrameManager.Instance.unRegisteEnterFrame(this);
		NotificationManager.Instance.removeEventListener(NotificationEvent.SEND_CAMPAIGN_ARRIVE, this.__resetTimeHandler, this);
		NotificationManager.Instance.removeEventListener(NotificationEvent.CAMPAIGN_GUIDE, this.__campaignGuideHandler, this);
		NotificationManager.Instance.removeEventListener(NotificationEvent.WORK_NEXT_NODE, this.__walkNextNodeHandler, this);

		this.removeGuideArrow()
		this._aInfo = null;
		this._aView = null;
	}

	private createGuideArrow() {
		if (!this._arrow) {
			this._arrow = FUIHelper.createFUIInstance(EmPackName.CampaignCommon, "GuideMC");
		}
	}
	private removeGuideArrow() {
		if (this._arrow) {
			ObjectUtils.disposeObject(this._arrow)
			this._arrow = null;
		}
	}

	private walkNextNodeHandler() {
		var nextNode: CampaignNode = CampaignManager.Instance.mapModel.getToAttackNode();
		if (!nextNode) {
			let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
			if (mapModel && WorldBossHelper.single(mapModel.mapId)
				&& PlayerManager.Instance.currentPlayerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
				let campaignNodeArr: Array<CampaignNode> = CampaignManager.Instance.mapModel.getCrossMapTransportNode();//所有的传送点
				for (let i: number = 0; i < campaignNodeArr.length; i++) {
					let node: CampaignNode = campaignNodeArr[i];
					if (node && StringHelper.isNullOrEmpty(node.nextNodeIds)) {
						nextNode = node;
						break;
					}
				}
			}
		}
		if (!nextNode) nextNode = CampaignManager.Instance.mapModel.mapNodeEndPoint;
		if (nextNode) {
			this._aInfo = CampaignManager.Instance.mapModel.selfMemberData;
			if (!this._aInfo) return;
			var vNode: DisplayObject = CampaignManager.Instance.mapView.getNpcNodeById(nextNode.info.id);
			CampaignManager.Instance.mapModel.selectNode = nextNode;
			(<CampaignMapScene>CampaignManager.Instance.controller).moveArmyByPos(vNode.x, vNode.y, true, true);
		}
	}

	private checkNodeGuide() {
		var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		var nextNode: CampaignNode = (mapModel ? mapModel.getToAttackNode() : null);
		if (nextNode) {
			this._aInfo = CampaignManager.Instance.mapModel.selfMemberData;
			if (!this._aInfo) return;
			this._aView = CampaignManager.Instance.controller.getArmyView(this._aInfo);
			if (!this._aView) return;

			var vNode: DisplayObject = CampaignManager.Instance.mapModel.getNodeById(nextNode.info.id);
			if (vNode) {
				var leng: number = new Laya.Point(this._aView.x, this._aView.y).distance(vNode.x, vNode.y);
				var fog: boolean = true;
				if (CampaignManager.Instance.mapView.fogLayer) {
					fog = CampaignManager.Instance.mapView.fogLayer.checkFogEmpty(vNode.x, vNode.y);
				}
				if (((vNode['isPlaying'] && !fog) || leng < 320)) {
					// this.removeGuideArrow();
					return;
				}
				var angle: number = HeroAvatarViewHelper.twoPointAngle(vNode.x, vNode.y, this._aView.x, this._aView.y);
				this.createGuideArrow();
				if (this._arrow) {
					if (!this._arrow.parent) this._aView.addChildAt(this._arrow.displayObject, 0);
					this._arrow.rotation = angle;
				}
			}
		}
	}
	private updateAngle() {
		if (!this._arrow || !this._arrow.parent) return;
		var nextNode: CampaignNode = CampaignManager.Instance.mapModel.getToAttackNode();
		if (nextNode) {
			var vNode: DisplayObject = CampaignManager.Instance.mapView.getNpcNodeById(nextNode.info.id);
			var angle: number = HeroAvatarViewHelper.twoPointAngle(vNode.x, vNode.y, this._aView.x, this._aView.y);
			this._arrow.rotation = angle;
		}
	}

	private __resetTimeHandler(evt: Event) {
		this._count = 0;
		this.removeGuideArrow()
	}

	private __campaignGuideHandler(evt: Event) {
		this._count = NodeGuideMediator.CheckTime;
		this.checkNodeGuide();
	}

	private __walkNextNodeHandler(evt: Event) {
		this._count = NodeGuideMediator.CheckTime;
		this.walkNextNodeHandler();
	}

	public enterFrame() {
		if (GameBaseQueueManager.Instance.actionsLength > 0) {
			this.__resetTimeHandler(null);
			return;
		}

		this._count++;
		if (this._count > NodeGuideMediator.CheckTime) {
			if (this._count % 10 == 0) {
				this.checkNodeGuide();
			} else {
				this.updateAngle();
			}
		}
	}
}