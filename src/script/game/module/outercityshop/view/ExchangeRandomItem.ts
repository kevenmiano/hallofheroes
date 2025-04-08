import FUI_OuterCityShopItem from "../../../../../fui/Base/FUI_OuterCityShopItem";
import LangManager from '../../../../core/lang/LangManager';
import UIButton from "../../../../core/ui/UIButton";
import { UIFilter } from '../../../../core/ui/UIFilter';
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import GoodsSonType from "../../../constant/GoodsSonType";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from '../../../manager/ArmyManager';
import { OuterCityShopManager } from "../../../manager/OuterCityShopManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FUIHelper from "../../../utils/FUIHelper";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { OuterCityShopItemInfo } from "../data/OuterCityShopItemInfo";
import { OuterCityShopModel } from "../OuterCityShopModel";

export default class ExchangeRandomItem extends FUI_OuterCityShopItem {
    private _goodsTempInfo: t_s_itemtemplateData;
    private _goodsInfo: GoodsInfo;
    private _needValueCount: Array<any> = [];
    private _needValueItemId: Array<any> = [];
    private _btn1: UIButton;
    private _btn2: UIButton;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        (this.item as BaseItem).hideBgHasInfo = true;
        this.txt_best.text = LangManager.Instance.GetTranslation("ExchangeRandomItem.txt_best");
        this._btn1 = new UIButton(this.btn1);
        this._btn2 = new UIButton(this.btn2);
        this._btn1.scaleParas.paraScale = this._btn2.scaleParas.paraScale = 1;
    }

    private _itemInfo: OuterCityShopItemInfo;

    public set info(value: OuterCityShopItemInfo) {
        this._itemInfo = value;
        this.clear();
        if (this._itemInfo) {
            this.refreshView();
        }
    }

    private clear() {
        (this.item as BaseItem).info = null;
        this.txt_name.text = "";
        this.txt_price1.text = "";
        this.txt_price2.text = "";
        this._btn1.icon = "";
        this._btn2.icon = "";
        this.isBest.selectedIndex = 0;
        this.hasBuy.selectedIndex = 0;
        this.isOwn.selectedIndex = 0;
        this.txt_openDescible.text = "";
        this._needValueCount = [];
        this._needValueItemId = [];
    }

    public get info(): OuterCityShopItemInfo {
        return this._itemInfo;
    }

    public get itemInfo(): t_s_itemtemplateData {
        return this._goodsTempInfo;
    }

    refreshView() {
        this._goodsTempInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(parseInt(this._itemInfo.itemTemInfo.ItemId));
        if (!this._goodsTempInfo) {
            return;
        }
        this._goodsInfo = new GoodsInfo();
        this._goodsInfo.templateId = this._goodsTempInfo.TemplateId;
        this._goodsInfo.count = parseInt(this._itemInfo.itemTemInfo.Count);
        (this.item as BaseItem).info = this._goodsInfo;
        this.txt_name.text = this._goodsTempInfo.TemplateNameLang;
        var flag: boolean = false;//是否是随机兑换
        if (this._itemInfo.itemTemInfo.IsDrop == 1) {//是精品物品
            this.isBest.selectedIndex = 1;
        }
        let grades = ArmyManager.Instance.thane.grades;

        // 玩家等级低于物品显示最小等级时该物品也会显示，但置灰，仅显示物品图标、名称及解锁条件，点击显示物品tips弹窗
        if (this._itemInfo.isBuy || grades < this._itemInfo.itemTemInfo.MinLevel) {//已经购买
            this.hasBuy.selectedIndex = this._itemInfo.isBuy ? 1 : 0;
            UIFilter.gray(this.displayObject);
        }
        else {
            UIFilter.normal(this.displayObject);
            // 没有购买过的符文石
            if (this._goodsTempInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL && this._goodsTempInfo.Property1 > 0) {
                let state = OuterCityShopManager.instance.model.getRuneState(this._goodsTempInfo);
                this.isOwn.selectedIndex = state > 0 ? 1 : 0;
                let strKey = state == 1 ? 'yishi.view.tips.goods.ComposeTip.vStudy' : 'ExchangeRandomItem.isOwn';
                this.txt_own.text = LangManager.Instance.GetTranslation(strKey);
            }
        }

        if (this._itemInfo.itemTemInfo.Type == OuterCityShopModel.RANDOM_SHOP) {//随机兑换 没有限购
            this.txt_limit.text = '';
        } else {
            if (this._itemInfo.itemTemInfo.WeeklyLimit == '-1' || this._itemInfo.itemTemInfo.WeeklyLimit == '0') {
                // 不限购
                this.txt_limit.text = '';
            } else {
                let limit = Number(this._itemInfo.itemTemInfo.WeeklyLimit);
                let buyCount = OuterCityShopManager.instance.model.getWeekLimitBuyCount(this._itemInfo.itemTemInfo.ItemId);
                this.txt_limit.text = LangManager.Instance.GetTranslation("Shop.Promotion.weeklimit") + `${limit - buyCount}/${limit}`;
            }
        }

        if (this._itemInfo.itemTemInfo.MinLevel > ArmyManager.Instance.thane.grades) {//等级不满足
            this.txt_openDescible.text = LangManager.Instance.GetTranslation("ExchangeRandomItem.txt_openDescible", this._itemInfo.itemTemInfo.MinLevel);
            this.txt_limit.text = '';
        }


        for (let i: number = 0; i < this._itemInfo.costInfos.length; i++) {
            var costInfo: Array<any> = this._itemInfo.costInfos[i];
            if (costInfo[0] == "Score") {//积分兑换
                this._needValueCount.push(costInfo[1]);
                this._needValueItemId.push(TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE);
                // this.txt_price2.text = costInfo[1];
                // this.moneyType2.url = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Points");
                // 只有单个货币时靠左显示
                this.txt_price1.text = costInfo[1];
                let goodsInfo1: GoodsInfo = new GoodsInfo();
                goodsInfo1.templateId = TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE;
                FUIHelper.setTipData(this._btn1.view, EmWindow.NewPropTips, goodsInfo1);
                this._btn1.icon = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Points");
            } else {//随机兑换
                var needGoodsTempInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(costInfo[0]);
                var needGoodsInfo: GoodsInfo;
                if (!needGoodsTempInfo) {
                    continue;
                }
                flag = true;
                needGoodsInfo = new GoodsInfo();
                needGoodsInfo.templateId = needGoodsTempInfo.TemplateId;
                if (needGoodsTempInfo.TemplateId == -400) {
                    this._needValueCount.unshift(costInfo[1]);
                    this._needValueItemId.unshift(needGoodsTempInfo.TemplateId);
                }
                else {
                    this._needValueCount.push(costInfo[1]);
                    this._needValueItemId.push(needGoodsTempInfo.TemplateId);
                }
            }
        }
        if (flag) {
            if (this._needValueCount.length == 2) {//需要消耗2个
                this.txt_price1.text = this._needValueCount[0].toString();
                this.txt_price2.text = this._needValueCount[1].toString();
                this.setBtnTips(this._btn1, this._needValueItemId[0]);
                this.setBtnTips(this._btn2, this._needValueItemId[1]);
            }
            else {
                // 只有单个货币时靠左显示
                this.txt_price1.text = this._needValueCount[0].toString();
                this.setBtnTips(this._btn1, this._needValueItemId[0]);
            }
        }
    }

    private setBtnTips(btn: UIButton, template: number) {
        let goodsInfo1: GoodsInfo = new GoodsInfo();
        goodsInfo1.templateId = template;
        FUIHelper.setTipData(btn.view, EmWindow.NewPropTips, goodsInfo1);
        btn.icon = OuterCityShopManager.instance.model.getUrlByType(template);
    }

    getUrlByType(type: number) {
        let str: string = "";//资源图标路径
        if (type == -100) {//黃金
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Coin_S");
        }
        else if (type == -300) {//战魂
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Daru");
        }
        else if (type == -400) {//钻石
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Diam_S");
        }
        else if (type == -600) {//水晶
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Kyanite");
        }
        else if (type == ShopGoodsInfo.MYSTERY_STONE) {//神秘石
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_MysteryStone");
        }
        else if (type == ShopGoodsInfo.MEDAL_TEMPID) {//勋章
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Insignia");
        }
        return str;
    }

    dispose() {
        this._itemInfo = null;
        super.dispose();
    }
}