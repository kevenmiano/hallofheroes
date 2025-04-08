// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2024-01-23 20:31:51
 * @LastEditors: jeremy.xu
 * @Description: 英灵
 */

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Tabbar from "../../../../core/ui/Tabbar";
import UIManager from "../../../../core/ui/UIManager";
import { ShowPetAvatar } from "../../../avatar/view/ShowPetAvatar";
import { PetEvent, FarmEvent, BagEvent } from "../../../constant/event/NotificationEvent";
import GTabIndex from "../../../constant/GTabIndex";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ConfigManager } from "../../../manager/ConfigManager";
import { FarmManager } from "../../../manager/FarmManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import { AccountCom } from "../../common/AccountCom";
import FarmInfo from "../../farm/data/FarmInfo";
import PetCtrl from "../control/PetCtrl";
import { PetData } from "../data/PetData";
import PetModel from "../data/PetModel";
import { PetItem } from "./item/PetItem";
import { PetComFigure } from "./PetComFigure";
import { PetEquipPartCom } from "./peteuip/PetEquipPartCom";
import { PetEuipBag } from "./peteuip/PetEuipBag";
import UIAttrAdvance from "./UIAttrAdvance";
import UIAttrCommon from "./UIAttrCommon";
import UIAttrIntensify from "./UIAttrIntensify";
import UIPetList from "./UIPetList";
import UIRefining from "./UIRefining";
import UIExchange from "./UIExchange";
import UISkill from "./UISkill";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import UIFormation from "./UIFormation";
import UIPotency from "./UIPotency";
import UIArtifact from "./UIArtifact";


export default class PetWnd extends BaseWindow {
	protected resizeContent: boolean = true;
	protected setSceneVisibleOpen: boolean = true;
	protected  setOptimize: boolean=false;
	private petListBg:fgui.GImage;
	private _uiPetList: UIPetList;
	public get uiPetList(): UIPetList {
		return this._uiPetList;
	}
	private _uiAttrAdvance: UIAttrAdvance;
	private _uiPotency:UIPotency;
	private _uiArtifact:UIArtifact;
	private _uiSkill: UISkill;
	public get uiSkill(): UISkill {
		return this._uiSkill;
	}
	private _uiAttrIntensify: UIAttrIntensify;
	private _uiAttrCommon: UIAttrCommon;
	public get uiAttrCommon(): UIAttrCommon {
		return this._uiAttrCommon;
	}
	private _uiRefining: UIRefining;
	public get uiRefining(): UIRefining {
		return this._uiRefining;
	}
	private _uiExchange: UIExchange;
	public get uiExchange(): UIExchange {
		return this._uiExchange;
	}
	private _uiFormation:UIFormation;
	public get uiFormation(): UIFormation {
		return this.uiFormation;
	}
	public comEquip: PetEuipBag;

	public comFigure: PetComFigure;
	private imgFigureBg: fgui.GImage;
	private _petView: ShowPetAvatar; //主英灵
	private petEquipPartCom: PetEquipPartCom;
	private comAttrCommon: fgui.GComponent;
	private petList: fgui.GList;
	private gAttrTab: fgui.GGroup;
	private gPotencyTab: fgui.GGroup;
	private imgAttrBg: fgui.GImage;
	private account: AccountCom;
	public frame: fgui.GComponent;
	private _data: PetData;

