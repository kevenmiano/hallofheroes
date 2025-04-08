import FUI_GrowthFundView from "../../../../../fui/Welfare/FUI_GrowthFundView";
import LangManager from '../../../../core/lang/LangManager';
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import WelfareCtrl from "../WelfareCtrl";
import WelfareData from "../WelfareData";
import { GrowthFundItem } from "./component/GrowthFundItem";
import ProductType from '../../../constant/ProductType';
import { t_s_rechargeData } from "../../../config/t_s_recharge";
import RechargeAlertMannager from '../../../manager/RechargeAlertMannager';
import Utils from "../../../../core/utils/Utils";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FUIHelper from "../../../utils/FUIHelper";
import UIButton from "../../../../core/ui/UIButton";
import { ShopManager } from "../../../manager/ShopManager";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/23 16:02
 * @ver 1.0  成长基金
 *
 */
export class GrowthFundView extends FUI_GrowthFundView {
    private fund_multiple: number;//成长基金返利倍数
    private fund_money: number;//购买成长基金消耗金额（元）
    private _grouthFunData: t_s_rechargeData = null;
    private _giftBtn: UIButton;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.list.setVirtual();
        let langCfg = getdefaultLangageCfg();
        if (langCfg) {
            this.language.selectedIndex = langCfg.index - 1;
        }

        this._giftBtn = new UIButton(this.giftBtn);
        let rechargeData = TempleteManager.Instance.getRechargeTempletes(ProductType.GROWTH_RECHARGE)[0];
        this.descTxt.text = LangManager.Instance.GetTranslation("GrowthFundView.descTxt");
        this._grouthFunData = rechargeData;
        this.fund_multiple = Number(rechargeData.Para4);
        this.fund_money = Number(rechargeData.MoneyNum);
        this.countTxt.text = this.fund_multiple.toString();
        let goodsInfo2: GoodsInfo = new GoodsInfo();
        goodsInfo2.templateId = TemplateIDConstant.TEMP_ID_GIFT;
        this._giftBtn.scaleParas.paraScale = 1;
        FUIHelper.setTipData(this._giftBtn.view, EmWindow.NewPropTips, goodsInfo2);
        this.initEvent();
        this.refreshView();
    }

    initEvent() {
        this.btn_active.onClick(this, this.activeBtnHandler);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        NotificationManager.Instance.addEventListener(NotificationEvent.GROWTH_FUND_UPDATE, this.refreshView, this);
    }

    removeEvent() {
        this.btn_active.offClick(this, this.activeBtnHandler);
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        NotificationManager.Instance.removeEventListener(NotificationEvent.GROWTH_FUND_UPDATE, this.refreshView, this);
    }

    private renderListItem(index: number, item: GrowthFundItem) {
        item.vInfo = this.model.growthFundInfoArr[index];
    }

    activeBtnHandler() {
        if (!this.playerInfo.hasBuyGrowthFund && this._grouthFunData) {//没有购买过成长基金
            let grouthFundProductId = this._grouthFunData.ProductId;
            RechargeAlertMannager.Instance.recharge(grouthFundProductId);
        }
    }

    refreshView() {
        if (!this.playerInfo.hasBuyGrowthFund) {//没有购买过成长基金
            if (Utils.isInteger(this.fund_money.toString())) {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + parseInt(this.fund_money.toString());//价格
            } else {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + this.fund_money.toString();//价格
            }
            this.c1.selectedIndex = 1;
            this.btn_active.title = "";
            this.btn_active.enabled = true;
        }
        else {
            this.txt_money.text = "";
            this.c1.selectedIndex = 0;
            this.btn_active.title = LangManager.Instance.GetTranslation("growthFundview.btn_active.title2");
            this.btn_active.enabled = false;
        }
        let disableColor = "#aaaaaa";
        let enableColor = "#FFF6B9";
        this.btn_active.titleColor = this.btn_active.enabled?enableColor:disableColor;
        this.txt_num.text = this.model.hasGetBindCount + "/" + this.model.totalBindCount;
        this.list.numItems = this.model.growthFundInfoArr.length;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public get model(): WelfareData {
        return this.control.data;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}