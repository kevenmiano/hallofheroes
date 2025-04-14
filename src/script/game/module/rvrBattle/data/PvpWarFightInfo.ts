import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { PvpWarFightEvent } from "../../../constant/event/NotificationEvent";
/**
 * 战场信息
 */
export default class PvpWarFightInfo extends GameEventDispatcher {
  public static BLUE_TEAM: number = 1;
  public static RED_TEAM: number = 2;
  public teamId: number = 0; // 当前阵营
  public score: number = 0; // 当前积分
  public order: number = 0; // 当前排名
  public hitCount: number = 0; // 击杀数量
  public leftTime: number = 0; // 剩余时间
  public oneCount: number = 0; // 阵营1人数
  public twoCount: number = 0; // 阵营2人数
  public oneScore: number = 0; // 阵营1积分
  public twoScore: number = 0; // 阵营2积分
  public geste: number = 0; //获得荣誉

  public commit() {
    this.dispatchEvent(PvpWarFightEvent.PVP_WAR_FIGHT_INFO_CHAGE, null);
  }
}
