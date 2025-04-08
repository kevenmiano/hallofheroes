// @ts-nocheck
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";

import FUIHelper from "../../../utils/FUIHelper";
import LangManager from "../../../../core/lang/LangManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";

import PetCtrl from "../control/PetCtrl";
import { EmPetItem, EmPetItemState, PetItem } from "./item/PetItem";
import { PetData } from "../data/PetData";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

import FUI_PetDetail from "../../../../../fui/Pet/FUI_PetDetail";
import FUI_PetSelectIframe from "../../../../../fui/Pet/FUI_PetSelectIframe";

import { SharedManager } from "../../../manager/SharedManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PetEvent } from "../../../constant/event/NotificationEvent";
import UIManager from "../../../../core/ui/UIManager";
import ColorConstant from "../../../constant/ColorConstant";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import Utils from "../../../../core/utils/Utils";

/**
 * 英灵转换
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月24日18:10:03
 */
export default class UIExchange extends BaseFguiCom {
	/**源头英灵详情 */
	private comp_sourceDetail: FUI_PetDetail;
	/**目标英灵详情 */
	private comp_targetDetail: FUI_PetDetail;
	/**英灵选择二级窗口 */
	public frame_petSelect: FUI_PetSelectIframe;
	/**转换按钮 */
	public btn_exchange: fgui.GButton;
	/**消耗物品 */
	public comp_consume: BaseItem;
	/**帮助按钮 */
	// public btn_help: fgui.GButton;

	/**最大星级 */
	private _maxStarNum: number = 5;
	/**转换消耗物品 */
	private _templateId: number = 208059;
	/**转换消耗物品数量 */
	private _templateCount: number = 1;
	/**转换消耗物品商店标识 */
	private _templateShoppingId: number = 10037;

	/**源头英灵数据 */
	private _data: PetData;

	/**源头英灵数据 */
	public get data(): PetData {
		return this._data;
	}

	/**源头英灵数据 */
	public set data(value: PetData) {
		if (value) {
			this.comp_sourceDetail.btn_stage.visible = false;
			this.comp_sourceDetail.btn_petType.visible = true;

			if (this._data && this._data.petId !== value.petId) {
				if (this._targetData) this._targetData.removeEventListener(PetEvent.PETINFO_CHANGE, this.onTargetPetChange, this);
				this._targetData = null;
			}

			if (!this._targetData) {
				this.resetTarget();
			}

			this._data = value;
			this.refreshTemplate();
			this.refreshSource();
			// this.refreshTarget();
		} else {
			this.resetView();
		}
	}

	/**目标英灵数据 */
	private _targetData: PetData;

	public get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	/**构造函数 */
	constructor(comp: fgui.GComponent) {
		super(comp);
		this.initView();
		this.addEvent();
	}

	/**初始化视图 */
	private initView() {
		this.refreshTemplate();
		this.comp_sourceDetail.btn_stage.visible = false;
		this.comp_sourceDetail.btn_petType.visible = false;
	}

	/**数量不够展示红色 */
	getLackColor(isFixed: boolean): string {
		if (isFixed) {
			return ColorConstant.WHITE_COLOR;
		} else {
			return ColorConstant.RED_COLOR;
		}
	}

	/**增加事件 */
	private addEvent() {
		this["btn_help"].onClick(this, this.onHelp);
		this.btn_exchange.onClick(this, this.onExchange);
		this.comp_targetDetail.getChild("comp_petItem").onClick(this, this.onSelectTarget);
		this.comp_targetDetail.getChild("btn_selectTarget").onClick(this, this.onSelectTarget);

		ServerDataManager.listen(S2CProtocol.U_C_PET_OP_RESULT, this, this.onExchangeResult);
		NotificationManager.Instance.addEventListener("PET_SELEXCT", this.onSelectPet, this);
		NotificationManager.Instance.addEventListener("PET_ABANDON", this.onAbandonPet, this);

		this.comp_sourceDetail.comb_starList.itemRenderer = Laya.Handler.create(this, this.onRenderSourceStar, null, false);
		this.comp_targetDetail.comb_starList.itemRenderer = Laya.Handler.create(this, this.onRenderTargetStar, null, false);
	}

