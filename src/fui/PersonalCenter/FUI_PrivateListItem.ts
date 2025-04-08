// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PrivateListItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public txt_name:fgui.GTextField;
	public txt_desc:fgui.GTextField;
	public txt_state:fgui.GTextField;
	public btn_permission:fgui.GButton;
	public static URL:string = "ui://6watmcoibkwqy";

	public static createInstance():FUI_PrivateListItem {
		return <FUI_PrivateListItem>(fgui.UIPackage.createObject("PersonalCenter", "PrivateListItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_desc = <fgui.GTextField>(this.getChild("txt_desc"));
		this.txt_state = <fgui.GTextField>(this.getChild("txt_state"));
		this.btn_permission = <fgui.GButton>(this.getChild("btn_permission"));
	}
}