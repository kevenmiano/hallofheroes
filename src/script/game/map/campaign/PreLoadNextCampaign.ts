//@ts-expect-error: External dependencies
import SystemArmyMsg = com.road.yishi.proto.campaign.SystemArmyMsg;

import { MapInfo } from "../space/data/MapInfo";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { PackageIn } from "../../../core/net/PackageIn";
import { TempleteManager } from "../../manager/TempleteManager";
import { BattleResPreloadManager } from "../../manager/BattleResPreloadManager";
import { SceneManager } from "../scene/SceneManager";
import SceneType from "../scene/SceneType";

/**
 *  预加载战斗资源
 */
export class PreLoadNextCampaign {
  private _mapId: number = 0;
  constructor(mapInfo: MapInfo) {
    if (mapInfo) {
      if (mapInfo.preLoaderNextMap) {
        return;
      }
      mapInfo.preLoaderNextMap = true;
      mapInfo = null;
    }
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_SYSTEM_ARMY,
      this,
      this.__allSystemArmyHandler,
    );
  }

  /**
   * 收到军队信息开始加载副本中战斗资源
   */
  private __allSystemArmyHandler(pkg: PackageIn) {
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_SYSTEM_ARMY,
      this,
      this.__allSystemArmyHandler,
    );
    let msg: SystemArmyMsg = pkg.readBody(SystemArmyMsg) as SystemArmyMsg;
    var heros: any[] = [];
    for (let i: number = 0; i < msg.heroTemplated.length; i++) {
      if (msg.heroTemplated[i] == -1) continue;
      heros.push(msg.heroTemplated[i]);
    }
    var pawns: any[] = [];
    for (let i: number = 0; i < msg.soldierTemplated.length; i++) {
      if (msg.soldierTemplated[i] == -1) continue;
      pawns.push(msg.soldierTemplated[i]);
    }
    var mapBattleGround = TempleteManager.Instance.getMapTemplateById(
      this._mapId,
    ).BattleGround;

    BattleResPreloadManager.load(pawns, heros, mapBattleGround);
  }

  public set mapId(id: number) {
    this._mapId = id;
    CampaignSocketOutManager.Instance.questCampaignAllEnemy(this._mapId);
  }

  public dispose() {
    /** 下一个场景是非战斗场景就清资源 */
    if (SceneManager.Instance.nextScene.SceneName != SceneType.BATTLE_SCENE) {
      BattleResPreloadManager.clear();
    }
  }
}
