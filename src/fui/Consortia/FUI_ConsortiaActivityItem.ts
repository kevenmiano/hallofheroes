/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaActivityItem extends fgui.GButton {

	public open:fgui.Controller;
	public bg:fgui.GLoader;
	public activityIcon:fgui.GButton;
	public operatingBtn:fgui.GButton;
	public gotoTxtBtn:fgui.GButton;
	public openMovie:fgui.GLoader;
	public activityName:fgui.GTextField;
	public promptText:fgui.GTextField;
	public timeText:fgui.GTextField;
	public static URL:string = "ui://8w3m5duwrtw61a";

	public static createInstance():FUI_ConsortiaActivityItem {
		return <FUI_ConsortiaActivityItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaActivityItem"));
	}

	protected onConstruct():void {
		this.open = this.getController("open");
		this.bg = <fgui.GLoader>(this.getChild("bg"));
		this.activityIcon = <fgui.GButton>(this.getChild("activityIcon"));
		this.operatingBtn = <fgui.GButton>(this.getChild("operatingBtn"));
		this.gotoTxtBtn = <fgui.GButton>(this.getChild("gotoTxtBtn"));
		this.openMovie = <fgui.GLoader>(this.getChild("openMovie"));
		this.activityName = <fgui.GTextField>(this.getChild("activityName"));
		this.promptText = <fgui.GTextField>(this.getChild("promptText"));
		this.timeText = <fgui.GTextField>(this.getChild("timeText"));
	}
}