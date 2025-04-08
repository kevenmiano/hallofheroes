// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DegreeActivityBox extends fgui.GButton {

	public effect:fgui.Controller;
	public isWeek:fgui.Controller;
	public iconBox:fgui.GLoader;
	public activityIcon:fgui.GImage;
	public count:fgui.GTextField;
	public static URL:string = "ui://vw2db6bov2103q";

	public static createInstance():FUI_DegreeActivityBox {
		return <FUI_DegreeActivityBox>(fgui.UIPackage.createObject("Welfare", "DegreeActivityBox"));
	}

	protected onConstruct():void {
		this.effect = this.getController("effect");
		this.isWeek = this.getController("isWeek");
		this.iconBox = <fgui.GLoader>(this.getChild("iconBox"));
		this.activityIcon = <fgui.GImage>(this.getChild("activityIcon"));
		this.count = <fgui.GTextField>(this.getChild("count"));
	}
}