//@ts-expect-error: External dependencies
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { TempleteManager } from "../../manager/TempleteManager";
import OutyardRewardInfo from "./data/OutyardRewardInfo";
import OutyardConsortiaRewardItem from "./view/OutyardConsortiaRewardItem";
import OutyardPersonRewardItem from "./view/OutyardPersonRewardItem";
/**
 * 奖励展示界面
 */
export default class OutyardRewardWnd extends BaseWindow {
  public c1: fgui.Controller;
  public personList: fgui.GList;
  public consortiaList: fgui.GList;
  private _listData: Array<OutyardRewardInfo> = [];
  public OnInitWind() {
    this.setCenter();
    this.c1 = this.getController("c1");
    this.addEvent();
    this.c1.selectedIndex == 0;
    this.onChangeController();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  private addEvent() {
    this.personList.itemRenderer = Laya.Handler.create(
      this,
      this.renderPersonListItem,
      null,
      false,
    );
    this.consortiaList.itemRenderer = Laya.Handler.create(
      this,
      this.renderConsortiaListItem,
      null,
      false,
    );
    this.c1.on(fgui.Events.STATE_CHANGED, this, this.onChangeController);
  }

  private removeEvent() {
    // this.personList.itemRenderer.recover();
    // this.consortiaList.itemRenderer.recover();
    Utils.clearGListHandle(this.personList);
    Utils.clearGListHandle(this.consortiaList);
    this.c1.off(fgui.Events.STATE_CHANGED, this, this.onChangeController);
  }

  private renderPersonListItem(index: number, item: OutyardPersonRewardItem) {
    if (!item || item.isDisposed) return;
    item.info = this._listData[index];
  }

  private renderConsortiaListItem(
    index: number,
    item: OutyardConsortiaRewardItem,
  ) {
    if (!item || item.isDisposed) return;
    item.info = this._listData[index];
  }

  private onChangeController() {
    switch (this.c1.selectedIndex) {
      case 0:
        this._listData = TempleteManager.Instance.getOutyardRewardByType(2);
        this.personList.numItems = this._listData.length;
        break;
      case 1:
        this._listData = TempleteManager.Instance.getOutyardRewardByType(1);
        this.consortiaList.numItems = this._listData.length;
        break;
    }
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose() {
    super.dispose();
  }
}