	/**移除事件 */
	private removeEvent() {
		this["btn_help"].offClick(this, this.onHelp);
		this.btn_exchange.offClick(this, this.onExchange);

		ServerDataManager.cancel(S2CProtocol.U_C_PET_OP_RESULT, this, this.onExchangeResult);
		NotificationManager.Instance.removeEventListener("PET_SELEXCT", this.onSelectPet, this);
		NotificationManager.Instance.removeEventListener("PET_ABANDON", this.onAbandonPet, this);

		// this.comp_sourceDetail.comb_starList.itemRenderer.recover();
		// this.comp_targetDetail.comb_starList.itemRenderer.recover();
		Utils.clearGListHandle(this.comp_sourceDetail.comb_starList);
		Utils.clearGListHandle( this.comp_targetDetail.comb_starList);

	}

	/**刷新消耗物品 */
	refreshTemplate() {
		let gInfo: GoodsInfo;

		gInfo = new GoodsInfo();
		gInfo.count = this._templateCount;
		gInfo.templateId = this._templateId;

		let goodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(this._templateId);

		this.comp_consume.info = gInfo;
		this.comp_consume.text = "[color=" + this.getLackColor(goodsCount >= this._templateCount) + "]" + goodsCount + "[/color]/" + this._templateCount;
		this.comp_consume.isConsume.selectedIndex = 1;
	}

	/**刷新源头英灵视图 */
	refreshSource() {
		this.comp_sourceDetail.getController("exist").selectedIndex = 1;
		this.comp_sourceDetail.comb_starList.numItems = this._maxStarNum;

		let colon = LangManager.Instance.GetTranslation("public.colon2");
		this.comp_sourceDetail.label_development.text = LangManager.Instance.GetTranslation("pet.growthRate") + colon;
		this.comp_sourceDetail.label_powerFlair.text = LangManager.Instance.GetTranslation("pet.strengthCoe") + colon;
		this.comp_sourceDetail.label_armorFlair.text = LangManager.Instance.GetTranslation("pet.armorCoe") + colon;
		this.comp_sourceDetail.label_intelligenceFlair.text = LangManager.Instance.GetTranslation("pet.intellectCoe") + colon;
		this.comp_sourceDetail.label_brainFlair.text = LangManager.Instance.GetTranslation("pet.staminaCoe") + colon;

		this.comp_sourceDetail.txt_petName.text = this._data.name;
		this.comp_sourceDetail.txt_petName.color = PetData.getQualityColor(this._data.quality - 1);
		(this.comp_sourceDetail.comp_petItem as PetItem).infoShowIcon(this._data, false);
		(this.comp_sourceDetail.comp_petItem as PetItem).state = EmPetItemState.ItemUsing;

		this.comp_sourceDetail.txt_development.text = this._data.growthRate.toString();
		this.comp_sourceDetail.txt_powerFlair.text = this._data.coeStrength + " / " + this._data.coeStrengthLimit;
		this.comp_sourceDetail.txt_armorFlair.text = this._data.coeArmor + " / " + this._data.coeArmorLimit;
		this.comp_sourceDetail.txt_intelligenceFlair.text = this._data.coeIntellect + " / " + this._data.coeIntellectLimit;
		this.comp_sourceDetail.txt_brainFlair.text = this._data.coeStamina + " / " + this._data.coeStaminaLimit;

		this.comp_sourceDetail.btn_petType.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType" + this._data.template.PetType);
		this.comp_sourceDetail.btn_petType.title = this._data.petTypeLanguage;
		this.comp_sourceDetail.btn_stage.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetStage" + this._data.template.Property2);
		this.comp_sourceDetail.btn_stage.title = this._data.petStageLanguage;
	}

