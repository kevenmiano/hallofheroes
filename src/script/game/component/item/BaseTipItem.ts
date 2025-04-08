import FUI_BaseTipItem from "../../../../fui/Base/FUI_BaseTipItem";
import UIButton from "../../../core/ui/UIButton";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import FUIHelper from "../../utils/FUIHelper";

export default class BaseTipItem extends FUI_BaseTipItem {
	private _tipBtn: UIButton;
	constructor() {
		super();
	}

	protected onConstruct() {
		super.onConstruct();
		this._tipBtn = new UIButton(this.tipBtn);
		this._tipBtn.scaleParas.paraScale = 1;
	}

	public setInfo(templateId: number, needTip: boolean = true, icon: string = "") {
		let goods: GoodsInfo = new GoodsInfo();
		goods.templateId = templateId;
		this._tipBtn.icon = icon === "" ? this.getIconStr(templateId) : icon;
		if (needTip) {
			FUIHelper.setTipData(this._tipBtn.view, EmWindow.NewPropTips, goods);
		}
	}

	private getIconStr(templateId: number): string {
		let str: string = "";
		switch (templateId) {
			case TemplateIDConstant.TEMP_ID_DIAMOND: //钻石
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Diam_S");
				break;
			case TemplateIDConstant.TEMP_ID_GIFT: //绑定钻石
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Diam2_S");
				break;
			case TemplateIDConstant.TEMP_ID_GOLD: //黄金
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Coin_S");
				break;
			case TemplateIDConstant.TEMP_ID_XUNZHANG: //勋章
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Insignia_L");
				break;
			case TemplateIDConstant.TEMP_ID_RYSJ: //荣耀水晶
				str = FUIHelper.getItemURL("Base", "Icon_Unit_ryshuijing");
				break;
			case TemplateIDConstant.TEMP_ID_TITAN: //泰坦结晶
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Titan");
				break;
			case TemplateIDConstant.TEMP_ID_MAZE: //迷宫硬币
				str = FUIHelper.getItemURL("Base", "Icon_Unit_CryptTokens");
				break;
			case TemplateIDConstant.TEMP_ID_JINGHUA_HUO: //火之精华
				str = FUIHelper.getItemURL("Space", "asset.stop.Money101");
				break;
			case TemplateIDConstant.TEMP_ID_JINGHUA_SHUI: //水之精华
				str = FUIHelper.getItemURL("Space", "asset.stop.Money102");
				break;
			case TemplateIDConstant.TEMP_ID_JINGHUA_DIAN: //电之精华
				str = FUIHelper.getItemURL("Space", "asset.stop.Money103");
				break;
			case TemplateIDConstant.TEMP_ID_JINGHUA_FENG: //风之精华
				str = FUIHelper.getItemURL("Space", "asset.stop.Money104");
				break;
			case TemplateIDConstant.TEMP_ID_JINGHUA_AN: //暗之精华
				str = FUIHelper.getItemURL("Space", "asset.stop.Money105");
				break;
			case TemplateIDConstant.TEMP_ID_JINGHUA_GUANG: //光之精华
				str = FUIHelper.getItemURL("Space", "asset.stop.Money106");
				break;
			case TemplateIDConstant.TEMP_ID_STONE: //命运石
				str = FUIHelper.getItemURL("Base", "Icon_Unit_FateStone");
				break;
			case TemplateIDConstant.TEMP_ID_SHUJING: //灵魂水晶
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Engrave_2");
				break;
			case TemplateIDConstant.TEMP_ID_DRAGONCRYID: //龙晶
				str = FUIHelper.getItemURL("Base", "Icon_Unit_DragonCrystal");
				break;
			case TemplateIDConstant.TEMP_ID_DRAGONCRYID2: //高级龙晶
				str = FUIHelper.getItemURL("Base", "Icon_Unit_DragonCrystal2");
				break;
			case TemplateIDConstant.TEMP_ID_PET_GROWTH_STONE: //宠物成长石
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Sylph");
				break;
			case TemplateIDConstant.TEMP_ID_PET_COE_STONE: //宠物资质丹
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Sepulcrum");
				break;
			case TemplateIDConstant.TEMP_ID_PET_JINHUN: //英灵晶魂
				str = FUIHelper.getItemURL("Base", "Icon_Unit_petequipstone");
				break;
			case TemplateIDConstant.TEMP_ID_PET_ZIJIN: //紫晶积分
				str = FUIHelper.getItemURL("Base", "Icon_Unit_amethyst");
				break;
			case TemplateIDConstant.TEMP_ID_GOLD_ZUAN: //金刚钻
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Socket_L");
				break;
			case TemplateIDConstant.TEMP_ID_EXP: //经验
				str = FUIHelper.getItemURL("Base", "Img_EXP_S");
				break;
			case TemplateIDConstant.TEMP_ID_FUWEN_STONE: //符文石
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Runes_S");
				break;
			case TemplateIDConstant.TEMP_ID_FUSHI_SUIPIAN: //符石碎片
				str = FUIHelper.getItemURL("Skill", "runegem_fragment_s");
				break;
			case TemplateIDConstant.TEMP_ID_FUKONG: //符孔
				str = FUIHelper.getItemURL("Skill", "runegem_carving_s");
				break;
			case TemplateIDConstant.TEMP_ID_POWER: //体力
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Stamina_S");
				break;
			case TemplateIDConstant.TEMP_ID_XILIAN_SUO: //洗练锁
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Magiclock");
				break;
			case TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE: //神秘商店积分
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Points");
				break;
			case TemplateIDConstant.TEMP_ID_ZHANHUN: //战魂
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Daru");
				break;
			case TemplateIDConstant.TEMP_ID_SHUIJIN: //水晶
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Kyanite");
				break;
			case TemplateIDConstant.TEMP_ID_MYSTERY_STONE: //神秘石
				str = FUIHelper.getItemURL("Base", "Icon_Unit_MysteryStone");
				break;
			case TemplateIDConstant.TEMP_ID_STONE_ENERGY: //符石能量
				str = FUIHelper.getItemURL("Skill", "runegem_point_s");
				break;
			case TemplateIDConstant.TEMP_ID_WISHPOOL: //许愿券
				str = FUIHelper.getItemURL("Shop", "Icon_Unit_WishingPool2");
				break;
			case TemplateIDConstant.TEMP_ID_WISHPOOL_GOLD: //金色许愿券
				str = FUIHelper.getItemURL("Shop", "Icon_Unit_Wishing Pool1");
				break;
			case TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL: //英灵技能卷轴
				str = FUIHelper.getItemURL("Base", "Icon_scroll_s");
				break;
			case TemplateIDConstant.TEMP_ID_MOUNT_FOOD: //兽魂石
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Mount");
				break;
			case TemplateIDConstant.TEMP_ID_SECRETBOOK: //
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Mastery_Page");
				break;
			case TemplateIDConstant.TEMP_ID_SECRETBOOK_M: //
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Mastery_Page2");
				break;
			case TemplateIDConstant.TEMP_ID_SECRETBOOK_H: //
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Mastery_Page3");
				break;
			case TemplateIDConstant.TEMP_ID_CONSORTIA: //恐惧之牙
				str = FUIHelper.getItemURL("Base", "Icon_Unit_consortia");
				break;
			case TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE: //公会贡献
				str = FUIHelper.getItemURL("Base", "Icon_Unit_Contribution");
				break;
			case TemplateIDConstant.TEMP_ID_CONSORTIA_CAIFU: //公会财富
				str = FUIHelper.getItemURL("Base", "Icon_Unit_GuildWealth");
				break;
			case TemplateIDConstant.GUILD_GOODS:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Guild_Goods");
				break;
			case TemplateIDConstant.GUILD_CONTRIBUTION:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Guild_Contribution");
				break;
			case TemplateIDConstant.GUILD_TASK_SCORE:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Guildtask_S");
				break;
			case TemplateIDConstant.TEMP_ID_MASTERY_STONE_P:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Mastery_Stone_1");
				break;
			case TemplateIDConstant.TEMP_ID_MASTERY_STONE_M:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Mastery_Stone_2");
				break;
			case TemplateIDConstant.TEMP_ID_MASTERY_STONE_H:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Mastery_Stone_3");
				break;
			case TemplateIDConstant.TEMP_ID_MASTERY_PIECES_P:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Mastery_Pieces_1");
				break;
			case TemplateIDConstant.TEMP_ID_MASTERY_PIECES_M:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Mastery_Pieces_2");
				break;
			case TemplateIDConstant.TEMP_ID_MASTERY_PIECES_H:
				str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Mastery_Pieces_3");
				break;
		}
		return str;
	}
}
