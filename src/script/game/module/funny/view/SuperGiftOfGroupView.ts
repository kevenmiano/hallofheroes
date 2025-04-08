import FUI_SuperGiftOfGroup from "../../../../../fui/Funny/FUI_SuperGiftOfGroup";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { FormularySets } from "../../../../core/utils/FormularySets";
import Utils from "../../../../core/utils/Utils";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SuperGiftOfGroupManager } from "../../../manager/SuperGiftOfGroupManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import HomeWnd from "../../home/HomeWnd";
import { FunnyContent } from "./FunnyContent";
import { SuperGiftOfGroupItem } from "./SuperGiftOfGroupItem";

/**
 * 超值团购
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年11月29日14:47:01
 */
export class SuperGiftOfGroupView extends FUI_SuperGiftOfGroup implements FunnyContent {
	/**钻石总数 */
	private _diamondTotal: number = 0;

	/**活动剩余时间 */
	private _residueTime: number = 0;

	/**
	 * 构造函数
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:00:34
	 */
	constructor() {
		super();
	}

	/**视图显示 */
	onShow() {
		this.initData();
		this.initView();
		this.initEvent();
	}

	/**视图更新 */
	onUpdate() {
		this.initData();
		this.initView();
	}

	/**视图隐藏 */
	onHide() {
		this.removeEvent();

		Laya.timer.clearAll(this);
	}

	/**
	 * 初始化数据
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:02:29
	 */
	private initData() {
		SuperGiftOfGroupManager.Instance.request();
	}

	/**
	 * 初始化视图
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:02:42
	 */
	private initView() {
		this._diamondTotal = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
	}

	/**
	 * 初始化事件
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:02:53
	 */
	private initEvent() {
		/**顶部购买按钮 */
		this.btn_buy.onClick(this, this.onBuyButton);

		/**标准按钮 */
		this.getChild("helpBtn").onClick(this, this.onHelpeButton);

		this.list.itemRenderer = Laya.Handler.create(this, this.onRenderGiftItem, null, false);

		/**超值团购礼包活动详情更新 */
		NotificationManager.Instance.addEventListener(NotificationEvent.SUPERGIFTOFGROUP_DETAIL_UPDATE, this.onDetailUpdate, this);
	}

	/**
	 * 移除事件
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:03:04
	 */
	private removeEvent() {
		this.btn_buy.offClick(this, this.onBuyButton);

		this.getChild("helpBtn").offClick(this, this.onHelpeButton);

		Utils.clearGListHandle(this.list);

		NotificationManager.Instance.removeEventListener(NotificationEvent.SUPERGIFTOFGROUP_DETAIL_UPDATE, this.onDetailUpdate, this);
	}

	/**
	 * 帮助按钮
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年7月6日14:13:21
	 */
	private onHelpeButton(): void {
		let title: string = LangManager.Instance.GetTranslation("public.prompt");
		let content: string = LangManager.Instance.GetTranslation("yishi.LuckBlindBoxManager.helper");
		UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
	}

	/**
	 * 遍历读取礼包项
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:32:25
	 * @param index 下标
	 * @param item 礼包项对象
	 */
	private onRenderGiftItem(index: number, item: SuperGiftOfGroupItem): void {
		item.info(index, this._diamondTotal, SuperGiftOfGroupManager.Instance.giftList[index]);
	}

	/**
	 * 超值团购礼包活动详情更新
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:11:39
	 */
	private onDetailUpdate(): void {
		this.refreshView();
		this.loopResidueTime();

		this.list.numItems = SuperGiftOfGroupManager.Instance.giftList.length;
	}

	/**
	 * 刷新视图
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:09:38
	 */
	private refreshView(): void {
		this.giftTxt.text = FormularySets.toStringSelf(this._diamondTotal, HomeWnd.STEP);
	}

	/**
	 * 充值钻石按钮
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年11月29日15:07:54
	 */
	private onBuyButton(): void {
		FrameCtrlManager.Instance.exit(EmWindow.Funny);
		RechargeAlertMannager.Instance.openShopRecharge();
	}

	/**
	 * 设置剩余时间
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年7月6日14:15:04
	 */
	private setResidueTime() {
		this._residueTime--;
		if (this._residueTime >= 60) {
			this.activityTimeTxt.text = DateFormatter.getFullTimeString(this._residueTime);
		} else if (this._residueTime > 0) {
			this.activityTimeTxt.text = DateFormatter.getFullDateString(this._residueTime);
		} else {
			SuperGiftOfGroupManager.Instance.open = false;
			this.list.numItems = SuperGiftOfGroupManager.Instance.giftList.length;
			this.activityTimeTxt.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
		}
	}

	/**
	 * 轮询剩余时间
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年7月6日14:15:06
	 */
	private loopResidueTime(): void {
		let endTime: Date = DateFormatter.parse(SuperGiftOfGroupManager.Instance.stopTime, "YYYY-MM-DD hh:mm:ss");
		this._residueTime = endTime.getTime() / 1000 - PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
		if (this._residueTime > 0) {
			this.setResidueTime();
			Laya.timer.loop(1000, this, this.setResidueTime);
		} else {
			SuperGiftOfGroupManager.Instance.open = false;
			this.list.numItems = SuperGiftOfGroupManager.Instance.giftList.length;
			this.activityTimeTxt.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
			Laya.timer.clear(this, this.setResidueTime);
		}
	}
}
