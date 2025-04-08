import ResMgr from "../../../core/res/ResMgr";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { MovieClip } from "../../component/MovieClip";
import { AnimationManager } from "../../manager/AnimationManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MountsManager } from "../../manager/MountsManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { MountInfo } from "./model/MountInfo";
import { MountTrainData } from "./model/MountTrainData";
import LangManager from "../../../core/lang/LangManager";
import MountPropertyItem from "./MountPropertyItem";
import { PropertyInfo } from "./model/PropertyInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { SharedManager } from "../../manager/SharedManager";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ArmyEvent, BagEvent, MountsEvent, SwitchEvent } from "../../constant/event/NotificationEvent";
import UIButton from "../../../core/ui/UIButton";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceSocketOutManager } from "../../map/space/SpaceSocketOutManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import UIManager from "../../../core/ui/UIManager";
import { WildSoulCollection } from "./model/WildSoulCollection";
import { WildSoulInfo } from "./model/WildSoulInfo";
import { ConfigManager } from "../../manager/ConfigManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import Utils from "../../../core/utils/Utils";
import { NumericStepper } from "../../component/NumericStepper";
import BaseTipItem from "../../component/item/BaseTipItem";
import FUIHelper from "../../utils/FUIHelper";
import ObjectUtils from "../../../core/utils/ObjectUtils";

/**
 * 坐骑界面
 */
export default class MountsWnd extends BaseWindow {
	public simBox: NumericStepper;
	/**开启数量变更处理 */
	private _openNumberChangeHandler: Laya.Handler;
	private txt_poicon: fgui.GLabel;
	public item_poicon: BaseTipItem;
	public item_poicon1: BaseTipItem;
	private cfgValue: number = 10;

	private mountNameTxt: fgui.GLabel;
	private countTxt: fgui.GLabel;
	private moveSpeedTxt: fgui.GLabel;
	private LevelTxt: fgui.GLabel;
	private bgImg: fgui.GImage;
	private growBarProgres: fgui.GProgressBar;
	private restBtn: UIButton; //休息
	private mountBtn: UIButton; //上马
	private wildSoulBtn: UIButton; //兽魂
	private itemList: fgui.GList = null;
	private _path: string;
	private _mountMovieClip: MovieClip;
	private _trainData: MountTrainData;
	private _preUrl: string;
	private _cacheName: string;
	private _selectedItem: MountPropertyItem;
	private _lastClickTime: number = 0;
	private frame: fgui.GComponent;
	private _resUrl: string;
	public img_star: fgui.GImage;
	public starGroup: fgui.GGroup;
	private shareBtn: fgui.GButton;
	private typeArray: Array<string> = [PropertyInfo.STRENGTH, PropertyInfo.INTELLECT, PropertyInfo.STAMINA, PropertyInfo.ARMOR];
	public modelEnable: boolean = false;

	public OnInitWind() {
		this.addEvent();
		this.setCenter();
		this.frame.getChild("title").text = LangManager.Instance.GetTranslation("mounts.command07");
		this._trainData = new MountTrainData();
		this.itemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
		this.itemList.numItems = 4;
		this.itemList.selectedIndex = 0;
		this._selectedItem = this.itemList.getChildAt(0) as MountPropertyItem;
		PlayerManager.Instance.currentPlayerModel.setFightingCapacityRecord("start");
		let view = this.wildSoulBtn.getView();
		if (view) {
			let dot = view.getChild("redDot");
			if (dot) dot.visible = MountsManager.Instance.avatarList.checkRedPoint();
		}
		this.item_poicon.setInfo(ShopGoodsInfo.MOUNT_FOOD_TEMPID);
		// this.item_poicon1.setInfo(ShopGoodsInfo.MOUNT_FOOD_TEMPID);
		this.item_poicon1.setInfo(ShopGoodsInfo.MOUNT_FOOD_TEMPID, true, FUIHelper.getItemURL("Base", "Icon_Unit_Mount_L"));
	}

	OnShowWind() {
		super.OnShowWind();
		this.refreshView();
	}

