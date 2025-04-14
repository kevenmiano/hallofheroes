//@ts-expect-error: External dependencies
import { StateType } from "../../../constant/StateType";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";

export default class OutyardUserInfo {
  public userUid: string;
  public userId: number = 0;
  public nickName: string;
  public defenceAlive: boolean;
  public defenceDebuffLevel: number = 0;
  public fightingCapacity: number = 0;
  public grades: number = 0;
  public transGrade: number = 0;
  public changeBranch: number = 0;
  public job: number = 0;
  private _thane: ThaneInfo;
  public index: number = 0;
  public alive: boolean = false;
  public inBattle: boolean = false;
  public isOnline: boolean = true;
  public vocationGrades: number = 0;
  public crossGuildTeamId: number = 0;

  constructor() {
    this._thane = new ThaneInfo();
  }

  public get thane(): ThaneInfo {
    this._thane.userId = this.userId;
    this._thane.nickName = this.nickName;
    this._thane.job = this.job;
    this._thane.fightingCapacity = this.fightingCapacity;
    this._thane.consortiaID = 1;
    this._thane.grades = this.grades;
    this._thane.state = StateType.ONLINE;
    return this._thane;
  }

  public copy(info: OutyardUserInfo): OutyardUserInfo {
    info.userUid = this.userUid;
    info.userId = this.userId;
    info.nickName = this.nickName;
    info.defenceAlive = this.defenceAlive;
    info.defenceDebuffLevel = this.defenceDebuffLevel;
    info.fightingCapacity = this.fightingCapacity;
    info.grades = this.grades;
    info.transGrade = this.transGrade;
    info.changeBranch = this.changeBranch;
    info.job = this.job;
    info.isOnline = this.isOnline;
    return info;
  }
}
