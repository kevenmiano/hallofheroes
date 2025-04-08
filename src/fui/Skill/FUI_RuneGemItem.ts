// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneGemItem extends fgui.GButton {

	public item:fgui.GButton;
	public img_select:fgui.GImage;
	public txt_num:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public static URL:string = "ui://v98hah2osmjligh";

	public static createInstance():FUI_RuneGemItem {
		return <FUI_RuneGemItem>(fgui.UIPackage.createObject("Skill", "RuneGemItem"));
	}

	protected onConstruct():void {
		this.item = <fgui.GButton>(this.getChild("item"));
		this.img_select = <fgui.GImage>(this.getChild("img_select"));
		this.txt_num = <fgui.GTextField>(this.getChild("txt_num"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
	}
}