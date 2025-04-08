import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { PvpWarFightEvent } from "../../constant/event/NotificationEvent";
import PvpWarFightInfo from "../../module/rvrBattle/data/PvpWarFightInfo";
import { DataCommonManager } from "../../manager/DataCommonManager";
import WarReportInfo from "../../module/rvrBattle/data/WarReportInfo";
import WarFightOrderInfo from "../../module/rvrBattle/data/WarFightOrderInfo";

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-02 20:21
 */
export default class PvpWarFightModel extends GameEventDispatcher {
  public pvpWarFightInfo: PvpWarFightInfo;
  public fightReportInfo: WarReportInfo;
  private _warFightOrderList: Array<WarFightOrderInfo> = [];
  constructor() {
    super();
    this.pvpWarFightInfo = new PvpWarFightInfo();
  }

  public findSelfInfo(): WarFightOrderInfo {
    let find: WarFightOrderInfo = null;
    for (let i: number = 0; i < this._warFightOrderList.length; i++) {
      let item: WarFightOrderInfo = this._warFightOrderList[i];
      if (
        item &&
        item.userId == DataCommonManager.playerInfo.userId &&
        item.nickName == DataCommonManager.playerInfo.nickName &&
        item.serverName == DataCommonManager.playerInfo.serviceName
      ) {
        find = item;
        break;
      }
    }
    return find;
  }

  public get warFightOrderList(): Array<WarFightOrderInfo> {
    return this._warFightOrderList;
  }

  public set warFightOrderList(value: Array<WarFightOrderInfo>) {
    this._warFightOrderList = value;
    this.dispatchEvent(PvpWarFightEvent.PVP_WAR_FIGHT_ORDER_REPORT, value);
  }
}
