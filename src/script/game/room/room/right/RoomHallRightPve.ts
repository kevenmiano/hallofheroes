/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2024-02-19 17:47:56
 * @LastEditors: jeremy.xu
 * @Description:
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import LayerMgr from "../../../../core/layer/LayerMgr";
import Logger from "../../../../core/logger/Logger";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_campaignbufferData } from "../../../config/t_s_campaignbuffer";
import { CampaignMapLand } from "../../../constant/CampaignMapLand";
import { CommonConstant } from "../../../constant/CommonConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import ItemID from "../../../constant/ItemID";
import { RoomPlayerState, RoomType } from "../../../constant/RoomDefine";
import { RoomState } from "../../../constant/RoomState";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { RankInfo } from "../../../datas/playerinfo/RankInfo";
import { CampaignRankManager } from "../../../manager/CampaignRankManager";
import { CampaignTemplateManager } from "../../../manager/CampaignTemplateManager";
import ChatSocketOutManager from "../../../manager/ChatSocketOutManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { KingTowerManager } from "../../../manager/KingTowerManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import { RoomSocketOuterManager } from "../../../manager/RoomSocketOuterManager";
import { SharedManager } from "../../../manager/SharedManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import HomeWnd from "../../../module/home/HomeWnd";
import MainToolBar from "../../../module/home/MainToolBar";
import RoleCom from "../../../module/home/RoleCom";
import { isOversea } from "../../../module/login/manager/SiteZoneCtrl";
import { CampaignAreaInfo } from "../../../module/pve/pveCampaign/model/CampaignAreaInfo";
import { CampaignChapterInfo } from "../../../module/pve/pveCampaign/model/CampaignChapterInfo";
import { CampaignLandInfo } from "../../../module/pve/pveCampaign/model/CampaignLandInfo";
import { ShopGoodsInfo } from "../../../module/shop/model/ShopGoodsInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { CampaignMapModel } from "../../../mvc/model/CampaignMapModel";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import RoomHallCtrl from "../roomHall/RoomHallCtrl";
import RoomHallData from "../roomHall/RoomHallData";

export default class RoomHallRight extends BaseFguiCom {
	private optList: fgui.GList;
	private btnLock: UIButton;
	private btnStart: UIButton;
	private btnCancel: UIButton;
	private btnReady: UIButton;
	private btnQuickUseExp: UIButton;
	private btnQuickUse: UIButton;
	private txtCampaignName: fgui.GLabel;
	private txtEnterCount: fgui.GLabel;
	private txtCapacity: fgui.GLabel;
	private txtRoomNum: fgui.GLabel;
	private imgIncomeTick: fgui.GImage;
	private cShowIncome: fgui.Controller;
	private clickBtnIncomeState: number = -1;
	private showCancelBtnIncomeTip: boolean = true; // 打开界面只是提示一次
	private btnIncome: UIButton;
	//跨服撮合
	public btnCrossStart: fgui.GButton; //开始跨服撮合
	public btnCrossCancel: fgui.GButton; //取消跨服撮合
	public corssActiveTimeTxt: fgui.GRichTextField;
	public corssLeftTmeTxt: fgui.GRichTextField;
	public corssActiveDescTxt: fgui.GRichTextField;
	public cCross: fgui.Controller;
	public txtEnterCountDesc: fgui.GTextField;
	private txtCampaignNameDesc: fgui.GLabel;

	constructor(comp: fgui.GComponent) {
		super(comp);
		this.cShowIncome = this.getController("cShowIncome");
		this.cCross = this.getController("cCross");
		this.optList.on(fgui.Events.CLICK_ITEM, this, this.__clickOptItem);
		this.btnStart.soundRes = SoundIds.CAMPAIGN_READY_SOUND;
		this.btnStart.setCommonClickInternal();
		this.txtEnterCountDesc.text = LangManager.Instance.GetTranslation("PveSelectCampaignWnd.enterCountTxt");

		for (let index = 0; index < this.optList.numChildren; index++) {
			const element = this.optList.getChildAt(index);
			let tempBtn = new UIButton(element);
		}

		this.refreshChangCampaignBtn();
		this.txtCampaignNameDesc.visible = !isOversea();
	}

