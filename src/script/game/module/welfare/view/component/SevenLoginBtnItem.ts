// @ts-nocheck
import SevenLoginInfo from "../../data/SevenLoginInfo";
import { BaseItem } from '../../../../component/item/BaseItem';
import { EmWindow } from "../../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import WelfareCtrl from "../../WelfareCtrl";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";
import FUI_SevenLoginBtnItem from "../../../../../../fui/Welfare/FUI_SevenLoginBtnItem";

export default class SevenLoginBtnItem extends FUI_SevenLoginBtnItem {
    private _info: SevenLoginInfo;
    //@ts-ignore
    public baseItem: BaseItem;
    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent() {
        this.getRewardBtn.onClick(this, this.getRewardHandler);
    }

    private removeEvent() {
        this.getRewardBtn.offClick(this, this.getRewardHandler);
    }

    private getRewardHandler() {
        if (this._info) {
            AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
            this.control.getSevenLoginReward(this._info.day);
        }
    }

    public set info(value: SevenLoginInfo) {
        this._info = value;
        if (!this._info) {
            this.clear();
        }
        else {
            this.refreshView();
        }
    }

    clear() {
        this.baseItem.info = null;
        this.btnStatus.selectedIndex = 0;
    }

    refreshView() {
        this.dayTitleTxt.setVar("day",this._info.day.toString()).flushVars();
        this.baseItem.info = this._info.goodsInfo;
        this.btnStatus.selectedIndex = this._info.status;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}