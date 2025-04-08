/*
 * @Author: jeremy.xu
 * @Date: 2021-10-25 15:59:50
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-20 20:02:28
 * @Description: 英灵快捷技能
 */

import FUI_PetFastSkillItem from "../../../../../fui/BaseCommon/FUI_PetFastSkillItem";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { PetSkillItem } from "./PetSkillItem";


export default class PetFastSkillItem extends FUI_PetFastSkillItem {
    private _index: number;
    private _info: t_s_skilltemplateData;

    public get info(): t_s_skilltemplateData {
        return this._info;
    }

    public set info(value: t_s_skilltemplateData) {
        this._info = value;

        this.indexTxt.visible = !Boolean(this._info);
        (this.item as PetSkillItem).info = this._info;
    }

    public showEquipingAni(v: boolean) {
        this.selectBorder.visible = v;
        if (v) {
            this.stopBlink();
            this.startBlink()
        } else {
            this.stopBlink();
        }
    }

    private startBlink() {
        this.selectBorder.visible = true;
        this.selectBorder.alpha = 1;
        Laya.Tween.to
        TweenMax.to(this.selectBorder, 0.5, { alpha: 0.2, repeat: -1, yoyo: true, ease: Sine.easeInOut });
    }

    private stopBlink() {
        this.selectBorder.visible = false;
        TweenMax.killTweensOf(this.selectBorder)
    }

    public set selected(b: boolean) {
        this.selectFlag.visible = b;
    }

    public get selected() {
        return this.selectFlag.visible;
    }

    public set index(value: number) {
        this.indexTxt.text = value.toString();
        this._index = value - 1;
    }

    public get index(): number {
        return this._index;
    }

    dispose() {
        this.stopBlink();
        super.dispose();
    }
}