import FUI_SignInDayBtn from '../../../../../../fui/Welfare/FUI_SignInDayBtn';
import { PlayerEvent } from '../../../../constant/event/PlayerEvent';
import { PlayerInfo } from '../../../../datas/playerinfo/PlayerInfo';
import DayGuideManager from '../../../../manager/DayGuideManager';
import { PlayerManager } from '../../../../manager/PlayerManager';
import DayGuideCatecory from '../../data/DayGuideCatecory';
/**
* @author:pzlricky
* @data: 2021-06-24 18:20
* @description 签到界面中的日期格子
*/
export default class SignDateItem extends FUI_SignInDayBtn {

    private _date: Date;

    onConstruct() {
        super.onConstruct();
        this.displayObject.mouseEnabled = false;
    }

    private initEvent() {
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__changeHandler, this);
    }

    private removeEvent() {
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__changeHandler, this);
    }

    private __changeHandler(evtData) {
        this.date = this._date;
    }

    public get date(): Date {
        return this._date;
    }
    /**
     * 设置值（外部调用）
     * 根据是否当月的日期, 是否签到, 是否过期等设置格子的状态
     * */
    public set date(value: Date) {
        this._date = value;
        this.signEffect.selectedIndex = 0;
        this.title = this._date.getDate().toString();
        if (this._date.getMonth() < this.today.getMonth() || this._date.getMonth() > this.today.getMonth()) {//不是本月
            this.setIsSignState(false);
            this.setSignState(0);
            this.titleColor = '#553e2f';
        } else {//本月
            this.titleColor = '#FFECC6';
            this.setSignState(1);
            if (this._date.getDate() < this.today.getDate()) {
                this.setSignState(2);
            }
            if (this._date.getDate() == this.today.getDate()) {//今天
                this.setSignState(3);
            }
            // if (!this.cate.hasSigned(this._date)) {//没有签到
            //     if (this._date.getDate() == this.today.getDate()) {//今天
            //         this.initEvent();
            //     }
            // } else {//已经签到
            //     this.setIsSignState(true);
            // }
        }
    }

    /**设置签到状态 */
    private setIsSignState(value: boolean) {
        this.signed.selectedIndex = value ? 1 : 0;
    }

    /**设置签到状态 */
    private setSignState(value: number) {
        this.state.selectedIndex = value;
    }

    public showEffect() {
        this.signEffect.selectedIndex = 1;
    }

    private get cate(): DayGuideCatecory {
        return DayGuideManager.Instance.cate;
    }

    private get today(): Date {
        return PlayerManager.Instance.currentPlayerModel.sysCurtime;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }

}