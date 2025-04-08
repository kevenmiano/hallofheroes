// @ts-nocheck
import FUI_OutyardPersonRewardItem from "../../../../../fui/OutYard/FUI_OutyardPersonRewardItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import OutyardRewardInfo from "../data/OutyardRewardInfo";

export default class OutyardPersonRewardItem extends FUI_OutyardPersonRewardItem {
    private _info: OutyardRewardInfo;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent() {
        this.rewardList.itemRenderer = Laya.Handler.create(this, this.renderRewardListItem, null, false);
    }

    private removeEvent() {
        this.rewardList.itemRenderer = Laya.Handler.create(this, this.renderRewardListItem, null, false);
    }

    private renderRewardListItem(index: number, item: BaseItem) {
        Utils.setDrawCallOptimize(item);
        item.info = this._info.goodsInfoArr[index];
    }

    public get info(): OutyardRewardInfo {
        return this._info;
    }

    public set info(value: OutyardRewardInfo) {
        this._info = value;
        if (this._info) {
            if (this.playerInfo.outyardCostEnergy > this._info.cost) {
                this.costTxt.text = LangManager.Instance.GetTranslation("OutyardPersonRewardItem.costTxt", this._info.cost, this._info.cost, this._info.cost);
            }
            else {
                this.costTxt.text = LangManager.Instance.GetTranslation("OutyardPersonRewardItem.costTxt", this._info.cost, this.playerInfo.outyardCostEnergy, this._info.cost);
            }
            this.rewardList.numItems = this._info.goodsInfoArr.length;
            if (this.playerInfo.outyardCostEnergy >= this._info.cost) {
                this.c1.selectedIndex = 1;
            } else {
                this.c1.selectedIndex = 0;
            }
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }
}