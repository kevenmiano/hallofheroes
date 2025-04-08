import GameEventDispatcher from "../../../core/event/GameEventDispatcher";

/**
 * 挑战超过时间, 伤害提高
 * @author yuanzhan.yu
 */
export class HurtUpMode extends GameEventDispatcher {
    private _countDown: number = 0;//时间（秒）, 超过这个时间, 伤害增加
    private _damageImprove: number = 0;//每次提高的伤害比例
    private _startDate: Date;
    private _total: number = 0;
    public battleType: number = 0;

    constructor() {
        super();
    }

    public reset(countDown: number, damageImprove: number = 0) {
        countDown = Math.floor(countDown)
        this._total = countDown;
        this._countDown = countDown;
        //_damageImprove = damageImprove;
        this._damageImprove += damageImprove
        this._startDate = new Date();

        Laya.timer.clear(this, this.onTimer)
        Laya.timer.loop(10, this, this.onTimer)
        this.dispatchEvent(Laya.Event.CHANGE);
    }

    private onTimer() {
        var date: Date = new Date();
        var past: number = date.getTime() - this._startDate.getTime();
        past = Math.floor(past / 1000);
        var left: number = this._total - past;
        if (this._countDown > left) {
            this._countDown--;
            this.dispatchEvent(Laya.Event.CHANGE);
        }
        if (this._countDown < 1) {
            Laya.timer.clearAll(this);
        }
    }

    /**
     * 获得剩余时间(秒).
     * @return
     *
     */
    public getTimeLeft(): number {
        return this._countDown;
    }

    /**
     * 获得伤害的提高值
     * @return
     *
     */
    public getDamageImprove(): number {
        return this._damageImprove;
    }

    public dispose() {
        Laya.timer.clearAll(this);
    }
}