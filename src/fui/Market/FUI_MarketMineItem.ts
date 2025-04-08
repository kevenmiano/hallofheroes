/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_MarkGoodsItem from "./FUI_MarkGoodsItem";

export default class FUI_MarketMineItem extends fgui.GComponent {

	public typeCrol:fgui.Controller;
	public backCrol:fgui.Controller;
	public extCrol:fgui.Controller;
	public stateCrol:fgui.Controller;
	public b1:fgui.GImage;
	public b2:fgui.GImage;
	public selImg:fgui.GImage;
	public sellingTxt:fgui.GTextField;
	public selledTxt:fgui.GTextField;
	public buyedTxt:fgui.GTextField;
	public buyingTxt:fgui.GTextField;
	public cancelTxt:fgui.GTextField;
	public cancelingTxt:fgui.GTextField;
	public pushingTxt:fgui.GTextField;
	public priceLab:fgui.GTextField;
	public wpriceLab:fgui.GTextField;
	public bpriceTxt:fgui.GTextField;
	public bpriceLab:fgui.GTextField;
	public taxTxt:fgui.GTextField;
	public awaitImg:fgui.GImage;
	public cancelImg:fgui.GImage;
	public successImg:fgui.GImage;
	public getBtn:fgui.GButton;
	public cancelBtn:fgui.GButton;
	public u1:fgui.GImage;
	public u2:fgui.GImage;
	public u3:fgui.GImage;
	public mineItem:FUI_MarkGoodsItem;
	public wantItem:FUI_MarkGoodsItem;
	public static URL:string = "ui://50f8ewazdt3zf";

	public static createInstance():FUI_MarketMineItem {
		return <FUI_MarketMineItem>(fgui.UIPackage.createObject("Market", "MarketMineItem"));
	}

	protected onConstruct():void {
		this.typeCrol = this.getController("typeCrol");
		this.backCrol = this.getController("backCrol");
		this.extCrol = this.getController("extCrol");
		this.stateCrol = this.getController("stateCrol");
		this.b1 = <fgui.GImage>(this.getChild("b1"));
		this.b2 = <fgui.GImage>(this.getChild("b2"));
		this.selImg = <fgui.GImage>(this.getChild("selImg"));
		this.sellingTxt = <fgui.GTextField>(this.getChild("sellingTxt"));
		this.selledTxt = <fgui.GTextField>(this.getChild("selledTxt"));
		this.buyedTxt = <fgui.GTextField>(this.getChild("buyedTxt"));
		this.buyingTxt = <fgui.GTextField>(this.getChild("buyingTxt"));
		this.cancelTxt = <fgui.GTextField>(this.getChild("cancelTxt"));
		this.cancelingTxt = <fgui.GTextField>(this.getChild("cancelingTxt"));
		this.pushingTxt = <fgui.GTextField>(this.getChild("pushingTxt"));
		this.priceLab = <fgui.GTextField>(this.getChild("priceLab"));
		this.wpriceLab = <fgui.GTextField>(this.getChild("wpriceLab"));
		this.bpriceTxt = <fgui.GTextField>(this.getChild("bpriceTxt"));
		this.bpriceLab = <fgui.GTextField>(this.getChild("bpriceLab"));
		this.taxTxt = <fgui.GTextField>(this.getChild("taxTxt"));
		this.awaitImg = <fgui.GImage>(this.getChild("awaitImg"));
		this.cancelImg = <fgui.GImage>(this.getChild("cancelImg"));
		this.successImg = <fgui.GImage>(this.getChild("successImg"));
		this.getBtn = <fgui.GButton>(this.getChild("getBtn"));
		this.cancelBtn = <fgui.GButton>(this.getChild("cancelBtn"));
		this.u1 = <fgui.GImage>(this.getChild("u1"));
		this.u2 = <fgui.GImage>(this.getChild("u2"));
		this.u3 = <fgui.GImage>(this.getChild("u3"));
		this.mineItem = <FUI_MarkGoodsItem>(this.getChild("mineItem"));
		this.wantItem = <FUI_MarkGoodsItem>(this.getChild("wantItem"));
	}
}