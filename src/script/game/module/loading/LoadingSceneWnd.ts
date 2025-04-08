// @ts-nocheck
import FUI_LoadingsSceneWnd from '../../../../fui/LoadingScene/FUI_LoadingsSceneWnd';
import Resolution from '../../../core/comps/Resolution';
import LangManager from '../../../core/lang/LangManager';
import LayerMgr from "../../../core/layer/LayerMgr";
import Logger from '../../../core/logger/Logger';
import { EmLayer } from "../../../core/ui/ViewInterface";
import HttpUtils from '../../../core/utils/HttpUtils';
import { UIZOrder } from '../../constant/UIDefine';
import { LoadingSceneEvent, NotificationEvent } from '../../constant/event/NotificationEvent';
import { NotificationManager } from '../../manager/NotificationManager';
import { PathManager } from '../../manager/PathManager';
import { isOversea } from '../login/manager/SiteZoneCtrl';

/**
* @author:shujin.ou
* @email:1009865728@qq.com
* @data: 2021-01-06 16:10
*/
export default class LoadingSceneWnd extends Laya.Sprite {

    private static _instance: LoadingSceneWnd;
    public switchSceneFlag: boolean; //标识该LOADING是否是用于切换场景的.
    private _progValue: number = 0;
    private loadComponent: fgui.GComponent;
    private progressBar: fgui.GProgressBar;
    private icon__trial: fgui.GComponent;
    private txt_progress: fgui.GTextField;
    private txt_netSpeed: fgui.GTextField;
    private mc: fgui.Transition;
    private _isShowing: boolean = false;
    public static MaskSize: number = 4000;
    protected modelMask: Laya.Sprite;//蒙版

    public showCounter = 0;
    private timeCounter = 0;

    public static get Instance(): LoadingSceneWnd {
        if (!this._instance) {
            this._instance = new LoadingSceneWnd();
        }
        return this._instance;
    }

    public get isShowing(): boolean {
        return this._isShowing;
    }

    constructor() {
        super();
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this.initView();
    }

    initView() {
        this.loadComponent = FUI_LoadingsSceneWnd.createInstance();
        if (this.loadComponent) {
            this.progressBar = this.loadComponent.getChild('progressBar').asProgress;
            this.icon__trial = this.progressBar.getChild('icon__trial').asCom;
            this.txt_progress = this.loadComponent.getChild('txt_progress').asTextField;
            this.txt_netSpeed = this.loadComponent.getChild('txt_netSpeed').asTextField;
            this.icon__trial.scaleX = 0.2;//初始缩放
            this.mc = this.progressBar.getTransition("t0");
            this.loadComponent.x = (Resolution.gameWidth - this.loadComponent.width) * .5;
            this.loadComponent.y = (Resolution.gameHeight - this.loadComponent.height) * .5;
            let isCOversea = this.loadComponent.getController("isOversea");
            isCOversea.selectedIndex = isOversea() ? 1 : 0;
            this.createModel();
            this.addChild(this.loadComponent.displayObject);
        } else {
            Logger.warn("[LoadingSceneWnd]初始化失败")
        }
    }

    protected createModel() {
        if (!this.modelMask)
            this.modelMask = new Laya.Sprite();
        this.modelMask.graphics.drawRect(0, 0, LoadingSceneWnd.MaskSize, LoadingSceneWnd.MaskSize, '#000000');
        this.modelMask.alpha = 0.3;
        this.modelMask.width = LoadingSceneWnd.MaskSize;
        this.modelMask.height = LoadingSceneWnd.MaskSize;
        this.modelMask.x = (Resolution.gameWidth - LoadingSceneWnd.MaskSize) / 2;
        this.modelMask.y = (Resolution.gameHeight - LoadingSceneWnd.MaskSize) / 2;

        this.modelMask.mouseEnabled = true;
        this.modelMask.mouseThrough = false;
        this.modelMask.on(Laya.Event.CLICK, this, (evt) => {
            Logger.error('modal click');
        })
        this.addChild(this.modelMask);
    }

    protected removeModel() {
        if (this.modelMask) {
            this.modelMask.graphics.clear();
            this.modelMask.removeSelf();
            this.modelMask.destroy();
            this.modelMask = null;
        }
    }

