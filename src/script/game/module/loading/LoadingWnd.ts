// @ts-nocheck
import ConfigMgr from '../../../core/config/ConfigMgr';
import LangManager from '../../../core/lang/LangManager';
import LanguageAnalyzer from '../../../core/lang/LanguageAnalyzer';
import { SocketManager } from '../../../core/net/SocketManager';
import ResMgr from '../../../core/res/ResMgr';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIManager from '../../../core/ui/UIManager';
import HttpUtils from '../../../core/utils/HttpUtils';
import Utils from '../../../core/utils/Utils';
import { ConfigType, ConfigUrl } from '../../constant/ConfigDefine';
import { EmPackName, EmWindow, ResType } from '../../constant/UIDefine';
import { NotificationEvent, StartupEvent } from '../../constant/event/NotificationEvent';
import { BaseManager } from '../../manager/BaseManager';
import { ChatManager } from '../../manager/ChatManager';
import { EnterFrameManager } from '../../manager/EnterFrameManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { PathManager } from '../../manager/PathManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import ComponentSetting from '../../utils/ComponentSetting';
import NewbieModule from '../guide/NewbieModule';
import LoginInitDataAccept from '../login/LoginInitDataAccept';
import { isOversea } from '../login/manager/SiteZoneCtrl';
import LoadingUIMgr from './LoadingUIMgr';


/**
 * 进入游戏资源加载和数据请求
 */
export class LoadingWnd extends BaseWindow {
    private static _instance: LoadingWnd;
    public static get getInstance(): LoadingWnd {
        if (!this._instance) {
            this._instance = new LoadingWnd();
        }
        return this._instance;
    }

    protected resizeContent = true;
    private _userInfo: any;
    private _config: any;
    private _step: number = 0;
    private _maxstep: number = 3;
    private _resourcesList: Array<Laya.loadItem> = [];
    private _proObj: Object = {};
    private _curLoadCount: number = 0;
    private _needLoadCount: number = 0;
    private _loadIsStarted: boolean = false;
    private _loadIsCompleted: boolean = false;
    private _isPreload: boolean;

    private progressBar: fgui.GProgressBar;
    private progressText: fgui.GComponent;
    private netSpeedText: fgui.GTextField;
    private loadingBg: fgui.GLoader;

    private isOversea: fgui.Controller;



    OnInitWind(): void {
        super.OnInitWind();
        this.isOversea = this.getController("isOversea");
        this.isOversea.selectedIndex = isOversea() ? 1 : 0;
    }


    async instShow($userInfo: Object, $config: any = null, $isPreload: boolean = false) {
        this._proObj = {};
        this._isPreload = $isPreload;
        this._userInfo = $userInfo;
        this._config = $config;
        BaseManager.Instance.isRigister = this._userInfo.isActive;
        if (!this._isPreload && this._loadIsCompleted) {
            this.reqLoginInitData();
            return;
        }
        if (this._loadIsStarted) return;
        this._loadIsStarted = true;
        EnterFrameManager.Instance.setup();
        await UIManager.Instance.ShowWind(EmWindow.Loading);
        FrameCtrlManager.Instance.exit(EmWindow.Login);
        FrameCtrlManager.Instance.exit(EmWindow.Waiting);
        FrameCtrlManager.Instance.exit(EmWindow.RegisterS);
        LoadingUIMgr.Instance.forceHide();
    }

    async instHide() {
        await UIManager.Instance.HideWind(EmWindow.Loading)
    }

    public OnShowWind() {
        super.OnShowWind();
        this._step = 0;
        this._userInfo = null;
        this._config = null;
        this._resourcesList = null;
        this._proObj = null;
        this._loadIsStarted = false;
        this._loadIsCompleted = false;
        this._isPreload = false;
        this.randomBackground();
        this.startLoader();
        NotificationManager.Instance.addEventListener(NotificationEvent.CHECK_NETSPEED, this.onCheckNetSpeed, this);
        HttpUtils.startCheckNetSpeed();
    }