	private _tabbar: Tabbar;
	private _tabMainList: fgui.GButton[] = [];
	private _tabSubMap: Map<number, fgui.GButton[]> = new Map();
	public OnInitWind() {
		super.OnInitWind();
		let pagenode = {
			[PetModel.TabIndex.Pet_AttrAdvance]: this["comAttrAdvance"],
			[PetModel.TabIndex.Pet_AttrIntensify]: this["comAttrIntensify"],
			[PetModel.TabIndex.Pet_Potency]: this["comPotency"],
			[PetModel.TabIndex.Pet_Artifact]: this["comArtifact"],
			[PetModel.TabIndex.Pet_Skill]: this["comSkill"],
			[PetModel.TabIndex.Pet_Refining]: this["comRefining"],
			[PetModel.TabIndex.Pet_Equip]: this["comEquip"],
			[PetModel.TabIndex.Pet_Exchange]: this["comExchange"],
			[PetModel.TabIndex.Pet_Formation]: this["comFormation"],
		};

		this._tabMainList = [this["tabAttr"],this["tabPotency"],this["tabSkill"], this["tabRefining"], this["tabEuip"], this["tabExchange"],this["tabFormation"]];
		let mainIdxAttr = Math.floor(PetModel.TabIndex.Pet_AttrAdvance / 10);
		this._tabSubMap.set(mainIdxAttr, [this["tabAdvance"], this["tabIntensify"]]);

		let mainIndexAtt2 =  Math.floor(PetModel.TabIndex.Pet_Potency / 10);
		this._tabSubMap.set(mainIndexAtt2, [this["subTabPotency"], this["subTabArtifact"]]);

		this["tabRefining"].visible = ComponentSetting.PET_REFING;
		this["tabEuip"].visible = ConfigManager.info.SYS_OPEN;
		this["tabExchange"].visible = ComponentSetting.PET_EXCHANGE;
		this["tabFormation"].visible = ComponentSetting.PET_FORMATION;
		this._tabbar = new Tabbar();
		this._tabbar.init(pagenode, this._tabMainList, this._tabSubMap, this.selectTabCallback.bind(this));
		this._tabbar.interruptCallback = this.interruptCallback.bind(this);
		// this.closeBtn = this.frame.getChild("closeBtn") as fgui.GButton;
		// this.helpBtn = this.frame.getChild("helpBtn") as fgui.GButton;
		// this.closeBtn.onClick(this, this.closeBtnClick);
		// this.helpBtn.onClick(this, this.helpBtnClick);
		this._uiAttrCommon = new UIAttrCommon(this.comAttrCommon);
		this._uiAttrAdvance = new UIAttrAdvance(pagenode[PetModel.TabIndex.Pet_AttrAdvance]);
		this._uiAttrIntensify = new UIAttrIntensify(pagenode[PetModel.TabIndex.Pet_AttrIntensify]);
		this._uiSkill = new UISkill(pagenode[PetModel.TabIndex.Pet_Skill]);
		this._uiExchange = new UIExchange(pagenode[PetModel.TabIndex.Pet_Exchange]);
		this._uiFormation = new UIFormation(pagenode[PetModel.TabIndex.Pet_Formation]);
		this._uiPotency = new UIPotency(pagenode[PetModel.TabIndex.Pet_Potency]);
		this._uiArtifact = new UIArtifact(pagenode[PetModel.TabIndex.Pet_Artifact]);
		if (ComponentSetting.PET_REFING) {
			this._uiRefining = new UIRefining(pagenode[PetModel.TabIndex.Pet_Refining]);
			this._uiRefining.dragCallBack = () => {
				this._uiPetList.setItemSelectNone();
			};
		}

		this._uiPetList = new UIPetList(this.petList);

		this._petView = new ShowPetAvatar();
		this._petView.width = this.comFigure.displayObject.width;
		this._petView.height = this.comFigure.displayObject.height;
		this.comFigure.displayObject.addChild(this._petView);
		this._petView.mouseThrough = true;
		this._petView.mouseEnabled = false;
		this._petView.y = -30;
		this.comFigure.displayObject.setChildIndex(this._petView, this.comFigure.displayObject.numChildren - 4);

		this.petEquipPartCom = this.comFigure.euip as PetEquipPartCom;
		this.comFigure.touchable = true;
	}

	OnShowWind() {
		super.OnShowWind();
		this.addEvent();

		let frameData = this.frameData;
		if (frameData && frameData["tabIndex"]) {
			this.changeIndex(frameData["tabIndex"], false, false);
		} else {
			this.changeIndex(GTabIndex.Pet_AttrAdvance, false, false);
		}

		this._uiPetList.refresh();
		this.delaySelectPetList();
	}

