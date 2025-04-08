// @ts-nocheck
import FUI_MailAddFriendCell from '../../../../fui/Mail/FUI_MailAddFriendCell';
import Logger from '../../../core/logger/Logger';
import { IconFactory } from '../../../core/utils/IconFactory';
import { IconType } from '../../constant/IconType';
import { NotificationManager } from '../../manager/NotificationManager';
import { EmailEvent } from '../../constant/event/NotificationEvent';
import Utils from '../../../core/utils/Utils';
import { t_s_itemtemplateData } from '../../config/t_s_itemtemplate';
import { TempleteManager } from '../../manager/TempleteManager';
/**
* @author:pzlricky
* @data: 2021-04-16 15:41
* @description *** 
*/
export default class MailAddFriendCell extends FUI_MailAddFriendCell {

    public index: number = 0;
    private _data: any;
     //@ts-ignore
    public headIcon: IconAvatarFrame;
    onConstruct() {
        super.onConstruct();
        this.select.onClick(this, this.onCheckItem.bind(this))
        this.select.asButton.selected = false;
        Utils.setDrawCallOptimize(this);
    }

    /**
     * 复选框单击
     */
    onCheckItem() {
        Logger.log('MailAddFriendCell:', this.index, this.select.asButton.selected);
        if (this.select.asButton.selected) {//选中
            NotificationManager.Instance.dispatchEvent(EmailEvent.ADD_FRIEND_CELL_CHECK, this.index);
        }
    }


    //@ts-ignore
    public set selected(b: boolean) {
        this.select.asButton.selected = b;
    }

    public get selected(): boolean {
        return this.select.asButton.selected;
    }


    public set Itemdata(value: any) {
        this._data = value;
        this.refresh();
    }

    public get Itemdata(): any {
        return this._data;
    }

    private refresh() {
        if (this._data) {

            this.headIcon.headId = this._data.snsInfo.headId;
            if (this._data.frameId > 0) {
                let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._data.frameId);
                if (itemData) {
                    this.headIcon.headFrame = itemData.Avata;
                    this.headIcon.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
                }
            }else{
                this.headIcon.headFrame = "";
                this.headIcon.headEffect = "";
            }

            this.userName.text = this._data.nickName;
        }
    }

}