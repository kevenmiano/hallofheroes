//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-09 18:32:17
 * @LastEditTime: 2024-04-17 14:37:02
 * @LastEditors: jeremy.xu
 * @Description: 洗练item
 */

import FUI_ForgeRefreshItem from "../../../../../fui/Forge/FUI_ForgeRefreshItem";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { StoreEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ForgeCtrl from "../ForgeCtrl";

export default class ForgeRefreshItem extends FUI_ForgeRefreshItem {
  private _skillTempId = -1;
  private _info: any;
  public get info() {
    return this._info;
  }
  public set info(value: any) {
    this._info = value;
    this.txtCur.text = "";
    this.txtNext.text = "";
  }

  protected onConstruct() {
    super.onConstruct();

    this.randomSkill = -1;
    this.randomNewSkill = -1;

    this.btnLock.onClick(this, this.onBtnLock);
  }

  private onBtnLock() {
    if (!this.ctrl.clcikLockFirst && this.selected == true) {
      this.selected = false;
      if (this._skillTempId == -1) {
        return;
      }
      let content: string;
      content = LangManager.Instance.GetTranslation(
        "store.view.refresh.RefreshAttriItem.content.refreshLock",
      );

      let checkStr = LangManager.Instance.GetTranslation(
        "mainBar.view.VipCoolDownFrame.useBind",
      );
      let checkStr2 = LangManager.Instance.GetTranslation(
        "mainBar.view.VipCoolDownFrame.promptTxt",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.USEBINDPOINT_ALERT,
        {
          checkRickText: checkStr,
          checkRickText2: checkStr2,
          checkDefault: true,
        },
        null,
        content,
        null,
        null,
        this._confirmLockFirst.bind(this),
      );
      return;
    }
    if (this._skillTempId == -1) {
      this.selected = false;
    } else {
      this.selected = this.selected;
    }

    this.ctrl.data.dispatchEvent(StoreEvent.REFRESH_LOCK_CHANGE);
  }

  private _confirmLockFirst(value: boolean, flag: boolean) {
    if (value) this.ctrl.clcikLockFirst = true;
    this.selected = value;
    this.ctrl.useBind = flag;
    this.ctrl.data.dispatchEvent(StoreEvent.REFRESH_LOCK_CHANGE);
  }

  public set randomSkill(id: number) {
    let temp: t_s_skilltemplateData =
      TempleteManager.Instance.getSkillTemplateInfoById(id);
    if (!temp) return;
    this.txtCur.text =
      temp.SkillTemplateName +
      " (" +
      LangManager.Instance.GetTranslation(
        "store.view.refresh.RefreshAttriItem.Grades",
        temp.Grades,
      ) +
      ")";
    if (this._skillTempId != id) {
      this.ctrl.data.dispatchEvent(StoreEvent.REFRESH_LOCK_CHANGE);
    }
    this._skillTempId = id;
  }

  public set randomNewSkill(id: number) {
    let temp: t_s_skilltemplateData =
      TempleteManager.Instance.getSkillTemplateInfoById(id);
    if (!temp) return;
    this.txtNext.text =
      temp.SkillTemplateName +
      " (" +
      LangManager.Instance.GetTranslation(
        "store.view.refresh.RefreshAttriItem.Grades",
        temp.Grades,
      ) +
      ")";
  }

  public get ctrl(): ForgeCtrl {
    let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl;
    return ctrl;
  }

  public get selected() {
    return this.btnLock.selected;
  }

  public set selected(value: boolean) {
    this.btnLock.selected = value;
    this.txtCur.color = value ? "#39A82D" : "#FFECC6";
    this.txtNext.color = value ? "#39A82D" : "#FFC68F";
  }

  public resetItem() {
    this.txtCur.text = "";
    this.txtNext.text = "";
    this._skillTempId = -1;
    this.selected = false;
  }
}
