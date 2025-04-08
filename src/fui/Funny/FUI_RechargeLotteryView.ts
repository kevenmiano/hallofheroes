/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RechargeLotteryGoodsItem from "./FUI_RechargeLotteryGoodsItem";

export default class FUI_RechargeLotteryView extends fgui.GComponent {

	public txt_remainTime:fgui.GTextField;
	public list:fgui.GList;
	public item_0:FUI_RechargeLotteryGoodsItem;
	public item_1:FUI_RechargeLotteryGoodsItem;
	public item_2:FUI_RechargeLotteryGoodsItem;
	public item_3:FUI_RechargeLotteryGoodsItem;
	public item_4:FUI_RechargeLotteryGoodsItem;
	public item_5:FUI_RechargeLotteryGoodsItem;
	public item_6:FUI_RechargeLotteryGoodsItem;
	public item_7:FUI_RechargeLotteryGoodsItem;
	public item_8:FUI_RechargeLotteryGoodsItem;
	public item_9:FUI_RechargeLotteryGoodsItem;
	public item_10:FUI_RechargeLotteryGoodsItem;
	public item_11:FUI_RechargeLotteryGoodsItem;
	public item_12:FUI_RechargeLotteryGoodsItem;
	public item_13:FUI_RechargeLotteryGoodsItem;
	public item_14:FUI_RechargeLotteryGoodsItem;
	public item_15:FUI_RechargeLotteryGoodsItem;
	public item_16:FUI_RechargeLotteryGoodsItem;
	public item_17:FUI_RechargeLotteryGoodsItem;
	public btn_award0:fgui.GButton;
	public btn_award1:fgui.GButton;
	public btn_recharge:fgui.GButton;
	public timeResetTxt:fgui.GTextField;
	public txt_leftTimes:fgui.GTextField;
	public movie:fgui.Transition;
	public static URL:string = "ui://lzu8jcp2mwzamifm";

	public static createInstance():FUI_RechargeLotteryView {
		return <FUI_RechargeLotteryView>(fgui.UIPackage.createObject("Funny", "RechargeLotteryView"));
	}

	protected onConstruct():void {
		this.txt_remainTime = <fgui.GTextField>(this.getChild("txt_remainTime"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.item_0 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_0"));
		this.item_1 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_1"));
		this.item_2 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_2"));
		this.item_3 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_3"));
		this.item_4 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_4"));
		this.item_5 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_5"));
		this.item_6 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_6"));
		this.item_7 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_7"));
		this.item_8 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_8"));
		this.item_9 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_9"));
		this.item_10 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_10"));
		this.item_11 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_11"));
		this.item_12 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_12"));
		this.item_13 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_13"));
		this.item_14 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_14"));
		this.item_15 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_15"));
		this.item_16 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_16"));
		this.item_17 = <FUI_RechargeLotteryGoodsItem>(this.getChild("item_17"));
		this.btn_award0 = <fgui.GButton>(this.getChild("btn_award0"));
		this.btn_award1 = <fgui.GButton>(this.getChild("btn_award1"));
		this.btn_recharge = <fgui.GButton>(this.getChild("btn_recharge"));
		this.timeResetTxt = <fgui.GTextField>(this.getChild("timeResetTxt"));
		this.txt_leftTimes = <fgui.GTextField>(this.getChild("txt_leftTimes"));
		this.movie = this.getTransition("movie");
	}
}