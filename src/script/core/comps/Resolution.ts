// @ts-nocheck
import GameConfig from "../../../GameConfig";
import { NativeEvent, NotificationEvent } from "../../game/constant/event/NotificationEvent";
import { UIAlignType } from "../../game/constant/UIAlignType";
import { NotificationManager } from "../../game/manager/NotificationManager";
import LayerMgr from '../layer/LayerMgr';
import Logger from "../logger/Logger";
import Utils from "../utils/Utils";


export class UIWidget extends Laya.Widget {
    alignType: UIAlignType
    constructor(alignType: UIAlignType = UIAlignType.LEFT) {
        super()
        this.alignType = alignType
    }
}

export default class Resolution {

    private static config;

    private static frameAspectRatio;
    static designAspectRatio;
    private static offset: number[] = []
    static newHRatio: number = 1;

    private static widgets: Array<Object> = [];

    static init() {
        this.config = GameConfig;
        this.widgets = [];
        this.createStageModel();
        Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
        //@ts-ignore
        window.canvasTopX = 0;
        //@ts-ignore
        window.canvasTopY = 0;

        let newRatio = Laya.Browser.clientWidth / Laya.Browser.clientHeight
        let oldRatio = GameConfig.width / GameConfig.height;

        let realWidth = GameConfig.width;
        let realHeight = GameConfig.height;


        let newHeight = realWidth / newRatio;

        this.newHRatio = newHeight / realHeight

        if (this.newHRatio < 1) {
            this.newHRatio = 1;
        }

        this.frameAspectRatio = newRatio
        this.designAspectRatio = oldRatio;
        let deltaAspectRatio = 1 / this.frameAspectRatio - 1 / this.designAspectRatio;
        let topOffset = 0;
        if (topOffset === 0 && deltaAspectRatio > 0) {
            topOffset = deltaAspectRatio * 150;
        }
        this.offset[0] = topOffset;

        let bottomOffset = 0;
        if (bottomOffset === 0 && deltaAspectRatio > 0) {
            bottomOffset = deltaAspectRatio * 100;
        }
        this.offset[1] = bottomOffset;
        NotificationManager.Instance.addEventListener(NativeEvent.STATUS_BAR_CHANGE, this.onNativeStatusBar, this);
        this.resizeCanvas();
    }

    private static stageMask: Laya.Sprite;
    private static createStageModel() {
        if (!this.stageMask)
            this.stageMask = new Laya.Sprite();
        this.resizeStageModel();
        this.stageMask.zOrder = -9999;
        this.stageMask.mouseThrough = false;
        this.stageMask.mouseEnabled = false;
        Laya.stage.addChild(this.stageMask);
    }

    private static resizeStageModel() {
        if (!this.stageMask) return;
        this.stageMask.graphics.drawRect(0, 0, this.gameWidth, this.gameHeight, '#000000');
        this.stageMask.alpha = 1;
        this.stageMask.width = this.gameWidth;
        this.stageMask.height = this.gameHeight;
        this.stageMask.x = 0;
        this.stageMask.y = 0;
    }

    public static resizeCanvas() {
        // if (Laya.Browser.onPC) {
        //     if(Utils.isFixAuto()) return;
        //     console.log("resizeCanvas:  pixelRatio-", Laya.Browser.pixelRatio)
        //     let canvasEle = Laya.Browser.getElementById("layaCanvas");
        //     if (canvasEle) {
        //         let topX = (Laya.Browser.clientWidth * (Laya.Browser.pixelRatio) - this.gameWidth) * 0.5 / (Laya.Browser.pixelRatio)
        //         let topY = (Laya.Browser.clientHeight * (Laya.Browser.pixelRatio) - this.gameHeight) * 0.5 / (Laya.Browser.pixelRatio)
        //         //@ts-ignore
        //         window.canvasTopX = topX >= 0 ? topX : 0;
        //         //@ts-ignore
        //         window.canvasTopY = topY >= 0 ? topY : 0;
        //     }
        //     //@ts-ignore
        //     // Laya.stage._canvasTransform.identity();
        //     var mat = Laya.stage._canvasTransform;
        //     let ad = 1 / Laya.Browser.pixelRatio;
        //     if (ad > 1) {
        //         ad = 1;
        //     }
        //     mat.a = mat.d = ad;
        //     mat.b = mat.c = 0;
        //     //@ts-ignore
        //     mat.tx = window.canvasTopX;
        //     //@ts-ignore
        //     mat.ty = window.canvasTopY;
        //     mat._bTransform = false;
        //     //@ts-ignore
        //     Laya.Render._mainCanvas.source.style.left = window.canvasTopX + 'px';
        //     //@ts-ignore
        //     Laya.Render._mainCanvas.source.style.top = window.canvasTopY + 'px';
        //     //重绘舞台背景
        //     this.resizeStageModel();
        // }
    }

