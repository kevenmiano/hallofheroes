import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { TempleteManager } from "../../manager/TempleteManager";
import MagicCardEnums from "./enum/MagicCardEnums";
import MagicCardBuffInfo from "./MagicCardBuffInfo";
import { t_s_powcardsuitetemplateData } from "../../config/t_s_powcardsuitetemplate";
import { t_s_powcardtemplateData } from "../../config/t_s_powcardtemplate";

export default class MagicCardInfo {
  /**
   * 模板ID
   */
  private _templateId: number;
  /**
   * 等级
   */
  public grade: number;
  /**
   * 当前等级经验
   */
  private _currentGP: number;

  public buff: MagicCardBuffInfo;
  /**
   * 是否是激活
   */
  public isActive: number;

  /**
   * 卡牌模板信息
   */
  public magicCardTemplate: t_s_powcardtemplateData;

  public pos: number = 0;

  public get templateId(): number {
    return this._templateId;
  }

  public set templateId(value: number) {
    if (this._templateId != value) {
      this._templateId = value;
      this.magicCardTemplate =
        TempleteManager.Instance.getPowerCardTemplateByID(this._templateId);
    }
  }

  private _currentMaxGp: number;
  private _gradeMax: number;

  /**
   * 当前经验
   */
  public get currentGP(): number {
    return this._currentGP;
  }

  /**
   * @private
   */
  public set currentGP(value: number) {
    this._currentGP = value;

    let arr: Array<t_s_upgradetemplateData> =
      TempleteManager.Instance.getTemplatesByType(this.lvupType); //卡牌升级模板
    arr.sort((a: t_s_upgradetemplateData, b: t_s_upgradetemplateData) => {
      if (a.Grades > b.Grades) {
        return 1;
      } else if (a.Grades < b.Grades) {
        return -1;
      } else {
        return 0;
      }
    });
    this._gradeMax = arr[arr.length - 1].Grades;
    if (this.grade < this._gradeMax) {
      this._currentMaxGp = arr[this.grade].Data;
    } else {
      this._currentMaxGp = arr[arr.length - 1].Data;
    }
    this._currentGP = Math.min(this._currentGP, this._currentMaxGp);
  }

  public get currentMaxGp(): number {
    return this._currentMaxGp;
  }

  public set currentMaxGp(value: number) {
    this._currentMaxGp = value;
  }

  private get lvupType(): number {
    let type: number;
    if (this.magicCardTemplate && this.magicCardTemplate.Profile) {
      switch (this.magicCardTemplate.Profile) {
        case MagicCardEnums.PROFILE_GRAY:
          type = MagicCardEnums.LVUP_GRAY;
          break;
        case MagicCardEnums.PROFILE_GREEN:
          type = MagicCardEnums.LVUP_GREEN;
          break;
        case MagicCardEnums.PROFILE_BLUE:
          type = MagicCardEnums.LVUP_BLUE;
          break;
        case MagicCardEnums.PROFILE_PURPLE:
          type = MagicCardEnums.LVUP_PURPLE;
          break;
        case MagicCardEnums.PROFILE_ORANGE:
          type = MagicCardEnums.LVUP_ORANGE;
          break;
        default:
          type = MagicCardEnums.LVUP_GRAY;
          break;
      }
    } else {
      type = MagicCardEnums.LVUP_GRAY;
    }
    return type;
  }

  /**
   * 是否已达到最大等级
   */
  public get isLimit(): boolean {
    return this.grade == this._gradeMax;
  }

  public contrast(info: MagicCardInfo): boolean {
    if (this.grade == info.grade && this.currentGP == info.currentGP) {
      return true;
    }
    return false;
  }

  public get isPlay(): boolean {
    if (this.isActive == 1) {
      return true;
    }
    return false;
  }
}
