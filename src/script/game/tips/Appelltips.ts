import LangManager from "../../core/lang/LangManager";
import { AppellView } from "../avatar/view/AppellView";
import { t_s_appellData } from "../config/t_s_appell";
import BaseTips from "./BaseTips";
import AppellModel from "../module/appell/AppellModel";

/**
 * @author:pzlricky
 * @data: 2021-10-27 10:38
 * @description 称号提示
 */
export default class Appelltips extends BaseTips {
  public txt_content: fgui.GRichTextField;
  private _data: t_s_appellData;
  private group: fgui.GGroup;
  private txt_name: fgui.GLabel;
  private _appellTipView: AppellView = null;

  public OnInitWind() {
    super.OnInitWind();
    this.txt_content.text = LangManager.Instance.GetTranslation(
      "yishi.view.tips.AppellInfoTips.AppellTalkDescribeTxt",
    );
    this._data = this.params[0];
    if (!this._data) {
      return;
    }
    this.txt_content.group = this.group;
    if (this.group) {
      this.group.ensureSizeCorrect();
    }
    LangManager.Instance.GetTranslation(
      "yishi.view.tips.AppellInfoTips.AppellTopDescribeTxt",
    ); //装备栏效果
    LangManager.Instance.GetTranslation(
      "yishi.view.tips.AppellInfoTips.AppellTalkDescribeTxt",
    ); //聊天栏效果
    // this._appellTipView = new AppellView(this._data.ImgWidth, this._data.ImgHeight, this._data.TemplateId);
    // this.group.parent.displayObject.addChild(this._appellTipView);
    // this._appellTipView.x = (- this._data.ImgWidth) / 2;
    // this._appellTipView.y = this.container.y;

    this.txt_name.titleFontSize = this._data.TextFontSize
      ? this._data.TextFontSize
      : 20;
    this.txt_name.color = AppellModel.getTextColorAB(this._data.TextColorIdx);
    this.txt_name.text = this._data.TitleLang;
  }

  createModel() {
    super.createModel();
    this.modelMask.alpha = 0;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  protected OnClickModal() {
    super.OnClickModal();
    this.hide();
  }

  public OnHideWind() {
    // if (this._appellTipView) {
    //     this._appellTipView.dispose();
    // }
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
