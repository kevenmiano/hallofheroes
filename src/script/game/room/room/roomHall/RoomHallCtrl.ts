/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-22 16:11:27
 * @LastEditTime: 2023-09-25 18:26:22
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import LangManager from "../../../../core/lang/LangManager";
import LayerMgr from "../../../../core/layer/LayerMgr";
import Logger from "../../../../core/logger/Logger";
import { BagEvent, NotificationEvent, RoomHallEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { RoomEvent, RoomPlayerState, RoomSceneType } from "../../../constant/RoomDefine";
import { RoomState } from "../../../constant/RoomState";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { RoomManager } from "../../../manager/RoomManager";
import { RoomSocketOuterManager } from "../../../manager/RoomSocketOuterManager";
import { RoomSocketOutManager } from "../../../manager/RoomSocketOutManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import HomeWnd from "../../../module/home/HomeWnd";
import MainToolBar from "../../../module/home/MainToolBar";
import { ShopGoodsInfo } from "../../../module/shop/model/ShopGoodsInfo";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import RoomHallData from "./RoomHallData";
import { NotificationManager } from '../../../manager/NotificationManager';
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from '../../../constant/ConfigDefine';
import { t_s_campaignData } from '../../../config/t_s_campaign';
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerManager } from '../../../manager/PlayerManager';
import { ConfigManager } from "../../../manager/ConfigManager";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignSocketOutManager } from "../../../manager/CampaignSocketOutManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import { KingTowerManager } from "../../../manager/KingTowerManager";
import { GlobalConfig } from "../../../constant/GlobalConfig";
import StringHelper from "../../../../core/utils/StringHelper";
import { SharedManager } from "../../../manager/SharedManager";
import UIManager from "../../../../core/ui/UIManager";
import ObjectPool from "../../../../core/pool/ObjectPool";
import ChatData from "../../../module/chat/data/ChatData";
import { ChatChannel } from "../../../datas/ChatChannel";
import InviteData from "../invite/InviteData";
import ChatHelper from "../../../utils/ChatHelper";
import { SocketSendManager } from "../../../manager/SocketSendManager";

export default class RoomHallCtrl extends FrameCtrlBase {
    public roomSceneType = RoomSceneType.PVE

    protected initDataPreShow() {
        super.initDataPreShow()
        this.roomSceneType = this.frameData.roomSceneType
    }

    protected clearDataPreHide() {
        super.clearDataPreHide()
    }

