// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SevenTabListItem extends fgui.GButton {

	public c1:fgui.Controller;
	public red:fgui.Controller;
	public redDot:fgui.GLoader;
	public titleTxt:fgui.GTextField;
	public endTxt:fgui.GTextField;
	public static URL:string = "ui://tctdlybezy3db";

	public static createInstance():FUI_SevenTabListItem {
		return <FUI_SevenTabListItem>(fgui.UIPackage.createObject("SevenTarget", "SevenTabListItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.red = this.getController("red");
		this.redDot = <fgui.GLoader>(this.getChild("redDot"));
		this.titleTxt = <fgui.GTextField>(this.getChild("titleTxt"));
		this.endTxt = <fgui.GTextField>(this.getChild("endTxt"));
	}
}