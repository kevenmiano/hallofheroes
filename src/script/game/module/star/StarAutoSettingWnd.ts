// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2023-06-29 18:18:25
 * @LastEditors: jeremy.xu
 * @Description: 自动占星
 */
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { SharedManager } from "../../manager/SharedManager";

export default class StarAutoSettingWnd extends BaseWindow {
    private list: fgui.GList
    private btnConfirm: UIButton;

    private autoCostList: fgui.GList;
    private autoSellList: fgui.GList;
    private autoComposeList: fgui.GList;

    private autoCostText: fgui.GTextField;
    private autoSellText: fgui.GTextField;
    private autoComposeText: fgui.GTextField;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initView();
    }

    private initView() {
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.onSetDefaultData();
    }

    /** */
    private onSetDefaultData() {
        let selfData: any = SharedManager.Instance.getAutoStarSetting();
        let autoCost: number = 0;
        let autoSell: number = 0;
        let autoCompose: number = 0;
        if (selfData) {
            autoCost = selfData.autoCost;
            autoSell = selfData.autoSell;
            autoCompose = selfData.autoCompose;
        }
        this.autoCostList.selectedIndex = autoCost;
        this.autoSellList.selectedIndex = autoSell;
        this.autoComposeList.selectedIndex = autoCompose;
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    btnCancelClick() {
        this.OnBtnClose();
    }

    btnConfirmClick() {
        let autoCost = this.autoCostList.selectedIndex;//花费
        let autoSell = this.autoSellList.selectedIndex;//自动出售
        let autoCompose = this.autoComposeList.selectedIndex;//自动合并
        SharedManager.Instance.setAutoStarSetting(autoCost, autoSell, autoCompose);
        this.OnBtnClose();
    }


}