	OnHideWind() {
		super.OnHideWind();
		this.removeEvent();
	}

	private addEvent() {
		this.playerInfo.addEventListener(PetEvent.PET_ADD, this.__addPetHandler, this);
		this.playerInfo.addEventListener(PetEvent.PET_REMOVE, this.__removePetHandler, this);
		this.playerInfo.addEventListener(PetEvent.PET_UPDATE, this.__updatePetHandler, this);
		this.playerInfo.addEventListener(PetEvent.PET_MAXCOUNT_CHANGE, this.__addPetHandler, this);
		if (this.farmInfo) {
			this.farmInfo.addEventListener(FarmEvent.PET_LAND_OPEN, this.__updatePracticePetHandler, this);
			this.farmInfo.addEventListener(FarmEvent.PET_LAND_UPDATE, this.__updatePracticePetHandler, this);
		}
		GoodsManager.Instance.addEventListener(BagEvent.CHECK_BAG_FULL, this.__updateBagHandler, this);
	}

	private removeEvent() {
		if (this.playerInfo) {
			this.playerInfo.removeEventListener(PetEvent.PET_ADD, this.__addPetHandler, this);
			this.playerInfo.removeEventListener(PetEvent.PET_REMOVE, this.__removePetHandler, this);
			this.playerInfo.removeEventListener(PetEvent.PET_UPDATE, this.__updatePetHandler, this);
			this.playerInfo.removeEventListener(PetEvent.PET_MAXCOUNT_CHANGE, this.__addPetHandler, this);
		}
		if (this.farmInfo) {
			this.farmInfo.removeEventListener(FarmEvent.PET_LAND_OPEN, this.__updatePracticePetHandler, this);
			this.farmInfo.removeEventListener(FarmEvent.PET_LAND_UPDATE, this.__updatePracticePetHandler, this);
		}
		GoodsManager.Instance.removeEventListener(BagEvent.CHECK_BAG_FULL, this.__updateBagHandler, this);
	}

	private __updateBagHandler() {

	}

	private delayRefreshPetList(time: number = 200, selectDefItem: boolean = true) {
		Laya.timer.clear(this, this.__refreshPetList);
		Laya.timer.once(time, this, this.__refreshPetList, [selectDefItem]);
	}

	private __refreshPetList(selectDefItem: boolean = true) {
		if (this.destroyed) return;
		this._uiPetList.refresh();
		if (selectDefItem) {
			this.selectDefPetItem(this.ctrl.selectedPet ? this.ctrl.selectedPet.petId : undefined);
		}
	}
	private delaySelectPetList(time: number = 200) {
		Laya.timer.clear(this, this.__selectPetList);
		Laya.timer.once(time, this, this.__selectPetList);
	}

	private __selectPetList() {
		if (this.destroyed) return;
		this.selectDefPetItem(this.ctrl.selectedPet ? this.ctrl.selectedPet.petId : undefined);
	}

	private __addPetHandler(value: PetData) {
		// Logger.info(value);
		this._uiPetList.refresh();
	}
	private __removePetHandler(value: PetData) {
		// Logger.info(value);
		if (PlayerManager.Instance.currentPlayerModel.playerInfo.petNum <= 0) {
			this.ctrl.selectedPet = null;
			this.__refreshPetList();
			return;
		}

		var index = PlayerManager.Instance.currentPlayerModel.playerInfo.petList.indexOf(this.ctrl.selectedPet);
		if (index < 0) {
			Logger.info("当前选中的宠物被移除");
			this.ctrl.selectedPet = null;
		}

		if (this.curTabIndex == PetModel.TabIndex.Pet_Refining) {
			// 内网: 非倒数第一个神格炼化后, 新英灵的头像显示为倒数第一个英灵头像
			this._uiRefining.resetView(); //TODO 待优化
			this.delayRefreshPetList();
		} else {
			this.__refreshPetList();
		}
	}
	private __updatePetHandler(value: PetData) {
		// Logger.info(value, this._data.petId);
		if (this.curTabIndex == PetModel.TabIndex.Pet_Exchange) {
			this.delayRefreshPetList();
			return;
		}
		if (this._data.petId == value.petId) {
			this.data = value;
		} else {
			this._uiPetList.refresh();
		}
	}

