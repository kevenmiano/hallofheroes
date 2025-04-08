// @ts-nocheck
import { C2SProtocol } from "../../game/constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../game/constant/protocol/S2CProtocol";
import { PlayerManager } from "../../game/manager/PlayerManager";
import GameEventDispatcher from "../event/GameEventDispatcher";
import { PackageIn } from "../net/PackageIn";
import { PackageOut } from "../net/PackageOut";


/**
 * 检测3次游戏心跳包接收情况
 * 
 */
export default class WeakNetCheckModel extends GameEventDispatcher {
	// 心跳发送间隔 秒
	public static heatbeatTime = 60;

	//弱网断开事件
	public static WeakNetClose = "WeakNetClose";

	//心跳计数器 发包+1 , 回包-1
	private heartbeat: number = 0;
	private OVER_COUNT: number = 2;//2次提示
	private MAX_COUNT: number = 3;//最大差距数
	private delayTime: number = 3000;//检测时间
	//最后一次数据包的时间
	private lastReceiveDataTime = 0;


	private static _instance: WeakNetCheckModel;

	public static get Instance() {
		if (!this._instance) {
			this._instance = new WeakNetCheckModel();
		}
		return this._instance;
	}

	private constructor() {
		super();
		this.lastReceiveDataTime = Date.now();		
	}

	public start(){
		this.reset();
		Laya.stage.timerLoop(this.delayTime, this, this.onTimeOutHandler);
	}

	public isOverTime() {
		return this.heartbeat >= this.OVER_COUNT;
	}

	public isMaxTime() {
		return this.heartbeat >= this.MAX_COUNT;
	}

	public revPackage(pkg: PackageIn) {

		this.lastReceiveDataTime = PlayerManager.Instance.currentPlayerModel.sysCurtime.getTime();

		if (pkg.code != S2CProtocol.U_C_SYNCHRONIZED_TIME && pkg.code != S2CProtocol.L_SYNC_TIME) {//心跳回包
			return;
		}

		this.heartbeat--;
		if (this.heartbeat < 0) this.heartbeat = 0;
	}

	public addPackage(pkg: PackageOut) {

		if (pkg.code != C2SProtocol.C_SYNCHRONIZED_TIME && pkg.code != S2CProtocol.L_SYNC_TIME) {//心跳包
			return;
		}
		this.heartbeat++;
	}

	private onTimeOutHandler() {
		//超时了 心跳改成5秒每次。
		if (this.checkReceiveTimeOut()) {
			WeakNetCheckModel.heatbeatTime = 5;
			console.log("弱网检测 5秒 没有接收网络数据");
		} else {
			WeakNetCheckModel.heatbeatTime = 60;
		}
		console.log(`弱网检测 当前心跳速率 ${WeakNetCheckModel.heatbeatTime} 秒`);
		this.onTimeout();
	}

	public onTimeout() {
		if (this.isMaxTime()) {
			console.log(`弱网检测 主动断开网络`);
			this.heartbeat = 0;
			this.dispatchEvent(WeakNetCheckModel.WeakNetClose);
		}

	}
	//最后收到的数据时间是否超时 5 秒
	private checkReceiveTimeOut() {
		return PlayerManager.Instance.currentPlayerModel.sysCurtime.getTime() - this.lastReceiveDataTime >= 5000;
	}

	public reset() {
		this.heartbeat = 0;
		Laya.stage.clearTimer(this, this.onTimeOutHandler);
	}
}