	public refreshPvPRoomInfo() {
		if (!this.ctrl.openCrossPve) {
			//如果开关关了
			if (this.roomInfo.roomState == RoomState.STATE_COMPETEING) {
				//如果正在匹配中保持原样
			} else {
				this.cCross.selectedIndex = 0;
			}
		} else {
			this.refreshOptBtn();
		}
	}

	public refreshRoomInfo() {
		this.txtRoomNum.text = LangManager.Instance.GetTranslation("public.No", this.roomInfo.id);
		this.txtCapacity.text = this.roomInfo.playerCount + " / " + this.roomInfo.capacity;
		let lvstr = "";
		if (this.roomInfo.mapTemplate) {
			lvstr = LangManager.Instance.GetTranslation("public.level4", "<br>", this.roomInfo.mapTemplate.MinLevel, this.roomInfo.mapTemplate.MaxLevel);
			if (this.roomInfo.mapTemplate.MinLevel == this.roomInfo.mapTemplate.MaxLevel) {
				lvstr = "<br>" + LangManager.Instance.GetTranslation("public.level3", this.roomInfo.mapTemplate.MinLevel);
			}
		}

		this.txtCampaignName.text = this.roomInfo.mapTemplate
			? this.roomInfo.mapTemplate.CampaignNameLang + lvstr
			: LangManager.Instance.GetTranslation("public.defaultnumber2");

		this.refreshEnterCount();
		this.refreshIncome();
		this.refreshOptBtn();
	}

	private refreshOptBtn() {
		if (!this.roomInfo) return;

		let mapTemplate = this.roomInfo.mapTemplate;
		let isOwner = this.model.isOwner;
		this.btnLock.enabled = isOwner;
		this.btnLock.selected = Boolean(this.roomInfo.password);
		this.btnCancel.visible = !isOwner;
		this.btnReady.visible = !isOwner;
		this.btnStart.visible = isOwner;
		this.btnStart.enabled = this.roomInfo.allPlayerReader;
		this.btnCrossStart.enabled = this.roomInfo.allPlayerReader && this.roomInfo.playerCount != RoomHallData.PlayerItemCnt;
		this.optList.enabled = true;
		this.btnIncome.enabled = true;

		this.btnQuickUseExp.visible = !(mapTemplate && mapTemplate.isTrailTower);
		if (isOwner) {
			//房主
			this.btnQuickUseExp.enabled = true;
			this.btnQuickUse.enabled = true;
			switch (this.roomInfo.roomState) {
				case RoomState.STATE_USEING:
					this.btnStart.visible = true;
					this.btnCancel.visible = false;
					break;
				case RoomState.STATE_COMPETEING:
					this.btnStart.visible = false;
					this.btnCancel.visible = true;
					break;
			}
		} else {
			let player = this.roomInfo.getPlayerByUserId(this.model.selfArmy.userId, "") as CampaignArmy;
			if (player) {
				switch (player.roomState) {
					case RoomPlayerState.PLAYER_STATE_WAITE:
						this.btnQuickUseExp.enabled = true;
						this.btnQuickUse.enabled = true;
						this.btnReady.visible = true;
						this.btnReady.enabled = true;
						this.btnCancel.visible = false;
						break;
					case RoomPlayerState.PLAYER_STATE_READY:
						this.btnQuickUseExp.enabled = false;
						this.btnQuickUse.enabled = false;
						this.btnReady.visible = false;
						this.btnCancel.visible = true;
						this.btnCancel.enabled = true;
						break;
				}
			}
		}
		this.cCross.selectedIndex = 0;
		if (this.ctrl.openCrossPve && mapTemplate && (mapTemplate.DungeonId == 1 || mapTemplate.DungeonId == 2)) {
			//开放了跨服多人本
			this.cCross.selectedIndex = 1;
			//撮合中,不管房主还是非房主只显示取消按钮
			if (this.roomInfo.roomState == RoomState.STATE_COMPETEING) {
				this.btnCrossStart.visible = false;
				this.btnCrossCancel.visible = true;
				this.btnCancel.enabled = this.btnReady.enabled = this.btnStart.enabled = false;
				if (isOwner) {
					this.btnStart.visible = true;
					this.btnCancel.visible = false;
					this.btnReady.visible = false;
				} else {
					this.btnCancel.visible = true;
					this.btnStart.visible = false;
					this.btnReady.visible = false;
				}
				this.optList.enabled = false;
				this.btnIncome.enabled = false;
				this.btnQuickUseExp.enabled = false;
				this.btnQuickUse.enabled = false;
				this.ctrl.view.startTime();
			} else {
				//非撮合中, 房主显示匹配按钮, 玩家不显示按钮
				if (isOwner) {
					this.btnCrossStart.visible = true;
					this.btnCrossCancel.visible = false;
				} else {
					this.btnCrossStart.visible = false;
					this.btnCrossCancel.visible = false;
				}
				this.ctrl.view.stopTime();
			}
		}
		if (this.roomInfo.roomState != RoomState.STATE_COMPETEING) {
			this.ctrl.view.stopTime();
		}
	}

