import FUI_SevenGoalsBoxItem from "../../../../fui/SevenTarget/FUI_SevenGoalsBoxItem";
import AudioManager from "../../../core/audio/AudioManager";
import StringHelper from "../../../core/utils/StringHelper";
import { BaseItem } from "../../component/item/BaseItem";
import { SoundIds } from "../../constant/SoundIds";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import SevenGoalsManager from "../../manager/SevenGoalsManager";
import SevenTreasureInfo from "../welfare/data/SevenTreasureInfo";
import SevenGoalsModel from "./SevenGoalsModel";

/**积分礼包项 */
export default class SevenGoalsBoxItem extends FUI_SevenGoalsBoxItem {
    private _info: SevenTreasureInfo;
    private _stauts: number;
    //@ts-ignore
    public baseItem: BaseItem;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
    }

    private initEvent() {
        this.baseItem && this.baseItem.onClick(this, this.getBoxRewardHander);
    }

    private removeEvent() {
        this.baseItem && this.baseItem.offClick(this, this.getBoxRewardHander);
    }

    public set info(value: SevenTreasureInfo) {
        this._info = value;
        this.refreshView();
    }

    private refreshView() {
        if (this._info) {
            this.countValueTxt.text = this._info.integral.toString();
            this._stauts = this.sevenGoalsModel.checkGoalsBox(this._info.id, this._info.integral);
            this.baseItem.grayed = false;
            this.c1.selectedIndex = 0;
            if (this._stauts == 3)//已经领取
            {
                this.baseItem.grayed = true;
            }
            else if (this._info.integral <= this.sevenGoalsModel.starNum)//可领取
            {
                this.c1.selectedIndex = 1;
            }
            this.baseItem.info = this.getInfo();
        }
    }

    private getInfo(): GoodsInfo {
        if (this._info && !StringHelper.isNullOrEmpty(this._info.item)) {
            let strArr: Array<string> = this._info.item.split(",");
            var goodsInfo: GoodsInfo = new GoodsInfo();
            if (strArr && strArr.length == 2) {
                goodsInfo.templateId = Number(strArr[0]);
                goodsInfo.count = Number(strArr[1]);
            }
            return goodsInfo;
        }
        else {
            return null;
        }
    }

    /**领取宝箱奖励 */
    private getBoxRewardHander() {
        if (this._info) {
            AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
            if (this._stauts == 1) {//可领取宝箱奖励
                SevenGoalsManager.Instance.getBoxBagReward(1, this._info.id);
            }
        }
    }

    private get sevenGoalsModel():SevenGoalsModel{
        return SevenGoalsManager.Instance.sevenGoalsModel;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}