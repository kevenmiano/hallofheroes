import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import OfferRewardManager from '../../manager/OfferRewardManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { SharedManager } from '../../manager/SharedManager';
import { OfferRewardModel } from '../../mvc/model/OfferRewardModel';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import { KingContractEvents, RewardEvent } from '../../constant/event/NotificationEvent';
import OfferRewardItem from './OfferRewardItem';
import { NotificationManager } from '../../manager/NotificationManager';
import UIManager from '../../../core/ui/UIManager';
import { EmWindow } from '../../constant/UIDefine';
import { BagType } from '../../constant/BagDefine';
import { GoodsManager } from '../../manager/GoodsManager';
import { SocketSendManager } from '../../manager/SocketSendManager';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { TempleteManager } from '../../manager/TempleteManager';
import { t_s_itemtemplateData } from '../../config/t_s_itemtemplate';
import Utils from '../../../core/utils/Utils';
export default class OfferRewardWnd extends BaseWindow {

    public frame: fgui.GComponent;
    private itemList: fgui.GList = null;
    private Btn_freeRefresh: UIButton;
    private Btn_quickRefresh: UIButton;
    private DailyTitleTxt: fgui.GLabel;
    private DailyCountTxt: fgui.GLabel;
    private LeftRefreshTimeTxt: fgui.GLabel;
    private TaskUpdateTimeTxt: fgui.GLabel;
    private _lastRefTime: number;//上次刷新的时间, 用来判断model是否改变
    private _offerTaskList: any[] = [];
    public helpBtn: UIButton;
    public coinRefresh: fgui.GButton;
    private coinTemplateId: number = 2130005;
    private _coinCount: number = 0;
    private countTxt:fgui.GLabel;
    private _goodsInfo:GoodsInfo;
    public OnInitWind() {
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation("buildings.offerreward.OfferRewardFrame.title");
        this.DailyTitleTxt.text = LangManager.Instance.GetTranslation("buildings.offerreward.view.OfferCountView.dailyCount");
        this.LeftRefreshTimeTxt.text = LangManager.Instance.GetTranslation("OfferRewardWnd.LeftRefreshTimeTxt");
        this.countTxt = this.coinRefresh.getChild("countTxt") as fgui.GLabel;
        this.setCoinBtnvisible();
        this._goodsInfo = new GoodsInfo();
        this._goodsInfo.templateId = this.coinTemplateId;
        this.addEvent();
        if (this.rewardModel.refreshRemainTime == 0 || this.rewardModel.isNeedReset)
            this.rewardManager.sendRefreshRewardList(false, true);
        this.setCenter();
        this.refreshViewCoinCountTxt();
        if(this.rewardModel.offerRewardTaskDic){
            this.itemList.numItems = this.rewardModel.offerRewardTaskDic.getList().length;
        }
    }

    OnShowWind() {
        super.OnShowWind();
        this.refreshView();
        UIManager.Instance.HideWind(EmWindow.LookPlayerList);
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private addEvent() {
        this.Btn_quickRefresh.onClick(this, this.__onQuickRefreshClick.bind(this));
        this.Btn_freeRefresh.onClick(this, this.__onFreeRefreshClick.bind(this));
        this.rewardModel.addEventListener(Laya.Event.COMPLETE, this.__completeHandler, this);
        this.rewardModel.addEventListener(Laya.Event.CHANGE, this.updateView, this);
        this.rewardManager.addEventListener(RewardEvent.OFFER_REWARD_LIST_REFRESH, this.__offerRewardListRefreshHandler, this);
        this.rewardModel.addEventListener(RewardEvent.NEED_RESET_DATA, this.__resetDataHandler, this);
        NotificationManager.Instance.addEventListener(KingContractEvents.UPDATE_KINGCONTRACT, this.__kingcontractHandler, this);
        this.helpBtn.onClick(this, this.helpClick.bind(this));
        this.coinRefresh.onClick(this, this.coinRefreshHandler);
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.setCoinBtnvisible, this);
        this.itemList.itemRenderer = Laya.Handler.create(this, this.renderItemListHandler, null, false);
    }

