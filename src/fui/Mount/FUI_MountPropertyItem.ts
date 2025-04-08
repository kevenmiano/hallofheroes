// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MountPropertyItem extends fgui.GButton {

	public progressValue:fgui.GProgressBar;
	public titleNameTxt:fgui.GTextField;
	public additionTxt:fgui.GTextField;
	public nextAdditionTxt:fgui.GTextField;
	public static URL:string = "ui://b2almfghffix4";

	public static createInstance():FUI_MountPropertyItem {
		return <FUI_MountPropertyItem>(fgui.UIPackage.createObject("Mount", "MountPropertyItem"));
	}

	protected onConstruct():void {
		this.progressValue = <fgui.GProgressBar>(this.getChild("progressValue"));
		this.titleNameTxt = <fgui.GTextField>(this.getChild("titleNameTxt"));
		this.additionTxt = <fgui.GTextField>(this.getChild("additionTxt"));
		this.nextAdditionTxt = <fgui.GTextField>(this.getChild("nextAdditionTxt"));
	}
}