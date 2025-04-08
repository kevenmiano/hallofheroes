import AudioManager from "../../core/audio/AudioManager";
import ConfigMgr from "../../core/config/ConfigMgr";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import ByteArray from "../../core/net/ByteArray";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import ResMgr from "../../core/res/ResMgr";
import { SHARE_CHANNEL } from "../../core/sdk/SDKConfig";
import SDKManager from "../../core/sdk/SDKManager";
import { NativeChannel } from "../../core/sdk/native/NativeChannel";
import WanChannel from "../../core/sdk/wan/WanChannel";
import { EmLayer } from "../../core/ui/ViewInterface";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { DateFormatter } from "../../core/utils/DateFormatter";
import StringHelper from "../../core/utils/StringHelper";
import Utils from "../../core/utils/Utils";
import XmlMgr from "../../core/xlsx/XmlMgr";
import StoreRatingAction from "../action/hero/StoreRatingAction";
import { BattleManager } from "../battle/BattleManager";
import { AlertTipAction } from "../battle/actions/AlertTipAction";
import { DialogAction } from "../battle/actions/DialogAction";
import MessageAction from "../battle/actions/common/MessageAction";
import { BattleResultHandler } from "../battle/handler/BattleResultHandler";
import SimpleAlertHelper, { AlertBtnType } from "../component/SimpleAlertHelper";
import { t_s_campaignData } from "../config/t_s_campaign";
import { ConfigType } from "../constant/ConfigDefine";
import { CreateCampaignType } from "../constant/CreateCampaignType";
import LoginState from "../constant/LoginState";
import OpenGrades from "../constant/OpenGrades";
import { RoomType } from "../constant/RoomDefine";
import { StoreRatingsType } from "../constant/StoreRatingsType";
import { EmWindow } from "../constant/UIDefine";
import {
	CampaignEvent,
	CampaignMapEvent,
	ConsortiaEvent,
	ExpBackEvent,
	LoginEvent,
	MsgEventType,
	NotificationEvent,
	OuterCityEvent,
	SwitchEvent,
} from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import LoaderInfo from "../datas/LoaderInfo";
import { TipMessageData } from "../datas/TipMessageData";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { BuildingOrderInfo } from "../datas/playerinfo/BuildingOrderInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { UserInfo } from "../datas/userinfo/UserInfo";
import { PreLoadWorldBoss } from "../map/campaign/PreLoadWorldBoss";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import BuildingManager from "../map/castle/BuildingManager";
import { BuildInfo } from "../map/castle/data/BuildInfo";
import TreasureInfo from "../map/data/TreasureInfo";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import SpaceManager from "../map/space/SpaceManager";
import { BaseArmy } from "../map/space/data/BaseArmy";
import { PhysicInfo } from "../map/space/data/PhysicInfo";
import SpaceArmy from "../map/space/data/SpaceArmy";
import { MapUtils } from "../map/space/utils/MapUtils";
import { FashionModel } from "../module/bag/model/FashionModel";
import { DialogMessageInfo } from "../module/dialog/data/DialogMessageInfo";
import ExpBackModel from "../module/expback/model/ExpBackModel";
import NewbieModule from "../module/guide/NewbieModule";
import PetBossModel from "../module/petguard/PetBossModel";
import WarlordsModel from "../module/warlords/WarlordsModel";
import WelfareCtrl from "../module/welfare/WelfareCtrl";
import WelfareData from "../module/welfare/WelfareData";
import { WelfareManager } from "../module/welfare/WelfareManager";
import GrowthFundItemInfo from "../module/welfare/data/GrowthFundItemInfo";
import SevenLoginInfo from "../module/welfare/data/SevenLoginInfo";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import { SocketDataProxyManager } from "../proxy/SocketDataProxyManager";
import { StageReferance } from "../roadComponent/pickgliss/toplevel/StageReferance";
import { DelayActionsUtils } from "../utils/DelayActionsUtils";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import { AgentFilterManager } from "./AgentFilterManager";
import AnswerManager from "./AnswerManager";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
import { ConfigManager } from "./ConfigManager";
import { CoreTransactionManager } from "./CoreTransactionManager";
import { EnterFrameManager } from "./EnterFrameManager";
import { FashionManager } from "./FashionManager";
import { GameBaseQueueManager } from "./GameBaseQueueManager";
import InviteTipManager, { EmInviteTipType } from "./InviteTipManager";
import { KingTowerManager } from "./KingTowerManager";
import { MessageTipManager } from "./MessageTipManager";
import { MopupManager } from "./MopupManager";
import { MountsManager } from "./MountsManager";
import { MsgMan } from "./MsgMan";
import { NotificationManager } from "./NotificationManager";
import { PathManager } from "./PathManager";
import { PetCampaignManager } from "./PetCampaignManager";
import { PlayerManager } from "./PlayerManager";
import { RoomListSocketOutManager } from "./RoomListSocketOutManager";
import { RoomManager } from "./RoomManager";
import { SecretManager } from "./SecretManager";
import { SocketSceneBufferManager } from "./SocketSceneBufferManager";
import { SocketSendManager } from "./SocketSendManager";
import { SpaceSocketManager } from "./SpaceSocketManager";
import { SpaceTemplateManager } from "./SpaceTemplateManager";
import { TaskManage } from "./TaskManage";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import WarlordsManager from "./WarlordsManager";

import ArmyChangeSharpMsg = com.road.yishi.proto.army.ArmyChangeSharpMsg;
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;
import CampaignNotifyMsg = com.road.yishi.proto.campaign.CampaignNotifyMsg;
import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
import CampaignTakeCardsMsg = com.road.yishi.proto.campaign.CampaignTakeCardsMsg;
import LockScreenRspMsg = com.road.yishi.proto.campaign.LockScreenRspMsg;
import TowerInfoMsg = com.road.yishi.proto.campaign.TowerInfoMsg;
import WorldBossInfoLoadMsg = com.road.yishi.proto.campaign.WorldBossInfoLoadMsg;
import WorldBossReportMsg = com.road.yishi.proto.campaign.WorldBossReportMsg;
import ChatChannelMsg = com.road.yishi.proto.chat.ChatChannelMsg;
import PlotMsg = com.road.yishi.proto.gameplot.PlotMsg;
import GatewayMsg = com.road.yishi.proto.gateway.GatewayMsg;
import GuildMsg = com.road.yishi.proto.guildcampaign.GuildMsg;
import CampaignCardsMsg = com.road.yishi.proto.item.CampaignCardsMsg;
import NoviceReqMsgMsg = com.road.yishi.proto.novice.NoviceReqMsgMsg;
import DataResetMsg = com.road.yishi.proto.player.DataResetMsg;
import LoginStateMsg = com.road.yishi.proto.player.LoginStateMsg;
import MatchStateMsg = com.road.yishi.proto.room.MatchStateMsg;
import RoomCreatedMsg = com.road.yishi.proto.room.RoomCreatedMsg;
import RoomEnterMsg = com.road.yishi.proto.room.RoomEnterMsg;
import RoomInviteMsg = com.road.yishi.proto.room.RoomInviteMsg;
import RoomMsg = com.road.yishi.proto.room.RoomMsg;
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import SwitchInfoListMsg = com.road.yishi.proto.switches.SwitchInfoListMsg;
import SwitchInfoMsg = com.road.yishi.proto.switches.SwitchInfoMsg;
import TimerInfoListMsg = com.road.yishi.proto.timer.TimerInfoListMsg;
import WorldBossMsg = com.road.yishi.proto.worldmap.WorldBossMsg;
import SevenSignInfoRsp = com.road.yishi.proto.active.SevenSignInfoRsp;
import RewardInfo = com.road.yishi.proto.active.RewardInfo;
import FundDataMsg = com.road.yishi.proto.fund.FundDataMsg;
import GrowthFundDataInfoRsp = com.road.yishi.proto.fund.GrowthFundDataInfoRsp;
import RecoverInfosMsg = com.road.yishi.proto.recover.RecoverInfosMsg;
// import GuildCampaignReportMsg = com.road.yishi.proto.guildcampaign.GuildCampaignReportMsg;
import PetIslandDefendStateMsg = com.road.yishi.proto.campaign.PetIslandDefendStateMsg;
import TreasureMineMsg = com.road.yishi.proto.treasuremine.TreasureMineMsg;
import TreasureMineLandInfo = com.road.yishi.proto.treasuremine.TreasureMineLandInfo;
import UserUiPlayListMsg = com.road.yishi.proto.uiplay.UserUiPlayListMsg;

/**
 * 游戏中一些全局的, 无明显类别界限的事务处理管理器
 *
 */

const TYPES_WARLOAD_PVP = 4; // 众神之战

export class BaseManager extends GameEventDispatcher {
	private static _instance: BaseManager;

	private _inviteRoomId: number = 0;
	private _roomPwd: string;
	public isRigister: boolean = false;
	public static isMusicOn: boolean;
	public static isSoundOn: boolean;
	public static petBossMapId: number = 0;

	/**
	 * 地图缩略图
	 */
	public thumbnail: Laya.Sprite; //Image
	// private _updateBroadcastContent:XML;
	// public get updateBroadcastContent():XML
	// {
	// 	return _updateBroadcastContent;
	// }

	// public set updateBroadcastContent(value:XML)
	// {
	// 	_updateBroadcastContent = value;
	// 	NotificationManager.Instance.dispatchEvent(NotificationEvent.RECEIVED_NOTICE);
	// }

