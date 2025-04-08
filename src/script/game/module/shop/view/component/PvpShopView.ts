// @ts-nocheck
import FUI_PvpShopView from "../../../../../../fui/Shop/FUI_PvpShopView";
import { BaseItem } from "../../../../component/item/BaseItem";
import { ShopGoodsInfo } from "../../model/ShopGoodsInfo";
import { NumericStepper } from "../../../../component/NumericStepper";
import { ShopManager } from "../../../../manager/ShopManager";
import LangManager from "../../../../../core/lang/LangManager";
import { ShopControler } from "../../control/ShopControler";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { BagEvent, NotificationEvent, ShopEvent } from "../../../../constant/event/NotificationEvent";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import { TempleteManager } from "../../../../manager/TempleteManager";
import UIManager from "../../../../../core/ui/UIManager";
import { ShopItem } from "./ShopItem";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { GoodsCheck } from "../../../../utils/GoodsCheck";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GoodsType } from "../../../../constant/GoodsType";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { t_s_suitetemplateData } from "../../../../config/t_s_suitetemplate";
import { BagType } from "../../../../constant/BagDefine";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import Utils from "../../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/6/12 11:03
 * @ver 1.0
 */
export class PvpShopView extends FUI_PvpShopView {
    declare public icon1: BaseItem;
    private _selectedItemData: ShopGoodsInfo;
    declare public stepper: NumericStepper;
    declare public tipItem2: BaseTipItem;

    private _handler: Laya.Handler;
    private mazeCoinCount: number = 0;
    private MaxCanBuyCount: number = 0;//最大可购买数量

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public init() {
        this.resetUI();
        this.initData();
        this.initEvent();
        this.initView();
    }

    private resetUI() {

    }

    private initData() {
        this.shopCtrl.initPVPShopFrame();
    }

