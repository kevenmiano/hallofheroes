import FUI_ConsortiaEmailMemberItem from "../../../../../../../fui/Consortia/FUI_ConsortiaEmailMemberItem";
import { IconFactory } from "../../../../../../core/utils/IconFactory";
import { IconType } from "../../../../../constant/IconType";
import { ThaneInfo } from "../../../../../datas/playerinfo/ThaneInfo";
import { ConsortiaDutyLevel } from "../../../data/ConsortiaDutyLevel";

export default class ConsortiaEmailMemberItem extends FUI_ConsortiaEmailMemberItem {
  private _info: ThaneInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public set info(vInfo: ThaneInfo) {
    this._info = vInfo;
    this.refreshView();
  }

  public get info(): ThaneInfo {
    return this._info;
  }

  public get isSelected(): boolean {
    return this.select.selected;
  }

  private refreshView() {
    if (this._info) {
      this.txtUserName.text = this._info.nickName;
      this.txtTitle.text = ConsortiaDutyLevel.getDutyByButyLevel(
        this._info.dutyId,
      );
      this.headIcon.url = IconFactory.getPlayerIcon(
        this._info.headId,
        IconType.HEAD_ICON,
      );
    } else {
      this.txtUserName.text = "";
      this.txtTitle.text = "";
      this.headIcon.url = "";
    }
  }

  dispose() {
    super.dispose();
  }
}
