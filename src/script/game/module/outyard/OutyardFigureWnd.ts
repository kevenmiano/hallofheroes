// @ts-nocheck
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import Utils from "../../../core/utils/Utils";
import { EmWindow } from "../../constant/UIDefine";
import { ChatEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import { ChatManager } from "../../manager/ChatManager";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OutyardManager from "../../manager/OutyardManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ChatData from "../chat/data/ChatData";
import HomePrivate from "../home/HomePrivate";
import OutyardModel from "./OutyardModel";
import OutyardAttackInfo from "./data/OutyardAttackInfo";
import OutyardGuildInfo from "./data/OutyardGuildInfo";
import OutyardFigureMemItem from "./view/OutyardFigureMemItem";
import OutyardFigureStatusItem from "./view/OutyardFigureStatusItem";

import StackHeadSelfMsg = com.road.yishi.proto.stackhead.StackHeadSelfMsg;
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
import StackHeadAttackMsg = com.road.yishi.proto.stackhead.StackHeadAttackMsg;

/**
 * 入口主界面
 */
export default class OutyardFigureWnd extends BaseWindow {
    protected resizeContent: boolean = true;
    public attackPrencentTxt: fgui.GTextField;
    public defencePrencentTxt: fgui.GTextField;
    public powerValueTxt: fgui.GTextField;
    public blessBtn: fgui.GButton;
    public addPowerBtn: fgui.GButton;
    public noticeBtn: fgui.GButton;
    public memberBtn: fgui.GButton;
    public group1: fgui.GGroup;
    public memberList: fgui.GList;
    public noticeTxt: fgui.GRichTextField;
    public memberGroup: fgui.GGroup;
    private _maxLimit: number = 0;
    private _recoverSpeed: number = 0;
    private _usePoint: number = 0;
    private _memberListData: Array<OutyardGuildInfo> = [];
    private _config1: Array<any> = [];
    private _config2: Array<any> = [];
    private figureGroup: fgui.GGroup;
    public figure_1_2: OutyardFigureStatusItem;
    public figure_1_4: OutyardFigureStatusItem;
    public figure_1_3: OutyardFigureStatusItem;
    public figure_3_2: OutyardFigureStatusItem;
    public figure_3_4: OutyardFigureStatusItem;
    public figure_3_1: OutyardFigureStatusItem;
    public figure_2_1: OutyardFigureStatusItem;
    public figure_2_4: OutyardFigureStatusItem;
    public figure_2_3: OutyardFigureStatusItem;
    public figure_4_1: OutyardFigureStatusItem;
    public figure_4_2: OutyardFigureStatusItem;
    public figure_4_3: OutyardFigureStatusItem;
    public n0: fgui.GLabel;
    public recordBtn: fgui.GButton;
    public rewardBtn: fgui.GButton;
    private closeBtn: UIButton;
    private helpBtn: UIButton;
    private timeDescTxt: fgui.GTextField;
    private fightStatusGroup: fgui.GGroup;
    private chatCom: fgui.GComponent;
    private ChatBtn: UIButton;
    private homePrivate: HomePrivate;//私聊头像
    private chatPrivateMessages: Array<ChatData> = []; /**私聊消息 */
    private _privatePersonData: ChatData
    private timeGroup: fgui.GGroup;
    protected resizeFullContent: boolean = true;
    public OnInitWind() {
        this.setCenter();
        this.addEvent();
        this.initView();
        this.x = this.y = 0;
        BaseFguiCom.autoGenerate(this.chatCom, this)
        Resolution.addWidget(this.chatCom.displayObject)
        this.__updateInfoHandler([]);
    }

    private initView() {
        let config: Array<any> = ConfigInfoManager.Instance.getStackHeadActionPoint();
        let valueStr: string = config[0];
        this._maxLimit = parseInt(valueStr.split(",")[0]);
        this._recoverSpeed = parseInt(valueStr.split(",")[1]);
        this._usePoint = ConfigInfoManager.Instance.getStackHeadChargePoint();
        this._config1 = ConfigInfoManager.Instance.getStackHeadAttackBuff();
        this._config2 = ConfigInfoManager.Instance.getStackHeadDefenceBuff();
        this.timeDescTxt.text = this.outYardModel.getDescTxt();
        if (this.timeDescTxt.text == "") {
            this.timeGroup.visible = false;
        } else {
            this.timeGroup.visible = true;
        }
    }

    OnShowWind() {
        super.OnShowWind();
        OutyardManager.Instance.OperateOutyard(OutyardManager.OPEN_FRAME);
        this.setChatBtnVisible();
    }

    private addEvent() {
        this.blessBtn.onClick(this, this.blessBtnHandler);
        this.noticeBtn.onClick(this, this.noticeBtnHandler);
        this.memberBtn.onClick(this, this.memberBtnHander);
        this.addPowerBtn.onClick(this, this.addPowerBtnHandler);
        this.memberList.itemRenderer = Laya.Handler.create(this, this.renderMemberListItem, null, false);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_SELF_INFO, this.__selfInfoHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_STATE_INFO, this.__stateInfoHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_FULL_INFO, this.__refreshActorContain, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_UPDATE_INFO, this.__updateInfoHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.__openFrameHandler, this);
        Laya.timer.loop(60000, this, this.timerHandler);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_CLOSE_WND, this.OnHideWind, this);
        this.recordBtn.onClick(this, this.recordBtnHandler);
        this.rewardBtn.onClick(this, this.rewardBtnHandler);
        NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.setChatBtnVisible, this);
    }

    private removeEvent() {
        this.blessBtn.offClick(this, this.blessBtnHandler);
        this.noticeBtn.offClick(this, this.noticeBtnHandler);
        this.memberBtn.offClick(this, this.memberBtnHander);
        this.addPowerBtn.offClick(this, this.addPowerBtnHandler);
        Utils.clearGListHandle(this.memberList);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_SELF_INFO, this.__selfInfoHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_STATE_INFO, this.__stateInfoHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_FULL_INFO, this.__refreshActorContain, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_UPDATE_INFO, this.__updateInfoHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_OPEN_FRAME, this.__openFrameHandler, this);
        Laya.timer.clearAll(this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_CLOSE_WND, this.OnHideWind, this);
        this.recordBtn.offClick(this, this.recordBtnHandler);
        this.rewardBtn.offClick(this, this.rewardBtnHandler);
        NotificationManager.Instance.removeEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.setChatBtnVisible, this);
    }

    private setChatBtnVisible() {
        if ((ChatManager.Instance.model.bigBugleList && ChatManager.Instance.model.bigBugleList.length > 0)
            || (ChatManager.Instance.model.allChats && ChatManager.Instance.model.allChats.length > 0)) {
            this.ChatBtn.visible = false;
        } else {
            this.ChatBtn.visible = true;
        }
    }

    ChatBtnClick() {
        if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd))
            FrameCtrlManager.Instance.open(EmWindow.ChatWnd);
    }

    //战报
    private recordBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.OutyardBattleRecordWnd);
    }

    //奖励
    private rewardBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.OutyardRewardWnd);
    }

    private helpBtnClick() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("OutyardFigureWnd.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private timerHandler() {
        OutyardManager.Instance.OperateOutyard(OutyardManager.HEART);
        this.noticeTxt.text = this.outYardModel.getNextOpenStr();
        this.timeDescTxt.text = this.outYardModel.getDescTxt();
        if (this.timeDescTxt.text == "") {
            this.timeGroup.visible = false;
        } else {
            this.timeGroup.visible = true;
        }
        let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
        if (stateMsg.state == OutyardModel.FIGHTING) {
            this.fightStatusGroup.visible = true;
        } else {
            this.fightStatusGroup.visible = false;
        }
    }

    private __openFrameHandler() {
        let arr: Array<OutyardAttackInfo> = OutyardManager.Instance.attackArr;
        if (arr.length == 0) {
            this.figureGroup.visible = false;
        } else {
            this.figureGroup.visible = true;
        }
        var i: number;
        var attack: OutyardAttackInfo;
        var attackArr: Array<OutyardAttackInfo> = OutyardManager.Instance.attackArr;
        let toItem: OutyardFigureStatusItem;
        let fromeItem: OutyardFigureStatusItem;
        for (i = 0; i < attackArr.length; i++) {
            attack = attackArr[i] as OutyardAttackInfo;
            toItem = this["figure_" + attack.toPos + "_" + attack.fromPos];
            fromeItem = this["figure_" + attack.fromPos + "_" + attack.toPos];
            if (attack.totalCount > 0) {
                fromeItem.setPoint(toItem.x, toItem.y);
                fromeItem.setFromType(attack.fromPos);
                fromeItem.initCount(fromeItem.x, fromeItem.y, attack.totalCount);
            }
        }
    }

    private __updateInfoHandler(attackList: Array<StackHeadAttackMsg>) {
        this.__refreshActorContain();
        let _attackArr: Array<OutyardAttackInfo> = OutyardManager.Instance.attackArr;
        if (_attackArr.length == 0) {
            this.figureGroup.visible = false;
        }
        else {
            this.figureGroup.visible = true;
        }
        var i: number;
        var j: number;
        var attackMsg: StackHeadAttackMsg;
        var attack: OutyardAttackInfo;
        let toItem: OutyardFigureStatusItem;
        let fromeItem: OutyardFigureStatusItem;
        for (i = 0; i < attackList.length; i++) {
            attackMsg = attackList[i] as StackHeadAttackMsg;
            for (j = 0; j < _attackArr.length; j++) {
                attack = _attackArr[j] as OutyardAttackInfo;
                if (attack.key == (attackMsg.fromPos + "_" + attackMsg.toPos)) {
                    toItem = this["figure_" + attackMsg.toPos + "_" + attackMsg.fromPos];
                    fromeItem = this["figure_" + attackMsg.fromPos + "_" + attackMsg.toPos];
                    fromeItem.setPoint(toItem.x, toItem.y);
                    fromeItem.setFromType(attackMsg.fromPos);
                    fromeItem.changeCount(attackMsg.changeCount, attackMsg.totalCount);
                }
            }
        }
    }

    private blessBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.OutyardBlessWnd);
    }

    private noticeBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.OutyardNoticeWnd);
    }

    private memberBtnHander() {
        FrameCtrlManager.Instance.open(EmWindow.OutyardMemberWnd);
    }

    private addPowerBtnHandler() {
        let selfMsg: StackHeadSelfMsg = OutyardManager.Instance.selfMsg;
        if (selfMsg.actionPoint >= this._maxLimit) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outyard.OutyardFrame.limitCannotBuy"));
            return;
        } else {
            FrameCtrlManager.Instance.open(EmWindow.OutyardBuyEnergyWnd, { _usePoint: this._usePoint, _maxLimit: this._maxLimit });
        }
    }

    private __selfInfoHandler() {
        let selfMsg: StackHeadSelfMsg = OutyardManager.Instance.selfMsg;
        this.powerValueTxt.text = "" + (selfMsg.actionPoint < 0 ? 0 : selfMsg.actionPoint);
    }

    private __stateInfoHandler() {
        let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
        if (stateMsg.state == 0 || stateMsg.state == 1) {
            this.OnHideWind();
        }
    }

    private renderMemberListItem(index: number, item: OutyardFigureMemItem) {
        if (!item || item.isDisposed) return;
        item.index = index;
        item.info = this._memberListData[index];
    }

    private __refreshActorContain() {
        let guildArr: Array<OutyardGuildInfo> = OutyardManager.Instance.guildArr;
        let myGuild: OutyardGuildInfo = OutyardManager.Instance.myGuild;
        guildArr = ArrayUtils.sortOn(guildArr, ["currentScore"], [ArrayConstant.NUMERIC]);
        let preScore: number = 0;
        let info: OutyardGuildInfo;
        let order: number = guildArr.length;
        let len: number = guildArr.length;
        for (let i: number = 0; i < len; i++) {
            info = guildArr[i] as OutyardGuildInfo;
            if (info.currentScore != preScore) {
                preScore = info.currentScore;
                order = guildArr.length - i;
            }
            info.order = order;
        }
        this._memberListData = ArrayUtils.sortOn(guildArr, ["pos"], [ArrayConstant.NUMERIC]);
        this.memberList.numItems = this._memberListData.length;
        this.attackPrencentTxt.text = myGuild ? myGuild.attackBuffLevel * this._config1[1] + "%" : "";
        this.defencePrencentTxt.text = myGuild ? myGuild.defenceBuffLevel * this._config2[1] + "%" : "";
        this.noticeTxt.text = this.outYardModel ? this.outYardModel.getNextOpenStr() : "";
        let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
        if (stateMsg.state == OutyardModel.FIGHTING) {
            this.fightStatusGroup.visible = true;
        } else {
            this.fightStatusGroup.visible = false;
        }
    }

    private get outYardModel(): OutyardModel {
        return OutyardManager.Instance.model;
    }

    closeBtnClick() {
        OutyardManager.Instance.OperateOutyard(OutyardManager.CLOSE_FRAME);
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
        this.dispose();
    }

    dispose() {
        super.dispose();
    }
}