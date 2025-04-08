/*
 * @Author: jeremy.xu
 * @Date: 2023-06-06 17:14:38
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-11 15:38:34
 * @Description: 会长通知
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../core/utils/StringHelper";
import { OuterCityWarEvent } from "../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ConsortiaManager } from "../../manager/ConsortiaManager";
import { FilterWordManager } from "../../manager/FilterWordManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { StringUtil } from "../../utils/StringUtil";
import StringUtils from "../../utils/StringUtils";
import { YTextInput } from "../common/YTextInput";
import { ConsortiaDutyLevel } from "../consortia/data/ConsortiaDutyLevel";
import { OuterCityWarManager } from "./control/OuterCityWarManager";

export default class OuterCityWarNoticeWnd extends BaseWindow {
    public frame: fgui.GComponent;
    public changeBtn: fgui.GButton;
    private tfInputSuffix: YTextInput;
    public typeCtr: fgui.Controller;
    public descTxt: fgui.GTextField;
    private _maxValue: number = 200;
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();

    }
    
    public OnShowWind() {
        super.OnShowWind();
        this.addEvent();
        this.initView();
    }

    private initView() {
        this.typeCtr = this.getController("typeCtr");
        this.tfInputSuffix.txt_web.maxLength = this._maxValue;
        this.tfInputSuffix.txt_web.leading = 6;
        this.tfInputSuffix.txt_mobile.leading = 6;
        this.changeBtn.title = LangManager.Instance.GetTranslation("public.modification")
        this.frame.getChild("title").text = LangManager.Instance.GetTranslation("consortia.presidentNotice")
        let userId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        let temp: ThaneInfo = ConsortiaManager.Instance.model.consortiaMemberList[userId];
        if(temp && (temp.dutyId == ConsortiaDutyLevel.CHAIRMAN || temp.dutyId == ConsortiaDutyLevel.VICE_CHAIRMAN)){
            this.typeCtr.selectedIndex = 1;
            this.tfInputSuffix.on(Laya.Event.INPUT, this, this.__contentTxtChange);
        }
        else {
            this.typeCtr.selectedIndex = 0;
            this.tfInputSuffix.off(Laya.Event.INPUT, this, this.__contentTxtChange);
            (this.tfInputSuffix.txt_web.displayObject as Laya.Input).mouseEnabled = false;
        }
        (this.tfInputSuffix.txt_web.displayObject as Laya.Input).wordWrap = true;
        this.__guildNotice();
        this.__contentTxtChange();
    }

    private addEvent() {
        this.changeBtn.onClick(this, this.changeBtnHandler);
        NotificationManager.Instance.removeEventListener(OuterCityWarEvent.GUILD_NOTICE,  this.__guildNotice,this);
    }

    private removeEvent() {
        this.changeBtn.offClick(this, this.changeBtnHandler);
        this.tfInputSuffix.off(Laya.Event.INPUT, this, this.__contentTxtChange);
        NotificationManager.Instance.removeEventListener(OuterCityWarEvent.GUILD_NOTICE,  this.__guildNotice,this);
    }

    private __contentTxtChange() {
        let txtTemp = this.tfInputSuffix.text;
        if (txtTemp.length > this._maxValue) {
            txtTemp = txtTemp.substring(0, this._maxValue);
        }
        // this.tfInputSuffix.text = txtTemp;
        this.descTxt.text = LangManager.Instance.GetTranslation("OutyardNoticeWnd.descTxt", this._maxValue - this.tfInputSuffix.text.length);
    }

    private __guildNotice(){
        this.tfInputSuffix.text = OuterCityWarManager.Instance.model.curCastleNoticeStr;
    }

    private changeBtnHandler() {
        let noticeStr: string = this.tfInputSuffix.text;
        noticeStr = StringHelper.replace(noticeStr,"\n","");
        // noticeStr = StringUtil.replaceSpicalWord(noticeStr);
        noticeStr = StringHelper.trim(noticeStr);
        noticeStr = FilterWordManager.filterWrod(noticeStr);
        noticeStr = StringHelper.rePlaceHtmlTextField(noticeStr);
        if(noticeStr.length < 3){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OutyardNoticeWnd.changeBtnTips"));
            return;
        }
        OuterCityWarManager.Instance.sendEditNotice(noticeStr);
        this.hide();
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    dispose() {
        super.dispose();
    }
}