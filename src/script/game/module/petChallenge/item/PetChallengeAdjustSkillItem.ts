// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-06-12 11:25:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-21 15:38:07
 * @Description: 阵型英灵技能
 */
import FUI_PetChallengeAdjustSkillItem from "../../../../../fui/PetChallenge/FUI_PetChallengeAdjustSkillItem";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";

export class PetChallengeAdjustSkillItem extends FUI_PetChallengeAdjustSkillItem {

    private _index = 0;

    private _info: t_s_skilltemplateData;

    protected onConstruct(): void {
        super.onConstruct();
    }

    public get info() {
        return this._info;
    }

    public set info(v: t_s_skilltemplateData) {
        this._info = v;
        if (v) {
            this._icon.url = IconFactory.getCommonIconPath(v.Icons);
        } else {
            this._icon.url = "";
        }
    }

    public get index() {
        return this._index;
    }

    public set index(v: number) {
        this._index = v;
    }
}