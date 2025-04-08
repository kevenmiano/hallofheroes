import { EnterFrameManager } from "../manager/EnterFrameManager";
import { IEnterFrame } from "../interfaces/IEnterFrame";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { GameBaseQueueManager } from "../manager/GameBaseQueueManager";
import { CampaignManager } from "../manager/CampaignManager";
import { MopupManager } from "../manager/MopupManager";
import { PlayerManager } from "../manager/PlayerManager";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";

/**
 * @author yuanzhan.yu
 */
export class DelayActionsUtils implements IEnterFrame {
    private static _Instance: DelayActionsUtils;
    public static get Instance(): DelayActionsUtils {
        if (!DelayActionsUtils._Instance) {
            DelayActionsUtils._Instance = new DelayActionsUtils();
        }
        return DelayActionsUtils._Instance;
    }

    private _actions: any[] = [];
    private _levelQueue: any[] = [];
    private _frame: number;

    constructor() {
    }

    public addAction(action) {
        if (this._actions.length == 0) {
            this.startDealy();
        }
        this._actions.push(action);
    }

    private startDealy() {
        this._frame = 0;
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    private stopDealy() {
        this._actions = ArrayUtils.sortOn(this._actions, "level", ArrayConstant.DESCENDING | ArrayConstant.NUMERIC)
        while (this._actions.length > 0) {
            var action = this._actions.shift();
            if ((SceneManager.Instance.currentType == SceneType.CASTLE_SCENE || SceneManager.Instance.currentType == SceneType.SPACE_SCENE)
                && !this.checkCompleteTaskDelay(action) && !this.checkTraceTipDelay(action)) {
                GameBaseQueueManager.Instance.addAction(action);
            } else {
                this._levelQueue.push(action);
            }
        }
    }

    private checkState(action): boolean {
        if (CampaignManager.CampaignOverState) {
            return false;
        }
        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
            return false;
        }
        if (SceneManager.Instance.lock) {
            return false;
        }
        if (GameBaseQueueManager.Instance.actionsLength > 0) {
            return false;
        }
        if (this.checkCompleteTaskDelay(action)) {
            return false;
        }
        if (this.checkTraceTipDelay(action)) {
            return false;
        }
        return true;
    }

    /**
     * 检查任务完成提示是否延后
     */
    private checkCompleteTaskDelay(action): boolean {
        // if(!(action instanceof CompleteTaskAction))
        // {
        //     return false;
        // }
        if (MopupManager.Instance.model.isMopup) {
            return true;
        }
        return false;
    }

    /**
     * 检查右下角弹窗提示是否延后
     */
    private checkTraceTipDelay(action): boolean {
        // if(!(action instanceof AlertTipAction))
        // {
        //     return false;
        // }
        if (PlayerManager.Instance.isExistNewbieMask) {
            return true;
        }
        return false;
    }

    private get curScene(): string {
        return SceneManager.Instance.currentType;
    }

    public enterFrame() {
        this._frame++;
        if (this._frame == 13) {
            this.stopDealy();
        }
        else if (this._frame > 13 && this._levelQueue.length > 0) {
            if (this.checkState(this._levelQueue[0])) {
                GameBaseQueueManager.Instance.addAction(this._levelQueue.shift());
            }
        }
        else if (this._frame > 13 && this._levelQueue.length == 0) {
            this._frame = 0;
            EnterFrameManager.Instance.unRegisteEnterFrame(this);
        }
    }
}