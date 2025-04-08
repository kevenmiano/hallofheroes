// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-20 11:47:13
 * @LastEditTime: 2024-03-01 11:29:30
 * @LastEditors: jeremy.xu
 * @Description: 英雄之门、竞技场
 */

export enum RoomSceneType {
    PVE, //
    PVP,
}


export enum RoomType {
    NORMAL, //战役
    MATCH, //pvp
    SECRET, //秘境房间
    VEHICLE, //载具房间
}

export enum RoomCampaignType {
    Multy,
    Activity
}

export enum RoomInviteType {
    Campaign, //副本邀请框
    RoomInvite, //房间邀请框
    QuickInvite, //快速邀请框
    SpaceInvite,//天空之城邀请
}

export class RoomEvent {
    public static UPDATE_ROOM_MAP: string = "UPDATE_ROOM_MAP";
    public static UPDATE_ROOM_BASE_DATA: string = "UPDATE_ROOM_BASE_DATA";
    public static UPDATE_ROOM_PLAYER_DATA: string = "UPDATE_ROOM_PLAYER_DATA";
    public static UPDATE_TEAM_FIGHT_POS: string = "UPDATE_TEAM_FIGHT_POS";
    public static EDIT_TEAM_FIGHT_POS: string = "EDIT_TEAM_FIGHT_POS";
    public static ADD_PLAYER_ROOM: string = "ADD_PLAYER_ROOM";
    public static REMOVE_PLAYER_ROOM: string = "REMOVE_PLAYER_ROOM";
    public static ROOM_HOUSEOWNER_CHANGE: string = "room_HouseOwner_change";
    public static PLAYER_READY: string = "player_ready";
    public static PLAYER_CENCEL: string = "player_cancel";
    public static ROOM_LIST_PLAYER: string = "ROOM_LIST_PLAYER";
    public static RANK_INFO_LIST: string = "rankInfoList";

    public static ROOM_PLACE_STATE_CHANGE: string = "ROOM_PLACE_STATE_CHANGE";
    public static REFRESH_ROOM_LIST: string = "REFRESH_ROOM_LIST";

    public static HIDE_PVP_ROOM_LEFT_TIME: string = "HIDE_PVP_ROOM_LEFT_TIME";
}

export class RoomPlayerState {
    /**
     *  0:等待
     */
    public static PLAYER_STATE_WAITE: number = 0;
    /**
     * 1: 准备
     */
    public static PLAYER_STATE_READY: number = 1;
    /**
     * 2: 房主
     */
    public static PLAYER_STATE_HOST: number = 2;

}

export enum RoomPlayerItemType {
    PveHall,
    PvpHall,
    PvpChallenge,
}