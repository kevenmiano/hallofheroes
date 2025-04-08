// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-22 14:46:26
 * @LastEditTime: 2023-06-29 18:11:43
 * @LastEditors: jeremy.xu
 * @Description: 房间密码视图
 * 房主在此设置房间密码
 * 其他人进入带有密码房间时在此输入密码
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import StringHelper from "../../../../core/utils/StringHelper";
import { RoomSceneType, RoomType } from "../../../constant/RoomDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomListSocketOutManager } from "../../../manager/RoomListSocketOutManager";
import { RoomManager } from "../../../manager/RoomManager";
import { RoomSocketOuterManager } from "../../../manager/RoomSocketOuterManager";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";

export default class RoomPwdWnd extends BaseWindow {
    private tfCount: fgui.GTextInput;
    private txtDesc: fgui.GLabel;
    private btnStart: UIButton;
    private _roomId: number;
    private _change: boolean;
    private _txtChange: string = "";
    private _regExp: RegExp;
    private _roomSceneType:RoomSceneType = RoomSceneType.PVE;

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind(){
        super.OnInitWind();
        this.setCenter()
    }
    
    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.initView();
        this._regExp = /^(13[0-9]{2}|147[0-9]|15[0-9]{2}|18[0-9]{2})[0-9]{7}$/;
        this.tfCount.restrict = "0-9";
        this.initEvent();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    private initView() {
        this.txtDesc.text = LangManager.Instance.GetTranslation("yishi.view.RoomPasswordFrame.warmTxt.text");
        this.txtFrameTitle.text = LangManager.Instance.GetTranslation("yishi.view.RoomPasswordFrame.titleTxt");
        if(this.frameData && this.frameData.roomSceneType){
            this._roomSceneType = this.frameData.roomSceneType;
        }
        if(this.frameData && this.frameData.roomId){
            this._roomId = this.frameData.roomId
        }else if(this.roomInfo){
            this._roomId = this.roomInfo.id;
            if ( this.roomInfo.houseOwnerId == this.playerInfo.userId && this.roomInfo.password) {
                this.tfCount.text = this.roomInfo.password;
            }
        }
    }

    protected initEvent() {
        this.tfCount.on(Laya.Event.INPUT, this, this.__txtChange)
    }

    protected removeEvent() {
        this.tfCount.on(Laya.Event.INPUT, this, this.__txtChange)
    }

    private __txtChange(event: Event) {
        if (StringHelper.getStringLength(this.tfCount.text) > 6) {
            this.tfCount.text = this._txtChange;
        }
        this._txtChange = this.tfCount.text;

        this._change = true;
    }

    private btnStartClick() {
        let hasPwd = this.roomInfo && this.roomInfo.password


        if (this.isOwner) {
            if (!hasPwd && this.tfCount.text == "") {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.view.RoomPasswordFrame.AlertContent"));
                return
            }
            
            if (this._change) {
                this.passwordInputBack(this._roomId, this.tfCount.text)
            }
        } else {
            if (this.tfCount.text == "") {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.view.RoomPasswordFrame.AlertContent"));
                return
            }
            this.sendEnterRoom(this._roomSceneType == RoomSceneType.PVE ? RoomType.NORMAL : RoomType.MATCH, this._roomId, this.tfCount.text, false);
        }
        this.OnBtnClose();
    }

    //return: S2CProtocol.U_C_ROOM_SEND
    public passwordInputBack(id: number, password: string) {
        RoomSocketOuterManager.sendLockCampaignRoom(id, password);
    }

    public sendEnterRoom(roomType: RoomType, roomId: number, pwd: string, isInvite: boolean) {
        RoomListSocketOutManager.addRoomById(roomType, roomId, pwd, isInvite);
    }
    
    private btnCancelClick() {
        this.OnBtnClose();
    }

    public refresh() {
        
    }

    private get selfArmy(): BaseArmy {
        return ArmyManager.Instance.army;
    }

    private get isOwner() {
        if (!this.roomInfo || !this.selfArmy) return
        return this.roomInfo.houseOwnerId == this.selfArmy.userId
    }

    private get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }
}