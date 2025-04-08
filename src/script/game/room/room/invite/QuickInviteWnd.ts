/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-23 11:08:20
 * @LastEditTime: 2023-12-20 10:29:38
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import LangManager from "../../../../core/lang/LangManager";
import ObjectPool from "../../../../core/pool/ObjectPool";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../../core/utils/StringHelper";
import { RoomSceneType } from "../../../constant/RoomDefine";
import { ChatChannel } from "../../../datas/ChatChannel";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import { KingTowerManager } from "../../../manager/KingTowerManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { RoomManager } from "../../../manager/RoomManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import ChatData from "../../../module/chat/data/ChatData";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import ChatHelper from "../../../utils/ChatHelper";
import InviteData from "./InviteData";
import { PlayerManager } from "../../../manager/PlayerManager";
import { GlobalConfig } from "../../../constant/GlobalConfig";
import UIButton from "../../../../core/ui/UIButton";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsManager } from "../../../manager/GoodsManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ShopGoodsInfo } from "../../../module/shop/model/ShopGoodsInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ChatSocketOutManager from "../../../manager/ChatSocketOutManager";
import { YTextInput } from "../../../module/common/YTextInput";

export default class QuickInviteWnd extends BaseWindow {
    protected setOptimize: boolean = false;
    protected resizeContent: boolean = true;

    private txtWordLimit: fgui.GLabel;
    private tfInputPrefix: fgui.GLabel;
    private tfInputSuffix: YTextInput;
    private _tempContent: string = "";
    private _apos: string = "&apos;";
    private _defaultContent: string = "";
    private _defaultContentPrefix: string = ""; // 不允许修改的文字
    private _defaultContentSuffix: string = "";
    private chatDataPool: ObjectPool<ChatData>;
    private btnShelter: UIButton;
    private roomSceneType: RoomSceneType = RoomSceneType.PVE;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        if (this.frameData) {
            this.roomSceneType = this.frameData.roomSceneType
        }
        this.chatDataPool = new ObjectPool("chatDataPool")

