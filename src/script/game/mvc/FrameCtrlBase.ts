// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-06 15:33:57
 * @LastEditTime: 2024-03-08 17:57:37
 * @LastEditors: jeremy.xu
 * @Description: UI控制基类
 */
import LayerMgr from '../../core/layer/LayerMgr';
import Logger from "../../core/logger/Logger";
import BaseWindow from "../../core/ui/Base/BaseWindow";
import UIManager from "../../core/ui/UIManager";
import { EmLayer } from "../../core/ui/ViewInterface";
import ObjectTranslator from "../../core/utils/ObjectTranslator";
import { EmWindow } from '../constant/UIDefine';
import LoadingUIMgr from '../module/loading/LoadingUIMgr';
import FrameCtrlInfo from "./FrameCtrlInfo";
import { FrameCtrlManager } from "./FrameCtrlManager";
/**
 * 负责UI的加载、显示、隐藏
 */
export default class FrameCtrlBase {

    public view: any //BaseWindow;
    public data: any; //FrameDataBase;

    protected _info: FrameCtrlInfo;
    protected _nextModule: EmWindow;
    protected _nextInfo: FrameCtrlInfo;
    protected _loadDataFlag: boolean = false;

    public open(info: FrameCtrlInfo = null) {
        this._info = info;
        this._loadDataFlag = true;
        this.addDataListener()
        this.startPreLoadData();
    }

    public exit(nextModule?: EmWindow, nextInfo?: FrameCtrlInfo) {
        this.setNextFrame(nextModule, nextInfo)
        this.hide()
    }

    // 预加载 数据等 
    protected startPreLoadData() {
        this.preLoadDataComplete()
    }

    // 预加载 资源
    protected startPreLoadRes() {
        LoadingUIMgr.Instance.Show(this._info.moduleName, this.packNameList,
            (res) => {
                if (!res || (Array.isArray(res) && res.length == 0)) {
                    this.loadFailed();
                } else {
                    this.show();
                }
            }, null, () => {
                this.loadFailed(true);
            })
    }

    protected loadFailed(cancel: boolean = false) {
        Logger.warn("[FrameCtrlBase]加载失败", this._info.moduleName)
        this.delDataListener();
        FrameCtrlManager.Instance.curOpeningModuleMap.delete(this._info.moduleName);
    }

    public get packNameList() {
        if (!this._info) return [];
        let uiInfo = UIManager.Instance.getUIInfo(this._info.moduleName)
        let groupRes = [uiInfo.packName]
        let resList = this._info.resList
        if (resList) {
            for (let index = 0; index < resList.length; index++) {
                const packName = resList[index];
                groupRes.push(packName)
            }
        }
        return groupRes
    }

    // 加载数据 完成
    protected preLoadDataComplete() {
        this._loadDataFlag = false;
        this.startPreLoadRes();
    }

    // override show之前处理数据
    protected initDataPreShow() {

    }
    
    // override hide之前处理数据
    protected clearDataPreHide() {

    }
    
    // override
    protected show() {
        FrameCtrlManager.Instance.curOpeningModuleMap.delete(this._info.moduleName);
        this.initDataPreShow();
        this.data && this.data.show();
        this.ShowWind(this._info.moduleName, this._info);
    }

    // override
    /**
     * 
     * @param dispose  是否强制销毁
     */
    protected hide() {
        this.delDataListener()
        this.clearDataPreHide()
        this.data && this.data.hide()
        this.HideWind()

        if (this._nextModule) {
            this.openPreFrame();
            this._nextModule = null;
            this._nextInfo = null;
        }
    }

    // override
    protected addEventListener() {
        // this._view.addEventListener(Component.DISPOSE, this.__disposeHandler);
        // this._view.addEventListener(ComponentEvent.GROUP_CONFLICT, this.__groupExistHandler);

    }
    // override
    protected delEventListener() {

    }

    // override  打开界面还未加载UI时候需要添加的监听
    protected addDataListener() {

    }
    // override
    protected delDataListener() {

    }

    // override
    public dispose() {
        this._loadDataFlag = false;
        this.data && this.data.dispose();
        this.view = null;
    }

    public setNextFrame(moduleName: EmWindow, frameInfo: FrameCtrlInfo = null) {
        if (moduleName) {
            this._nextModule = moduleName;
            this._nextInfo = frameInfo;
        }
    }

    // 关闭自身 打开 下一个窗口
    private openPreFrame() {
        FrameCtrlManager.Instance.open(this._nextModule, this._nextInfo);
    }

    public get moduleName(): EmWindow {
        return this._info ? this._info.moduleName : null
    }

    public get preModuleName(): EmWindow {
        return this._nextModule;
    }

    public get frameData(): any {
        return this._info ? this._info.frameData : null
    }


    /** 移植 UIManager的ShowWind
     * @param type 界面类型
     * @param param 界面数据
     */
    private ShowWind(type: EmWindow, param = null, showLayer?: EmLayer): BaseWindow {
        let uiInfo = UIManager.Instance.getUIInfo(type);
        if (!uiInfo) {
            Logger.error('无相关UI信息!!!  ' + type);
            return;
        }

        //防止重复打开
        if (UIManager.Instance.isSingle(type)) {
            Logger.warn('已经创造该实例, 不重复创建...', type)
            let wind = UIManager.Instance.FindWind(type)
            if (wind) {
                wind.OnShowWind()
            }
            return;
        }
        let wndClass = uiInfo.Class;
        let wind: BaseWindow;
        if (wndClass.Instance) {//若有些界面需要做成单例类,则需要实现get Instance
            wind = wndClass.Instance;
        } else {
            wind = ObjectTranslator.toInstance(null, wndClass) as BaseWindow;
        }

        let b = wind.onCreate(type, param);
        if (!b) {
            return;
        }
        let wndLayer = uiInfo.Layer ? uiInfo.Layer : EmLayer.GAME_UI_LAYER;
        let layer = LayerMgr.Instance.getLayer(showLayer ? showLayer : wndLayer);
        layer.pushView(wind, uiInfo.ZIndex);
        UIManager.Instance.AddToCachesMap(type, wind);
        UIManager.Instance.AddToWindowMap(type, wind);

        this.view = wind;
        this.view.ctrl = this;
        wind.OnInitWind();
        this.addEventListener()
        wind.doShowAnimation();
        wind.OnShowWind();

        return wind
    }

    private HideWind() {
        this.delEventListener()
        this.view && this.view.hide();
        if (UIManager.Instance.isSingleInstanceWnd(this.moduleName)) return;
        this.dispose()
    }

    //////////////////////////////////////////////////////////
    // 弹窗组关闭事件
    private __disposeHandler(evt: Event) {
        // if (evt.currentTarget instanceof BaseWindow){
        //     (evt.currentTarget as BaseWindow).removeEventListener(WinEvent.GROUP_CONFLICT, this.__groupExistHandler);
        //     if (evt.currentTarget == this._view) this.exit();
        // }
    }
    private __groupExistHandler(evt: Event) {
        // if (this._view == evt.currentTarget){
        //     this._nextModule = null;
        //     this._nextInfo = null;
        // } 
    }
}