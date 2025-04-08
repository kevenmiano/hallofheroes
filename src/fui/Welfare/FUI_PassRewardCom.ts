/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_PassRewardItem from "./FUI_PassRewardItem";

export default class FUI_PassRewardCom extends fgui.GComponent {

	public txt_0:fgui.GTextField;
	public txt_1:fgui.GTextField;
	public list:fgui.GList;
	public next:FUI_PassRewardItem;
	public img_lock:fgui.GButton;
	public img_red:fgui.GImage;
	public static URL:string = "ui://vw2db6boo9c7i8l";

	public static createInstance():FUI_PassRewardCom {
		return <FUI_PassRewardCom>(fgui.UIPackage.createObject("Welfare", "PassRewardCom"));
	}

	protected onConstruct():void {
		this.txt_0 = <fgui.GTextField>(this.getChild("txt_0"));
		this.txt_1 = <fgui.GTextField>(this.getChild("txt_1"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.next = <FUI_PassRewardItem>(this.getChild("next"));
		this.img_lock = <fgui.GButton>(this.getChild("img_lock"));
		this.img_red = <fgui.GImage>(this.getChild("img_red"));
	}
}