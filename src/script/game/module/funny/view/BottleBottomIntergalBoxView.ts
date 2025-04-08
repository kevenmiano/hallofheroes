import FUI_BottleBottomIntergalBoxView from "../../../../../fui/Funny/FUI_BottleBottomIntergalBoxView";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { EmWindow } from "../../../constant/UIDefine";
import { BottleModel } from "../model/BottleModel";
import { BottleManager } from "../../../manager/BottleManager";
import StringUtils from "../../../utils/StringUtils";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { FunnyContent } from "./FunnyContent";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/23 10:02
 * @ver 1.0
 */

export class BottleBottomIntergalBoxView extends FUI_BottleBottomIntergalBoxView implements ITipedDisplay {
    tipData: any;
    tipType: EmWindow;
    showType: TipsShowType;
    startPoint: Laya.Point = new Laya.Point(0, 0);

    private _index: number = -1;//0--4

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.tipType = EmWindow.BottleBottomIntergalBoxTips;
    }

    public set boxIndex(index: number) {
        ToolTipsManager.Instance.register(this);

        this._index = index;
        this.txt_floor.text = StringUtils.getRomanNumber(index + 1);
        this.tipData = this.bottleModel.countRewardArr[this._index];
    }

    public refreshStatus(): void {
        this.showType = TipsShowType.onClick;
        if (this.bottleModel.countRewardArr.length <= 0) {
            return;
        }
        if (this.bottleModel.openCount >= this.bottleModel.countRewardArr[this._index].param) {
            if (this.bottleModel.boxMarkArr[this._index] == 0)//可领取但是未领取
            {
                this.canAward.selectedIndex = 1;
                this.showType = TipsShowType.onLongPress;
            }
            else if (this.bottleModel.boxMarkArr[this._index] == 1)//已经领取
            {
                this.canAward.selectedIndex = 2;
            }
        }
    }

    private get bottleModel(): BottleModel {
        return BottleManager.Instance.model;
    }

    dispose() {
        ToolTipsManager.Instance.unRegister(this);
        this.tipData = null;
        super.dispose();
    }
}