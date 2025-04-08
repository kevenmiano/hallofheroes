import FUI_RemotePetTurnMap from "../../../../../fui/RemotePet/FUI_RemotePetTurnMap";
import FUIHelper from "../../../utils/FUIHelper";


export class RemotePetTurnMap extends FUI_RemotePetTurnMap {

    protected onConstruct(): void {
        super.onConstruct();
    }

    public setFrame(page: number) {
        this._map.url = FUIHelper.getItemURL("RemotePet", `Img_SylphExpedition_Map_${page}`);
    }

    dispose(): void {
        super.dispose();
    }

}