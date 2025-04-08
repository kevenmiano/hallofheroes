import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import { NotificationEvent } from '../../constant/event/NotificationEvent';
import { NotificationManager } from '../../manager/NotificationManager';
import FirstPayModel from './FirstPayModel';
import FirstPayManager from '../../manager/FirstPayManager';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { PlayerManager } from '../../manager/PlayerManager';
import { TempleteManager } from '../../manager/TempleteManager';
import StringHelper from '../../../core/utils/StringHelper';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { ThaneInfoHelper } from '../../utils/ThaneInfoHelper';
import { EmWindow } from '../../constant/UIDefine';
import UIManager from '../../../core/ui/UIManager';
import Utils from '../../../core/utils/Utils';
import LangManager from '../../../core/lang/LangManager';
import RechargeAlertMannager from '../../manager/RechargeAlertMannager';
import { RewardItem } from '../../component/item/RewardItem';
/**
 * 首充送豪礼
 */
export default class FirstPayWnd extends BaseWindow {
    /** 第一天 */
    public firstDayBtn: UIButton;
    /** 第二天 */
    public secondDayBtn: UIButton;
    /** 第三天 */
    public thirdDayBtn: UIButton;

    /** 充值 */
    public chargeBtn: UIButton;
    /** 领取奖励 */
    public getRewardBtn: UIButton;
    /** 已领取 */
    public hasGetBtn: UIButton;
    /** 未达成 */
    public notCanGetRewardBtn: UIButton;

    /** 开服第一天奖励列表 */
    public firstDayRewardList: fgui.GList;
    /** 开服第二天奖励列表 */
    public secondDayRewardList: fgui.GList;
    /** 开服第三天奖励列表 */
    public thirdDayRewardList: fgui.GList;
    /** 开服第一天奖励列表数据 */
    private rewardArray1: Array<GoodsInfo> = [];
    /** 开服第二天奖励列表数据 */
    private rewardArray2: Array<GoodsInfo> = [];
    /** 开服第三天奖励列表数据 */
    private rewardArray3: Array<GoodsInfo> = [];

    /** 描述 */
    public descTxt: fgui.GRichTextField;

    private firstPayModel: FirstPayModel;
    private openServerDay: number;

    public OnInitWind() {
        this.openServerDay = PlayerManager.Instance.currentPlayerModel.openServerDay;
        this.firstPayModel = FirstPayManager.Instance.model;
        this.addEvent();
    
        this.descTxt.text = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.firstPayDescTxt");
    }

    OnShowWind() {
        super.OnShowWind();
        this.initData();
    }

    private initData() {
        this.setDayBtnRedStatus();
        this.setDefaultSelectedItem();
        this.refreshView(1, this.rewardArray1, this.firstDayRewardList);
        this.refreshView(2, this.rewardArray2, this.secondDayRewardList);
        this.refreshView(3, this.rewardArray3, this.thirdDayRewardList);
    }

    private refreshData() {
        this.setDayBtnRedStatus();
        this.setBtnInfo()
    }

    private setDayBtnRedStatus() {
        this.firstDayBtn.view.getChild("redDot").visible = this.firstPayModel["state1"] == FirstPayModel.CAN_GET ? true : false;
        this.secondDayBtn.view.getChild("redDot").visible = this.firstPayModel["state2"] == FirstPayModel.CAN_GET ? true : false;
        this.thirdDayBtn.view.getChild("redDot").visible = this.firstPayModel["state3"] == FirstPayModel.CAN_GET ? true : false;
    }

    private addEvent() {
        this.chargeBtn.onClick(this, this.onChargeBtnHandler);
        this.getRewardBtn.onClick(this, this.getRewardHandler);

        NotificationManager.Instance.addEventListener(NotificationEvent.FIRSTPAY_DATA_UPDATE, this.refreshData, this);

        this.firstDayRewardList.setVirtual();
        Utils.setDrawCallOptimize(this.firstDayRewardList);
        this.firstDayRewardList.itemRenderer = Laya.Handler.create(this, this.renderListItem1, null, false);

        this.secondDayRewardList.setVirtual();
        Utils.setDrawCallOptimize(this.secondDayRewardList);
        this.secondDayRewardList.itemRenderer = Laya.Handler.create(this, this.renderListItem2, null, false);

        this.thirdDayRewardList.setVirtual();
        Utils.setDrawCallOptimize(this.thirdDayRewardList);
        this.thirdDayRewardList.itemRenderer = Laya.Handler.create(this, this.renderListItem3, null, false);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(NotificationEvent.FIRSTPAY_DATA_UPDATE, this.refreshData, this);
        this.chargeBtn.offClick(this, this.onChargeBtnHandler);
        this.getRewardBtn.offClick(this, this.getRewardHandler);
    }

