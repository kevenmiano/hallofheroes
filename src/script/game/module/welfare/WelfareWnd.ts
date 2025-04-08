// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import { PackageIn } from '../../../core/net/PackageIn';
import { ServerDataManager } from '../../../core/net/ServerDataManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { ArrayConstant, ArrayUtils } from '../../../core/utils/ArrayUtils';
import Utils from '../../../core/utils/Utils';
import MaskLockOper from '../../component/MaskLockOper';
import { t_s_dropitemData } from '../../config/t_s_dropitem';
import { DropCondictionType } from '../../constant/DropContictionType';
import { EmWindow } from '../../constant/UIDefine';
import { DayGuideEvent, EmailEvent, ExpBackEvent, NotificationEvent, PassCheckEvent } from '../../constant/event/NotificationEvent';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { S2CProtocol } from '../../constant/protocol/S2CProtocol';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import { DataCommonManager } from '../../manager/DataCommonManager';
import DayGuideManager from '../../manager/DayGuideManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { TempleteManager } from '../../manager/TempleteManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import ComponentSetting from '../../utils/ComponentSetting';
import WelfareCtrl from './WelfareCtrl';
import WelfareData, { WelfareTab } from './WelfareData';
import { WelfareManager } from './WelfareManager';
import DegreeActivityBoxData from './data/DegreeActivityBoxData';
import GrowthFundItemInfo from './data/GrowthFundItemInfo';
import { BindMailView } from './view/BindMailView';
import { BindPhoneView } from './view/BindPhoneView';
import DegreeActivityView from './view/DegreeActivityView';
import { GrowthFundView } from './view/GrowthFundView';
import { LevelGiftView } from './view/LevelGiftView';
import MonthCardView from './view/MonthCardView';
import { OnlineGiftView } from './view/OnlineGiftView';
import PassportView from './view/PassportView';
import SevenLoginView from './view/SevenLoginView';
import SignInCom from './view/SignInCom';

import OnlineRewardInfoRsp = com.road.yishi.proto.active.OnlineRewardInfoRsp;
import ActivityTimeView from './view/ActivityTimeView';
import OpenGrades from '../../constant/OpenGrades';
/**
* @author:pzlricky
* @data: 2021-06-23 15:46
* @description 福利
*/
export default class WelfareWnd extends BaseWindow {
    protected setSceneVisibleOpen: boolean = true;

    private defaultSelectIndex: number = 0;//默认选择索引

    private tabData: Array<any> = [];

    private tabURL: Array<any> = [];

    private contentView: fgui.GLoader;

    private maskNode: fgui.GComponent;

    private tabList: fgui.GList;//Tab列表
    private _remainTime: number = 0;//七日目标活动剩余时间(秒)
    private _sevenLoginRemainTime: number = 0;//七日登录活动剩余时间(秒)t
    private _str1: string = 'welfareWnd.tabTitle.SignIn';//签到
    private _str3: string = 'welfareWnd.tabTitle.DegreeActivity';//活跃度
    private _str4: string = 'welfareWnd.tabTitle.LevelGift';//等级礼包
    private _str5: string = 'welfareWnd.tabTitle.MonthCard';//月卡
    private _str6: string = 'welfareWnd.tabTitle.GrowthFund';//成长基金
    private _str7: string = 'welfareWnd.tabTitle.OnlineGift';//在线礼包
    private _str8: string = 'welfareWnd.tabTitle.sevenLogin';//七日登录
    private _str9: string = 'welfareWnd.tabTitle.expBack';//资源找回
    private _str10: string = 'pass.text14';//通行证
    private _str11: string = 'welfareWnd.tabTitle.bindPhone';//绑定手机
    private _str12: string = 'welfareWnd.tabTitle.bindMail';//绑定邮箱
    private _str13: string = 'welfareWnd.tabTitle.activityTime';//活动日程
    /**
     * 界面初始化
     */
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.onEvent();
        this.onInitTab();

        this.control.sendLevelGiftReward(1);//请求等级礼包数据
        let grade: number = parseInt(TempleteManager.Instance.getConfigInfoByConfigName("seventarget_Grade").ConfigValue);

        this.initDegreeActivityData();//活跃度数据
        this.redPoint_Sign();//签到红点

