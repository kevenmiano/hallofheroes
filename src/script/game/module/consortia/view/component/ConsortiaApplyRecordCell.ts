import { ConsortiaInviteInfo } from "../../data/ConsortiaInviteInfo";
import LangManager from '../../../../../core/lang/LangManager';
import FUI_ConsortiaApplyRecordCell from "../../../../../../fui/Consortia/FUI_ConsortiaApplyRecordCell";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaSocektSendManager } from "../../../../manager/ConsortiaSocektSendManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";

export default class ConsortiaApplyRecordCell extends FUI_ConsortiaApplyRecordCell {
    private _info: ConsortiaInviteInfo;
    private _contorller: ConsortiaControler;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.addEvent();
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
    }

    public set info(vInfo: ConsortiaInviteInfo) {
        this._info = vInfo;
        this.refreshView();
    }

    public get info(): ConsortiaInviteInfo {
        return this._info
    }

    private addEvent() {
        this.acceptBtn.onClick(this, this.onAcceptHandler);
        this.rejectBtn.onClick(this, this.onRejectHandler);
    }

    private removeEvent() {
        this.acceptBtn.offClick(this, this.onAcceptHandler);
        this.rejectBtn.offClick(this, this.onRejectHandler);
    }

    private onAcceptHandler() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this._contorller.operateConsortiaApply(this._info.id, true);
    }

    private onRejectHandler(evt: MouseEvent) {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        // this.rejectBtn.offClick(this, this.onRejectHandler);
        if (!this._info.fromType) {
            ConsortiaSocektSendManager.deleteApplyConsortia(this._info.id);
        } else {
            this._contorller.operateConsortiaApply(this._info.id, false);
        }
    }

    private refreshView() {
        if (this._info) {
            this.title1.text = this._info.consortiaName;
            let maxCount = this._info.SortiaMaxMembers
            this.title4.text = this._info.addCount + "/" + maxCount;
            if (!this._info.fromType) {
                this.acceptBtn.visible = false;
                this.rejectBtn.text = LangManager.Instance.GetTranslation("friends.view.ToolInviteFriendItem.reject02");
                this.title2.text = LangManager.Instance.GetTranslation("public.level3", this._info.levels);
            }
            else {
                this.title2.text = this._info.inviteNickName;
                this.acceptBtn.visible = true;
            }
        }
    }

    dispose() {
        this.removeEvent();
        this._info = null;
        super.dispose();
    }
}