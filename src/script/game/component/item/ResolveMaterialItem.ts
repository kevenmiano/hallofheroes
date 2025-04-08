import {BaseItem} from "./BaseItem";
import {GoodsInfo} from "../../datas/goods/GoodsInfo";
import FUI_ResolveMaterialItem from "../../../../fui/Base/FUI_ResolveMaterialItem";
import { EmWindow } from "../../constant/UIDefine";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/2 15:52
 * @ver 1.0
 *
 */
export class ResolveMaterialItem extends FUI_ResolveMaterialItem
{
    public item:BaseItem;
    private _goodsTemId:number;
    private _bindsType:boolean;

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();
        this.item.tipType = EmWindow.ForgeEquipTip;
    }

    public setData(goodsTemId:number, isBind:boolean = false, count:number = 1)
    {
        this._goodsTemId = goodsTemId;
        this._bindsType = isBind;
        if(this._goodsTemId > 0)
        {
            let goods:GoodsInfo = new GoodsInfo();
            goods.templateId = this._goodsTemId;
            goods.id = -1;
            goods.isBinds = isBind;
            goods.count = count;
            this.item.info = goods;
            this.txt.visible = false;
        }
        else
        {
            this.item.info = null;
            this.txt.visible = true;
        }
    }

    public get goodsTemId():number
    {
        return this._goodsTemId;
    }

    get bindsType():boolean
    {
        return this._bindsType;
    }

    dispose()
    {
        this.item.dispose();
        super.dispose();
    }
}