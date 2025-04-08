/*
 * @Author: jeremy.xu
 * @Date: 2022-12-26 12:10:00
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-10 10:32:08
 * @Description: 专门加载ui界面
 */
import FUI_LoadingsSceneWnd from '../../../../fui/LoadingScene/FUI_LoadingsSceneWnd';
import Resolution from '../../../core/comps/Resolution';
import LangManager from '../../../core/lang/LangManager';
import LayerMgr from "../../../core/layer/LayerMgr";
import Logger from '../../../core/logger/Logger';
import ResMgr from '../../../core/res/ResMgr';
import UIManager from '../../../core/ui/UIManager';
import { EmLayer } from "../../../core/ui/ViewInterface";
import HttpUtils from '../../../core/utils/HttpUtils';
import { LoadingSceneEvent, NotificationEvent } from '../../constant/event/NotificationEvent';
import { EmPackName, EmWindow, UIZOrder } from '../../constant/UIDefine';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { PathManager } from '../../manager/PathManager';
import FUIHelper from '../../utils/FUIHelper';
import { LoginManager } from '../login/LoginManager';
import { isOversea } from '../login/manager/SiteZoneCtrl';

export default class LoadingUIMgr extends Laya.Sprite {
    public get hideCloseBtnWnds() {
        return [EmWindow.Loading]
    }
    private static _instance: LoadingUIMgr;
    private _progValue: number = 0;
    private _totalResCnt: number = 0;
    private loadComponent: fgui.GComponent;
    private progressBar: fgui.GProgressBar;
    private icon__trial: fgui.GComponent;
    private txt_progress: fgui.GTextField;
    private txt_netSpeed: fgui.GTextField;
    private txt_netSpeed1: fgui.GTextField;
    private gSpeedAndProg: fgui.GGroup;
    private btnClose: fgui.GButton;
    private mc: fgui.Transition;
    private _isShowing: boolean = false;
    public static curLoadWnd: EmWindow;
    public static MaskSize: number = 4000;
    protected modelMask: Laya.Sprite;//蒙版

    public showCounter = 0;
    private timeCounter = 0;

    public cancelFunc: Function = null;
    public moduleName: EmWindow;
    public packName: EmPackName | EmPackName[];
    public loadingUIInfoArr: LoadingUIInfo[] = [];

    public static get Instance(): LoadingUIMgr {
        if (!this._instance) {
            this._instance = new LoadingUIMgr();
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
            this.loadComponent.visible = false;
            this.progressBar = this.loadComponent.getChild('progressBar').asProgress;
            this.btnClose = this.loadComponent.getChild('btnClose').asButton;
            this.icon__trial = this.progressBar.getChild('icon__trial').asCom;
            this.txt_progress = this.loadComponent.getChild('txt_progress').asTextField;
            this.txt_netSpeed = this.loadComponent.getChild('txt_netSpeed').asTextField;
            this.txt_netSpeed1 = this.loadComponent.getChild('txt_netSpeed1').asTextField;
            this.gSpeedAndProg = this.loadComponent.getChild('gSpeedAndProg').asGroup;
            this.icon__trial.scaleX = 0.2;//初始缩放
            this.mc = this.progressBar.getTransition("t0");
            this.loadComponent.x = (Resolution.gameWidth - this.loadComponent.width) * .5;
            this.loadComponent.y = (Resolution.gameHeight - this.loadComponent.height) * .5;
            let isCOversea = this.loadComponent.getController("isOversea");
            isCOversea.selectedIndex = isOversea() ? 1 : 0;
            this.createModel();
            this.addChild(this.loadComponent.displayObject);
            this.btnClose.onClick(this, this.btnCloseClick);
        } else {
            Logger.warn("[LoadingUIMgr]初始化失败")
        }
    }

