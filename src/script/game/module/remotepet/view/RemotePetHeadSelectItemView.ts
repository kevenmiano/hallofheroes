//@ts-expect-error: External dependencies
import FUI_RemotePetHeadSelectItemView from "../../../../../fui/RemotePet/FUI_RemotePetHeadSelectItemView";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { CommonConstant } from "../../../constant/CommonConstant";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { PetData } from "../../pet/data/PetData";

export class RemotePetHeadSelectItemView extends FUI_RemotePetHeadSelectItemView {
  private _data: PetData;

  protected onConstruct(): void {
    super.onConstruct();
  }

  public set petData(petData: PetData) {
    this._data = petData;
    this.updateView();
  }

  public get petData() {
    return this._data;
  }

  private updateView() {
    let iconurl = "";
    let grade = "";
    if (this._data) {
      iconurl = IconFactory.getPetHeadSmallIcon(this._data.templateId);
      grade = this._data.grade + "";
      this.profileNum = this._data.quality - 1;
      this.grayed = this._data.remoteDie;
    } else {
      this.imgProfile.icon = null;
    }
    this._icon.url = iconurl;
    this._lvNum.text = grade;
  }

  private set profileNum(num: number) {
    let res = CommonConstant.QUALITY_RES[num];
    this.imgProfile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);
  }
}
