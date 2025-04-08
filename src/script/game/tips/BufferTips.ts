import LangManager from "../../core/lang/LangManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { PlayerBufferType } from "../constant/PlayerBufferType";
import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import BaseTips from "./BaseTips";

export default class BufferTips extends BaseTips {
  public bg: fgui.GLoader;
  public titleTxt: fgui.GTextField;
  public describeTxt: fgui.GRichTextField;
  public timeTxt: fgui.GTextField;
  private _tipData: PlayerBufferInfo;

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

  protected onClickEvent() {
    this.onInitClick();
  }

  createModel() {
    super.createModel();
    this.modelMask.alpha = 0;
  }

  private initData() {
    [this._tipData] = this.params;
  }

  private initView() {}

  private addEvent() {}

  private updateView() {
    if (this._tipData) {
      this.titleTxt.text = this._tipData.name;
      this.describeTxt.text = this._tipData.description;
      if (this._tipData.bufferType == PlayerBufferType.BASE_PROPERTY_BUFFER) {
        this.timeTxt.text = LangManager.Instance.GetTranslation(
          "buffer.BasePropertyBuffer"
        );
      } else {
        if (this._tipData.leftTime > 0) {
          this.showTimeStr();
        } else {
          this.timeTxt.parent.removeChild(this.timeTxt);
        }
      }
      this._tipData.addEventListener(
        Laya.Event.CHANGE,
        this.__changeHandler,
        this
      );
    }
  }

  private __changeHandler() {
    this.showTimeStr();
  }

  private showTimeStr() {
    if (
      this._tipData &&
      this._tipData.bufferType == PlayerBufferType.BASE_PROPERTY_BUFFER
    )
      return;
    if (!this._tipData) return;
    if (!parent) return;
    var timeStr: string = "";
    if ((this._tipData as PlayerBufferInfo).leftTime >= 3600 * 24) {
      timeStr =
        parseInt(
          (
            (this._tipData as PlayerBufferInfo).leftTime /
            (3600 * 24)
          ).toString()
        ) +
        LangManager.Instance.GetTranslation("public.day") +
        parseInt(
          (
            ((this._tipData as PlayerBufferInfo).leftTime / 3600) %
            24
          ).toString()
        ) +
        LangManager.Instance.GetTranslation("public.time.hour") +
        parseInt(
          (
            ((this._tipData as PlayerBufferInfo).leftTime % 3600) /
            60
          ).toString()
        ) +
        LangManager.Instance.GetTranslation("public.minute");
    } else if ((this._tipData as PlayerBufferInfo).leftTime >= 3600) {
      timeStr =
        parseInt(
          ((this._tipData as PlayerBufferInfo).leftTime / 3600).toString()
        ) +
        LangManager.Instance.GetTranslation("public.time.hour") +
        parseInt(
          (
            ((this._tipData as PlayerBufferInfo).leftTime % 3600) /
            60
          ).toString()
        ) +
        LangManager.Instance.GetTranslation("public.minute");
    } else if (this._tipData.leftTime >= 60)
      timeStr =
        parseInt(
          ((this._tipData as PlayerBufferInfo).leftTime / 60).toString()
        ) + LangManager.Instance.GetTranslation("public.minute");
    else
      timeStr = DateFormatter.getCountDate(
        (this._tipData as PlayerBufferInfo).leftTime,
        2,
        2
      );
    this.timeTxt.text = timeStr;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private removeEvent() {
    this._tipData &&
      this._tipData.removeEventListener(
        Laya.Event.CHANGE,
        this.__changeHandler,
        this
      );
  }

  protected OnClickModal() {
    super.OnClickModal();
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    this._tipData = null;
    super.dispose(dispose);
  }
}
