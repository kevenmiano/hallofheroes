import FUI_WarlordsPrelimReportItem from "../../../../../../fui/Warlords/FUI_WarlordsPrelimReportItem";
import { JobType } from "../../../../constant/JobType";
import WarlordsPlayerInfo from "../../WarlordsPlayerInfo";

export default class WarlordsPrelimReportItem extends FUI_WarlordsPrelimReportItem {
  private _info: WarlordsPlayerInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.c1 = this.getController("c1");
  }

  public set info(vInfo: WarlordsPlayerInfo) {
    this._info = vInfo;
    if (this._info) {
      this.refreshView();
    }
  }

  private refreshView() {
    if (this._info.sort < 4) {
      this.c1.selectedIndex = this._info.sort - 1;
    } else {
      this.c1.selectedIndex = 3;
      this.rankTxt.text = this._info.sort.toString();
    }
    this.jobIcon.icon = JobType.getJobIcon(this._info.job);
    this.nickNameTxt.text = this._info.nickname;
  }

  dispose() {
    super.dispose();
  }
}
