import FUI_GvgTop10Item from "../../../../../../fui/Consortia/FUI_GvgTop10Item";
import { GvgContributionInfo } from "../../data/gvg/GvgContributionInfo";
import { EmWindow } from "../../../../constant/UIDefine";
import { JobType } from "../../../../constant/JobType";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/28 15:57
 * @ver 1.0
 */
export class GvgTop10Item extends FUI_GvgTop10Item {
  private _info: GvgContributionInfo;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  get info(): GvgContributionInfo {
    return this._info;
  }

  set info(value: GvgContributionInfo) {
    this._info = value;
    if (this._info) {
      this.updateView();
    }
  }

  private updateView(): void {
    this._job.icon = JobType.getJobIcon(this._info.job);
    this._indexTxt.text = this._info.index + 1 + "";
    this._nickNameTxt.text = this._info.nickName;
    this._woundTxt.text = this._info.contribution.toString();
  }

  dispose() {
    this._info = null;
    super.dispose();
  }
}
