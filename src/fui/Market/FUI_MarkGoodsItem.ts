/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MarkGoodsItem extends fgui.GComponent {

	public selectedCrl:fgui.Controller;
	public goodsItem:fgui.GButton;
	public sel:fgui.GImage;
	public static URL:string = "ui://50f8ewazdt3zh";

	public static createInstance():FUI_MarkGoodsItem {
		return <FUI_MarkGoodsItem>(fgui.UIPackage.createObject("Market", "MarkGoodsItem"));
	}

	protected onConstruct():void {
		this.selectedCrl = this.getController("selectedCrl");
		this.goodsItem = <fgui.GButton>(this.getChild("goodsItem"));
		this.sel = <fgui.GImage>(this.getChild("sel"));
	}
}