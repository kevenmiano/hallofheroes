//@ts-expect-error: External dependencies
import WaitReviveMsg = com.road.yishi.proto.battle.WaitReviveMsg;
export default class ReliveInfo {
  public battleId: string;
  public livingId: number = 0;
  /**
   * 复活后的血量
   */
  public hp: number = 0;
  /**
   * 复活后的怒气
   */
  public sp: number = 0;
  /**
   * 复活后的打击点
   */
  public hitPoint: number = 0;

  static createFromMsg(msg: WaitReviveMsg): ReliveInfo {
    let info: ReliveInfo = new ReliveInfo();
    info.battleId = msg.battleId;
    info.livingId = msg.livingId;
    info.hp = msg.hp;
    info.sp = msg.sp;
    return info;
  }
}
