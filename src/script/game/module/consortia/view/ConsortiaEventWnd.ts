// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-30 15:30:13
 * @Description: 公会事件 v2.46 ConsortiaEventFrame  已调试
 */
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ConsortiaEventItem } from "./component/ConsortiaEventItem";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { DataCommonManager } from "../../../manager/DataCommonManager";

export class ConsortiaEventWnd extends BaseWindow {

    private _contorller: ConsortiaControler;
    private _data: ConsortiaModel;
    private list: fgui.GList;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initData();
        this.initEvent();
        this.initView();
    }

    private initEvent() {
        this._data.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_EVENT_LIST, this.__onEventListUpdate, this);
        DataCommonManager.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._data = this._contorller.model;
    }

    private initView() {
        this.list.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);
        this._contorller.getConsortiaEventInfos();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private __renderListItem(index: number, item: ConsortiaEventItem) {
        let eventList = this._data.consortiaEventList;
        let data = eventList[index]
        if(data){
            item.info = data
        }else{
            item.info = null;
        }
    }

    private __onEventListUpdate() {
        let eventList = this._data.consortiaEventList;
        let length: number = eventList.length > ConsortiaModel.CONSORTIA_EVENT_LIST_NUM ? eventList.length : ConsortiaModel.CONSORTIA_EVENT_LIST_NUM;
        this.list.setVirtual();
        this.list.numItems = length;
    }

    private __existConsortiaHandler() {
        if (DataCommonManager.playerInfo.consortiaID == 0) {
            this.hide();
        }
    }

    private removeEvent() {
        this._data.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_EVENT_LIST, this.__onEventListUpdate, this);
        DataCommonManager.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}