    protected addEventListener() {
        super.addEventListener()
        this.data.thane.on(PlayerEvent.SMALL_BUGLE_FREE_COUNT, this.__smallBugleFreeCountHandler, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.on(PlayerEvent.MUTICOPY_COUNT, this.__mutiCopyCount, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.on(PlayerEvent.TAILA_COUNT, this.__mutiCopyCount, this);
        NotificationManager.Instance.on(RoomHallEvent.CHANGE_CAMPAIGN, this.__changeCampaignHandler, this);
        if (this.roomInfo) {
            this.roomInfo.on(RoomEvent.UPDATE_ROOM_BASE_DATA, this.__updateRoomInfoHanlder, this);
            this.roomInfo.on(RoomEvent.UPDATE_ROOM_PLAYER_DATA, this.__updateRoomInfoHanlder, this);
            this.roomInfo.on(RoomEvent.UPDATE_ROOM_MAP, this.__roomMapChangeHandler, this);
            this.roomInfo.on(RoomEvent.ADD_PLAYER_ROOM, this.__addPlayerHandler, this);
            this.roomInfo.on(RoomEvent.REMOVE_PLAYER_ROOM, this.__removePlayerHandler, this);
            this.roomInfo.on(RoomEvent.ROOM_HOUSEOWNER_CHANGE, this.__houseOwnerChangeHandler, this);
            this.roomInfo.on(RoomEvent.ROOM_PLACE_STATE_CHANGE, this.__placeStateChangeHandler, this);
        }
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_CROSS_PVE_STATUS, this.__updateCrossPvPInfoHanlder, this);
    }

    protected delEventListener() {
        super.delEventListener()
        this.data.thane.off(PlayerEvent.SMALL_BUGLE_FREE_COUNT, this.__smallBugleFreeCountHandler, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.off(PlayerEvent.MUTICOPY_COUNT, this.__mutiCopyCount, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.off(PlayerEvent.TAILA_COUNT, this.__mutiCopyCount, this);
        NotificationManager.Instance.off(RoomHallEvent.CHANGE_CAMPAIGN, this.__changeCampaignHandler, this);
        if (this.roomInfo) {
            this.roomInfo.off(RoomEvent.UPDATE_ROOM_BASE_DATA, this.__updateRoomInfoHanlder, this);
            this.roomInfo.off(RoomEvent.UPDATE_ROOM_PLAYER_DATA, this.__updateRoomInfoHanlder, this);
            this.roomInfo.off(RoomEvent.UPDATE_ROOM_MAP, this.__roomMapChangeHandler, this);
            this.roomInfo.off(RoomEvent.ADD_PLAYER_ROOM, this.__addPlayerHandler, this);
            this.roomInfo.off(RoomEvent.REMOVE_PLAYER_ROOM, this.__removePlayerHandler, this);
            this.roomInfo.off(RoomEvent.ROOM_HOUSEOWNER_CHANGE, this.__houseOwnerChangeHandler, this);
            this.roomInfo.off(RoomEvent.ROOM_PLACE_STATE_CHANGE, this.__placeStateChangeHandler, this);
        }
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_CROSS_PVE_STATUS, this.__updateCrossPvPInfoHanlder, this);
    }

    private __updateCrossPvPInfoHanlder() {
        this.view.refreshPvPRoomInfo()
    }

    private __updateRoomInfoHanlder() {
        this.view.refreshRoomInfo()
    }

    private __roomMapChangeHandler() {
        this.view.__roomMapChangeHandler()
    }

    private __addPlayerHandler(info: CampaignArmy) {
        this.view.showFigure(info)
    }

    private __removePlayerHandler(info: CampaignArmy) {
        this.view.hideFigure(info)
    }

    private __houseOwnerChangeHandler() {
        this.view.__houseOwnerChangeHandler()
    }

    private __placeStateChangeHandler() {
        this.view.__placeStateChangeHandler()
    }

    public quickBuySmallBugle() {
        let tempId = ShopGoodsInfo.SMALL_BUGLE_TEMP_ID
        let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(tempId);
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: 1 });
    }

