/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MarketBuyItem extends fgui.GComponent {

	public topCrol:fgui.Controller;
	public smllTopCrol:fgui.Controller;
	public bgline:fgui.GImage;
	public u1:fgui.GImage;
	public top:fgui.GTextField;
	public sellPriceLab:fgui.GTextField;
	public sellCountLab:fgui.GTextField;
	public static URL:string = "ui://50f8ewazav7sl";

	public static createInstance():FUI_MarketBuyItem {
		return <FUI_MarketBuyItem>(fgui.UIPackage.createObject("Market", "MarketBuyItem"));
	}

	protected onConstruct():void {
		this.topCrol = this.getController("topCrol");
		this.smllTopCrol = this.getController("smllTopCrol");
		this.bgline = <fgui.GImage>(this.getChild("bgline"));
		this.u1 = <fgui.GImage>(this.getChild("u1"));
		this.top = <fgui.GTextField>(this.getChild("top"));
		this.sellPriceLab = <fgui.GTextField>(this.getChild("sellPriceLab"));
		this.sellCountLab = <fgui.GTextField>(this.getChild("sellCountLab"));
	}
}