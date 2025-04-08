/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 10:05:43
 * @LastEditTime: 2022-08-03 17:16:18
 * @LastEditors: jeremy.xu
 * @Description: 底部英雄血条
 */
import BattleWnd from "../../BattleWnd";

export class SelfBloodView {
    private _hp: number = 0;
    private txtHp: fgui.GLabel;
    private imgHp: fgui.GImage;
    private view: BattleWnd;
    constructor(view: BattleWnd) {
        this.view = view;
        this.txtHp = this.view["txtHp"];
        this.imgHp = this.view["imgHp"];
    }

    updateHeroHp(value: number, leftBlood: number, maxBoold: number) {
        if (this._hp == value) { return; }
        this._hp = value;
        this.imgHp.fillAmount = value;
        this.txtHp.text = leftBlood + "/" + maxBoold;
    }

    public setRotation(value: boolean) {

    }

    public dispose() {

    }
}