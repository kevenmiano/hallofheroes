import FUI_SmallMapPlayerItem from "../../../../../fui/OuterCity/FUI_SmallMapPlayerItem";
import { IconFactory } from "../../../../core/utils/IconFactory";
import Utils from "../../../../core/utils/Utils";
import { IconType } from "../../../constant/IconType";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import { TipsShowType } from "../../../tips/ITipedDisplay";
/**
 * 小地图上面的人物显示
 */
export default class SmallMapPlayerItem extends FUI_SmallMapPlayerItem {
    private _baseArmy: BaseArmy;
    tipData: any;
    tipType: EmWindow;
    alphaTest: boolean = true;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this);
    }

    public set headId(value: number) {
        this.com.getChild("imgHead").icon = IconFactory.getPlayerIcon(value, IconType.HEAD_ICON);
    }

    public set info(value: BaseArmy) {
        if (value) {
            this._baseArmy = value;
            if (this._baseArmy.baseHero.userId != PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
                ToolTipsManager.Instance.register(this);
                this.tipType = EmWindow.OuterCityMapPlayerTips;
                this.tipData = this._baseArmy;
            }
        }
        else {
            ToolTipsManager.Instance.unRegister(this);
            this.tipData = null;
        }
    }

    dispose() {
        ToolTipsManager.Instance.unRegister(this);
        super.dispose();
    }
}