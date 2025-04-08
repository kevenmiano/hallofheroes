/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-11-02 14:58:08
 * @LastEditors: jeremy.xu
 * @Description: 英灵列表
 */

import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { PetData } from "../data/PetData";
import { EmPetItem, EmPetItemState, PetItem } from "./item/PetItem";
import LangManager from "../../../../core/lang/LangManager";
import PetCtrl from "../control/PetCtrl";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import PetModel from "../data/PetModel";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PetEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";

export default class UIPetList {
	public grayPets: any[];
	public curSelectedIndex: number = 0;

	private _list: fgui.GList;
	constructor(list: fgui.GList) {
		this._list = list;
		this._list.displayObject["dyna"] = true;
		this.addEvent();
	}

	private addEvent() {
		this._list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
		this._list.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
		this.playerInfo.addEventListener(PetEvent.PET_UPDATE, this.onUpdatePetHandler, this);
		NotificationManager.Instance.addEventListener(PetEvent.PET_SELECT_FORMATION_CHANGE, this.updateView, this);

	}

	private delEvent() {
		this._list.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
		this._list.itemRenderer = null;
		this.playerInfo.removeEventListener(PetEvent.PET_UPDATE, this.onUpdatePetHandler, this);
		NotificationManager.Instance.removeEventListener(PetEvent.PET_SELECT_FORMATION_CHANGE, this.updateView, this);
	}

	private updateView() {
		for (let index = 0; index < this._list.numChildren; index++) {
			let element: PetItem = this._list.getChildAt(index) as PetItem;
			if (element && element.info && this.checkInFormation(element.info)) {
				element.petPKStatus = true;
			} else {
				element.petPKStatus = false;
			}
		}
	}

	//检测某个英灵是否在阵型中
	private checkInFormation(petData: PetData): boolean {
		let flag: boolean = false;
		let petId;
		for(let i:number = 0;i<PetModel.saveFormationArray.length;i++){
			petId = PetModel.saveFormationArray[i];
			if(petId && petId == petData.petId){
				flag = true;
				break;
			}
		}
		return flag;
	}

	public refresh() {
		this._list.numItems = 0;
		this._list.numItems = PetData.PET_CARRY_LIMIT;
		this.updateView();
	}

	private onClickItem(item: PetItem) {
		PetModel.isClickPetList = true;
		if (item.state == EmPetItemState.ItemUsing) {
			if (this.ctrl.curTabIndex == PetModel.TabIndex.Pet_Refining) {
				if (!PetModel.checkCanComposeAndTip(item.info)) {
					return;
				}
			}
			this.setItemSelect(item);
		}
	}

	public setItemSelect(item: PetItem) {
		this.setItemSelectNone();

		this.ctrl.selectedPet = item.info;
		item.cSelected.selectedIndex = 1;
	}

	public scrollToView(item: PetItem) {
		if (this._list && !this._list.isDisposed) {
			let target = this._list.getChildIndex(item);
			if (target) this._list.scrollToView(target);
		}
	}

	public setItemSelectNone() {
		for (let index = 0; index < this._list.numChildren; index++) {
			const element = this._list.getChildAt(index) as PetItem;
			element.cSelected.selectedIndex = 0;
		}
		this.ctrl.selectedPet = null;
	}

	public onUpdatePetHandler(value: PetData) {
		// Logger.xjy("[UIPetList]__updatePetHandler", value)
		for (let index = 0; index < this._list.numChildren; index++) {
			const item = this._list.getChildAt(index) as PetItem;
			if (item.info && item.info.petId == value.petId) {
				item.info = value;
			}
		}
	}

	private onRenderListItem(index: number, item: PetItem) {
		if (!item || item.isDisposed) return;
		let tmpDataList = this.petInfoList;
		if (!tmpDataList) return;

		if (index == PetData.PET_CARRY_LIMIT - 1) {
			PetModel.PetListInit = true;
		}

		let itemData = tmpDataList[index];
		item.enabled = true;
		if (!itemData) {
			item.info = null;
			let playerPetMaxCount: number = PlayerManager.Instance.currentPlayerModel.playerInfo.petMaxCount;
			if (index < playerPetMaxCount) {
				item.state = EmPetItemState.ItemFree;
			}
		} else {
			item.type = EmPetItem.PetList;
			item.state = EmPetItemState.ItemUsing;
			item.info = itemData;
			item.cSelected.selectedIndex = 0;
		}
	}

	/**
	 * 激活格子
	 * @param pos 最后一个格子的位置 从1开始
	 */
	private activePetBag(pos: number) {
		let str: string = "100,50,500";
		let temp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("add_pet_count");
		if (temp) {
			str = temp.ConfigValue;
		}
		let arr: any[] = str.split(",");
		let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
		let playerPetMaxCount: number = playerInfo.petMaxCount;
		let activedCount: number = playerPetMaxCount - PetData.CUR_OPEN_PET_NUM; //已经激活的数量
		let totalCost: number = 0;
		let count: number = pos - playerPetMaxCount; //本次激活的数量
		for (let i: number = 0; i < count; i++) {
			let cost: number = Math.min(Number(arr[0]) + activedCount * Number(arr[1]), Number(arr[2]));
			totalCost += cost;
			activedCount++;
		}

		let content: string = LangManager.Instance.GetTranslation("PetListView.openPos", totalCost, count);
		SimpleAlertHelper.Instance.Show(null, [count], null, content, null, null, (result: boolean, flag: boolean, data: any = 0) => {
			if (result) {
				let hasMoney: number;
				if (flag) {
					hasMoney = playerInfo.point + playerInfo.giftToken;
				} else {
					hasMoney = playerInfo.point;
				}
				if (hasMoney < totalCost) {
					RechargeAlertMannager.Instance.show();
					return;
				}

				let payType = flag ? 0 : 1;
				PetCtrl.addPetCarryNum(data[0], payType);
			}
		});
	}

	public get petInfoList(): any[] {
		return PlayerManager.Instance.currentPlayerModel.playerInfo.petList;
	}

	public get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

	public get ctrl(): PetCtrl {
		let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
		return ctrl;
	}

	public dispose() {
		this.delEvent();
	}
}
