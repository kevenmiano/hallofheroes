// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ExchangePoint extends fgui.GComponent {

	public list_shop:fgui.GList;
	public tipItem2:fgui.GButton;
	public txt_hasPoint:fgui.GTextField;
	public tipItem1:fgui.GButton;
	public txt_hasBindPoint:fgui.GTextField;
	public static URL:string = "ui://n1kaa5q9pvdvv";

	public static createInstance():FUI_ExchangePoint {
		return <FUI_ExchangePoint>(fgui.UIPackage.createObject("OutCityShop", "ExchangePoint"));
	}

	protected onConstruct():void {
		this.list_shop = <fgui.GList>(this.getChild("list_shop"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
		this.txt_hasPoint = <fgui.GTextField>(this.getChild("txt_hasPoint"));
		this.tipItem1 = <fgui.GButton>(this.getChild("tipItem1"));
		this.txt_hasBindPoint = <fgui.GTextField>(this.getChild("txt_hasBindPoint"));
	}
}