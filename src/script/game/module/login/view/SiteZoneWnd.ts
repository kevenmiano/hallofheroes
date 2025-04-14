import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import SDKManager from "../../../../core/sdk/SDKManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { EmWindow } from "../../../constant/UIDefine";
import { PathManager } from "../../../manager/PathManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import DisplayLoader from "../../../utils/DisplayLoader";
import { getZoneData, saveZoneData } from "../manager/SiteZoneCtrl";
import SiteZoneItem from "./SiteZoneItem";
import BaseChannel from "../../../../core/sdk/base/BaseChannel";
import { NativeChannel } from "../../../../core/sdk/native/NativeChannel";
import LoginLoad from "../LoginLoad";
import Utils from "../../../../core/utils/Utils";
import { TrackEventNode } from "../../../constant/GameEventCode";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
import { RPT_EVENT } from "../../../../core/thirdlib/RptEvent";
import SiteZoneData from "../model/SiteZoneData";

/**
 * 选择大区
 */
export default class SiteZoneWnd extends BaseWindow {
  private frame: fgui.GComponent;
  private loginBackground: fgui.GComponent;
  private list: fgui.GList;
  private btnConfirm: UIButton;
  private selectItemData: SiteZoneData = null;

  constructor() {
    super();
    this.resizeContent = true;
    this.adjEvent = new Map();
    this.trackEvent = new Map();
    //1 南美 us 2 欧洲 eu 3 大洋洲  oa
    let type1 = [RPT_EVENT.CLICK_US_CHOOSE, RPT_EVENT.CLICK_US_CONFIRM];
    let type2 = [RPT_EVENT.CLICK_EU_CHOOSE, RPT_EVENT.CLICK_EU_CONFIRM];
    let type3 = [RPT_EVENT.CLICK_OA_CHOOSE, RPT_EVENT.CLICK_OA_CONFIRM];
    this.adjEvent.set(1, type1);
    this.adjEvent.set(2, type2);
    this.adjEvent.set(3, type3);

    //1 南美 us 2 欧洲 eu 3 大洋洲  oa

    let track1 = [
      TrackEventNode.CLICK_US_CHOOSE,
      TrackEventNode.CLICK_US_CONFIRM,
      "selectSite",
      "选择南美大区",
    ];
    let track2 = [
      TrackEventNode.CLICK_EU_CHOOSE,
      TrackEventNode.CLICK_EU_CONFIRM,
      "selectSite",
      "选择欧洲大区",
    ];
    let track3 = [
      TrackEventNode.CLICK_OA_CHOOSE,
      TrackEventNode.CLICK_OA_CONFIRM,
      "selectSite",
      "选择大洋洲大区",
    ];
    this.trackEvent.set(1, track1);
    this.trackEvent.set(2, track2);
    this.trackEvent.set(3, track3);
  }

