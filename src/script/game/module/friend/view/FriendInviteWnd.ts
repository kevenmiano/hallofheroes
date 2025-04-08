import AudioManager from "../../../../core/audio/AudioManager";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { FriendUpdateEvent } from "../../../constant/event/NotificationEvent";
import RelationType from "../../../constant/RelationType";
import { SoundIds } from "../../../constant/SoundIds";
import ToolInviteInfo from "../../../datas/ToolInviteInfo";
import { FriendManager } from "../../../manager/FriendManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FriendInviteItem } from "./component/FriendInviteItem";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/19 17:55
 * @ver 1.0
 *
 */
export class FriendInviteWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public list: fgui.GList;
    public btn_agree: UIButton;
    public btn_ignore: UIButton;

    private _data: ToolInviteInfo[];
    private _inviteNum: number = 0;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initEvent();
        this.initView();
        this.setCenter();
    }

    private initData() {
        this._data = FriendManager.getInstance().toolInviteFriendList;
    }

    private initEvent() {
        // this.btn_agree.visible = false;//隐藏全部同意
        this.btn_agree.onClick(this, this.onBtnAgreeClick);
        this.btn_ignore.onClick(this, this.onBtnIgnoreClick);
        NotificationManager.Instance.addEventListener(FriendUpdateEvent.INVITE_UPDATE, this.__updateInvate, this);
    }

    private initView() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
    }

    public OnShowWind() {
        super.OnShowWind();

        this.__updateInvate();
    }

    private onListItemRender(index: number, item: FriendInviteItem) {
        item.info = this._data[index];
    }

    private onBtnAgreeClick() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        let len: number = FriendManager.getInstance().toolInviteFriendList.length;
        if ((len + FriendManager.getInstance().countFriend) > FriendManager.getInstance().maxFriendCount) {
            let str: string = LangManager.Instance.GetTranslation("friends.view.ToolInviteFriendList.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        this.btn_agree.enabled = this.btn_ignore.enabled = false;
        FriendManager.getInstance().sendReqAddAllFriendList();
        // FriendManager.getInstance().removeToolAllFriend();
    }

    private onBtnIgnoreClick() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("friends.view.ToolInviteFriendList.rejectAlert");
        SimpleAlertHelper.Instance.Show(undefined, null, prompt, content, confirm, cancel, this.rejectCall.bind(this));
    }

    private rejectCall(b: boolean, flag: boolean) {
        if (b) {
            this.btn_agree.enabled = this.btn_ignore.enabled = false;
            // let len: number = FriendManager.getInstance().toolInviteFriendList.length;
            // while (len > 0) {
            //     let Info: ToolInviteInfo = FriendManager.getInstance().toolInviteFriendList[0];
            //     len = FriendManager.getInstance().toolInviteFriendList.length;
            // }
            FriendManager.getInstance().removeToolAllFriend();
            let str: string = LangManager.Instance.GetTranslation("friends.view.ToolInviteFriendItem.command01");
            MessageTipManager.Instance.show(str);
        }
    }

    private __updateInvate() {
        this._data = FriendManager.getInstance().toolInviteFriendList;
        this.btn_agree.enabled = this.btn_ignore.enabled = this._data.length > 0;
        this.list.numItems = this._data.length;
    }

    private removeEvent() {
        this.btn_agree.offClick(this, this.onBtnAgreeClick);
        this.btn_ignore.offClick(this, this.onBtnIgnoreClick);
        NotificationManager.Instance.removeEventListener(FriendUpdateEvent.INVITE_UPDATE, this.__updateInvate, this);
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}