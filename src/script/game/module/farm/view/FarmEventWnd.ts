//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ArrayUtils, ArrayConstant } from "../../../../core/utils/ArrayUtils";
import { WaterManager } from "../../../manager/WaterManager";
import { WaterLogInfo } from "../data/WaterLogInfo";
import FarmEventItem from "./item/FarmEventItem";
/**
 * 农场日志
 */
export default class FarmEventWnd extends BaseWindow {
  public txtNoEvent: fgui.GTextField;
  public eventList: fgui.GList;
  public c1: fgui.Controller;
  private _logList: Array<any> = [];
  public OnInitWind() {
    super.OnInitWind();
    this.c1 = this.getController("c1");
    this._logList = WaterManager.Instance.logList;
    // this._logList = ArrayUtils.sortOn(this._logList, "time", ArrayConstant.NUMERIC | ArrayConstant.DESCENDING);
    this.setCenter();
    this.eventList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.eventList.numItems = this._logList.length;
    if (this._logList.length == 0) {
      this.c1.selectedIndex = 1;
    } else {
      this.c1.selectedIndex = 0;
    }
  }

  private renderListItem(index: number, item: FarmEventItem) {
    let realIdx = this._logList.length - index - 1;
    item.info = this._logList[realIdx];
  }

  OnShowWind() {
    super.OnShowWind();
  }

  OnHideWind() {
    super.OnHideWind();
  }

  dispose() {
    super.dispose();
  }
}
