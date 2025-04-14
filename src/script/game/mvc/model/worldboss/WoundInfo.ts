import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";

/**
 * 世界boss伤害信息
 */
export class WoundInfo extends GameEventDispatcher {
  public index: number = 0;
  public nickName: string;
  public wound: number = 0;
  public userId: number = 0;
  public job: number = 0;
  public isJoining: boolean; //是否参与中

  private _totalHp: number = 0;

  constructor($i: number = 0) {
    super();
    this.index = $i;
  }

  public get totalHp(): number {
    return this._totalHp;
  }

  /**
   *伤害百分比
   */
  public get woundAddation(): number {
    var i: number = (this.wound * 100) / this._totalHp;
    if (i < 0) i = 0;
    if (i > 100) i = 100;
    return i;
  }

  public set totalHp(value: number) {
    this._totalHp = value;
  }
  public reset() {
    this.nickName = "";
    this.wound = this._totalHp = 0;
    this.userId = 0;
  }
}
