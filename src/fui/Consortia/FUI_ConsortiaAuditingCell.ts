/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaAuditingCell extends fgui.GComponent {

	public normal:fgui.GLoader;
	public txt_Name:fgui.GTextField;
	public txt_Fight:fgui.GTextField;
	public btnDisagree:fgui.GButton;
	public btnAgree:fgui.GButton;
	public icon_head:fgui.GComponent;
	public txt_level:fgui.GTextField;
	public jobLoader:fgui.GLoader;
	public static URL:string = "ui://8w3m5duwfszci7s";

	public static createInstance():FUI_ConsortiaAuditingCell {
		return <FUI_ConsortiaAuditingCell>(fgui.UIPackage.createObject("Consortia", "ConsortiaAuditingCell"));
	}

	protected onConstruct():void {
		this.normal = <fgui.GLoader>(this.getChild("normal"));
		this.txt_Name = <fgui.GTextField>(this.getChild("txt_Name"));
		this.txt_Fight = <fgui.GTextField>(this.getChild("txt_Fight"));
		this.btnDisagree = <fgui.GButton>(this.getChild("btnDisagree"));
		this.btnAgree = <fgui.GButton>(this.getChild("btnAgree"));
		this.icon_head = <fgui.GComponent>(this.getChild("icon_head"));
		this.txt_level = <fgui.GTextField>(this.getChild("txt_level"));
		this.jobLoader = <fgui.GLoader>(this.getChild("jobLoader"));
	}
}