	private refreshChangCampaignBtn() {
		if (this.model.isOwner) {
			let item = this.optList.addItemFromPool() as fgui.GButton;
			item.icon = fgui.UIPackage.getItemURL(EmWindow.RoomHall, "Btn_L_StageSwitch");
			item.title = LangManager.Instance.GetTranslation("RoomHall.btn.changeCampaign");
			this.optList.columnGap = -5;
		} else {
			if (this.optList.numItems == 3) {
				this.optList.removeChildToPoolAt(2);
				this.optList.columnGap = 5;
			}
		}
	}

	private __clickOptItem(item: fgui.GButton) {
		let index = this.optList.getChildIndex(item);
		Logger.xjy("[RoomHallWnd]__clickOptItem", index);
		switch (index) {
			case 0:
				this.btnQuickInviteClick();
				break;
			case 1:
				this.btnTeamFormationClick();
				break;
			case 2:
				this.btnChangeFbClick();
				break;
		}
	}

	public __houseOwnerChangeHandler() {
		this.refreshChangCampaignBtn();
	}

	public refreshEnterCount() {
		let tempArr = CampaignMapModel.getCampaignCountArr(this.roomInfo.mapTemplate);
		this.txtEnterCount.text = tempArr[0] + " / " + tempArr[1];
	}

	private refreshIncome() {
		if (this.isSpecialFB) {
			this.cShowIncome.selectedIndex = 2;
		} else {
			this.cShowIncome.selectedIndex = 1;
		}
		this.refreshIncomeStateWithNotGet();
	}

	public autoSelectIncome() {
		this.refreshIncomeStateWithNotGet();
	}

