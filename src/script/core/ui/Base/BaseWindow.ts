import NewbieEvent, { SceneEvent, WinEvent } from '../../../game/constant/event/NotificationEvent';
import { SoundIds } from '../../../game/constant/SoundIds';
import { EmWindow, EnUIHideType, EnUIShowType, UI_PACKAGE, UICFG } from '../../../game/constant/UIDefine';
import { NotificationManager } from '../../../game/manager/NotificationManager';
import NewbieConfig from '../../../game/module/guide/data/NewbieConfig';
import NewbieHandleUtils from '../../../game/module/guide/utils/NewbieHandleUtils';
import Resolution from '../../comps/Resolution';
import GlobalEvent from '../../event/GlobalEvent';
import LangManager from '../../lang/LangManager';
import Logger from "../../logger/Logger";
import WXAdapt from '../../sdk/wx/adapt/WXAdapt';
import ObjectTranslator from '../../utils/ObjectTranslator';
import Utils from '../../utils/Utils';
import UIButton from '../UIButton';
/**
* @author:pzlricky
* @data: 2020-11-06 17:00
* @description 窗口类(游戏中UI界面) 
*/
export default class BaseWindow extends Laya.Sprite {
    public static ScaleContentPane: number = 0.8
    public static BaseWindRootNode: string = "BaseWindRootNode"


    protected m_setPosY: number = 0;
    protected m_setPosX: number = 0;
    public typeWin: EmWindow;
    protected returnToWin: EmWindow;
    protected returnToWinFrameData: any;
    public packName: string = "";
    public wndName: string = '';
    protected btnCloseNodeName: string = "BtnClose";
    public modal: boolean = true;
    public through: boolean = false;
    public dontDel: boolean = false;
    public isShowing: boolean = false;
    public modelEnable: boolean = true;
    // 深度遍历节点引用至basewindow对象
    public deepAutoReferenceNode: boolean = false;
    public UIButtonObj: Map<string, any> = new Map<string, any>();
    public UICtrls: Map<string, fairygui.Controller> = new Map<string, fairygui.Controller>();

    protected modelMask: Laya.Sprite;//蒙版
    public static MaskSize: number = 4000;
    protected resizeContent: boolean = false;
    protected setScenterValue: boolean = false;
    protected setOptimize: boolean = true;
    protected setSceneVisibleOpen: boolean = false;
    protected resizeFullContent: boolean = false;

    public txtFrameTitle: fgui.GLabel;

    /**
     * 针对界面太繁琐 不想用组件来做全面屏适配 
     */
    private phFixL: fgui.GGraph;
    private phFixR: fgui.GGraph;

    protected uicfg: UICFG = null;//UI相关配置信息
    protected isNeedShowAnimation: boolean = false;
    protected isNeedHideAnimation: boolean = false;
    protected contentPane: fgui.GComponent = null;
    public params: any = null;     //UI界面的附加数据
    public needAdapt: UIButton = null;
    public get frameData(): any {    //UI界面的附加数据
        return this.params && this.params.frameData
    };
    public set frameData(data: any) {
        if (!this.params) this.params = {}
        this.params.frameData = data
    };
    public ctrl: any //FrameCtrlBase;    //UI界面控制器
    public get model(): any { //FrameDataBase;    //UI界面数据控制器
        return this.ctrl && this.ctrl.data
    }

    recordBtnElement: fgui.GObject[] = [];//按钮

    backgroundElement: fgui.GObject[] = [];//背景

    constructor() {
        super();
        this.width = Resolution.gameWidth;//显示宽度
        this.height = Resolution.gameHeight;//显示高度        
    }

