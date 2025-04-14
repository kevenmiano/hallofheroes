//@ts-expect-error: External dependencies
import FUI_BloodSingle from "../../../../../fui/Battle/FUI_BloodSingle";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { PawnRoleInfo } from "../../../battle/data/objects/PawnRoleInfo";
import { RoleEvent } from "../../../constant/event/NotificationEvent";

export default class BloodSingle extends FUI_BloodSingle {
  private _curHp = 0;
  private _maxHp = 0;

  private _roleInfo: HeroRoleInfo | PawnRoleInfo;

  public get curHp() {
    return this._curHp;
  }

  public set curHp(v: number) {
    this._curHp = v;
    this.updateView();
  }

  public get maxHp() {
    return this._maxHp;
  }

  public set maxHp(v: number) {
    this._maxHp = v;
  }

  public updateView() {
    let progress = this.persent;
    let hpBar = this.redBlood.selectedIndex ? this.redHp : this.greenHp;
    hpBar.fillAmount = progress;
  }

  public get persent() {
    let p = this._curHp / this._maxHp;
    if (p > 1) p = 1;
    if (p < 0) p = 0;
    return p;
  }

  public setRole(role: HeroRoleInfo | PawnRoleInfo) {
    if (this._roleInfo) {
      this.removeEvent();
    }
    this._roleInfo = role;
    this.haveBlood.selectedIndex = 1;
    this.addEvent();
    //有可能不是满血状态，需要更新一下。
    this.updateBlood();
  }

  private addEvent() {
    this._roleInfo.addEventListener(
      RoleEvent.BLOOD_CHANGE,
      this.updateBlood,
      this,
    );
    this._roleInfo.addEventListener(
      RoleEvent.BLOOD_CHANGE_S,
      this.updateBlood,
      this,
    );
  }

  private updateBlood() {
    this.maxHp = this._roleInfo.totalBloodA;
    this.curHp = this._roleInfo.bloodA;
  }

  private removeEvent() {
    this._roleInfo &&
      this._roleInfo.removeEventListener(
        RoleEvent.BLOOD_CHANGE,
        this.updateBlood,
        this,
      );
    this._roleInfo &&
      this._roleInfo.removeEventListener(
        RoleEvent.BLOOD_CHANGE_S,
        this.updateBlood,
        this,
      );
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
    this._roleInfo = null;
  }
}
