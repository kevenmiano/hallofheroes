// @ts-nocheck
import Resolution from "../../../core/comps/Resolution";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2022/2/8 12:16
 * @ver 1.0
 */
export class HintWnd extends BaseWindow {
    public bg: fgui.GImage;
    private txt_hint: fgui.GTextField;
    private group: fgui.GGroup;

    private _info: string;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this._info = this.params;
        this.setCenter();
    }

    protected OnClickModal() {
    }

    public OnShowWind() {
        super.OnShowWind();
        this.setHintText(this._info);
        FrameCtrlManager.Instance.exit(EmWindow.Waiting);
    }

    public setHintText(value: string = "") {
        this.txt_hint.text = value;
        this.group && this.group.ensureBoundsCorrect();
        /**contentPane 会出现 null 值。不可复现。**/
        if (!this.contentPane) return;
        this.x = (Resolution.gameWidth - this.contentPane.width) / 2;
        this.y = (Resolution.gameHeight - this.contentPane.height) / 2;
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}