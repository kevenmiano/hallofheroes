import IMediator from "../../interfaces/IMediator";
import { FrameCtrlManager } from '../FrameCtrlManager';
import { EmWindow } from "../../constant/UIDefine";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";

export default class PvpUIMediator implements IMediator {
    private _selfArmy: CampaignArmy;

    public register(target: any) {
        FrameCtrlManager.Instance.open(EmWindow.RvrBattleMapRightWnd);
        FrameCtrlManager.Instance.open(EmWindow.RvrBattleMapTopCenterWnd);
        FrameCtrlManager.Instance.open(EmWindow.RvrBattleMapCombatWnd);
        this._selfArmy = CampaignManager.Instance.mapModel.selfMemberData;
        if (this._selfArmy) this._selfArmy.addEventListener(CampaignMapEvent.IS_DIE, this.__dieHandler, this);
        this.__dieHandler();
    }

    public unregister(target: any) {
        FrameCtrlManager.Instance.exit(EmWindow.RvrBattleMapRightWnd);
        FrameCtrlManager.Instance.exit(EmWindow.RvrBattleMapTopCenterWnd);
        FrameCtrlManager.Instance.exit(EmWindow.RvrBattleMapCombatWnd);
        if (this._selfArmy) this._selfArmy.removeEventListener(CampaignMapEvent.IS_DIE, this.__dieHandler, this);
    }

    private __dieHandler() {
        if (!this._selfArmy) return;
        if (CampaignArmyState.checkDied(this._selfArmy.isDie)) {
            FrameCtrlManager.Instance.open(EmWindow.RvrBattlePlayerRiverWnd, { time: this._selfArmy.riverTime / 1000 });
        }
        else {
            FrameCtrlManager.Instance.exit(EmWindow.RvrBattlePlayerRiverWnd);
        }
    }
}