// @ts-nocheck
import { Main } from "../../../../../Main";
import LangManager from "../../../../core/lang/LangManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { EmailEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import MailCheckMgr from "../../../manager/MailCheckMgr";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import MailCheckModel from "./MailCheckModel";

/**
 * @author:zhihua.zhou
 * @data: 2021-12-1 16:27
 * @description 邮箱验证界面
 */
export default class CheckMailWnd extends BaseWindow {
	private btn_send: fairygui.GButton;
	private btn_submit: fairygui.GButton;
	private txt_codeInput: fairygui.GTextInput;
	private txt_addressInput: fairygui.GTextInput;
	private txt_time: fairygui.GTextField;
	private txt_appeal: fairygui.GComponent;
	private btn_link: fairygui.GComponent;
	private txt_warn0: fairygui.GTextField;
	private txt_warn1: fairygui.GTextField;
	private checkBtn: fairygui.GButton;
	private list: fairygui.GList;
	private time: number = 0;

	private listData: Array<GoodsInfo> = [];

	public OnInitWind() {
		super.OnInitWind();
		this.setCenter();
		this.addEvent();
		this.txt_codeInput.restrict = "0-9";
		this.txt_warn1.text = "";
		let array = this.getMailCheckPrize();
		for (let i = 0; i < array.length; i++) {
			const element = array[i];
			let goods: GoodsInfo = new GoodsInfo();
			if (element.indexOf(",") >= 0) {
				goods.templateId = element.split(",")[0];
			} else if (element.indexOf("|") >= 0) {
				goods.templateId = Number(element.split("|")[1]);
			} else {
				goods.templateId = Number(element);
			}
			if (goods.templateId != 100) {
				this.listData.push(goods);
			}
		}
		this.list.numItems = this.listData.length;
	}

	OnShowWind() {
		super.OnShowWind();
	}

	private getMailCheckPrize(): any {
		var configInfo: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("mail_rewards");
		if (!configInfo || !configInfo.ConfigValue) {
			return [];
		}
		return configInfo.ConfigValue.split(",");
	}

	private addEvent(): void {
		NotificationManager.Instance.addEventListener(EmailEvent.STATE_UPDATE, this.__mailCheckInfoHandler, this);
		this.btn_send.onClick(this, this.onSend);
		this.btn_submit.onClick(this, this.onSubmit);
		this.btn_link.onClick(this, this.onLink);
		this.txt_appeal.onClick(this, this.onGM);
		this.list.itemRenderer = Laya.Handler.create(this, this.onRender, null, false);
		this.txt_addressInput.on(Laya.Event.INPUT, this, this.onChange, [0]);
		this.txt_codeInput.on(Laya.Event.INPUT, this, this.onChange, [1]);
	}

	private removeEvent(): void {
		NotificationManager.Instance.removeEventListener(EmailEvent.STATE_UPDATE, this.__mailCheckInfoHandler, this);
		this.btn_send.offClick(this, this.onSend);
		this.btn_submit.offClick(this, this.onSubmit);
		this.btn_link.offClick(this, this.onLink);
		this.txt_appeal.offClick(this, this.onGM);
		// this.list.itemRenderer.recover();
		Utils.clearGListHandle(this.list);
		this.txt_addressInput.off(Laya.Event.INPUT, this, this.onChange);
		this.txt_codeInput.off(Laya.Event.INPUT, this, this.onChange);
		Laya.timer.clear(this, this.onTimer);
	}

	private onChange(type: number) {
		if (type == 0) {
			this.txt_warn0.text = "";
		} else {
			this.txt_warn1.text = "";
		}
	}

	private onRender(index: number, item: BaseItem) {
		let goods: GoodsInfo = this.listData[index];
		item.info = goods;
	}

	private onLink() {
		let cfg = TempleteManager.Instance.getConfigInfoByConfigName("Privacy_protection");
		if (cfg) {
			// window.location.href = cfg.ConfigValue;
			if (!Utils.isApp()) {
				Laya.Browser.window.open(cfg.ConfigValue);
			} else {
				SDKManager.Instance.getChannel().openURL(cfg.ConfigValue);
			}
		}
	}

	private onGM() {
		FrameCtrlManager.Instance.open(EmWindow.SuggestWnd);
	}

	/**
	 * 发送验证码
	 * @returns
	 */
	protected onSend(): void {
		var isLegal: boolean = this.ckSth(this.txt_addressInput.text);
		if (!isLegal) {
			let str = LangManager.Instance.GetTranslation("MailCheckFrame.wrongEmailAddress");
			this.txt_warn0.text = str;
			MessageTipManager.Instance.show(str);
			return;
		}

		MailCheckMgr.Instance.sendCheckMail(this.txt_addressInput.text);
		this.btn_send.enabled = false;
		this.time = MailCheckModel.HAND_REFRESH_LIMIT;
		this.txt_time.text = LangManager.Instance.GetTranslation("mailcheck.MailCheckFrame.refreshTxt", MailCheckModel.HAND_REFRESH_LIMIT);
		Laya.timer.loop(1000, this, this.onTimer);
	}

	private onTimer() {
		this.time--;
		this.txt_time.text = LangManager.Instance.GetTranslation("mailcheck.MailCheckFrame.refreshTxt", this.time);
		if (this.time <= 0) {
			this.btn_send.enabled = true;
			this.txt_time.text = "";
			Laya.timer.clear(this, this.onTimer);
		}
	}

	private ckSth(con: string): boolean {
		var pattern: RegExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+(w+([.-]\w+))*/;
		var p: boolean = pattern.test(con);
		return p;
	}

	protected onSubmit(): void {
		if (!this.checkBtn.selected) {
			let str = LangManager.Instance.GetTranslation("mailCheck.MailCheckFrame.privacy");
			MessageTipManager.Instance.show(str);
			return;
		}
		var checkCode: number = parseInt(this.txt_codeInput.text);
		MailCheckMgr.Instance.submitCheckCode(this.txt_addressInput.text, checkCode, null);
	}

	/**
	 * 收到邮箱验证信息的处理方法
	 * @param event
	 */
	protected __mailCheckInfoHandler(model: MailCheckModel): void {
		this.txt_addressInput.text = model.mailAddress;
		switch (model.state) {
			case 0: //未填写邮箱
				//					_sendCheckCodeBtn.enable = true;
				this.btn_submit.enabled = false;
				break;
			case 1: //已填写邮箱,未验证
				//					_sendCheckCodeBtn.enable = false;
				this.btn_submit.enabled = true;
				break;
			case 2: //已验证完毕
				FrameCtrlManager.Instance.exit(EmWindow.CheckMailWnd);
				break;
			case 3: //发送邮件失败
				//					_sendCheckCodeBtn.enable = true;
				this.btn_submit.enabled = false;
				break;
		}
	}

	OnHideWind() {
		super.OnHideWind();
		this.removeEvent();
	}
}
