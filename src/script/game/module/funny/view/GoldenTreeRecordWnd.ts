import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { BottleModel } from "../model/BottleModel";
import { BottleManager } from "../../../manager/BottleManager";
import { RewardMsgItem } from "./RewardMsgItem";
import ChatData from "../../chat/data/ChatData";
import { ChatChannel } from "../../../datas/ChatChannel";
import { BottleEvent } from "../../../constant/event/NotificationEvent";
import Utils from "../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/22 21:22
 * @ver 1.0
 */
export class GoldenTreeRecordWnd extends BaseWindow {
    public list_rewards: fgui.GList;
    public list_luckShow: fgui.GList;

    private listData1: Array<ChatData>;
    private listData2: Array<ChatData>;

    protected setOptimize: boolean = true;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.list_rewards.setVirtual();
        this.list_luckShow.setVirtual();

        this.initData();
        this.initEvent();
        this.initView();
        this.setCenter();
    }

    private initData() {
    }

    private initView() {
        this.updateRewardsInfoHandler();
        this.updateLuckShowInfoHandler();
    }

    private initEvent() {
        this.list_rewards.itemRenderer = Laya.Handler.create(this, this.onListRender1, null, false);
        this.list_luckShow.itemRenderer = Laya.Handler.create(this, this.onListRender2, null, false);
        this.bottleModel.addEventListener(BottleEvent.UPDATE_REWARDS_INFO, this.updateRewardsInfoHandler, this);
        this.bottleModel.addEventListener(BottleEvent.UPDATE_LUCK_SHOW_INFO, this.updateLuckShowInfoHandler, this);

    }

    public OnShowWind() {
        super.OnShowWind();
    }

    /**
     * 刷新获奖记录信息
     */
    private updateRewardsInfoHandler() {
        if (this.bottleModel.bottleRewardsInfo) {
            this.listData1 = [];
            for (let i: number = 0; i < this.bottleModel.bottleRewardsInfo.length; i++) {
                let chatData: ChatData = new ChatData();
                chatData.channel = ChatChannel.BOTTLE;
                chatData.msg = this.bottleModel.bottleRewardsInfo[i];
                this.listData1.unshift(chatData);
            }
            this.list_rewards.numItems = this.listData1.length;
        }
    }

    /**
     * 刷新幸运传递信息
     */
    private updateLuckShowInfoHandler() {
        if (this.bottleModel.bottleLuckShowInfo) {
            this.listData2 = [];
            for (let i: number = 0; i < this.bottleModel.bottleLuckShowInfo.length; i++) {
                let chatData: ChatData = new ChatData();
                chatData.channel = ChatChannel.BOTTLE;
                chatData.msg = this.bottleModel.bottleLuckShowInfo[i];
                this.listData2.unshift(chatData);
            }
            this.list_luckShow.numItems = this.listData2.length;
        }
    }

    private onListRender1(index: number, item: RewardMsgItem) {
        item.info = this.listData1[index];
    }

    private onListRender2(index: number, item: RewardMsgItem) {
        item.info = this.listData2[index];
    }

    private get bottleModel(): BottleModel {
        return BottleManager.Instance.model;
    }

    private removeEvent() {
        // this.list_rewards.itemRenderer.recover();
        // this.list_luckShow.itemRenderer.recover();
        Utils.clearGListHandle(this.list_rewards);
        Utils.clearGListHandle(this.list_luckShow);
        this.bottleModel.removeEventListener(BottleEvent.UPDATE_REWARDS_INFO, this.updateRewardsInfoHandler, this);
        this.bottleModel.removeEventListener(BottleEvent.UPDATE_LUCK_SHOW_INFO, this.updateLuckShowInfoHandler, this);
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this.listData1 = null;
        this.listData2 = null;
        super.dispose(dispose);
    }
}