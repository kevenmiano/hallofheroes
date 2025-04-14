//@ts-expect-error: External dependencies
import FUI_PetRoleCom from "../../../../fui/Home/FUI_PetRoleCom";
import { IconFactory } from "../../../core/utils/IconFactory";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { PetData } from "../pet/data/PetData";

export default class PetRoleCom extends FUI_PetRoleCom {
  private _data: PetData;
  onConstruct() {
    super.onConstruct();
  }

  public setPetInfo(value: PetData) {
    this._data = value;
    if (this._data) {
      this.petLoader.url = IconFactory.getPetHeadSmallIcon(
        this._data.templateId,
      );
      this.petFightValueTxt.text = this._data.fightPower.toString();
      this.addEvent();
    } else {
      this.petLoader.url = "";
      this.petFightValueTxt.text = "";
      this.removeEvent();
    }
  }

  private addEvent() {
    this.petLoader.onClick(this, this.openPetWnd);
  }

  private removeEvent() {
    this.petLoader.offClick(this, this.openPetWnd);
  }

  private openPetWnd() {
    FrameCtrlManager.Instance.open(EmWindow.Pet);
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
