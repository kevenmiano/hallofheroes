// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BoxItem extends fgui.GButton {

	public boxImg:fgui.GImage;
	public static URL:string = "ui://vw2db6boooxpi6q";

	public static createInstance():FUI_BoxItem {
		return <FUI_BoxItem>(fgui.UIPackage.createObject("Welfare", "BoxItem"));
	}

	protected onConstruct():void {
		this.boxImg = <fgui.GImage>(this.getChild("boxImg"));
	}
}