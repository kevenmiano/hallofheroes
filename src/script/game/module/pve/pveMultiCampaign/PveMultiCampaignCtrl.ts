// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-02-19 17:15:53
 * @LastEditors: jeremy.xu
 * @Description:
 */

import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { RoomSceneType, RoomType } from "../../../constant/RoomDefine";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { RoomListSocketOutManager } from "../../../manager/RoomListSocketOutManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";

import Logger from "../../../../core/logger/Logger";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";

import RoomMsg = com.road.yishi.proto.room.RoomMsg;

export default class PveMultiCampaignCtrl extends FrameCtrlBase {
	show() {
		super.show();
	}

	hide() {
		super.hide();
	}

	protected addEventListener() {
		super.addEventListener();
		ServerDataManager.listen(S2CProtocol.U_C_ROOM_FIND_RESULT, this, this.__onSearchRoom);
	}

	protected delEventListener() {
		super.delEventListener();
		ServerDataManager.cancel(S2CProtocol.U_C_ROOM_FIND_RESULT, this, this.__onSearchRoom);
	}

	public sendCreateRoom() {
		RoomListSocketOutManager.sendCreateRoom(1, RoomType.NORMAL, "");
	}

	//return: S2CProtocol.U_C_CAMPAIGN_ROOM_CREATE
	public sendEnterRoom(roomType: RoomType, roomId: number, pwd: string, isInvite: boolean) {
		RoomListSocketOutManager.addRoomById(roomType, roomId, pwd, isInvite);
	}

	private __onSearchRoom(pkg: PackageIn) {
		let msg = pkg.readBody(RoomMsg) as RoomMsg;
		Logger.xjy("[PveRoomListCtrl]__onSearchRoom", msg);
		if (msg.isSetPassword) {
			FrameCtrlManager.Instance.open(EmWindow.RoomPwd, { roomId: msg.roomId, roomSceneType: RoomSceneType.PVE });
		} else {
			this.sendEnterRoom(RoomType.NORMAL, msg.roomId, "", false);
		}
	}
}
