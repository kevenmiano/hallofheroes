import BaseWindow from '../../core/ui/Base/BaseWindow';
import UIButton from '../../core/ui/UIButton';
import { GoodsInfo } from '../datas/goods/GoodsInfo';
import { BaseItem } from "../component/item/BaseItem";
import { NotificationManager } from '../manager/NotificationManager';
import { NotificationEvent } from '../constant/event/NotificationEvent';
/**
 * 使用道具确认框
 * 1、道具图标显示
 * 2、当前道具拥有数量文字显示
 * 3、提示内容
 * UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {content:提示内容,goodsId:道具ID,goodsCount:道具拥有数量文字显示,callback:确认回调});
 */
export default class UseGoodsAlert extends BaseWindow {

    /**确认按钮 */
    private btn_confirm: UIButton;
    /**取消按钮 */
    private btn_cancel: UIButton;
    /**提示内容 */
    private txt_content: fgui.GLabel;
    /**当前道具拥有数量文字显示 */
    private txt_count: fgui.GLabel;
    /** 道具图标显示 */
    private item: BaseItem;
    private n1: fgui.GComponent;
    private checkContainer1: fgui.GGroup;
    private check1Btn: UIButton;//下次不再提示
    private autoClose:boolean=true;
    private check1RickText:fgui.GTextField;
    public OnInitWind() {
        this.addEvent();
        this.setCenter();
    }

    OnShowWind() {
        super.OnShowWind();
        this.updateView();
    }

    refreshView(params) {
        for (let key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                let value = params[key];
                this.params[key] = value;
            }
        }
        
        this.updateView();
    }

    private updateView(){
        if (this.params) {
            this.txt_content.text = this.params.content;
            this.txt_count.text = this.params.goodsCount;
            let gInfo: GoodsInfo = new GoodsInfo();
            gInfo.templateId = this.params.goodsId;
            this.item.info = gInfo;
            if(this.params.hasOwnProperty("autoClose")) {
                this.autoClose = this.params.autoClose;
            }
            if(this.params.hasOwnProperty("hidecheck1")) {
                this.checkContainer1.visible = !this.params.hidecheck1;
            }
            if(this.params.hasOwnProperty("check1RickText")) {
                this.check1RickText.text = this.params.check1RickText;
                this.checkContainer1.visible = true;
            }
        }
    }

    private addEvent() {
        this.btn_confirm.onClick(this, this.onConfirm.bind(this));
        this.btn_cancel.onClick(this, this.onCancel.bind(this));
        this.n1.getChild("closeBtn").on(Laya.Event.CLICK, this, this.onClose);
        NotificationManager.Instance.addEventListener(NotificationEvent.USE_PROP,this.refreshView,this)
    }

    private removeEvent() {
        this.btn_confirm.offClick(this, this.onConfirm.bind(this));
        this.btn_cancel.offClick(this, this.onCancel.bind(this));
        this.n1.getChild("closeBtn").off(Laya.Event.CLICK, this, this.onClose);
        NotificationManager.Instance.removeEventListener(NotificationEvent.USE_PROP,this.refreshView,this)
    }

    private onConfirm() {
        if(this.params.callback){
            this.params.callback(true,this.check1Btn.selected);
        }
        if(this.autoClose){
            this.OnBtnClose();
        }
    }

    private onCancel() {
        if(this.params.callback){
            this.params.callback(false);
        }
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