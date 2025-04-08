// @ts-nocheck
import FUI_HookItem from '../../../../../fui/Hook/FUI_HookItem';
import HookInfo from '../data/HookInfo';
import UIButton from '../../../../core/ui/UIButton';
import { HookManager } from '../../../manager/HookManager';
import BaseTipItem from '../../../component/item/BaseTipItem';
import TemplateIDConstant from '../../../constant/TemplateIDConstant';


/**
* @author:pzlricky
* @data: 2021-11-29 11:19
* @description 修行神殿渲染Cell
*/
export default class HookItem extends FUI_HookItem {

    private _cellValue: HookInfo;
    //@ts-ignore
    public tipItem:BaseTipItem;
    onConstruct() {
        super.onConstruct();
        this.onEvent();
        let btnReward = new UIButton(this.getRewardBtn);
        let btnReceive = new UIButton(this.receiveBtn);
        this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_POWER);
    }

    private onEvent() {
        this.getRewardBtn.onClick(this, this.onGetRewardHandler)
        this.receiveBtn.onClick(this, this.onGetRewardHandler)
    }

    private offEvent() {
        this.getRewardBtn.offClick(this, this.onGetRewardHandler);
        this.receiveBtn.offClick(this, this.onGetRewardHandler)
    }

    public set cellValue(value: HookInfo) {
        this._cellValue = value;
        if (value) {
            this.txt_time.text = value.time;
            this.txt_stamina.text = value.hookValue.toString();
            this.state.selectedIndex = Number(value.state) - 1;
        }
    }

    public get cellValue(): HookInfo {
        return this._cellValue;
    }

    /**领取体力 */
    private onGetRewardHandler() {
        if (!this._cellValue) return;
        HookManager.Instance.receiveHookByIndex(this._cellValue.pos);
    }

}