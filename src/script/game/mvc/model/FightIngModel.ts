import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
/**
 * @author:pzlricky
 * @data: 2021-06-08 10:00
 * @description ***
 */
export default class FightIngModel extends GameEventDispatcher {
  /** 战斗力-主页 */
  public static FIGHT_MAIN_FRAME: number = 1;
  /** 战斗力-装备 */
  public static FIGHT_EQUIP_GEM_FRAME: number = 2;
  /** 战斗力-宠物 */
  public static FIGHT_PET_FRAME: number = 3;
  /** 战斗力-宝石 */
  public static FIGHT_GEM_FRAME: number = 4;

  public type: number = 0;
  public level: number = 0;
  public score: number = 0;
  public desc: string = "";

  constructor() {
    super();
  }
}
