// @ts-nocheck
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from '../../../core/ui/UIButton';
import Utils from "../../../core/utils/Utils";
import { EmWindow } from "../../constant/UIDefine";
import { VIPManager } from "../../manager/VIPManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import PrivilegeItemData from "./PrivilegeItemData";
import VipPrivilegeCtrl from "./VipPrivilegeCtrl";
import VipPrivilegeItem from './VipPrivilegeItem';


/**
 * 
 * VIP特权
 */
export default class VipPrivilegeWnd extends BaseWindow {



    private BtnLeft: UIButton;
    private BtnRight: UIButton;

    private cfgprivileges: PrivilegeItemData[] = [];
    private viplist: fgui.GList;

    private showIndex: number = 0;
    private maxPageCount: number = 0;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        this.onInitListData();
        this.initView();
    }

    private initView() {
        //玩家VIP等级
        let userVipGrade = VIPManager.Instance.model.vipInfo.VipGrade;
        if (userVipGrade <= 0) {
            this.showIndex = 0;
        } else {
            this.showIndex = userVipGrade - 1;
        }
        if (this.showIndex >= this.viplist.numItems) {//兼容配置表错误
            this.showIndex = this.viplist.numItems - 1;
        }
        this.viplist.scrollPane.mouseWheelEnabled = false;//禁止鼠标滚轮滑动

        this.viplist.scrollToView(this.showIndex);
        this.setPageBtnVisible();
    }

    private addEvent() {
        this.BtnLeft.onClick(this, this.onPageLeft);
        this.BtnRight.onClick(this, this.onPageRight);
        this.viplist.setVirtual();
        this.viplist.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private offEvent() {
        this.BtnLeft.offClick(this, this.onPageLeft);
        this.BtnRight.offClick(this, this.onPageRight);
        // this.viplist.itemRenderer.recover();
        Utils.clearGListHandle(this.viplist);
    }

    private onPageLeft() {
        if (this.showIndex <= 0) {
            return;
        }
        this.showIndex--;
        this.setPageBtnVisible();
        this.viplist.scrollToView(this.showIndex, true);
    }

    private onPageRight() {
        if (this.showIndex >= this.maxPageCount - 1) {
            return;
        }
        this.showIndex++;
        this.setPageBtnVisible();
        this.viplist.scrollToView(this.showIndex, true);
    }

    private setPageBtnVisible() {
        this.BtnLeft.visible = this.showIndex > 0;
        this.BtnRight.visible = this.showIndex < this.maxPageCount - 1;
    }

    renderListItem(index: number, item: VipPrivilegeItem) {
        item.itemData = this.cfgprivileges[index];
    }

    private onInitListData() {
        let list = this.vipctrl.getListData();
        this.cfgprivileges = list;
        this.maxPageCount = list.length;
        this.viplist.numItems = this.maxPageCount;
    }

    private get vipctrl(): VipPrivilegeCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.VipPrivilege) as VipPrivilegeCtrl;
    }


    OnShowWind() {
        super.OnShowWind();
    }

    OnHideWind() {
        this.offEvent();
        super.OnHideWind();
    }

}