import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
export default class MazeRiverMediator implements IMediator {
  private _rivarCount: number;
  private _selfArmy: CampaignArmy;
  register(target: any) {
    this._selfArmy = CampaignManager.Instance.mapModel.selfMemberData;
    if (this._selfArmy) {
      this._selfArmy.addEventListener(
        CampaignMapEvent.IS_DIE,
        this.__isDieHandler,
        this,
      );
      this.__isDieHandler(null);
    }
  }

  unregister(target: any) {
    if (this._selfArmy)
      this._selfArmy.removeEventListener(
        CampaignMapEvent.IS_DIE,
        this.__isDieHandler,
        this,
      );
  }

  private __isDieHandler(data: number) {
    if (this._selfArmy.isDie == 1) {
      UIManager.Instance.ShowWind(EmWindow.MazeRiverWnd, { cost: data });
    } else {
      UIManager.Instance.HideWind(EmWindow.MazeRiverWnd);
    }
  }
}
