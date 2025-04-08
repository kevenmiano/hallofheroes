import LangManager from "../../../core/lang/LangManager";
import { AlertBtnType } from "../../component/SimpleAlertHelper";
import { OuterCityEvent, PK_Event } from "../../constant/event/NotificationEvent";
import { SpaceAttackOP } from "../../constant/SpaceAttackOP";
import IMediator from "../../interfaces/IMediator";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { SharedManager } from "../../manager/SharedManager";
import SpaceArmy from "../space/data/SpaceArmy";
import SpaceManager from "../space/SpaceManager";
import SpacePKAlert from "../space/view/SpacePKAlert";
import { SceneManager } from "./SceneManager";
import SceneType from "./SceneType";


import HangupAttackMsg = com.road.yishi.proto.campaign.HangupAttackMsg;
import Logger from "../../../core/logger/Logger";
import InviteTipManager, { EmInviteTipType } from "../../manager/InviteTipManager";

export default class SpacePKMediator implements IMediator {

    private _pkStack: Array<HangupAttackMsg> = [];
    private timerId: number = 0;
    private timerId2: number = 0;
    private _selfInfo: SpaceArmy;

    public register(target: Object) {
        this._pkStack = [];
        this._selfInfo = SpaceManager.Instance.model.selfArmy;
        NotificationManager.Instance.addEventListener(PK_Event.SPACE_PK, this.__onPKRequestHandler, this);
        SpaceManager.Instance.model.addEventListener(OuterCityEvent.REMOVE_ARMY, this.onRemoveArmy, this);
    }

    /**
     * 人物被移除
     */
    onRemoveArmy(target: SpaceArmy) {
        if (target)
            this.deletePreMsgByAttackId(target.userId);
    }

    private __onPKRequestHandler(msg: HangupAttackMsg) {

        if (SharedManager.Instance.refuseInvitation) {
            this.refuseThisRequest(msg);
            return;
        }

        if (msg.op == SpaceAttackOP.ATTACK &&
            msg.attackId != this._selfInfo.userId) {  //发起挑战
            if (this.timerId2 != 0) {
                this._pkStack.push(msg);
                clearTimeout(this.timerId2);
            } else {
                this.clear();
            }

            this.deletePreMsgByAttackId(msg.attackId);
            this.timerId2 = setTimeout(this.alertMsg.bind(this), 300, msg);
        } else if (msg.op == SpaceAttackOP.PET_ATTACK
            && msg.attackId != this._selfInfo.userId) {
            if (this.timerId2 != 0) {
                this._pkStack.push(msg);
                clearTimeout(this.timerId2);
            } else {
                this.clear();
            }
            this.deletePreMsgByAttackId(msg.attackId);
            this.timerId2 = setTimeout(this.petPKAlertMsg.bind(this), 300, msg);
        }
    }