        if (PlayerManager.Instance.currentPlayerModel.playerInfo.isSignOpen) {//七日登录开启
            this.addSevenLoginBtn();
            this.control.requestSevenLoginInfo();
        }
        if (this.ctrlData.isPay != 4 && !(Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION)) {//没有全部领取完成
            this.addGrowthFundViewBtn();
        }
        if (this.ctrlData.needShowLevelGiftBtn) {//需要显示成长基金页签
            this.addLevelGiftViewBtn();
        }

        if (PlayerManager.Instance.currentPlayerModel.playerInfo.isPassOpen && this.ctrlData.passRewardInfo.leftTime > 0 && !(Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION)) {
            WelfareManager.Instance.reqPassRewardInfo(1, 0, 0);
            WelfareManager.Instance.reqPassTaskInfo();
            this.addPassBtn();
        }

        if (WelfareManager.Instance.isReachOpenBindCon(1)) {
            if (WelfareManager.Instance.bindPhoneState != 3) {
                this.addBindPhoneBtn()
            }
        }
        if (WelfareManager.Instance.isReachOpenBindCon(2)) {
            if (WelfareManager.Instance.bindMailState != 4) {
                this.addBindMailBtn()
            }
        }

        if (this.thane.grades >= OpenGrades.WORLD_BOSS) {
            this.addActivityTimeBtn();
        } 

