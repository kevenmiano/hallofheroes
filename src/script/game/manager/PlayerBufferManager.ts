// @ts-nocheck
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import { SocketManager } from "../../core/net/SocketManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { PackageIn } from "../../core/net/PackageIn";
import { PlayerManager } from "./PlayerManager";
import { BaseCastle } from "../datas/template/BaseCastle";
import { PlayerBufferType } from "../constant/PlayerBufferType";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import { PlayerBufferEvent } from "../constant/event/NotificationEvent";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import BaseCastleMsg = com.road.yishi.proto.army.BaseCastleMsg;
import AdditionMsg = com.road.yishi.proto.player.AdditionMsg;
import RateUpdateReqMsg = com.road.yishi.proto.player.RateUpdateReqMsg;
import CampaignBufferMsg = com.road.yishi.proto.campaign.CampaignBufferMsg;
import BufferInfoMsg = com.road.yishi.proto.campaign.BufferInfoMsg;
import ItemBufferRspMsg = com.road.yishi.proto.item.ItemBufferRspMsg;
import BufferDataMsg = com.road.yishi.proto.item.BufferDataMsg;
import EffectRemoveReqMsg = com.road.yishi.proto.player.EffectRemoveReqMsg;
import { ArmyManager } from "./ArmyManager";

export class PlayerBufferManager extends GameEventDispatcher {
	private static _instance: PlayerBufferManager;
	public static get Instance(): PlayerBufferManager {
		if (!PlayerBufferManager._instance) {
			PlayerBufferManager._instance = new PlayerBufferManager();
		}
		return PlayerBufferManager._instance;
	}

	private _itemBufferList: SimpleDictionary;
	public get itemBufferList(): SimpleDictionary {
		return this._itemBufferList;
	}

	private _campaignBufferList: PlayerBufferInfo[];
	public get campaignBufferList(): PlayerBufferInfo[] {
		return this._campaignBufferList;
	}

	public basePropertyBuffer: PlayerBufferInfo;

	constructor() {
		super();

		this._itemBufferList = new SimpleDictionary();
		this._campaignBufferList = [];
	}

	public setup() {
		this.initEvent();
	}

	public clear(){
		this._itemBufferList = new SimpleDictionary();
		this._campaignBufferList = [];
	}

