import FUI_FirstRechargeView from "../../../../../fui/Funny/FUI_FirstRechargeView";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BaseItem } from '../../../component/item/BaseItem';
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FunnyManager from "../../../manager/FunnyManager";
import FunnyBagData from "../model/FunnyBagData";
import FunnyRewardData from "../model/FunnyRewardData";
import { TempleteManager } from "../../../manager/TempleteManager";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import Utils from "../../../../core/utils/Utils";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { FunnyContent } from "./FunnyContent";
/**
 * 首充送礼
 */
export default class FirstRechargeView extends FUI_FirstRechargeView implements FunnyContent {
    private _dataArray: Array<GoodsInfo> = [];
    private _remainTime: number = 0;
    private _state: number = 0;

    onShow() {
        this.initEvent();
        this.initView();
        this.initData();
    }

    onUpdate() {
        this.initView();
        this.initData();
    }

    onHide() {
        this.removeEvent();
    }

    initView() {
        let selectData = FunnyManager.Instance.selectedFunnyData;
        this.txt1.text = LangManager.Instance.GetTranslation('FirstRechargeView.txt1');
        this.txt2.text = LangManager.Instance.GetTranslation('map.campaign.view.ui.demon.ConsortiaDemonWoundView.activityTimeTip') + ':';
        this.descTxt.text = LangManager.Instance.GetTranslation('FirstRechargeView.descTxt');
        this._state = selectData.bagList[0].status;
        this.chargeBtn.enabled = true;
        if (this._state == 2) {//已经领取
            this.chargeBtn.enabled = false;
            this.chargeBtn.title = LangManager.Instance.GetTranslation('dayGuide.view.FetchItem.alreadyGet');
        }
        else if (this._state == 1) {//可领取
            this.chargeBtn.title = LangManager.Instance.GetTranslation('map.campaign.view.fall.BattleFallGoodsView.recive');
        }
        else {
            this.chargeBtn.title = LangManager.Instance.GetTranslation('yishi.loader.StartupResourceLoader.recharge');
        }
        let endTime = selectData.endTime;
        this._remainTime = endTime / 1000 - this.playerModel.sysCurTimeBySecond;
        if (this._remainTime > 0) {
            this.__updateTimeHandler();
            Laya.timer.loop(1000, this, this.__updateTimeHandler);
        }
        else {
            this.remainTImes.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
            this.chargeBtn.enabled = false;
        }
    }

    private initData() {
        var arr: Array<FunnyRewardData> = this.funnyBagData.rewardList;
        arr.sort(this.sortMasterType);
        this._dataArray = [];
        for (var i: number = 0; i < arr.length; i++) {
            var info: GoodsInfo = new GoodsInfo();
            info.templateId = arr[i].temId;
            info.count = arr[i].count;
            this._dataArray.push(info);
        }
        this.list.numItems = this._dataArray.length;
    }

    private initEvent() {
        Utils.setDrawCallOptimize(this.list);
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderList, null, false);
        this.chargeBtn.onClick(this, this.chargeBtnHander);
    }

    private removeEvent() {
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.chargeBtn.offClick(this, this.chargeBtnHander);
        Laya.timer.clear(this, this.__updateTimeHandler);
    }

    onRenderList(index: number, item: BaseItem) {
        item.info = this._dataArray[index];
    }

    private chargeBtnHander() {
        if (this._state == 1) {
            FunnyManager.Instance.sendGetBag(2, FunnyManager.Instance.rechargeBagData.id);
        }
        else {
            FrameCtrlManager.Instance.exit(EmWindow.Funny);
            RechargeAlertMannager.Instance.openShopRecharge();
        }
    }

    setRemainTime() {
        this._remainTime--;
        if (this._remainTime >= 60) {
            this.remainTImes.text = DateFormatter.getFullTimeString(this._remainTime);
        } else if (this._remainTime > 0) {
            this.remainTImes.text = DateFormatter.getFullDateString(this._remainTime);
        } else {
            this.remainTImes.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
            this.chargeBtn.enabled = false;
        }
    }

    __updateTimeHandler() {
        this.setRemainTime();
    }

    private sortMasterType(info1: FunnyRewardData, info2: FunnyRewardData): number {
        var temp1: any;
        var temp2: any;
        var sortFlag: number = 0;
        if (info1.temType == 1) {
            temp1 = TempleteManager.Instance.getGoodsTemplatesByTempleteId(info1.temId);
        }
        else {
            temp1 = TempleteManager.Instance.getStarTemplateById(info1.temId);
        }
        if (info2.temType == 1) {
            temp2 = TempleteManager.Instance.getGoodsTemplatesByTempleteId(info2.temId);
        }
        else {
            temp2 = TempleteManager.Instance.getStarTemplateById(info2.temId);
        }
        if (temp1 && !temp2) {
            sortFlag = -1;
        }
        else if (!temp1 && temp2) {
            sortFlag = 1;
        }
        else if (!temp1 && !temp2) {
            sortFlag = 0;
        }
        else {
            if (temp1.Profile > temp2.Profile) {
                sortFlag = -1;
            }
            else if (temp1.Profile < temp2.Profile) {
                sortFlag = 1;
            }
            else {
                if (temp1.MasterType > temp2.MasterType) {
                    sortFlag = 1;
                }
                else if (temp1.MasterType < temp2.MasterType) {
                    sortFlag = -1;
                }
            }
        }
        temp1 = null;
        temp2 = null;
        return sortFlag;
    }

    private get funnyBagData(): FunnyBagData {
        return FunnyManager.Instance.rechargeBagData;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    dispose() {
        this.removeEvent()
        super.dispose();
    }
}