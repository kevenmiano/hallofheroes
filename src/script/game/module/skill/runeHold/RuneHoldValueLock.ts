// @ts-nocheck

import FUI_RuneHoldValueLock from "../../../../../fui/Skill/FUI_RuneHoldValueLock";
import LangManager from "../../../../core/lang/LangManager";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { TempleteManager } from "../../../manager/TempleteManager";

export class RuneHoldValueLock extends FUI_RuneHoldValueLock {

    private _info: RuneHoleInfo;

    public set info(info: RuneHoleInfo) {
        this._info = info;
        this.updateView()
    }

    public get info() {
        return this._info;
    }
    public updateView() {
        if (!this._info) return;
        let isOpened = this._info.checkOpenAllRune();
        this.lockImg.visible = !isOpened;
        this.expTxt.visible = isOpened;

        let curUpgrade = this._info.getUpgrade();
        let percent = curUpgrade ? curUpgrade.TemplateId : 0;
        this.expTxt.text = LangManager.Instance.GetTranslation("public.level3",percent/2);
        this.bar.fillAmount = percent/20;
    }
}