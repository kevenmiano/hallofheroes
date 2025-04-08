// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-13 14:44:44
 * @Description: 
 */

import { EmMainToolBarBtnLocationType } from "./EmMainToolBarBtnLocationType";
import { EmMainToolBarBtnType } from "./EmMainToolBarBtnType";


export class MainToolBarButtonData {
    //按钮类型
    buttonType: EmMainToolBarBtnType = EmMainToolBarBtnType.None;
    //排列在哪的类型
    private _locationType: EmMainToolBarBtnLocationType = EmMainToolBarBtnLocationType.Row1;
    set locationType(v:EmMainToolBarBtnLocationType) {
        this._locationType = v
        switch (v) {
            case EmMainToolBarBtnLocationType.Row1:
            case EmMainToolBarBtnLocationType.Cow:
                this.prefabName = "Btn_Main_Menu"
                break;
            case EmMainToolBarBtnLocationType.Row2:
                this.prefabName = "Btn_Main_SecondMenu"
                break;
        }
    }
    get locationType():EmMainToolBarBtnLocationType {
        return this._locationType
    }
    //名字
    name: string = "";
    //渲染的组件
    prefabName: string = "Btn_Main_Menu";
    //图标
    url: string = "";
    //排序 越小越前 相同排同一位置
    sort: number = 0;
    //开放
    open: boolean = false;
    //某些因素下不显示
    limitShowfunc: Function;
    //是否显示
    getVisible(): boolean {
        let b = true
        if (this.limitShowfunc) {
            b = this.limitShowfunc()
        }
        return this.open && b
    }

    reset() {
        
    }
}