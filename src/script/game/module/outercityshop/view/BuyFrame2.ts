import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ShopManager } from "../../../manager/ShopManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ResourceManager } from "../../../manager/ResourceManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { EmWindow } from "../../../constant/UIDefine";
import { eFilterFrameText, FilterFrameText } from "../../../component/FilterFrameText";
import { BaseItem } from "../../../component/item/BaseItem";
import { NumericStepper } from "../../../component/NumericStepper";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { OuterCityShopItemInfo } from "../data/OuterCityShopItemInfo";
import { OuterCityShopManager } from "../../../manager/OuterCityShopManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { OuterCityShopModel } from "../OuterCityShopModel";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import FUIHelper from "../../../utils/FUIHelper";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { GoodsType } from "../../../constant/GoodsType";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { t_s_suitetemplateData } from "../../../config/t_s_suitetemplate";
import { BagType } from "../../../constant/BagDefine";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import StringHelper from "../../../../core/utils/StringHelper";
import { t_s_petartifactpropertyData } from "../../../config/t_s_petartifactproperty";
import GoodsSonType from "../../../constant/GoodsSonType";

/**
 * @description 神秘商店购买
 * @author pzlricky
 * @date 2021/4/27 14:10
 * @ver 1.0
 *
 */
