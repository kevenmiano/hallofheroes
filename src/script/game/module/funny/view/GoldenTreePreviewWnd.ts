import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { BottleModel } from "../model/BottleModel";
import { BottleManager } from "../../../manager/BottleManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import BottleItemInfoMsg = com.road.yishi.proto.item.BottleItemInfoMsg;
import { PlayerBagCell } from "../../../component/item/PlayerBagCell";
import { BaseItem } from "../../../component/item/BaseItem";
import Utils from "../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/22 19:32
 * @ver 1.0
 */
export class GoldenTreePreviewWnd extends BaseWindow {
    public list_rewards: fgui.GList;
    public list_boutique: fgui.GList;

    private _bottleShowIdArr: BottleItemInfoMsg[] = [];
    private _boutiqueGoodsArr: BottleItemInfoMsg[] = [];
    private _bottleShowGoods: GoodsInfo[] = [];
    private _boutiqueGoods: GoodsInfo[] = [];

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initEvent();
        this.initView();
        this.setCenter();
    }

    private initData() {
        this._bottleShowIdArr = this.bottleModel.nomalGoodsArr;
        this._boutiqueGoodsArr = this.bottleModel.boutiqueGoodsArr;
        for (let i: number = 0; i < this._bottleShowIdArr.length; i++) {
            let info: GoodsInfo = new GoodsInfo();
            info.templateId = this._bottleShowIdArr[i].tempId;
            info.count = this._bottleShowIdArr[i].count;
            this._bottleShowGoods.push(info);
        }
        for (let i: number = 0; i < this._boutiqueGoodsArr.length; i++) {
            let info: GoodsInfo = new GoodsInfo();
            info.templateId = this._boutiqueGoodsArr[i].tempId;
            info.count = this._boutiqueGoodsArr[i].count;
            this._boutiqueGoods.push(info);
        }
    }

    private initView() {
        this.list_rewards.numItems = this._bottleShowGoods.length;
        this.list_boutique.numItems = this._boutiqueGoods.length;
    }

    private initEvent() {
        this.list_rewards.setVirtual();
        this.list_boutique.setVirtual();

        this.list_rewards.displayObject["dyna"] = true;
        this.list_boutique.displayObject["dyna"] = true;

        Utils.setDrawCallOptimize(this.list_rewards);
        Utils.setDrawCallOptimize(this.list_boutique);

        this.list_rewards.itemRenderer = Laya.Handler.create(this, this.onListRender1, null, false);
        this.list_boutique.itemRenderer = Laya.Handler.create(this, this.onListRender2, null, false);
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private onListRender1(index: number, item: BaseItem) {
        item.info = this._bottleShowGoods[index];
    }

    private onListRender2(index: number, item: PlayerBagCell) {
        item.info = this._boutiqueGoods[index];
    }

    private get bottleModel(): BottleModel {
        return BottleManager.Instance.model;
    }

    private removeEvent() {
        // this.list_rewards.itemRenderer.recover();
        // this.list_boutique.itemRenderer.recover();
        Utils.clearGListHandle(this.list_rewards);
        Utils.clearGListHandle(this.list_boutique);
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._bottleShowIdArr = null;
        this._boutiqueGoodsArr = null;
        this._bottleShowGoods = null;
        this._boutiqueGoods = null;
        super.dispose(dispose);
    }
}