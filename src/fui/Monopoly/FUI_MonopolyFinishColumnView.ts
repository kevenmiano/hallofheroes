// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_MonopolyFinishRewardItem from "./FUI_MonopolyFinishRewardItem";

export default class FUI_MonopolyFinishColumnView extends fgui.GComponent {

	public item1:FUI_MonopolyFinishRewardItem;
	public item2:FUI_MonopolyFinishRewardItem;
	public item3:FUI_MonopolyFinishRewardItem;
	public item4:FUI_MonopolyFinishRewardItem;
	public item5:FUI_MonopolyFinishRewardItem;
	public static URL:string = "ui://i4y6lftsvuwdiou";

	public static createInstance():FUI_MonopolyFinishColumnView {
		return <FUI_MonopolyFinishColumnView>(fgui.UIPackage.createObject("Monopoly", "MonopolyFinishColumnView"));
	}

	protected onConstruct():void {
		this.item1 = <FUI_MonopolyFinishRewardItem>(this.getChild("item1"));
		this.item2 = <FUI_MonopolyFinishRewardItem>(this.getChild("item2"));
		this.item3 = <FUI_MonopolyFinishRewardItem>(this.getChild("item3"));
		this.item4 = <FUI_MonopolyFinishRewardItem>(this.getChild("item4"));
		this.item5 = <FUI_MonopolyFinishRewardItem>(this.getChild("item5"));
	}
}