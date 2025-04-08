// @ts-nocheck
import FUI_ConsortiaMemberItem from "../../../../../../fui/Consortia/FUI_ConsortiaMemberItem";
import AudioManager from "../../../../../core/audio/AudioManager";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { JobType } from "../../../../constant/JobType";
import { SoundIds } from "../../../../constant/SoundIds";
import { EmWindow } from "../../../../constant/UIDefine";
import UserType from "../../../../constant/UserType";
import { ConsortiaEvent } from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaDutyLevel } from "../../data/ConsortiaDutyLevel";
import ConsortiaPlayerMenu from "./ConsortiaPlayerMenu";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/22 11:05
 * @ver 1.0
 *
 */
export class ConsortiaMemberItem extends FUI_ConsortiaMemberItem {
    private _contorller: ConsortiaControler;
    private _info: ThaneInfo;
    private _headId: number;
     //@ts-ignore
    public headicon: IconAvatarFrame;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
    }

    private addEvent() {
        this.btnMore.onClick(this, this.__onClickHandler);
        this._info.addEventListener(PlayerEvent.CONSORTIA_DUTY_CHANGE, this.__onDutyUpdata, this);
        this._info.addEventListener(ConsortiaEvent.UPDE_MEMEBER_STATE, this.__onStageUpdata, this);
    }

    get info(): ThaneInfo {
        return this._info;
    }

    set info(value: ThaneInfo) {
        this._info = value;

        if (this._info && this._info.templateInfo) {
            this.addEvent();
            this.headicon.grayed = !this._info.isOnline;
            this.headicon.isGray = !this._info.isOnline;
            this._headId = this._info.headId;
            if (this._headId == 0) {
                this._headId = this._info.job;
            }
            this.headicon.headId = this._headId;
            if (this._info.frameId > 0) {
                let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._info.frameId);
                if (itemData) {
                    this.headicon.headFrame = itemData.Avata;
                    this.headicon.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
                }
            }else{
                this.headicon.headFrame = "";
                this.headicon.headEffect = "";
            }
            this.jobLoader.url = JobType.getJobIcon(this._info.templateInfo.Job);
            this.txt_level.text = this._info.grades.toString();
            this.nameTxt.text = this._info.nickName;
            this.positionTxt.text = ConsortiaDutyLevel.getDutyByButyLevel(this._info.dutyId);
            this.apTxt.text = this._info.fightingCapacity.toString();
            this.offlineTimeTxt.text = this.getDate();
            if (this._info.IsVipAndNoExpirt) {
                this.vipIcon.visible = true;
            }
            else {
                this.vipIcon.visible = false;
            }
            if (this._info.userId == this.playerInfo.userId) {
                this.btnMore.visible = false
            } else {
                this.btnMore.visible = true
            }
        }
    }

    private __onClickHandler(evt: Event) {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if (!this._info || this._info.userId == this.playerInfo.userId) {
            return;
        }

        evt.stopPropagation();
        Laya.stage.on(Laya.Event.CLICK, this, this.hideConsortiaPlayerMenu);

        let selfThane = this._contorller.getSimplePlayerInfoById(this.playerInfo.userId)
        let itemThane = this._info
        let pt = this.btnMore.displayObject.localToGlobal(new Laya.Point(0, 0), false)
        let contributeStr = this._info.consortiaOffer.toString() + " / " + this._info.consortiaTotalOffer.toString();
        let jianSeStr = this._info.consortiaJianse.toString() + " / " + this._info.consortiaTotalJianse.toString();
        ConsortiaPlayerMenu.Show(selfThane, itemThane, pt,contributeStr,jianSeStr);
    }

    private hideConsortiaPlayerMenu() { 
        ConsortiaPlayerMenu.Hide();
        Laya.stage.off(Laya.Event.CLICK, this, this.hideConsortiaPlayerMenu);
    }

    private __onStageUpdata() {
        if (!this._info) return;
        this.offlineTimeTxt.text = this.getDate();
        this.headicon.grayed = !this._info.isOnline;
        this.headicon.setMovieGray(!this._info.isOnline);
    }

    private __onDutyUpdata() {
        if (!this._info) return;
        this.positionTxt.text = ConsortiaDutyLevel.getDutyByButyLevel(this._info.dutyId);
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private getDate(): string {
        if (this._info) {
            if (this._info.id == ArmyManager.Instance.thane.id) {
                return LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.StateTip");
            }
            if (this._info.right == UserType.ROBOT) {
                let RightTip: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.RightTip");
                return RightTip;
            }
            if (this._info.isOnline) {
                let StateTip: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.StateTip");
                return StateTip;
            }
            let date: Date = new Date();
            date.setTime(PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000);
            if ((this._info.logOutTime as Date).getTime() == 946656000000) {
                let logOutTimeTip: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.dayTip", 1);
                return logOutTimeTip;
            }
            let num: number = date.getTime() - (this._info.logOutTime as Date).getTime();
            let hour: number = Math.floor(num / 1000 / 3600);
            let day: number = Math.floor(hour / 24);
            if (hour <= 0) {
                let inHourTip: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.inHourTip");
                return inHourTip;
            } else if (hour < 24) {
                let hourTip: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.hourTip", hour);
                return hourTip;
            } else if (day < 30) {
                let dayTip: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.dayTip", day);
                return dayTip;
            } else {
                let longTip: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.longTip");
                return longTip;
            }
        }
        return "";
    }

    private removeEvent() {
        this.btnMore.offClick(this, this.__onClickHandler);
        if (this._info) {
            this._info.removeEventListener(PlayerEvent.CONSORTIA_DUTY_CHANGE, this.__onDutyUpdata, this);
            this._info.removeEventListener(ConsortiaEvent.UPDE_MEMEBER_STATE, this.__onStageUpdata, this);
        }
    }

    dispose() {
        this.removeEvent();
        this._info = null;
        super.dispose();
    }
}