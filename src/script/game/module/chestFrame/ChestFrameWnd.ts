// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2023-09-25 14:43:35
 * @LastEditors: jeremy.xu
 * @Description: 翻牌界面, 挑战翻牌 战役翻牌都是这个
 */
import AudioManager from "../../../core/audio/AudioManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { BattleManager } from "../../battle/BattleManager";
import { MovieClip } from "../../component/MovieClip";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_configData } from "../../config/t_s_config";
import { BattleType } from "../../constant/BattleDefine";
import { ConfigType } from "../../constant/ConfigDefine";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { SoundIds } from "../../constant/SoundIds";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { BaseManager } from "../../manager/BaseManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { RoomManager } from "../../manager/RoomManager";
import { SharedManager } from "../../manager/SharedManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { ItemHelper } from "../../utils/ItemHelper";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { TimerEvent, TimerTicker } from "../../utils/TimerTicker";
import ChestFrameData from "./ChestFrameData";
import ChestItem from "./item/ChestItem";

import CampaignReportMsg = com.road.yishi.proto.campaign.CampaignReportMsg;
import CampaignCardsMsg = com.road.yishi.proto.item.CampaignCardsMsg;
import CampaignTakeCardsMsg = com.road.yishi.proto.campaign.CampaignTakeCardsMsg;
import ItemInfoMsg = com.road.yishi.proto.item.ItemInfoMsg;
import { TempleteManager } from "../../manager/TempleteManager";
import Utils from "../../../core/utils/Utils";

export default class ChestFrameWnd extends BaseWindow {
	public showAgain: fgui.Controller;
	public showBtns: fgui.Controller;
	private cardList: fgui.GList;
	private txtCountDown: fgui.GLabel;
	private btnLeave: UIButton;
	private btnAgain: UIButton;
	private btnWash: UIButton;
	private btnConfirm: UIButton;

	private _showWash: boolean;
	private _bRestart: boolean;
	private _curBattleType: BattleType;
	private _autoTurnTimer: TimerTicker;
	private _turnExitTimer: any = 0;
	private _content: MovieClip;
	private _msg: CampaignCardsMsg;
	private _reportMsg: CampaignReportMsg;
	private _bOpenSimpleAlert: boolean; // 退出后关闭一些未关闭的提示窗口
	private _single: boolean;
	public modelEnable = false;

	constructor() {
		super();
	}

	public OnInitWind() {
		super.OnInitWind();
		this.setCenter();
		this.showAgain = this.getController("showAgain");
		this.showBtns = this.getController("showBtns");
	}

	/**界面打开 */
	OnShowWind() {
		super.OnShowWind();
		this.cardList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
		this.cardList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);

		this._msg = new CampaignCardsMsg(); // this.params.frameData.msg;
		this._reportMsg = this.params.frameData.msg;
		this._single = this.params.single;
		this._showWash = this.params.frameData.showWash;

		Logger.xjy("[ChestFrameWnd]OnShowWind frameData=", this.params.frameData);

		let bModel = BattleManager.Instance.battleModel;
		this._curBattleType = bModel ? bModel.battleType : -1;

		this._autoTurnTimer = new TimerTicker(1000, ChestFrameData.CountDownTime);
		this._autoTurnTimer.addEventListener(TimerEvent.TIMER, this.__timerHandler, this);
		this._autoTurnTimer.start();

		this.cardList.numItems = 5; //this._msg.cardCount
		this["txtTotalExp"].text = "+" + String(this._reportMsg.totalGp);
		this["txt_vip_value"].text = "+" + (this._reportMsg.vipJoin).toFixed(0) + "%";
		this["txt_team_value"].text = "+" + (this._reportMsg.teamJoin).toFixed(0) + "%";
		this["txt_prop_value"].text = "+" + (this._reportMsg.propJoin).toFixed(0) + "%";

		let grade = this.thane.grades;
		if (this._single) {
			this.showAgain.selectedIndex = grade >= GlobalConfig.ChestFrame.AgainLimitLevel ? 1 : 0;
			this.btnLeave.title = LangManager.Instance.GetTranslation("ChestFrameWnd.Btn.Leave"); //单人副本场景,展示离开战役
		} else {
			this.btnLeave.title = LangManager.Instance.GetTranslation("public.confirm1"); //英雄之门场景,展示确定
			this.showAgain.selectedIndex = 0;
		}

