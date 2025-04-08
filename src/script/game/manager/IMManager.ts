import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import LangManager from '../../core/lang/LangManager';
import Logger from "../../core/logger/Logger";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { SocketManager } from '../../core/net/SocketManager';
import { DateFormatter } from "../../core/utils/DateFormatter";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { ChatEvent, IMEvent, IMFrameEvent, NotificationEvent, RequestInfoEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import RelationType from '../constant/RelationType';
import { StateType } from '../constant/StateType';
import { EmWindow } from '../constant/UIDefine';
import BaseIMInfo from '../datas/BaseIMInfo';
import { ChatChannel } from '../datas/ChatChannel';
import FriendGroupId from '../datas/FriendGroupId';
import FriendItemCellInfo from '../datas/FriendItemCellInfo';
import IMStateInfo from '../datas/IMStateInfo';
import IMModel from '../datas/model/IMModel';
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import RequestInfoRientation from '../datas/RequestInfoRientation';
import ChatData from "../module/chat/data/ChatData";
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import NoOperationCallUtil from "../utils/NoOperationCallUtil";
import { ArmyManager } from "./ArmyManager";
import { FriendManager } from './FriendManager';
import { MessageTipManager } from './MessageTipManager';
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { SharedManager } from "./SharedManager";
import { LoginManager } from '../module/login/LoginManager';
import ChatStateMsg = com.road.yishi.proto.chat.ChatStateMsg;
import ChatFriendMsg = com.road.yishi.proto.chat.ChatFriendMsg;
import TranslateRespMsg = com.road.yishi.proto.translate.TranslateRespMsg;
import TranslateReqMsg = com.road.yishi.proto.translate.TranslateReqMsg;

import { ChatManager } from './ChatManager';
import { OptType } from '../module/setting/SettingData';
import { SocketSendManager } from './SocketSendManager';
import ChatHelper from '../utils/ChatHelper';
import UIManager from '../../core/ui/UIManager';
import ChatWnd from '../module/chat/ChatWnd';


/**
 * 主要负责IM模块的协议处理, 提供协议发送、数据操作的API
 */
export default class IMManager extends GameEventDispatcher {
    private static _instance: IMManager;

    public static get Instance(): IMManager {
        if (!IMManager._instance) {
            IMManager._instance = new IMManager();
        }
        return IMManager._instance;
    }

    private _model: IMModel;
    public get model(): IMModel {
        return this._model;
    }

    public setup() {
        //调用此方法, 即调用了instance方法, 即setup了
    }

    /**
     *临时信息列表
     */
    private _tempMsgDic: SimpleDictionary;

    /**
     *指定时间无任何操作自动设为离开状态
     */
    private _noOperationSetLeave: NoOperationCallUtil;

    constructor() {
        super();

        if (!this._model) {
            this._model = new IMModel();
        }
        if (!this._tempMsgDic) {
            this._tempMsgDic = new SimpleDictionary();
        }
        if (!this._noOperationSetLeave) {
            this._noOperationSetLeave = new NoOperationCallUtil(300000, this.setLeaveIMState.bind(this), this.setOnlineIMState.bind(this));
        }
        this.addEvent();
        this.sendChangeIMState(StateType.ONLINE, "");
    }

    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_CH_PRIVATE_CHAT_REPLY, this, this.__imSendMsgResponseHandler);
        ServerDataManager.listen(S2CProtocol.U_CH_PRIVATE_CHAT, this, this.__receiveIMMsgHandler);
        ServerDataManager.listen(S2CProtocol.U_CH_EXCHANGE_STATE, this, this.__imStateChangeHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TRANSLATE, this, this._receiveTranslate);
        this.playerManager.addEventListener(RequestInfoEvent.REQUEST_SIMPLEANDSNS_INFO, this.__requestFriendInfoHandler, this);
        this.playerManager.addEventListener(NotificationEvent.CHAT_TRANSLATE_SETTING, this.__receiveTranslateSetting, this);
    }

    //收到聊天状态改变（好友或自己的）
    private __imStateChangeHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ChatStateMsg) as ChatStateMsg;
        if (msg.result == 1) {
            if (msg.userId == this.thane.userId) {
                this.model.setStateReply(msg.chatState, msg.replayStr);
                this.model.curState = msg.chatState;
            }
            else {
                let fInfo: FriendItemCellInfo = this.getFriendInfo(msg.userId);
                if (fInfo) {
                    fInfo.beginChanges();
                    fInfo.state = msg.chatState;
                    fInfo.commit();
                }
            }
        }
    }

    /**
     * 发送聊天信息后服务器回执 自己发的消息
     */
    private __imSendMsgResponseHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ChatFriendMsg) as ChatFriendMsg;
        if (msg.result == -1) {
            let str: string = LangManager.Instance.GetTranslation("friends.im.IMFrame.command02");
            MessageTipManager.Instance.show(str);
            var chatData: ChatData = new ChatData();
            chatData.channel = ChatChannel.INFO;
            chatData.msg = str;
            chatData.commit();
            NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
            return;
        }

        let imInfo: BaseIMInfo = new BaseIMInfo();
        imInfo.appellId = msg.appellId;
        imInfo.userId = msg.fromId;
        imInfo.nickName = msg.fromNick;
        imInfo.toId = msg.toId;
        imInfo.msg = msg.encodeMsg;
        imInfo.userLevel = msg.level;
        imInfo.job = msg.job;
        imInfo.headId = msg.headid;
        imInfo.frameId = msg.frameId;
        imInfo.consortiaId = msg.consortiaId;
        imInfo.consortiaName = msg.consortiaName;
        imInfo.date = DateFormatter.parse(msg.sendDate, "YYYY-MM-DD hh:mm:ss");
        let str = msg.sendDate.split(' ')[1];
        imInfo.sendTime = str.substring(0, str.length - 3);
        imInfo.sendResult = msg.result;
        imInfo.fight = msg.fight;
        // this.dispatchEvent(IMEvent.MSG_SEND_RESPONSE, imInfo);
        let info: FriendItemCellInfo = this.friendManager.checkIsExistFriendInfo(imInfo.toId);
        if (!info) {
            this.playerManager.sendRequestSimpleAndSnsInfo(imInfo.toId, RequestInfoRientation.RECENT_CONTACT);
        } else {
            this.friendManager.addPrivatePerson(info);
        }
        this.dispatchEvent(IMEvent.RECEIVE_MSG, imInfo);
        this.saveMsgCache(imInfo);
    }

    /**
     * 收到IM信息 别人发的消息
     */
    private __receiveIMMsgHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ChatFriendMsg) as ChatFriendMsg;
        let imInfo: BaseIMInfo = new BaseIMInfo();
        imInfo.appellId = msg.appellId;
        imInfo.userId = msg.fromId;
        imInfo.nickName = msg.fromNick;
        imInfo.msg = msg.encodeMsg;
        imInfo.userLevel = msg.level;
        imInfo.headId = msg.headid;
        imInfo.frameId = msg.frameId;
        imInfo.job = msg.job;
        imInfo.consortiaId = msg.consortiaId;
        imInfo.consortiaName = msg.consortiaName;
        imInfo.fight = msg.fight;
        imInfo.date = DateFormatter.parse(msg.sendDate, "YYYY-MM-DD hh:mm:ss");
        let str = msg.sendDate.split(' ')[1];
        imInfo.sendTime = str.substring(0, str.length - 3);
        imInfo.sendResult = msg.result;
        let info: FriendItemCellInfo = this.friendManager.checkIsExistFriendInfo(imInfo.userId);
        if (!info) {//不存在玩家信息, 则存进临时列表, 并请求玩家信息
            if (this._tempMsgDic[imInfo.userId]) {
                this._tempMsgDic[imInfo.userId].push(imInfo);
            } else {
                let tempList: Array<BaseIMInfo> = [];
                tempList.push(imInfo);
                this._tempMsgDic.add(imInfo.userId, tempList);
            }
            this.playerManager.sendRequestSimpleAndSnsInfo(imInfo.userId, RequestInfoRientation.RECENT_CONTACT);
            return;
        }

        // this.handleIMInfo(imInfo);
        this.updateUnreadMsg(imInfo);
        this.friendManager.addPrivatePerson(info);
        this.dispatchEvent(IMEvent.RECEIVE_MSG, imInfo);
        this.saveMsgCache(imInfo);
    }

    /**
     * 处理信息
     */
    private handleIMInfo(imInfo: BaseIMInfo) {
        this.updateUnreadMsg(imInfo);
        this.saveMsgCache(imInfo);
        this.dispatchEvent(IMEvent.RECEIVE_MSG, imInfo);
    }

    /**
     * 更新新消息
     * @param imInfo 
     */
    private updateUnreadMsg(imInfo: BaseIMInfo) {
        if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {  //如果没有打开聊天窗, 则存进数组
            this.addToNewMsg(imInfo);
        } else {
            //收到的消息是否当前正在聊天的人的, 如果不是, 要显示红点
            let wnd: ChatWnd = UIManager.Instance.FindWind(EmWindow.ChatWnd);
            if (wnd && wnd.isShowing) {
                if (!wnd.isTalkingWith(imInfo.userId)) {
                    this.addToNewMsg(imInfo);
                }
            }
        }
        SharedManager.Instance.privacyMsgCount = this.model.unreadMsgDic.getList().length;
        // SharedManager.Instance.saveNewMsg();
        this.model.isOpenFriendBtnShine = true;
    }
    /**
     * 添加到新消息
     */
    private addToNewMsg(imInfo: BaseIMInfo) {
        if (this.model.unreadMsgDic[imInfo.userId]) {
            this.model.unreadMsgDic[imInfo.userId].push(imInfo);
        }
        else {
            let msgList: Array<BaseIMInfo> = new Array<BaseIMInfo>();
            msgList.push(imInfo);
            this.model.unreadMsgDic.add(imInfo.userId, msgList);
        }
    }

    /**
     * 请求最近联系人信息返回
     */
    private __requestFriendInfoHandler(orientation: number, pInfo: FriendItemCellInfo) {
        if (orientation != RequestInfoRientation.RECENT_CONTACT) {
            return;
        }
        let thane: FriendItemCellInfo = pInfo;
        thane.relation = RelationType.RECENT_CONTACT;
        thane.groupId = FriendGroupId.RECENT_CONTACT;
        if (this.friendManager.friendList[thane.userId]) {
            thane.friendGp = (this.friendManager.friendList[thane.userId] as FriendItemCellInfo).friendGp;
            thane.friendGrade = (this.friendManager.friendList[thane.userId] as FriendItemCellInfo).friendGrade;
        }
        this.friendManager.addPrivatePerson(thane, true);
        if (this._tempMsgDic[thane.userId]) {
            let msgList: Array<BaseIMInfo> = this._tempMsgDic[thane.userId];
            for (const key in msgList) {
                if (Object.prototype.hasOwnProperty.call(msgList, key)) {
                    const msg = msgList[key];
                    this.handleIMInfo(msg);
                }
            }
            this.cleanMsgListByIdAndType(thane.userId, IMModel.MSG_DIC_TEMP);
        }
    }

    private setLeaveIMState() {
        let leaveState: IMStateInfo = this.model.stateList[StateType.LEAVE];
        if (leaveState) {
            this.sendChangeIMState(leaveState.id, "");
        }
    }

    private setOnlineIMState() {
        let onlineState: IMStateInfo = this.model.stateList[StateType.ONLINE];
        if (onlineState) {
            this.sendChangeIMState(onlineState.id, "");
        }
    }

    public dispatchFrameRemoveEvent() {
        this.dispatchEvent(IMFrameEvent.REMOVE);
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get friendManager(): FriendManager {
        return FriendManager.getInstance();
    }

    private get playerManager(): PlayerManager {
        return PlayerManager.Instance;
    }


    ////////////////////////////////////////////////////////////////////////////////  公开方法
    /**
     *创建IM聊天（请统一调用此方法）
     * @param data  聊天对象
     */
    public createIMFrame(data: ThaneInfo) {
        if (data) {
            // FrameControllerManager.Instance.friendControler.startFrameByType(FriendFrameType.IM_FRAME, data);
        }
        else {
            Logger.error("点击聊天没反映");
        }
    }

    /**
     *从列表中移除IM聊天（请统一调用此方法）
     * @param userId
     */
    public removeIMFrame(userId: number) {
        if (this.model.openIMFrameDic[userId]) {
            let frame = this.model.openIMFrameDic[userId];
            this.model.openIMFrameDic.del(userId);
            if (frame) {
                frame['needDispose'] = true;
                frame.dispose();
                frame = null;
            }
        }
    }

    /**
     * 显示的IM聊天窗数量
     */
    public get showIMFrameNum(): number {
        let count: number = 0;
        for (const key in this.model.openIMFrameDic) {
            if (Object.prototype.hasOwnProperty.call(this.model.openIMFrameDic, key)) {
                const frame = this.model.openIMFrameDic[key];
                if (frame.parent) {
                    count++;
                }
            }
        }
        return count;
    }

    private _msgBox: any;

    /**
     * 创建消息盒子（没有需要显示的消息则不创建, 返回null）
     */
    public createIMMsgBox(): any {
        this.removeIMMsgBox();
        // if (this.model.msgBoxList.length > 0) {
        //     this._msgBox = new IMMsgBoxView();
        //     return this._msgBox;
        // }
        return null;
    }

    /**
     * 移除消息盒子
     */
    public removeIMMsgBox() {
        if (this._msgBox) {
            if (this._msgBox.parent) {
                this._msgBox.parent.removeChild(this._msgBox);
            }
            this._msgBox.dispose();
            this._msgBox = null;
        }
    }

    /**
     *通过用户ID和列表类型清除信息
     * @param userId  用户ID
     * @param type  信息列表类型（参看IMModel的MSG_DIC_字段）
     */
    public cleanMsgListByIdAndType(userId: number, type: number) {
        let tempList: Array<BaseIMInfo>;
        switch (type) {
            case IMModel.MSG_DIC_UNREAD:
                if (this.model.unreadMsgDic[userId]) {
                    tempList = this.model.unreadMsgDic[userId];
                    while (tempList.length > 0) {
                        tempList.pop();
                    }
                    tempList = null;
                    this.model.unreadMsgDic.del(userId);
                }
                else {
                    this.model.unreadMsgDic.del(userId);
                }
                break;
            case IMModel.MSG_DIC_TEMP:
                if (this._tempMsgDic[userId]) {
                    tempList = this._tempMsgDic[userId];
                    while (tempList.length > 0) {
                        tempList.pop();
                    }
                    tempList = null;
                    this._tempMsgDic.del(userId);
                }
                else {
                    this._tempMsgDic.del(userId);
                }
                break;
        }
        SharedManager.Instance.privacyMsgCount = this.model.unreadMsgDic.getList().length;
        this.friendBtnShining = true;
        this.dispatchEvent(IMEvent.MSG_LIST_DEL);
    }

    /**
     *保存IM信息到缓存
     * @param msg
     */
    public saveMsgCache(msg: BaseIMInfo) {
        let id: number = (this.playerManager.currentPlayerModel.playerInfo.userId == msg.userId ? msg.toId : msg.userId);
        if (this.model.imHistoryDic[id]) {
            this.model.imHistoryDic[id].push(msg);
        }
        else {
            let msgList: Array<BaseIMInfo> = new Array<BaseIMInfo>();
            msgList.push(msg);
            this.model.imHistoryDic[id] = msgList;
        }
        // SharedManager.Instance.saveIMHistory();
    }

    /**
     *得到好友信息（包括最近联系人）, 没有返回null
     * @param userId 用户ID
     * @return
     */
    public getFriendInfo(userId: number): FriendItemCellInfo {
        let info = this.friendManager.friendList[userId];
        if (!info) {
            info = this.friendManager.getRecentInfoById(userId);
        }
        return info;
    }

    private _friendBtnShining: boolean;
    /**
     * 主工具条好友按钮是否闪动
     */
    public get friendBtnShining(): boolean {
        return this._friendBtnShining;
    }


    /**
     *设置主工具条好友按钮闪动
     */
    public set friendBtnShining(value: boolean) {
        // let friendBtn: MovieButton = MainToolBar.Instance.getButtnByType(MainToolBar.FRIEND_BUTTON);
        // if (friendBtn) {
        //     if (value && this.model.isOpenFriendBtnShine && this.model.unreadMsgDic.keys.length > 0) {
        //         friendBtn.isPlaying = true;
        //         friendBtn.playEffect();
        //         this._friendBtnShining = true;
        //         this.dispatchEvent(IMEvent.MSGBOX_SHINING_UPDATE);
        //     }
        //     else {
        //         friendBtn.isPlaying = false;
        //         friendBtn.stopEffect();
        //         this._friendBtnShining = false;
        //         this.dispatchEvent(IMEvent.MSGBOX_SHINING_UPDATE);
        //     }
        // }
    }

    /**
     *通过聊天对象ID得到聊天记录列表, 没有返回null
     * @param userId  聊天对象ID
     */
    public getIMHistoryList(userId: number): Array<BaseIMInfo> {
        return this.model.imHistoryDic[userId];
    }

    /**
     *得到聊天记录总页数
     * @param userId  聊天对象ID
     */
    public getIMHistoryTotalPages(userId: number): number {
        let historyList: Array<BaseIMInfo> = this.getIMHistoryList(userId);
        if (historyList) {
            return Math.ceil(historyList.length / IMModel.MSGS_PER_PAGE);
        }
        return 0;
    }

    /**
    * 收到一条语音
    * @param userId 
    * @param chatData 
    */
    addVoice(chatData: ChatData) {
        let imInfo: BaseIMInfo = new BaseIMInfo();
        imInfo.userId = chatData.uid;
        imInfo.nickName = chatData.senderName;
        imInfo.userLevel = chatData.userLevel;
        imInfo.headId = chatData.headId;
        imInfo.frameId = chatData.frameId;
        imInfo.job = chatData.job;
        imInfo.serverId = chatData.serverId;
        imInfo.voiceTime = chatData.voiceTime;
        imInfo.sendTime = chatData.curTime;
        imInfo.toId = chatData.receiveId;
        imInfo.isRead = chatData.isRead;
        let key = 0;
        let isself = chatData.uid == PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        if (isself) {
            key = chatData.receiveId;
        } else {
            key = chatData.uid;
        }
        this.updateUnreadMsg(imInfo);

        if (this.model.imHistoryDic[key]) {
            this.model.imHistoryDic[key].push(imInfo);

        } else {
            let msgList: Array<BaseIMInfo> = new Array<BaseIMInfo>();
            msgList.push(imInfo);
            this.model.imHistoryDic[key] = msgList;
        }

        this.dispatchEvent(IMEvent.RECEIVE_VOICE_MSG, chatData);
        let info: FriendItemCellInfo = this.friendManager.checkIsExistFriendInfo(key);
        if (!info) {
            this.playerManager.sendRequestSimpleAndSnsInfo(key, RequestInfoRientation.RECENT_CONTACT);
        }
        else {
            this.friendManager.addPrivatePerson(info);
        }

    }

    /**
     * 语音已读后更新状态
     */
    updateVoiceStatus(key: any, serverId: any) {
        if (this.model.imHistoryDic[key]) {
            let msgList = this.model.imHistoryDic[key];
            msgList.forEach(element => {
                if (element.serverId == serverId) {
                    element.isRead = true;
                    return;
                }
            });
        }
    }

    /**
     *得到当前页码的聊天记录列表, 没有返回null
     * @param userId  聊天对象ID
     * @param curPage  当前页码
     */
    public getCurPageIMHistoryList(userId: number, curPage: number): Array<BaseIMInfo> {
        let historyList: Array<BaseIMInfo> = this.getIMHistoryList(userId);
        if (historyList) {
            let totalPages: number = Math.ceil(historyList.length / IMModel.MSGS_PER_PAGE);
            if (curPage > 0 && curPage <= totalPages) {
                let endIdx: number = (curPage * IMModel.MSGS_PER_PAGE > historyList.length) ? historyList.length : curPage * IMModel.MSGS_PER_PAGE;
                return historyList.slice((curPage - 1) * IMModel.MSGS_PER_PAGE, endIdx);
            }
        }
        return null;
    }


    ////////////////////////////////////////////////////////////////////////////////  协议发送
    /**
     *IM发送信息
     * @param targetId  对方ID
     * @param chatMsg  聊天内容
     * @param date  发送时间
     */
    public sendIMMsg(targetId: number, chatMsg: string, date: Date = null) {
        let msg: ChatFriendMsg = new ChatFriendMsg();
        msg.fromId = this.playerInfo.userId;
        msg.fromNick = this.playerInfo.nickName;
        msg.toId = targetId;
        msg.encodeMsg = chatMsg;
        msg.fight = this.playerInfo.fightingCapacity;
        SocketManager.Instance.send(C2SProtocol.CH_PRIVATE_CHAT, msg);
    }

    /**
     *发送改变聊天状态
     * @param stateId  状态ID
     * @param replyContent  自动回复内容
     */
    public sendChangeIMState(stateId: number, replyContent: string) {
        if (!LoginManager.Instance.hasLogin)
            return;
        let msg: ChatStateMsg = new ChatStateMsg();
        msg.chatState = stateId;
        msg.replayStr = replyContent;
        SocketManager.Instance.send(C2SProtocol.CH_EXCHANGE_STATE, msg);
    }

    //发送翻译聊天
    public sendTranslateMsg(chatData: ChatData) {
        if (chatData.translateing) return;
        // let index = ChatManager.Instance.model.getIndexByChatData(chatData);
        let index = chatData.hashCode;
        if (index == -1) {
            Logger.error("聊天翻译错误,未能找到聊天数据");
            return;
        }
        chatData.translateing = true;
        let translateReq = new TranslateReqMsg();
        translateReq.reqid = index + "";
        translateReq.content = chatData.htmlText;
        // translateReq.targetLanguage = "en";//可以不填,服务端会取得设置语言
        SocketManager.Instance.send(C2SProtocol.C_TRANSLATE_TEXT, translateReq);
    }

    //返回翻译聊天
    private _receiveTranslate(pkg: PackageIn) {
        let translateRespMsg = pkg.readBody(TranslateRespMsg) as TranslateRespMsg;
        if (translateRespMsg.code != 200) {
            Logger.error("聊天翻译异常,Code:", translateRespMsg.code, ", Msg:", translateRespMsg.errorMsg);
        }
        //翻译状态 -1:异常(返回原文) 1: 精准 2: 原语言与目标语言一致(返回原文) 3:获取原语言失败(返回原文) 不做处理。
        // if(translateRespMsg.accuracy)
        // let index = +translateRespMsg.reqid;
        // let chatData = ChatManager.Instance.model.allChats[index];
        // if (!chatData) return;
        // chatData.translateLangKey = translateRespMsg.tartgetLanguage;
        // chatData.translateMsg = ChatHelper.parseTrMsg(translateRespMsg.content);

        if (!ChatManager.Instance.model.setTranslate(translateRespMsg)) {
            Logger.error("聊天翻译错误,未能找到聊天数据");
            return;
        }
        this.dispatchEvent(IMEvent.TRANSLATE_MSG);
    }


    public sendTranslateSetting(langKey: string) {
        SocketSendManager.Instance.reqPlayerSetting(OptType.chat_translate, 1, langKey);
    }

    private __receiveTranslateSetting() {
        // console.error("receiveTranslateSetting=> ", PlayerManager.Instance.currentPlayerModel.playerInfo.chatTranslateKey)
        // let allChats = ChatManager.Instance.model.allChats;
        // for (let chatData of allChats) {
        //     chatData.translateMsg = "";
        // }
        // this.dispatchEvent(IMEvent.TRANSLATE_MSG);
    }

}