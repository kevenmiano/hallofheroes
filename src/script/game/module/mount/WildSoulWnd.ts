import BaseWindow from "../../../core/ui/Base/BaseWindow";
import {
  MountsEvent,
  NotificationEvent,
} from "../../constant/event/NotificationEvent";
import { MountsManager } from "../../manager/MountsManager";
import { MountInfo } from "./model/MountInfo";
import { WildSoulCollection } from "./model/WildSoulCollection";
import WildSoulItem from "./WildSoulItem";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import Utils from "../../../core/utils/Utils";
import { t_s_mounttemplateData } from "../../config/t_s_mounttemplate";

/**
 * 兽魂界面
 */
export default class WildSoulWnd extends BaseWindow {
  private valueTxt: fgui.GTextField;
  private itemList: fgui.GList = null;
  public tab: fgui.Controller;

  public vipCtrl: fgui.Controller;
  private _mountArray: t_s_mounttemplateData[];

  public r1: fgui.GImage;
  public r2: fgui.GImage;
  public r3: fgui.GImage;
  public r4: fgui.GImage;
  public r5: fgui.GImage;
  public r6: fgui.GImage;

  private cacheArray: t_s_mounttemplateData[][] = [];

  private redPoints: fgui.GImage[];

  public OnInitWind() {
    super.OnInitWind();
    this.redPoints = [this.r1, this.r2, this.r3, this.r4, this.r5, this.r6];
    this.tab = this.getController("tab");
    this.vipCtrl = this.getController("vipCtrl");
    this.setDefaultSelected();
    this.addEvent();
    this.valueTxt
      .setVar("count", this.curMountInfo.soulScore.toString())
      .flushVars();
    MountsManager.Instance.requestWildSoulList();
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.itemList.setVirtual();
    this.setCenter();
    this.updateRedpoint();
  }

  private addEvent() {
    this.tab.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    this.itemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.avatarList.addEventListener(
      MountsEvent.MOUNT_LIST_CHANGE,
      this.__onListChange,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CLOSE_MOUNT_REFINING_WND,
      this.__onListChange,
      this,
    );
  }

  private removeEvent() {
    this.tab.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    this.itemList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.avatarList.removeEventListener(
      MountsEvent.MOUNT_LIST_CHANGE,
      this.__onListChange,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CLOSE_MOUNT_REFINING_WND,
      this.__onListChange,
      this,
    );
  }

  private updateRedpoint() {
    for (let i = 0; i < this.redPoints.length; i++) {
      this.redPoints[i].visible = this.avatarList.checkRedPointByIndex(i);
    }
  }

  private setDefaultSelected() {
    if (MountsManager.Instance.vipMountActivity) {
      this.tab.selectedIndex = 1;
      MountsManager.Instance.vipMountActivity = false;
    } else {
      this.tab.selectedIndex = 0;
    }
    //viptab页签是否展示
    this.vipCtrl.selectedIndex =
      this.avatarList.getMountTemplatesByType(5).length > 0 ? 1 : 0;
  }

  private onClickItem(item: WildSoulItem) {
    FrameCtrlManager.Instance.open(EmWindow.MountInfoWnd, item);
  }

  private onTabChanged(cc: fgui.Controller) {
    this.itemList.numItems = 0;
    let tabIndex = cc.selectedIndex;
    if (!this.cacheArray[tabIndex]) {
      this.cacheArray[tabIndex] =
        this.avatarList.getMountTemplatesByType(tabIndex);
    }
    this._mountArray = this.cacheArray[tabIndex];
    if (this._mountArray) {
      this.itemList.numItems = this._mountArray.length;
      if (this._mountArray.length > 0) {
        this.itemList.scrollToView(0);
      }
    }
  }

  private renderListItem(index: number, item: WildSoulItem) {
    item.vData = this._mountArray[index];
  }

  private __onListChange() {
    let tabIndex = this.tab.selectedIndex;
    if (!this.cacheArray[tabIndex]) {
      this.cacheArray[tabIndex] =
        this.avatarList.getMountTemplatesByType(tabIndex);
    }
    this._mountArray = this.cacheArray[tabIndex];
    if (this._mountArray) {
      this.itemList.numItems = this._mountArray.length;
    }
    this.valueTxt
      .setVar("count", this.curMountInfo.soulScore.toString())
      .flushVars();

    this.updateRedpoint();
  }

  public get avatarList(): WildSoulCollection {
    return MountsManager.Instance.avatarList;
  }

  public get curMountInfo(): MountInfo {
    return MountsManager.Instance.mountInfo;
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose() {
    super.dispose();
  }
}
