/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PromotionItem extends fgui.GButton {

	public itemType:fgui.Controller;
	public frame:fgui.GImage;
	public titleIcon0:fgui.GImage;
	public titleIcon1:fgui.GImage;
	public titleIcon2:fgui.GImage;
	public titleIcon4:fgui.GImage;
	public itemTitle:fgui.GTextField;
	public limitCount:fgui.GRichTextField;
	public list:fgui.GList;
	public Btn_Buy:fgui.GButton;
	public txt_money:fgui.GTextField;
	public static URL:string = "ui://qcwdul6npvdv1n";

	public static createInstance():FUI_PromotionItem {
		return <FUI_PromotionItem>(fgui.UIPackage.createObject("Shop", "PromotionItem"));
	}

	protected onConstruct():void {
		this.itemType = this.getController("itemType");
		this.frame = <fgui.GImage>(this.getChild("frame"));
		this.titleIcon0 = <fgui.GImage>(this.getChild("titleIcon0"));
		this.titleIcon1 = <fgui.GImage>(this.getChild("titleIcon1"));
		this.titleIcon2 = <fgui.GImage>(this.getChild("titleIcon2"));
		this.titleIcon4 = <fgui.GImage>(this.getChild("titleIcon4"));
		this.itemTitle = <fgui.GTextField>(this.getChild("itemTitle"));
		this.limitCount = <fgui.GRichTextField>(this.getChild("limitCount"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.Btn_Buy = <fgui.GButton>(this.getChild("Btn_Buy"));
		this.txt_money = <fgui.GTextField>(this.getChild("txt_money"));
	}
}