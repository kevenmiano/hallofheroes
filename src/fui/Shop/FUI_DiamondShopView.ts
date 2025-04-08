/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DiamondShopView extends fgui.GComponent {

	public usebind:fgui.Controller;
	public c_discount:fgui.Controller;
	public item:fgui.GButton;
	public txt_desc:fgui.GComponent;
	public stepper:fgui.GComponent;
	public btn_buy:fgui.GButton;
	public checkbox_useBind:fgui.GButton;
	public btn_discount:fgui.GButton;
	public list_shop:fgui.GList;
	public tipBtn:fgui.GButton;
	public txt_price:fgui.GTextField;
	public txt_price2:fgui.GTextField;
	public txt_discount:fgui.GRichTextField;
	public cShape:fgui.GGraph;
	public txt_name:fgui.GTextField;
	public txt_hasNum:fgui.GTextField;
	public txt_limit_type:fgui.GTextField;
	public txt_limit:fgui.GRichTextField;
	public static URL:string = "ui://qcwdul6nyupvk";

	public static createInstance():FUI_DiamondShopView {
		return <FUI_DiamondShopView>(fgui.UIPackage.createObject("Shop", "DiamondShopView"));
	}

	protected onConstruct():void {
		this.usebind = this.getController("usebind");
		this.c_discount = this.getController("c_discount");
		this.item = <fgui.GButton>(this.getChild("item"));
		this.txt_desc = <fgui.GComponent>(this.getChild("txt_desc"));
		this.stepper = <fgui.GComponent>(this.getChild("stepper"));
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.checkbox_useBind = <fgui.GButton>(this.getChild("checkbox_useBind"));
		this.btn_discount = <fgui.GButton>(this.getChild("btn_discount"));
		this.list_shop = <fgui.GList>(this.getChild("list_shop"));
		this.tipBtn = <fgui.GButton>(this.getChild("tipBtn"));
		this.txt_price = <fgui.GTextField>(this.getChild("txt_price"));
		this.txt_price2 = <fgui.GTextField>(this.getChild("txt_price2"));
		this.txt_discount = <fgui.GRichTextField>(this.getChild("txt_discount"));
		this.cShape = <fgui.GGraph>(this.getChild("cShape"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_hasNum = <fgui.GTextField>(this.getChild("txt_hasNum"));
		this.txt_limit_type = <fgui.GTextField>(this.getChild("txt_limit_type"));
		this.txt_limit = <fgui.GRichTextField>(this.getChild("txt_limit"));
	}
}