// @ts-nocheck
import FUI_GvgInfoView from "../../../../../../fui/Consortia/FUI_GvgInfoView";
import { GvgMapModel } from "../../model/GvgMapModel";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { CampaignEvent } from "../../../../constant/event/NotificationEvent";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { t_s_campaignbufferData } from "../../../../config/t_s_campaignbuffer";
import { EmWindow } from "../../../../constant/UIDefine";
import LangManager from "../../../../../core/lang/LangManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import FUI_GvgLeftTimeView from '../../../../../../fui/Consortia/FUI_GvgLeftTimeView';

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/27 20:02
 * @ver 1.0
 */
export class GvgLeftTimeView extends FUI_GvgLeftTimeView {
    private _countDown: number;

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initView();
    }

    private initView() {
        this.displayTimeView();
    }

    private displayTimeView(): void {
        let date: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        let min: number = 60 - date.getMinutes();
        let sec: number = 60 - date.getSeconds();
        this._countDown = min * 60 + sec;
        if (this._countDown >= 0) {
            Laya.timer.loop(1000, this, this.updateCountDown)
            this.updateCountDown();
        }
    }

    private updateCountDown() {
        if (this._countDown > 0) {
            this._timeValue.text = DateFormatter.getConsortiaCountDate(this._countDown);
            this._countDown--;
        }
        else {
            this._timeValue.text = "00:00:00";
            Laya.timer.clear(this, this.updateCountDown);
        }
    }

    dispose() {
        Laya.timer.clear(this, this.updateCountDown);
        super.dispose();
    }
}