// @ts-nocheck
import FUI_FoisonHornItem from "../../../../../fui/Funny/FUI_FoisonHornItem";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FoisonHornManager from "../../../manager/FoisonHornManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import FoisonHornModel from "../../../mvc/model/FoisonHornModel";

export default class FoisonHornItem extends FUI_FoisonHornItem {
    private _info: GoodsInfo;
    private _index: number = 0;
    private _canActive: boolean = false;
    public baseIcon: BaseItem;
    protected onConstruct() {
        super.onConstruct();
    }

    public set index(index: number) {
        this._index = index;
    }

    public get index(): number {
        return this._index;
    }

    public set info(value: GoodsInfo) {
        this._info = value;
        if (this._info) {
            this.refreshView();
        }
    }

    private refreshView() {
        this._canActive = false;
        if (this._index > -1 && this._index < this.foisonHornModel.goodsList.length) {
            this.baseIcon.info = this._info;
            var count: number = GoodsManager.Instance.getGoodsNumByTempId(this._info.templateId);
            this.countTxt.text = count + "/" + this._info.count;
            if (this.isActivated) {
                UIFilter.normal(this.baseIcon);
                this.countTxt.color = "#16F01B";
                this.countTxt.text = "";
            }
            else {
                UIFilter.gray(this.baseIcon);
                if (count >= this._info.count) {
                    this._canActive = true;
                    this.countTxt.color = "#16F01B";
                }
                else {
                    this.countTxt.color = "#ff0000";
                }
            }
        }
    }

    public get isActivated(): boolean {
        if (this._index > -1 && this._index < this.foisonHornModel.goodsList.length) {
            return this.foisonHornModel.activatingList[this._index] == 1;
        }
        return false;
    }

    public get canActive(): boolean {
        return this._canActive;
    }

    private get foisonHornModel(): FoisonHornModel {
        return FoisonHornManager.Instance.model;
    }

    dispose() {
        super.dispose();
    }
}