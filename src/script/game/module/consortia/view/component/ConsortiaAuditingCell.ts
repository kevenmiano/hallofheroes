// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-23 10:48:01
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-02 10:49:22
 * @Description: 
 */

import FUI_ConsortiaAuditingCell from "../../../../../../fui/Consortia/FUI_ConsortiaAuditingCell";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { IconType } from "../../../../constant/IconType";
import { EmWindow } from "../../../../constant/UIDefine";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { ThaneInfoHelper } from "../../../../utils/ThaneInfoHelper";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import LangManager from '../../../../../core/lang/LangManager';
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { JobType } from "../../../../constant/JobType";

export class ConsortiaAuditingCell extends FUI_ConsortiaAuditingCell {
    private _info: ThaneInfo
    //@ts-ignore
    public icon_head: IconAvatarFrame;
    protected onConstruct() {
        super.onConstruct();

        this.btnAgree.onClick(this, this.onBtnAgree)
        this.btnDisagree.onClick(this, this.onBtnDisagree)
    }

    private onBtnAgree(){
        let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
		contorller.consortiaAcceptOrRejectApply([this._info], true);
    }
    
    private onBtnDisagree(){
        let contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
		contorller.consortiaAcceptOrRejectApply([this._info], false);
    }

    public set info(value: ThaneInfo){
        this._info = <ThaneInfo>value;
        if(this._info)
        {
            let headId: number = this._info.snsInfo.headId;
            if (headId == 0) {//说明没修改过头像, 使用默认头像
                headId = ThaneInfoHelper.getJob(this._info.templateId);
            }
            this.icon_head.headId = headId;
            if (this._info.frameId > 0) {
                let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._info.frameId);
                if (itemData) {
                    this.icon_head.headFrame = itemData.Avata;
                    this.icon_head.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
                }
            }else{
                this.icon_head.headFrame = "";
                this.icon_head.headEffect = "";
            }
            this.jobLoader.url = JobType.getJobIcon(this._info.templateInfo.Job);
            this.txt_level.text = "" + this._info.grades;
            this.txt_Name.text = this._info.nickName;
            this.txt_Fight.text = LangManager.Instance.GetTranslation("public.capacity") + LangManager.Instance.GetTranslation("public.colon2") + this._info.fightingCapacity
        }
        else
        {
            this.icon_head.icon = "";
            this.txt_Name.text = "";
            this.txt_level.text = "";
            this.txt_Fight.text = "";
        }
    }

    public get info():ThaneInfo{
        return this._info
    }
}