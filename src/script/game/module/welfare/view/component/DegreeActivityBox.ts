import FUI_DegreeActivityBox from '../../../../../../fui/Welfare/FUI_DegreeActivityBox';
import AudioManager from '../../../../../core/audio/AudioManager';
import { SoundIds } from '../../../../constant/SoundIds';
import { EmPackName, EmWindow } from '../../../../constant/UIDefine';
import { ITipedDisplay, TipsShowType } from '../../../../tips/ITipedDisplay';
import DegreeActivityBoxData from '../../data/DegreeActivityBoxData';
import FUIHelper from '../../../../utils/FUIHelper';
import { ToolTipsManager } from '../../../../manager/ToolTipsManager';
import Logger from '../../../../../core/logger/Logger';
import DayGuideSocketOutManager from '../../../../manager/DayGuideSocketOutManager';
/**
* @author:pzlricky
* @data: 2021-06-30 19:25
* @description 活跃度宝箱 
*/
export default class DegreeActivityBox extends FUI_DegreeActivityBox implements ITipedDisplay {

    public static DEFAULT: number = 1;//还未到条件领取
    public static OPEN: number = 2;//可领取
    public static CLOSE: number = 3;//已领取

    public index: number = 0;
    private _boxdata: any = null;
    private _state: number = 1;

    tipType: EmWindow = EmWindow.CommonTips;
    tipData: any;
    showType?: TipsShowType = TipsShowType.onClick;
    canOperate?: boolean;
    extData?: any;
    startPoint?: Laya.Point = new Laya.Point(0, 0);
    tipDirctions?: string;
    tipGapV?: number;
    tipGapH?: number;


    onConstruct() {
        super.onConstruct();
        this.onEvent();
    }

    onEvent() {
        this.onClick(this, this.onBoxClick);
    }

    offEvent() {
        ToolTipsManager.Instance.unRegister(this);
        this.offClick(this, this.onBoxClick);
    }

    public set boxdata(value: DegreeActivityBoxData) {
        this._boxdata = value;
        this.count.text = value.point.toString();
        this.iconBox.url = FUIHelper.getItemURL(EmPackName.Base, "Icon_Box_Dev" + (value.index + 1));
        this.tipData = value.tipData;
    }

    public set state(value: number) {
        this._state = value;
        switch (value) {
            case DegreeActivityBox.DEFAULT:
                this.iconBox.grayed = false;
                this.effect.selectedIndex = 0;
                ToolTipsManager.Instance.register(this);
                break;
            case DegreeActivityBox.OPEN:
                this.iconBox.grayed = false;
                this.effect.selectedIndex = 1;
                break;
            case DegreeActivityBox.CLOSE:
                this.iconBox.grayed = true;
                this.effect.selectedIndex = 0;
                ToolTipsManager.Instance.register(this);
                break;
        }
    }

    onBoxClick(evt: Laya.Event) {
        Logger.warn('领取宝箱!!!');
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if (this._state == DegreeActivityBox.OPEN) {//领取宝箱奖励
            DayGuideSocketOutManager.sendGetGoods(this._boxdata.index + 1);
            evt.stopPropagation();
        }
    }

    dispose() {
        this.offEvent();
        super.dispose();
    }

}