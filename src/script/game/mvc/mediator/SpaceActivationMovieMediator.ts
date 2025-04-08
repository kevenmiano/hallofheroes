// @ts-nocheck
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceModel } from "../../map/space/SpaceModel";
import { SpaceSceneMapView } from "../../map/space/view/SpaceSceneMapView";
import { EnterFrameManager } from '../../manager/EnterFrameManager';
import { SpaceMapViewHelper } from "../../map/space/utils/SpaceMapViewHelper";
import { NodeState } from "../../map/space/constant/NodeState";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { SharedManager } from "../../manager/SharedManager";
import { PosType } from "../../map/space/constant/PosType";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { SpaceNpcView } from "../../map/space/view/physics/SpaceNpcView";
import { SpacePhysicsView } from "../../map/space/view/physics/SpacePhysicsView";

/**
 *  
 * 当玩家 npc 节点不在屏幕范围内就移出显示列表
 * 
 */
export class SpaceActivationMovieMediator implements IMediator, IEnterFrame {
	private _target: Object;
	private _mapView: SpaceSceneMapView;
	private _model: SpaceModel;
	private _count: number = 0;

	constructor() {
	}

	public register(target: any) {
		this._target = target;
		this._mapView = SpaceManager.Instance.mapView;
		this._model = SpaceManager.Instance.model;
		if (this._mapView) {
			this._mapView.on(CampaignMapEvent.MOVE_SCENET_END, this, this.__moveSceneHandler);
		}
		EnterFrameManager.Instance.registeEnterFrame(this);
	}

	public unregister(target: any) {
		if (this._mapView) {
			this._mapView.off(CampaignMapEvent.MOVE_SCENET_END, this, this.__moveSceneHandler);
		}
		EnterFrameManager.Instance.unRegisteEnterFrame(this);
		this._mapView = null;
		this._model = null;
	}

	public enterFrame() {
		this._count++;
		if (this._count > 25) {
			this._count = 0;
			var arr: Array<SpaceNode> = SpaceManager.Instance.model.mapNodesData;
			if (!arr) return;
			var rect: Laya.Rectangle = SpaceMapViewHelper.getCurrentMapRect(this._mapView);
			for (let node of arr) {
				if (NodeState.displayState(node.info.state)) {
					var nodeView: Object = SpaceManager.Instance.controller.getBuildView(node);
					if (!nodeView)
						nodeView = SpaceManager.Instance.controller.getNpcView(node);
					this.checkNodePlaying(nodeView, rect, node);
				}
			}

			arr = this._model.staticMovies;
			arr.forEach(node => {
				if (node) {
					nodeView = node.nodeView;
					if (nodeView) {
						this.checkNodePlaying(nodeView, rect);
					}
				}
			});

			var dic: Map<number, SpaceArmy> = this._model.allArmyDict;
			dic.forEach((element) => {
				var armyView: Object = SpaceManager.Instance.controller.getArmyView(element);
				this.checkArmyPlaying(armyView, rect, element);
			});
		}
	}

	private __moveSceneHandler() {
		let nodeView: any;
		let arr: Array<SpaceNode> = this._model.mapNodesData;
		if (!arr) return;
		let rect: Laya.Rectangle = SpaceMapViewHelper.getCurrentMapRect(this._mapView);
		arr.forEach(element => {
			if (NodeState.displayState(element.info.state)) {
				nodeView = SpaceManager.Instance.controller.getBuildView(element);
				if (!nodeView)
					nodeView = SpaceManager.Instance.controller.getNpcView(element);
				this.checkNodePlaying(nodeView, rect, element);
			}
		});

		arr = this._model.staticMovies;
		arr.forEach(node => {
			if (node) {
				nodeView = node.nodeView;
				if (nodeView) {
					this.checkNodePlaying(nodeView, rect);
				}
			}
		});

		var dic: Map<number, SpaceArmy> = this._model.allArmyDict;
		dic.forEach(element => {
			var armyView: any = SpaceManager.Instance.controller.getArmyView(element);
			this.checkArmyPlaying(armyView, rect, element);
		})
	}

	private checkArmyPlaying(mc: any, rect: Laya.Rectangle, army: SpaceArmy) {
		if (!mc || mc.destroyed) return;
		
		var b: boolean = this.outOfSight(mc, rect);
		if (!SharedManager.Instance.hideOthers) {
			mc['isPlaying'] = !b;
		}
		if (b) {
			if (mc.parent) {
				mc.removeSelf();
			}
		}
		else {
			if (!mc.parent) {
				SpaceManager.Instance.controller.walkLayer.addChild(mc);
			}
		}
	}

	private checkNodePlaying(mc: any, rect: Laya.Rectangle, node?: SpaceNode) {
		if (!mc || mc.destroyed) return;

		var b: boolean = this.outOfSight(mc, rect);
		mc.visible = !b;
		mc['isPlaying'] = !b;
	}

	private outOfSight(mc: any, rect: Laya.Rectangle): boolean {
		if (!mc || mc.destroyed) return;

		var b: boolean = false;
		if (mc.x < rect.x - mc.width - 100) {
			b = true;
		}
		else if (mc.x > rect.x + StageReferance.stageWidth + 100) {
			b = true;
		}
		else if (mc.y < rect.y - mc.height - 100) {
			b = true;
		}
		else if (mc.y > rect.y + StageReferance.stageHeight + 100) {
			b = true;
		}
		return b;
	}
}