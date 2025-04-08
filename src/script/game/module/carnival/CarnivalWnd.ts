import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { FormularySets } from "../../../core/utils/FormularySets";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import CarnivalManager from "../../manager/CarnivalManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import HomeWnd from "../home/HomeWnd";
import CarnivalTabBtn from "./CarnivalTabBtn";
import MaskLockOper from "../../component/MaskLockOper";
import CarnivalModel, { CARNIVAL_THEME } from "./model/CarnivalModel";
import { CarnivalBasePage } from "./view/CarnivalBasePage";
import { getDefaultLangageKey } from "../../../core/lang/LanguageDefine";

/**
 * 嘉年华
 */
export default class CarnivalWnd extends BaseWindow {
    protected setSceneVisibleOpen: boolean = true;
    protected resizeContent: boolean = true;
    protected resizeFullContent: boolean = true;

    private activityTime: fgui.GTextField;//活动时间
    private tabList: fgui.GList;//Tab列表
    private Img_Carnival_Bg: fgui.GLoader;
    private img_gift: fgui.GLoader;
    private Img_Txt_Carnival: fgui.GLoader;
    private Img_TimeBg: fgui.GLoader;

    private tabData: Array<any> = [];
    private tabView: Array<CarnivalBasePage> = [];

    private contentPage: fgui.Controller;

    private defaultSelectIndex: number = 0;

    private maskNode: fgui.GGraph;

    public giftTxt: fgui.GTextField;
    public voucherTxt: fgui.GTextField;
    public btn_buy: UIButton;

    private awardPointPage: CarnivalBasePage;//积分领奖
    private rechagePage: CarnivalBasePage;//充值有礼
    private gamePage: CarnivalBasePage;//欢乐游戏
    private dayTaskPage: CarnivalBasePage;//幸运夺宝
    private discountPage: CarnivalBasePage;//每日挑战
    private carnivalBaoPage: CarnivalBasePage;//特惠礼包
    private onlinePage: CarnivalBasePage;//在线奖励
    private pointItem: CarnivalTabBtn;//积分页签
    private taskItem: CarnivalTabBtn;//幸运夺宝
    private luckyItem:CarnivalTabBtn;//充值有礼
    private gameItem:CarnivalTabBtn;//欢乐游戏
    private dayItem:CarnivalTabBtn;//每日挑战
    private freeDiscountItem:CarnivalTabBtn;//特惠礼包
    private onlineAwardItem:CarnivalTabBtn;//在线奖励
    public OnInitWind(): void {
        super.OnInitWind();
        this.setCenter();
        this.contentPage = this.getController("contentPage");
        this.contentPage.selectedIndex = -1;
        let themeType = this.carnivalModel.themeType;
        this.Img_Txt_Carnival.url = this.carnivalModel.getThemeImgPath("Img_Txt_Carnival" + "_" + getDefaultLangageKey());
        this.Img_Carnival_Bg.url = this.carnivalModel.getThemeImgPath("Img_Carnival_Bg", ".jpg");
        this.img_gift.url = this.carnivalModel.getThemeImgPath("img_gift");
        if (themeType == CARNIVAL_THEME.SUMMER) {
            this.Img_TimeBg.url = this.carnivalModel.getThemeImgPath("Img_TimeBg");
            this.Img_TimeBg.visible = true;
        } else {
            this.Img_TimeBg.visible = false;
        }

        if (this.frameData) {
            if (this.frameData.index) {
                this.defaultSelectIndex = this.frameData.index;
            } else if (this.frameData.str) {
                let findBtnIndex: number = this.findBtnIndexByName(this.frameData.str);
                this.defaultSelectIndex = findBtnIndex;
            }
        }

        this.addEvent();
        var tabStr: string = LangManager.Instance.GetTranslation("carnival.tab.names");
        var tabList: string[] = tabStr.split("|");
        this.initTabList(tabList);
        this.initActTime();
        this.initAccount();
    }

