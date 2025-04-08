// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MazeShopItemII extends fgui.GButton {

	public state:fgui.Controller;
	public SelectedBg:fgui.GImage;
	public GoodsIcon:fgui.GButton;
	public GoodsNameText:fgui.GTextField;
	public OpenDescibleTxt:fgui.GTextField;
	public tipItem:fgui.GButton;
	public GoodsPriceTxt:fgui.GTextField;
	public group_price:fgui.GGroup;
	public static URL:string = "ui://qcwdul6nu4yv2w";

	public static createInstance():FUI_MazeShopItemII {
		return <FUI_MazeShopItemII>(fgui.UIPackage.createObject("Shop", "MazeShopItemII"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.SelectedBg = <fgui.GImage>(this.getChild("SelectedBg"));
		this.GoodsIcon = <fgui.GButton>(this.getChild("GoodsIcon"));
		this.GoodsNameText = <fgui.GTextField>(this.getChild("GoodsNameText"));
		this.OpenDescibleTxt = <fgui.GTextField>(this.getChild("OpenDescibleTxt"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
		this.GoodsPriceTxt = <fgui.GTextField>(this.getChild("GoodsPriceTxt"));
		this.group_price = <fgui.GGroup>(this.getChild("group_price"));
	}
}