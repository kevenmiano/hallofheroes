/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:53:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-17 14:49:08
 * @Description: 
 */

import BaseFguiCom from "../../../../../core/ui/Base/BaseFguiCom";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { FarmManager } from "../../../../manager/FarmManager";
import { FriendManager } from "../../../../manager/FriendManager";
import { FarmModel } from "../../data/FarmModel";
import { FarmFriendItem } from "../item/FarmFriendItem";
import FriendFarmStateInfo from "../../data/FriendFarmStateInfo";
import FriendGroupId from "../../../../datas/FriendGroupId";
import { StateType } from "../../../../constant/StateType";
import LangManager from "../../../../../core/lang/LangManager";
import FUI_FarmFriendItem from "../../../../../../fui/Farm/FUI_FarmFriendItem";
import FUI_FarmEventItem from "../../../../../../fui/Farm/FUI_FarmEventItem";
import { WaterManager } from "../../../../manager/WaterManager";
import UIButton from "../../../../../core/ui/UIButton";

export class FarmFriendListView extends BaseFguiCom {
	private list: fgui.GList;
	private curItem: FarmFriendItem;
	private dataList: ThaneInfo[];
	public tabList: fgui.GList;
	private txtNoEvent: fgui.GTextField;
	private sort = false;
	private friendCache: ThaneInfo[];

	constructor(container?: fgui.GComponent) {
		super(container);
		this.initView();
	}

	private initView() {
		this.list.on(fgui.Events.CLICK_ITEM, this, this.__clickItem);
		this.list.itemProvider = Laya.Handler.create(this, this.getListItemResource, null, false);
		this.list.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);

		this.tabList.on(fairygui.Events.CLICK_ITEM, this, this.allTabHandler);
		// this.tabList.itemRenderer = Laya.Handler.create(this, this.renderTabListItem, null, false);
		// this.tabList.numItems = 2;
		this.txtNoEvent.visible = false;
		this.tabList.selectedIndex = 0;
		this.allTabHandler();
		FarmManager.Instance.reqFriendStateInfo();
	}

	//不同渲染聊天单元格
	private getListItemResource(_index: number) {
		let selectIndex = this.tabList.selectedIndex;
		switch (selectIndex) {
			case 0:
				return FUI_FarmFriendItem.URL;
			case 1:
				return FUI_FarmEventItem.URL;
		}
	}

	private allTabHandler() {
		let selectedIndex = this.tabList.selectedIndex;
		this.list.numItems = 0;
		this.txtNoEvent.visible = false;
		switch (selectedIndex) {
			case 0://好友
				this.sort = true;
				this.refreshList();
				break;
			case 1:
				this.refreshGrownLoggerView();
				break;
		}
	}

	private refreshGrownLoggerView() {
		this.list.numItems = WaterManager.Instance.logList.length;
		if (WaterManager.Instance.logList.length == 0) {
			this.txtNoEvent.visible = true;
		}
	}

	// renderTabListItem(index: number, item: FarmFriendItem) {
	// 	if (item) {
	// 		// item.title = this._tabData[index].str;
	// 	}
	// }

	public unSelectItem() {
		this.list.selectNone();
	}

	private __clickItem(item: FarmFriendItem) {
		if (this.tabList.selectedIndex == 0) {
			this.curItem = item
			this.model.curSelectedUserInfo = this.curItem.info as ThaneInfo;
		}
	}

	private __renderListItem(index: number, item) {
		let selectTabIndex = this.tabList.selectedIndex;
		let datalist = [];
		switch (selectTabIndex) {
			case 0:
				datalist = this.dataList;
				break;
			case 1:
				datalist = WaterManager.Instance.logList;
				break;

		}
		item.info = datalist[index];
	}

	public refreshList() {
		this.dataList = [];
		if (!this.friendCache || this.sort) {
			this.sort = false;
			this.friendCache = FriendManager.getInstance().getListForFarmFriend();
			this.sortByFriendly(this.friendCache);
		}

		if (this.tabList.selectedIndex == 0) {
			this.dataList = this.friendCache;
			this.list.numItems = this.dataList.length;
		}
	}


	public sortByFriendly(arr: ThaneInfo[]) {
		arr.sort((a, b) => { return b.friendGp - a.friendGp });
		arr.sort((a, b) => { return b.friendGrade - a.friendGrade });
	}
	
	public __friendUpdateHandler() {
		FarmManager.Instance.reqFriendStateInfo();
	}

	private get model(): FarmModel {
		return FarmManager.Instance.model;
	}

	public dispose() {
		super.dispose();
	}
}