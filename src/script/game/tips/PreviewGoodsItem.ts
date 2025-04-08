import FUI_PreviewGoodsItem from "../../../fui/Base/FUI_PreviewGoodsItem";
import { BaseItem } from "../component/item/BaseItem";
import { GoodsInfo } from "../datas/goods/GoodsInfo";

export class PreviewGoodsItem extends FUI_PreviewGoodsItem {

    protected onConstruct(): void {
        super.onConstruct();
    }

    public set info(v:GoodsInfo){
        this.goodsName.text=v.templateInfo.TemplateNameLang;
        (this.goodsItem as BaseItem).info = v;
    }
}