/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-20 21:08:52
 * @Description: 公会邮件成员列表 v2.46 EmailConsortiaMemberView
 */

import BaseWindow from "../../../../../../core/ui/Base/BaseWindow";
import { ArrayConstant, ArrayUtils } from '../../../../../../core/utils/ArrayUtils';
import { EmWindow } from "../../../../../constant/UIDefine";
import { NotificationEvent } from '../../../../../constant/event/NotificationEvent';
import { ThaneInfo } from "../../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../../manager/ArmyManager";
import { ConsortiaManager } from "../../../../../manager/ConsortiaManager";
import { NotificationManager } from '../../../../../manager/NotificationManager';
import { FrameCtrlManager } from "../../../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../../control/ConsortiaControler";
import ConsortiaEmailMemberItem from "./ConsortiaEmailMemberItem";


export class ConsortiaEmailMemberWnd extends BaseWindow {

    private _contorller: ConsortiaControler;
    public tab2: fgui.GImage;
    public list: fgui.GList;
    public line: fgui.GGraph;
    public cancelBtn: fgui.GButton;
    public confirmBtn: fgui.GButton;
    private _memberList: any[];
    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initEvent();
        this.initView();
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
    }

    private initView() {
        this._memberList = ConsortiaManager.Instance.model.consortiaMemberList.getList();
        this._memberList = ArrayUtils.sortOn(this._memberList, ["dutyId"], [ArrayConstant.NUMERIC]);
        let count = this._memberList.length;
        //过滤自己
        for (let index = 0; index < count; index++) {
            let element: ThaneInfo = this._memberList[index];
            if (element.userId == ArmyManager.Instance.thane.userId) {
                this._memberList.splice(index, 1);
                break;
            }
        }
        this.list.numItems = this._memberList.length;
    }

    private initEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.cancelBtn.onClick(this, this.cancelBtnHandler);
        this.confirmBtn.onClick(this, this.confirmBtnHandler);
    }

    private removeEvent() {
        this.cancelBtn.offClick(this, this.cancelBtnHandler);
        this.confirmBtn.offClick(this, this.confirmBtnHandler);
        this.list.itemRenderer = null;
    }

    renderListItem(index: number, item: ConsortiaEmailMemberItem) {
        item.info = this._memberList[index];
    }

    cancelBtnHandler() {
        this.OnBtnClose();
    }

    confirmBtnHandler() {
        let itemList: Array<ConsortiaEmailMemberItem> = [];
        let item: ConsortiaEmailMemberItem;
        for (var i: number = 0; i < this.list.numItems; i++) {
            item = this.list.getChildAt(i) as ConsortiaEmailMemberItem;
            if (item.isSelected) {
                itemList.push(item);
            }
        }
        NotificationManager.Instance.sendNotification(NotificationEvent.UPDATA_CONSORTIAEMAIL_MEMBERLIST, itemList);
        this.OnBtnClose();
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}