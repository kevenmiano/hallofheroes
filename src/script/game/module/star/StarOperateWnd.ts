/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2021-05-27 11:59:53
 * @LastEditors: jeremy.xu
 * @Description: 
 */
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { StarManager } from "../../manager/StarManager";

export default class StarOperateWnd extends BaseWindow {
    private list: fgui.GList
    private btnTickRemind: UIButton

    private callback: Function

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.setCenter();
        let type = StarManager.Instance.starModel.starQuickSellType;
        if (type == 1) {
            this.list.getChildAt(0).asButton.selected = true
        }
        if (type == 2) {
            this.list.getChildAt(1).asButton.selected = true
        }
        if (type == 3) {
            this.list.getChildAt(2).asButton.selected = true
        }
        this.list.ensureSizeCorrect();
        if (this.frameData) {
            this.callback = this.frameData
        }
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    btnCancelClick() {
        this.OnBtnClose()
        this.callback && this.callback(false, this.btnTickRemind.selected)
    }

    btnConfirmClick() {
        let type = 1
        if (this.list.getChildAt(0).asButton.selected) {
            type = 1
        }
        if (this.list.getChildAt(1).asButton.selected) {
            type = 2
        }
        if (this.list.getChildAt(2).asButton.selected) {
            type = 3
        }

        StarManager.Instance.starModel.starQuickSellType = type
        StarManager.Instance.starModel.quickSellClick(type)

        this.OnBtnClose()
        this.callback && this.callback(true, this.btnTickRemind.selected)
    }
}