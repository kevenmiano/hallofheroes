/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:48:03
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-17 14:47:30
 * @Description: 农场的地面相关视图元素 包括地图及动画、神树、土地、建筑物
 * 
 */

import FUI_FarmLandCom from "../../../../../fui/Farm/FUI_FarmLandCom";
import Resolution from "../../../../core/comps/Resolution";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import Utils from "../../../../core/utils/Utils";
import { EmWindow } from "../../../constant/UIDefine";
import { FarmEvent } from "../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FarmManager } from "../../../manager/FarmManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TweenDrag } from "../../../map/castle/utils/TweenDrag";
import FUIHelper from "../../../utils/FUIHelper";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import FarmInfo from "../data/FarmInfo";
import FarmLandInfo from "../data/FarmLandInfo";
import { FarmModel } from "../data/FarmModel";
import { FarmLandItem } from "./item/FarmLandItem";
/**
 * 9块地
 */
export class FarmLandCom extends FUI_FarmLandCom {
    public static IS_FARMLAND_INIT: boolean = false
  	/**
	 * 用于保存12块土地
	 */
	private _itemDic: SimpleDictionary;
	private _switchTimeOut: any = 0;
	private _data: FarmInfo;

    constructor() {
        super();
 
    }

    public initView() {
		this._itemDic = new SimpleDictionary();
		var i: number = 0;
		for (i = 0; i < FarmModel.LAND_NUM; i++) {
			var item: FarmLandItem = this.getChild("item_" + Utils.numFormat(i, 2)) as FarmLandItem;
			item.pos = i;
			this._itemDic.add(i, item);
		}

        this.addEvent();
	}

    private addEvent() {
		// this.model.addEventListener(FarmEvent.SELECTED_CHANGE, this.__selectedFarmChangeHandler, this);
		NotificationManager.Instance.addEventListener(FarmEvent.LIGHT_AVAILABLE_LAND, this.__lightLand, this)
	}

    private __onClickHandler(evt: Laya.Event) {
		if (evt.target.name == "FarmLand_ClickItem" || (evt.target.name == "FarmLand_BtnBag" && FarmManager.Instance.showingBag)) {
		} else {
			// FarmManager.Instance.closeBagFrame()
			this.parent.off(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
		}
	}

    /**
	 * 刷新数据 
	 * @param value: 农场信息
	 */
	public setData(value: FarmInfo) {
		if (this._data == value) return;
		this.clean();
		this.itemSomeVisible = false;
		this.removeFarmListener(this._data);
		this._data = value;
		this.addFarmListener(this._data);
		this.refreshView();
		clearTimeout(this._switchTimeOut);
		this._switchTimeOut = setTimeout(this.showCall.bind(this), 200);  //切换效果, 切换农场时延迟显示作物
	}

	public getLandItem(pos: number): FarmLandItem {
		return this._itemDic[pos];
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
			// item.imgSelected.visible = true;
		}
	}

	/**
	 * 选择农场改变时刷新 
	 */
	//  __selectedFarmChangeHandler(data: FarmInfo) {
	// 	clearTimeout(this._switchTimeOut);
	// 	this.itemSomeVisible = false;
	// 	this._switchTimeOut = setTimeout(this.showCall.bind(this), 200);  //切换效果, 切换农场时延迟显示作物
	// 	this._data = data;
	// 	this.refreshView();
	// }

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
		}
	}

	private removeFarmListener(info: FarmInfo) {
		if (info) {
			info.removeEventListener(FarmEvent.LAND_OPEN, this.__landOpenHandler, this);
		}
	}
	/**
	 * 开启新土地的处理 
	 */
	private __landOpenHandler(data: FarmLandInfo) {
		this.addLandInfoToItem(data);
	}

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
			FarmLandCom.IS_FARMLAND_INIT = true;
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

	private removeEvent() {
		// this.model.removeEventListener(FarmEvent.SELECTED_CHANGE, this.__selectedFarmChangeHandler, this);
		NotificationManager.Instance.removeEventListener(FarmEvent.LIGHT_AVAILABLE_LAND, this.__lightLand, this)
	}

	public getLandItemByPos(pos: number): FarmLandItem {
		return this._itemDic.get(pos);
	}


	private get model(): FarmModel {
		return FarmManager.Instance.model;
	}

    public dispose() {
       this.removeEvent();
       super.dispose();
    }
}