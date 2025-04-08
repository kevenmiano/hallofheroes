// @ts-nocheck
import FUI_CumulativeRechargeView from "../../../../../fui/Funny/FUI_CumulativeRechargeView";
import { FeedBackEvent } from "../../../constant/event/NotificationEvent";
import FeedBackManager from "../../../manager/FeedBackManager";
import LangManager from '../../../../core/lang/LangManager';
import FeedBackItemData from "../../../datas/feedback/FeedBackItemData";
import CumulativeRechargeItem from "./CumulativeRechargeItem";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { PlayerManager } from "../../../manager/PlayerManager";
import FeedBackData from "../../../datas/feedback/FeedBackData";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { EmWindow } from '../../../constant/UIDefine';
import Logger from '../../../../core/logger/Logger';
import { LoginManager } from '../../login/LoginManager';
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { FunnyContent } from "./FunnyContent";
import Utils from "../../../../core/utils/Utils";

/**
* @author:pzlricky
* @data: 2022-03-04 11:16
* @description 累计充值
*/
export default class CumulativeRechargeView extends FUI_CumulativeRechargeView implements FunnyContent{

    private _dataList: Array<FeedBackItemData>;
    private _currentLeftOpenTime: number;
    private _childIndex: number;
    onConstruct() {
        super.onConstruct();
        this.list.setVirtual();
    }

    initView() {
        this.nameTitle.text = LangManager.Instance.GetTranslation("feedback.FeedBackFrame.title");
        this.tips.text = LangManager.Instance.GetTranslation("CumulativeRechargeView.tips");
        this.refreshView();
    }

    onShow() {
        this.initEvent();
        this.initView();
    }

    onUpdate() {
        this.initView();
    }

    onHide() {
        this.removeEvent();
    }

    private initEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderBoxList, null, false);
        // FeedBackManager.Instance.addEventListener(FeedBackEvent.FEEDBACK_RECEIVE_USERINFO, this.refreshView, this);
        this.btn_active.onClick(this, this.activeHandler);
        this.BtnLeft.onClick(this, this.leftHandler);
        this.BtnRight.onClick(this, this.rightHandler);
    }

    leftHandler() {
        this.list.scrollPane.scrollLeft(1, true);
    }

    rightHandler() {
        this.list.scrollPane.scrollRight(1, true);
    }
    private removeEvent() {
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        // FeedBackManager.Instance.removeEventListener(FeedBackEvent.FEEDBACK_RECEIVE_USERINFO, this.refreshView, this);
        Laya.timer.clearAll(this);
        this.btn_active.offClick(this, this.activeHandler);
    }

    private renderBoxList(index: number, item: CumulativeRechargeItem) {
        if (!item || item.isDisposed) return;
        item.index = index + 1;
        item.info = this._dataList[index];
    }

    private refreshView() {
        this._dataList = FeedBackManager.Instance.list;
        this.list.numItems = this._dataList.length;
        if (this.list.numItems > 0) {
            let selectedIndex: number = this.getFirstCanGetIndex();
            if (selectedIndex == -1) {//没有可领取的礼包
                this._childIndex = this.getFirstNotCanGetIndex();
            } else {
                this._childIndex = this.list.childIndexToItemIndex(selectedIndex);
            }
            if (this._childIndex >= this.list.numItems) {
                this._childIndex = this.list.numItems - 1;
            }
            this.list.scrollToView(this._childIndex);
        }
        this.rechargeCount.text = LangManager.Instance.GetTranslation("CumulativeRechargeView.chargeNumber", this.feedBackData.userPoint);
        this._currentLeftOpenTime = this.feedBackData.endTime - PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        if (this._currentLeftOpenTime > 0) {
            Laya.timer.clear(this, this.updateLeftTimeHandler);
            this.times.text = LangManager.Instance.GetTranslation("funny.FunnyRightView.active.remainTime", DateFormatter.getFullDateString(this._currentLeftOpenTime));
            Laya.timer.loop(1000, this, this.updateLeftTimeHandler);
        }
        else {
            this.times.text = "";
        }
    }

    //得到第一个可领取的礼包的序号
    private getFirstCanGetIndex(): number {
        let index: number = -1;
        let array: Array<FeedBackItemData> = FeedBackManager.Instance.list;
        let item: FeedBackItemData;
        if (array.length > 0) {
            for (let i = 0; i < array.length; i++) {
                item = array[i];
                if (item && FeedBackManager.Instance.data.userPoint >= item.point && !item.state) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    //得到第一个不可领取的礼包的序号
    private getFirstNotCanGetIndex(): number {
        let index: number = 0;
        let array: Array<FeedBackItemData> = FeedBackManager.Instance.list;
        let item: FeedBackItemData;
        if (array.length > 0) {
            for (let i = 0; i < array.length; i++) {
                item = array[i];
                if (item && FeedBackManager.Instance.data.userPoint < item.point) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    private updateLeftTimeHandler() {
        this._currentLeftOpenTime--;
        if (this._currentLeftOpenTime <= 0) {
            Laya.timer.clear(this, this.updateLeftTimeHandler);
            this.times.text = "";
            LoginManager.Instance.loginRebateChargeReq();
        } else {
            this.times.text = LangManager.Instance.GetTranslation("funny.FunnyRightView.active.remainTime", DateFormatter.getFullDateString(this._currentLeftOpenTime));
        }
    }

    private activeHandler() {
        FrameCtrlManager.Instance.exit(EmWindow.Funny);
        RechargeAlertMannager.Instance.openShopRecharge();
    }

    private get feedBackData(): FeedBackData {
        return FeedBackManager.Instance.data;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}