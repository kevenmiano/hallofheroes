/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-10-17 17:24:20
 * @LastEditors: jeremy.xu
 * @Description:
 */

import LangManager from "../../../../core/lang/LangManager";
import { isCNLanguage } from "../../../../core/lang/LanguageDefine";
import LayerMgr from "../../../../core/layer/LayerMgr";
import ResMgr from "../../../../core/res/ResMgr";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../../core/ui/UIButton";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import { IconFactory } from "../../../../core/utils/IconFactory";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import Utils from "../../../../core/utils/Utils";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { PetEvent } from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ShopManager } from "../../../manager/ShopManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import PetFastSkillItem from "../../common/pet/PetFastSkillItem";
import { PetSkillItem, EmPetSkillItemType } from "../../common/pet/PetSkillItem";
import { ShopModel } from "../../shop/model/ShopModel";
import PetCtrl from "../control/PetCtrl";
import { PetData } from "../data/PetData";

export default class UISkill extends BaseFguiCom {
	private _data: PetData;
	private _skillDataTempArr: t_s_skilltemplateData[] = [];

	private skillLibList: fgui.GList;
	private fastSkillList: fgui.GList;
	private btnSet: UIButton;
	private selectSamButton: UIButton = null;
	private skillSimBtn1: UIButton;//切换按钮1
	private skillSimBtn2: UIButton;//切换按钮2
	private txtEditTip: fgui.GTextField;

	public isSetting: boolean = false;
	private isFastEquipSkill: boolean;

	constructor(comp: fgui.GComponent) {
		super(comp);
		this.initView();
	}

	private initView() {
		Utils.setDrawCallOptimize(this.skillLibList);
		Utils.setDrawCallOptimize(this.fastSkillList);
		this.skillLibList.displayObject["dyna"] = true;
		this.fastSkillList.displayObject["dyna"] = true;

		this.getController("isOversea").selectedIndex = isCNLanguage() ? 0 : 1;

		this.skillLibList.on(fairygui.Events.CLICK_ITEM, this, this.onSkillLibListClickItem);
		this.fastSkillList.on(fairygui.Events.CLICK_ITEM, this, this.onFastSkillListClickItem);
		this.skillLibList.itemRenderer = Laya.Handler.create(this, this.onRenderListLibItem, null, false);
		this.view.parent.on(fgui.Events.DROP, this, this.onComSkillDrop);

		this.skillSimBtn1.onClick(this, this.onSwitchSkillBtnClick);
		this.skillSimBtn2.onClick(this, this.onSwitchSkillBtnClick);
	}

	public get data(): PetData {
		return this._data;
	}

	public set data(value: PetData) {
		this.removeEvent();
		this._data = value;
		this.initData();
		this.addEvent();
		this.updateFallowSkill();
		this.updateSkillLib();
		this.updateFastSkill();
		this.updateDoubleSkillBtnState();
		this.updateEquipedFlag();
	}

	private initData() {
		this.initSkillDataTemp();
		this.initFastKeyTemp();
		this.resetSettingBtn();
		this.resetSkillLibShow();
		this.resetFastSkillShow();
	}

	private addEvent() {
		if (this._data) {
			this._data.addEventListener(PetEvent.PET_CHANGE_SKILL_CHANGE, this.mPetChangeSkillChange, this)
		}
	}
	private removeEvent() {
		if (this._data) {
			this._data.removeEventListener(PetEvent.PET_CHANGE_SKILL_CHANGE, this.mPetChangeSkillChange, this)
		}
	}

	private initSkillDataTemp() {
		if (this._data) {
			this._skillDataTempArr = this.shopModel.petSkill[this._data.template.PetType]
			if (this._skillDataTempArr.length) {
				this._skillDataTempArr.sort((skillTempA, skillTempB) => {
					let a1 = skillTempA.UseWay == 2 ? 0 : 100
					let b1 = skillTempB.UseWay == 2 ? 0 : 100
					let b = skillTempA.TemplateId > skillTempB.TemplateId
					let a2 = b ? 10 : 0
					let b2 = b ? 0 : 10

					let sumA = a1 + a2
					let sumB = b1 + b2
					return sumB - sumA
				})
			}
		}
	}

	// 缓存快捷键
	private initFastKeyTemp() {
		if (this._data) {
			PetData.FastSkillKeyTemp = this._data.petFastKeyOfString;
		} else {
			PetData.FastSkillKeyTemp = "";
		}
	}

