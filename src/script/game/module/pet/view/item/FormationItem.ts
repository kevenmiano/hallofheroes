import FUI_FormationItem from "../../../../../../fui/Pet/FUI_FormationItem";
import { ShowPetAvatar } from "../../../../avatar/view/ShowPetAvatar";
import { PetData } from "../../data/PetData";

//阵型右侧形象视图
export default class FormationItem extends FUI_FormationItem{
    private _petData:PetData;
    private _petView: ShowPetAvatar;
    protected onConstruct() {
        super.onConstruct();
    }

    public set info(value: PetData) {
		this._petData = value;
        if (value) {
            this.refresh();
        } else {
            this.resetView();
        }
	}

    private refresh() {
        this._petView = new ShowPetAvatar();
		this._petView.width = 250;
		this._petView.height = 250;
        this._petView.x = 20;
        this._petView.scaleX = this._petView.scaleY = 0.8;
        this._petView.data = this._petData.template;
        if(this && this.displayObject)this.displayObject.addChild(this._petView);
    }

    private resetView(){
        if(this && this.displayObject)this.displayObject.removeChild(this._petView);
        if(this)this._petView = null;
    }

    public dispose() {
        super.dispose();

    }
}