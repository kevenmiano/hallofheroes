/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BoxItem from "./FUI_BoxItem";

export default class FUI_LevelGiftItem2 extends fgui.GComponent {

	public hasGet:fgui.Controller;
	public boxItem:FUI_BoxItem;
	public itemList:fgui.GList;
	public txt_lv:fgui.GTextField;
	public btn_buy:fgui.GButton;
	public tipBtn1:fgui.GButton;
	public txt_originalPrice:fgui.GTextField;
	public tipBtn2:fgui.GButton;
	public txt_currPrice:fgui.GTextField;
	public static URL:string = "ui://vw2db6bowvo23w";

	public static createInstance():FUI_LevelGiftItem2 {
		return <FUI_LevelGiftItem2>(fgui.UIPackage.createObject("Welfare", "LevelGiftItem2"));
	}

	protected onConstruct():void {
		this.hasGet = this.getController("hasGet");
		this.boxItem = <FUI_BoxItem>(this.getChild("boxItem"));
		this.itemList = <fgui.GList>(this.getChild("itemList"));
		this.txt_lv = <fgui.GTextField>(this.getChild("txt_lv"));
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.tipBtn1 = <fgui.GButton>(this.getChild("tipBtn1"));
		this.txt_originalPrice = <fgui.GTextField>(this.getChild("txt_originalPrice"));
		this.tipBtn2 = <fgui.GButton>(this.getChild("tipBtn2"));
		this.txt_currPrice = <fgui.GTextField>(this.getChild("txt_currPrice"));
	}
}