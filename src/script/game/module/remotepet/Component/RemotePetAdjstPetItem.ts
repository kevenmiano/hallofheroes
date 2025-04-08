import FUI_AdjustPetItem from "../../../../../fui/RemotePet/FUI_AdjustPetItem";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import FUIHelper from "../../../utils/FUIHelper";
import { PetData } from "../../pet/data/PetData";

export class RemotePetAdjstPetItem extends FUI_AdjustPetItem {

    private _petData: PetData;

    private _corlorNum = 0;

    protected onConstruct(): void {
        super.onConstruct();
        this.resetBtn.onClick(this, this.onResetBtn)
        this.fightBtn.onClick(this, this.onFightBtn);
    }

    public set info(v: PetData) {
        this._petData = v;
        this.updateView();
    }

    public get info() {
        return this._petData;
    }

    public updateView() {
        if (!this._petData) return;
        this._petIcon.url = IconFactory.getPetHeadSmallIcon(this._petData.templateId);;
        this.nameLab.text = this._petData.name;
        this.powerLab.setVar("pow", this._petData.fightPower + "").flushVars();
        let isDie = this._petData.remoteDie;
        this.grayed = isDie;
        this.dieFlag.visible = isDie;
        if (isDie) {
            this.resetBtn.visible = false;
            this.fightBtn.visible = false;
        } else {
            this.resetBtn.visible = this.checkInRemote();
            this.fightBtn.visible = !this.resetBtn.visible;
        }
    }

    public get corlorNum() {
        return this._corlorNum;
    }

    public set colorNum(v: number) {
        if (isNaN(v)) {
            v = 0;
        }
        this._corlorNum = v;
        this.colorFlag.visible = !!this._corlorNum;
        if (this.colorFlag.visible) {
            this.colorFlag.url = FUIHelper.getItemURL("Base", "Icon_Num" + this._corlorNum)
        }
    }

    private onResetBtn() {
        if (!this._petData) return
        this.model.dispatchEvent(RemotePetEvent.PET_CHANGE, this._petData);
    }

    private onFightBtn() {
        if (!this._petData) return
        this.model.dispatchEvent(RemotePetEvent.PET_CHANGE, this._petData);
    }

    private checkInRemote() {
        if (!this._petData) return false;
        let remotePetFormationOfArray = this.model.petListInfo.remotePetFormationOfArray;
        return remotePetFormationOfArray.indexOf(this._petData.petId + "") >= 0
    }

    public get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }
}