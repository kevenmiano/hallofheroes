import { IMediator } from "@/script/game/interfaces/Mediator";
import { ConfigManager } from "../../manager/ConfigManager";
import { WorldBossBuyBuffModel } from "@/script/game/mvc/model/worldboss/WorldBossBuyBuffModel";

/**
 * 世界boss buff增益
 * @author jax.xu
 *
 */
export default class WorldBossBuffMediator implements IMediator {
  private static OP_REQUEST_PRICE: number = 1; //请求价格
  private static OP_CONFIRM_BUY: number = 2; //确认购买

  private _model: WorldBossBuyBuffModel;

  public register(target: object) {
    if (ConfigManager.info.WORLDBOSS_BUFF) {
      this.init();
    }
  }

  public unregister(target: object) {
    if (ConfigManager.info.WORLDBOSS_BUFF) {
      this.dispose();
    }
  }

  protected init() {}

  protected dispose() {
    this._model = null;
  }
}
