import FUI_PetEquipTipView from "../../../fui/Base/FUI_PetEquipTipView";
import AudioManager from "../../core/audio/AudioManager";
import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import UIManager from "../../core/ui/UIManager";
import Utils from "../../core/utils/Utils";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { t_s_attributeData } from "../config/t_s_attribute";
import { t_s_dropitemData } from "../config/t_s_dropitem";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { t_s_petequipattrData } from "../config/t_s_petequipattr";
import { t_s_petequipqualityData } from "../config/t_s_petequipquality";
import { t_s_petequipstrengthenData } from "../config/t_s_petequipstrengthen";
import { t_s_petequipsuitData } from "../config/t_s_petequipsuit";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { BagType } from "../constant/BagDefine";
import { ConfigType } from "../constant/ConfigDefine";
import { PetEvent, TipsEvent } from "../constant/event/NotificationEvent";
import { SoundIds } from "../constant/SoundIds";
import { EmWindow } from "../constant/UIDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { SharedManager } from "../manager/SharedManager";
import { TempleteManager } from "../manager/TempleteManager";
import { PetSkillItem } from "../module/common/pet/PetSkillItem";
import PetCtrl from "../module/pet/control/PetCtrl";
import { PetData } from "../module/pet/data/PetData";
import { PetEquipCell } from "../module/pet/view/peteuip/PetEquipCell";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";

/**
 *
 */
export class PetEquipTipView extends FUI_PetEquipTipView {
	// private cEquiped: fgui.Controller;
	private _info: GoodsInfo;
	canOperate: boolean = true;
	public declare comp_skillItem: PetSkillItem;

	private _dropitemDatas: t_s_dropitemData[];
	private _petequipattrDatas: t_s_petequipattrData[];
	private _petequipstrengthenDatas: t_s_petequipstrengthenData[];

	constructor() {
		super();
	}

	protected onConstruct() {
		super.onConstruct();
		this.addEvent();
	}

	addEvent() {
		this.btn_equip.onClick(this, this.btn_equipClick);
		this.btn_putoff.onClick(this, this.btn_putoffClick);
		this.btn_replace.onClick(this, this.btn_replaceClick);
		this.btn_stren.onClick(this, this.btn_strenClick);

		this.btn_resolve.onClick(this, this.btn_resolveClick);
		this.btn_succinct.onClick(this, this.btn_succinctClick);
	}

	public gradeCount: number = 0;
	set info(value: GoodsInfo) {
		this._info = value;
		if (!this._info) return;
		this._petequipstrengthenDatas = ConfigMgr.Instance.getDicSync(ConfigType.t_s_petequipstrengthen);

		if (this._info.templateInfo.Property2) {
			this._dropitemDatas = TempleteManager.Instance.getDropItemssByDropId(this._info.templateInfo.Property2);
			if (this._dropitemDatas) {
				let dropItemIds = this._dropitemDatas.map((item) => item.ItemId);
				this._petequipattrDatas = ConfigMgr.Instance.getDicSync(ConfigType.t_s_petequipattr);
				this._petequipattrDatas = dropItemIds.map((key: string | number) => this._petequipattrDatas[key]);
			}
		}

		(this.item as PetEquipCell).info = this._info;
		this.btn_resolve.enabled = !this.isEquiped;
		this.btn_succinct.enabled = this._info.templateInfo.Property6 !== 0;

		this.initView();
		this.updateAttr(this._info.masterAttr, this._info.sonAttr);

		this.gradeCount = 0;
		if (this.petCtrl.selectedPet && this._info.objectId == this.petCtrl.selectedPet.petId) {
			this.gradeCount = this.getPetEquipBaseScore(this.petCtrl.selectedPet);
		} else {
			this.gradeCount = this.getPetEquipBaseScore(null);
		}

		this.txt_gradeCount.text = LangManager.Instance.GetTranslation(
			"yishi.view.tips.goods.ChatEquipTips.gradeCount",
			"[color=#01F0ED]&nbsp;&nbsp;" + this.gradeCount + "[/color]"
		);

		this.optBox.visible = this.canOperate;
		this.gSuitActiveCond.ensureBoundsCorrect();
		this.gGradeCount.ensureBoundsCorrect();
		this.optBox.ensureBoundsCorrect();
		this.group2.ensureBoundsCorrect();
		this.group3.ensureBoundsCorrect();
		this.group1.ensureBoundsCorrect();
		this.totalBox.ensureBoundsCorrect();
		this.ensureBoundsCorrect();
		this.updateBounds();
	}

