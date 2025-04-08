/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:53:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-06 14:54:01
 * @Description: 农场土地Layer
 */


import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { FarmEvent } from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { FarmManager } from "../../../../manager/FarmManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import FarmInfo from "../../data/FarmInfo";
import FarmLandInfo from "../../data/FarmLandInfo";
import { FarmModel } from "../../data/FarmModel";
import { FarmLandItem } from "../item/FarmLandItem";
import { NotificationManager } from "../../../../manager/NotificationManager";
import FUIHelper from '../../../../utils/FUIHelper';
import { EmWindow } from '../../../../constant/UIDefine';
import Utils from "../../../../../core/utils/Utils";
import { FarmPetLand } from "./FarmPetLand";
import PetLandInfo from "../../data/PetLandInfo";
import { FrameCtrlManager } from '../../../../mvc/FrameCtrlManager';
import GameManager from "../../../../manager/GameManager";
import { FarmMapView } from "../FarmMapView";


export class FarmLandLayer extends Laya.Sprite {
	/**
	 * 宠物修炼按钮
	 */
	private _petLand1: FarmPetLand;
	private _petLand2: FarmPetLand;

	/**
	 * 用于保存12块土地
	 */
	private _itemDic: SimpleDictionary;
	private _switchTimeOut: any = 0;
	private _data: FarmInfo;
	private comLand: fgui.GComponent;

	constructor() {
		super();
		this.initView();
		this.addEvent();
	}

	checkFeedPet() {
		// return this._petLand1.checkFeedPet() || this._petLand2.checkFeedPet();
		return false
	}

	doOneKey() {
		// this._petLand1.doOneKey();
		// this._petLand2.doOneKey();
	}

	private initView() {
		// this._petLand1 = FUIHelper.createFUIInstance(EmWindow.Farm, "FarmPetLand")
		// this.addChild(this._petLand1.displayObject)
		// this._petLand2 = FUIHelper.createFUIInstance(EmWindow.Farm, "FarmPetLand")
		// this.addChild(this._petLand2.displayObject)
		// this._petLand1.setXY(582, 266)
		// this._petLand2.setXY(268, 470)
		// this._petLand1.pos = 0
		// this._petLand2.pos = 1

		this.comLand = FUIHelper.createFUIInstance(EmWindow.Farm, "ComLand").asCom;
		this.comLand.setXY(478, 368);
		this.addChild(this.comLand.displayObject)

		this._itemDic = new SimpleDictionary();
		var i: number = 0;
		for (i = 0; i < FarmModel.LAND_NUM; i++) {
			var item: FarmLandItem = this.comLand.getChild("item_" + Utils.numFormat(i, 2)) as FarmLandItem;
			item.pos = i;
			this._itemDic.add(i, item);
		}
	}

	public getLandItemByPos(pos: number): FarmLandItem {
		return this._itemDic.get(pos);
	}

	private addEvent() {
		this.model.addEventListener(FarmEvent.SELECTED_CHANGE, this.__selectedFarmChangeHandler, this);
		// GameManager.Instance.addEventListener(PlayerEvent.SYSTIME_UPGRADE_SECOND, this.__timeUpdateHandler, this);
		NotificationManager.Instance.addEventListener(FarmEvent.LIGHT_AVAILABLE_LAND, this.__lightLand, this)
	}

	private removeEvent() {
		this.model.removeEventListener(FarmEvent.SELECTED_CHANGE, this.__selectedFarmChangeHandler, this);
		// GameManager.Instance.removeEventListener(PlayerEvent.SYSTIME_UPGRADE_SECOND, this.__timeUpdateHandler, this);
		NotificationManager.Instance.removeEventListener(FarmEvent.LIGHT_AVAILABLE_LAND, this.__lightLand, this)
	}

	// private __timeUpdateHandler() {
	// 	this._petLand1.update();
	// 	this._petLand2.update();
	// }

