import FUI_PetSaveItem from "../../../../../../fui/Pet/FUI_PetSaveItem";
import { BaseItem } from "../../../../component/item/BaseItem";
import { ItemSelectState } from "../../../../constant/Const";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { PetData } from "../../data/PetData";

export class PetSaveItem extends FUI_PetSaveItem {
    private _info: PetData;

    constructor() {
        super();
    }

    protected onConstruct(): void {
        super.onConstruct();
    }

    public set info(v: PetData) {
        this._info = v;
        this.updateView();
    }

    public get info() {
        return this._info;
    }

    private updateView() {
        if (!this._info) return;
        let gInfo = new GoodsInfo();
        gInfo.petData = this._info;
        let baseItem = this.item as BaseItem;
        baseItem.info = gInfo;
        this.txt_petname.text = this._info.name;
		this.txt_petname.color = PetData.getQualityColor(this._info.quality - 1);
		this.txt_petsword.text = this._info.fightPower.toString();
    }

    private _selectState: ItemSelectState = ItemSelectState.Default;
    public get selectState(): ItemSelectState {
        return this._selectState
    }

    /**
     * 分解选中状态
     */
    public set selectState(value: ItemSelectState) {
        this._selectState = value;
        if (!this._info) return;
        switch (value) {
            case ItemSelectState.Default:
                // this.item.touchable = true;
                this.c1.selectedIndex = 0;
                break;
            case ItemSelectState.Selectable:
                // this.item.touchable = false;
                this.c1.selectedIndex = 1;
                
                break;
            case ItemSelectState.Selected:
                // this.item.touchable = false;
                this.c1.selectedIndex = 2;
                break;
            default:
                break;
        }
    }


}