        this.txtFrameTitle.text = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.title");
        this.tfInputPrefix.touchable = false;
        this.tfInputSuffix.on(Laya.Event.INPUT, this, this.__onTxtChange);
        (this.tfInputSuffix.txt_web.displayObject as Laya.Input).wordWrap = true;
        this.btnShelter.visible = PlayerManager.Instance.currentPlayerModel.checkChatForbidIsOpen();
        this.initInviteContent();
        ChatSocketOutManager.sendSmallBugleFreeCount();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
        this.tfInputSuffix.off(Laya.Event.INPUT, this, this.__onTxtChange);
    }

    private initInviteContent() {
        this._defaultContentSuffix = LangManager.Instance.GetTranslation("QuickInviteWnd.InviteTipSuffix");

        if (this.roomSceneType == RoomSceneType.PVP) {
            this._defaultContentPrefix = LangManager.Instance.GetTranslation("QuickInviteWnd.PvpInviteTipPrefix", this.roomInfo.id)+LangManager.Instance.GetTranslation('welcomeTojoin')
        } else {
            if (this.roomInfo.campaignId == GlobalConfig.CampaignID.AncientRuins) {
                this._defaultContentPrefix = StringHelper.format(LangManager.Instance.GetTranslation("QuickInviteWnd.AncientRuinsInviteTipPrefix", this.roomInfo.mapName, this.roomInfo.id));
            }
            else {
                let mapName: string = "";
                let difficultyGrade: string = "";
                let templateInfo = this.roomInfo.mapTemplate ? this.roomInfo.mapTemplate : CampaignManager.Instance.mapModel.campaignTemplate;
                let lvstr = '';
                if (templateInfo) {
                    lvstr = LangManager.Instance.GetTranslation("public.level5", "", templateInfo.MinLevel, templateInfo.MaxLevel);
                    if (templateInfo.MinLevel == templateInfo.MaxLevel) {
                        lvstr = LangManager.Instance.GetTranslation("public.level3", templateInfo.MinLevel);
                    }
                }
                //王者之塔快速邀请
                if (templateInfo.isKingTower) {//||templateInfo.isTrailTower
                    difficultyGrade = KingTowerManager.Instance.kingTowerInfo.difficultyStep(templateInfo.DifficutlyGrade);
                    mapName = templateInfo.CampaignNameLang + lvstr + LangManager.Instance.GetTranslation("public.parentheses1", difficultyGrade);
                }
                else {
                    if (templateInfo.SonTypes != 0) {
                        if (templateInfo.isTaila) {
                            difficultyGrade = LangManager.Instance.GetTranslation("selectcampaign.view.weekCampaign");
                        }
                        else {
                            difficultyGrade = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.difficultyGrade3");
                        }
                    }
                    else if (templateInfo.DifficutlyGrade == 1) {
                        difficultyGrade = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.difficultyGrade1");
                    }
                    else {
                        //difficultyGrade = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.difficultyGrade2");
                    }
                    if (difficultyGrade && !templateInfo.isTaila) {
                        difficultyGrade = LangManager.Instance.GetTranslation("public.parentheses1", difficultyGrade);
                    }
                    if (!templateInfo.isTaila) {
                        mapName = templateInfo.CampaignNameLang + " " + lvstr + difficultyGrade;
                    } else {
                        mapName = templateInfo.CampaignNameLang + lvstr;
                    }
                }
                if (this.roomInfo.campaignId == 0) {
                    mapName = LangManager.Instance.GetTranslation("chat.view.ChatView.NullMap");
                }
                if (templateInfo.isKingTower || templateInfo.isTrailTower) {
                    let activity: string = LangManager.Instance.GetTranslation("room.view.invite.QuickInviteFrame.difficultyGrade3");
                    this._defaultContentPrefix = activity + LangManager.Instance.GetTranslation("QuickInviteWnd.activity", mapName, this.roomInfo.id);
                } else {
                    if (templateInfo.isTaila) {
                        this._defaultContentPrefix = difficultyGrade + LangManager.Instance.GetTranslation("QuickInviteWnd.activity", mapName, this.roomInfo.id);
                    } else {
                        this._defaultContentPrefix = LangManager.Instance.GetTranslation("QuickInviteWnd.PveInviteTipPrefix1", mapName, this.roomInfo.id);
                    }
                }
            }
        }

        let contentSuffix = this.thane.inviteContent ? this.thane.inviteContent : this._defaultContentSuffix;
        this.tfInputPrefix.text = this._defaultContentPrefix;
        this.tfInputSuffix.text = contentSuffix;
        this._defaultContent = this._defaultContentPrefix + contentSuffix;
        this.__onTxtChange()
    }

    private btnConfirmClick() {
        let num: number = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.SMALL_BUGLE_TEMP_ID);
        if (num == 0) {
            if (this.thane.smallBugleFreeCount <= 0) {
                var command = LangManager.Instance.GetTranslation("chat.view.ChatInputView.command06");
                MessageTipManager.Instance.show(command);

                let tempId = ShopGoodsInfo.SMALL_BUGLE_TEMP_ID
                let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(tempId);
                FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: 1 });
                return;
            }
        }

        let str = StringHelper.trim(this.tfInputSuffix.text);
        if (StringHelper.isNullOrEmpty(str)) {
            str = LangManager.Instance.GetTranslation("consortiagroupchat.command01");
            MessageTipManager.Instance.show(str);
            return;
        }

        let textCount = str.length;
        let maxCount = TempleteManager.Instance.CfgMaxWordCount
        let limitCount = maxCount - this._defaultContentPrefix.length;
        if (textCount > limitCount) {
            str = LangManager.Instance.GetTranslation("QuickInviteWnd.txtTip3");
            MessageTipManager.Instance.show(str);
            return;
        }

        str = StringHelper.replace(str, "\n", "");
        InviteData.thane.inviteContent = str;
        let tempContent: string = this.getSendStr(ChatHelper.parasMsgs(str));
        tempContent = this._defaultContentPrefix + ChatHelper.parasMsgs(str)
        let contents: any[] = new Array();
        if (!ChatHelper.checkCanSend(tempContent, ChatChannel.WORLD)) {
            return;
        }

        let chatData = this.chatDataPool.get(() => {
            return new ChatData()
        })
        chatData.headId = ArmyManager.Instance.thane.snsInfo.headId;
        chatData.job = PlayerManager.Instance.currentPlayerModel.playerInfo.job;
        chatData.channel = ChatChannel.WORLD;
        chatData.uid = InviteData.thane.userId;
        chatData.senderName = InviteData.thane.nickName;
        chatData.appellId = InviteData.thane.appellId;
        chatData.msg = tempContent;
        chatData.commit();
        contents.push(tempContent);

        ChatHelper.lastSendTime3 = new Date().getTime();

        SocketSendManager.Instance.sendQuickInvite(contents);

        this.OnBtnClose()
    }

    private btnCancelClick() {
        this.OnBtnClose()
    }

    private __onTxtChange() {
        let txtTemp = this.tfInputSuffix.text
        //ps:这里会去除左右空格, 导致只能在中间输入空格。中文状态下, 输入jj, 会被过滤掉, 导致打字异常。
        // txtTemp = ChatHelper.parasMsgs(txtTemp);
        // let maxCount = InviteData.QuickInvite_MaxWords - this._defaultContentPrefix.length;
        // if (txtTemp.length > maxCount) {
        //     txtTemp = txtTemp.substring(0, maxCount);
        //     //上面截断的时候, 右边可能会多出空格, 再次去除空格。
        //     txtTemp = txtTemp.trim();
        // }
        // this.tfInputSuffix.text = txtTemp;
        let maxCount = TempleteManager.Instance.CfgMaxWordCount
        this.txtWordLimit.text = (txtTemp.length + this._defaultContentPrefix.length) + "/" + maxCount;
    }

    private getSendStr(str: string) {
        // return "[color=#ffdc57]" + this._defaultContentPrefix + "[/color]" + "[color=#ffecc6]" + str + "[/color]"
        return this._defaultContentPrefix + " " + str;
    }

    private transferredApos(str: string): string {
        return StringHelper.replaceStr(str, "'", this._apos);
    }

    private btnShelterClick() {
        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("chat_forbiden_text"))
    }

    private get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }
}