    static getOffset() {
        return this.offset;
    }

    //随着屏幕尺寸改变适配UI相对位置
    static resize() {
        this.resizeCanvas();
        let numChildren = LayerMgr.Instance.getAllLayer().length;
        for (let index = 0; index < numChildren; index++) {
            let layer = LayerMgr.Instance.getLayer(index);
            if (layer['resize']) {
                layer.resize();
            }
        }
        Laya.Scene.unDestroyedScenes.forEach(element => {
            let s = element as Laya.Scene;
            // s.width = w;
            // s.height = h;
        });
    }

    /**适配背景节点,等比缩放 */
    static fixBackground(com: fgui.GObject | Laya.Sprite) {
        let sprite = com;
        if (!com) {
            return;
        }
        let heightratio: number = Resolution.gameHeight / sprite.height;
        let widthRatio: number = Resolution.gameWidth / sprite.width;
        let scaleV = Math.max(heightratio, widthRatio);
        sprite.scaleX = sprite.scaleY = scaleV;
    }

    static defDeviceStatusBarHeight: number = 32;
    private static _deviceStatusBarHeightL: number = 0;
    private static _deviceStatusBarHeightR: number = 0;
    private static _deviceRotation: number = 1;//设备旋转角度 1,3
    /**
     * 设置UI偏移 始终在左
     */
    static get deviceStatusBarHeightL(): number {
        return this._deviceStatusBarHeightL;
    }
    /**
     * 设置UI偏移 始终在右
     */
    static get deviceStatusBarHeightR(): number {
        return this._deviceStatusBarHeightR;
    }


    /**
     * 对组件添加Widget
     * @param target 组件
     * @param alignType 对其方向
     * @returns 
     */
    static addWidget(target: Laya.Sprite, alignType: UIAlignType = UIAlignType.LEFT) {
        if (!target) return;
        let widget = null;
        if (!target.getComponent(UIWidget)) {
            widget = new UIWidget(alignType);
            target.addComponentIntance(widget);
        }
        //存储适配UI
        if (this.widgets.indexOf(target) == -1) {
            this.widgets.push(target);
            this.refreshTargetWidget(target);
        }
    }

    static addScaleWidget(target: Laya.Sprite) {
        if (!target) return;

    }

    /**
     * 移除Widget组件
     * @param target 
     */
    static removeWidget(target: Laya.Sprite) {
        if (!target) return;
        let widgetIndex = this.widgets.indexOf(target);
        if (widgetIndex != -1) {
            this.widgets.splice(widgetIndex, 1);
        }
    }

    /**
     * 监听App状态栏变化
     * @param height1 状态栏高度 左边
     * @param height2 状态栏高度 右边
     * @param rotation 旋转角度  1 为 90度 左边  3 为270度  右边
     * @returns 
     */
    static onNativeStatusBar(height1: number, height2: number, rotation: number) {
        Logger.base("[Resolution]onNativeStatusBar", height1, height2, rotation);

        //remark by yuanzhan.yu 如果是左右有黑边或者上下有黑边, 即Laya.stage.scaleMode==Laya.Stage.SCALE_SHOWALL的情况下, 无视安全区高度
        if(Laya.stage.scaleMode == Laya.Stage.SCALE_SHOWALL)
        {
            height1 = height2 = 0;
        }

        if (Utils.isIOS()) {
            let LAdd = rotation == 1 ? 25 : 0
            let RAdd = rotation == 1 ? 0 : 25
            if (height1 == 0) {
                LAdd = 0
            }
            if (height2 == 0) {
                RAdd = 0
            }
            this._deviceStatusBarHeightL = height1 + LAdd;
            this._deviceStatusBarHeightR = height2 + RAdd;
        }
        else {
            this._deviceStatusBarHeightL = height1;
            this._deviceStatusBarHeightR = height2;
        }
        this._deviceRotation = rotation;
        this.refreshWidgets();
        NotificationManager.Instance.dispatchEvent(NativeEvent.AFTER_STATUS_BAR_CHANGE);
    }

