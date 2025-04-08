// @ts-nocheck
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import OutyardManager from "../../manager/OutyardManager";
import OutyardUserInfo from "./data/OutyardUserInfo";
import OutyardModel from "./OutyardModel";
import OutyardChangeItem from "./view/OutyardChangeItem";
import StackHeadSeniorGeneralMsg = com.road.yishi.proto.stackhead.StackHeadSeniorGeneralMsg;
import Utils from "../../../core/utils/Utils";

/**
 * 修改四将（参战队伍）
 */
export default class OutyardChangeWnd extends BaseWindow {
    public list: fgui.GList;
    public confirmBtn: fgui.GButton;
    public descTxt: fgui.GTextField;
    public zhiyeBtn: fgui.GButton;
    public roleBtn: fgui.GButton;
    public levelBtn: fgui.GButton;
    public fightBtn: fgui.GButton;

    private _sortField: string = "fightingCapacity";
    private _isReverse: boolean = false;
    private _listData: Array<OutyardUserInfo> = [];
    private _selectedItem: OutyardChangeItem;
    private _selectInfo: OutyardUserInfo;
    private selectSenior: number = 0;
    private _defaultSelectInfo:OutyardUserInfo;
    public OnInitWind() {
        this.setCenter();
        this.addEvent();
    }

    OnShowWind() {
        super.OnShowWind();
        if (this.frameData && this.frameData.selectSenior) {
            this.selectSenior = this.frameData.selectSenior;
        }
        if (this.frameData && this.frameData.defaultSelectInfo) {
            this._defaultSelectInfo = this.frameData.defaultSelectInfo;
        }
        this.fightBtnHander();
    }

    private addEvent() {
        this.roleBtn.onClick(this, this.roleBtnHander);
        this.levelBtn.onClick(this, this.levelBtnHander);
        this.fightBtn.onClick(this, this.fightBtnHander);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onListSelect);
        this.confirmBtn.onClick(this, this.confirmBtnHandler);
    }

    private removeEvent() {
        this.roleBtn.offClick(this, this.roleBtnHander);
        this.levelBtn.offClick(this, this.levelBtnHander);
        this.fightBtn.offClick(this, this.fightBtnHander);
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.onListSelect);
        this.confirmBtn.offClick(this, this.confirmBtnHandler);
    }

    private confirmBtnHandler() {
        if (this._selectedItem) {
            this._selectInfo = this._selectedItem.info
        }
        if (this._selectInfo) {
            var senior: StackHeadSeniorGeneralMsg = new StackHeadSeniorGeneralMsg();
            senior.userUid = this._selectInfo.userUid;
            senior.index = this.selectSenior;
            OutyardManager.Instance.OperateOutyard(OutyardManager.SET_SENIOR, 0, "", senior);
            NotificationManager.Instance.dispatchEvent(NotificationEvent.OUTYARD_CHANGE_SENIOR);
        }
        this.hide();
    }

    private onListSelect(clickItem: OutyardChangeItem) {
        if (this._selectedItem) {
            this._selectedItem.selected = false;
            this._selectedItem = clickItem;
            this._selectedItem.selected = true;
        } else {
            this._selectedItem = clickItem;
            this._selectedItem.selected = true;
        }
    }

    private renderListItem(index: number, item: OutyardChangeItem) {
        if (!item || item.isDisposed) return;
        if (this._listData[index].userId == this._defaultSelectInfo.userId) {
            this._selectedItem = item;
            item.selected = true;
        } else {
            item.selected = false;
        }
        item.info = this._listData[index];
    }

    private roleBtnHander() {
        this._sortField = "nickName";
        this._isReverse = !this._isReverse;
        this.setListView();
    }

    private levelBtnHander() {
        this._sortField = "grades";
        this._isReverse = !this._isReverse;
        this.setListView();
    }

    private fightBtnHander() {
        this._sortField = "fightingCapacity";
        this._isReverse = !this._isReverse;
        this.setListView();
    }

    private stateBtnHander() {
        this._sortField = "inBattle";
        this._isReverse = !this._isReverse;
        this.setListView();
    }

    private setListView() {
        this.list.numItems = 0;
        this._listData = this.outYardModel.getSortMemberList(this._sortField, this._isReverse)
        this.list.numItems = this._listData.length;
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private get outYardModel(): OutyardModel {
        return OutyardManager.Instance.model;
    }

    dispose() {
        super.dispose();
    }
}