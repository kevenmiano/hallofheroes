/*
 * @Author: jeremy.xu
 * @Date: 2021-11-25 14:27:26
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-28 11:00:05
 * @Description:
 */

import BaseTips from "./BaseTips";
import { SecretTresureInfo } from "../datas/secret/SecretTresureInfo";
import LangManager from "../../core/lang/LangManager";

export class SecretTresureTip extends BaseTips {
  public txt_name: fgui.GTextField;
  public txt_desc: fgui.GTextField;
  public txt_type: fgui.GTextField;
  public imgIcon: fgui.GLoader;
  public imgProfile: fgui.GLoader;

  private _info: SecretTresureInfo;

  OnShowWind() {
    super.OnShowWind();
    this.initData();
    this.updateView();
  }

  OnHideWind() {
    super.OnHideWind();
  }

  private initData() {
    this._info = this.params[0];
  }

  private updateView() {
    if (this._info) {
      this.txt_name.text = this._info.template.TemplateNameLang;
      this.txt_name.color = this._info.template.profileColor;
      this.txt_desc.text = this._info.template.DescriptionLang;
      this.imgIcon.url = this._info.template.iconPath;
      this.imgProfile.url = this._info.template.profilePath;
      this.txt_type.text = LangManager.Instance.GetTranslation(
        this._info.template.Type == 1
          ? "Pve.secretScene.buffType01"
          : "Pve.secretScene.buffType02"
      );
    }
  }

  protected OnClickModal() {
    this.hide();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
