/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LuckyExchangeItem extends fgui.GComponent {

	public bg:fgui.GImage;
	public titleTxt:fgui.GRichTextField;
	public iconList:fgui.GList;
	public static URL:string = "ui://lzu8jcp27mu3ic1";

	public static createInstance():FUI_LuckyExchangeItem {
		return <FUI_LuckyExchangeItem>(fgui.UIPackage.createObject("Funny", "LuckyExchangeItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.titleTxt = <fgui.GRichTextField>(this.getChild("titleTxt"));
		this.iconList = <fgui.GList>(this.getChild("iconList"));
	}
}