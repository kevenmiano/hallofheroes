// @ts-nocheck
import { GameSocket } from "../net/GameSocket";
import { PackageOut } from "../net/PackageOut";
import { SocketEvent } from "../net/SocketEvent";
import PackageCheckModel from "./PackageCheckModel";

/**
 * 检测一秒内相同数据包发送次数, 防止脚本for 发送, 以及连点外挂
 * 
 */
export default class PackageCheckController {
	private _model: PackageCheckModel;
	private _byteSocket: GameSocket;
	constructor(bs: GameSocket) {
		this._byteSocket = bs;
		this._model = new PackageCheckModel();
		this._model.addEventListener(SocketEvent.CHECK_ERROR, this.__checkErrorHandler, this);
	}
	
	private __checkErrorHandler(evt: SocketEvent): void {
		this._byteSocket.close();
		//trace(""检测到发包异常, 断开链接******************************************************");
	}

	public addPackage(pkg: PackageOut): void {
		this._model.addPackage(pkg);
	}
	
}