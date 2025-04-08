import { BaseAction } from "../../battle/actions/common/BaseAction";
import { NotificationEvent, OuterCityEvent } from "../../constant/event/NotificationEvent";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { SceneManager } from "../scene/SceneManager";
import SceneType from "../scene/SceneType";
import { CampaignNode } from "../space/data/CampaignNode";
import SpaceManager from "../space/SpaceManager";
import { SpaceModel } from "../space/SpaceModel";

/**
 * 跨地图寻路中, 在id指定的地图中才能执行的动作 
 * 
 */
export class CrossMapSearchAction extends BaseAction {
	/**
	 * 地图id, 只有处于该id对应的地图中时, 才会执行这个动作 
	 */
	public mapId: number;
	/**
	 * 目标节点,在该地图中自动寻路到目标节点 
	 */
	public toPoint: number;
	/**
	 * 目标点, 在该地图中自动寻路到目标点
	 */
	public toPosition: Laya.Point;

	public prepare() {

	}

	public update() {
		super.update();
		if (this.finished) return;
		var currentScene: string = SceneManager.Instance.currentType;
		if (currentScene == SceneType.SPACE_SCENE) {//天空之城的自动寻路
			this.findSpacePath();
		}
		else {//副本的自动寻路
			if (!CampaignManager.Instance.mapView) {
				NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.__switchSceneHandler, this);
			}
			else {
				this.checkMapNodesData();
			}
		}
		this.finished = true;
	}

	private onRecvMapNodeData() {
		CampaignManager.Instance.mapModel.removeEventListener(OuterCityEvent.CURRENT_NPC_POS, this.onRecvMapNodeData, this);
		this.findPath();
	}

	private __switchSceneHandler(e: NotificationEvent) {
		NotificationManager.Instance.removeEventListener(NotificationEvent.SWITCH_SCENE, this.__switchSceneHandler, this);
		this.checkMapNodesData();
	}

	//弱网模式下, 服务器返回的地图地点数据比较慢的情况,等服务器返回数据后再继续寻路 add by zhihua.zhou 2022-6-24
	private checkMapNodesData() {
		let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (!mapModel.mapNodesData) {
			mapModel.addEventListener(OuterCityEvent.CURRENT_NPC_POS, this.onRecvMapNodeData, this);
		} else {
			this.findPath();
		}
	}

	private findSpacePath() {
		if (this.toPosition) {
			var model: SpaceModel = SpaceManager.Instance.model;
			if (model && SpaceManager.Instance.controller) {
				SpaceManager.Instance.controller.moveArmyByPos(this.toPosition.x, this.toPosition.y);
			}
		}
		else {
			SpaceManager.Instance.visitSpaceNPC(this.toPoint);
		}
	}

	private findPath() {
		var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		var mapNode: CampaignNode;
		if (mapModel && CampaignManager.Instance.controller) {
			if (this.toPosition) {
				CampaignManager.Instance.controller.moveArmyByPos(this.toPosition.x, this.toPosition.y);
			}
			else {
				mapNode = mapModel.getMapNodeByNodeId(this.toPoint);
				if (mapNode) {
					CampaignManager.Instance.mapModel.selectNode = mapNode;
					CampaignManager.Instance.controller.moveArmyByPos(mapNode.x, mapNode.y, false, true);
				}
			}
		}
	}
}