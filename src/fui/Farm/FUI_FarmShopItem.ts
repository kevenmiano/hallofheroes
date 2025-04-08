/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FarmShopItem extends fgui.GButton {

	public item:fgui.GButton;
	public txt_profit:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public tipItem:fgui.GButton;
	public txt_price:fgui.GTextField;
	public gCost:fgui.GGroup;
	public profitImg:fgui.GImage;
	public txt_time:fgui.GTextField;
	public txt_openDescible:fgui.GTextField;
	public static URL:string = "ui://rcqiz171gjr5ht1";

	public static createInstance():FUI_FarmShopItem {
		return <FUI_FarmShopItem>(fgui.UIPackage.createObject("Farm", "FarmShopItem"));
	}

	protected onConstruct():void {
		this.item = <fgui.GButton>(this.getChild("item"));
		this.txt_profit = <fgui.GTextField>(this.getChild("txt_profit"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
		this.txt_price = <fgui.GTextField>(this.getChild("txt_price"));
		this.gCost = <fgui.GGroup>(this.getChild("gCost"));
		this.profitImg = <fgui.GImage>(this.getChild("profitImg"));
		this.txt_time = <fgui.GTextField>(this.getChild("txt_time"));
		this.txt_openDescible = <fgui.GTextField>(this.getChild("txt_openDescible"));
	}
}