// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SevenGoalsDayItem extends fgui.GButton {

	public lockStatus:fgui.Controller;
	public redStatus:fgui.Controller;
	public titleTxt:fgui.GTextField;
	public redDot:fgui.GLoader;
	public lockImg:fgui.GImage;
	public static URL:string = "ui://tctdlybezy3da";

	public static createInstance():FUI_SevenGoalsDayItem {
		return <FUI_SevenGoalsDayItem>(fgui.UIPackage.createObject("SevenTarget", "SevenGoalsDayItem"));
	}

	protected onConstruct():void {
		this.lockStatus = this.getController("lockStatus");
		this.redStatus = this.getController("redStatus");
		this.titleTxt = <fgui.GTextField>(this.getChild("titleTxt"));
		this.redDot = <fgui.GLoader>(this.getChild("redDot"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
	}
}