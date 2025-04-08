import FUI_BottleBottomIntergalBox from "../../../../../fui/Funny/FUI_BottleBottomIntergalBox";
import { BottleBottomIntergalBoxView } from "./BottleBottomIntergalBoxView";
import { BottleManager } from "../../../manager/BottleManager";
import { BottleModel } from "../model/BottleModel";
import { FunnyContent } from "./FunnyContent";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/4/7 15:02
 * @ver 1.0
 */
export class BottleBottomIntergalBox extends FUI_BottleBottomIntergalBox {
    //@ts-ignore
    public box: BottleBottomIntergalBoxView;
    private _index: number = -1;//0--4

    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent() {
        this.g_click.onClick(this, this.onReceiveItemClick);
    }

    private onReceiveItemClick() {
        if (this._index >= 0 && this.bottleModel.openCount >= this.bottleModel.countRewardArr[this._index].param && this.bottleModel.boxMarkArr[this._index] == 0) {
            BottleManager.Instance.sendOpenInfo(5, this.bottleModel.countRewardArr[this._index].param);
            this.bottleModel.clickBoxIndex = this._index;
        }
    }

    public set boxIndex(index: number) {
        this._index = index;

        this.box.boxIndex = index;
    }

    public refreshStatus(): void {
        this.box.refreshStatus();

        if (this.bottleModel.countRewardArr.length <= 0) {
            return;
        }
        if (this.bottleModel.openCount >= this.bottleModel.countRewardArr[this._index].param) {
            if (this.bottleModel.boxMarkArr[this._index] == 0)//可领取但是未领取
            {
                this.state.selectedIndex = 0;
            }
            else {
                this.state.selectedIndex = 1;
            }
        }
        else {
            this.state.selectedIndex = 1;
        }
    }

    private get bottleModel(): BottleModel {
        return BottleManager.Instance.model;
    }

    private removeEvent() {
        this.g_click.offClick(this, this.onReceiveItemClick);
    }

    dispose() {
        this.removeEvent();

        super.dispose();
    }
}