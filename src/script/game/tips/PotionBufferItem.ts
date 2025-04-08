import FUI_PotionBufferItem from "../../../fui/Base/FUI_PotionBufferItem";
import LangManager from "../../core/lang/LangManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { EmPackName } from "../constant/UIDefine";
import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import FUIHelper from "../utils/FUIHelper";
export default class PotionBufferItem extends FUI_PotionBufferItem {
  public picIcon: fgui.GLoader;
  public nameTxt: fgui.GTextField;
  public valueTxt: fgui.GTextField;
  public timeTxt: fgui.GTextField;
  private _tipData: PlayerBufferInfo;
  public static URL: string = "ui://og5jeos3bgubien";

  protected onConstruct() {
    super.onConstruct();
  }

  public set info(value: PlayerBufferInfo) {
    this._tipData = value;
    if (value) {
      if (value.template.PropertyType1 == 135) {
        //力量
        this.picIcon.url = FUIHelper.getItemURL(
          EmPackName.Base,
          "Icon_Buff_Strength"
        );
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip01"
        );
      } else if (value.template.PropertyType1 == 137) {
        //护甲
        this.picIcon.url = FUIHelper.getItemURL(
          EmPackName.Base,
          "Icon_Buff_Defense"
        );
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip02"
        );
      } else if (value.template.PropertyType1 == 138) {
        //智力
        this.picIcon.url = FUIHelper.getItemURL(
          EmPackName.Base,
          "Icon_Buff_Intelligence"
        );
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip03"
        );
      } else if (value.template.PropertyType1 == 139) {
        //统帅
        this.picIcon.url = FUIHelper.getItemURL(
          EmPackName.Base,
          "Icon_Buff_Charisma"
        );
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip05"
        );
      } else if (value.template.PropertyType1 == 140) {
        //体质
        this.picIcon.url = FUIHelper.getItemURL(
          EmPackName.Base,
          "Icon_Buff_Endurance"
        );
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "armyII.ThaneAttributeView.Tip04"
        );
      } else if (value.template.PropertyType1 == 202) {
        //全属性
        this.picIcon.url = FUIHelper.getItemURL(
          EmPackName.Base,
          "Icon_Buff_All"
        );
        this.nameTxt.text = "全属性";
      }
      this.valueTxt.text = "+" + value.grade.toString();

      if (this._tipData.leftTime > 0) {
        this.showTimeStr();
        this._tipData.addEventListener(
          Laya.Event.CHANGE,
          this.__changeHandler,
          this
        );
      } else {
        this.timeTxt.parent.removeChild(this.timeTxt);
      }
    }
  }

  private __changeHandler() {
    this.showTimeStr();
  }

  private showTimeStr() {
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
    this.timeTxt.text = "(" + timeStr + ")";
  }

  private removeEvent() {
    this._tipData &&
      this._tipData.removeEventListener(
        Laya.Event.CHANGE,
        this.__changeHandler,
        this
      );
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
