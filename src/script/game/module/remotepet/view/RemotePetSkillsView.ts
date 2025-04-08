import FUI_RemotePetSkillsView from "../../../../../fui/RemotePet/FUI_RemotePetSkillsView";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { PetChallengeEvent } from "../../../constant/PetDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { PetData } from "../../pet/data/PetData";
import { RemotePetSkillItemView } from "./RemotePetSkillItemView";

export class RemotePetSkillsView extends FUI_RemotePetSkillsView {

    private _data: PetData;

    private _skillItemView: RemotePetSkillItemView[];

    private _currentSelectedItem: RemotePetSkillItemView;

    protected onConstruct(): void {
        super.onConstruct();
        this._skillItemView = [this.s1 as RemotePetSkillItemView, this.s2 as RemotePetSkillItemView, this.s3 as RemotePetSkillItemView];
        let index = 0;
        for (let skillItem of this._skillItemView) {
            skillItem.onClick(this, this.__mouseClickHandler, [skillItem]);
            skillItem.index = index++;
        }
    }


    public get petData() {
        return this._data;
    }

    public set petData(v: PetData) {
        this._data = v;
        if (v) {
            this.skillChangeHandler();
            this.delBtn.visible = true;
            return;
        }
        this.clean();
    }

    private skillChangeHandler() {
        let skillList = this._data.remotePetSkillList;
        for (let i = 0; i < this._skillItemView.length; i++) {
            this._skillItemView[i].info = skillList[i];
        }
        // if (this._data.remoteHp == 0) {
        //     this.filters = [UIFilter.getBlackFilter()];
        // }
        // else {
        //     this.filters = [];
        // }
    }

    private __mouseClickHandler(skillItem: RemotePetSkillItemView) {
        if (!this._data) return;

        this._currentSelectedItem = skillItem;
        // FrameCtrlManager.Instance.open(EmWindow.PetChallengeSkillSelect, { petData: this._data });

        NotificationManager.Instance.addEventListener(PetChallengeEvent.CHALLENGE_SKILL_CHANGE, this.selectSkill, this);
    }

    private selectSkill(data: { petData: PetData, skillTemp: t_s_skilltemplateData }) {
        NotificationManager.Instance.removeEventListener(PetChallengeEvent.CHALLENGE_SKILL_CHANGE, this.selectSkill, this);
        if (!this._data || !this._currentSelectedItem) {
            this._currentSelectedItem = null;
            return;
        }
        if (data.petData != this._data) return;
        let skill = data.skillTemp;
        let arr = this._data.remotePetSkillList;
        let index: number = 0;
        let temp: t_s_skilltemplateData;
        let skillPos: number = -1;
        for (temp of arr) {
            if (temp && temp.TemplateId == skill.TemplateId) {
                //找到技能的
                skillPos = index;
                break;
            }
            index++;
        }

        if (this._currentSelectedItem) {
            if (skillPos >= 0) arr[skillPos] = this._currentSelectedItem.info;
            this._currentSelectedItem.data = skill;
            arr[this._currentSelectedItem.index] = skill; //将skill放到现在位置
            this._currentSelectedItem = null;
        }

        let tempArr: number[] = [];
        for (temp of arr) {
            index = this._data.changeSkillTemplates.indexOf(temp);
            tempArr.push(index);
            temp = null;
        }
        let result = tempArr.join(",");
        if (this._data.remotePetSkillsOfString != result) {
            this._data.remotePetSkillsOfString = result;
        }
        this.skillChangeHandler();
    }

    private clean() {
        this.delBtn.visible = false;
        for (let i: number = 0; i < this._skillItemView.length; i++) {
            this._skillItemView[i].info = null;
        }
    }

    public dispose(): void {

    }
}