/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MazeShopItem extends fgui.GButton {

	public state:fgui.Controller;
	public SelectedBg:fgui.GImage;
	public GoodsIcon:fgui.GLoader;
	public GoodsNameText:fgui.GTextField;
	public OpenDescibleTxt:fgui.GTextField;
	public tipItem:fgui.GButton;
	public GoodsPriceTxt:fgui.GTextField;
	public group_price:fgui.GGroup;
	public static URL:string = "ui://rzs7ldxjpxdef";

	public static createInstance():FUI_MazeShopItem {
		return <FUI_MazeShopItem>(fgui.UIPackage.createObject("Maze", "MazeShopItem"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.SelectedBg = <fgui.GImage>(this.getChild("SelectedBg"));
		this.GoodsIcon = <fgui.GLoader>(this.getChild("GoodsIcon"));
		this.GoodsNameText = <fgui.GTextField>(this.getChild("GoodsNameText"));
		this.OpenDescibleTxt = <fgui.GTextField>(this.getChild("OpenDescibleTxt"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
		this.GoodsPriceTxt = <fgui.GTextField>(this.getChild("GoodsPriceTxt"));
		this.group_price = <fgui.GGroup>(this.getChild("group_price"));
	}
}