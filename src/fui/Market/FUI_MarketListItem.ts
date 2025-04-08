/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_MarkGoodsItem from "./FUI_MarkGoodsItem";

export default class FUI_MarketListItem extends fgui.GComponent {

	public b1:fgui.GLoader;
	public b2:fgui.GImage;
	public selImg:fgui.GImage;
	public diamondTip:fgui.GButton;
	public goodsItem:FUI_MarkGoodsItem;
	public goodsLab:fgui.GTextField;
	public countLab:fgui.GTextField;
	public priceLab:fgui.GTextField;
	public static URL:string = "ui://50f8ewazdt3ze";

	public static createInstance():FUI_MarketListItem {
		return <FUI_MarketListItem>(fgui.UIPackage.createObject("Market", "MarketListItem"));
	}

	protected onConstruct():void {
		this.b1 = <fgui.GLoader>(this.getChild("b1"));
		this.b2 = <fgui.GImage>(this.getChild("b2"));
		this.selImg = <fgui.GImage>(this.getChild("selImg"));
		this.diamondTip = <fgui.GButton>(this.getChild("diamondTip"));
		this.goodsItem = <FUI_MarkGoodsItem>(this.getChild("goodsItem"));
		this.goodsLab = <fgui.GTextField>(this.getChild("goodsLab"));
		this.countLab = <fgui.GTextField>(this.getChild("countLab"));
		this.priceLab = <fgui.GTextField>(this.getChild("priceLab"));
	}
}