// @ts-nocheck
import FUI_ShopCommonView from "../../../../../../fui/Shop/FUI_ShopCommonView";
import { BaseItem } from "../../../../component/item/BaseItem";
import { ShopModel } from "../../model/ShopModel";
import { NumericStepper } from "../../../../component/NumericStepper";
import { MovieClip } from "../../../../component/MovieClip";
import { ShopManager } from "../../../../manager/ShopManager";
import LangManager from "../../../../../core/lang/LangManager";
import { ShopGoodsInfo } from "../../model/ShopGoodsInfo";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaControler } from "../../../consortia/control/ConsortiaControler";
import WarlordsManager from "../../../../manager/WarlordsManager";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ShopControler } from "../../control/ShopControler";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { GoodsManager } from "../../../../manager/GoodsManager";
import MazeModel from "../../../maze/MazeModel";
import { t_s_startemplateData } from "../../../../config/t_s_startemplate";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { StarManager } from "../../../../manager/StarManager";
import { StarHelper } from "../../../../utils/StarHelper";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { OuterCityShopManager } from "../../../../manager/OuterCityShopManager";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../../constant/ConfigDefine";
import GoodsSonType from "../../../../constant/GoodsSonType";
import StringHelper from "../../../../../core/utils/StringHelper";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import { ShopItem } from "./ShopItem";
import { eFilterFrameText, FilterFrameText } from "../../../../component/FilterFrameText";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GoodsType } from "../../../../constant/GoodsType";
import StarInfo from "../../../mail/StarInfo";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import ResMgr from "../../../../../core/res/ResMgr";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { WildSoulInfo } from "../../../mount/model/WildSoulInfo";
import { MountsManager } from "../../../../manager/MountsManager";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { BagEvent, NotificationEvent, ShopEvent } from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { ShopWnd } from "../ShopWnd";
import { AccountCom } from "../../../common/AccountCom";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/6/9 16:44
 * @ver 1.0
 */
export class ShopCommonView extends FUI_ShopCommonView {
    declare public icon1: BaseItem;//选中的物品
    declare public tipItem2: BaseTipItem;

