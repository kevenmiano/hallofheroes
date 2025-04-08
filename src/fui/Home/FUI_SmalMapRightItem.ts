/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SmalMapRightItem extends fgui.GButton {

	public nameTxt:fgui.GRichTextField;
	public tyepTxt:fgui.GRichTextField;
	public selectedBg:fgui.GImage;
	public static URL:string = "ui://tny43dz15pmg56";

	public static createInstance():FUI_SmalMapRightItem {
		return <FUI_SmalMapRightItem>(fgui.UIPackage.createObject("Home", "SmalMapRightItem"));
	}

	protected onConstruct():void {
		this.nameTxt = <fgui.GRichTextField>(this.getChild("nameTxt"));
		this.tyepTxt = <fgui.GRichTextField>(this.getChild("tyepTxt"));
		this.selectedBg = <fgui.GImage>(this.getChild("selectedBg"));
	}
}