    /**创建Tab */
    private initTabList(tabs: string[]) {
        let count = tabs.length;
        this.tabData = [];
        this.tabView = [];
        for (let index = 0; index < count; index++) {
            let element = tabs[index];
            this.tabData.push({ str: element, sort: index })
        }
        //内容窗体
        this.tabView = [
            this.awardPointPage,//积分领奖
            this.rechagePage,//充值有礼
            this.gamePage,//欢乐游戏
            this.carnivalBaoPage,//幸运夺宝
            this.dayTaskPage,//每日挑战
            this.discountPage,//特惠礼包
            this.onlinePage,//在线奖励
        ];
        this.tabList.numItems = this.tabData.length;
        this.onSelectTab(this.defaultSelectIndex);
    }

    private initActTime() {

        let isRewardTime = CarnivalManager.Instance.isRewardTime;

        if (!isRewardTime) {
            endStr = CarnivalManager.Instance.rrewardTime;
            this.activityTime.text = LangManager.Instance.GetTranslation("carnival.active.reeardtime", endStr);
            return;
        }

        var endStr: string = "";
        var eC = TempleteManager.Instance.getConfigInfoByConfigName("CarnivalStopDate");
        if (eC) {
            endStr = eC.ConfigValue;
        }

        this.activityTime.text = LangManager.Instance.GetTranslation("carnival.active.time", endStr);
    }

