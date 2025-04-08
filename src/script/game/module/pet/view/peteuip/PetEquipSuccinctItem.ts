import FUI_PetEquipSuccinctItem from "../../../../../../fui/Pet/FUI_PetEquipSuccinctItem";
import FUI_StrenAtrriItem1 from "../../../../../../fui/Pet/FUI_StrenAtrriItem1";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_attributeData } from "../../../../config/t_s_attribute";
import { t_s_dropitemData } from "../../../../config/t_s_dropitem";
import { t_s_petequipattrData } from "../../../../config/t_s_petequipattr";
import { t_s_petequipqualityData } from "../../../../config/t_s_petequipquality";
import { t_s_petequipsuitData } from "../../../../config/t_s_petequipsuit";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { BagType } from "../../../../constant/BagDefine";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { PetSkillItem } from "../../../common/pet/PetSkillItem";
import PetCtrl from "../../control/PetCtrl";

export default class PetEquipSuccinctItem extends FUI_PetEquipSuccinctItem {
	declare item1: FUI_StrenAtrriItem1;
	declare item2: FUI_StrenAtrriItem1;
	declare item3: FUI_StrenAtrriItem1;
	declare item4: FUI_StrenAtrriItem1;
	declare item5: FUI_StrenAtrriItem1;

	private _info: GoodsInfo;
	private _petId: number;
	private _currentLevel: number;

	private _hasSuit: boolean = false;
	private _petEquipSuitData: t_s_petequipsuitData;

	private _dropitemDatas: t_s_dropitemData[];
	private _petequipattrDatas: t_s_petequipattrData[];
	private _petEquipQualityData: t_s_petequipqualityData;

	private _hasSkillIcon: boolean = false;
	private _skilltemplateData: t_s_skilltemplateData;

	constructor() {
		super();
	}

	protected onConstruct() {
		super.onConstruct();
		this.initView();
	}

	private initView() {}

	set info(value: GoodsInfo) {
		this._info = value;
		if (!this._info) return;

		this._petId = this.petCtrl.selectedPet ? this.petCtrl.selectedPet.petId : 0;
		this._currentLevel = this._info.strengthenGrade;

		if (this._info.suitId) {
			this._petEquipSuitData = TempleteManager.Instance.getPetEquipSuitData(this._info.suitId);
			this._hasSuit = Boolean(this._petEquipSuitData);
		}

		if (this._info.templateInfo.Property2) {
			this._dropitemDatas = TempleteManager.Instance.getDropItemssByDropId(this._info.templateInfo.Property2);
			if (this._dropitemDatas) {
				let dropItemIds = this._dropitemDatas.map((item) => item.ItemId);
				this._petequipattrDatas = ConfigMgr.Instance.getDicSync(ConfigType.t_s_petequipattr);
				this._petequipattrDatas = dropItemIds.map((key: string | number) => this._petequipattrDatas[key]);
			}
		}

		if (this._info.templateInfo.Profile) {
			this._petEquipQualityData = TempleteManager.Instance.getpetequipqualityData(this._info.templateInfo.Profile);
		}

		if (this._hasSuit && this._petEquipSuitData.SuitSkill) {
			this._skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(this._petEquipSuitData.SuitSkill);
			this._hasSkillIcon = Boolean(this._skilltemplateData && this._skilltemplateData.Icons);
		}

		this.updateView();
		this.updateAttribute(this._info.masterAttr, this._info.sonAttr);
	}

