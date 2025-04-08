/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 12:13:25
 * @LastEditTime: 2021-11-22 18:17:45
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import StarInfo from "../module/mail/StarInfo";

export class StarBagType
{
    /**
     * 回收站
     */		
    public static RECYCLE:number = -1;
    /**
     * 临时位置 
     */		
    public static TEMP:number = 0;
    /**
     * 玩家背包 
     */		
    public static PLAYER:number = 1;
    /**
     * 领主背包 
     */		
    public static THANE:number = 2;
    /**
     * 商店中的
     */
    public static SHOP:number = 3;
    /**
     * 系统信息 聊天
     */
    public static SYS:number = 4;
}

export enum StarSelectState {
    Default = 0,
    Selectable,
    Selected,
}

export class StarEvent {
    public static UPDATE_STAR: string = "UPDATE_STAR";
    public static DELETE_STAR: string = "DELETE_STAR";
    public static COMPOSE_STAR: string = "COMPOSE_STAR";
    public static RANDOMPOS_CHANGE: string = "RANDOMPOS_CHANGE";
    public static UPDATE_STAR_POWER: string = "UPDATE_STAR_POWER";
    public static STAR_SELL_STATE: string = "STAR_SELL_STATE";
    public static STAR_COMPOSE: string = "STAR_COMPOSE";
    public static START_SELL_SELECT_STATUS: string = "START_SELL_SELECT_STATUS";
    public static STAR_EXCHANGE: string = "STAR_EXCHANGE";
    public static EXIT_STAR_EXCHANGE: string = "EXIT_STAR_EXCHANGE";
    public static STAR_NEW_COMPOSE: string = "STAR_NEW_COMPOSE";
    public static STAR_LEFT_EXCHANGE: string = "STAR_LEFT_EXCHANGE";
    public static EXIT_STAR_LEFT_EXCHANGE: string = "EXIT_STAR_LEFT_EXCHANGE";
    public static STAR_COMPOSE_COMPLETE: string = "STAR_COMPOSE_COMPLETE";
    private _starInfo: StarInfo;
    public StarEvent(data: StarInfo) {
        this._starInfo = data;
    }
    public get starInfo(): StarInfo {
        return this._starInfo;
    }
}