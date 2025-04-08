/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BuyHpItem extends fgui.GComponent {

	public bg:fgui.GImage;
	public goldIcon:fgui.GImage;
	public pointIcon:fgui.GImage;
	public goodsIcon:fgui.GButton;
	public Btn_buy:fgui.GButton;
	public goodsNameTxt:fgui.GTextField;
	public priceTxt:fgui.GTextField;
	public txt_own:fgui.GTextField;
	public static URL:string = "ui://tny43dz15pmg52";

	public static createInstance():FUI_BuyHpItem {
		return <FUI_BuyHpItem>(fgui.UIPackage.createObject("Home", "BuyHpItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.goldIcon = <fgui.GImage>(this.getChild("goldIcon"));
		this.pointIcon = <fgui.GImage>(this.getChild("pointIcon"));
		this.goodsIcon = <fgui.GButton>(this.getChild("goodsIcon"));
		this.Btn_buy = <fgui.GButton>(this.getChild("Btn_buy"));
		this.goodsNameTxt = <fgui.GTextField>(this.getChild("goodsNameTxt"));
		this.priceTxt = <fgui.GTextField>(this.getChild("priceTxt"));
		this.txt_own = <fgui.GTextField>(this.getChild("txt_own"));
	}
}