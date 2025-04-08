import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import LangManager from '../../core/lang/LangManager';
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { EmailEvent } from "../constant/event/NotificationEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { EmWindow } from "../constant/UIDefine";
import EmailInfo from "../module/mail/EmailInfo";
import EmailType from "../module/mail/EmailType";
import MailModel from '../module/mail/MailModel';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import EmailHelp from "../utils/EmailHelp";
import EmailSocketOutManager from "./EmailSocketOutManager";
import { MessageTipManager } from "./MessageTipManager";

import MailInfoMsg = com.road.yishi.proto.mail.MailInfoMsg;
import MailPickupRspMsg = com.road.yishi.proto.mail.MailPickupRspMsg;
import ReceiveMailMsg = com.road.yishi.proto.mail.ReceiveMailMsg;
import MailListRspMsg = com.road.yishi.proto.mail.MailListRspMsg;
import MailReadRspMsg = com.road.yishi.proto.mail.MailReadRspMsg;
import MailDelReqMsg = com.road.yishi.proto.mail.MailDelReqMsg;

export default class EmailManager extends GameEventDispatcher {
	private static _instance: EmailManager;
	public needRefresh:boolean = false;
	public static get Instance(): EmailManager {
		if (!this._instance) this._instance = new EmailManager();
		return this._instance;
	}
	constructor() {
		super();
	}

	private addEvent() {
		ServerDataManager.listen(S2CProtocol.U_C_MAILITEM_MOVE_RESULT, this, this.__attachedHandler);
		ServerDataManager.listen(S2CProtocol.U_C_MAIL_LIST, this, this.__attachedMailListUpdate);
		ServerDataManager.listen(S2CProtocol.U_C_MAIL_INIT_LIST, this, this.__initMailList);
		ServerDataManager.listen(S2CProtocol.U_C_MAIL_READ_RESP, this, this.__readUpdateList);
		ServerDataManager.listen(S2CProtocol.U_C_MAIL_DEL_RESULT, this, this.__mailDelResult);
	}

	public setup() {
		this.addEvent();
		EmailSocketOutManager.getEmailList();
	}

	/**初始化邮件分批发送*/
	private __initMailList(pkg: PackageIn) {
		let msg = pkg.readBody(MailListRspMsg) as MailListRspMsg;
		let infos = msg.mailInfos;
		let count = infos.length;
		let item: MailInfoMsg = null;
		let dic: EmailInfo[] = [];
		for (let index = 0; index < count; index++) {
			item = infos[index] as MailInfoMsg;
			let mInfo: EmailInfo = EmailHelp.transferToMailInfo(item);
			if (mInfo && !this.mailModel.checkIsOutDate(mInfo)) {//检测是否过期
				dic.push(mInfo);
			}
		}
		this.mailModel.initMailList(dic, msg.curPage, msg.maxPage);
		if(this.needRefresh){
			this.mailModel.dispatchEvent(EmailEvent.DATA_EMAIL_UPDATE);
		}
		this.needRefresh = false;
	}

	/**删除邮件返回结果 */
	private __mailDelResult(pkg: PackageIn) {
		let msg = pkg.readBody(MailDelReqMsg) as MailDelReqMsg;
		if (msg.delList.length != 0) {
			this.mailModel.removeEmailList(msg.delList);
			EmailManager.Instance.dispatchEvent(EmailEvent.DATA_EMAIL_DELETE);
		} else {
			var str: string = LangManager.Instance.GetTranslation("emailII.EmailControler.command03");
			MessageTipManager.Instance.show(str);
		}
	}

	/**邮件读取状态更新 */
	private __readUpdateList(pkg: PackageIn) {
		let msg: MailReadRspMsg = pkg.readBody(MailReadRspMsg) as MailReadRspMsg;
		for (let i: number = 0; i < msg.mailId.length; i++) {
			let mInfo: EmailInfo = this.mailModel.getEmailById(msg.mailId[i]);
			if (mInfo) {
				mInfo.ReadDate = msg.readDate;
				mInfo.ValidityDate = msg.validityDate;
			}
		}
		if(msg.mailId.length == 1){
			this.mailModel.dispatchEvent(EmailEvent.UPDATE_EMAIL_STATUS);
		}
		else{
			this.mailModel.dispatchEvent(EmailEvent.UPDATE_ALL_EMAIL_STATUS);
		}
	}

	/**
	 * 
	 * @param pkg 领取邮件附件更新或者有新邮件更新
	 */
	private __attachedMailListUpdate(pkg: PackageIn) {
		let msg = pkg.readBody(ReceiveMailMsg) as ReceiveMailMsg;
		let needReset: boolean = false;
		for (let i: number = 0; i < msg.mailInfos.length; i++) {
			let mInfo: EmailInfo = EmailHelp.transferToMailInfo(msg.mailInfos[i] as MailInfoMsg);
			if (mInfo && this.mailModel.allList[mInfo.Id]) {//如果存在就是更新老邮件的信息
				this.mailModel.updateAllListEmail(mInfo);
				if (mInfo.MailType == EmailType.BATTLE_REPORT) {
					this.mailModel.updateBattleEmail(mInfo);
				} else if (mInfo.MailType == EmailType.NORMAL_MAIL) {
					this.mailModel.updateNormalEmail(mInfo);
				} else {
					this.mailModel.updateSystemEmail(mInfo);
				}
			}
			else {//来了新邮件
				this.mailModel.addNewMail(mInfo);
				needReset = true;
				EmailManager.Instance.dispatchEvent(EmailEvent.DATA_EMAIL_NEW);
			}
		}
		if (needReset) {
			this.mailModel.resetData();
		}
		this.mailModel.dispatchEvent(EmailEvent.DATA_EMAIL_UPDATE);
	}

	private __attachedHandler(pkg: PackageIn) {
		let msg = pkg.readBody(MailPickupRspMsg) as MailPickupRspMsg;
		let success: boolean = true;
		let str: string = "";
		for (let i: number = 0; i < msg.pickupResult.length; i++) {
			let id: number = msg.pickupResult[i].mailId;
			let result: boolean = msg.pickupResult[i].result;
			if (!result) {
				success = false;
				if(msg.isfull)break;
				let data: EmailInfo = this.mailModel.getEmailById(id);
				if (data && data.hasGoods) {
					if (data.MailType == EmailType.STAR_MAIL) {
						str = LangManager.Instance.GetTranslation("yishi.manager.EmailManager.command02");
						MessageTipManager.Instance.show(str);
					}
					if (data.MailType == EmailType.PET_MAIL) {
						return;
					} else {
						str = LangManager.Instance.GetTranslation("yishi.manager.EmailManager.command03");
						MessageTipManager.Instance.show(str);
					}
					return;
				}
			}
		}
		if (success && msg.pickupResult.length>0) {
			str = LangManager.Instance.GetTranslation("yishi.manager.EmailManager.command04");
			MessageTipManager.Instance.show(str);
		}
	}

	public get mailModel(): MailModel {
		let mailCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.MailWnd);
		if (mailCtrl)
			return mailCtrl.data;
		return null;
	}

	public existUnreadMailCount(): number {
		let idArray: Array<number> = this.mailModel.allList.keys;
		let len: number = idArray.length;
		let key: number;
		let info: EmailInfo;
		let unreadMailCount:number = 0;
		for (let i: number = 0; i < len; i++) {
			key = idArray[i];
			info = this.mailModel.allList[key] as EmailInfo;
			if (info && !info.isRead) {
				unreadMailCount++;
			}
		}
		return unreadMailCount;
	}

	public clear() {
		this.needRefresh = true;
        this.mailModel.allList.clear();
    }
}