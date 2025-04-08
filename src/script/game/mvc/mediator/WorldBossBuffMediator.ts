// @ts-nocheck

import IMediator from "../../interfaces/IMediator";
import { ConfigManager } from "../../manager/ConfigManager";
import WorldBossBuyBuffModel from "../model/worldboss/WorldBossBuyBuffModel";

/**
 * 世界boss buff增益 
 * @author jax.xu
 * 
 */
export default class WorldBossBuffMediator implements IMediator {
	private static OP_REQUEST_PRICE: number = 1;  //请求价格
	private static OP_CONFIRM_BUY: number = 2;  //确认购买

	private _model: WorldBossBuyBuffModel;

	public register(target: Object) {
		if (ConfigManager.info.WORLDBOSS_BUFF) {
			this.init();
		}
	}

	public unregister(target: Object) {
		if (ConfigManager.info.WORLDBOSS_BUFF) {
			this.dispose();
		}
	}

	protected init() {

	}

	protected dispose() {
		this._model = null;
	}

}