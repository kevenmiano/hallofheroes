import FUI_ConsortiaAltarItem from "../../../../../../fui/Consortia/FUI_ConsortiaAltarItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { t_s_dropviewData } from "../../../../config/t_s_dropview";

export default class ConsortiaAltarItem extends FUI_ConsortiaAltarItem {
    private _info: t_s_dropviewData;
    private _selected: boolean;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set info(vInfo: t_s_dropviewData) {
        this._info = vInfo;
        this.refreshView();
    }

    public get info(): t_s_dropviewData {
        return this._info
    }
    private refreshView() {
        if (this._info) {
            (this.goodsItem.getChildAt(0) as fgui.GLoader).url = IconFactory.getTecIconByIcon(this._info.Res);
        }
        else {
            (this.goodsItem.getChildAt(0) as fgui.GLoader).url = null;
        }
    }

    public set selected(value: boolean) {
        this._selected = value;
        if(this._selected){
            this.showPic.selectedIndex = 1;
        }
        else{
            this.showPic.selectedIndex = 0;
        }
    }

    public  play() {
        this.selectedMc.play();
    }
    
    dispose() {
        super.dispose();
    }
}