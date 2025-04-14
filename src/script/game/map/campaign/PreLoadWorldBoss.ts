import { PreCampaignData } from "./PreCampaignData";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import Logger from "../../../core/logger/Logger";

/**
 * 世界BOSS预加载
 * 加载地图 战斗资源
 */
export class PreLoadWorldBoss {
  private _model: CampaignMapModel;
  constructor(mapId: number, leftTime: number) {
    this._model = new CampaignMapModel();
    this._model.mapId = mapId;
    this.preLoadMap();
  }
  private preLoadMap() {
    Logger.log(
      "::::::::::::::::::::::::::::::::世界BOSS预加载*********************",
    );
    new PreCampaignData(this._model, true).syncBackCall(
      this.__loadMapCall.bind(this),
    );
  }
  private __loadMapCall() {
    // var mapBattleGround : number = TempleteManager.Instance.mapTemplateCate.getTemplateByID(this._model.mapId).BattleGround;
    // BattleResPreloadManager.load([], [this.getHeroTempId], mapBattleGround);
  }
  private get getHeroTempId(): number {
    var heroId: number = 0;
    switch (this._model.mapId) {
      case 5001:
      case 5003:
        return 2001;
        break;
      case 5002:
        return 2002;
        break;
    }
    return 0;
  }
}
