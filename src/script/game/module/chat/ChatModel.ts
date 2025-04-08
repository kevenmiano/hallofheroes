import { ChatEvent } from "../../constant/event/NotificationEvent";
import { ChatChannel } from "../../datas/ChatChannel";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ConsortiaGroupChatModel } from "../groupchat/ConsortiaGroupChatModel";
import ChatData from "./data/ChatData";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import TranslateRespMsg = com.road.yishi.proto.translate.TranslateRespMsg;
import ChatHelper from "../../utils/ChatHelper";
import IMManager from "../../manager/IMManager";
import IMModel from "../../datas/model/IMModel";
import BaseIMInfo from "../../datas/BaseIMInfo";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import UIManager from "../../../core/ui/UIManager";
import ChatWnd from "./ChatWnd";

export default class ChatModel {
    public allChats: Array<ChatData>;
    public allSendChats: Array<ChatData>;
    public bigBugleList: Array<ChatData>;
    public noticeList: Array<ChatData>;
    public crossBugleList: Array<ChatData>;
    private privateChats: Array<any>;//私聊

    public sendIndex: number = 0;
    private _currentOutChannel: number = ChatChannel.ALL;
    public currentInChannel: number = ChatChannel.CURRENT;

    public currentBigBugleData: ChatData;
    public currentCrossBugleData: ChatData;
    private _filterChannels: Array<number> = [];

    private chatProtocalTime: Array<number>;
    private _protocolCount: number = 0;

    private _privateData: ThaneInfo;//当前私聊对象
    public showChatViewFlag: boolean = false;//展示聊天信息框
    public showChatBugleViewFlag: boolean = false;//展示大喇叭信息框

    public get privateData(): ThaneInfo {
        return this._privateData;
    }

