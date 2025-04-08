import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { NativeEvent, WarlordsEvent } from "../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../manager/ArmyManager";
import WarlordsManager from "../../../manager/WarlordsManager";
import WarlordsModel from "../WarlordsModel";
import WarlordRoomPlayerItem from "./component/WarlordRoomPlayerItem";
import LangManager from '../../../../core/lang/LangManager';
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import WarlordsPlayerInfo from "../WarlordsPlayerInfo";
import WarlordRoomRankItem from "./component/WarlordRoomRankItem";
import { NotificationManager } from "../../../manager/NotificationManager";
/**
 * 众神之战房间场景
 */
export default class WarlordRoomWnd extends BaseWindow {
    public c1: fgui.Controller;
    public c2: fgui.Controller;
    public type: fgui.Controller;
    public bg: fgui.GImage;
    public playerItem: WarlordRoomPlayerItem;
    public tabList: fgui.GList;
    public rankList: fgui.GList;
    public extendBtn: fgui.GButton;
    public myRankTxt: fgui.GRichTextField;
    public victoryNumTxt: fgui.GRichTextField;
    public rightView: fgui.GGroup;
    public centerTopBg: fgui.GImage;
    public openDescTxt1: fgui.GTextField;
    public openDescTxt2: fgui.GRichTextField;
    public topCenterView: fgui.GGroup;
    public myScoreTxt: fgui.GRichTextField;
    public myCountTxt: fgui.GRichTextField;
    public helpBtn: fgui.GButton;
    private _timeCount: number = 0;
    private _titleName: string = "";
    private _roundStr: string = "";
    private rankListData: Array<WarlordsPlayerInfo>;

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initEvent();
        this.refreshView();
    }

    private initData() {
        this.playerItem.info = ArmyManager.Instance.army;
        this.type = this.getController("type");
        this.c2 = this.getController("c2");
        this.c1 = this.getController("c1");
        switch (this.warlordsModel.process) {
            case WarlordsModel.PROCESS_PRELIM:
                this.type.selectedIndex = 1;
                break;
            case WarlordsModel.PROCESS_FINAL:
                this.type.selectedIndex = 0;
                break;
        }
        this.tabList.selectedIndex = (this.warlordsModel.selfInfo.isTempleGroup ? 0 : 1);
    }

    private initEvent() {
        NotificationManager.Instance.addEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
        this.warlordsModel.addEventListener(WarlordsEvent.INFO_UPDATE, this.warlordsInfoUpdateHandler, this);
        this.helpBtn.onClick(this, this.helpBtnHandler);
        this.tabList.on(Laya.Event.CLICK, this, this.onSelectedChangeHandler.bind(this));
        this.rankList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
        this.warlordsModel.removeEventListener(WarlordsEvent.INFO_UPDATE, this.warlordsInfoUpdateHandler, this);
        this.helpBtn.offClick(this, this.helpBtnHandler);
        this.tabList.off(Laya.Event.CLICK, this, this.onSelectedChangeHandler.bind(this));
        this.rankList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private helpBtnHandler() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("warlords.room.WarlordsRoomView.helpContent1");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private warlordsInfoUpdateHandler() {
        this.refreshView();
    }

    private refreshView() {
        this.refreshTopView();
        this.refreshRightView();
    }

    /**
     * 刷新顶部
     */
    private refreshTopView() {
        if (this.warlordsModel.curRound >= this.warlordsModel.totalRound) {
            this.c2.selectedIndex = 0;
            switch (this.warlordsModel.process) {
                case WarlordsModel.PROCESS_PRELIM:
                    this.openDescTxt1.text = LangManager.Instance.GetTranslation("WarlordRoomWnd.TopView.openDescTxt3");
                    break;
                case WarlordsModel.PROCESS_FINAL:
                    this.openDescTxt1.text = LangManager.Instance.GetTranslation("WarlordRoomWnd.TopView.openDescTxt4");
                    break;
            }
        }
        else {
            this.c2.selectedIndex = 1;
            this._timeCount = this.warlordsModel.waitTime;
            this._roundStr = (this.warlordsModel.curRound < this.warlordsModel.totalRound ? this.warlordsModel.curRound + 1 : this.warlordsModel.curRound) + "/" + this.warlordsModel.totalRound;
            switch (this.warlordsModel.process) {
                case WarlordsModel.PROCESS_PRELIM:
                    this._titleName = LangManager.Instance.GetTranslation("WarlordRoomWnd.TopView.openDescTxt2");
                    break;
                case WarlordsModel.PROCESS_FINAL:
                    if (this.warlordsModel.selfInfo.isTempleGroup) {
                        this._titleName = LangManager.Instance.GetTranslation("warlords.WarlordsBetSelectFrame.temple");
                    }
                    else {
                        this._titleName = LangManager.Instance.GetTranslation("warlords.WarlordsBetSelectFrame.brave");
                    }
                    break;
            }
            Laya.timer.loop(1000, this, this.updateTimeHandler);
        }
    }

    private updateTimeHandler() {
        if (this.destroyed) return;
        this.openDescTxt2.text = LangManager.Instance.GetTranslation("WarlordRoomWnd.TopView.openDescTxt1", this._titleName, this._roundStr, this._timeCount);
        this._timeCount--;
        if (this._timeCount <= 0) {
            Laya.timer.clear(this, this.updateTimeHandler);
        }
    }

    /**
     * 刷新右侧
     */
    private refreshRightView() {
        switch (this.warlordsModel.process) {
            case WarlordsModel.PROCESS_PRELIM:
                this.type.selectedIndex = 1;
                this.myScoreTxt.setVar("count", this.warlordsModel.selfInfo.prelimScore.toString()).flushVars();
                this.myCountTxt.setVar("count", (this.warlordsModel.totalRound - this.warlordsModel.curRound).toString()).flushVars();
                break;
            case WarlordsModel.PROCESS_FINAL:
                this.type.selectedIndex = 0;
                this.setTabByGroup();
                break;
        }
    }

    public setTabByGroup() {
        var tabIndex: number = Number(!this.warlordsModel.selfInfo.isTempleGroup);
        if (this.tabList.selectedIndex != tabIndex) {
            this.tabList.selectedIndex = tabIndex;
        }
        else {
            this.onSelectedChangeHandler();
        }
    }

    private onSelectedChangeHandler() {
        let tabIndex: number = this.tabList.selectedIndex;
        this.rankListData = [];
        for (let i = 0; i < this.warlordsModel.finalRankList.length; i++) {
            let info: WarlordsPlayerInfo = this.warlordsModel.finalRankList[i];
            if (tabIndex == 0 && !info.isTempleGroup) continue;
            if (tabIndex == 1 && info.isTempleGroup) continue;
            this.rankListData.push(info);
        }
        if ((tabIndex == 0 && this.warlordsModel.selfInfo.isTempleGroup) || (tabIndex == 1 && !this.warlordsModel.selfInfo.isTempleGroup)) {
            this.myRankTxt.visible = this.victoryNumTxt.visible = true;
            this.myRankTxt.setVar("rank", this.warlordsModel.selfInfo.displaySort.toString()).flushVars();
            this.victoryNumTxt.setVar("num", this.warlordsModel.selfInfo.winCount.toString()).flushVars();
        }
        else {
            this.myRankTxt.visible = this.victoryNumTxt.visible = false;
        }
        this.rankList.numItems = this.rankListData.length;
    }

    renderListItem(index: number, item: WarlordRoomRankItem) {
        item.info = this.rankListData[index];
    }

    private get warlordsModel(): WarlordsModel {
        return WarlordsManager.Instance.model;
    }

    /** 点击蒙版区域 (可重写) */
    protected OnClickModal() {

    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
        Laya.timer.clear(this, this.updateTimeHandler)
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}