    /**初始化窗口,不建议重构 */
    public onCreate(type: EmWindow, param: any) {
        let uiInfo = this.getUIInfo(type);
        if (!uiInfo) {
            Logger.error('无相关UI信息!!!  ' + type);
            return false;
        }

        this.packName = uiInfo.packName;
        //优先读取wndName,否则以获取Class名称
        this.wndName = uiInfo.wndName ? uiInfo.wndName : ObjectTranslator.getClassName(this);
        this.uicfg = uiInfo;
        this.typeWin = type;
        this.params = param;

        if (this.contentPane == null) {
            let windObj = fgui.UIPackage.createObject(this.packName, this.wndName);
            if (!windObj) {
                Logger.error('创建对象错误!!!   ' + this.packName + " - " + this.wndName);
                return false;
            }
            this.contentPane = windObj.asCom;
            this.contentPane.name = BaseWindow.BaseWindRootNode;
            this.onSetOptimize();

            this.UIButtonObj.clear();
            this.UICtrls.clear();
            this.recordBtnElement = [];
            this.backgroundElement = [];
            this.contentPane.controllers.forEach(element => {
                this.UICtrls.set(element.name, element);
            });
            for (var index = 0; index < this.contentPane.numChildren; index++) {
                var element = this.contentPane.getChildAt(index);
                var elementName = element.name.toUpperCase();
                if ((elementName.indexOf('BACKGROUND') != -1 || elementName.indexOf('BG') != -1) && element.width >= 1000 && element.height > 500) {
                    this.backgroundElement.push(element);
                }
            }
            //遍历所有节点存储按钮节点
            this.referenceNode(this.contentPane, '', true);
            this.initButton()

            //窗口的标题
            // @ts-ignore
            if (this.frame && (this.frame instanceof fgui.GComponent)) {
                // @ts-ignore
                this.txtFrameTitle = this.frame.getChild("title").asLabel;
            }
            this.modal = this.uicfg.Model ? this.uicfg.Model : false;

            if (this.modal) {
                this.through = false;
            } else {
                this.through = this.uicfg.mouseThrough ? this.uicfg.mouseThrough : false;
            }

            // UI层默认开启点击穿透
            this.mouseEnabled = true;
            if (this.modal) {
                this.mouseThrough = false;
            } else {
                this.mouseEnabled = true;
                this.mouseThrough = true;
                if (!this.through) {
                    this.mouseThrough = false;
                }
            }

            if (this.modal) {
                this.removeModel();
                this.createModel();
            }
            this.resize();
            this.addChild(this.contentPane.displayObject);
        }

        if (this.frameData) {
            if (this.frameData.returnToWin) {
                this.returnToWin = this.frameData.returnToWin
            }
            if (this.frameData.returnToWinFrameData) {
                this.returnToWinFrameData = this.frameData.returnToWinFrameData
            }
        }

        this.isShowing = true; // 怕有的界面没调用父类的OnShowWind 待删除
        return true;
    }

    protected createModel() {
        if (!this.modelMask)
            this.modelMask = new Laya.Sprite();
        this.modelMask.graphics.drawRect(0, 0, BaseWindow.MaskSize, BaseWindow.MaskSize, '#000000');
        this.modelMask.alpha = this.modal ? this.modelAlpha : 0;
        this.modelMask.width = BaseWindow.MaskSize;
        this.modelMask.height = BaseWindow.MaskSize;
        this.modelMask.x = (Resolution.gameWidth - BaseWindow.MaskSize) / 2;
        this.modelMask.y = (Resolution.gameHeight - BaseWindow.MaskSize) / 2;

        // if (!this.uicfg.HideBgBlur)
        //     NotificationManager.Instance.dispatchEvent(SceneEvent.BLUR_MASK, { isBlur: true, type: this.getUIID() });

        this.modelMask.mouseEnabled = true;
        this.modelMask.mouseThrough = this.through;
        this.modelMask.on(Laya.Event.CLICK, this, (evt) => {
            Logger.info('modal click');
            this.OnClickModal();
        })
        this.addChild(this.modelMask);
    }

    protected removeModel() {
        if (this.modelMask) {
            // if (!this.uicfg.HideBgBlur)
            //     NotificationManager.Instance.dispatchEvent(SceneEvent.BLUR_MASK, { isBlur: false, type: this.getUIID() });

            this.modelMask.graphics.clear();
            this.modelMask.removeSelf();
            this.modelMask.destroy();
            this.modelMask = null;
        }
    }

    /**
     * 遍历所有节点
     * @param node 遍历节点   
     * @param prefix 多层级的用_来区分  导致对象太冗余先干掉 
     */
    referenceNode(node: fgui.GComponent, prefix: string = '', rootNode: boolean = false) {
        let nodeChildCount: number = node.numChildren;
        for (var index = 0; index < nodeChildCount; index++) {
            var element: fgui.GComponent = node.getChildAt(index).asCom;
            let elementName = element.name;
            if (prefix) {
                elementName = prefix + '_' + element.name;
            }
            else {
                elementName = element.name;
            }

            // 按钮节点全部引用至BaseWindow
            if (elementName.toUpperCase().indexOf('BTN') !== -1 && element instanceof fgui.GButton) {
                this[elementName] = element;
                this.recordBtnElement.push(element);
            } else {
                // 非按钮节点 按照开关进行引用
                if (rootNode) {
                    this[elementName] = element;
                } else {
                    if (this.deepAutoReferenceNode) {
                        this[elementName] = element;
                    }
                }

                let extprefix = '';
                if (prefix) {
                    extprefix = prefix + '_' + element.name;
                } else {
                    extprefix = element.name;
                }
                this.referenceNode(element, extprefix, false);
            }
        }
    }