    private _model: ShopModel;
    private _selectedItemData: any;
    private propsCount: number = 0;
    private MaxCanBuyCount: number = 0;//最大可购买数量
    private _shopType: number = 0;//商城类型
    declare public stepper: NumericStepper;
    private _handler: Laya.Handler;
    private _movie: MovieClip = new MovieClip();
    declare public typeCtr: fgui.Controller;
    declare public tab: fgui.Controller;
    public _tabIndex: number = 0;

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.tab.selectedIndex = -1;
    }

    public init(shopType: number) {
        this._shopType = shopType;
        this.initData();
        this.initEvent();
        this.initView();
    }

    private initData() {
        this._model = ShopManager.Instance.model;
    }

    private initView() {
        this.BuyNumDescTxt.text = LangManager.Instance.GetTranslation("MazeShopWnd.BuyNumDescTxt");
        this.DescribleTxt.text = "";
        this.CostMoneyTxt.text = "";
        this.SelectedGoodsTxt.text = "";
        this.icon1.visible = false;

        if (this._shopType == ShopModel.STAR_SHOP) {
        }
        else if (this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
            let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
            let lv: number = contorller.model.consortiaInfo.shopLevel;
            this.tab.selectedIndex = 0;
            if (lv < 6) {
                this.typeCtr.selectedIndex = 0;
            }
            else {
                this.typeCtr.selectedIndex = 1;
            }
        }
        else if (this._shopType == ShopGoodsInfo.WARLORDS_SHOP) {
            let str: string = WarlordsManager.Instance.model.getMatchDateString(5, LangManager.Instance.GetTranslation("public.dateType", "YYYY", "MM", "DD"));
            this.noteTxt.text = LangManager.Instance.GetTranslation("shopCommWnd.noteTxt", str)
        }

        this.__updatePropsCount();

        this.tipItem2.visible = true;
        this.costPointTxt2.visible = false;
        if (this._shopType == ShopModel.STAR_SHOP) {
            this.shopCtrl.initStarShopFrame();
            this.costPointTxt2.visible = true;
            this.tipItem2.visible = false;
        }
        else if (this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
            this.shopCtrl.initConsortiaShopFrame();
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
        }
        else if (this._shopType == ShopGoodsInfo.WARLORDS_SHOP) {
            this.shopCtrl.initWarlordsShopFrame();
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_RYSJ);
        }
    }

    private initEvent() {
        this.ItemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.ItemList.setVirtual();
        this.ItemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this._model.addEventListener(ShopEvent.GOODS_LIST_UPDATE, this.__refreshGoods, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__updatePropsCount, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__updatePropsCount, this);
        this.playerInfo.addEventListener(PlayerEvent.STAR_POINT_UPDATE, this.__starPointUpdateHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onContributeUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_COIN_CHANGE, this.__onConsortiaCoinUpdata, this);
        this.Btn_Buy.onClick(this, this._buyHander);
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.GLORY_CHANGE, this.__updatePropsCount, this);
        this.tab.on(fgui.Events.STATE_CHANGED, this, this.onTab1Changed);
        this.thane.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__updatePropsCount, this);
        if (ShopManager.Instance.model) {
            ShopManager.Instance.model.addEventListener(ShopEvent.GOODS_INFO_UPDATE, this.updateLimit, this);
        }
        NotificationManager.Instance.addEventListener(NotificationEvent.SHOP_TIME_BUY_REFRESH, this.updateLimit, this);
    }

    private removeEvent() {
        this._model && this._model.removeEventListener(ShopEvent.GOODS_LIST_UPDATE, this.__refreshGoods, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__updatePropsCount, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__updatePropsCount, this);
        this.playerInfo.removeEventListener(PlayerEvent.STAR_POINT_UPDATE, this.__starPointUpdateHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onContributeUpdata, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_COIN_CHANGE, this.__onConsortiaCoinUpdata, this);
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.GLORY_CHANGE, this.__updatePropsCount, this);
        this.Btn_Buy.offClick(this, this._buyHander);
        this.tab.off(fgui.Events.STATE_CHANGED, this, this.onTab1Changed);
        this.thane.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__updatePropsCount, this);
        if (ShopManager.Instance.model) {
            ShopManager.Instance.model.removeEventListener(ShopEvent.GOODS_INFO_UPDATE, this.updateLimit, this);
        }
        NotificationManager.Instance.removeEventListener(NotificationEvent.SHOP_TIME_BUY_REFRESH, this.updateLimit, this);
    }

    private updateLimit() {
        this.stepper.resetStepper();
        this.updateBuyLimitText();
        this.updateCanBuyMaxCount();
        this.stepper.updateLimit(this.MaxCanBuyCount, this.MaxCanBuyCount);
        this.HasNumValueTxt.text = GoodsManager.Instance.getGoodsNumByTempId(this._selectedItemData.ItemId) + "";
        this.CostMoneyTxt.text = (this.stepper.value * this.getPrice()).toString();
        this.Btn_Buy.enabled = this.MaxCanBuyCount > 0;
    }

    private onTab1Changed(cc: fgui.Controller) {
        this._tabIndex = cc.selectedIndex;
        // this.ItemList.scrollPane.setCurrentPageX(0);
        this.ItemList.scrollPane.scrollTop();
        let account: AccountCom = ((FrameCtrlManager.Instance.getCtrl(EmWindow.ShopWnd) as ShopControler).view as ShopWnd).account;

        if (this._tabIndex == 0) {//公会商城
            account.switchIcon(9);
            this._shopType = ShopGoodsInfo.CONSORTIA_SHOP;
            this.propsCount = this.getPropCount();
            this.shopCtrl.initConsortiaShopFrame();
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
            this.costPointTxt2.visible = false;
            this.tipItem2.visible = true;
        }else if(this._tabIndex == 1){//建设商店
            account.switchIcon(15);
            this._shopType = ShopGoodsInfo.CONSORTIA_HIGH_SHOP;
            this.propsCount = this.getPropCount();
            this.shopCtrl.initConsortiaHighShopFrame();
            this.tipItem2.setInfo(TemplateIDConstant.GUILD_CONTRIBUTION);
            this.costPointTxt2.visible = false;
            this.tipItem2.visible = true;
        }
        else {//高级公会商城
            account.switchIcon(10);
            this._shopType = ShopGoodsInfo.ADVCONSORTIA_SHOP;
            this.propsCount = this.getPropCount();
            this.shopCtrl.initAdvConsortiaShopFrame();
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA);
            this.costPointTxt2.visible = false;
            this.tipItem2.visible = true;
        }
        this.__starPointUpdateHandler();
    }

    private __onContributeUpdata() {
        this.__updatePropsCount();
    }

    private __onConsortiaCoinUpdata() {
        this.__updatePropsCount();
    }

    private __starPointUpdateHandler() {
        this.propsCount = this.getPropCount();
        if (this._selectedItemData && this._shopType != ShopModel.STAR_SHOP) {
            this.HasNumTxt.visible = true;
            this.HasNumValueTxt.text = GoodsManager.Instance.getGoodsNumByTempId(this._selectedItemData.ItemId) + "";
        }
        else {
            this.HasNumTxt.visible = false;
            this.HasNumValueTxt.text = "";
        }
    }

    private stepperChangeHandler(value: number) {
        this.__updatePropsCount();
    }

    private __updatePropsCount() {
        this.propsCount = this.getPropCount();
        this.updateCanBuyMaxCount();
        this.stepper.updateLimit(this.MaxCanBuyCount, this.MaxCanBuyCount);
        this.CostMoneyTxt.text = (this.stepper.value * this.getPrice()).toString();
        if (this._model && this._model.currentGoodsList && this._model.currentGoodsList.length > 0) {
            this.ItemList.numItems = this._model.currentGoodsList.length;
        }
    }

    private getPrice(): number {
        let price: number = 0;
        if (this._selectedItemData) {
            if (this._selectedItemData instanceof t_s_startemplateData) {
                price = this._selectedItemData.StarPoint;
            }
            else {
                price = this._selectedItemData.price;
            }
        }
        return price;
    }

    private getPropCount(): number {
        let count: number = 0;
        if (this._shopType == ShopModel.STAR_SHOP) {
            count = this.playerInfo.starPoint;
        }
        else if (this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
            count = this.playerInfo.consortiaOffer;
        }
        else if (this._shopType == ShopGoodsInfo.WARLORDS_SHOP) {
            count = ArmyManager.Instance.thane.gloryPoint;
        }
        else if (this._shopType == ShopGoodsInfo.ADVCONSORTIA_SHOP) {
            count = this.playerInfo.consortiaCoin;
        }else if (this._shopType == ShopGoodsInfo.CONSORTIA_HIGH_SHOP) {
            count = this.playerInfo.consortiaJianse;
        }else {
            count = GoodsManager.Instance.getGoodsNumByTempId(MazeModel.SHOP_MAZE_COIN_TEMPID);
        }
        return count;
    }

    /**购买物品 */
    private _buyHander() {
        if (this._selectedItemData) {
            let itemid: number = this._selectedItemData.ItemId;
            if (this._shopType == ShopModel.STAR_SHOP && this._selectedItemData instanceof t_s_startemplateData) {
                let str: string = "";
                if (this.playerInfo.starPoint < this._selectedItemData.StarPoint) {
                    str = LangManager.Instance.GetTranslation("star.view.StarShopItem.command01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                if (StarManager.Instance.checkStarPlayerBagIsFull()) {
                    str = LangManager.Instance.GetTranslation("star.view.StarShopItem.command02");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                if (this._selectedItemData.TemplateId == 4) {
                    StarManager.Instance.sendExchangeStar(this._selectedItemData.TemplateId, this.stepper.value);
                    return;
                }
                let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                let content: string = LangManager.Instance.GetTranslation("star.view.StarShopItem.str", this._selectedItemData.StarPoint * this.stepper.value);
                str = content + StarHelper.getStarHtmlName(this._selectedItemData);
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.buyResponseHandler.bind(this));
            }
            else if (this._shopType == ShopGoodsInfo.ADVCONSORTIA_SHOP) {
                let goods: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._selectedItemData.ItemId);
                if (this.checkIsRunes(this._selectedItemData) && goods.Property1 > 0) {//是符文
                    let state = OuterCityShopManager.instance.model.getRuneState(goods)
                    if (state == 1) {//已经学习
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shopcommand.buytip1"))
                        return;
                    }
                    else if (state == 2) {//已经拥有
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shopcommand.buytip2"))
                        return;
                    }
                    else {
                        this.buyGoods(itemid);
                    }
                }
                else {
                    this.buyGoods(itemid);
                }
            }
            else if (this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
                let own: number = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaOffer;
                let need: number = this.stepper.value * this.getPrice();
                if (need > own) {
                    this.addOffer()
                    return false;
                }
                let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, itemid);
                if (GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
                    GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(goods.TemplateId)) {
                    this.showAlert(); //物品时装备 背包中已存在
                    return;
                }
                let msg: string = this.checkExist(itemid)
                if (!StringHelper.isNullOrEmpty(msg)) {
                    MessageTipManager.Instance.show(msg);
                    return;
                }
                this.showBuyAlert();
            }else if(this._shopType == ShopGoodsInfo.CONSORTIA_HIGH_SHOP){
                let own: number = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaJianse;
                let need: number = this.stepper.value * this.getPrice();
                if (need > own) {
                   MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaPrayWnd.openOneBtnHandler.tips3"));
                    return false;
                }
                let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, itemid);
                if (GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
                    GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(goods.TemplateId)) {
                    this.showAlert(); //物品时装备 背包中已存在
                    return;
                }
                let msg: string = this.checkExist(itemid)
                if (!StringHelper.isNullOrEmpty(msg)) {
                    MessageTipManager.Instance.show(msg);
                    return;
                }
                this.showBuyAlert();
            }
        }
    }

    private addOffer() {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("consortia.helper.ConsortiaAltarHelper.content02");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.addOfferCallBack.bind(this));
    }

    addOfferCallBack(b: boolean, flag: boolean) {
        if (b) {
            FrameCtrlManager.Instance.open(EmWindow.ConsortiaContribute, { returnToWin: EmWindow.ShopWnd, returnToWinFrameData: {page:1} }, null, EmWindow.ShopWnd)
        }
    }

    private buyGoods(itemid: number) {
        let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, itemid);
        if (GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
            GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(goods.TemplateId)) {
            this.showAlert(); //物品时装备 背包中已存在
            return;
        }
        let msg: string = this.checkExist(itemid)
        if (!StringHelper.isNullOrEmpty(msg)) {
            MessageTipManager.Instance.show(msg);
            return;
        }
        this.showBuyAlert();
    }

    private checkIsRunes(info: ShopGoodsInfo): boolean {
        let flag: boolean = false;
        let goods: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(info.ItemId);
        if (goods && goods.SonType == 302) {
            flag = true;
        }
        return flag;
    }

    private buyResponseHandler(b: boolean, flag: boolean) {
        if (b && this._selectedItemData) {
            StarManager.Instance.sendExchangeStar(this._selectedItemData.TemplateId, this.stepper.value);
        }
    }

    private showBuyAlert() {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
        let totalCost: number;
        let content: string;
        if (this._shopType == ShopModel.STAR_SHOP) {
            totalCost = this.stepper.value * this._selectedItemData.StarPoint;
            content = LangManager.Instance.GetTranslation("startshop.buy.alert", totalCost, this.stepper.value, this.SelectedGoodsTxt.text);
        }
        else {
            totalCost = this.stepper.value * this._selectedItemData.price;
            let str: string = ShopCommonView.getCurrencyNameByType(this._shopType);
            content = LangManager.Instance.GetTranslation("shopcommwnd.buy.alert", totalCost, str, this.stepper.value, this.SelectedGoodsTxt.text);
        }
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.result.bind(this));
    }

    private showAlert() {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
        let content: string = LangManager.Instance.GetTranslation("BuyFrameI.tip02");
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

    /**
     * 根据类型获取当前货币的名称
     */
    public static getCurrencyNameByType(shopType: number): string {
        let str: string = "";
        switch (shopType) {
            case ShopGoodsInfo.CONSORTIA_SHOP:
                str = LangManager.Instance.GetTranslation("task.view.TaskRewardItem.iconTips06");//公会贡献
                break;
            case ShopGoodsInfo.FARM_SHOP:
                str = LangManager.Instance.GetTranslation("mainBar.view.ResourceView.gold");//农场
                break;
            case ShopGoodsInfo.WARLORDS_SHOP:
                str = LangManager.Instance.GetTranslation("warlords.WarlordsCheckRewardFrame.str07");//众神
                break;
            case ShopGoodsInfo.ADVCONSORTIA_SHOP:
                str = LangManager.Instance.GetTranslation("task.view.shopCommWnd.buyTips");//高级公会商城
                break;
            case ShopGoodsInfo.CONSORTIA_HIGH_SHOP:
                str = LangManager.Instance.GetTranslation("task.view.TaskRewardItem.iconTips07");//高级公会商城
                break;
        }
        return str;
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

    private __refreshGoods() {
        if (this._model && this._model.currentGoodsList && this._model.currentGoodsList.length > 0) {
            // this.ItemList.setVirtual();
            this.ItemList.numItems = this._model.currentGoodsList.length;
            this.ItemList.selectedIndex = 0;
            this._selectedItemData = this._model.currentGoodsList[0];
            this._refreshRight();
        }
        else {
            this.ItemList.numItems = 0;
            this.icon1.info = null;
            this.DescribleTxt.text = "";
            this.CostMoneyTxt.text = "";
            this.SelectedGoodsTxt.text = "";
            this.SelectedGoodsTxt.text = "";
            this.HasNumValueTxt.text = "0";
        }
    }

    private renderListItem(index: number, item: ShopItem) {
        item.info = this._model.currentGoodsList[index] ? this._model.currentGoodsList[index] : null;
    }

    private onClickItem(item: ShopItem) {
        this._selectedItemData = item.info;
        this._refreshRight();
    }

    private _refreshRight() {
        if (this._selectedItemData) {
            this.SelectedGoodsTxt.text = this.getName();
            if (this._selectedItemData instanceof t_s_startemplateData) {
                let Colors = FilterFrameText.Colors[eFilterFrameText.PetQuality];
                let profile = this._selectedItemData.Profile
                if (this._selectedItemData.Profile > Colors.length) {
                    profile = Colors.length;
                }
                let nameColor = Colors[profile - 1];
                this.SelectedGoodsTxt.color = nameColor;
            }
            else {
                let goodsInfo: GoodsInfo = new GoodsInfo();
                let profile: number = 0;
                goodsInfo.templateId = this._selectedItemData.ItemId;
                let goodsTempInfo: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
                if (goodsTempInfo && goodsTempInfo.MasterType != GoodsType.EQUIP && goodsTempInfo.MasterType != GoodsType.HONER) {
                    profile = goodsTempInfo.Profile;
                }
                this.SelectedGoodsTxt.color = GoodsSonType.getColorByProfile(profile);
            }
            this.DescribleTxt.text = this.getDesc();
            this.setIcon1Data();

            if (this._shopType != ShopModel.STAR_SHOP) {
                this.HasNumTxt.visible = true;
                this.HasNumValueTxt.text = GoodsManager.Instance.getGoodsNumByTempId(this._selectedItemData.ItemId) + "";
            }
            else {
                this.HasNumTxt.visible = false;
                this.HasNumValueTxt.text = "";
            }
            this._handler && this._handler.recover();
            this._handler = Laya.Handler.create(this, this.stepperChangeHandler, null, false);
            this.updateBuyLimitText();
            this.updateCanBuyMaxCount();
            this.stepper.show(0, 1, 1, this.MaxCanBuyCount, this.MaxCanBuyCount, 1, this._handler);
            this.CostMoneyTxt.text = (this.stepper.value * this.getPrice()).toString();
            this.setBuyButtonStatus();
        }
    }

    private updateBuyLimitText() {
        let leftCount = 0;
        if (this._selectedItemData.type == ShopGoodsInfo.PAY_BY_GIFT) {
            ShopManager.Instance.getGoodsBuyNum(this._selectedItemData.Id);
            let num: number = this._selectedItemData.limitCount - this._selectedItemData.count;
            this.limitCountTxt.text = "";
            if (num > 0) {
                this.limitTitleTxt.text = LangManager.Instance.GetTranslation("shop.view.GoodsItem.limited06", num); //每4小时限购{n}个
            } else {
                this.limitTitleTxt.text = LangManager.Instance.GetTranslation("shop.view.GoodsItem.limited05");//购买量达到上限
            }
        } else {
            if (this._selectedItemData.canOneCount >= 0) {
                ShopManager.Instance.getGoodsBuyNum(this._selectedItemData.Id);
                this.limitTitleTxt.text = LangManager.Instance.GetTranslation("Shop.Promotion.daylimit");  //每人限购
                leftCount = this._selectedItemData.OneDayCount - this._selectedItemData.OneCurrentCount;
                this.limitCountTxt.text = (leftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + leftCount + "[/color]" + "/" + this._selectedItemData.OneDayCount.toString();
            } else if (this._selectedItemData.canOneCount == -1) {
                this.limitCountTxt.text = "";
                this.limitTitleTxt.text = "";
            }
        }
        if (this._selectedItemData.WeeklyLimit > -1) {
            this.limitTitleTxt.text = LangManager.Instance.GetTranslation("Shop.Promotion.weeklimit");
            leftCount = this._selectedItemData.WeeklyLimit - this._selectedItemData.weekCount;
            this.limitCountTxt.text = (leftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + leftCount + "[/color]" + "/" + this._selectedItemData.WeeklyLimit;
        }
    }

    private updateCanBuyMaxCount() {
        if (!this._selectedItemData) {
            return;
        }
        this.MaxCanBuyCount = Math.floor(this.propsCount / this.getPrice());
        if (this.MaxCanBuyCount <= 0) {
            this.MaxCanBuyCount = 1;
        }

        let leftCount: number = this.MaxCanBuyCount;
        if (this._selectedItemData.WeeklyLimit > -1) {//
            leftCount = this._selectedItemData.WeeklyLimit - this._selectedItemData.weekCount;
        }
        else if (this._selectedItemData.canOneCount > -1) {
            leftCount = this._selectedItemData.OneDayCount - this._selectedItemData.OneCurrentCount;
        }
        else {
            this.MaxCanBuyCount = 999;//最大可购买数量
        }
        this.MaxCanBuyCount = Math.min(this.MaxCanBuyCount, leftCount);
    }

    private setBuyButtonStatus() {
        this.Btn_Buy.enabled = this.MaxCanBuyCount > 0;
        if (this._selectedItemData.ShopType == ShopGoodsInfo.CONSORTIA_SHOP 
            || this._selectedItemData.ShopType == ShopGoodsInfo.ADVCONSORTIA_SHOP
            ||this._selectedItemData.ShopType == ShopGoodsInfo.CONSORTIA_HIGH_SHOP) {
            if (this._selectedItemData.NeedConsortiaLevels > this.consortiaLevel) {
                this.Btn_Buy.enabled = false;
            }
        }
    }

    protected get consortiaLevel(): number {
        let lv: number
        let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        if (contorller && contorller.model) {
            lv = contorller.model.consortiaInfo.shopLevel;
        }
        return lv;
    }

    private getName(): string {
        let str: string = "";
        let goodsInfo: GoodsInfo = new GoodsInfo();
        if (this._selectedItemData instanceof t_s_startemplateData) {
            str = this._selectedItemData.TemplateNameLang
        }
        else {
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._selectedItemData.ItemId;
            this.icon1.info = goodsInfo;
            let goodsTempInfo: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
            if (!goodsTempInfo) {
                this._selectedItemData = null;
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaShopGoodsItem.noFindGoods");
            }
            if (goodsTempInfo.MasterType != GoodsType.EQUIP && goodsTempInfo.MasterType != GoodsType.HONER) {
                str = goodsTempInfo.TemplateNameLang;
            }
        }
        return str;
    }

    private getDesc(): string {
        let str: string = "";
        if (this._selectedItemData instanceof t_s_startemplateData) {
            let info: StarInfo = new StarInfo();
            info.template = this._selectedItemData;
            info.bagType = 0;
            info.grade = 1;
            str = StarHelper.getStarAttributeAdd(info);
        }
        else {
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._selectedItemData.ItemId;
            let goodsTempInfo: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
            if (goodsTempInfo && goodsTempInfo.MasterType != GoodsType.EQUIP && goodsTempInfo.MasterType != GoodsType.HONER) {
                str = goodsTempInfo.DescriptionLang;
            }
        }
        return str;
    }

    private setIcon1Data() {
        if (this._selectedItemData instanceof t_s_startemplateData) {
            let realPath = IconFactory.getStarIconPath(this._selectedItemData.Icon)
            ResMgr.Instance.loadRes(realPath, (res) => {
                if (res) {
                    let prefix = res.meta.prefix
                    let cacheName = prefix + String(this._selectedItemData.Icon)
                    let aniCahce = AnimationManager.Instance.getCache(cacheName)
                    let success: boolean;
                    if (!aniCahce) {
                        success = AnimationManager.Instance.createAnimation(cacheName, "", 0)
                    }
                    this.displayObject.addChild(this._movie);
                    this.icon1.visible = false;
                    this._movie.x = 820;
                    this._movie.y = 118;
                    this._movie.gotoAndPlay(0, true, cacheName);
                }
            });
        }
        else {
            if (this._movie && this._movie.parent) {
                this._movie.parent.removeChild(this._movie);
            }
            this.icon1.visible = true;
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._selectedItemData.ItemId;
            this.icon1.info = goodsInfo;
        }
    }

    private checkExist(tId: number): string {
        let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tId);
        if (goods.SonType != GoodsSonType.SONTYPE_MOUNT_CARD) {
            return "";
        }
        let exist: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(goods.Property1);
        if (goods.Property2 > 0) {
            exist = null;
        }
        if (exist) {
            return LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.mopupexitst");
        }
        else {
            return "";
        }
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get shopCtrl(): ShopControler {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.ShopWnd) as ShopControler;
    }

    dispose(destroy = true) {
        this.removeEvent();
        destroy && super.dispose();
    }
}