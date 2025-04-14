//@ts-expect-error: External dependencies
import FUI_LanguageSetting from "../../../../../fui/Login/FUI_LanguageSetting";
import LangManager from "../../../../core/lang/LangManager";
import {
  GAME_LANG,
  GAME_LANG_WHITE,
  LANGCFG,
  getdefaultLangageCfg,
} from "../../../../core/lang/LanguageDefine";
import Logger from "../../../../core/logger/Logger";
import SDKManager from "../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../core/thirdlib/RptEvent";
import Utils from "../../../../core/utils/Utils";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { TrackEventNode } from "../../../constant/GameEventCode";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import DisplayLoader from "../../../utils/DisplayLoader";
import { isOversea } from "../manager/SiteZoneCtrl";

/**
 * 语言设置
 */
export class LanguageSetting extends FUI_LanguageSetting {
  private lastSelectIndex: number = 0;
  private _listData: LANGCFG[] = [];

  onInit() {
    this.offEvent();
    this.addEvent();
    this.onInitData();
  }

  private addEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.on(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
  }

  private offEvent() {
    Utils.clearGListHandle(this.list);
    this.list.off(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
  }

  private onInitData() {
    this._listData = [];
    //海外白名单有中文
    let isOverZone = isOversea();
    let isUser = PlayerManager.Instance.currentPlayerModel.userInfo.isWhiteUser;
    let openCfgs = TempleteManager.Instance.getConfigLanguages();
    let cfgLanguages = GAME_LANG;

    if (openCfgs && openCfgs.length) {
      let element: LANGCFG = null;
      for (const key in cfgLanguages) {
        if (Object.prototype.hasOwnProperty.call(cfgLanguages, key)) {
          element = cfgLanguages[key];
          if (openCfgs.indexOf(element.key) != -1) {
            this._listData.push(element);
          }
        }
      }
    } else {
      this._listData = cfgLanguages;
    }

    if (!isOverZone || isUser || DisplayLoader.isDebug) {
      if (GAME_LANG_WHITE[0]) this._listData.unshift(GAME_LANG_WHITE[0]);
    }

    this.list.numItems = this._listData.length;
    //default
    let languageIdx = this.getSelectLangage();
    this.lastSelectIndex = languageIdx;
    this.list.selectedIndex = this.lastSelectIndex;
  }

  /**渲染称号Item */
  renderListItem(index: number, item: fgui.GComponent) {
    var data: LANGCFG = this._listData[index];
    if (!data) return;
    item.name = data.value;
    item.text = data.value;
    item.data = data;
  }

  onListItemClick(item, evt) {
    let data = item.data;
    this.onSwitchLanguage(data);
  }

  private getSelectLangage(): number {
    let lastLanguage = SharedManager.Instance.getWindowItem("GAME_LANGUAGE");
    let defaultLangCfg = getdefaultLangageCfg();
    let languageIdx = defaultLangCfg.index;
    if (lastLanguage) {
      languageIdx = Number(lastLanguage);
    }
    let selectIndex = 0;
    let count = this._listData.length;
    let element: LANGCFG = null;
    for (let index = 0; index < count; index++) {
      element = this._listData[index];
      if (element && languageIdx == element.index) {
        return index;
      }
    }
    return selectIndex;
  }

  private onSwitchLanguage(data: LANGCFG) {
    Logger.warn("onSwitchLanguage:", data);
    let languageSelIndex = this.list.selectedIndex;
    if (languageSelIndex == this.lastSelectIndex) {
      return;
    }
    var prompt: string = LangManager.Instance.getTranslationByLan(
      "public.prompt",
      data.key,
    );
    var confirm1: string = LangManager.Instance.getTranslationByLan(
      "public.confirm",
      data.key,
    );
    var cancel1: string = LangManager.Instance.getTranslationByLan(
      "public.cancel",
      data.key,
    );
    let msg = LangManager.Instance.getTranslationByLan(
      "switchLanguage.tip",
      data.key,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      msg,
      confirm1,
      cancel1,
      (ok: boolean) => {
        if (ok) {
          SDKManager.Instance.getChannel().trackEvent(
            0,
            TrackEventNode.CLICK_LANGUAGE_CONFIRM,
            "click_language_confirm",
            "点击切换语言二级弹窗“确认”按钮",
            "",
            "",
          );
          SDKManager.Instance.getChannel().adjustEvent(
            RPT_EVENT.CLICK_LANGUAGE_CONFIRM,
          );
          SharedManager.Instance.setWindowItem(
            "GAME_LANGUAGE",
            data.index.toString(),
          );
          Utils.delay(300).then(() => {
            FrameCtrlManager.Instance.exit(EmWindow.LoginSetting);
            SDKManager.Instance.getChannel().reload();
          });
        } else {
          if (this.list) this.list.selectedIndex = this.lastSelectIndex;
        }
      },
    );
  }

  dispose(): void {
    this.offEvent();
    super.dispose();
  }
}
