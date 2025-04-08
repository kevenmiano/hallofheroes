import { EmWindow } from '../../game/constant/UIDefine';
import Resolution from '../comps/Resolution';
import IView from '../ui/ViewInterface';
import ObjectUtils from '../utils/ObjectUtils';
import { ILayer } from './ILayer';

/**
 * 场景层
* @author:pzlricky
* @data: 2020-11-17 10:43
* @description *** 
*/
export default class SceneLayer extends Laya.Sprite implements ILayer {

    protected list: IView[];

    protected popFlag: boolean = false;

    private zOrderIndex: number = 0;

    constructor(zOrder: number = 1, canPop: boolean = true) {
        super();
        this.list = [];
        this.zOrderIndex = zOrder;
        this.popFlag = canPop;
        // UI层默认开启点击穿透
        this.mouseEnabled = true
        this.mouseThrough = true
    }

    init(node?: any) {
        this.width = Resolution.gameWidth;
        this.height = Resolution.gameHeight;
        this.scrollRect = new Laya.Rectangle(0, 0, Resolution.gameWidth, Resolution.gameHeight)
        node.addChild(this);
        this.zOrder = this.zOrderIndex;
    }

    pushView(view, zIndex?: number) {
        this.popView(view)
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
        if (view['showEffect'])
            view.showEffect();
    }

    popView(view) {
        if (!view) {
            if (this.list.length > 0) {
                let layerInfo = this.list.shift();
                if (layerInfo['exit'])
                    layerInfo.exit();
            }
        } else {
            for (let index = 0; index < this.list.length; index++) {
                const element = this.list[index];
                if (view === element) {
                    this.list.splice(index, 1);
                    this.removeChild(view);
                    ObjectUtils.disposeAllChildren(view);
                }
            }
        }
    }

    /**
     * 获取当前层级UI
     * @param uiType UI类型
     */
    getView(uiType: EmWindow): IView {
        for (let index = 0; index < this.list.length; index++) {
            let element: any = this.list[index];
            if (uiType === element.getUIID()) {
                return element;
            }
        }
    }

    setZOrder(order: number) {
        this.zOrder = order;
    }

    getZOrder(): number {
        return this.zOrder;
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
            element.setVisible(flag);
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
        // logInfo(' LayerManger removeView ')
        for (let index = 0; index < this.list.length; index++) {
            const element: any = this.list[index];
            if (uiType === element.getUIID()) {
                //@ts-ignore
                element.removeSelf();
                element.exit();
                ObjectUtils.disposeAllChildren(element);
                this.list.splice(index, 1);
            }
        }
    }

    removeNode(node: any) {
        for (let index = 0; index < this.list.length; index++) {
            let element: any = this.list[index];
            if (element && element == node) {
                this.list.splice(index, 1);
                element.removeSelf();
                ObjectUtils.disposeAllChildren(element);
                element = null;
            }
        }
    }

    /**
     * 添加至视图中
     * @param view 视图
     */
    addView(view: any) {
        this.list.push(view);
        this.addChild(view);
    }

    /**依据浏览器大小改变大小 */
    resize() {
        this.width = Resolution.gameWidth;
        this.height = Resolution.gameHeight;
        this.scrollRect = new Laya.Rectangle(0, 0, Resolution.gameWidth, Resolution.gameHeight)
        for (let index = 0; index < this.list.length; index++) {
            let element = this.list[index];
            if (element['resize'])
                element.resize();
        }
    }

    clear() {
        // logInfo(' LayerManger clear ')
        for (let index = 0; index < this.list.length; index++) {
            const element: any = this.list[index];
            element.exit();
        }
        this.list.length = 0;
    }

}