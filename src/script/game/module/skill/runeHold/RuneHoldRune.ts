// @ts-nocheck

import FUI_RuneHoldRune from "../../../../../fui/Skill/FUI_RuneHoldRune";
import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUIHelper from "../../../utils/FUIHelper";
import SkillWndCtrl from "../SkillWndCtrl";
import { RuneHoldRuneItem2 } from "./RuneHoldRuneItem2";

export class RuneHoldRune extends FUI_RuneHoldRune {

    private _runesItem: RuneHoldRuneItem2[];

    private itemClickCall: Function;

    private runeHole: RuneHoleInfo;

    protected onConstruct(): void {
        super.onConstruct();
        this._runesItem = [this.rr0 as RuneHoldRuneItem2, this.rr1 as RuneHoldRuneItem2, this.rr2 as RuneHoldRuneItem2, this.rr3 as RuneHoldRuneItem2, this.rr4 as RuneHoldRuneItem2];

        for (let item of this._runesItem) {
            item.onClick(this, this.onRuneItemClick, [item]);
        }

    }

    public set info(info: RuneHoleInfo) {
        this.runeHole = info;
        this.updateView();
    }

    public get info() {
        return this.runeHole;
    }

    public updateView() {
        if (!this.runeHole) return;
        let pos = 0;
        for (let item of this._runesItem) {
            item.info = this.runeHole.getRuneByPos(pos);
            pos++;
        }
        this.updateDetailTips();
    }

    public setItemClick(call: Function) {
        this.itemClickCall = call;
    }

    private onRuneItemClick(item: RuneHoldRuneItem2) {
        if (!this.itemClickCall) return;
        this.itemClickCall(item.info, this._runesItem.indexOf(item));
    }

    private updateDetailTips() {
        if (!this.runeHole) return;
        let allProperty = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl).getAllRuneHoldPropery();
        let propertyStr = "[color=#FFC68F]" + LangManager.Instance.GetTranslation("playerInfo.runeInfo") + "[/color]";
        let haved = false;
        for (let p in allProperty) {
            if (propertyStr) propertyStr += "\n";
            propertyStr += `[color=#FFC68F]${p}[/color]: ${allProperty[p]}`;
            haved = true;
        }

        if (!haved) {
            propertyStr += "\n[color=#FFC68F]" + LangManager.Instance.GetTranslation("RuneHold.notBonus")+"[/color]";
        }

        FUIHelper.setTipData(
            this.detailBtn,
            EmWindow.CommonTips,
            propertyStr,
            new Laya.Point(-60, -85)
        )

    }


}