import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { GvgReadyController } from "../control/GvgReadyController";
import { GvgEvent } from "../../../constant/event/NotificationEvent";
import { GvgInfoView } from "./component/GvgInfoView";
import { GvgManageView } from "./component/GvgManageView";
import { GvgTopTenView } from "./component/GvgTopTenView";
import { CampaignManager } from "../../../manager/CampaignManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { GvgLeftTimeView } from './component/GvgLeftTimeView';
import Resolution from "../../../../core/comps/Resolution";
import { UIAlignType } from "../../../constant/UIAlignType";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/26 16:37
 * @ver 1.0
 */
export class GvgBattleWnd extends BaseWindow {
    public _gvgInfoView: GvgInfoView;
    public _gvgTimeView: GvgLeftTimeView;
    public leftTimeTxt: fgui.GTextField;
    public _gvgManagerView: GvgManageView;
    public _topTenView: GvgTopTenView;
    public _cdView: fgui.GGroup;
    private _controller: GvgReadyController;
    private _countDown: number;
    public timeCtr: fgui.Controller;
    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initEvent();
        this.timeCtr = this.getController('timeCtr');
        this._countDown = CampaignManager.Instance.gvgModel.leftTime;
        this.leftTimeTxt.text = "00:00:00";
        this._cdView.visible = false;
        this.timeCtr.selectedIndex = 0;
        Laya.timer.loop(1000, this, this.updateCountDown)

        Resolution.addWidget(this._gvgManagerView.displayObject);
        Resolution.addWidget(this._gvgInfoView.displayObject, UIAlignType.RIGHT);
        Resolution.addWidget(this._topTenView.displayObject, UIAlignType.RIGHT);
    }

    private initData() {
        this._controller = FrameCtrlManager.Instance.getCtrl(EmWindow.GvgRankListWnd) as GvgReadyController;
    }

    private initEvent() {
        CampaignManager.Instance.gvgModel.addEventListener(GvgEvent.GUILDWAR_OPEN_LEFTTIME, this.__guildWarOpenLeftTimeHandler, this);
    }

    private updateCountDown() {
        if (this._countDown > 0) {
            this.leftTimeTxt.text = DateFormatter.getConsortiaCountDate(this._countDown);
            this._countDown--;
            this._cdView.visible = true;
        } else {
            this.leftTimeTxt.text = "00:00:00";
            Laya.timer.clear(this, this.updateCountDown);
            this._cdView.visible = false;
        }
    }

    public OnShowWind() {
        super.OnShowWind();

        this._gvgManagerView.initView();
    }

    private __guildWarOpenLeftTimeHandler(time: number) {
        this._countDown = time;
        if(this._countDown<=10){
            this.leftTimeTxt.text = "00:00:00";
            Laya.timer.clear(this, this.updateCountDown);
            this._cdView.visible = false;
            Laya.timer.loop(1000, this, this.updateCountDown2);
        }
    }

    private updateCountDown2() {
        this._countDown--;
        this.timeCtr.selectedIndex = this._countDown;
        if (this._countDown <= 0) {
            Laya.timer.clear(this, this.updateCountDown2);
            this.timeCtr.selectedIndex = 0;
            CampaignManager.Instance.gvgModel.dispatchGuildWarOpenLeftTime(0);
        }
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private removeEvent() {
        CampaignManager.Instance.gvgModel.removeEventListener(GvgEvent.GUILDWAR_OPEN_LEFTTIME, this.__guildWarOpenLeftTimeHandler, this);
    }

    dispose(dispose?: boolean) {
        this._controller = null;
        Laya.timer.clear(this, this.updateCountDown);
        Laya.timer.clear(this, this.updateCountDown2);
        CampaignManager.Instance.gvgModel.dispatchGuildWarOpenLeftTime(0);
        super.dispose(dispose);
    }
}