  public OnInitWind(): void {
    super.OnInitWind();
    this.addEvent();
    Logger.info("SiteZoneWnd---");
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "switch.siteZone.title",
    );
    this.list.numItems = PathManager.info.SITE_ZONE.length;
    this.list.selectedIndex = this.defaultSelectIndex;
    this.selectItemData = PathManager.info.SITE_ZONE[this.list.selectedIndex];
    let c1 = this.getController("c1");
    if (getZoneData()) {
      c1.selectedIndex = 1;
    } else {
      c1.selectedIndex = 0;
    }
    LoginLoad.onLoadSpine(
      this.loginBackground.displayObject,
      LoginLoad.LOGIN_SKELETON,
    );
  }

  private get defaultSelectIndex(): number {
    let lastData = getZoneData();
    let siteData = PathManager.info.SITE_ZONE;
    if (lastData) {
      for (let key in siteData) {
        if (Object.prototype.hasOwnProperty.call(siteData, key)) {
          let siteItem: any = siteData[key];
          if (siteItem.siteID == lastData.siteID) {
            return Number(key);
          }
        }
      }
    }
    return 0;
  }

  private renderListItem(index: number, item: SiteZoneItem) {
    if (item && !item.isDisposed) {
      item.info = PathManager.info.SITE_ZONE[index];
    }
  }

  private addEvent() {
    this.btnConfirm.onClick(this, this.onClick);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.on(fairygui.Events.CLICK_ITEM, this, this._onSelectedItem);
  }

  private offEvent() {
    this.btnConfirm.offClick(this, this.onClick);
    // this.list.itemRenderer && this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    this.list.off(fairygui.Events.CLICK_ITEM, this, this._onSelectedItem);
  }

  private onClick() {
    if (this.selectItemData) {
      this.adjustEvent(this.selectItemData.area, 0);

      let lastData = getZoneData();
      let langCfg = getdefaultLangageCfg();
      if (lastData) {
        if (lastData.siteID != this.selectItemData.siteID) {
          var prompt: string =
            LangManager.Instance.GetTranslation("public.prompt");
          var confirm1: string =
            LangManager.Instance.GetTranslation("public.confirm");
          var cancel1: string =
            LangManager.Instance.GetTranslation("public.cancel");
          let msg = LangManager.Instance.GetTranslation(
            "switch.siteZone.confirmtips",
            this.selectItemData.siteName[langCfg.key],
          );
          SimpleAlertHelper.Instance.Show(
            SimpleAlertHelper.SIMPLE_ALERT,
            this.selectItemData,
            prompt,
            msg,
            confirm1,
            cancel1,
            (ok: boolean, v2: boolean, data) => {
              if (ok) {
                saveZoneData(data);
                // this.adjustEvent(this.selectItemData.area, 1);
                // SDKManager.Instance.getChannel().trackEvent(0, TrackEventNode.Node_1005, "selectSite", "选择大区", "", "");
                SDKManager.Instance.getChannel().reportData({
                  area: data.area,
                  user: this.frameData.user ? this.frameData.user.user : "",
                  time: new Date().getTime(),
                });
                SDKManager.Instance.getChannel().reload();
                return;
              }
            },
          );
        } else {
          super.OnBtnClose();
        }
      } else {
        var prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        var confirm1: string =
          LangManager.Instance.GetTranslation("public.confirm");
        var cancel1: string =
          LangManager.Instance.GetTranslation("public.cancel");
        let msg = LangManager.Instance.GetTranslation(
          "switch.siteZone.confirmtips",
          this.selectItemData.siteName[langCfg.key],
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          this.selectItemData,
          prompt,
          msg,
          confirm1,
          cancel1,
          (ok: boolean, v2: boolean, data) => {
            if (ok) {
              saveZoneData(data);
              // this.adjustEvent(this.selectItemData.area, 1);
              // SDKManager.Instance.getChannel().trackEvent(0, TrackEventNode.Node_1005, "selectSite", "选择大区", "", "");
              SDKManager.Instance.getChannel().reportData({
                area: data.area,
                user: this.frameData.user ? this.frameData.user.user : "",
                time: new Date().getTime(),
              });
              if (DisplayLoader.isDebug) {
                FrameCtrlManager.Instance.open(EmWindow.DebugLogin);
              } else {
                FrameCtrlManager.Instance.open(EmWindow.Login, this.frameData);
              }
              return;
            }
          },
        );
      }
    }
  }

  /**
   * 上报事件
   * @param type
   * @param value
   */
  private adjEvent: Map<number, string[]> = new Map();
  private trackEvent: Map<number, any[]> = new Map();
  private adjustEvent(type: number, value: number) {
    return;
    let keyValue = null;
    let keyMap = null;
    if (this.adjEvent) {
      keyMap = this.adjEvent.get(type);
      keyValue = "";
      if (keyMap && keyMap.length) {
        keyValue = keyMap[value];
      }
      if (keyValue && keyValue != "") {
        SDKManager.Instance.getChannel().adjustEvent(keyValue);
      }
    }

    //traceEvent
    if (this.trackEvent) {
      keyMap = this.trackEvent.get(type);
      if (keyMap && keyMap.length) {
        keyValue = keyMap[value];
      }
      if (keyValue) {
        let keyName = keyValue[2];
        let keyDes = keyValue[3];
        SDKManager.Instance.getChannel().trackEvent(
          0,
          keyValue,
          keyName,
          keyDes,
          "",
          "",
        );
      }
    }
  }

  private _onSelectedItem(item: SiteZoneItem) {
    let selectItemData = item.info;
    this.selectItemData = selectItemData;
  }

  public OnShowWind(): void {
    super.OnShowWind();
    SDKManager.Instance.getChannel().trackEvent(
      0,
      TrackEventNode.Node_1004,
      "openSelectSiteWnd",
      "进入选大区界面",
      "",
      "",
    );
    let channel: BaseChannel = SDKManager.Instance.getChannel();
    if (channel instanceof NativeChannel) {
      channel.gameEnterOver();
    }
  }

  public OnHideWind(): void {
    this.selectItemData = null;
    this.offEvent();
    super.OnHideWind();
  }

  dispose(dispose?: boolean): void {
    LoginLoad.destorySpine();
    super.dispose(dispose);
  }
}
