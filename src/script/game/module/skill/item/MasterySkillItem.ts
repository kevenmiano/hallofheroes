import FUI_MasterySkillItem from "../../../../../fui/Skill/FUI_MasterySkillItem";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { SkillInfo } from "../../../datas/SkillInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { ExtraJobItemInfo } from "../../bag/model/ExtraJobItemInfo";
import SkillItemCom from "./SkillItemCom";

export default class MasterySkillItem extends FUI_MasterySkillItem {

    private _info: ExtraJobItemInfo;

    protected onConstruct(): void {
        super.onConstruct();
        this.secreBtn.onClick(this, this.onSecreTap);
        this.secreBtn2.onClick(this, this.onSecreTap)
    }

    public set info(v: ExtraJobItemInfo) {
        this._info = v;
        this.updateView();
    }

    public get info() {
        return this._info;
    }

    private updateView() {
        if (!this._info) {
            this.secretCtrl.selectedIndex = 3;
            return;
        }
        let jobIndex = 0;
        switch (this._info.jobType) {
            case 41:
                jobIndex = 2;
                break;
            case 42:
                jobIndex = 1;
                break;
            case 43:
                jobIndex = 0;
                break;
            case 44:
                jobIndex = 4;
                break;
        }
        this.secretCtrl.selectedIndex = jobIndex;
        let isActived = this._info.jobLevel > 0;
        this.lockedCtrl.selectedIndex = isActived ? 0 : 1;
        if (isActived) {
            this.lvLab.text = LangManager.Instance.GetTranslation("public.level3", this._info.jobLevel);
        }

        let skillInfoArr = ArmyManager.Instance.thane.skillCate.getExtrajobSkill(this._info.jobType);
        for (let i = 0; i < skillInfoArr.length; i++) {
            const skillInfo = skillInfoArr[i];
            let skillItem: SkillItemCom = this['skill'+i] as SkillItemCom;
            if(skillItem){
                skillItem.vdata = skillInfo;
            }
        }
    }

    private onSecreTap() {
        if (!this._info) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('Mastery.unopen'));
            return;
        }

        UIManager.Instance.ShowWind(EmWindow.SecretBookTips, this._info);
    }

}