    /**
    * 监听小游戏状态栏变化
    * @param statusBarHeight 状态栏高度
    * @param ortation 旋转角度  1 为 90度 左边  3 为270度  右边
    * @returns 
    */
    static onMiniGameStatusBar(height1: number, height2: number, rotation: number) {
        if (!Utils.isWxMiniGame()) {
            return;
        }
        Logger.xjy("[Resolution]onMiniGameStatusBar", height1, height2, rotation);

        let LAdd = rotation == 1 ? 30 : 0
        let RAdd = rotation == 1 ? 0 : 30
        if (height1 == 0) {
            LAdd = 0
        }
        if (height2 == 0) {
            RAdd = 0
        }
        this._deviceStatusBarHeightL = height1 + LAdd;
        this._deviceStatusBarHeightR = height2 + RAdd;
        this._deviceRotation = rotation;
        this.refreshWidgets();
        NotificationManager.Instance.dispatchEvent(NativeEvent.AFTER_STATUS_BAR_CHANGE);
    }

    /**
     * 刷新适配 对Group不适用
     */
    private static refreshWidgets() {
        let count = this.widgets.length;
        for (let index = 0; index < count; index++) {
            let element: any = this.widgets[index];
            let target = element;
            if (!target || target.destroyed) {
                continue;
            }
            this.refreshTargetWidget(target);
        }
    }

    static refreshTargetWidget(target: Laya.Sprite) {
        let targetWidget: UIWidget = target.getComponent(UIWidget);
        if (!targetWidget) return;
        if (targetWidget.alignType == UIAlignType.LEFT) {
            targetWidget.left = this._deviceStatusBarHeightL;
            targetWidget.right = NaN;
        } else if (targetWidget.alignType == UIAlignType.RIGHT) {
            targetWidget.left = NaN;
            targetWidget.right = this._deviceStatusBarHeightR;
        }
        targetWidget.resetLayout();
    }

    /**游戏实际宽度 */
    static get gameWidth(): number {
        // if (Utils.isApp()) {
            return Laya.stage.width;
        // } else {
        //     if (Laya.Browser.onPC) {
        //         if (Utils.isFixAuto()) {
        //             return Laya.stage.width;
        //         } else {
        //             if (Laya.stage.width > 1500) {
        //                 return 1500;
        //             } else if (Laya.stage.width < 1000) {
        //                 return 1000;
        //             } else {
        //                 return Laya.stage.width;
        //             }
        //         }
        //     } else {
        //         return Laya.stage.width;
        //     }
        // }
    }

    /**游戏实际高度 */
    static get gameHeight(): number {
        // if (Utils.isApp()) {
            return Laya.stage.height;
        // } else {
        //     if (Laya.Browser.onPC) {
        //         if (Utils.isFixAuto()) {
        //             return Laya.stage.height;
        //         } else {
        //             if (Laya.stage.height > 900) {
        //                 return 900;
        //             } else if (Laya.stage.height < 600) {
        //                 return 600;
        //             } else {
        //                 return Laya.stage.height;
        //             }
        //         }
        //     } else {
        //         return Laya.stage.height;
        //     }
        // }
    }

    /** 是否为显示器竖屏适配（宽适配）ipad 宽高比约为1.33,  取1.4*/
    static isWebVertical() {
        return (this.gameWidth / this.gameHeight) < 1.4;
    }

    // 是否为ipad适配（宽适配）
    static get scaleFixWidth() {
        if ((this.gameWidth / this.gameHeight) < (Laya.stage.designWidth / Laya.stage.designHeight)) {
            return true
        }
        return false
    }

    static get screenScaleW() {
        return Resolution.gameWidth / Laya.stage.designWidth
    }

    static get screenScaleH() {
        return Resolution.gameHeight / Laya.stage.designHeight
    }

    // 宽适配模式适配场景地图的高
    static scaleFixWidth_fixBgHeight(width: number = Laya.stage.designWidth, height: number = Laya.stage.designHeight, sprite) {
        let spScaleH = height / Laya.stage.designHeight

        sprite.scaleX = sprite.scaleY = this.screenScaleH / spScaleH;
    }
}