	/**刷新目标英灵视图 */
	refreshTarget() {
		this.comp_targetDetail.getController("exist").selectedIndex = 0;
		let colon = LangManager.Instance.GetTranslation("public.colon2");

		this.comp_targetDetail.label_development.text = LangManager.Instance.GetTranslation("pet.growthRate") + colon;
		this.comp_targetDetail.label_powerFlair.text = LangManager.Instance.GetTranslation("pet.strengthCoe") + colon;
		this.comp_targetDetail.label_armorFlair.text = LangManager.Instance.GetTranslation("pet.armorCoe") + colon;
		this.comp_targetDetail.label_intelligenceFlair.text = LangManager.Instance.GetTranslation("pet.intellectCoe") + colon;
		this.comp_targetDetail.label_brainFlair.text = LangManager.Instance.GetTranslation("pet.staminaCoe") + colon;

		if (this._targetData) {
			this.comp_targetDetail.getController("exist").selectedIndex = 1;
			this.comp_targetDetail.comb_starList.numItems = this._maxStarNum;

			this.comp_targetDetail.txt_petName.text = this._targetData.name;
			this.comp_targetDetail.txt_petName.color = PetData.getQualityColor(this._targetData.quality - 1);
			(this.comp_targetDetail.comp_petItem as PetItem).infoShowIcon(this._targetData, false);
			(this.comp_targetDetail.comp_petItem as PetItem).state = EmPetItemState.ItemUsing;

			this.comp_targetDetail.txt_development.text = this._targetData.growthRate.toString();
			this.comp_targetDetail.txt_powerFlair.text = this._targetData.coeStrength + " / " + this._targetData.coeStrengthLimit;
			this.comp_targetDetail.txt_armorFlair.text = this._targetData.coeArmor + " / " + this._targetData.coeArmorLimit;
			this.comp_targetDetail.txt_intelligenceFlair.text = this._targetData.coeIntellect + " / " + this._targetData.coeIntellectLimit;
			this.comp_targetDetail.txt_brainFlair.text = this._targetData.coeStamina + " / " + this._targetData.coeStaminaLimit;

			this.comp_targetDetail.btn_petType.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType" + this._targetData.template.PetType);
			this.comp_targetDetail.btn_petType.title = this._targetData.petTypeLanguage;
			this.comp_targetDetail.btn_stage.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetStage" + this._targetData.template.Property2);
			this.comp_targetDetail.btn_stage.title = this._targetData.petStageLanguage;
		}
	}

	/**渲染源头英灵品质星级 */
	private onRenderSourceStar(index: number, item: fairygui.GComponent) {
		let next: t_s_upgradetemplateData = this._data.qualityUpgradeTemplateInfo;
		if (next) {
			this.readerStar(index, item, this._data, this._data.temQuality % 5, 1);
			if (this._data.temQuality <= 20) {
				this.readerStar(index, item, this._data, (this._data.temQuality + 1) % 5, 2);
			}
		} else {
			this.readerStar(index, item, this._data, 0, 1);
		}
	}

	/**渲染目标英灵品质星级 */
	private onRenderTargetStar(index: number, item: fairygui.GComponent) {
		let next: t_s_upgradetemplateData = this._targetData.qualityUpgradeTemplateInfo;
		if (next) {
			this.readerStar(index, item, this._targetData, this._targetData.temQuality % 5, 1);
			if (this._targetData.temQuality <= 20) {
				this.readerStar(index, item, this._targetData, (this._targetData.temQuality + 1) % 5, 2);
			}
		} else {
			this.readerStar(index, item, this._targetData, 0, 1);
		}
	}

