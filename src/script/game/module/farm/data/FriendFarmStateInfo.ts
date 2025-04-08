// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-02-03 21:01:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:39:32
 * @Description: 
 */

import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { FarmEvent } from "../../../constant/event/NotificationEvent";
import { FarmOperateType } from "../../../constant/FarmOperateType";
import FUIHelper from '../../../utils/FUIHelper';
import { EmPackName, EmWindow } from '../../../constant/UIDefine';
import Logger from '../../../../core/logger/Logger';
import { ArmyManager } from "../../../manager/ArmyManager";

export default class FriendFarmStateInfo extends GameEventDispatcher {

    public userId: number = 0;
    /**
     *摘取 
     */
    public canSteal: boolean;
    /**
     *充能 
     */
    public _canGivePower: boolean;
    public get canGivePower(): boolean{
        return this._canGivePower
    }
    public set canGivePower(value:boolean){
        // Logger.xjy("[FriendFarmStateInfo]canGivePower", this.userId, value)
        this._canGivePower = value;
    }
    /**
     *复活 
     */
    public canRevive: boolean;
    /**
     *除虫
     */
    public canWorm: boolean;
    /**
     *除草 
     */
    public canWeed: boolean;
    /**
     * 喂养 
     */
    public canFeed: boolean;


    /**
     * 当前状态
     */
    public get curState(): number {
        if (this.canSteal)
            return FarmOperateType.STEAL;
        if (this.canGivePower)
            return FarmOperateType.GIVE_POWER;
        if (this.canFeed)
            return FarmOperateType.PET_FEED;
        if (this.canRevive)
            return FarmOperateType.REVIVE;
        if (this.canWorm)
            return FarmOperateType.WORM;
        if (this.canWeed)
            return FarmOperateType.WEED;
        return FarmOperateType.NO_OPER;
    }

    /**
     * 当前状态图片帧
     */
    public get curStateFrame(): string {
        switch (this.curState) {
            case FarmOperateType.STEAL:
                return FUIHelper.getItemURL(EmWindow.Farm, "Icon_Farm_Collect");
            case FarmOperateType.GIVE_POWER:
                return FUIHelper.getItemURL(EmPackName.Base, "Icon_Farm_Energize");
            case FarmOperateType.REVIVE:
                return FUIHelper.getItemURL(EmWindow.Farm, "Icon_Farm_Revive");
            case FarmOperateType.WORM:
                return FUIHelper.getItemURL(EmWindow.Farm, "Icon_Farm_Bug");
            case FarmOperateType.WEED:
                return FUIHelper.getItemURL(EmWindow.Farm, "Icon_Farm_Weed");
            case FarmOperateType.PET_FEED:
                return FUIHelper.getItemURL(EmWindow.Farm, "Icon_Farm_Sylph");;
        }
        return "";
    }

    public get weight(): number {
        switch (this.curState) {
            case FarmOperateType.STEAL:
                return 6;
            case FarmOperateType.GIVE_POWER:
                return 1;
            case FarmOperateType.REVIVE:
                return 6;
            case FarmOperateType.WORM:
                return 6;
            case FarmOperateType.WEED:
                return 6;
            case FarmOperateType.PET_FEED:
                return 6;
        }
        return 0;
    }
    
    public beginChanges() {
    }
    
    /**
     *状态改变, 发出事件
     */
    public commitChanges() {
        this.dispatchEvent(FarmEvent.FRIEND_FARM_STATE_CHANGE, this);
        if(this.userId == ArmyManager.Instance.thane.userId){
            // 自己树状态发生改变
            // this.dispatchEvent(FarmEvent.FRIEND_FARM_STATE_CHANGE, this);
        }
    }

}