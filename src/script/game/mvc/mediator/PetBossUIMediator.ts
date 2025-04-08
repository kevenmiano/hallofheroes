// @ts-nocheck
import UIManager from "../../../core/ui/UIManager";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import IMediator from "../../interfaces/IMediator";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";

export default class PetBossUIMediator implements IMediator {
    private  isDie:boolean = false;
    register(target: any) {
        UIManager.Instance.ShowWind(EmWindow.PetGuardTipWnd);
        NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.__switchSceneHandler, this);
    }

    private __switchSceneHandler() {
        if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
            this.unregister(null);
        }
    }

    unregister(target: any) {
        if (this.isDie) return;
        UIManager.Instance.HideWind(EmWindow.PetGuardTipWnd);
    }
}