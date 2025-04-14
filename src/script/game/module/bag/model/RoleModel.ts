import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { ArmyManager } from "../../../manager/ArmyManager";
import FrameDataBase from "../../../mvc/FrameDataBase";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/2/23 18:04
 * @ver 1.0
 *
 */
export class RoleModel extends FrameDataBase {
  public static TYPE_RENAME_CARD: number = 1; //改名卡改名
  public static TYPE_COMPOSE: number = 2; //合区改名

  public oldEquip: SimpleDictionary;
  public get uArmy() {
    return ArmyManager.Instance.army;
  }
  constructor() {
    super();
  }
}