    public Show() {
        this.showCounter++;
        this.timeCounter = 0;
        this._isShowing = true;
        this.visible = true;
        this.active = true;

        if (this.loadComponent) {
            this.loadComponent.visible = false;
            let logActive = this.loadComponent.getController('LogoActive');
            logActive.selectedIndex = !PathManager.info.isLogoActive ? 1 : 0;
            let isCOversea = this.loadComponent.getController("isOversea");
            isCOversea.selectedIndex = isOversea() ? 1 : 0;
        } else {
            this.initView();
        }
        this.txt_netSpeed.text = "";

        this.update(1);
        LayerMgr.Instance.addToLayer(this, EmLayer.STAGE_TOP_LAYER, UIZOrder.Top);
        this.timer.frameLoop(1, this, this.onTick);
        NotificationManager.Instance.addEventListener(NotificationEvent.CHECK_NETSPEED, this.onCheckNetSpeed, this);
        HttpUtils.startCheckNetSpeed();
    }

    private onTick() {
        this.timeCounter++;
        if (this.timeCounter == 30) {
            this.loadComponent && (this.loadComponent.visible = true);
        }
    }

    private onCheckNetSpeed(speed: number) {
        this.txt_netSpeed.text = LangManager.Instance.GetTranslation("public.kbs", speed);
    }

    public Hide() {
        this.showCounter--;
        if (this.loadComponent) {
            this.loadComponent.visible = false;
        }

        this.timer.clear(this, this.onTick);
        HttpUtils.cancelCheckNetSpeed();
        NotificationManager.Instance.removeEventListener(NotificationEvent.CHECK_NETSPEED, this.onCheckNetSpeed, this);
        this._isShowing = false;
        this._progValue = 0;
        if (this.progressBar) { this.progressBar.value = 0; }
        this.visible = false;
        this.active = false;
        LoadingSceneWnd.Instance.event(LoadingSceneEvent.CLOSE);
    }

    public update(value: number, curStr: string = "", showNetSpeed:boolean = false) {
        if (!this.isShowing || !this.loadComponent)
            return;
        this._progValue = value;
        this._progValue = (this._progValue >= 100 ? 100 : this._progValue);
        // this.smoothProgress();
        this.progressBar.value = this._progValue;
        this.txt_progress.text = curStr;
        this.txt_netSpeed.visible = showNetSpeed;
        this.setIconScale(this._progValue / 100);
    }

    private mock(): number {
        return Math.random() * 2 / 10 + 0.1;
    }

    private maxCount = 10;
    private curLoadCount = 0;
    private _smoothUpdateNum: number = 0;
    /**平滑过渡加载 */
    private smoothProgress() {
        let mockTime = this.mock();
        Laya.timer.once(mockTime * 1000, this, () => {
            this._smoothUpdateNum++;
            this.progressBar.value = this._smoothUpdateNum;
            this.setIconScale(this._smoothUpdateNum / 100);
            if (this._smoothUpdateNum < 100) {
                this.smoothProgress();
            } else {
                this._smoothUpdateNum = 0;
                this.curLoadCount++;
                if (this.curLoadCount < this.maxCount)
                    this.smoothProgress();
            }
        })
    }

    private setIconScale(percent: number = 0) {
        let iconMaxWidth = 102;
        let barMaxWidth = this.progressBar.width;
        let currWidth = barMaxWidth * percent;
        let scalePercent = 1;
        if (currWidth >= iconMaxWidth) {
            scalePercent = 1;
        } else {
            scalePercent = currWidth / iconMaxWidth;
        }
        this.icon__trial.scaleX = scalePercent > 0.2 ? scalePercent : 0.2;
    }

    public resize() {
        if (this.modelMask) {
            this.modelMask.x = (Resolution.gameWidth - LoadingSceneWnd.MaskSize) / 2;
            this.modelMask.y = (Resolution.gameHeight - LoadingSceneWnd.MaskSize) / 2;
        }

        if (this.loadComponent) {
            this.loadComponent.x = (Resolution.gameWidth - this.loadComponent.width) * .5;
            this.loadComponent.y = (Resolution.gameHeight - this.loadComponent.height) * .5;
        }
    }

    dispose() {
        this._isShowing = false;
        this.removeModel();
        if (this.loadComponent) {
            LayerMgr.Instance.removeByLayer(this, EmLayer.STAGE_TOP_LAYER);
            this.loadComponent.dispose()
        }
        this.loadComponent = null;
    }


}

