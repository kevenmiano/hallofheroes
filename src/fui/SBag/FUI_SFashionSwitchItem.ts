// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SFashionSwitchItem extends fgui.GButton {

	public c1:fgui.Controller;
	public language:fgui.Controller;
	public item:fgui.GButton;
	public profile:fgui.GLoader;
	public txt_name:fgui.GTextField;
	public btn_identity:fgui.GButton;
	public img_new:fgui.GImage;
	public txt_property:fgui.GTextField;
	public img_star:fgui.GImage;
	public limitImg:fgui.GImage;
	public static URL:string = "ui://6fvk31suqvnohicj";

	public static createInstance():FUI_SFashionSwitchItem {
		return <FUI_SFashionSwitchItem>(fgui.UIPackage.createObject("SBag", "SFashionSwitchItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.language = this.getController("language");
		this.item = <fgui.GButton>(this.getChild("item"));
		this.profile = <fgui.GLoader>(this.getChild("profile"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.btn_identity = <fgui.GButton>(this.getChild("btn_identity"));
		this.img_new = <fgui.GImage>(this.getChild("img_new"));
		this.txt_property = <fgui.GTextField>(this.getChild("txt_property"));
		this.img_star = <fgui.GImage>(this.getChild("img_star"));
		this.limitImg = <fgui.GImage>(this.getChild("limitImg"));
	}
}