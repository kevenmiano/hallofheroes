import SDKManager from "../../../core/sdk/SDKManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import Utils from "../../../core/utils/Utils";
import { BaseItem } from "../../component/item/BaseItem";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ConfigManager } from "../../manager/ConfigManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";

/**
 * 微端
 */
export default class MicroAppWnd extends BaseWindow {

    private btn_download: UIButton;
    private btn_receive: UIButton;
    private rewardList: fgui.GList;
    private rewardArray: Array<GoodsInfo> = [];
    private state: fgui.Controller;//

    public OnInitWind(): void {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        this.initView();

    }

    private addEvent() {
        this.rewardList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.btn_download.onClick(this, this.onDownLoadMicroApp);
        this.btn_receive.onClick(this, this.onReceiveMicroApp);
        NotificationManager.Instance.addEventListener(PlayerEvent.MICRO_APP_EVENT, this.onUpdateStatus, this);
    }

    private offEvent() {
        // this.rewardList.itemRenderer && this.rewardList.itemRenderer.recover();
        Utils.clearGListHandle(this.rewardList);
        this.btn_download.offClick(this, this.onDownLoadMicroApp);
        this.btn_receive.offClick(this, this.onReceiveMicroApp);
        NotificationManager.Instance.removeEventListener(PlayerEvent.MICRO_APP_EVENT, this.onUpdateStatus, this);
    }

    private initView() {
        this.state = this.getController("state");
        this.rewardList.setVirtual();
        Utils.setDrawCallOptimize(this.rewardList);
        let configTemp = TempleteManager.Instance.getConfigInfoByConfigName("Microterminal_Reward");
        if (!configTemp) return;
        let configValue = configTemp.ConfigValue;
        let configItems = configValue.split("|");
        let configsCount = configItems.length;
        if (configsCount > 0) {
            let configItemStr = "";
            let rewardItem = [];
            let rewardId = 0;
            let rewardCount = 0;
            let goods: GoodsInfo;
            for (let index = 0; index < configsCount; index++) {
                configItemStr = String(configItems[index]);
                rewardItem = configItemStr.split(",");
                rewardId = Number(rewardItem[0]);
                rewardCount = Number(rewardItem[1]);
                goods = new GoodsInfo();
                goods.templateId = rewardId;
                goods.count = rewardCount;
                this.rewardArray.push(goods);
            }
        }
        this.rewardList.numItems = this.rewardArray.length;
        this.onUpdateStatus();
    }

    private onUpdateStatus() {
        if (Utils.isFromMicroApp()) {
            this.state.selectedIndex = PlayerManager.Instance.hasRecMicroAppReward ? 2 : 1;
        } else {
            this.state.selectedIndex = 0;
        }
    }

    private renderListItem(index: number, item: BaseItem) {
        item.info = this.rewardArray[index];
    }

    private onDownLoadMicroApp() {
        SDKManager.Instance.getChannel().openURL(PathManager.info.MICRO_TERMINAL);
    }

    private onReceiveMicroApp() {
        if (!ConfigManager.info.STORE_RATING) return;
        PlayerManager.Instance.reqMicroApp();
    }

    public OnShowWind(): void {
        super.OnShowWind();
    }

    public OnHideWind(): void {
        super.OnHideWind();
        this.offEvent();
    }

    dispose(dispose?: boolean): void {
        this.offEvent();
        super.dispose(dispose);
    }


}