    private removeEvent() {
        this.Btn_quickRefresh.offClick(this, this.__onQuickRefreshClick.bind(this));
        this.Btn_freeRefresh.offClick(this, this.__onFreeRefreshClick.bind(this));
        this.rewardModel.removeEventListener(Laya.Event.COMPLETE, this.__completeHandler, this);
        this.rewardModel.removeEventListener(Laya.Event.CHANGE, this.updateView, this);
        this.rewardManager.removeEventListener(RewardEvent.OFFER_REWARD_LIST_REFRESH, this.__offerRewardListRefreshHandler, this);
        this.rewardModel.removeEventListener(RewardEvent.NEED_RESET_DATA, this.__resetDataHandler, this);
        NotificationManager.Instance.removeEventListener(KingContractEvents.UPDATE_KINGCONTRACT, this.__kingcontractHandler, this);
        this.helpBtn.offClick(this, this.helpClick.bind(this));
        this.coinRefresh.offClick(this, this.coinRefreshHandler);
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.setCoinBtnvisible, this);
        // this.itemList.itemRenderer.recover();
        Utils.clearGListHandle(this.itemList);
    }

    private renderItemListHandler(index: number, item: OfferRewardItem){
        if (!item || item.isDisposed) return;
        item.rewardPos = this.rewardModel.offerRewardTaskIndex[index];
        if(index < this.rewardModel.offerRewardTaskDic.getList().length)
        {
            item.setData(this.rewardModel.offerRewardTaskDic[index], this.rewardModel.offerRewardTaskProfileDic[index], this.rewardModel.offerRewardTaskStateDic[index]);
        }
    }

    private refreshItemListView() {
        if (this.rewardModel.offerRewardTaskDic && this.rewardModel.offerRewardTaskStateDic && this.rewardModel.offerRewardTaskProfileDic) {
            for (var i: number = 0; i < this._offerTaskList.length; i++) {
                this._offerTaskList[i].setData(this.rewardModel.offerRewardTaskDic[i], this.rewardModel.offerRewardTaskProfileDic[i], this.rewardModel.offerRewardTaskStateDic[i]);
            }
        }
    }

    private __completeHandler() {
        OfferRewardManager.Instance.sendRefreshRewardList(false, true);
    }

    private updateView() {
        this.TaskUpdateTimeTxt.text = DateFormatter.getCountDate(this.rewardModel.remainTime);
    }

    private __resetDataHandler() {
        this.rewardManager.sendRefreshRewardList(false, true);
        this.rewardModel.isNeedReset = false;
    }

    private __kingcontractHandler(e: KingContractEvents) {
        this.refreshItemListView();
    }

    private helpClick() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("buildings.offerreward.OfferRewardHelpFrame.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private setCoinBtnvisible() {
        let itemtemplateData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this.coinTemplateId);
        if (itemtemplateData && itemtemplateData.NeedGrades > ArmyManager.Instance.thane.grades) {
            this.coinRefresh.visible = false;
        }
        else {
            this.coinRefresh.visible = true;
        }
    }

    private refreshViewCoinCountTxt() {
        this._coinCount = GoodsManager.Instance.getBagCountByTempId(BagType.Player, this.coinTemplateId);
        this.countTxt.text = this._coinCount.toString();
        if (this._coinCount == 0) {
            this.coinRefresh.enabled = false;
        } else {
            this.coinRefresh.enabled = true;
        }
    }

    private coinRefreshHandler() {
        //判断还有没有悬赏次数
        if (this.rewardModel.remainRewardCount <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("offerReward.count"));
            return;
        }
        if (OfferRewardManager.Instance.model.baseRewardDic.getList().length >= 1) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("buildings.offerreward.view.OfferTaskItem.command01"));
            return false;
        }
        //使用高级悬赏公文
        let pos = -1;
        let bagDic = GoodsManager.Instance.getGeneralBagList();
        for (const key in bagDic) {
            if (bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = bagDic[key];
                if (info.templateId == this.coinTemplateId) {
                    pos = info.pos;
                    break;
                }
            }
        }
        SocketSendManager.Instance.sendUseItem(pos);
    }

    private __offerRewardListRefreshHandler() {
        this.itemList.numItems = this.rewardModel.offerRewardTaskDic.getList().length;
        this.refreshView();
        this.refreshViewCoinCountTxt();
    }

    private __onQuickRefreshClick() {
        this._lastRefTime = this.rewardModel.lastRefreshRewardListTime;
        if (OfferRewardManager.Instance.model.hasOrangeTaskNotComplete) {
            var content: string = LangManager.Instance.GetTranslation("buildings.offerreward.view.OfferTimeView.content2");
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.quickRefreshCallBack.bind(this));
        } else {
            this.quickRefresh();
        }
    }

    private quickRefreshCallBack(b: boolean, flag: boolean) {
        if (b && this._lastRefTime == this.rewardModel.lastRefreshRewardListTime)
            this.quickRefresh();
    }

    private quickRefresh() {
        if (this.quickRefreshAlert(this.startRefreshAlertBack)) return;
        var hasMoney: number = this.playerInfo.point;
        if (SharedManager.Instance.offerRewardRefreshUseBind) {
            hasMoney = this.playerInfo.point + this.playerInfo.giftToken;
        }
        if (hasMoney < OfferRewardModel.REFRESH_REWARD_NEEDPAY) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
            return;
        }
        this.refreshRewardListPayCall(true, SharedManager.Instance.offerRewardRefreshUseBind);
    }

    private startRefreshAlertBack(b: boolean, useBind: boolean) {
        SharedManager.Instance.offerRewardRefresh = b;
        SharedManager.Instance.offerRewardRefreshCheckDate = new Date();
        SharedManager.Instance.offerRewardRefreshUseBind = useBind;
        this.refreshRewardListPayCall(true, useBind);
    }

    private refreshRewardListPayCall(b: boolean, useBind: boolean) {
        if (b && this._lastRefTime == this.rewardModel.lastRefreshRewardListTime) {
            var hasMoney: number = this.playerInfo.point;
            if (useBind) {
                hasMoney = this.playerInfo.point + this.playerInfo.giftToken;
            }
            if (hasMoney < OfferRewardModel.REFRESH_REWARD_NEEDPAY) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                return;
            }
            OfferRewardManager.Instance.sendRefreshRewardList(true, useBind);
            OfferRewardModel.isFirstPay = false;
        }
    }

    /**
     * 悬赏刷新提示
     */
    private quickRefreshAlert(callBack: Function = null): boolean {
        var preDate: Date = new Date(SharedManager.Instance.offerRewardRefreshCheckDate);
        var check: boolean = SharedManager.Instance.offerRewardRefresh;
        var now: Date = new Date();
        var outdate: boolean = false;
        if (!check || preDate.getMonth <= preDate.getMonth && preDate.getDate < now.getDate)
            outdate = true;
        if (outdate) {
            let cfgValue = 2;
            let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("FreshReward_Price");
            if (cfgItem) {
                cfgValue = Number(cfgItem.ConfigValue);
            }
            var content: string = LangManager.Instance.GetTranslation("auction.view.mysteryshop.BuyTimeView.quickRefreshTip", cfgValue);
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.startRefreshAlertBack.bind(this), closeFunction: null, point: OfferRewardModel.REFRESH_REWARD_NEEDPAY });
        }
        return outdate;
    }

    private __onFreeRefreshClick() {
        this._lastRefTime = this.rewardModel.lastRefreshRewardListTime;
        if (OfferRewardManager.Instance.model.hasOrangeTaskNotComplete) {
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            var content: string = LangManager.Instance.GetTranslation("buildings.offerreward.view.OfferTimeView.content2");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.confirmRefreshTaskListCallback.bind(this));
        } else {
            OfferRewardManager.Instance.sendRefreshRewardList(true, SharedManager.Instance.offerRewardRefreshUseBind);
        }
    }

    private confirmRefreshTaskListCallback(isSure: boolean, flag: boolean) {
        if (isSure && this._lastRefTime == this.rewardModel.lastRefreshRewardListTime)
            OfferRewardManager.Instance.sendRefreshRewardList(true, flag);
    }

    private refreshView() {
        this.rewardModel.remainTime = this.rewardModel.refreshRemainTime;
        this.TaskUpdateTimeTxt.text = DateFormatter.getCountDate(this.rewardModel.remainTime);
        this.Btn_freeRefresh.enabled = this.Btn_quickRefresh.enabled = this.rewardModel.hasData;
        this.Btn_freeRefresh.visible = this.Btn_quickRefresh.visible = false;
        this.DailyCountTxt.text = this.rewardModel.remainRewardCount + " / " + this.rewardModel.maxRewardCount;
        if (this.rewardModel.freeRefreshCount >= 2) {
            this.Btn_quickRefresh.visible = true;
        }
        else {
            this.Btn_freeRefresh.visible = true;
            this.Btn_freeRefresh.title = LangManager.Instance.GetTranslation("offerrewardwnd.freeRefreshTxt") + LangManager.Instance.GetTranslation("public.parentheses1", 2 - this.rewardModel.freeRefreshCount);
        }
    }

    public getOfferTaskItemByIndex(idx: number): OfferRewardItem {
        for (let index = 0; index < this.itemList.numItems; index++) {
            if (idx == index) return this.itemList.getChildAt(index) as OfferRewardItem;
        }
    }

    private get rewardModel(): OfferRewardModel {
        return OfferRewardManager.Instance.model;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get rewardManager(): OfferRewardManager {
        return OfferRewardManager.Instance;
    }
}