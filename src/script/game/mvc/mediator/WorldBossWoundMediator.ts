import { IMediator } from "@/script/game/interfaces/Mediator";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
/**
 *
 * 世界boss伤害排行榜
 *
 */
export default class WorldBossWoundMediator implements IMediator {
  public register(target: object) {
    UIManager.Instance.ShowWind(EmWindow.WorldBossSceneWnd);
  }
  public unregister(target: object) {
    UIManager.Instance.HideWind(EmWindow.WorldBossSceneWnd);
  }
}
