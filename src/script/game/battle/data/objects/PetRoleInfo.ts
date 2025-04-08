/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  宠物角色信息
 **/
import { PetRoleView } from "../../view/roles/PetRoleView";
import { HeroRoleInfo } from "./HeroRoleInfo";
import { BaseRoleInfo } from "./BaseRoleInfo";
import { t_s_pettemplateData } from "../../../config/t_s_pettemplate";
import { InheritRoleType, BloodType } from "../../../constant/BattleDefine";
import ConfigMgr from '../../../../core/config/ConfigMgr';
import { ConfigType } from '../../../constant/ConfigDefine';
import { IconFactory } from "../../../../core/utils/IconFactory";

export class PetRoleInfo extends BaseRoleInfo {
    public inheritType: InheritRoleType = InheritRoleType.Pet

    public userId: number = 0;
    public petId: number = 0;
    public template: t_s_pettemplateData;
    protected _petName: string = "";
    public quality: number = 1;
    public temQuality: number = 1;
    public grades: number = 0;
    /** 主人的livingid */
    public userLivingId: number = 0;

    private _visible: boolean = true;

    public constructor() {
        super();
    }

    public set templateId(value: number) {
        super.templateId = value;
        this.template = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_pettemplate, value);
        if (this.template) {
            this._petName = this.template.TemplateNameLang;
        }
    }

    public get petName(): string {
        return this._petName;
    }

    public set petName(value: string) {
        if (value != "" && value != undefined)
            this._petName = value;
    }

    public get templateId(): number {
        return this._templateId;
    }

    public initView(roleview: PetRoleView) {
        this._roleView = roleview
        this._roleView.visible = this.visible;
    }

    private _heroRoleInfo: HeroRoleInfo;

    public get heroRoleInfo(): HeroRoleInfo {
        return this._heroRoleInfo;
    }

    public set heroRoleInfo(value: HeroRoleInfo) {
        this._heroRoleInfo = value;
        if (value) {
            this.pos = value.pos;
            this.face = value.face;
            this.side = value.side;
        }
    }
    // override
    public get isLiving(): boolean {
        return super.isLiving;
    }
    // override
    public set isLiving(value: boolean) {
        super.isLiving = value;
    }

    public get visible(): boolean {
        return this._visible;
    }

    public set visible(value: boolean) {
        this._visible = value;
        if (this._roleView) {
            this._roleView.visible = this._visible;
            this._roleView.active = this._visible;
        }
    }
    // override
    public showBody() {
        if (this._roleView && this.visible) {
            this._roleView.visible = true;
            this._roleView.active = true;
        }
    }
    // override
    public updateBlood(value: number, displayValue: number,
        havoc: boolean = false,
        type: number = BloodType.BLOOD_TYPE_SELF,
        selfCauseVal: boolean = false,
        defaultSkill: boolean = false,
        parry: boolean = false) {

        return;
    }
    // override
    public get roleName(): string {
        return this.petName;
    }

    public get level(): number {
        return this._heroRoleInfo.level;
    }

    public get icon() {
        return IconFactory.getPetHeadSmallIcon(this._heroRoleInfo.heroInfo.templateId);
    }
}