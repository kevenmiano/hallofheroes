import FUI_WelfareMonthCardCell from '../../../../../../fui/Welfare/FUI_WelfareMonthCardCell';
import LangManager from '../../../../../core/lang/LangManager';
import Logger from '../../../../../core/logger/Logger';
import UIButton from '../../../../../core/ui/UIButton';
import { EmWindow } from '../../../../constant/UIDefine';
import RechargeAlertMannager from '../../../../manager/RechargeAlertMannager';
import { FrameCtrlManager } from '../../../../mvc/FrameCtrlManager';
import MonthCardInfo from '../../data/MonthCardInfo';
import WelfareCtrl from '../../WelfareCtrl';
import { TempleteManager } from '../../../../manager/TempleteManager';
import Utils from '../../../../../core/utils/Utils';
import TemplateIDConstant from '../../../../constant/TemplateIDConstant';
import { GoodsInfo } from '../../../../datas/goods/GoodsInfo';
import FUIHelper from '../../../../utils/FUIHelper';
import SDKManager from '../../../../../core/sdk/SDKManager';
import { RPT_EVENT } from '../../../../../core/thirdlib/RptEvent';
import { ShopManager } from '../../../../manager/ShopManager';
/**
* @author:pzlricky
* @data: 2021-06-29 10:31
* @description 超值月卡 单元格 
*/
export default class MonthCardCell extends FUI_WelfareMonthCardCell {

    public index: number = 0;
    private _cost: number = 0;
    private _itemdata: Object = null;
    private _statedata: MonthCardInfo = null;
    private _chargeBtn: UIButton;
    public diamondBtn:UIButton;
    public giftBtn:UIButton;
    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        this.clearData();
        this._chargeBtn = new UIButton(this.btn_active);
        this.diamondBtn = new UIButton(this.buyIcon);
        this.giftBtn = new UIButton(this.buyDayGetIcon);
        this.onEvent();
    }

    onEvent() {
        this._chargeBtn.onClick(this, this.onMonthCardHandler);
    }

    offEvent() {
        this._chargeBtn.offClick(this, this.onMonthCardHandler);
    }

    public set itemdata(value) {
        this._itemdata = value;
        this.setItemData(value.diamond, value.bindDiamond, value.lasttime, value.cost);
    }

    public set statedata(value: MonthCardInfo) {
        this._statedata = value;
        if (value.isPay)
            if (value.leftDays == 0) {
                this.time.text = LangManager.Instance.GetTranslation("MonthCardCell.time1");
            } else {
                let str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.ConsortiaMemberItem.dayTip", value.leftDays)
                this.time.text = "[color=#111e2e]" + str + "[/color]";//剩余时间
            }
        else
            this.time.text = "[color=#490100]" + LangManager.Instance.GetTranslation("faterotary.LevelMin") + "[/color]";//剩余时间
        let state = value.isPay;
        let isReceive = value.isReceive;
        this.btn_active.enabled = !state;
        if (state) {
            if (isReceive) {
                this.btn_active.enabled = false;
                this.btn_active.title = `[b][size=28]{txt = ${LangManager.Instance.GetTranslation("dayGuide.view.FetchItem.alreadyGet")}}[/size][/b]`;
            } else {
                this.btn_active.enabled = true;
                this.btn_active.title = `[b][size=28]{txt = ${LangManager.Instance.GetTranslation("vip.view.VipGiftItem.vGet")}}[/size][/b]`;
            }
            this.txt_money.text = "";
        } else {
            this.btn_active.enabled = true;
            this.btn_active.title = "";
            if (Utils.isInteger(this._cost.toString())) {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + parseInt(this._cost.toString());//价格
            } else {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + this._cost.toString();//价格
            }
        }
        this.btn_active.visible = true;
    }

    /**
     * 单元格数据
     * @param cfgtime 剩余时间
     * @param diamond 获取钻石
     * @param bindDiamond 获得绑定钻石
     * @param lasttime 持续时间
     * @param cost 花费金额
     * @param state 是否领取激活
     */
    private setItemData(diamond: number, bindDiamond: number, lasttime: number, cost: number) {
        this._cost = cost;
        this.buyCount.text = diamond.toString();
        this.buyDayGetCount.text = bindDiamond.toString();
        this.lastTime.setVar("count", lasttime.toString()).flushVars();

        let goodsInfo1:GoodsInfo = new GoodsInfo();
        goodsInfo1.templateId = TemplateIDConstant.TEMP_ID_DIAMOND;
        this.diamondBtn.scaleParas.paraScale = 1;
        FUIHelper.setTipData(this.diamondBtn.view,EmWindow.NewPropTips, goodsInfo1);

        let goodsInfo2:GoodsInfo = new GoodsInfo();
        this.giftBtn.scaleParas.paraScale = 1;
        goodsInfo2.templateId = TemplateIDConstant.TEMP_ID_GIFT;
        FUIHelper.setTipData(this.giftBtn.view,EmWindow.NewPropTips, goodsInfo2);
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    /**点击获得超值月卡 */
    private onMonthCardHandler() {
        if (!this._statedata) return;
        if (!this._statedata.isPay) {
            Logger.warn('点击购买超值月卡!...  ' + this.index + "  金额:" + this._cost);
            let monthCfg = TempleteManager.Instance.getMonthCardRechargeTemplete((this.index + 1).toString());
            if (!monthCfg) return;
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.MONTHLY_CARD_PURCHASE, { productId: monthCfg.ProductId});
            RechargeAlertMannager.Instance.recharge(monthCfg.ProductId)
        } else {
            if (!this._statedata.isReceive) {
                this.control.sendMonthCardReward(this._statedata.cardType + 1);
            }
        }
    }

    private clearData() {
        this.buyCount.text = "";
        this.time.text = "";
        this.buyDayGetCount.text = "";
        this.lastTime.setVar("count", "").flushVars();
        this.btn_active.visible = false;
    }

}