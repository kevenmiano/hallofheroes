// @ts-nocheck
import FUI_PayItem from "../../../../../../fui/Shop/FUI_PayItem";
import { t_s_rechargeData } from '../../../../config/t_s_recharge';
import LangManager from '../../../../../core/lang/LangManager';
import { ShopManager } from "../../../../manager/ShopManager";
import Utils from "../../../../../core/utils/Utils";
import { ChargeLotteryManager } from "../../../../manager/ChargeLotteryManager";
import LotteryInfoMsg = com.road.yishi.proto.active.LotteryInfoMsg;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/22 17:48
 * @ver 1.0
 *
 */
export class PayItem extends FUI_PayItem {
    private _info: t_s_rechargeData;

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    get info(): t_s_rechargeData {
        return this._info;
    }

    set index(value: number) {
        this.bg.url = fgui.UIPackage.getItemURL("Shop", `Img_Top_up_${value}`);

        if (ChargeLotteryManager.instance.openChargeLottery) {
            this.canLottery.selectedIndex = 1;
            let msg: LotteryInfoMsg = ChargeLotteryManager.instance.chargeMsg.lotteryInfo[value - 1] as LotteryInfoMsg;
            if (msg) {
                this.txt_times.text = "+" + msg.giveNum;
                // this.txt_times.y = msg.giveNum >= 100 ? 64 : 58;
                this.txt_leftTimes.text = LangManager.Instance.GetTranslation("emailII.view.EmailItemView.leftTime", msg.maxNum - msg.curNum);
                if (msg.maxNum - msg.curNum <= 0) {
                    this.canLottery.selectedIndex = 0;
                }
            }
        }
        else {
            this.canLottery.selectedIndex = 0;
        }
    }

    set info(value: t_s_rechargeData) {
        this._info = value;
        this.txt_add.text = "+" + value.Para3;//赠送钻石
        this.txt_diamond.text = value.Para2 + " " + LangManager.Instance.GetTranslation("mainBar.WorldBossBuyBuffBar.point");//获得钻石
        if (Utils.isInteger(value.MoneyNum)) {
            this.txt_price.text = ShopManager.Instance.getMoneyString() + parseInt(value.MoneyNum);//价格
        } else {
            this.txt_price.text = ShopManager.Instance.getMoneyString() + value.MoneyNum;//价格
        }
        let rechargeCount = ShopManager.Instance.getProductCount(value.ProductId);
        this.isDouble.selectedIndex = (rechargeCount <= 0) ? 1 : 0;//首充双倍
    }

    dispose() {
        this._info = null;
        super.dispose();
    }
}