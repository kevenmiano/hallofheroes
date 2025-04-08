import EmailInfo from "./EmailInfo";
import LangManager from '../../../core/lang/LangManager';
import EmailType from "./EmailType";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import StarInfo from "./StarInfo";
import FUI_MailItem from '../../../../fui/Mail/FUI_MailItem';
import { PlayerManager } from "../../manager/PlayerManager";
import ColorConstant from "../../constant/ColorConstant";
import EmailManager from "../../manager/EmailManager";

/**
* @author:pzlricky
* @data: 2021-04-13 14:07
* @description *** 
*/
export default class MailItem extends FUI_MailItem {

    public index: number = 0;
    private buttonCtrl: fgui.Controller;
    private foldIcon: string = 'ui://Mail/Icon_Mail_Fold';
    private unFoldIcon: string = 'ui://Mail/Icon_Mail_Unfold';

    private _data: EmailInfo;

    protected onConstruct() {
        super.onConstruct();
        this.buttonCtrl = this.getController("button");
    }

    public setTitle(value: string) {
        this.mailTitle.text = value;
    }

    public setSender(value: string) {
        this.mailSender.text = value;
    }

    public setTime(value: string) {
        this.mailleaveTime.text = value;
    }

    public setCheckState(value: number) {
        this.buttonCtrl.selectedIndex = value;
    }


    public set Itemdata(value: EmailInfo) {
        this._data = value;
        this.refresh();
    }

    public get Itemdata(): EmailInfo {
        return this._data;
    }

    private refresh() {
        if (this._data) {
            this.setTitle(this._data.Title);
            this.setSender(this.getContent() ? this.getContent() : "");
            this.setTime(this._data.leftTime);
            this.setIcon();
            this.redCtr.selectedIndex = this.checkHasAnnex(this._data)?1:0;
            if(this.leftTimeOverThreeDay()){
                this.mailleaveTime.color =  ColorConstant.WHITE_COLOR;
            }
            else{
                this.mailleaveTime.color = ColorConstant.RED_COLOR;
            }
        }
    }

    private  leftTimeOverThreeDay(): boolean {
        var time: number = 0;
        var remain: number = 0;
        let flag:boolean = false;
        remain = this.remainTime();
        if (remain >= 24) {
            time = (Math.round(remain / 24));
            if(time>3){
                flag = true;
            }
        } 
        return flag;
    }

    public remainTime(): number {
        var remain: number = 0;
        if (this._data.isRead) {
            remain = this._data.ValidityDate * 24 - (this.nowDate - this._data.readDate.getTime()) / (60 * 60 * 1000);
        } else {
            remain = this._data.ValidityDate * 24 - (this.nowDate - this._data.sendDate.getTime()) / (60 * 60 * 1000);
        }
        if (remain && remain > 0) {
            return remain;
        } else {
            return -1;
        }
    }

    private get nowDate(): number {
        return PlayerManager.Instance.currentPlayerModel.nowDate;
    }

    private checkHasAnnex(EmailInfo: EmailInfo): boolean {
        let flag: boolean = false;
        if ((!EmailInfo.IsAnnex1 && EmailInfo.Annex1 != 0)
            || (!EmailInfo.IsAnnex2 && EmailInfo.Annex2 != 0)
            || (!EmailInfo.IsAnnex3 && EmailInfo.Annex3 != 0)
            || (!EmailInfo.IsAnnex4 && EmailInfo.Annex4 != 0)) {
            flag = true;
        }
        return flag;
    }

    private setIcon() {
        switch (this._data.MailType) {
            case EmailType.BATTLE_REPORT:
                this.mailIcon.url = String(this._data.isRead ? this.unFoldIcon : this.foldIcon);
            case EmailType.STAR_MAIL:
                this.setStarMail();
                break;
            default:
                this.setNormalMail();
                break;
        }
    }

    private setNormalMail() {
        var goodsInfo: GoodsInfo = this._data.getFirstGoodsInfo();
        if (this._data.isRead) {
            this.mailIcon.url = this.unFoldIcon;
        } else {
            this.mailIcon.url = this.foldIcon;
        }
    }

    private setStarMail() {
        var starInfo: StarInfo = this._data.getFirstStarInfo();
        if (starInfo && starInfo.template) {
            this.mailIcon.url = this.foldIcon;
        } else {
            if (this._data.isRead) {
                this.mailIcon.url = this.unFoldIcon;
            } else {
                this.mailIcon.url = this.foldIcon;
            }
        }
    }

    public getContent(): string {
        return this._data.SendNickName;
    }



}