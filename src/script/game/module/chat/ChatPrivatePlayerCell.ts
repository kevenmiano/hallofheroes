// @ts-nocheck
import FUI_PriviatePlayerCell from '../../../../fui/Chat/FUI_PriviatePlayerCell';
import { IconFactory } from '../../../core/utils/IconFactory';
import { ChatEvent } from '../../constant/event/NotificationEvent';
import { IconType } from '../../constant/IconType';
import { NotificationManager } from '../../manager/NotificationManager';
import { UIFilter } from '../../../core/ui/UIFilter';
import { FriendManager } from '../../manager/FriendManager';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import IMManager from '../../manager/IMManager';
import BaseIMInfo from '../../datas/BaseIMInfo';
import { t_s_itemtemplateData } from '../../config/t_s_itemtemplate';
import { TempleteManager } from '../../manager/TempleteManager';
/**
* @author:pzlricky
* @data: 2021-06-03 12:24
* @description 私聊单元格
*/
export default class ChatPrivatePlayerCell extends FUI_PriviatePlayerCell {

    private _cellInfo: ThaneInfo;

    public index: number = 0;
    //@ts-ignore
    public headIcon: IconAvatarFrame;
    private _headId: number;
    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    addEvent() {
        this.removeBtn.onClick(this, this.removePriviateChat);
        this.onClick(this, this.onChatToTarget.bind(this));
    }

    /**删除聊天人员 */
    removePriviateChat(evt: Laya.Event) {
        evt.stopPropagation();
        if (this._cellInfo)
            NotificationManager.Instance.sendNotification(ChatEvent.REMOVE_PRIVATE_CHAT, this._cellInfo);
        // FriendManager.getInstance().removePrivatePerson(this._cellInfo.userId);
    }

    /**切换聊天对象 */
    onChatToTarget() {
        if (this._cellInfo)
            NotificationManager.Instance.sendNotification(ChatEvent.ADD_PRIVATE_CHAT, this._cellInfo);
    }

    removeEvent() {
        this.removeBtn.offClick(this, this.removePriviateChat);
    }

    public set info(value) {
        this._cellInfo = value;
        this.updateView();
        //是否有新消息红点
        let msgList: Array<BaseIMInfo> = IMManager.Instance.model.unreadMsgDic[this._cellInfo.userId];
        if (msgList && msgList.length > 0) {
            this.reddot.visible = true;

        } else {
            this.reddot.visible = false;
        }
    }

    public get info() {
        return this._cellInfo;
    }

    updateView() {
        this._headId = this._cellInfo.snsInfo.headId;
        if (this._headId == 0) {
            this._headId = this._cellInfo.job;
        }
        this.headIcon.headId = this._headId;
        if (this._cellInfo.frameId > 0) {
            let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._cellInfo.frameId);
            if (itemData) {
                this.headIcon.headFrame = itemData.Avata;
                this.headIcon.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
            }
        } else {
            this.headIcon.headFrame = "";
            this.headIcon.headEffect = "";
        }

        this.setOnlineState();
        this.userName.text = this._cellInfo.nickName;
    }

    setOnlineState() {
        if (!this._cellInfo.isOnline) {
            UIFilter.gray(this.bg_default);
            UIFilter.gray(this.bg_select);
            UIFilter.gray(this.headIcon);
            UIFilter.gray(this.userName);
            UIFilter.gray(this.reddot);
        }
        else {
            UIFilter.normal(this.bg_default);
            UIFilter.normal(this.bg_select);
            UIFilter.normal(this.headIcon);
            UIFilter.normal(this.userName);
            UIFilter.normal(this.reddot);
        }
    }

    dispose() {
        this.removeEvent();
        this._cellInfo = null;
        super.dispose();
    }

}