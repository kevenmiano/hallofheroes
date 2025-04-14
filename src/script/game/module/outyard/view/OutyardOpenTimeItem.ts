//@ts-expect-error: External dependencies
import FUI_OutyardOpenTimeItem from "../../../../../fui/OutYard/FUI_OutyardOpenTimeItem";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { Int64Utils } from "../../../../core/utils/Int64Utils";
import StackHeadOpenTimeMsg = com.road.yishi.proto.stackhead.StackHeadOpenTimeMsg;
import Utils from "../../../../core/utils/Utils";
import { PlayerManager } from "../../../manager/PlayerManager";

export default class OutyardOpenTimeItem extends FUI_OutyardOpenTimeItem {
  private _info: StackHeadOpenTimeMsg;
  private _index: number = 0;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }
  public set index(value: number) {
    this._index = value;
  }

  public get index(): number {
    return this._index;
  }

  public get info(): StackHeadOpenTimeMsg {
    return this._info;
  }

  public set info(value: StackHeadOpenTimeMsg) {
    this._info = value;
    this.descTxt.text = LangManager.Instance.GetTranslation(
      "outyard.OutyardOpenTimeItem.type" + this._index,
    );
    if (this._info) {
      let zoneOffset = PlayerManager.Instance.currentPlayerModel.zoneId;
      var start: Date = Utils.formatTimeZone(
        Number(this._info.startTime),
        zoneOffset,
      );
      var end: Date = Utils.formatTimeZone(
        Number(this._info.endTime),
        zoneOffset,
      );
      var startTime: string =
        this.getIntStrAtLength(start.getHours(), 2) +
        ":" +
        this.getIntStrAtLength(start.getMinutes(), 2);
      var endTime: string =
        this.getIntStrAtLength(end.getHours(), 2) +
        ":" +
        this.getIntStrAtLength(end.getMinutes(), 2);
      this.timeTxt.text = startTime + " ~ " + endTime;
    } else {
      this.timeTxt.text = "--  " + " ~ " + "  --";
    }
  }

  public getIntStrAtLength(figure: number, len: number): string {
    return DateFormatter.getIntStrAtLength(figure, len);
  }

  public dispose() {
    super.dispose();
  }
}