	private __updatePracticePetHandler() {
		this._uiPetList.refresh();
		this.refresh();
	}

	public get data(): PetData {
		return this._data;
	}

	public set data(value: PetData) {
		this._data = value;
		this.refresh();
		this.refreshPetFigureInfo();
		this.refreshPetFigure();
	}

	public refresh(index?: number, tag?: string) {
		this.resetViewByTabIndex(this.curTabIndex, false);

		if (!this._data) return;
		if (!index) index = this.curTabIndex;

		this.account.switchIcon(0);
		this.comFigure.getController("c1").setSelectedIndex(0);
		switch (index) {
			case PetModel.TabIndex.Pet_AttrAdvance:
				this.account.switchIcon(6);
				this._uiAttrCommon.type = 0;
				this._uiAttrCommon.data = this._data;
				if (this._uiAttrAdvance) this._uiAttrAdvance.data = this._data;
				break;
			case PetModel.TabIndex.Pet_Skill:
				this.account.switchIcon(14);
				this._uiAttrCommon.type = 0;
				this._uiAttrCommon.data = this._data;
				if (this._uiSkill) this._uiSkill.data = this._data;
				break;
			case PetModel.TabIndex.Pet_AttrIntensify:
				this.account.switchIcon(7);
				this._uiAttrCommon.type = 0;
				this._uiAttrCommon.data = this._data;
				if (this._uiAttrIntensify) this._uiAttrIntensify.data = this._data;
				break;
			case PetModel.TabIndex.Pet_Refining:
				if (this._uiRefining) this._uiRefining.data = this._data;
				break;
			case PetModel.TabIndex.Pet_Equip:
				this.account.switchIcon(8);
				this.comFigure.getController("c1").setSelectedIndex(1);

				if (this.petEquipPartCom) this.petEquipPartCom.updateView(this._data);
				if (this.comEquip) this.comEquip.updateView(this._data);
				break;
			case PetModel.TabIndex.Pet_Exchange:
				if (this._uiExchange) this._uiExchange.data = this._data;
				break;
			case PetModel.TabIndex.Pet_Formation:
				if (this._uiFormation) this._uiFormation.data = this._data;
				break;
			case PetModel.TabIndex.Pet_Potency:
				this._uiAttrCommon.type = 1;
				this._uiAttrCommon.data = this._data;
				if (this._uiPotency) this._uiPotency.data = this._data;
				break;
			case PetModel.TabIndex.Pet_Artifact:
				this._uiAttrCommon.type = 2;
				this._uiAttrCommon.data = this._data;
				if (this._uiArtifact) this._uiArtifact.data = this._data;
				break;
			default:
				break;
		}
	}

	private refreshCommonVisible() {
		let index = this.curTabIndex;
		this.gAttrTab.visible =
			index == PetModel.TabIndex.Pet_AttrIntensify ||
			index == PetModel.TabIndex.Pet_AttrAdvance;
		this.comFigure.btnChangeName.visible = this.imgAttrBg.visible = 
			index == PetModel.TabIndex.Pet_AttrIntensify ||
			index == PetModel.TabIndex.Pet_AttrAdvance||
			index == PetModel.TabIndex.Pet_Potency ||
			index == PetModel.TabIndex.Pet_Artifact;
		this.imgFigureBg.visible = this.comFigure.visible =
			index == PetModel.TabIndex.Pet_AttrIntensify ||
			index == PetModel.TabIndex.Pet_AttrAdvance ||
			index == PetModel.TabIndex.Pet_Equip||
			index == PetModel.TabIndex.Pet_Potency ||
			index == PetModel.TabIndex.Pet_Artifact;
		this.comAttrCommon.visible =
			index == PetModel.TabIndex.Pet_AttrIntensify ||
			index == PetModel.TabIndex.Pet_AttrAdvance||
			index == PetModel.TabIndex.Pet_Potency ||
			index == PetModel.TabIndex.Pet_Artifact;
		this.gPotencyTab.visible = 
			index == PetModel.TabIndex.Pet_Potency ||
		    index == PetModel.TabIndex.Pet_Artifact;
		if (!this._data) {
			this.comFigure.visible = false;
			this.comAttrCommon.visible = false;
		}
	}

