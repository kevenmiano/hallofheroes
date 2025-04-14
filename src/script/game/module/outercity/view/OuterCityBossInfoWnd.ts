import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import OuterCityBossInfoItem from "../com/OuterCityBossInfoItem";
/**
 * 外城BOSS信息
 */
export default class OuterCityBossInfoWnd extends BaseWindow {
  public bossList: fgui.GList;
  private _bossInfoList: Array<WildLand> = [];
  public OnInitWind() {
    super.OnInitWind();
    this.initEvent();
    this.initData();
    this.setCenter();
  }

  public OnShowWind() {
    super.OnShowWind();
    OuterCityManager.Instance.getBossInfo(this.outerCityModel.mapId);
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  private initData() {
    this._bossInfoList = this.outerCityModel.bossInfo.bosslist;
    this.bossList.numItems = this._bossInfoList.length;
  }

  private initEvent() {
    this.bossList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.CLOSE_OUTERCITY_OUTERCITYBOSS_WND,
      this.hide,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.OUTER_CITY_GET_BOSSINFO,
      this.refreshView,
      this,
    );
  }

  private removeEvent() {
    Utils.clearGListHandle(this.bossList);
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.CLOSE_OUTERCITY_OUTERCITYBOSS_WND,
      this.hide,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.OUTER_CITY_GET_BOSSINFO,
      this.refreshView,
      this,
    );
  }

  private renderListItem(index: number, item: OuterCityBossInfoItem) {
    if (!item || item.isDisposed) return;
    item.info = this._bossInfoList[index];
  }

  private refreshView() {
    this.initData();
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
