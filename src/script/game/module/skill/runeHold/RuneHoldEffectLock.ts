// @ts-nocheck

import FUI_RuneHoldEffectLock from "../../../../../fui/Skill/FUI_RuneHoldEffectLock";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { CommonConstant } from "../../../constant/CommonConstant";
import { EmPackName } from "../../../constant/UIDefine";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";

export class RuneHoldEffectLock extends FUI_RuneHoldEffectLock {

    private _info: RuneHoleInfo;

    public set info(info: RuneHoleInfo) {
        this._info = info;
        this.updateView();
    }

    public get info() {
        return this._info;
    }

    public updateView() {
        if (!this._info) return;
        let isOpened = this._info.checkOpenAllRune();
        this.lockImg.visible = !isOpened;
        this.skillIcon.visible = false;
        this.profile.visible = false;
        if (this._info.skill) {
            this.skillIcon.visible = true;
            this.profile.visible = true;
            this.skillIcon.url = IconFactory.getCommonIconPath(this._info.getSkillInfo().templateInfo.Icons);
            let res = CommonConstant.QUALITY_RES[this._info.getSkillInfo().templateInfo.Grades-1];
            this.profile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);
        }

    }

}