    public __smallBugleFreeCountHandler() {
        if (!this.data.quickInviteFlag) {
            return;
        }
        this.data.quickInviteFlag = false;
        var num: number = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.SMALL_BUGLE_TEMP_ID);
        if (num == 0) {
            if (this.data.thane.smallBugleFreeCount <= 0) {
                var command = LangManager.Instance.GetTranslation("chat.view.ChatInputView.command06");
                MessageTipManager.Instance.show(command);
                this.quickBuySmallBugle()
                return;
            }
        }
        this.quickInvite();
        // FrameCtrlManager.Instance.open(EmWindow.QuickInvite, { roomSceneType: this.roomSceneType });
    }

    /** 快捷邀请内容 */
    private inviteConent: string = '';
    public quickInvite() {
        this.inviteConent = this.initInviteContent();
        let str = LangManager.Instance.GetTranslation('quickInviteCost');
        if (SharedManager.Instance.quickInvite) {
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { state: 2, content: str, backFunction: this.handInAlertBack.bind(this) });
            // FrameCtrlManager.Instance.open(EmWindow.QuickInvite, { roomSceneType: this.ctrl.roomSceneType });
        } else {
            this.sendInvite(this.inviteConent);
        }
    }

    protected handInAlertBack(notAlert: boolean) {
        if (notAlert) {
            SharedManager.Instance.quickInvite = false;
            SharedManager.Instance.savequickInviteTipCheck();
        }
        this.sendInvite(this.inviteConent);
    }

    private sendInvite(str) {
        let contents: any[] = new Array();
        if (!ChatHelper.checkCanSend(str, ChatChannel.WORLD)) {
            return;
        }
        let chatDataPool: ObjectPool<ChatData> = new ObjectPool("chatDataPool")
        let chatData = chatDataPool.get(() => {
            return new ChatData()
        })
        chatData.headId = ArmyManager.Instance.thane.snsInfo.headId;
        chatData.job = PlayerManager.Instance.currentPlayerModel.playerInfo.job;
        chatData.channel = ChatChannel.WORLD;
        chatData.uid = InviteData.thane.userId;
        chatData.senderName = InviteData.thane.nickName;
        chatData.appellId = InviteData.thane.appellId;
        chatData.msg = str;
        chatData.commit();
        contents.push(str);
        ChatHelper.lastSendTime3 = new Date().getTime();
        SocketSendManager.Instance.sendQuickInvite(contents);
    }

    //避免多次请求造成收益次数减少多次
    private isStarting: boolean = false;
    public senPlayerStart() {
        if (this.isStarting) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        this.isStarting = true;
        Laya.timer.once(3000, this, function () {
            this.isStarting = false;
        })
        Logger.xjy("[RoomHallCtrl]senPlayerStart")
        if (this.roomSceneType == RoomSceneType.PVP) {
            RoomSocketOuterManager.sendStartCampaignScene(0, 0);
        } else {
            RoomSocketOuterManager.sendStartCampaignScene(this.roomInfo.campaignId, 0, null, this.data.isNoGet, this.data.isCross);
        }
    }

    public sendPlayerReady() {
        Logger.xjy("[RoomHallCtrl]sendPlayerReady")
        RoomSocketOuterManager.sendPlayerState(RoomPlayerState.PLAYER_STATE_READY, this.data.isNoGet);
        let state = this.roomSceneType == RoomSceneType.PVE ? MainToolBar.PVE_ROOM_START : MainToolBar.PVP_ROOM_START
        HomeWnd.Instance.getMainToolBar().switchToolsBarState(state);
        LayerMgr.Instance.clearnGameDynamic();
    }

    public senPlayerCancel() {
        Logger.xjy("[RoomHallCtrl]senPlayerCancel")
        let state = this.roomSceneType == RoomSceneType.PVE ? MainToolBar.PVE_ROOM_READY : MainToolBar.PVP_ROOM_READY

        if (this.data.isOwner && this.roomSceneType == RoomSceneType.PVP) {
            RoomSocketOuterManager.sendRoomState(RoomState.STATE_USEING);
            // ResourcesBar.instance.armyBtnEnable(true);
        }
        else {
            RoomSocketOuterManager.sendPlayerState(RoomPlayerState.PLAYER_STATE_WAITE);
        }
        HomeWnd.Instance.getMainToolBar().switchToolsBarState(state);
    }

    public sendKickPlayerAlert(userId: number) {
        RoomSocketOutManager.sendKickPlayerAlert(userId);
    }

    public sendChangeRoomOwner(userId: number) {
        RoomSocketOutManager.sendChangeRoomOwner(userId);
    }

    /**
     * 房主进PVE房间后或者成为房主后需要选择一个副本进入
     */
    private sendOwnerSelCampaign() {
        if (this.data.isOwner && this.roomSceneType == RoomSceneType.PVE) {
            let roomInfo = this.roomInfo;
            if (RoomManager.selectCampaign) {
                if (roomInfo.campaignId == 0) {
                    roomInfo.campaignId = RoomManager.selectCampaign.CampaignId;
                }
            }
            if (roomInfo.mapTemplate) {
                Logger.xjy("[RoomHallCtrl]成为房主后选择一个副本", roomInfo.campaignId, roomInfo.id, roomInfo.mapTemplate.DungeonId, roomInfo.mapTemplate.CampaignId)
                RoomSocketOuterManager.updateRoomInfo(roomInfo.id, roomInfo.mapTemplate.DungeonId, roomInfo.mapTemplate.CampaignId);
            } else {
                // TODO:副本或战斗中断线重进, 因为roomInfo.campaignId=0, 获取不到副本消息  先直接退出房间
                CampaignSocketOutManager.Instance.sendReturnCampaignRoom(this.currentArmyId);
            }
        }
    }

    private __mutiCopyCount() {
        if (this.roomSceneType == RoomSceneType.PVP) { return }

        this.view.refreshEnterCount()
        this.view.autoSelectIncome()
    }

    private __changeCampaignHandler(dungeonId: number, campaignId: number) {
        this.changeCampaign(dungeonId, campaignId)
    }

    private changeCampaign(dungeonId: number, campaignId: number) {
        if (this.data.isOwner && this.roomSceneType == RoomSceneType.PVE) {
            let roomInfo = this.roomInfo;

            // 等级检测
            let campaignData: t_s_campaignData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaign, campaignId)
            if (!campaignData) return;

            let achieveLevel = true
            for (const key in roomInfo.playerList) {
                if (Object.prototype.hasOwnProperty.call(roomInfo.playerList, key)) {
                    const army = roomInfo.playerList[key];
                    if (army instanceof CampaignArmy) {
                        if (army.baseHero.grades < campaignData.MinLevel) {
                            achieveLevel = false
                            break
                        }
                    }
                }
            }

            Logger.xjy("[RoomHallCtrl]房主更换副本", roomInfo.id, campaignId, roomInfo.mapTemplate.CampaignNameLang, achieveLevel)

            if (achieveLevel) {
                RoomSocketOuterManager.updateRoomInfo(roomInfo.id, dungeonId, campaignId);
                FrameCtrlManager.Instance.exit(EmWindow.PveMultiCampaignWnd);
            } else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("room.view.pve.someoneLevelNotEnough"));
            }
        }
    }

    private get currentArmyId(): number {
        var bArmy: any = ArmyManager.Instance.army;
        if (bArmy) {
            return bArmy.id;
        }
        return 0;
    }

    public get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo
    }

    /**跨服匹配总开关是否开放 */
    public get openCrossPve2(): boolean {
        return false
        return this.playerInfo && this.playerInfo.isOpenCrossMutiCampaign2 && this.roomSceneType == RoomSceneType.PVE
    }

    /**对应的时间段是否开放了跨服匹配 */
    public get openCrossPve(): boolean {
        return false
        return this.playerInfo && this.playerInfo.isOpenCrossMutiCampaign && this.playerInfo.isOpenCrossMutiCampaign2 && this.roomSceneType == RoomSceneType.PVE
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel && PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public get playerItemCnt() {
        switch (this.roomSceneType) {
            case RoomSceneType.PVE:
                return RoomHallData.PlayerItemCnt
            case RoomSceneType.PVP:
                return RoomHallData.PvpPlayerItemCnt
            default:
                break;
        }
    }

    public initInviteContent(): string {
        let inviteConent = '';
        if (this.roomSceneType == RoomSceneType.PVP) {
            inviteConent = LangManager.Instance.GetTranslation("QuickInviteWnd.PvpInviteTipPrefix02", this.roomInfo.id);
        } else {
            if (this.roomInfo.campaignId == GlobalConfig.CampaignID.AncientRuins) {
                inviteConent = StringHelper.format(LangManager.Instance.GetTranslation("QuickInviteWnd.AncientRuinsInviteTipPrefix", this.roomInfo.mapName, this.roomInfo.id));
            } else {
                let mapName: string = "";
                let templateInfo = this.roomInfo.mapTemplate ? this.roomInfo.mapTemplate : CampaignManager.Instance.mapModel.campaignTemplate;
                let lvstr = '';
                if (templateInfo) {
                    lvstr = LangManager.Instance.GetTranslation("public.level3", templateInfo.MinLevel);
                }
                mapName = templateInfo.CampaignNameLang + " " + lvstr;
                inviteConent = LangManager.Instance.GetTranslation("QuickInviteWnd.PveInviteTipPrefix2", mapName, this.roomInfo.id);
            }
        }
        inviteConent += LangManager.Instance.GetTranslation('welcomeTojoin');
        return inviteConent;
    }
}