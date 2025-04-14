import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import StringHelper from "../../core/utils/StringHelper";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { ConfigType } from "../constant/ConfigDefine";
import { TipsEvent } from "../constant/event/NotificationEvent";
import { MountsManager } from "../manager/MountsManager";
import { NotificationManager } from "../manager/NotificationManager";
import { MountType } from "../module/mount/model/MountType";
import { WildSoulInfo } from "../module/mount/model/WildSoulInfo";
import BaseTips from "./BaseTips";

export class MountTips extends BaseTips {
  public tipData: any;
  public txt_totalPower: fgui.GLabel;
  private _info: any;
  private willScoreTxt: fgui.GLabel;
  private mountNameTxt: fgui.GLabel;
  private descTxt: fgui.GLabel;
  private attributeTxt: fgui.GLabel;
  private specialTxt: fgui.GLabel; //特性能力
  public gruop1: fgui.GGroup;
  public totalBox: fgui.GGroup;
  private date1: fgui.GLabel;
  private date2: fgui.GLabel;

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.addEvent();
    this.updateTransform();
    this.contentPane.ensureBoundsCorrect();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private initData() {
    this._info = this.params[0];
  }

  private updateTransform() {
    this.clean();
    if (!this._info) {
      return;
    }
    var item: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(
      this._info.TemplateId,
    );
    var strArray: Array<string> = LangManager.Instance.GetTranslation(
      "mounts.WildsoulItem.tips01",
    ).split("|");
    var tipStr: string = "";
    var speed: number = 0;
    if (this._info.MountType == MountType.MAGIC) speed = this._info.Speed;
    var valueArray: Array<number> = [
      this._info.Power,
      this._info.Intellect,
      this._info.Physique,
      this._info.Agility,
      this._info.ExpandLevel,
      speed,
    ];
    if (strArray.length >= valueArray.length) {
      for (var i: number = 0; i < valueArray.length; i++) {
        if (valueArray[i] != 0) {
          tipStr += StringHelper.format(strArray[i], valueArray[i]) + "<br/>";
        }
      }
    }
    this.willScoreTxt.text = LangManager.Instance.GetTranslation(
      "mountTip.soulscore",
      this._info.SoulScore,
    );
    if (this._info.MountType == MountType.NORMAL) {
      if (item) {
        this.mountNameTxt.text = this._info.TemplateNameLang;
        this.descTxt.text = this._info.DescriptionLang;
        if (this.isFlying(this._info.TemplateId)) {
          this.date1.visible = true;
          this.date1.text = LangManager.Instance.GetTranslation(
            "mounts.WildsoulItem.tips06",
          );
        }
      } else {
        this.date1.text = LangManager.Instance.GetTranslation(
          "mounts.WildsoulItem.tips03",
          this._info.Property2,
        );
        this.date1.visible = true;
      }
    } else {
      this.mountNameTxt.text = this._info.TemplateNameLang;
      this.attributeTxt.visible = true;
      this.attributeTxt.text = tipStr;
      this.descTxt.text = this._info.DescriptionLang;
      var needTips: Array<string> = [];
      if (this._info.NeedMountGrade > 0)
        needTips.push(
          LangManager.Instance.GetTranslation(
            "mounts.WildsoulItem.tips.NeedGrade",
            this._info.NeedMountGrade,
          ),
        );
      if (this._info.NeedItemId != 0) {
        var goodTemplate: t_s_itemtemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_itemtemplate,
            this._info.NeedItemId.toString(),
          );
        if (goodTemplate) {
          needTips.push(goodTemplate.TemplateNameLang);
        }
      }
      if (this._info.MountType == MountType.BEAST) {
        this.date1.visible = true;
        // if (ArmyManager.Instance.thane.IsVipAndNoExpirt) {
        //     this.date1.text = LangManager.Instance.GetTranslation("mounts.WildsoulItem.VIPMountsTips");
        // } else {
        // this.date1.text = LangManager.Instance.GetTranslation("mounts.WildsoulItem.VIPMountsNeedTips");
        // }
      } else {
        if (item == null && needTips.length > 0) {
          var needTipStr: string = needTips.join(
            "\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
          );
          this.date1.text = LangManager.Instance.GetTranslation(
            "mounts.MountTip.NeedGood",
            needTipStr,
          );
          this.date1.visible = true;
        }
        if (this._info && this._info.validity != 0) {
          this.specialTxt.visible = true;
          if (this._info.validity < 0) {
            this.specialTxt.text = LangManager.Instance.GetTranslation(
              "mounts.WildsoulItem.forever",
            );
          } else {
            this.specialTxt.text = LangManager.Instance.GetTranslation(
              "mounts.WildsoulItem.tips02",
              this._info.validity,
            );
          }
        }
      }
      if (this.isFlying(this._info.TemplateId)) {
        this.specialTxt.visible = true;
        if (!StringHelper.isNullOrEmpty(this.specialTxt.text)) {
          this.specialTxt.text += LangManager.Instance.GetTranslation(
            "mounts.WildsoulItem.tips06",
          );
        } else {
          this.specialTxt.text = LangManager.Instance.GetTranslation(
            "mounts.WildsoulItem.tips06",
          );
        }
      }
    }
    this.gruop1.ensureBoundsCorrect();
    this.totalBox.ensureBoundsCorrect();
  }

  private clean() {
    this.attributeTxt.visible = false;
    this.date1.visible = false;
    this.date2.visible = false;
    this.specialTxt.visible = false;
    this.attributeTxt.text = "";
    this.date1.text = "";
    this.date2.text = "";
    this.specialTxt.text = "";
  }

  private isFlying(mountTemplateId: number): boolean {
    if (mountTemplateId == 7001) return true;
    else return false;
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
  }

  protected OnClickModal() {
    super.OnClickModal();
    this.hide();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
