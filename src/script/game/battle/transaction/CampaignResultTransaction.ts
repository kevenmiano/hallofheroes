// @ts-nocheck
import { PackageIn } from "../../../core/net/PackageIn";
import { TransactionBase } from "./TransactionBase";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import AudioManager from "../../../core/audio/AudioManager";
import { SoundIds } from "../../constant/SoundIds";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";

import CampaignReportMsg = com.road.yishi.proto.campaign.CampaignReportMsg;
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerManager } from "../../manager/PlayerManager";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { BaseManager } from "../../manager/BaseManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { BattleType } from "../../constant/BattleDefine";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { CampaignManager } from "../../manager/CampaignManager";

/**
 *  处理副本结算协议
 *  弹出结算面板
 *
 */
export class CampaignResultTransaction extends TransactionBase {
	private _msg: CampaignReportMsg;
	constructor() {
		super();
	}

	// public handlePackage() {
	//     var msg = this.pkg.readBody(CampaignReportMsg) as CampaignReportMsg;
	//     NotificationManager.Instance.dispatchEvent(NotificationEvent.UI_OUT_SCENE);
	//     FrameCtrlManager.Instance.open(EmWindow.CampaignResult, msg);
	//     if(FrameCtrlManager.Instance.isOpen(EmWindow.AutoWalkWnd)){
	//         PlayerManager.Instance.currentPlayerModel.setAutoWalk(PlayerModel.CANCAL_AUTO_WALK);
	//         FrameCtrlManager.Instance.exit(EmWindow.AutoWalkWnd);
	//     }
	//     AudioManager.Instance.playMusic(SoundIds.CAMPAIGN_SUCCEED, 1);
	// }

	public handlePackage() {
		this._msg = this.pkg.readBody(CampaignReportMsg) as CampaignReportMsg;

		NotificationManager.Instance.dispatchEvent(NotificationEvent.UI_OUT_SCENE);
		ServerDataManager.Instance.notify(S2CProtocol.U_C_CAMPAIGN_CARDS, this.pkg);

		// FrameCtrlManager.Instance.open(EmWindow.CampaignResult, msg);
		let bModel: BattleModel = BattleManager.Instance.battleModel;
		let curBattleType: number = bModel ? bModel.battleType : -1;
		if (BaseManager.Instance.isSelect) {
			this.gotoChest();
		} else {
			this.showCardView(curBattleType);
		}

		if (FrameCtrlManager.Instance.isOpen(EmWindow.AutoWalkWnd)) {
			PlayerManager.Instance.currentPlayerModel.setAutoWalk(PlayerModel.CANCAL_AUTO_WALK);
			FrameCtrlManager.Instance.exit(EmWindow.AutoWalkWnd);
		}

		AudioManager.Instance.playMusic(SoundIds.CAMPAIGN_SUCCEED, 1);
	}

	get pkg(): PackageIn {
		return this._pkg;
	}

	public getCode(): number {
		return S2CProtocol.U_C_CAMPAIGN_REPORT;
	}

	public dispose() {
		// KeyBoardRegister.instance.keyEnable = true;
		super.dispose();
	}

	/**
	 * 显示翻牌
	 * @param curBattleType 战役翻牌 和 挑战翻牌
	 */
	private showCardView(curBattleType: number) {
		let curScene = SceneManager.Instance.currentType;
		if (curScene == SceneType.BATTLE_SCENE && curBattleType == BattleType.BATTLE_CHALLENGE) {
			// let frameData = {msg:this._msg, showWash:true}
			// FrameCtrlManager.Instance.open(EmWindow.ChestFrame, frameData)
		} else if (curScene == SceneType.CAMPAIGN_MAP_SCENE) {
			let frameData = { msg: this._msg, single: CampaignManager.Instance.mapModel.isSingleCampaign };
			FrameCtrlManager.Instance.open(EmWindow.ChestFrame, frameData);
		}
		this._msg = null;
	}

	/**
	 * 回到内城
	 *
	 */
	private gotoChest() {
		let curScene: string = SceneManager.Instance.currentType;
		let bModel: BattleModel = BattleManager.Instance.battleModel;
		let curBattleType: number = bModel ? bModel.battleType : -1;
		if (curScene == SceneType.CAMPAIGN_MAP_SCENE) {
			CampaignSocketOutManager.Instance.sendCampaignFinish(1);
		} else if (curScene == SceneType.BATTLE_SCENE && curBattleType == BattleType.BATTLE_CHALLENGE) {
			// SwitchPageHelp.returnToSpace(null, false, true);
			BattleManager.preScene = "";
		} else if (bModel && bModel.battleType == BattleType.CAMPAIGN_BATTLE) {
			CampaignSocketOutManager.Instance.sendCampaignFinish(1);
		}
	}
}
