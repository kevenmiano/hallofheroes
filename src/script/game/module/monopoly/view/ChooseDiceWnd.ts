// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { MonopolyManager } from "../../../manager/MonopolyManager";

/**
* @author:zhihua.zhou
* @data: 2022-12-19
* @description 云端历险选择筛子界面
*/
export default class ChooseDiceWnd extends BaseWindow {

    private point:number=1;
    t0:fairygui.GTextField;
    img_select:fairygui.GImage;
    btn_submit:fairygui.GButton;

    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initLanguage();
        for (let i = 1; i < 7; i++) {
            let btn:fairygui.GButton = this['dice'+i];
            btn.onClick(this,this.onSelect,[i,btn]);
        }
        this.btn_submit.onClick(this,this.onSure);
    }

    initLanguage(){
        this.t0.text = LangManager.Instance.GetTranslation('monopoly.view.MonopolyDiceMagicFrame.TitleTxt');
    }

    onSelect(index:number,item:fairygui.GComponent){
        if(item){
            this.img_select.x = item.x-5;
            this.point = index;
        }
    }
    
    OnShowWind() {
        super.OnShowWind();
    }

    onSure(){
        MonopolyManager.Instance.sendRollDice(1, this.point);
        this.hide();
    }

    /**关闭 */
    OnHideWind() {
        for (let i = 1; i < 7; i++) {
            let btn:fairygui.GButton = this['dice'+i];
            btn.offClick(this,this.onSelect);
        }
        this.btn_submit.offClick(this,this.onSure);

        super.OnHideWind();
    }
}