	public static get Instance(): BaseManager {
		if (!BaseManager._instance) BaseManager._instance = new BaseManager();
		return BaseManager._instance;
	}
	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}
	private get army(): BaseArmy {
		return ArmyManager.Instance.army;
	}
	private get userInfo(): UserInfo {
		return PlayerManager.Instance.currentPlayerModel.userInfo;
	}

	public setup() {
		ServerDataManager.listen(S2CProtocol.U_C_RELOADDIRTY, this, this.__reloadAgentDirtyHandler);
		ServerDataManager.listen(S2CProtocol.U_C_WORLD_PROSPERITY, this, this.__getWorldProsperityHandler);
		ServerDataManager.listen(S2CProtocol.U_C_WORLDBOSS_REPORT, this, this.__worldBossReportHandler);
		ServerDataManager.listen(S2CProtocol.U_C_DATARESET, this, this.__resetDataHandler);
		ServerDataManager.listen(S2CProtocol.U_BATTLE_REPORT, this, this.__battleInfoResultHandler);
		SocketManager.Instance.addEventListener(Laya.Event.CLOSE, this.__socketCloseHandler, this);
		ServerDataManager.listen(S2CProtocol.U_G_LOGIN_OTHER, this, this.__loginOtherHandler);
		ServerDataManager.listen(S2CProtocol.U_C_LOCK_SCREEN, this, this.__lockSceneHandler);
		ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_ROOM_CREATE, this, this.__createRoomHandler);
		ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_ROOM_INVITE, this, this.__roomInviteHandler);
		ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_CREATE, this, this.__createCampaignHandler);
		ServerDataManager.listen(S2CProtocol.U_C_GAME_PLOT, this, this.__gamePlotHandler);
		ServerDataManager.listen(S2CProtocol.U_C_MSG, this, this.__msgHandler);
		ServerDataManager.listen(S2CProtocol.U_C_CHANNEL_ALERT, this, this.__serverBroadcastHandler);
		ServerDataManager.listen(S2CProtocol.U_C_ARMY_CHANGESHARP, this, this.__armyChangeSharpHandler);
		ServerDataManager.listen(S2CProtocol.U_C_ARMY_SUPPROT, this, this.__addPawnHandler);
		ServerDataManager.listen(S2CProtocol.U_B_FIGHT_CANCELED, this, BaseManager.onFightCanceled);
		ServerDataManager.listen(S2CProtocol.U_C_PLAYER_LOGINSTATEE, this, this.__loginStateHandler);

		ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_CARDS, this, this.__campaignCardsHandler);
		ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_TAKE_CARD, this, this.__campaingTakeCardHandler);

		NotificationManager.Instance.addEventListener(MsgEventType.SESSION_OVER, this.__sessionOverHandler, this);
		NotificationManager.Instance.addEventListener(S2CProtocol.U_C_GAME_PLOT, this.__gamePlotActionHandler, this);
		NotificationManager.Instance.addEventListener(S2CProtocol.U_C_MSG, this.__showMsgHandler, this);
		StageReferance.stage.on(Laya.Event.CLICK, this, this.__stageClickHandler);
		StageReferance.stage.on(Laya.Event.RESIZE, this, this.__resizeHandler);
		// this.externalManager.addEventListener(ExternalInterfaceManager.SOUND_OFF, this,this.__setSoundOffHandler);
		// this.externalManager.addEventListener(ExternalInterfaceManager.SOUND_ON, this,this.__setSoundOnHandler);
		ServerDataManager.listen(S2CProtocol.U_C_WORLDBOSS_LOAD, this, this.__worldBossLoadHandler);
		ServerDataManager.listen(S2CProtocol.U_C_SECURITY_CODE, this, this.__securityCodeHandler);
		ServerDataManager.listen(S2CProtocol.U_C_SWITCH, this, this.__switchesUpdateHandler);

		ServerDataManager.listen(S2CProtocol.U_C_TOWER_REPORT, this, this.__towerReportHandler);
		ServerDataManager.listen(S2CProtocol.U_C_GUILDWAR_STATE, this, this.__guildWarStateHandler);
		ServerDataManager.listen(S2CProtocol.U_C_MATCH_STATE, this, this.__requestHandler);
		ServerDataManager.listen(S2CProtocol.U_WARFIELD_FORCE_QUIT, this, this.__forceQuitBattleCampaign);
		ServerDataManager.listen(S2CProtocol.U_CHECK_WARFIELD_COUNT_RS, this, this.__warFightRemainNumber);
		ServerDataManager.listen(S2CProtocol.U_CCC, this, this.__cccHandler);
		ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_STATE, this, this.__vehicleStartHandler);
		ServerDataManager.listen(S2CProtocol.U_C_LORDS_OPENSTATE, this, this.__warlordsOpenHandler);
		ServerDataManager.listen(S2CProtocol.U_C_PLAYER_SPACE_CREATE, this, this.__createSpaceHandler);
		ServerDataManager.listen(S2CProtocol.U_C_PLAYER_RETURN_TO_SPACE, this, this.__returnSpaceHandler);
		ServerDataManager.listen(S2CProtocol.U_C_VIPMOUNT_STATE, this, this.__vipMountStateHandler);
		ServerDataManager.listen(S2CProtocol.U_C_MINE_ACTIVE_STATE, this, this.__mineralHandler);
		ServerDataManager.listen(S2CProtocol.U_C_PET_RANK_REWARD, this, this.__petRankRewardHandler);
		ServerDataManager.listen(S2CProtocol.U_C_MULITY_CAMPAIGN_REQUEST, this, this.__mulityCampaignRequestHandler);
		ServerDataManager.listen(S2CProtocol.U_C_VIPCUSTOM_NOTIFY, this, this.__vipCustomNotifyHandler);
		ServerDataManager.listen(S2CProtocol.U_C_PVP_TIMER, this, this.__pvpTimerHandler);
		ServerDataManager.listen(S2CProtocol.U_C_SEVEN_SIGN_INFO, this, this.sevenLoginDayInfo);
		ServerDataManager.listen(S2CProtocol.U_C_GROWTH_FUND_INFO, this, this.growthFundInfo);
		ServerDataManager.listen(S2CProtocol.U_C_RECOVER, this, this.onRecoverHandler);
		ServerDataManager.listen(S2CProtocol.U_C_CROSSMULTI_MATCHSTATE, this, this.__crossMutiStateHandler);
		ServerDataManager.listen(S2CProtocol.U_C_PETISLAND_BOSS_START, this, this.__petBossSwitchHandler);
		ServerDataManager.listen(S2CProtocol.U_C_TREASURE_MINE_INFO, this, this.__treasureInfoHandler);
		ServerDataManager.listen(S2CProtocol.U_C_UIPLAY_LIST, this, this.__uiPlayListInfo);
		
	}

	private __petBossSwitchHandler(pkg: PackageIn) {
		let msg: PetIslandDefendStateMsg = pkg.readBody(PetIslandDefendStateMsg) as PetIslandDefendStateMsg;
		let petBossModel: PetBossModel = CampaignManager.Instance.petBossModel;
		petBossModel.mapId = msg.mapId;
		petBossModel.isOpen = msg.mapId != 0 ? true : false;
		// petBossModel.leftTime = Int64Utils.int64ToNumber(msg.leftTime as Long);
		petBossModel.leftTime = parseInt(msg.leftTime.toString());
		petBossModel.heroId = msg.bossId;
		if (msg.peaceMiddle > 0 || msg.peaceHigh > 0 || msg.peaceBoss > 0) {
			petBossModel.countArr = [msg.peaceMiddle, msg.peaceHigh, msg.peaceBoss];
		}
		petBossModel.currentRagePoint = msg.ragePoint;
		//图标右上角活动数量提示
		let petBossCount: number = petBossModel.isOpen ? 1 : 0;
		// InfoTipsManager.instance.updateValue(InfoTipsConfig.PET_BOSS,petBossCount);
		if (!petBossModel.isOpen) {
			TaskTraceTipManager.Instance.cleanByType(TipMessageData.PET_BOSS);
		} else if (ArmyManager.Instance.thane.grades >= OpenGrades.PET && BaseManager.petBossMapId != petBossModel.mapId) {
			DelayActionsUtils.Instance.addAction(new AlertTipAction("", this.__petBossOpenHandler));
		}
		MsgMan.notifyObserver(CampaignEvent.PET_BOSS_SWITCH, null);
		BaseManager.petBossMapId = petBossModel.mapId;
	}

	private __petBossOpenHandler(result: string): void {
		var data: TipMessageData = new TipMessageData();
		data.type = TipMessageData.PET_BOSS;
		data.title = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.tip.title");
		data.content = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.PetBossIsOpen");
		TaskTraceTipManager.Instance.cleanByType(TipMessageData.PET_BOSS);
		TaskTraceTipManager.Instance.showView(data);
	}

	/**资源找回 */
	private onRecoverHandler(pkg: PackageIn) {
		let infosMsg: RecoverInfosMsg = pkg.readBody(RecoverInfosMsg) as RecoverInfosMsg;
		ExpBackModel.instance.openState = infosMsg.openState;
		ExpBackModel.instance.freeExpValue = infosMsg.freeGp;
		ExpBackModel.instance.freeGoldValue = infosMsg.freeGold;
		ExpBackModel.instance.extraExpValue = infosMsg.otherGp;
		ExpBackModel.instance.extraGoldValue = infosMsg.otherGold;
		NotificationManager.Instance.dispatchEvent(ExpBackEvent.UPDATE_EXPBACK_STATUS, infosMsg.openState);
	}

	/**
	 *
	 * @param pkg 成长基金
	 */
	private growthFundInfo(pkg: PackageIn) {
		let msg: GrowthFundDataInfoRsp = pkg.readBody(GrowthFundDataInfoRsp) as GrowthFundDataInfoRsp;
		if (!this.ctrlData) return;
		let basePackageArr: Array<GrowthFundItemInfo> = this.ctrlData.growthFundInfoArr;
		let len: number = basePackageArr.length;
		let baseItem: GrowthFundItemInfo;
		if (msg.recNum > 0) {
			this.ctrlData.hasGetBindCount = msg.recNum;
		}
		this.ctrlData.isPay = msg.isPay;
		PlayerManager.Instance.currentPlayerModel.playerInfo.hasBuyGrowthFund = msg.isPay == 1 ? false : true;
		PlayerManager.Instance.currentPlayerModel.playerInfo.todayHasClickGrowthFund = msg.isOpen == 1 ? false : true;
		for (let i = 0; i < len; i++) {
			baseItem = basePackageArr[i];
			if (baseItem) {
				if (baseItem.grade == 0 && msg.isPay != 4) {
					baseItem.packageState = msg.isPay;
					baseItem.sortOrder = this.setOrder(baseItem.packageState);
				} else if (baseItem.grade == 0 && msg.isPay == 4) {
					baseItem.packageState = 3;
					baseItem.sortOrder = this.setOrder(baseItem.packageState);
				} else {
					if (!this.ctrlData.initTotalBindFlag) {
						this.ctrlData.totalBindCount += baseItem.bindDiamondCount;
					}
				}
				for (let i: number = 0; i < msg.fundMsg.length; i++) {
					let fundData: FundDataMsg = msg.fundMsg[i] as FundDataMsg;
					if (fundData && fundData.grade == baseItem.grade) {
						baseItem.packageState = fundData.status;
						baseItem.sortOrder = this.setOrder(baseItem.packageState);
						break;
					}
				}
			}
		}
		if (this.ctrlData.totalBindCount > 0) {
			this.ctrlData.initTotalBindFlag = true;
		}
		//数组排序（可领取>不能领取>已经领取）
		basePackageArr = ArrayUtils.sortOn(basePackageArr, ["sortOrder", "grade"], ArrayConstant.DESCENDING | ArrayConstant.NUMERIC);
		this.ctrlData.growthFundInfoArr = basePackageArr;
	}

	private setOrder(value: number): number {
		let returnNum: number = 0;
		switch (value) {
			case 1:
				returnNum = 2;
				break;
			case 2:
				returnNum = 1;
				break;
			case 3:
				returnNum = 3;
				break;
		}
		return returnNum;
	}

	/**七日登录信息返回 */
	private sevenLoginDayInfo(pkg: PackageIn) {
		let msg: SevenSignInfoRsp = pkg.readBody(SevenSignInfoRsp) as SevenSignInfoRsp;
		if (msg) {
			let reward: SevenLoginInfo;
			let rewardInfo: RewardInfo;
			let rewardInfoArr: Array<SevenLoginInfo> = [];
			this.ctrlData.sevenLoginStartTime = msg.startTime;
			this.ctrlData.sevenLoginTotalDays = msg.days;
			this.getSevenLoginEndTime(msg.startTime);
			for (let i = 0; i < msg.rewardInfo.length; i++) {
				rewardInfo = msg.rewardInfo[i] as RewardInfo;
				if (rewardInfo) {
					reward = new SevenLoginInfo();
					reward.day = rewardInfo.days;
					reward.goodsInfo = this.getSevenRewardInfo(rewardInfo.item);
					reward.status = this.ctrlData.getSevenLoginRewardStatus(reward.day, msg.rewardSite, msg.days);
					rewardInfoArr.push(reward);
				}
			}
			rewardInfoArr = ArrayUtils.sortOn(rewardInfoArr, ["day"], [ArrayConstant.NUMERIC]);
			this.ctrlData.sevenLoginRewardArr = rewardInfoArr;
		}
	}

	/**
	 * 得到七日登录活动奖励物品
	 * @param str
	 */
	getSevenRewardInfo(str: string): GoodsInfo {
		let goods: GoodsInfo;
		if (!StringHelper.isNullOrEmpty(str)) {
			let strArr: Array<string> = str.split(",");
			if (strArr && strArr.length == 2) {
				goods = new GoodsInfo();
				goods.templateId = parseInt(strArr[0]);
				goods.count = parseInt(strArr[1]);
			}
		}
		return goods;
	}

	/**
	 * 得到当前是七日登录活动的第几天
	 * @param startTime 开始时间戳(秒)
	 */
	private getSevenLoginEndTime(startTime: number) {
		let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
		let startDate: Date = Utils.formatTimeZone(startTime * 1000, zoneOffset); //活动开始时间
		let hours: number = startDate.getHours();
		let minutes: number = startDate.getMinutes();
		let seconds: number = startDate.getSeconds();
		let sp: number = (23 - hours) * 1000 * 60 * 60 + (59 - minutes) * 1000 * 60 + (59 - seconds) * 1000;
		let totalAdd: number = sp + 5 * 1000 * 60 * 60; //开始时间跟第一天重置时间相差的毫秒数
		this.ctrlData.sevenLoginEndTime = startDate.getTime() + totalAdd + 6 * 24 * 60 * 60 * 1000;
	}

	private get ctrlData(): WelfareData {
		if (this.control) return this.control.data;
		return null;
	}

	private get control(): WelfareCtrl {
		return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
	}

	private __vipCustomNotifyHandler(pkg: PackageIn) {
		let msg = pkg.readBody(PropertyMsg) as PropertyMsg;
		msg.param1; // 1为打开, 0为关闭
		msg.param4; // QQ号码
		msg.param5; // 昵称
		if (msg.param1 == 1) {
			let content: string = LangManager.Instance.GetTranslation("yishi.view.tips.VIPCustomTipView.QQTips", msg.param4, msg.param5);
			let tipData: TipMessageData = new TipMessageData();
			tipData.type = TipMessageData.VIP_CUSTOM;
			tipData.title = msg.param4;
			tipData.content = content;
			TaskTraceTipManager.Instance.showView(tipData);
		} else {
			TaskTraceTipManager.Instance.cleanByType(TipMessageData.VIP_CUSTOM);
		}
	}

	private __pvpTimerHandler(pkg: PackageIn) {
		let msg: TimerInfoListMsg = pkg.readBody(TimerInfoListMsg) as TimerInfoListMsg;

		let timerInfoMsg;
		for (const key in msg.timerInfo) {
			if (Object.prototype.hasOwnProperty.call(msg.timerInfo, key)) {
				let timerInfoMsg: any = msg.timerInfo[key];
				if (timerInfoMsg.type == TYPES_WARLOAD_PVP) {
					//众神之战
					WarlordsManager.Instance.model.initTimerInfo(timerInfoMsg);
				}
			}
		}
	}

	/**是否活动副本(试炼之塔、泰拉神庙) */
	private isActivity: boolean = false;
	private isInCampaign: boolean = false;
	private confirmBack(b: boolean, flag: boolean, data: any) {
		if (b) {
			let roomInfo = data.roomInfo;
			if (!roomInfo && data instanceof RoomInfo) {
				roomInfo = data;
			}

			if (roomInfo && roomInfo.mapTemplate) {
				if (roomInfo.mapTemplate.isKingTower) {
					if (KingTowerManager.Instance.kingTowerInfo.isKingTowerOverMaxCount) {
						MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("kingtower.chat.invite.countNotEnough"));
						return true;
					}
				} else if (roomInfo.mapTemplate.isTrailTower) {
					if (this.playerInfo.isTrailOverMaxCount) {
					}
				}
			}

			if (this.isInCampaign) {
				this.isInCampaign = false;
				let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
				let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
				let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
				let content: string = LangManager.Instance.GetTranslation("chat.view.ChatView.EnterCampaignTips");
				let checkTxt: string = LangManager.Instance.GetTranslation("BaseManager.SimpleAlertHelper.tipText");
				if (roomInfo && roomInfo.mapTemplate && roomInfo.mapTemplate.isKingTower) {
					// 房主已进副本  默认勾选 且 不显示勾选框
					SimpleAlertHelper.Instance.Show(
						SimpleAlertHelper.SIMPLE_ALERT,
						{ checkRickText: checkTxt, roomInfo: roomInfo, checkDefault: true },
						prompt,
						content,
						confirm,
						cancel,
						this.confirmBack.bind(this)
					);
				} else if (!this.isActivity && PlayerManager.Instance.currentPlayerModel.playerInfo.multiCopyCount >= 1) {
					// 房主已进副本  默认勾选 且 显示勾选框
					SimpleAlertHelper.Instance.Show(
						SimpleAlertHelper.CHATINVIE_ALERT,
						{ checkRickText: checkTxt, roomInfo: roomInfo, checkDefault: true },
						prompt,
						content,
						confirm,
						cancel,
						this.confirmBack.bind(this)
					);
				} else if (roomInfo && roomInfo.mapTemplate && roomInfo.mapTemplate.isTaila) {
					// 周副本(泰拉神庙)默认勾选 且 看情况显示勾选框,  也属于活动isActivity = true, 所以提前判断
					let type = this.playerInfo.tailaCount > 0 ? SimpleAlertHelper.CHATINVIE_ALERT : SimpleAlertHelper.SIMPLE_ALERT;
					SimpleAlertHelper.Instance.Show(
						type,
						{ checkRickText: checkTxt, roomInfo: roomInfo, checkDefault: this.playerInfo.tailaCount > 0 },
						prompt,
						content,
						confirm,
						cancel,
						this.confirmBack.bind(this)
					);
				} else if (this.isActivity && PlayerManager.Instance.currentPlayerModel.playerInfo.trialCount >= 1) {
					SimpleAlertHelper.Instance.Show(
						SimpleAlertHelper.CHATINVIE_ALERT,
						{ checkRickText: checkTxt, roomInfo: roomInfo, checkDefault: true },
						prompt,
						content,
						confirm,
						cancel,
						this.confirmBack.bind(this)
					);
				} else {
					SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, data, prompt, content, confirm, cancel, this.confirmBack.bind(this));
				}
			} else {
				if (roomInfo) {
					RoomListSocketOutManager.addRoomById(roomInfo.roomType, roomInfo.id, "", true, !flag);
				} else {
					RoomListSocketOutManager.addRoomById(data.roomType, data.id, "", true, !flag);
				}
			}
		}
	}

	private __mulityCampaignRequestHandler(pkg: PackageIn) {
		this.isActivity = false;

		/**房间信息对象 */
		let roomInfo: RoomInfo = new RoomInfo();

		/**协议消息对象 */
		let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;

		/**校验是不是聊天场景触发的[快捷:0;专属:1] */
		if (msg.param3 != 1) {
			if (msg.param10 != null && msg.param10 != undefined && msg.param10 != 0) {
				return;
			}
		}

		/**房间不存在 */
		if (msg.param11 != null && msg.param11 != undefined && msg.param11 == 0) {
			return;
		}

		/**房间标识 */
		roomInfo.id = msg.param1;
		/**房间类型 */
		roomInfo.roomType = msg.param3;

		/**竞技房间 */
		if (roomInfo.roomType == 1) {
			/**竞技等级校验 */
			if (ArmyManager.Instance.thane.grades < OpenGrades.CHALLENGE) {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pvp.view.PvPMultiView.command01"));
				return;
			}
		}

		/**副本对象 */
		let templateInfo: t_s_campaignData;

		/**副本标识 */
		if (msg.param2 != null && msg.param2 != undefined) {
			roomInfo.campaignId = msg.param2;
		}

		/**副本是否已经开始 */
		this.isInCampaign = msg.param7 && roomInfo.campaignId != 0;

		/**副本名称 */
		let mapName: string;
		/**副本难度范围 */
		let difficultyGrade: string = "";

		/**非副本房间 */
		if (roomInfo.campaignId == 0) {
			mapName = "";
		}

		/**副本房间 */
		else {
			templateInfo = roomInfo.mapTemplate ? roomInfo.mapTemplate : CampaignManager.Instance.mapModel.campaignTemplate;

			/**王者之塔 */
			if (templateInfo.isKingTower) {
				/**活动字符串 */
				let activity: string = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.difficultyGrade3");

				difficultyGrade = KingTowerManager.Instance.kingTowerInfo.difficultyStep(templateInfo.DifficutlyGrade);
				difficultyGrade = LangManager.Instance.GetTranslation("public.parentheses1", difficultyGrade);

				mapName = templateInfo.CampaignNameLang + difficultyGrade + "_" + activity;
			}

			/**非王者之塔 */
			else {

				/**活动副本 */
				if (templateInfo.SonTypes != 0) {
					this.isActivity = true;
					difficultyGrade = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.difficultyGrade3");
				}

				/**非活动副本 */
				else if (roomInfo.mapTemplate.DifficutlyGrade == 1) {
					difficultyGrade = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.difficultyGrade1");
				}

				if (difficultyGrade) {
					difficultyGrade = LangManager.Instance.GetTranslation("public.parentheses1", difficultyGrade);
				}

				mapName = templateInfo.CampaignNameLang + difficultyGrade;
			}
		}

		/**接受文本 */
		let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
		/**取消文本 */
		let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
		/**提示文本 */
		let prompt: string = LangManager.Instance.GetTranslation("public.prompt");

		/**提示正文 */
		let content: string = "";

		/**多人副本 */
		if (roomInfo.campaignId != 0) {
			content = LangManager.Instance.GetTranslation("chat.view.ChatView.EnterRoomTips", mapName, roomInfo.id);
		}

		/**竞技场 */
		else {
			content = LangManager.Instance.GetTranslation("chat.view.ChatView.EnterArenaTips", roomInfo.id);
		}

		/**校验提示正文 */
		let checkTxt: string = LangManager.Instance.GetTranslation("BaseManager.SimpleAlertHelper.tipText");

		/**多人副本处理 */
		if (!this.isActivity && templateInfo && roomInfo.campaignId != 0) {
			// 房主未进副本  默认勾选 且 不显示勾选框
			// SimpleAlertHelper.Instance.Show(
			// 	SimpleAlertHelper.SIMPLE_ALERT,
			// 	{ roomInfo: roomInfo, checkDefault: true },
			// 	prompt,
			// 	content,
			// 	confirm,
			// 	cancel,
			// 	this.confirmBack.bind(this)
			// );

			this._roomInvite(new RoomInviteMsg({
				roomId: roomInfo.id,
				nickName: msg.param6,
				name: msg.param4,
				roomType: roomInfo.roomType,
				tempId: roomInfo.campaignId,
				position: msg.param7 ? 1 : 0,
				bossCount: -1,
				isCross: roomInfo.isCross
			}), true);
		}

		/**王者之塔 */
		else if (!this.isActivity && templateInfo && templateInfo.isKingTower) {
			// SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, roomInfo, prompt, content, confirm, cancel, this.confirmBack.bind(this));

			this._roomInvite(new RoomInviteMsg({
				roomId: roomInfo.id,
				nickName: msg.param6,
				name: msg.param4,
				roomType: roomInfo.roomType,
				tempId: roomInfo.campaignId,
				position: msg.param7 ? 1 : 0,
				bossCount: -1,
				isCross: roomInfo.isCross
			}), true);
		}

		/**泰拉神庙 */
		else if (this.isActivity && templateInfo && templateInfo.isTaila) {
			// 周副本(泰拉神庙)默认勾选 且 看情况显示勾选框,  也属于活动isActivity = true, 所以提前判断
			// let type = this.playerInfo.tailaCount > 0 ? SimpleAlertHelper.CHATINVIE_ALERT : SimpleAlertHelper.SIMPLE_ALERT;
			// SimpleAlertHelper.Instance.Show(
			// 	type,
			// 	{ checkRickText: checkTxt, roomInfo: roomInfo, checkDefault: this.playerInfo.tailaCount > 0 },
			// 	prompt,
			// 	content,
			// 	confirm,
			// 	cancel,
			// 	this.confirmBack.bind(this)
			// );

			this._roomInvite(new RoomInviteMsg({
				roomId: roomInfo.id,
				nickName: msg.param6,
				name: msg.param4,
				roomType: roomInfo.roomType,
				tempId: roomInfo.campaignId,
				position: msg.param7 ? 1 : 0,
				bossCount: -1,
				isCross: roomInfo.isCross
			}), true);
		}

		/**试炼之塔 */
		else if (this.isActivity && templateInfo && templateInfo.isTrailTower) {
			// SimpleAlertHelper.Instance.Show(
			// 	SimpleAlertHelper.CHATINVIE_ALERT,
			// 	{ checkRickText: checkTxt, roomInfo: roomInfo, checkDefault: true },
			// 	prompt,
			// 	content,
			// 	confirm,
			// 	cancel,
			// 	this.confirmBack.bind(this)
			// );

			this._roomInvite(new RoomInviteMsg({
				roomId: roomInfo.id,
				nickName: msg.param6,
				name: msg.param4,
				roomType: roomInfo.roomType,
				tempId: roomInfo.campaignId,
				position: msg.param7 ? 1 : 0,
				bossCount: -1,
				isCross: roomInfo.isCross
			}), true);
		}

		/**竞技场 */
		else {
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, roomInfo, prompt, content, confirm, cancel, this.confirmBack.bind(this));
		}
	}

	private __reloadAgentDirtyHandler(pkg: PackageIn) {
		let path: string = PathManager.AgentZhanPath;
		ResMgr.Instance.loadRes(path, this.onAgentDirtyLoadComplete.bind(this));
	}

	private onAgentDirtyLoadComplete(ret) {
		AgentFilterManager.Instance.setup(String(ret));
	}

	private __petRankRewardHandler(pkg: PackageIn) {
		// let msg:RankRewardMsg = new RankRewardMsg();
		// msg = pkg.readBody(msg) as RankRewardMsg;
		// if(msg.status == PetChallengeController.STATUS_HAS)
		// {
		// 	if(msg.type == PetChallengeController.RANK_DAY)
		// 	{
		// 		this.playerInfo.canAcceptPetChallDayReward = true;
		// 	}
		// 	else if(msg.type == PetChallengeController.RANK_WEEK)
		// 	{
		// 		this.playerInfo.canAcceptPetChallWeekReward = true;
		// 	}
		// }
	}
	private __vipMountStateHandler(pkg: PackageIn) {
		let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
		let tip: TipMessageData;
		if (msg.param7 == true) {
			tip = new TipMessageData();
			tip.type = TipMessageData.VIP_MOUNT_ACTIVITY;
			tip.content = LangManager.Instance.GetTranslation("tasktracetip.view.VipMountActivateTipView.Content");
			TaskTraceTipManager.Instance.showView(tip);
			MountsManager.Instance.requestWildSoulList();
		} else {
			tip = new TipMessageData();
			tip.type = TipMessageData.VIP_MOUNT_LOSE;
			tip.content = LangManager.Instance.GetTranslation("tasktracetip.view.VipMountLoseTipView.Content");
			TaskTraceTipManager.Instance.showView(tip);
		}
	}

	private __createSpaceHandler(pkg: PackageIn) {
		let msg = pkg.readBody(RoomEnterMsg) as RoomEnterMsg;
		Logger.base("[BaseManager]进天空之城", msg);
		let self: RoomPlayerMsg = msg.player[0] as RoomPlayerMsg;
		self.campaignId = SpaceManager.SpaceMapId;
		if (self.playerId != ArmyManager.Instance.army.userId) {
			return;
		}
		if (SpaceManager.Instance.exit) {
			SpaceManager.Instance.dispose();
		}
		SocketDataProxyManager.Instance.addCreateSceneQueue(pkg, SceneType.SPACE_SCENE, pkg.code.toString(), false);
		SpaceManager.Instance.setup(self.campaignId, true);
		PlayerManager.Instance.currentPlayerModel.spaceMapId = self.campaignId;
		SpaceTemplateManager.Instance.setup();
		// SpaceManager.Instance.model.mapNodesData = SpaceTemplateManager.Instance.nodeDic[self.campaignId];
		SpaceManager.Instance.model.mapNodesData = SpaceTemplateManager.Instance.nodeDic.get(self.campaignId);
		SpaceManager.Instance.readMember(self);
		if (SwitchPageHelp.isEnterSpaceNow()) {
			Logger.base("[BaseManager]切换到天空之城场景");
			SceneManager.Instance.setScene(SceneType.SPACE_SCENE, { isShowLoading: false }, true);
		}
	}

	private __returnSpaceHandler(pkg: PackageIn) {
		let msg = pkg.readBody(RoomEnterMsg) as RoomEnterMsg;
		Logger.base("[BaseManager]返回天空之城", msg);
		let self: RoomPlayerMsg = msg.player[0] as RoomPlayerMsg;
		if (self.playerId != ArmyManager.Instance.army.userId) {
			return;
		}
		SpaceManager.Instance.readMember(self);
		if (SceneManager.Instance.currentType != SceneType.SPACE_SCENE) {
			SceneManager.Instance.setScene(SceneType.SPACE_SCENE, { isShowLoading: false }, true);
		}
	}

	//获得跨服战场剩余收益次数
	private __warFightRemainNumber(pkg: PackageIn) {
		let self = this;
		let msg: CampaignReqMsg = pkg.readBody(CampaignReqMsg) as CampaignReqMsg;
		let enter: Function = (b: boolean, flag: boolean = false) => {
			if (b) {
				let wmsg: WorldBossMsg = new WorldBossMsg();
				wmsg.param1 = msg.paraInt1;
				self.sendProtoBuffer(C2SProtocol.C_ENTER_WARFIELD, wmsg);
			}
		};
		if (!msg.paraBool1) {
			let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
			let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
			let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
			let content: string = LangManager.Instance.GetTranslation("pvpselectFrame.enterwarTip");
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, enter);
		} else {
			enter(true);
		}
	}
	private __forceQuitBattleCampaign(pkg: PackageIn) {
		DelayActionsUtils.Instance.addAction(new AlertTipAction(null, this.quitBattleCampaignReport.bind(this)));
	}
	private quitBattleCampaignReport(obj: Object) {
		let str: string = LangManager.Instance.GetTranslation("BaseManager.forceQuitBattleCampaign");
		let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
		SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, str);
	}

	private get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	private get playerModel(): PlayerModel {
		return PlayerManager.Instance.currentPlayerModel;
	}

	private __requestHandler(pkg: PackageIn) {
		let msg = pkg.readBody(MatchStateMsg) as MatchStateMsg;
		this.playerInfo.beginChanges();
		this.playerInfo.isPVPStart = msg.matchState;
		this.playerInfo.commit();
	}

	private __guildWarStateHandler(pkg: PackageIn) {
		let msg: GuildMsg = pkg.readBody(GuildMsg) as GuildMsg;
		//true开放公会战, false未开放公会战.
		this.playerInfo.beginChanges();
		this.playerInfo.gvgIsOpen = msg.param5;
		this.playerInfo.commit();
	}
	private __mineralHandler(pkg: PackageIn) {
		let msg: GuildMsg = pkg.readBody(GuildMsg) as GuildMsg;
		this.playerInfo.beginChanges();
		this.playerInfo.mineralIsOpen = msg.param5;
		this.playerInfo.commit();
	}

	private __getWorldProsperityHandler(pkg: PackageIn) {
		let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
		this.playerInfo.beginChanges();
		this.playerInfo.worldProsperity = msg.param1;
		this.playerInfo.commit();
	}

	private __switchesUpdateHandler(pkg: PackageIn) {
		let msg: SwitchInfoListMsg = pkg.readBody(SwitchInfoListMsg) as SwitchInfoListMsg;

		for (let i = 0; i < msg.switches.length; i++) {
			let swmsg: SwitchInfoMsg = msg.switches[i] as SwitchInfoMsg;

			switch (swmsg.switchType) {
				case 1: //登陆器开关
					ConfigManager.info.CLIENT_DOWNLAND = swmsg.isOpen;
					if (ConfigManager.info.CLIENT_DOWNLAND) {
						TaskManage.Instance.clientDownSwitchHandler();
					}
					break;
				case 2: //手机任务开关
					ConfigManager.info.MOBILE_TASK = swmsg.isOpen;
					if (ConfigManager.info.MOBILE_TASK) {
						TaskManage.Instance.mobileSwitchHandler();
					}
					break;
				case 3: //客服系统
					ConfigManager.info.CUSTOMER_SERVICE = swmsg.isOpen;
					NotificationManager.Instance.dispatchEvent(NotificationEvent.CUSTOMER_SERVICE_SWITCH, swmsg.isOpen);
					break;
				case 11: //客服语音开关
					ConfigManager.info.VOICE = swmsg.isOpen;
					break;
				case 12: //本地竞技
					break;
				case 16: //战场
					ConfigManager.info.PVP_CAMPAIGN = swmsg.isOpen;
					ConfigManager.info.PVP_CAMPAIGN_BEGIN_DATE = DateFormatter.parse(swmsg.beginDate, "YYYY-MM-DD hh:mm:ss");
					ConfigManager.info.PVP_CAMPAIGN_END_DATE = DateFormatter.parse(swmsg.endDate, "YYYY-MM-DD hh:mm:ss");
					break;
				case 17: //跨服战场积分
					ConfigManager.info.CROSSSCORE = swmsg.isOpen;
					break;
				case 18: //跨服排行榜
					ConfigManager.info.CROSSSORT = swmsg.isOpen;
					break;
				case 1001: //facebook任务开关
					ConfigManager.info.FACE_BOOK = swmsg.isOpen;
					// SmallMapBar.Instance.checkFaceBookBtn();
					break;
				case 2002: //VIP客服通知
					break;
				case 2023: //云端历险
					ConfigManager.info.MONOPOLY = swmsg.isOpen;
					break;
				case 3003: //英灵钻石强化
					ConfigManager.info.PET_STRONG = swmsg.isOpen;
					break;
				case 3008: //夺宝奇兵开关
					ConfigManager.info.GEMMAZE = swmsg.isOpen;
					NotificationManager.Instance.dispatchEvent(SwitchEvent.SWITCH_GEMMAZE); //夺宝奇兵开关切换
					break;
				case 3016: //地下迷宫自动爬塔
					ConfigManager.info.AUTO_MAZE = swmsg.isOpen;
					break;
				case 3019: //世界boss buff增益
					ConfigManager.info.WORLDBOSS_BUFF = swmsg.isOpen;
					break;
				case 2007: //IOS兑换码开关
					if (Utils.isIOS()) {
						ConfigManager.info.IOS_ACTIVITY_CODE = swmsg.isOpen;
					}
					break;
				case 2010: //综合入口页签
					ConfigManager.info.COMPREHENSIVE_ENTRANCE = swmsg.isOpen;
					NotificationManager.Instance.dispatchEvent(SwitchEvent.COMPREHENSIVE_ENTRANCE); //综合入口页签
					break;
				case 2011: //综合入口-官网按钮
					ConfigManager.info.COMPREHENSIVE_WEBSITE = swmsg.isOpen;
					if (Utils.isWxMiniGame()) {
						ConfigManager.info.COMPREHENSIVE_WEBSITE = false;
					}
					NotificationManager.Instance.dispatchEvent(SwitchEvent.COMPREHENSIVE_WEBSITE); //综合入口-官网按钮
					break;
				case 2012: //综合入口-公众号
					ConfigManager.info.COMPREHENSIVE_OFFICIAL_ACCOUNTS = swmsg.isOpen;
					NotificationManager.Instance.dispatchEvent(SwitchEvent.COMPREHENSIVE_OFFICIAL_ACCOUNTS); //综合入口-公众号
					break;
				case 2013: //综合入口-游戏推送
					ConfigManager.info.COMPREHENSIVE_PUSH = swmsg.isOpen;
					if (Utils.isWxMiniGame()) {
						ConfigManager.info.COMPREHENSIVE_PUSH = false;
					}
					NotificationManager.Instance.dispatchEvent(SwitchEvent.COMPREHENSIVE_PUSH); //综合入口-客服弹窗
					break;
				case 2014: //综合入口-客服弹窗
					ConfigManager.info.COMPREHENSIVE_CUSTOMER = swmsg.isOpen;
					NotificationManager.Instance.dispatchEvent(SwitchEvent.COMPREHENSIVE_CUSTOMER); //综合入口-客服弹窗
					break;
				case 2015: //个人中心-隐私相关
					ConfigManager.info.COMPREHENSIVE_PRIVATE = swmsg.isOpen;
					break;
				case 2009: //聊天翻译开关
					ConfigManager.info.CHAT_TRANSLATE = swmsg.isOpen;
					break;
				case 2016: //小游戏IOS支付
					if (Utils.isWxMiniGame() && Laya.Browser.onIOS) {
						ConfigManager.info.MINI_GAME_PAY = swmsg.isOpen;
					}
					break;
				case 2017: //坐骑分享
					ConfigManager.info.MOUNT_SHARE = swmsg.isOpen;
					NotificationManager.Instance.dispatchEvent(SwitchEvent.MOUNT_SHARE); //综合入口-客服弹窗
					break;
				case 2018: //禁止发言
					ConfigManager.info.CHAT_FORBID = swmsg.isOpen;
					ConfigManager.info.CHAT_FORBID_BEGIN_DATE = DateFormatter.parse(swmsg.beginDate, "YYYY-MM-DD hh:mm:ss");
					ConfigManager.info.CHAT_FORBID_END_DATE = DateFormatter.parse(swmsg.endDate, "YYYY-MM-DD hh:mm:ss");
					break;
				case 2020: //灰度开关
					ConfigManager.info.SYS_OPEN = swmsg.isOpen;
					break;
				case 2021: //灰度开关
					ConfigManager.info.STORE_RATING = swmsg.isOpen;
					break;
				case 2022: //microApp
					ConfigManager.info.MICRO_APP = swmsg.isOpen;
					NotificationManager.Instance.dispatchEvent(SwitchEvent.MICRO_APP); //
					break;
				case 2025: //iOS支付
					ConfigManager.info.IOS_PAY = swmsg.isOpen;
					break;
				case 2026: //QQ特权礼包
					ConfigManager.info.QQ_HALL_GIFT = swmsg.isOpen;
					break;
				case 3066: //绑定邮箱开关
					ConfigManager.info.BIND_MAIL = swmsg.isOpen;
					break;
				case 3067: //绑定手机开关
					ConfigManager.info.BIND_PHONE = swmsg.isOpen;
					break;
				case 3068: //充值轮盘
					ConfigManager.info.RECHARG_LOTTERY_REFRESH = swmsg.isOpen;
					break;
				case 3069: //discord
					ConfigManager.info.Discord = swmsg.isOpen;
					break;
				/***************************4001 - 4100 分享渠道********************************/
				case SHARE_CHANNEL.FB:
					ConfigManager.info.FB_SHARE = swmsg.isOpen;
					break;
				case SHARE_CHANNEL.Twitter:
					ConfigManager.info.Twitter_SHARE = swmsg.isOpen;
					break;
				case SHARE_CHANNEL.Discord:
					ConfigManager.info.Discord_SHARE = swmsg.isOpen;
					break;
				case SHARE_CHANNEL.Instagram:
					ConfigManager.info.Instagram_SHARE = swmsg.isOpen;
					break;
				case SHARE_CHANNEL.Telegram:
					ConfigManager.info.Telegram_SHARE = swmsg.isOpen;
					break;
				case SHARE_CHANNEL.Whatsapp:
					ConfigManager.info.Whatsapp_SHARE = swmsg.isOpen;
					break;
				case SHARE_CHANNEL.Youtube:
					ConfigManager.info.Youtube_SHARE = swmsg.isOpen;
					break;
				/***************************4001 - 4100 分享渠道********************************/
			}
			ConfigManager.info.SWITCH.set(swmsg.switchType, swmsg);
		}

		// 开关控制的模块 请求信息
		this.__switchesUpdateHandlerCallBack();
	}

	private __switchesUpdateHandlerCallBack() {
		WelfareManager.Instance.reqBindState();
	}

	/**
	 * URL编码
	 * @param str:  需要编码的字符串
	 * @param code: 编码方式
	 * @return : 编码结果
	 *
	 */
	private myUrlEncode(str: string, code: string): string {
		let stringresult: string = "";
		let byte: ByteArray = new ByteArray();
		byte.writeMultiByte(str, code);
		for (let i: number; i < byte.length; i++) {
			stringresult += escape(String.fromCharCode(byte[i]));
		}
		return stringresult;
	}
	/**
	 * 开心网防沉迷信息处理
	 *
	 */
	private setKaiXinAAS() {
		// if(PathManager.info.AASRequestPath == null || PathManager.info.AASRequestPath == "")
		// {
		// 	return;
		// }
		// let sign:string = "aid=5218" + "&ts=" + this.playerModel.sysCurTimeBySecond + "&uid=" + this.userInfo.user + "&ver=1" +
		// 	"&" + "9I2lX78U4$Kd%OaBs#aQMJ";
		// let aasUrl:string = PathManager.info.AASRequestPath + "?uid=" + this.userInfo.user + "&aid=5218" +
		// 	"&ts=" + this.playerModel.sysCurTimeBySecond + "&ver=1" + "&sign=" + MD5.hash(sign);
		// let args:URLVariables = new URLVariables();
		// args['url'] = this.myUrlEncode(aasUrl,"UTF-8");
		// let path:string = PathManager.info.REQUEST_PATH + "kaxinaasservlet";
		// LoaderManagerII.Instance.load(path,LoaderInfo.TEXT_LOADER,LoaderPriority.Priority_8,this.__onGetResultCompleted,null,null,null,args,URLRequestMethod.POST)
	}

	private __onGetResultCompleted(info: LoaderInfo, content: Object) {
		// let result:any = JSON.parse(content.toString());
		// if(result == null)return;
		// let real:boolean = result["v_idchecked"] == 1;//1:认证                         0: 未认证
		// let age:boolean = result["v_agechecked"] == 1;//1:实名通过18+   0: 否
		// if(real && age)
		// {
		// 	SocketManager.Instance.addEventListener(S2CProtocol.U_C_PLAYER_AASCHANGE,this.__changeHandler);
		// 	let pkg:PackageOut = new PackageOut(ProtocolType.C_PLAYER_AAS_SWITCH_CHANGE);
		// 	let msg:PlayerAASRefreshMsg = new PlayerAASRefreshMsg();
		// 	msg.isCloseAAS = true;
		// 	SocketSendManager.Instance.sendProtoBuffer(pkg,msg);
		// }
	}

	private __changeHandler(pkg: PackageIn) {
		// SocketManager.Instance.removeEventListener(S2CProtocol.U_C_PLAYER_AASCHANGE,this.__changeHandler);
		// let pkg:PackageIn = e.<PackageIn> data;
		// let msg:PlayerAASRspMsg = new PlayerAASRspMsg();
		// msg = pkg.readBody(msg) as PlayerAASRspMsg;
		// if(msg.result)
		// {
		// 	if(msg.age >= 18)
		// 	{
		// 		ResourcesBar.Instance.closeIndulgeView();
		// 	    PlayerManager.Instance.currentPlayerModel.isInAAS = false;
		// 	}
		// }
	}

	/**
	 *	验证码
	 * @param event
	 *
	 */
	private __securityCodeHandler(pkg: PackageIn) {
		// let msg:CheckImageMsg = new CheckImageMsg();
		// msg=pkg.readBody(msg) as CheckImageMsg;
		// FrameControllerManager.Instance.securityCodeController.model.byteArr_1 = msg.images1;
		// FrameControllerManager.Instance.securityCodeController.model.byteArr_2 = msg.images2;
		// FrameControllerManager.Instance.securityCodeController.model.byteArr_3 = msg.images3;
		// FrameControllerManager.Instance.securityCodeController.model.byteArr_4 = msg.images4;
		// FrameControllerManager.Instance.securityCodeController.model.remainTime= msg.leftTime;
		// FrameControllerManager.Instance.securityCodeController.model.remainCount = msg.leftCount;
		// FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.SECURITY_CODE);
	}

	private get fashionModel(): FashionModel {
		return FashionManager.Instance.fashionModel;
	}
	private __setSoundOffHandler(e: Event) {
		// if (SharedManager.Instance.allowMusic == false &&
		// 	SharedManager.Instance.allowSound == false) {
		// 	return;//防止死循环
		// }
		// BaseManager.isMusicOn = false;
		// BaseManager.isSoundOn = false;
		// SharedManager.Instance.allowMusic = false;
		// SharedManager.Instance.allowSound = false;
		// SharedManager.Instance.save();
	}

	private __setSoundOnHandler(e: Event) {
		// if(!BaseManager.isMusicOn && !BaseManager.isSoundOn)
		// 	BaseManager.isMusicOn = BaseManager.isSoundOn = true;
		// if (SharedManager.Instance.allowMusic == BaseManager.isMusicOn &&
		// 	SharedManager.Instance.allowSound == BaseManager.isSoundOn) {
		// 	return;//防止死循环
		// }
		// SharedManager.Instance.allowMusic = BaseManager.isMusicOn;
		// SharedManager.Instance.allowSound = BaseManager.isSoundOn;
		// SharedManager.Instance.save();
	}
	private __resizeHandler(evt: Event) {
		// JsHelper.isSelfAdapting = true;
	}

	private __stageClickHandler(e: Laya.Event) {
		// if(DragManager.getInstance().isDraging)
		// 	e.stopPropagation();
	}

	private _preLoadWorldBossId: number = 0;
	private __worldBossLoadHandler(pkg: PackageIn) {
		let msg: WorldBossInfoLoadMsg = pkg.readBody(WorldBossInfoLoadMsg) as WorldBossInfoLoadMsg;
		let id: number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
		id = id % 4;
		let b: boolean = false;
		if (msg.leftTime >= 14 && id == 0) {
			b = true;
		} else if (msg.leftTime >= 9 && msg.leftTime < 14 && id == 1) {
			b = true;
		} else if (msg.leftTime >= 5 && msg.leftTime < 9 && id == 2) {
			b = true;
		}
		if (b && this.thane.grades >= 20) new PreLoadWorldBoss(msg.campaignId, msg.leftTime);
	}

	private __worldBossReportHandler(pkg: PackageIn) {
		let msg: WorldBossReportMsg = pkg.readBody(WorldBossReportMsg) as WorldBossReportMsg;
		if (msg.type == 1) {
			//世界boss结算
			let str: string = "";
			if (msg.totalWound == 0) {
				if (msg.order == 0) {
					str = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.str11", msg.gold);
				} else {
					str = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.str12", msg.order, msg.gold);
				}
			} else {
				if (msg.order == 0) {
					str = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.str21", msg.totalWound, msg.gold);
				} else {
					str = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.str22", msg.totalWound, msg.order, msg.gold);
				}
			}
			DelayActionsUtils.Instance.addAction(new AlertTipAction(str, this.worldBossReport.bind(this)));
		} else if (msg.type == 2) {
			//试练之塔结算
			let str3: string = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.str23", msg.order, msg.gold, msg.strengy);
			DelayActionsUtils.Instance.addAction(new AlertTipAction(str3, this.worldBossReport, SceneType.PVE_ROOM_SCENE, 0, this));
		}
	}

	private worldBossReport(str: string, flag: boolean = true) {
		SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, str, null, null, null, AlertBtnType.O);
		if (PlayerManager.Instance.isScoreRatingApp && PlayerManager.Instance.isExistScoreRating && PlayerManager.Instance.scoreRatingCondition == StoreRatingsType.BOSS_TERMINATOR_APPELL) {
			GameBaseQueueManager.Instance.addAction(new StoreRatingAction(), true);
		}
	}

	private __resetDataHandler(pkg: PackageIn) {
		let msg: DataResetMsg = pkg.readBody(DataResetMsg) as DataResetMsg;
		PlayerManager.Instance.currentPlayerModel.playerInfo.beginChanges();
		PlayerManager.Instance.currentPlayerModel.playerInfo.attackCount = msg.attackCount;
		PlayerManager.Instance.currentPlayerModel.playerInfo.seminaryCount = msg.blessingCount;
		PlayerManager.Instance.currentPlayerModel.playerInfo.seminaryEffect = msg.blessingBuff;
		let buildInfo: BuildInfo = BuildingManager.Instance.model.buildingListByID[-11];
		if (buildInfo) buildInfo.property1 = msg.transEnergy;
		let info: BuildingOrderInfo = BuildingManager.Instance.model.getOrderById(10000);
		if (info) {
			info.currentCount = msg.challengeCount;
			info.remainTime = 0;
			info.dispatchEvent(Laya.Event.CHANGE);
		}
		Logger.base("[BaseManager]更新体力", msg.weary);
		PlayerManager.Instance.currentPlayerModel.playerInfo.weary = msg.weary;
		PlayerManager.Instance.currentPlayerModel.playerInfo.isGetKingBuffer = msg.king_Buff;
		PlayerManager.Instance.currentPlayerModel.playerInfo.diamondIndex = msg.UpRuneByPointTimes;
		PlayerManager.Instance.currentPlayerModel.playerInfo.commit();

		// MysteryShopManager.Instance.model.beginChanges();
		// MysteryShopManager.Instance.model.buyCount = msg.buyCount;
		// MysteryShopManager.Instance.model.commit();
	}

	private __loginStateHandler(pkg: PackageIn) {
		//0x0006, 请求登陆状态返回
		// ServerDataManager.cancel(S2CProtocol.U_C_PLAYER_LOGINSTATEE, this, this.__loginStateHandler);
		let msg = pkg.readBody(LoginStateMsg) as LoginStateMsg;
		let userId: number = msg.playerId;
		let state: number = msg.state;
		PlayerManager.Instance.loginState = state;
		Logger.base("[BaseManager]登录状态login state:" + state);
		switch (state) {
			case LoginState.BATTLE:
				BattleManager.loginToBattleFlag = true;
				Logger.base("登陆状态 : 战斗");
				break;
			case LoginState.CAMPAIGN:
				Logger.base("登陆状态 : 副本");
				break;
			case LoginState.CASTLE_SCENE:
				// TODO by jeremy.xu 流程待修改
				if (!RoomManager.Instance.isSelfInRoom) {
					SceneManager.Instance.setScene(SceneType.CASTLE_SCENE);
				} else {
					Logger.info("玩家处于房间 不进内城");
				}
				break;
			case LoginState.OUTERCITY_SCENE:
				if (!RoomManager.Instance.isSelfInRoom) {
					SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
				} else {
					Logger.info("玩家处于房间 不进外城");
				}
				break;
			default:
				if (ArmyManager.Instance.thane.grades < OpenGrades.ENTER_SPACE) {
					if (NewbieModule.Instance.checkEnterCastle()) {
						SceneManager.Instance.setScene(SceneType.CASTLE_SCENE);
					} else {
						let nMsg: NoviceReqMsgMsg = new NoviceReqMsgMsg();
						nMsg.type = 1;
						this.sendProtoBuffer(C2SProtocol.U_C_CAMPAIGN_TRAINING, nMsg);
					}
				} else {
					//会收到进入天空之城协议__createSpaceHandler
				}
		}
		NotificationManager.Instance.sendNotification(NotificationEvent.LOGIN_STATE, state);
		// JsHelper.setSelfAdapting();
		// let siteArr: any[] = this.userInfo.site.split("_");
		// if (siteArr[0] == "duowan") {//多玩接口需求, 玩家注册时, 调用平台接口, type=2为玩家上线
		// CallInterfaceUtil.cannDuowanPlayerNotify(this.userInfo.user, this.userInfo.site, 2, Number(siteArr[1]));
		// }
	}

	private __addPawnHandler(pkg: PackageIn) {
		if (ArmyManager.Instance.thane.grades < OpenGrades.PVE_CAMPAIGN) {
			return;
		}
		DelayActionsUtils.Instance.addAction(new AlertTipAction("", this.__addPawnDelayHandler.bind(this)));
	}
	private __addPawnDelayHandler(result: string) {
		let data: TipMessageData = new TipMessageData();
		data.type = TipMessageData.CAMPAIGN_ADD_PAWN;
		data.title = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.data.title");
		data.content = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.data.content");
		TaskTraceTipManager.Instance.cleanByType(TipMessageData.CAMPAIGN_ADD_PAWN);
		TaskTraceTipManager.Instance.showView(data);
	}

	public isSelect: boolean; //是否选 择收费翻牌
	public noPaySelect: boolean; //是否选 择不收费翻牌
	private __campaignCardsHandler(pkg: PackageIn) {
		this.isSelect = false;
		// let msg = pkg.readBody(CampaignCardsMsg) as CampaignCardsMsg;

		// 解决高延时的时候打开翻牌弹窗(原本触发翻牌协议已经停用;改用战役结算协议触发.但是战役结算协议不适合增加至队列解析处理)
		// let bMode: BattleModel = BattleManager.Instance.battleModel;
		// if (bMode && bMode.battleType == BattleType.BATTLE_CHALLENGE) {
		// 	SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, SceneType.BATTLE_SCENE, this.addQueue.bind(this));
		// } else {
		// 	SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, SceneType.CAMPAIGN_MAP_SCENE, this.addQueue.bind(this));
		// }
	}

	private __campaingTakeCardHandler(pkg: PackageIn) {
		let msg = pkg.readBody(CampaignTakeCardsMsg) as CampaignTakeCardsMsg;
		if (PlayerManager.Instance.currentPlayerModel.playerInfo.userId == msg.playerId) {
			this.isSelect = true;
		}
		NotificationManager.Instance.dispatchEvent(CampaignMapEvent.UPDATE_CHEST_INFO, msg);
	}

	private __armyChangeSharpHandler(pkg: PackageIn) {
		let cArmy: ArmyChangeSharpMsg = pkg.readBody(ArmyChangeSharpMsg) as ArmyChangeSharpMsg;
		let serverName: string = cArmy["serverName"] ? cArmy["serverName"] : "";
		if (cArmy.armyId == ArmyManager.Instance.army.id) {
			if (!cArmy["serverName"] || (cArmy["serverName"] && cArmy["serverName"] == PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName)) {
				ArmyManager.Instance.thane.beginChanges();
				ArmyManager.Instance.thane.changeShapeId = cArmy.changeSharpId;
				ArmyManager.Instance.thane.commit();
			}
		}
		if (RoomManager.Instance.roomInfo) {
			let rArmy: CampaignArmy = RoomManager.Instance.roomInfo.getPlayerByArmyId(cArmy.armyId, serverName);
			if (rArmy) {
				rArmy.baseHero.beginChanges();
				rArmy.baseHero.changeShapeId = cArmy.changeSharpId;
				rArmy.baseHero.commit();
			}
		}
		if (CampaignManager.Instance.mapModel) {
			let bArmy: CampaignArmy = CampaignManager.Instance.mapModel.getBaseArmyByArmyId(cArmy.armyId, cArmy["serverName"]);
			if (bArmy) {
				bArmy.baseHero.beginChanges();
				bArmy.baseHero.changeShapeId = cArmy.changeSharpId;
				bArmy.baseHero.commit();
			}
		}
		if (SpaceManager.Instance.model) {
			let sArmy: SpaceArmy = SpaceManager.Instance.model.getBaseArmyByUserId(cArmy.armyId);
			if (sArmy) {
				sArmy.baseHero.beginChanges();
				sArmy.baseHero.changeShapeId = cArmy.changeSharpId;
				sArmy.baseHero.commit();
			}
		}
	}
	private __showMsgHandler(pkg: PackageIn) {
		GameBaseQueueManager.Instance.addAction(new MessageAction(pkg));
	}

	private __msgHandler(pkg: PackageIn) {
		let msg = pkg.readBody(CampaignNotifyMsg) as CampaignNotifyMsg;
		let type: number = msg.id;
		let scene: string = msg.scene;
		if (scene == SceneManager.Instance.currentType || scene == "") {
			this.addQueue(pkg);
		} else {
			SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, scene, this.addQueue.bind(this));
		}
	}

	private __serverBroadcastHandler(pkg: PackageIn) {
		if (PlayerManager.Instance.loginState < 0) return;
		let msg = pkg.readBody(ChatChannelMsg) as ChatChannelMsg;
		let message: string = msg.encodeMsg;
		if (!(SceneManager.Instance.currentType == SceneType.BATTLE_SCENE)) {
			//战斗中不弹黄字
			let s: string = message;
			let srr: string[] = s.match(/\<([^>]*)>*/g);
			if (srr) {
				for (let i: number = 0; i < srr.length; i++) {
					try {
						let str: string = srr[i];
						let xml: any = XmlMgr.Instance.decode(str);
						let name: string = "";
						if (xml) name = xml.a.name;
						s = s.replace(str, name);
					} catch (e) {
						s = "";
					}
				}
			}
			MessageTipManager.Instance.show(s);
		}
	}

	//-------------------------------游戏剧情 ------------------------------------------------//
	private __gamePlotHandler(pkg: PackageIn) {
		Logger.base("[BaseManager]__gamePlotHandler", pkg);
		let msg = pkg.readBody(PlotMsg) as PlotMsg;
		let scene: string = SceneType.getSceneTypeById(msg.sceneType);
		if (scene == SceneManager.Instance.currentType || scene == "") {
			this.addQueue(pkg);
		} else {
			SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, scene, this.addQueue.bind(this));
		}
	}
	private addQueue(pkg: PackageIn) {
		CoreTransactionManager.getInstance().currentTimeAddQueue(pkg);
	}
	private __gamePlotActionHandler(pkg: PackageIn) {
		Logger.base("[BaseManager]__gamePlotActionHandler", pkg);

		GameBaseQueueManager.Instance.addAction(new DialogAction(pkg));
	}
	/**
	 *会话结束后触发战斗
	 */
	private __sessionOverHandler(data: any) {
		Logger.base("[BaseManager]__sessionOverHandler", data);
		let msg = data.data as DialogMessageInfo;
		let arr = msg.param.split("|");
		let nodeId = ~~MapUtils.getArrayValueByTag("nodeId:", arr);
		let mapId = ~~MapUtils.getArrayValueByTag("mapId:", arr);
		let command = ~~MapUtils.getArrayValueByTag("command:", arr);
		data.callBack();
		SocketSendManager.Instance.sendSessionOverToBattle(mapId, nodeId, command);
	}
	//---------------------------------------------------------------------------------//

	private __roomInviteHandler(pkg: PackageIn) {
		let msg = pkg.readBody(RoomInviteMsg) as RoomInviteMsg;
		this._roomInvite(msg);
	}

	private _roomInvite(msg: RoomInviteMsg, quick: boolean = false) {
		// 本次登陆拒绝该玩家邀请
		if (InviteTipManager.Instance.get(EmInviteTipType.Room, msg.playerId.toString())) return;

		// 英雄之门等级校验
		if (ArmyManager.Instance.thane.grades < OpenGrades.PVE_MUlTI_CAMPAIGN) return;

		// 战斗场景校验
		if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) return;

		// 载具场景校验
		if (SceneManager.Instance.currentType == SceneType.VEHICLE) return;

		// 玩家登录状态校验
		if (PlayerManager.Instance.loginState < 0) return;

		// 副本完成状态校验
		if (CampaignManager.CampaignOverState) return;

		// 答题场景校验
		if (AnswerManager.Instance.frameIsOpen) return;

		// 坐骑场景校验
		if (MopupManager.Instance.model.isMopup) return;

		let lvstr = ""; // 副本等级范围字符串
		let difficultyGrade = ""; // 副本难度范围字符串
		let campaign: t_s_campaignData; // 副本对象

		// 副本模版主键
		if (msg.tempId) {
			// 获取副本对象
			campaign = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaign, msg.tempId);
			if (campaign) {
				// 构建副本等级范围字符串
				lvstr =
					LangManager.Instance.GetTranslation("public.level3", campaign.MinLevel) +
					"-" +
					LangManager.Instance.GetTranslation("public.level3", campaign.MaxLevel);

				// 最小等级与最大等级相等时
				if (campaign.MinLevel == campaign.MaxLevel) {
					lvstr = LangManager.Instance.GetTranslation("public.level3", campaign.MinLevel);
				}

				// 是否王者之塔
				if (campaign.isKingTower) {
					difficultyGrade = KingTowerManager.Instance.kingTowerInfo.difficultyStep(campaign.DifficutlyGrade);
				}
			}
		}

		// 提示标题文本
		let titleText = "";

		// 提示正文
		let content: string;

		// 发起邀请的玩家昵称 
		let nickName: string = msg.nickName ? "[color=#00ff00]" + msg.nickName + "[/color]" : "";


		// 竞技邀请
		if (msg.roomType == 1) {
			titleText = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.frame");
			content = nickName ? LangManager.Instance.GetTranslation("yishi.manager.BaseManager.content02", nickName, msg.roomId) :
				LangManager.Instance.GetTranslation("yishi.manager.BaseManager.content022", msg.roomId);
		}

		// 普通副本邀请
		else if (msg.roomType == 0) {
			titleText = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.frame02");

			// 副本名称
			let nameMap: string = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.msg.name");
			let str: string = StringHelper.isNullOrEmpty(msg.name) ? nameMap : msg.name;
			str += " " + lvstr;

			// 副本难度范围
			if (difficultyGrade) {
				str += "(" + difficultyGrade + ")";
			}
			content = nickName ? LangManager.Instance.GetTranslation("yishi.manager.BaseManager.content03", nickName, str) :
				LangManager.Instance.GetTranslation("yishi.manager.BaseManager.content033", str);

			// 副本是否已开始
			if (msg.position == 1) {
				content = content + LangManager.Instance.GetTranslation("invite.position.content");
			}
		}

		// 活动副本邀请
		else if (msg.roomType == 2) {
			titleText = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.frame02");
			content = LangManager.Instance.GetTranslation("vehicle.mapName");
			content = nickName ? LangManager.Instance.GetTranslation("yishi.manager.BaseManager.content04", nickName, content) :
				LangManager.Instance.GetTranslation("yishi.manager.BaseManager.content044", content);
			// 副本是否已开始
			if (msg.position == 1) {
				content = content + LangManager.Instance.GetTranslation("invite.position.content");
			}
		}

		FrameCtrlManager.Instance.open(EmWindow.BeingInvite, {
			roomType: msg.roomType,
			roomPwd: msg.signStr,
			roomId: msg.roomId,
			tempId: msg.tempId,
			playerId: msg.playerId,
			position: msg.position, // 0:房间内;1副本内
			titleText: titleText,
			content: content,
			isCross: msg.isCross,
			quick: quick
		});
	}

	private __createCampaignHandler(pkg: PackageIn) {
		//0x007D
		let msg = pkg.readBody(RoomCreatedMsg) as RoomCreatedMsg;
		let type: number = msg.createdType;
		Logger.base("[BaseManager]创建副本");

		SpaceManager.Instance.stop();
		SpaceManager.Instance.exit = true;
		if (SceneManager.Instance.currentType == SceneType.CASTLE_SCENE) {
			SpaceSocketManager.Instance.dispose();
			SpaceManager.Instance.dispose();
		}

		if (msg.room && msg.room.campaignId == 3001) {
			SocketDataProxyManager.Instance.addCreateSceneQueue(pkg, SceneType.VEHICLE, pkg.code.toString(), true);
			this.createVehicle(msg);
			return;
		}

		let isCross: boolean = false;
		isCross = msg.isCross;
		let rooms: RoomInfo = RoomManager.Instance.roomInfo;
		let isSetup: boolean = true;
		if (!RoomManager.Instance.isSetUp) {
			isSetup = false;
		}
		if (!rooms) {
			rooms = new RoomInfo();
		}
		rooms.isCross = isCross;
		rooms.id = msg.room.roomId;
		rooms.houseOwnerId = msg.room.masterId;
		rooms.mapName = msg.room.name;
		rooms.campaignId = msg.room.campaignId;
		rooms.capacity = msg.room.capacity;
		rooms.roomType = msg.room.roomType;
		rooms.serverName = msg.room.masterServerName;
		if (CampaignManager.Instance.exit) CampaignManager.Instance.dispose();
		if (!isSetup) {
			RoomManager.Instance.setup(rooms);
		}
		
		CampaignManager.Instance.setup(rooms.campaignId);
		CampaignManager.Instance.mapModel.createType = type;
		CampaignManager.Instance.mapModel.isCross = isCross;

		SocketDataProxyManager.Instance.addCreateSceneQueue(pkg, SceneType.CAMPAIGN_MAP_SCENE, pkg.code.toString(), false);
		if (!BattleManager.loginToBattleFlag) {
			let paraII: Object;
			if (type == CreateCampaignType.CREATE_TYPE_TRANS) paraII = { isShowLoading: false };
			SceneManager.Instance.setScene(SceneType.CAMPAIGN_MAP_SCENE, paraII, true, false, type);
		}
	}

	private createVehicle(msg: RoomCreatedMsg) {
		let type: number = msg.createdType;
		RoomManager.Instance.dispose();
		if (!BattleManager.loginToBattleFlag) {
			let para: Object;
			if (type == CreateCampaignType.CREATE_TYPE_TRANS) para = { isShowLoading: false };
			SceneManager.Instance.setScene(SceneType.VEHICLE, para, true, false, type);
		}
	}

	private __createRoomHandler(pkg: PackageIn) {
		//0x000C
		if (CampaignManager.Instance.exit) RoomManager.Instance.dispose();
		let msg = pkg.readBody(RoomMsg) as RoomMsg;
		let roomInfo: RoomInfo = new RoomInfo();
		roomInfo.id = msg.roomId;
		roomInfo.houseOwnerId = msg.masterId;
		roomInfo.mapName = msg.name;
		roomInfo.campaignId = msg.campaignId;
		roomInfo.capacity = msg.capacity;
		roomInfo.roomType = msg.roomType;
		roomInfo.roomState = msg.roomState;
		RoomManager.Instance.setup(roomInfo);
		Logger.base("[BaseManager]创建房间", roomInfo.roomType, roomInfo.campaignId);
		if (roomInfo.roomType == RoomType.MATCH) {
			SceneManager.Instance.setScene(SceneType.PVP_ROOM_SCENE);
		} else if (roomInfo.roomType == RoomType.NORMAL) {
			SceneManager.Instance.setScene(SceneType.PVE_ROOM_SCENE);
		} else if (roomInfo.roomType == RoomType.VEHICLE) {
			FrameCtrlManager.Instance.open(EmWindow.VEHICLE_DAIMON_TRAIL, 2);
		} else if (roomInfo.roomType == RoomType.SECRET) {
			SecretManager.Instance.sendStartCampaign(roomInfo.campaignId);
		}

		let channel = SDKManager.Instance.getChannel();
		if (channel instanceof WanChannel) {
			channel.joinTeamRoom(msg.roomId + "");
		} else if (channel instanceof NativeChannel) {
			let roomId = NativeChannel.TEAM_ROOM + msg.roomId;
			channel.joinChatRoom(roomId);
		}
	}

	private static onFightCanceled(pkg: PackageIn) {
		Logger.base("战斗结束");
		BattleManager.onFightCanceled();
	}
	private __lockSceneHandler(pkg: PackageIn) {
		//0x008D
		let msg: LockScreenRspMsg = pkg.readBody(LockScreenRspMsg) as LockScreenRspMsg;
		let scene: string = msg.screen;
		if (scene == SceneManager.Instance.currentType || scene == "") {
			this.lockScene(pkg);
		} else {
			SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, scene, this.lockScene.bind(this));
		}
	}
	private lockScene(pkg: PackageIn) {
		pkg.position = PackageIn.HEADER_SIZE;
		let msg: LockScreenRspMsg = pkg.readBody(LockScreenRspMsg) as LockScreenRspMsg;
		let scene: string = msg.screen;
		let time: number = msg.frame;
		NotificationManager.Instance.dispatchEvent(NotificationEvent.LOCK_SCENE, { lockTime: time, lockScene: scene });
	}
	private __socketCloseHandler(evt: Event) {
		// if(this._loginFrame)return;
		// try
		// {
		// 	AlertManager.Instance.layerType = LayerManager.STAGE_TOP_LAYER;
		// 	let prompt:string = LangManager.Instance.GetTranslation("public.prompt");
		// 	let content:string = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.content01");
		// 	let frame : BaseAlerFrame = AlertManager.Instance.simpleAlert(prompt,content,"","",false,true,false);
		// 	frame.addEventListener(FrameEvent.RESPONSE, this.__exitSocketHandler);
		// 	KeyBoardRegister.Instance.keyEnable = false;
		// }
		// catch(e : Error)
		// {
		// 	this.__exitHandler();
		// }
	}

	private __loginOtherHandler(pkg: PackageIn) {
		//0x0F02
		let msg: GatewayMsg = pkg.readBody(GatewayMsg) as GatewayMsg;
		try {
			NotificationManager.Instance.sendNotification(LoginEvent.LOGIN_OTHER);
			let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
			let confirm: string = LangManager.Instance.GetTranslation("public.logout");
			SimpleAlertHelper.Instance.Show(
				SimpleAlertHelper.SIMPLE_ALERT,
				null,
				prompt,
				msg.notifyMsg,
				confirm,
				"",
				this.__exitHandler.bind(this),
				AlertBtnType.O,
				false,
				false,
				EmLayer.STAGE_TIP_LAYER
			);
		} catch (err) {
			MessageTipManager.Instance.show(msg.notifyMsg);
		}
	}

	// private __exitSocketHandler(evt : FrameEvent)
	// {
	// 	this._loginFrame = null;
	// 	switch(evt.responseCode)
	// 	{
	// 		case FrameEvent.SUBMIT_CLICK:
	// 		case FrameEvent.ENTER_CLICK:
	// 		case FrameEvent.CLOSE_CLICK:
	// 		case FrameEvent.ESC_CLICK:
	// 			this.__exitHandler();
	// 			break;
	// 	}
	// }
	private __exitHandler() {
		SDKManager.Instance.getChannel().logout();
	}

	private __battleInfoResultHandler(pkg: PackageIn) {
		let handler: BattleResultHandler = new BattleResultHandler();
		handler.handler(pkg);
		let rtnScene: string = SwitchPageHelp.returnScene;
		if (BattleManager.preScene) {
			rtnScene = BattleManager.preScene;
		}
		Logger.base("🔥退出战斗场景 返回场景", rtnScene);
		SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, rtnScene, this.showAddBloodFrameBack.bind(this));
	}
	private showAddBloodFrameBack(pkg: PackageIn) {
		let battleMsg: BattleReportMsg = pkg.readBody(BattleReportMsg) as BattleReportMsg;
		let rtnSceneList: any[] = [2, 8, 11, 19]; //这些场景不弹提示
		if (rtnSceneList.indexOf(battleMsg.battleScene) >= 0) return;
		DelayActionsUtils.Instance.addAction(new AlertTipAction(battleMsg.battleResult, this.showAlertTip.bind(this)));
	}

	private __cccHandler(pkg: PackageIn) {
		let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
		// if (msg['param5'])
		// 	msg.param7 = !ApplicationDomain.currentDomain.hasDefinition(msg.param5);
		msg.param6 = msg.param4;
		this.sendProtoBuffer(C2SProtocol.C_CC, msg);
	}

	/**
	 * 载具活动开放
	 * @param evt
	 *
	 */
	private __vehicleStartHandler(pkg: PackageIn) {
		let msg: MatchStateMsg = pkg.readBody(MatchStateMsg) as MatchStateMsg;
		this.playerInfo.beginChanges();
		this.playerInfo.isVehicleStart = msg.matchState;
		this.playerInfo.commit();
	}

	private __warlordsOpenHandler(pkg: PackageIn) {
		let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;

		WarlordsManager.Instance.model.process = msg.param1;
		switch (msg.param1) {
			case WarlordsModel.PROCESS_PRELIM:
			// ExternalInterfaceManager.Instance.initNews("01");
			case WarlordsModel.PROCESS_FINAL:
				// ExternalInterfaceManager.Instance.initNews("02");
				// TopToolsBar.Instance.warlordsShine = true;
				break;
			case WarlordsModel.PROCESS_BET:
				// ExternalInterfaceManager.Instance.initNews("03");
				if (!PlayerManager.Instance.currentPlayerModel.hasShowPrelimReportWnd) {
					DelayActionsUtils.Instance.addAction(new AlertTipAction(null, this.showPrelimReportCall.bind(this)));
					let tip: TipMessageData = new TipMessageData();
					tip.title = LangManager.Instance.GetTranslation("public.prompt");
					tip.type = TipMessageData.WARLORDS_BET;
					TaskTraceTipManager.Instance.showView(tip);
				}
				break;
		}
	}

	private showPrelimReportCall($data: Object) {
		PlayerManager.Instance.currentPlayerModel.hasShowPrelimReportWnd = true;
		FrameCtrlManager.Instance.open(EmWindow.WarlordsPrelimReportWnd);
	}

	private showMultilordsPrelimReportCall($data: Object): void {
		FrameCtrlManager.Instance.open(EmWindow.WarlordsPrelimReportWnd);
	}

	public showAlertTip(result: Object) {
		let tip: TipMessageData;
		if (this.thane.blood <= 0 && this.thane.grades >= 10 && this.thane.hp < this.thane.attackProrerty.totalLive) {
			// if (TipsBar.Instance.messageBtnList.hasType(TipMessageData.BUY_BLOOD)) return;
			tip = new TipMessageData();
			tip.type = TipMessageData.BUY_BLOOD;
			tip.title = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.tip.title02");
			TaskTraceTipManager.Instance.showView(tip);
		}
		if (Number(result) != 2) return;
		// if (this.thane.grades >= 10) {
		// 	tip = new TipMessageData();
		// 	tip.type = TipMessageData.FIGHTINGPROMPT;
		// 	tip.title = LangManager.Instance.GetTranslation("army.Equip.UpgradeFightingBtnTip");
		// 	tip.data = FightingManager.Instance.getMinScoreItem();
		// 	TaskTraceTipManager.Instance.showView(tip);
		// }
	}

	private get soundManager(): AudioManager {
		return AudioManager.Instance;
	}

	private __towerReportHandler(pkg: PackageIn) {
		let msg: TowerInfoMsg = pkg.readBody(TowerInfoMsg) as TowerInfoMsg;
		Logger.info("迷宫获取物品: " + msg.itemTempIds);
		this.createOneDelayAction(msg.itemTempIds);
	}

	private createOneDelayAction(result: string) {
		if (result == "") return;
		DelayActionsUtils.Instance.addAction(new AlertTipAction(result, this.showAllFallGoods.bind(this)));
	}

	private showAllFallGoods(value: string) {
		let dataArray: Array<GoodsInfo> = new Array();
		if (!StringHelper.isNullOrEmpty(value)) {
			let arr: Array<string> = value.split("|");
			let len: number = arr.length;
			let item: GoodsInfo;
			let itemStr: string;
			for (let i: number = 0; i < len; i++) {
				itemStr = arr[i];
				item = new GoodsInfo();
				item.templateId = parseInt(itemStr.split(",")[0]);
				item.count = parseInt(itemStr.split(",")[1]);
				dataArray.push(item);
			}
		}
		FrameCtrlManager.Instance.open(EmWindow.DisplayItems, {
			itemInfos: dataArray,
			title: LangManager.Instance.GetTranslation("map.campaign.view.frame.MazeFallItemsFrame.title"),
		});
	}

	public get Message(): string {
		let msg: string = "";
		msg = "enterframe : " + EnterFrameManager.Instance.getMessage() + "\n";
		msg = msg + "CoreTransactionManager : " + CoreTransactionManager.getInstance().getMessage() + "\n";
		msg = msg + "GameBaseQueueManager : " + GameBaseQueueManager.Instance.getMessage() + "\n";
		msg = msg + "SocketSceneBufferManager : " + SocketSceneBufferManager.Instance.getMessage() + "\n";
		return msg;
	}

	/**
	 * 后台加载处理
	 *
	 */
	private _timeId1: number = 0;
	private _timeId2: any = 0;
	public loadBackResource() {
		if (this._timeId2 == 0) {
			this._timeId2 = setTimeout(this.loadBackResource.bind(this), 1000 * 60 * 30);
			return;
		}
		clearTimeout(this._timeId2);
		this._timeId2 = 0;
		this.addWorldBossModule();
	}

	private addAvatarModule() {
		// let avatarList:XMLList = ConfigManager.backAvatarLisr.children();
		// for each(let xml:XML in avatarList)
		// {
		// 	let str:string = xml.@AvataSource;
		// 	let path:string = PathManager.resourcePath + "swf/avatar" + str + "/" + this.thane.templateInfo.Sexs+ ".bswf";
		// 	LoaderManagerII.Instance.load(path,LoaderInfo.BYTE_LOADER,LoaderPriority.Priority_1,null);
		// }
	}

	private addWorldBossModule() {
		// if(this._timeId1 != 0)clearTimeout(this._timeId1);this._timeId1 = 0;
		// let temp:CampaignTemplate = new CampaignTemplate();
		// temp.TimeValue = PlayerManager.Instance.currentPlayerModel.sysCurtime.time;
		// let tempArr:any[] = [];
		// tempArr.push(temp);
		// tempArr.push(TempleteManager.Instance.pvpWarFightDic[4001]);//战场
		// tempArr.push(TempleteManager.Instance.pvpWarFightDic[4002]);//战场
		// tempArr.push(TempleteManager.Instance.worldBossTemplateDict[4501]);//公会战
		// tempArr.push(TempleteManager.Instance.worldBossTemplateDict[5001]);//世界boss
		// tempArr.sortOn('TimeValue',Array.NUMERIC);
		// let index:number = tempArr.indexOf(temp);
		// if(index < tempArr.length - 1)
		// {
		// 	let timeCamp:number = (tempArr[index + 1].TimeValue - temp.TimeValue)/(1000 * 60);
		// 	if(timeCamp <= 10)
		// 	{
		// 		this._timeId1 = setTimeout(this.addWorldBossModule.bind(this),1000*60*60);
		// 		return;
		// 	}
		// }
		// let i:number = 0;
		// let xml:XMLList = ConfigManager.backResourceLis.children();
		// let xmllist:XMLList;
		// for (i = index + 1; i < tempArr.length ; i ++)
		// {
		// 	temp = tempArr[i];
		// 	xmllist = xml.(@templteId == temp.CampaignId);
		// 	this.loadWorldBossResource(xmllist.children());
		// 	this.loadBattleResource(temp.CampaignId);
		// }
		// for(i = 0; i < index; i ++)
		// {
		// 	temp = tempArr[i];
		// 	xmllist = xml.(@templteId == temp.CampaignId);
		// 	this.loadWorldBossResource(xmllist.children());
		// 	this.loadBattleResource(temp.CampaignId);
		// }
		// this.addAvatarModule();
	}

	// private loadWorldBossResource(xmllist:XMLList)
	// {
	// 	for each(let cxml:XML in xmllist)
	// 	{
	// 		let str:string = cxml.@path;
	// 		LoaderManagerII.Instance.load(PathManager.resourcePath + str,LoaderInfo.BYTE_LOADER,LoaderPriority.Priority_1,null);
	// 	}
	// }

	private loadBattleResource(campaignId: number) {
		// let heroId:number = this.getHeroTempId(campaignId);
		// if(heroId == 0)return;
		// let heroInfo:GameHeroTempInfo = TempleteManager.Instance.gameHeroTemplateCate.getTemplateByID(heroId);
		// let path:string = PathManager.solveRolePath(heroInfo.ResPath)
		// LoaderManagerII.Instance.load(path,LoaderInfo.BYTE_LOADER,LoaderPriority.Priority_1,null);
	}

	public sendProtoBuffer(code: number, message) {
		SocketManager.Instance.send(code, message);
	}

	private getHeroTempId(id: number): number {
		switch (id) {
			case 5001:
			case 5003:
				return 2001;
				break;
			case 5002:
				return 2002;
				break;
		}
		return 0;
	}

	private gvgBattleReport(str: string, flag: boolean = true) {
		let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
		let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
		SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, str, prompt, str, confirm, "");
	}

	private __crossMutiStateHandler(pkg: PackageIn) {
		var msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
		this.playerInfo.isOpenCrossMutiCampaign = msg.param7;
		this.playerInfo.isOpenCrossMutiCampaign2 = msg.param8; //总的开关
		NotificationManager.Instance.sendNotification(NotificationEvent.UPDATE_CROSS_PVE_STATUS);
	}

	/**
	 * 宝矿争夺信息  登录和宝矿状态变化的时候推送
	 * @param pkg
	 */
	private __treasureInfoHandler(pkg: PackageIn): void {
		let msg: TreasureMineMsg = pkg.readBody(TreasureMineMsg) as TreasureMineMsg;
		this.playerModel.treasureState = msg.state;

		this.playerModel.failCount = msg.failCount;
		this.playerModel.skipCount = msg.skipCount;
		this.playerModel.sumCD = msg.sumCD;

		let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
		let endData = new Date(msg.stateEndTime * 1000);
		let countDownDate: Date = Utils.formatTimeZone(Number(endData.getTime()), zoneOffset); //时区同步	
		this.playerModel.stateEndTime = countDownDate.getTime() / 1000;//剩余的秒数

		if (msg.sumCD == 0) {
			if (FrameCtrlManager.Instance.isOpen(EmWindow.OuterCityTreasureCDWnd)) {
				FrameCtrlManager.Instance.exit(EmWindow.OuterCityTreasureCDWnd);
			}
		}
		this.playerModel.isDeath = msg.isDeath;
		let currentMineralsList: Array<TreasureInfo> = [];
		for (let i: number = 0; i < msg.minerals.length; i++) {
			let mineral: TreasureMineLandInfo = msg.minerals[i] as TreasureMineLandInfo;
			currentMineralsList.push(this.readMineralInfo(mineral));
		}
		currentMineralsList = ArrayUtils.sortOn(currentMineralsList, ["type"], ArrayConstant.NUMERIC);
		this.playerModel.currentMinerals = currentMineralsList;

		let conosrtMineralsList: Array<TreasureInfo> = [];
		for (let i: number = 0; i < msg.consortiaMinerals.length; i++) {
			let mineral: TreasureMineLandInfo = msg.consortiaMinerals[i] as TreasureMineLandInfo;
			conosrtMineralsList.push(this.readMineralInfo(mineral));
		}
		conosrtMineralsList = ArrayUtils.sortOn(conosrtMineralsList, ["type"], ArrayConstant.NUMERIC);
		this.playerModel.conosrtMinerals = conosrtMineralsList;
		NotificationManager.Instance.dispatchEvent(OuterCityEvent.UPDATE_TREASURE_INFO, null);
	}

	private readMineralInfo(info: TreasureMineLandInfo): TreasureInfo {
		let item: TreasureInfo;
		let pInfo: PhysicInfo;
		if (info) {
			item = new TreasureInfo();
			item.id = info.id;
			item.mapId = info.mapId;
			item.templateId = info.templateId;
			pInfo = new PhysicInfo();
			pInfo.posX = info.posX;
			pInfo.posY = info.posY;
			pInfo.types = info.type;
			pInfo.occupyPlayerId = info.occupyPlayerId;
			pInfo.occupyPlayerName = info.occupyPlayerName;
			pInfo.occupyLeagueConsortiaId = info.occupyGuildId;
			pInfo.occupyLeagueName = info.occupyGuildName;
			pInfo.state = 1;
			item.info = pInfo;
		}
		return item;
	}

	private __uiPlayListInfo(pkg: PackageIn) {
		let msg: UserUiPlayListMsg = pkg.readBody(UserUiPlayListMsg) as UserUiPlayListMsg;
		if (msg) {
			PetCampaignManager.Instance.updateUserUiPlayListInfo(msg);
		}
	}
}
