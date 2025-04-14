/**
 * 战场排名信息
 */
export default class WarFightOrderInfo {
  public order: number = 0;
  public nickName: string = "";
  public userId: number = 0;
  public score: number = 0;
  public hitCount: number = 0;
  public teamId: number = 0;
  public geste: number = 0;
  public isMvp: boolean = false;
  public serverName: string = "";
  /** 荣誉 */
  public honner: number = 0;
  /** 勋章 */
  public medal: number = 0;
}
