// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 21:18:42
 * @LastEditTime: 2024-01-03 18:35:50
 * @LastEditors: jeremy.xu
 * @Description: 连击 废弃
 */

import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { MovieClip } from "../../../component/MovieClip";
import { BattleNotic } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import ShakeCircle from "../../../utils/ShakeCircle";
import BattleWnd from "../BattleWnd";

export class BatterHandler {
    private batterNum: fgui.GLabel;
    private damageNum: fgui.GLabel;
    private _batterAsset: MovieClip;
    // private _damageAsset: MovieClip;
    private _shake: ShakeCircle;

    private _batterDestX: number = 0;
    private _damageDestX: number = 0;

    private _exiting: boolean;

    private static EXIT_DISTANCE: number = 96;//退出移动的距离

    protected wnd: BattleWnd;
    constructor(wnd: BattleWnd) {
        this.wnd = wnd;
        // this.addEvent();
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(BattleNotic.SET_BATTER_COUNT, this.__setBatterCount.bind(this), this);
        NotificationManager.Instance.addEventListener(BattleNotic.SET_TOTAL_DAMAGE, this.__setTotalDamage.bind(this), this);
    }

    /**
     * 设置总伤害 
     * @param event
     * 
     */
    private __setTotalDamage(data: any) {
        if (this._exiting) {
            return;
        }

        // HintUtils.getNumberView(event.data, this.damageNum, this._totalDamageBitData, 30, 30, 20, 30, "0123456789.", 1);
        // this.damageNum.x = -this.damageNum.width;
    }

    /**
     * 设置连击数 
     * @param data
     * 
     */
    private __setBatterCount(data: any) {
        if (this._exiting) {
            return;
        }
        // HintUtils.getNumberView(event.data, this.batterNum, this._butterCountBitData, 80, 80, 40, 80, "0123456789.", 1);
        if (this.batterNum) {
            this.batterNum.scaleY = this.batterNum.scaleX = 1;
            this.batterNum.x = -this.batterNum.width
            this.batterNum.y = 0;
            TweenLite.from(this.batterNum, 0.2, { scaleX: 2, scaleY: 2 });
        }

        // 震动
        this._shake.shake();
    }

    public show() {
        this.reset();
        this.visible = true
        // this._damageAsset.alpha = 1;
        // TweenLite.from(this._damageAsset, 0.7, { alpha: 0, x: "-100" });
    }

    private reset() {
        this._batterAsset.alpha = 1;
        this._batterAsset.x = this._batterDestX

        // this._damageAsset.alpha = 1;
        // this._damageAsset.x = this._damageDestX;

        TweenLite.killTweensOf(this._batterAsset);
        // TweenLite.killTweensOf(this._damageAsset);

        this._exiting = false;
    }

    public hide() {
        if (this._batterAsset)
            TweenLite.to(this._batterAsset, 0.4, { alpha: 0, x: this._batterDestX + BatterHandler.EXIT_DISTANCE, onComplete: this.onExitComplete.bind(this) });
        // if (this._damageAsset)
        //     TweenLite.to(this._damageAsset, 0.4, { alpha: 0, x: this._damageDestX - BatterUIView.EXIT_DISTANCE })
        this._exiting = true;
    }

    private _visible: boolean = false
    set visible(value: boolean) {
        this._visible = value;
    }
    get visible(): boolean {
        return this._visible
    }

    private onExitComplete() {
        this._exiting = false;
        this.visible = false
    }

    public dispose() {
        this.removeEvent();
        // if (this._damageAsset) TweenLite.killTweensOf(this._damageAsset);
        if (this._batterAsset) TweenLite.killTweensOf(this._batterAsset);
        if (this.batterNum) TweenLite.killTweensOf(this.batterNum);
        ObjectUtils.disposeViolentMc(this.batterNum); this.batterNum = null;
        ObjectUtils.disposeViolentMc(this.damageNum); this.damageNum = null;
        ObjectUtils.disposeViolentMc(this._batterAsset); this._batterAsset = null;
        // ObjectUtils.disposeViolentMc(this._damageAsset); this._damageAsset = null;
        if (this._shake) this._shake.stop(); this._shake = null;
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(BattleNotic.SET_BATTER_COUNT, this.__setBatterCount.bind(this), this);
        NotificationManager.Instance.removeEventListener(BattleNotic.SET_TOTAL_DAMAGE, this.__setTotalDamage.bind(this), this);
    }
}