		this.showOptBtn(false);
	}

	/**关闭界面 */
	OnHideWind() {
		super.OnHideWind();
		this.offEvent();
	}

	private offEvent() {
		if (this.cardList) {
			this.cardList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
			// this.cardList.itemRenderer && this.cardList.itemRenderer.recover();
			Utils.clearGListHandle(this.cardList);
		}
	}

	private btnConfirmClick() {
		this.btnLeaveClick();
	}

	private btnLeaveClick() {
		this.leaveCampaign();
	}

	private leaveCampaign() {
		let curScene: string = SceneManager.Instance.currentType;
		if (curScene == SceneType.CAMPAIGN_MAP_SCENE && !this._bRestart) {
			Logger.xjy("[ChestFrameWnd]dispose sendCampaignFinish 1");
			CampaignSocketOutManager.Instance.sendCampaignFinish(1);
		} else if (curScene == SceneType.BATTLE_SCENE && this._curBattleType == BattleType.BATTLE_CHALLENGE) {
			if (!this._bRestart) {
				Logger.xjy("[ChestFrameWnd]dispose returnToSpace");
				SwitchPageHelp.returnToSpace({ isOpenColosseum: true }, false, true);
			}
			BattleManager.preScene = "";
		}
	}

	private btnAgainClick() {
		let content: string = LangManager.Instance.GetTranslation("map.internals.battle.ChestFrame.againContent");
		SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, content, null, null, this.__btnAgainClick.bind(this));
		this._bOpenSimpleAlert = true;
	}

	private __btnAgainClick(b: boolean, flag: boolean) {
		this._bOpenSimpleAlert = false;
		if (!b) return;
		if (this.showThewAlert()) return;
		this.campaignAgain();
	}

	private campaignAgain() {
		let curScene: string = SceneManager.Instance.currentType;
		if (curScene == SceneType.CAMPAIGN_MAP_SCENE) {
			this._bRestart = true;
			this.disposeCampaign();
			Logger.xjy("[ChestFrameWnd]campaignAgain sendCampaignFinish 2");
			CampaignSocketOutManager.Instance.sendCampaignFinish(2);
		}
	}

	private disposeCampaign() {
		RoomManager.Instance.dispose();
		CampaignManager.Instance.dispose();
	}

	/**
	 * 检查体力是否足够
	 */
	private showThewAlert(): boolean {
		// TODO cfg 报空
		// let cfg: t_s_campaignData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaign, CampaignManager.Instance.mapId)
		// let bSingleCp = cfg.Capacity == 1
		let bSingleCp = true;
		let config: t_s_configData = TempleteManager.Instance.getConfigInfoByConfigName(bSingleCp ? "SingleCampaign_Weary" : "MultiCampaign_Weary");
		let flag: boolean = PlayerManager.Instance.currentPlayerModel.playerInfo.weary < Number(config.ConfigValue);

		let outdate: boolean = false;
		let now: Date = new Date();
		let check: boolean = SharedManager.Instance.chestCheck;
		let preDate: Date = new Date(SharedManager.Instance.chestCheckDate);
		if (!check || (preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())) outdate = true;
		if (flag && outdate) {
			let content: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist02");
			let checkStr: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
			SimpleAlertHelper.Instance.Show(
				SimpleAlertHelper.USEBINDPOINT_ALERT,
				{ checkRickText: checkStr, checkDefault: false },
				null,
				content,
				null,
				null,
				this.__showThewAlert.bind(this)
			);
			this._bOpenSimpleAlert = true;
		}
		return flag && outdate;
	}

	private __showThewAlert(b: boolean, check: boolean) {
		SharedManager.Instance.chestCheck = check;
		SharedManager.Instance.chestCheckDate = new Date();
		SharedManager.Instance.saveChestCheck();
		this._bOpenSimpleAlert = false;
		if (b) {
			this.campaignAgain();
		}
	}

	/**
	 * 洗牌倒计时结束开始洗牌
	 */
	private __washTimeComplete() {
		// this.playWash();
	}
	/**
	 * 点击洗牌
	 */
	private btnWashClick() {
		// SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
		// this.playWash();
	}
	/**
	 * 开始洗牌
	 */
	private playWash() {
		// this._content.gotoAndPlay("back_f");
		// for (let index = 0; index < this.cardList.numChildren; index++) {
		//     const item = this.cardList.getChildAt(index) as ChestItem
		//     item.turnBack();
		// }
	}

	private renderListItem(index: number, item: ChestItem) {
		item.show();
		if (this._showWash) {
			// this._content.gotoAndPlay('show_f');
			// item.mouseEnabled = true
		}
		item.index = index;
		let itemMsg = this._msg.dropItems[index] as ItemInfoMsg;
		if (!itemMsg || !item || item.isDisposed) return;

		let info: GoodsInfo = new GoodsInfo();
		info = ItemHelper.readGoodsInfo(itemMsg, info);
		item.info = info;
	}

	private startWashDownTime() {
		// this.btnWash.time = ChestFrameData.WashDownTime;
	}

	/**
	 * 翻牌
	 */
	private onClickItem(item: ChestItem) {
		if (BaseManager.Instance.isSelect || item.timeout || item.opened) return;
		CampaignSocketOutManager.Instance.sendCampaignCard(item.isPay, item.index, ArmyManager.Instance.army.id);
		this._autoTurnTimer && this._autoTurnTimer.stop();
		this.txtCountDown.text = "";
		Logger.xjy("[ChestFrameWnd]发送发牌协议 index" + item.index);
	}

	public __updateCardHandler(msg: CampaignTakeCardsMsg) {
		if (this.destroyed) return;

		if (msg.playerId == this.thane.userId) {
			this._autoTurnTimer && this._autoTurnTimer.stop();
			this._turnExitTimer = setTimeout(this.leaveCampaign.bind(this), ChestFrameData.TurnExitTime * 1000);
		}

		Logger.xjy("[ChestFrameWnd]收到翻牌协议 index=" + msg.index);

		if (msg.index < 0 || msg.index > this.cardList.numChildren) {
			if (msg.playerId == this.thane.userId) {
				this.leaveCampaign();
			}
			return;
		}
		let item = this.cardList.getChildAt(msg.index) as ChestItem;
		if (!item || item.isDisposed) {
			Logger.xjy("[ChestFrameWnd]item不存在: " + msg.index);
			this.showOptBtn();
			return;
		}

		AudioManager.Instance.playSound(SoundIds.CHEST_SOUND);

		let goods: GoodsInfo = new GoodsInfo();
		goods.count = msg.count;
		goods.templateId = msg.templateId;
		goods.isBinds = msg.bind;
		goods.randomSkill1 = msg.randomSkill_1;
		goods.randomSkill2 = msg.randomSkill_2;
		goods.randomSkill3 = msg.randomSkill_3;
		goods.randomSkill4 = msg.randomSkill_4;
		goods.randomSkill5 = msg.randomSkill_5;
		item.updateData(msg.playerId, msg.name, goods);

		/**
		 * 单人战役直接显示按钮, 多人本是自己翻牌了才显示按钮
		 */
		if (this._single || (msg.playerId == this.thane.userId && !this._single)) {
			this.showOptBtn();
			this.txtCountDown.text = "";
		}
	}

	private showOptBtn(visible = true) {
		this.showBtns.selectedIndex = visible ? 1 : 0;
	}

	/**
	 * 倒计时结束自动翻牌
	 */
	private __timerHandler() {
		let time: number = ChestFrameData.CampaignDownTime + 1 - this._autoTurnTimer.currentCount;
		if (time <= 0) {
			time = 0;
			this.autoTurnCard();
			this._autoTurnTimer.stop();
			this._autoTurnTimer = null;
		}
		this.txtCountDown.text = time == 0 ? "" : time.toString();
	}
	/**
	 * 自动翻牌
	 */
	private autoTurnCard() {
		for (let index = 0; index < this.cardList.numChildren; index++) {
			const item = this.cardList.getChildAt(index) as ChestItem;
			if (!item.opened) {
				CampaignSocketOutManager.Instance.sendCampaignCard(true, index, ArmyManager.Instance.army.id);
				return;
			}
		}
	}

	// mark by jeremy
	protected OnClickModal() {
		if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
			this.hide();
		} else {
			super.OnClickModal();
		}
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

	public dispose() {
		clearTimeout(this._turnExitTimer);
		if (this._autoTurnTimer) {
			this._autoTurnTimer.stop();
			this._autoTurnTimer = null;
		}
		if (this._bOpenSimpleAlert) {
			SimpleAlertHelper.Instance.Hide();
		}

		super.dispose();
	}
}
