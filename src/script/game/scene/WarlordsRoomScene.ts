import UIManager from "../../core/ui/UIManager";
import { SceneEvent } from "../constant/event/NotificationEvent";
import { EmWindow } from "../constant/UIDefine";
import { IBaseSceneView } from "../interfaces/IBaseSceneView";
import { NotificationManager } from "../manager/NotificationManager";
import WarlordsManager from "../manager/WarlordsManager";
import { BaseSceneView } from "../map/scene/BaseSceneView";
import SceneType from "../map/scene/SceneType";
import HomeWnd from "../module/home/HomeWnd";
import MainToolBar from "../module/home/MainToolBar";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";

export default class WarlordsRoomScene extends BaseSceneView implements IBaseSceneView {
    constructor() {
        super();
    }

    public enter(preScene: BaseSceneView, data: Object = null): Promise<void> {
        return new Promise(resolve => {
            WarlordsManager.Instance.reqEnterWarlordsRoom();
            resolve();
        });
    }

    public enterOver(): Promise<void> {
        return new Promise(async resolve => {
            this.releaseScene();
            if (!HomeWnd.Instance.isShowing) {
                await HomeWnd.Instance.instShow();
            }
            UIManager.Instance.HideWind(EmWindow.SpaceTaskInfoWnd);
            FrameCtrlManager.Instance.open(EmWindow.WarlordRoomWnd);
            super.enterOver();
            resolve();
        });
    }

    public leaving(): Promise<void> {
        return new Promise(async resolve => {
            NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
            clearInterval(WarlordsManager.Instance.model.reqAgainTimer);
            FrameCtrlManager.Instance.exit(EmWindow.WarlordRoomWnd);
            await HomeWnd.Instance.instHide();
            resolve();
        });
    }

    public get SceneName(): string {
        return SceneType.WARLORDS_ROOM;
    }

    public getUIID(): string {
        return SceneType.WARLORDS_ROOM;
    }

}