    private initAccount() {
        //钻石
        this.voucherTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.point, HomeWnd.STEP);
        //绑定钻石
        this.giftTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken, HomeWnd.STEP);
    }

    /**渲染Tab单元格 */
    renderTabListItem(index: number, item: CarnivalTabBtn) {
        let titleStr = "";
        if (this.tabData[index]) {
            titleStr = this.tabData[index].str;
        }
        if (!item) return;
        item.iconNor.url = this.carnivalModel.getThemeImgPath("Tab_Snow_Nor");
        item.iconSel.url = this.carnivalModel.getThemeImgPath("Tab_Snow_Sel");
        item.title = this.getTitleNameStr(titleStr);
        item.selectedTitle = this.getSelectTitleNameStr(titleStr);
        item.data = this.tabData[index];
        if (index == 0) {//积分领取
            this.pointItem = item;
            if (this.carnivalModel.hasScoreRewardInfoAward()) {
                item.redPointState.selectedIndex = 1;
            } else {
                item.redPointState.selectedIndex = 0;
            }
        } else if (index == 3) {//幸运夺宝
            this.taskItem = item;
            if (this.carnivalModel.hasLuckyDarwCount()) {
                item.redPointState.selectedIndex = 1;
            } else {
                item.redPointState.selectedIndex = 0;
            }
        } else if(index == 1){//充值有礼
            this.luckyItem = item;
            if (this.carnivalModel.hasLeftlotteryCount()) {
                item.redPointState.selectedIndex = 1;
            } else {
                item.redPointState.selectedIndex = 0;
            }
        }else if(index == 2){//欢乐游戏
            this.gameItem = item;
            if (this.carnivalModel.hasGameCounts() && CarnivalManager.Instance.isRewardTime) {
                item.redPointState.selectedIndex = 1;
            } else {
                item.redPointState.selectedIndex = 0;
            }
        }else if(index == 4){//每日挑战
            this.dayItem = item;
            if (this.carnivalModel.hasDayTaskReward()) {
                item.redPointState.selectedIndex = 1;
            } else {
                item.redPointState.selectedIndex = 0;
            }
        }else if(index == 5){//特惠礼包
            this.freeDiscountItem = item;
            if (this.carnivalModel.hasFreeDiscount() && CarnivalManager.Instance.isRewardTime) {
                item.redPointState.selectedIndex = 1;
            } else {
                item.redPointState.selectedIndex = 0;
            }
        }else if(index == 6){//在线奖励
            this.onlineAwardItem = item;
            if (this.carnivalModel.hasOnlineReward() && CarnivalManager.Instance.isRewardTime) {
                item.redPointState.selectedIndex = 1;
            } else {
                item.redPointState.selectedIndex = 0;
            }
        }
        else{
            item.redPointState.selectedIndex = 0;
        }
    }

    /**默认 */
    private getTitleNameStr(str: string): string {
        let color = this.getTitleThemeColor();
        return `[size=24][color=${color}][B]${str}[/B][/color][/size]`
    }

    /**选中 */
    private getSelectTitleNameStr(titleStr: string): string {
        let color = this.getSelectTitleThemeColor();
        return `[size=24][color=${color}][B]${titleStr}[/B][/color][/size]`;
    }

    private getTitleThemeColor(): string {
        let themeType = this.carnivalModel.themeType;
        if (themeType == CARNIVAL_THEME.SUMMER) {
            return "#9ae4ff";
        }
        return "#7e9dc2";
    }

    private getSelectTitleThemeColor(): string {
        let themeType = this.carnivalModel.themeType;
        if (themeType == CARNIVAL_THEME.SUMMER) {
            return "#185b88";
        }
        return "#f1f6ff";
    }

    private findBtnIndexByName(btnStr: string): number {
        let index = 0;
        for (let i = 0; i < this.tabData.length; i++) {
            let titleData = this.tabData[i]
            if (titleData && titleData.str == btnStr) {
                index = titleData.sort;
                break;
            }
        }
        return index;
    }

    private addEvent() {
        MaskLockOper.Instance.regist(this, this.doLockOper);
        this.btn_buy.onClick(this, this.onBuy);
        this.tabList.itemRenderer = Laya.Handler.create(this, this.renderTabListItem, null, false);
        this.tabList.on(fairygui.Events.CLICK_ITEM, this, this.__onTabSelectHandler);
        this.contentPage && this.contentPage.on(fgui.Events.STATE_CHANGED, this, this.onContentChanged);
        CarnivalManager.Instance.addEventListener(CarnivalManager.EVENT_UPDATE, this.updateInfoHandler, this);
        CarnivalManager.Instance.addEventListener(CarnivalManager.EVENT_TASK_UPDATE, this.updateTaskInfoHandler, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerDataUpdate, this);
    }

    private offEvent() {
        MaskLockOper.Instance.unRegist();
        this.btn_buy.offClick(this, this.onBuy);
        if (this.tabList && this.tabList.itemRenderer) {
            this.tabList.itemRenderer.recover();
            this.tabList.itemRenderer = null;
        }

        this.tabList && this.tabList.off(fairygui.Events.CLICK_ITEM, this, this.__onTabSelectHandler);
        this.contentPage && this.contentPage.off(fgui.Events.STATE_CHANGED, this, this.onContentChanged);
        CarnivalManager.Instance.removeEventListener(CarnivalManager.EVENT_UPDATE, this.updateInfoHandler, this);
        CarnivalManager.Instance.removeEventListener(CarnivalManager.EVENT_TASK_UPDATE, this.updateTaskInfoHandler, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerDataUpdate, this);
    }

    /**
     * 购买钻石
     */
    private onBuy() {
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { returnToWin: EmWindow.Carnival, page: 7 }, null, EmWindow.Carnival);
    }

    private __playerDataUpdate(data: any) {
        this.initAccount();
    }

    private doLockOper(isLock: boolean) {
        this.maskNode.enabled = isLock;
        this.maskNode.visible = isLock;
    }

    /**切换Tab */
    private tabInterval: number = 200;
    private tabIntervalState: boolean = true;
    __onTabSelectHandler() {
        if (!this.tabIntervalState) return;
        let tabIndex = this.tabList.selectedIndex;
        this.onSelectTab(tabIndex);
        this.tabIntervalState = false;
        this.tabList.displayObject.mouseEnabled = false;
        Laya.timer.once(this.tabInterval, this, this.__tabIntervalOnce)
    }

    private __tabIntervalOnce() {
        this.tabIntervalState = true;
        this.tabList && this.tabList.displayObject && (this.tabList.displayObject.mouseEnabled = true);
        Laya.timer.clear(this, this.__tabIntervalOnce);
    }

    /**选择Tab索引 */
    onSelectTab(tabIndex: number) {
        this.tabList.selectedIndex = tabIndex;
        this.contentPage.selectedIndex = tabIndex;
    }

    /**窗体切换 */
    private lastContent: CarnivalBasePage = null;
    private onContentChanged() {
        let selectIndex = this.contentPage.selectedIndex;
        if (this.lastContent) {
            this.lastContent.onHide();
        }
        let content = this.tabView[selectIndex];
        if (content) {
            content.onShow();
            this.lastContent = content;
        }
    }

    private updateInfoHandler(data) {
        var op: number = Number(data);
        if (op == CarnivalManager.OP_OPEN) {
            this.carnivalModel.openFrameTime = new Date().getTime();
        }
        if (this.pointItem) {
            if (this.carnivalModel.hasScoreRewardInfoAward()) {
                this.pointItem.redPointState.selectedIndex = 1;
            } else {
                this.pointItem.redPointState.selectedIndex = 0;
            }
        }
        if (this.taskItem) {
            if (this.carnivalModel.hasLuckyDarwCount()) {
                this.taskItem.redPointState.selectedIndex = 1;
            } else {
                this.taskItem.redPointState.selectedIndex = 0;
            }
        }
        if(this.luckyItem){
            if (this.carnivalModel.hasLeftlotteryCount()) {
                this.luckyItem.redPointState.selectedIndex = 1;
            } else {
                this.luckyItem.redPointState.selectedIndex = 0;
            }
        }
        if(this.gameItem){
            if (this.carnivalModel.hasGameCounts() && CarnivalManager.Instance.isRewardTime) {
                this.gameItem.redPointState.selectedIndex = 1;
            } else {
                this.gameItem.redPointState.selectedIndex = 0;
            }
        }
        if(this.dayItem){
            if (this.carnivalModel.hasDayTaskReward()) {
                this.dayItem.redPointState.selectedIndex = 1;
            } else {
                this.dayItem.redPointState.selectedIndex = 0;
            }
        }
        if(this.freeDiscountItem){
            if (this.carnivalModel.hasFreeDiscount() && CarnivalManager.Instance.isRewardTime) {
                this.freeDiscountItem.redPointState.selectedIndex = 1;
            } else {
                this.freeDiscountItem.redPointState.selectedIndex = 0;
            }
        }
        if(this.onlineAwardItem){
            if (this.carnivalModel.hasOnlineReward() && CarnivalManager.Instance.isRewardTime) {
                this.onlineAwardItem.redPointState.selectedIndex = 1;
            } else {
                this.onlineAwardItem.redPointState.selectedIndex = 0;
            }
        }
        if (this.lastContent) {
            this.lastContent.onUpdate(data);
        }
    }

    private updateTaskInfoHandler(data) {
        var op: number = Number(data);
        if (op == CarnivalManager.OP_OPEN) {
            this.carnivalModel.openFrameTime = new Date().getTime();
        }
        if (this.lastContent && this.lastContent == this.dayTaskPage) {
            this.lastContent.onUpdate(data);
        }
    }

    private get carnivalModel(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    btn_helpClick() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("carnival.helpTip");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    public OnShowWind(): void {
        super.OnShowWind();
        this.carnivalModel.openFrameTime = new Date().getTime();
        CarnivalManager.Instance.opRequest(CarnivalManager.OP_OPEN);
    }

    public OnHideWind(): void {
        super.OnHideWind();
        this.offEvent();
    }

    dispose(dispose?: boolean): void {
        this.offEvent();
        this.taskItem = null;
        this.pointItem = null;
        if (this.tabView) {
            for (const key in this.tabView) {
                if (Object.prototype.hasOwnProperty.call(this.tabView, key)) {
                    let content = this.tabView[key];
                    if (content) {
                        content.onDestroy();
                    }
                    content = null;
                }
            }
        }
        this.lastContent = null;
        super.dispose(dispose);
    }

}