	/**渲染英灵品质星级 */
	private readerStar(index: number, item: fairygui.GComponent, petData: PetData, mod: number, type?: number) {
		let starIcon = PetData.getQualityStarIcon(petData.quality);
		if (mod != 0) {
			if (type == 1) {
				item.getController("cShowStar").selectedIndex = index < mod ? 0 : 1;
			}
		} else {
			if (type == 1) {
				item.getController("cShowStar").selectedIndex = 0;
			}
		}

		if (item && starIcon) {
			item.getChild("imgIcon").icon = FUIHelper.getItemURL(EmPackName.Base, starIcon);
		}
	}

	/**选择目标英灵点击事件 */
	onSelectTarget() {
		if (!this._data) return;
		FrameCtrlManager.Instance.open(EmWindow.PetSelect, { sourcePet: this._data, targetPet: this._targetData });
	}

	/**选择英灵 */
	onSelectPet(item: PetData) {
		FrameCtrlManager.Instance.exit(EmWindow.PetSelect);
		if (item) {
			this._targetData = item;
			this._targetData.addEventListener(PetEvent.PETINFO_CHANGE, this.onTargetPetChange, this);
		}
		this.refreshTarget();

		this.btn_exchange.enabled = true;
	}

	/**放弃英灵 */
	onAbandonPet(item: PetData) {
		FrameCtrlManager.Instance.exit(EmWindow.PetSelect);
		if (item && item.petId === this._targetData.petId) {
			this._targetData.removeEventListener(PetEvent.PETINFO_CHANGE, this.onTargetPetChange, this);
			this._targetData = null;
		}
		this.refreshTarget();

		this.btn_exchange.enabled = true;
	}

	/**监听目标英灵变更 */
	onTargetPetChange(item: PetData) {
		this._targetData = item;
		this.refreshTarget();
	}

	/**英灵转换 */
	onExchange() {
		if (this._data && this._targetData) {
			this.btn_exchange.enabled = false;
			if (GoodsManager.Instance.getGoodsNumByTempId(this._templateId) <= 0) {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pet.exchange.template.lack"));
				this.btn_exchange.enabled = true;

				var data: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(this._templateId);
				FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
					info: data,
					count: 1,
					callback: this.buyCallback.bind(this),
				});
				return;
			}

			SimpleAlertHelper.Instance.Show(
				SimpleAlertHelper.SIMPLE_ALERT,
				null,
				LangManager.Instance.GetTranslation("public.prompt"),
				LangManager.Instance.GetTranslation("pet.exchange.confirm"),
				LangManager.Instance.GetTranslation("public.confirm"),
				LangManager.Instance.GetTranslation("public.cancel"),
				this.alertCallback.bind(this)
			);
		} else {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pet.exchange.pet.lack"));
			return;
		}
	}

	/**提醒弹窗回调 */
	private alertCallback(b: boolean, flag: boolean) {
		if (b) {
			this.exchange();
		} else {
			this.btn_exchange.enabled = true;
		}
	}

	/**购买后回调 */
	private buyCallback() {
		this.refreshTemplate();
	}

	/**转换 */
	private exchange(): void {
		PetCtrl.reqPetExchange(this._data.petId, this._targetData.petId);
	}

	/**转换结果处理 */
	private onExchangeResult(): void {
		this.btn_exchange.enabled = true;
	}

	/**帮助按钮处理 */
	private onHelp(): void {
		let title: string = LangManager.Instance.GetTranslation("public.help");
		let content: string = LangManager.Instance.GetTranslation("pet.exchange.help");
		UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
	}

	/**重置视图 */
	public resetView() {
		// this.removeEvent();
		// this.comp_sourceDetail.comb_starList._children = [];
		// this.comp_sourceDetail.comb_starList.numItems = 0;
		// this.comp_targetDetail.comb_starList._children = [];
		// this.comp_targetDetail.comb_starList.numItems = 0;
	}

	public resetTarget() {
		this.comp_targetDetail.getController("exist").selectedIndex = 0;
	}

	/**释放视图 */
	public dispose() {
		this.removeEvent();
		super.dispose();
	}
}
