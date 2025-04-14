//@ts-expect-error: External dependencies
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import OuterCityResourceInfoItem from "./OuterCityResourceInfoItem";
import { FieldData } from "../../map/castle/data/FieldData";
import Utils from "../../../core/utils/Utils";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";

/**
 * 内政厅外城资源展示
 */
export default class OuterCityResourceInfoWnd extends BaseWindow {
  public resourceList: fgui.GList;
  private _dataList: Array<FieldData>;
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initEvent();
    this.dataUpdateHandler();
  }

  private initEvent() {
    this.resourceList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    BuildingManager.Instance.addEventListener(
      BuildingEvent.U_SECURITY_INFO_UPDATE,
      this.dataUpdateHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.CLOSE_OUTERCITY_RESOURCE_WND,
      this.hide,
      this,
    );
  }

  private removeEvent() {
    Utils.clearGListHandle(this.resourceList);
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.U_SECURITY_INFO_UPDATE,
      this.dataUpdateHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.CLOSE_OUTERCITY_RESOURCE_WND,
      this.hide,
      this,
    );
  }

  private dataUpdateHandler() {
    this._dataList = BuildingManager.Instance.model.fieldArray;
    this.resourceList.numItems = this._dataList.length;
  }

  renderListItem(index: number, item: OuterCityResourceInfoItem) {
    item.info = this._dataList[index];
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
