import ConfigMgr from '../../../core/config/ConfigMgr';
import Logger from '../../../core/logger/Logger';
import { PackageIn } from "../../../core/net/PackageIn";
import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { DisplayObject } from "../../component/DisplayObject";
import { t_s_campaignData } from '../../config/t_s_campaign';
import { CampaignEvent } from '../../constant/event/NotificationEvent';
import { FogGridType } from "../../constant/FogGridType";
import { PlayerModel } from '../../datas/playerinfo/PlayerModel';
import { CampaignManager } from "../../manager/CampaignManager";
import { PlayerManager } from '../../manager/PlayerManager';
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import Tiles from "../../map/space/constant/Tiles";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { HeroAvatarViewHelper } from "../../utils/HeroAvatarViewHelper";
import PlayerMovieMsg = com.road.yishi.proto.player.PlayerMovieMsg;
export class TranseferEndAction extends MapBaseAction {
	private _pkg: PackageIn;
	private _nodeId: number = 0;
	private _node: DisplayObject;

	constructor($pkg: PackageIn, $action: string) {
		super();
		this._pkg = $pkg;
	}
	public prepare() {
		let msg: PlayerMovieMsg = this._pkg.readBody(PlayerMovieMsg) as PlayerMovieMsg;
		if (this.selfArmyView) this.selfArmyView.aiInfo.pathInfo = [];
		this._nodeId = msg.targetId;
		var nodeInfo: CampaignNode = CampaignManager.Instance.mapModel.getMapNodesById(this._nodeId);
		if (nodeInfo) this._node = nodeInfo.nodeView;
		msg = null;
		super.prepare();
	}

	public update() {
		var curScene: string = SceneManager.Instance.currentType;
		if (curScene != SceneType.CAMPAIGN_MAP_SCENE) {
			this.actionOver();
			return;
		}
		this._count++;
		if (this._node && this._count == 1) {
			CampaignManager.Instance.mapView.moveCenterPoint(new Laya.Point(this._node.x, this._node.y));
			CampaignManager.Instance.mapModel.updateFog(this._node.x, this._node.y, FogGridType.OPEN_TWO);
			return;
		}
		if (this._node && this._count == 2) {
			this._count++;
			// var movie : MovieClip = ComponentFactory.Instance.creatCustomObject("asset.campaign.TranseferOverAsset");
			// var eff : SimpleMovie = new SimpleMovie(movie,this.armyViewPos);
			// if(this.selfArmyView && this.selfArmyView.parent)this.selfArmyView.parent.addChild(eff);
			// eff.x = this._node.x;
			// eff.y = this._node.y;
			Laya.timer.once(50, this, this.armyViewPos);
			return;
		}
		if (!this._node && CampaignManager.Instance.mapModel) {
			this._node = CampaignManager.Instance.mapModel.getNodeById(this._nodeId);
			if (!this._node) return;
			if (this._node.hasOwnProperty("isPlaying")) {
				this._node["isPlaying"] = true;
			}
		}
		this.wait();

	}
	private armyViewPos() {
		if (this.selfArmyView) {
			this.selfArmyView.x = this._node.x;
			this.selfArmyView.y = this._node.y;
			this.selfArmyView.alpha = 0.3;
			this.selfArmyView.aiInfo.pathInfo = [];
			var nodeInfo: CampaignNode = CampaignManager.Instance.mapModel.getMapNodesById(this._nodeId);
			var vx: number = nodeInfo.resetPosX * Tiles.WIDTH;
			var vy: number = nodeInfo.resetPosY * Tiles.HEIGHT;
			this.selfArmyView.avatarView.angle = HeroAvatarViewHelper.twoPointAngle(vx, vy, this.selfArmyView.x, this.selfArmyView.y)
			TweenMax.to(this.selfArmyView, .6, { x: vx, y: vy, alpha: 1, onComplete: this.transeferCallBack.bind(this) });
		}
		else {
			this.transeferCallBack();
		}

	}
	private wait() {
		if (this._count > 250) this.actionOver();
	}
	protected actionOver() {
		super.actionOver();
		if (this.selfArmyView) {
			var nodeInfo: CampaignNode = CampaignManager.Instance.mapModel.getMapNodesById(this._nodeId);
			var vx: number = nodeInfo.resetPosX * Tiles.WIDTH;
			var vy: number = nodeInfo.resetPosY * Tiles.HEIGHT;
			this.selfArmyView.x = vx;
			this.selfArmyView.y = vy;
		}
		SceneManager.Instance.enable = true;
		if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
			this.playerModel.dispatchEvent(CampaignEvent.AUTO_WALK_CHANGED);
		}
	}

	private get playerModel(): PlayerModel {
		return PlayerManager.Instance.currentPlayerModel
	}

	private transeferCallBack() {
		if (this.selfArmyView) this.selfArmyView.alpha = 1;
		this.actionOver();
	}
	private get selfArmyView(): any {
		var cModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (cModel && cModel.selfMemberData && CampaignManager.Instance.controller) {
			try {
				var armyView: Object = CampaignManager.Instance.controller.getArmyView(cModel.selfMemberData);
				return armyView;
			} catch (error) {
				Logger.error('TranseferEndAction selfArmyView Error---');
			}
		}
		return null;
	}
}