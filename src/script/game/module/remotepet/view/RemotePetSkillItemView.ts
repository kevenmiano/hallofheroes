//@ts-expect-error: External dependencies
import FUI_RemotePetSkillItemView from "../../../../../fui/RemotePet/FUI_RemotePetSkillItemView";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";

export class RemotePetSkillItemView extends FUI_RemotePetSkillItemView {
  private _index = 0;

  private _info: t_s_skilltemplateData;

  protected onConstruct(): void {
    super.onConstruct();
  }

  public get info() {
    return this._info;
  }

  public set info(v: t_s_skilltemplateData) {
    this._info = v;
    if (v) {
      this._icon.url = IconFactory.getCommonIconPath(v.Icons);
    } else {
      this._icon.url = "";
    }
  }

  public get index() {
    return this._index;
  }

  public set index(v: number) {
    this._index = v;
  }
}