	private updateFallowSkill() {
		let skills: t_s_skilltemplateData[] = this._data.followSkillTemplates;
		for (let i: number = 0; i < 3; i++) {
			let item: PetSkillItem = this["fallowSkill" + (i + 1)];
			item.type = EmPetSkillItemType.FallowSkill;
			item.canOperate = false;
			item.info = skills[i];
		}
	}

	private updateSkillLib() {
		if (this._skillDataTempArr) {
			this.skillLibList.numItems = this._skillDataTempArr.length;
		}
	}

	private updateFastSkill() {
		let fastKey: string[] = this._data.petFastKeyOfString.split(",");
		for (let i: number = 0; i < PetData.CHANGE_SKILL_NUM; i++) {
			let item: PetFastSkillItem = this.fastSkillList.getChildAt(i) as PetFastSkillItem;

			const temp = this._data.getChangeSkillTemplate(Number(fastKey[i])) as t_s_skilltemplateData;

			(item.item as PetSkillItem).type = EmPetSkillItemType.FastSkill;
			(item.item as PetSkillItem).canOperate = false;
			item.index = i + 1;
			item.info = temp;
			item.on(fgui.Events.DRAG_START, this, this.onFastSkillDragStart);
			item.on(fgui.Events.DROP, this, this.onFastSkillDrop);
		}
	}

	private updateEditMode() {
		for (let i = 0; i < this.skillLibList.numChildren; i++) {
			const skillItem: PetSkillItem = this.skillLibList.getChildAt(i) as PetSkillItem;
			if (skillItem && !skillItem.isDisposed) {
				skillItem.draggable = this.isSetting;
				skillItem.unRegisterTip();
				if (this.isSetting) {
					// skillItem.showType = TipsShowType.onLongPress
					// skillItem.registerTip();
				} else {
					// skillItem.showType = TipsShowType.onClick
					skillItem.registerTip();
				}
			}
		}

		for (let i = 0; i < this.fastSkillList.numChildren; i++) {
			const skillItem: PetFastSkillItem = this.fastSkillList.getChildAt(i) as PetFastSkillItem;
			if (skillItem && !skillItem.isDisposed) {
				skillItem.draggable = this.isSetting;
				if (this.isSetting) {
					(skillItem.item as PetSkillItem).unRegisterTip();
				} else {
					(skillItem.item as PetSkillItem).registerTip();
				}
			}
		}
	}

	private onSkillLibListClickItem(item: PetSkillItem) {
		if (!item.info) return;

		if (this.isSetting) {
			if (!item.isLearned) {
				this.skillLibList.selectNone();
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.unstudy'));
			} else if (item.isPasssive) {
				this.skillLibList.selectNone();
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.unequip'));
			} else {
				if (this.emptyFastSkillItem(item.info)) {
					// 置空快捷栏重复位
				} else {
					// 按顺序补齐快捷栏空位
					let b = this.setFastSkillItem(item.info)
					if (!b) {
						MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.isfull'));
					}
				}
				this.updateSkillFlagShow();
				this.updateEditMode();
			}
		} else {
			this.skillLibList.selectNone();
		}
	}

	private onFastSkillListClickItem(item: PetFastSkillItem) {
		if (this.isSetting) {
			item.info = null;
			this.updateSkillFlagShow();
			return;
		}
	}

	private onRenderListLibItem(index: number, item: PetSkillItem) {
		let itemData = this._skillDataTempArr[index]
		if (!itemData) {
			item.info = null;
			return
		}

		item.type = EmPetSkillItemType.SkillLib
		item.extData = this._data;
		item.info = itemData
		item.cShowSelect.setSelectedIndex(1);
		item.on(fgui.Events.DRAG_START, this, this.onPetSkillLibDragStart);
	}

	private emptyFastSkillItem(info: t_s_skilltemplateData) {
		for (let index = 0; index < this.fastSkillList.numChildren; index++) {
			const item: PetFastSkillItem = this.fastSkillList.getChildAt(index) as PetFastSkillItem;
			if (item.info == info) {
				item.info = null;
				return true;
			}
		}
		return false;
	}

	private getEmptyFastSkillItem() {
		for (let index = 0; index < this.fastSkillList.numChildren; index++) {
			const item: PetFastSkillItem = this.fastSkillList.getChildAt(index) as PetFastSkillItem;
			if (item && !item.info) {
				return item;
			}
		}
		return null;
	}

	private getSkillLibItemBySonType(sonType: number) {
		for (let index = 0; index < this.skillLibList.numChildren; index++) {
			const item: PetSkillItem = this.skillLibList.getChildAt(index) as PetSkillItem;
			if (item && item.info && sonType == item.info.SonType) {
				return item
			}
		}
		return null
	}

