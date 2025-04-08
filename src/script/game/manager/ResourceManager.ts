// @ts-nocheck
import { ResourceData } from "../datas/resource/ResourceData";
import { SocketSendManager } from "./SocketSendManager";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import LangManager from "../../core/lang/LangManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { SocketManager } from "../../core/net/SocketManager";
import CastleYieldMsg = com.road.yishi.proto.castle.CastleYieldMsg;
import { LoginManager } from "../module/login/LoginManager";

export class ResourceManager {
	private static _instance: ResourceManager;

	public static get Instance(): ResourceManager {
		if (!ResourceManager._instance) {
			ResourceManager._instance = new ResourceManager();
		}
		return ResourceManager._instance;
	}

	public gold: ResourceData;
	public crystal: ResourceData;
	public population: ResourceData;
	public waterCrystal: ResourceData; //水晶

	private _socket: SocketSendManager;

	constructor() {
		this.gold = new ResourceData();
		this.crystal = new ResourceData();
		this.population = new ResourceData();
		this.waterCrystal = this.gold; // new ResourceData();
		this._socket = SocketSendManager.Instance;

		Laya.timer.loop(30000, this, this.__syncTimerHandler);
		this.addEvent();
		this.__syncTimerHandler();
	}

	private __syncTimerHandler() {
		this.sendSyncResources();
	}

	private addEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_CASTLE_UPDATE, this, this.__resourceUpgrade);
	}

	private __resourceUpgrade(pkg: PackageIn) {
		let msg = pkg.readBody(CastleYieldMsg) as CastleYieldMsg;
		let baseGold: number = msg.goldYield;
		let gYield: number = msg.goldTotalCount;
		let goldLimit: number = msg.goldMax;
		this.gold.synchronizationResource(baseGold, gYield, goldLimit);
		let pop: number = msg.curPopulation;
		let popLimit: number = msg.maxPopulation;
		// this.waterCrystal.synchronizationResource(0, msg.crystalsCount, 100000000)
		this.population.synchronizationResource(0, pop, popLimit);
	}

	public canSubtractResources($gold: number, $crystal: number, $pop: number = 0): string {
		let array: any[] = [];
		let str: string = "";
		if ($gold > this.gold.count) {
			str = LangManager.Instance.GetTranslation("mainBar.view.ResourceView.gold");
			array.push(str + ($gold - this.gold.count));
		}
		if ($crystal > this.waterCrystal.count) {
			str = LangManager.Instance.GetTranslation("mainBar.view.ResourceView.crystal");
			array.push(str + ($crystal - this.waterCrystal.count));
		}
		if ($pop > this.population.limit) {
			str = LangManager.Instance.GetTranslation("mainBar.view.ResourceView.man");
			array.push(str + ($pop - this.population.count));
		}
		if (array.length > 0) {
			str = LangManager.Instance.GetTranslation("mainBar.view.ResourceView.resource");
			return str;
		}
		return null;
	}

	public sendSyncResources() {
		if (!LoginManager.Instance.hasLogin) return;
		SocketManager.Instance.send(C2SProtocol.U_C_CASTLE_UPDATE);
	}
}
