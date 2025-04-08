// @ts-nocheck
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { MapPhysicsBase } from "../../map/space/view/physics/MapPhysicsBase";

/**
 *  
 * 副本中传送等待,当离开传送点一定距离则取消等待状态
 * 
 */
export class TranseferWaitMediator implements IMediator, IEnterFrame {
	private _cArmyView: CampaignArmyView;
	private _cArmyData: CampaignArmy;
	private _node: MapPhysicsBase;
	constructor() {
	}

	public register(target: Object) {
		this._cArmyView = <CampaignArmyView>target;
		this._cArmyData = this._cArmyView.data;
		if(this._cArmyData)this._cArmyData.on(CampaignMapEvent.TRANSEFER_WAIT_STATE, this.__transeferWaitStateHandler,this);
	}

	public unregister(target: Object) {
		if (this._cArmyData)
			this._cArmyData.off(CampaignMapEvent.TRANSEFER_WAIT_STATE, this.__transeferWaitStateHandler,this);
		EnterFrameManager.Instance.unRegisteEnterFrame(this);
	}
	private _nodeId: number = 0;
	/**
	 * 军队进入等待状态 进行距离监测
	 * @param evt
	 * 
	 */
	private __transeferWaitStateHandler(data: any) {
		var obj: any = data;
		this._node = CampaignManager.Instance.mapModel.getNodeByNodeId(obj.nodeId) as MapPhysicsBase;
		if (this._node && obj.state) {
			this._nodeId = obj.nodeId;
			EnterFrameManager.Instance.registeEnterFrame(this);
		}
	}
	/**
	 * 检测军队与节点的距离 过远则取消等待状态 
	 * 
	 */
	public enterFrame() {
		var p1: Laya.Point = new Laya.Point(this._node.x, this._node.y);
		var p2: Laya.Point = new Laya.Point(this._cArmyView.x, this._cArmyView.y);
		if (p1.distance(p2.x, p2.y) > 100) {
			CampaignSocketOutManager.Instance.sendTranseferState(this.sendTranseferState(this._cArmyData.id, false, this._cArmyData.mapId, this._nodeId));
			EnterFrameManager.Instance.unRegisteEnterFrame(this);
		}
	}

	public sendTranseferState(armyId: number, state: boolean, mapId: number, nodeId: number): com.road.yishi.proto.campaign.PlayerNodeStateMsg {
		var msg: com.road.yishi.proto.campaign.PlayerNodeStateMsg = new com.road.yishi.proto.campaign.PlayerNodeStateMsg();
		msg.armyId = armyId;
		msg.isStand = state;
		msg.mapId = mapId;
		msg.nodeId = nodeId;
		return msg;
	}
}