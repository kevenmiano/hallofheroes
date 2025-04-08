// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneBagCom extends fgui.GComponent {

	public quickResolve:fgui.Controller;
	public btn_buy:fgui.GButton;
	public txt_energy0:fgui.GTextField;
	public txt_count:fgui.GTextField;
	public list:fgui.GList;
	public btn_resolve:fgui.GButton;
	public btn_cancel:fgui.GButton;
	public btn_sure:fgui.GButton;
	public btn_fast:fgui.GButton;
	public sortBtn:fgui.GButton;
	public static URL:string = "ui://v98hah2ohsemsj";

	public static createInstance():FUI_RuneBagCom {
		return <FUI_RuneBagCom>(fgui.UIPackage.createObject("Skill", "RuneBagCom"));
	}

	protected onConstruct():void {
		this.quickResolve = this.getController("quickResolve");
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.txt_energy0 = <fgui.GTextField>(this.getChild("txt_energy0"));
		this.txt_count = <fgui.GTextField>(this.getChild("txt_count"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.btn_resolve = <fgui.GButton>(this.getChild("btn_resolve"));
		this.btn_cancel = <fgui.GButton>(this.getChild("btn_cancel"));
		this.btn_sure = <fgui.GButton>(this.getChild("btn_sure"));
		this.btn_fast = <fgui.GButton>(this.getChild("btn_fast"));
		this.sortBtn = <fgui.GButton>(this.getChild("sortBtn"));
	}
}