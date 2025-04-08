

import FUI_VipTitle from "../../../../fui/Shop/FUI_VipTitle";
import UIButton from '../../../core/ui/UIButton';
import { BaseItem } from '../../component/item/BaseItem';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import VipPrivilegeCtrl from './VipPrivilegeCtrl';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import { EmWindow } from "../../constant/UIDefine";
import LangManager from '../../../core/lang/LangManager';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { PlayerManager } from "../../manager/PlayerManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import Utils from "../../../core/utils/Utils";
import { RewardItem } from "../../component/item/RewardItem";

export enum VipGiftType {
    DAY = -1,
    WELFARE = 0,
    PAY = 1
}

/**
 * Vip礼包单元格
 */
export default class VipTitle extends FUI_VipTitle {

    private _cellData: GoodsInfo[];
    public type: number = 0;
    public _vipgrade: number = 0;
    private btn_buy: UIButton;
    private btn_receive: UIButton;

    onConstruct() {
        super.onConstruct();
        this.addEvent();
        this.btn_buy = new UIButton(this.Btn_Buy);
        this.btn_receive = new UIButton(this.Btn_Receive);
    }

    addEvent() {
        this.Btn_Buy.onClick(this, this.onBuyGift);
        this.Btn_Receive.onClick(this, this.onReceive);
        this.list.setVirtual();
        Utils.setDrawCallOptimize(this.list);

    }

    offEvent() {
        this.Btn_Buy.offClick(this, this.onBuyGift);
        this.Btn_Receive.offClick(this, this.onReceive);
    }

    renderListItem(index: number, item: RewardItem) {
        if(item && !item.isDisposed) {
            item.info = this._cellData[index];
        }
    }

    public get vipgrade(): number {
        return this._vipgrade;
    }

    public set vipgrade(value: number) {
        this._vipgrade = value;
        this.Btn_unBuy.setVar("level", value.toString()).flushVars();
        if (this.type == VipGiftType.DAY) {
            this.Btn_unReceive.text = LangManager.Instance.GetTranslation('vip.vipPrivilegeItem.des');
        } else {
            this.Btn_unReceive.setVar("level", value.toString()).flushVars();
        }
    }

    /**购买礼包 */
    private onBuyGift(evt: Laya.Event) {
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        var confirm1: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel1: string = LangManager.Instance.GetTranslation("public.cancel");
        let msg = LangManager.Instance.GetTranslation("VIPPrivilegeWnd.BuyAlert.Confirm", this._vipgrade, this.txt_currPrice.text);
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, msg, confirm1, cancel1, (ret: boolean) => {
            if (ret) {
                if (!this.checkDiamondEnough) {
                    RechargeAlertMannager.Instance.show(() => {
                        this.vipctrl.exit();
                    });
                } else {
                    this.vipctrl.openGiftReq(this.type, this.vipgrade);
                }
            }
        });
        evt.stopPropagation();
    }

    /**
     *检查钻石是否足够
     * @returns 
     */
    private get checkDiamondEnough(): boolean {
        let userDiamond = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
        let nowPrice = Number(this.txt_currPrice.text);
        if (userDiamond >= nowPrice) {
            return true;
        }
        return false;
    }

    private get vipctrl(): VipPrivilegeCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.VipPrivilege) as VipPrivilegeCtrl;
    }

    /**领取礼包 */
    private onReceive(evt: Laya.Event) {
        this.vipctrl.openGiftReq(this.type, this.vipgrade);
        evt.stopPropagation();
    }

    public set OriginalPrice(value: number) {
        this.txt_originalPrice.text = value.toString();
    }

    public set Price(value: number) {
        this.txt_currPrice.text = value.toString();
    }

    /**
     * 每日礼包领取状态
     * 0:不可领取 1:可领取 2:当天已领取过了
     */
    public set dayGiftState(value: number) {
        this.awardState.selectedIndex = value;
    }

    public set itemData(value: GoodsInfo[]) {
        this._cellData = value;
        // this.list.itemRenderer && this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.numItems = value.length;
    }

    public get itemData() {
        return this._cellData;
    }

    dispose() {
        this.offEvent();
        // this.list.itemRenderer && this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this._cellData = null;
        super.dispose();
    }

}