// @ts-nocheck
import FUI_CumulativeRechargeDayView from "../../../../../fui/Funny/FUI_CumulativeRechargeDayView";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from '../../../component/item/BaseItem';
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import FunnyManager from "../../../manager/FunnyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import StarInfo from "../../mail/StarInfo";
import StarItem from "../../star/item/StarItem";
import FunnyBagData from "../model/FunnyBagData";
import FunnyConditionType from "../model/FunnyConditionType";
import FunnyData from "../model/FunnyData";
import FunnyType from "../model/FunnyType";
import CumulativeRechargeDayItem from "./CumulativeRechargeDayItem";
import { FunnyContent } from "./FunnyContent";

/**
* @author:pzlricky
* @data: 2022-03-04 11:18
* @description 累计充值天数 
*/
export default class CumulativeRechargeDayView extends FUI_CumulativeRechargeDayView implements FunnyContent{

    private _infoData: FunnyData = null;
    private _remainTime: number = 0;
    private dayAwardListDatas: Array<any> = [];//天数
    private goodListDatas: Array<any> = [];//单项物品列表
    private _selectItemData: FunnyBagData = null;
    private _selectItemIndex: number = 0;

    onShow() {
        let showID = FunnyManager.Instance.selectedId;
        let showData = FunnyManager.Instance.getShowData(showID);
        if (showID && showData) {
            this._infoData = showData;
        }
        this.initEvent();
        this.initView();
    }

    onUpdate() {
        let showID = FunnyManager.Instance.selectedId;
        let showData = FunnyManager.Instance.getShowData(showID);
        if (showID && showData) {
            this._infoData = showData;
        }
        this.initView();
    }

    onHide() {
        this.removeEvent();
    }

    initView() {
        if (!this._infoData || this._infoData.type != FunnyType.TYPE_CUMULATIVE_RECHARGE_DAY) return;
        this._remainTime = this._infoData.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
        if (this._remainTime > 0) {
            this.__updateTimeHandler();
            Laya.timer.loop(1000, this, this.__updateTimeHandler);
        }
        this.nameTitle.text = this._infoData.title;
        this.describeText.text = LangManager.Instance.GetTranslation("CumulativeRechargeDayView.desContent");
        this.setTimeText();
        let _itemList = [];
        this._selectItemIndex = 0;
        let hasSelected: boolean = false;
        for (var j: number = 0, b: boolean = false; j < this._infoData.bagList.length; j++) {
            if (this._infoData.type == FunnyType.TYPE_LEAVE) {
                if (!this._infoData.bagList[j].isShow) {
                    continue;
                }
                if (this.currentBag(this._infoData) != this._infoData.bagList[j] && this._infoData.bagList[j].status != 2) {
                    continue;
                }
            }
            if (!hasSelected) {
                if (((this._infoData.bagList[j].status == 1 || this._infoData.bagList[j].status == 2) && this._infoData.bagList[j].param1 == "1") || this._infoData.bagList[j].status == 3) {//
                    this._selectItemIndex = j;
                    hasSelected = true;
                }
            }

            _itemList.push(this._infoData.bagList[j]);
            if (this._infoData.bagList[j].conditionList[0].id != FunnyConditionType.ON_LINE) continue;
            for (var k: number = 0; k < this._infoData.bagList[j].conditionList.length; k++) {
                if (b || this._infoData.bagList[j].status == 1) {
                    b = true;
                    break;
                }
                if (this._infoData.bagList[j].conditionList[k].id == FunnyConditionType.ON_LINE && this._infoData.bagList[j].status == 3) {
                    b = true;
                }
            }
        }
        this.dayAwardListDatas = _itemList;
        if (_itemList.length > 0) {
            this.dayslist.numItems = _itemList.length;
            this.dayslist.selectedIndex = this._selectItemIndex;
            this.selectIndexState(this._selectItemIndex);
            this.onShowItemReards(_itemList[this._selectItemIndex]);
        } else {
            this.onShowItemReards(null);
        }
    }

    /**
     * 第一个状态不为2（不是已领取）的礼包数据
     */
    private currentBag(value: FunnyData): FunnyBagData {
        for (var i: number = 0; i < value.bagList.length; i++) {
            if (value.bagList[i].status != 2 && value.bagList[i].isShow) {
                return value.bagList[i];
            }
        }
        return null;
    }

    initEvent() {
        this.btn_recharge.onClick(this, this.onGotoRecharge);
        this.getRewardBtn.onClick(this, this.getRewardBtnHandler);
        this.dayslist.on(fairygui.Events.CLICK_ITEM, this, this.__onItemSelect);
        this.dayslist.itemRenderer = Laya.Handler.create(this, this.renderBoxList, null, false);
        Utils.setDrawCallOptimize(this.goodsList);
        this.goodsList.itemRenderer = Laya.Handler.create(this, this.renderGoodsList, null, false);
        this.goodsList.itemProvider = Laya.Handler.create(this, this.getListItemResource, null, false);
    }

    removeEvent() {
        this.btn_recharge.offClick(this, this.onGotoRecharge);
        this.getRewardBtn.offClick(this, this.getRewardBtnHandler);
        this.dayslist && this.dayslist.off(fairygui.Events.CLICK_ITEM, this, this.__onItemSelect);
        // this.dayslist && this.dayslist.itemRenderer.recover();
        // this.goodsList && this.goodsList.itemRenderer.recover();
        // this.goodsList && this.goodsList.itemProvider.recover();
        Utils.clearGListHandle(this.dayslist);
        Utils.clearGListHandle(this.goodsList);
    }

