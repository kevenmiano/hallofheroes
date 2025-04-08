/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-21 17:35:57
 * @LastEditTime: 2024-03-20 16:17:52
 * @LastEditors: jeremy.xu
 * @Description: 创建房间, 房间列表处相关协议
 */

import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { SocketManager } from "../../core/net/SocketManager";
import Utils from "../../core/utils/Utils";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { MessageTipManager } from "./MessageTipManager";

import RoomReqMsg = com.road.yishi.proto.room.RoomReqMsg
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg
import { RoomType } from "../constant/RoomDefine";
import { SecretEnterType, SecretStartType } from "../datas/secret/SecretConst";

export class RoomListSocketOutManager {
    public static Internal = 1000
    public static InternalState = false
    /**
     *获取战役房间列表  
     * @param roomType（房间类型0: 普通房间, 1: 撮合房间, 2: 载具房间）
     * @param id（房间ID）
     * 
     */
    public static requestRoomList(roomType: number = 0, id: number = 0) {
        Logger.xjy("[RoomListSocketOutManager]requestRoomList", roomType, id)
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.roomType = roomType;
        msg.nameKey = id.toString();
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_LIST, msg);
    }
    /**
     *加入房间 
     * @param roomType（房间类型0: 普通房间, 1: 撮合房间, 2: 载具房间）
     * @param roomId 房间id
     * @param pwd 密码
     * @param isInvite 是否为接受邀请
     * @param income false表示使用收益  ！！！
     * 
     */
    public static addRoomById(roomType: number, roomId: number, pwd: string = "", isInvite: boolean = false, income: boolean = false) {
        if (RoomListSocketOutManager.InternalState) {
            // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return
        }
        RoomListSocketOutManager.InternalState = true;
        Utils.delay(RoomListSocketOutManager.Internal).then(() => {
            RoomListSocketOutManager.InternalState = false;
        });
        if (SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command03"));
            return;
        }

        var msg: RoomReqMsg = new RoomReqMsg();
        msg.roomId = roomId;
        msg.password = pwd;
        msg.roomType = roomType;
        msg.isInvite = isInvite;
        msg.isGet = income;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_ENTER, msg);
    }
    /**
     * 搜索房间 
     * @param roomType（房间类型0: 普通房间, 1: 撮合房间, 2: 载具房间）
     * @param roomId 房间id
     * 
     */
    public static sendSearchRoomInfo(roomType: number, roomId: number) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.roomId = roomId;
        msg.roomType = roomType;
        SocketManager.Instance.send(C2SProtocol.U_C_ROOM_FIND, msg);
    }
    private static _intervalTime: number = 0;
    /**
     * 创建房间 
     * @param capacity 房间最大人数
     * @param roomType（房间类型 0: 普通房间, 1: 撮合房间, 2: 载具房间, 3: 秘境房间）
     * @param pwd 密码
     */
    public static sendCreateRoom(capacity: number, roomType: number, pwd: string = "") {
        if (RoomListSocketOutManager.InternalState) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return
        }
        RoomListSocketOutManager.InternalState = true;
        Utils.delay(RoomListSocketOutManager.Internal).then(() => {
            RoomListSocketOutManager.InternalState = false;
        });
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.capacity = capacity; // 容量
        msg.roomType = roomType; //房间类型
        msg.password = pwd;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_CREATE, msg);
    }

    /**
     * 创建秘境房间
     */
    public static sendCreateSecretRoom(capacity: number, secretId: number, enterType: SecretEnterType, startType: SecretStartType) {
        var msg: RoomReqMsg = new RoomReqMsg();
        msg.capacity = capacity; //容量
        msg.roomType = RoomType.SECRET; //房间类型
        msg.campaignId = secretId;
        msg.enterType = Number(enterType);
        msg.startType =  Number(startType);
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ROOM_CREATE, msg);
    }

    /**
     * 载具 快速开始 
     */
    public static quickStart() {
        SocketManager.Instance.send(C2SProtocol.C_VEHICLE_QUICK_PLAY);
    }

    /**
     * 
     */
    public static cancelQuickStart() {
        SocketManager.Instance.send(C2SProtocol.C_VEHICLE_QUICK_PLAY_CANCEL);
    }
    /**
     * 请求房间状态（房间 or 副本） 
     * @param roomId 房间id
     */
    public static sendSearchRoomState(roomId: number, stage: number) {
        var msg: PropertyMsg = new PropertyMsg();
        msg.param1 = roomId;
        msg.param10 = stage;
        SocketManager.Instance.send(C2SProtocol.C_MULITY_CAMPAIGN_REQUEST, msg);
    }

}
