import LangManager from "../../core/lang/LangManager";
import { AlertTipAction } from "../battle/actions/AlertTipAction";
import { BagType } from "../constant/BagDefine";
import { BagEvent, VIPEvent } from "../constant/event/NotificationEvent";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import { GlobalConfig } from "../constant/GlobalConfig";
import GoodsSonType from "../constant/GoodsSonType";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { TipMessageData } from "../datas/TipMessageData";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { DelayActionsUtils } from "../utils/DelayActionsUtils";
import { GoodsCheck } from "../utils/GoodsCheck";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { ArmyManager } from "./ArmyManager";
import BoxManager from "./BoxManager";
import { CampaignManager } from "./CampaignManager";
import { GoodsManager } from "./GoodsManager";
import { PlayerManager } from "./PlayerManager";
import TreasureMapManager from "./TreasureMapManager";
import { VIPManager } from "./VIPManager";
import { FashionManager } from './FashionManager';
import { NotificationManager } from "./NotificationManager";
import { ConsortiaManager } from "./ConsortiaManager";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";

export class TaskTraceTipManager {
	public static showVipTipView: boolean = false;
	public static showKingContractTipView: boolean = false;

	private _viewList: any[];

	private static _Instance: TaskTraceTipManager;
	public isLoadingTipWnd: boolean = false; // 正在加载界面
	public showTipList: TipMessageData[] = [];

	public showTraceTip: boolean = true;
	constructor() {
		this._viewList = [];
	}

	public setup() {
		this.addEvent();
	}


	private addEvent() {
		GoodsManager.Instance.addEventListener(BagEvent.ADD_GOODS, this.__addGoodsHandler, this);
		GoodsManager.Instance.addEventListener(BagEvent.NEW_GOODS, this.__newGoodsHandler, this);
		GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__updateGoodsHandler, this);

