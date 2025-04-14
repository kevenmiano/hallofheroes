import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { MountsEvent } from "../../../constant/event/NotificationEvent";
import { TempleteManager } from "../../../manager/TempleteManager";
import { MountInfo } from "./MountInfo";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { ArrayUtils, ArrayConstant } from "../../../../core/utils/ArrayUtils";
/**
 * 坐骑属性数据
 *
 */
export class PropertyInfo extends GameEventDispatcher {
  /** 力量 */
  public static STRENGTH: string = "Strength";
  /** 智力 */
  public static INTELLECT: string = "Intellect";
  /** 体质 */
  public static STAMINA: string = "Stamina";
  /** 护甲 */
  public static ARMOR: string = "Armor";

  public static getPropertyValue(name: string): number {
    switch (name) {
      case PropertyInfo.STRENGTH:
        return 0;
      case PropertyInfo.ARMOR:
        return 1;
      case PropertyInfo.INTELLECT:
        return 2;
      case PropertyInfo.STAMINA:
        return 5;
    }
    return -1;
  }

  private _name: string = "";
  private _addition: number = 0;
  private _propGp: number = -1;
  private _currentPropGp: number = 0;
  private _currentPropMaxGp: number = 0;
  private _gradeMax: number = 0;
  private _upgradeTemplate: t_s_upgradetemplateData;
  public mountInfo: MountInfo;

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get addition(): number {
    return this._addition;
  }

  public set addition(value: number) {
    this._addition = value;
  }

  public get propGp(): number {
    return this._propGp;
  }
  /** 属性经验 从1级开始累积的值 */
  public set propGp(value: number) {
    if (this._propGp > 0 && this._propGp < value) {
      this.mountInfo.dispatchEvent(MountsEvent.PROP_LEVEL_UP, this);
    }
    this._propGp = value;

    var arr: any[] = TempleteManager.Instance.getTemplatesByType(18); //所有属性升级模板
    arr = ArrayUtils.sortOn(arr, ["Data"], [ArrayConstant.NUMERIC]);

    for (var i: number = 0, len: number = arr.length; i < len; i++) {
      if (
        this._propGp >= arr[i].Data &&
        (i + 1 == len || this._propGp < arr[i + 1].Data)
      ) {
        this._upgradeTemplate = arr[i];
        this._currentPropGp = this._propGp - this._upgradeTemplate.Data;
        if (len == 1) {
          this._currentPropMaxGp = arr[0].Data;
        } else if (i + 1 == len) {
          this._currentPropMaxGp = arr[i].Data - arr[i - 1].Data;
          this._currentPropGp = this._currentPropMaxGp;
        } else {
          this._currentPropMaxGp = arr[i + 1].Data - arr[i].Data;

          this._currentPropGp = Math.min(
            this._currentPropGp,
            this._currentPropMaxGp,
          );
        }
        break;
      }
    }
  }
  /** 当前升级需要的经验 */
  public get currentPropMaxGp(): number {
    return this._currentPropMaxGp;
  }

  public get currentPropGp(): number {
    return this._currentPropGp;
  }

  /** 属性等级 不能超过最大等级 */
  public get grade(): number {
    var g: number =
      this._upgradeTemplate == null ? 1 : this._upgradeTemplate.Grades;
    return Math.min(g, this.gradeMax);
  }
  /** 当前升级模板 */
  public get upgradeTemplate(): t_s_upgradetemplateData {
    return this._upgradeTemplate;
  }
  /** 最大等级 属性等级不能超过这个值 */
  public get gradeMax(): number {
    return this.mountInfo.propertyGradeMax;
  }
  /** 是否已达到最大等级 */
  public get isLimit(): boolean {
    return this.grade == this.gradeMax;
  }
}
