// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ActivityScheduleItem extends fgui.GComponent {

	public status:fgui.Controller;
	public nameTxt:fgui.GTextField;
	public timeDescTxt:fgui.GTextField;
	public activityStatusTxt:fgui.GTextField;
	public gotoBtn:fgui.GButton;
	public lookBtn:fgui.GButton;
	public static URL:string = "ui://vw2db6bomjw59miel";

	public static createInstance():FUI_ActivityScheduleItem {
		return <FUI_ActivityScheduleItem>(fgui.UIPackage.createObject("Welfare", "ActivityScheduleItem"));
	}

	protected onConstruct():void {
		this.status = this.getController("status");
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.timeDescTxt = <fgui.GTextField>(this.getChild("timeDescTxt"));
		this.activityStatusTxt = <fgui.GTextField>(this.getChild("activityStatusTxt"));
		this.gotoBtn = <fgui.GButton>(this.getChild("gotoBtn"));
		this.lookBtn = <fgui.GButton>(this.getChild("lookBtn"));
	}
}