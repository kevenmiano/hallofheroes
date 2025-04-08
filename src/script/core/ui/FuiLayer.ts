// @ts-nocheck
import { EmWindow } from "../../game/constant/UIDefine";
import Resolution from "../comps/Resolution";
import { ILayer } from "../layer/ILayer";
import ObjectUtils from "../utils/ObjectUtils";
import BaseWindow from "./Base/BaseWindow";

/**
* @author:pzlricky
* @data: 2021-04-30 16:26
* @description *** 
*/
export default class FuiLayer extends Laya.Sprite implements ILayer{

    protected list: BaseWindow[];

    protected popFlag: boolean = false;

    private zOrderIndex:number = 0;
    
    constructor(zOrder: number = 1, canPop: boolean = true) {
        super();
        this.list = [];
        this.popFlag = canPop;
        this.zOrderIndex = zOrder;
        // UI层默认开启点击穿透
        this.mouseEnabled = true;
        this.mouseThrough = true;
    }

    init(node?: any) {
        this.width = Resolution.gameWidth;
        this.height = Resolution.gameHeight;
        this.scrollRect = new Laya.Rectangle(0, 0, Resolution.gameWidth, Resolution.gameHeight);
        Laya.stage.addChild(fgui.GRoot.inst.displayListContainer);
        fgui.GRoot.inst.displayListContainer.zOrder = this.zOrderIndex;
    }

    //添加UI
    pushView(view, zIndex?: number) {
        if(!view) return;
        this.list.push(view);
        if (view instanceof fgui.GObject) {
            this.addChild(view.displayObject);
        } else {
            this.addChild(view);
        }
        if (zIndex == undefined)
            view.zOrder = this.numChildren - 1;
        else
            view.zOrder = zIndex;
    }

    //移除UI
    popView(view) {
        if (!view) {
            if (this.list.length > 0) {
                let layerInfo = this.list.pop();
                this.removeView(layerInfo.getUIID());
            }
        } else {
            if (view['getUIID'])
                this.removeView(view.getUIID());
            else
                this.removeView(view);
        }
    }

    setZOrder(order: number) {
        this.zOrder = order;
    }

    getZOrder(): number {
        return this.zOrder;
    }

    /**
     * 获取当前层级UI
     * @param uiType UI类型
     */
    getView(uiType: EmWindow): BaseWindow {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            if (uiType === element.getUIID()) {
                return element;
            }
        }
    }

    canPop() {
        return this.popFlag;
    }

    count() {
        return this.list.length;
    }

    setVisible(flag: boolean) {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            element.active = (flag)
        }
    }

    has(layer: any) {
        for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            if (layer === element) {
                return true;
            }
        }
        return false;
    }

    //删除指定位置的layer
    removeView(uiType: string) {
        for (let index = 0; index < this.list.length; index++) {
            let element: any = this.list[index];
            if (element && uiType === element.getUIID()) {
                this.list.splice(index, 1);
                element.removeSelf();
                ObjectUtils.disposeAllChildren(element);
                element= null;
            }
        }
    }

    /**
     * 添加至视图中
     * @param view 视图
     */
    addView(view: any) {
        if(!view) return;
        this.list.push(view);
        view.getNode().parent = this;
    }

    /**依据浏览器大小改变大小 */
    resize() {
        this.width = Resolution.gameWidth;//显示宽度
        this.height = Resolution.gameHeight;//显示高度
        for (let index = 0; index < this.list.length; index++) {
            let element = this.list[index];
            if (element["resize"]) {
                element.resize();
            }
        }
    }

    clear() {
        // logInfo(' LayerManger clear ')
        for (let index = 0; index < this.list.length; index++) {
            let element: any = this.list[index];
            element.exit();
            element = null;
        }
        this.list.length = 0;
    }

}