	private updateView() {
		if (this._hasSuit) {
			this.getController("showItem").selectedIndex = 1;

			let equipNum: number = 0;
			let bagArray = GoodsManager.Instance.getGoodsByBagType(BagType.PET_EQUIP_BAG);
			for (let i = 0; i < bagArray.length; i++) {
				if (bagArray[i].suitId == this._info.suitId && bagArray[i].objectId == this._petId) equipNum++;
			}

			if (this._petEquipSuitData.Amount <= 1) {
				this.txt_suit_name.text = LangManager.Instance.GetTranslation("PetEquipTipView.suitSkill");
				let skillTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this._petEquipSuitData.SuitSkill) as t_s_skilltemplateData;
				if (skillTemp) this.txt_suit_desc.text = skillTemp.DescriptionLang;
			} else {
				this.txt_suit_name.text = this._petEquipSuitData.SuitNameLang + "(" + equipNum + "/" + this._petEquipSuitData.Amount + ")";
				this.txt_suit_desc.text = this._petEquipSuitData.DescriptionLang;
			}

			if (this._hasSkillIcon) {
				this.getController("showSkillIcon").selectedIndex = 1;
				let skillItem = this.comp_skillItem as PetSkillItem
				skillItem.visible = true;
				skillItem.info = this._skilltemplateData;
				skillItem.registerTip();
				let _strengthenCond = this._info.strengthenGrade >= this._petEquipSuitData.StrengthenGrow;
				skillItem.lack(!_strengthenCond)
			}
		}
	}

	private updateAttribute(master: string, second: string) {
		let attributeNum: number = 0; //属性数量

		if (master) {
			let masterAttribute = master.split(";");
			for (let i = 0; i < masterAttribute.length; i++) {
				const element = masterAttribute[i];
				if (element.length > 0) {
					attributeNum++;

					let attribute = element.split(":");
					let attributeId = Number(attribute[0]);
					let attributeData: t_s_attributeData = TempleteManager.Instance.getPetEquipAttri(attributeId);
					if (attributeData) {
						let attributeItem = this["item" + attributeNum];
						attributeItem.getChild("img_arrow").visible = false;
						attributeItem.getChild("img_arrow_addition").visible = false;
						attributeItem.getChild("txt_attr_val1").visible = false;

						attributeItem.getChild("txt_attr_key").text = attributeData.AttributeNameLang;
						attributeItem.getChild("txt_attr_val").text = "+" + attribute[1];

						attributeItem.getController("c1").setSelectedIndex(1);
						attributeItem.getController("master").setSelectedIndex(1);
						attributeItem.visible = true;
					}
				}
			}
		}

		if (this._petEquipQualityData) {
			if (second) {
				let secondAttribute = second.split(";");
				for (let i = 0; i < secondAttribute.length; i++) {
					const element = secondAttribute[i];
					if (element.length > 0) {
						attributeNum++;

						let attribute = element.split(":");
						let attributeId = Number(attribute[0]);
						let attributeData: t_s_attributeData = TempleteManager.Instance.getPetEquipAttri(attributeId);
						if (attributeData) {
							let attributeItem = this["item" + attributeNum];
							attributeItem.getChild("img_arrow").visible = false;
							attributeItem.getChild("img_arrow_addition").visible = false;

							attributeItem.getChild("txt_attr_key").text = attributeData.AttributeNameLang;
							attributeItem.getChild("txt_attr_val").text = "+" + attribute[1];

							attributeItem.getChild("txt_attr_val1").visible = false;

							attributeItem.getController("c1").setSelectedIndex(1);
							attributeItem.getController("master").setSelectedIndex(0);
							attributeItem.visible = true;
						}

						if (this._petequipattrDatas && this._petequipattrDatas.some((obj) => obj.AttributeId === attributeId)) {
							let petequipattrData: t_s_petequipattrData = this._petequipattrDatas.find((obj) => obj.AttributeId === attributeId);
							let baseAttribute = petequipattrData.BaseValue.toString().split(",");
							let lv = 0;
							if (Number(attribute[1]) === Number(baseAttribute[0])) {
								lv = 0;
							} else {
								lv = (Number(attribute[1]) - Number(baseAttribute[0])) / Number(petequipattrData.StrengthenGrow);
							}
							lv = Math.floor(lv);
							if (lv > 0) {
								let attributeItem = this["item" + attributeNum];
								attributeItem.getChild("txt_attr_val1").visible = true;
								attributeItem.getChild("txt_attr_val1").text = LangManager.Instance.GetTranslation("mounts.command01", lv);
							}
						}
					}
				}
			}

			//强化至下级是不是可以解锁
			let openLevelArray = this._petEquipQualityData.SonAttrOpen.split(",");
			for (let j = 0; j < openLevelArray.length; j++) {
				const openLevel = Number(openLevelArray[j]);
				if (openLevel > 0 && openLevel > this._currentLevel) {
					if (this._currentLevel < openLevel) {
						attributeNum++;

						let item = this["item" + attributeNum];
						item.getChild("txt_lock").color = "#aaaaaa";
						item.getChild("txt_lock").text = LangManager.Instance.GetTranslation("petEuip.stren.lock", openLevel);
						item.visible = true;
					}
				}
			}
		}
	}

	private get petCtrl(): PetCtrl {
		return FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
	}

	public dispose() {
		this._info = null;
		this._petId = null;
		this._currentLevel = null;
		this._hasSuit = false;
		this._petEquipSuitData = null;
		this._dropitemDatas = null;
		this._petequipattrDatas = null;
		this._petEquipQualityData = null;
		this._hasSkillIcon = false;
		this._skilltemplateData = null;
		super.dispose();
	}
}
