/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:31:36
 * @LastEditTime: 2024-02-19 18:16:56
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { RoomSceneType, RoomType } from "../../../constant/RoomDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { RoomListSocketOutManager } from "../../../manager/RoomListSocketOutManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";

import RoomMsg = com.road.yishi.proto.room.RoomMsg
import RoomListRspMsg = com.road.yishi.proto.room.RoomListRspMsg

export default class PvpGateCtrl extends FrameCtrlBase {

    show() {
        super.show()
        
    }

    hide() {
        super.hide()

    }
    
    protected addEventListener() {
        super.addEventListener()
        ServerDataManager.listen(S2CProtocol.U_C_ROOM_FIND_RESULT, this, this.__onSearchRoom);
    }

    protected delEventListener() {
        super.delEventListener()
        ServerDataManager.cancel(S2CProtocol.U_C_ROOM_FIND_RESULT, this, this.__onSearchRoom);
    }

    private __onSearchRoom(pkg: PackageIn) {
        if (FrameCtrlManager.Instance.isOpen(EmWindow.RoomList) || FrameCtrlManager.Instance.isOpen(EmWindow.PveMultiCampaignWnd)) {
            Logger.xjy("[PvpCtrl]房间界面点进入房间不需要执行以下逻辑, 在RoomListCtrl|PveSelectCampaign中处理")
            return
        }
        let msg = pkg.readBody(RoomMsg) as RoomMsg;
        Logger.xjy("[PvpCtrl]__onSearchRoom", msg)

        if (msg.isSetPassword) {
            FrameCtrlManager.Instance.open(EmWindow.RoomPwd, { "roomId": msg.roomId, "roomSceneType": RoomSceneType.PVP })
        } else {
            this.sendEnterRoom(RoomType.MATCH, msg.roomId, "", false);
        }
    }

    //return: S2CProtocol.U_C_CAMPAIGN_ROOM_CREATE
    public sendEnterRoom(roomType: RoomType, roomId: number, pwd: string, isInvite: boolean) {
        RoomListSocketOutManager.addRoomById(roomType, roomId, pwd, isInvite);
    }
    
    public sendCreateRoom() {
        RoomListSocketOutManager.sendCreateRoom(3,RoomType.MATCH,"");
    }

    public sendQuickJoin() {
        RoomListSocketOutManager.sendSearchRoomInfo(RoomType.MATCH, 0);
    }
}