	private initEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_BUFFER_LIST, this, this.__refreshCampaignBufferHandler);
		ServerDataManager.listen(S2CProtocol.U_C_ITEM_BUFFER, this, this.__refreshItemBufferHandler);
		ServerDataManager.listen(S2CProtocol.U_C_RATE_INFO, this, this.__douleExpHandler);
		ServerDataManager.listen(S2CProtocol.U_C_PLAYER_ADDITION, this, this.__updatePlayerBasePropertyHandler);
		ServerDataManager.listen(S2CProtocol.U_C_CASTLE_TIME, this, this.__updateDefenceTimeHandler);
	}

	private __updateDefenceTimeHandler(pkg: PackageIn) {
		let data: BaseCastle = PlayerManager.Instance.currentPlayerModel.mapNodeInfo;
		let msg: BaseCastleMsg = pkg.readBody(BaseCastleMsg) as BaseCastleMsg;
		data.defenceLeftTime = msg.defenceLefttime;

		let buffer: PlayerBufferInfo = this._itemBufferList[2001] as PlayerBufferInfo;
		if (buffer) {
			buffer.templateId = 2001;
			buffer.bufferType = PlayerBufferType.OTHER_BUFFER;
			buffer.grade = 1;
			buffer.goodsTemplateId = 208006;
			if (data.defenceLeftTime <= 0) {
				this._itemBufferList.del(buffer.templateId);
				TaskTraceTipManager.Instance.addBufferDisapearTip(buffer);
			}
		} else {
			buffer = new PlayerBufferInfo();
			buffer.addEventListener(Laya.Event.COMPLETE, this.__removeBuffHandler, this);
			buffer.templateId = 2001;
			buffer.bufferType = PlayerBufferType.OTHER_BUFFER;
			buffer.grade = 1;
			buffer.goodsTemplateId = 208006;
			if (buffer.goodsTemplateId != 0 && data.defenceLeftTime > 0) {
				this._itemBufferList.add(buffer.templateId, buffer);
			}
		}
		buffer.leftTime = data.defenceLeftTime;
		this.dispatchEvent(PlayerBufferEvent.ITEM_BUFFER_UPDATE);
	}

	private __updatePlayerBasePropertyHandler(pkg: PackageIn) {
		let msg: AdditionMsg = pkg.readBody(AdditionMsg) as AdditionMsg;
		if (msg.isExist) {
			this.basePropertyBuffer = new PlayerBufferInfo();
			this.basePropertyBuffer.templateId = 2001;
			this.basePropertyBuffer.masterType = msg.masterType;
			this.basePropertyBuffer.description = msg.description;
			this.basePropertyBuffer.bufferType = PlayerBufferType.BASE_PROPERTY_BUFFER;
		} else {
			this.basePropertyBuffer = null;
		}
		this.dispatchEvent(PlayerBufferEvent.ITEM_BUFFER_UPDATE);
	}

	private getExpRateBufferByServerBufferType(type: number): number {
		if (type == 10000) {
			return PlayerBufferType.LORDS_BUFFER;
		} else {
			return PlayerBufferType.EXP_RATE;
		}
	}

	private __douleExpHandler(pkg: PackageIn) {
		let msg: RateUpdateReqMsg = pkg.readBody(RateUpdateReqMsg) as RateUpdateReqMsg;
		let type: number = this.getExpRateBufferByServerBufferType(msg.bufferType);
		if (msg.rate <= 0) {
			this._itemBufferList.del(type);
		} else {
			let buffer: PlayerBufferInfo = this._itemBufferList[type];
			if (buffer) {
				buffer.bufferType = type;
				buffer.rateCount = msg.rate;
			} else {
				buffer = new PlayerBufferInfo();
				buffer.templateId = type;
				buffer.bufferType = type;
				buffer.name = msg.rateName;
				buffer.description = msg.rateDesc;
				buffer.rateCount = msg.rate;

				if (type === PlayerBufferType.LORDS_BUFFER && ArmyManager.Instance.thane.grades < 20) {
				} else {
					this._itemBufferList.add(buffer.templateId, buffer);
				}
			}

			let endDay: number = DateFormatter.parse(msg.endDay, "YYYY-MM-DD hh:mm:ss").getTime();
			let beginDay: number = DateFormatter.parse(msg.beginDay, "YYYY-MM-DD hh:mm:ss").getTime();

			let serverDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
			let beginDate: Date = new Date();
			let endDate: Date = new Date();
			let leftTime: number;
			let lastTime: number;
			beginDate.setTime(beginDay + msg.beginTime);
			if (msg.beginTime == 0 && msg.endTime == Number(23 * 3600 + 59 * 60 + 59)) {
				endDate.setTime(endDay + msg.endTime * 1000);
			} else {
				let date: Date = new Date();
				date.setFullYear(serverDate.getFullYear());
				date.setMonth(serverDate.getMonth());
				date.setDate(serverDate.getDate());
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				endDate.setTime(date.getTime() + msg.endTime * 1000);
			}
			lastTime = (serverDate.getTime() - beginDate.getTime()) / 1000;
			leftTime = (endDate.getTime() - beginDate.getTime()) / 1000 - lastTime;
			buffer.leftTime = leftTime;
			if (buffer.bufferType == PlayerBufferType.LORDS_BUFFER) {
				buffer.leftTime = 0;
			}
		}
		this.dispatchEvent(PlayerBufferEvent.ITEM_BUFFER_UPDATE);
	}

	private __refreshCampaignBufferHandler(pkg: PackageIn) {
		this._campaignBufferList.splice(0, this._campaignBufferList.length);
		let msg: CampaignBufferMsg = pkg.readBody(CampaignBufferMsg) as CampaignBufferMsg;
		for (let i = 0; i < msg.bufferInfo.length; i++) {
			const bInfo: BufferInfoMsg = msg.bufferInfo[i] as BufferInfoMsg;
			let buffer: PlayerBufferInfo = new PlayerBufferInfo();
			buffer.templateId = bInfo.bufferTempId;
			buffer.leftTime = bInfo.leftTime / 1000;
			buffer.bufferType = PlayerBufferType.CAMPAIGN_BUFFER;
			this._campaignBufferList.push(buffer);
		}
		this.dispatchEvent(PlayerBufferEvent.CAMPAIGN_BUFFER_UPDATE);
	}

	private __refreshItemBufferHandler(pkg: PackageIn) {
		let msg: ItemBufferRspMsg = pkg.readBody(ItemBufferRspMsg) as ItemBufferRspMsg;
		let buffer: PlayerBufferInfo;
		for (let i = 0; i < msg.bufferData.length; i++) {
			const data: BufferDataMsg = msg.bufferData[i] as BufferDataMsg;
			if (data.type == PlayerBufferType.MAGICCARD_BUFFER) {
				continue;
			}
			if (this._itemBufferList[data.templateId]) {
				buffer = this._itemBufferList[data.templateId] as PlayerBufferInfo;
				buffer.templateId = data.templateId;
				buffer.bufferType = data.type;
				buffer.grade = data.grade;
				buffer.goodsTemplateId = data.typeTemplateid;
				if (data.validityDate <= 0) {
					this._itemBufferList.del(buffer.templateId);
					TaskTraceTipManager.Instance.addBufferDisapearTip(buffer);
				}
			} else {
				buffer = new PlayerBufferInfo();
				buffer.addEventListener(Laya.Event.COMPLETE, this.__removeBuffHandler, this);
				buffer.templateId = data.templateId;
				buffer.bufferType = data.type;
				buffer.grade = data.grade;
				buffer.goodsTemplateId = data.typeTemplateid;
				if (data.typeTemplateid != 0) {
					this._itemBufferList.add(buffer.templateId, buffer);
				}
			}
			buffer.leftTime = data.validityDate * 60;
		}
		this.dispatchEvent(PlayerBufferEvent.ITEM_BUFFER_UPDATE);
	}

	private __removeBuffHandler(buffer: PlayerBufferInfo) {
		buffer.removeEventListener(Laya.Event.COMPLETE, this.__removeBuffHandler, this);
		this.removeBuffer(buffer);
	}

	public removeBuffer(value: PlayerBufferInfo) {
		if (!value) {
			return;
		}
		let protocolId: number = 0;
		let msg: EffectRemoveReqMsg;
		if (value.templateId == 2001) {
			protocolId = C2SProtocol.C_CASTLE_TIME_CANCEL;
		} else {
			protocolId = C2SProtocol.C_EFFECT_STOP;
			msg = new EffectRemoveReqMsg();
			msg.templateId = value.templateId;
		}
		SocketManager.Instance.send(protocolId, msg);
	}

	public getItemBufferInfo(id: number): PlayerBufferInfo {
		return this._itemBufferList[id];
	}

	public exist(id: number): boolean {
		return this._itemBufferList[id];
	}
}
