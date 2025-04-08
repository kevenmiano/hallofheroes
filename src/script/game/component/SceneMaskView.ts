// @ts-nocheck
import { Disposeable } from './DisplayObject';
import FUIHelper from '../utils/FUIHelper';
import { EmPackName, EmWindow } from '../constant/UIDefine';
import Resolution from '../../core/comps/Resolution';
import { CampaignManager } from '../manager/CampaignManager';
/**
* @author:pzlricky
* @data: 2021-06-21 19:52
* @description 副本剧情时的一个遮罩 由上下两部分组成
*/
export default class SceneMaskView extends Laya.Sprite implements Disposeable {
    private _topBg: fgui.GImage;
    private _bottomBg: fgui.GImage;
    constructor() {
        super();
        this.initView();
        this.initEvent();
    }
    private initView() {
        this.size(Resolution.gameWidth, Resolution.gameHeight);
        this._topBg = FUIHelper.createFUIInstance(EmPackName.Base, 'asset.core.novice.dialogUPImg');
        this._topBg.alpha = 0;
        this._topBg.height = 125;
        this._topBg.width = Resolution.gameWidth;

        this._bottomBg = FUIHelper.createFUIInstance(EmPackName.Base, 'asset.core.novice.dialogImg');
        this._bottomBg.alpha = 0;
        this._bottomBg.height = 150;
        this._bottomBg.width = Resolution.gameWidth;
        this.addChild(this._topBg.displayObject);
        this.addChild(this._bottomBg.displayObject);

        this._bottomBg.y = Resolution.gameHeight - 150;
        this.__stageResizeHandler(null);

        this._topBg.displayObject.mouseEnabled = true;
        this._bottomBg.displayObject.mouseEnabled = true;
        this.mouseEnabled = true;

        // 解决弹出遮罩的瞬间 快速点击地图导致角色一直跟随鼠标移动, 导致的BUG
        if(CampaignManager.Instance.mapView){
            CampaignManager.Instance.mapView.event(Laya.Event.MOUSE_UP)
        }
    }

    private initEvent() {
        Laya.stage.on(Laya.Event.RESIZE, this, this.__stageResizeHandler);
        this.on(Laya.Event.DISPLAY, this, this.__addToStageHandler);
    }

    private removeEvent() {
        Laya.stage.off(Laya.Event.RESIZE, this, this.__stageResizeHandler);
        this.off(Laya.Event.DISPLAY, this, this.__addToStageHandler);
    }

    private __addToStageHandler(evt: Event) {
        TweenMax.to(this._topBg, 0.5, { alpha: 1 });
        TweenMax.to(this._bottomBg, 0.5, { alpha: 1 });
    }

    private __stageResizeHandler(evt: Event) {
        this._topBg.width = Resolution.gameWidth;
        this._bottomBg.width = Resolution.gameWidth;
        this._bottomBg.y = Resolution.gameHeight - 150;
    }
    
    public dispose() {
        this.removeEvent();
        if (this._topBg){
            TweenMax.killTweensOf(this._topBg)
            this._topBg.dispose(); 
            this._topBg = null;
        } 
        if (this._bottomBg){
            TweenMax.killTweensOf(this._bottomBg)
            this._bottomBg.dispose(); 
            this._bottomBg = null;
        } 
        this.removeSelf();
    }
}