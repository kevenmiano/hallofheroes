/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AcivityTypeCom extends fgui.GComponent {

	public itemList:fgui.GList;
	public img3:fgui.GImage;
	public img5:fgui.GImage;
	public img6:fgui.GImage;
	public timeDescTxt:fgui.GTextField;
	public static URL:string = "ui://vw2db6boubio9mieo";

	public static createInstance():FUI_AcivityTypeCom {
		return <FUI_AcivityTypeCom>(fgui.UIPackage.createObject("Welfare", "AcivityTypeCom"));
	}

	protected onConstruct():void {
		this.itemList = <fgui.GList>(this.getChild("itemList"));
		this.img3 = <fgui.GImage>(this.getChild("img3"));
		this.img5 = <fgui.GImage>(this.getChild("img5"));
		this.img6 = <fgui.GImage>(this.getChild("img6"));
		this.timeDescTxt = <fgui.GTextField>(this.getChild("timeDescTxt"));
	}
}