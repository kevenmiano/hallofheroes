/*
 * @Author: jeremy.xu
 * @Date: 2024-01-05 14:59:18
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-05 15:23:38
 * @Description: 
 */
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../core/utils/StringHelper";
import { BattleManager } from "../../battle/BattleManager";
import { BattleModel } from "../../battle/BattleModel";
import { ChatEvent } from "../../constant/event/NotificationEvent";
import { ChatChannel } from "../../datas/ChatChannel";
import { ArmyManager } from "../../manager/ArmyManager";
import { ChatManager } from "../../manager/ChatManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import ChatHelper from "../../utils/ChatHelper";
import ChatDebug from "../chat/ChatDebug";
import ShortCutInput from "./ui/ShortCutInput";
import ShortCutItem from "./ui/ShortCutItem";

export default class BattleShortCutWnd extends BaseWindow {
    protected resizeContent: boolean = true;
    private list1Data: Array<string>;
    private list2Data: Array<string>;
    private configArr1: Array<string>;
    private configArr2: Array<string>;
    private input: ShortCutInput;
    private group1: fgui.GGroup;
    private group2: fgui.GGroup;
    private list1: fgui.GList;
    private list2: fgui.GList;
    
    public OnInitWind() {
        super.OnInitWind()
        this.addEvent()
        this.initView()
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(ChatEvent.HIDE_BATTLE_CHAT, this.onHideBattleChat.bind(this), this);
    }

    private removeEvent() {
        NotificationManager.Instance.addEventListener(ChatEvent.HIDE_BATTLE_CHAT, this.onHideBattleChat.bind(this), this);
    }

    private onHideBattleChat() {
        this.hide()
    }

    private initView() {
        this.list1Data = [];
        this.list2Data = [];

        let svrData: string = '';
        let configStr: string = '';
        svrData = PlayerManager.Instance.currentPlayerModel.playerInfo.teamQChat;
        configStr = LangManager.Instance.GetTranslation('shortCut.inTeam');
        this.configArr1 = configStr.split('|');
        if (svrData.length > 0) {
            this.list1Data = svrData.split(',');
        }
        this.group1.visible = svrData.length > 0;
        svrData = PlayerManager.Instance.currentPlayerModel.playerInfo.battleQChat;
        configStr = LangManager.Instance.GetTranslation('shortCut.allTeam');
        this.configArr2 = configStr.split('|');
        if (svrData.length > 0) {
            this.list2Data = svrData.split(',');
        }
        this.group2.visible = this.battleModel.isShowGlobalShortCut;
        if (this.battleModel.isShowGlobalShortCut) {
            this.group2.visible = svrData.length > 0;
        }
        this.list1.setVirtual();
        this.list2.setVirtual();
        this.list1.itemRenderer = Laya.Handler.create(this, this.onRender1, null, false);
        this.list2.itemRenderer = Laya.Handler.create(this, this.onRender2, null, false);
        this.list1.numItems = this.list1Data.length;
        this.list2.numItems = this.list2Data.length;

        this.input.setInputText(ShortCutInput.NOT_SEND_MSG);
    }

    /**
     * 
     * @param index 
     * @param item 
     */
    private onRender1(index: number, item: ShortCutItem) {
        if (item) {
            let id = parseInt(this.list1Data[index]);
            item.setData(index, this.configArr1[id - 1], 0);
            item.txt_name.color = '#A9B1FF';
        }
    }
    /**
     * 
     * @param index 
     * @param item 
     */
    private onRender2(index: number, item: ShortCutItem) {
        if (item) {
            let id = parseInt(this.list2Data[index]);
            item.setData(index, this.configArr2[id - 1], 1);
        }
    }

    btnSendClick() {
        if (PlayerManager.Instance.currentPlayerModel.checkChatForbidIsOpen()) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("chat_forbiden_text"), null, true)
            return
        }

        let chatStr: string = this.input.getInputText();
        if (StringHelper.trim(chatStr) == '') {//空字符串不发送
            Logger.warn("不能发送空字符串");
            return;
        }

        if (ChatDebug.filter(chatStr)) {
            return;
        }
        chatStr = ChatHelper.parasMsgs(chatStr);

        let livingId = this.battleModel.selfHero.livingId;
        let fight = ArmyManager.Instance.thane.fightingCapacity;
        ChatManager.Instance.sendBattleChat(ChatChannel.BATTLE_CHAT, chatStr, 0, livingId, this.battleModel.battleId, fight);
        this.clearText();
    }

    clearText() {
        ShortCutInput.NOT_SEND_MSG = '';
        this.input.setInputText('');
    }
    
    protected OnClickModal() {
        this.hide()
    }

    protected get modelAlpha() {
        return 0
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }
    
    public dispose() {
        this.removeEvent()
        ShortCutInput.NOT_SEND_MSG = this.input.getInputText();
        super.dispose()
    }

}
