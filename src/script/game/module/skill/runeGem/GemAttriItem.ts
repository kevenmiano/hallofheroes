// @ts-nocheck
import FUI_GemAttriItem from "../../../../../fui/Skill/FUI_GemAttriItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";


export class GemAttriItem extends FUI_GemAttriItem
{
    constructor()
    {
        super();
    }

    public updateText(property:string, value:number,goodsInfo: GoodsInfo)
    {
        this.txt_attributeName.text = property;
        this.txt_attributeValue.text = value.toString();
        if(goodsInfo){
            let str = goodsInfo.templateInfo.Icon;
            let iconUrl =str.substring(1,str.length-4)  + '_s';
            this.loader.url = fgui.UIPackage.getItemURL("Skill", iconUrl);
        }
    }   

    dispose()
    {
        super.dispose();
    }
}