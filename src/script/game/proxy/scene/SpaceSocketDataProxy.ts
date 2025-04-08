import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { SocketManager } from "../../../core/net/SocketManager";
import { SLGSocketEvent } from "../../constant/event/NotificationEvent";
import SceneType from "../../map/scene/SceneType";
import { SocketDataProxyModel } from "../data/SocketDataProxyModel";
import { BaseSceneSocketDataProxy } from "./BaseSceneSocketDataProxy";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";

export class SpaceSocketDataProxy extends BaseSceneSocketDataProxy {
  constructor($model: SocketDataProxyModel) {
    super($model);
  }

  /**
   *开始天空之城socket数据缓存
   *
   */
  protected proxyStart() {
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_SPACE_ENTER,
      this,
      this.__onDataHandler
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_SPACE_LEAVE,
      this,
      this.__onDataHandler
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_SPACE_SYNC_POS,
      this,
      this.__onDataHandler
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HERO_BROAD_EQUIPMENT,
      this,
      this.__onDataHandler
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_SPACE_EVENT,
      this,
      this.__onDataHandler
    );
  }

  /**
   *结束天空之城socket数据缓存
   *
   */
  protected proxyOver() {
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_SPACE_ENTER,
      this,
      this.__onDataHandler
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_SPACE_LEAVE,
      this,
      this.__onDataHandler
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_SPACE_SYNC_POS,
      this,
      this.__onDataHandler
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_HERO_BROAD_EQUIPMENT,
      this,
      this.__onDataHandler
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_SPACE_EVENT,
      this,
      this.__onDataHandler
    );
  }

  public get sceneType(): string {
    return SceneType.SPACE_SCENE;
  }
}
