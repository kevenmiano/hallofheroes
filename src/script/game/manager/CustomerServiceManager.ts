// @ts-nocheck
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import ByteArray from "../../core/net/ByteArray";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import UIManager from "../../core/ui/UIManager";
import Dictionary from "../../core/utils/Dictionary";
import GUID from "../../core/utils/GUID";
import HttpUtils from "../../core/utils/HttpUtils";
import { ServiceReplyInfo } from "../../core/utils/ServiceReplyInfo";
import XmlMgr from "../../core/xlsx/XmlMgr";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { EmWindow } from "../constant/UIDefine";
import { UserInfo } from "../datas/userinfo/UserInfo";
import CustomerServiceModel from "../module/personalCenter/mailcheck/CustomerServiceModel";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { ArmyManager } from "./ArmyManager";
import { MessageTipManager } from "./MessageTipManager";
import { PathManager } from "./PathManager";
import { PlayerManager } from "./PlayerManager";
import ReplayListMsg = com.road.yishi.proto.customer.ReplayListMsg;
import QuestionReplayMsg = com.road.yishi.proto.customer.QuestionReplayMsg;
/**
 * 客服反馈建议
 */
export default class CustomerServiceManager extends GameEventDispatcher {
	public static NEW_REPLY: string = "new_reply";
	public static MIN_CHARS: number = 8;

	private replyPath: string;
	private submitEvulatePath: string;
	/**  回复接口 opType: 0 加载所有未读回复 1 读取回复 2 玩家对客服的回复再回复 */
	private path: string;

	private static _instance: CustomerServiceManager;

	public static get Instance(): CustomerServiceManager {
		if (!this._instance) this._instance = new CustomerServiceManager();
		return this._instance;
	}

	private _model: CustomerServiceModel;

	public get model(): CustomerServiceModel {
		return this._model;
	}

	constructor() {
		super();
		if (this._model == null) this._model = new CustomerServiceModel();
		this.path = PathManager.customerPath;
		this.replyPath = PathManager.customerReplyPath;
		this.submitEvulatePath = PathManager.customerSubmitEvaluatePath;
		this.getReplyList();

		ServerDataManager.listen(S2CProtocol.U_C_QUESTION_REPLAY, this, this.onRecvReply);
	}

	/**
	 * 收到客服回复
	 * @param pkg
	 */
	private onRecvReply(pkg: PackageIn) {
		let msg = pkg.readBody(ReplayListMsg) as ReplayListMsg;
		var replyInfo: ServiceReplyInfo = new ServiceReplyInfo();
		var byte: ByteArray;

		msg.questionInfos.forEach((que) => {
			replyInfo.questionId = que.questionId.toString();
			replyInfo.content = que.content;
			replyInfo.employ = que.employ.toString();
			byte = new ByteArray();
			byte.writeArrayBuffer(que.commitTime);
			if (byte && byte.length) {
				byte.position = 0;
				replyInfo.date = new Date(byte.readShort(), byte.readByte() - 1, byte.readByte(), byte.readByte(), byte.readByte(), byte.readByte());
				byte.clear();
			}

			replyInfo.title = que.title;
			replyInfo.stopReply = que.stopReply.toString();
			replyInfo.replayUserName = que.replayUserName;
			replyInfo.replayContent = que.replayContent;
			replyInfo.type = que.type;
			this._model.receiveMessageList.push(replyInfo);
		});

		this.dispatchNewReplyEvent();
	}

	public dispatchNewReplyEvent(): void {
		this._model.lashReplyTime = 0;
		this.dispatchEvent(CustomerServiceManager.NEW_REPLY);
	}