    /**
     * 充值
     */
    private onChargeBtnHandler() {
        UIManager.Instance.HideWind(EmWindow.FirstPayWnd);
        RechargeAlertMannager.Instance.openShopRecharge();
    }

    /**
     * 领取奖励
     */
    private getRewardHandler() {
        FirstPayManager.Instance.getReward();
    }

    private renderListItem1(index: number, item: RewardItem) {
        item.info = this.rewardArray1[index];
    }
    private renderListItem2(index: number, item: RewardItem) {
        item.info = this.rewardArray2[index];
    }
    private renderListItem3(index: number, item: RewardItem) {
        item.info = this.rewardArray3[index];
    }

    /**
     * 设置默认选中项目
     */
    private setDefaultSelectedItem() {
        if (this.openServerDay >= 1 || (this.firstPayModel.state1 == FirstPayModel.CAN_GET || this.firstPayModel.state1 == FirstPayModel.HAS_GETED)) {
            this.firstDayBtn.selected = true;
        } else {
            this.firstDayBtn.selected = false;
        }

        if (this.openServerDay >= 2 || (this.firstPayModel.state2 == FirstPayModel.CAN_GET || this.firstPayModel.state2 == FirstPayModel.HAS_GETED)) {
            this.secondDayBtn.selected = true;
        } else {
            this.secondDayBtn.selected = false;
        }

        if (this.openServerDay >= 3 || (this.firstPayModel.state3 == FirstPayModel.CAN_GET || this.firstPayModel.state3 == FirstPayModel.HAS_GETED)) {
            this.thirdDayBtn.selected = true;
        } else {
            this.thirdDayBtn.selected = false;
        }

        this.setBtnInfo()
    }

    private setBtnInfo() {
        if (this.playerInfo.isFirstCharge) // 已经充值过了
        {
            this.chargeBtn.visible = false;
            this.setBtnVisible();
        }
        else {
            this.chargeBtn.visible = true;
            this.getRewardBtn.visible = false
            this.hasGetBtn.visible = false;
            this.notCanGetRewardBtn.visible = false;
        }
    }

    private setBtnVisible() {
        let hasGetedCount: number = 0; // 已领取的数量
        for (let i: number = 1; i <= 3; i++) {
            const state: number = this.firstPayModel["state" + i];
            if (state == FirstPayModel.CAN_GET) {
                this.notCanGetRewardBtn.visible = false;
                this.getRewardBtn.visible = true;
                this.hasGetBtn.visible = false;
                break;
            } else if (state == FirstPayModel.UNABLE_GET) {
                this.notCanGetRewardBtn.visible = true;
                this.notCanGetRewardBtn.enabled = false;
                this.getRewardBtn.visible = false;
                this.hasGetBtn.visible = false;
                break;
            } else {
                ++hasGetedCount;
            }
        }

        if (3 == hasGetedCount) {
            this.notCanGetRewardBtn.visible = false;
            this.getRewardBtn.visible = false;
            this.hasGetBtn.visible = true;
        }
    }

    private refreshView(day: number, rewardArray: Array<GoodsInfo>, rewardList: fgui.GList) {
        let time: number = day;
        let job = ThaneInfoHelper.getJob(PlayerManager.Instance.currentPlayerModel.playerInfo.job);
        let sex = PlayerManager.Instance.currentPlayerModel.playerInfo.sexs;
        let arr = TempleteManager.Instance.getRewardInfo(time, job, sex);
        if (arr) {
            let rewardStr: string = arr[2];
            if (!StringHelper.isNullOrEmpty(rewardStr)) {
                let rewardArr: Array<string> = rewardStr.split("|");
                rewardArray.length = 0;
                if (rewardArr) {
                    let len: number = rewardArr.length;
                    let goods: GoodsInfo;
                    for (let i: number = 0; i < len; i++) {
                        const goodsData: Array<string> = rewardArr[i].split(",");
                        goods = new GoodsInfo();
                        goods.templateId = parseInt(goodsData[0]);
                        goods.count = parseInt(goodsData[1]);
                        goods.displayEffect = parseInt(goodsData[2]);
                        rewardArray.push(goods);
                    }
                    rewardList.numItems = rewardArray.length;
                }
            }
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }
}