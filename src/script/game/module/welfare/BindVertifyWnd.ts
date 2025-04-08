// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-05-23 18:28:28
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-17 10:45:32
 * @Description:
 */

import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { SocketManager } from "../../../core/net/SocketManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import HttpUtils from "../../../core/utils/HttpUtils";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import MailCheckMgr from "../../manager/MailCheckMgr";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { isOversea } from "../login/manager/SiteZoneCtrl";
import { WelfareManager } from "./WelfareManager";

import UserPin = com.road.yishi.proto.player.UserPin;
import { StringUtil } from "../../utils/StringUtil";

export default class BindVertifyWnd extends BaseWindow {
	public static CoolDown: number = 20;
	private time: number = 0;
	private type: number;
	private txtTip: fgui.GTextField;
	private title: fgui.GTextField;
	private btnClose: UIButton;
	private btnGetCode: UIButton;
	private tfName: fgui.GComponent;
	private tfCode: fgui.GComponent;
	private checkbox: fgui.GButton;

	private _regExpPhone: RegExp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
	private _regExpMail: RegExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+(w+([.-]\w+))*/;

	private c_check: fgui.Controller; //

	OnInitWind(): void {
		super.OnInitWind();
		this.c_check = this.getController("c_check");
		this.checkbox.text = LangManager.Instance.GetTranslation("BindVertify.checkBoxText");
		this.setCenter();
	}

	public OnShowWind() {
		super.OnShowWind();
		if (this.frameData) {
			this.type = this.frameData.type;
			if (this.type == 1) {
				this.tfName.getChild("userName").asTextInput.maxLength = 11;
				this.tfName.getChild("userName").asTextInput.restrict = "0-9";
				this.title.text = LangManager.Instance.GetTranslation("BindVertify.bindPhoneTitle");
				this.txtTip.text = LangManager.Instance.GetTranslation("BindVertify.bindPhoneNumber");

				this.getController("type").selectedIndex = 0;
				this.checkbox.text = LangManager.Instance.GetTranslation("BindVertify.checkBoxText");
			} else {
				this.title.text = LangManager.Instance.GetTranslation("BindVertify.bindMailTitle");
				this.txtTip.text = LangManager.Instance.GetTranslation("BindVertify.bindMailAddr");

				this.getController("type").selectedIndex = 1;
				this.checkbox.text = LangManager.Instance.GetTranslation("BindVertify.checkBoxText1");
			}
		}
		this.tfCode.getChild("userName").asTextInput.restrict = "0-9";
		this.tfCode.getChild("userName").asTextInput.maxLength = 6;

		this.checkbox.selected = false; //默认不勾选
		// 仅Oversea
		if (this.checkMailPrivacy) {
			this.c_check.selectedIndex = 1;
		} else {
			this.c_check.selectedIndex = 0;
		}
	}

	public OnHideWind(): void {
		super.OnHideWind();
		Laya.timer.clear(this, this.onTimer);
	}

	private reqBindCode() {
		if (this.type == 1) {
			let phoneNumber: string = this.tfName.getChild("userName").text;
			if (phoneNumber == "") {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text6"));
			} else if (phoneNumber.length < 11) {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text7"));
			} else if (!this._regExpPhone.test(phoneNumber)) {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text7"));
			} else {
				this.beginCool();

				let args: Object = new Object();
				args["phone"] = phoneNumber;
				args["userId"] = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
				args["key"] = PlayerManager.Instance.currentPlayerModel.userInfo.key;

				let params: string = `userId=${args["userId"]}&phone=${args["phone"]}&key=${args["key"]}`;
				Logger.info("[BindVertifyWnd]请求手机验证码", params);
				// return HttpUtils.httpRequest("http://10.10.19.49:8080/Web_Web_exploded/", "getphone", params, 'POST').then((data) => {
				return HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "getphone", params, "POST").then((data) => {
					let result: number = parseInt(data);
					switch (result) {
						case 1:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text13"));
							break;
						case -1:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text9"));
							break;
						case -2:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text17"));
							break;
						case -3:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text10"));
							break;
						case -4:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text11"));
							break;
						case -5:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text7"));
							break;
						case -6:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text18"));
							break;
						default:
							MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text11"));
							break;
					}
				});
			}
		} else {
			let mailAddr = this.tfName.getChild("userName").text;
			mailAddr = StringUtil.trimlr(mailAddr)
			if (!this._regExpMail.test(mailAddr)) {
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("MailCheckFrame.wrongEmailAddress"));
				return;
			}
			this.beginCool();
			Logger.info("[BindVertifyWnd]请求邮箱验证码", mailAddr);
			MailCheckMgr.Instance.sendCheckMail(mailAddr);
		}
	}

	private sendBindCode() {
		let code = this.tfCode.getChild("userName").text;
		if (code == "") {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text3"));
			return;
		} else if (code.length < 6) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text15"));
			return;
		}

		let ischeck = this.checkbox.selected;

		if (this.type == 1) {
			Logger.info("[BindVertifyWnd]提交手机验证码", code, C2SProtocol.C_USER_PIN_CHECK);
			let phone = this.tfName.getChild("userName").text;

			let msg: UserPin = new UserPin();
			msg.pin = Number(code);
			msg.phone = phone;
			SocketManager.Instance.send(C2SProtocol.C_USER_PIN_CHECK, msg);
		} else {
			Logger.info("[BindVertifyWnd]提交邮箱验证码", code, C2SProtocol.C_MAIL_CHECK);

			let mailAddr = this.tfName.getChild("userName").text;
			WelfareManager.Instance.bindMailSelectPrivacy = ischeck; // 是否选择额外奖励
			MailCheckMgr.Instance.submitCheckCode(mailAddr, Number(code), ischeck);
		}
	}

	private get checkMailPrivacy(): boolean {
		return this.type != 1;
	}

	private beginCool() {
		this.btnGetCode.enabled = false;
		this.time = BindVertifyWnd.CoolDown;
		this.btnGetCode.title = LangManager.Instance.GetTranslation("mailcheck.MailCheckFrame.refreshTxt", this.time);
		Laya.timer.loop(1000, this, this.onTimer);
	}

	private onTimer() {
		this.time--;
		this.btnGetCode.title = LangManager.Instance.GetTranslation("mailcheck.MailCheckFrame.refreshTxt", this.time);
		if (this.time <= 0) {
			this.btnGetCode.enabled = true;
			this.btnGetCode.title = LangManager.Instance.GetTranslation("BindVertify.getCode");
			Laya.timer.clear(this, this.onTimer);
		}
	}

	private btnConfirmClick() {
		this.sendBindCode();
	}

	private btnGetCodeClick() {
		this.reqBindCode();
	}
}
