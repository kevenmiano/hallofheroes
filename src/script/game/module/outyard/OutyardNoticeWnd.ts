// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../core/utils/StringHelper";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ConsortiaManager } from "../../manager/ConsortiaManager";
import { FilterWordManager } from "../../manager/FilterWordManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OutyardManager from "../../manager/OutyardManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { YTextInput } from "../common/YTextInput";
/**
 * 会长通知
 */
export default class OutyardNoticeWnd extends BaseWindow {

    public changeBtn: fgui.GButton;
    private tfInputSuffix: YTextInput;
    public typeCtr: fgui.Controller;
    public descTxt: fgui.GTextField;
    private _maxValue: number = 200;
    public OnInitWind() {
        this.setCenter();
        this.addEvent();
        this.typeCtr = this.getController("typeCtr");
        this.initView();
    }

    private initView() {
        this.tfInputSuffix.txt_web.maxLength = this._maxValue;
        let userId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        let temp: ThaneInfo = ConsortiaManager.Instance.model.consortiaMemberList[userId];
        if(temp && (temp.dutyId == 1 || temp.dutyId == 2)){
            this.typeCtr.selectedIndex = 1;
            this.tfInputSuffix.on(Laya.Event.INPUT, this, this.__contentTxtChange);
        }
        else {
            this.typeCtr.selectedIndex = 0;
            this.tfInputSuffix.off(Laya.Event.INPUT, this, this.__contentTxtChange);
            (this.tfInputSuffix.txt_web.displayObject as Laya.Input).mouseEnabled = false;
        }
        (this.tfInputSuffix.txt_web.displayObject as Laya.Input).wordWrap = true;
        this.tfInputSuffix.text = OutyardManager.Instance.noticeStr;
        this.descTxt.text = LangManager.Instance.GetTranslation("OutyardNoticeWnd.descTxt", this._maxValue - this.tfInputSuffix.text.length);
    }

    OnShowWind() {
        super.OnShowWind();
    }

    private addEvent() {
        this.changeBtn.onClick(this, this.changeBtnHandler);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_FULL_INFO,  this.__refreshNoticeHandler,this);
    }

    private removeEvent() {
        this.changeBtn.offClick(this, this.changeBtnHandler);
        this.tfInputSuffix.off(Laya.Event.INPUT, this, this.__contentTxtChange);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_FULL_INFO,  this.__refreshNoticeHandler,this);
    }

    private __contentTxtChange() {
        let txtTemp = this.tfInputSuffix.text;
        if (txtTemp.length > this._maxValue) {
            txtTemp = txtTemp.substring(0, this._maxValue);
        }
        // this.tfInputSuffix.text = txtTemp;
        this.descTxt.text = LangManager.Instance.GetTranslation("OutyardNoticeWnd.descTxt", this._maxValue - this.tfInputSuffix.text.length);
    }

    private __refreshNoticeHandler(){
        this.tfInputSuffix.text = OutyardManager.Instance.noticeStr;
    }

    private changeBtnHandler() {
        let noticeStr: string = this.tfInputSuffix.text;
        noticeStr = StringHelper.trim(noticeStr);
        noticeStr = FilterWordManager.filterWrod(noticeStr);
        noticeStr = StringHelper.rePlaceHtmlTextField(noticeStr);
        if(noticeStr.length < 3){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OutyardNoticeWnd.changeBtnTips"));
            return;
        }
        OutyardManager.Instance.OperateOutyard(OutyardManager.CHANGE_NOTICE, 0, noticeStr);
        this.hide();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose() {
        super.dispose();
    }
}