import FUI_GoodAttributeItem from "../../../fui/Base/FUI_GoodAttributeItem";
import LangManager from "../../core/lang/LangManager";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsHelp } from "../utils/GoodsHelp";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/17 15:42
 * @ver 1.0
 *
 */
export class GoodAttributeItem extends FUI_GoodAttributeItem
{
    constructor()
    {
        super();
    }

    public updateText(property:string, value:number|string, addValue:number = 0,newAddValue:number=0,objectId:number=0,)
    {
        this.txt_attributeName.text = property;
        this.txt_attributeValue.text = value+"";
       
        this.txt_attributeAdd.visible = false;
        if(addValue>0){
            this.txt_attributeAdd.text = " +" + addValue;
            this.txt_attributeAdd.visible = true;
        }	
        if(newAddValue>0){
            let addValue2:number = this.getConciseValue(addValue,objectId);
            let addValueStr2:string = addValue2 > 0 ? "  +" + addValue2: "";
            let newAddValue2:number = this.getConciseValue(newAddValue,objectId);
            let newAddValueStr2:String = newAddValue2 > 0 ? "  +" + newAddValue2: "";
            if(addValueStr2.length > 0)
            {
                addValueStr2 += "\n";
            }else
            {
                addValueStr2 += " ";
            }
            this.txt_attributeAdd.visible = true;
            // this.txt_attributeAdd.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.GoodAttributeItem.text01")+ " +"+addValue + "<font color='#00fffc'>"+addValueStr2 + "</font>" + 
            this.txt_attributeAdd.text += LangManager.Instance.GetTranslation("yishi.view.tips.goods.GoodAttributeItem.text03",newAddValue);
        }		
    }

    private getConciseValue(value:number,objectId:number):number
    {
        var addValue:number;
        if(objectId == ArmyManager.Instance.thane.id)
        {
            addValue = GoodsHelp.getConciseValue(value,ArmyManager.Instance.thane.conciseGrades);
        }else
        {
        }
        return addValue;
    }

    dispose()
    {
        super.dispose();
    }
}