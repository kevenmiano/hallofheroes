import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { PvpWarFightEvent } from "../../../constant/event/NotificationEvent";
/**
 * 战场结算信息
 */
export default class WarReportInfo extends GameEventDispatcher {
    public oneTeamId: number = 0;
    public twoTeamId: number = 0;
    public thdTeamId: number = 0;
    public tempId: number = 0;
    public ownCount: number = 0;
    public teamCount: number = 0;
    public oneScore: number = 0;
    public twoScore: number = 0;
    public thdScore: number = 0;

    public commit() {
        this.dispatchEvent(PvpWarFightEvent.PVP_WAR_FIGHT_REPORT, null);
    }
}