		this.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.__levelUpdateHandler, this);
		this.playerInfo.addEventListener(PlayerEvent.WEARY_CHANGE, this.__wearyChangeHandler, this);
		VIPManager.Instance.model.addEventListener(VIPEvent.VIP_RECHARGE_TIP, this.__vipRechargeHandler, this);
	}

	private __vipRechargeHandler(event) {
		var data: TipMessageData = new TipMessageData();
		data.type = event.type;
		data.title = event.title;
		this.showView(data);
	}

	private __addGoodsHandler(goods: GoodsInfo) {
		if(!this.showTraceTip) return;
		if (goods && goods.templateInfo.SonType == GoodsSonType.SONTYPE_OPENBOX && goods.isNew) {
			var data: TipMessageData = new TipMessageData();
			data.title = LangManager.Instance.GetTranslation("public.prompt");
			data.goods = goods;
			data.type = TipMessageData.OPENBOX_INTO_BAG;
			this.showProgressView(data);
		}
		//从邮件获取了新装备, 忽视掉等级等级, 玩家20级获得30等级装备也给提示。
		//从邮件提取的时候背包界面肯定没打开
		//背包界面打开的时候穿脱装备也会走这里更新, 那个时候不需要给提升的标志

		if (PlayerManager.Instance.currentPlayerModel.forgeWndIsOpen
			&& PlayerManager.Instance.currentPlayerModel.forgeHeChengIsOpen
			&& GoodsCheck.checkGoodsBetterNotCheckGrade(goods)
			&& GoodsManager.Instance.isEquip(goods.templateInfo)) {
			NotificationManager.Instance.dispatchEvent(BagEvent.NEW_EQUIP, true);
			if (PlayerManager.Instance.currentPlayerModel.forgeHeChengIsOpen) {
				PlayerManager.Instance.currentPlayerModel.forgeHeChengIsOpen = false;
			}
		} else {
			if (GoodsCheck.checkGoodsBetterNotCheckGrade(goods)
				&& GoodsManager.Instance.isEquip(goods.templateInfo)
				&& !PlayerManager.Instance.currentPlayerModel.sRoleBagIsOpen
				&& !PlayerManager.Instance.currentPlayerModel.forgeWndIsOpen
				&& !ConsortiaManager.Instance.ConsortiaStorageIsOpen
				&& !PlayerManager.Instance.currentPlayerModel.openBagTipFlag) {
				NotificationManager.Instance.dispatchEvent(BagEvent.NEW_EQUIP, true);
			}
		}
		if (PlayerManager.Instance.currentPlayerModel.openBagTipFlag) {
			PlayerManager.Instance.currentPlayerModel.openBagTipFlag = false;
		}
	}

	private __newGoodsHandler(evt) {
		if(!this.showTraceTip) return;
		let list = evt;
		if (!list || list.length == 0) return;
		var arr: GoodsInfo[] = [];
		for (var i: number = 0; i < list.length; i++) {
			var goods: GoodsInfo = list[i] as GoodsInfo;
			if (this.thane.grades <= 20 &&
				goods.templateInfo.SonType == GoodsSonType.SONTYPE_USEABLE &&
				goods.templateInfo.Property1 == 5 &&
				this.playerInfo.weary == 0) {//体力药水
				// DelayActionsUtils.Instance.addAction(new AlertTipAction(goods, this.useWearyHandler.bind(this)));
				continue;
			}
			if (this.thane.grades == 5 && goods.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX) {//5级新手宝箱
				this.checkNoviceBoxTip();
			}
			if (TaskTraceTipManager.showVipTipView && GoodsCheck.isVipExperienceCard(goods)) {//vip体验卡
				TaskTraceTipManager.showVipTipView = false;
				DelayActionsUtils.Instance.addAction(new AlertTipAction({ type: goods.templateId, data: goods }, this.vipCardHandler.bind(this)));
				continue;
			}
			if (GoodsCheck.checkGoodsBetterNotCheckGrade(goods)) {
				arr.push(goods);
				continue;
			}
			if (goods.templateInfo.SonType == GoodsSonType.SONTYPE_TREASURE_MAP && TreasureMapManager.Instance.needShowTip) {
				var data: TipMessageData = new TipMessageData();
				data.title = LangManager.Instance.GetTranslation("public.prompt");
				data.goods = goods;
				data.type = TipMessageData.TREASURE_MAP;
				this.showView(data);
			} else if (goods.templateInfo.SonType == GoodsSonType.SONTYPE_OPENBOX) {
				var data: TipMessageData = new TipMessageData();
				data.title = LangManager.Instance.GetTranslation("public.prompt");
				data.goods = goods;
				data.type = TipMessageData.OPENBOX_INTO_BAG;
				this.showProgressView(data);
			}else if (FashionManager.Instance.fashionModel.isFashion(goods)) {//时装
				var data: TipMessageData = new TipMessageData();
				data.title = LangManager.Instance.GetTranslation("public.prompt");
				data.goods = goods;
				data.type = TipMessageData.OPEN_BAG;
				data.content = LangManager.Instance.GetTranslation("tasktracetip.view.OpenBagTipView.newFashion");
				this.showView(data);
			}
		}
		if (arr.length > 0) {
			DelayActionsUtils.Instance.addAction(new AlertTipAction(arr[arr.length - 1], this.betterNewGoodsHandler.bind(this)));
		}
		arr = null;
	}

	private __updateGoodsHandler(evts: GoodsInfo[], counts: number[]) {
		if(!this.showTraceTip) return;
		let i = 0
		for (let evt of evts) {
			let count = counts[i]
			i++;
			if (evt.templateInfo.SonType == GoodsSonType.SONTYPE_OPENBOX && count > 0 && PlayerManager.Instance.currentPlayerModel.mailWndIsOpen) {
				var data: TipMessageData = new TipMessageData();
				data.title = LangManager.Instance.GetTranslation("public.prompt");
				data.goods = evt;
				data.type = TipMessageData.OPENBOX_INTO_BAG;
				data.useCount = count;
				this.showProgressView(data);
			}
		}
	}

	private __levelUpdateHandler(evt) {
		this.checkNoviceBoxTip();
		// var data: TipMessageData;
		// if (this.thane.grades == 40) {
		// 	data = new TipMessageData();
		// 	data.type = TipMessageData.PAWN_CHARACTERISTICS_TIP_VIEW;
		// 	data.title = LangManager.Instance.GetTranslation("tasktracetip.view.PawnCharacteristicsTipView.title");
		// 	this.showView(data);

		// 	var data2: TipMessageData = new TipMessageData();
		// 	data2.type = TipMessageData.MOUNT_OPEN_TIP_VIEW;
		// 	data2.title = LangManager.Instance.GetTranslation("tasktracetip.view.MountOpenTipView.title");
		// 	this.showView(data2);
		// }
		// if (this.thane.preGrade < 55 && this.thane.grades >= 55) {
		// 	data = new TipMessageData();
		// 	data.title = LangManager.Instance.GetTranslation("public.prompt");
		// 	data.type = TipMessageData.FATE_GUARD;
		// 	data.content = LangManager.Instance.GetTranslation("tasktracetip.view.FateGuardOpenview.content");
		// 	this.showView(data);
		// }

	}

	private __wearyChangeHandler(evt) {
		var copyGood: GoodsInfo = null;
		if (this.thane.grades < 20 && this.playerInfo.weary == 0) {
			var list: any[] = GoodsManager.Instance.getGoodsBySonType(GoodsSonType.SONTYPE_USEABLE);
			for (const key in list) {
				if (Object.prototype.hasOwnProperty.call(list, key)) {
					var info: GoodsInfo = list[key];
					if (info.templateInfo.Property1 == 5) {
						DelayActionsUtils.Instance.addAction(new AlertTipAction(info, this.useWearyHandler.bind(this)));
					}
				}
			}
		}
	}

	private checkNoviceBoxTip() {
		var list: any[] = BoxManager.Instance.gradeBoxList;
		for (const key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				var grade: number = list[key];
				if (this.thane.grades >= grade && !BoxManager.Instance.isRecviedByGrade(grade)) {
					var goods: GoodsInfo = GoodsManager.Instance.getGeneralBagGoodsBySonType(GoodsSonType.SONTYPE_NOVICE_BOX)[0];
					if (goods && goods.templateInfo && goods.templateInfo.NeedGrades == grade) {
						DelayActionsUtils.Instance.addAction(new AlertTipAction(goods, this.noviceBoxAlertTip.bind(this)));
					}
				}
			}
		}
	}

	private noviceBoxAlertTip(goods: GoodsInfo) {
		var data: TipMessageData = new TipMessageData();
		data.title = LangManager.Instance.GetTranslation("public.prompt");
		data.goods = goods;
		data.type = TipMessageData.GRADEBOX;
		this.showView(data);
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

	private get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	public static get Instance(): TaskTraceTipManager {
		if (!TaskTraceTipManager._Instance)
			TaskTraceTipManager._Instance = new TaskTraceTipManager();
		return TaskTraceTipManager._Instance;
	}

	public showView(data: TipMessageData) {
		if (!this.checkShowTaskTraceTip(data)) return;
		if (this.findViewList(data)) return;
		var view = this.getViewByType(data.type);
		if (view)
			view.Instance.Show(data);
	}

	public showProgressView(data: TipMessageData) {
		for (let i = 0; i < this.showTipList.length; i++) {
			if (data.goods.id == this.showTipList[i].goods.id) {
				return;
			}
		}
		this.showTipList.push(data);
		// TaskTraceTipManager.Instance.cleanByType(TipMessageData.OPENBOX_INTO_BAG);
		if (this.showTipList.length == 1)
			this.showView(data);
	}

	private findViewList(data: TipMessageData): boolean {
		for (const key in this._viewList) {
			if (Object.prototype.hasOwnProperty.call(this._viewList, key)) {
				var view: any = this._viewList[key];
				if (view.data && data.type == view.data.type) {
					return true;
				}
			}
		}
		return false;
	}

	private checkShowTaskTraceTip(data: TipMessageData): boolean {
		if (!data) return false;
		switch (SceneManager.Instance.currentType) {
			case SceneType.BATTLE_SCENE:
			case SceneType.VEHICLE:
				return false;
				break;
			case SceneType.WARLORDS_ROOM:
				if (data.type != TipMessageData.BUY_BLOOD && data.type != TipMessageData.CAMPAIGN_ADD_PAWN
					&& data.type != TipMessageData.WARLORDS_BET) {
					return false;
				}
				break;
		}
		if (CampaignManager.CampaignOverState) return false;
		if (CampaignManager.Instance.mapModel) {
			var mapId: number = CampaignManager.Instance.mapModel.mapId;
			if (WorldBossHelper.checkPvp(mapId)) return false;
			if (WorldBossHelper.checkGvg(mapId) && data.type != TipMessageData.CAMPAIGN_ADD_PAWN) return false;
		}
		//在夺宝奇兵界面不弹出
		if (FrameCtrlManager.Instance.isOpen(EmWindow.GemMazeWnd)) return false;
		return true;
	}

	private vipCardHandler(obj) {
		var tipData: TipMessageData = new TipMessageData();
		switch (obj.type) {
			case GoodsSonType.SONTYPE_VIP_BOX:
				tipData.type = TipMessageData.OPEN_BAG;
				tipData.content = LangManager.Instance.GetTranslation("tasktracetip.view.OpenBagTipView.vipcoin");
				break;
			default:
				tipData.type = TipMessageData.VIP_CARD;
		}
		tipData.goods = obj.data;
		// this.showView(tipData);
	}

	private kingContractCardHandler(good: GoodsInfo) {
		var tipData: TipMessageData = new TipMessageData();
		tipData.title = LangManager.Instance.GetTranslation("KingContractTipView.title");
		tipData.goods = good;
		tipData.content = LangManager.Instance.GetTranslation("KingContractTipView.content");
		tipData.btnTxt = LangManager.Instance.GetTranslation("tasktracetip.view.BuyBloodTipView.text02");
		tipData.type = TipMessageData.KINGCONTRACT;
		this.showView(tipData);
	}

	// private showBetterGoods() {
	// 	var curentSence: string = SceneManager.Instance.currentType;
	// 	if (curentSence == SceneType.BATTLE_SCENE) return;
	// 	var arr: any[] = [];
	// 	var list: any[] = GoodsManager.Instance.getGoodsByBagType(BagType.Player);
	// 	for (var i: number = 0; i < list.length; i++) {
	// 		var goods: GoodsInfo = list[i] as GoodsInfo;
	// 		if (!GoodsCheck.checkGoodsBetterThanHero(goods)) continue;
	// 		arr.push(goods);
	// 	}
	// 	if (arr.length) {
	// 		DelayActionsUtils.Instance.addAction(new AlertTipAction(arr[arr.length - 1], this.betterGoodsHandler.bind(this)));
	// 	}
	// 	arr = null;
	// }

	// private betterGoodsHandler(result: Object) {
	// 	let goods: GoodsInfo = <GoodsInfo>result
	// 	if (goods && GoodsManager.Instance.isEquip(goods.templateInfo)) {
	// 		NotificationManager.Instance.dispatchEvent(BagEvent.NEW_EQUIP, true);
	// 	}
	// }

	private betterNewGoodsHandler(result: Object) {
		let goods: GoodsInfo = <GoodsInfo>result
		var data: TipMessageData = new TipMessageData();
		data.title = LangManager.Instance.GetTranslation("public.prompt");
		data.goods = goods;
		data.type = TipMessageData.OPEN_BAG;
		if (FashionManager.Instance.fashionModel.isFashion(goods)) {//时装
			data.content = LangManager.Instance.GetTranslation("tasktracetip.view.OpenBagTipView.newFashion");
			this.showView(data);
		} else {//获得物品时, 右下弹窗“有更好的装备”可装备的弹窗取消
			// if (goods.templateInfo.NeedGrades == 0 || this.thane.grades >= goods.templateInfo.NeedGrades) {
			// 	data.content = LangManager.Instance.GetTranslation("tasktracetip.view.BetterGoodsTipsView.tips");
			// 	this.showView(data);
			// }
			// NotificationManager.Instance.dispatchEvent(BagEvent.NEW_EQUIP, true);
		}
	}

	private useWearyHandler(result: Object) {
		var data: TipMessageData = new TipMessageData();
		data.title = LangManager.Instance.GetTranslation("public.prompt");
		data.goods = <GoodsInfo>result;
		data.type = TipMessageData.USE_WEARY;
		// this.showView(data);
	}

	private copyGoods(goods: GoodsInfo): GoodsInfo {
		var gInfo: GoodsInfo = new GoodsInfo();
		gInfo.id = goods.id;
		gInfo.pos = goods.pos;
		gInfo.objectId = goods.objectId;
		gInfo.templateId = goods.templateId;
		gInfo.isBinds = goods.isBinds;
		gInfo.validDate = goods.validDate;
		gInfo.beginDate = goods.beginDate;
		gInfo.join1 = goods.join1;
		gInfo.join2 = goods.join2;
		gInfo.join3 = goods.join3;
		gInfo.randomSkill1 = goods.randomSkill1;
		gInfo.randomSkill2 = goods.randomSkill2;
		gInfo.randomSkill3 = goods.randomSkill3;
		gInfo.randomSkill4 = goods.randomSkill4;
		gInfo.randomSkill5 = goods.randomSkill5;
		return gInfo;
	}

	private __disposeFromListHandler(evt) {
		var view: any = evt;
		var index: number = this._viewList.indexOf(view);
		if (index != -1)
			this._viewList.splice(index, 1);
	}

	public clean() {
		while (this._viewList.length > 0) {
			var view: any = this._viewList.pop();
			view.dispose();
		}
	}

	public cleanByType(type: number) {
		var view = this.getLinkClass(type);
		if (!view) return;
		view.Instance.Hide();
	}

	public getViewByType(type: number): any {
		var view = this.getLinkClass(type);
		if (!view) return null;
		return view;
	}

	private getLinkClass(type: number) {
		var linkClassName: string = "";
		switch (type) {
			case TipMessageData.CAMPAIGN_ADD_PAWN:
				linkClassName = "AddPawnTipView";
				break;
			// case TipMessageData.BETTER_GOODS:
			// 	linkClassName = "BetterGoodsTipsView";
			// 	break;
			case TipMessageData.BUY_BLOOD:
				linkClassName = "BuyBloodTipView";
				break;
			case TipMessageData.INTENSIFY:
				linkClassName = "IntensifyTipView";
				break;
			case TipMessageData.MOUNT:
				linkClassName = "MountTipView";
				break;
			case TipMessageData.UPGRADE_PAWN:
				linkClassName = "UpgradePawnTipView";
				break;
			case TipMessageData.HASUNEQUIP:
				linkClassName = "TaskEquipTipView";
				break;
			case TipMessageData.GRADEBOX:
				linkClassName = "GradeBoxTipView";
				break
			case TipMessageData.STAR:
				linkClassName = "StarTipView";
				break;
			case TipMessageData.OPEN_BAG:
				linkClassName = "OpenBagTipView";
				break;
			case TipMessageData.TREE_CAN_PICK:
				// linkClassName = "TreeCanPickTipView";
				break;
			case TipMessageData.FARM_CAN_PICK:
				// linkClassName = "FarmCanPickTipView";
				break;
			case TipMessageData.USE_WEARY:
				linkClassName = "UseWearyTipView";
				break;
			case TipMessageData.BUFFER:
				linkClassName = "BufferDisapearTipView";
				break;
			case TipMessageData.VIP_CARD:
				linkClassName = "VIPCardTipView";
				break;
			case TipMessageData.VIP_GRADE:
				linkClassName = "VipUpGradeTipView";
				break;
			case TipMessageData.VIP_GIFT:
				linkClassName = "VipGiftGetTipView";
				break;
			case TipMessageData.VIP_OPEN:
				linkClassName = "VipRechargeTipView";
				break;
			case TipMessageData.VIP_MOUNT_ACTIVITY:
				linkClassName = "VipMountActivityTipView";
				break;
			case TipMessageData.VIP_MOUNT_LOSE:
				linkClassName = "VipMountLoseTipView";
				break;
			case TipMessageData.CALL_SECRET_TREE:
				linkClassName = "SecretTreeTipView";
				break;
			case TipMessageData.PAWN_CHARACTERISTICS_TIP_VIEW:
				linkClassName = "PawnCharacteristicsTipView";
				break;
			case TipMessageData.MOUNT_OPEN_TIP_VIEW:
				linkClassName = "MountOpenTipView";
				break;
			case TipMessageData.DEMON_OPEN:
				linkClassName = "DemonOpenTipView";
				break;
			case TipMessageData.REGRESSION_TIP_VIEW:
				linkClassName = "RegressionTipView";
				break;
			case TipMessageData.WARLORDS_BET:
				linkClassName = "WarlordsBetTipView";
				break;
			case TipMessageData.PET_ADD_POINT: // 服务器自动分配
				// linkClassName = "PetAddPointTip";
				break;
			case TipMessageData.SHOPTIMEBUY:
				linkClassName = "ShopTimeBuyTipView";
				break;
			case TipMessageData.TREASURE_MAP:
				linkClassName = "TreasureMapTipView";
				break;
			case TipMessageData.EXP_BACK:
				linkClassName = "ExpBackTipView";
				break;
			case TipMessageData.FIGHTINGPROMPT:
				linkClassName = "FightingTipView";
				break;
			case TipMessageData.CAMPAIGN_CARD:
				linkClassName = "CampaignCardTipView";
				break;
			case TipMessageData.VIP_CUSTOM:
				linkClassName = "VIPCustomTipView";
				break;
			// case TipMessageData.DRAGON_SOUL_OPEN:
			// 	linkClassName = "DragonSoulTipView";
			// 	break;
			case TipMessageData.SINGLEPASS_HAS_BUGLE:
				linkClassName = "SinglepassHasBugleYipsView";
				break;
			case TipMessageData.PET_BOSS:
				linkClassName = "PetBossTipView";
				break;
			case TipMessageData.OPENBOX_INTO_BAG:
				linkClassName = "OpenBoxTipView";
				break;
		}
		if (linkClassName != "") {
			let cls = null;
			try {
				cls = Laya.ClassUtils.getRegClass(linkClassName)
			} catch (e) {
				return null;
			}
			return cls;
		}
		return null;
	}

	public addBufferDisapearTip(buffer: PlayerBufferInfo) {
		DelayActionsUtils.Instance.addAction(new AlertTipAction(buffer, this.bufferDisapearTip.bind(this)));
	}

	private bufferDisapearTip(buffer: PlayerBufferInfo) {
		var data: TipMessageData = new TipMessageData();
		data.title = LangManager.Instance.GetTranslation("public.prompt");
		data.data = buffer;
		data.type = TipMessageData.BUFFER;
		this.showView(data);
	}
}