    getController(name: string): fgui.Controller {
        if (this.contentPane) {
            return this.contentPane.getController(name);
        }
        return null;
    }

    initButton() {
        this.recordBtnElement.forEach(element => {
            // 锚点设置
            let uiBtn = new UIButton(element)
            this[element.name] = uiBtn;
            this.UIButtonObj.set(element.name, uiBtn);

            if (element.name.toUpperCase() == "BTNCLOSE" || element.name.toUpperCase() == "CLOSEBTN") {
                uiBtn.callBack = this.OnBtnClose.bind(this)
                uiBtn.soundRes = SoundIds.CLOSE_SOUND
                if (Utils.isWxMiniGame()) {
                    // let delay = 1;
                    // if (this.uicfg.EffectHide === EnUIHideType.POP) {
                    //     delay = 220;
                    // }
                    // WXAdapt.Instance.wxMenuAdapt(uiBtn, delay);
                    this.needAdapt = uiBtn;
                }
            } else {
                uiBtn.callBack = (target: fgui.GButton, evt: Laya.Event) => {
                    this._onBtnClick(target, evt);
                }
            }


        });
    }

    onEnable() {
        if (Utils.isWxMiniGame() && this.needAdapt) {
            let delay = 1;
            if (this.uicfg.EffectHide === EnUIHideType.POP) {
                delay = 300;
            }
            if (Utils.isWxMiniGame()) {
                WXAdapt.Instance.wxMenuAdapt(this.needAdapt, delay);
            }
        }
    }

    removeButtonEvent() {
        this.UIButtonObj.forEach((value: UIButton, elementName: string) => {
            value.delClickEvent && value.delClickEvent();
            value.callBack = null;
            value.soundRes = "";
            value = null;
        });
    }

    /** */
    protected setCenter() {
        this.width = Resolution.gameWidth;//显示宽度
        this.height = Resolution.gameHeight;//显示高度
        if(!this.contentPane){
            return;//【【悬赏】：报错】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001050651
        }
        this.contentPane.setPivot(0, 0, true);
        if (!this.resizeFullContent && (Resolution.isWebVertical() || Utils.isQQHall())) {
            let scale = BaseWindow.ScaleContentPane;
            this.contentPane.setScale(scale, scale);
            let scaleFix = (1 - scale) * 0.5;
            this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2 + this.contentPane.sourceWidth * scaleFix;
            this.y = (Resolution.gameHeight - this.contentPane.sourceHeight) / 2 + this.contentPane.sourceHeight * scaleFix;

            if (this.uicfg.EffectShow == EnUIShowType.POPUP) {
                this.contentPane.setPivot(0.5, 0.5, true);
                this.x = this.width / 2;
                this.y = this.height / 2;
            }
        } else {
            this.contentPane.setScale(1, 1);
            if (this.resizeFullContent) {
                this.x = (Resolution.gameWidth - this.contentPane.width) / 2;
                this.y = (Resolution.gameHeight - this.contentPane.height) / 2;
            } else {
                this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
                this.y = (Resolution.gameHeight - this.contentPane.sourceHeight) / 2;
            }
        }

        this.setScenterValue = true;
    }


    public getUIID() {
        return this.uicfg.Type;
    }

    public doHideAnimation(): Promise<boolean> {
        return new Promise(resolve => {
            if (!this.isShowing) {
                resolve(true);
            } else {
                this.isNeedHideAnimation = this.uicfg.EffectHide != null;
                if (this.isNeedHideAnimation) {
                    if (this.uicfg.EffectHide === EnUIHideType.POP) {
                        this.contentPane.scaleX = 0.9;
                        this.contentPane.scaleY = 0.9;
                        Laya.Tween.to(this.contentPane, { scaleX: 1.1, scaleY: 1.1 }, 50);
                        Laya.Tween.to(this.contentPane, { scaleX: 1, scaleY: 1 }, 100, undefined,
                            Laya.Handler.create(this, () => {
                                resolve(true);
                            }), 100);
                    }
                    else if (this.uicfg.EffectHide == EnUIHideType.TO_TOP) {
                        let targetY = -(this.m_setPosY + this.contentPane.height);
                        Laya.Tween.to(this.contentPane, { y: targetY }, 250, undefined, Laya.Handler.create(this, () => {
                            resolve(true);
                        }));
                    }
                    else if (this.uicfg.EffectHide == EnUIHideType.FADEOUT) {
                        this.contentPane.alpha = 0;
                        Laya.Tween.to(this.contentPane, { alpha: 1 }, 250, undefined, Laya.Handler.create(this, () => {
                            resolve(true);
                        }));
                    }
                } else {
                    resolve(true);
                }
            }
        });
    }

