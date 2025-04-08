// @ts-nocheck
import FUI_AssetAutoAnimation from "../../../fui/Base/FUI_AssetAutoAnimation";

/**
 * 自动战斗动画
 * 自动行走动画
 */
export default class AssetAutoAnimation extends FUI_AssetAutoAnimation {

    /**文字*/
    private worldMap: Array<string> = [];

    /** 文本*/
    private textFiled: Map<number, fgui.GTextField>;
    private textPos: Map<number, number>;

    private animation: boolean = false;

    protected onConstruct() {
        super.onConstruct();
        this.textFiled = new Map();
        this.textPos = new Map();
        this.showBg.selectedIndex = 0;
    }

    /**
     * 初始化文本
     * @param value 文本
     * @param showBg 是否显示背景
     * @param animation 是否播放文字动画
     */
    public initText(value: string, showBg: boolean = false, animation: boolean = true) {
        if (value == "") {
            return;
        }
        this.animation = animation;
        this.showBg.selectedIndex = showBg ? 1 : 0;
        if (value && value != "") {
            this.worldMap = value.split("|");
            let count = this.worldMap.length;
            for (let index = 0; index < count; index++) {
                let txt = this.worldMap[index];
                let txtFiled: fgui.GTextField = this["txt_" + index];
                if (txtFiled) {
                    txtFiled.text = txt;
                    this.textFiled.set(index, txtFiled);
                    this.textPos.set(index, txtFiled.y);
                }
            }
        }
    }



    /**
     * 开始
     */
    public start() {
        if (this.textFiled.size && this.animation)
            this.startAnimation();
    }

    private startAnimation() {
        Laya.Tween.clearAll(this);
        this.resetPostion();
        let self = this;
        if (!this.textFiled || this.textFiled.size == 0) return;
        let textCount = this.textFiled.size;
        let duration: number = 100;
        for (var i = 0; i < textCount; i++) {
            let txt = this.textFiled.get(i);
            let txtY: number = txt.y;
            Laya.Tween.to(txt, { y: txtY - 20 }, duration, null, Laya.Handler.create(this, (i) => {
                Laya.Tween.to(txt, { y: txtY }, duration, null, Laya.Handler.create(this, (i) => {
                    if (i >= textCount - 1) {
                        self.startAnimation();
                    }
                }, [i]), 100);
            }, [i]), i * 2 * duration, true, true);
        }
    }

    /**
     * 暂停
     */
    public stop() {
        if (this.animation)
            Laya.Tween.clearAll(this);
    }

    private resetPostion() {
        //重置坐标
        let textCount = this.textFiled.size;
        for (var i = 0; i < textCount; i++) {
            let txt = this.textFiled.get(i);
            let posY = this.textPos.get(i);
            txt.y = posY;
        }
    }

    dispose() {
        Laya.Tween.clearAll(this);
        this.textFiled.clear();
        this.textPos.clear();
        super.dispose();
    }

}