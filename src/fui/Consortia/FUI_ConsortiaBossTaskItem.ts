/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaBossTaskItem extends fgui.GButton {

	public taskTitleTxt:fgui.GTextField;
	public taskDescTxt:fgui.GTextField;
	public vgroup:fgui.GGroup;
	public static URL:string = "ui://8w3m5duwv4fyiar";

	public static createInstance():FUI_ConsortiaBossTaskItem {
		return <FUI_ConsortiaBossTaskItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaBossTaskItem"));
	}

	protected onConstruct():void {
		this.taskTitleTxt = <fgui.GTextField>(this.getChild("taskTitleTxt"));
		this.taskDescTxt = <fgui.GTextField>(this.getChild("taskDescTxt"));
		this.vgroup = <fgui.GGroup>(this.getChild("vgroup"));
	}
}