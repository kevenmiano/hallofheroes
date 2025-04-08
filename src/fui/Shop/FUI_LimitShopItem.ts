// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LimitShopItem extends fgui.GButton {

	public isFree:fgui.Controller;
	public isGift:fgui.Controller;
	public item:fgui.GButton;
	public item_gift:fgui.GLoader;
	public img_free:fgui.GImage;
	public img_discount:fgui.GImage;
	public txt_discount:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public tipBtn:fgui.GButton;
	public txt_price:fgui.GTextField;
	public Img_TimeLimit:fgui.GImage;
	public txt_timelimit:fgui.GTextField;
	public static URL:string = "ui://qcwdul6nv1ai1g";

	public static createInstance():FUI_LimitShopItem {
		return <FUI_LimitShopItem>(fgui.UIPackage.createObject("Shop", "LimitShopItem"));
	}

	protected onConstruct():void {
		this.isFree = this.getController("isFree");
		this.isGift = this.getController("isGift");
		this.item = <fgui.GButton>(this.getChild("item"));
		this.item_gift = <fgui.GLoader>(this.getChild("item_gift"));
		this.img_free = <fgui.GImage>(this.getChild("img_free"));
		this.img_discount = <fgui.GImage>(this.getChild("img_discount"));
		this.txt_discount = <fgui.GTextField>(this.getChild("txt_discount"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.tipBtn = <fgui.GButton>(this.getChild("tipBtn"));
		this.txt_price = <fgui.GTextField>(this.getChild("txt_price"));
		this.Img_TimeLimit = <fgui.GImage>(this.getChild("Img_TimeLimit"));
		this.txt_timelimit = <fgui.GTextField>(this.getChild("txt_timelimit"));
	}
}