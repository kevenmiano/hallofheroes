//@ts-expect-error: External dependencies
import FUI_OutyardChangeItem from "../../../../../fui/OutYard/FUI_OutyardChangeItem";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { JobType } from "../../../constant/JobType";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import OutyardUserInfo from "../data/OutyardUserInfo";

export default class OutyardChangeItem extends FUI_OutyardChangeItem {
  private _info: OutyardUserInfo;
  private _thaneInfo: ThaneInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public get info(): OutyardUserInfo {
    return this._info;
  }

  public set info(value: OutyardUserInfo) {
    this._info = value;
    this._thaneInfo = this._info ? this._info.thane : null;
    if (this._thaneInfo) {
      this.jobIcon.icon = JobType.getJobIcon(this._info.job);
      this.userNameTxt.text = this._thaneInfo.nickName;
      this.levelTxt.text = this._thaneInfo.grades.toString();
      this.fightValueTxt.text = this._thaneInfo.fightingCapacity.toString();
      if (this._thaneInfo.isOnline) {
        UIFilter.normal(this);
      } else {
        UIFilter.gray(this);
      }
    }
  }

  public set selected(value: boolean) {
    this.selecteBtn.selected = value;
  }

  public dispose() {
    super.dispose();
  }
}
