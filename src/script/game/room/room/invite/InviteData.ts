/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:39:07
 * @LastEditTime: 2021-04-30 16:43:46
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import GTabIndex from "../../../constant/GTabIndex"
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo"
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo"
import { ArmyManager } from "../../../manager/ArmyManager"
import { PlayerManager } from "../../../manager/PlayerManager"
import { RoomManager } from "../../../manager/RoomManager"
import FrameDataBase from "../../../mvc/FrameDataBase"
import { RoomInfo } from "../../../mvc/model/room/RoomInfo"

export default class InviteData extends FrameDataBase {
    public static BeingInvite_AutoExitTime = 15
    
    public static TabIndex = {
        Friend: Math.floor(GTabIndex.Invite_Friend / 1000),
        Guild: Math.floor(GTabIndex.Invite_Guild / 1000),
        Hall: Math.floor(GTabIndex.Invite_Hall / 1000),
    }

    public quickInviteFlag: boolean;
    public cacheList: ThaneInfo[] = [];

    show(){
        super.show()
    }

    hide(){
        super.hide()
    }

    dispose(){
        super.dispose()
    }

    public static get playerInfo():PlayerInfo
    {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    
    public static get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public static get roomInfo():RoomInfo
    {
        return RoomManager.Instance.roomInfo;
    }
}