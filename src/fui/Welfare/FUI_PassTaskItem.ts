/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PassTaskItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public txt_exp:fgui.GTextField;
	public txt_desc:fgui.GTextField;
	public btn_claim:fgui.GButton;
	public btn_go:fgui.GButton;
	public static URL:string = "ui://vw2db6boo9c7i8m";

	public static createInstance():FUI_PassTaskItem {
		return <FUI_PassTaskItem>(fgui.UIPackage.createObject("Welfare", "PassTaskItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.txt_exp = <fgui.GTextField>(this.getChild("txt_exp"));
		this.txt_desc = <fgui.GTextField>(this.getChild("txt_desc"));
		this.btn_claim = <fgui.GButton>(this.getChild("btn_claim"));
		this.btn_go = <fgui.GButton>(this.getChild("btn_go"));
	}
}