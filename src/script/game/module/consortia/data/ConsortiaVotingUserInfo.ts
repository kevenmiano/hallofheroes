/**
 * 公会选举用户数据
 * @author yuanzhan.yu
 */
export class ConsortiaVotingUserInfo {
  private _userId: number = 0;
  private _nickName: string;
  private _votingId: number = 0;
  private _isVotingman: boolean;
  private _votingTime: number = 0;
  private _votingData: number = 0;

  constructor() {}

  /**
   * 用户id
   */
  public get userId(): number {
    return this._userId;
  }

  /**
   * @private
   */
  public set userId(value: number) {
    this._userId = value;
  }

  /**
   * 用户呢称
   */
  public get nickName(): string {
    return this._nickName;
  }

  /**
   * @private
   */
  public set nickName(value: string) {
    this._nickName = value;
  }

  /**
   * 当前序号
   */
  public get votingId(): number {
    return this._votingId;
  }

  /**
   * @private
   */
  public set votingId(value: number) {
    this._votingId = value;
  }

  /**
   * 是否为候选人
   */
  public get isVotingman(): boolean {
    return this._isVotingman;
  }

  /**
   * @private
   */
  public set isVotingman(value: boolean) {
    this._isVotingman = value;
  }

  /**
   * 参与投票序号
   */
  public get votingTime(): number {
    return this._votingTime;
  }

  /**
   * @private
   */
  public set votingTime(value: number) {
    this._votingTime = value;
  }

  /**
   * 获得投票数
   */
  public get votingData(): number {
    return this._votingData;
  }

  /**
   * @private
   */
  public set votingData(value: number) {
    this._votingData = value;
  }
}
