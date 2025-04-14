import FUI_ConsortiaActivityItem from "../../../../../../fui/Consortia/FUI_ConsortiaActivityItem";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ConsortiaActivityInfo } from "../../data/ConsortiaActivityInfo";
import { ConsortiaSecretInfo } from "../../data/ConsortiaSecretInfo";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import LangManager from "../../../../../core/lang/LangManager";
import ConfigInfoManager from "../../../../manager/ConfigInfoManager";
import Utils from "../../../../../core/utils/Utils";
import StringHelper from "../../../../../core/utils/StringHelper";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { getdefaultLangageCfg } from "../../../../../core/lang/LanguageDefine";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { SceneManager } from "../../../../map/scene/SceneManager";
import SceneType from "../../../../map/scene/SceneType";
import { isOversea } from "../../../login/manager/SiteZoneCtrl";
import { SwitchPageHelp } from "../../../../utils/SwitchPageHelp";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/21 14:32
 * @ver 1.0
 *
 */
export class ConsortiaActivityItem extends FUI_ConsortiaActivityItem {
  private _data: ConsortiaActivityInfo;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.operatingBtn.title = LangManager.Instance.GetTranslation(
      "ConsortiaActivityItem.operatingBtn",
    );
    this.gotoTxtBtn.title = LangManager.Instance.GetTranslation(
      "ConsortiaActivityPage.gotoTxtBtn",
    );
    this.initEvent();
    this.initView();
  }

  private initEvent() {
    this.gotoTxtBtn.onClick(this, this.__gotoTxtBtnClickHandler);
    this.operatingBtn.onClick(this, this.__operatingBtnClickHandler);
  }

  private initView() {}

  private __operatingBtnClickHandler(evt: MouseEvent) {
    if (this._data.operatingFun != null) {
      this._data.operatingFun();
    }
  }

  public refreshView(value: ConsortiaActivityInfo) {
    if (value != null) {
      this._data = value;
      this.promptText.visible = false;
      this.activityName.visible = true;
      this.activityIcon.visible = true;
      let langCfg = getdefaultLangageCfg();
      switch (this._data.id) {
        case 0:
          this.activityIcon.icon = fgui.UIPackage.getItemURL(
            "Consortia",
            "asset.consortiaSkillIcon",
          );
          this.activityName.text = LangManager.Instance.GetTranslation(
            "ConsortiaActivityItem.activityName1",
          );
          this.setEffect(false);
          break;
        case 1:
          this.activityIcon.icon = fgui.UIPackage.getItemURL(
            "Consortia",
            "asset.SecretTerritoryIcon",
          );
          this.activityName.text = LangManager.Instance.GetTranslation(
            "ConsortiaActivityItem.activityName2",
          );
          this.setEffect(
            this.treeState == ConsortiaSecretInfo.GIVE_POWER_STATE,
          );
          break;
        case 2:
          this.activityIcon.icon = fgui.UIPackage.getItemURL(
            "Consortia",
            "Btn_Eve_Outland",
          );
          this.activityName.text = LangManager.Instance.GetTranslation(
            "ConsortiaActivityItem.activityName3",
          );
          this.gotoTxtBtn.title = this._data.btnLabel;
          let dayValue: number;
          let dayStr: string = "";
          let openDayStr: string;
          let openDayArr: Array<number> =
            ConfigInfoManager.Instance.getOutyardOpenDay();
          if (openDayArr) {
            for (let i: number = 0; i < openDayArr.length; i++) {
              dayValue = parseInt(openDayArr[i].toString());
              if (dayValue == 7) {
                if (isOversea()) {
                  dayStr = Utils.getWeekStr(dayValue, langCfg.key);
                } else {
                  dayStr = LangManager.Instance.GetTranslation(
                    "consortBoss.openTxt",
                    LangManager.Instance.GetTranslation("public.daily"),
                  );
                }
              }
              if (StringHelper.isNullOrEmpty(openDayStr)) {
                openDayStr = LangManager.Instance.GetTranslation(
                  "consortBoss.openTxt",
                  Utils.getWeekStr(dayValue, langCfg.key),
                );
              } else {
                if (dayValue == 7) {
                  if (isOversea()) {
                    openDayStr += " " + Utils.getWeekStr(dayValue, langCfg.key);
                  } else {
                    openDayStr +=
                      " " + LangManager.Instance.GetTranslation("public.daily");
                  }
                } else {
                  openDayStr += " " + Utils.getWeekStr(dayValue, langCfg.key);
                }
              }
            }
          }
          this.timeText.text = LangManager.Instance.GetTranslation(
            "ConsortiaBossWnd.openTime",
            openDayStr,
          );
          this.timeText.visible = true;
          break;
        case 3:
          this.activityIcon.icon = fgui.UIPackage.getItemURL(
            "Consortia",
            "asset.consortiaboss",
          );
          this.activityName.text = LangManager.Instance.GetTranslation(
            "ConsortiaBossWnd.title",
          );
          let openTimeArr: Array<number> =
            ConfigInfoManager.Instance.getConsortiabossOpeningdate();
          let value: number;
          let openStr: string;
          let str: string;
          if (openTimeArr) {
            for (let i: number = 0; i < openTimeArr.length; i++) {
              value = parseInt(openTimeArr[i].toString());
              if (value == 7) {
                if (isOversea()) {
                  str = Utils.getWeekStr(value, langCfg.key);
                } else {
                  str = LangManager.Instance.GetTranslation(
                    "consortBoss.openTxt",
                    LangManager.Instance.GetTranslation("public.daily"),
                  );
                }
              } else {
                str = LangManager.Instance.GetTranslation(
                  "consortBoss.openTxt",
                  Utils.getWeekStr(value, langCfg.key),
                );
              }
              if (StringHelper.isNullOrEmpty(openStr)) {
                openStr = str;
              } else {
                openStr += " " + str;
              }
            }
            this.timeText.text = LangManager.Instance.GetTranslation(
              "ConsortiaBossWnd.openTime",
              openStr,
            );
            this.timeText.visible = true;
          }
          this.setEffect(
            ConsortiaManager.Instance.model.bossInfo.state == 1 ||
              ConsortiaManager.Instance.model.bossInfo.state == 2,
          );
          break;
        case 4:
          this.activityIcon.icon = fgui.UIPackage.getItemURL(
            "Consortia",
            "asset.consorTreasure",
          );
          this.activityName.text = LangManager.Instance.GetTranslation(
            "ConsortiaTreasure.title",
          );
          break;
        case 5:
          this.activityIcon.icon = fgui.UIPackage.getItemURL(
            "Consortia",
            "asset.consortiaDevilIcon",
          );
          this.activityName.text = LangManager.Instance.GetTranslation(
            "ConsortiaActivityItem.activityName4",
          );
          this.setEffect(this.demonState == 1);
          break;
        case 6:
          this.activityIcon.icon = fgui.UIPackage.getItemURL(
            "Consortia",
            "asset.consortiaMineIcon",
          );
          this.activityName.text = LangManager.Instance.GetTranslation(
            "ConsortiaActivityItem.activityName5",
          );
          this.setEffect(false);
          break;
      }
      this.initData();
    }
  }

  /**
   * todo 开启特效
   * @param b
   * @private
   */
  private setEffect(b: boolean) {
    if (b && this.model.getNeedByEffectKey(this._data.id)) {
      this.openMovie.visible = true;
    } else {
      this.openMovie.visible = false;
    }
  }

  private get treeState(): number {
    return this.model.secretInfo.treeState;
  }

  private get demonState(): number {
    return this.model.demonInfo.state;
  }

  private get model(): ConsortiaModel {
    return ConsortiaManager.Instance.model;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public __gotoTxtBtnClickHandler() {
    if (this._data.id != 0) {
      if (!SwitchPageHelp.checkScene()) return;
    }
    if (this.openMovie) {
      this.model.openEffectDic[this._data.id] = false;
      this.openMovie.visible = false;
    }
    if (this._data.gotoFunction != null) {
      this._data.gotoFunction();
    }
  }

  public initData() {
    if (this._data.operatingFun != null) {
      this.operatingBtn.visible = true;
      this.operatingBtn.text = this._data.btnLabel;
      this.operatingBtn.enabled = this._data.isEnabled;
    } else {
      this.operatingBtn.visible = false;
    }

    if (this._data.gotoFunction != null) {
      this.gotoTxtBtn.visible = true;
      this.gotoTxtBtn.enabled = true;
    } else {
      this.gotoTxtBtn.visible = true;
      this.gotoTxtBtn.enabled = false;
    }

    if (this._data.promptTxt != "") {
      this.promptText.text = this._data.promptTxt;
      this.promptText.visible = true;
    }

    if (!this._data.isOpen) {
      this.open.selectedIndex = 1;
    } else {
      this.open.selectedIndex = 0;
    }
  }

  private removeEvent() {
    this.gotoTxtBtn.offClick(this, this.__gotoTxtBtnClickHandler);
    this.operatingBtn.offClick(this, this.__operatingBtnClickHandler);
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  dispose() {
    this.removeEvent();
    this._data = null;
    super.dispose();
  }
}
