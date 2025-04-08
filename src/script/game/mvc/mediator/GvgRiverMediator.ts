import IMediator from "../../interfaces/IMediator";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";

/**
 *
 * 工会战中复活相关
 *
 */
export class GvgRiverMediator implements IMediator {
    private _selfArmy: CampaignArmy;

    constructor() {
    }

    public register(target: Object): void {
        this._selfArmy = CampaignManager.Instance.mapModel.selfMemberData;
        this._selfArmy.addEventListener(CampaignMapEvent.IS_DIE, this.__dieHandler, this);
        this.__dieHandler();
    }

    public unregister(target: Object): void {
        if (this._selfArmy) {
            this._selfArmy.removeEventListener(CampaignMapEvent.IS_DIE, this.__dieHandler, this);
        }
        this._selfArmy = null;
        UIManager.Instance.HideWind(EmWindow.GvgRiverWnd);
    }

    private __dieHandler(): void {
        if (CampaignArmyState.checkDied(this._selfArmy.isDie) && this._selfArmy.riverTime > 0) {
            let riverTime: number = this._selfArmy.riverTime / 1000;
            UIManager.Instance.ShowWind(EmWindow.GvgRiverWnd, [riverTime]);
        } else {
            UIManager.Instance.HideWind(EmWindow.GvgRiverWnd);
        }
    }
}