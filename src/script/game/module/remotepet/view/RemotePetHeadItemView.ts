import FUI_RemotePetHeadItemView from "../../../../../fui/RemotePet/FUI_RemotePetHeadItemView";
import { IconFactory } from "../../../../core/utils/IconFactory";
import FUIHelper from "../../../utils/FUIHelper";
import { PetData } from "../../pet/data/PetData";

export class RemotePetHeadItemView extends FUI_RemotePetHeadItemView {

    private _data: PetData = null;

    private _pos = 0;

    private _corlorNum = 0;

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
        this._icon.url = iconurl;
    }

    public get petData() {
        return this._data;
    }

    public get corlorNum() {
        return this._corlorNum;
    }

    public set corlorNum(v: number) {
        this._corlorNum = v;
        this.colorFlag.visible = !!this._corlorNum;
        if (this.colorFlag.visible) {
            this.colorFlag.url = FUIHelper.getItemURL("Base", "Icon_Num" + this._corlorNum)
        }
    }
}