	private saveFormation(){
		if(PetModel.needSaveFormation){
			PetCtrl.sendPetFormation(PetModel.saveFormationStr,PetModel.saveFormationIndexStr);
			PetModel.saveFormationStr ="";
			PetModel.saveFormationIndexStr ="";
			PetModel.needSaveFormation = false;
		}
	}

	private resetViewByTabIndex(tabIndex: number, lastTabIndex: boolean = false) {
		
		switch (tabIndex) {
			case PetModel.TabIndex.Pet_AttrAdvance:
				this._uiAttrCommon.resetView();
				if (this._uiAttrAdvance) this._uiAttrAdvance.resetView();
				break;
			case PetModel.TabIndex.Pet_Skill:
				this._uiAttrCommon.resetView();
				if (this._uiSkill) this._uiSkill.resetView();
				break;
			case PetModel.TabIndex.Pet_AttrIntensify:
				this._uiAttrCommon.resetView();
				if (this._uiAttrIntensify) this._uiAttrIntensify.resetView(lastTabIndex);
				break;
			case PetModel.TabIndex.Pet_Refining:
				if (this._uiRefining) this._uiRefining.resetView(false);
				break;
			case PetModel.TabIndex.Pet_Equip:
				if (this.comEquip) this.comEquip.resetView();
				break;
			case PetModel.TabIndex.Pet_Exchange:
				if (this._uiExchange) this._uiExchange.resetView();
				break;
			case PetModel.TabIndex.Pet_Formation:
				if (this._uiFormation) this._uiFormation.resetView();
				break;
			case PetModel.TabIndex.Pet_Potency:
				if (this._uiPotency) this._uiPotency.resetView();
				break;
			case PetModel.TabIndex.Pet_Artifact:
				if (this._uiArtifact) this._uiArtifact.resetView();
				break;
		}
	}

	private refreshPetFigureInfo() {
		if (!this._data) {
			this.comFigure.txtCapacity.text = "";
			this.comFigure.txtName.text = "";
		} else {
			this.comFigure.txtCapacity.text = this._data.fightPower.toString();
			this.comFigure.txtName.text = this._data.name;
			this.comFigure.txtName.color = PetData.getQualityColor(this._data.quality - 1);
		}
	}

	private refreshPetFigure() {
		if (!this._data) {
			this._petView.data = null;
		} else {
			this._petView.data = this._data.template;
		}
	}

	private selectTabCallback(index: number, lastTabIndex: number) {
		// if (index == PetModel.TabIndex.Pet_Refining && PetModel.isHighestStagePet(this.ctrl.selectedPet)) {
		// 	MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCompose.cannotCompose1"));
		// 	this._uiPetList.setItemSelectNone();
		// 	this.refreshCommonVisible();
		// 	this.account.switchIcon(0);
		// 	return;
		// }

		if (!this.ctrl.selectedPet && PetModel.PetListInit) {
			this.selectDefPetItem();
		}
		this.resetViewByTabIndex(lastTabIndex, true);
		this.petListBg.visible = false;
		(this.frame.getChild("helpBtn") as fgui.GButton).visible = true;
		if(index == PetModel.TabIndex.Pet_Formation){
			PetModel.isClickPetList = false;
			this.petListBg.visible = true;
			(this.frame.getChild("helpBtn") as fgui.GButton).visible = false;
		}
		if(index == PetModel.TabIndex.Pet_Potency ||index == PetModel.TabIndex.Pet_Artifact){
			(this.frame.getChild("helpBtn") as fgui.GButton).visible = false;
		}
		this.saveFormation();
		this.refresh(index, null);
		this.refreshCommonVisible();
	}