    public doShowAnimation(): Promise<boolean> {
        this.isNeedShowAnimation = this.uicfg.EffectShow != null;
        return new Promise(resolve => {
            if (this.isNeedShowAnimation) {
                if (this.uicfg.EffectShow == EnUIShowType.NONE) {
                    resolve(true);
                }
                else if (this.uicfg.EffectShow == EnUIShowType.POPUP) {
                    let max = 1.1;
                    let min = 1;
                    let scale = 1;
                    if (Resolution.isWebVertical() || Utils.isQQHall()) {
                        scale = 0.8;
                        max *= scale;
                        min *= scale;
                    }
                    this.contentPane.scaleX = 0.9 * scale;
                    this.contentPane.scaleY = 0.9 * scale;
                    Laya.Tween.to(this.contentPane, { scaleX: max, scaleY: max }, 50);
                    Laya.Tween.to(this.contentPane, { scaleX: min, scaleY: min }, 100, undefined,
                        Laya.Handler.create(this, () => {
                            resolve(true);
                        }), 100);
                }
                else if (this.uicfg.EffectShow == EnUIShowType.FROM_TOP) {
                    this.contentPane.y = -(this.m_setPosY + this.contentPane.height);
                    Laya.Tween.to(this.contentPane, { y: this.m_setPosY + 40 }, 250).to(this.contentPane, { y: this.contentPane }, 180, undefined,
                        Laya.Handler.create(this, () => {
                            resolve(true);
                        }));
                }
                else if (this.uicfg.EffectShow == EnUIShowType.FADEIN) {
                    this.contentPane.alpha = 0;
                    Laya.Tween.to(this.contentPane, { alpha: 1 }, 250, undefined, Laya.Handler.create(this, () => {
                        resolve(true);
                    }));
                }
            } else {
                this.isShowing = true; // 怕有的界面没调用父类的OnShowWind 待删除
                resolve(true);
            }
        });

    }

    public KeepVerticalCenter(mainPart: Laya.Sprite, fromTop: number = 106, fromBottom: number = 106) {
        let heightStage = Resolution.gameHeight;
        let remainHeight = heightStage - (fromTop + fromBottom); // min top down item height
        let yPos = (remainHeight - mainPart.height) / 2;

        yPos = yPos + fromTop + mainPart.pivotY; // add top item height
        mainPart.y = yPos;

        this.m_setPosX = mainPart.x;
        this.m_setPosY = mainPart.y;
    }

    // 主动关闭自身打开上一个界面（使用FrameCtrlManager管理的有效）
    protected OnBtnClose() {
        if (this.ctrl) {
            NotificationManager.Instance.dispatchEvent(WinEvent.RETURN_TO_WIN, this.typeWin, this.returnToWin, this.returnToWinFrameData)
        } else {
            this.hide()
        }
    }

    async hide() {
        if (this.destroyed) return;

        // await this.doHideAnimation();
        this.OnHideWind();
        if (this.isSingleInstanceWnd(this.typeWin)) return;
        this.dispose();
    }

    public isSingleInstanceWnd(type: EmWindow) {
        let uiInfo = this.getUIInfo(type);
        if (!uiInfo) return false;
        let wndClass = uiInfo.Class;
        if (wndClass && wndClass["Instance"]) {
            return true;
        }
        return false;
    }

    getUIInfo(uiType: EmWindow): UICFG {
        for (let key in UI_PACKAGE) {
            if (UI_PACKAGE.hasOwnProperty(key)) {
                let item = UI_PACKAGE[key];
                if (item && item.Type === uiType) {
                    return item;
                }
            }
        }
    }

