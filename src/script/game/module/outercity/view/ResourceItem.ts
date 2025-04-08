// @ts-nocheck
import FUI_ResourceItem from "../../../../../fui/Base/FUI_ResourceItem";
import LangManager from "../../../../core/lang/LangManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export default class ResourceItem extends FUI_ResourceItem{
    private _info: GoodsInfo;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public get info(): GoodsInfo {
        return this._info;
    }

    public set info(value: GoodsInfo) {
        this._info = value;
        if (this._info) {
            if(this._info.templateInfo){
                this.nameTxt.text = this._info.templateInfo.TemplateNameLang + ": ";
            }
            this.valueTxt.text = LangManager.Instance.GetTranslation("OuterCityTreasureWnd.ResourceItem.valueTxt",this._info.count);
        }
        else{
            this.nameTxt.text = "";
            this.valueTxt.text = "";
        }
    }

    public dispose() {
        super.dispose();
    }
}