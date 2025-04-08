// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-10-09 17:40:42
 * @Description: 公会重新命名 v2.46 ConsortiaRenameFrame
 */
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import LangManager from '../../../../../core/lang/LangManager';
import UIButton from '../../../../../core/ui/UIButton';
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ConsortiaSocektSendManager } from "../../../../manager/ConsortiaSocektSendManager";
import { FilterWordManager } from "../../../../manager/FilterWordManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import StringHelper from "../../../../../core/utils/StringHelper";
import ConsortiaRenameRspMsg = com.road.yishi.proto.consortia.ConsortiaRenameRspMsg;
import ChatHelper from "../../../../utils/ChatHelper";
import StringUtils from "../../../../utils/StringUtils";
import { EmWindow } from "../../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { StringUtil } from "../../../../utils/StringUtil";
import {YTextInput} from "../../../common/YTextInput";

export class ConsortiaRenameWnd extends BaseWindow {

    private txtTip: fgui.GLabel;
    private tfRename: YTextInput;
    private txtCost: fgui.GLabel;
    private txtTipLimit: fgui.GLabel;
    private btnCheck: UIButton;
    private btnConfirm: UIButton;
    private _renameType: number = 0;//1,合服

    private MAX_LIMIT_WORDS: number = 10;
    private MIN_LIMIT_WORDS: number = 4;
    public c1:fgui.Controller;
    private nameTxt: fgui.GLabel;
    private _type:number = 0;
    public frame: fgui.GLabel;
    public OnInitWind() {
        super.OnInitWind();
        this.c1 = this.contentPane.getController("c1");
        this.frame.getChild("title").text = LangManager.Instance.GetTranslation("ConsortiaRenameWnd.title");
        this.btnConfirm.title = LangManager.Instance.GetTranslation("ConsortiaRenameWnd.btnConfirm.title");
        this.tfRename.tooltips = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.tfDiamond.text");
        this.initView();
        this.setCenter();
    }

    private initView() {
        this.tfRename.fontSize = 22;
        this.tfRename.txt_web.maxLength = 16;
        this.tfRename.singleLine = true;
        this.tfRename.valign = "middle";
        this.tfRename.promptText = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.tfDiamond.text");
        this.btnConfirm.enabled = false;
        this.txtTip.text = LangManager.Instance.GetTranslation("consortia.view.club.CreatConsortiaFrame.command02");
        this.txtTipLimit.text = LangManager.Instance.GetTranslation("consortia.view.club.CreatConsortiaFrame.command04");
        this.txtCost.text = ConsortiaModel.renameCost.toString();
        this.tfRename.on(Laya.Event.INPUT, this, this.__onTxtChange);
    }

    public OnShowWind() {
        super.OnShowWind();
        if (this.frameData && this.frameData.type == 2) {
            this._renameType = 1;
            this._type = this.frameData.type;
            this.c1.selectedIndex = 1;
            this.nameTxt.text =  LangManager.Instance.GetTranslation("ConsortiaRenameWnd.nameTxt");
        }
        else{
            this.c1.selectedIndex = 0;
        }
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    private __renameHandler(pkg: PackageIn) {
        let msg: ConsortiaRenameRspMsg = pkg.readBody(ConsortiaRenameRspMsg) as ConsortiaRenameRspMsg;
        if (msg.result) {
            this.hide();
        } else {
            this.btnConfirm.enabled = true;
        }
    }

    private __onTxtChange() {
        let vStr = this.tfRename.text;
        if (StringHelper.isNullOrEmpty(vStr)) {
            this.btnConfirm.enabled = false;
        } else {
            let length: number = vStr.replace(/[^\x00-\xff]/g, "xx").length;
            if (length > this.MAX_LIMIT_WORDS || length < this.MIN_LIMIT_WORDS) {
                this.btnConfirm.enabled = false;
            } else {
                this.btnConfirm.enabled = true;
            }
        }
        this.tfRename.text = vStr;
    }

    private btnConfirmClick() {
        let vStr = StringUtil.ltrim(this.tfRename.text);
        vStr = StringUtil.rtrim(vStr);
        vStr = ChatHelper.parasMsgs(vStr);
        this.tfRename.text = vStr;
        if (StringUtils.checkEspicalWorld(vStr)) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("special.words"));
            return;
        }
        if (FilterWordManager.isGotForbiddenWords(vStr, "name") || FilterWordManager.isGotForbiddenWords(vStr, "chat")) {
            let str: string = LangManager.Instance.GetTranslation("consortia.view.club.CreatConsortiaFrame.command11");
            MessageTipManager.Instance.show(str);
            return;
        }
        let hasMoney = PlayerManager.Instance.currentPlayerModel.playerInfo.point + PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
        if (this._renameType == 0 && hasMoney < ConsortiaModel.renameCost) {
            RechargeAlertMannager.Instance.show();
            return;
        }
        this.btnConfirm.enabled = false;
        let b: boolean = this._renameType != 0;
        ConsortiaSocektSendManager.consortiaRename(vStr, b, this.btnCheck.selected);
        if (this._type == 0) {
            this.hide();
        }
    }
    

    dispose(dispose?: boolean) {
        if(this._type == 2 )FrameCtrlManager.Instance.exit(EmWindow.Consortia);
        super.dispose(dispose);
    }
}