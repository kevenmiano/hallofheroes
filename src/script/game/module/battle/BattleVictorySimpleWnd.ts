import Resolution from "../../../core/comps/Resolution";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";

//胜利
export default class BattleVictorySimpleWnd extends BaseWindow {
    private static inst: BattleVictorySimpleWnd = null;
    public autoCloseFun: Function;
    private _hasCallback: boolean;
    private _disposed: boolean;
    public static get Instance(): BattleVictorySimpleWnd {
        if (!this.inst) {
            this.inst = new BattleVictorySimpleWnd();
        }
        return this.inst;
    }

    public OnInitWind() {
        this.x = (Resolution.gameWidth) * .5;
        this.y = (Resolution.gameHeight) * .5;
    }

    async Show() {
        await UIManager.Instance.ShowWind(EmWindow.BattleVictorySimple);
        this.startTimer();
    }

    private startTimer() {
        Laya.timer.once(2000, this, this.onTimerComplete)
    }

    onTimerComplete() {
        this.tryCallback();
    }

    private tryCallback() {
        this.autoCloseFun && this.autoCloseFun();
        this.autoCloseFun = null;
    }

    public setData(data: any[]) {
        // this.data = data;
    }
    
    protected get modelAlpha() {
        return 0
    }

    public dispose() {
        super.dispose()
        Laya.timer.clearAll(this);
        this.tryCallback();
        BattleVictorySimpleWnd.inst = null
    }

}