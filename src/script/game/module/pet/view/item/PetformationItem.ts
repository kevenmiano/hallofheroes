// @ts-nocheck
import FUI_PetformationItem from "../../../../../../fui/Pet/FUI_PetformationItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { PetData } from "../../data/PetData";

export default class PetformationItem extends FUI_PetformationItem{
    private _data: PetData = null;
    private _pos = 0;
    protected onConstruct() {
        super.onConstruct();
    }
   
    public set pos(v) {
        this._pos = v;
    }

    public get pos() {
        return this._pos
    }

    public set petData(v: PetData) {
        this._data = v;
        let iconurl = "";
        if (this._data) {
            iconurl = IconFactory.getPetHeadSmallIcon(this._data.templateId);
        }
        this.petIcon.url = iconurl;
    }

    public get petData() {
        return this._data;
    }
}