// @ts-nocheck
import FUI_AccountCom from "../../../../fui/Base/FUI_AccountCom";
import { FormularySets } from "../../../core/utils/FormularySets";
import { BagType } from "../../constant/BagDefine";
import ColorConstant from "../../constant/ColorConstant";
import { BagEvent, ResourceEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import GoodsSonType from "../../constant/GoodsSonType";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ResourceData } from "../../datas/resource/ResourceData";
import { GoodsManager } from "../../manager/GoodsManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import HomeWnd from "../home/HomeWnd";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { TattooModel } from "../sbag/tattoo/model/TattooModel";

import { GoodsCheck } from "../../utils/GoodsCheck";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { TempleteManager } from "../../manager/TempleteManager";
import FUI_BaseTipItem from "../../../../fui/Base/FUI_BaseTipItem";
import { ArmyManager } from "../../manager/ArmyManager";
import OpenGrades from "../../constant/OpenGrades";
import { MessageTipManager } from "../../manager/MessageTipManager";
import LangManager from "../../../core/lang/LangManager";

/**
 * 新版背包
 * @description 用户账户余额信息界面
 * @author zhihua.zhou
 * @date 2022/12/1
 * @ver 1.3
 */
export class AccountCom extends FUI_AccountCom {
	//@ts-ignore
	public diamondTip: BaseTipItem;
	//@ts-ignore
	public giftTip: BaseTipItem;
	//@ts-ignore
	public goldTip: BaseTipItem;
	//@ts-ignore
	public tipItem1: BaseTipItem; //勋章
	//@ts-ignore
	public tipItem2: BaseTipItem; //命运石
	//@ts-ignore
	public tipItem3: BaseTipItem; //灵魂水晶
	//@ts-ignore
	public tipItem4: BaseTipItem; //龙晶
	//@ts-ignore
	public tipItem5: BaseTipItem; //宠物成长石
	//@ts-ignore
	public tipItem6: BaseTipItem; //宠物资质丹
	//@ts-ignore
	public tipItem7: BaseTipItem; //英灵晶魂
	//@ts-ignore
	public tipItem8: BaseTipItem;
	//@ts-ignore
	public tipItem9: BaseTipItem;
	//@ts-ignore
	public tipItem10: BaseTipItem;
	//@ts-ignore
	public tipItem11: BaseTipItem;
	//@ts-ignore
	public tipItem12: BaseTipItem;
	//@ts-ignore
	public tipItem13: BaseTipItem; // 宠物技能卷轴
	//@ts-ignore
	public tipItem14:BaseTipItem;//高级龙晶
	//@ts-ignore
	public tipItem15:BaseTipItem;//公会建设

