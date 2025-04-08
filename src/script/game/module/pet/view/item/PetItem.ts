/*
 * @Author: jeremy.xu
 * @Date: 2021-10-19 18:00:48
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-02 15:13:32
 * @Description: 英灵头像Item
 */

import { PetData } from "../../data/PetData";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { BaseItem } from "../../../../component/item/BaseItem";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import { EmPackName } from "../../../../constant/UIDefine";
import FUI_PetItem from "../../../../../../fui/BaseCommon/FUI_PetItem";

export enum EmPetItem {
	PetList = 0, 	// 宠物列表类型
	PetSelectWnd, 	// 转换英灵-选择英灵
	CastleFight, 	// 城战建筑弹窗-上阵英灵
}

/** 0: 锁定 1: 开放无英灵 2: 有英灵*/
export enum EmPetItemState {
	ItemLock = 0,
	ItemFree,
	ItemUsing,
}

export class PetItem extends FUI_PetItem {
	public isGray: boolean;
	private _type: number = EmPetItem.PetList;
	private _state: number = EmPetItemState.ItemUsing;
	private _info: PetData;

	public get info(): PetData {
		return this._info;
	}

	public set petPKStatus(value: boolean) {
		this.isInPK.selectedIndex = value ? 1 : 0;
	}

	public set info(value: PetData) {
		this._info = value;
		this.bg.visible = !Boolean(value);
		if (value) {
			let gInfo = new GoodsInfo();
			gInfo.petData = value;
			let baseItem = this.item as BaseItem;
			baseItem.info = gInfo;

			this.imgEnterWar.visible = value.isEnterWar;
			this.txtPractice.visible = value.isPractice;

			this.imgStarBg.setScale(1, 1);
			this.showStar();
		} else {
			this.hideStar();
			(this.item as BaseItem).info = null;
			this.imgEnterWar.visible = false;
			this.txtPractice.visible = false;
			this.imgStarBg.setScale(0, 0);
		}
	}

	/**信息显示图标 */
	public infoShowIcon(value: PetData, showIcon: boolean = true) {
		this._info = value;
		this.bg.visible = !Boolean(value);
		if (value) {
			let gInfo = new GoodsInfo();
			gInfo.petData = value;

			let baseItem = this.item as BaseItem;
			baseItem.info = gInfo;

			this.imgEnterWar.visible = false;
			this.txtPractice.visible = false;

			if (showIcon) {
				this.getController("cPetType").selectedIndex = 1;
				this.icon_petType.url = FUIHelper.getItemURL(EmPackName.Base, "Icon_PetType" + value.template.PetType + "_s");
			}

			this.imgStarBg.setScale(1, 1);
			this.showStar();
		} else {
			this.hideStar();
			(this.item as BaseItem).info = null;
			this.imgEnterWar.visible = false;
			this.txtPractice.visible = false;
			this.imgStarBg.setScale(0, 0);
		}
	}

	onConstruct() {
		super.onConstruct();
		(this.item as BaseItem).showType = TipsShowType.onLongPress;
	}

	private showStar() {
		this.gStar.visible = true;
		this.imgStarBg.visible = true;
		var mod: number = this._info.temQuality % 5;
		if (this._info.temQuality == PetData.MAX_TEM_QUALITY) {
			//顶级英灵不显示;
			this.gStar.visible = false;
			this.imgStarBg.visible = false;
		} else {
			if (mod == 0) {
				mod = 5;
			}
			for (let index = 1; index <= 5; index++) {
				this["imgstar" + index].visible = index <= mod;
			}
			this.cStarNum.selectedIndex = mod;
		}
	}

	private hideStar() {
		this.gStar.visible = false;
	}

	public get state(): number {
		return this._state;
	}

	public set state(value: number) {
		this._state = value;
		this.cState.selectedIndex = value;
	}

	public get type(): number {
		return this._type;
	}

	public set type(value: number) {
		this._type = value;

		let index = 0
		switch (value) {
			case EmPetItem.PetList:
				index = 1;
			default:
				index = 0;
				break;
		}
		this.cSelectBgType.selectedIndex = index;
	}

	public gray() {
		this.filters = [UIFilter.gray];
		this.isGray = true;
	}

	public normal() {
		this.filters = [];
		this.isGray = false;
	}

	public dispose() {
		super.dispose();
	}
}
