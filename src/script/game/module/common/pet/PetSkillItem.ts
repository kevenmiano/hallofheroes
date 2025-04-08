/*
 * @Author: jeremy.xu
 * @Date: 2021-10-25 15:59:50
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-26 15:56:23
 * @Description: 英灵技能
 */

import FUI_PetSkillItem from "../../../../../fui/BaseCommon/FUI_PetSkillItem";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { SkillPriorityType } from "../../../constant/SkillSysDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { PetData } from "../../pet/data/PetData";


export enum EmPetSkillItemType {
    FallowSkill,
    SkillLib,
    FastSkill
}

export class PetSkillItem extends FUI_PetSkillItem implements ITipedDisplay {
    showType: TipsShowType = TipsShowType.onClick;
    tipType: EmWindow = EmWindow.PetSkillTips;
    tipData: any;
    extData?: any;
    canOperate: boolean = true;
    type: EmPetSkillItemType = EmPetSkillItemType.SkillLib;

    private _info: t_s_skilltemplateData;
    public get info(): t_s_skilltemplateData {
        return this._info;
    }

    public set info(value: t_s_skilltemplateData) {
        this._info = value;
        if (value) {
            this.tipData = value;
            this.icon = IconFactory.getCommonIconPath(value.Icons);
            this.cPassive.setSelectedIndex(this.isPasssive ? 1 : 0);
            this.cSuperSkill.setSelectedIndex(SkillPriorityType.isPetSuperSkill(value.Priority) ? 1 : 0);
            this.registerTip();
        } else {
            this.tipData = null;
            this.icon = "";
            this.cEquiped.setSelectedIndex(0);
            this.cPassive.setSelectedIndex(0);
            this.cSuperSkill.setSelectedIndex(0);
            this.unRegisterTip();
        }
        if (this.type == EmPetSkillItemType.SkillLib) {
            this.lack(!this.isLearned);
        }

    }

    public set equiped(isEquiped: boolean) {
        this.cEquiped.setSelectedIndex(isEquiped ? 1 : 0);
    }

    public get isPasssive(): boolean {
        return this._info && this._info.UseWay == 2;
    }

    public get isLearned(): boolean {
        return this._info && this.extData && (this.extData as PetData).checkSkillIsLearned(this._info.TemplateId);
    }

    public lack(b: boolean) {
        this.imgLock.visible = b
    }

    public registerTip() {
        ToolTipsManager.Instance.register(this);
    }

    public unRegisterTip() {
        ToolTipsManager.Instance.unRegister(this);
    }

    public showTipType(type: TipsShowType) {
        this.showType = type
        ToolTipsManager.Instance.unRegister(this);
        ToolTipsManager.Instance.register(this);
    }

    dispose() {
        super.dispose();
    }
}