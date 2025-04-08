
import LangManager from "../../../../../core/lang/LangManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../../core/ui/UIButton";
import { eFilterFrameText, FilterFrameText } from "../../../../component/FilterFrameText";
/**
 * 英灵装备筛选界面
 */
export default class ScreenWnd extends BaseWindow {
    /**确认按钮 */
    private btn_confirm: UIButton;
    /**取消按钮 */
    private btn_cancel: UIButton;
       
    list1:fgui.GList;
    list2:fgui.GList;

    private _qualityArr = [];
    private _starArr = [];

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        this._qualityArr = this.params.profile;
        this._starArr = this.params.star;

        for (let i = 1; i < 6; i++) {
            let btn:fairygui.GButton = this.contentPane.getChild('qBtn'+i) as fairygui.GButton;
            (btn.getChild('title') as fairygui.GTextField).color = FilterFrameText.Colors[eFilterFrameText.PetQuality][i-1];
            btn.getChild('title').text = LangManager.Instance.GetTranslation('yishi.utils.GoodsHelp.getGoodQualityName0'+i);
            btn.onClick(this,this.onClickQuality,[i]);
            if(this._qualityArr.indexOf(i) >= 0){
                btn.selected = true;
            }

            let btn1:any = this.contentPane.getChild('sBtn'+i);
            btn1.getChild('title').text = LangManager.Instance.GetTranslation('store.view.refresh.RefreshAttriItem.Grades',i);
            btn1.onClick(this,this.onClickStar,[i]);
            if(this._starArr.indexOf(i) >= 0){
                btn1.selected = true;
            }        
        }
    }

    onClickQuality(index){
        let idx = this._qualityArr.indexOf(index);
        if(idx >= 0){
            this._qualityArr.splice(idx,1);
        }else
        {
            this._qualityArr.push(index);
        }
    }

    onClickStar(index){
        let idx = this._starArr.indexOf(index);
        if(idx >= 0){
            this._starArr.splice(idx,1);
        }else
        {
            this._starArr.push(index);
        }
    }

    private addEvent() {
        this.btn_confirm.onClick(this, this.onConfirm.bind(this));
        this.btn_cancel.onClick(this, this.onCancel.bind(this));
        // this.n1.getChild("closeBtn").on(Laya.Event.CLICK, this, this.onClose);
    }

    private removeEvent() {
        this.btn_confirm.offClick(this, this.onConfirm.bind(this));
        this.btn_cancel.offClick(this, this.onCancel.bind(this));
        // this.n1.getChild("closeBtn").off(Laya.Event.CLICK, this, this.onClose);
    }

    // public onTabClick1(item: fgui.GObject, evt: Laya.Event) {
       
        
    // }

    // public onTabClick2(item: fgui.GObject, evt: Laya.Event) {
       
        
    // }

    private onConfirm() {
        if (this.params.callback) {
            this.params.callback(this._qualityArr, this._starArr);
        }
        this.OnBtnClose();
    }

    private onCancel() {
        this._qualityArr.length = 0;
        this._starArr.length = 0;
        if (this.params.callback) {
            this.params.callback(this._qualityArr, this._starArr);
        }
        this.OnBtnClose();
    }

    OnShowWind() {
        super.OnShowWind();
    }


    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }
}