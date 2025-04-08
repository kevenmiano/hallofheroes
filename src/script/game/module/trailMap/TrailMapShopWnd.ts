/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-02 20:06:49
 * @LastEditTime: 2021-06-28 12:30:55
 * @LastEditors: jeremy.xu
 * @Description: 试炼商店
 */
import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import { PackageIn } from '../../../core/net/PackageIn';
import { ServerDataManager } from '../../../core/net/ServerDataManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { S2CProtocol } from '../../constant/protocol/S2CProtocol';
import { CampaignManager } from '../../manager/CampaignManager';
import TrailMapShopCellItem from './TrailMapShopCellItem';

import TrialInfoMsg = com.road.yishi.proto.battle.TrialInfoMsg;

export default class TrialMapShopWnd extends BaseWindow {
    private frame: fgui.GComponent = null;
    private list: fgui.GList = null;

    OnShowWind() {
        super.OnShowWind();
        fgui.UIObjectFactory.setExtension("ui://TrailMap/trailMapShopCell", TrailMapShopCellItem);
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation("campaign.TrailShop.Title");
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.setCenter();
        this.refreshView();
        ServerDataManager.listen(S2CProtocol.U_BUY_TRIAL_RESULT, this, this.onBuyTrialResult.bind(this));
    }

    OnHideWind() {
        super.OnHideWind();
        try {
            this.list.removeChildrenToPool();
        } catch (error) {
            Logger.error(error);
        }
        ServerDataManager.cancel(S2CProtocol.U_BUY_TRIAL_RESULT, this, this.onBuyTrialResult.bind(this));
    }

    private onBuyTrialResult(pkg: PackageIn) {
        var msg = pkg.readBody(TrialInfoMsg) as TrialInfoMsg;
        if (msg.param1 != 0) {
            for (let index = 0; index < this.list.numChildren; index++) {
                const item = this.list.getChildAt(index) as TrailMapShopCellItem;
                if (item.info.id == msg.skillId) {
                    item.info.currentCount = msg.count;
                    item.info = item.info;
                }
            }
        }
    }

    private renderListItem(index: number, item: TrailMapShopCellItem) {
        if (!item || item.isDisposed) {
            return
        }
        let shopList = this.trialModel.shopList
        if (!shopList) return
        let itemData = shopList[index]
        if (!itemData) {
            item.info = null
            return
        }

        item.info = itemData
    }

    private refreshView() {
        if (this.trialModel) {
            this.list.numItems = this.trialModel.shopList.length
        }
    }

    private get trialModel() {
        return CampaignManager.Instance.trialModel
    }
}