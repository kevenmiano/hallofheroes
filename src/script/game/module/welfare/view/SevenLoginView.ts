// @ts-nocheck

import LangManager from '../../../../core/lang/LangManager';
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import WelfareCtrl from "../WelfareCtrl";
import WelfareData from "../WelfareData";
import SevenLoginInfo from '../data/SevenLoginInfo';
import SevenLoginBtnItem from "./component/SevenLoginBtnItem";
import FUI_SevenLogin from '../../../../../fui/Welfare/FUI_SevenLogin';

/**七日登录 */
export default class SevenLoginView extends FUI_SevenLogin {
    private _remainTime: number;
    public item1: SevenLoginBtnItem;
    public item2: SevenLoginBtnItem;
    public item3: SevenLoginBtnItem;
    public item4: SevenLoginBtnItem;
    public item5: SevenLoginBtnItem;
    public item6: SevenLoginBtnItem;
    public item7: SevenLoginBtnItem;

    private _rewardArr: Array<SevenLoginInfo>;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this._remainTime = (this.ctrlData.sevenLoginEndTime - PlayerManager.Instance.currentPlayerModel.sysCurtime.getTime()) / 1000;
        this.leftTimeTxt.text = DateFormatter.getSevenDateString(this._remainTime);
        this.initEvent();
        this.updateView();
    }

    initEvent() {
        if (this._remainTime > 0) {
            Laya.timer.loop(1000, this, this.__updateTimeHandler);
        }
        NotificationManager.Instance.addEventListener(NotificationEvent.SEVEN_LOGIN_REWARD_UPDATE, this.updateView, this);
    }

    removeEvent() {
        Laya.timer.clear(this, this.__updateTimeHandler);
        NotificationManager.Instance.removeEventListener(NotificationEvent.SEVEN_LOGIN_REWARD_UPDATE, this.updateView, this);
    }

    updateView() {
        this._rewardArr = this.ctrlData.sevenLoginRewardArr;
        let len = this._rewardArr.length;
        for (let i = 0; i < len; i++) {
            this["item" + (i + 1)].info = this._rewardArr[i];
            if (this.ctrlData.sevenLoginTotalDays == (i + 1)) {
                this["item" + (i + 1)].y = 100;
            }
        }
    }

    private __updateTimeHandler() {
        this._remainTime--;
        this.leftTimeTxt.text = DateFormatter.getSevenDateString(this._remainTime);
        if (this._remainTime <= 0) {
            Laya.timer.clear(this, this.__updateTimeHandler);
        }
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    private get ctrlData(): WelfareData {
        return this.control.data;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }

}