	private btnIncomeClick() {
		if (this.btnCancel && this.btnCancel.visible == true) {
			let tip: string = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.btntip");
			if (this.roomInfo.houseOwnerId == this.model.selfArmy.userId && this.roomInfo.roomState == RoomState.STATE_COMPETEING) {
				tip = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.btntip2");
			}
			MessageTipManager.Instance.show(tip);
			return;
		}
		// 点击后状态
		let sel = !this.imgIncomeTick.visible;

		if (this.isSpecialFB) {
			let tempArr = CampaignMapModel.getCampaignCountArr(this.roomInfo.mapTemplate);
			if (tempArr[0] <= 0) {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.notEnoughIncome"));
			}
		} else {
			if (this.model.playerInfo.multiCopyCount <= 0) {
				let flag = this.checkUseImperialCrusadeOrder();
				if (!flag) {
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.notEnoughIncome"));
				}
			}
		}

		if (!sel) {
			if (this.showCancelBtnIncomeTip) {
				let content = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.notUserIncomeWillNotGetReward");
				SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, content, null, null, (b: boolean) => {
					if (b) {
						this.showCancelBtnIncomeTip = false;

						this.clickBtnIncomeState = 0;
						this.refreshIncomeStateWithClick(false);
					}
				});
			} else {
				this.clickBtnIncomeState = 0;
				this.refreshIncomeStateWithClick(false);
			}
		} else {
			this.clickBtnIncomeState = 1;
			this.refreshIncomeStateWithClick(true);
		}
	}
	/** 点击触发更新 */
	private refreshIncomeStateWithClick(sel: boolean = true) {
		if (sel) {
			let tempArr = CampaignMapModel.getCampaignCountArr(this.roomInfo.mapTemplate);
			sel = tempArr[0] > 0;
		}
		this.refreshGet(sel);
	}

	/** 按照记录变量被动触发更新 */
	private refreshIncomeStateWithNotGet() {
		if (!this.roomInfo.mapTemplate) return;
		
		let sel = false
		// 点过取消 则不会被动勾选
		if (this.clickBtnIncomeState == 0) {
			sel = false;
		} else {
			// 初始记录不收益 则不会被动勾选
			if (this.model.isNoGet) {
				sel = false
			} else {
				let tempArr = CampaignMapModel.getCampaignCountArr(this.roomInfo.mapTemplate);
				sel = tempArr[0] > 0;
			}
		}
		this.refreshGet(sel);
	}

	private refreshGet(b: boolean) {
		this.imgIncomeTick.visible = b;
		this.model.isNoGet = !b;
		let player: CampaignArmy = this.roomInfo.getPlayerByUserId(this.model.selfArmy.userId);
		if (player) {
			player.isNoGet = !b;
		}
	}

	public get isSpecialFB() {
		let mapTemplate = this.roomInfo.mapTemplate;
		if (mapTemplate) {
			return mapTemplate.isTrailTower || mapTemplate.isTaila || mapTemplate.isKingTower;
		}
		return false;
	}

	/**
	 * 快速邀请
	 */
	private btnQuickInviteClick() {
		let num: number = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.SMALL_BUGLE_TEMP_ID);
		if (num == 0) {
			if (this.model.thane.smallBugleFreeCount <= 0) {
				let str = LangManager.Instance.GetTranslation("chat.view.ChatInputView.command06");
				MessageTipManager.Instance.show(str);
				this.ctrl.quickBuySmallBugle();
				return;
			} else {
				this.model.quickInviteFlag = true;
				ChatSocketOutManager.sendSmallBugleFreeCount();
				return;
			}
		}
		this.ctrl.quickInvite();
		// this.inviteConent = this.ctrl.initInviteContent();
        // if(SharedManager.Instance.quickInvite){
        //     UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { state: 2, content: this.inviteConent, backFunction: this.handInAlertBack.bind(this) });
        //     // FrameCtrlManager.Instance.open(EmWindow.QuickInvite, { roomSceneType: this.ctrl.roomSceneType });
        // }else{
        //     this.sendInvite(this.inviteConent);
        // }
	}

	

	private btnStartClick() {
		if (!this.roomInfo) return;
		this.model.isCross = false;
		this.pveStartClick();
	}

	private pveStartClick() {
		if (this.roomInfo.roomType == RoomType.NORMAL && this.roomInfo.campaignId == 0) {
			return;
		}
		if (!this.model.isCross) {
			this.btnStart.enabled = false;
		}
		if (!this.model.isCross && this.roomInfo.playerCount == 1) {
			let isTrailCampaign: boolean = this.roomInfo.mapTemplate.SonTypes == CommonConstant.TRAILTOWER_SONTYPE;
			let isKingTowerCampaign: boolean = this.roomInfo.mapTemplate.isKingTower; //王者之塔
			let str:string = "";
			let campaignbufferData =  ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaignbuffer, 81101) as t_s_campaignbufferData;
            if(campaignbufferData)str = campaignbufferData.DescriptionLang;
			let campaignContent: string = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.content",str);
			let trailContent: string = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.content1");
			let kingTowerConter: string = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.content2");
			let isTaila: boolean = this.roomInfo.mapTemplate.isTaila;
			let tailaContent: string = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.content6");
			let content: string = isTrailCampaign ? trailContent : isKingTowerCampaign ? kingTowerConter : campaignContent;
			// if (isTaila) {
			// 	MessageTipManager.Instance.show(tailaContent);
			// 	this.btnStart.enabled = true;
			// 	return;
			// } else {
			SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, this.__pveStartClick.bind(this));
			// }
		} else {
			if (this.checkUseImperialCrusadeOrder()) return;
			if (this.showThewAlert(this.startAlertBack.bind(this))) return;
			HomeWnd.Instance.getMainToolBar().switchToolsBarState(MainToolBar.PVE_ROOM_START);
			LayerMgr.Instance.clearnGameDynamic();
			this.ctrl.senPlayerStart();
		}
	}

	private __pveStartClick(b: boolean, check: boolean) {
		if (this.roomInfo && b) {
			if (this.checkUseImperialCrusadeOrder()) return;
			if (this.showThewAlert(this.startAlertBack.bind(this))) return;
			HomeWnd.Instance.getMainToolBar().switchToolsBarState(MainToolBar.PVE_ROOM_START);
			this.ctrl.senPlayerStart();
		} else {
			this.btnStart.enabled = true;
		}
	}

	private showTrialAlert(callback: Function): boolean {
		if (this.roomInfo.mapTemplate.isTrailTower && this.model.playerInfo.isTrailOverMaxCount) {
			let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
			let content: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclistTRIAL_CHOSE");
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, callback);
			return true;
		}
		return false;
	}

	private showThewAlert(callBack: Function = null): boolean {
		if (this.roomInfo.mapTemplate.SonTypes != 0 && !this.roomInfo.mapTemplate.isTaila) {
			return this.checkKingTowerOrTrailOverMax(callBack);
		}
		let flag: boolean = this.model.playerInfo.multiCopyCount < 1;
		let content: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist01");
		if (this.roomInfo.mapTemplate.isTaila) {
			// 泰拉神庙
			if (this.playerInfo.tailaCount <= 0) {
				content = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist07");
				let preDate: Date = new Date(SharedManager.Instance.tailaCheckDate);
				let now: Date = new Date();
				let outdate: boolean = false;
				let check: boolean = SharedManager.Instance.tailaCheck;
				if (!check || (preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())) outdate = true;
				if (outdate) {
					let checkTxt = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
					SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, callBack);
				}
				return outdate;
			} else {
				return false;
			}
		} else if (this.roomInfo.mapTemplate.isKingTower) {
			// 王者之塔
			if (KingTowerManager.Instance.kingTowerInfo.kingCount <= 0) {
				content = LangManager.Instance.GetTranslation("yishi.view.base.KingTowerManager.disclistTRIAL_CHOSE");
				let preDate: Date = new Date(SharedManager.Instance.kingTowerCheckDate);
				let now: Date = new Date();
				let outdate: boolean = false;
				let check: boolean = SharedManager.Instance.kingTowerCheck;
				if (!check || (preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())) outdate = true;
				if (outdate) {
					let checkTxt = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
					SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, callBack);
				}
				return outdate;
			} else {
				return false;
			}
		} else if (this.roomInfo.mapTemplate.isTrailTower) {
			// 试炼之塔
			if (this.model.playerInfo.trialCount <= 0) {
				content = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclistTRIAL_CHOSE");
				let preDate: Date = new Date(SharedManager.Instance.trailTowerCheckDate);
				let now: Date = new Date();
				let outdate: boolean = false;
				let check: boolean = SharedManager.Instance.trailTowerCheck;
				if (!check || (preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())) outdate = true;
				if (outdate) {
					let checkTxt = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
					SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, callBack);
				}
				return outdate;
			} else {
				return false;
			}
		} else {
			let preDate: Date = new Date(SharedManager.Instance.roomCheckDate);
			let now: Date = new Date();
			let outdate: boolean = false;
			let check: boolean = SharedManager.Instance.roomCheck;
			if (!check || (preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())) outdate = true;
			if (flag && outdate) {
				let checkTxt = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
				SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, callBack);
			}
			return flag && outdate;
		}
	}

	private startAlertBack(b: boolean, check: boolean) {
		this.readState(check);
		if (!b) {
			this.btnStart.enabled = true;
			return;
		}
		if (!this.roomInfo || !this.roomInfo.mapTemplate) return;

		this.ctrl.senPlayerStart();
	}

	private readyAlertBack(b: boolean, check: boolean) {
		this.readState(check);
		if (!b) return;

		if (this.checkKingTowerOrTrailOverMax()) return;

		this.ctrl.sendPlayerReady();
	}

	private trailAlertBack(b: boolean, check: boolean) {
		this.readState(check);
		if (!b) return;

		this.ctrl.sendPlayerReady();
	}

	private readState(check: boolean) {
		// 泰拉神庙
		if (this.roomInfo.mapTemplate.isTaila) {
			SharedManager.Instance.tailaCheck = check;
			SharedManager.Instance.tailaCheckDate = new Date();
		}
		// 王者之塔
		else if (this.roomInfo.mapTemplate.isKingTower) {
			SharedManager.Instance.kingTowerCheck = check;
			SharedManager.Instance.kingTowerCheckDate = new Date();
		}
		// 试炼之塔
		else if (this.roomInfo.mapTemplate.isTrailTower) {
			SharedManager.Instance.trailTowerCheck = check;
			SharedManager.Instance.trailTowerCheckDate = new Date();
		} else {
			SharedManager.Instance.roomCheck = check;
			SharedManager.Instance.roomCheckDate = new Date();
		}
		SharedManager.Instance.saveRoomCheck();
		HomeWnd.Instance.getMainToolBar().switchToolsBarState(MainToolBar.PVE_ROOM_START);
	}

	//检查王者之塔、试炼之塔
	private checkKingTowerOrTrailOverMax(callBack: Function = null): boolean {
		let isOver: boolean;
		let content: string;
		if (!this.roomInfo || !this.roomInfo.mapTemplate) return true;
		if (this.roomInfo.mapTemplate.SonTypes == 0) return false;
		if (this.roomInfo.mapTemplate.isKingTower) {
			// isOver = KingTowerManager.Instance.kingTowerInfo.isKingTowerOverMaxCount;
			// if (isOver) {
			// 	content = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist06");
			// 	MessageTipManager.Instance.show(content);
			// 	return true;
			// }
			if (callBack && parseInt(this.txtEnterCount.text.split("/")[0]) <= 0) {
				content = LangManager.Instance.GetTranslation("yishi.view.base.KingTowerManager.disclistTRIAL_CHOSE");
				let preDate: Date = new Date(SharedManager.Instance.kingTowerCheckDate);
				let now: Date = new Date();
				let outdate: boolean = false;
				let check: boolean = SharedManager.Instance.kingTowerCheck;
				if (!check || (preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())) outdate = true;
				if (outdate) {
					let checkTxt = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
					SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, callBack);
				}
				return outdate;
			}
		} else {
			// isOver = this.model.playerInfo.isTrailOverMaxCount;
			// if (isOver) {
			// 	content = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist05");
			// 	MessageTipManager.Instance.show(content);
			// 	return true;
			// }
			if (callBack && parseInt(this.txtEnterCount.text.split("/")[0]) <= 0) {
				content = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclistTRIAL_CHOSE");
				let preDate: Date = new Date(SharedManager.Instance.trailTowerCheckDate);
				let now: Date = new Date();
				let outdate: boolean = false;
				let check: boolean = SharedManager.Instance.trailTowerCheck;
				if (!check || (preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())) outdate = true;
				if (outdate) {
					let checkTxt = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
					SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, callBack);
				}
				return outdate;
			}
		}
		return false;
	}

	// 多人本点开始按钮  检查使用帝国讨伐令牌
	private checkUseImperialCrusadeOrder(): boolean {
		if (this.model.cancelCheckUseImperialCrusadeOrder) return false;

		if (this.roomInfo.mapTemplate.SonTypes != 0) {
			return false;
		}
		if (this.model.playerInfo.multiCopyCount > 0) {
			return false;
		}
		let pos = this.model.getImperialCrusadeOrderPos();
		if (pos == -1) {
			return false;
		} else {
			this.btnStart.enabled = true;

			let content: string = LangManager.Instance.GetTranslation("RoomHall.ImperialCrusadeOrderNoEnoughTip");
			let num: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.IMPERIAL_CRUSADE_ORDER);
			let goodsCount: string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
			UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
				content: content,
				goodsId: ItemID.IMPERIAL_CRUSADE_ORDER,
				goodsCount: goodsCount,
				callback: (b) => {
					if (b) {
						SocketSendManager.Instance.sendUseItem(pos);
					} else {
						this.model.cancelCheckUseImperialCrusadeOrder = true;
					}
				},
			});
			return true;
		}
	}

	private btnChangeFbClick() {
		FrameCtrlManager.Instance.open(EmWindow.PveMultiCampaignWnd, { isChangeCampaign: true });
	}

	private btnReadyClick() {
		if (!this.roomInfo) return;

		let str: string = "";
		let mapTemplate = this.roomInfo.mapTemplate;
		if (!this.roomInfo.mapTemplate) {
			str = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.command02");
			MessageTipManager.Instance.show(str);
			return;
		}
		if (this.roomInfo.houseOwnerId != this.model.thane.userId && this.roomInfo.mapTemplate.MinLevel > this.model.thane.grades) {
			str = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.command03");
			MessageTipManager.Instance.show(str);
			return;
		}

		let dic = CampaignRankManager.Instance.rankDic;
		let land: CampaignLandInfo = CampaignTemplateManager.Instance.landDic[CampaignMapLand.None] as CampaignLandInfo;
		let chapter: CampaignChapterInfo;
		let area: CampaignAreaInfo;
		let rank: RankInfo; //普通难度评分信息
		var rank2: RankInfo; //噩梦难度评分
		if (land) chapter = land.getChapterById(mapTemplate.DungeonId);
		if (chapter) area = chapter.getAreaInfoById(mapTemplate.AreaId);
		//难度判断
		if (mapTemplate.isKingTower) {
			let difficultyGrade: number = mapTemplate.DifficutlyGrade;
			let maxIndex: number = KingTowerManager.Instance.kingTowerInfo.maxIndex;
			if (maxIndex < difficultyGrade - 1) {
				let diffGrade: string = KingTowerManager.Instance.kingTowerInfo.difficultyStep(difficultyGrade - 1);
				str = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.kingtower.difficulty", diffGrade);
				MessageTipManager.Instance.show(str);
				return;
			}
		} else {
			if (area) rank = dic[area.getMapByDifficult(1).CampaignId];
			if (area.getMapByDifficult(2)) rank2 = dic[area.getMapByDifficult(2).CampaignId];
			if (this.roomInfo.houseOwnerId != this.model.thane.userId && !rank && mapTemplate.DifficutlyGrade == 2) {
				str = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.command04");
				MessageTipManager.Instance.show(str);
				return;
			} else if (this.roomInfo.houseOwnerId != this.model.thane.userId && !rank2 && mapTemplate.DifficutlyGrade == 3) {
				str = LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.command06");
				MessageTipManager.Instance.show(str);
				return;
			}
		}

		if (this.checkUseImperialCrusadeOrder()) return;
		if (this.showThewAlert(this.readyAlertBack.bind(this))) return;
		//试炼之塔需要加上提示
		if (this.showTrialAlert(this.trailAlertBack.bind(this))) return;
		this.ctrl.sendPlayerReady();
	}

	private btnCancelClick() {
		this.ctrl.senPlayerCancel();
	}

	private btnTeamFormationClick() {
		FrameCtrlManager.Instance.open(EmWindow.TeamFormation);
	}

	private btnQuickUseClick() {
		let pos = this.model.getImperialCrusadeOrderPos();
		if (pos == -1) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("RoomHall.ImperialCrusadeOrderNoEnough"));
		} else {
			let content: string = LangManager.Instance.GetTranslation("RoomHall.ImperialCrusadeOrderNoEnoughTip");
			let num: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.IMPERIAL_CRUSADE_ORDER);
			let goodsCount: string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
			UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
				content: content,
				goodsId: ItemID.IMPERIAL_CRUSADE_ORDER,
				goodsCount: goodsCount,
				callback: (b) => {
					if (b) {
						SocketSendManager.Instance.sendUseItem(pos);
					}
				},
			});
		}
	}

	private btnLockClick() {
		this.btnLock.selected = !Boolean(this.roomInfo.password);
		FrameCtrlManager.Instance.open(EmWindow.RoomPwd, { selCampaignID: this.roomInfo.campaignId });
	}

	private btnQuickUseExpClick() {
		let pos = -1;
		let bagDic = GoodsManager.Instance.getGeneralBagList();
		for (const key in bagDic) {
			if (bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
				let info: GoodsInfo = bagDic[key];
				if (info.templateId == ItemID.DOUBLE_EXP_PROP) {
					pos = info.pos;
					break;
				}
			}
		}
		if (pos == -1) {
			let content: string = LangManager.Instance.GetTranslation("RoomHall.doubleExipNotEnoughTip");
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, content, null, null, (b) => {
				if (!b) return;
				let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(ItemID.DOUBLE_EXP_PROP);
				FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: 1 });
			});
		} else {
			let content: string = LangManager.Instance.GetTranslation("RoomHall.doubleExipUseTip");
			let num: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.DOUBLE_EXP_PROP);
			let goodsCount: string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
			UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
				content: content,
				goodsId: ItemID.DOUBLE_EXP_PROP,
				goodsCount: goodsCount,
				callback: (b) => {
					if (b) {
						SocketSendManager.Instance.sendUseItem(pos);
					}
				},
			});
		}
	}

	/**跨服匹配 */
	btnCrossStartClick() {
		if (!this.roomInfo) return;
		this.model.isCross = true;
		this.pveStartClick();
	}

	/**取消跨服匹配 */
	btnCrossCancelClick() {
		this.model.isCross = false;
		if (this.model.isOwner) {
			RoomSocketOuterManager.sendRoomState(RoomState.STATE_USEING);
		} else {
			RoomSocketOuterManager.sendPlayerState(RoomPlayerState.PLAYER_STATE_WAITE);
		}
		if (!this.ctrl.openCrossPve) {
			//关闭了跨服多人本
			this.cCross.selectedIndex = 0;
			this.ctrl.view.stopTime();
		}
	}

	public get ctrl(): RoomHallCtrl {
		let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.RoomHall) as RoomHallCtrl;
		return ctrl;
	}

	private get model(): RoomHallData {
		return this.ctrl.data;
	}

	private get roomInfo(): RoomInfo {
		return RoomManager.Instance.roomInfo;
	}

	private get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	public dispose() { }
}
