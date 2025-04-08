// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import MazeModel from "../maze/MazeModel";
import { ShopItem } from "../shop/view/component/ShopItem";
import { ShopModel } from '../shop/model/ShopModel';
import { ShopManager } from "../../manager/ShopManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { IconFactory } from "../../../core/utils/IconFactory";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { ConfigType } from "../../constant/ConfigDefine";
import { GoodsType } from "../../constant/GoodsType";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../manager/GoodsManager";
import { ShopEvent, BagEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import StringHelper from "../../../core/utils/StringHelper";
import GoodsSonType from "../../constant/GoodsSonType";
import { MessageTipManager } from "../../manager/MessageTipManager";
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { ShopControler } from '../shop/control/ShopControler';
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import { StarManager } from "../../manager/StarManager";
import { t_s_startemplateData } from "../../config/t_s_startemplate";
import { StarHelper } from "../../utils/StarHelper";
import { MovieClip } from "../../component/MovieClip";
import ResMgr from "../../../core/res/ResMgr";
import { AnimationManager } from "../../manager/AnimationManager";
import FUIHelper from "../../utils/FUIHelper";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { BaseItem } from "../../component/item/BaseItem";
import StarInfo from "../mail/StarInfo";
import { MountsManager } from "../../manager/MountsManager";
import { WildSoulInfo } from "../mount/model/WildSoulInfo";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { NumericStepper } from "../../component/NumericStepper";
import { ArmyManager } from "../../manager/ArmyManager";
import WarlordsManager from "../../manager/WarlordsManager";
import ColorConstant from '../../constant/ColorConstant';
import { eFilterFrameText, FilterFrameText } from '../../component/FilterFrameText';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { NotificationManager } from '../../manager/NotificationManager';
import { TempleteManager } from '../../manager/TempleteManager';
import { OuterCityShopManager } from '../../manager/OuterCityShopManager';
import BaseTipItem from '../../component/item/BaseTipItem';
import TemplateIDConstant from '../../constant/TemplateIDConstant';
import Utils from '../../../core/utils/Utils';

export default class ShopCommWnd extends BaseWindow {
    public frame: fgui.GLabel;
    private ItemList: fgui.GList = null;
    private icon1: BaseItem;//选中的物品
    private SelectedGoodsTxt: fgui.GLabel;//选中的道具名
    private HasNumTxt: fgui.GLabel;//拥有数量
    private HasNumValueTxt: fgui.GLabel;//拥有数量文字
    private DescribleTxt: fgui.GLabel;//描述
    private BuyNumDescTxt: fgui.GLabel;//购买数量文字
    private CostMoneyTxt: fgui.GLabel;//消耗道具数量
    private ComMoneyText: fgui.GLabel;//拥有道具数量
    private PageNumTxt: fgui.GLabel;//页数显示
    private costPointTxt1: fgui.GLabel;
    private costPointTxt2: fgui.GLabel
    private Btn_Buy: UIButton;//购买
    private _model: ShopModel;
    private _selectedItemData: any;
    private propsCount: number = 0;
    private MaxCanBuyCount: number = 0;//最大可购买数量
    private _shopType: number = 0;//商城类型
    public stepper: NumericStepper;
    private _handler: Laya.Handler;
    public noteTxt: fgui.GTextField;
    private _movie: MovieClip = new MovieClip();
    private limitCountTxt: fgui.GLabel;
    private limitTitleTxt: fgui.GLabel;
    public typeCtr: fgui.Controller;
    public tab: fgui.Controller;
    public _tabIndex: number = 0;
    public dataGroup: fgui.GGroup;
    public tipItem1: BaseTipItem;
    public tipItem2: BaseTipItem;
    public OnInitWind() {
        super.OnInitWind();
        this._model = ShopManager.Instance.model;
        this.typeCtr = this.getController("typeCtr");
        this.tab = this.getController("tab");
        this.BuyNumDescTxt.text = LangManager.Instance.GetTranslation("MazeShopWnd.BuyNumDescTxt");
        this.ItemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.ItemList.on(fgui.Events.SCROLL_END, this, this.updateBagPage);
        this.ItemList.scrollPane.mouseWheelEnabled = false;
        this.ItemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.DescribleTxt.text = "";
        this.CostMoneyTxt.text = "";
        this.SelectedGoodsTxt.text = "";
        this.icon1.visible = false;
        this.dataGroup.x = -40;
        this.addEvent();
        this.setCenter();
    }

    OnShowWind() {
        super.OnShowWind();
        if (this.frameData) {
            this._shopType = this.frameData.shopType;
            if (this._shopType == ShopModel.STAR_SHOP) {
                this.frame.getChild('title').text = LangManager.Instance.GetTranslation("star.StarShopFrame.title");
            } else if (this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
                let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
                var lv: number = contorller.model.consortiaInfo.shopLevel;
                if (lv < 6) {
                    this.typeCtr.selectedIndex = 0;
                    this.dataGroup.x = -40;
                } else {
                    this.dataGroup.x = 40;
                    this.typeCtr.selectedIndex = 1;
                }
                this.frame.getChild('title').text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaShopFrame.titleText", lv);
            } else if (this._shopType == ShopGoodsInfo.WARLORDS_SHOP) {
                this.frame.getChild('title').text = LangManager.Instance.GetTranslation("view.subshop.WarlordsShopFrame.str01");
                let str: string = WarlordsManager.Instance.model.getMatchDateString(5, LangManager.Instance.GetTranslation("public.dateType", "YYYY", "MM", "DD"));
                this.noteTxt.text = LangManager.Instance.GetTranslation("shopCommWnd.noteTxt", str)
            } 
        }
        this.initData();
    }

    private addEvent() {
        this._model.addEventListener(ShopEvent.GOODS_LIST_UPDATE, this.__refreshGoods, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__updatePropsCount, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__updatePropsCount, this);
        this.playerInfo.addEventListener(PlayerEvent.STAR_POINT_UPDATE, this.__starPointUpdateHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onContributeUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_COIN_CHANGE, this.__onConsortiaCoinUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        this.Btn_Buy.onClick(this, this._buyHander.bind(this));
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.GLORY_CHANGE, this.__updatePropsCount, this);
        this.tab.on(fgui.Events.STATE_CHANGED, this, this.onTab1Changed);
        this.thane.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__updatePropsCount, this);
        if (ShopManager.Instance.model) {
            ShopManager.Instance.model.addEventListener(ShopEvent.GOODS_INFO_UPDATE, this.updateLimit, this);
        }
        NotificationManager.Instance.addEventListener(NotificationEvent.SHOP_TIME_BUY_REFRESH, this.updateLimit, this);
    }

    private removeEvent() {
        // this.ItemList.itemRenderer.recover();
        Utils.clearGListHandle(this.ItemList);
        this._model.removeEventListener(ShopEvent.GOODS_LIST_UPDATE, this.__refreshGoods, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__updatePropsCount, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__updatePropsCount, this);
        this.playerInfo.removeEventListener(PlayerEvent.STAR_POINT_UPDATE, this.__starPointUpdateHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onContributeUpdata, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_COIN_CHANGE, this.__onConsortiaCoinUpdata, this);
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.GLORY_CHANGE, this.__updatePropsCount, this);
        this.Btn_Buy.offClick(this, this._buyHander.bind(this));
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
        this.ItemList.scrollPane.setCurrentPageX(0);
        if (this._tabIndex == 0) {//公会商城
            this._shopType = ShopGoodsInfo.CONSORTIA_SHOP;
            this.propsCount = this.getPropCount();
            this.shopCtrl.initConsortiaShopFrame();
            this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
            this.costPointTxt1.visible = false;
            this.costPointTxt2.visible = false;
            this.tipItem1.visible = true;
            this.tipItem2.visible = true;
        } else {//高级公会商城
            this._shopType = ShopGoodsInfo.ADVCONSORTIA_SHOP;
            this.propsCount = this.getPropCount();
            this.shopCtrl.initAdvConsortiaShopFrame();
            this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA);
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA);
            this.costPointTxt1.visible = false;
            this.costPointTxt2.visible = false;
            this.tipItem1.visible = true;
            this.tipItem2.visible = true;

        }
        this.updateBagPage();
        this.__starPointUpdateHandler();
    }

    private __existConsortiaHandler(evt: PlayerEvent) {
        if (this.playerInfo.consortiaID == 0 && this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
            this.hide();
        }
    }

    private __onContributeUpdata() {
        this.__updatePropsCount();
    }

    private __onConsortiaCoinUpdata() {
        this.__updatePropsCount();
    }

    private __starPointUpdateHandler() {
        this.propsCount = this.getPropCount();
        this.ComMoneyText.text = this.propsCount.toString();
        if (this._selectedItemData && this._shopType != ShopModel.STAR_SHOP) {
            this.HasNumTxt.visible = true;
            this.HasNumValueTxt.text = GoodsManager.Instance.getGoodsNumByTempId(this._selectedItemData.ItemId) + "";
        } else {
            this.HasNumTxt.visible = false;
            this.HasNumValueTxt.text = "";
        }
    }

    private initData() {
        this.__updatePropsCount();
        this.tipItem1.visible = true;
        this.tipItem2.visible = true;
        this.costPointTxt1.visible = false;
        this.costPointTxt2.visible = false;
        if (this._shopType == ShopModel.STAR_SHOP) {
            this.shopCtrl.initStarShopFrame();
            this.costPointTxt1.visible = true;
            this.costPointTxt2.visible = true;
            this.tipItem1.visible = false;
            this.tipItem2.visible = false;
        } else if (this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
            this.shopCtrl.initConsortiaShopFrame();
            this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
        } else if (this._shopType == ShopGoodsInfo.WARLORDS_SHOP) {
            this.shopCtrl.initWarlordsShopFrame();
            this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_RYSJ);
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_RYSJ);
        } 
        this.updateBagPage();
    }

    private stepperChangeHandler(value: number) {
        this.__updatePropsCount();
    }

    private __updatePropsCount() {
        this.propsCount = this.getPropCount();
        this.ComMoneyText.text = this.propsCount.toString();
        this.updateCanBuyMaxCount();
        this.stepper.updateLimit(this.MaxCanBuyCount, this.MaxCanBuyCount);
        this.CostMoneyTxt.text = (this.stepper.value * this.getPrice()).toString();
        if (this._model && this._model.currentGoodsList && this._model.currentGoodsList.length > 0) {
            this.ItemList.numItems = this._model.currentGoodsList.length;
        }
    }

    /**购买物品 */
    private _buyHander() {
        if (this._selectedItemData) {
            var itemid: number = this._selectedItemData.ItemId;
            if (this._shopType == ShopModel.STAR_SHOP && this._selectedItemData instanceof t_s_startemplateData) {
                var str: string = "";
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
                    // for (var i: number = 0; i < this.stepper.value; i++) {
                    StarManager.Instance.sendExchangeStar(this._selectedItemData.TemplateId, this.stepper.value);
                    // }
                    return;
                }
                var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                var content: string = LangManager.Instance.GetTranslation("star.view.StarShopItem.str", this._selectedItemData.StarPoint * this.stepper.value);
                str = content + StarHelper.getStarHtmlName(this._selectedItemData);
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.buyResponseHandler.bind(this));
            } else if (this._shopType == ShopGoodsInfo.ADVCONSORTIA_SHOP) {
                let goods: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._selectedItemData.ItemId);
                if (this.checkIsRunes(this._selectedItemData) && goods.Property1 > 0) {//是符文
                    let state = OuterCityShopManager.instance.model.getRuneState(goods)
                    if (state == 1) {//已经学习
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shopcommand.buytip1"))
                        return;
                    } else if (state == 2) {//已经拥有
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shopcommand.buytip2"))
                        return;
                    } else {
                        this.buyGoods(itemid);
                    }
                } else {
                    this.buyGoods(itemid);
                }
            }
            else {
                let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, itemid);
                if (GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
                    GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(goods.TemplateId)) {
                    this.showAlert(); //物品时装备 背包中已存在
                    return;
                }
                var msg: string = this.checkExist(itemid)
                if (!StringHelper.isNullOrEmpty(msg)) {
                    MessageTipManager.Instance.show(msg);
                    return;
                }
                this.showBuyAlert();
            }
        }
    }

    private buyGoods(itemid: number) {
        let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, itemid);
        if (GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
            GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(goods.TemplateId)) {
            this.showAlert(); //物品时装备 背包中已存在
            return;
        }
        var msg: string = this.checkExist(itemid)
        if (!StringHelper.isNullOrEmpty(msg)) {
            MessageTipManager.Instance.show(msg);
            return;
        }
        this.showBuyAlert();
    }

    private checkIsRunes(info: ShopGoodsInfo): boolean {
        let flag: boolean = false;
        var goods: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(info.ItemId);
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
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
        let totalCost: number;
        var content: string;
        if (this._shopType == ShopModel.STAR_SHOP) {
            totalCost = this.stepper.value * this._selectedItemData.StarPoint;
            content = LangManager.Instance.GetTranslation("startshop.buy.alert", totalCost, this.stepper.value, this.SelectedGoodsTxt.text);
        } else {
            totalCost = this.stepper.value * this._selectedItemData.price;
            let str: string = ShopCommWnd.getCurrencyNameByType(this._shopType);
            content = LangManager.Instance.GetTranslation("shopcommwnd.buy.alert", totalCost, str, this.stepper.value, this.SelectedGoodsTxt.text);
        }
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.result.bind(this));
    }

    private showAlert() {
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
        var content: string = LangManager.Instance.GetTranslation("BuyFrameI.tip02");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.result.bind(this));
    }

    private result(b: boolean, flag: boolean) {
        if (b) this.buy(false);
    }

    private buy(useBind: boolean = true) {
        let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
        if (this.isFashionGoods(temp)) {
            ShopManager.Instance.sendShoping(this._selectedItemData.Id, this.stepper.value, this.playerInfo.userId, false, C2SProtocol.C_FASHION_SHOP_BUY, useBind);
        } else {
            ShopManager.Instance.sendShoping(this._selectedItemData.Id, this.stepper.value, this.playerInfo.userId, false, C2SProtocol.U_C_SHOP_BUY, useBind);
        }
    }

    /**
         * 根据类型获取当前货币的名称 
         */
    public static getCurrencyNameByType(shopType: number): string {
        var str: string = "";
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
            this.ItemList.setVirtual();
            this.ItemList.numItems = this._model.currentGoodsList.length;
            this.ItemList.selectedIndex = 0;
            let item = this.ItemList.getChildAt(0);
            if (item)
                this.onClickItem(item as ShopItem);
        } else {
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

    updateBagPage() {
        this.PageNumTxt.text = (this.ItemList.scrollPane.currentPageX + 1) + "/" + Math.max(Math.ceil(this.ItemList.numItems / 8), 1);
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
            } else {
                var goodsInfo: GoodsInfo = new GoodsInfo();
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
            } else {
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
            var num: number = this._selectedItemData.limitCount - this._selectedItemData.count;
            this.limitCountTxt.text = "";
            if (num > 0) {
                this.limitTitleTxt.text = LangManager.Instance.GetTranslation("shop.view.GoodsItem.limited06", num); //每4小时限购{n}个
            } else {
                this.limitTitleTxt.text = LangManager.Instance.GetTranslation("shop.view.GoodsItem.limited05");//购买量达到上限
            }
        } else {
            if (this._selectedItemData.canOneCount >= 0) {
                ShopManager.Instance.getGoodsBuyNum(this._selectedItemData.Id);
                this.limitTitleTxt.color = ColorConstant.DEEP_TEXT_COLOR;
                this.limitTitleTxt.text = LangManager.Instance.GetTranslation("Shop.Promotion.daylimit");  //每人限购
                leftCount = this._selectedItemData.OneDayCount - this._selectedItemData.OneCurrentCount;
                this.limitCountTxt.text = leftCount.toString() + "/" + this._selectedItemData.OneDayCount.toString();
            } else if (this._selectedItemData.canOneCount == -1) {
                this.limitCountTxt.text = "";
                this.limitTitleTxt.text = "";
            }
        }
        if (this._selectedItemData.WeeklyLimit > -1) {
            this.limitTitleTxt.color = ColorConstant.DEEP_TEXT_COLOR;
            this.limitTitleTxt.text = LangManager.Instance.GetTranslation("Shop.Promotion.weeklimit");
            leftCount = this._selectedItemData.WeeklyLimit - this._selectedItemData.weekCount;
            this.limitCountTxt.text = leftCount.toString() + "/" + this._selectedItemData.WeeklyLimit;
        }
    }

    private updateCanBuyMaxCount() {
        if (!this._selectedItemData) return;
        this.MaxCanBuyCount = Math.floor(this.propsCount / this.getPrice());
        if (this.MaxCanBuyCount <= 0) this.MaxCanBuyCount = 1;

        let leftCount: number = this.MaxCanBuyCount;
        if (this._selectedItemData.WeeklyLimit > -1) {//
            leftCount = this._selectedItemData.WeeklyLimit - this._selectedItemData.weekCount;
        } else if (this._selectedItemData.canOneCount > -1) {
            leftCount = this._selectedItemData.OneDayCount - this._selectedItemData.OneCurrentCount;
        } else {
            this.MaxCanBuyCount = 999;//最大可购买数量
        }
        this.MaxCanBuyCount = Math.min(this.MaxCanBuyCount, leftCount);
    }

    private setBuyButtonStatus() {
        this.Btn_Buy.enabled = this.MaxCanBuyCount > 0;
        if (this._selectedItemData.ShopType == ShopGoodsInfo.CONSORTIA_SHOP || this._selectedItemData.ShopType == ShopGoodsInfo.ADVCONSORTIA_SHOP) {
            if (this._selectedItemData.NeedConsortiaLevels > this.consortiaLevel) {
                this.Btn_Buy.enabled = false;
            }
        }
    }

    protected get consortiaLevel(): number {
        var lv: number
        let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        if (contorller && contorller.model) {
            lv = contorller.model.consortiaInfo.shopLevel;
        }
        return lv;
    }

    private getName(): string {
        let str: string = "";
        var goodsInfo: GoodsInfo = new GoodsInfo();
        if (this._selectedItemData instanceof t_s_startemplateData) {
            str = this._selectedItemData.TemplateNameLang
        } else {
            var goodsInfo: GoodsInfo = new GoodsInfo();
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
            var info: StarInfo = new StarInfo();
            info.template = this._selectedItemData;
            info.bagType = 0;
            info.grade = 1;
            str = StarHelper.getStarAttributeAdd(info);
        } else {
            var goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._selectedItemData.ItemId;
            let goodsTempInfo: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._selectedItemData.ItemId);
            if (goodsTempInfo && goodsTempInfo.MasterType != GoodsType.EQUIP && goodsTempInfo.MasterType != GoodsType.HONER) {
                str = goodsTempInfo.DescriptionLang;
            }
        }
        return str;
    }

    private getPrice(): number {
        let price: number = 0;
        if (this._selectedItemData) {
            if (this._selectedItemData instanceof t_s_startemplateData) {
                price = this._selectedItemData.StarPoint;
            } else {
                price = this._selectedItemData.price;
            }
        }
        return price;
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
                    this.addChild(this._movie);
                    this.icon1.visible = false;
                    this._movie.x = 820;
                    this._movie.y = 118;
                    this._movie.gotoAndPlay(0, true, cacheName);
                }
            });
        } else {
            if (this._movie && this._movie.parent)
                this._movie.parent.removeChild(this._movie);
            this.icon1.visible = true;
            var goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._selectedItemData.ItemId;
            this.icon1.info = goodsInfo;
        }
    }

    private getPropCount(): number {
        let count: number = 0;
        if (this._shopType == ShopModel.STAR_SHOP) {
            count = this.playerInfo.starPoint;
        } else if (this._shopType == ShopGoodsInfo.CONSORTIA_SHOP) {
            count = this.playerInfo.consortiaOffer;
        } else if (this._shopType == ShopGoodsInfo.WARLORDS_SHOP) {
            count = ArmyManager.Instance.thane.gloryPoint;
        } else if (this._shopType == ShopGoodsInfo.ADVCONSORTIA_SHOP) {
            count = this.playerInfo.consortiaCoin;
        } else {
            count = GoodsManager.Instance.getGoodsNumByTempId(MazeModel.SHOP_MAZE_COIN_TEMPID);
        }
        return count;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get shopCtrl(): ShopControler {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.ShopWnd) as ShopControler;
    }

    private checkExist(tId: number): string {
        let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tId);
        if (goods.SonType != GoodsSonType.SONTYPE_MOUNT_CARD) return "";
        var exist: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(goods.Property1);
        if (goods.Property2 > 0) {
            exist = null;
        }
        if (exist) {
            return LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.mopupexitst");
        } else {
            return "";
        }
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }
}