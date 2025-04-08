import { MapBaseAction } from "../battle/actions/MapBaseAction";
import { IEnterFrame } from "../interfaces/IEnterFrame";
import { CampaignManager } from "../manager/CampaignManager";
import { EnterFrameManager } from "../manager/EnterFrameManager";
import { GameBaseQueueManager } from "../manager/GameBaseQueueManager";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";

/**
* @author:pzlricky
* @data: 2021-04-29 17:13
* @description *** 
*/
export default class PopFrameCheck implements IEnterFrame {

    private static _instance: PopFrameCheck;
    public static get Instance(): PopFrameCheck {
        if (!PopFrameCheck._instance) PopFrameCheck._instance = new PopFrameCheck();
        return PopFrameCheck._instance;
    }
    private _actions: Array<any> = [];
    public PopFrameCheck() {
    }
    public enterFrame() {
        if (this._actions.length == 0) {
            EnterFrameManager.Instance.unRegisteEnterFrame(this);
        }
        else if (this.stateCheck()) {
            this.executeAction(this._actions.shift());
        }
    }
    public addAction(action: MapBaseAction) {
        if (this._actions.length == 0) {
            EnterFrameManager.Instance.registeEnterFrame(this);
            this._actions.push(action);
        }
    }
    private executeAction(action: MapBaseAction) {
        GameBaseQueueManager.Instance.addAction(action);
    }

    private stateCheck(): boolean {
        if (CampaignManager.CampaignOverState) return false;
        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) return false;
        if (SceneManager.Instance.lock) return false;
        return true;
    }

}