    /**
     * 获取UIController
     * @param elementName 节点名称
     */
    protected getUIController(elementName: string) {
        if (this.UICtrls && this.UICtrls.size) {
            return this.UICtrls.get(elementName);
        }
        return null;
    }

    /** 初始化窗口(可重写) */
    OnInitWind() { }
    /** 显示窗口(可重写) */
    OnShowWind() {
        Logger.base("🌝打开界面:", this.typeWin);
        NotificationManager.Instance.dispatchEvent(WinEvent.SHOW, this.typeWin);
        this.isShowing = true;
        this.visible = true;
        this.active = true;
        this.onAfterStatusBarChange();
        this.onSetSceneVisibleOpen(false);
        NewbieHandleUtils.onHandleWnd(this.typeWin);
        this.resize();
    }
    /** 隐藏窗口(可重写) */
    OnHideWind() {
        Logger.base("🌝关闭界面:", this.typeWin);
        this.isShowing = false;
        this.visible = false;
        this.active = false;
        this.onSetSceneVisibleOpen(true);
        NotificationManager.Instance.dispatchEvent(WinEvent.HIDE, this.typeWin);
    }
    /** 销毁窗口(可重写) */
    dispose(dispose?: boolean) {
        this.removeButtonEvent();
        this.removeModel();
        NotificationManager.Instance.dispatchEvent(GlobalEvent.POP_VIEW, this);
        this.ctrl = null;
        this.params = null;
        this.recordBtnElement = [];
        this.UIButtonObj.clear();
        this.UICtrls.clear();
        this.isShowing = false;
        if (this.contentPane && !this.contentPane.isDisposed) {
            this.contentPane.dispose();
        }
        this.contentPane = null;
    }
    /** 点击蒙版区域 (可重写) */
    protected OnClickModal() {
        if (this.modelEnable)
            this.OnBtnClose();
    }
    protected onSetOptimize() {
        if (this.setOptimize) {
            Utils.setDrawCallOptimize(this.contentPane);
        }
    }

    /**
     * 界面中所有按钮点击事件回调(不可可重写) 
     * 实现 (组件名称 + Click)  回调接口
     * @param evt  fairygui.GButton   点击目标按钮
     * */
    private _onBtnClick(target: fgui.GButton, evt: Laya.Event) {
        let btnName = target.name;
        if (this[btnName + 'Click']) {
            this[btnName + 'Click'](target, evt);
        }
    }

    /**界面随浏览器变化变化大小以及适配 */
    resize() {
        // NewbieBaseActionMediator.resize();
        //针对背景做适配
        if (this.backgroundElement.length) {
            let count = this.backgroundElement.length;
            for (let index = 0; index < count; index++) {
                let element = this.backgroundElement[index];
                // element.removeFromParent();
                // this.addChild(element.displayObject);
                Resolution.fixBackground(element);
            }
        }
        this.width = Resolution.gameWidth;//显示宽度
        this.height = Resolution.gameHeight;//显示高度
        if (this.modelMask) {
            this.modelMask.x = (Resolution.gameWidth - BaseWindow.MaskSize) / 2;
            this.modelMask.y = (Resolution.gameHeight - BaseWindow.MaskSize) / 2;
        }
        if (this.resizeContent) {
            this.resizeContentToInst();
        }
        if (this.contentPane)
            this.contentPane.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);
        if (this.setScenterValue) {
            this.setCenter();
        }
    }

    protected resizeContentToInst() {
        //设置组件全屏, 即大小和逻辑屏幕大小一致。
        fgui.GRoot.inst.setSize(this.width, this.height);
        if (this.contentPane) {
            this.contentPane.setSize(this.width, this.height);
        }
    }

    protected onAfterStatusBarChange() {
        if (this.phFixL) {
            this.phFixL.enabled = false
            this.phFixL.width = Resolution.deviceStatusBarHeightL;
        }
        if (this.phFixR) {
            this.phFixR.enabled = false
            this.phFixR.width = Resolution.deviceStatusBarHeightR;
        }
    }

    protected onSetSceneVisibleOpen(b: boolean) {
        if (!this.setSceneVisibleOpen) return;
        NotificationManager.Instance.dispatchEvent(SceneEvent.HIDE_SCENE_OBJ, b);
    }

    setTitleKey(key: string) {
        if (this['frame'])
            this['frame'].getChild('title').text = LangManager.Instance.GetTranslation(key);
    }

    public getContentPane() {
        return this.contentPane;
    }

    protected get modelAlpha() {
        return 0.6
    }
}