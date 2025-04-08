import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { SceneEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import DialogManager from '../../module/dialog/DialogManager';
import SDKManager from "../../../core/sdk/SDKManager";

/**
* @author:pzlricky
* @data: 2022-11-08 15:10
* @description 评分
*/
export default class StoreRatingAction extends MapBaseAction {

    constructor() {
        super();
        this.level = 3;
    }

    prepare() {
        NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
    }

    update() {
        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE || PlayerManager.Instance.isExistNewbieMask || DialogManager.isExistDialog) {
            return;
        }
        this.showView()
    }

    private showView() {
        if (SceneManager.Instance.currentType != SceneType.BATTLE_SCENE) {
            // FrameCtrlManager.Instance.open(EmWindow.EvaluationWnd);
            SDKManager.Instance.getChannel().evaluateOnAppStore();
            this.actionOver();
        }
    }


}