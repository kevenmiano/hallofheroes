// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-06-14 20:10:44
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-06-15 11:47:06
 * @Description: 
 */


import { BattleNotic } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { MapBaseAction } from "./MapBaseAction";

export class ResistDelayAction extends MapBaseAction {
    private _resistTotal: number = 0;
    private _currentResistSide: number = -1;
    private _show: boolean;
    private _delay: number;

    constructor(show: boolean, resistTotal: number, currentResistSide: number, delay: number = 0) {
        super();
        this._show = show;
        this._resistTotal = resistTotal;
        this._currentResistSide = currentResistSide;
        this._delay = delay;
    }

    public update(): void {
        if (SceneManager.Instance.currentType != SceneType.BATTLE_SCENE) {
            this.actionOver();
            return;
        }

        if (this._count >= this._delay) {
            NotificationManager.Instance.sendNotification(BattleNotic.SET_RESIST_TOTAL_DAMAGE, this._resistTotal, this._currentResistSide);
            NotificationManager.Instance.sendNotification(BattleNotic.SET_RESIST_VISIBLE, this._show, this._currentResistSide);

            this.actionOver();
        }
        this._count++;
    }

    public prepare(): void {
    }

    public dispose(): void {
        super.dispose();
    }
}
