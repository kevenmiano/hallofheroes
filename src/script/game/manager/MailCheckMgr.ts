import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { EmailEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import MailCheckModel from "../module/personalCenter/mailcheck/MailCheckModel";
import { NotificationManager } from "./NotificationManager";

import MailCheckMsg = com.road.yishi.proto.player.MailCheckMsg;

/**
 * 邮箱验证管理
 */
export default class MailCheckMgr extends GameEventDispatcher {
	private static _instance: MailCheckMgr;

	public OP_SEND_CHECK_MAIL: number = 1; // 请求发送验证邮件
	public OP_SUBMIT: number = 2; // 提交验证码

	// public currSelectedPage:String = "";
	// public currSelectedView:String = "";

	private _model: MailCheckModel;

	public get model(): MailCheckModel {
		return this._model;
	}

	public static get Instance(): MailCheckMgr {
		if (!this._instance) this._instance = new MailCheckMgr();
		return this._instance;
	}

	constructor() {
		super();
		if (this._model == null) this._model = new MailCheckModel();
	}

	public setup() {
		this.addEvent();
	}

	private addEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_MAIL_CHECK, this, this.__mailCheckInfoHandler);
	}

	/**
	 * 收到邮箱验证信息的处理方法
	 * @param event
	 */
	protected __mailCheckInfoHandler(pkg: PackageIn): void {
		let msg = pkg.readBody(MailCheckMsg) as MailCheckMsg;

		this._model.state = msg.state;
		this._model.mailAddress = msg.mail;
		this._model.isShow = msg.state != 2;
		var curScene: string = SceneManager.Instance.currentType;
		if (this._model.isShow && (curScene == SceneType.SPACE_SCENE || curScene == SceneType.CASTLE_SCENE)) {
			// FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MAIL_CHECK,MailCheckControler.TELEPHONECHECK);
			// FrameCtrlManager.Instance.open(EmWindow)
		}
		NotificationManager.Instance.dispatchEvent(EmailEvent.STATE_UPDATE, this._model);
	}

	/**
	 * 提交验证码
	 */
	public submitCheckCode(mailAddress: string, checkCode: number, bindMailSelectPrivacy: boolean): void {
		var msg: MailCheckMsg = new MailCheckMsg();
		msg.op = this.OP_SUBMIT;
		msg.mail = mailAddress;
		msg.pin = checkCode;

		if (bindMailSelectPrivacy) msg.agree = bindMailSelectPrivacy; // 同意接收营销邮件

		SocketManager.Instance.send(C2SProtocol.C_MAIL_CHECK, msg);
	}

	/**
	 * 请求发送验证邮件
	 */
	public sendCheckMail(mailAddress: string): void {
		var msg: MailCheckMsg = new MailCheckMsg();

		msg.op = this.OP_SEND_CHECK_MAIL;
		msg.mail = mailAddress;
		SocketManager.Instance.send(C2SProtocol.C_MAIL_CHECK, msg);
	}
}