	private __onClickHandler(evt: Laya.Event) {
		if (evt.target.name == "FarmLand_ClickItem" || (evt.target.name == "FarmLand_BtnBag" && FarmManager.Instance.showingBag)) {
		} else {
			// FarmManager.Instance.closeBagFrame()
			this.parent.off(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
		}
	}

	private __lightLand(show: boolean) {
		if (show) {
			this.parent.on(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
		} else {
			this.parent.off(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
		}

		for (let i = 0; i < FarmModel.LAND_NUM; i++) {
			var item: FarmLandItem = this.getLandItem(i);
			if (item && item.imgSelected)
				item.imgSelected.visible = false;

			if (!show) continue;

			if (!item.isOpen || !item.info)//未开启或者无土地信息
			{
				continue;
			}

			if (item.info.hasCrop)//有作物
			{
				continue;
			}
			// if(farmManager.checkExistSameSpecialCrop(_cell.data.templateInfo, model.curSelectedFarmInfo))//最多一种特殊作物
			// {
			// 	 return;
			// }
			item.imgSelected.visible = true;
		}
	}

	/**
	 * 选择农场改变时刷新 
	 */
	private __selectedFarmChangeHandler(data: FarmInfo) {
		clearTimeout(this._switchTimeOut);
		this.itemSomeVisible = false;
		this._switchTimeOut = setTimeout(this.showCall.bind(this), 200);  //切换效果, 切换农场时延迟显示作物
		this.data = data;
	}

	private showCall() {
		clearTimeout(this._switchTimeOut);
		this.itemSomeVisible = true;
	}

	private set itemSomeVisible(value: boolean) {
		for (const key in this._itemDic) {
			if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
				const item = this._itemDic[key];
				item.someVisible = value;
			}
		}
	}

	private addFarmListener(info: FarmInfo) {
		if (info) {
			info.addEventListener(FarmEvent.LAND_OPEN, this.__landOpenHandler, this);
			// info.addEventListener(FarmEvent.PET_LAND_OPEN, this.__petLandOpenHandler, this);
			// info.addEventListener(FarmEvent.PET_LAND_UPDATE, this.__petLandOpenHandler, this);
		}
	}

	private removeFarmListener(info: FarmInfo) {
		if (info) {
			info.removeEventListener(FarmEvent.LAND_OPEN, this.__landOpenHandler, this);
			// info.removeEventListener(FarmEvent.PET_LAND_OPEN, this.__petLandOpenHandler, this);
			// info.removeEventListener(FarmEvent.PET_LAND_UPDATE, this.__petLandOpenHandler, this);
		}
	}
	/**
	 * 开启新土地的处理 
	 */
	private __landOpenHandler(data: FarmLandInfo) {
		this.addLandInfoToItem(data);
	}

	// private __petLandOpenHandler(data: PetLandInfo) {
	// 	if (data) {
	// 		if (data.pos == 0) {
	// 			this._petLand1.info = data
	// 		} else if (data.pos == 1) {
	// 			this._petLand2.info = data
	// 		}
	// 	}
	// }

	/**
	 * 刷新土地视图 
	 * 
	 */
	private refreshView() {
		if (this._data) {
			for (let i = 0; i < FarmModel.LAND_NUM; i++) {
				this._itemDic[i].clean()
			}

			this._data.getLandList().forEach((landInfo: FarmLandInfo) => {
				this.addLandInfoToItem(landInfo);
			});

			// this._petLand1.info = this._data.getPetLandInfo(0);
			// this._petLand2.info = this._data.getPetLandInfo(1);

			FarmMapView.IS_FARMLAND_INIT = true;
		}
	}
	/**
	 * 根据土地信息, 刷新土地的视图（每块） 
	 * @param info: 土地信息
	 * 
	 */
	private addLandInfoToItem(info: FarmLandInfo) {
		if (!info) return;
		var item: FarmLandItem = this._itemDic[info.pos];
		if (item) {
			item.info = info;
			item.isOpen = true;
			item.cNextOpen.selectedIndex = 0;
		}
		var next: number = info.pos + 1;
		var nextItem: FarmLandItem = this._itemDic[next];
		if (next >= FarmModel.DEFAULT_OPEN_LAND && nextItem && !nextItem.isOpen) {
			nextItem.cNextOpen.selectedIndex = 1;
		}
	}
	/**
	 * 清除各块土地的信息 
	 */
	private clean() {
		for (const key in this._itemDic) {
			if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
				const item: FarmLandItem = this._itemDic[key];
				item.info = null;
				item.isOpen = false;
			}
		}
	}
	/**
	 * 刷新数据 
	 * @param value: 农场信息
	 */
	public set data(value: FarmInfo) {
		if (this._data == value) return;
		this.clean();
		this.removeFarmListener(this._data);
		this._data = value;
		this.addFarmListener(this._data);
		this.refreshView();
	}

	public getLandItem(pos: number): FarmLandItem {
		return this._itemDic[pos];
	}

	public get data(): FarmInfo {
		return this._data;
	}

	private get model(): FarmModel {
		return FarmManager.Instance.model;
	}

	public dispose() {
		clearTimeout(this._switchTimeOut);
		this.removeFarmListener(this._data);
		this.removeEvent();
		for (let i = 0; i < FarmModel.LAND_NUM; i++) {
			this._itemDic[i].dispose();
		}
		this._itemDic.clear();
	}
}