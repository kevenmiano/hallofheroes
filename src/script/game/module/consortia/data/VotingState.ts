/**
 * 选举状态
 * @author yuanzhan.yu
 */
export class VotingState {
  /**
   *正常（小于7天）
   */
  public static NONE: number = 0;

  /**
   * 投票预备（>7天发送邮件）
   */
  public static VOTINGMAIL: number = 1;

  /**
   * 投票开始（>10选取竞选人）
   */
  public static VOTINGBEGIN: number = 2;

  /**
   *涮选投票人
   */
  public static VOTINGMAN: number = 3;

  /**
   *投票中（成员投票）
   */
  public static VOTINGING: number = 4;

  /**
   *投票结束 （>13天, 投票结束）
   */
  public static VOTINGEND: number = 5;
}
