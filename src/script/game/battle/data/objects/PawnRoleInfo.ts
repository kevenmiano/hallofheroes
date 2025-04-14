/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  士兵角色信息
 **/

import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_pawntemplateData } from "../../../config/t_s_pawntemplate";
import { InheritRoleType } from "../../../constant/BattleDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import { RoleEvent } from "../../../constant/event/NotificationEvent";
import { PawnRoleView } from "../../view/roles/PawnRoleView";
import { BaseRoleInfo } from "./BaseRoleInfo";

export class PawnRoleInfo extends BaseRoleInfo {
  public inheritType: InheritRoleType = InheritRoleType.Pawn;
  /**
   * 士兵模板信息
   */
  private _tempInfo: t_s_pawntemplateData;
  private _count: number = 0; //数量
  private _armyType: number = 0;

  public initView(roleview: PawnRoleView) {
    this._roleView = roleview;
  }

  public get count(): number {
    return this._count;
  }

  public set count(value: number) {
    this._count = value;
    this._count = value < 0 ? 0 : value;
    this.dispatchEvent(RoleEvent.COUNT, value);
  }

  public get tempInfo(): t_s_pawntemplateData {
    return this._tempInfo;
  }

  public set templateId(value: number) {
    this._templateId = value;
    this.initTempInfoAndEffeInfo();
  }

  public get roleName(): string {
    return this._tempInfo && this._tempInfo.PawnNameLang;
  }

  public get templateId(): number {
    return this._templateId;
  }

  public get armyType(): number {
    return this._armyType;
  }

  public set armyType(value: number) {
    this._armyType = value;
    if (this._templateId != 0) {
      this.initTempInfoAndEffeInfo();
    }
  }
  private initTempInfoAndEffeInfo() {
    this._tempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pawntemplate,
      this._templateId.toString(),
    ) as t_s_pawntemplateData;
    if (this._tempInfo == null) {
      Logger.warn("[PawnRoleInfo]initTempInfoAndEffeInfo ", this._templateId);
      return;
    }
    // if(Number(PawnViewType.swf)>0)
    //     this._tempInfo.Swf = PawnViewType.swf;
    this.effectId = this._tempInfo.Swf.toLocaleLowerCase();
  }
  public clone(): BaseRoleInfo {
    let role: PawnRoleInfo = new PawnRoleInfo();
    role.livingId = this.livingId;
    role.templateId = this.templateId;
    role.armyType = this.armyType;
    role.side = this.side;
    role.pos = this.pos;
    // role.baseBlood = this.baseBlood
    // role.count = this.count
    return role;
  }

  public get level(): number {
    return this._tempInfo.Level;
  }

  public get icon() {
    return IconFactory.getHeroIconByPics(this._tempInfo.Icon);
  }
}
