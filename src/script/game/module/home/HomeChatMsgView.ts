import FUI_HomeChatMsgView from "../../../../fui/Base/FUI_HomeChatMsgView";
import { ChatEvent, SceneEvent } from "../../constant/event/NotificationEvent";
import { ChatManager } from "../../manager/ChatManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import ChatData from "../chat/data/ChatData";
import ChatMessageCell from "./ChatMessageCell";

/**
* @author:pzlricky
* @data: 2021-05-11 20:56
* @description 主界面聊天信息
*/
export default class HomeChatMsgView extends FUI_HomeChatMsgView {

    //@ts-ignore
    public messageCell0: ChatMessageCell;
    //@ts-ignore
    public messageCell1: ChatMessageCell;

    private items: Array<ChatMessageCell> = [];

    private lastMsgCount: number = 0;

    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        this.addEvent();
        this.items = [this.messageCell0, this.messageCell1];
        this.refreshChatData();
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.refreshChatData, this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.refreshChatData, this);
    }

    refreshChatScene() {
        let chatAllMessages = ChatManager.Instance.model.allChats;
        let chatCount = chatAllMessages.length;
        if (this.lastMsgCount == chatCount) {
            this.refreshMessageActive();
            return;
        }
        this.refreshChatData();
    }

    private currShowMessages: Array<ChatData> = [];
    refreshChatData() {
        let chatAllMessages = ChatManager.Instance.model.allChats;
        let chatCount = chatAllMessages.length;
        let tempMessages: Array<ChatData> = [];
        for (let index = chatCount - 1; index >= 0; index--) {
            let data = chatAllMessages[index];
            if (tempMessages.length >= 2)
                break;
            if (data)
                tempMessages.push(data);
        }
        tempMessages.reverse();
        //显示最新的两条消息
        this.currShowMessages = tempMessages;
        for (let index = 0; index < this.items.length; index++) {
            let elementItem = this.items[index];
            let elementData = this.currShowMessages[index];
            if (elementData) {
                elementItem.visible = true;
                elementItem.itemdata = elementData;
            } else {
                elementItem.visible = false;
            }
        }
        this.lastMsgCount = chatCount;
        this.refreshMessageActive();
    }

    /**聊天消息数量 */
    private get messageCount(): number {
        let chatAllMessages = ChatManager.Instance.model.allChats;
        let chatCount = chatAllMessages.length;
        return chatCount;
    }

    // 处于天空之城时
    // 大喇叭功能: 无消息时, 背景框隐藏, 有消息时常显
    // 聊天框功能: 压缩为两行

    // 处于副本时
    // 大喇叭功能: 无消息时, 背景框隐藏, 有消息时显示10秒钟, 再次隐藏
    // 聊天框功能: 压缩为两行, 无消息时, 背景框隐藏, 有消息时显示10秒钟, 再次隐藏
    private checkScene(): boolean {//副本场景特除处理
        return SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE;
    }

    /**检查当前场景是否可以展示公告 */
    private checkMsgCount(): boolean {
        if (this.checkScene()) {
            return this.messageCount > 0;
        } else {
            return false;
        }
    }

    /**刷新信息显示 */
    private refreshMessageActive() {
        Laya.timer.clearAll(this);
        if (this.checkMsgCount()) {
            this.visible = true;
            this.update();
            if (this.checkScene()) {
                Laya.timer.once(10000, this, this.onceCallHandler)
            }
        } else {
            this.visible = this.messageCount > 0 && !this.checkScene();
            this.update();
        }
    }

    private onceCallHandler() {
        Laya.timer.clearAll(this);
        this.visible = false;
        this.update();
    }

    private update(){
        ChatManager.Instance.model.showChatViewFlag = this.visible;
        NotificationManager.Instance.dispatchEvent(ChatEvent.UPDATE_CHAT_VIEW_VISIBLE,this.visible);
    }

    /**渲染Tab列表 */
    private renderChannelListItem(index: number, item: ChatMessageCell) {
        let itemData = this.currShowMessages[index];
        item.itemdata = itemData;
    }

    public dispose() {
        Laya.timer.clearAll(this);
        this.visible = false;
        ChatManager.Instance.model.showChatViewFlag = this.visible;
        this.removeEvent();
    }

}