	// 选中标志
	private selectDefPetItem(petId?: number) {
		// if (this.curTabIndex == PetModel.TabIndex.Pet_Refining) return;

		let selItem: PetItem;
		for (let index = 0; index < this.petList.numChildren; index++) {
			let item = this.petList.getChildAt(index) as PetItem;
			let petData = item.info as PetData;
			if (petData && petId && petData.petId == petId) {
				selItem = item;
				break;
			}
		}

		if (!selItem) {
			for (let index = 0; index < this.petList.numChildren; index++) {
				let item = this.petList.getChildAt(index) as PetItem;
				let petData = item.info as PetData;
				if (petData && petData.isEnterWar) {
					selItem = item;
					break;
				}
			}
		}

		if (selItem) {
			this._uiPetList.setItemSelect(selItem);
			this._uiPetList.scrollToView(selItem);
		} else {
			if (this.petList.numChildren > 0) {
				this._uiPetList.setItemSelect(this.petList.getChildAt(0) as PetItem);
			}
		}
		this.refreshCommonVisible();
	}

	private checkEditSkill(): boolean {
		if (this.uiSkill && this.uiSkill.isSetting) {
			let content = LangManager.Instance.GetTranslation('skill.editSave');
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, content, null, null, this.__checkEditSkill.bind(this));
			return true;
		}
		return false;
	}

	private _needChangeIndex: number = 0
	private __checkEditSkill(b: boolean) {
		if (b) {
			this.uiSkill.btnSetClick();
		}
		if (this._needChangeIndex > 0) {
			this.changeIndex(this._needChangeIndex);
			this._needChangeIndex = 0;
		}
	}

	public changeIndex(index: number, bConvert: boolean = false, bSwitchSound: boolean = true) {
		this._tabbar.changeIndex(index, bConvert, bSwitchSound);
	}

	private interruptCallback(changeToTabIndex: number): boolean {

		if (this.curTabIndex == PetModel.TabIndex.Pet_Skill) {
			if (this.checkEditSkill()) {
				this._needChangeIndex = changeToTabIndex;
				return true
			}
		}

		switch (changeToTabIndex) {
			default:
				return false;
		}
	}

	private closeBtnClick() {
		FrameCtrlManager.Instance.exit(EmWindow.Pet);
	}

	private helpBtnClick() {
		let index = PetModel.HelpIndex[this.curTabIndex];
		if (index) {
			let keyArr = {[2]:2, [4]:4, [5]:51, [6]:6, [7]:7, [9]:9}
			let title = LangManager.Instance.GetTranslation("public.help");
			let content = LangManager.Instance.GetTranslation("PetFrame.help0" + keyArr[index]);
			UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
		}
	}

	private btnChangeNameClick() {
		FrameCtrlManager.Instance.open(EmWindow.PetRename, this._data);
	}

	public get curTabIndex(): number {
		return this._tabbar.curTabIndex;
	}

	public get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	public get farmInfo(): FarmInfo {
		return FarmManager.Instance.model.myFarm;
	}

	private resetView() {
		// let show = Boolean(this._data)
		// this.comFigure.visible = show
		// this.comFigure.txtCapacity.visible = show
		// this.comFigure.txtName.visible = show
		// this.comFigure.imgFlag.visible = show
	}

	public dispose() {
		this.saveFormation();
        PetData.FastSkillKeyTemp = "";
		for (let i = 0; i < this.petList.numChildren; i++) {
			const element = this.petList.getChildAt(i);
			element.dispose();
		}
		Laya.timer.clearAll(this);
		if (this._petView) this._petView.dispose();
		if (this._uiAttrAdvance) this._uiAttrAdvance.dispose();
		if (this._uiSkill) this._uiSkill.dispose();
		if (this._uiAttrIntensify) this._uiAttrIntensify.dispose();
		if (this._uiRefining) this._uiRefining.dispose();
		if (this._uiPetList) this._uiPetList.dispose();
		if (this._uiExchange) this._uiExchange.dispose();
		super.dispose();
	}
}
