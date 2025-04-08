// @ts-nocheck
import { PackageIn } from "../../../../core/net/PackageIn";
import { CampaignEvent, SceneEvent } from "../../../constant/event/NotificationEvent";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ServerFrameManager } from "../../../manager/ServerFrameManager";
import { MapBaseAction } from "../MapBaseAction";

export default class MessageAction extends MapBaseAction {
    private _pkg: PackageIn;

    constructor($pkg: PackageIn) {
        super();
        this._pkg = $pkg;
    }

    public prepare() {
        NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE,false);
        // SceneManager.Instance.lockScene = false;
    }

    public update() {
        if (this._count == 1) {
            ServerFrameManager.Instance.createFrame(this._pkg, this.actionOver.bind(this));
        }
        else if (this._count > 750) {
            this.actionOver();
        }
        this._count++;
    }
    
    protected actionOver() {
        super.actionOver();
        Laya.timer.once(2000, this, this.updateStatus);
    }

    private updateStatus() {
        if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
            this.playerModel.dispatchEvent(CampaignEvent.AUTO_WALK_CHANGED)
        }
	}

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel
    }
}