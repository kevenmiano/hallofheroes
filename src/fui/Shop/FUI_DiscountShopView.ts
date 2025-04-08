/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ShopDiscountScoreItem from "./FUI_ShopDiscountScoreItem";
import FUI_ComDiscountShopText from "./FUI_ComDiscountShopText";
import FUI_ComDiscountShopTextMC from "./FUI_ComDiscountShopTextMC";

export default class FUI_DiscountShopView extends fgui.GComponent {

	public cIsOverSea:fgui.Controller;
	public imgFrame:fgui.GImage;
	public goodList:fgui.GList;
	public imgScoreLine0:fgui.GImage;
	public imgScoreLine1:fgui.GImage;
	public imgScoreLine2:fgui.GImage;
	public imgScoreLine3:fgui.GImage;
	public imgScoreLine4:fgui.GImage;
	public scoreItem0:FUI_ShopDiscountScoreItem;
	public scoreItem1:FUI_ShopDiscountScoreItem;
	public scoreItem2:FUI_ShopDiscountScoreItem;
	public scoreItem3:FUI_ShopDiscountScoreItem;
	public scoreItem4:FUI_ShopDiscountScoreItem;
	public gScoreList:fgui.GGroup;
	public txt_title11:fgui.GTextField;
	public txt_title10:fgui.GTextField;
	public txt_title21:fgui.GTextField;
	public txt_title20:fgui.GTextField;
	public txt_myDiscountDesc1:fgui.GTextField;
	public txt_myDiscountDescOverSea:FUI_ComDiscountShopText;
	public txt_myDiscountDesc:FUI_ComDiscountShopText;
	public txtMyDiscount:FUI_ComDiscountShopText;
	public mcMyDiscount:FUI_ComDiscountShopTextMC;
	public txt_myScoreDesc:fgui.GTextField;
	public txt_myScore:fgui.GTextField;
	public txt_timeDesc:fgui.GTextField;
	public txt_time:fgui.GTextField;
	public txt_resetTip:fgui.GTextField;
	public btnRandom:fgui.GButton;
	public static URL:string = "ui://qcwdul6nzeof1s";

	public static createInstance():FUI_DiscountShopView {
		return <FUI_DiscountShopView>(fgui.UIPackage.createObject("Shop", "DiscountShopView"));
	}

	protected onConstruct():void {
		this.cIsOverSea = this.getController("cIsOverSea");
		this.imgFrame = <fgui.GImage>(this.getChild("imgFrame"));
		this.goodList = <fgui.GList>(this.getChild("goodList"));
		this.imgScoreLine0 = <fgui.GImage>(this.getChild("imgScoreLine0"));
		this.imgScoreLine1 = <fgui.GImage>(this.getChild("imgScoreLine1"));
		this.imgScoreLine2 = <fgui.GImage>(this.getChild("imgScoreLine2"));
		this.imgScoreLine3 = <fgui.GImage>(this.getChild("imgScoreLine3"));
		this.imgScoreLine4 = <fgui.GImage>(this.getChild("imgScoreLine4"));
		this.scoreItem0 = <FUI_ShopDiscountScoreItem>(this.getChild("scoreItem0"));
		this.scoreItem1 = <FUI_ShopDiscountScoreItem>(this.getChild("scoreItem1"));
		this.scoreItem2 = <FUI_ShopDiscountScoreItem>(this.getChild("scoreItem2"));
		this.scoreItem3 = <FUI_ShopDiscountScoreItem>(this.getChild("scoreItem3"));
		this.scoreItem4 = <FUI_ShopDiscountScoreItem>(this.getChild("scoreItem4"));
		this.gScoreList = <fgui.GGroup>(this.getChild("gScoreList"));
		this.txt_title11 = <fgui.GTextField>(this.getChild("txt_title11"));
		this.txt_title10 = <fgui.GTextField>(this.getChild("txt_title10"));
		this.txt_title21 = <fgui.GTextField>(this.getChild("txt_title21"));
		this.txt_title20 = <fgui.GTextField>(this.getChild("txt_title20"));
		this.txt_myDiscountDesc1 = <fgui.GTextField>(this.getChild("txt_myDiscountDesc1"));
		this.txt_myDiscountDescOverSea = <FUI_ComDiscountShopText>(this.getChild("txt_myDiscountDescOverSea"));
		this.txt_myDiscountDesc = <FUI_ComDiscountShopText>(this.getChild("txt_myDiscountDesc"));
		this.txtMyDiscount = <FUI_ComDiscountShopText>(this.getChild("txtMyDiscount"));
		this.mcMyDiscount = <FUI_ComDiscountShopTextMC>(this.getChild("mcMyDiscount"));
		this.txt_myScoreDesc = <fgui.GTextField>(this.getChild("txt_myScoreDesc"));
		this.txt_myScore = <fgui.GTextField>(this.getChild("txt_myScore"));
		this.txt_timeDesc = <fgui.GTextField>(this.getChild("txt_timeDesc"));
		this.txt_time = <fgui.GTextField>(this.getChild("txt_time"));
		this.txt_resetTip = <fgui.GTextField>(this.getChild("txt_resetTip"));
		this.btnRandom = <fgui.GButton>(this.getChild("btnRandom"));
	}
}