	private addEvent() {
		this.itemList && this.itemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
		this.mountInfo.addEventListener(MountsEvent.MOUNT_INFO_CHANGE, this.__onMountInfoChange, this);
		this.mountInfo.addEventListener(MountsEvent.PROP_LEVEL_UP, this.__showPropLevelupEffect, this);
		this.mountInfo.addEventListener(MountsEvent.MOUNT_LEVEL_UP, this.__showLevelupEffect, this);
		ArmyManager.Instance.army.addEventListener(ArmyEvent.ARMY_INFO_CHANGE, this.__onArmyMountStateChange, this);
		NotificationManager.Instance.addEventListener(SwitchEvent.MOUNT_SHARE, this.onSwitch, this);
		GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__updateNumberHandler, this);
	}

	private removeEvent() {
		this.itemList && this.itemList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
		this.mountInfo.removeEventListener(MountsEvent.MOUNT_INFO_CHANGE, this.__onMountInfoChange, this);
		this.mountInfo.removeEventListener(MountsEvent.PROP_LEVEL_UP, this.__showPropLevelupEffect, this);
		this.mountInfo.removeEventListener(MountsEvent.MOUNT_LEVEL_UP, this.__showLevelupEffect, this);
		ArmyManager.Instance.army.removeEventListener(ArmyEvent.ARMY_INFO_CHANGE, this.__onArmyMountStateChange, this);
		NotificationManager.Instance.removeEventListener(SwitchEvent.MOUNT_SHARE, this.onSwitch, this);
		GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__updateNumberHandler, this);
	}

	private __updateNumberHandler() {
		this._openNumberChangeHandler && this._openNumberChangeHandler.recover();
		this._openNumberChangeHandler = Laya.Handler.create(this, this.onOpenNumberChangeHandler, null, false);

		this.cfgValue = this.getBagCount() < this.cfgValue ? (this.getBagCount() < 1 ? 1 : this.getBagCount()) : this.cfgValue;
		this.simBox.show(
			0,
			this.cfgValue,
			1,
			this.getBagCount() < 1 ? 1 : this.getBagCount(),
			this.getBagCount() < 1 ? 1 : this.getBagCount(),
			10,
			this._openNumberChangeHandler
		);
	}

	private onClickItem(item: MountPropertyItem) {
		this._selectedItem = item;
	}

	private renderListItem(index: number, item: MountPropertyItem) {
		if (!item || item.isDisposed) return;
		item.valueType = this.typeArray[index];
		item.vData = this.mountInfo;
	}

	private __onMountInfoChange() {
		this.refreshView();
	}

	helpBtnClick() {
		let title = LangManager.Instance.GetTranslation("mounts.HelpTitle");
		let content = LangManager.Instance.GetTranslation("mounts.helpTxt");
		UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
	}

	private __showPropLevelupEffect() {
		// if (!_proplevelupEffect)
		//     _proplevelupEffect = ComponentFactory.Instance.creatCustomObject("mounts.porplevelupeffect");
		// var item: PropertyItem = _group.getSelectedItem() as PropertyItem;
		// var mc: SimpleMovie = new SimpleMovie(_proplevelupEffect);
		// item.addChild(mc);
		// _proplevelupEffect = null;
	}

	private __showLevelupEffect() {
		// if (!_levelupEffect)
		// 	_levelupEffect = ComponentFactory.Instance.creatCustomObject("mounts.levelupeffect");
		// var mc:SimpleMovie = new SimpleMovie(_levelupEffect);
		// _showArea.addChild(mc);
	}

	private __onArmyMountStateChange() {
		var tempId: number = ArmyManager.Instance.army.mountTemplateId;
		if (tempId > 0) {
			this.restBtn.visible = true; //休息
			this.mountBtn.visible = false; //上马
		} else {
			this.restBtn.visible = false;
			this.mountBtn.visible = true;
		}
	}

	//分享
	private shareBtnClick() {
		FrameCtrlManager.Instance.open(EmWindow.MountShareWnd, this.mountInfo.template);
	}

	private buyBtnClick() {
		let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(ShopGoodsInfo.MOUNT_FOOD_TEMPID, ShopGoodsInfo.PROP_GOODS);
		if (info) {
			FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: 1 });
		}
	}

	//培养
	private trainBtnClick() {
		let t: number = new Date().getTime();
		if (t - this._lastClickTime < 400) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
			return;
		}
		this._lastClickTime = t;

		if (!this._selectedItem) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.command09"));
			return;
		}
		let needAlert: boolean = true; //根据职业判断
		// let today: Date = new Date();
		// let lastSaveDate: Date = new Date(SharedManager.Instance.domesticateAlertDate);
		// if (lastSaveDate) {
		// 	if (
		// 		today.getFullYear() == lastSaveDate.getFullYear() &&
		// 		today.getMonth() == lastSaveDate.getMonth() &&
		// 		today.getDay() == lastSaveDate.getDay()
		// 	) {
		// 		needAlert = false;
		// 	}
		// }

		needAlert = false;
		let content: string;
		if (needAlert) {
			let msg: string = "";
			let thane: ThaneInfo = ArmyManager.Instance.thane;
			let pName: string;
			if (this._selectedItem.valueType == PropertyInfo.INTELLECT) {
				pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
			} else if (this._selectedItem.valueType == PropertyInfo.STRENGTH) {
				pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
			} else if (this._selectedItem.valueType == PropertyInfo.STAMINA) {
				pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
			} else if (this._selectedItem.valueType == PropertyInfo.ARMOR) {
				pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02");
			}
			msg = LangManager.Instance.GetTranslation("mounts.mountframe.trainTip01", this.cfgTrainCost, pName, this.cfgTrainCost);
			thane = null;
			if (msg != "") {
				content = msg;
				UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
					content: content,
					backFunction: this.__todayNotAlertTrain.bind(this),
					closeFunction: null,
					point: 0,
					state: 2,
				});
				return;
			}
		} else {
			if (!this.checkCountEnouth(this.cfgTrainCost)) {
				return;
			}

			this.doTrain();
		}
	}

	private checkCountEnouth(value: number = 0): boolean {
		let enough: boolean = true;
		//是否不足培养消耗
		if (this.getBagCount() < value) {
			//兽灵石不足
			let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(ShopGoodsInfo.MOUNT_FOOD_TEMPID, ShopGoodsInfo.PROP_GOODS);
			if (info) {
				FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: 1 });
			} else {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.lackProps"));
			}
			enough = false;
		}
		return enough;
	}

	private get cfgAdvTrainCost(): number {
		return this._trainData.advanceTrainCount * this.cfgTrainCost;
	}

	private get cfgTrainCost(): number {
		let cfgValue = 1;
		// let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Mount_Point");
		// if (cfgItem) {
		//     cfgValue = Number(cfgItem.ConfigValue);
		// }
		return this.cfgValue;
	}

	private __todayNotAlertTrain(notAlert: boolean, useBind: boolean) {
		if (notAlert) {
			SharedManager.Instance.domesticateAlertDate = new Date();
			SharedManager.Instance.saveDomesticateAlert();
		}
		SharedManager.Instance.advDomesticateUseBindDate = new Date();
		SharedManager.Instance.advDomesticateUseBind = useBind;
		SharedManager.Instance.saveAdvDomesticateUseBind();
		this.doTrain();
	}

	private __todayNotAlertTrain2(notAlert: boolean, useBind: boolean) {
		if (notAlert) {
			SharedManager.Instance.domesticateAlertDate2 = new Date();
			SharedManager.Instance.saveDomesticate2Alert();
		}
		SharedManager.Instance.advDomesticateUseBind = useBind;
		this.doTrain();
	}

	private doTrain() {
		if (this._selectedItem.propertyInfo.isLimit) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.gradeIsMax"));
			return;
		}
		// let flag: boolean = false;
		// let hasMoney: number = this.playerInfo.point;
		// if (SharedManager.Instance.advDomesticateUseBind) {
		//     hasMoney = this.playerInfo.point + this.playerInfo.giftToken;
		// }
		// let find: Array<GoodsInfo> = GoodsManager.Instance.getBagGoodsByTemplateId(this._trainData.mountFoodTemplateId);

		// if ((find && find.length > 0) ||
		//     (hasMoney >= this.cfgTrainCost)) {
		//     flag = true;
		// }
		// if (flag) {
		let propValue: number = PropertyInfo.getPropertyValue(this._selectedItem.valueType);
		// let useBind: boolean = true;
		// if (!SharedManager.Instance.advDomesticateUseBind) {
		//     useBind = SharedManager.Instance.advDomesticateUseBind;
		// }
		MountsManager.Instance.domesticate(propValue, 1, this.cfgTrainCost, false);
		// } else {
		//     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.command14"));
		// }
	}

	//高级培养
	private advanceTrainBtnClick() {
		//是否不足培养消耗
		// if (this.getBagCount() < this.cfgAdvTrainCost) {//兽灵石不足
		//     let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(this._trainData.mountFoodTemplateId, ShopGoodsInfo.SHOP);
		//     if (info)
		//         FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: this.cfgAdvTrainCost });
		//     else
		//         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.lackProps"));
		//     return;
		// }
		var t: number = new Date().getTime();
		if (t - this._lastClickTime < 400) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
			return;
		}
		this._lastClickTime = t;
		if (!this._selectedItem) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.command09"));
			return;
		}

		var needAlert: boolean = true; //高级培养提示
		var lastSaveDate: Date = new Date(SharedManager.Instance.advDomesticateAlertDate);
		var today: Date = new Date();
		if (lastSaveDate) {
			if (
				today.getFullYear() == lastSaveDate.getFullYear() &&
				today.getMonth() == lastSaveDate.getMonth() &&
				today.getDate() == lastSaveDate.getDate()
			) {
				needAlert = false;
			}
		}

		// var content: string = LangManager.Instance.GetTranslation("mounts.command06", this.cfgAdvTrainCost);
		// if (this.mountInfo.discount > 0) {
		//     content = LangManager.Instance.GetTranslation("mounts.command06", Math.max((this.cfgAdvTrainCost - 10 * this.getBagCount()) * this.mountInfo.discount * 0.1, this._trainData.advanceTrainCount));
		// }
		var msg: string = "";
		var thane: ThaneInfo = ArmyManager.Instance.thane;
		var job: number = thane.templateInfo.Job;
		var pName: string = "";
		//根据职业得到相应的提示 弓手或战士培养智力 , 法师培养力量 弹出提示
		if (this._selectedItem.valueType == PropertyInfo.INTELLECT) {
			//提示
			pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
			if (this.mountInfo.discount > 0 && this.mountInfo.discount < 10) {
				msg = LangManager.Instance.GetTranslation(
					"mounts.mountframe.trainTip03",
					Math.max((this.cfgAdvTrainCost - 10 * this.getBagCount()) * this.mountInfo.discount * 0.1, this._trainData.advanceTrainCount),
					pName
				);
			} else {
				msg = LangManager.Instance.GetTranslation("mounts.mountframe.trainTip03", this.cfgAdvTrainCost, pName, this._trainData.advanceTrainCount);
			}
		} else if (this._selectedItem.valueType == PropertyInfo.STRENGTH) {
			//提示
			pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
			if (this.mountInfo.discount > 0 && this.mountInfo.discount < 10) {
				msg = LangManager.Instance.GetTranslation(
					"mounts.mountframe.trainTip03",
					Math.max((this.cfgAdvTrainCost - 10 * this.getBagCount()) * this.mountInfo.discount * 0.1, this._trainData.advanceTrainCount),
					pName
				);
			} else {
				msg = LangManager.Instance.GetTranslation("mounts.mountframe.trainTip03", this.cfgAdvTrainCost, pName, this._trainData.advanceTrainCount);
			}
		} else if (this._selectedItem.valueType == PropertyInfo.STAMINA) {
			//提示
			pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
			if (this.mountInfo.discount > 0 && this.mountInfo.discount < 10) {
				msg = LangManager.Instance.GetTranslation(
					"mounts.mountframe.trainTip03",
					Math.max((this.cfgAdvTrainCost - 10 * this.getBagCount()) * this.mountInfo.discount * 0.1, this._trainData.advanceTrainCount),
					pName
				);
			} else {
				msg = LangManager.Instance.GetTranslation("mounts.mountframe.trainTip03", this.cfgAdvTrainCost, pName, this._trainData.advanceTrainCount);
			}
		} else if (this._selectedItem.valueType == PropertyInfo.ARMOR) {
			//提示
			pName = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02");
			if (this.mountInfo.discount > 0 && this.mountInfo.discount < 10) {
				msg = LangManager.Instance.GetTranslation(
					"mounts.mountframe.trainTip03",
					Math.max((this.cfgAdvTrainCost - 10 * this.getBagCount()) * this.mountInfo.discount * 0.1, this._trainData.advanceTrainCount),
					pName
				);
			} else {
				msg = LangManager.Instance.GetTranslation("mounts.mountframe.trainTip03", this.cfgAdvTrainCost, pName, this._trainData.advanceTrainCount);
			}
		}
		thane = null;

		if (needAlert) {
			UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
				content: msg,
				backFunction: this.__todayNotAlert.bind(this),
				closeFunction: null,
				point: 0,
				state: 2,
			});
			return;
		} else {
			this.doAdvanceTrain();
		}
	}

	private __todayNotAlert(notAlert: boolean, useBind: boolean) {
		if (notAlert) {
			SharedManager.Instance.advDomesticateAlertDate = new Date();
			SharedManager.Instance.saveAdvDomesticateAlert();
		}
		SharedManager.Instance.advDomesticateUseBind2 = useBind;
		SharedManager.Instance.saveAdvDomesticateUseBind2();
		this.doAdvanceTrain();
	}

	private __todayNotAlert2(notAlert: boolean, useBind: boolean) {
		if (notAlert) {
			SharedManager.Instance.advDomesticateAlertDate2 = new Date();
			SharedManager.Instance.saveAdvDomesticateAlert();
		}
		SharedManager.Instance.advDomesticateUseBindDate = new Date();
		SharedManager.Instance.advDomesticateUseBind = useBind;
		SharedManager.Instance.saveAdvDomesticateUseBind();
		this.doAdvanceTrain();
	}

	private doAdvanceTrain() {
		if (this._selectedItem) {
			if (this._selectedItem.propertyInfo.isLimit) {
				//最高等级不能继续培养
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.gradeIsMax"));
				return;
			}
			if (!this.checkCountEnouth(this.cfgAdvTrainCost)) {
				return;
			}
			// var flag: boolean = false;
			// var find: Array<GoodsInfo> = GoodsManager.Instance.getBagGoodsByTemplateId(this._trainData.mountFoodTemplateId);
			// var hasMoney: number = this.playerInfo.point;
			// if (SharedManager.Instance.advDomesticateUseBind2) {
			//     hasMoney = this.playerInfo.point + this.playerInfo.giftToken;
			// }

			// if (this.mountInfo.discount > 0 && this.mountInfo.discount < 10) {
			//     var costMoney: number = this.cfgAdvTrainCost * this.mountInfo.discount * 0.1;
			//     if ((find && find.length > 0) ||
			//         (hasMoney >= costMoney)) {
			//         //如果有兽灵石或者多于500钻
			//         flag = true;
			//     }
			// }
			// else {
			//     if ((find && find.length > 0) ||
			//         (hasMoney >= this.cfgAdvTrainCost)) {
			//         //如果有兽灵石或者多于500钻
			//         flag = true;
			//     }
			// }
			// if (flag) {
			var propValue: number = PropertyInfo.getPropertyValue(this._selectedItem.valueType);
			//     var useBind: boolean = true;
			//     if (!SharedManager.Instance.advDomesticateUseBind) {
			//         useBind = SharedManager.Instance.advDomesticateUseBind2;
			//     }
			MountsManager.Instance.domesticate(propValue, 1, 1, false);
			// }
			// else {
			// MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.command14"));
			// }
		} else {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.command09"));
		}
	}

	//上马
	private mountBtnClick() {
		var st: number = new Date().getTime();
		if (st - this._lastClickTime < 900) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
			return;
		}
		if (ArmyManager.Instance.thane.changeShapeId > 0) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mountsFrame.CannotMount"));
			return;
		}
		MountsManager.Instance.mount();
		this._lastClickTime = st;
	}

	//下马
	private restBtnClick() {
		var st: number = new Date().getTime();
		if (st - this._lastClickTime < 900) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
			return;
		}
		MountsManager.Instance.dismount();
		this._lastClickTime = st;
		SpaceManager.Instance.checkIsOnObstacle();
	}

	//兽魂
	private wildSoulBtnClick() {
		FrameCtrlManager.Instance.open(EmWindow.WildSoulWnd, { returnToWin: EmWindow.MountsWnd }, null, EmWindow.MountsWnd);
	}

	private onSwitch() {
		this.shareBtn.visible = ConfigManager.info.MOUNT_SHARE;
	} 

	private refreshView() {
		for (let i: number = 0; i < this.itemList.numChildren; i++) {
			let item: MountPropertyItem = this.itemList.getChildAt(i) as MountPropertyItem;
			if (item) {
				item.update();
			}
		}
		this.onSwitch();
		this.txt_poicon.text = this.countTxt.text = String(this.getBagCount());
		this.moveSpeedTxt.text = LangManager.Instance.GetTranslation("MountWnd.moveSpeedTxt") + " + " + this.mountInfo.speedAdd + "%";
		this.LevelTxt.text = LangManager.Instance.GetTranslation("mounts.command01", this.mountInfo.grade);
		this.growBarProgres.getChild("progress").text = this.mountInfo.currentGrowExp + " / " + this.mountInfo.growExpMax;
		this.growBarProgres.value = (this.mountInfo.currentGrowExp * 100) / this.mountInfo.growExpMax;
		this.mountNameTxt.text = this.mountInfo.template ? this.mountInfo.template.TemplateNameLang : "";
		this.mountInfo.template && this.updateAvatar(this.mountInfo.template.AvatarPath);

		if (this.mountInfo.template && this.mountInfo.template.StarItem == 0) {
			this.starGroup.visible = false;
			this.mountNameTxt.y = 95;
		} else {
			var info: WildSoulInfo = this.wildSoulCollection.getWildSoulInfo(this.mountInfo.templateId);
			if (info) {
				this.img_star.fillAmount = info.starLevel / 5;
				this.starGroup.visible = true;
				this.mountNameTxt.y = 83;
			} else {
				this.starGroup.visible = false;
			}
		}
		this.__onArmyMountStateChange();

		this._openNumberChangeHandler && this._openNumberChangeHandler.recover();
		this._openNumberChangeHandler = Laya.Handler.create(this, this.onOpenNumberChangeHandler, null, false);

		this.cfgValue = this.getBagCount() < this.cfgValue ? (this.getBagCount() < 1 ? 1 : this.getBagCount()) : this.cfgValue;
		this.simBox.show(
			0,
			this.cfgValue,
			1,
			this.getBagCount() < 1 ? 1 : this.getBagCount(),
			this.getBagCount() < 1 ? 1 : this.getBagCount(),
			10,
			this._openNumberChangeHandler
		);
	}

	/**数量变更处理 */
	private onOpenNumberChangeHandler(value: number) {
		this.cfgValue = value;
	}

	private updateAvatar(path: string) {
		if (this._path == path) {
			return;
		}
		this._path = path;
		this._resUrl = this.getUrl(path);
		ResMgr.Instance.loadRes(
			this._resUrl,
			(res) => {
				this.loaderCompleteHandler(res);
			},
			null,
			Laya.Loader.ATLAS
		);
	}

	private loaderCompleteHandler(res: any) {
		if (this._mountMovieClip) {
			this._mountMovieClip.stop();
			this._mountMovieClip.parent && this._mountMovieClip.parent.removeChild(this._mountMovieClip);
		}
		if (!res || this.bgImg.isDisposed) {
			return;
		}
		this._preUrl = res.meta.prefix;
		this._cacheName = this._preUrl;
		let aniName = "";
		AnimationManager.Instance.createAnimation(this._preUrl, aniName, undefined, "", AnimationManager.MapPhysicsFormatLen);
		this._mountMovieClip = new MovieClip(this._cacheName);

		this.bgImg.displayObject.addChild(this._mountMovieClip);
		this._mountMovieClip.gotoAndStop(1);
		let frames = res.frames;
		let offsetX: number = 0;
		let offsetY: number = 0;
		if (res.offset) {
			let offset = res.offset;
			offsetX = offset.footX;
			offsetY = offset.footY;
		}
		let sourceSize = new Laya.Rectangle();
		for (let key in frames) {
			if (Object.prototype.hasOwnProperty.call(frames, key)) {
				let sourceItem = frames[key].sourceSize;
				sourceSize.width = sourceItem.w;
				sourceSize.height = sourceItem.h;
				break;
			}
		}
		this._mountMovieClip.pivotX = sourceSize.width >> 1;
		this._mountMovieClip.pivotY = sourceSize.height >> 1;
		// this._mountMovieClip.x = offsetX
		// this._mountMovieClip.y = offsetY

		let templateId = this.mountInfo.template.TemplateId;
		if (templateId == 8026 || templateId == 8053) {
			//8026（火箭飞艇） 8053（囚牛）位置调右一点
			offsetX = 80;
			offsetY = 30;
		} else if (templateId == 3041) {
			// 恩克2000（3041）
			offsetX = 60;
			offsetY = 30;
		} else if (templateId == 8233) {
			// 图腾魔像（8233）
			offsetX = 20;
			offsetY = -40;
		} else if (templateId == 3069) {
			// 梦幻鹿（3069）
			offsetX = 120;
			offsetY = -20;
		} else if (templateId == 8160) {
			// 白金刚（8160）
			offsetX = 0;
			offsetY = 0;
		} else if (templateId == 8215) {
			// 独轮车（8215）
			offsetX = 50;
			offsetY = -30;
		} else if (templateId == 8204) {
			// 白羽（8204）
			offsetX = 50;
			offsetY = 0;
		} else {
			offsetX = 0;
			offsetY = 30;
		}
		this._mountMovieClip.x = (this.bgImg.width >> 1) + offsetX;
		this._mountMovieClip.y = (this.bgImg.height >> 1) + offsetY;
		this._mountMovieClip.gotoAndPlay(1, true);
	}

	private get wildSoulCollection(): WildSoulCollection {
		return MountsManager.Instance.avatarList;
	}

	private get mountInfo(): MountInfo {
		return MountsManager.Instance.mountInfo;
	}

	private getUrl(path: string): string {
		return PathManager.resourcePath + "equip_show" + path.toLocaleLowerCase() + "/2/2.json";
	}

	private get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	private getBagCount(): number {
		return GoodsManager.Instance.getGoodsNumByTempId(this._trainData.mountFoodTemplateId);
	}

	public OnHideWind() {
		super.OnHideWind();
		this.removeEvent();
	}

	dispose() {
		super.dispose();
		this.itemList && this.itemList.selectNone();
		// this.itemList && this.itemList.itemRenderer && this.itemList.itemRenderer.recover();
		ObjectUtils.disposeObject(this._mountMovieClip);
		Utils.clearGListHandle(this.itemList);
		if (this._mountMovieClip) {
			this._mountMovieClip.stop();
			this._mountMovieClip = null;
		}
		AnimationManager.Instance.clearAnimationByName(this._cacheName);
		MountsManager.Instance.mountResUrlMap.forEach((ele, url) => {
			ResMgr.Instance.releaseRes(url);
		});
		MountsManager.Instance.mountResUrlMap.clear();
		MountsManager.Instance.mountCacheNameUrlMap.forEach((ele, cacheName) => {
			AnimationManager.Instance.clearAnimationByName(cacheName);
		});
		MountsManager.Instance.mountCacheNameUrlMap.clear();
	}
}
