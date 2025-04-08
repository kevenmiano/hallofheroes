// @ts-nocheck
import { JobType } from "../../constant/JobType";
import { EmWindow } from "../../constant/UIDefine";
import FUIHelper from "../../utils/FUIHelper";

/**
 * date: 2021.5.14
 * description : 蓄气效果.英雄使用技能后,脚底下会出现光圈效果.
 * 当QTE输入正确时,调用updateToQteState方法后,人物身上会变换为更炫的一种效果.
 **/
export default class CollectionEffect {

    private _backContainer: Laya.Sprite;
    private _frontContainer: Laya.Sprite;

    private _resMc: fgui.GComponent;
    private _backEffectMovie: fgui.GComponent;
    private _backEffect: fgui.Transition;

    private _frontEffectMovie: fgui.GComponent;
    private _frontEffect: fgui.Transition;

    private _job: number;
    //职业类型
    constructor(backContainer: Laya.Sprite, frontContainer: Laya.Sprite, job: number = 1) {
        this._backContainer = backContainer;
        this._frontContainer = frontContainer;
        this._job = job;
        this.show();
    }

    private show() {
        this._backEffectMovie = FUIHelper.createFUIInstance(EmWindow.BattleDynamic, "asset_battle_CollectGasAsset") as fgui.GComponent;
        if(this._backEffectMovie) {
            this._backEffect = this._backEffectMovie.getTransition("backEffect");
            this._backEffectMovie.displayObject.mouseEnabled = this._backEffectMovie.displayObject.mouseThrough = false;
            this._backContainer.addChild(this._backEffectMovie.displayObject);
            this._backEffectMovie.displayObject.x = -70;
            this._backEffectMovie.displayObject.y = -15;
            //播放0.5秒-1.5秒部分的动效, 即0.5秒（包含）-1.5秒（包含）之间的所有帧。
            this._backEffect.play(null, -1, 0, 0, 0.417);//0.417在fgui UI工程中查看  动效第10帧
        }
    }

    /**循环播放0-10帧回调 */
    onPlayBackEffect() {
    }

    /**
     * 播放QTE输入正确后的效果. 
     * 
     */
    public updateToQteState() {
        if (this._frontEffect) {
            return;
        }

        this._frontEffectMovie = FUIHelper.createFUIInstance('Battle', this.getFrontEffectLinkName());
        this._frontEffect = this._frontEffectMovie.getTransition('frontEffect');
        if (this._job == JobType.WIZARD)
            this._backContainer.addChild(this._frontEffectMovie.displayObject);
        else
            this._frontContainer.addChild(this._frontEffectMovie.displayObject);

        this._frontEffectMovie.displayObject.mouseEnabled = this._frontEffectMovie.displayObject.mouseThrough = false;
        this._frontEffect.setValue("qte");
        //播放0.5秒-1.5秒部分的动效, 即0.5秒（包含）-1.5秒（包含）之间的所有帧。
        this._frontEffect.play(Laya.Handler.create(this, this.onPlayFrontEffect), 1, 0, 0.5, 1.5);
    }

    onPlayFrontEffect() {

    }

    /**
     * 根据职业返回续气资源名字 
     * @return 
     */
    private getFrontEffectLinkName(): string {
        if (this._job == JobType.WIZARD)
            return "asset.battle.CollectGasWizardAsset";
        else if (this._job == JobType.HUNTER)
            return "asset.battle.CollectGasHunterAsset";
        else
            return "asset.battle.CollectGasFrontAsset";
    }


    public dispose() {
        if (this._frontEffect) {
            this._frontEffectMovie.displayObject.removeSelf();
            this._frontEffectMovie = null;
            this._frontEffect.setPaused(true);
            this._frontEffect = null;
        }
        if (this._backEffect) {
            this._backEffectMovie.displayObject.removeSelf();
            this._backEffectMovie = null;
            this._backEffect.setPaused(true);
            this._backEffect = null;
        }
        this._frontContainer = null;
        this._backContainer = null;
    }

}