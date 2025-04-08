
import BaseWindow from "../../core/ui/Base/BaseWindow";
import { BaseItem } from "../component/item/BaseItem";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { TempleteManager } from "../manager/TempleteManager";
import { PreviewGoodsItem } from "./PreviewGoodsItem";

export default class PreviewGoodsWnd extends BaseWindow {

    public goodsItem: BaseItem;
    public goodsList: fgui.GList;
    public goodsName: fgui.GTextField;

    private _mainGoods: GoodsInfo;

    private _getedGoods: GoodsInfo[];

    public OnInitWind() {
        this.setCenter();
        this._mainGoods = this.frameData;
        this.goodsList.setVirtual();
        this.goodsList.itemRenderer = Laya.Handler.create(this, this.onGoodsRenderer, null, false);
        let dropItems = TempleteManager.Instance.getDropItemssByDropId(this._mainGoods.templateId);
        this._getedGoods = [];
        let goods: GoodsInfo = null;
        // 218（坐骑卡）、109-112（时装部件）
        let sontypes = [218, 109, 110, 111, 112]
        for (let dropItem of dropItems) {
            goods = new GoodsInfo();
            goods.templateId = dropItem.ItemId;
            if (sontypes.indexOf(goods.templateInfo.SonType) >= 0) {
                this._getedGoods.push(goods);
            }
        }
    }

    public OnShowWind() {
        this.goodsList.numItems = this._getedGoods.length;
        this.goodsItem.info = this._mainGoods;
        this.goodsName.text = this._mainGoods.templateInfo.TemplateNameLang;
    }

    private onGoodsRenderer(index: number, item: PreviewGoodsItem) {
        let goods = this._getedGoods[index];
        item.info = goods;
    }
}