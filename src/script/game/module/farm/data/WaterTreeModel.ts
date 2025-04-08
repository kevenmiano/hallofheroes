// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2020-12-30 09:43:50
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-08-27 15:21:04
 * @Description: 
 */

import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { WaterEvent } from "../../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { WaterManager } from "../../../manager/WaterManager";
import { TreeInfo } from "./TreeInfo";


export class WaterTreeModel extends GameEventDispatcher {
    /**
     * 自己每天可浇水次数
     */
	public static DEFAULT_SELF_WATER:number = 3;
	 
	private _currentSelectedUser: ThaneInfo;

	private _currentSelectedTreeInfo: TreeInfo;
	constructor() {
		super();
	}

	public set defaultSelectedUser(value: ThaneInfo) {
		if (this._currentSelectedUser == value)
			this.commitChanges();
		else
			this.currentSelectedUser = value;
	}

	public set currentSelectedUser(value: ThaneInfo) {
		if (this._currentSelectedUser == value) return;
		this._currentSelectedUser = value;
		this._currentSelectedTreeInfo = WaterManager.Instance.treeList[this._currentSelectedUser.userId] as TreeInfo;

		if (!this._currentSelectedTreeInfo) {
			this._currentSelectedTreeInfo = new TreeInfo();
			this._currentSelectedTreeInfo.userId = this._currentSelectedUser.userId;
			this._currentSelectedTreeInfo.notHasTree = true;
			WaterManager.Instance.treeList[this._currentSelectedUser.userId] = this._currentSelectedTreeInfo;
		}
		this._currentSelectedTreeInfo.requestTime = new Date().getTime();
		if (this._currentSelectedTreeInfo.needRequiest) {
			//				WaterManager.Instance.sendGetTreeInfoById(_currentSelectedUser.userId);
		}
		this.commitChanges();
	}

	private commitChanges() {
		this.dispatchEvent(WaterEvent.SELECTED_TREE_CHANGE, this._currentSelectedTreeInfo);
	}

	public get currentSelectedUser(): ThaneInfo {
		return this._currentSelectedUser;
	}

	public get currentSelectedTreeInfo(): TreeInfo {
		return this._currentSelectedTreeInfo;
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}
}