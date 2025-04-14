import GameEventDispatcher from "../../core/event/GameEventDispatcher";

export class RecommendInfo extends GameEventDispatcher {
  public id: number = 0;
  public name: string;
  public level: number = 0;
  public sex: number = 0; //Sexs(性别, 1为男, 0为女)
  public attack: number = 0;
  public mapname: string;
  private _headId: number = 0;
  public frameId: number = 0;
  /**
   * 1:男战
   * 2:男弓
   * 3:男法
   * 4:女战
   * 5:女弓
   * 6:女法
   */
  public job: number = 0;

  get headId(): number {
    if (this._headId == 0) {
      //说明没修改过头像, 使用默认头像
      this._headId = this.job;
    }
    return this._headId;
  }

  set headId(value: number) {
    this._headId = value;
  }
}