    private initView() {
        // this.ItemList.scrollPane.mouseWheelEnabled = false;
        this.BuyNumDescTxt.text = LangManager.Instance.GetTranslation("MazeShopWnd.BuyNumDescTxt");
        this.__updateCoin();
        this.DescribleTxt.text = "";
        this.CostMoneyTxt.text = "";
        this.SelectedGoodsTxt.text = "";
        this.specialGroup.visible = false;
        this.itemTips.getChild('content').text = "";
        this.__refreshGoods();
        this.__refreshPage();
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_XUNZHANG);
    }

    private initEvent() {
        this.removeEvent();
        this.ItemList.setVirtual();
        this.ItemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.ItemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.shopModel.addEventListener(ShopEvent.GOODS_LIST_UPDATE, this.__refreshGoods, this);
        this.shopModel.addEventListener(ShopEvent.PAGE_UPDATE, this.__refreshPage, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__updateCoin, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__updateCoin, this);
        this.Btn_Buy.onClick(this, this._buyHander);
        if (ShopManager.Instance.model) {
            ShopManager.Instance.model.addEventListener(ShopEvent.GOODS_INFO_UPDATE, this.refreshLimit, this);
        }
        NotificationManager.Instance.addEventListener(NotificationEvent.SHOP_TIME_BUY_REFRESH, this.refreshLimit, this);
    }

    private __updateCoin() {
        this.mazeCoinCount = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MEDAL_TEMPID);
        // this.ComMoneyText.text = this.mazeCoinCount.toString();
        this._refreshRight();
    }

    private onClickItem(item: ShopItem) {
        this._selectedItemData = item.info;
        this._refreshRight()
    }

    private renderListItem(index: number, item: ShopItem) {
        item.info = this.shopModel.currentGoodsList[index] ? this.shopModel.currentGoodsList[index] : null;
    }

    private __refreshGoods() {
        // this.ItemList.setVirtual();
        this.ItemList.numItems = this.shopModel.currentGoodsList.length;
        if (this.ItemList.numItems > 0) {
            this.ItemList.selectedIndex = 0;//竞技商店默认选择第1个商品
            let item: ShopItem = this.ItemList.getChildAt(0) as ShopItem;
            this._selectedItemData = item.info;
            this._refreshRight()
        }
    }

    private __refreshPage() {
        // this.PageNumTxt.text = this.shopModel.currentPage + "/" + this.shopModel.totalPage;
    }

    helpBtnClick() {
        let title = LangManager.Instance.GetTranslation("public.help");
        let value = Number(TempleteManager.Instance.getConfigInfoByConfigName("DayAddGeste").ConfigValue);
        let content = LangManager.Instance.GetTranslation('bag.events.BagEvent.helpContent', value);
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    /**购买物品 */
    private _buyHander() {
        if (this._selectedItemData) {
            var itemid: number = this._selectedItemData.ItemId;
            if (GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MEDAL_TEMPID) < (this.stepper.value * this._selectedItemData.price)) {//钱不够
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.MedalLack"));
                return;
            }
            this.showBuyalert();
        }
    }

    private showBuyalert() {
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
        let totalCost: number = this.stepper.value * this._selectedItemData.price;
        var content: string = LangManager.Instance.GetTranslation("pvpshop.buy.alert", totalCost, this.stepper.value, this.SelectedGoodsTxt.text);
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.result.bind(this));
    }

    private result(b: boolean, flag: boolean) {
        if (b) {
            this.buy(false);
        }
    }

    private buy(useBind: boolean = true) {
        let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
        if (this.isFashionGoods(temp)) {
            ShopManager.Instance.sendShoping(this._selectedItemData.Id, this.stepper.value, this.playerInfo.userId, false, C2SProtocol.C_FASHION_SHOP_BUY, useBind);
        }
        else {
            ShopManager.Instance.sendShoping(this._selectedItemData.Id, this.stepper.value, this.playerInfo.userId, false, C2SProtocol.U_C_SHOP_BUY, useBind);
        }
    }

    private refreshResource() {
        this.CostMoneyTxt.text = (this.stepper.value * this._selectedItemData.price).toString();
    }

    protected get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private isFashionGoods(temp: t_s_itemtemplateData): boolean {
        if (temp.SonType == GoodsSonType.FASHION_CLOTHES ||
            temp.SonType == GoodsSonType.FASHION_HEADDRESS ||
            temp.SonType == GoodsSonType.FASHION_WEAPON ||
            temp.SonType == GoodsSonType.SONTYPE_WING) {
            return true;
        }
        return false;
    }

    private _refreshRight() {
        if (this._selectedItemData) {
            this.SelectedGoodsTxt.text = this.getName();
            this.HasNumValueTxt.text = GoodsManager.Instance.getGoodsNumByTempId(this._selectedItemData.ItemId) + "";
            this.MaxCanBuyCount = Math.floor(this.mazeCoinCount / this._selectedItemData.price);
            if (this.MaxCanBuyCount <= 0) {
                this.MaxCanBuyCount = 0;
            }
            this._handler && this._handler.recover();
            this._handler = Laya.Handler.create(this, this.refreshResource, null, false);
            let limitCount = 999;
            var weekLimitCount: number = this._selectedItemData.WeeklyLimit;//周限购
            var dayLimitCount: number = this._selectedItemData.OneDayCount;//日限购
            if (weekLimitCount > 0) {//有周限购优先显示周限购
                var weekHasBuyCount = this._selectedItemData.weekCount;
                limitCount = weekLimitCount - weekHasBuyCount;
            }
            else if (dayLimitCount > 0) {//有日限购
                var dayHasBuyCount = this._selectedItemData.OneCurrentCount;
                limitCount = dayLimitCount - dayHasBuyCount;
            }
            this.MaxCanBuyCount = Math.min(this.MaxCanBuyCount, limitCount, 999);
            this.stepper.show(0, 1, 1, this.MaxCanBuyCount > 0 ? this.MaxCanBuyCount : 1, this.MaxCanBuyCount, 1, this._handler);
            this.refreshResource();
            this.updateLimit();
            let status: boolean = this._selectedItemData.NeedGeste > ArmyManager.Instance.thane.honer
            this.Btn_Buy.enabled = !status && this.MaxCanBuyCount > 0;
        }
    }

    private refreshLimit() {
        this.MaxCanBuyCount = Math.floor(this.mazeCoinCount / this._selectedItemData.price);
        if (this.MaxCanBuyCount <= 0) {
            this.MaxCanBuyCount = 0;
        }
        let limitCount = 999;
        var weekLimitCount: number = this._selectedItemData.WeeklyLimit;//周限购
        var dayLimitCount: number = this._selectedItemData.OneDayCount;//日限购
        if (weekLimitCount > 0) {//有周限购优先显示周限购
            var weekHasBuyCount = this._selectedItemData.weekCount;
            limitCount = weekLimitCount - weekHasBuyCount;
        }
        else if (dayLimitCount > 0) {//有日限购
            var dayHasBuyCount = this._selectedItemData.OneCurrentCount;
            limitCount = dayLimitCount - dayHasBuyCount;
        }
        this.MaxCanBuyCount = Math.min(this.MaxCanBuyCount, limitCount, 999);
        this.updateLimit();
        this.stepper.updateLimit(this.MaxCanBuyCount, this.MaxCanBuyCount);
    }

    private updateLimit() {
        let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
        if (GoodsCheck.isEquip(temp)) {//如果为装备
            this.limitCtr.selectedIndex = 0;
            this.limitCounTxt.text = "";
        }
        else {
            var weekLimitCount: number = this._selectedItemData.WeeklyLimit;//周限购
            var dayLimitCount: number = this._selectedItemData.OneDayCount;//日限购
            let leftCount = 0;
            if (weekLimitCount > 0) {//有周限购优先显示周限购
                var weekHasBuyCount = this._selectedItemData.weekCount;
                this.limitDescTxt.text = LangManager.Instance.GetTranslation("Shop.Promotion.weeklimit");
                leftCount = (weekLimitCount - weekHasBuyCount)
                this.limitCounTxt.text = (leftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + leftCount + "[/color]" + "/" + weekLimitCount;
                this.limitCtr.selectedIndex = 1;
            }
            else {
                if (dayLimitCount > 0) {//有日限购
                    var dayHasBuyCount = this._selectedItemData.OneCurrentCount;
                    this.limitDescTxt.text = LangManager.Instance.GetTranslation("Shop.Promotion.daylimit");
                    leftCount = (dayLimitCount - dayHasBuyCount);
                    this.limitCounTxt.text = (leftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + leftCount + "[/color]" + "/" + dayLimitCount;
                    this.limitCtr.selectedIndex = 1;
                }
                else {
                    this.limitCtr.selectedIndex = 0;
                    this.limitCounTxt.text = ""
                }
            }
        }
    }

    private getName(): string {
        var goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = this._selectedItemData.ItemId;
        goodsInfo.validDate = this._selectedItemData.ValidDate;
        this.icon1.info = goodsInfo;
        let goodsTempInfo: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
        if (!goodsTempInfo) {
            this._selectedItemData = null;
            var noFindGoods: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaShopGoodsItem.noFindGoods");
            return noFindGoods;
        }
        this.DescribleTxt.text = ""
        if (goodsTempInfo.MasterType == GoodsType.EQUIP || goodsTempInfo.MasterType == GoodsType.HONER) {
            this.specialGroup.visible = true;
            this.txtIntensifyLevel.text = goodsTempInfo.StrengthenMax == 0 ? "" : LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.intensify", goodsTempInfo.StrengthenMax);
            this.txtJob.text = goodsTempInfo.jobName + " " + goodsTempInfo.sonTypeName;
            this.txtLevel.text = LangManager.Instance.GetTranslation("public.level4_space2", goodsTempInfo.NeedGrades);
            this.refreshItemTips(goodsInfo, goodsTempInfo);
            this.DescribleTxt.text = "";
        }
        else {
            this.specialGroup.visible = false;
            this.DescribleTxt.text = goodsTempInfo.DescriptionLang;
        }
        return goodsTempInfo.TemplateNameLang;
    }

    private refreshItemTips(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let tempStr = "";
        tempStr += this.initAttribute(info, temp);
        tempStr += this.initSuit(info, temp);
        tempStr += this.initScore(info, temp);
        if (info.validDate > 0) {
            tempStr += '<br>' + LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.time.text") + ":" + DateFormatter.getFullDateString(info.validDate * 60);
        }
        if (tempStr == "") {
            tempStr = "[color=#ffc68f]" + info.templateInfo.DescriptionLang + "[/color]"
        }

        this.itemTips.getChild('content').text = tempStr;
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
                if (info.bagType == BagType.HeroEquipment) {
                    list = GoodsManager.Instance.getHeroEquipListById(heroId).getList();
                }
                else if (info.bagType == BagType.Honer) {
                    list = GoodsManager.Instance.getHeroHonorListById(heroId).getList();
                }
                current = suitTemp.existCount(list);
            }
            else {
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
                if (!info) {
                    info = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(heroId, suitTemp["Template" + k + "S"]);
                }
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
                if (suitCount > 1) {
                    tempStr += "(" + (count + 1) + ")" + skillTemp.SkillTemplateName;
                }
                else {
                    tempStr += skillTemp.SkillTemplateName;
                }
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
        }
        else {
            scoreStr = num + "";
        }

        let tempStr = "[color=#ffc68f]" + LangManager.Instance.GetTranslation("fighting.FightingEquipAndGemFrame.title.text01") + "[/color]"
        tempStr += "[color=#ffecc6]" + scoreStr + "[/color]"

        return tempStr;
    }

    private get shopModel() {
        return ShopManager.Instance.model
    }

    private get shopCtrl(): ShopControler {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.ShopWnd) as ShopControler;
    }

    private removeEvent() {
        this.ItemList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        // this.ItemList.itemRenderer && this.ItemList.itemRenderer.recover();
        Utils.clearGListHandle(this.ItemList);
        this.shopModel.removeEventListener(ShopEvent.GOODS_LIST_UPDATE, this.__refreshGoods, this);
        this.shopModel.removeEventListener(ShopEvent.PAGE_UPDATE, this.__refreshPage, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__updateCoin, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__updateCoin, this);
        this.Btn_Buy.offClick(this, this._buyHander);
        if (ShopManager.Instance.model) {
            ShopManager.Instance.model.removeEventListener(ShopEvent.GOODS_INFO_UPDATE, this.refreshLimit, this);
        }
        NotificationManager.Instance.removeEventListener(NotificationEvent.SHOP_TIME_BUY_REFRESH, this.refreshLimit, this);
    }

    dispose(destroy = true) {
        this.removeEvent();
        destroy && super.dispose();
    }
}