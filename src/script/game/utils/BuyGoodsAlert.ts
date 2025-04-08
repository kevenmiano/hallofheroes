import BaseWindow from '../../core/ui/Base/BaseWindow';
import UIButton from '../../core/ui/UIButton';
import { GoodsInfo } from '../datas/goods/GoodsInfo';
import { BaseItem } from "../component/item/BaseItem";
/**
 * 使用道具确认框
 * 1、道具图标显示
 * 2、当前道具拥有数量文字显示
 * 3、提示内容
 * UIManager.Instance.ShowWind(EmWindow.BuyGoodsAlert, {content:提示内容,goodsId:道具ID,goodsCount:道具拥有数量文字显示,callback:确认回调});
 */
export default class BuyGoodsAlert extends BaseWindow {

    /**确认按钮 */
    private btn_confirm: UIButton;
    /**取消按钮 */
    private btn_cancel: UIButton;
    /**提示内容 */
    private txt_content: fgui.GLabel;
    /** 道具图标显示 */
    private item: BaseItem;
    private n1: fgui.GComponent;

    public OnInitWind() {
        this.modelEnable = false;
        this.addEvent();
        this.setCenter();
    }

    OnShowWind() {
        super.OnShowWind();
        if (this.params) {
            this.txt_content.text = this.params.content;
            let gInfo: GoodsInfo = new GoodsInfo();
            gInfo.templateId = this.params.goodsId;
            if (this.params.count) {
                gInfo.count = this.params.count;
            }
            this.item.info = gInfo;
        }
    }

    private addEvent() {
        this.btn_confirm.onClick(this, this.onConfirm.bind(this));
        this.btn_cancel.onClick(this, this.onCancel.bind(this));
        this.n1.getChild("closeBtn").on(Laya.Event.CLICK, this, this.onClose);
    }

    private removeEvent() {
        this.btn_confirm.offClick(this, this.onConfirm.bind(this));
        this.btn_cancel.offClick(this, this.onCancel.bind(this));
        this.n1.getChild("closeBtn").off(Laya.Event.CLICK, this, this.onClose);
    }

    private onConfirm() {
        if (this.params.callback) {
            this.params.callback(true, this.params);
        }
        this.OnBtnClose();
    }

    private onCancel() {
        this.OnBtnClose();
    }

    private onClose() {
        this.OnBtnClose();
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
        this.params = null;
    }
}