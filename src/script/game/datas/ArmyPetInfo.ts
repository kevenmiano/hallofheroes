/**
 * 军队的英灵信息
 *
 */
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { ArmyEvent } from "../constant/event/NotificationEvent";
import { t_s_pettemplateData } from "../config/t_s_pettemplate";

export class ArmyPetInfo extends GameEventDispatcher {
  private _petTemplateId: number = 0;
  public petTemplate: t_s_pettemplateData;
  private _petName: string = "";
  private _petQuaity: number = 1;
  private _petTemQuality: number = 1;

  private changed: boolean = false;

  public posX: number = 0;
  public posY: number = 0;

  constructor() {
    super();
  }

  public get petTemplateId(): number {
    return this._petTemplateId;
  }

  public set petTemplateId(value: number) {
    if (this._petTemplateId == value) {
      return;
    }
    this._petTemplateId = value;
    this.petTemplate = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      value.toString(),
    );
    this._petName = this.petTemplate ? this.petTemplate.TemplateNameLang : "";
    this.changed = true;
  }

  public get petName(): string {
    if (this._petName == "" && this._petTemplateId != 0) {
      this._petName = this.petTemplate.TemplateNameLang;
    }
    return this._petName;
  }

  public set petName(value: string) {
    if (this._petName == value || value == "") {
      return;
    }
    this._petName = value;
    this.changed = true;
  }

  public get petQuaity(): number {
    return this._petQuaity;
  }

  public set petQuaity(value: number) {
    if (this._petQuaity == value) {
      return;
    }
    this._petQuaity = value;
    this.changed = true;
  }

  public commit() {
    if (this.changed) {
      this.dispatchEvent(ArmyEvent.PETINFO_CHANGED, this);
      this.changed = false;
    }
  }

  public get petTemQuality(): number {
    return this._petTemQuality;
  }

  public set petTemQuality(value: number) {
    if (this._petTemQuality == value) {
      return;
    }
    this._petTemQuality = value;
    this.changed = true;
  }
}
