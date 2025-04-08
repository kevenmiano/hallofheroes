/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaMemberView extends fgui.GComponent {

	public memberBtn:fgui.GButton;
	public dutyBtn:fgui.GButton;
	public apBtn:fgui.GButton;
	public offlineTimeBtn:fgui.GButton;
	public memberList:fgui.GList;
	public static URL:string = "ui://8w3m5duwj8kpi8k";

	public static createInstance():FUI_ConsortiaMemberView {
		return <FUI_ConsortiaMemberView>(fgui.UIPackage.createObject("Consortia", "ConsortiaMemberView"));
	}

	protected onConstruct():void {
		this.memberBtn = <fgui.GButton>(this.getChild("memberBtn"));
		this.dutyBtn = <fgui.GButton>(this.getChild("dutyBtn"));
		this.apBtn = <fgui.GButton>(this.getChild("apBtn"));
		this.offlineTimeBtn = <fgui.GButton>(this.getChild("offlineTimeBtn"));
		this.memberList = <fgui.GList>(this.getChild("memberList"));
	}
}