	getRefreshArr() {
		let totalCnt = 0;
		for (let index = 1; index <= this._info.strengthenGrade; index++) {
			let cfg: t_s_petequipstrengthenData = TempleteManager.Instance.getPetEquipStrenData(index);
			let curCfg: t_s_petequipstrengthenData = TempleteManager.Instance.getPetEquipStrenData(index);
			let curCnt = cfg.StrengthenConsume;
			if (curCfg) {
				curCnt *= curCfg.Resolveadd / 100;
			}
			totalCnt += curCnt;
		}
		let resolveCnt = this._info.templateInfo.Property5 + totalCnt;
		let obj = { goodsId: this._info.templateInfo.Refresh, count: resolveCnt };

		return obj;
	}

	/**
	 * 显示对比评分
	 */
	showConstrast(point: number) {
		let num = this.gradeCount - point;
		this.txt_contrast.text = Math.abs(num) + "";
		this.txt_contrast.color = num > 0 ? "#71f000" : "#ff2e2e";
		this.img_arrow.rotation = num > 0 ? -90 : 90;
		this.img_arrow.visible = true;
	}

	private initView() {
		this.cEquiped = this.getController("cEquiped");
		this.cEquiped.selectedIndex = this.isEquiped ? 1 : 0;

		if (this.isEquiped) {
			//从英灵装备背包界面打开TIPS:
			this.btn_replace.visible = false;
			this.btn_stren.visible = true;
			this.btn_putoff.visible = true;
			this.btn_equip.visible = false;
		} else {
			//从英灵背包界面打开TIPS:
			//对应的部位上已经有装备 显示对比TIPS
			//当已装备装备时, 显示为培养 替换
			if (this.petCtrl.curPartInfo) {
				this.btn_equip.visible = false;
				this.btn_stren.visible = true;
				this.btn_putoff.visible = false;
				this.btn_replace.visible = true;
			} else {
				//当没有穿戴装备时, 显示为 培养 装备;
				this.btn_equip.visible = true;
				this.btn_stren.visible = true;
				this.btn_putoff.visible = false;
				this.btn_replace.visible = false;
			}
		}

		let petId = this.petCtrl.selectedPet ? this.petCtrl.selectedPet.petId : 0;
		this.txt_name.text = this._info.templateInfo.TemplateNameLang;
		this.txt_name.color = this._info.templateInfo.profileColor;
		// this.btn_stren.title = LangManager.Instance.GetTranslation("armyII.viewII.equip.JewelFrame.JewelFosterTxt");
		// this.btn_putoff.title = LangManager.Instance.GetTranslation("armyII.viewII.skill.btnEquipOff");
		this.txt_part_val.text = LangManager.Instance.GetTranslation("petEuip.part" + this._info.templateInfo.SonType);
		let cfg: t_s_petequipsuitData = TempleteManager.Instance.getPetEquipSuitData(this._info.suitId);

		let hasPetSuitTemp = Boolean(cfg);
		this.cShowSuit.setSelectedIndex(hasPetSuitTemp ? 1 : 0);
		if (hasPetSuitTemp) {
			let equipNum: number = 0;
			let bagArr0 = GoodsManager.Instance.getGoodsByBagType(BagType.PET_EQUIP_BAG);
			for (let i = 0; i < bagArr0.length; i++) {
				const goodsInfo = bagArr0[i];
				if (goodsInfo.suitId == this._info.suitId && petId == goodsInfo.objectId) {
					equipNum++;
				}
			}

			// v1.7
			// 改版后的英灵装备一个装备作为一个套装, 一个装备最多有一条套装属性
			if (cfg.Amount <= 1) {
				this.txt_suit_name.text = LangManager.Instance.GetTranslation("PetEquipTipView.suitSkill");
				let skillTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, cfg.SuitSkill) as t_s_skilltemplateData;
				if (skillTemp) {
					this.txt_suit_desc.text = skillTemp.DescriptionLang;
				} else {
					Logger.warn("[PetEquipTipView]套装" + this._info.suitId + "技能" + cfg.SuitSkill + "模板不存在");
				}
			} else {
				this.txt_suit_name.text = cfg.SuitNameLang + "(" + equipNum + "/" + cfg.Amount + ")";
				this.txt_suit_desc.text = cfg.DescriptionLang;
			}
			let _strengthenCond = this._info.strengthenGrade >= cfg.StrengthenGrow;
			let _active = _strengthenCond && equipNum >= cfg.Amount;
			this.txt_suit_active_cond_val.text = LangManager.Instance.GetTranslation(
				"public.comparisonFigure",
				this._info.strengthenGrade,
				cfg.StrengthenGrow
			);
			this.txt_suit_active_cond_val.color = _strengthenCond ? "#71f000" : "#aaaaaa";
			this.txt_suit_desc.color = _strengthenCond ? "#ffc68f" : "#aaaaaa";

			let skill: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(cfg.SuitSkill);
			if (skill && skill.Icons) {
				this.getController("cShowSkillIcon").selectedIndex = 1;
				this.comp_skillItem.info = skill;
				this.comp_skillItem.registerTip();
				this.comp_skillItem.lack(!_strengthenCond)
			}
		}