	/**
	 *获取客服回复
	 */
	public getReplyList(): void {
		let param: string = "user_id=" + PlayerManager.Instance.currentPlayerModel.playerInfo.userId + "&type=0";
		//上传问题描述
		HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "questionreplaylist", param, "POST", "arraybuffer").then((data) => {
			var emailContent: string;
			try {
				let content: ByteArray = new ByteArray();
				content.writeArrayBuffer(data);
				if (content && content.length) {
					content.position = 0;
					content.uncompress();
					emailContent = content.readUTFBytes(content.bytesAvailable);
					content.clear();
				}
				Logger.log("getReplyList获取客服回复 : ", emailContent);
			} catch (error) {
				Logger.error(error.message);
				return;
			}

			if (emailContent) {
				try {
					let mailData: any = XmlMgr.Instance.decode(emailContent);
					Logger.log("mailData:", mailData);
					let dic = new Dictionary();
					if (mailData.Result.Info instanceof Array) {
						for (let key in mailData.Result.Info) {
							if (Object.prototype.hasOwnProperty.call(mailData.Result.Info, key)) {
								let item = mailData.Result.Info[key];
								let mailItem = new ServiceReplyInfo();
								mailItem.copy(item);
								dic.set(mailItem.questionId, mailItem);
							}
						}
					} else if (mailData.Result.Info instanceof Object) {
						let item = mailData.Result.Info;
						let mailItem = new ServiceReplyInfo();
						mailItem.copy(item);
						dic.set(mailItem.questionId, mailItem);
					}
					this._model.addReceiveMessage(dic);
					if (dic.length > 0) {
						CustomerServiceManager.Instance.dispatchEvent(CustomerServiceManager.NEW_REPLY);
					}
				} catch (e) {
					Logger.error(e.message);
				}
			} else {
			}
		});
	}

	public picFile: any;
	/**
	 * 从本地选择文件
	 */
	selectFile(fileData: string, file: any): void {
		this.picFile = file;
		this.model.picData = fileData;
		let str = fileData.split(";")[0];
		let fileType = str.split(":")[1];
		fileType = "." + fileType.split("/")[1];

		var _userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
		var guid: GUID = new GUID();
		let guidStr = guid.create();
		this.model.fileName = _userInfo.site + "_" + _userInfo.userId + "_" + guidStr + fileType;
		this.model.sendData.pic_url = "/fileupload/pic/" + this.model.fileName;
	}

	/**
	 *提交问题
	 */
	public sendHttpRequest(): void {
		var _userInfo: UserInfo = PlayerManager.Instance.currentPlayerModel.userInfo;
		this.model.sendData.user_id = _userInfo.userId;

		//格式转换 //如果是 post请求, 则参数必须放在第二个参数中, 格式同样是: a=xxxx&b=xxx, 通常项目中都会采用json格式进行数据传递
		let param: string = "";
		for (const key in this.model.sendData) {
			if (Object.prototype.hasOwnProperty.call(this.model.sendData, key)) {
				const element = this.model.sendData[key];
				//没值的字段不要传
				if (element) {
					param += key + "=" + element + "&";
				}
			}
		}
		param = param.substring(0, param.length - 1);

		// 提交问题之前需要先将图片上传(有图片的情况下)
		if (this.model.fileName) {
			//上传图片文件到后台
			let formData: FormData = new FormData();
			formData.append(this.model.sendData.pic_url, this.picFile);
			fetch(PathManager.customerSubmitImagePath, { method: "post", body: formData })
				.then(function (res) {
					Logger.log(res);

					//上传图片
					HttpUtils.httpRequest(PathManager.customerSubmitImagePath, "", this.model.fileName, "POST", "text").then((data) => {
						Logger.log("提交客服上传图片数据返回: ", data);
						CustomerServiceManager.Instance.model.fileName = null;
					});

					//上传问题描述
					HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "complaintshandle", param, "POST", "text").then((data) => {
						Logger.log("提交客服问题描述数据返回: ", data);
						CustomerServiceManager.Instance.onResultCompleted(data);
					});
				})
				.catch(function (err) {
					Logger.error(err);
                    CustomerServiceManager.Instance.onResultCompleted("0");
				});
		}

		// 无图片的情况下
		else {
			//上传问题描述
			HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "complaintshandle", param, "POST", "text").then((data) => {
				Logger.log("提交客服问题描述数据返回: ", data);
				CustomerServiceManager.Instance.onResultCompleted(data);
			});
		}
	}

	public onResultCompleted(result: string): void {
		switch (result) {
			case "1":
				this.model.hasSubmit = true;
				this.model.lashReplyTime = this.model.today.getTime();
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content01"));
				FrameCtrlManager.Instance.exit(EmWindow.SuggestWnd);
				FrameCtrlManager.Instance.exit(EmWindow.CustomerServiceWnd);
				// UIManager.Instance.HideWind(EmWindow.CustomerServiceWnd);
				break;
			case "0":
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content02"));
				break;
			case "-2":
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content03"));
				break;
			case "-3":
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content04"));
				break;
		}
	}

	/**
	 *提交评价
	 */
	public sendEvaluate(): void {
		this._model.sendData.question_title = this._model.currentReplyInfo.title;
		this._model.sendData.question_id = this._model.currentMessageId;
		if (this.checkBlank()) return;
		this._model.sendData.appraisal_content = this._model.sendData.question_content;
		this._model.sendData.question_content = "";

		let param: string = "";
		for (const key in this.model.sendData) {
			if (Object.prototype.hasOwnProperty.call(this.model.sendData, key)) {
				const element = this.model.sendData[key];
				//没值的字段不要传
				if (element) {
					param += key + "=" + element + "&";
				}
			}
		}
		param = param.substring(0, param.length - 1);

		//上传问题描述
		HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "appraisereplayservlet", param, "POST").then((data) => {
			Logger.log("提交客服评价返回: ", data);
			this._onResultCompleted(data);
		});

		// dispatchEvent(new Event(Event.COMPLETE));//发出提交成功事件
	}

	private checkBlank(): Boolean {
		if (!this._model.sendData.question_title) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content05"));
			return true;
		}
		if (!this._model.sendData.question_content) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content06"));
			return true;
		}
		if (String(this._model.sendData.question_content).length < CustomerServiceManager.MIN_CHARS) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content07"));
			return true;
		}
		return false;
	}

	/**
	 *继续提交问题
	 */
	public sendServiceReply(): void {
		this._model.sendData.user_id = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
		this._model.sendData.question_title = this._model.currentReplyInfo.title;
		this._model.sendData.nick_name = ArmyManager.Instance.thane.nickName;
		if (this.checkBlank()) return;

		this._model.sendData.question_id = this._model.currentMessageId;
		this._model.sendData.type = 2;
		this._model.sendData.reply_content = this._model.sendData.question_content;
		this._model.sendData.question_content = "";

		let param: string = "";
		for (const key in this.model.sendData) {
			if (Object.prototype.hasOwnProperty.call(this.model.sendData, key)) {
				const element = this.model.sendData[key];
				//没值的字段不要传
				if (element) {
					param += key + "=" + element + "&";
				}
			}
		}
		param = param.substring(0, param.length - 1);

		//上传问题描述
		HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "questionreplaylist", param, "POST").then((data) => {
			Logger.log("继续提交返回: ", data);
			this._onResultCompleted(data);
		});

		// dispatchEvent(new Event(Event.COMPLETE));//发出提交成功事件
	}

	private _onResultCompleted(data): void {
		var result: number = Number(data);
		switch (result) {
			case 1:
				this._model.hasSubmit = true;
				this._model.lashReplyTime = this._model.today.getTime();
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content01"));
				break;
			case 0:
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content02"));

				break;
			case -2:
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content03"));

				break;
			case -3:
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.CustomerServiceManger.content04"));

				break;
		}
		UIManager.Instance.HideWind(EmWindow.ServiceReplyWnd);

		//			dispatchEvent(new Event(Event.COMPLETE));//发出提交成功事件
	}

	/**
	 *发送已读
	 *
	 */
	public sendRead(): void {
		let param: string =
			"user_id=" + PlayerManager.Instance.currentPlayerModel.playerInfo.userId + "&type=1&question_id=" + this._model.currentMessageId;
		HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "questionreplaylist", param, "POST", "arraybuffer").then((data) => {
			Logger.log("发送已读返回: ", data);
		});
	}
}
