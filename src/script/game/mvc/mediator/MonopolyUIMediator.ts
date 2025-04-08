import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import IMediator from "../../interfaces/IMediator";


export default class MonopolyUIMediator implements IMediator {
    private  isDie:boolean = false;
    register(target: any) {
        UIManager.Instance.ShowWind(EmWindow.MonopolyDiceWnd);
        // NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.__switchSceneHandler, this);
    }

    // private __switchSceneHandler() {
    //     if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
    //         this.unregister(null);
    //     }
    // }

    unregister(target: any) {
        if (this.isDie) return;
        UIManager.Instance.HideWind(EmWindow.MonopolyDiceWnd);
    }
}