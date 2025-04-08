// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PveSecretFBItem extends fgui.GButton {

	public select:fgui.GImage;
	public txtRecord:fgui.GRichTextField;
	public gRecord:fgui.GGroup;
	public txtPass:fgui.GTextField;
	public gPass:fgui.GGroup;
	public static URL:string = "ui://7t5c17fjvtoeri";

	public static createInstance():FUI_PveSecretFBItem {
		return <FUI_PveSecretFBItem>(fgui.UIPackage.createObject("PveSecret", "PveSecretFBItem"));
	}

	protected onConstruct():void {
		this.select = <fgui.GImage>(this.getChild("select"));
		this.txtRecord = <fgui.GRichTextField>(this.getChild("txtRecord"));
		this.gRecord = <fgui.GGroup>(this.getChild("gRecord"));
		this.txtPass = <fgui.GTextField>(this.getChild("txtPass"));
		this.gPass = <fgui.GGroup>(this.getChild("gPass"));
	}
}