        if (this.frameData) {
            if (this.frameData.index) {
                this.defaultSelectIndex = this.frameData.index;
            } else if (this.frameData.str) {
                let findBtnIndex: number = this.findBtnIndexByName(this.frameData.str);
                this.defaultSelectIndex = findBtnIndex;
            }
        }
        this.tabList.selectedIndex = this.defaultSelectIndex;
        this.__onTabSelectHandler();
        this.control.sendOnlineRewardReq(1);
        this.redPointExpBack();
        this.control.sendMonthCardReward(1);
        MaskLockOper.Instance.regist(this, this.doLockOper);
    }

    private doLockOper(isLock: boolean) {
        this.maskNode.enabled = isLock;
        this.maskNode.visible = isLock;
    }

    /**
     * 界面展示
     */
    OnShowWind() {
        super.OnShowWind();
    }
    onInitTab() {
        this.tabData = [
            { str: this._str1, sort: WelfareTab.SIGN },//签到
            { str: this._str3, sort: WelfareTab.DEGREE_ACTIVITY },//活跃度
            { str: this._str7, sort: WelfareTab.ONLINE_GIFT },//在线礼包
        ];
        this.tabURL = [
            { url: SignInCom.URL, sort: WelfareTab.SIGN },
            { url: DegreeActivityView.URL, sort: WelfareTab.DEGREE_ACTIVITY },
            { url: OnlineGiftView.URL, sort: WelfareTab.ONLINE_GIFT },
        ];
        if (!(Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION)) {
            this.tabData.push({ str: this._str5, sort: WelfareTab.MONTH_CARD });
            this.tabURL.push({ url: MonthCardView.URL, sort: WelfareTab.MONTH_CARD });
        }

        this.tabList.numItems = this.tabData.length;
    }

    onEvent() {
        this.tabList.itemRenderer = Laya.Handler.create(this, this.renderTabListItem, null, false);
        this.tabList.on(fairygui.Events.CLICK_ITEM, this, this.__onTabSelectHandler);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.redPoint_Sign, this);
        this.playerInfo.addEventListener(PlayerEvent.REWARDSTATE_CHANGE, this.redPoint_Sign, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.redPointLevelGift, this);
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.redPointLevelGift, this);
        DayGuideManager.Instance.cate.addEventListener(DayGuideEvent.LEED_PROGRESS_CHANGE, this.redPointDegreeActivity, this);
        DayGuideManager.Instance.cate.addEventListener(DayGuideEvent.ACTIVE_CHANGE, this.redPointDegreeActivity, this);
        DayGuideManager.Instance.cate.addEventListener(DayGuideEvent.WEEK_ACTIVE_CHANGE, this.redPointDegreeActivity, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SEVEN_LOGIN_REWARD_UPDATE, this.redPointSevenLogin, this);
        NotificationManager.Instance.addEventListener(PassCheckEvent.RECEIVE_PASS_REWARD, this.redPointPassCheck, this);
        NotificationManager.Instance.addEventListener(PassCheckEvent.PASS_TASK_FRESH, this.redPointPassCheck, this);
        NotificationManager.Instance.addEventListener(PassCheckEvent.PASS_TIME_VOER, this.clearPassBtn, this);
        ServerDataManager.listen(S2CProtocol.U_C_ONLINE_REWARD, this, this.onLineRewardBack);
        NotificationManager.Instance.addEventListener(NotificationEvent.GROWTH_FUND_UPDATE, this.redPointGrowthFund, this);
        NotificationManager.Instance.addEventListener(ExpBackEvent.UPDATE_INFO, this.redPointExpBack, this);
        NotificationManager.Instance.addEventListener(EmailEvent.WELFARE_BIND_STATE, this.redPointBind, this);
        this.playerInfo.addEventListener(PlayerEvent.MONTH_CARD_CHANGE, this.redMonthCard, this);
    }

    offEvent() {
        Laya.timer.clear(this, this.__updateSevenLoginTimeHandler);
        Utils.clearGListHandle(this.tabList);
        this.tabList && this.tabList.off(fairygui.Events.CLICK_ITEM, this, this.__onTabSelectHandler);
        this.playerInfo && this.playerInfo.removeEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.redPoint_Sign, this);
        this.playerInfo && this.playerInfo.removeEventListener(PlayerEvent.REWARDSTATE_CHANGE, this.redPoint_Sign, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.redPointLevelGift, this);
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.redPointLevelGift, this);
        DayGuideManager.Instance.cate.removeEventListener(DayGuideEvent.ACTIVE_CHANGE, this.redPointDegreeActivity, this);
        DayGuideManager.Instance.cate.removeEventListener(DayGuideEvent.WEEK_ACTIVE_CHANGE, this.redPointDegreeActivity, this);
        DayGuideManager.Instance.cate.removeEventListener(DayGuideEvent.LEED_PROGRESS_CHANGE, this.redPointDegreeActivity, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SEVEN_LOGIN_REWARD_UPDATE, this.redPointSevenLogin, this);
        NotificationManager.Instance.removeEventListener(PassCheckEvent.RECEIVE_PASS_REWARD, this.redPointPassCheck, this);
        NotificationManager.Instance.removeEventListener(PassCheckEvent.PASS_TASK_FRESH, this.redPointPassCheck, this);
        NotificationManager.Instance.removeEventListener(PassCheckEvent.PASS_TIME_VOER, this.clearPassBtn, this);
        ServerDataManager.cancel(S2CProtocol.U_C_ONLINE_REWARD, this, this.onLineRewardBack);
        NotificationManager.Instance.removeEventListener(NotificationEvent.GROWTH_FUND_UPDATE, this.redPointGrowthFund, this);
        NotificationManager.Instance.removeEventListener(ExpBackEvent.UPDATE_INFO, this.redPointExpBack, this);
        NotificationManager.Instance.removeEventListener(EmailEvent.WELFARE_BIND_STATE, this.redPointBind, this);
        this.playerInfo && this.playerInfo.removeEventListener(PlayerEvent.MONTH_CARD_CHANGE, this.redMonthCard, this);
    }

    private onLineRewardBack(pkg: PackageIn) {
        let msg: OnlineRewardInfoRsp = pkg.readBody(OnlineRewardInfoRsp) as OnlineRewardInfoRsp;
        if (msg && msg.rewardTime > 0) {
            this.setTabBtnState(this._str7, true);
        } else {
            this.setTabBtnState(this._str7, false);
        }
    }

    private updateRedPoint() {
        this.redPoint_Sign();
        this.redPointLevelGift();
        this.redPointDegreeActivity();
        this.redPointSevenLogin();
        this.redPointGrowthFund();
        this.redPointExpBack();
        this.redMonthCard();
        this.redPointPassCheck();
        this.redPointBind();
        this.redPointActivityTime();
    }

    /**添加七日登录按钮 */
    private addSevenLoginBtn() {
        this.tabData.push({ str: this._str8, sort: WelfareTab.SEVEN_GOALS });
        this.tabURL.push({ url: SevenLoginView.URL, sort: WelfareTab.SEVEN_GOALS });
        this.updateTabList();
        this._sevenLoginRemainTime = (this.ctrlData.sevenLoginEndTime - PlayerManager.Instance.currentPlayerModel.sysCurtime.getTime()) / 1000;
        if (this._sevenLoginRemainTime > 0) {
            Laya.timer.loop(1000, this, this.__updateSevenLoginTimeHandler);
        }
        this.redPointSevenLogin();
    }

    /**添加成长基金按钮 */
    private addGrowthFundViewBtn() {
        this.tabData.push({ str: this._str6, sort: WelfareTab.GROUTH_FUND });
        this.tabURL.push({ url: GrowthFundView.URL, sort: WelfareTab.GROUTH_FUND });
        this.updateTabList();
        this.redPointGrowthFund();
    }

    /**添加等级礼包按钮 */
    private addLevelGiftViewBtn() {
        this.tabData.push({ str: this._str4, sort: WelfareTab.LEVEL_GIFT });
        this.tabURL.push({ url: LevelGiftView.URL, sort: WelfareTab.LEVEL_GIFT });
        this.updateTabList();
        this.redPointLevelGift();
    }

    /**添加通行证按钮 */
    private addPassBtn() {
        this.tabData.push({ str: this._str10, sort: WelfareTab.PASS });
        this.tabURL.push({ url: PassportView.URL, sort: WelfareTab.PASS });
        this.updateTabList();
    }

    private addBindPhoneBtn() {
        this.tabData.push({ str: this._str11, sort: WelfareTab.BIND_PHONE });
        this.tabURL.push({ url: BindPhoneView.URL, sort: WelfareTab.BIND_PHONE });
        this.updateTabList();
    }

    private addBindMailBtn() {
        this.tabData.push({ str: this._str12, sort: WelfareTab.BIND_MAIL });
        this.tabURL.push({ url: BindMailView.URL, sort: WelfareTab.BIND_MAIL });
        this.updateTabList();
    }

    private addActivityTimeBtn(){
        this.tabData.push({ str: this._str13, sort: WelfareTab.ACTIVITY_TIME });
        this.tabURL.push({ url: ActivityTimeView.URL, sort: WelfareTab.ACTIVITY_TIME });
        this.updateTabList();
    }

    private __updateSevenLoginTimeHandler() {
        this._sevenLoginRemainTime--;
        if (this._sevenLoginRemainTime <= 0) {
            Laya.timer.clear(this, this.__updateSevenLoginTimeHandler);
            this.clearSevenLoginBtn();
        }
    }

    private clearPassBtn() {
        this.removeItem(this._str10);
        this.updateTabList();
    }

    private clearSevenLoginBtn() {
        this.removeItem(this._str8);
        this.updateTabList();
    }

    private updateTabList() {
        this.tabData = ArrayUtils.sortOn(this.tabData, "sort", ArrayConstant.NUMERIC);
        this.tabURL = ArrayUtils.sortOn(this.tabURL, "sort", ArrayConstant.NUMERIC);
        this.tabList.numItems = this.tabData.length;
        this.updateRedPoint();
    }

    /**
     * 解析活跃度数据表数据
     */
    initDegreeActivityData() {
        //获取活跃度配置宝箱
        let activityBoxs = TempleteManager.Instance.getDropConditionByType(DropCondictionType.DEGREE);
        this.ctrlData.dayDegreeBoxs = [];
        this.ctrlData.weekDegreeBoxs = [];
        for (const key in activityBoxs) {
            if (Object.prototype.hasOwnProperty.call(activityBoxs, key)) {
                let keyIndex: number = Number(key);
                let box = activityBoxs[key];
                let data = new DegreeActivityBoxData();
                data.index = keyIndex;
                data.point = box.Para1[0];
                data.type = box.Para2[0];
                data.tipData = this.getTipsStr(box.DropId);
                if (data.type == 1) {//周宝箱宝箱
                    this.ctrlData.weekDegreeBoxs.push(data);
                } else if (data.type == 0) {//每日宝箱
                    this.ctrlData.dayDegreeBoxs.push(data);
                    if (data.point >= this.ctrlData.dayMaxDegreePoint) {
                        this.ctrlData.dayMaxDegreePoint = data.point;
                    }
                }
            }
        }
        this.ctrlData.dayDegreeBoxs = ArrayUtils.sortOn(this.ctrlData.dayDegreeBoxs, "point", ArrayConstant.NUMERIC);
        this.redPointDegreeActivity();
    }

    /**获取提示 */
    private getTipsStr(value: number): string {
        var arr: Array<t_s_dropitemData> = TempleteManager.Instance.getDropItemssByDropId(value);
        var str: string = LangManager.Instance.GetTranslation("dayguide.LimitedSellView.ActiveBoxItemTips") + "<br>";
        if (arr != null) {
            for (var i: number = 0; i < arr.length; i++) {
                if (i == arr.length - 1) {
                    str += this.getGoodsName(arr[i].ItemId) + " x" + arr[i].Data;
                } else {
                    str += this.getGoodsName(arr[i].ItemId) + " x" + arr[i].Data + "<br>";
                }
            }
        }
        return str;
    }

    private getGoodsName(itemId: number): string {
        if (TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemId))
            return TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemId).TemplateNameLang;
        else
            return "";
    }


    /**签到红点 */
    redPoint_Sign() {
        let canSign = this.ctrlData.canSign;
        this.setTabBtnState(this._str1, canSign);
    }

    /**等级礼包红点 */
    redPointLevelGift() {
        let canReceiveLevelGift = this.ctrlData.canReceiveLevelGift;
        this.setTabBtnState(this._str4, canReceiveLevelGift);
    }

    /**活跃度红点 */
    private redPointDegreeActivity() {
        let receiveActive = this.ctrlData.canReceiveActive;
        let receiveWeekActive = this.ctrlData.canReceiveWeekActive;
        this.setTabBtnState(this._str3, receiveActive || receiveWeekActive);
    }

    /**通行证红点 */
    private redPointPassCheck() {
        let showRed = PassportView.isLogin && !this.ctrlData.passRewardInfo.isPay;
        let receiveActive = this.ctrlData.canReceivePassCheckReward > 0 || showRed;
        let receiveWeekActive = this.ctrlData.canReceivePassCheckTaskReward;
        this.setTabBtnState(this._str10, receiveActive || receiveWeekActive);
    }

    /**七日登录红点 */
    redPointSevenLogin() {
        let flag: boolean = false;
        for (let i = 0; i < 7; i++) {
            if (i <= this.ctrlData.sevenLoginTotalDays) {
                let receiveActive = this.ctrlData.checkSevenLoginDayRed(i);
                if (receiveActive) {
                    flag = true;
                }
                break;
            }
        }
        this.setTabBtnState(this._str8, flag);
    }

    /**成长基金红点 */
    redPointGrowthFund() {
        let flag: boolean = false;
        if (!PlayerManager.Instance.currentPlayerModel.playerInfo.hasBuyGrowthFund
            && !PlayerManager.Instance.currentPlayerModel.playerInfo.todayHasClickGrowthFund)//未购买成长基金并且当天没有点击过成长基金页签
        {
            flag = true;
        }
        else//已经购买
        {
            for (let i = 0; i < this.model.growthFundInfoArr.length; i++) {
                let item: GrowthFundItemInfo = this.model.growthFundInfoArr[i];
                if (item && item.packageState == 2) {
                    flag = true;
                    break;
                }
            }
        }
        this.setTabBtnState(this._str6, flag);
    }

    /**资源找回红点 */
    redPointExpBack() {
        let flag: boolean = false;
        if (this.ctrlData.expBackItemDataArr.length > 0 && !this.ctrlData.hasClickExpTab) {
            flag = true;
        }
        this.setTabBtnState(this._str9, flag);
    }

    /**月卡红点 */
    redMonthCard() {
        let flag: boolean = false;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        let array = playerInfo.monthCardInfos;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element.isPay && !element.isReceive) {
                flag = true;
                break;
            }
        }
        this.setTabBtnState(this._str5, flag);
    }

    /**
     * 绑定手机、邮箱 红点
     */
    redPointBind() {
        this.redPointBindPhone()
        this.redPointBindMail()
    }

    private redPointActivityTime(){
        
    }
    
    redPointBindPhone() {
        let flag: boolean = WelfareManager.Instance.getBindPhoneRedFlag();
        this.setTabBtnState(this._str11, flag);
    }

    redPointBindMail() {
        let flag: boolean = WelfareManager.Instance.getBindMailRedFlag();
        this.setTabBtnState(this._str12, flag);
    }


    /**
     * 设置Tab按钮红点状态
     * @param tabIndex Tab索引
     * @param redPointState 是否展示红点
     */
    private setTabBtnState(titleName: string, redPointState: boolean, count: number = 0) {
        Logger.info("设置红点", titleName, redPointState)
        let btnView = this.getTabBtn(titleName);
        if (btnView) {
            let ctrl = btnView.getController('redPointState');
            let redDotLabel = btnView.getChild('redDotLabel');
            ctrl.selectedIndex = redPointState ? 1 : 0;
            redDotLabel.text = count > 0 ? count.toString() : "";
        }
    }

    /**渲染Tab单元格 */
    renderTabListItem(index: number, item: fgui.GButton) {
        let titleStr;
        if (this.tabData[index]) {
            titleStr = this.tabData[index].str;
        }
        if (!item) return;
        item.title = this.getTitleNameStr(titleStr);
        let selectedValue:string = LangManager.Instance.GetTranslation(titleStr);
        item.selectedTitle = `[size=24][color=#FFFAD6][B]${selectedValue}[/B][/color][/size]`;
        item.data = this.tabData[index];
    }

    private tabInterval: number = 200;
    private tabIntervalState: boolean = true;
    /**切换Tab */
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
        this.tabList.displayObject.mouseEnabled = true;
        Laya.timer.clear(this, this.__tabIntervalOnce);
    }

    /**选择Tab索引 */
    onSelectTab(tabIndex: number) {
        if (!WelfareManager.Instance.bindPhoneTabFirstOpen && this.tabURL[tabIndex].sort == WelfareTab.BIND_PHONE) {
            WelfareManager.Instance.firstOpenBindPhoneTab()
        }
        if (!WelfareManager.Instance.bindMailTabFirstOpen && this.tabURL[tabIndex].sort == WelfareTab.BIND_MAIL) {
            WelfareManager.Instance.firstOpenBindMailTab()
        }

        this.tabList.selectedIndex = tabIndex;
        let contentURL = null;
        //创建对应的tab内容窗体
        contentURL = this.tabURL[tabIndex].url;
        if (contentURL) {
            this.contentView.url = contentURL;
        } else {
            this.contentView.url = "";
        }
    }

    private getTitleNameStr(str: string): string {
        let value = LangManager.Instance.GetTranslation(str);
        return `[size=24][color=#d1b186]${value}[/color][/size]`
    }

    /**获取Tab按钮 */
    private getTabBtn(btnName: string): fgui.GButton {
        let returnBtn: fgui.GButton;
        for (let i = 0; i < this.tabList.numChildren; i++) {
            let btn: fgui.GButton = this.tabList.getChildAt(i) as fgui.GButton;
            if (btn && btn.title == this.getTitleNameStr(btnName)) {
                returnBtn = btn;
                break;
            }
        }
        return returnBtn;
    }

    private findBtnIndexByName(btnStr: string): number {
        let index = 0;
        for (let i = 0; i < this.tabList.numChildren; i++) {
            let btn: fgui.GButton = this.tabList.getChildAt(i) as fgui.GButton;
            if (btn && btn.title == this.getTitleNameStr(btnStr)) {
                index = i;
                break;
            }
        }
        return index;
    }

    private removeItem(btnName: string) {
        for (let i = 0; i < this.tabList.numChildren; i++) {
            let btn: fgui.GButton = this.tabList.getChildAt(i) as fgui.GButton;
            if (btn && btn.title == this.getTitleNameStr(btnName)) {
                this.tabList.removeChildToPoolAt(i);
                this.tabURL.splice(i, 1);
                break;
            }
        }
    }


    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get ctrlData(): WelfareData {
        return this.control.data;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }


    protected OnClickModal() {

    }

    /**
     * 关闭界面
     */
    OnHideWind() {
        this.offEvent();
        this.tabData = [];
        this.tabURL = [];
        Laya.timer.clear(this, this.__tabIntervalOnce);
        MaskLockOper.Instance.unRegist();
        super.OnHideWind();
        NotificationManager.Instance.dispatchEvent(NotificationEvent.PASS_CHECK_AWARD_STATE);
    }
}