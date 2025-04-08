// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import { Avatar } from "../../avatar/view/Avatar";
import { CampaignEvent, CampaignMapEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import IMediator from "../../interfaces/IMediator";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";
import { MineralArmyView } from '../../map/campaign/view/physics/MineralArmyView';
import NodeResourceType from "../../map/space/constant/NodeResourceType";
import { NodeState } from "../../map/space/constant/NodeState";
import { PosType } from "../../map/space/constant/PosType";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { PhysicInfo } from "../../map/space/data/PhysicInfo";
import FUIHelper from "../../utils/FUIHelper";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignMapModel } from "../model/CampaignMapModel";
import MineralModel from "../model/MineralModel";
import { EmPackName, EmWindow } from '../../constant/UIDefine';
import { isOversea } from '../../module/login/manager/SiteZoneCtrl';


/**
 * 运矿控制, 在人物头上加上运输中, 创建矿车
 */
export class TransportMediator implements IMediator {
	private _data: CampaignArmy;
	private _target: MineralArmyView;
	private _transport: fgui.GLoader;
	private _userId: number = 0;

	public register(target: any) {
		this._target = target;
		this._data = target.data;
		if (!this._data) return;
		this._userId = this._data.userId;
		this._data.addEventListener(CampaignMapEvent.IS_DIE, this.__isDieHandler, this);
		this._data.addEventListener(CampaignMapEvent.ONLINE_STATE, this.__onlineStateHandler, this);
		this._target.avatarView.on(Avatar.SIZETYPE_CHANGE, this, this.__onThaneInfoChange);//外形改变
		if (this.isSelf) {
			this.thane.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onThaneInfoChange, this);
		} else {
			this._data.baseHero.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onThaneInfoChange, this);
		}
		if (this.inMineral && this.mineralModel) this.mineralModel.addEventListener(CampaignEvent.UPDATE_MINERAL_CAR, this.__mineralCarHandler, this);
		this.__isDieHandler();
		this.checkMineralCar();
	}

	public unregister(target: any) {
		this._data.removeEventListener(CampaignMapEvent.IS_DIE, this.__isDieHandler, this);
		if (this.inMineral && this.mineralModel) this.mineralModel.removeEventListener(CampaignEvent.UPDATE_MINERAL_CAR, this.__mineralCarHandler, this);
		this._data.removeEventListener(CampaignMapEvent.ONLINE_STATE, this.__onlineStateHandler, this);
		this._target.avatarView.off(Avatar.SIZETYPE_CHANGE, this, this.__onThaneInfoChange);
		if (this.isSelf) {
			this.thane.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onThaneInfoChange, this);
		} else {
			this._data.baseHero.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onThaneInfoChange, this);
		}
		this.removeNpc();
		this._target = null;
		this._data = null;
	}

	private get isSelf(): boolean {
		if (this._data == null) return false;
		if (this.mapModel.isCross) {
			return this._data.userId == this.thane.userId &&
				this._data.baseHero.serviceName == PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
		}
		return this._data.userId == this.thane.userId;
	}

	protected get mapModel(): CampaignMapModel {
		return CampaignManager.Instance.mapModel;
	}

	private get inMineral(): boolean {
		return WorldBossHelper.checkMineral(CampaignManager.Instance.mapId);
	}

	private get inPvpWar(): boolean {
		return WorldBossHelper.checkPvp(CampaignManager.Instance.mapId);
	}

	private get mineralModel(): MineralModel {
		return CampaignManager.Instance.mineralModel;
	}

	private __onThaneInfoChange() {
		this.resize();
	}

	private resize() {
		if (!this._transport) return;
		if (!this._target) return;
		this._transport.y = this._target.caluateTopPos();
	}

	private __onlineStateHandler() {
		if (!this._data || !this._data.online) this.removeNpc();
	}

	private __mineralCarHandler(data: any) {
		if (data != this._data) return;
		this.checkMineralCar();
	}

	private checkMineralCar() {
		if (this.inMineral) {
			if (this.mineralModel.carInfos[this._data.baseHero.userId] &&
				this.mineralModel.carInfos[this._data.baseHero.userId].is_own == 1 &&
				this._data.online) {
				this.createNpc();
			} else {
				this.removeNpc();
			}
		}
	}

	private __isDieHandler() {
		switch (this._data.isDie) {
			case CampaignArmyState.STATE_DIEDTRAN:
				this.createNpc();
				break;
			case CampaignArmyState.STATE_DIED:
				this.removeNpc();
				break;
			case CampaignArmyState.STATE_TRAN:
				this.createNpc();
				break;
			default:
				this.removeNpc();
		}
	}

	private createNpc() {
		if (this._target == null) return;
		let node: CampaignNode = this.readNodeInfo();
		CampaignManager.Instance.mapModel.addNode(node);
		if (node.followTarget != this._data.id) {
			node.followTargetServiceName = this._data.baseHero.serviceName;
			node.followTarget = this._data.id;
		}
		this.transportState(true);
		if (this.isSelf && !this.inMineral) {
			NotificationManager.Instance.sendNotification(NotificationEvent.TRANSPORT_STATE);
		}
	}

	private removeNpc() {
		let node: CampaignNode = CampaignManager.Instance.mapModel.getMapNodesById(this.nodeId);
		if (node) CampaignManager.Instance.mapModel.removeNode(node);
		this.transportState(false);
		if (this.isSelf && !this.inMineral) {
			NotificationManager.Instance.sendNotification(NotificationEvent.TRANSPORT_STATE);
		}
	}

	private transportState(value: boolean) {
		if (value) {
			if (!this._transport) {
				this._transport = new fgui.GLoader();
			}
			this._transport.url = FUIHelper.getItemURL(EmPackName.Base, "transporting");
			(<Laya.Sprite>this._target).addChild(this._transport.displayObject);
			if(isOversea()) {
				this._transport.x = -47.5;//北美居中展示
			} else {
				this._transport.x = -25;
			}
			//重新计算坐标
			this._target.layoutCB = ()=>{
				this._transport.y = this._target.caluateTopPos();
				if(isOversea()) {
					this._transport.x = -47.5;//北美居中展示
				} else {
					this._transport.x = -25;
				}
			}
			this._transport.y = this._target.caluateTopPos();
			if (this.inPvpWar) {
				this._target.changeSpeedTo(.5);
			}
			let info: ThaneInfo;
			let isMounting: boolean = false;
			if (this.isSelf) {
				info = this.thane;
				isMounting = info.mountAvata != "";
			} else {
				info = this._data.baseHero;
				isMounting = this._data.mountTemplate != null;
			}
		} else {
			if (this._transport && this._transport.displayObject.parent) this._transport.displayObject.parent.removeChild(this._transport.displayObject);
			if (this.inPvpWar || this.inMineral) {
				this._target.changeSpeedTo(1);
			}
		}
	}

	private readNodeInfo(): CampaignNode {
		let node: CampaignNode;
		node = CampaignManager.Instance.mapModel.getMapNodesById(this.nodeId);
		if (!node) node = new CampaignNode();
		let info: PhysicInfo = new PhysicInfo();
		info.id = this.nodeId;
		node.nodeId = this._data.mapTempInfo.CampaignId;
		let infoNameTip: string;
		if (this.inPvpWar) {
			infoNameTip = LangManager.Instance.GetTranslation("map.campaign.mediator.pvp.TransportMediator.infoNameTip");
			info.names = infoNameTip;
			info.types = PosType.TRANSPORT_CAR;
			node.sonType = 4999;
			info.state = CampaignManager.Instance.mapModel.selfMemberData.teamId == this._data.teamId ? NodeState.FRIENDLY : NodeState.EXIST;
		} else if (this.inMineral) {
			info.names = this._data.baseHero.nickName;
			info.types = PosType.MINERAL_CAR;
			node.sonType = 5000;
			info.state = this.thane.userId == this._data.baseHero.userId ? NodeState.FRIENDLY : NodeState.EXIST;
			info.occupyPlayerId = this._data.baseHero.userId;
		}
		let vx: number = this._target.x;
		let vy: number = this._target.y;
		vx = (vx <= 0 ? this._data.curPosX * 20 : vx);
		vy = (vy <= 0 ? this._data.curPosY * 20 : vy);
		info.posX = vx / 20;
		info.posY = vy / 20;
		node.curPosX = vx / 20;
		node.curPosY = vy / 20;
		info.grade = 0;
		node.styleType = 1
		node.attackTypes = 1;
		let myTeamId: number = CampaignManager.Instance.mapModel.selfMemberData.teamId;
		node.nameColor = (myTeamId == this._data.teamId ? 1 : 5);
		node.toward = 1;
		node.resource = NodeResourceType.Image;
		node.resetPosX = 0;
		node.resetPosY = 0;
		node.visitServerNames = [];
		node.visitUserIds = [];
		node.fixX = vx;
		node.fixY = vy;
		node.handlerRange = 2;
		node.heroTemplateId = 1;
		node.sizeType = 1;
		node.fightCapaity = 0;
		node.param1 = this._data.teamId;
		node.info = info;
		return node;
	}

	private get nodeId(): number {
		return this._userId + 10000000000;
	}

	protected get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}
	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

}