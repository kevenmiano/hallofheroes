import FUI_FarmEventItem from "../../../../../../fui/Farm/FUI_FarmEventItem";
import LangManager from "../../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { WaterLogInfo } from "../../data/WaterLogInfo";

export default class FarmEventItem extends FUI_FarmEventItem {
  private _info: WaterLogInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public get info(): WaterLogInfo {
    return this._info;
  }

  public set info(value: WaterLogInfo) {
    if (this._info == value) return;
    this._info = value;
    if (this._info) {
      this.descTxt.text = LangManager.Instance.GetTranslation(
        "FarmEventItem.descTxt",
        this._info.nickName,
        this._info.actionDes,
        DateFormatter.timeFormat2(this._info.time),
      );
    } else {
      this.clean();
    }
  }

  private clean() {
    this.descTxt.text = "";
  }

  dispose() {
    super.dispose();
  }
}
