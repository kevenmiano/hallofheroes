// @ts-nocheck
import FUI_PetInfoItem from "../../../../../fui/Battle/FUI_PetInfoItem";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { BaseRoleInfo } from "../../../battle/data/objects/BaseRoleInfo";
import { NotificationEvent, RoleEvent } from "../../../constant/event/NotificationEvent";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PetData } from "../../pet/data/PetData";

export default class PetInfoItem extends FUI_PetInfoItem {
    private _petData: PetData;
    private _index: number = 0;//顺序
    private _shortKey: Array<string> = ["A", "S", "D"];
    private _shortcutChar: string;
    private _hero: BaseRoleInfo;
    protected onConstruct() {
        super.onConstruct();
    }

    private removeEvent() {
        if (this._hero) this._hero.removeEventListener(RoleEvent.IS_LIVING, this.__livingHandler, this);
        Laya.timer.clearAll(this);
    }

    private __livingHandler() {
        if (!this._hero.isLiving) {
            UIFilter.gray(this);
            if (this.battleModel.currentSelectedPet.templateId == this._petData.templateId) {//如果当前英灵是选中的,死了就要默认选中一个新的
                NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_SELECTED_PET_STATUS, this._petData.templateId);
            }
        } else {
            UIFilter.normal(this);
        }
    }

    public set index(value: number) {
        this._index = value;
    }

    public set status(status: number) {
        this.selectCtr.selectedIndex = status;
    }

    public set petData(v: PetData) {
        this._petData = v;
        let iconurl = "";
        if (this._petData) {
            iconurl = IconFactory.getPetHeadSmallIcon(this._petData.templateId);
            this._hero = this.battleModel.getBaseRoleInfoByPetTemplateId(this._petData.templateId);
            if (this._hero) {
                this._hero.addEventListener(RoleEvent.IS_LIVING, this.__livingHandler, this);
                Laya.timer.loop(1000 / EnterFrameManager.FPS, this, this.__enterFrame);
                this.imgHp.fillAmount = this._hero.bloodA / this._hero.totalBloodA;
                this.imgHp.visible = true;
            }
        } else {
            this.imgHp.visible = false;
        }
        this.petIcon.url = iconurl;
        this.txtShortKey.text = this._shortKey[this._index];
        this._shortcutChar = this.txtShortKey.text;
    }

    private __enterFrame() {
        if (this._hero) {
            this.imgHp.fillAmount = this._hero.bloodA / this._hero.totalBloodA;
        }
    }

    public get shortcutChar(): string {
        return this._shortcutChar;
    }

    public get petData() {
        return this._petData;
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose(): void {
        this.removeEvent();
        super.dispose();
    }
}