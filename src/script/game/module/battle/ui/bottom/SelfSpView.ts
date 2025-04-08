// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 10:20:37
 * @LastEditTime: 2022-08-22 17:43:51
 * @LastEditors: jeremy.xu
 * @Description: 底部英雄怒气槽
 */

import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import BattleWnd from "../../BattleWnd";

export class SelfSpView {
    private _sp: number = 0;
    private txtSp: fgui.GLabel;
    private imgSp: fgui.GImage;
    private view: BattleWnd;
    constructor(view: BattleWnd) {
        this.view = view;
        this.txtSp = this.view["txtSp"];
        this.imgSp = this.view["imgSp"];
        if (this.model) {
            this.updateHeroSp(0, 0, this.model.selfHero.spMax);
        } else {
            this.updateHeroSp(0, 0, 100);
        }
    }

    updateHeroSp(value: number, leftSp: number, maxSp: number) {
        this._sp = value;
        this.imgSp.fillAmount = value;
        this.txtSp.text = leftSp + "/" + maxSp;
    }

    public get model(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public setRotation(value: boolean) {

    }

    public dispose() {

    }
}
