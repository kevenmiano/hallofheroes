// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { SinglePassEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import { SharedManager } from "../../manager/SharedManager";
import SinglePassManager from "../../manager/SinglePassManager";
import SinglePassSocketOutManager from "../../manager/SinglePassSocketOutManager";
import SinglePassBugleItem from "./item/SinglePassBugleItem";
import SinglePassBugleInfo from "./model/SinglePassBugleInfo";
import SinglePassModel from "./SinglePassModel";
export default class SinglePassBugleWnd extends BaseWindow {
    public peopleImg: fgui.GImage;
    public closeBtn: fgui.GButton;
    public helpBtn: fgui.GButton;
    public numTxt: fgui.GTextField;
    public startBtn: fgui.GButton;
    public aginBtn: fgui.GButton;
    public check1Btn: fgui.GButton;
    public check1RickText: fgui.GRichTextField;
    public checkContainer1: fgui.GGroup;
    public list: fgui.GList;
    private _singlePassModel: SinglePassModel;
    private _bugleInfo: SinglePassBugleInfo;
    private _currentPointsCost: number = 0;
    private _currentIndex: number = 0;
    public playOpenMC: fgui.Transition;
    public item1: SinglePassBugleItem;
    public item2: SinglePassBugleItem;
    public item3: SinglePassBugleItem;
    public item4: SinglePassBugleItem;
    public item5: SinglePassBugleItem;
    public item6: SinglePassBugleItem;
    public item7: SinglePassBugleItem;
    public item8: SinglePassBugleItem;
    public playGroup: fgui.GGroup;
    private _canClick: boolean = false;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initView();
        this.initData();
        this.initEvent();
    }

    private initData() {
        this._singlePassModel = SinglePassManager.Instance.model;
        this.playOpenMC = this.contentPane.getTransition("playOpenMC");
        SinglePassSocketOutManager.sendRequestBugleOpen();
        this.startBtn.visible = false;
        this.aginBtn.visible = false;
        this.list.scrollPane.touchEffect = false;
    }

    private initView() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.playGroup.visible = false;
    }

    private initEvent() {
        this.helpBtn.onClick(this, this.helpBtnHandler);
        this.closeBtn.onClick(this, this.closeBtnHandler);
        this.startBtn.onClick(this, this.startBtnClickHandler);
        this.aginBtn.onClick(this, this.aginBtnClickHandler);
        this._singlePassModel.addEventListener(SinglePassEvent.UPDATE_BUGLE_INFO, this.updateBugleInfoHandler, this);
        this._singlePassModel.addEventListener(SinglePassEvent.UPDATE_BUGLE_REWARDS, this.updateBugleRewardsHandler, this);
        this.list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    }

    private removeEvent() {
        this.helpBtn.offClick(this, this.helpBtnHandler);
        this.closeBtn.offClick(this, this.closeBtnHandler);
        this.startBtn.offClick(this, this.startBtnClickHandler);
        this.aginBtn.offClick(this, this.aginBtnClickHandler);
        this._singlePassModel.removeEventListener(SinglePassEvent.UPDATE_BUGLE_INFO, this.updateBugleInfoHandler, this);
        this._singlePassModel.removeEventListener(SinglePassEvent.UPDATE_BUGLE_REWARDS, this.updateBugleRewardsHandler, this);
        this.list.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    }

    /**
    * 翻牌 
    */
    private onClickItem(item: SinglePassBugleItem) {
        if (!this._canClick || item.isChested) return;
        var msg: string;
        var goodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(SinglePassModel.BUGLE_TEMPLATE_ID);
        if (goodsCount <= 0) {
            msg = LangManager.Instance.GetTranslation("singlepass.bugle.SinglePassBugleView.NoLeftCount");
            MessageTipManager.Instance.show(msg);
            return;
        }
        this._currentIndex = item.index;
        if (this._currentPointsCost <= 0) {
            this.openCard(this._currentIndex, true);
        } else {
            var lastSaveDate: Date = new Date(SharedManager.Instance.singlePassBugleOpenCardUseBindDate);
            if (SharedManager.Instance.checkIsExpired(lastSaveDate)) {
                this.showAlertFrame();
            } else {
                var hasMoney: number = this.playerInfo.point;
                if (SharedManager.Instance.singlePassBugleOpenCardUseBind) {
                    hasMoney = this.playerInfo.allPoint;
                }
                if (hasMoney < this._currentPointsCost) {
                    RechargeAlertMannager.Instance.show();
                    return;
                }
                this.openCard(this._currentIndex, SharedManager.Instance.singlePassBugleOpenCardUseBind);
            }
        }
    }

    private showAlertFrame() {
        let content: string = LangManager.Instance.GetTranslation("singlepass.bugle.SinglePassBugleView.OpenTips", this._currentPointsCost);
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.__todayNotAlertOpen.bind(this), state: 0, point: this._currentPointsCost });
    }

    private __todayNotAlertOpen(notAlert: boolean, useBind: boolean) {
        if (notAlert) {
            SharedManager.Instance.singlePassBugleOpenCardUseBindDate = new Date();
            SharedManager.Instance.singlePassBugleOpenCardUseBind = useBind;
            SharedManager.Instance.saveSinglePassBugleOpenCardUseBind();
            SharedManager.Instance.saveSinglePassBugleOpenCardUseBindDate();
        }
        this.openCard(this._currentIndex, useBind);
    }

    private openCard(index: number, firstBind: boolean) {
        SinglePassSocketOutManager.sendRequestBugleRoulette(index, firstBind);
    }

    private startBtnClickHandler() {
        if (this.check1Btn.selected)//跳过动画
        {
            this.playGroup.visible = false;
            this.list.visible = true;
            this.playWash();
        }
        else {
            this.playGroup.visible = true;
            this.list.visible = false;
            this.playOpenMC.play(new Laya.Handler(this, () => {
                this.playGroup.visible = false;
                this.list.visible = true;
                var item: SinglePassBugleItem;
                for (let i = 0; i < this.list.numItems; i++) {
                    item = this.list.getChildAt(i) as SinglePassBugleItem;
                    item.showBack();
                }
            }));
        }
        this.startBtn.enabled = false;
        this._canClick = true;
    }

    private playWash() {
        var item: SinglePassBugleItem;
        for (let i = 0; i < this.list.numItems; i++) {
            item = this.list.getChildAt(i) as SinglePassBugleItem;
            item.turnBack();
        }
    }

    private aginBtnClickHandler() {
        SinglePassSocketOutManager.sendRequestBugleOpen();
        var item: SinglePassBugleItem;
        for (let i = 0; i < this.list.numItems; i++) {
            item = this.list.getChildAt(i) as SinglePassBugleItem;
            item.turnOver();
        }
        this.startBtn.enabled = true;
        this._currentIndex = 0;
        this._currentPointsCost = 0;
        this._canClick = false;
    }

    private updateBugleInfoHandler(evtData: SinglePassBugleInfo) {
        this._bugleInfo = evtData;
        if (this._bugleInfo) {
            this.list.numItems = this._bugleInfo.itemList.length;
        }
        this.startBtn.visible = true;
        this.aginBtn.visible = false;
        this.numTxt.text = GoodsManager.Instance.getGoodsNumByTempId(SinglePassModel.BUGLE_TEMPLATE_ID).toString();
    }

    private updateBugleRewardsHandler(evtData: SinglePassBugleInfo) {
        var bugleInfo: SinglePassBugleInfo = evtData;
        var item: SinglePassBugleItem;
        var info: GoodsInfo;
        var index: number = 0;
        var itemIndex: number = 0;
        this._currentPointsCost = bugleInfo.needPoint;
        for (let i = 0; i < this.list.numItems; i++) {
            item = this.list.getChildAt(i) as SinglePassBugleItem;
            item.updateCost(this._currentPointsCost);
            itemIndex = item.index;
            index = bugleInfo.openIndex.indexOf(itemIndex);
            if (index == -1) {
                continue;
            }
            info = new GoodsInfo();
            info.templateId = bugleInfo.itemList[index].tempId;
            info.count = bugleInfo.itemList[index].count;
            if (itemIndex == this._currentIndex) {
                item.updateData(info);
            }
            if (bugleInfo.openCount > 0) {
                this.startBtn.visible = false;
                this.aginBtn.visible = true;
            }
            else {
                this.startBtn.visible = true;
                this.aginBtn.visible = false;
            }
            var goodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(SinglePassModel.BUGLE_TEMPLATE_ID);
            this.startBtn.enabled = this.aginBtn.enabled = Boolean(goodsCount > 0);
            this.numTxt.text = GoodsManager.Instance.getGoodsNumByTempId(SinglePassModel.BUGLE_TEMPLATE_ID).toString();
        }
    }

    private helpBtnHandler() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("singlepass.view.SinglePassBugleHelpFrame.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private closeBtnHandler() {
        this.OnBtnClose();
    }

    private renderListItem(index: number, item: SinglePassBugleItem) {
        let goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = this._bugleInfo.itemList[index].tempId;
        goodsInfo.count = this._bugleInfo.itemList[index].count;
        item.index = index + 1;
        item.info = goodsInfo;
    }

    private setMCData() {
        for (let i = 1; i <= 8; i++) {
            this["item" + i].index = i;
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._bugleInfo.itemList[i - 1].tempId;
            goodsInfo.count = this._bugleInfo.itemList[i - 1].count;
            this["item" + i].info = goodsInfo;
        }
    }

    public get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}