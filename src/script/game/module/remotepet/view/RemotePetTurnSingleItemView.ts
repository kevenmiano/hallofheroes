import FUI_RemotePetTurnSingleItemView from "../../../../../fui/RemotePet/FUI_RemotePetTurnSingleItemView";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PetData } from "../../pet/data/PetData";

export class RemotePetTurnSingleItemView extends FUI_RemotePetTurnSingleItemView {
  protected onConstruct(): void {
    super.onConstruct();
  }
  private _data: PetData;

  public get info() {
    return this._data;
  }

  public set info(v: PetData) {
    this._data = v;
    this.updateView();
  }

  private updateView() {
    if (this._data) {
      // this._progress.visible = true;
      let hp = this._data.remoteHp;
      // this._progress.value = hp;
      if (hp == 0) {
        this.filters = [UIFilter.grayFilter];
      }
      let gInfo = new GoodsInfo();
      gInfo.petData = this._data;

      (this.item as BaseItem).info = gInfo;
    } else {
      (this.item as BaseItem).info = null;
      // this._progress.visible = false;
    }
  }
}
