/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2024-04-17 14:47:32
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../../core/ui/UIButton";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { RoomPlayerState } from "../../../constant/RoomDefine";
import { RoomState } from "../../../constant/RoomState";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import ChatSocketOutManager from "../../../manager/ChatSocketOutManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { RoomManager } from "../../../manager/RoomManager";
import { SharedManager } from "../../../manager/SharedManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import HomeWnd from "../../../module/home/HomeWnd";
import MainToolBar from "../../../module/home/MainToolBar";
import { ShopGoodsInfo } from "../../../module/shop/model/ShopGoodsInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import RoomHallCtrl from "../roomHall/RoomHallCtrl";
import RoomHallData from "../roomHall/RoomHallData";


export default class RoomHallRightPvp extends BaseFguiCom {
    private optList: fgui.GList
    private btnLock: UIButton
    private btnStart: UIButton
    private btnCancel: UIButton
    private btnReady: UIButton
    private txtCampaignName: fgui.GLabel
    private txtEnterCount: fgui.GLabel
    private txtCapacity: fgui.GLabel
    private txtRoomNum: fgui.GLabel
    public btnReward: fgui.GButton;

    // 撮合中 倒计时
    private gQueue: fgui.GGroup
    private txtQueueCountDown: fgui.GLabel
    private _queueTimeCount: number
    private _canCancelQueue: boolean   // 非房主20s后才可以取消撮合
    public n98: fgui.GGroup;
    /** 快捷邀请内容 */
    private inviteConent:string = '';
    
    constructor(comp: fgui.GComponent) {
        super(comp)
        this.optList.on(fgui.Events.CLICK_ITEM, this, this.__clickOptItem);
        this.btnStart.soundRes = SoundIds.CAMPAIGN_READY_SOUND;

        this.btnCancel.title = LangManager.Instance.GetTranslation("public.cancel1")
        this.btnReady.title = LangManager.Instance.GetTranslation("public.ready")
        this.btnStart.title = LangManager.Instance.GetTranslation("public.start")
        
        for (let index = 0; index < this.optList.numChildren; index++) {
            const element = this.optList.getChildAt(index);
            let tempBtn = new UIButton(element)
        }
    }

    public refreshRoomInfo() {
        this.txtRoomNum.text = "No." + this.roomInfo.id
        this.txtCapacity.text = this.roomInfo.playerCount + " / " + this.roomInfo.capacity
        this.txtEnterCount.text = this.model.playerInfo.JJCcount + " / " + this.model.playerInfo.JJCMaxCount;
        this.txtCampaignName.text = LangManager.Instance.GetTranslation("HigherGradeOpenTipView.content13")
        this.refreshQueueTimer()
        this.refreshOptBtn()
        this.n98.visible = false;
    }

    private refreshOptBtn() {
        let isOwner = this.model.isOwner
        this.btnLock.enabled = isOwner
        this.btnLock.selected = Boolean(this.roomInfo.password)
        this.btnCancel.visible = !isOwner
        this.btnReady.visible = !isOwner
        this.btnStart.visible = isOwner
        // this.btnStart.enabled = this.roomInfo.allPlayerReader && this.roomInfo.playerCount == RoomHallData.PvpPlayerItemCnt;;
        this.btnStart.enabled = isOwner;

        if (isOwner) {//房主
            switch (this.roomInfo.roomState) {
                case RoomState.STATE_USEING:
                    this.btnStart.visible = true
                    this.btnCancel.visible = false
                    break;
                case RoomState.STATE_COMPETEING:
                    this.btnStart.visible = false
                    this.btnCancel.visible = true
                    break;
            }
        } else {
            let player = this.roomInfo.getPlayerByUserId(this.model.selfArmy.userId, "") as CampaignArmy;
            if (player) {
                switch (player.roomState) {
                    case RoomPlayerState.PLAYER_STATE_WAITE:
                        this.btnReady.visible = true;
                        this.btnReady.enabled = true;
                        this.btnCancel.visible = false;
                        break;
                    case RoomPlayerState.PLAYER_STATE_READY:
                        this.btnReady.visible = false;
                        this.btnCancel.visible = true;
                        this.btnCancel.enabled = this._canCancelQueue;
                        break;
                }
            }
        }
    }

    private __clickOptItem(item: fgui.GButton) {
        let index = this.optList.getChildIndex(item)
        Logger.xjy("[RoomHallWnd]__clickOptItem", index)
        switch (index) {
            case 0:
                this.btnQuickInviteClick()
                break;
            case 1:
                this.btnTeamFormationClick()
                break;
            case 2:
                break;
        }
    }