    /** 删除之前的请求 */
    private deletePreMsgByAttackId(id: number) {
        var i: number = 0;
        while (i < this._pkStack.length) {
            if (this._pkStack[i].attackId == id) {
                this._pkStack.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    private petPKAlertMsg(msg: HangupAttackMsg) {
        clearTimeout(this.timerId2);
        this.timerId2 = 0;
        if (SceneManager.Instance.currentType != SceneType.SPACE_SCENE) return;
        if (msg == null) return;
        // Logger.info("petPKAlertMsg", msg)

        let key = this.getAttackerKey(msg)
        if (InviteTipManager.Instance.get(EmInviteTipType.PetPK, key)) {
            return
        }

        let title = LangManager.Instance.GetTranslation("public.prompt");
        let submitLabel = LangManager.Instance.GetTranslation("map.campaign.view.frame.PrepareBattleFrame1.accept");
        let cancelLabel = LangManager.Instance.GetTranslation("map.campaign.view.frame.PrepareBattleFrame1.reject");
        let content = LangManager.Instance.GetTranslation("map.hookMap.command02", msg.attackName);
        let data = {
            callback: this.onAlertCall.bind(this),
            msg: msg,
            check: true,
            checkRickText: LangManager.Instance.GetTranslation("BeingInviteWnd.txtNotAcceptInvite")
        }
        SpacePKAlert.Instance.Show(data, title, content, submitLabel, cancelLabel, this.onPetPKAlertCall.bind(this), AlertBtnType.OC);

        if (this.timerId != 0) clearTimeout(this.timerId);
        this.timerId = setTimeout(this.clear.bind(this), SpaceManager.PKInviteAlertShowTime, false);
    }

    /** 弹窗 */
    private alertMsg(msg: HangupAttackMsg) {
        clearTimeout(this.timerId2);
        this.timerId2 = 0;
        if (SceneManager.Instance.currentType != SceneType.SPACE_SCENE) return;
        // if (FrameCtrlManager.Instance.outyardControler.isOutyardMapApply) return;
        // if (FrameCtrlManager.Instance.landMineController.isInLandMineFrame) return;
        if (msg == null) return;
        // Logger.info("alertMsg", msg)

        let key = this.getAttackerKey(msg)
        if (InviteTipManager.Instance.get(EmInviteTipType.PK, key)) {
            return
        }

        let title = LangManager.Instance.GetTranslation("public.prompt");
        let submitLabel = LangManager.Instance.GetTranslation("map.campaign.view.frame.PrepareBattleFrame1.accept");
        let cancelLabel = LangManager.Instance.GetTranslation("map.campaign.view.frame.PrepareBattleFrame1.reject");
        let content = LangManager.Instance.GetTranslation("map.hookMap.command01", msg.attackName);
        let data = {
            callback: this.onAlertCall.bind(this),
            msg: msg,
            check: true,
            checkRickText: LangManager.Instance.GetTranslation("BeingInviteWnd.txtNotAcceptInvite")
        }
        SpacePKAlert.Instance.Show(data, title, content, submitLabel, cancelLabel, this.onAlertCall.bind(this), AlertBtnType.OC);

        if (this.timerId != 0) clearTimeout(this.timerId);
        this.timerId = setTimeout(this.clear.bind(this), SpaceManager.PKInviteAlertShowTime, false);
    }

    /** 清理弹窗 */
    private clear(rollBack: boolean = true) {
        if (this.timerId != 0) clearTimeout(this.timerId);
        this.timerId = 0;
        SpacePKAlert.Instance.Hide();
    }

    /**确定取消回调 */
    private onAlertCall(b: boolean, flag: boolean, data: any) {
        if (b) {
            this.receiveThisRequest(data.msg);
        } else {
            if (flag) {
                let key = this.getAttackerKey(data.msg)
                InviteTipManager.Instance.set(EmInviteTipType.PK, key, true)
            }
            this.refuseThisRequest(data.msg);
        }
    }

    /**确定取消回调 */
    private onPetPKAlertCall(b: boolean, flag: boolean, data: any) {
        if (b) {
            this.receivePetPKThisRequest(data.msg);
        } else {
            if (flag) {
                let key = this.getAttackerKey(data.msg)
                InviteTipManager.Instance.set(EmInviteTipType.PetPK, key, true)
            }
            this.refusePetPKThisRequest(data.msg);
        }
    }

    /** 接受 */
    public receivePetPKThisRequest(msg: HangupAttackMsg) {
        msg.defenceId = this._selfInfo.userId;
        MapSocketOuterManager.receivePetPKRequest(this._selfInfo.userId, msg.attackId);
    }

    /** 拒绝 */
    public refusePetPKThisRequest(msg: HangupAttackMsg) {
        MapSocketOuterManager.refusePetPKRequest(this._selfInfo.userId, msg.attackId);

        if (this._pkStack.length != 0) {
            this.timerId2 = setTimeout(this.alertMsg.bind(this), 300, this._pkStack.pop());
        }
    }

    /** 接受 */
    public receiveThisRequest(msg: HangupAttackMsg) {
        msg.defenceId = this._selfInfo.userId;
        MapSocketOuterManager.receivePKRequest(this._selfInfo.userId, msg.attackId);
    }

    /** 拒绝 */
    public refuseThisRequest(msg: HangupAttackMsg) {
        MapSocketOuterManager.refusePKRequest(this._selfInfo.userId, msg.attackId);

        if (this._pkStack.length != 0) {
            this.timerId2 = setTimeout(this.alertMsg.bind(this), 300, this._pkStack.pop());
        }
    }

    private getAttackerKey(msg: HangupAttackMsg) {
        return msg.attackId + "_" + msg.op
    }

    public unregister(target: Object) {
        NotificationManager.Instance.removeEventListener(PK_Event.SPACE_PK, this.__onPKRequestHandler, this);
        SpaceManager.Instance.model.removeEventListener(OuterCityEvent.REMOVE_ARMY, this.onRemoveArmy, this);

        this.clear();
        this._pkStack = null;
        this._selfInfo = null;
        if (this.timerId != 0) clearTimeout(this.timerId);
        if (this.timerId2 != 0) clearTimeout(this.timerId2);

    }
}