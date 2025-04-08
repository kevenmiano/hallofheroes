/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 20:12:31
 * @LastEditTime: 2024-01-04 16:55:32
 * @LastEditors: jeremy.xu
 * @Description: 房间数据
 */

import ItemID from "../../../constant/ItemID";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import FrameDataBase from "../../../mvc/FrameDataBase";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";

export default class RoomHallData extends FrameDataBase {
    public static PlayerItemCnt = 3
    public static PvpPlayerItemCnt = 3
    public quickInviteFlag = false
    /**
     * 点击开始按钮, 如果玩家收益次数为0, 则弹出使用帝国讨伐令窗口
     * 本次登陆提示一次, 如果点了确定, 则每次都提示
     */
    public cancelCheckUseImperialCrusadeOrder: boolean = false  

    public get playerItemCnt(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public get selfArmy(): BaseArmy {
        return ArmyManager.Instance.army;
    }

    public get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    public get isOwner() {
        if (!this.roomInfo || !this.selfArmy) return
        return this.roomInfo.houseOwnerId == this.selfArmy.userId
    }

    /** 邀请窗口取消收益 */
    public inviteCancelIncome: boolean = false;
    private _isNoGet: boolean = false;
    public set isNoGet(value: boolean) {
        this._isNoGet = value;
    }
    public get isNoGet(): boolean {
        return this._isNoGet;
    }

    private _isCross:boolean = false;
    public set isCross(value: boolean) {
        this._isCross = value;
    }
    public get isCross(): boolean {
        return this._isCross;
    }

    public get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo
    }


    protected show() {
        super.show()
        if (this.inviteCancelIncome) {
            this.isNoGet = true;
            this.inviteCancelIncome = false;
        } else {
            this.isNoGet = false;
        }
    }

    protected hide(){
        super.hide()
    }
    
    public getImperialCrusadeOrderPos() {
        let pos = -1;
        let bagDic = GoodsManager.Instance.getGeneralBagList();
        for (const key in bagDic) {
            if (bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = bagDic[key];
                if (info.templateId == ItemID.IMPERIAL_CRUSADE_ORDER) {
                    pos = info.pos;
                    break;
                }
            }
        }
        return pos
    }
}