import LangManager from "../../../../../core/lang/LangManager";
import { SocketManager } from "../../../../../core/net/SocketManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../../../core/utils/StringHelper";
import { EmWindow } from "../../../../constant/UIDefine";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import ChatHelper from "../../../../utils/ChatHelper";
import { YTextInput } from "../../../common/YTextInput";
import { ConsortiaControler } from "../../control/ConsortiaControler";

export default class ConsortiaInfoChangeWnd extends BaseWindow{
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
        this.txtTip1.text = LangManager.Instance.GetTranslation("ConsortiaInfoChangeWnd.txtTip1");
        this.txtTip2.text = ""
        this.tfInputPrefix.touchable = false;
        this.tfInputPrefix.text = LangManager.Instance.GetTranslation("ConsortiaInfoChangeWnd.tfInputPrefix");
        this.txtFrameTitle.text = LangManager.Instance.GetTranslation("ConsortiaInfoChangeWnd.txtFrameTitle");
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
        if (str == "" || str == LangManager.Instance.GetTranslation("ConsortiaInfoChangeWnd.tfInputPrefix")) {
            str = "";
        }
        let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        contorller.modifyConsortiaPlacard(str);
        this.hide();
    }

    private btnCancelClick() {
        this.hide()
    }

    private __onTxtChange() {
        let len: number = this.contentLength;
        let maxCount = 110;
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