// @ts-nocheck
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { SceneManager } from '../../map/scene/SceneManager';
import { MapBaseAction } from './MapBaseAction';
import LangManager from '../../../core/lang/LangManager';
import FreedomTeamSocketOutManager from '../../manager/FreedomTeamSocketOutManager';
import { SceneEvent } from '../../constant/event/NotificationEvent';
import { NotificationManager } from '../../manager/NotificationManager';
import InviteTipManager, { EmInviteTipType } from '../../manager/InviteTipManager';
/**
* @author:pzlricky
* @data: 2021-04-29 16:52
* @description *** 
*/
export default class FreedomTeamApplyAction extends MapBaseAction {

    private _isPop: boolean;
    private _id: number;
    private _msg: string;
    constructor(id: number, $msg: string) {
        super();
        this._id = id;
        this._msg = $msg;
    }

    prepare() {
        NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
        // SceneManager.Instance.lockScene = false;
    }

    update() {
        if (InviteTipManager.Instance.get(EmInviteTipType.Team, this._id.toString())) {
            this.actionOver()
            return
        }
        if (!this._isPop) {
            this.createApplyFrame(this._msg);
            this._isPop = true;
        }
    }

    private createApplyFrame(msg: string) {
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: LangManager.Instance.GetTranslation("BeingInviteWnd.txtNotAcceptInvite"), checkRickText2: " "  }, null, msg, null, null, this.__requestFrameCloseHandler.bind(this));
    }

    private __disposeHandler(evt: Event) {
        this.actionOver();
    }

    private __requestFrameCloseHandler(b: boolean, flag: boolean) {
        if (b) {
            FreedomTeamSocketOutManager.sendApplyInvite(this._id, true);
        }
        else {
            if (flag) {
                InviteTipManager.Instance.set(EmInviteTipType.Team, this._id.toString(), true)
            }
            FreedomTeamSocketOutManager.sendApplyInvite(this._id, false);
        }
        this.actionOver();
    }

}