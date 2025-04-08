// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ShopDiscountGoodItem extends fgui.GButton {

	public cCanBuy:fgui.Controller;
	public frame:fgui.GImage;
	public item:fgui.GButton;
	public txtLimit:fgui.GTextField;
	public imgPurchased:fgui.GImage;
	public txtOriginalPriceDesc:fgui.GTextField;
	public tipBtn1:fgui.GButton;
	public txtOriginalPrice:fgui.GTextField;
	public btnBuy:fgui.GButton;
	public txtCurrentPrice:fgui.GTextField;
	public tipBtn2:fgui.GButton;
	public gBuy:fgui.GGroup;
	public static URL:string = "ui://qcwdul6nzeof1t";

	public static createInstance():FUI_ShopDiscountGoodItem {
		return <FUI_ShopDiscountGoodItem>(fgui.UIPackage.createObject("Shop", "ShopDiscountGoodItem"));
	}

	protected onConstruct():void {
		this.cCanBuy = this.getController("cCanBuy");
		this.frame = <fgui.GImage>(this.getChild("frame"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.txtLimit = <fgui.GTextField>(this.getChild("txtLimit"));
		this.imgPurchased = <fgui.GImage>(this.getChild("imgPurchased"));
		this.txtOriginalPriceDesc = <fgui.GTextField>(this.getChild("txtOriginalPriceDesc"));
		this.tipBtn1 = <fgui.GButton>(this.getChild("tipBtn1"));
		this.txtOriginalPrice = <fgui.GTextField>(this.getChild("txtOriginalPrice"));
		this.btnBuy = <fgui.GButton>(this.getChild("btnBuy"));
		this.txtCurrentPrice = <fgui.GTextField>(this.getChild("txtCurrentPrice"));
		this.tipBtn2 = <fgui.GButton>(this.getChild("tipBtn2"));
		this.gBuy = <fgui.GGroup>(this.getChild("gBuy"));
	}
}