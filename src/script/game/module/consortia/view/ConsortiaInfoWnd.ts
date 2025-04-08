// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-20 20:59:34
 * @Description: 公会招收详细信息 v2.46 ConsortiaInfoFrame 已调试
 */

import SoundManager from "../../../../core/audio/SoundManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { SoundIds } from "../../../constant/SoundIds";
import { ConsortiaSocektSendManager } from "../../../manager/ConsortiaSocektSendManager";
import { ConsortiaInfo } from "../data/ConsortiaInfo";

export class ConsortiaInfoWnd extends BaseWindow {

    public frame:fgui.GLabel;
    public addConsortiaBtn: fgui.GButton;
    public nameTxt: fgui.GTextField;
    public levelTxt: fgui.GTextField;
    public numTxt: fgui.GTextField;
    public chairmanTxt: fgui.GTextField;
    public wealthTxt: fgui.GTextField;
    public honorTxt: fgui.GTextField;
    public discriptionTxt: fgui.GTextField;
    private _consortiaInfo: ConsortiaInfo;
    public OnInitWind() {
        super.OnInitWind();
        if (this.frameData) {
            if (this.frameData.info) {
                this._consortiaInfo = this.frameData.info;
            }
        }
        this.frame.getChild('helpBtn').visible = false;
        this.setCenter();
        this.initEvent();
        this.initView();
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private initEvent() {
        this.addConsortiaBtn.onClick(this, this.addConsortiaBtnHandler);
    }

    private removeEvent() {
        this.addConsortiaBtn.offClick(this, this.addConsortiaBtnHandler);
    }

    private initView() {
        this.nameTxt.text = this._consortiaInfo.consortiaName;
        this.chairmanTxt.text = this._consortiaInfo.chairmanName;
        this.levelTxt.text = this._consortiaInfo.levels.toString();
        this.wealthTxt.text = this._consortiaInfo.offer.toString();
        this.numTxt.text = this._consortiaInfo.currentCount.toString();
        this.honorTxt.text = this._consortiaInfo.consortiaMaterials.toString();
        this.discriptionTxt.text = this._consortiaInfo.description;
    }

    addConsortiaBtnHandler() {
        SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
        ConsortiaSocektSendManager.applyJoinConsortia(this._consortiaInfo.consortiaId);
        this.hide();
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}