    public OnHideWind() {
        super.OnHideWind();
        ChatManager.Instance.loadEmojiAssets();
        HttpUtils.cancelCheckNetSpeed();
        NotificationManager.Instance.removeEventListener(NotificationEvent.CHECK_NETSPEED, this.onCheckNetSpeed, this);
    }

    /**随机背景图 */
    randomBackground() {
        let bgCount = 4;
        if (isOversea()) {//加载背景图区分
            bgCount = 4;
        } else {
            bgCount = 4;
        }
        let randomNumber = Utils.randomInt(0, bgCount - 1);
        if (this.loadingBg && !this.loadingBg.isDisposed) {
            let imagePath = PathManager.getLoadingBgPath(randomNumber);
            ResMgr.Instance.loadRes(imagePath, () => {
                this.loadingBg.url = imagePath;
            })
        }
    }

    /**开始加载资源 */
    startLoader() {
        let self = this;
        this.updateProObj(0, this._maxstep, this.getStepTips(this._step));
        switch (this._step) {
            case 0://加载配置表等资源
                this.loadResources();
                break;
            case 1:
                //解析语言表 先放这
                this.parseLangResources();
                //加载新手
                this.loadNewbie();
                break;
            case 2://正在准备数据
                this.reqLoginInitData();
                break;
            case 3://初始化游戏
                this.initlizationGame();
                break;
        }
    }

    /**加载资源 */
    private loadResources() {
        this._resourcesList = [];

        //加载UI队列资源
        let groupRes: string[] = [
            EmPackName.Font,
            EmPackName.Base,
            EmPackName.BaseCommon,
            EmPackName.Newbie,
            EmPackName.Space,
            EmPackName.Dialog,
            EmPackName.Home,
            EmPackName.Battle,
            EmPackName.OuterCity,
            EmPackName.BattleDynamic,
            EmPackName.CampaignCommon,
        ];
        for (const key in groupRes) {
            if (Object.prototype.hasOwnProperty.call(groupRes, key)) {
                let item = { key: key, url: groupRes[key], type: ResType.FGUI };
                this._resourcesList.push(item);
            }
        }

        if (!ComponentSetting.configZip) {//非zip模式
            //加载游戏所需配置表文件
            for (const key in ConfigUrl) {
                if (Object.prototype.hasOwnProperty.call(ConfigUrl, key)) {
                    if (key !== ConfigType.config) {//合并配置表此时不需要加载
                        let item = { key: key, url: ComponentSetting.CONFIG_PREFIX + ConfigUrl[key].url, type: ResType.JSON };
                        this._resourcesList.push(item);
                    }
                }
            }
        } else {//如果configZip模式,则下载压缩包
            let item = { key: ConfigType.config, url: ComponentSetting.configZipUrl + ConfigUrl[ConfigType.config].url, type: ResType.ZIP_CONFIG };
            this._resourcesList.push(item);
        }

        this._curLoadCount = 0;
        this._needLoadCount = this._resourcesList.length;
        this.loadNextResource();
    }

    private loadNextResource() {
        let resItem = this._resourcesList && this._resourcesList.shift();
        if (!resItem) {
            this.onResourcesLoadProgress();
            return;
        }
        switch (resItem.type) {
            case ResType.ZIP_CONFIG:
                //@ts-ignore
                ConfigMgr.Instance.loadZip(resItem.key, this.onResourcesLoadProgress.bind(this));
                break;
            case ResType.JSON:
                //@ts-ignore
                ConfigMgr.Instance.load(resItem.key, this.onResourcesLoadProgress.bind(this));
                break;
            case ResType.FGUI:
                //@ts-ignore
                ResMgr.Instance.loadFairyGui(resItem.url, this.onResourcesLoadProgress.bind(this))
                break;
            default:
                ResMgr.Instance.loadRes(resItem.url, this.onResourcesLoadProgress.bind(this));
                break;
        }
    }

