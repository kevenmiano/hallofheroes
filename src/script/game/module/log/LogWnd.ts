// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-06-22 10:49:42
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-09-27 10:40:15
 * @Description: 
 */

import BaseWindow from '../../../core/ui/Base/BaseWindow';
import Logger from '../../../core/logger/Logger';
import UIButton from '../../../core/ui/UIButton';

export default class LogWnd extends BaseWindow {
    private list: fgui.GList
    private btnRefresh: UIButton
    private bMouseThrough: boolean = true

    public OnInitWind() {
        this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.displayObject.mouseThrough = true;
        this.refresh()
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    private refresh() {
        this.list.numItems = Logger.LogWndStr.length
    }

    private onClickItem(item: fgui.GComponent) {

    }

    private btnRefreshClick() {
        this.bMouseThrough = !this.bMouseThrough
        this.list.displayObject.mouseThrough = this.bMouseThrough
        this.refresh()
    }

    private renderListItem(index: number, item: fgui.GComponent) {
        let itemData = Logger.LogWndStr[index]
        if (!itemData) return

        item.getChild("content").text = itemData
    }
}