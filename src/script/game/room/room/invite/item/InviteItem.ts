/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-22 19:41:23
 * @LastEditTime: 2021-12-01 21:14:45
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_InviteItem from "../../../../../../fui/BaseCommon/FUI_InviteItem";
import LangManager from "../../../../../core/lang/LangManager";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { IconType } from "../../../../constant/IconType";
import { JobType } from "../../../../constant/JobType";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { TempleteManager } from "../../../../manager/TempleteManager";

export default class InviteItem extends FUI_InviteItem {
    private _info: ThaneInfo;
    //@ts-ignore
    public headIcon: IconAvatarFrame;
    protected onConstruct() {
        super.onConstruct()
        this.resetItem();
    }

    public set info(value: ThaneInfo) {
        this._info = value;
        if (value) {
            this.imgLevelBg.visible = true;
            this.txtName.text = this._info.nickName;
            this.txtJob.text = JobType.getJobName(this._info.templateInfo.Job);
            this.testIcon.url = JobType.getJobIcon(this._info.templateInfo.Job);
            this.txtLevel.text = this._info.grades + "";
            this.touchable = !this._info.invited;
            this.btnInvite.enabled = !this._info.invited;
            this.btnInvite.text = LangManager.Instance.GetTranslation(this._info.invited ? "public.invited" : "public.invite")
            this.headIcon.headId = this._info.snsInfo.headId;
            if (this._info.frameId > 0) {
                let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._info.frameId);
                if (itemData) {
                    this.headIcon.headFrame = itemData.Avata;
                    this.headIcon.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
                }
            }else{
                this.headIcon.headFrame = "";
                this.headIcon.headEffect = "";
            }
        } else {
            this.resetItem()
        }
    }

    public get info(): ThaneInfo {
        return this._info
    }

    private resetItem() {
        this.imgLevelBg.visible = false;
        this.txtName.text = "";
        this.txtJob.text = "";
        this.txtLevel.text = "";
    }

}