    public set privateData(value: ThaneInfo) {
        this._privateData = value;
        NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_SELECTED_PRIVATECHAT, value);
    }

    public get protocalId(): number {
        return ++this._protocolCount;
    }

    public getProtocolTimeByID(id: number): number {
        return this.chatProtocalTime[id];
    }
    public addSendProtocol(id: number, time: number) {
        this.chatProtocalTime[id] = time;
    }

    public removeReceiveProtocol(id: number) {
        delete this.chatProtocalTime[id];
    }

    public get filterChannels(): Array<number> {
        return this._filterChannels;
    }

    public static MAX_CHAT_COUNT: number = 2000;

    constructor() {
        this.allChats = [];
        this.allSendChats = [];
        this.bigBugleList = [];
        this.noticeList = [];
        this.crossBugleList = [];
        this.chatProtocalTime = [];

    }

    public get currentOutChannel(): number {
        return this._currentOutChannel;
    }

    public set currentOutChannel(value: number) {
        this._currentOutChannel = value;
        switch (this._currentOutChannel) {
            case ChatChannel.ALL:
                this._filterChannels = [
                    ChatChannel.ALL,                // 显示所有
                    ChatChannel.BIGBUGLE,           // 本区大喇叭 
                    ChatChannel.SYSTEM,             // 系统
                    ChatChannel.INFO,               // 信息
                    ChatChannel.CONSORTIA,          // 公会
                    ChatChannel.TEAM,               // 组队
                    ChatChannel.ALERT,              // 屏幕中間顯示 
                    ChatChannel.CURRENT,            // 当前
                    ChatChannel.WORLD,              // 小喇叭
                    ChatChannel.SYS_ALERT,          // 系统广播
                    ChatChannel.NOTICE,				// 公告
                    ChatChannel.CROSS_BIGBUGLE,     // 跨区大喇叭
                    ChatChannel.GOLD_BIGBUGLE,      // 黄金神树大喇叭
                ];
                break
            case ChatChannel.WORLD:
                this._filterChannels = [ChatChannel.WORLD];
                break;
            case ChatChannel.SYSTEM:
                this._filterChannels = [ChatChannel.SYSTEM, ChatChannel.SYS_ALERT, ChatChannel.INFO, ChatChannel.NOTICE];
                break;
            case ChatChannel.TEAM:
                this._filterChannels = [ChatChannel.TEAM];
                break;
            case ChatChannel.CONSORTIA:
                this._filterChannels = [ChatChannel.CONSORTIA];
                break;
            case ChatChannel.INFO:
                this._filterChannels = [ChatChannel.INFO];
                break;
            case ChatChannel.NOTICE:
                this._filterChannels = [ChatChannel.NOTICE];
                break;
            case ChatChannel.PERSONAL:
                this._filterChannels = [ChatChannel.PERSONAL];
                break;
            case ChatChannel.BIGBUGLE:
                this._filterChannels = [ChatChannel.BIGBUGLE];
                break;
        }
        NotificationManager.Instance.sendNotification(ChatEvent.CHAT_CHANNEL_CHANGE);
    }

    public addChat(chatData: ChatData) {
        if (chatData.channel != ChatChannel.BATTLE_CHAT) {
            this.allChats.push(chatData);
            // if(chatData.channel == ChatChannel.CONSORTIA){
            //     SharedManager.Instance.consortiaMsgCount++;
            // }else  if(chatData.channel == ChatChannel.TEAM){
            //     SharedManager.Instance.teamMsgCount++;
            // }
            if (this.allChats.length > ChatModel.MAX_CHAT_COUNT) {
                this.allChats.shift();
            }
        }
        NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_CHAT_VIEW, chatData);

        //groupChatData.commit 方法是空的, 所以暂时先注释 以免被误导耽误时间
        // if (chatData.channel == ChatChannel.CONSORTIA) {
        //     var groupChatData: ConsortiaGroupChatData = new ConsortiaGroupChatData();
        //     groupChatData.channel = chatData.channel;
        //     groupChatData.userType = chatData.userType;
        //     groupChatData.serverName = chatData.serverName;
        //     groupChatData.type = chatData.type;
        //     groupChatData.consortiaName = chatData.consortiaName;
        //     groupChatData.is_centerTip = chatData.is_centerTip;
        //     groupChatData.is_bigTip = chatData.is_bigTip;
        //     groupChatData.bigBugleType = chatData.bigBugleType;
        //     groupChatData.vipGrade = chatData.vipGrade;
        //     groupChatData.uid = chatData.uid;
        //     groupChatData.consortiaId = chatData.consortiaId;
        //     groupChatData.senderName = chatData.senderName;
        //     groupChatData.receiverName = chatData.receiverName;
        //     groupChatData.itemList = chatData.itemList;
        //     groupChatData.starList = chatData.starList;
        //     groupChatData.cardList = chatData.cardList;
        //     groupChatData.msg = chatData.msg;
        //     groupChatData.commit(this.player.userId);
        //     // this.groupChatModel.addChat(groupChatData);
        // }
    }

    /**添加私聊<不重复添加> */
    public addPrivateChat(chatInfo) {
        if (!this.hasChatInfo(chatInfo)) {
            this.privateChats.push(chatInfo);
        }
    }

    public hasChatInfo(chatInfo): boolean {
        if (!this.privateChats) {
            this.privateChats = [];
        }
        for (let key in this.privateChats) {
            if (Object.prototype.hasOwnProperty.call(this.privateChats, key)) {
                let element = this.privateChats[key];
                if (element.userId == chatInfo.userId) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 删除私聊
     * @param chatInfo 
     * @returns 
     */
    public removePrivateChat(chatInfo) {
        if (this.hasChatInfo(chatInfo)) {
            if (chatInfo) {
                let index = this.privateChats.indexOf(chatInfo);
                this.privateChats.splice(index, 1);
            }
        }
    }

    private get player(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get groupChatModel(): ConsortiaGroupChatModel {
        return null;
        // return ConsortiaManager.Instance.model;
    }

    public addBigBugleData(chatdata: ChatData) {
        this.bigBugleList.push(chatdata);
        NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_BIGBUGLE_VIEW, chatdata);
    }
    /**
     * 系统公告消息
     * @param chatdata 
     */
    public addNoticeData(chatdata: ChatData) {
        this.noticeList.push(chatdata);
        NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_NOTICE_VIEW, chatdata);
    }

    public addCrossBugleData(chatdata: ChatData) {
        this.crossBugleList.push(chatdata);
        NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_BIGBUGLE_VIEW, chatdata);
    }

    public getChatsByOutputChannel(): Array<ChatData> {
        var list: Array<ChatData> = [];
        var len: number = this.allChats.length;
        for (var i: number = 0; i < len; i++) {
            if (this._filterChannels.indexOf(this.allChats[i].channel) >= 0)
                list.push(this.allChats[i]);
        }
        return list;
    }

    public getIndexByChatData(chatData: ChatData) {
        let allChats = this.allChats;
        for (let i = 0, length = allChats.length; i < length; i++) {
            if (chatData == allChats[i]) return i;
        }
        return -1;
    }

    //设置翻译信息
    public setTranslate(msg: TranslateRespMsg) {
        let allChats = this.allChats;

        let translateMsg = ChatHelper.parseTrMsg(msg.content);
        let translateLangKey = msg.tartgetLanguage;
        //公共聊天
        for (let i = 0, length = allChats.length; i < length; i++) {
            if (msg.reqid == allChats[i].hashCode + "") {
                allChats[i].translateLangKey = translateLangKey;
                allChats[i].translateMsg = translateMsg
                return true;
            }
        }

        //查找 私聊
        let findPrivate = false

        //先查找聊天窗口
        if (FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {
            let wnd: ChatWnd = UIManager.Instance.FindWind(EmWindow.ChatWnd);
            if (wnd) {
                let privates = wnd.getchatPrivate();
                for (let p of privates) {
                    if (p.hashCode + "" == msg.reqid) {
                        p.translateLangKey = translateLangKey;
                        p.translateMsg = translateMsg;
                        findPrivate = true;
                        break;
                    }
                }
            }

        }

        //再修改历史记录，第二次打开，私聊从这里取数据。
        let dic = IMManager.Instance.model.imHistoryDic;
        let values = dic.values as BaseIMInfo[][];
        for (let vs of values) {
            for (let v of vs) {
                if (v.hashCode + "" == msg.reqid) {
                    v.translateLangKey = translateLangKey;
                    v.translateMsg = translateMsg;
                    return true;
                }
            }
        }

        return findPrivate;   
    }

    public clean() {
        for (const key in this.allChats) {
            if (Object.prototype.hasOwnProperty.call(this.allChats, key)) {
                let data: ChatData = this.allChats[key];
                data.dispose();
            }
        }

        this.allChats.splice(0, this.allChats.length);
        NotificationManager.Instance.sendNotification(ChatEvent.CHAT_CHANNEL_CHANGE);
    }
}

// sq        阿尔巴尼亚语
// ar        阿拉伯语
// am        阿姆哈拉语
// az        阿塞拜疆语
// ga        爱尔兰语
// et        爱沙尼亚语
// or        奥里亚语(奥里亚文)
// eu        巴斯克语
// be        白俄罗斯语
// bg        保加利亚语
// is        冰岛语
// pl        波兰语
// bs        波斯尼亚语
// fa        波斯语
// af        布尔语(南非荷兰语)
// tt        鞑靼语
// da        丹麦语
// de        德语
// ru        俄语
// fr        法语
// tl        菲律宾语
// fi        芬兰语
// fy        弗里西语
// km        高棉语
// ka        格鲁吉亚语
// gu        古吉拉特语
// kk        哈萨克语
// ht        海地克里奥尔语
// ko        韩语
// ha        豪萨语
// nl        荷兰语
// ky        吉尔吉斯语
// gl        加利西亚语
// ca        加泰罗尼亚语
// cs        捷克语
// kn        卡纳达语
// co        科西嘉语
// hr        克罗地亚语
// ku        库尔德语
// la        拉丁语
// lv        拉脱维亚语
// lo        老挝语
// lt        立陶宛语
// lb        卢森堡语
// rw        卢旺达语
// ro        罗马尼亚语
// mg        马尔加什语
// mt        马耳他语
// mr        马拉地语
// ml        马拉雅拉姆语
// ms        马来语
// mk        马其顿语
// mi        毛利语
// mn        蒙古语
// bn        孟加拉语
// my        缅甸语
// hmn        苗语
// xh        南非科萨语
// zu        南非祖鲁语
// ne        尼泊尔语
// no        挪威语
// pa        旁遮普语
// pt        葡萄牙语
// ps        普什图语
// ny        齐切瓦语
// ja        日语
// sv        瑞典语
// sm        萨摩亚语
// sr        塞尔维亚语
// st        塞索托语
// si        僧伽罗语
// eo        世界语
// sk        斯洛伐克语
// sl        斯洛文尼亚语
// sw        斯瓦希里语
// gd        苏格兰盖尔语
// ceb        宿务语
// so        索马里语
// tg        塔吉克语
// te        泰卢固语
// ta        泰米尔语
// th        泰语
// tr        土耳其语
// tk        土库曼语
// cy        威尔士语
// ug        维吾尔语
// ur        乌尔都语
// uk        乌克兰语
// uz        乌兹别克语
// es        西班牙语
// iw        希伯来语
// el        希腊语
// haw        夏威夷语
// sd        信德语
// hu        匈牙利语
// sn        修纳语
// hy        亚美尼亚语
// ig        伊博语
// it        意大利语
// yi        意第绪语
// hi        印地语
// su        印尼巽他语
// id        印尼语
// jw        印尼爪哇语
// en        英语
// yo        约鲁巴语
// vi        越南语
// zh-CN        中文
// zh-TW        中文(繁体)
// zh-CN        中文(简体)]

