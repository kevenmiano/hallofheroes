/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SevenLoginBtnItem from "./FUI_SevenLoginBtnItem";

export default class FUI_SevenLogin extends fgui.GComponent {

	public item1:FUI_SevenLoginBtnItem;
	public item2:FUI_SevenLoginBtnItem;
	public item3:FUI_SevenLoginBtnItem;
	public item4:FUI_SevenLoginBtnItem;
	public item5:FUI_SevenLoginBtnItem;
	public item6:FUI_SevenLoginBtnItem;
	public item7:FUI_SevenLoginBtnItem;
	public loginTitleTxt:fgui.GTextField;
	public leftDescTxt:fgui.GTextField;
	public leftTimeTxt:fgui.GTextField;
	public static URL:string = "ui://vw2db6box6dri7y";

	public static createInstance():FUI_SevenLogin {
		return <FUI_SevenLogin>(fgui.UIPackage.createObject("Welfare", "SevenLogin"));
	}

	protected onConstruct():void {
		this.item1 = <FUI_SevenLoginBtnItem>(this.getChild("item1"));
		this.item2 = <FUI_SevenLoginBtnItem>(this.getChild("item2"));
		this.item3 = <FUI_SevenLoginBtnItem>(this.getChild("item3"));
		this.item4 = <FUI_SevenLoginBtnItem>(this.getChild("item4"));
		this.item5 = <FUI_SevenLoginBtnItem>(this.getChild("item5"));
		this.item6 = <FUI_SevenLoginBtnItem>(this.getChild("item6"));
		this.item7 = <FUI_SevenLoginBtnItem>(this.getChild("item7"));
		this.loginTitleTxt = <fgui.GTextField>(this.getChild("loginTitleTxt"));
		this.leftDescTxt = <fgui.GTextField>(this.getChild("leftDescTxt"));
		this.leftTimeTxt = <fgui.GTextField>(this.getChild("leftTimeTxt"));
	}
}