export class BuyFrame2 extends BaseWindow {
    public sellType: fgui.Controller;
    public showSteper: fgui.Controller;
    public txt_price2: fgui.GTextField;
    public txt_price1: fgui.GTextField;
    public frame: fgui.GComponent;
    public closeBtn: fgui.GButton;
    public item: BaseItem;
    public txt_name: fgui.GTextField;
    public txt_count: fgui.GTextField;
    public txt_limitTitle: fgui.GTextField;
    public txt_limit: fgui.GTextField;
    public txt_canTotal: fgui.GTextField;
    public txt_canTotalValue: fgui.GTextField;
    public txt_canOne: fgui.GTextField;
    public txt_canOneValue: fgui.GTextField;
    public txt_desc: fgui.GTextField;
    public stepper: NumericStepper;
    public loader_moneyType: fgui.GLoader;
    public txt_price: fgui.GTextField;
    public btn_buy: fgui.GButton;
    public btn_give: fgui.GButton;
    public btn_pageGive: fgui.GButton;
    public btn_pageBuy: fgui.GButton;
    public checkbox_useBind: fgui.GButton;
    protected _callBack: Function;
    protected _data: any;
    protected _isUseBindPoint: boolean = false;
    protected _count: number = 1;
    private _handler: Laya.Handler;
    public itemTips: fgui.GComponent;
    private _needValueCount: Array<any> = [];
    private _needValueItemId: Array<any> = [];
    private tipItem1:BaseTipItem;
    private tipItem2:BaseTipItem;
    private _templateData: t_s_petartifactpropertyData;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.sellType = this.getController("sellType");
        this.showSteper = this.getController("showSteper")
        this.initView();
        this.initEvent();

    }

    private initView() {
        ShopManager.Instance.isHandsel = 0;
        this.checkbox_useBind.title = LangManager.Instance.GetTranslation('BuyFrameI.useBindTxt'); //checkbox，UI里面不能使用默认值，否则底层的宽度计算会有问题 
    }

    private initEvent() {
        this.btn_buy.onClick(this, this.__confirmHandler.bind(this));
    }

    protected _itemInfo: OuterCityShopItemInfo;
    public OnShowWind() {
        super.OnShowWind();
        let frameData = this.params.frameData;
        if (frameData.callback) {
            this.callback = frameData.callback;
        }
        if (frameData.count) {
            this._count = frameData.count;
        }
        if (frameData.OuterCityShopItemInfo) {
            this._itemInfo = frameData.OuterCityShopItemInfo;
        }
        this.data(frameData.info, frameData.count, frameData.param);
        this.setCenter();
    }

    private __updateHandler() {
        this.OnBtnClose();
    }

    public data(value: any, count: number = 1, parm: Object = null) {
        this._data = value;
        this.refreshView();
    }

    public set callback(call: Function) {
        this._callBack = call;
    }

    protected __confirmHandler() {
        if (ShopManager.Instance.isCannotUsePoint) {
            return
        }
        
        if (this._data) {
            if (this._itemInfo) {
                if (this._itemInfo.isBuy) return;
                if (this._itemInfo.itemTemInfo.MinLevel > ArmyManager.Instance.thane.grades) {//等级不满足
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ExchangeRandomItem.txt_openDescible", this._itemInfo.itemTemInfo.MinLevel));
                    return;
                }
                if (this.checkGoods) return;//物品不满足
                let goodsInfo: GoodsInfo = new GoodsInfo();
                goodsInfo.templateId = parseInt(this._itemInfo.itemTemInfo.ItemId);
                this.buy();
            }
        }
    }

    private buy() {
        var payType: number = this.checkbox_useBind.selected ? 2 : 1;
        if (this._itemInfo.itemTemInfo.Type == OuterCityShopModel.RANDOM_SHOP) {//随机兑换
            OuterCityShopManager.instance.sendAction(2, this._itemInfo.itemTemInfo.Type, this._itemInfo.index, payType);
        } else if (this._itemInfo.itemTemInfo.Type == OuterCityShopModel.EXCHANGE_SHOP) {//积分兑换
            let buyCount = this.stepper.value;
            OuterCityShopManager.instance.sendAction(2, this._itemInfo.itemTemInfo.Type, this._itemInfo.itemTemInfo.MapShopId, payType, buyCount);
        }
        this.hide();
    }

    private get checkGoods(): boolean {
        let buyCount = this.stepper.value;
        for (var i: number = 0; i < this._needValueCount.length; i++) {
            // if (this._needValueItemId[i] == "Score") {
            if (this._needValueItemId[i] == -6000) {
                if (OuterCityShopManager.instance.model.consumePoints < this._needValueCount[i] * buyCount) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityshop.goodsItemTip", LangManager.Instance.GetTranslation("outercityshop.score")));
                    return true;
                }
                continue;
            }
            var needName: String = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._needValueItemId[i]).TemplateNameLang
            switch (this._needValueItemId[i]) {
                case -100://黄金
                    if (ResourceManager.Instance.gold.count < this._needValueCount[i] * buyCount) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityshop.goodsItemTip", needName));
                        return true;
                    }
                    break;
                case -300://战魂
                    if (ResourceManager.Instance.gold.count < this._needValueCount[i] * buyCount) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityshop.goodsItemTip", needName));
                        return true;
                    }
                    break;
                case -400://钻石
                    if (this.playerModel.playerInfo.point + this.playerModel.playerInfo.giftToken < this._needValueCount[i] * buyCount) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                        return true;
                    }
                    break;
                case -600://水晶
                    if (ResourceManager.Instance.waterCrystal.count < this._needValueCount[i] * buyCount) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityshop.goodsItemTip", needName));
                        return true;
                    }
                    break;
                case ShopGoodsInfo.MYSTERY_STONE://神秘石
                    if (GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MYSTERY_STONE) < this._needValueCount[i] * buyCount) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityshop.goodsItemTip", needName));
                        return true;
                    }
                    break;
                case ShopGoodsInfo.MEDAL_TEMPID://勋章
                    if (GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MEDAL_TEMPID) < this._needValueCount[i] * buyCount) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityshop.goodsItemTip", needName));
                        return true;
                    }
                    break;
                default:
                    break;
            }
        }
        return false;
    }

    /**
     * 最大可以买多少
     */
    getMaxBuyCount(max: number) {
        for (var i: number = 0; i < this._needValueCount.length; i++) {
            if (this._needValueItemId[i] == "Score" ||this._needValueItemId[i] == -6000) {
                let count = Math.floor((OuterCityShopManager.instance.model.consumePoints / this._needValueCount[i]))
                if (count < max) {
                    max = count;
                }
                continue;
            }
            var needName: String = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._needValueItemId[i]).TemplateNameLang
            switch (this._needValueItemId[i]) {
                case -100://黄金
                case -300://战魂
                    let count1 = Math.floor((ResourceManager.Instance.gold.count / this._needValueCount[i]))
                    if (count1 < max) {
                        max = count1;
                    }
                    break;
                case -400://钻石
                    let count2 = Math.floor(((this.playerModel.playerInfo.point + this.playerModel.playerInfo.giftToken) / this._needValueCount[i]))
                    if (count2 < max) {
                        max = count2;
                    }
                    break;
                case -600://水晶
                    let count3 = Math.floor((ResourceManager.Instance.waterCrystal.count / this._needValueCount[i]))
                    if (count3 < max) {
                        max = count3;
                    }
                    break;
                case ShopGoodsInfo.MYSTERY_STONE://神秘石
                    let count4 = Math.floor((GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MYSTERY_STONE) / this._needValueCount[i]))
                    if (count4 < max) {
                        max = count4;
                    }
                    break;
                case ShopGoodsInfo.MEDAL_TEMPID://勋章
                    let count5 = Math.floor((GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MEDAL_TEMPID) / this._needValueCount[i]))
                    if (count5 < max) {
                        max = count5;
                    }
                    break;
                default:
                    break;
            }
        }
        return max;
    }

    private refreshItemTips(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let tempStr = "";
        tempStr += this.initAttribute(info, temp);
        tempStr += this.initSuit(info, temp);
        tempStr += this.initScore(info, temp);
        if (tempStr == "") {
            tempStr = "[color=#ffc68f]" + info.templateInfo.DescriptionLang + "[/color]"
        }
        this.itemTips.getChild('content').text = tempStr;
    }

    private refreshArtifactTips(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let str: string;
        this._templateData = TempleteManager.Instance.getArtifactTemplate(info.templateId);
        if (info) {
            if (!this._templateData) return str;
            if (this._templateData.MinAtk > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle6", this._templateData.MinAtk, this._templateData.MaxAtk) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle6", this._templateData.MinAtk, this._templateData.MaxAtk) + "<br/>";
                }
            } 
            if (this._templateData.MinMat > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle7", this._templateData.MinMat, this._templateData.MaxMat) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle7", this._templateData.MinMat, this._templateData.MaxMat) + "<br/>";
                }
            } 
            if (this._templateData.MinDef > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle8", this._templateData.MinDef, this._templateData.MaxDef) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle8", this._templateData.MinDef, this._templateData.MaxDef) + "<br/>";
                }
            } 
            if (this._templateData.MinMdf > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle9", this._templateData.MinMdf, this._templateData.MaxMdf) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle9", this._templateData.MinMdf, this._templateData.MaxMdf) + "<br/>";
                }
            } 
             if (this._templateData.MinHp > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle10", this._templateData.MinHp, this._templateData.MaxHp);
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle10", this._templateData.MinHp, this._templateData.MaxHp);
                }
            }
        }
        this.itemTips.getChild('content').text = str;
    }

    private initAttribute(info: GoodsInfo, temp: t_s_itemtemplateData): string {
        let tempStr = ""
        let str: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
        tempStr += this.updateAttributeTxt(str, temp.Power, this.getAdd(temp.Power, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02");
        tempStr += this.updateAttributeTxt(str, temp.Agility, this.getAdd(temp.Agility, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
        tempStr += this.updateAttributeTxt(str, temp.Intellect, this.getAdd(temp.Intellect, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
        tempStr += this.updateAttributeTxt(str, temp.Physique, this.getAdd(temp.Physique, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05");
        tempStr += this.updateAttributeTxt(str, temp.Captain, this.getAdd(temp.Captain, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10");
        tempStr += this.updateAttributeTxt(str, temp.ForceHit, this.getAdd(temp.ForceHit, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11");
        tempStr += this.updateAttributeTxt(str, temp.Live, this.getAdd(temp.Live, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13");
        tempStr += this.updateAttributeTxt(str, temp.Attack, this.getAdd(temp.Attack, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14");
        tempStr += this.updateAttributeTxt(str, temp.Defence, this.getAdd(temp.Defence, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15");
        tempStr += this.updateAttributeTxt(str, temp.MagicAttack, this.getAdd(temp.MagicAttack, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16");
        tempStr += this.updateAttributeTxt(str, temp.MagicDefence, this.getAdd(temp.MagicDefence, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip17");
        tempStr += this.updateAttributeTxt(str, temp.Conat, this.getAdd(temp.Conat, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19");
        tempStr += this.updateAttributeTxt(str, temp.Parry, this.getAdd(temp.Parry, info));
        return tempStr
    }

    private updateAttributeTxt(property: string, value: number, addValue: number): string {
        if (value > 0) {
            let tempStr = "[color=#ffc68f]" + property + "[/color]"
            tempStr += "[color=#ffecc6]" + value + "[/color]"
            if (addValue > 0) {
                tempStr += "+" + addValue
            }
            return tempStr + "<br>"
        }
        return "";
    }

    private getAdd(preValue: number, gInfo: GoodsInfo): number {
        return Math.floor(preValue * gInfo.strengthenGrade * 0.1) + gInfo.strengthenGrade * 5;
    }

    private initSuit(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let tempStr: string = "";
        let skillStr: string = "";
        let suitTemp: t_s_suitetemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_suitetemplate, temp.SuiteId);
        if (suitTemp) {
            let heroId: number = info.objectId;
            let baseHero = ArmyManager.Instance.thane;
            let current: number = 0;
            let suitCount: number = suitTemp.suitCount;
            if (baseHero.id == heroId) {
                let list: GoodsInfo[] = [];
                if (info.bagType == BagType.HeroEquipment)
                    list = GoodsManager.Instance.getHeroEquipListById(heroId).getList();
                else if (info.bagType == BagType.Honer)
                    list = GoodsManager.Instance.getHeroHonorListById(heroId).getList();
                current = suitTemp.existCount(list);
            } else {
                current = info.suitCount;
            }

            let ownCount = current > 0 ? current : 0
            let color = ownCount > 0 ? "[color=#39a82d]" : "[color=#ffc68f]"
            let title = "[color=#ffc68f]" + suitTemp.TemplateNameLang + " (" + "[/color]" + color + ownCount + "[/color]" + "[color=#ffc68f]/" + suitCount + ")[/color]";
            if (suitCount > 1) {
                tempStr += title + "<br>";
            }
            for (let k: number = 1; k < 9; k++) {
                //每套最大8件套装单件
                let suitGood: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, suitTemp["Template" + k]);
                let info: GoodsInfo = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(heroId, suitTemp["Template" + k]);
                if (!info)
                    info = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(heroId, suitTemp["Template" + k + "S"]);
                if (suitGood) {
                    if (suitCount > 1) {
                        color = info && current > 0 ? "[color=#39a82d]" : "[color=#aaaaaa]"
                        tempStr += "<font style='fontSize:18'>" + color + suitGood.TemplateNameLang + "[/color]" + "</font>" + "<br>";
                    }
                    //property 1-8为集齐对应套装数量的技能
                    skillStr += suitTemp["Property" + k] + ",";
                }
            }
            tempStr += this.initSuitSkill(suitCount, skillStr, current);
        }
        return tempStr
    }

    //套装技能
    private initSuitSkill(suitCount: number, skillIds: string, current: number): string {
        let tempStr = ""
        let skillList: t_s_skilltemplateData[] = TempleteManager.Instance.getSkillTemplateInfoByIds(skillIds);
        for (let count: number = 0; count < skillList.length; count++) {
            let skillTemp = skillList[count];
            if (skillTemp) {
                tempStr += (suitCount <= 1 || count < current) ? "[color=#39a82d]" : "[color=#aaaaaa]"
                if (suitCount > 1)
                    tempStr += "(" + (count + 1) + ")" + skillTemp.SkillTemplateName;
                else
                    tempStr += skillTemp.SkillTemplateName;
            }
            tempStr += "[/color]<br>"
        }
        return tempStr;
    }

    private initScore(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let num = info.getEquipBaseScore();
        let additionScore = info.getEquipAdditionScore();
        let scoreStr: string
        if (additionScore > 0) {
            scoreStr = num + " (+" + additionScore + ")"
        } else {
            scoreStr = num + "";
        }

        let tempStr = "[color=#ffc68f]" + LangManager.Instance.GetTranslation("fighting.FightingEquipAndGemFrame.title.text01") + "[/color]"
        tempStr += "[color=#ffecc6]" + scoreStr + "[/color]"

        return tempStr;
    }

    protected refreshView() {
        if (!this._data) {
            this.txt_price1.text = "";
            this.txt_price2.text = "";
            this.tipItem1.visible = false;
            this.tipItem2.visible = false;
            this._needValueCount = [];
            this._needValueItemId = [];
            this.itemTips.getChild('content').text = "";
            return;
        }
        let goodsInfo: GoodsInfo = this._data as GoodsInfo;
        goodsInfo.count = parseInt(this._itemInfo.itemTemInfo.Count);
        this.item.info = goodsInfo;
        // if(this._itemInfo.itemTemInfo.Type == OuterCityShopModel.EXCHANGE_SHOP){
        //     this.checkbox_useBind.visible = false;
        // }
        // else{
        //     this.checkbox_useBind.visible = true;
        // }
        let goodsTempInfo: t_s_itemtemplateData = goodsInfo.templateInfo;
        if (goodsTempInfo && goodsTempInfo.MasterType == GoodsType.EQUIP || goodsTempInfo.MasterType == GoodsType.HONER) {
            if(goodsTempInfo.SonType == GoodsSonType.ARTIFACT){
                this.refreshArtifactTips(goodsInfo, goodsTempInfo);
                this.txt_desc.visible = false;
            }else{
                this.refreshItemTips(goodsInfo, goodsTempInfo);
                this.txt_desc.visible = false;
            }
        } else {
            this.itemTips.getChild('content').text = "";
            this.txt_desc.visible = true;
        }
        this.txt_name.text = goodsInfo.templateInfo.TemplateNameLang;
        this.txt_name.color = FilterFrameText.Colors[eFilterFrameText.ItemQuality][goodsInfo.templateInfo.Profile - 1];
        this.txt_count.text = GoodsManager.Instance.getGoodsNumByTempId(goodsInfo.templateId) + "";
        this.txt_desc.text = goodsInfo.templateInfo.DescriptionLang;

        this.updateCostPrice();

        this._handler && this._handler.recover();
        this._handler = Laya.Handler.create(this, this.stepperChangeHandler, null, false);
        if (this._itemInfo.itemTemInfo.Type == OuterCityShopModel.RANDOM_SHOP) {//随机兑换 没有限购
            this.txt_limitTitle.text = '';
            this.txt_limit.text = '';
            this.stepper.show(0, 1, 1, 999, 999, 1, this._handler);
            this.showSteper.selectedIndex = 0;
        } else {
            if (this._itemInfo.itemTemInfo.WeeklyLimit == '-1' || this._itemInfo.itemTemInfo.WeeklyLimit == '0') {
                // 不限购
                this.txt_limitTitle.text = '';
                this.txt_limit.text = '';
                this.stepper.show(0, 1, 1, 999, 999, 1, this._handler);
                this.showSteper.selectedIndex = 0;
            } else {
                let limit = Number(this._itemInfo.itemTemInfo.WeeklyLimit);
                let buyCount = OuterCityShopManager.instance.model.getWeekLimitBuyCount(this._itemInfo.itemTemInfo.ItemId);
                this.txt_limitTitle.text = LangManager.Instance.GetTranslation("Shop.Promotion.weeklimit");
                this.txt_limit.text = `${limit - buyCount}/${limit}`;
                let leftNum = limit - buyCount;
                leftNum = this.getMaxBuyCount(leftNum);
                this.playerScore
                this.stepper.show(0, 1, 1, leftNum, leftNum, 1, this._handler);
                this.showSteper.selectedIndex = 1;
            }
        }

        
    }

    /**更新消耗价格 */
    private updateCostPrice(value: number = 1) {
        var flag: boolean = false;//是否是随机兑换
        let price: number = 0;
        this._needValueCount = [];
        this._needValueItemId = [];
        for (let i: number = 0; i < this._itemInfo.costInfos.length; i++) {
            var costInfo: Array<any> = this._itemInfo.costInfos[i];
            if (costInfo[0] == "Score") {//积分兑换
                this._needValueCount.push(costInfo[1]);
                this._needValueItemId.push(TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE);
                this.sellType.selectedIndex = 1;
                price = Number(costInfo[1]);
                this.txt_price1.text = String(price * value);
                this.txt_price1.color = this.getColor(this.playerScore, Number(price * value));
                this.tipItem1.visible = true;
                this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE);
            } else {//随机兑换
                var needGoodsTempInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(costInfo[0]);
                var needGoodsInfo: GoodsInfo;
                if (!needGoodsTempInfo) {
                    continue;
                }
                flag = true;
                needGoodsInfo = new GoodsInfo();
                needGoodsInfo.templateId = needGoodsTempInfo.TemplateId;
                price = Number(costInfo[1]);
                if (needGoodsTempInfo.TemplateId == -400) {
                    this._needValueCount.unshift(price);
                    this._needValueItemId.unshift(needGoodsTempInfo.TemplateId);
                } else {
                    this._needValueCount.push(price);
                    this._needValueItemId.push(needGoodsTempInfo.TemplateId);
                }
            }
        }
        if (flag) {
            price = this._needValueCount[0];
            if (this._needValueCount.length == 2) {//需要消耗2个
                this.sellType.selectedIndex = 0;
                this.txt_price2.text = (value * price).toString();
                this.txt_price2.color = this.getColorByType(this._needValueItemId[0], value * price);
                this.txt_price1.text = (value * this._needValueCount[1]).toString();
                this.txt_price1.color = this.getColorByType(this._needValueItemId[1], this._needValueCount[1]);
                this.tipItem1.visible = true;
                this.tipItem1.visible = true;
                this.tipItem1.setInfo(this._needValueItemId[1]);
                this.tipItem2.setInfo(this._needValueItemId[0]);
            } else {
                this.sellType.selectedIndex = 1;
                this.txt_price1.text = (value * price).toString();
                this.txt_price1.color = this.getColorByType(this._needValueItemId[0], value * price);
                this.tipItem1.setInfo(this._needValueItemId[0]);
            }
        }

        let useDiam = false;
        for (let i = 0; i < this._needValueItemId.length; i++) {
            if (this._needValueItemId[i] == -400) {
                useDiam = true;
                break;
            }
        }
        this.checkbox_useBind.visible = useDiam;
    }

    private stepperChangeHandler(value: number) {
        this.updateCostPrice(value);
    }

    /**玩家积分 */
    private get playerScore(): number {
        return this.outerCityShopModel.consumePoints;
    }

    private get outerCityShopModel(): OuterCityShopModel {
        return OuterCityShopManager.instance.model;
    }

    private removeEvent() {
        this.btn_buy.offClick(this, this.__confirmHandler.bind(this));
        NotificationManager.Instance.removeEventListener(NotificationEvent.SHOPHOMEPAGE_UPDATA, this.__updateHandler, this);
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    /**
     * 
     * @param value1 总量
     * @param value2 需要量
     * @returns 
     */
    private getColor(value1: number, value2: number): string {
        if (value1 >= value2) {
            return "#FFECC6";
        } else {
            return "#FF2E2E";
        }
    }
    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    private get totalDiamondCount(): number {
        return this.playerModel.playerInfo.point + this.playerModel.playerInfo.giftToken;
    }

    getColorByType(type: number, count: number) {
        let str: string = "";//资源图标路径
        if (type == -100) {//黃金
            str = this.getColor(ResourceManager.Instance.gold.count, count);
        } else if (type == -300) {//战魂
            str = this.getColor(ResourceManager.Instance.gold.count, count);
        } else if (type == -400) {//钻石
            str = this.getColor(this.totalDiamondCount, count);
        } else if (type == -600) {//水晶
            str = this.getColor(ResourceManager.Instance.waterCrystal.count, count);
        } else if (type == ShopGoodsInfo.MYSTERY_STONE) {//神秘石
            str = this.getColor(GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MYSTERY_STONE), count);
        } else if (type == ShopGoodsInfo.MEDAL_TEMPID) {//勋章
            str = this.getColor(GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MEDAL_TEMPID), count);
        } else {//积分
            str = this.getColor(this.playerScore, count);
        }
        return str;
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
        this._data = null;
        this._callBack = null;
    }
}