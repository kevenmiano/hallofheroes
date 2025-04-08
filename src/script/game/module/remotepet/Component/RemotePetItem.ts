import FUI_RemotePetItem from "../../../../../fui/RemotePet/FUI_RemotePetItem";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { PetData } from "../../pet/data/PetData";

export class RemotePetItem extends FUI_RemotePetItem {
    private _petData: PetData;
    protected onConstruct(): void {
        super.onConstruct();
    }

    public set petData(v: PetData) {
        if (!v) return;
        this._petData = v;
        this.updateView();
    }

    private updateView() {
        this._fightTxt.text = this._petData.fightPower + "";
        let iconurl = IconFactory.getPetHeadSmallIcon(this._petData.templateId);
        this._icon.url = iconurl;
    }
}