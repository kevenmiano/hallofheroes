// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-05-23 10:25:59
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-01 11:41:18
 * @Description:
 */
import FUI_BindMailView from "../../../../../fui/Welfare/FUI_BindMailView";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { EmailEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { BaseItem } from "../../../component/item/BaseItem";
import { TempleteManager } from "../../../manager/TempleteManager";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { WelfareManager } from "../WelfareManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";

export class BindMailView extends FUI_BindMailView {
	private rewardArray: Array<GoodsInfo> = [];

	protected onConstruct() {
		super.onConstruct();
		this.initEvent();
		this.initView();

		this.__mailCheckInfoHandler();
	}

	private initEvent() {
		this.btnBind.onClick(this, this.onBtnBindClick);
		this.list.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
		NotificationManager.Instance.addEventListener(EmailEvent.WELFARE_BIND_STATE, this.__mailCheckInfoHandler, this);
	}

	private initView() {
		this.rewardArray = [];
		let state = WelfareManager.Instance.bindMailState;

		// 正常奖励 4的时候需要展示所有
		if (state < 3 || state === 4) {
			let configTemp = TempleteManager.Instance.getConfigInfoByConfigName("mail_rewards");
			if (!configTemp && configTemp.ConfigValue != "") return;
			let configValue = configTemp.ConfigValue;
			let configItems = configValue.split("|");
			let configsCount = configItems.length;
			if (configsCount > 0) {
				let configItemStr = "";
				let rewardItem = [];
				let goods: GoodsInfo;
				for (let index = 0; index < configsCount; index++) {
					configItemStr = String(configItems[index]);
					rewardItem = configItemStr.split(",");
					goods = new GoodsInfo();
					goods.rewardType = 0;
					goods.templateId = Number(rewardItem[0]);
					goods.count = Number(rewardItem[1]);
					this.rewardArray.push(goods);
				}
			}
		}

		// 额外奖励 4的时候需要展示所有
		if (state === 1 || (state === 2 && WelfareManager.Instance.bindMailSelectPrivacy) || state === 3 || state === 4) {
			let configTemp = TempleteManager.Instance.getConfigInfoByConfigName("email_privacy_rewards");
			if (!configTemp && configTemp.ConfigValue != "") return;
			let configValue = configTemp.ConfigValue;
			let configItems = configValue.split("|");
			let configsCount = configItems.length;
			if (configsCount > 0) {
				let configItemStr = "";
				let rewardItem = [];
				let goods: GoodsInfo;
				for (let index = 0; index < configsCount; index++) {
					configItemStr = String(configItems[index]);
					rewardItem = configItemStr.split(",");
					goods = new GoodsInfo();
					goods.rewardType = 1;
					goods.templateId = Number(rewardItem[0]);
					goods.count = Number(rewardItem[1]);
					this.rewardArray.push(goods);
				}
			}
		}

		if (state === 1 || state === 4) this.getController("privacy").selectedIndex = 0;
		if ((state === 2 && !WelfareManager.Instance.bindMailSelectPrivacy) || state === 3) this.getController("privacy").selectedIndex = 1;
		this.list.numItems = this.rewardArray.length;
	}

	private onBtnBindClick(e: Laya.Event) {
		if (!WelfareManager.Instance.isReachOpenBindCon(2)) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.ActivityManager.command11"));
			return;
		}

		let state = WelfareManager.Instance.bindMailState;
		let selectPrivacy = WelfareManager.Instance.bindMailSelectPrivacy;
		switch (state) {
			case 1:
				FrameCtrlManager.Instance.open(EmWindow.BindVertifyWnd, { type: 2 });
				break;
			case 2:
				/**验证完成后根据是否选择额外奖励进行领取 */
				WelfareManager.Instance.recvBindMailReward(selectPrivacy);
				break;
			case 3:
				if (WelfareManager.Instance.bindMailSelectPrivacy) {
					WelfareManager.Instance.recvBindMailPrivacyReward();
				} else {
					this.recvBindMailPrivacyReward();
				}
				break;
			case 4:
				break;
		}
	}

	/**单独领取额外奖励 */
	private recvBindMailPrivacyReward() {
		let content: string = LangManager.Instance.GetTranslation("BindVertify.checkbox.tips1");
		let title: string = LangManager.Instance.GetTranslation("public.prompt");
		let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
		let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
		SimpleAlertHelper.Instance.Show(
			SimpleAlertHelper.SIMPLE_ALERT,
			{},
			title,
			content,
			confirm,
			cancel,
			(result: boolean, flag: boolean, data: any) => {
				if (result) {
					WelfareManager.Instance.bindMailPrivacy();
				}
			}
		);
	}

	private onRenderListItem(index: number, item: BaseItem) {
		item.info = this.rewardArray[index];
		item.getController("privacy").selectedIndex = item.info.rewardType;
	}

	private __mailCheckInfoHandler() {
		this.initView();

		this.btnBind.enabled = true;
		let state = WelfareManager.Instance.bindMailState;
		switch (state) {
			case 1: //未验证
				this.btnBind.text = LangManager.Instance.GetTranslation("BindVertify.bind");
				break;
			case 2: //已验证完毕
				if (FrameCtrlManager.Instance.isOpen(EmWindow.BindVertifyWnd)) {
					FrameCtrlManager.Instance.exit(EmWindow.BindVertifyWnd);
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("BindVertify.bindSuccess"));
				}
				this.btnBind.text = LangManager.Instance.GetTranslation("BindVertify.getReward");
				break;
			case 3: // 已领取(不包含额外奖励)
				if (WelfareManager.Instance.bindMailSelectPrivacy) {
					this.btnBind.text = LangManager.Instance.GetTranslation("BindVertify.getReward");
				} else {
					this.btnBind.text = LangManager.Instance.GetTranslation("friends.view.ToolInviteFriendItem.accept");
				}
				break;
			case 4: // 已领取(包含额外奖励)
				this.btnBind.text = LangManager.Instance.GetTranslation("dayGuide.view.FetchItem.alreadyGet");
				this.btnBind.enabled = false;
				break;
		}
	}

	private removeEvent() {
		NotificationManager.Instance.removeEventListener(EmailEvent.WELFARE_BIND_STATE, this.__mailCheckInfoHandler, this);
	}

	dispose() {
		this.removeEvent();
		super.dispose();
	}
}
