import FUI_WarlordsWinPrizesItem from "../../../../../../fui/Warlords/FUI_WarlordsWinPrizesItem";
import { BaseItem } from "../../../../component/item/BaseItem";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import WarlordsPlayerInfo from "../../WarlordsPlayerInfo";

export default class WarlordsWinPrizesItem extends FUI_WarlordsWinPrizesItem {
    private _info: WarlordsPlayerInfo;
    public baseItem:BaseItem;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public get woundInfo(): WarlordsPlayerInfo {
        return this._info;
    }

    public set info(value: WarlordsPlayerInfo) {
        this._info = value;
        if (this._info) {
            this.updateView();
        }
        else {
            this.nickNameTxt.text = "";
            this.baseItem.info = null;
        }
    }

    private updateView() {
        this.nickNameTxt.text = this._info.nickname;
        let goodsInfo = new GoodsInfo();
        goodsInfo.templateId = -800;
        goodsInfo.count = this._info.awardGolds;
        this.baseItem.info = goodsInfo;
    }

    public dispose() {
        super.dispose();
    }
}