/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WishPoolView extends fgui.GComponent {

	public status:fgui.Controller;
	public typeList:fgui.GList;
	public descTxt1:fgui.GRichTextField;
	public descTxt2:fgui.GRichTextField;
	public wishPrecentBtn:fgui.GButton;
	public goodsList:fgui.GList;
	public countTxt:fgui.GTextField;
	public wishBtn:fgui.GButton;
	public wishDescTxt:fgui.GRichTextField;
	public luckWishBtn:fgui.GButton;
	public tipItem:fgui.GButton;
	public static URL:string = "ui://qcwdul6nhm0o33";

	public static createInstance():FUI_WishPoolView {
		return <FUI_WishPoolView>(fgui.UIPackage.createObject("Shop", "WishPoolView"));
	}

	protected onConstruct():void {
		this.status = this.getController("status");
		this.typeList = <fgui.GList>(this.getChild("typeList"));
		this.descTxt1 = <fgui.GRichTextField>(this.getChild("descTxt1"));
		this.descTxt2 = <fgui.GRichTextField>(this.getChild("descTxt2"));
		this.wishPrecentBtn = <fgui.GButton>(this.getChild("wishPrecentBtn"));
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
		this.countTxt = <fgui.GTextField>(this.getChild("countTxt"));
		this.wishBtn = <fgui.GButton>(this.getChild("wishBtn"));
		this.wishDescTxt = <fgui.GRichTextField>(this.getChild("wishDescTxt"));
		this.luckWishBtn = <fgui.GButton>(this.getChild("luckWishBtn"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
	}
}