	onConstruct() {
		super.onConstruct();
		this.showRechargeBtn(true);
		this.addEvent();
		this.initAccount();
		this.diamondTip.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
		this.giftTip.setInfo(TemplateIDConstant.TEMP_ID_GIFT);
		this.goldTip.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
		this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_XUNZHANG);
		this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_STONE);
		this.tipItem3.setInfo(TemplateIDConstant.TEMP_ID_SHUJING);
		this.tipItem4.setInfo(TemplateIDConstant.TEMP_ID_DRAGONCRYID);
		this.tipItem5.setInfo(TemplateIDConstant.TEMP_ID_PET_GROWTH_STONE);
		this.tipItem6.setInfo(TemplateIDConstant.TEMP_ID_PET_COE_STONE);
		this.tipItem7.setInfo(TemplateIDConstant.TEMP_ID_PET_JINHUN);
		this.tipItem8.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
		this.tipItem9.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA);
		this.tipItem10.setInfo(TemplateIDConstant.TEMP_ID_MAZE);
		this.tipItem11.setInfo(TemplateIDConstant.TEMP_ID_WISHPOOL);
		this.tipItem12.setInfo(TemplateIDConstant.TEMP_ID_WISHPOOL_GOLD);
		this.tipItem13.setInfo(TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL);
		this.tipItem14.setInfo(TemplateIDConstant.TEMP_ID_DRAGONCRYID2);
		this.tipItem15.setInfo(TemplateIDConstant.GUILD_CONTRIBUTION);
	}

	public switchIcon(type: number) {
		this.typeCtrl.selectedIndex = type;
		switch (type) {
			case 0:
				this.__refreshGold();
				break;
			case 1:
				this.refreshGem();
				break;
			case 2:
				this.refreshDragon();
				break;
			case 3:
				this.refreshFortune();
				break;
			case 4:
				this.refreshMedal();
				break;
			case 5:
				this.refreshDragonCrystal();
				break;
			case 6:
				this.refreshPetGrowthStone();
				break;
			case 7:
				this.refreshPetCoeStone();
				break;
			case 8:
				this.refreshPetEquipStrengStone();
				break;
			case 9:
				this.refreshTxt8();
				break;
			case 10:
				this.refreshTxt9();
				break;
			case 11:
				this.refreshTxt10();
				break;
			case 12:
				this.refreshMedal();
				break;
			case 13:
				this.refreshWishPool();
				break;
			case 14:
				this.refreshPetSkillScroll();
				break;
			case 15:
				this.refreshTxt11();
					break;
		}
	}

	private addEvent() {
		this.btn_buy.onClick(this, this.onBuy);
		this.petGrowthStone_buy.onClick(this, this.onPetGrowthStoneBuy);
		ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerDataUpdate, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.refreshTxt8, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.CONSORTIA_COIN_CHANGE, this.refreshTxt9, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.CONSORTIA_JIANSE_CHANGE, this.refreshTxt11, this);
		GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
		GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdateHandler, this);
	}

	private removeEvent() {
		this.btn_buy.offClick(this, this.onBuy);
		this.petGrowthStone_buy.offClick(this, this.onPetGrowthStoneBuy);
		ResourceManager.Instance.gold.removeEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerDataUpdate, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.refreshTxt8, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_COIN_CHANGE, this.refreshTxt9, this);
		PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_JIANSE_CHANGE, this.refreshTxt11, this);
		GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
		GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdateHandler, this);
	}

	private __bagItemUpdateHandler(infos: GoodsInfo[]): void {
		for (let info of infos) {
			if (
				info.templateInfo.TemplateId == TemplateIDConstant.TEMP_ID_WISHPOOL_GOLD ||
				info.templateInfo.TemplateId == TemplateIDConstant.TEMP_ID_WISHPOOL
			) {
				this.refreshWishPool();
			} else if (info.templateInfo.TemplateId == TattooModel.DragonCrystalId || info.templateInfo.TemplateId == TattooModel.DragonCrystalId2) {
				this.refreshDragonCrystal();
			} else if (info.templateInfo.TemplateId == GoodsCheck.PET_GROWTH_STONE) {
				this.refreshPetGrowthStone();
			} else if (info.templateInfo.TemplateId == GoodsCheck.PET_COE_STONE) {
				this.refreshPetCoeStone();
			} else if (info.templateInfo.TemplateId == TemplateIDConstant.TEMP_ID_MAZE) {
				this.refreshTxt10();
			} else if (info.templateInfo.SonType == GoodsSonType.SONTYPE_SOUL_CRYSTAL) {
				this.refreshGem();
			} else if (info.templateInfo.SonType == GoodsSonType.SONTYPE_DRAGON_SOUL) {
				this.refreshDragon();
			} else if (info.templateInfo.SonType == GoodsSonType.SONTYPE_FATE_STONE) {
				this.refreshFortune();
			} else if (
				info.templateInfo.SonType == GoodsSonType.SONTYPE_MEDAL &&
				info.templateInfo.TemplateId != TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL
			) {
				this.refreshMedal();
			} else if (info.templateInfo.TemplateId == TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL) {
				this.refreshPetSkillScroll();
			} else if(info.templateInfo.TemplateId == TemplateIDConstant.GUILD_CONTRIBUTION){
				this.refreshTxt11();
			}
		}
	}

	private initAccount() {
		//黄金
		this.goldTxt.text = FormularySets.toStringSelf(ResourceManager.Instance.gold.count, HomeWnd.STEP);
		//钻石
		this.giftTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.point, HomeWnd.STEP);
		this.giftTxt.color = PlayerManager.Instance.currentPlayerModel.playerInfo.point < 0 ? ColorConstant.RED_COLOR : ColorConstant.LIGHT_TEXT_COLOR;
		//绑定钻石
		this.voucherTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken, HomeWnd.STEP);
	}

	private __refreshGold() {
		if (this.gold.count >= this.gold.limit) {
			this.goldTxt.color = ColorConstant.RED_COLOR;
		} else {
			this.goldTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
		}
		this.goldTxt.text = FormularySets.toStringSelf(ResourceManager.Instance.gold.count, HomeWnd.STEP);
		this.refreshPetSkillScroll();
	}

	/**
	 * 刷新灵魂刻印
	 */
	refreshGem() {
		let own_num = GoodsManager.Instance.getCountBySontypeAndBagType(GoodsSonType.SONTYPE_SOUL_CRYSTAL, BagType.Player);
		this.txt_gem.text = own_num.toString();
	}

	/**
	 * 刷新龙魂
	 */
	refreshDragon() {
		let own_num = GoodsManager.Instance.getCountBySontypeAndBagType(GoodsSonType.SONTYPE_DRAGON_SOUL, BagType.Player);
		this.txt_soul.text = own_num.toString();
	}

	/**
	 * 刷新命运石
	 */
	refreshFortune() {
		let own_num = GoodsManager.Instance.getCountBySontypeAndBagType(GoodsSonType.SONTYPE_FATE_STONE, BagType.Player);
		this.txt_fate.text = own_num.toString();
	}

	/**
	 * 刷新勋章
	 */
	refreshMedal() {
		let own_num = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MEDAL_TEMPID);
		this.txt_honor.text = own_num.toString();
	}

	refreshWishPool() {
		let ownNum1 = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_WISHPOOL);
		let ownNum2 = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_WISHPOOL_GOLD);
		this.txt_money12.text = ownNum2.toString();
		this.txt_money11.text = ownNum1.toString();
	}

	/**刷新宠物技能卷轴 */
	refreshPetSkillScroll() {
		let ownNum1 = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_PET_SKILL_SCROLL);
		this.txt_money13.text = ownNum1.toString();
	}
	/**
	 * 刷新龙晶
	 */
	refreshDragonCrystal() {
		let own_num = GoodsManager.Instance.getGoodsNumByTempId(TattooModel.DragonCrystalId);
		let own_num2 = GoodsManager.Instance.getGoodsNumByTempId(TattooModel.DragonCrystalId2);
		this.txt_dragonCrystal.text = own_num.toString();
		this.txt_dragonCrystal2.text = own_num2.toString();
	}

	/**
	 * 刷新宠物成长石
	 */
	refreshPetGrowthStone() {
		let own_num = GoodsManager.Instance.getGoodsNumByTempId(GoodsCheck.PET_GROWTH_STONE);
		this.txt_petGrowthStone.text = own_num.toString();
	}

	/**
	 * 刷新宠物资质丹
	 */
	refreshPetCoeStone() {
		let own_num = GoodsManager.Instance.getGoodsNumByTempId(GoodsCheck.PET_COE_STONE);
		this.txt_petCoeStone.text = own_num.toString();
	}

	/**
	 * 刷新宠物装备强化石
	 */
	refreshPetEquipStrengStone() {
		let own_num = PlayerManager.Instance.currentPlayerModel.playerInfo.petEquipStrengNum;
		this.txt_petEquipStrengStone.text = own_num.toString();
	}

	/**
	 * 刷新公会财富
	 */
	refreshTxt8() {
		let own_num = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaOffer;
		this.txt_money8.text = own_num.toString();
	}

	/**
	 * 刷新恐惧之牙
	 */
	refreshTxt9() {
		let own_num = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaCoin;
		this.txt_money9.text = own_num.toString();
	}

	/**
	 * 刷新迷宫硬币
	 */
	refreshTxt10() {
		this.txt_money10.text = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_MAZE).toString();
	}

	/**
	 * 刷新个人建设
	 */
	refreshTxt11() {
		let own_num = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaJianse;
		this.txt_consortiajianse.text = own_num.toString();
	}

	private __playerDataUpdate(data: any) {
		this.initAccount();
		this.refreshPetEquipStrengStone();
		this.refreshPetSkillScroll();
	}

	/**
	 * 购买钻石
	 */
	private onBuy() {
		//未到商城开放等级 背包界面可以快捷打开商城
		if(ArmyManager.Instance.thane.grades < OpenGrades.SHOP){
			let str = OpenGrades.SHOP + LangManager.Instance.GetTranslation('battle.logsys.BattleLogStarView.open')
			MessageTipManager.Instance.show(str);
			return;
		}
		FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 7 });
	}

	/**
	 * 购买宠物成长石
	 */
	private onPetGrowthStoneBuy() {
		var data: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(TemplateIDConstant.TEMP_ID_PET_GROWTH_STONE);
		FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
			info: data,
			count: 1,
			callback: this.buyCallback.bind(this),
		});
	}

	/**购买后回调 */
	private buyCallback() {
		this.switchIcon(this.typeCtrl.selectedIndex);
	}

	private get gold(): ResourceData {
		return ResourceManager.Instance.gold;
	}

	public showRechargeBtn(b: boolean) {
		this.showRecharge.selectedIndex = b ? 1 : 0;
	}

	public dispose() {
		this.removeEvent();
		super.dispose();
	}
}
