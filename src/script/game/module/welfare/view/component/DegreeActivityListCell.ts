//@ts-expect-error: External dependencies
import FUI_DegreeActivityListCell from "../../../../../../fui/Welfare/FUI_DegreeActivityListCell";
import { VIPManager } from "../../../../manager/VIPManager";
import LeedInfo from "../../data/LeedInfo";
import LangManager from "../../../../../core/lang/LangManager";
import UIButton from "../../../../../core/ui/UIButton";
import DayGuideManager from "../../../../manager/DayGuideManager";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import StringHelper from "../../../../../core/utils/StringHelper";

/**
 * @author:pzlricky
 * @data: 2021-06-30 19:26
 * @description 活跃度任务列表
 */
export default class DegreeActivityListCell extends FUI_DegreeActivityListCell {
  public index: number = 0;
  private _cellData: LeedInfo;
  private _goAheadUIButton: UIButton = null;
  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    this._goAheadUIButton = new UIButton(this.goHeadBtn);
    this.addEvent();
  }

  addEvent() {
    this._goAheadUIButton.onClick(this, this.__onClickHandler);
  }

  offEvent() {
    this._goAheadUIButton.offClick(this, this.__onClickHandler);
  }

  private __onClickHandler() {
    // AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (!this._cellData) return;
    let userLevel = ArmyManager.Instance.thane.grades;
    if (userLevel < this._cellData.templateInfo.Level) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("welfare.degress.goAheadText"),
      );
      return;
    }
    DayGuideManager.Instance.switchScene(this._cellData.templateInfo.Type);
  }

  set cellData(value: LeedInfo) {
    this._cellData = value;
    if (this._cellData.templateInfo) {
      this.title.text =
        value.templateInfo.TitleLang +
        " (" +
        this._cellData.currentCount +
        "/" +
        this._cellData.templateInfo.PassCount +
        ")";
    } else {
      this.title.text = "(" + this._cellData.currentCount + "/" + 0 + ")";
    }
    this.count.text = value.templateInfo
      ? value.templateInfo.Num.toString()
      : "0";
    let grade: number = value.templateInfo ? value.templateInfo.Level : 0;
    this.level.text = LangManager.Instance.GetTranslation(
      "DegreeActivityListCell.leveTxt",
      grade,
    );
    this.initContentData();
    let timeStr = "";
    let tempTimes = [];
    if (value.templateInfo && value.templateInfo.Time.indexOf(",")) {
      tempTimes = value.templateInfo.Time.split(",");
      for (let index = 0; index < tempTimes.length; index++) {
        let timeValue = tempTimes[index];
        let tempValue = timeValue.replace("|", "-");
        if (index < tempTimes.length - 1) timeStr += tempValue + "<br>";
        else timeStr += tempValue;
      }
    } else {
      timeStr = value.templateInfo
        ? value.templateInfo.Time.replace("|", "-")
        : "00:00";
    }
    if (timeStr == "00:00-23:59") {
      //这种时间改下显示为全天
      timeStr = LangManager.Instance.GetTranslation(
        "DegreeActivityListCell.timeStr",
      );
    }
    this.time.text = timeStr;
    this.state.selectedIndex = this._cellData.isComplete ? 1 : 0;
  }

  /**
   * 设置该条目的详细
   * */
  private initContentData() {
    let tipData = "";
    if (this._cellData && this._cellData.templateInfo)
      tipData = this._cellData.templateInfo.Detail;
    this.content.text = tipData;
  }
}
