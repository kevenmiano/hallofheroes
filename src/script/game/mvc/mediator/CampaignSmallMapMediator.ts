import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { t_s_mapData } from "../../config/t_s_map";
import { NotificationManager } from "../../manager/NotificationManager";

/**
 *
 * 小地图控制
 *
 */
export class CampaignSmallMapMediator implements IMediator {
  constructor() {}

  public register(target: object) {
    var campaignTempInfo: t_s_mapData =
      CampaignManager.Instance.mapModel.mapTempInfo;
    var mapId: number = CampaignManager.Instance.mapModel.mapId;
    // SmallMapBar.Instance.show();
    // SmallMapBar.Instance.initData(campaignTempInfo, guideBackCall);
    // if(WorldBossHelper.checkConsortiaSecretLand(mapId) || WorldBossHelper.checkConsortiaDemon(mapId) || WorldBossHelper.checkGvg(mapId))
    // 	SmallMapBar.Instance.switchSmallMapState(SmallMapBar.CAMPAIGN_SMALL_MAP_STATE2);
    // else
    // 	SmallMapBar.Instance.switchSmallMapState(SmallMapBar.CAMPAIGN_SMALL_MAP_STATE);
  }
  public unregister(target: object) {
    // SmallMapBar.Instance.initData(null);
  }

  private guideBackCall() {
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.CAMPAIGN_GUIDE,
      null,
    );
  }
}
