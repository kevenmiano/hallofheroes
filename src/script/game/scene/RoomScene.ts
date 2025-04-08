/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-20 15:08:22
 * @LastEditTime: 2023-12-07 14:55:12
 * @LastEditors: jeremy.xu
 * @Description: PVE、PVP场景
 */

import UIManager from "../../core/ui/UIManager";
import { SceneEvent } from "../constant/event/NotificationEvent";
import { RoomSceneType } from "../constant/RoomDefine";
import { EmWindow } from "../constant/UIDefine";
import { IBaseSceneView } from "../interfaces/IBaseSceneView";
import { ArmyManager } from "../manager/ArmyManager";
import { CampaignSocketOutManager } from "../manager/CampaignSocketOutManager";
import { NotificationManager } from "../manager/NotificationManager";
import { RoomManager } from "../manager/RoomManager";
import { BaseSceneView } from "../map/scene/BaseSceneView";
import SceneType from "../map/scene/SceneType";
import HomeWnd from "../module/home/HomeWnd";
import MainToolBar from "../module/home/MainToolBar";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";

export default class RoomScene extends BaseSceneView implements IBaseSceneView {
    public roomSceneType = RoomSceneType.PVE
    private _view: any; //RoomHallWnd
    data: any;
    public get view(): any {
        return this._view;
    }

    constructor(roomSceneType: RoomSceneType = RoomSceneType.PVE) {
        super();
        this.roomSceneType = roomSceneType
    }

    public preLoadingStart(data: Object = null): Promise<void> {
        return new Promise(resolve => {
            NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE,true);
            // SceneManager.Instance.lockScene = true;
            this.preLoadingOver()
            resolve();
        });
    }

    public enter(preScene: BaseSceneView, data: Object = null): Promise<void> {
        this.data = data;
        return new Promise(resolve => {
            if (RoomManager.Instance.exit) {
                Laya.timer.once(1200, this, this.gotoSpaceScene)
                return;
            }
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
            let roomData: any = {
                roomSceneType: this.roomSceneType
            }
            if(RoomManager.Instance.roomInfo) {
                FrameCtrlManager.Instance.open(EmWindow.RoomHall, roomData)
            }
            RoomManager.Instance.controller = this;
            // ChatTopBugleView.instance.setPos();
            // TipsBar.instance.show();
            // ChatBar.instance.show();
            // ResourcesBar.instance.show();
            super.enterOver();
            resolve();
        });
    }

    public leaving(): Promise<void> {
        return new Promise(async resolve => {
            NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE,false);
            // SceneManager.Instance.lockScene = false;
            if (RoomManager.Instance.exit) RoomManager.Instance.dispose();
            await HomeWnd.Instance.instHide();
            resolve();
        });
    }

    public resize() {
        super.resize()
        if (!this._view) return;
        this._view.resize();
    }

    private gotoSpaceScene() {
        Laya.timer.clear(this, this.gotoSpaceScene)
        SwitchPageHelp.returnToSpace({ isOpenPveRoomList: true });
    }

    public quitRoom() {
        CampaignSocketOutManager.Instance.sendReturnCampaignRoom(this.selfArmyId);
    }

    private get selfArmyId(): number {
        return ArmyManager.Instance.army.id;
    }

    public get SceneName(): string {
        if (this.roomSceneType == RoomSceneType.PVE) {
            return SceneType.PVE_ROOM_SCENE;
        } else if (this.roomSceneType == RoomSceneType.PVP) {
            return SceneType.PVP_ROOM_SCENE;
        }
    }

    public getUIID(): string {
        if (this.roomSceneType == RoomSceneType.PVE) {
            return SceneType.PVE_ROOM_SCENE;
        } else if (this.roomSceneType == RoomSceneType.PVP) {
            return SceneType.PVP_ROOM_SCENE;
        }
    }
}