    /**
     * 前往充值
     */
    private onGotoRecharge() {
        FrameCtrlManager.Instance.exit(EmWindow.Funny);//关闭精彩活动
        RechargeAlertMannager.Instance.openShopRecharge();
    }

    private getRewardBtnHandler() {
        if (FunnyManager.Instance.selectedFunnyData.endTime <= PlayerManager.Instance.currentPlayerModel.nowDate) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"));
            return;
        }
        FunnyManager.Instance.sendGetBag(2, this._selectItemData.id);
    }

    private __onItemSelect(item: CumulativeRechargeDayItem, evt) {
        Logger.info("selectItem", item.info);
        this.selectIndexState(-1);
        item.selectItemState = true;
        this.onShowItemReards(item.info);
    }

    private selectIndexState(value: number = 0) {
        let count = this.dayslist.numChildren;
        if (count <= 0) return;
        for (let index = 0; index < count; index++) {
            let item = this.dayslist.getChildAt(index) as CumulativeRechargeDayItem;
            if (value == index) {
                item.selectItemState = true;
            } else {
                item.selectItemState = false;
            }
        }
    }

    private onShowItemReards(data: FunnyBagData) {
        this.goodListDatas = [];
        if (data) {
            this._selectItemData = data;
            for (var i: number = 0; i < data.rewardList.length; i++) {
                if (data.rewardList[i].temType == 1) {
                    var ginfo: GoodsInfo = new GoodsInfo();
                    ginfo.templateId = data.rewardList[i].temId;
                    ginfo.count = data.rewardList[i].count;
                    ginfo.isBinds = data.rewardList[i].isBind;
                    ginfo.strengthenGrade = data.rewardList[i].strengthenGrade <= 0 ? 1 : data.rewardList[i].strengthenGrade;
                    this.goodListDatas.push(ginfo);
                } else if (data.rewardList[i].temType == 2) {
                    var starInfo: StarInfo = new StarInfo();
                    starInfo.template = TempleteManager.Instance.getStarTemplateById(data.rewardList[i].temId);
                    starInfo.count = data.rewardList[i].count;
                    starInfo.grade = data.rewardList[i].strengthenGrade <= 0 ? 1 : data.rewardList[i].strengthenGrade;
                    this.goodListDatas.push(starInfo);
                }
            }
            this.goodsList.numItems = this.goodListDatas.length;
            switch (data.status) {//领取状态(1: 可领取, 2: 已领取, 3: 不能领取)
                case 1://可领取
                    this.reward.selectedIndex = 1;
                    break;
                case 2://已领取
                    this.reward.selectedIndex = 2;
                    break;
                case 3://未到条件领取
                    this.reward.selectedIndex = 0;
                    break;
                default:
                    this.reward.selectedIndex = 3;
                    break;
            }
        } else {
            this._selectItemData = null;
            this.goodsList.numItems = 0;
        }
    }

    renderBoxList(index: number, item: CumulativeRechargeDayItem) {
        if (!item || item.isDisposed) return;
        item.index = index;
        item.selectedIndex = (index == this._selectItemIndex) ? 1 : 0;
        item.info = this.dayAwardListDatas[index] as FunnyBagData;
    }

    //不同渲染聊天单元格
    private getListItemResource(index: number) {
        let data: any = this.goodListDatas[index];
        //系统信息
        if (data instanceof StarInfo) {
            return StarItem.URL;//星运
        } else {
            return BaseItem.URL;//物品
        }
    }

    renderGoodsList(index: number, item: BaseItem) {
        if (!item || item.isDisposed) return;
        item.info = this.goodListDatas[index];
    }

    __updateTimeHandler() {
        this.setRemainTime();
    }

    /**
     * 活动时间
     * */
    private setTimeText() {
        let startDate = new Date(this._infoData.startTime);
        let endDate = new Date(this._infoData.endTime);
        this.activityTime.text = LangManager.Instance.GetTranslation("giftbag.GiftBagItem.activeTime") + DateFormatter.timeFormat3(startDate, ".") + "-" + DateFormatter.timeFormat3(endDate, ".");
        this.setRemainTime();
    }

    /**
     * 剩余时间（若还没开始, 则不显示）
     * */
    public setRemainTime() {
        if (!this._infoData || this._infoData.type != FunnyType.TYPE_CUMULATIVE_RECHARGE_DAY) return;
        var remainTime: number = this._infoData.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
        if (remainTime >= 60) {
            this.remainTImes.text = LangManager.Instance.GetTranslation("funny.FunnyRightView.active.remainTime", DateFormatter.getFullTimeString(remainTime));
        } else if (remainTime > 0) {
            this.remainTImes.text = LangManager.Instance.GetTranslation("funny.FunnyRightView.active.remainTime", DateFormatter.getFullDateString(remainTime));
        } else {
            this.remainTImes.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
        }

        if (this._infoData.startTime > this.playerModel.nowDate) {
            this.remainTImes.text = LangManager.Instance.GetTranslation("public.unopen") + LangManager.Instance.GetTranslation("funny.FunnyRightView.active.timeText", DateFormatter.transDate(this._infoData.startTime), DateFormatter.transDate(this._infoData.endTime));
        }
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    dispose() {
        this.removeEvent();
        Laya.timer.clear(this, this.__updateTimeHandler);
        this.dayslist && this.dayslist.dispose();
        super.dispose();
    }

}