import Resolution from "../../../core/comps/Resolution";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";

/**
 * 复活等待时间
 */
export default class RvrBattlePlayerRiverWnd extends BaseWindow {
    private _timeCount: number;
    private timeTxt: fgui.GTextField;
    public OnInitWind() {
        super.OnInitWind();
        this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
        this.y = 400;
        if (this.frameData) {
            if (this.frameData.time) {
                this._timeCount = this.frameData.time;
                if (this._timeCount > 0) {
                    Laya.timer.loop(1000, this, this.updateTimeHandler);
                }
            }
        }
    }

    OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        Laya.timer.clear(this, this.updateTimeHandler);
        super.OnHideWind();
    }

    private updateTimeHandler() {
        this.timeTxt.text = DateFormatter.getSevenDateString(this._timeCount);
        this._timeCount--;
        if (this._timeCount <= 0) {
            Laya.timer.clear(this, this.updateTimeHandler);
            FrameCtrlManager.Instance.exit(EmWindow.RvrBattlePlayerRiverWnd);
        }
    }

    dispose(dispose?: boolean) {
        Laya.timer.clear(this, this.updateTimeHandler);
        this._timeCount = 0;
        super.dispose(dispose);
    }
}