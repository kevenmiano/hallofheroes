// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:39:07
 * @LastEditTime: 2022-10-31 12:17:09
 * @LastEditors: jeremy.xu
 * @Description: 房间界面pve
 */

import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../../core/ui/UIButton";
import StringHelper from "../../../../../core/utils/StringHelper";
import { t_s_campaignData } from "../../../../config/t_s_campaign";
import { RoomSceneType, RoomType } from "../../../../constant/RoomDefine";
import { RoomState } from "../../../../constant/RoomState";
import { KingTowerManager } from "../../../../manager/KingTowerManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import RoomListItem from "../item/RoomListItem";
import RoomListData from "../RoomListData";
import { RoomInfo } from '../../../../mvc/model/room/RoomInfo';
import FUI_RoomListMemberItem from "../../../../../../fui/RoomList/FUI_RoomListMemberItem";
import { CampaignArmy } from "../../../../map/campaign/data/CampaignArmy";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { JobType } from "../../../../constant/JobType";


export default class PveRoomListWnd extends BaseWindow {
    private frame: fgui.GComponent
    private btnSearchRoom: UIButton
    private btnCreateRoom: UIButton
    private btnEnterRoom: UIButton
    private btnRefreshRoom: UIButton
    private itemList: fgui.GList
    private compbo: fgui.GComboBox
    private txtEnterCount: fgui.GLabel
    private iTxtSearch: fgui.GTextField;
    public txtEnterCountDesc: fgui.GTextField;
    private selectRoom: RoomInfo

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter()
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        // this.compbo.dropdown.getChild("list").asList.setVirtual();
        this.compbo.on(fairygui.Events.STATE_CHANGED, this, this.__selectedCampaignChange);
        this.compbo.items = this.model.getComboListNames();
        this.itemList.setVirtual();
        this.itemList.on(fgui.Events.CLICK_ITEM, this, this.__clickItem);
        this.itemList.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);
        this.txtEnterCountDesc.text = LangManager.Instance.GetTranslation('PveSelectCampaignWnd.enterCountTxt');
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('pveroomlist.PVERoomListFrame.title');
        this.refresh()

    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
        this.compbo.off(fairygui.Events.STATE_CHANGED, this, this.__selectedCampaignChange);
        this.itemList.off(fgui.Events.CLICK_ITEM, this, this.__clickItem);
    }

    private __clickItem(item: RoomListItem) {
        Logger.xjy("[RoomListWnd]onClickItem")
        let roomInfo = item.roomInfo
        if (!roomInfo) {
            if (!this.selectRoom) {
                this.itemList.selectNone()
            } else {
                let preIndex = -1
                for (let index = 0; index < this.itemList.numChildren; index++) {
                    const item = this.itemList.getChildAt(index) as RoomListItem;
                    if (item.roomInfo && (this.selectRoom.id == item.roomInfo.id)) {
                        preIndex = index
                        break
                    }
                }
                if (preIndex != -1) {
                    this.itemList.selectedIndex = preIndex
                } else {
                    this.itemList.selectNone()
                }
            }
            return;
        }

        if (roomInfo.roomState != RoomState.STATE_USEING) {
            MessageTipManager.Instance.show(RoomState.getStateNameTips(roomInfo.roomState));
            this.itemList.selectNone()
        } else {
            this.selectRoom = roomInfo;
            this.refreshRoomMembers();
        }
    }

    private refreshRoomMembers() {
        if (this.selectRoom) {
            for (let index = 1; index <= 4; index++) {
                const item = this["itemMember0" + index] as FUI_RoomListMemberItem;
                item.visible = index <= this.selectRoom.playerCount;
            }

            let cnt = 0
            for (const key in this.selectRoom.playerList) {
                if (Object.prototype.hasOwnProperty.call(this.selectRoom.playerList, key)) {
                    const army = this.selectRoom.playerList[key];
                    if (army instanceof CampaignArmy) {
                        cnt++
                        const item = this["itemMember0" + cnt] as FUI_RoomListMemberItem;
                        if (item) {
                            item.visible = true;
                            item.imgCaptain.visible = this.selectRoom.houseOwnerId == army.baseHero.userId;
                            // item.imgVip.visible = army.baseHero.vipGrade > 0;
                            item.imgVip.visible = false;
                            item.txtName.text = army.baseHero.nickName;
                            item.txtLevel.text = army.baseHero.grades + "";
                            item.imgIcon.icon = JobType.getJobIcon(army.baseHero.job);
                        }
                    }
                }
            }
        } else {
            for (let index = 1; index <= 4; index++) {
                const item = this["itemMember0" + index] as FUI_RoomListMemberItem;
                item.visible = false
            }
        }
    }

    private __renderListItem(index: number, item: RoomListItem) {
        if (!this.model) return
        let roomList = this.model.roomList
        if (!roomList) return
        item.roomSceneType = RoomSceneType.PVE
        item.roomInfo = roomList[index]
    }

    public refresh() {
        let len = this.model.roomList.length
        this.itemList.numItems = len < RoomListData.PvePageRoomItems ? RoomListData.PvePageRoomItems : len

        this.__refreshEnterCnt()

        this.selectRoom = null;
        this.itemList.selectNone();
        this.refreshRoomMembers();
    }

    private __refreshEnterCnt() {
        let list = this.model.getComboList()
        let temp = list[this.compbo.selectedIndex] as t_s_campaignData

        let max: number = this.model.playerInfo.multiCopyMaxCount;
        let current: number = this.model.playerInfo.multiCopyCount;
        if (temp && temp.SonTypes != 0) {
            let max_tower: number;
            let current_tower: number;
            if (temp.isKingTower) {//王者之塔
                max_tower = KingTowerManager.Instance.kingTowerInfo.maxKingCount;
                current_tower = KingTowerManager.Instance.kingTowerInfo.kingCount;
            }
            else {
                max_tower = this.model.playerInfo.maxTrialCount;
                current_tower = this.model.playerInfo.trialCount;
            }
            current = max_tower - current_tower;
            if (current < 0) current = 0;
            this.txtEnterCount.text = current + " / " + max_tower;

        } else {
            if (current < 0) current = 0;
            this.txtEnterCount.text = current + " / " + max;
        }
    }

    private __selectedCampaignChange(thisCombo: fgui.GComboBox, evt: Laya.Event) {
        let list = this.model.getComboListIds();
        let nameList = this.model.getComboListNames();
        let id = list[this.compbo.selectedIndex]
        let name = nameList[this.compbo.selectedIndex]
        if (this.model.selCampaignID == id) return
        this.model.selCampaignID = id
        this.ctrl.requestRoomInfo();
        this.compbo.text = name
        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pveroomlist.view.PVERoomSearchView.command01"));
    }

    private btnSearchRoomClick() {
        FrameCtrlManager.Instance.open(EmWindow.FindRoom)
    }

    private btnCreateRoomClick() {
        FrameCtrlManager.Instance.open(EmWindow.PveMultiCampaignWnd)
        this.OnBtnClose()
    }

    private btnRefreshRoomClick() {
        this.ctrl.requestRoomInfo();
    }

    private btnEnterRoomClick() {
        if (this.selectRoom) {
            let id = Number(this.selectRoom.id)
            if (id > 0) {
                this.ctrl.sendSearchRoomInfo(RoomType.NORMAL, id);
            } else {
                let str = LangManager.Instance.GetTranslation("pveroomlist.view.PVERoomSearchFrame.command01");
                MessageTipManager.Instance.show(str);
            }
        } else {
            let str = LangManager.Instance.GetTranslation("pveroomlist.view.PVERoomSearchFrame.selectRoom");
            MessageTipManager.Instance.show(str);
        }
    }
}