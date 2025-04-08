import BaseWindow from '../../../core/ui/Base/BaseWindow';
import Logger from '../../../core/logger/Logger';
import { ArmyManager } from '../../manager/ArmyManager';
import Resolution from '../../../core/comps/Resolution';

/**
 * 称号获得提示
 */
export default class AppellGetTips extends BaseWindow {

    public tran1: fgui.Transition;
    public tran2: fgui.Transition;
    public tips: fgui.GTextField;
    public appellTitle: fgui.GTextField;


    public OnInitWind() {
        super.OnInitWind();
        this.addEvent();
        this.initView();
        this.x = (Resolution.gameWidth - this.contentPane.width) / 2;
        this.y = Resolution.gameHeight - this.contentPane.height;
    }

    private initView() {
        this.appellTitle.text = ArmyManager.Instance.thane.appellInfo.TitleLang;
        this.tran1 = this.contentPane.getTransition('t2');
        this.tran2 = this.contentPane.getTransition('AppellGetTips');
        // this.movie.playing = true;
        this.tran2.play(Laya.Handler.create(this, this.endFrameFun),1);
    }

    private addEvent() {
       
    }

    private endFrameFun() {
        // this.movie.playing = false;
        super.hide();
    }

    private offEvent() {

    }

    OnShowWind() {
        super.OnShowWind();
    }

    OnHideWind() {
        this.offEvent();
        super.OnHideWind();
    }
}