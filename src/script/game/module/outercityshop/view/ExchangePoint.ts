// @ts-nocheck
import FUI_OuterCityShopItem from "../../../../../fui/Base/FUI_OuterCityShopItem";
import FUI_ExchangePoint from "../../../../../fui/OutCityShop/FUI_ExchangePoint";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { BagEvent, OuterCityShopEvent } from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { OuterCityShopManager } from "../../../manager/OuterCityShopManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { OuterCityShopItemInfo } from "../data/OuterCityShopItemInfo";
import { OuterCityShopModel } from "../OuterCityShopModel";
import ExchangeRandomItem from "./ExchangeRandomItem";

export default class ExchangePoint extends FUI_ExchangePoint {
    private _dataList: Array<any>;
    //@ts-ignore
    public tipItem1: BaseTipItem;//积分
    //@ts-ignore
    public tipItem2: BaseTipItem;//神秘石
    protected onConstruct() {
        super.onConstruct();
        this.addEvent();

        this.refreshView();
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE);
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_MYSTERY_STONE);
        // this.outerCityShopModel.initExchangeGoodsData();
    }

    private addEvent() {
        this.list_shop.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list_shop.on(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
        this.outerCityShopModel.addEventListener(OuterCityShopEvent.EXCHANGE_GOODS_LIST_UPDATE, this.refreshViewHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.refreshView, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.refreshView, this);
        this.outerCityShopModel.addEventListener(OuterCityShopEvent.FRESH_VIEW, this.refreshView, this);
    }

    private offEvent() {
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.refreshView, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.refreshView, this);
        this.outerCityShopModel.removeEventListener(OuterCityShopEvent.FRESH_VIEW, this.refreshView, this);
        this.outerCityShopModel.removeEventListener(OuterCityShopEvent.EXCHANGE_GOODS_LIST_UPDATE, this.refreshViewHandler, this);
        // this.list_shop.itemRenderer.recover();
        Utils.clearGListHandle(this.list_shop);
        this.list_shop.off(fgui.Events.CLICK_ITEM, this, this.onListShopClick);
    }

    private _currentSelectedItem: ExchangeRandomItem = null;
    private onListShopClick(item: ExchangeRandomItem, evt: Laya.Event) {
        let targetObj = fgui.GObject.cast(evt.target);
        if (targetObj instanceof FUI_OuterCityShopItem) {
            this._currentSelectedItem = item;
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = parseInt(item.info.itemTemInfo.ItemId);
            // 符文石
            if (item.itemInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL && item.itemInfo.Property1 > 0) {
                let state = this.outerCityShopModel.getRuneState(item.itemInfo);
                if (state > 0) {
                    let strKey = state == 1 ? 'ExchangeRandomItem.tips.study' : 'ExchangeRandomItem.tips.isOwn';
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation(strKey));
                    return;
                }
            }
            FrameCtrlManager.Instance.open(EmWindow.BuyFrame2, { info: goodsInfo, count: 1, OuterCityShopItemInfo: item.info });
        }
    }

    private refreshView() {
        this.txt_hasPoint.text = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.MYSTERY_STONE).toString();//神秘石
        this.txt_hasBindPoint.text = this.outerCityShopModel.consumePoints.toString();
        this.outerCityShopModel.initExchangeGoodsData();
    }

    private renderListItem(index: number, item: ExchangeRandomItem) {
        item.info = this._dataList[index];
    }

    private refreshViewHandler() {
        let exchangeGoodsList: Array<any> = this.outerCityShopModel.exchangeGoodsList;
        let len = exchangeGoodsList.length;
        var itemInfo: OuterCityShopItemInfo;
        this._dataList = [];
        let temp: OuterCityShopItemInfo[] = []
        let grades = ArmyManager.Instance.thane.grades;
        for (var i: number = 0; i < len; i++) {
            // 玩家等级超出物品显示最大等级时，物品不再显示
            if (grades > exchangeGoodsList[i].MaxLevel) {
                continue
            }
            itemInfo = new OuterCityShopItemInfo();
            itemInfo.isBuy = false;
            itemInfo.itemTemInfo = exchangeGoodsList[i];

            if (itemInfo.itemTemInfo.Point > 0)//钻石
                itemInfo.costInfos.push([-400, itemInfo.itemTemInfo.Point]);
            if (itemInfo.itemTemInfo.Score > 0)//积分
                itemInfo.costInfos.push([TemplateIDConstant.TEMP_ID_MYSTERY_SHOP_SCORE, itemInfo.itemTemInfo.Score]);
            if (itemInfo.itemTemInfo.SecretStone > 0)//神秘石
                itemInfo.costInfos.push([2131057, itemInfo.itemTemInfo.SecretStone]);
            if (itemInfo.itemTemInfo.Strategy > 0)//战魂
                itemInfo.costInfos.push([-300, itemInfo.itemTemInfo.Strategy]);
            if (itemInfo.itemTemInfo.Crystal > 0)//光晶
                itemInfo.costInfos.push([-600, itemInfo.itemTemInfo.Crystal]);

            if (grades < itemInfo.itemTemInfo.MinLevel) {
                temp.push(itemInfo);
                continue;
            }
            this._dataList.push(itemInfo);
        }
        this._dataList.push(...temp);
        this.list_shop.setVirtual();
        this.list_shop.numItems = this._dataList.length;
    }

    private get outerCityShopModel(): OuterCityShopModel {
        return OuterCityShopManager.instance.model;
    }

    dispose() {
        this.offEvent();
        super.dispose();
    }
}