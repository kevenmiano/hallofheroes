import IMediator from "../../interfaces/IMediator";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
/**
 * 
 * 世界boss伤害排行榜
 * 
 */
export default class WorldBossWoundMediator implements IMediator {
	public register(target: Object) {
		UIManager.Instance.ShowWind(EmWindow.WorldBossSceneWnd);
	}
	public unregister(target: Object) {
		UIManager.Instance.HideWind(EmWindow.WorldBossSceneWnd);
	}
}