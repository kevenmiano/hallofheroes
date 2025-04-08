import {ThaneInfo} from "../../../../datas/playerinfo/ThaneInfo";
import {GvgReadyController} from "../../control/GvgReadyController";
import {FrameCtrlManager} from "../../../../mvc/FrameCtrlManager";
import {EmWindow} from "../../../../constant/UIDefine";
import {ConsortiaEvent} from "../../../../constant/event/NotificationEvent";
import AudioManager from "../../../../../core/audio/AudioManager";
import {SoundIds} from "../../../../constant/SoundIds";
import {GvgTeamEditType} from "../../data/gvg/GvgTeamEditType";
import {ConsortiaManager} from "../../../../manager/ConsortiaManager";
import FUI_GvgAddMembersItem from "../../../../../../fui/Consortia/FUI_GvgAddMembersItem";
import {JobType} from "../../../../constant/JobType";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/22 17:09
 * @ver 1.0
 */
export class GvgAddMembersItem extends FUI_GvgAddMembersItem
{
    private _info:ThaneInfo;
    private _controller:GvgReadyController;

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();
        this._controller = FrameCtrlManager.Instance.getCtrl(EmWindow.GvgRankListWnd) as GvgReadyController;
        this.addEvent();
    }

    private addEvent():void
    {
        this._addBtn.onClick(this, this.onAddBtnClick);
        this._info && this._info.addEventListener(ConsortiaEvent.UPDE_MEMEBER_STATE, this.__memberStateChangeHandler, this);
    }

    private removeEvent():void
    {
        this._addBtn.offClick(this, this.onAddBtnClick);
        this._info && this._info.removeEventListener(ConsortiaEvent.UPDE_MEMEBER_STATE, this.__memberStateChangeHandler, this);
    }

    private onAddBtnClick():void
    {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this._controller.sendGvgTeamEdit(this._info.userId, GvgTeamEditType.ADD_TEAM, GvgTeamEditType.CANNEL_MANAGER);
    }

    private __memberStateChangeHandler():void
    {
        if(this._info)
        {
            this.state.selectedIndex = this._info.isOnline ? 0 : 1;
        }
    }

    get info():ThaneInfo
    {
        return this._info;
    }

    set info(value:ThaneInfo)
    {
        this._info = value;

        if(this._info)
        {
            this._jobIcon.icon = JobType.getJobIcon(this._info.job);
            this._vipIcon.visible = this.isVip;
            this.txt_name.text = this._info.nickName;
            this.txt_lv.text = String(this._info.grades);
            this.txt_power.text = String(this._info.fightingCapacity);
            let chairmanID:number = ConsortiaManager.Instance.model.consortiaInfo.chairmanID;
            this._addBtn.visible = !(this._info.isTeamPlayer || this._info.userId == chairmanID);
            this.state.selectedIndex = this._info.isOnline ? 0 : 1;
            // this._info.vipType == 1? this._vipIcon.setFrame(1):this._vipIcon.setFrame(2);
        }
    }

    private get isVip():boolean
    {
        return this._info.IsVipAndNoExpirt;
    }

    dispose()
    {
        this._controller = null;
        this.removeEvent();
        super.dispose();
    }
}