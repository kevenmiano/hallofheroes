/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LimitShopView extends fgui.GComponent {

	public isGift:fgui.Controller;
	public c_discount:fgui.Controller;
	public list_shop:fgui.GList;
	public item:fgui.GButton;
	public item_gift:fgui.GLoader;
	public txt_describe:fgui.GTextField;
	public itemList:fgui.GList;
	public stepper:fgui.GComponent;
	public txt_desc:fgui.GComponent;
	public btn_buy:fgui.GButton;
	public btn_discount:fgui.GButton;
	public tipBtn2:fgui.GButton;
	public txt_price:fgui.GTextField;
	public txt_price2:fgui.GTextField;
	public txt_discount:fgui.GRichTextField;
	public cShape:fgui.GGraph;
	public txt_name:fgui.GTextField;
	public txt_limit_title:fgui.GRichTextField;
	public txt_limit:fgui.GRichTextField;
	public static URL:string = "ui://qcwdul6nh8a21f";

	public static createInstance():FUI_LimitShopView {
		return <FUI_LimitShopView>(fgui.UIPackage.createObject("Shop", "LimitShopView"));
	}

	protected onConstruct():void {
		this.isGift = this.getController("isGift");
		this.c_discount = this.getController("c_discount");
		this.list_shop = <fgui.GList>(this.getChild("list_shop"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.item_gift = <fgui.GLoader>(this.getChild("item_gift"));
		this.txt_describe = <fgui.GTextField>(this.getChild("txt_describe"));
		this.itemList = <fgui.GList>(this.getChild("itemList"));
		this.stepper = <fgui.GComponent>(this.getChild("stepper"));
		this.txt_desc = <fgui.GComponent>(this.getChild("txt_desc"));
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.btn_discount = <fgui.GButton>(this.getChild("btn_discount"));
		this.tipBtn2 = <fgui.GButton>(this.getChild("tipBtn2"));
		this.txt_price = <fgui.GTextField>(this.getChild("txt_price"));
		this.txt_price2 = <fgui.GTextField>(this.getChild("txt_price2"));
		this.txt_discount = <fgui.GRichTextField>(this.getChild("txt_discount"));
		this.cShape = <fgui.GGraph>(this.getChild("cShape"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_limit_title = <fgui.GRichTextField>(this.getChild("txt_limit_title"));
		this.txt_limit = <fgui.GRichTextField>(this.getChild("txt_limit"));
	}
}