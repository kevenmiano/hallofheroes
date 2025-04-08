import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import CustomerServiceManager from "../../../manager/CustomerServiceManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import FUI_ReplyCom from "../../../../../fui/PersonalCenter/FUI_ReplyCom";

/**
 * 继续回复客服
 */
export default class ReplyCom extends FUI_ReplyCom {

    private _checkTextNumber: number = 250;
    private MAX_CHARS: number = 250;
    private _submitEnble: boolean = true;

    onConstruct() {
        super.onConstruct();

    }

    init() {
        let model = CustomerServiceManager.Instance.model;
        if (!model.currentReplyInfo) return;

        this.txt_title.text = model.currentReplyInfo.title;
        (this.txt_desc.displayObject as Laya.Input).wordWrap = true;
        let date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        this.combox1.getChild('title').asTextField.text = date.getFullYear() + LangManager.Instance.GetTranslation("public.year");
        this.combox2.getChild('title').asTextField.text = (date.getMonth() + 1) + LangManager.Instance.GetTranslation("public.month");
        this.combox3.getChild('title').asTextField.text = (date.getDate()) + LangManager.Instance.GetTranslation("public.daily");
        this.txt_num.text = LangManager.Instance.GetTranslation("customerservice.CustomerServiceBaseView.content01", this._checkTextNumber);

        this.addEvent();
    }

    private _textInputHandler(e: Event) {
        this._checkTextNumber = this.MAX_CHARS - this.txt_desc.text.length;
        if (this._checkTextNumber < 0) {
            this._checkTextNumber = 0;
            this.txt_desc.text = this.txt_desc.text.substring(0, this.MAX_CHARS);
            this.txt_num.text = LangManager.Instance.GetTranslation("customerservice.CustomerServiceBaseView.content01", 0);
            return;
        }
        this.txt_num.text = LangManager.Instance.GetTranslation("customerservice.CustomerServiceBaseView.content01", this._checkTextNumber);
    }

    private addEvent() {
        this.txt_desc.on(Laya.Event.INPUT, this, this._textInputHandler);
    }

    removeEvent() {
        // this.mailContent.unRegister()
        this.txt_desc.off(Laya.Event.INPUT, this, this._textInputHandler);
    }

    /**
    * 提交
    */
    public doSubmit() {
        //描述必填
        if (this.txt_desc.text == '') {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content06"));
            return true;
        }
        if (this.txt_desc.text.length < 8) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content07"));
            return true;
        }
        if (this.submitDelay()) {
            let model = CustomerServiceManager.Instance.model;
            model.sendData.question_content = this.txt_desc.text;
            CustomerServiceManager.Instance.sendServiceReply();
        }
    }


    protected submitDelay(): boolean {
        if (this._submitEnble) {
            this._submitEnble = false;
            Laya.timer.clearAll(this);
            Laya.timer.once(5000, this, this._clearSumbitTimeId);
            return true;
        } else {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return false;
        }
    }

    private _clearSumbitTimeId() {
        Laya.timer.clearAll(this);
        this._submitEnble = true;
    }


}