    protected createModel() {
        if (!this.modelMask)
            this.modelMask = new Laya.Sprite();
        this.modelMask.graphics.drawRect(0, 0, LoadingUIMgr.MaskSize, LoadingUIMgr.MaskSize, '#000000');
        this.modelMask.alpha = 0.3;
        this.modelMask.width = LoadingUIMgr.MaskSize;
        this.modelMask.height = LoadingUIMgr.MaskSize;
        this.modelMask.x = (Resolution.gameWidth - LoadingUIMgr.MaskSize) / 2;
        this.modelMask.y = (Resolution.gameHeight - LoadingUIMgr.MaskSize) / 2;

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

    public Show(moduleName: EmWindow, packName: EmPackName | EmPackName[], completeFunc = null, progressFunc = null, cancelFunc = null, loadSlience: boolean = false) {
        let obj = new LoadingUIInfo(moduleName, packName, completeFunc, progressFunc, cancelFunc, loadSlience)
        this.loadingUIInfoArr.push(obj)
        if (!this._isShowing) {
            let obj = this.loadingUIInfoArr.shift()
            this.ShowNext(obj.moduleName, obj.packName, obj.completeFunc, obj.progressFunc, obj.cancelFunc, obj.loadSlience)
        }
    }

    private ShowNext(moduleName: EmWindow, packName: EmPackName | EmPackName[], completeFunc = null, progressFunc = null, cancelFunc = null, loadSlience: boolean = false) {
        // Logger.info("[LoadingUIMgr]Show", uiType, loadSlience)
        this.packName = packName;
        this.showCounter++;
        this.timeCounter = 0;
        this._isShowing = true;
        this.visible = true;
        this.active = true;
        this.alpha = loadSlience ? 0 : 1;
        this.moduleName = moduleName;
        this.cancelFunc = cancelFunc;
        this._totalResCnt = 0;

        if (this.loadComponent) {
            this.loadComponent.visible = false;
            let logActive = this.loadComponent.getController('LogoActive');
            logActive.selectedIndex = !PathManager.info.isLogoActive ? 1 : 0;
            let isCOversea = this.loadComponent.getController("isOversea");
            isCOversea.selectedIndex = isOversea() ? 1 : 0;
        } else {
            this.initView();
        }
        this.txt_netSpeed.text = ""
        this.txt_netSpeed1.text = ""

        LayerMgr.Instance.addToLayer(this, EmLayer.STAGE_TOP_LAYER, UIZOrder.Top);
        this.timer.frameLoop(1, this, this.onTick);
        NotificationManager.Instance.addEventListener(NotificationEvent.CHECK_NETSPEED, this.onCheckNetSpeed, this);
        HttpUtils.startCheckNetSpeed();

        this.update(1);
        let resKeyArr = FUIHelper.getFUIPackPathByName(packName);
        fgui.UIPackage.loadPackage(resKeyArr, Laya.Handler.create(this, (res) => {
            if (!res || (Array.isArray(res) && res.length == 0)) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ResMgr.loadPackage"));
            }
            this.Hide();
            completeFunc && completeFunc(res);
            let obj = this.loadingUIInfoArr.shift()
            if (obj) {
                this.ShowNext(obj.moduleName, obj.packName, obj.completeFunc, obj.progressFunc, obj.cancelFunc, obj.loadSlience)
            }
        }), Laya.Handler.create(this, (value) => {
            if (value == 0) {
                ResMgr.Instance.addFUIPackageByResKey(resKeyArr);
                this._totalResCnt = FUIHelper.getFUIPackResCountByResKey(resKeyArr);
            }
            // Logger.info("packName", packName, value, this._totalResCnt)

            this.update(value * 100);
            progressFunc && progressFunc(value);
        }, null, false));
    }

    private onTick() {
        this.timeCounter++;
        if (this.timeCounter == 30) {
            if (this.loadComponent) {
                this.loadComponent.visible = true;
                this.btnClose.visible = this.checkBtnCloseVisible;
            }
        }
    }

    private onCheckNetSpeed(speed: number) {
        let str = LangManager.Instance.GetTranslation("public.kbs", speed);
        this.txt_netSpeed.text = str
        this.txt_netSpeed1.text = str
    }

    private get checkBtnCloseVisible() {
        return false;
        return LoginManager.Instance.hasLogin && this.hideCloseBtnWnds.indexOf(this.moduleName) == -1
    }

    public Hide() {
        this.showCounter--;
        if (this.loadComponent) {
            this.btnClose.visible = false;
            this.loadComponent.visible = false;
        }
        this.timer.clear(this, this.onTick);
        HttpUtils.cancelCheckNetSpeed();
        NotificationManager.Instance.removeEventListener(NotificationEvent.CHECK_NETSPEED, this.onCheckNetSpeed, this);
        this._isShowing = false;
        this.cancelFunc = null;
        this.packName = null;
        this._progValue = 0;
        if (this.progressBar) { this.progressBar.value = 0; }
        this.visible = false;
        this.active = false;
        LoadingUIMgr.Instance.event(LoadingSceneEvent.CLOSE);
    }

    private update(value: number) {
        if (!this.isShowing || !this.loadComponent)
            return;
        this._progValue = value;
        this._progValue = (this._progValue >= 100 ? 100 : this._progValue);
        // this.smoothProgress();
        this.progressBar.value = this._progValue;
        this.setIconScale(this._progValue / 100);

        this.txt_netSpeed1.visible = !Boolean(this._totalResCnt);
        this.gSpeedAndProg.visible = Boolean(this._totalResCnt);
        if (this._totalResCnt) {
            let per = Math.floor(100 / this._totalResCnt);
            let cur = Math.floor(this._progValue / per);
            this.txt_progress.text = cur + "/" + this._totalResCnt;
        } else {
            this.txt_progress.text = ""
        }
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

    private btnCloseClick() {
        this.forceHide()
    }

    public forceHide() {
        if (!this._isShowing) return;
            
        for (let index = 0; index < this.loadingUIInfoArr.length; index++) {
            const obj = this.loadingUIInfoArr[index];
            Logger.info("强制关闭未加载的界面: ", obj.moduleName)
        }
        this.loadingUIInfoArr = [];

        this.cancelFunc && this.cancelFunc();
        
        Logger.info("强制关闭正在加载的界面: ", this.packName)
        if (Array.isArray(this.packName)) {
            this.packName.forEach(ele => {
                if (UIManager.Instance.checkReleaseModuleRes(ele)) {
                    ResMgr.Instance.cancelUnloadFairyGui(ele);
                }
            });
        } else {
            if (UIManager.Instance.checkReleaseModuleRes(this.packName)) {
                ResMgr.Instance.cancelUnloadFairyGui(this.packName);
            }
        }

        this.Hide();
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


class LoadingUIInfo {
    moduleName: EmWindow;
    packName: EmPackName | EmPackName[];
    completeFunc = null;
    progressFunc = null;
    cancelFunc = null;
    loadSlience: boolean = false
    constructor(moduleName: EmWindow, packName: EmPackName | EmPackName[], completeFunc = null, progressFunc = null, cancelFunc = null, loadSlience: boolean = false) {
        this.moduleName = moduleName;
        this.packName = packName;
        this.completeFunc = completeFunc;
        this.progressFunc = progressFunc;
        this.cancelFunc = cancelFunc;
        this.loadSlience = loadSlience;
    }
}