    /**加载新手 */
    private loadNewbie() {
        NewbieModule.Instance.setup();
        this._step++;
        this.startLoader();
    }

    private onLoadingProgress() {
        this.updateProObj(this._curLoadCount, this._needLoadCount, this.getStepTips(this._step));
    }

    private onCheckNetSpeed(speed: number) {
        this.netSpeedText.text = LangManager.Instance.GetTranslation("public.kbs", speed);
    }

    private parseLangResources() {
        // 初始化语言配置表
        let analyzer = new LanguageAnalyzer(() => {
            LangManager.Instance.setup(analyzer);
        });
        analyzer.analyze(ConfigMgr.Instance.getSync(ConfigType.language));
    }

    private onTemplateSetupComplete() {
        // TempleteManager.Instance.initTemplate();
        this._step++;
        this.startLoader();
    }

    /**请求初始化数据 */
    private reqLoginInitData() {
        this._loadIsCompleted = true;
        NotificationManager.Instance.dispatchEvent(StartupEvent.CORE_LOAD_COMPLETE);
        if (this._isPreload) return;
        SocketManager.Instance.acceptData = true;
        this._curLoadCount = 0;
        this._needLoadCount = LoginInitDataAccept.total;
        new LoginInitDataAccept().losyBackCall(this.onLoginInitDataAcceptComplete.bind(this));
    }

    /**登录游戏初始化数据完成 */
    private onLoginInitDataAcceptComplete(finishCount: number = 0) {
        this._curLoadCount = finishCount;
        if (this._curLoadCount >= this._needLoadCount) {
            this._curLoadCount = this._needLoadCount = 0;
            this._step++;
            this.startLoader();
            LoginInitDataAccept.loginOverRequest();
            return;
        }
        this.onLoadingProgress();
    }

    private initlizationGame() {
        NotificationManager.Instance.dispatchEvent(StartupEvent.CORE_SETUP_COMPLETE);
    }

    /**加载资源完成 */
    private onResourceLoadComplete() {
        if (this._curLoadCount < this._needLoadCount)
            return;
        this._step++;
        this.startLoader();
    }

    /**加载资源过程 */
    private onResourcesLoadProgress() {
        this._curLoadCount++;
        if (this._curLoadCount >= this._needLoadCount) {
            this._curLoadCount = this._needLoadCount = 0;
            this.onResourceLoadComplete();
            return;
        }
        this.onLoadingProgress();
        this.loadNextResource();
    }

    private updateProObj(curCount: number = -1, maxCount: number = -1, tips: string = null) {
        let self = this;
        if (!this.isShowing) {
            return;
        }
        if (!this._proObj) this._proObj = {};
        if (maxCount >= 0) this._proObj["totalPro"] = curCount * 100;
        if (maxCount >= 0) this._proObj["subPro"] = maxCount;
        if (tips != null) this._proObj["subProName"] = tips;

        (self.progressText).text = tips + parseInt((curCount * 100 / maxCount).toString()) + '%';
        self.progressBar.value = curCount * 100 / maxCount;
    }

    getStepTips(step: number): string {
        let tip = ""
        if (this._step == 0 || this._step == 1) {
            // tip = "(" + this._curLoadCount + "/" + this._needLoadCount + ")";
            tip = this._curLoadCount + "/" + this._needLoadCount;
        }
        switch (step) {
            case 0:
                return LangManager.Instance.GetTranslation("loading.tip.loading", tip);
            case 1:
                return LangManager.Instance.GetTranslation("loading.tip.newbCamp", tip);

            case 2:
                return LangManager.Instance.GetTranslation("loading.tip.preData");

            case 3:
                return LangManager.Instance.GetTranslation("loading.tip.initGame");

        }
        return '';
    }
}