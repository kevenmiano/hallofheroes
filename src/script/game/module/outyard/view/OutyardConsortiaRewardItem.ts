import FUI_OutyardConsortiaRewardItem from "../../../../../fui/OutYard/FUI_OutyardConsortiaRewardItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import OutyardRewardInfo from "../data/OutyardRewardInfo";

export default class OutyardConsortiaRewardItem extends FUI_OutyardConsortiaRewardItem {
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
            this.rankTxt.text = LangManager.Instance.GetTranslation("OutyardConsortiaRewardItem.rankTxt", this._info.rank);
            this.rewardList.numItems = this._info.goodsInfoArr.length;
            if (this.playerInfo.consortiaScoreRank >= this._info.rank) {
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