// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MonthCardView extends fgui.GComponent {

	public title_bg:fgui.GImage;
	public dot:fgui.GImage;
	public descTxt:fgui.GTextField;
	public list:fgui.GList;
	public static URL:string = "ui://vw2db6bov2103i";

	public static createInstance():FUI_MonthCardView {
		return <FUI_MonthCardView>(fgui.UIPackage.createObject("Welfare", "MonthCardView"));
	}

	protected onConstruct():void {
		this.title_bg = <fgui.GImage>(this.getChild("title_bg"));
		this.dot = <fgui.GImage>(this.getChild("dot"));
		this.descTxt = <fgui.GTextField>(this.getChild("descTxt"));
		this.list = <fgui.GList>(this.getChild("list"));
	}
}