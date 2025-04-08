// @ts-nocheck
import FUI_FoisonHornView from "../../../../../fui/Funny/FUI_FoisonHornView";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import FoisonHornManager from "../../../manager/FoisonHornManager";
import FunnyManager from "../../../manager/FunnyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FoisonHornModel from "../../../mvc/model/FoisonHornModel";
import FUIHelper from "../../../utils/FUIHelper";
import { GoodsHelp } from "../../../utils/GoodsHelp";
import FoisonHornItem from "./FoisonHornItem";
import { FunnyContent } from "./FunnyContent";
/**
 * 丰收号角
 */
export default class FoisonHornView extends FUI_FoisonHornView implements FunnyContent {
    private _goodsDataList: Array<any> = [];
    private _canActiveCount: number = 0;
    private _hasActiveCount: number = 0;
    public iconPic: fgui.GComponent;
    private _remainTime: number = 0;

    onShow() {
        this.hasAtiveBtn.visible = false;
        this.hasAtiveBtn.enabled = false;
        this.initEvent();
        this.refreshView();
        SharedManager.Instance.saveFoisonHornClick();
        FoisonHornManager.Instance.sendRequest(FoisonHornManager.OPEN_FRAME);
    }

    onUpdate() {
        this.hasAtiveBtn.visible = false;
        this.hasAtiveBtn.enabled = false;
        this.initEvent();
        this.refreshView();
        SharedManager.Instance.saveFoisonHornClick();
        FoisonHornManager.Instance.sendRequest(FoisonHornManager.OPEN_FRAME);
    }

    onHide() {
        this.removeEvent();
    }

    private initView() {
        this._canActiveCount = 0;
        this._hasActiveCount = 0;
        this._goodsDataList = this.foisonHornModel.goodsList;
        this.goodsList.numItems = this._goodsDataList.length;
        this.activeBtn.enabled = this._canActiveCount >= this.goodsList.numItems;
        this.activeBtn.visible = this._hasActiveCount <= 0;
        this.hasAtiveBtn.visible = this._hasActiveCount >= this.goodsList.numItems;

        let endTime = DateFormatter.parse(this.foisonHornModel.stopTime, "YYYY-MM-DD hh:mm:ss").getTime();
        this._remainTime = endTime / 1000 - this.playerModel.sysCurTimeBySecond;
        if (this._remainTime > 0) {
            this.__updateTimeHandler();
            Laya.timer.loop(1000, this, this.__updateTimeHandler);
        }
    }

    __updateTimeHandler() {
        this.setRemainTime();
    }

    setRemainTime() {
        this._remainTime--;
        if (this._remainTime >= 60) {
            this.leftTimeTxt.text = DateFormatter.getFullTimeString(this._remainTime);
        } else if (this._remainTime > 0) {
            this.leftTimeTxt.text = DateFormatter.getFullDateString(this._remainTime);
        } else {
            this.leftTimeTxt.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
        }
    }

    private refreshView() {
        this.timeValueTxt.text = this.foisonHornModel.openTime.substring(5).replace("-", ".") + " - " + this.foisonHornModel.stopTime.substring(5).replace("-", ".");
        this.rechargeCount.text = this.foisonHornModel.totalCount + "";
        let str = LangManager.Instance.GetTranslation("FoisonHornView.tipData");
        let tipData =  this.getRewardStr(this.foisonHornModel.rewardInfo);
        FUIHelper.setTipData(
            this.picBtn,
            EmWindow.CommonTips,
            tipData
        )
        this.initView();
    }

    initEvent() {
        this.goodsList.itemRenderer = Laya.Handler.create(this, this.renderGoodsList, null, false);
        NotificationManager.Instance.addEventListener(NotificationEvent.FOISONHORN_INFO_CHANGE, this.refreshView, this);
        this.activeBtn.onClick(this, this.activeBtnClickHandler);
    }

    removeEvent() {
        // this.goodsList && this.goodsList.itemRenderer.recover();
        Utils.clearGListHandle(this.goodsList);
        NotificationManager.Instance.removeEventListener(NotificationEvent.FOISONHORN_INFO_CHANGE, this.refreshView, this);
        this.activeBtn.offClick(this, this.activeBtnClickHandler);
        Laya.timer.clear(this, this.__updateTimeHandler);
    }

    renderGoodsList(index: number, item: FoisonHornItem) {
        if (!item || item.isDisposed) return;
        item.index = index;
        item.info = this._goodsDataList[index];
        if (item.canActive) this._canActiveCount++;
        if (item.isActivated) this._hasActiveCount++;
    }

    private getRewardStr(rewardStr: string): string {
        var goodsArr: Array<any> = rewardStr.split("|");
        var goodTemp: t_s_itemtemplateData;
        var resultStr: string = "";
        var vColor: string;
        var arr: Array<any>;
        for (var i: number = 0; i < goodsArr.length; i++) {
            arr = goodsArr[i].split(",");
            if (arr.length == 2) {
                goodTemp = TempleteManager.Instance.getGoodsTemplatesByTempleteId(parseInt(arr[0]));
                if (goodTemp) {
                    if (resultStr != "") {
                        resultStr += "<br>";
                    }
                    vColor = GoodsHelp.getGoodColorString(goodTemp.Profile);
                    resultStr += "[color=" + vColor + "]" + goodTemp.TemplateNameLang + " *" + arr[1] + "[/color]";
                }
            }
        }
        return resultStr;
    }
    private activeBtnClickHandler() {
        FoisonHornManager.Instance.sendRequest(FoisonHornManager.ACTIVATING);
    }

    private get foisonHornModel(): FoisonHornModel {
        return FoisonHornManager.Instance.model
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    dispose() {
        this.removeEvent();
        this.goodsList && this.goodsList.dispose();
        super.dispose();
    }

}