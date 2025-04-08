import ConfigMgr from '../../../core/config/ConfigMgr';
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import Utils from '../../../core/utils/Utils';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { ArmyManager } from '../../manager/ArmyManager';
import { ShopGoodsInfo } from '../shop/model/ShopGoodsInfo';
import BuyHpItem from './BuyHpItem';
import RoleCom from './RoleCom';
export default class BuyHpWnd extends BaseWindow {
    private itemListInfo: fgui.GList = null;
    private hpProgress: fgui.GProgressBar;
    private myhp: fgui.GProgressBar;
    public n8: fgui.GComponent;

    public OnInitWind() {
        this.n8.getChild('title').text = LangManager.Instance.GetTranslation("mainBar.view.quickbuy.QuickBuyFrame.title");
        this.setCenter();
        this.itemListInfo.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.itemListInfo.numItems = this.dataList.length;
        this.updateProgress();
        this.addEvent();
    }

    OnShowWind() {
        super.OnShowWind();
    }

    private addEvent() {
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.THANE_INFO_UPDATE, this.updateProgress, this);
    }

    private removeEvent() {
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_INFO_UPDATE, this.updateProgress, this);
    }

    renderListItem(index: number, item: BuyHpItem) {
        if (this.dataList[index] && item && !item.isDisposed)
            item.vData = this.dataList[index];
    }

    private updateProgress() {
        if (ArmyManager.Instance.army) {
            this.myhp.getChild('progress').text = ArmyManager.Instance.army.baseHero.hp + " / " + ArmyManager.Instance.army.baseHero.attackProrerty.totalLive;
            let hpPercent: number = ArmyManager.Instance.army.baseHero.hp / ArmyManager.Instance.army.baseHero.attackProrerty.totalLive;
            if (hpPercent > 1) hpPercent = 1;
            this.myhp.value = Math.floor(hpPercent * 100);

            let pro = ArmyManager.Instance.army.baseHero.blood / ArmyManager.Instance.army.baseHero.attackProrerty.totalLive;
            if(pro >1){
                pro = 1;
            }
            if(pro < 0){
                pro = 0;
            }
            this.hpProgress.getChild('progress').text = ArmyManager.Instance.army.baseHero.blood + " / " + ArmyManager.Instance.army.baseHero.attackProrerty.totalLive;
            this.hpProgress.value =  Math.floor(pro * 100);
        } else {
            this.myhp.getChild('progress').text = "0/0";
            this.myhp.value = 0;
            this.hpProgress.getChild('progress').text = "0/0";
            this.hpProgress.value = 0;
        }
    }

    private get dataList(): Array<ShopGoodsInfo> {
        let arr: Array<ShopGoodsInfo> = new Array()
        //优化标记 这个是否可以直接用元数组
        for (const key in ConfigMgr.Instance.bloodShopTemplateDic) {
            if (Object.prototype.hasOwnProperty.call(ConfigMgr.Instance.bloodShopTemplateDic, key)) {
                let gInfo: ShopGoodsInfo = ConfigMgr.Instance.bloodShopTemplateDic[key];
                arr.push(gInfo);
            }
        }
        return arr;
    }

    OnHideWind() {
        // this.itemListInfo.itemRenderer.recover();
        Utils.clearGListHandle(this.itemListInfo);
        super.OnHideWind();
        this.removeEvent();
    }
}