import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { t_s_campaignData } from "../../config/t_s_campaign";
import { CampaignMapEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { CampaignManager } from "../../manager/CampaignManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import PvpWarFightInfo from "./data/PvpWarFightInfo";


/**
 * 战场顶部中间阵营信息显示
 */
export default class RvrBattleMapTopCenterWnd extends BaseWindow {
    private _mapModel: CampaignMapModel;
    private _currentLeftOpenTime: number;
    private _currentLeftOffTime: number;
    private leftOffTimeGroup: fgui.GGroup;
    private leftOffTimeTitle: fgui.GTextField;
    private leftOffTimeTxt: fgui.GTextField;
    private leftTimeTitle: fgui.GTextField;
    private leftTimeTxt: fgui.GTextField;
    public c1: fgui.Controller;
    public timeCtr: fgui.Controller;
    public bg: fgui.GImage;
    private _openTime: number = 10;
    private _pvpWarFightInfo: PvpWarFightInfo;
    private _playerModel: PlayerModel;
    private _flag: boolean = false;
    public OnInitWind() {
        super.OnInitWind();
        PlayerManager.Instance.synchronizedSystime();
        this._mapModel = CampaignManager.Instance.mapModel;
        this._playerModel = PlayerManager.Instance.currentPlayerModel;
        this._pvpWarFightInfo = CampaignManager.Instance.pvpWarFightModel.pvpWarFightInfo;
        this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
        this.y = 0;
        this.c1 = this.getController('c1');
        this.timeCtr = this.getController('timeCtr');
        this.initEvent();
    }

    OnShowWind() {
        super.OnShowWind();
        this.initData();
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    private initEvent() {
        if (this._mapModel) this._mapModel.addEventListener(CampaignMapEvent.SYNC_ERROR_TIME, this.syncErrorTimeHandler, this);
        if (this._mapModel) this._mapModel.addEventListener(CampaignMapEvent.OPENTIME_MV, this.openTimeHandler, this);
        if (this._playerModel) this._playerModel.addEventListener(NotificationEvent.UPDATE_SYSTEM_TIME, this.updateTimeView, this);
    }

    private removeEvent() {
        if (this._mapModel) this._mapModel.removeEventListener(CampaignMapEvent.SYNC_ERROR_TIME, this.syncErrorTimeHandler, this);
        if (this._mapModel) this._mapModel.removeEventListener(CampaignMapEvent.OPENTIME_MV, this.openTimeHandler, this);
        if (this._playerModel) this._playerModel.removeEventListener(NotificationEvent.UPDATE_SYSTEM_TIME, this.updateTimeView, this);
        Laya.timer.clear(this, this.updateOpenTimeHandler);
        Laya.timer.clear(this, this.updateOffTimeHandler);
        Laya.timer.clear(this, this.updateTimeHandler2);
    }

    private updateTimeView() {
        if (!this._flag) {
            this.updateTime();
            this._flag = true;
        }
    }

    public initData() {
        this.leftOffTimeTitle.text = LangManager.Instance.GetTranslation("securitycode.view.TimeDownTxt") + ": ";
        this.leftTimeTitle.text = LangManager.Instance.GetTranslation("RvrBattleMapTopCenterWnd.leftTimeTitle.text");
    }

    private syncErrorTimeHandler() {
        var vFlaushTime: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.pvpmap.PvpMapTopCenterView.vFlaushTime");
        MessageTipManager.Instance.show(vFlaushTime + ": " + CampaignManager.Instance.mapModel.syncErrorTime);
        this.updateTime();
    }

    private updateTime() {
        this._currentLeftOpenTime = this.openTime;
        this._currentLeftOffTime = this.offTime;
        if (this._currentLeftOpenTime > 0) {//还未开始, 显示开始倒计时
            Laya.timer.loop(1000, this, this.updateOpenTimeHandler);
            this.c1.selectedIndex = 0;//显示下面的开始倒计时
        } else {
            this.c1.selectedIndex = 1;//不显示下面的倒计时
            this.leftOffTimeGroup.visible = this._currentLeftOffTime > 0;
            if (this._currentLeftOffTime > 0) {
                Laya.timer.loop(1000, this, this.updateOffTimeHandler);
            }
        }
    }

    private updateOpenTimeHandler() {
        this.leftTimeTxt.text = DateFormatter.getSevenDateString(this._currentLeftOpenTime);
        this._currentLeftOpenTime--;
        if (this._currentLeftOpenTime <= 0) {
            Laya.timer.clear(this, this.updateOpenTimeHandler);
            this.c1.selectedIndex = 1;//不显示下面的倒计时了;
        }
    }

    private updateOffTimeHandler() {
        if (this.leftOffTimeTxt && !this.leftOffTimeTxt.isDisposed)
            this.leftOffTimeTxt.text = DateFormatter.getSevenDateString(this._currentLeftOffTime);
        this._currentLeftOffTime--;
        this.leftOffTimeGroup.visible = this._currentLeftOffTime > 0;
        if (this._currentLeftOffTime < 0) {
            Laya.timer.clear(this, this.updateOffTimeHandler);
            this.leftOffTimeGroup.visible = false;
        }
    }

    private openTimeHandler() {
        this.c1.selectedIndex = 1;//不显示下面的倒计时了
        Laya.timer.loop(1000, this, this.updateTimeHandler2);
    }

    private updateTimeHandler2() {
        this._openTime--;
        this.timeCtr.selectedIndex = this._openTime;
        if (this._openTime <= 0) {
            this.timeCtr.selectedIndex = 0;
            Laya.timer.clear(this, this.updateTimeHandler2);

            this._currentLeftOffTime = this.offTime;
            this.c1.selectedIndex = 1;//不显示下面的倒计时
            if (this._currentLeftOffTime > 0) {
                Laya.timer.loop(1000, this, this.updateOffTimeHandler);
            }
        }
    }

    /**
     *获得现在离战场开始时间 
     * @return 
     * 
     */
    private get openTime(): number {
        if (!CampaignManager.Instance.mapModel) return 0;
        var curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;;
        var cTemp: t_s_campaignData = CampaignManager.Instance.mapModel.campaignTemplate;
        var openArr: Array<any> = cTemp.OpenTime.split(":");
        var openDate: Date = new Date();
        openDate.setTime(curTime);
        openDate.setHours(parseInt(openArr[0]));
        openDate.setMinutes(parseInt(openArr[1]));
        openDate.setSeconds(0);
        var openTimes: number = openDate.getTime() - curTime + CampaignManager.Instance.mapModel.syncErrorTime * 1000;
        return openTimes * 0.001;
    }

    /**
         *获得现在离战场结束时间 
         * @return 
         * 
         */
    private get offTime(): number {
        var curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;;
        var cTemp: t_s_campaignData = CampaignManager.Instance.mapModel.campaignTemplate;
        var arr: Array<any> = cTemp.StopTime.split(":");
        var curDate: Date = new Date();
        curDate.setTime(curTime);
        curDate.setHours(parseInt(arr[0]));
        curDate.setMinutes(parseInt(arr[1]));
        curDate.setSeconds(0);
        var offTime: number = curDate.getTime() - curTime + CampaignManager.Instance.mapModel.syncErrorTime * 1000;
        return offTime * 0.001;
    }

    dispose(dispose?: boolean) {
        Laya.timer.clear(this, this.updateTimeHandler2);
        this._currentLeftOpenTime = 0;
        super.dispose(dispose);
    }
}