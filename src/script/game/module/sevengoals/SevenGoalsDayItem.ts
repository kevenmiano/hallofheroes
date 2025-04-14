import FUI_SevenGoalsDayItem from "../../../../fui/SevenTarget/FUI_SevenGoalsDayItem";
import LangManager from "../../../core/lang/LangManager";
import SevenGoalsManager from "../../manager/SevenGoalsManager";
import SevenDayInfo from "../welfare/data/SevenDayInfo";
import SevenGoalsModel from "./SevenGoalsModel";

/**天数按钮项 */
export default class SevenGoalsDayItem extends FUI_SevenGoalsDayItem {
  private _info: SevenDayInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public set info(value: SevenDayInfo) {
    this._info = value;
    this.refreshView();
  }

  private refreshView() {
    if (this._info) {
      this.titleTxt.text = LangManager.Instance.GetTranslation(
        "guidetask.GuideTaskFrame.dayBtnTxt0" + this._info.day,
      );
      this.lockStatus.selectedIndex = this._info.isOpen ? 1 : 0;
      this.enabled = this._info.isOpen ? true : false;
      if (this._info.day > this.sevenGoalsModel.sevenCurrentDay) {
        this.redStatus.selectedIndex = 0;
      } else {
        this.redStatus.selectedIndex = this.sevenGoalsModel.checkDayRed(
          this._info.day,
        )
          ? 1
          : 0;
      }
    }
  }

  private get sevenGoalsModel(): SevenGoalsModel {
    return SevenGoalsManager.Instance.sevenGoalsModel;
  }

  dispose() {
    super.dispose();
  }
}
