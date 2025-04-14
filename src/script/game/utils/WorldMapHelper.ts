import { ArmyManager } from "../manager/ArmyManager";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { MessageTipManager } from "../manager/MessageTipManager";
import LangManager from "../../core/lang/LangManager";

export class WorldMapHelper {
  public static MAP1_ID: number = 1;
  public static MAP2_ID: number = 2;
  public static MAP3_ID: number = 3;
  public static MAP4_ID: number = 4;
  public static MAP5_ID: number = 5;
  public static DEFAULT_ID: number = -1;

  constructor() {}

  public static tagNameToMapId(tag: string): number {
    let mapId: number;
    switch (tag) {
      case "map1":
        mapId = WorldMapHelper.MAP1_ID;
        break;
      case "map2":
        mapId = WorldMapHelper.MAP2_ID;
        break;
      case "map3":
        mapId = WorldMapHelper.MAP3_ID;
        break;
      case "map4":
        mapId = WorldMapHelper.MAP4_ID;
        break;
      case "map5":
        mapId = WorldMapHelper.MAP5_ID;
        break;
      default:
        mapId = -1;
    }
    return mapId;
  }

  public static chcekMapId(mapId: number): boolean {
    switch (mapId) {
      case WorldMapHelper.MAP1_ID:
        if (WorldMapHelper.thane.grades >= 11) {
          return true;
        }
        return WorldMapHelper.noOpen();
        break;
      case WorldMapHelper.MAP2_ID:
        if (WorldMapHelper.thane.grades >= 21) {
          return true;
        }
        return WorldMapHelper.noOpen();
        break;
      case WorldMapHelper.MAP3_ID:
        if (WorldMapHelper.thane.grades >= 31) {
          return true;
        }
        return WorldMapHelper.noOpen();
        break;
      case WorldMapHelper.MAP4_ID:
        if (WorldMapHelper.thane.grades >= 41) {
          return true;
        }
        return WorldMapHelper.noOpen();
        break;
      case WorldMapHelper.MAP5_ID:
        if (WorldMapHelper.thane.grades >= 51) {
          return true;
        }
        return WorldMapHelper.noOpen();
        break;
      case WorldMapHelper.DEFAULT_ID:
        return WorldMapHelper.noOpen();
        break;
    }
    return true;
  }

  private static noOpen(): boolean {
    let str: string = LangManager.Instance.GetTranslation(
      "worldmap.data.WorldMapHelper.command01",
    );
    MessageTipManager.Instance.show(str);
    return false;
  }

  private static get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