    private _curRoomState: number
    public refreshQueueTimer() {
        this._queueTimeCount = 0;
        if (this.roomInfo.roomState == RoomState.STATE_COMPETEING) {
            // this.gQueue.visible = true;
            // this.txtQueueCountDown.text = "00:00";
            if (this._curRoomState != RoomState.STATE_COMPETEING) {
                this.ctrl.view.startTime();
                this._canCancelQueue = false;
                Laya.timer.clear(this, this.__queueTimerHandle)
                Laya.timer.loop(1000, this, this.__queueTimerHandle)
            }
        }
        else {
            // this.gQueue.visible = false;
            this._canCancelQueue = true;
            Laya.timer.clear(this, this.__queueTimerHandle)
            this.ctrl.view.stopTime();
        }
        this._curRoomState = this.roomInfo.roomState
    }

    private __queueTimerHandle() {
        this._queueTimeCount++;
        // let min_str = Utils.numFormat((Math.floor(this._queueTimeCount / 60) > 9) ? Math.floor(this._queueTimeCount / 60) : 0 + Math.floor(this._queueTimeCount / 60), 2)
        // let sec_str = Utils.numFormat((Math.floor(this._queueTimeCount % 60) > 9) ? Math.floor(this._queueTimeCount % 60) : 0 + Math.floor(this._queueTimeCount % 60), 2)
        // this.txtQueueCountDown.text = min_str + ":" + sec_str;
        if (this._queueTimeCount == 20) {
            this._canCancelQueue = true;
            this.btnCancel.enabled = true;
        }
    }

    /**
     * 快速邀请
     */
    private btnQuickInviteClick() {
        if (this.roomInfo && this.roomInfo.roomState == RoomState.STATE_COMPETEING) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("roomplayerItem.btnClick.tips"));
            return;
        }

        let num: number = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.SMALL_BUGLE_TEMP_ID);
        if (num == 0) {
            if (this.model.thane.smallBugleFreeCount <= 0) {
                let str = LangManager.Instance.GetTranslation("chat.view.ChatInputView.command06");
                MessageTipManager.Instance.show(str);
                this.ctrl.quickBuySmallBugle()
                return;
            }
            else {
                this.model.quickInviteFlag = true;
                ChatSocketOutManager.sendSmallBugleFreeCount();
                return;
            }
        }
        this.ctrl.quickInvite();
    }

    private btnStartClick() {
        if (!this.roomInfo) return;

        if (this.showThewAlert(this.startAlertBack.bind(this))) return;
        this.ctrl.senPlayerStart();
    }

    private btnReadyClick() {
        if (!this.roomInfo) return;

        if (this.showThewAlert(this.readyAlertBack.bind(this))) return;
        this.ctrl.sendPlayerReady();
    }

    private btnCancelClick() {
        this.ctrl.senPlayerCancel()
    }

    private showThewAlert(callBack: Function = null): boolean {
        let flag: boolean = this.model.playerInfo.JJCcount < 1;
        let preDate: Date = new Date(SharedManager.Instance.roomCheckDate);
        let now: Date = new Date();
        let outdate: boolean = false;
        let check: boolean = SharedManager.Instance.roomCheck;
        if (!check || preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())
            outdate = true;
        if (flag && outdate) {
            let checkTxt = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
            let content = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist03");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { "checkRickText": checkTxt }, null, content, null, null, callBack);
        }

        return flag && outdate;
    }

    private startAlertBack(b: boolean, check: boolean) {
        this.readState(check);
        if (!b) return;
        this.ctrl.senPlayerStart();
    }

    private readyAlertBack(b: boolean, check: boolean) {
        this.readState(check);
        if (!b) return;
        this.ctrl.sendPlayerReady();
    }

    private readState(check: boolean) {
        SharedManager.Instance.roomCheck = check;
        SharedManager.Instance.roomCheckDate = new Date;
        SharedManager.Instance.saveRoomCheck();
        HomeWnd.Instance.getMainToolBar().switchToolsBarState(MainToolBar.PVP_ROOM_START);
    }


    private btnTeamFormationClick() {
        FrameCtrlManager.Instance.open(EmWindow.TeamFormation);
    }

    private btnLockClick() {
        this.btnLock.selected = !Boolean(this.roomInfo.password)
        FrameCtrlManager.Instance.open(EmWindow.RoomPwd, { selCampaignID: this.roomInfo.campaignId });
    }

    public get ctrl(): RoomHallCtrl {
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.RoomHall) as RoomHallCtrl
        return ctrl
    }

    private get model(): RoomHallData {
        return this.ctrl.data;
    }

    private get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo
    }

    public resetView() {
    
    }

    private btnRewardClick() {
        FrameCtrlManager.Instance.open(EmWindow.PvpRewardsWnd);
    }

    public dispose() {
        Laya.timer.clear(this, this.__queueTimerHandle)
    }
}