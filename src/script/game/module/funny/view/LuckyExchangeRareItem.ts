import FUI_LuckyExchangeRareItem from "../../../../../fui/Funny/FUI_LuckyExchangeRareItem";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export default class LuckyExchangeRareItem extends FUI_LuckyExchangeRareItem{
    public baseItem:BaseItem;
    protected onConstruct() {
        super.onConstruct()
    }

    public set info(value: GoodsInfo) {
        this.baseItem.info = value;
    }

    public dispose() {
        super.dispose()
    }

}