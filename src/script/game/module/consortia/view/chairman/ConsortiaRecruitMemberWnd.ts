// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-29 18:10:47
 * @Description: 公会招收链接 v2.46 RecruitMemberFrame 已调试
 */
import LangManager from '../../../../../core/lang/LangManager';
import { SocketManager } from "../../../../../core/net/SocketManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../../../core/utils/StringHelper";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import ChatHelper from "../../../../utils/ChatHelper";
import ConditionSpeakMsg = com.road.yishi.proto.consortia.ConditionSpeakMsg;
import { YTextInput } from "../../../common/YTextInput";
export class ConsortiaRecruitMemberWnd extends BaseWindow {

    private _tempContent: string = "";
    private txtWordLimit: fgui.GLabel;
    private tfInputPrefix: fgui.GTextInput;
    private tfInputSuffix: YTextInput;
    private txtTip1: fgui.GLabel;
    private txtTip2: fgui.GLabel;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
    }

    private initView() {
        this.tfInputSuffix.on(Laya.Event.INPUT, this, this.__onTxtChange);
        (this.tfInputSuffix.txt_web.displayObject as Laya.Input).wordWrap = true;
        let speakTimes = ConsortiaManager.Instance.model.consortiaInfo.speakTimes;
        this.txtTip1.text = "";
        this.txtTip2.text =StringHelper.repHtmlTextToFguiText(LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.RecruitMemberFrame.describe", speakTimes));
        this.tfInputPrefix.touchable = false;
        this.tfInputPrefix.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.RecruitMemberFrame.text");
        this.txtFrameTitle.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaChairmanPath.command04");
       this.__onTxtChange();
    }

    public OnShowWind() {
        super.OnShowWind();
        this.initView();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.tfInputSuffix.off(Laya.Event.INPUT, this, this.__onTxtChange);
    }

    private btnConfirmClick() {
        let str: string = ChatHelper.parasMsgs(this.tfInputSuffix.text);
        str = StringHelper.trim(str);
        // str = FilterWordManager.filterWrod(str);
        // str = StringHelper.rePlaceHtmlTextField(str);
        if (str == "" || str == LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.RecruitMemberFrame.text")) {
            str = "";
        }
        var msg: ConditionSpeakMsg = new ConditionSpeakMsg();
        msg.speak = str;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_SPEAK, msg);
        this.hide();
    }

    private btnCancelClick() {
        this.hide()
    }

    private __onTxtChange() {
        // this.tfInputSuffix.text = ChatHelper.parasMsgs(this.tfInputSuffix.text);
        let len: number = this.contentLength;
        let maxCount = TempleteManager.Instance.CfgMaxWordCount
        if (this.contentLength > maxCount) {
            this.tfInputSuffix.text = this.tfInputSuffix.text.substring(0, maxCount);
            len = maxCount;
        }
        this._tempContent = this.tfInputSuffix.text;
        this.txtWordLimit.text = Math.ceil(len) + "/" + maxCount
    }

    private get contentLength(): number {
        return this.tfInputSuffix.text.length;
    }
    
    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}