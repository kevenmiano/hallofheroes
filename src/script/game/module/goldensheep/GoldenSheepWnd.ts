// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { BaseItem } from "../../component/item/BaseItem";
import { GoldenSheepEvent } from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import GoldenSheepManager from "../../manager/GoldenSheepManager";
import GoldenSheepItem from "./GoldenSheepItem";
import GoldenSheepModel from "./GoldenSheepModel";

export default class GoldenSheepWnd extends BaseWindow {
    public type: fgui.Controller;
    public goodsItem: fgui.GButton;
    public list: fgui.GList;
    private _model: GoldenSheepModel;
    public userNameTxt: fgui.GTextField;
    public countTxt: fgui.GTextField;
    public goodsNameTxt: fgui.GTextField;
    public closeBtn: fgui.GButton;
    public OnInitWind() {
        this._model = GoldenSheepManager.Instance.model;
        this.type = this.getController("type");
        this.addEvent();
        this.setCenter();
        this.refreshView();
    }

    OnShowWind() {
        super.OnShowWind();
    }

    private addEvent() {
        this.list.setVirtual();
        Utils.setDrawCallOptimize(this.list);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this._model.addEventListener(GoldenSheepEvent.STATE_UPDATE, this.stateUpdateHandler, this);
        this.closeBtn.onClick(this, this.closeBtnHandler);
    }

    private removeEvent() {
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this._model.removeEventListener(GoldenSheepEvent.STATE_UPDATE, this.stateUpdateHandler, this);
        this.closeBtn.offClick(this, this.closeBtnHandler);
    }

    private stateUpdateHandler() {
        if (!this._model.needShow) {
            this.OnHideWind();
        }
    }

    private closeBtnHandler() {
        this.OnHideWind();
    }

    private renderListItem(index: number, item: GoldenSheepItem) {
        item.index = index+1;
        item.info = this._model.recordList[index];
    }

    private refreshView() {
        let tempInfo: GoodsInfo = new GoodsInfo();
        tempInfo.templateId = this._model.rewardId;
        tempInfo.count = this._model.myCount;
        (this.goodsItem as BaseItem).info = tempInfo;
        if (this._model.myCount > 0) {
            this.type.selectedIndex = 1;
        }
        else {
            this.type.selectedIndex = 0;
        }
        this.list.numItems = this._model.recordList.length;
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
        super.dispose();
    }
}