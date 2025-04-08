// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import EmailManager from "../../manager/EmailManager";
import EmailSocketOutManager from "../../manager/EmailSocketOutManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { ResourceManager } from "../../manager/ResourceManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import MailModel from './MailModel';

/**
* @author:pzlricky
* @data: 2021-04-12 16:28
* @description *** 
*/
export default class MailCtrl extends FrameCtrlBase {
    public isOpened: boolean = false;

    protected initDataPreShow() {
        super.initDataPreShow()
        this.isOpened = true;
        this.model.filterOutDateEmails()
    }

    protected clearDataPreHide() {
        super.clearDataPreHide()
        if (this.isOpened) {
            this.resetDate();
            this.isOpened = false;
        }
    }

    private resetDate() {
        this.model.selectedMailId = 0;
    }

    private _list: Array<number>;
    public deleteEmails(list: Array<number>) {
        this._list = list;
        let flag: boolean = false;
        for (const key in this._list) {
            if (Object.prototype.hasOwnProperty.call(this._list, key)) {
                let id = this._list[key];
                if (EmailManager.Instance.mailModel.getEmailById(id).hasGoods) {
                    flag = true;
                    break;
                }
            }
        }
        if (!flag) {
            EmailSocketOutManager.deleteMail(this._list);
            this._list = null;
        } else {
            var prompt: string = LangManager.Instance.GetTranslation("emailII.EmailControler.prompt");
            var content: string = LangManager.Instance.GetTranslation("emailII.EmailControler.content");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, null, cancel, this.__alertResponseHandler.bind(this));
        }
    }

    private __alertResponseHandler(b: boolean, flag: boolean = false, id: number = 0, type: number = 0) {
        if (b) {
            EmailSocketOutManager.deleteMail(this._list);
            this._list = null;
        }
    }

    public sendEmail(idList: Array<number>, title: string, content: string) {
        if (ResourceManager.Instance.gold.count < MailModel.WRITE_MAIL_NEEDED_GOLD) {
            var str: string = LangManager.Instance.GetTranslation("public.gold");
            MessageTipManager.Instance.show(str);
            return;
        }
        EmailSocketOutManager.sendEmail(idList, title, content, 1);
    }

    private get model(): MailModel {
        return this.data;
    }
}