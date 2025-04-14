import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
export class TaskInfo extends GameEventDispatcher {
  public userId: number = 0;
  public taskId: number = 0;
  public isComplete: boolean = false;
  public completeDate: Date;
  public acceptDate: Date;

  /**
   * 四个条件的进度（每个任务最多四个条件 ）
   */
  public condition1: number = 0;
  public condition2: number = 0;
  public condition3: number = 0;
  public condition4: number = 0;

  public isSelect: boolean = false; //当前未接受
  public repeatFinish: number = 0; // 重复任务的当前重复次数
  public isExist: boolean = false;

  private _isRequired: boolean = false;

  private _isNew: boolean = false;
  private _isAchieved: boolean = false;

  private _sendTime: number = 0; //记录手机任务的发送倒计时
  private _checkTime: number = 0; //记录手机任务的验证倒计时
  private _phoneStr: string = "";
  public checkNumber: number = 0;
  private initTimer1() {
    Laya.timer.loop(1000, this, this.__updateHandler1);
  }
  private initTimer2() {
    Laya.timer.loop(1000, this, this.__updateHandler2);
  }

  private __updateHandler1() {
    --this._sendTime;
    this.dispatchEvent(Laya.Event.CHANGE);
    if (this._sendTime <= 0) {
      this.dispatchEvent(Laya.Event.COMPLETE);
      Laya.timer.clear(this, this.__updateHandler1);
    }
  }

  private __updateHandler2() {
    --this._checkTime;
    this.dispatchEvent(Laya.Event.CHANGE);
    if (this._checkTime <= 0) {
      this.dispatchEvent(Laya.Event.COMPLETE);
      Laya.timer.clear(this, this.__updateHandler2);
    }
  }

  public get sendTime(): number {
    return this._sendTime;
  }

  public set sendTime(time1: number) {
    this._sendTime = time1;
    if (this._sendTime > 0) {
      this.dispatchEvent(Laya.Event.CHANGE);
      this.initTimer1();
      this.__updateHandler1();
    }
  }

  public get checkTime(): number {
    return this._checkTime;
  }

  public set checkTime(time2: number) {
    this._checkTime = time2;
    if (this._checkTime > 0) {
      this.dispatchEvent(Laya.Event.CHANGE);
      this.initTimer2();
      this.__updateHandler2();
    }
  }

  public get phoneStr(): string {
    return this._phoneStr;
  }

  public set phoneStr(str: string) {
    this._phoneStr = str;
  }

  public get isRequired(): boolean {
    return this._isRequired;
  }

  public set isRequired(value: boolean) {
    this._isRequired = value;
  }

  public get isNew(): boolean {
    return this._isNew;
  }

  public set isNew(value: boolean) {
    this._isNew = value;
  }

  public get isAchieved(): boolean {
    if (this.completeDate) {
      return false;
    }
    return true;
  }

  public set isAchieved(isAchieved: boolean) {
    this._isAchieved = isAchieved;
  }
}