	private setFastSkillItem(info: t_s_skilltemplateData) {
		for (let index = 0; index < this.fastSkillList.numChildren; index++) {
			const item: PetFastSkillItem = this.fastSkillList.getChildAt(index) as PetFastSkillItem;
			if (!item.info) {
				item.info = info;
				return true;;
			}
		}
		return false;
	}

	// 拖动丢弃快捷技能
	private onComSkillDrop(sourceView: any, evt: Laya.Event) {
		if (sourceView instanceof PetFastSkillItem) {
			sourceView.info = null
			this.updateSkillFlagShow()
		}
	}

	// 开始拖动技能库中技能
	private onPetSkillLibDragStart(evt: Laya.Event) {
		let item: PetSkillItem = <PetSkillItem>fgui.GObject.cast(evt.currentTarget);
		//取消对原目标的拖动, 换成一个替代品
		item.stopDrag();
		if (!item.info) return;
		if (!item.isLearned) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.unstudy'));
			return;
		}
		if (item.isPasssive) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.unequip'))
			return;
		}
		fgui.DragDropManager.inst.startDrag(item, item.icon, item);
	}

	// 开始拖动快捷技能
	private onFastSkillDragStart(evt: Laya.Event) {
		let item: PetFastSkillItem = <PetFastSkillItem>fgui.GObject.cast(evt.currentTarget);
		//取消对原目标的拖动, 换成一个替代品
		item.stopDrag();
		if (!item.info) return;
		fgui.DragDropManager.inst.startDrag(item, item.item.icon, item);
	}

	// 技能库、快捷技能拖动到快捷技能
	private onFastSkillDrop(sourceView: any, evt: Laya.Event) {
		let item: PetFastSkillItem = <PetFastSkillItem>fgui.GObject.cast(evt.currentTarget);
		if (sourceView instanceof PetFastSkillItem) {
			let temp = sourceView.info;
			sourceView.info = item.info;
			item.info = temp;
		} else if (sourceView instanceof PetSkillItem) {
			this.emptyFastSkillItem(sourceView.info)
			let temp = sourceView.info;
			item.info = temp;
		} else { }

		this.updateSkillFlagShow()
		this.updateEditMode()
	}

	private updateSkillFlagShow() {
		PetData.FastSkillKeyTemp = "";
		for (let index = 0; index < PetData.CHANGE_SKILL_NUM; index++) {
			const item: PetFastSkillItem = this.fastSkillList.getChildAt(index) as PetFastSkillItem;

			if (item && item.info) {
				PetData.FastSkillKeyTemp += item.info.SonType + ",";
			} else {
				PetData.FastSkillKeyTemp += "-1,";
			}

			if (item) {
				item.showEquipingAni(!Boolean(item.info));
			}
		}

		this.updateEquipedFlag();
	}

	private updateEquipedFlag() {
		for (let index = 0; index < this.skillLibList.numChildren; index++) {
			const item: PetSkillItem = this.skillLibList.getChildAt(index) as PetSkillItem;
			if (item) {
				item.equiped = PetData.inFastSkillKeyTemp(item.info && item.info.SonType);
			}
		}
	}

	private mPetChangeSkillChange(petData: PetData, skillInfo: t_s_skilltemplateData) {
		if (this._data && this._data.petId == petData.petId) {
			let skillLibItem = this.getSkillLibItemBySonType(skillInfo.SonType);
			if (skillLibItem) {
				let pos = skillLibItem.localToGlobal(0, 0);
				this.fastEquipSkill(skillLibItem.info, pos);
			}
		}
	}

	private fastEquipSkill(info: t_s_skilltemplateData, srcPoint?: Laya.Point) {
		if (this.isFastEquipSkill) return;

		if (info.UseWay == 2) return;

		if (PetData.inFastSkillKeyTemp(info.SonType)) return;

		let fastItem = this.getEmptyFastSkillItem();
		if (!fastItem) return;

		if (srcPoint) {
			this.isFastEquipSkill = true;
			let iconUrl = IconFactory.getTecIconByIcon(info.Icons);
			let moveItem = new Laya.Sprite();
			moveItem.texture = ResMgr.Instance.getRes(iconUrl);
			moveItem.pos(srcPoint.x, srcPoint.y);
			LayerMgr.Instance.addToLayer(moveItem, EmLayer.STAGE_DRAG_LAYER);

			let dstPoint: Laya.Point = fastItem.parent.localToGlobal(fastItem.x, fastItem.y);
			Laya.Tween.to(moveItem, { x: dstPoint.x, y: dstPoint.y }, 100, null, Laya.Handler.create(this, () => {
				this.isFastEquipSkill = false;
				fastItem.info = info;
				ObjectUtils.disposeObject(moveItem);

				this.updateSkillFlagShow();
				PetCtrl.setSkillFastKey(this._data.petId, PetData.FastSkillKeyTemp);
			}));
		} else {
			fastItem.info = info;
			this.updateSkillFlagShow();
		}
		this.updateEditMode();
	}

	//////////////////////////////////// 双技能 begin ///////////////////////////////////
	private updateDoubleSkillBtnState() {
		let activieDouble: boolean = this._data.isActiveSecond;
		let samLock1 = this.skillSimBtn1.view.getController('locked');
		let samLock2 = this.skillSimBtn2.view.getController('locked');
		samLock1.selectedIndex = 0;
		samLock2.selectedIndex = activieDouble ? 0 : 1;


		let samSelect1 = this.skillSimBtn1.view.getController('select');
		let samSelect2 = this.skillSimBtn2.view.getController('select');

		let curSkillIndex = this._data.skillIndex;
		samSelect1.selectedIndex = curSkillIndex == 0 ? 1 : 0;
		samSelect2.selectedIndex = curSkillIndex == 1 ? 1 : 0;
		if (curSkillIndex == 1) {
			this.selectSamButton = this.skillSimBtn2;
		}
		else {
			this.selectSamButton = this.skillSimBtn1;
		}
	}

	private activeDoubleSkill() {
		let cfgValue = 200;
		let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("pet_skillpoint");
		if (cfgItem) {
			cfgValue = Number(cfgItem.ConfigValue);
		}
		let point: string = cfgValue.toString();
		let content: string = LangManager.Instance.GetTranslation("armyII.viewII.skill.ActiveAlertContent", point);
		SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { point: point, checkDefault: true }, null, content, null, null, this.__activeDoubleSkill.bind(this));
	}

	private __activeDoubleSkill(b: boolean, flag: boolean) {
		if (b) {
			PetCtrl.sendActiveDoubleSkill(this._data.petId, flag);
		}
	}

	private onSwitchSkillBtnClick(targetBtn) {
		if (!this._data) return;

		if (this.isSetting) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.edit'))
			return;
		}

		if (targetBtn === this.skillSimBtn2.view && !this._data.isActiveSecond) {
			this.activeDoubleSkill();
			return;
		}

		if (targetBtn == this.selectSamButton.view) {
			return;
		}

		if (PlayerManager.Instance.currentPlayerModel.playerInfo.isSkillEditOpen) {
			let str = LangManager.Instance.GetTranslation("skillEdit.init1");
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, str, null, null, this.__onSwitchSkillBtnClick.bind(this));
			return;
		}
		PetCtrl.switchSkillIndex(this._data.petId, this._data.changeSkillIndex);
	}

	private __onSwitchSkillBtnClick(b: boolean, flag: boolean) {
		if (!b) return;
		PetCtrl.switchSkillIndex(this._data.petId, this._data.changeSkillIndex);
	}
	//////////////////////////////////// 双技能 end ///////////////////////////////////


	public btnSetClick() {
		if (!this._data) {
			return;
		}

		if (this.btnSet.title == LangManager.Instance.GetTranslation('setting.SettingFrame.title')) {
			this.btnSet.title = LangManager.Instance.GetTranslation('armyII.viewII.information.InformationView.save');
			this.isSetting = true;
			this.txtEditTip.visible = true;
			this.updateSkillFlagShow();
		} else {
			this.resetSettingBtn();
			this.resetSkillLibShow();
			this.resetFastSkillShow();
			PetCtrl.setSkillFastKey(this._data.petId, PetData.FastSkillKeyTemp);
		}
		this.updateEditMode();
	}

	private resetFastSkillShow() {
		for (let index = 0; index < this.fastSkillList.numChildren; index++) {
			const item: PetFastSkillItem = this.fastSkillList.getChildAt(index) as PetFastSkillItem;
			item.showEquipingAni(false);
		}
	}

	private resetSkillLibShow() {
		this.skillLibList.selectNone();
	}

	private resetSettingBtn() {
		this.isSetting = false;
		this.txtEditTip.visible = false;
		this.btnSet.title = LangManager.Instance.GetTranslation('setting.SettingFrame.title');
	}

	private get shopModel(): ShopModel {
		return ShopManager.Instance.model;
	}

	public resetView() { }

	public dispose() {
		this.removeEvent();
		super.dispose();
	}
}