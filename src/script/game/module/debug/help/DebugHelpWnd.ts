// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-01-25 15:28:08
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-26 11:31:41
 * @Description: 
 */

import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { DebugHelpItem } from "./DebugHelpItem";
import { DebugHelpModel } from "./DebugHelpModel";

export class DebugHelpWnd extends BaseWindow {
    protected setScenterValue: boolean = true;
    data: DebugHelpModel
    list: fgui.GList
    itemTitle: DebugHelpItem
    
    OnInitWind() {
        super.OnInitWind();
        this.addEvent();
        this.initData();
        this.initView();
    }

    addEvent(){
        
    }

    removeEvent(){
        
    }

    initData() {
        this.data = new DebugHelpModel()
    }
    
    initView() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
        this.list.numItems = this.data.dataList.length

        this.itemTitle.txt1.text = "命令"
        this.itemTitle.txt2.text = "名字"
        this.itemTitle.txt3.text = "用例"
        this.itemTitle.txt4.text = "描述"
    }

    private onRenderListItem(index: number, item: DebugHelpItem) {
        item.info = this.data.dataList[index]
    }
    
    private onClickItem(item: DebugHelpItem) {
        
    }

    protected get modelAlpha() {
        return 0
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}