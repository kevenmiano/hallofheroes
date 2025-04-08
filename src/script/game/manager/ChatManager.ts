// @ts-nocheck
import Logger from '../../core/logger/Logger';
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from '../../core/net/SocketManager';
import { ChatEvent, IMEvent, NotificationEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import UserType from "../constant/UserType";
import { ChatChannel } from "../datas/ChatChannel";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import ChatModel from "../module/chat/ChatModel";
import ChatData from "../module/chat/data/ChatData";
import { MessageBoxType } from '../module/setting/SettingData';
import { ArmyManager } from "./ArmyManager";
import ChatSocketOutManager from "./ChatSocketOutManager";
import { MessageTipManager } from "./MessageTipManager";
import { NotificationManager } from "./NotificationManager";
import { PathManager } from './PathManager';
import { PlayerManager } from "./PlayerManager";

import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
import ChatChannelMsg = com.road.yishi.proto.chat.ChatChannelMsg;
import CrossBigBugleMsg = com.road.yishi.proto.cross.CrossBigBugleMsg;
import LangManager from "../../core/lang/LangManager";
import IMManager from './IMManager';
import BaseIMInfo from '../datas/BaseIMInfo';
import Utils from '../../core/utils/Utils';

// 表情匹配正则, 如果表情数量有变动, 要改这个
const EMOJI_REG = /(#)(0[0-9]|1[0-9]|2[0-9]|3[0-4])/g;
const EMOJI_REG_AFTER_NORMAL = /(\[)(0[0-9]|1[0-9]|2[0-9]|3[0-4])(\])/g;

export class ChatManager {
    private static _Instance: ChatManager;
    public static get Instance(): ChatManager {
        if (!ChatManager._Instance) ChatManager._Instance = new ChatManager();
        return ChatManager._Instance;
    }

    private _model: ChatModel;
    public get model(): ChatModel {
        if (!this._model) {
            this._model = new ChatModel();
        }
        return this._model;
    }

    private _chatPrivateMessages: Array<ChatData> = []; /**私聊消息 */


    public get chatPrivateMessages(): Array<ChatData> {
        return this._chatPrivateMessages
    }


    /**
     * 加载表情资源
     */
    loadEmojiAssets() {
        //表情资源预加载 否则会首次获取不到表情的宽高
        let emojiArr = [];
        let url = '';
        let count = PathManager.info.FACE_NUM;
        for (let i = 0; i < count; i++) {
            if (i < 10) {
                url = "res/game/face/face0" + i + ".png";
            } else {
                url = "res/game/face/face" + i + ".png";
            }
            emojiArr.push(url);
        }
        Laya.loader.create(emojiArr, Laya.Handler.create(this, function () {
            Logger.log('表情资源预加载完成');
        }))
    }


    public setup() {
        this._model = new ChatModel();
        ServerDataManager.listen(S2CProtocol.U_C_CROSS_BIGBUGLE, this, this.__crossBugleHandler);
        ServerDataManager.listen(S2CProtocol.U_CH_CHANNEL_CHA, this, this.__channelChatHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SMALL_BUGLE_FREE_COUNT, this, this.__samllBugleFreeCountHandler);
        NotificationManager.Instance.addEventListener(ChatEvent.ADD_CHAT, this.__addChatHandler, this);
        IMManager.Instance.addEventListener(IMEvent.RECEIVE_MSG, this.__receiveMsgHandler, this);
        IMManager.Instance.addEventListener(IMEvent.RECEIVE_VOICE_MSG, this.addVoiceItem, this);
    }

    private __receiveMsgHandler(msg: BaseIMInfo) {
        if (msg) {
            this._chatPrivateMessages.push(this.createMsgItem(msg));
            NotificationManager.Instance.dispatchEvent(ChatEvent.SHOW_NEW_MSG)
        }
    }

    private addVoiceItem(msg: ChatData) {
        this._chatPrivateMessages.push(msg);
        NotificationManager.Instance.dispatchEvent(ChatEvent.SHOW_NEW_MSG)
    }

    private createMsgItem(msg: BaseIMInfo): ChatData {
        if (!msg) return null;
        var chatData: ChatData = new ChatData();
        chatData.uid = msg.userId;
        chatData.serverId = msg.serverId;
        chatData.userLevel = msg.userLevel;
        chatData.senderName = msg.nickName;
        chatData.job = msg.job;
        chatData.headId = msg.headId;
        chatData.frameId = msg.frameId;
        chatData.msg = msg.msg;
        chatData.encodemsg = msg.msg;
        chatData.sendTime = msg.sendTime;
        chatData.voiceTime = msg.voiceTime;
        chatData.receiveId = msg.toId;
        chatData.isRead = msg.isRead;
        chatData.fight = msg.fight;
        if (msg.serverId) {
            chatData.serverId = msg.serverId;
        } else {
            chatData.msg = ChatManager.Instance.analyzeExpressionForIMChat(chatData.msg);
            chatData.commit();
        }

        return chatData;
    }


    private __crossBugleHandler(packageIn: PackageIn) {
        var msg: CrossBigBugleMsg = new CrossBigBugleMsg();
        msg = packageIn.readBody(CrossBigBugleMsg) as CrossBigBugleMsg;

        var chatData: ChatData = new ChatData();
        chatData.channel = ChatChannel.CROSS_BIGBUGLE;
        chatData.userType = UserType.NORMAL;
        chatData.uid = msg.userId;
        chatData.type = 0;
        chatData.bigBugleType = 4;
        chatData.serverName = msg.serverName;
        chatData.senderName = msg.nickName;
        chatData.isLookInfo = msg.isLookInfo;
        chatData.headId = msg.headId;
        chatData.msg = this.analyzeCross(msg.content);
        chatData.commit();
        Logger.log("收到跨服大喇叭    " + new Date().getTime() + this.analyzeCross(msg.content));
        this._model.addCrossBugleData(chatData);
    }

    private __samllBugleFreeCountHandler(pkg: PackageIn) {
        var msg: CampaignReqMsg = new CampaignReqMsg();
        msg = pkg.readBody(CampaignReqMsg) as CampaignReqMsg;
        ArmyManager.Instance.thane.beginChanges();
        ArmyManager.Instance.thane.smallBugleFreeCount = msg.paraInt1;
        ArmyManager.Instance.thane.commit();
    }

    private __channelChatHandler(pkg: PackageIn) {
        if (!ChatManager.Instance.model)
            return;
        let chatExtend1: number = ChatManager.Instance.model.getProtocolTimeByID(pkg.extend1)
        var interval: number = new Date().getTime() - chatExtend1 ? chatExtend1 : 0;
        if (interval >= 3) {
            Logger.warn("SLGSocketEvent.EVENT+AcceptProtocolType.U_CH_CHANNEL_CHA协议超时 3 秒以上");
        }
        this.model.removeReceiveProtocol(pkg.extend1);

        var msg: ChatChannelMsg = new ChatChannelMsg();
        msg = pkg.readBody(ChatChannelMsg) as ChatChannelMsg;
        var chatData: ChatData = new ChatData();
        // if (msg.job != 0 && msg.job != ThaneInfoHelper.getJob(ArmyManager.Instance.thane.job)) {
        //     return;
        // }
        chatData.appellId = msg.appellid;
        chatData.channel = msg.channel;
        chatData.userType = msg.userType;
        chatData.serverName = msg.serverName;
        chatData.headId = msg.headid;
        chatData.frameId = msg.frameId;
        chatData.userLevel = msg.level;
        chatData.type = msg.type;
        chatData.livingId = msg.otherId;
        chatData.consortiaName = msg.consortiaName;
        chatData.senderName = msg.name;
        chatData.receiverName = msg.receiveName;
        chatData.is_centerTip = msg.isCenterTip;
        // chatData.is_centerTip = true;
        chatData.is_bigTip = msg.isBigTip;
        chatData.bigBugleType = msg.bigBugleType;
        chatData.vipGrade = msg.vipGrade;
        chatData.vipType = 1;// msg.vipType; vip 紫钻还原
        chatData.encodemsg = msg.encodeMsg;//未解析数据
        chatData.job = msg.job;
        chatData.fight = msg.fight;
        if (msg.curTime) {
            let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
            let startDate: Date = Utils.formatTimeZone(Number(msg.curTime), zoneOffset); //时区同步
            chatData.curTime = startDate.getTime();
        }
        if (msg.otherId == this.playerInfo.userId) {
            Logger.warn("收到聊天协议    " + new Date().getTime() + this.analyzeExpression(msg));
        }
        if (chatData.channel != ChatChannel.INFO && chatData.channel != ChatChannel.SYSTEM) {
            chatData.uid = msg.otherId;
            chatData.consortiaId = msg.consortiaId;
            chatData.appellId = msg.appellid;
        }
        var vMsg: string = this.analyzeExpression(msg);
        var vIndexOf: number = vMsg.indexOf("http://");
        if (vIndexOf != -1 && msg.channel == ChatChannel.NOTICE) {
            chatData.msg = vMsg.substring(0, vIndexOf - 1);
            chatData.msgUrl = vMsg.substring(vIndexOf, vMsg.length);
        } else {
            chatData.msg = vMsg;
            chatData.msgUrl = "";

        }
        chatData.commit();
        if (chatData.channel == ChatChannel.NOTICE) {
            if (chatData.bigBugleType >= 1 && chatData.bigBugleType <=4) {//策划把系统公告显示从原来大喇叭里面分离出来
                this._model.addBigBugleData(chatData);
            } else {
                this._model.addNoticeData(chatData);
            }
            this._model.addChat(chatData);
            return;
        }
        else if (chatData.channel == ChatChannel.BIGBUGLE) {
            this._model.addBigBugleData(chatData);
            this._model.addChat(chatData);
        } else if (chatData.channel == ChatChannel.GOLD_BIGBUGLE) {
            chatData.senderName = LangManager.Instance.GetTranslation("chat.datas.getChatChannelName.ALERT");
            chatData.userType = UserType.NORMAL;
            this._model.addBigBugleData(chatData);
        } else if (chatData.bigBugleType != 5 && chatData.bigBugleType != 10) {
            this._model.addChat(chatData);
        }
        if (chatData.channel == ChatChannel.CONSORTIA) {
            NotificationManager.Instance.sendNotification(ChatEvent.CHAT_FROM_CONSORTIA, chatData);
        }
        if (chatData.is_bigTip) {
            MessageTipManager.Instance.show(chatData.htmlText);
            NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_BIGBUGLE_VIEW, chatData);
        }
        if (chatData.is_centerTip) {
            MessageTipManager.Instance.show(chatData.htmlText);
        }
        if (chatData.channel == ChatChannel.SYS_ALERT) {
            NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_BIGBUGLE_VIEW, chatData);
        }
    }

    /**表情解析 */
    private analyzeExpression(msg: ChatChannelMsg): string {
        var str: string = msg.encodeMsg.replace(/\<([^>]*)>*/g, "");
        if (str.search(EMOJI_REG) != -1) {
            str = msg.encodeMsg.replace(EMOJI_REG, "<a t='9' index='$2' name='$2'/>");
            return this.filterSpecialChar(str);
        }
        return this.filterSpecialChar(msg.encodeMsg);
    }

    private analyzeCross($str: string): string {
        var str: string = $str.replace(/\<([^>]*)>*/g, "");
        if (str.search(EMOJI_REG) != -1) {
            str = $str.replace(EMOJI_REG, "<a t='9' index='$2' name='$2'/>");
            return this.filterSpecialChar(str);
        }
        return this.filterSpecialChar($str);
    }

    public analyzeExpressionAfterNormal(msg: string): string {
        var str: string = msg.replace(EMOJI_REG_AFTER_NORMAL, "<a t='9' index='$2' name='$2'/>");
        return this.filterSpecialChar(str);
    }

    public analyzeExpressionForIMChat(msg: string): string {
        var str: string = msg.replace(EMOJI_REG, "<a t='9' index='$2' name='$2'/>");
        return this.filterSpecialChar(str);
    }

    private filterSpecialChar(str: string): string {//过滤特殊连字符为普通连字符, FTE解析此特殊连字符会引起flash player崩溃, 此字符实体名为&shy;
        return str.replace(/­/g, "-");
    }

    private __addChatHandler(evtData) {
        var chatData: ChatData = evtData as ChatData;
        this._model.addChat(chatData);
    }

    public chatNormal(msg: string, channel: number, chatToUseName: string = "", itemList: Array<any> = null, starList: Array<any> = null, cardList: Array<any> = null) {
        var chatData: ChatData = new ChatData();
        chatData.channel = channel;
        chatData.msg = msg;
        chatData.receiverName = chatToUseName;
        chatData.senderName = this.playerInfo.nickName;
        //Army
        chatData.headId = ArmyManager.Instance.thane.headId;
        chatData.itemList = itemList;
        chatData.starList = starList;
        chatData.cardList = cardList;
        chatData.fight = ArmyManager.Instance.thane.fightingCapacity;
        chatData.commit();
        this._model.allSendChats.push(chatData);
        this._model.sendIndex = this._model.allSendChats.length - 1;
        ChatSocketOutManager.sendChat(chatData);
    }

    public chatByCross(mess: string, itemList: Array<any>, starList: Array<any>, cardList: Array<any>) {
        var chatData: ChatData = new ChatData();
        chatData.msg = mess;
        chatData.channel = ChatChannel.CROSS_BIGBUGLE;
        chatData.headId = ArmyManager.Instance.thane.headId;
        chatData.itemList = itemList;
        chatData.starList = starList;
        chatData.cardList = cardList;
        chatData.commit();
        this._model.allSendChats.push(chatData);
        this._model.sendIndex = this._model.allSendChats.length - 1;
        ChatSocketOutManager.sendCrossChat(chatData);
    }
    public chatByBugle(mess: string, itemList: Array<any>, starList: Array<any>, cardList: Array<any>) {
        var chatData: ChatData = new ChatData();
        chatData.msg = mess;
        chatData.channel = ChatChannel.BIGBUGLE;
        chatData.headId = ArmyManager.Instance.thane.headId;
        chatData.itemList = itemList;
        chatData.starList = starList;
        chatData.cardList = cardList;
        chatData.commit();
        this._model.allSendChats.push(chatData);
        this._model.sendIndex = this._model.allSendChats.length - 1;
        ChatSocketOutManager.sendBugleChat(chatData);
    }

    public chatBySmallBugle(mess: string, itemList: Array<any>, starList: Array<any>, cardList: Array<any>) {
        var chatData: ChatData = new ChatData();
        chatData.msg = mess;
        chatData.headId = ArmyManager.Instance.thane.headId;
        chatData.itemList = itemList;
        chatData.starList = starList;
        chatData.cardList = cardList;
        chatData.channel = ChatChannel.WORLD;
        chatData.commit();
        ChatSocketOutManager.sendSmallBugleChat(chatData);
        this._model.allSendChats.push(chatData);
        this._model.sendIndex = this._model.allSendChats.length - 1;
    }

    /**
     * 战斗内发送聊天
     * @param channel 战斗内发送聊天
     * @param chatMsg 队内 1: 全局
     * @param type  队内 1: 全局
     * @param livingId 
     * @param battle_id  //战斗id
     */
    public sendBattleChat(channel: number, chatMsg: string, type: number, livingId: number, battle_id: string, fight: number = 0) {
        let msg: ChatChannelMsg = new ChatChannelMsg();
        msg.channel = channel;
        msg.type = type;
        msg.otherId = livingId;
        msg.encodeMsg = chatMsg;
        msg.battleId = battle_id;
        msg.fight = fight;
        SocketManager.Instance.send(C2SProtocol.B_BATTLE_CHAT, msg);
        NotificationManager.Instance.dispatchEvent(ChatEvent.HIDE_BATTLE_CHAT);

    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    //********//
    public getCurrentChatsByChannel(): Array<ChatData> {
        var arr: Array<ChatData> = new Array<ChatData>();
        var len: number = this._model.allChats.length;
        for (var i: number = 0; i < len; i++) {
            var data: ChatData = this._model.allChats[i];
            if (data.channel)
                arr.push(data);
        }
        return arr;
    }

    /**
     * 根据地图的MessageBoxType获取开关是否开启
     * @param msgType 
     * @returns 
     */
    public getSwitchState(msgType: number): boolean {
        let result: boolean = true;
        switch (msgType) {
            case MessageBoxType.SPACE:
                result = this.playerInfo.isOpenSettingType5;
                break;
            case MessageBoxType.OUTTERCITY:
                result = this.playerInfo.isOpenSettingType6;
                break;
            case MessageBoxType.CAMPAIGN:
                result = this.playerInfo.isOpenSettingType7;
                break;

            default:
                break;
        }
        return result;
    }
}