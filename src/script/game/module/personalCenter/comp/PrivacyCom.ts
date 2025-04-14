//@ts-expect-error: External dependencies
import FUI_PrivacyCom from "../../../../../fui/PersonalCenter/FUI_PrivacyCom";
import { TempleteManager } from "../../../manager/TempleteManager";
import SettingData from "../../setting/SettingData";
import PrivateListItem from "../item/PrivateListItem";
import BaseChannel from "../../../../core/sdk/base/BaseChannel";
import SDKManager from "../../../../core/sdk/SDKManager";
import LangManager from "../../../../core/lang/LangManager";
import { ConfigManager } from "../../../manager/ConfigManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { NativeEvent } from "../../../constant/event/NotificationEvent";
import Utils from "../../../../core/utils/Utils";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";

export enum AthorzieType {
  Phone = "Phone",
  Save = "Save",
  MicroPhone = "MicroPhone",
  Camera = "Camera",
  Location = "Location",
  Msg = "Msg",
}
/**
 * 个人中心里的私有相关页面: 需要手机端提供对应的授权接口
 */
export default class PrivacyCom extends FUI_PrivacyCom {
  private listData: SettingData[] = [];
  private url0: string = "";
  private url1: string = "";

  onConstruct() {
    super.onConstruct();
    this.onInit();
    this.addEvent();
    this.initData();
  }

  private onInit(): void {
    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("Privacy_protection");
    if (cfg) {
      this.url0 = cfg.ConfigValue;
    }
    cfg = TempleteManager.Instance.getConfigInfoByConfigName("User_Agreement");
    if (cfg) {
      this.url1 = cfg.ConfigValue;
    }
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList,
      null,
      false,
    );
  }

  public initData(): void {
    this.listData = [];
    let settingData: SettingData = null;

    let channel: BaseChannel = SDKManager.Instance.getChannel();
    settingData = new SettingData();
    settingData.Title = LangManager.Instance.GetTranslation(
      "PrivacyCom.settingData.title1",
    );
    settingData.Value = LangManager.Instance.GetTranslation(
      "PrivacyCom.settingData.Value1",
    );
    settingData.type = "android.permission.READ_PHONE_STATE";
    settingData.Progress = channel.checkPermission(
      "android.permission.READ_PHONE_STATE",
    ); //SharedManager.Instance.authorizDic[AthorzieType.Phone];
    // this.listData.push(settingData);

    settingData = new SettingData();
    settingData.Title = LangManager.Instance.GetTranslation(
      "PrivacyCom.settingData.title2",
    );
    settingData.Value = LangManager.Instance.GetTranslation(
      "PrivacyCom.settingData.Value2",
    );
    settingData.type = "android.permission.READ_EXTERNAL_STORAGE";
    settingData.Progress = channel.checkPermission(
      "android.permission.READ_EXTERNAL_STORAGE",
    ); //SharedManager.Instance.authorizDic[AthorzieType.Save];
    this.listData.push(settingData);

    settingData = new SettingData();
    settingData.Title = LangManager.Instance.GetTranslation(
      "PrivacyCom.settingData.title3",
    );
    settingData.Value = LangManager.Instance.GetTranslation(
      "PrivacyCom.settingData.Value3",
    );
    settingData.type = "android.permission.RECORD_AUDIO";
    settingData.Progress = channel.checkPermission(
      "android.permission.RECORD_AUDIO",
    ); //SharedManager.Instance.authorizDic[AthorzieType.MicroPhone];
    this.listData.push(settingData);

    // settingData = new SettingData();
    // settingData.Title = '相机';
    // settingData.Value = "体验拍照上传等游戏功能；";
    // settingData.Progress =channel.checkPermission("android.permission.CAMERA");//SharedManager.Instance.authorizDic[AthorzieType.Camera];
    // this.listData.push(settingData);

    // settingData = new SettingData();
    // settingData.Title = '地理位置';
    // settingData.Value = "允许获取地理位置, 体验同城频道等游戏功能；";
    // settingData.Progress =channel.checkPermission("android.permission.ACCESS_FINE_LOCATION");//SharedManager.Instance.authorizDic[AthorzieType.Location];
    // this.listData.push(settingData);

    // settingData = new SettingData();
    // settingData.Title = '短信';
    // settingData.Value = "允许发送和收取验证码短信；";
    // settingData.Progress =channel.checkPermission("android.permission.SEND_SMS");//SharedManager.Instance.authorizDic[AthorzieType.Msg];
    // this.listData.push(settingData);
    this.list.numItems = this.listData.length;
    //屏蔽授权按钮
    this.btn_authorize.visible = false;
    let isPrivateActive = ConfigManager.info.COMPREHENSIVE_PRIVATE;
    this.privateLInk.selectedIndex = isPrivateActive ? 1 : 0;
  }

  private addEvent(): void {
    this.btn_link0.on(Laya.Event.LINK, this, this.onPrivacyLink);
    this.btn_link1.on(Laya.Event.LINK, this, this.onPrivacyLink);
    this.btn_authorize.onClick(this, this.onClickHandler, [2]);

    NotificationManager.Instance.addEventListener(
      NativeEvent.PERMISSION_UPDATE,
      this.updateView,
      this,
    );
  }

  private onRenderList(index: number, item: PrivateListItem) {
    let itemData = this.listData[index];
    item.info = itemData;
  }

  private onPrivacyLink(evtData: string) {
    let textData = evtData;
    if (!textData || textData == "") return;
    let clickType = textData;
    UIManager.Instance.ShowWind(EmWindow.HTMLWnd, clickType);
  }

  private onClickHandler(index: number): void {
    switch (index) {
      case 0:
        if (!Utils.isApp()) {
          Laya.Browser.window.open(this.url0);
        } else {
          SDKManager.Instance.getChannel().openURL(this.url0);
        }
        break;
      case 1:
        if (!Utils.isApp()) {
          Laya.Browser.window.open(this.url1);
        } else {
          SDKManager.Instance.getChannel().openURL(this.url1);
        }
        break;
      case 2: //授权管理
        //测试
        // Person
        break;

      default:
        break;
    }
  }

  public removeEvent(): void {
    this.btn_link0.off(Laya.Event.LINK, this, this.onPrivacyLink);
    this.btn_link1.off(Laya.Event.LINK, this, this.onPrivacyLink);
    this.btn_authorize.offClick(this, this.onClickHandler);
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    NotificationManager.Instance.removeEventListener(
      NativeEvent.PERMISSION_UPDATE,
      this.updateView,
      this,
    );
  }

  private updateView() {
    this.initData();
  }
}
