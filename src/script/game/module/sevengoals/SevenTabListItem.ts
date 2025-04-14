//@ts-expect-error: External dependencies
import FUI_SevenTabListItem from "../../../../fui/SevenTarget/FUI_SevenTabListItem";
import SevenGoalsManager from "../../manager/SevenGoalsManager";
import SevenGoalsModel from "./SevenGoalsModel";

/**任务类型tab标签 */
export default class SevenTabListItem extends FUI_SevenTabListItem {
  private _info: any;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public set info(value: any) {
    this._info = value;
    this.refreshView();
  }

  private refreshView() {
    if (this._info) {
      this.titleTxt.text = this._info.name;
      if (this._info.index == 1 || this._info.index == 3) {
        this.c1.selectedIndex = 0;
      } else {
        if (
          this.sevenGoalsModel.currentSelectedDay <
          this.sevenGoalsModel.sevenCurrentDay
        ) {
          this.c1.selectedIndex = 2;
        } else {
          this.c1.selectedIndex = 1;
        }
      }
      if (this._info.index == 1) {
        //成长任务
        this.red.selectedIndex = this.sevenGoalsModel.checkTabIndex1(
          this.sevenGoalsModel.currentSelectedDay,
        )
          ? 1
          : 0;
      } else if (this._info.index == 2) {
        //今日挑战
        if (
          this.sevenGoalsModel.currentSelectedDay !=
          this.sevenGoalsModel.sevenCurrentDay
        ) {
          this.red.selectedIndex = 0;
        } else {
          if (this.sevenGoalsModel.checkTabIndex2()) {
            //有未领奖的挑战任务
            this.red.selectedIndex = 1;
          } else if (this.sevenGoalsModel.checkTabIndex3()) {
            //有未完成的挑战任务
            this.red.selectedIndex = 2;
          } else {
            this.red.selectedIndex = 0;
          }
        }
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
