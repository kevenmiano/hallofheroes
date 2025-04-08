
import FUI_CarnivalRechargeItem from "../../../../../fui/Carnival/FUI_CarnivalRechargeItem";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_carnivalluckdrawData } from "../../../config/t_s_carnivalluckdraw";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import CarnivalManager from "../../../manager/CarnivalManager";
import CarnivalModel, { CARNIVAL_FOLDER } from "../model/CarnivalModel";

export class CarnivalRechargeItem extends FUI_CarnivalRechargeItem {


    declare public _item: BaseItem;

    private _tempInfo: t_s_carnivalluckdrawData;

    private _isLight = false;

    private _type = 0;

    private TYPE_GOODS = 1;

    public idx = 0;


    public init(type: number) {
        this.Icon_Carnival.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.RECHARGE, "Icon_Carnival");
        this._type = type;
        this._item.visible = type == this.TYPE_GOODS;
        this._luckGroup.visible = !this._item.visible;
        this.isLight = false;
        this.typeCtrl.selectedIndex = type;
    }

    public set isLight(v: boolean) {
        this._isLight = v;
        this._lightImg.visible = v;
    }

    public get isLight() {
        return this._isLight;
    }

    public set tempInfo(v: t_s_carnivalluckdrawData) {
        this._tempInfo = v;
        if (this._tempInfo && this._type == this.TYPE_GOODS) {
            let g = new GoodsInfo();
            g.templateId = this._tempInfo.Item;
            g.count = this._tempInfo.ItemNum;
            this._item.info = g;
        }
        this.init(v ? 1 : 0);
    }

    public get tempInfo() {
        return this._tempInfo;
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

}