		let qualityCfg: t_s_petequipqualityData = TempleteManager.Instance.getpetequipqualityData(this._info.templateInfo.Profile);
		if (qualityCfg) {
			this.txt_maxlv.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.intensify", qualityCfg.StrengMax);
		}
	}

	private calAttr(attId: number, val: number) {
		let petData: PetData;
		if (this.petCtrl.selectedPet && this._info.objectId == this.petCtrl.selectedPet.petId) {
			petData = this.petCtrl.selectedPet;
		}

		let result: number = 0;
		switch (attId) {
			case 1006:
				if (petData) {
					result = (petData.physicalAttack + petData.bagAttack) * (val / 10000);
				} else {
					result = val / 10000;
				}
				break;
			case 1007:
				if (petData) {
					result = (petData.magicAttack + petData.bagMagicattack) * (val / 10000);
				} else {
					result = val / 10000;
				}
				break;
			case 1008:
				if (petData) {
					result = (petData.physicalDefense + petData.bagDefence) * (val / 10000);
				} else {
					result = val / 10000;
				}
				break;
			case 1009:
				if (petData) {
					result = (petData.magicDefense + petData.bagMagicdefence) * (val / 10000);
				} else {
					result = val / 10000;
				}
				break;
			case 1010:
				if (petData) {
					result = (petData.hp + petData.bagLiving) * (val / 10000);
				} else {
					result = val / 10000;
				}
				break;

			default:
				result = val;
				break;
		}

		return Math.round(result);
	}

	private getPetEquipBaseScore(petData: PetData): number {
		let base = 10000;
		//使用英灵的基础值*装备加成万分比+装备加成值
		//力量
		let Power = 0;
		if (this.attrMap[1]) {
			Power = Number(this.attrMap[1]);
		} else if (this.attrMap[1001]) {
			//力量（万分比）
			if (petData) {
				Power = petData.strengthBase * (Number(this.attrMap[1001]) / 10000);
			} else {
				Power = base * (Number(this.attrMap[1001]) / 10000);
			}
		}

		//护甲
		let Agility = 0;
		if (this.attrMap[2]) {
			Agility = Number(this.attrMap[2]);
		} else if (this.attrMap[1002]) {
			//护甲（万分比）
			if (petData) {
				Agility = petData.armorBase * (Number(this.attrMap[1002]) / 10000);
			} else {
				Agility = base * (Number(this.attrMap[1002]) / 10000);
			}
		}

		//智力
		let Intellect = 0;
		if (this.attrMap[3]) {
			Intellect = Number(this.attrMap[3]);
		} else if (this.attrMap[1003]) {
			//智力（万分比）
			if (petData) {
				Intellect = petData.intellectBase * (Number(this.attrMap[1003]) / 10000);
			} else {
				Intellect = base * (Number(this.attrMap[1003]) / 10000);
			}
		}

		//体质
		let Physique = 0;
		if (this.attrMap[4]) {
			Physique = Number(this.attrMap[4]);
		} else if (this.attrMap[1004]) {
			//体质（万分比）
			if (petData) {
				Physique = petData.staminaBase * (Number(this.attrMap[1004]) / 10000);
			} else {
				Physique = base * (Number(this.attrMap[1004]) / 10000);
			}
		}

		//统帅
		let Captain = 0;
		if (this.attrMap[5]) {
			Captain = Number(this.attrMap[5]);
		}

		//物攻
		let Attack = 0;
		if (this.attrMap[6]) {
			Attack = Number(this.attrMap[6]);
		} else if (this.attrMap[1006]) {
			if (petData) {
				Attack = (petData.physicalAttack + petData.bagAttack) * (Number(this.attrMap[1006]) / 10000);
			} else {
				Attack = base * (Number(this.attrMap[1006]) / 10000);
			}
		}

		//物防
		let Defence = 0;
		if (this.attrMap[7]) {
			Defence = Number(this.attrMap[7]);
		} else if (this.attrMap[1007]) {
			if (petData) {
				Defence = (petData.physicalDefense + petData.bagDefence) * (Number(this.attrMap[1007]) / 10000);
			} else {
				Defence = base * (Number(this.attrMap[1007]) / 10000);
			}
		}

		//魔攻
		let MagicAttack = 0;
		if (this.attrMap[8]) {
			MagicAttack += Number(this.attrMap[8]);
		} else if (this.attrMap[1008]) {
			if (petData) {
				MagicAttack = (petData.magicAttack + petData.bagMagicattack) * (Number(this.attrMap[1008]) / 10000);
			} else {
				MagicAttack = base * (Number(this.attrMap[1008]) / 10000);
			}
		}

		//魔防
		let MagicDefence = 0;
		if (this.attrMap[9]) {
			MagicDefence = Number(this.attrMap[9]);
		} else if (this.attrMap[1009]) {
			if (petData) {
				MagicDefence = (petData.magicDefense + petData.bagMagicdefence) * (Number(this.attrMap[1009]) / 10000);
			} else {
				MagicDefence = base * (Number(this.attrMap[1009]) / 10000);
			}
		}

		//生命
		let Live = 0;
		if (this.attrMap[10]) {
			Live += Number(this.attrMap[10]);
		} else if (this.attrMap[1010]) {
			if (petData) {
				Live = (petData.hp + petData.bagLiving) * (Number(this.attrMap[1010]) / 10000);
			} else {
				Live = base * (Number(this.attrMap[1010]) / 10000);
			}
		}

		let Conat = 0;
		if (this.attrMap[11]) {
			Conat = Number(this.attrMap[11]);
		}

		let ForceHit = 0;
		if (this.attrMap[12]) {
			ForceHit = Number(this.attrMap[12]);
		}

		let Parry = 0;
		if (this.attrMap[13]) {
			Parry = Number(this.attrMap[13]);
		}

		let FireResi = 0;
		if (this.attrMap[14]) {
			FireResi = Number(this.attrMap[14]);
		}

		let WaterResi = 0;
		if (this.attrMap[15]) {
			WaterResi = Number(this.attrMap[15]);
		}

		let WindResi = 0;
		if (this.attrMap[16]) {
			WindResi = Number(this.attrMap[16]);
		}

		let ElectResi = 0;
		if (this.attrMap[17]) {
			ElectResi = Number(this.attrMap[17]);
		}

		let DarkResi = 0;
		if (this.attrMap[18]) {
			DarkResi = Number(this.attrMap[18]);
		}

		let LightResi = 0;
		if (this.attrMap[19]) {
			LightResi = Number(this.attrMap[19]);
		}

		let ReduceResi = 0;
		if (this.attrMap[20]) {
			ReduceResi = Number(this.attrMap[20]);
		}

		let Tenacity = 0;
		if (this.attrMap[21]) {
			Tenacity = Number(this.attrMap[21]);
		}

		let Strength = 0;
		if (this.attrMap[22]) {
			Strength = Number(this.attrMap[22]);
		}

		let count: number =
			Attack +
			Defence +
			MagicAttack +
			MagicDefence +
			ForceHit +
			Number(Live / 5) +
			Conat +
			(Power + Agility + Intellect) * 4 +
			(Captain + Physique) * 2 +
			Parry +
			FireResi +
			WaterResi +
			WindResi +
			ElectResi +
			DarkResi +
			LightResi +
			Tenacity +
			Strength;

		// this.additionScore = this.getAddition(Attack) +
		// this.getAddition(Defence) +
		// this.getAddition(MagicAttack) +
		// this.getAddition(MagicDefence) +
		// this.getAddition(ForceHit) +
		// Number(this.getAddition(Live) / 5) +
		// this.getAddition(Conat) +
		// (this.getAddition(Power) + this.getAddition(Agility) + this.getAddition(Intellect)) * 4 +
		// (this.getAddition(Captain) + this.getAddition(Physique)) * 2;
		// this.additionScore = Math.floor(this.additionScore);

		return Math.floor(count);
	}
	/**强化得分. */
	// private additionScore:number=0;

	/**
	 * 取得单项属性加成(强化)
	 * @param preValue 原有属性值,为0时表示没有该项属性,返回0;
	 * @return
	 *
	 */
	private getAddition(preValue: number): number {
		if (preValue == 0) {
			return 0;
		}
		return Number(preValue * this._info.strengthenGrade * 0.1) + this._info.strengthenGrade * 5;
	}

	private attrMap = {};
	/**
	 * masterAttr  英灵装备主属性(属性类型:基础属性值:增幅:)attId1:basenum1:addNum;
	 * sonAttr 字符串, 属性Id:基础属性值:每次增长值
	 */
	private updateAttr(masterAttr: string, sonAttr: string) {
		this.attrMap = {};
		if (masterAttr) {
			let tempArr = masterAttr.split(";");
			for (let i = 0; i < tempArr.length; i++) {
				const element = tempArr[i];
				if (element.length > 0) {
					let arr = element.split(":");
					let attId = Number(arr[0]);
					let cfg: t_s_attributeData = TempleteManager.Instance.getPetEquipAttri(attId);
					if (cfg) {
						//主属性
						this.attrMap[attId] = arr[1];
						this.txt_master_attr.text = cfg.AttributeNameLang;
						let val = this.calAttr(attId, Number(arr[1]));
						this.txt_master_attr_val.text = "+" + val;
						this.txt_master_attr.visible = this.txt_master_attr_val.visible = true;
					}
				}
			}
		}

		this.txt_sonattr_up_tip.visible = false;
		let qualityCfg = TempleteManager.Instance.getpetequipqualityData(this._info.templateInfo.Profile);
		if (!qualityCfg) {
			Logger.warn("t_s_petequipquality无配置", this._info);
			return;
		}

		let curLevel = this._info.strengthenGrade;
		let sonAttrOpenArr = qualityCfg.SonAttrOpen.split(",");
		let sonAttrStrengArr = qualityCfg.SonAttrStreng.split(",");

		if (!sonAttrOpenArr) {
			Logger.warn("t_s_petequipquality配置无属性SonAttrOpen");
			return;
		}
		if (!sonAttrStrengArr) {
			Logger.warn("t_s_petequipquality配置无属性SonAttrStreng");
			return;
		}

		let maxLevel = curLevel >= Number(sonAttrStrengArr[sonAttrStrengArr.length - 1]);
		if (!maxLevel) {
			for (let j = 0; j < sonAttrStrengArr.length; j++) {
				const lv = Number(sonAttrStrengArr[j]);
				if (lv > 0 && curLevel < lv) {
					this.txt_sonattr_up_tip.visible = true;
					this.txt_sonattr_up_tip.text = LangManager.Instance.GetTranslation("petEuip.stren.uptip", lv);
					break;
				}
			}
		}

		let tempArr = sonAttr.split(";");
		for (let i = 0; i <= sonAttrOpenArr.length; i++) {
			let item = this["attr" + (i + 1)];
			if (item) {
				item.visible = true;
				let cOpenAttr = item.getController("cOpenAttr");
				const openLv = Number(sonAttrOpenArr[i]);
				if (curLevel < openLv) {
					cOpenAttr.setSelectedIndex(0);
					item.getChild("txt_openCondition").text = LangManager.Instance.GetTranslation("petEuip.stren.lock2", openLv);
				} else {
					const element = tempArr[i];
					if (element && element.length > 0) {
						let arr = element.split(":");
						let attId = Number(arr[0]);
						let cfg: t_s_attributeData = TempleteManager.Instance.getPetEquipAttri(attId);
						if (cfg) {
							cOpenAttr.setSelectedIndex(1);
							let val = Number(arr[1]);
							item.getChild("txt_attributeName").text = cfg.AttributeNameLang;
							item.getChild("txt_attributeValue").text = "+" + this.calAttr(attId, val);
							this.attrMap[attId] = val;
						}

						if (this._petequipattrDatas && this._petequipattrDatas.some((obj) => obj.AttributeId === attId)) {
							let petequipattrData: t_s_petequipattrData = this._petequipattrDatas.find((obj) => obj.AttributeId === attId);
							let baseAttribute = petequipattrData.BaseValue.toString().split(",");
							let lv = 0;
							if (Number(arr[1]) === Number(baseAttribute[0])) {
								lv = 0;
							} else {
								lv = (Number(arr[1]) - Number(baseAttribute[0])) / Number(petequipattrData.StrengthenGrow);
							}
							lv = Math.floor(lv);
							if (lv > 0) {
								item.getChild("txt_attributeLevel").visible = true;
								item.getChild("txt_attributeLevel").text = "(" + LangManager.Instance.GetTranslation("mounts.command01", Utils.toFixedNum(lv, 3)) + ")";
							}
						}
					} else {
						Logger.warn("服务端数据与t_s_petequipquality配置不同步", tempArr, this._info);
					}
				}
			}
		}
	}

	private btn_resolveClick() {
		//检测当前是否已经选中要分解的装备是否存在好装备（3星以上、紫色以上品质、强化+10以上, 表格配置）
		// if (this._info.strengthenGrade >= 10 || this._info.templateInfo.Profile >= 3 || this._info.star >= 3) {
		// 	//若【存在】触发二次确认界面
		// 	var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
		// 	var confirm1: string = LangManager.Instance.GetTranslation("public.confirm");
		// 	var cancel1: string = LangManager.Instance.GetTranslation("public.cancel");
		// 	let msg = LangManager.Instance.GetTranslation("petEuip.resolveTip");
		// 	SimpleAlertHelper.Instance.Show(
		// 		SimpleAlertHelper.SIMPLE_ALERT,
		// 		null,
		// 		prompt,
		// 		msg,
		// 		confirm1,
		// 		cancel1,
		// 		this.__requestFrameCloseHandler.bind(this)
		// 	);
		// } else {
			if (SharedManager.Instance.notAlertThisLogin) {
				this.callBackFun(true);
			} else {
				UIManager.Instance.ShowWind(EmWindow.GetGoodsAlert, {
					goodsList: [this.getRefreshArr()],
					callback: this.callBackFun.bind(this),
				});
			}
		// }
		this.hide();
	}

	private __requestFrameCloseHandler(b: boolean, flag: boolean) {
		if (b) {
			//关闭和取消不是拒绝
			if (SharedManager.Instance.notAlertThisLogin) {
				this.callBackFun(true);
			} else {
				UIManager.Instance.ShowWind(EmWindow.GetGoodsAlert, {
					goodsList: [this.getRefreshArr()],
					callback: this.callBackFun.bind(this),
				});
			}
		}
	}

	callBackFun(bool: boolean) {
		if (bool) {
			PetCtrl.reqPetEquipResolve(this._info.pos + "");
		}
	}

	private btn_equipClick() {
		if (!this.petCtrl.selectedPet) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petEquip.nopet"));
			this.hide();
			return;
		}
		if (!this.isEquiped) {
			this.moveBagToBag(this._info.bagType, this.petCtrl.selectedPet.petId, this._info.pos, BagType.PET_EQUIP_BAG, 0, this.petCtrl.selectPart, 1);
		}
		this.hide();
	}

	private btn_replaceClick() {
		if (!this.isEquiped) {
			this.moveBagToBag(
				this._info.bagType,
				this.petCtrl.selectedPet.petId,
				this._info.pos,
				BagType.PET_EQUIP_BAG,
				this.petCtrl.selectedPet.petId,
				this.petCtrl.curPartInfo.pos,
				1
			);
			NotificationManager.Instance.dispatchEvent(PetEvent.REPLACE_PET_EQUIP, this._info);
		}
		this.hide();
	}

	private btn_strenClick() {
		UIManager.Instance.ShowWind(EmWindow.PetEuipTrainWnd, this._info);
		this.hide();
	}

	private btn_succinctClick() {
		UIManager.Instance.ShowWind(EmWindow.PetEquipSuccinctWnd, this._info);
		this.hide();
	}

	private btn_putoffClick() {
		if (this.isEquiped) {
			//卸下
			let targetPos: number = GoodsManager.Instance.findPetBagEmputyPos();
			if (targetPos == -1) {
				let str: string = LangManager.Instance.GetTranslation("cell.mediator.consortiabag.ConsortiaCaseCellClickMediator.command01");
				MessageTipManager.Instance.show(str);
				return;
			}
			AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
			// _cell.setGrayFilter();
			this.moveBagToBag(this._info.bagType, this.petCtrl.selectedPet.petId, this._info.pos, BagType.PET_BAG, 0, targetPos, 1);
		}
		this.hide();
	}

	private hide() {
		NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_HIDE);
	}

	private moveBagToBag(
		beginBagType: number,
		beginObjectId: number,
		beginPos: number,
		endBagType: number,
		endObjectId: number,
		endPos: number,
		count: number
	) {
		AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
		PlayerManager.Instance.moveBagToBag(beginBagType, beginObjectId, beginPos, endBagType, endObjectId, endPos, count);
	}

	private get isEquiped(): boolean {
		if (!this._info) {
			return false;
		}

		return this._info.objectId > 0;
	}

	private get petCtrl(): PetCtrl {
		return FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
	}

	removeEvent() {
		this.btn_equip.offClick(this, this.btn_equipClick);
		this.btn_putoff.offClick(this, this.btn_putoffClick);
		this.btn_replace.offClick(this, this.btn_replaceClick);
		this.btn_stren.offClick(this, this.btn_strenClick);

		this.btn_resolve.offClick(this, this.btn_resolveClick);
		this.btn_succinct.offClick(this, this.btn_succinctClick);
	}
}
