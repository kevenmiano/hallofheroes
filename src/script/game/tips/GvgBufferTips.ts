import BaseWindow from "../../core/ui/Base/BaseWindow";
import { GvgWarBufferInfo } from "../module/consortia/data/gvg/GvgWarBufferInfo";
import LangManager from "../../core/lang/LangManager";
import BaseTips from "./BaseTips";

/**
 * @description 公会战技能buff的tips
 * @author yuanzhan.yu
 * @date 2021/11/1 17:39
 * @ver 1.0
 */
export class GvgBufferTips extends BaseTips {
  public bg: fgui.GLoader;
  public _title1: fgui.GTextField;
  public _cooldown1: fgui.GTextField;
  public _cost1: fgui.GTextField;
  public _describe1: fgui.GRichTextField;

  private _tipData: GvgWarBufferInfo;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.addEvent();
    this.updateView();
  }

  private initData() {
    [this._tipData] = this.params;
  }

  private initView() {}

  private addEvent() {}

  private updateView() {
    if (this._tipData) {
      this._title1.text = this._tipData.bufferNameLang;
      this._cooldown1.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.SkillTips.cooldown01",
        this._tipData.maxCdTimer
      );
      this._cost1.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.Gvgbuffercost",
        Math.abs(this._tipData.needPay)
      );
      this._describe1.text = this._tipData.DescriptionLang;
    }
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private removeEvent() {}

  protected OnClickModal() {
    this.OnBtnClose();
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._tipData = null;
    super.dispose(dispose);
  }
}
