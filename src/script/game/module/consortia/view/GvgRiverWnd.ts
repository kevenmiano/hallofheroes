// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Resolution from "../../../../core/comps/Resolution";
import { DateFormatter } from "../../../../core/utils/DateFormatter";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/1 15:38
 * @ver 1.0
 */
export class GvgRiverWnd extends BaseWindow {
    private _timeCount: number;
    private timeTxt: fgui.GTextField;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
        this.y = 400;
        if (this.params) {
            this._timeCount = this.params[0];
            if (this._timeCount > 0) {
                Laya.timer.loop(1000, this, this.updateTimeHandler);
                this.updateTimeHandler();
            }
        }
    }

    OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    private updateTimeHandler() {
        if (this._timeCount > 0) {
            this.timeTxt.text = DateFormatter.getSevenDateString(this._timeCount);
            this._timeCount--;
        }
        else {
            Laya.timer.clear(this, this.updateTimeHandler);
            this.hide();
        }
    }

    dispose(dispose?: boolean) {
        Laya.timer.clear(this, this.updateTimeHandler);
        this._timeCount = 0;
        super.dispose(dispose);
    }
}